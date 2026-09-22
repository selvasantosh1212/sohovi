"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import type { Plan } from "@/lib/plans/limits";
import {
  can,
  minPlanFor,
  planAtLeast,
  FEATURE_LABELS,
  PLAN_LABELS,
  type Feature,
} from "@/lib/plans/features";

interface PlanGateProps {
  /**
   * The feature being gated, as a key of `PlanLimits`. The required plan is
   * derived from the plan config, so pricing and gating cannot drift apart.
   */
  feature?: Feature;
  /**
   * Minimum plan required to view `children`.
   *
   * @deprecated Pass `feature` instead — a raw plan name here is a second
   * source of truth alongside `PLAN_LIMITS`, which is what let three Team
   * features ship ungated. Retained so existing call sites keep working
   * while they migrate.
   */
  minPlan?: "pro" | "business";
  /** Overrides the label derived from `feature`. Required when only `minPlan` is given. */
  featureLabel?: string;
  /** Override the default lock message. */
  description?: string;
  /** Rendered instead of the default lock card when access is denied. Pass `null` to render nothing. */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PlanGate({
  feature,
  minPlan,
  featureLabel,
  description,
  fallback,
  children,
}: PlanGateProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const plan = (user?.publicMetadata?.plan as Plan | undefined) ?? "free";

  const hasAccess = feature ? can(plan, feature) : planAtLeast(plan, minPlan ?? "pro");
  if (hasAccess) return <>{children}</>;
  if (fallback !== undefined) return <>{fallback}</>;

  const requiredPlan = feature ? minPlanFor(feature) : minPlan ?? "pro";
  const planLabel = PLAN_LABELS[requiredPlan];
  const label = featureLabel ?? (feature ? FEATURE_LABELS[feature] : "This feature");

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Lock className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-800">{planLabel} Plan Required</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {description ?? `${label} is available on the ${planLabel} plan. Upgrade to unlock it.`}
        </p>
      </div>
      <div className="pt-1 flex items-center justify-center gap-3">
        <span className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-slate-300 text-slate-500">
          Current plan: {plan}
        </span>
        <Link
          href="/dashboard/billing"
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white hover:opacity-90 transition-opacity"
          style={{ background: "#1A1A2E" }}
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
