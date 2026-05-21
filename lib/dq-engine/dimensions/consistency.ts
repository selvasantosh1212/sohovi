import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm, colIndex } from "../templates/index";
import { analyzePatterns } from "@/lib/profiling/pattern-analyzer";

export function evaluate(
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "format_standardization":
      return formatStandardization(colValues);
    case "case_consistency":
      return caseConsistency(colValues, rule);
    case "cross_column_match":
      return crossColumnMatch(colValues, rows, headers, rule);
    default:
      return formatStandardization(colValues);
  }
}

function formatStandardization(values: (string | null)[]): EvalResult {
  const nonNull = values.filter((v): v is string => norm(v) !== null) as string[];
  if (nonNull.length === 0) return { score: 1, failedIndices: [], message: "No non-null values to check" };

  const patterns = analyzePatterns(nonNull);
  if (patterns.length === 0) return { score: 1, failedIndices: [], message: "No patterns found" };

  // Dominant pattern must cover ≥80% of values to be "consistent"
  const dominant = patterns[0];
  const score = dominant.pct / 100;
  const failedIndices: number[] = [];
  if (score < 1) {
    // Mark rows that don't match the dominant pattern
    // Re-derive the dominant pattern
    const dominantPattern = dominant.pattern;
    for (let i = 0; i < values.length; i++) {
      const v = norm(values[i]);
      if (v === null) continue;
      // Build pattern for this value using same logic
      const pat = toSimplePattern(v);
      if (pat !== dominantPattern) failedIndices.push(i);
    }
  }
  return {
    score: Math.min(1, score),
    failedIndices,
    message: `Dominant pattern covers ${dominant.pct}% of values${failedIndices.length > 0 ? ` — ${failedIndices.length} non-conforming` : ""}`,
  };
}

function toSimplePattern(value: string): string {
  return value
    .slice(0, 30)
    .replace(/[A-Z]+/g, "A")
    .replace(/[a-z]+/g, "a")
    .replace(/\d+/g, "9");
}

function caseConsistency(values: (string | null)[], rule: RuleConfig): EvalResult {
  const expectedCase = String(rule.parameters.case ?? "any");
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (expectedCase === "upper" && v !== v.toUpperCase()) failedIndices.push(i);
    else if (expectedCase === "lower" && v !== v.toLowerCase()) failedIndices.push(i);
    else if (expectedCase === "title") {
      const titled = v.replace(/\b\w/g, (c) => c.toUpperCase());
      if (v !== titled) failedIndices.push(i);
    }
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values don't match expected ${expectedCase}case`,
  };
}

function crossColumnMatch(
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
    if (a !== b) failedIndices.push(i);
  }
  const score = comparable > 0 ? (comparable - failedIndices.length) / comparable : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} rows where column ≠ '${refCol}'`,
  };
}
