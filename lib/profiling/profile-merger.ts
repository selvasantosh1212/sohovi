/**
 * profile-merger.ts
 *
 * Merges N ColumnProfile arrays (one per chunk) into a single ColumnProfile[].
 * Called after bulk-file.worker completes all chunk profiles.
 * Pure function — no side effects, no workers.
 */

import type {
  ColumnProfile,
  DetectedDateFormat,
  InferredType,
  PatternEntry,
  ValueFreq,
} from "@/types/profiling.types";

// More specific types rank higher; ties prefer specificity over generality
const TYPE_SPECIFICITY: Record<InferredType, number> = {
  email: 9,
  phone: 9,
  uuid: 9,
  url: 8,
  integer: 7,
  float: 7,
  boolean: 6,
  date: 5,
  datetime: 5,
  json: 4,
  string: 2,
  mixed: 1,
};

function mostSpecificType(types: InferredType[]): InferredType {
  return types.reduce<InferredType>(
    (best, t) => ((TYPE_SPECIFICITY[t] ?? 0) > (TYPE_SPECIFICITY[best] ?? 0) ? t : best),
    types[0]
  );
}

function mergeMinValue(chunks: ColumnProfile[]): string | null {
  const mins = chunks.map((c) => c.min_value).filter((v): v is string => v !== null);
  if (mins.length === 0) return null;
  const nums = mins.map((v) => parseFloat(v)).filter((n) => !isNaN(n));
  if (nums.length === mins.length) return String(Math.min(...nums));
  return [...mins].sort()[0];
}

function mergeMaxValue(chunks: ColumnProfile[]): string | null {
  const maxes = chunks.map((c) => c.max_value).filter((v): v is string => v !== null);
  if (maxes.length === 0) return null;
  const nums = maxes.map((v) => parseFloat(v)).filter((n) => !isNaN(n));
  if (nums.length === maxes.length) return String(Math.max(...nums));
  return [...maxes].sort().pop() ?? null;
}

function buildMergedFreqMap(chunks: ColumnProfile[]): Map<string, number> {
  const merged = new Map<string, number>();
  for (const chunk of chunks) {
    for (const { value, count } of chunk.value_frequency) {
      merged.set(value, (merged.get(value) ?? 0) + count);
    }
  }
  return merged;
}

function toValueFreq(entries: [string, number][], totalRows: number): ValueFreq[] {
  return entries.map(([value, count]) => ({
    value,
    count,
    pct: Math.round((count / totalRows) * 10000) / 100,
  }));
}

function mergePatterns(chunks: ColumnProfile[], totalRows: number): PatternEntry[] {
  const merged = new Map<string, number>();
  for (const chunk of chunks) {
    for (const { pattern, count } of chunk.pattern_summary) {
      merged.set(pattern, (merged.get(pattern) ?? 0) + count);
    }
  }
  return [...merged.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([pattern, count]) => ({
      pattern,
      count,
      pct: Math.round((count / totalRows) * 10000) / 100,
    }));
}

function mergeDateFormats(chunks: ColumnProfile[]): DetectedDateFormat[] | null {
  const all = chunks.flatMap((c) => c.detected_date_formats ?? []);
  if (all.length === 0) return null;
  const byFormat = new Map<string, DetectedDateFormat>();
  for (const fmt of all) {
    const existing = byFormat.get(fmt.format);
    if (!existing || fmt.confidence > existing.confidence) {
      byFormat.set(fmt.format, fmt);
    }
  }
  return [...byFormat.values()].sort((a, b) => b.confidence - a.confidence);
}

function mergeColumnProfile(chunks: ColumnProfile[]): ColumnProfile {
  const totalRows = chunks.reduce((s, c) => s + c.row_count, 0);
  const totalNulls = chunks.reduce((s, c) => s + c.null_count, 0);

  // Frequency maps for unique count + top/bottom values
  const freqMap = buildMergedFreqMap(chunks);
  const uniqueCount = freqMap.size;
  const sortedDesc = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
  const sortedAsc = [...freqMap.entries()].sort((a, b) => a[1] - b[1]);

  const topValues = toValueFreq(sortedDesc.slice(0, 20), totalRows);
  const bottomValues = toValueFreq(sortedAsc.slice(0, 5), totalRows);
  const valueFrequency = topValues;

  // Numeric stats: weighted mean + parallel variance formula
  const numericChunks = chunks.filter((c) => c.avg_value !== null);
  let avgValue: number | null = null;
  let stdDev: number | null = null;

  if (numericChunks.length > 0) {
    const nonNullCounts = numericChunks.map((c) => c.row_count - c.null_count);
    const totalNonNull = nonNullCounts.reduce((s, n) => s + n, 0);

    if (totalNonNull > 0) {
      const weightedSum = numericChunks.reduce(
        (s, c, i) => s + c.avg_value! * nonNullCounts[i],
        0
      );
      avgValue = weightedSum / totalNonNull;

      // Parallel variance: Var = Σ(n_i × (var_i + (mean_i − μ)²)) / n_total
      const combinedVar =
        numericChunks.reduce((s, c, i) => {
          const varI = (c.std_dev ?? 0) ** 2;
          return s + nonNullCounts[i] * (varI + (c.avg_value! - avgValue!) ** 2);
        }, 0) / totalNonNull;

      stdDev = Math.round(Math.sqrt(combinedVar) * 1000) / 1000;
      avgValue = Math.round(avgValue * 1000) / 1000;
    }
  }

  // String length stats
  const lenChunks = chunks.filter((c) => c.avg_length !== null);
  let avgLength: number | null = null;
  let minLength: number | null = null;
  let maxLength: number | null = null;

  if (lenChunks.length > 0) {
    minLength = Math.min(...lenChunks.map((c) => c.min_length ?? Infinity));
    maxLength = Math.max(...lenChunks.map((c) => c.max_length ?? -Infinity));
    const totalNonNull = lenChunks.reduce((s, c) => s + (c.row_count - c.null_count), 0);
    if (totalNonNull > 0) {
      avgLength =
        Math.round(
          (lenChunks.reduce((s, c) => s + c.avg_length! * (c.row_count - c.null_count), 0) /
            totalNonNull) *
            10
        ) / 10;
    }
  }

  // Outliers
  const outlierCount = chunks.reduce((s, c) => s + c.outlier_count, 0);
  const outlierValues = chunks.flatMap((c) => c.outlier_values).slice(0, 50);

  // PII — any chunk detection wins
  const piiDetected = chunks.some((c) => c.pii_detected);
  const piiType = chunks.find((c) => c.pii_type !== null)?.pii_type ?? null;

  return {
    column_name: chunks[0].column_name,
    inferred_type: mostSpecificType(chunks.map((c) => c.inferred_type)),
    row_count: totalRows,
    null_count: totalNulls,
    null_pct: totalRows > 0 ? Math.round((totalNulls / totalRows) * 10000) / 100 : 0,
    unique_count: uniqueCount,
    unique_pct: totalRows > 0 ? Math.round((uniqueCount / totalRows) * 10000) / 100 : 0,
    min_value: mergeMinValue(chunks),
    max_value: mergeMaxValue(chunks),
    avg_value: avgValue,
    std_dev: stdDev,
    min_length: minLength === Infinity ? null : minLength,
    max_length: maxLength === -Infinity ? null : maxLength,
    avg_length: avgLength,
    top_values: topValues,
    bottom_values: bottomValues,
    value_frequency: valueFrequency,
    pattern_summary: mergePatterns(chunks, totalRows),
    pii_detected: piiDetected,
    pii_type: piiType,
    outlier_count: outlierCount,
    outlier_values: outlierValues,
    sample_values: chunks[0].sample_values,
    detected_date_formats: mergeDateFormats(chunks),
  };
}

/**
 * Merge N sets of column profiles (one per chunk) into a single profile array.
 * chunkProfiles[chunkIndex][columnIndex] → ColumnProfile
 */
export function mergeColumnProfiles(chunkProfiles: ColumnProfile[][]): ColumnProfile[] {
  if (chunkProfiles.length === 0) return [];
  if (chunkProfiles.length === 1) return chunkProfiles[0];

  const colCount = chunkProfiles[0].length;
  return Array.from({ length: colCount }, (_, colIdx) => {
    const chunks = chunkProfiles.map((cp) => cp[colIdx]);
    return mergeColumnProfile(chunks);
  });
}
