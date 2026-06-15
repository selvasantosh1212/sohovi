import { auth, currentUser } from "@clerk/nextjs/server";

export type Plan = "free" | "pro" | "business";

export interface PlanLimits {
  maxAssets: number;
  maxRulesPerAsset: number;
  maxBusinessUnits: number;
  historyDays: number;
  aiSuggestions: boolean;
  workflows: boolean;
  alerts: boolean;
  pdfExport: boolean;
  pii: boolean;
  sandbox: boolean;
  remediation: boolean;
  crossColumnValidation: boolean;
  catalogScoring: boolean;
  connectors: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxAssets: 5,
    maxRulesPerAsset: 5,
    maxBusinessUnits: 1,
    historyDays: 7,
    aiSuggestions: false,
    workflows: false,
    alerts: false,
    pdfExport: false,
    pii: false,
    sandbox: false,
    remediation: false,
    crossColumnValidation: false,
    catalogScoring: false,
    connectors: false,
  },
  pro: {
    maxAssets: Infinity,
    maxRulesPerAsset: Infinity,
    maxBusinessUnits: 1,
    historyDays: 90,
    aiSuggestions: true,
    workflows: true,
    alerts: true,
    pdfExport: true,
    pii: true,
    sandbox: false,
    remediation: false,
    crossColumnValidation: false,
    catalogScoring: false,
    connectors: false,
  },
  business: {
    maxAssets: Infinity,
    maxRulesPerAsset: Infinity,
    maxBusinessUnits: Infinity,
    historyDays: Infinity,
    aiSuggestions: true,
    workflows: true,
    alerts: true,
    pdfExport: true,
    pii: true,
    sandbox: true,
    remediation: true,
    crossColumnValidation: true,
    catalogScoring: true,
    connectors: true,
  },
};

/** Server-side helper — returns the current user's plan from Clerk publicMetadata. */
export async function getUserPlan(): Promise<Plan> {
  const { userId } = await auth();
  if (!userId) return "free";
  const user = await currentUser();
  const plan = user?.publicMetadata?.plan as Plan | undefined;
  return plan === "pro" || plan === "business" ? plan : "free";
}
