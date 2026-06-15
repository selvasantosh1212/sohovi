"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import type { Plan } from "@/lib/plans/limits";

const PLAN_RANK: Record<Plan, number> = { free: 0, pro: 1, business: 2 };

interface PlanGateProps {
  /** Minimum plan required to view `children`. */
  minPlan: "pro" | "business";
  /** Human-readable feature name, used in the default lock message. */
  feature: string;
  /** Override the default lock message. */
  description?: string;
  /** Rendered instead of the default lock card when access is denied. Pass `null` to render nothing. */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PlanGate({ minPlan, feature, description, fallback, children }: PlanGateProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const plan = (user?.publicMetadata?.plan as Plan | undefined) ?? "free";
  const hasAccess = PLAN_RANK[plan] >= PLAN_RANK[minPlan];

  if (hasAccess) return <>{children}</>;
  if (fallback !== undefined) return <>{fallback}</>;

  const planLabel = minPlan === "business" ? "Business" : "Pro";

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
          {description ?? `${feature} is available on the ${planLabel} plan. Upgrade to unlock it.`}
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
