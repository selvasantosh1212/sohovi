/**
 * profile-merger.ts
 *
 * Merges N per-chunk profiling results (one per bulk-file chunk) into a
 * single ColumnProfile[]. Called after bulk-file.worker completes all chunk
 * profiles. Pure function — no side effects, no workers.
 *
 * Each chunk result carries its own mergeable sketch state (HyperLogLog +
 * t-digest, see lib/profiling/sketches) alongside its plain ColumnProfile.
 * Sketches are unioned here to recover accurate dataset-wide cardinality and
 * quantile estimates without re-scanning raw values — this matters because
 * an individual chunk easily exceeds the exact-cardinality cap on its own
 * (e.g. a 500k-row chunk of a near-unique ID column), so summing per-chunk
 * exact counts would double-count and summing per-chunk HLL estimates would
 * over-count values that repeat across chunk boundaries.
 */

import type {
  ColumnProfile,
  DetectedDateFormat,
  InferredType,
  PatternEntry,
  ValueFreq,
} from "@/types/profiling.types";
import { mergeSketchStates, iqrBounds, type ColumnSketchState } from "./sketches";

export interface ChunkColumnResult {
  profile: ColumnProfile;
  sketches: ColumnSketchState;
}

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

function mergeMinValue(profiles: ColumnProfile[]): string | null {
  const mins = profiles.map((c) => c.min_value).filter((v): v is string => v !== null);
  if (mins.length === 0) return null;
  const nums = mins.map((v) => parseFloat(v)).filter((n) => !isNaN(n));
  if (nums.length === mins.length) return String(Math.min(...nums));
  return [...mins].sort()[0];
}

function mergeMaxValue(profiles: ColumnProfile[]): string | null {
  const maxes = profiles.map((c) => c.max_value).filter((v): v is string => v !== null);
  if (maxes.length === 0) return null;
  const nums = maxes.map((v) => parseFloat(v)).filter((n) => !isNaN(n));
  if (nums.length === maxes.length) return String(Math.max(...nums));
  return [...maxes].sort().pop() ?? null;
}

function buildMergedFreqMap(profiles: ColumnProfile[]): Map<string, number> {
  const merged = new Map<string, number>();
  for (const p of profiles) {
    for (const { value, count } of p.value_frequency) {
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

function mergePatterns(profiles: ColumnProfile[], totalRows: number): PatternEntry[] {
  const merged = new Map<string, number>();
  for (const p of profiles) {
    for (const { pattern, count } of p.pattern_summary) {
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

function mergeDateFormats(profiles: ColumnProfile[]): DetectedDateFormat[] | null {
  const all = profiles.flatMap((c) => c.detected_date_formats ?? []);
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

/** Merged unique_count — exact when every chunk stayed under the exact-count
 *  cap, otherwise a HyperLogLog union (accurate even when individual chunks
 *  approximated independently, since the union sees every distinct value
 *  exactly once regardless of which chunk it appeared in). */
function mergeUniqueCount(
  results: ChunkColumnResult[],
  totalRows: number
): { uniqueCount: number; uniquePct: number; approximate: boolean } {
  const anyApproximate = results.some((r) => r.profile.unique_count_approximate);

  if (!anyApproximate) {
    const freqMap = buildMergedFreqMap(results.map((r) => r.profile));
    const uniqueCount = freqMap.size;
    return {
      uniqueCount,
      uniquePct: totalRows > 0 ? Math.round((uniqueCount / totalRows) * 10000) / 100 : 0,
      approximate: false,
    };
  }

  const merged = mergeSketchStates(results.map((r) => r.sketches));
  const uniqueCount = Math.round(merged.hll.count());
  return {
    uniqueCount,
    uniquePct: totalRows > 0 ? Math.round((uniqueCount / totalRows) * 10000) / 100 : 0,
    approximate: true,
  };
}

/**
 * Merged outlier count/values — sums each chunk's own *exact* IQR-flagged
 * count (computed in calcNumericStats by filtering that chunk's raw values
 * against that chunk's own t-digest bounds), rather than re-deriving a count
 * from the unioned t-digest's CDF at merge time.
 *
 * This was deliberately NOT implemented as a CDF query against the merged
 * digest, after testing showed it can be unreliable: when a tiny sliver of
 * far-away outliers (e.g. 0.002% of rows) sits well outside the main
 * cluster, the merged digest's tail centroids can blend a few real
 * boundary values together with the sparse outlier cluster into one
 * centroid with a mean that no actual value is near — which corrupts CDF
 * lookups right at the IQR boundary (measured 100x overcounts in testing).
 * Each chunk is itself up to 500k rows — large enough that per-chunk IQR
 * bounds closely track the true dataset-wide bounds for any realistically
 * behaved column — so summing exact per-chunk counts is both simpler and
 * more robust than trusting the digest at its least reliable point.
 */
function mergeOutliers(
  numericProfiles: ColumnProfile[]
): { outlierCount: number; outlierValues: number[]; outlierMethod: "iqr" | "zscore" | undefined } {
  if (numericProfiles.length === 0) {
    return { outlierCount: 0, outlierValues: [], outlierMethod: undefined };
  }

  const outlierCount = numericProfiles.reduce((s, p) => s + p.outlier_count, 0);
  const outlierValues = numericProfiles.flatMap((p) => p.outlier_values).slice(0, 50);
  const outlierMethod = numericProfiles.some((p) => p.outlier_method === "iqr") ? "iqr" : "zscore";

  return { outlierCount, outlierValues, outlierMethod };
}

/**
 * Merged duplicate stats — unions each chunk's own value_frequency (top 20)
 * with its duplicate_values (top 50 repeated values), then sums counts for
 * the same value across chunks. This mirrors the existing top_values merge
 * strategy (see comment above buildMergedFreqMap): a value that's frequent
 * enough to matter will show up in one of these per-chunk lists, so the
 * merged result stays accurate for the duplicates that are actually worth
 * surfacing, even though it isn't a re-scan of every raw value.
 */
function mergeDuplicates(
  profiles: ColumnProfile[],
  totalRows: number
): { duplicateValueCount: number; duplicateRowCount: number; duplicateValues: ValueFreq[]; duplicatesApproximate: boolean } {
  const merged = new Map<string, number>();
  for (const p of profiles) {
    const perChunk = new Map<string, number>();
    for (const { value, count } of p.value_frequency) perChunk.set(value, count);
    for (const { value, count } of p.duplicate_values ?? []) perChunk.set(value, count);
    for (const [value, count] of perChunk) {
      merged.set(value, (merged.get(value) ?? 0) + count);
    }
  }

  const dupes = [...merged.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  return {
    duplicateValueCount: dupes.length,
    duplicateRowCount: dupes.reduce((s, [, count]) => s + (count - 1), 0),
    duplicateValues: toValueFreq(dupes.slice(0, 50), totalRows),
    duplicatesApproximate: profiles.some((p) => p.unique_count_approximate || p.duplicates_approximate),
  };
}

/** Merged outlier bounds — IQR bounds from the unioned t-digest when available
 *  (mirrors how outlier counts/values are computed per-chunk), else mean ± 3σ
 *  from the already-merged avg/std. */
function mergeOutlierBounds(
  results: ChunkColumnResult[],
  avgValue: number | null,
  stdDev: number | null
): { lower: number; upper: number } | null {
  const merged = mergeSketchStates(results.map((r) => r.sketches));
  if (merged.tdigest) {
    const bounds = iqrBounds(merged.tdigest);
    if (bounds) return { lower: bounds.lower, upper: bounds.upper };
  }
  if (avgValue !== null && stdDev !== null && stdDev > 0) {
    return { lower: avgValue - 3 * stdDev, upper: avgValue + 3 * stdDev };
  }
  return null;
}

function mergeColumnProfile(results: ChunkColumnResult[]): ColumnProfile {
  const profiles = results.map((r) => r.profile);
  const totalRows = profiles.reduce((s, c) => s + c.row_count, 0);
  const totalNulls = profiles.reduce((s, c) => s + c.null_count, 0);

  const { uniqueCount, uniquePct, approximate } = mergeUniqueCount(results, totalRows);

  // Top/bottom values still come from the (possibly capped) per-chunk
  // frequency tables — fine for business meaning (see comment in profiler.ts).
  const freqMap = buildMergedFreqMap(profiles);
  const sortedDesc = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
  const sortedAsc = [...freqMap.entries()].sort((a, b) => a[1] - b[1]);
  const topValues = toValueFreq(sortedDesc.slice(0, 20), totalRows);
  const bottomValues = toValueFreq(sortedAsc.slice(0, 5), totalRows);
  const valueFrequency = topValues;

  // Numeric stats: weighted mean + parallel variance formula (unchanged —
  // behavioral-scorer.ts depends on avg_value/std_dev for z-score anomalies)
  const numericProfiles = profiles.filter((c) => c.avg_value !== null);
  let avgValue: number | null = null;
  let stdDev: number | null = null;

  if (numericProfiles.length > 0) {
    const nonNullCounts = numericProfiles.map((c) => c.row_count - c.null_count);
    const totalNonNull = nonNullCounts.reduce((s, n) => s + n, 0);

    if (totalNonNull > 0) {
      const weightedSum = numericProfiles.reduce(
        (s, c, i) => s + c.avg_value! * nonNullCounts[i],
        0
      );
      avgValue = weightedSum / totalNonNull;

      const combinedVar =
        numericProfiles.reduce((s, c, i) => {
          const varI = (c.std_dev ?? 0) ** 2;
          return s + nonNullCounts[i] * (varI + (c.avg_value! - avgValue!) ** 2);
        }, 0) / totalNonNull;

      stdDev = Math.round(Math.sqrt(combinedVar) * 1000) / 1000;
      avgValue = Math.round(avgValue * 1000) / 1000;
    }
  }

  // String length stats
  const lenProfiles = profiles.filter((c) => c.avg_length !== null);
  let avgLength: number | null = null;
  let minLength: number | null = null;
  let maxLength: number | null = null;

  if (lenProfiles.length > 0) {
    minLength = Math.min(...lenProfiles.map((c) => c.min_length ?? Infinity));
    maxLength = Math.max(...lenProfiles.map((c) => c.max_length ?? -Infinity));
    const totalNonNull = lenProfiles.reduce((s, c) => s + (c.row_count - c.null_count), 0);
    if (totalNonNull > 0) {
      avgLength =
        Math.round(
          (lenProfiles.reduce((s, c) => s + c.avg_length! * (c.row_count - c.null_count), 0) /
            totalNonNull) *
            10
        ) / 10;
    }
  }

  const { outlierCount, outlierValues, outlierMethod } = mergeOutliers(numericProfiles);
  const outlierBounds = numericProfiles.length > 0 ? mergeOutlierBounds(results, avgValue, stdDev) : null;
  const { duplicateValueCount, duplicateRowCount, duplicateValues, duplicatesApproximate } =
    mergeDuplicates(profiles, totalRows);

  // PII — any chunk detection wins
  const piiDetected = profiles.some((c) => c.pii_detected);
  const piiType = profiles.find((c) => c.pii_type !== null)?.pii_type ?? null;

  return {
    column_name: profiles[0].column_name,
    inferred_type: mostSpecificType(profiles.map((c) => c.inferred_type)),
    row_count: totalRows,
    null_count: totalNulls,
    null_pct: totalRows > 0 ? Math.round((totalNulls / totalRows) * 10000) / 100 : 0,
    unique_count: uniqueCount,
    unique_pct: uniquePct,
    min_value: mergeMinValue(profiles),
    max_value: mergeMaxValue(profiles),
    avg_value: avgValue,
    std_dev: stdDev,
    min_length: minLength === Infinity ? null : minLength,
    max_length: maxLength === -Infinity ? null : maxLength,
    avg_length: avgLength,
    top_values: topValues,
    bottom_values: bottomValues,
    value_frequency: valueFrequency,
    pattern_summary: mergePatterns(profiles, totalRows),
    pii_detected: piiDetected,
    pii_type: piiType,
    outlier_count: outlierCount,
    outlier_values: outlierValues,
    sample_values: profiles[0].sample_values,
    detected_date_formats: mergeDateFormats(profiles),
    unique_count_approximate: approximate || undefined,
    outlier_method: outlierMethod,
    outlier_bounds: outlierBounds,
    duplicate_values: duplicateValues,
    duplicate_value_count: duplicateValueCount,
    duplicate_row_count: duplicateRowCount,
    duplicates_approximate: duplicatesApproximate || undefined,
  };
}

/**
 * Merge N sets of per-chunk profiling results into a single profile array.
 * chunkResults[chunkIndex][columnIndex] → { profile, sketches }
 */
export function mergeColumnProfiles(chunkResults: ChunkColumnResult[][]): ColumnProfile[] {
  if (chunkResults.length === 0) return [];
  if (chunkResults.length === 1) return chunkResults[0].map((r) => r.profile);

  const colCount = chunkResults[0].length;
  return Array.from({ length: colCount }, (_, colIdx) => {
    const results = chunkResults.map((cr) => cr[colIdx]);
    return mergeColumnProfile(results);
  });
}
