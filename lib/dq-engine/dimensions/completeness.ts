import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm, colIndex } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "not_null":
      return notNull(colValues);
    case "not_empty":
      return notEmpty(colValues);
    case "mandatory_column":
      return mandatoryColumn(colValues);
    case "conditional_not_null":
      return conditionalNotNull(colValues, rows, headers, rule);
    default:
      return notNull(colValues);
  }
}

function notNull(values: (string | null)[]): EvalResult {
  const failedIndices: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (norm(values[i]) === null) failedIndices.push(i);
  }
  const score = values.length > 0 ? (values.length - failedIndices.length) / values.length : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} null/empty value${failedIndices.length !== 1 ? "s" : ""} out of ${values.length} records`,
  };
}

function notEmpty(values: (string | null)[]): EvalResult {
  const failedIndices: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v === null || String(v).trim() === "") failedIndices.push(i);
  }
  const score = values.length > 0 ? (values.length - failedIndices.length) / values.length : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} null or empty value${failedIndices.length !== 1 ? "s" : ""} out of ${values.length} records`,
  };
}

function mandatoryColumn(values: (string | null)[]): EvalResult {
  // Column exists if headers contain it (already validated upstream)
  // Here we check that it has at least one non-null value
  const hasData = values.some((v) => norm(v) !== null);
  return {
    score: hasData ? 1 : 0,
    failedIndices: hasData ? [] : values.map((_, i) => i),
    message: hasData ? "Column is present and populated" : "Column exists but has no data",
  };
}

function conditionalNotNull(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  const params = rule.parameters as { if_column: string; if_value: string };
  const ifColIdx = colIndex(headers, params.if_column);
  if (ifColIdx === -1) {
    return { score: 1, failedIndices: [], message: `Condition column '${params.if_column}' not found — rule skipped` };
  }
  const failedIndices: number[] = [];
  let applicable = 0;
  for (let i = 0; i < rows.length; i++) {
    const condVal = norm(rows[i][ifColIdx]);
    if (condVal === params.if_value) {
      applicable++;
      if (norm(colValues[i]) === null) failedIndices.push(i);
    }
  }
  const score = applicable > 0 ? (applicable - failedIndices.length) / applicable : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} null values when '${params.if_column}' = '${params.if_value}' (${applicable} applicable rows)`,
  };
}
