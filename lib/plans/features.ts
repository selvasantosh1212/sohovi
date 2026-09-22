import { PLAN_LIMITS, type Plan, type PlanLimits } from "./limits";

/**
 * Pure, client-safe feature logic.
 *
 * Kept separate from `entitlements.ts` because that module imports
 * `@clerk/nextjs/server`, which must never reach a client bundle. Client
 * components (`PlanGate` and anything gating a control inline) import from
 * here; server actions import `requireFeature` from `entitlements.ts`.
 */

/**
 * The feature-flag keys of `PlanLimits` — the numeric quota keys are excluded
 * by construction, so a new boolean added to `PlanLimits` becomes a valid
 * `Feature` automatically and a new quota does not.
 */
export type Feature = {
  [K in keyof PlanLimits]: PlanLimits[K] extends boolean ? K : never;
}[keyof PlanLimits];

const PLAN_ORDER: readonly Plan[] = ["free", "pro", "business"] as const;

const PLAN_RANK: Record<Plan, number> = { free: 0, pro: 1, business: 2 };

/** Customer-facing plan names. The paid top tier is sold as "Team". */
export const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  business: "Team",
};

/** Human-readable feature names, used in lock messages and upgrade prompts. */
export const FEATURE_LABELS: Record<Feature, string> = {
  aiSuggestions: "AI rule suggestions",
  workflows: "Reusable rule workflows",
  alerts: "Alerts",
  pdfExport: "PDF export",
  pii: "PII detection",
  sandbox: "Rule sandbox",
  remediation: "Remediation",
  crossColumnValidation: "Cross-column validations",
  catalogScoring: "Catalog-level DQ scoring",
  connectors: "Connectors",
  columnNotes: "Column source & transformation notes",
  alertEmail: "Email alert delivery",
  alertSlack: "Slack alert delivery",
  reconciliation: "Reconciliation",
  fuzzyMatching: "Fuzzy duplicate matching",
  privacyStudio: "Privacy Studio",
  dataContracts: "Data contracts",
  portfolioHealth: "Portfolio health",
  multiBusinessUnitPortfolio: "Multi-business-unit portfolio",
};

/**
 * Rule types that require a paid feature, keyed by `dq_rules.rule_type`.
 *
 * The rule engine evaluates these regardless — gating happens at authoring
 * time, so a rule created while subscribed keeps scoring after a downgrade
 * rather than silently changing an asset's score.
 */
export const GATED_RULE_TYPES: Readonly<Record<string, Feature>> = {
  cross_column_match: "crossColumnValidation",
  cross_field_comparison: "crossColumnValidation",
};

/** Pure predicate — does `plan` include `feature`? */
export function can(plan: Plan, feature: Feature): boolean {
  return PLAN_LIMITS[plan][feature] === true;
}

/** The cheapest plan that includes `feature`, derived from PLAN_LIMITS. */
export function minPlanFor(feature: Feature): Plan {
  return PLAN_ORDER.find((p) => can(p, feature)) ?? "business";
}

/** True when `plan` is at least `other`. */
export function planAtLeast(plan: Plan, other: Plan): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK[other];
}

/** Normalizes an untrusted metadata value to a known plan. */
export function normalizePlan(value: unknown): Plan | null {
  return value === "pro" || value === "business" || value === "free" ? value : null;
}
