import type { ColumnProfile } from "@/types/profiling.types";

/** % of non-null/non-empty values in a column — the complement of null_pct. */
export function filledPct(profile: ColumnProfile): number {
  return Math.round((100 - profile.null_pct) * 100) / 100;
}

/**
 * Whether a column's fill rate meets/exceeds the user-set mandatory-field
 * threshold. Purely derived from null_pct — recomputes instantly on
 * threshold change, no worker involvement.
 *
 * Not related to the DQ Rule Builder's `mandatory_column` rule type
 * (lib/dq-engine/dimensions/completeness.ts) — that is a persisted,
 * user-authored per-column rule evaluated against Supabase-backed
 * RuleConfig/RuleResult. This is a session-only, all-columns, automatic
 * overlay computed from the existing profiling stats.
 */
export function isMandatoryFieldPass(profile: ColumnProfile, thresholdPct: number): boolean {
  return filledPct(profile) >= thresholdPct;
}
