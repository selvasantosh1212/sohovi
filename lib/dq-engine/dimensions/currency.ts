import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  _rows: (string | null)[][],
  _headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "recent_update":
      return recentUpdate(colValues, rule);
    case "not_stale":
      return recentUpdate(colValues, rule);
    default:
      return recentUpdate(colValues, rule);
  }
}

function recentUpdate(values: (string | null)[], rule: RuleConfig): EvalResult {
  const maxAgeDays = Number(rule.parameters.max_age_days ?? 30);
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const t = Date.parse(v);
    if (isNaN(t)) continue;
    nonNull++;
    if (t < cutoff) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} record${failedIndices.length !== 1 ? "s" : ""} not updated within ${maxAgeDays} day${maxAgeDays !== 1 ? "s" : ""}`,
  };
}
