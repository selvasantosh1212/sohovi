import type { ScopeCondition } from "@/types/dq.types";

export function formatScopeConditions(conditions: ScopeCondition[]): string {
  return conditions.map((c) => `${c.column} ${c.operator} ${c.value}`).join(" AND ");
}
