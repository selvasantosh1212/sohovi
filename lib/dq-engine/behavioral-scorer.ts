import type { BehaviorFlag, BehaviorMetric, BehaviorResult } from "@/types/dq.types";
import type { ProfilingSummary } from "@/types/app.types";

// Flag when observed value is this many standard deviations from the historical mean.
const Z_THRESHOLD = 3;
// Minimum historical runs needed before behavioral scoring is meaningful.
const MIN_HISTORY = 2;

// ---- Math helpers ----------------------------------------------------------

function mean(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function stdDev(values: number[], mu: number): number {
  const variance = values.reduce((s, v) => s + (v - mu) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function zScore(observed: number, mu: number, sigma: number): number {
  if (sigma === 0) return 0;
  return (observed - mu) / sigma;
}

function severity(absZ: number): "low" | "medium" | "high" {
  if (absZ >= 6) return "high";
  if (absZ >= 4) return "medium";
  return "low";
}

// ---- Per-metric flag builders ---------------------------------------------

function flagNumeric(
  columnName: string,
  metric: BehaviorMetric,
  observed: number | null,
  historicalValues: (number | null)[],
  formatValue: (v: number) => string
): BehaviorFlag | null {
  const valid = historicalValues.filter((v): v is number => v !== null && !isNaN(v));
  if (valid.length < MIN_HISTORY || observed === null || isNaN(observed)) return null;

  const mu = mean(valid);
  const sigma = stdDev(valid, mu);
  const z = zScore(observed, mu, sigma);

  if (Math.abs(z) < Z_THRESHOLD) return null;

  return {
    column_name: columnName,
    metric,
    observed,
    expected_mean: mu,
    expected_std: sigma,
    z_score: z,
    severity: severity(Math.abs(z)),
    message: `${metric.replace(/_/g, " ")} for **${columnName}** is ${formatValue(observed)} (expected ≈ ${formatValue(mu)}, z=${z.toFixed(1)})`,
  };
}

// ---- Distribution shift (top_values entropy change) ----------------------

interface ValueFreq {
  value: string;
  count: number;
  pct: number;
}

function detectDistributionShift(
  columnName: string,
  currentTopValues: ValueFreq[],
  previousTopValues: ValueFreq[]
): BehaviorFlag | null {
  if (!currentTopValues?.length || !previousTopValues?.length) return null;

  const prevSet = new Set(previousTopValues.map((v) => v.value));
  const newValues = currentTopValues.filter((v) => !prevSet.has(v.value));

  // New dominant value (top-1) that wasn't in top values before
  const top1 = currentTopValues[0];
  const isTop1New = top1 && !prevSet.has(top1.value) && top1.pct > 10;

  if (!isTop1New && newValues.length === 0) return null;

  const message = isTop1New
    ? `New dominant value "${top1.value}" (${top1.pct.toFixed(1)}%) appeared in **${columnName}** — not seen in previous run`
    : `${newValues.length} new value(s) appeared in **${columnName}**: ${newValues.slice(0, 3).map((v) => `"${v.value}"`).join(", ")}`;

  return {
    column_name: columnName,
    metric: "distribution",
    observed: newValues.length,
    expected_mean: 0,
    expected_std: 0,
    z_score: 99,
    severity: isTop1New ? "high" : "medium",
    message,
  };
}

// ---- Type shift detection -------------------------------------------------

function detectTypeShift(
  columnName: string,
  currentType: string | null,
  historyTypes: (string | null)[]
): BehaviorFlag | null {
  if (!currentType) return null;
  const validHistory = historyTypes.filter(Boolean) as string[];
  if (!validHistory.length) return null;

  // Use the most common historical type as baseline
  const freq: Record<string, number> = {};
  for (const t of validHistory) freq[t] = (freq[t] ?? 0) + 1;
  const dominant = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

  if (currentType === dominant) return null;

  return {
    column_name: columnName,
    metric: "type_shift",
    observed: 0,
    expected_mean: 0,
    expected_std: 0,
    z_score: 99,
    severity: "high",
    message: `Column **${columnName}** inferred type changed from "${dominant}" to "${currentType}"`,
  };
}

// ---- Main entry point -----------------------------------------------------

/**
 * Compare current run's profiling summaries against historical runs.
 *
 * @param current    Profiling summaries for the current run (one row per column)
 * @param history    Profiling summaries for previous runs, each element is one run's rows.
 *                   Pass oldest-first; only last MIN_HISTORY..10 runs are used.
 * @param rowCount   Row count of the current run
 * @param rowCountHistory  Row counts of previous runs (same ordering as history)
 */
export function computeBehavioralScore(
  current: ProfilingSummary[],
  history: ProfilingSummary[][],
  rowCount: number,
  rowCountHistory: number[]
): BehaviorResult {
  if (history.length < MIN_HISTORY) {
    return { behavior_score: 100, flags: [], runs_compared: history.length };
  }

  const flags: BehaviorFlag[] = [];

  // --- Row count check ---
  const rowCountFlag = flagNumeric(
    "__dataset__",
    "row_count",
    rowCount,
    rowCountHistory,
    (v) => `${Math.round(v).toLocaleString()} rows`
  );
  if (rowCountFlag) flags.push(rowCountFlag);

  // --- Per-column checks ---
  // Index the most recent previous run for distribution/type shift (point-in-time comparison)
  const prevRun = history[history.length - 1];
  const prevByCol = new Map<string, ProfilingSummary>();
  for (const row of prevRun) prevByCol.set(row.column_name, row);

  // Index historical values per column
  const histByCol = new Map<string, ProfilingSummary[]>();
  for (const run of history) {
    for (const row of run) {
      const existing = histByCol.get(row.column_name) ?? [];
      existing.push(row);
      histByCol.set(row.column_name, existing);
    }
  }

  for (const col of current) {
    const hist = histByCol.get(col.column_name);
    if (!hist || hist.length < MIN_HISTORY) continue;

    // null_pct
    const nullFlag = flagNumeric(
      col.column_name,
      "null_pct",
      col.null_pct,
      hist.map((h) => h.null_pct),
      (v) => `${v.toFixed(1)}% nulls`
    );
    if (nullFlag) flags.push(nullFlag);

    // unique_pct
    const uniqueFlag = flagNumeric(
      col.column_name,
      "unique_pct",
      col.unique_pct,
      hist.map((h) => h.unique_pct),
      (v) => `${v.toFixed(1)}% unique`
    );
    if (uniqueFlag) flags.push(uniqueFlag);

    // avg_value, std_dev, min_value, max_value (numeric columns only)
    if (col.avg_value !== null) {
      const avgFlag = flagNumeric(
        col.column_name,
        "avg_value",
        col.avg_value,
        hist.map((h) => h.avg_value),
        (v) => v.toFixed(2)
      );
      if (avgFlag) flags.push(avgFlag);

      const stdFlag = flagNumeric(
        col.column_name,
        "std_dev",
        col.std_dev,
        hist.map((h) => h.std_dev),
        (v) => v.toFixed(2)
      );
      if (stdFlag) flags.push(stdFlag);

      // min_value and max_value are stored as strings — parse before comparing
      const colMinNum = col.min_value !== null ? parseFloat(col.min_value) : null;
      const colMaxNum = col.max_value !== null ? parseFloat(col.max_value) : null;

      if (colMinNum !== null && !isNaN(colMinNum)) {
        const minFlag = flagNumeric(
          col.column_name,
          "min_value",
          colMinNum,
          hist.map((h) => (h.min_value !== null ? parseFloat(h.min_value) : null)),
          (v) => v.toFixed(2)
        );
        if (minFlag) flags.push(minFlag);
      }

      if (colMaxNum !== null && !isNaN(colMaxNum)) {
        const maxFlag = flagNumeric(
          col.column_name,
          "max_value",
          colMaxNum,
          hist.map((h) => (h.max_value !== null ? parseFloat(h.max_value) : null)),
          (v) => v.toFixed(2)
        );
        if (maxFlag) flags.push(maxFlag);
      }
    }

    // Type shift
    const typeFlag = detectTypeShift(
      col.column_name,
      col.inferred_type,
      hist.map((h) => h.inferred_type)
    );
    if (typeFlag) flags.push(typeFlag);

    // Distribution shift (compare against immediate previous run only)
    const prev = prevByCol.get(col.column_name);
    if (prev?.top_values && col.top_values) {
      const distFlag = detectDistributionShift(
        col.column_name,
        col.top_values as ValueFreq[],
        prev.top_values as ValueFreq[]
      );
      if (distFlag) flags.push(distFlag);
    }
  }

  // Behavior score: weighted by severity
  // Each high flag = -10 pts, medium = -5, low = -2 (capped at 0)
  const penalty = flags.reduce((sum, f) => {
    const p = f.severity === "high" ? 10 : f.severity === "medium" ? 5 : 2;
    return sum + p;
  }, 0);

  const behavior_score = Math.max(0, 100 - penalty);

  return { behavior_score, flags, runs_compared: history.length };
}
