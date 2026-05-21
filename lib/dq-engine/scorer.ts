import type { RuleResult, ColumnScore, DQRunResult } from "@/types/dq.types";

/**
 * Compute per-column weighted scores and an overall dataset score (0–100).
 * Score < 60 → critical, 60–80 → warning, 80–95 → good, ≥95 → excellent.
 */
export function buildRunResult(
  ruleResults: RuleResult[],
  assetId: string
): DQRunResult {
  const columnMap = new Map<string, RuleResult[]>();

  for (const r of ruleResults) {
    const key = r.column_name ?? "__dataset__";
    const arr = columnMap.get(key) ?? [];
    arr.push(r);
    columnMap.set(key, arr);
  }

  const columnScores: ColumnScore[] = [];

  for (const [colName, results] of columnMap.entries()) {
    const active = results.filter((r) => r.score !== undefined);
    if (active.length === 0) continue;

    const totalWeight = active.reduce((s, r) => s + (r.score !== undefined ? 1 : 0), 0);
    const weightedSum = active.reduce((s, r) => s + r.score, 0);
    const score = totalWeight > 0 ? weightedSum / totalWeight : 1;
    const failCount = active.filter((r) => r.status === "fail").length;

    columnScores.push({
      column_name: colName,
      score: Math.round(score * 10000) / 10000,
      weighted_score: Math.round(score * 10000) / 10000,
      rule_count: active.length,
      fail_count: failCount,
    });
  }

  const overallScore =
    columnScores.length > 0
      ? Math.round(
          (columnScores.reduce((s, c) => s + c.score, 0) / columnScores.length) * 100
        )
      : 100;

  return {
    asset_id: assetId,
    overall_score: overallScore,
    column_scores: columnScores,
    rule_results: ruleResults,
    run_at: new Date().toISOString(),
  };
}

/** Derive severity from score: ≥0.95 low, 0.80–0.95 medium, <0.80 high */
export function deriveSeverity(score: number): "low" | "medium" | "high" {
  if (score >= 0.95) return "low";
  if (score >= 0.80) return "medium";
  return "high";
}

/** Score-colour helper (matches the ScoreBadge thresholds) */
export function scoreColor(score: number): string {
  if (score >= 95) return "#10B981"; // emerald
  if (score >= 80) return "#00C9A7"; // teal
  if (score >= 60) return "#F59E0B"; // amber
  return "#EF4444"; // red
}
