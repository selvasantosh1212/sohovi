/**
 * sketches/index.ts
 *
 * Internal, mergeable sketch state captured per-column during profiling.
 * Never part of the public ColumnProfile contract (not sent to Supabase,
 * not part of the UI's data shape) — used only inside the chunked bulk-file
 * pipeline so per-chunk estimates can be combined into accurate dataset-wide
 * stats without re-scanning raw values.
 */

import { HyperLogLog } from "./hyperloglog";
import { TDigest } from "./tdigest";

export { HyperLogLog } from "./hyperloglog";
export { TDigest, type Centroid } from "./tdigest";
export { ReservoirSampler } from "./reservoir-sampler";

export interface ColumnSketchState {
  /** Always present — cardinality estimator, used when freqMap had to be capped. */
  hll: HyperLogLog;
  /** Present only for numeric columns — backs IQR-based outlier bounds. */
  tdigest: TDigest | null;
}

export function mergeSketchStates(states: ColumnSketchState[]): ColumnSketchState {
  const hll = HyperLogLog.mergeAll(states.map((s) => s.hll)) ?? new HyperLogLog();
  const digests = states.map((s) => s.tdigest).filter((d): d is TDigest => d !== null);
  const tdigest = digests.length > 0 ? TDigest.mergeAll(digests) : null;
  return { hll, tdigest };
}

/** Q1/Q3-based outlier bounds (1.5x IQR) from a merged or single-chunk t-digest. */
export function iqrBounds(tdigest: TDigest): { lower: number; upper: number; q1: number; q3: number } | null {
  const q1 = tdigest.quantile(0.25);
  const q3 = tdigest.quantile(0.75);
  if (q1 === null || q3 === null) return null;
  const iqr = q3 - q1;
  return { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr, q1, q3 };
}
