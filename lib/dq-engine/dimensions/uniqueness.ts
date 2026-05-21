import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm } from "../templates/index";

export function evaluate(
  colValues: (string | null)[],
  _rows: (string | null)[][],
  _headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "unique_column":
      return uniqueColumn(colValues);
    case "duplicate_detection":
      return duplicateDetection(colValues);
    default:
      return uniqueColumn(colValues);
  }
}

function uniqueColumn(values: (string | null)[]): EvalResult {
  const seen = new Map<string, number>(); // value → first occurrence index
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (seen.has(v)) {
      failedIndices.push(i);
      // Also mark the first occurrence if not already marked
      const first = seen.get(v)!;
      if (!failedIndices.includes(first)) failedIndices.push(first);
    } else {
      seen.set(v, i);
    }
  }
  failedIndices.sort((a, b) => a - b);
  const duplicateValues = failedIndices.length;
  const score = nonNull > 0 ? (nonNull - Math.floor(duplicateValues / 2)) / nonNull : 1;
  return {
    score: Math.max(0, score),
    failedIndices,
    message: `${Math.floor(duplicateValues / 2)} duplicate value${Math.floor(duplicateValues / 2) !== 1 ? "s" : ""} detected`,
  };
}

function duplicateDetection(values: (string | null)[]): EvalResult {
  const freq = new Map<string, number[]>();
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    const arr = freq.get(v) ?? [];
    arr.push(i);
    freq.set(v, arr);
  }
  const failedIndices: number[] = [];
  for (const indices of freq.values()) {
    if (indices.length > 1) failedIndices.push(...indices);
  }
  failedIndices.sort((a, b) => a - b);
  const nonNull = values.filter((v) => norm(v) !== null).length;
  const uniqueCount = freq.size;
  const score = nonNull > 0 ? uniqueCount / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${nonNull - uniqueCount} duplicate row${nonNull - uniqueCount !== 1 ? "s" : ""} (${nonNull - uniqueCount} non-unique values)`,
  };
}
