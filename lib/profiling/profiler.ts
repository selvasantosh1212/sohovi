import type { ColumnProfile, ValueFreq } from "@/types/profiling.types";
import { inferColumnType, detectDateFormats } from "./type-inference";
import { detectPII, maskValue } from "./pii-detector";
import { analyzePatterns } from "./pattern-analyzer";
import { HyperLogLog, TDigest, ReservoirSampler, iqrBounds, type ColumnSketchState } from "./sketches";

const SAMPLE_SIZE = 10;
const TOP_VALUES_LIMIT = 20;
const BOTTOM_VALUES_LIMIT = 5;

/**
 * Above this many distinct values, stop growing the exact frequency map and
 * fall back to the HyperLogLog estimate for unique_count — bounds memory for
 * extreme-cardinality columns (e.g. millions of UUIDs) instead of holding a
 * JS Map entry per distinct value. A HyperLogLog runs alongside the map from
 * the start (cheap, ~4KB) regardless of whether the cap is ever hit, so
 * merging chunk-level results later (bulk-file path) always has sketch state
 * to fall back on.
 */
const EXACT_CARDINALITY_CAP = 200_000;

interface FrequencyStats {
  freqMap: Map<string, number>;
  uniqueCount: number;
  approximate: boolean;
  hll: HyperLogLog;
}

function buildFrequencyStats(values: (string | null)[]): FrequencyStats {
  const freqMap = new Map<string, number>();
  const hll = new HyperLogLog();
  let approximate = false;

  for (const v of values) {
    if (v === null || v === "") continue;
    hll.add(v);

    if (!approximate) {
      const existing = freqMap.get(v);
      if (existing !== undefined) {
        freqMap.set(v, existing + 1);
      } else if (freqMap.size < EXACT_CARDINALITY_CAP) {
        freqMap.set(v, 1);
      } else {
        approximate = true; // map stays capped from here on
      }
    } else if (freqMap.has(v)) {
      freqMap.set(v, freqMap.get(v)! + 1);
    }
  }

  const uniqueCount = approximate ? Math.round(hll.count()) : freqMap.size;
  return { freqMap, uniqueCount, approximate, hll };
}

function toValueFreq(entries: [string, number][], total: number): ValueFreq[] {
  return entries.map(([value, count]) => ({
    value,
    count,
    pct: Math.round((count / total) * 10000) / 100,
  }));
}

const MAX_OUTLIER_STORE = 50;
const MAX_DUPLICATE_STORE = 50;

function calcNumericStats(nums: number[]): {
  min: number;
  max: number;
  avg: number;
  std: number;
  outlierCount: number;
  outlierValues: number[];
  outlierBounds: { lower: number; upper: number } | null;
  tdigest: TDigest;
} {
  let min = nums[0];
  let max = nums[0];
  let sum = 0;
  const tdigest = new TDigest();
  for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
    sum += n;
    tdigest.add(n);
  }
  const avg = sum / nums.length;
  // std_dev is still computed exactly (mean/variance) — behavioral-scorer.ts
  // relies on it for cross-run z-score anomaly detection, so its definition
  // must not change here.
  const variance = nums.reduce((s, x) => s + (x - avg) ** 2, 0) / nums.length;
  const std = Math.sqrt(variance);

  // Outlier detection now uses IQR (1.5x) from the t-digest instead of 3-sigma
  // alone — 3-sigma assumes a normal distribution and misses/over-flags on
  // skewed or bimodal numeric columns.
  const iqr = iqrBounds(tdigest);
  const bounds = iqr
    ? { lower: iqr.lower, upper: iqr.upper }
    : std > 0
    ? { lower: avg - 3 * std, upper: avg + 3 * std }
    : null;
  const outliers = bounds
    ? nums.filter((x) => x < bounds.lower || x > bounds.upper)
    : [];

  return {
    min, max, avg, std,
    outlierCount: outliers.length,
    outlierValues: outliers.slice(0, MAX_OUTLIER_STORE),
    outlierBounds: bounds,
    tdigest,
  };
}

/** Distinct values occurring more than once, sorted by count desc. Computed
 *  from the full (pre-truncation) frequency map so it isn't limited to the
 *  top/bottom N values shown elsewhere in the profile. */
function calcDuplicateStats(
  freqMap: Map<string, number>,
  rowCount: number
): {
  duplicateValueCount: number;
  duplicateRowCount: number;
  duplicateValues: ValueFreq[];
} {
  const dupes = [...freqMap.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  return {
    duplicateValueCount: dupes.length,
    duplicateRowCount: dupes.reduce((s, [, count]) => s + (count - 1), 0),
    duplicateValues: toValueFreq(dupes.slice(0, MAX_DUPLICATE_STORE), rowCount),
  };
}

/**
 * Profile a single column, also returning the mergeable sketch state
 * (HyperLogLog + t-digest) behind its stats. Used by the bulk-file chunked
 * pipeline so per-chunk estimates can later be combined into accurate
 * dataset-wide stats. All computation is synchronous and runs inside a
 * Web Worker.
 */
export function profileColumnWithSketches(
  colName: string,
  values: (string | null)[]
): { profile: ColumnProfile; sketches: ColumnSketchState } {
  const rowCount = values.length;
  const nullCount = values.filter((v) => v === null || v === "").length;
  const nonNull = values.filter((v): v is string => v !== null && v !== "");
  const nullPct = rowCount > 0 ? Math.round((nullCount / rowCount) * 10000) / 100 : 0;

  const { freqMap, uniqueCount, approximate, hll } = buildFrequencyStats(values);
  const uniquePct = rowCount > 0 ? Math.round((uniqueCount / rowCount) * 10000) / 100 : 0;

  // Type inference
  const inferredType = inferColumnType(nonNull);
  const detectedDateFormats =
    (inferredType === "date" || inferredType === "datetime")
      ? detectDateFormats(nonNull)
      : null;

  // PII detection
  const { detected: piiDetected, type: piiType } = detectPII(colName, nonNull);

  // Value frequencies (drawn from the — possibly capped — freqMap; for
  // extreme-cardinality columns top/bottom values are inherently near-tied
  // at count ~1 regardless, so capping doesn't change their business meaning)
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
  let outlierMethod: "iqr" | "zscore" | undefined;
  let outlierBounds: { lower: number; upper: number } | null = null;
  let tdigest: TDigest | null = null;

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
      outlierMethod = iqrBounds(stats.tdigest) ? "iqr" : "zscore";
      outlierBounds = stats.outlierBounds;
      tdigest = stats.tdigest;
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

  // Sample values — uniform reservoir sample (not biased to the start of the
  // column) — mask if PII detected
  const sampler = new ReservoirSampler<string>(SAMPLE_SIZE);
  for (const v of nonNull) sampler.add(v);
  const rawSamples = sampler.values();
  const sampleValues = piiDetected && piiType
    ? rawSamples.map((v) => maskValue(v, piiType))
    : rawSamples;

  // Mask top/bottom values if PII
  const maskFreq = (freqs: ValueFreq[]): ValueFreq[] => {
    if (!piiDetected || !piiType) return freqs;
    return freqs.map((f) => ({ ...f, value: maskValue(f.value, piiType) }));
  };

  const { duplicateValueCount, duplicateRowCount, duplicateValues } = calcDuplicateStats(freqMap, rowCount);

  const profile: ColumnProfile = {
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
    unique_count_approximate: approximate || undefined,
    outlier_method: outlierMethod,
    outlier_bounds: outlierBounds,
    duplicate_values: maskFreq(duplicateValues),
    duplicate_value_count: duplicateValueCount,
    duplicate_row_count: duplicateRowCount,
    duplicates_approximate: approximate || undefined,
  };

  return { profile, sketches: { hll, tdigest } };
}

/**
 * Profile a single column. Thin wrapper over profileColumnWithSketches() for
 * the common (non-chunked) path, which doesn't need to retain sketch state.
 */
export function profileColumn(
  colName: string,
  values: (string | null)[]
): ColumnProfile {
  return profileColumnWithSketches(colName, values).profile;
}
