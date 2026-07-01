import type { ScopeCondition } from "@/types/dq.types";
import { norm, colIndex } from "./templates/index";

/**
 * Returns the original row indices that satisfy every scope condition (AND-combined).
 * Missing scope columns fail open (the condition is skipped, not treated as false) —
 * a typo'd column name should not silently zero out the rule's applicable rows.
 */
export function applyScopeFilter(
  rows: (string | null)[][],
  headers: string[],
  conditions: ScopeCondition[]
): number[] {
  if (!conditions.length) return rows.map((_, i) => i);

  const resolved = conditions
    .map((c) => ({ ...c, idx: colIndex(headers, c.column) }))
    .filter((c) => c.idx !== -1);

  const inScope: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const matchesAll = resolved.every((c) => matchesCondition(norm(row[c.idx]), c.operator, c.value));
    if (matchesAll) inScope.push(i);
  }
  return inScope;
}

function matchesCondition(value: string | null, operator: ScopeCondition["operator"], target: string): boolean {
  switch (operator) {
    case "==":
      return value === target;
    case "!=":
      return value !== target;
    case ">":
    case ">=":
    case "<":
    case "<=": {
      const a = value === null ? NaN : Number(value);
      const b = Number(target);
      if (isNaN(a) || isNaN(b)) return false;
      if (operator === ">") return a > b;
      if (operator === ">=") return a >= b;
      if (operator === "<") return a < b;
      return a <= b;
    }
    case "in": {
      const options = target.split(",").map((v) => v.trim());
      return value !== null && options.includes(value);
    }
    case "contains":
      return value !== null && value.toLowerCase().includes(target.toLowerCase());
    default:
      return false;
  }
}
