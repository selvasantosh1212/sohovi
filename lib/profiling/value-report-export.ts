import type { ColumnProfile } from "@/types/profiling.types";

function round(n: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

/** Plain-English explanation of why a single value was flagged as an outlier,
 *  used in the Outliers sheet of the profiling Excel export and shown inline
 *  in the outlier dialog table. */
export function explainOutlier(value: number, profile: ColumnProfile): string {
  const bounds = profile.outlier_bounds;
  const dominant = profile.top_values[0];
  const dominantNote =
    dominant && dominant.pct >= 80
      ? ` ${dominant.pct}% of values in this column are "${dominant.value}" — this value sits far outside that dominant cluster.`
      : "";

  if (!bounds) return `Flagged as a statistical outlier in "${profile.column_name}".${dominantNote}`;

  const direction = value > bounds.upper ? "above" : "below";
  const boundary = value > bounds.upper ? bounds.upper : bounds.lower;

  if (profile.outlier_method === "zscore") {
    const sigma = profile.std_dev ? Math.abs(value - (profile.avg_value ?? 0)) / profile.std_dev : 0;
    return `${round(sigma, 1)}σ ${direction} the mean (${profile.avg_value}) — beyond the ±3σ threshold (${round(boundary)}).${dominantNote}`;
  }

  return `${direction === "above" ? "Above" : "Below"} the IQR bound of ${round(boundary)} (1.5× interquartile range).${dominantNote}`;
}
