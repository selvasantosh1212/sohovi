import { cache } from "react";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { PLAN_LIMITS, type Plan, type PlanLimits } from "./limits";

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
  columnNotes: "Lineage & context metadata",
  alertEmail: "Email alert delivery",
  alertSlack: "Slack alert delivery",
  reconciliation: "Reconciliation",
  fuzzyMatching: "Fuzzy duplicate matching",
  privacyStudio: "Privacy Studio",
  dataContracts: "Data contracts",
  portfolioHealth: "Portfolio health",
};

/** Pure predicate — does `plan` include `feature`? Safe in client components. */
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

function normalizePlan(value: unknown): Plan | null {
  return value === "pro" || value === "business" || value === "free" ? value : null;
}

/**
 * The plan that applies to the caller's active workspace.
 *
 * Data is scoped by `getScopeId()` (orgId ?? userId), so in a team workspace
 * the *organization* is the thing being billed for, not the individual member.
 * We therefore prefer an organization-level plan and fall back to the member's
 * own plan. Billing writes only user metadata today (see the Dodo webhook), so
 * the fallback is the live path and this is behaviour-preserving; setting
 * `publicMetadata.plan` on a Clerk organization is all that is needed to move a
 * team onto a shared plan.
 *
 * Wrapped in React `cache` so repeated checks inside one request are free.
 */
export const getPlanForScope = cache(async (): Promise<Plan> => {
  const { userId, orgId } = await auth();
  if (!userId) return "free";

  if (orgId) {
    try {
      const client = await clerkClient();
      const org = await client.organizations.getOrganization({ organizationId: orgId });
      const orgPlan = normalizePlan(org.publicMetadata?.plan);
      if (orgPlan) return orgPlan;
    } catch (err) {
      // An org lookup failure must never harden into a lockout — fall through
      // to the member's own plan.
      console.error("[entitlements] org plan lookup failed:", err);
    }
  }

  const user = await currentUser();
  return normalizePlan(user?.publicMetadata?.plan) ?? "free";
});

/** Server-side check — does the caller's workspace include `feature`? */
export async function hasFeature(feature: Feature): Promise<boolean> {
  return can(await getPlanForScope(), feature);
}

/** Thrown by `requireFeature` when the caller's plan does not include a feature. */
export class FeatureLockedError extends Error {
  readonly feature: Feature;
  readonly requiredPlan: Plan;

  constructor(feature: Feature) {
    const requiredPlan = minPlanFor(feature);
    super(
      `${FEATURE_LABELS[feature]} is available on the ${PLAN_LABELS[requiredPlan]} plan.`
    );
    this.name = "FeatureLockedError";
    this.feature = feature;
    this.requiredPlan = requiredPlan;
  }
}

/**
 * Server-action guard. Server Functions are public endpoints — hiding a
 * control behind `PlanGate` only hides the UI, so every paid mutation and
 * every paid read must call this before touching data.
 *
 * @throws {FeatureLockedError}
 */
export async function requireFeature(feature: Feature): Promise<Plan> {
  const plan = await getPlanForScope();
  if (!can(plan, feature)) throw new FeatureLockedError(feature);
  return plan;
}
