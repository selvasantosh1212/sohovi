import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm, colIndex } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "no_orphan_values":
      return noOrphanValues(colValues, rows, headers, rule);
    case "referential_integrity":
      return noOrphanValues(colValues, rows, headers, rule);
    default:
      return noOrphanValues(colValues, rows, headers, rule);
  }
}

/**
 * Check that every value in the current column exists in a reference column
 * within the same dataset (cross-column referential integrity).
 */
function noOrphanValues(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  const refCol = String(rule.parameters.reference_column ?? "");
  const refIdx = colIndex(headers, refCol);
  if (refIdx === -1) {
    return {
      score: 1,
      failedIndices: [],
      message: `Reference column '${refCol}' not found — rule skipped`,
    };
  }
  // Build reference set from the reference column
  const refSet = new Set<string>();
  for (const row of rows) {
    const v = norm(row[refIdx]);
    if (v !== null) refSet.add(v);
  }

  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < colValues.length; i++) {
    const v = norm(colValues[i]);
    if (v === null) continue;
    nonNull++;
    if (!refSet.has(v)) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} orphan value${failedIndices.length !== 1 ? "s" : ""} not found in '${refCol}'`,
  };
}
