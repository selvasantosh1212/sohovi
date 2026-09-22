import "server-only";
import { cache } from "react";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import type { Plan } from "./limits";
import {
  can,
  minPlanFor,
  normalizePlan,
  FEATURE_LABELS,
  PLAN_LABELS,
  type Feature,
} from "./features";

export type { Feature } from "./features";
export { can, minPlanFor, planAtLeast, FEATURE_LABELS, PLAN_LABELS } from "./features";

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
    super(`${FEATURE_LABELS[feature]} is available on the ${PLAN_LABELS[requiredPlan]} plan.`);
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
