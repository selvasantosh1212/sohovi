import type { DQRunResult } from "@/types/dq.types";

export interface AnomalyFlag {
  column_name: string;
  type: "score_drop" | "high_null" | "all_unique" | "all_same" | "outlier_spike";
  message: string;
  severity: "low" | "medium" | "high";
}

/**
 * Detect anomalies in a DQ run result.
 * In Session 6 this will also compare against the previous run.
 */
export function detectAnomalies(result: DQRunResult): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];

  for (const col of result.column_scores) {
    // Score drop (critical if score < 60)
    if (col.score < 0.6) {
      flags.push({
        column_name: col.column_name,
        type: "score_drop",
        message: `DQ score critically low: ${Math.round(col.score * 100)}%`,
        severity: "high",
      });
    }
  }

  // High null rate — derived from completeness results
  for (const r of result.rule_results) {
    if (r.rule_type === "not_null" && r.total_records > 0) {
      const nullPct = r.failed_records / r.total_records;
      if (nullPct > 0.5 && r.column_name) {
        flags.push({
          column_name: r.column_name,
          type: "high_null",
          message: `${Math.round(nullPct * 100)}% null values`,
          severity: nullPct > 0.8 ? "high" : "medium",
        });
      }
    }
  }

  return flags;
}
