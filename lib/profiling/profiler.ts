import type { ColumnProfile, ValueFreq } from "@/types/profiling.types";
import { inferColumnType, detectDateFormats } from "./type-inference";
import { detectPII, maskValue } from "./pii-detector";
import { analyzePatterns } from "./pattern-analyzer";

const SAMPLE_SIZE = 10;
const TOP_VALUES_LIMIT = 20;
const BOTTOM_VALUES_LIMIT = 5;

function buildFrequencyMap(values: (string | null)[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const v of values) {
    if (v === null || v === "") continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

function toValueFreq(entries: [string, number][], total: number): ValueFreq[] {
  return entries.map(([value, count]) => ({
    value,
    count,
    pct: Math.round((count / total) * 10000) / 100,
  }));
}

const MAX_OUTLIER_STORE = 50;

function calcNumericStats(nums: number[]): {
  min: number;
  max: number;
  avg: number;
  std: number;
  outlierCount: number;
  outlierValues: number[];
} {
  let min = nums[0];
  let max = nums[0];
  let sum = 0;
  for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
    sum += n;
  }
  const avg = sum / nums.length;
  const variance = nums.reduce((s, x) => s + (x - avg) ** 2, 0) / nums.length;
  const std = Math.sqrt(variance);
  const outliers = std > 0 ? nums.filter((x) => Math.abs(x - avg) > 3 * std) : [];
  return {
    min, max, avg, std,
    outlierCount: outliers.length,
    outlierValues: outliers.slice(0, MAX_OUTLIER_STORE),
  };
}

/**
 * Profile a single column.
 * All computation is synchronous and runs inside a Web Worker.
 */
export function profileColumn(
  colName: string,
  values: (string | null)[]
): ColumnProfile {
  const rowCount = values.length;
  const nullCount = values.filter((v) => v === null || v === "").length;
  const nonNull = values.filter((v): v is string => v !== null && v !== "");
  const nullPct = rowCount > 0 ? Math.round((nullCount / rowCount) * 10000) / 100 : 0;

  const freqMap = buildFrequencyMap(values);
  const uniqueCount = freqMap.size;
  const uniquePct = rowCount > 0 ? Math.round((uniqueCount / rowCount) * 10000) / 100 : 0;

  // Type inference
  const inferredType = inferColumnType(nonNull);
  const detectedDateFormats =
    (inferredType === "date" || inferredType === "datetime")
      ? detectDateFormats(nonNull)
      : null;

  // PII detection
  const { detected: piiDetected, type: piiType } = detectPII(colName, nonNull);

  // Value frequencies
  const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
  const topValues = toValueFreq(sorted.slice(0, TOP_VALUES_LIMIT), rowCount);
  const bottomValues = toValueFreq(
    [...freqMap.entries()].sort((a, b) => a[1] - b[1]).slice(0, BOTTOM_VALUES_LIMIT),
    rowCount
  );
  const valueFrequency = toValueFreq(sorted.slice(0, TOP_VALUES_LIMIT), rowCount);

  // Pattern analysis
  const patternSummary = analyzePatterns(nonNull);

  // Numeric stats
  let minValue: string | null = null;
  let maxValue: string | null = null;
  let avgValue: number | null = null;
  let stdDev: number | null = null;
  let outlierCount = 0;
  let outlierValues: number[] = [];

  if (inferredType === "integer" || inferredType === "float") {
    const nums = nonNull
      .map((v) => parseFloat(v.replace(/,/g, "")))
      .filter((n) => !isNaN(n));
    if (nums.length > 0) {
      const stats = calcNumericStats(nums);
      minValue = String(stats.min);
      maxValue = String(stats.max);
      avgValue = Math.round(stats.avg * 1000) / 1000;
      stdDev = Math.round(stats.std * 1000) / 1000;
      outlierCount = stats.outlierCount;
      outlierValues = stats.outlierValues;
    }
  } else if (nonNull.length > 0) {
    // For strings: lexicographic min/max
    const s = [...nonNull].sort();
    minValue = s[0];
    maxValue = s[s.length - 1];
  }

  // String length stats
  let minLength: number | null = null;
  let maxLength: number | null = null;
  let avgLength: number | null = null;

  if (nonNull.length > 0) {
    let lenMin = nonNull[0].length;
    let lenMax = nonNull[0].length;
    let lenSum = 0;
    for (const v of nonNull) {
      const l = v.length;
      if (l < lenMin) lenMin = l;
      if (l > lenMax) lenMax = l;
      lenSum += l;
    }
    minLength = lenMin;
    maxLength = lenMax;
    avgLength = Math.round((lenSum / nonNull.length) * 10) / 10;
  }

  // Sample values — mask if PII detected
  const rawSamples = nonNull.slice(0, SAMPLE_SIZE);
  const sampleValues = piiDetected && piiType
    ? rawSamples.map((v) => maskValue(v, piiType))
    : rawSamples;

  // Mask top/bottom values if PII
  const maskFreq = (freqs: ValueFreq[]): ValueFreq[] => {
    if (!piiDetected || !piiType) return freqs;
    return freqs.map((f) => ({ ...f, value: maskValue(f.value, piiType) }));
  };

  return {
    column_name: colName,
    inferred_type: inferredType,
    row_count: rowCount,
    null_count: nullCount,
    null_pct: nullPct,
    unique_count: uniqueCount,
    unique_pct: uniquePct,
    min_value: minValue,
    max_value: maxValue,
    avg_value: avgValue,
    std_dev: stdDev,
    min_length: minLength,
    max_length: maxLength,
    avg_length: avgLength,
    top_values: maskFreq(topValues),
    bottom_values: maskFreq(bottomValues),
    value_frequency: maskFreq(valueFrequency),
    pattern_summary: patternSummary,
    pii_detected: piiDetected,
    pii_type: piiType,
    outlier_count: outlierCount,
    outlier_values: outlierValues,
    sample_values: sampleValues,
    detected_date_formats: detectedDateFormats,
  };
}
