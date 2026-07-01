import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm, colIndex } from "../templates/index";

const PARSEABLE_TYPES: Record<string, (v: string) => boolean> = {
  integer: (v) => /^-?\d+$/.test(v),
  float: (v) => /^-?\d+(\.\d+)?$/.test(v.replace(/,/g, "")),
  boolean: (v) => ["true", "false", "yes", "no", "1", "0", "y", "n"].includes(v.toLowerCase()),
  date: (v) => !isNaN(Date.parse(v)) && /\d{4}|\d{2}/.test(v),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => /^[\+]?[\d\s\-\.\(\)]{7,15}$/.test(v),
  uuid: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v),
};

export function evaluate(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "regex_match":
      return regexMatch(colValues, rule);
    case "enum_validation":
      return enumValidation(colValues, rule);
    case "datatype_check":
      return datatypeCheck(colValues, rule);
    case "sequence_validation":
      return sequenceValidation(colValues, rows, headers, rule);
    default:
      return regexMatch(colValues, rule);
  }
}

function regexMatch(values: (string | null)[], rule: RuleConfig): EvalResult {
  const pattern = String(rule.parameters.pattern ?? ".*");
  let re: RegExp;
  try {
    re = new RegExp(pattern);
  } catch {
    return { score: 0, failedIndices: [], message: `Invalid regex pattern: ${pattern}` };
  }
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (!re.test(v)) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values do not match pattern /${pattern}/`,
  };
}

function enumValidation(values: (string | null)[], rule: RuleConfig): EvalResult {
  const allowed = (rule.parameters.allowed_values as string[] | undefined) ?? [];
  const allowedSet = new Set(allowed.map((v) => String(v).toLowerCase()));
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (!allowedSet.has(v.toLowerCase())) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values not in allowed set [${allowed.slice(0, 5).join(", ")}${allowed.length > 5 ? "…" : ""}]`,
  };
}

function datatypeCheck(values: (string | null)[], rule: RuleConfig): EvalResult {
  const expectedType = String(rule.parameters.expected_type ?? "string");
  const checker = PARSEABLE_TYPES[expectedType];
  if (!checker) return { score: 1, failedIndices: [], message: `Unknown type: ${expectedType}` };
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (!checker(v)) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values cannot be parsed as ${expectedType}`,
  };
}

function sequenceValidation(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  const refCol = String(rule.parameters.reference_column ?? "");
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
    const da = Date.parse(a);
    const db = Date.parse(b);
    if (!isNaN(da) && !isNaN(db)) {
      if (da > db) failedIndices.push(i);
    } else if (parseFloat(a) > parseFloat(b)) {
      failedIndices.push(i);
    }
  }
  const score = comparable > 0 ? (comparable - failedIndices.length) / comparable : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} rows where this column > '${refCol}'`,
  };
}
