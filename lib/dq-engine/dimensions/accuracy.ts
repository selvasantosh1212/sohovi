import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm, colIndex } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "range_check":
      return rangeCheck(colValues, rule);
    case "positive_check":
      return positiveCheck(colValues);
    case "cross_field_comparison":
      return crossFieldComparison(colValues, rows, headers, rule);
    default:
      return rangeCheck(colValues, rule);
  }
}

function rangeCheck(values: (string | null)[], rule: RuleConfig): EvalResult {
  const min = rule.parameters.min !== undefined ? Number(rule.parameters.min) : -Infinity;
  const max = rule.parameters.max !== undefined ? Number(rule.parameters.max) : Infinity;
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const n = parseFloat(v.replace(/,/g, ""));
    if (isNaN(n)) continue;
    nonNull++;
    if (n < min || n > max) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  const rangeStr = `${isFinite(min) ? min : "−∞"} to ${isFinite(max) ? max : "+∞"}`;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values outside range [${rangeStr}]`,
  };
}

function positiveCheck(values: (string | null)[]): EvalResult {
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const n = parseFloat(v.replace(/,/g, ""));
    if (isNaN(n)) continue;
    nonNull++;
    if (n <= 0) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} non-positive values`,
  };
}

function crossFieldComparison(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  const refCol = String(rule.parameters.reference_column ?? "");
  const op = String(rule.parameters.operator ?? "==");
  const refIdx = colIndex(headers, refCol);
  if (refIdx === -1) {
    return { score: 1, failedIndices: [], message: `Reference column '${refCol}' not found` };
  }
  const failedIndices: number[] = [];
  let comparable = 0;
  for (let i = 0; i < rows.length; i++) {
    const a = norm(colValues[i]);
    const b = norm(rows[i][refIdx]);
    if (a === null || b === null) continue;
    comparable++;
    const na = parseFloat(a), nb = parseFloat(b);
    let pass = true;
    if (!isNaN(na) && !isNaN(nb)) {
      if (op === ">" && !(na > nb)) pass = false;
      if (op === ">=" && !(na >= nb)) pass = false;
      if (op === "<" && !(na < nb)) pass = false;
      if (op === "<=" && !(na <= nb)) pass = false;
      if (op === "==" && na !== nb) pass = false;
    } else {
      if (op === "==" && a !== b) pass = false;
    }
    if (!pass) failedIndices.push(i);
  }
  const score = comparable > 0 ? (comparable - failedIndices.length) / comparable : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} rows where column ${op} '${refCol}' is violated`,
  };
}
