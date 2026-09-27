/**
 * Plan configuration only — no imports, and in particular nothing from
 * `@clerk/nextjs/server`. `features.ts` reads this file and is imported by
 * client components, so a server-only import here would break the client
 * bundle. Plan *resolution* lives in `entitlements.ts`.
 */
export type Plan = "free" | "pro" | "business";

/**
 * The single source of truth for what each plan includes.
 *
 * Numeric keys are quotas, enforced in the server actions that create the
 * thing being counted. Boolean keys are feature flags — read them through
 * `lib/plans/entitlements.ts` (`can`, `hasFeature`, `requireFeature`, and the
 * `PlanGate` component) rather than branching on plan names, so that pricing
 * copy, UI gating and server enforcement can never drift apart.
 */
export interface PlanLimits {
  // ---- Quotas -------------------------------------------------------------
  maxAssets: number;
  maxRulesPerAsset: number;
  maxBusinessUnits: number;
  historyDays: number;

  // ---- Feature flags ------------------------------------------------------
  aiSuggestions: boolean;
  workflows: boolean;
  alerts: boolean;
  pdfExport: boolean;
  pii: boolean;
  sandbox: boolean;
  remediation: boolean;
  crossColumnValidation: boolean;
  /** The catalog / business-unit scoring views: breakdown tables and rollup detail. */
  catalogScoring: boolean;
  connectors: boolean;
  /** Column-level source and transformation notes ("lineage & context metadata"). */
  columnNotes: boolean;
  /** Alert notifications delivered by email. */
  alertEmail: boolean;
  /** Alert notifications delivered to a Slack webhook. */
  alertSlack: boolean;
  /** Keyed source-vs-target reconciliation inside an asset. */
  reconciliation: boolean;
  /** Fuzzy (near-miss) key matching within reconciliation. */
  fuzzyMatching: boolean;
  /** In-product de-identification and the catalog PII register. */
  privacyStudio: boolean;
  /** Data contracts and the vendor file acceptance gate. */
  dataContracts: boolean;
  /** Portfolio health: trend, worst assets, freshness SLA. */
  portfolioHealth: boolean;
  /** The portfolio view rolled up across more than one business unit. */
  multiBusinessUnitPortfolio: boolean;
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
    columnNotes: false,
    alertEmail: false,
    alertSlack: false,
    reconciliation: false,
    fuzzyMatching: false,
    privacyStudio: false,
    dataContracts: false,
    portfolioHealth: false,
    multiBusinessUnitPortfolio: false,
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
    columnNotes: false,
    alertEmail: true,
    alertSlack: false,
    reconciliation: false,
    fuzzyMatching: false,
    privacyStudio: false,
    dataContracts: false,
    portfolioHealth: true,
    multiBusinessUnitPortfolio: false,
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
    columnNotes: true,
    alertEmail: true,
    alertSlack: true,
    reconciliation: true,
    fuzzyMatching: true,
    privacyStudio: true,
    dataContracts: true,
    portfolioHealth: true,
    multiBusinessUnitPortfolio: true,
  },
};
