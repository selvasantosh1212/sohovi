import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  _rows: (string | null)[][],
  _headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "decimal_places":
      return decimalPlaces(colValues, rule);
    case "rounding_check":
      return roundingCheck(colValues, rule);
    default:
      return decimalPlaces(colValues, rule);
  }
}

function decimalPlaces(values: (string | null)[], rule: RuleConfig): EvalResult {
  const maxDecimals = Number(rule.parameters.max_decimals ?? 2);
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const clean = v.replace(/,/g, "");
    if (!/^-?\d+(\.\d+)?$/.test(clean)) continue;
    nonNull++;
    const dotIdx = clean.indexOf(".");
    const decimals = dotIdx === -1 ? 0 : clean.length - dotIdx - 1;
    if (decimals > maxDecimals) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values have more than ${maxDecimals} decimal place${maxDecimals !== 1 ? "s" : ""}`,
  };
}

function roundingCheck(values: (string | null)[], rule: RuleConfig): EvalResult {
  const decimals = Number(rule.parameters.decimals ?? 2);
  const factor = Math.pow(10, decimals);
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const n = parseFloat(v.replace(/,/g, ""));
    if (isNaN(n)) continue;
    nonNull++;
    if (Math.round(n * factor) / factor !== n) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values are not rounded to ${decimals} decimal place${decimals !== 1 ? "s" : ""}`,
  };
}
