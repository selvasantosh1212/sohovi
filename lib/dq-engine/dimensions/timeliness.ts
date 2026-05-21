import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  _rows: (string | null)[][],
  _headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "freshness_check":
      return freshnessCheck(colValues, rule);
    case "not_future_date":
      return notFutureDate(colValues);
    default:
      return freshnessCheck(colValues, rule);
  }
}

function freshnessCheck(values: (string | null)[], rule: RuleConfig): EvalResult {
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
    message: `${failedIndices.length} date value${failedIndices.length !== 1 ? "s" : ""} older than ${maxAgeDays} day${maxAgeDays !== 1 ? "s" : ""}`,
  };
}

function notFutureDate(values: (string | null)[]): EvalResult {
  const now = Date.now();
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const t = Date.parse(v);
    if (isNaN(t)) continue;
    nonNull++;
    if (t > now) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} future date${failedIndices.length !== 1 ? "s" : ""} detected`,
  };
}
