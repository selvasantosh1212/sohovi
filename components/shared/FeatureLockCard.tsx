import Link from "next/link";
import { Lock } from "lucide-react";
import { FEATURE_LABELS, PLAN_LABELS, minPlanFor, type Feature } from "@/lib/plans/features";

/**
 * The server-rendered counterpart to `PlanGate`.
 *
 * `PlanGate` resolves the plan in the browser from the *user's* Clerk
 * metadata, which cannot see an organization-level plan. Server components
 * should decide with `hasFeature()` — which is scope-aware — and render this
 * when the answer is no.
 */
export function FeatureLockCard({
  feature,
  description,
}: {
  feature: Feature;
  description?: string;
}) {
  const planLabel = PLAN_LABELS[minPlanFor(feature)];

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
          {description ??
            `${FEATURE_LABELS[feature]} is available on the ${planLabel} plan. Upgrade to unlock it.`}
        </p>
      </div>
      <Link
        href="/dashboard/billing"
        className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white hover:opacity-90 transition-opacity"
        style={{ background: "#1A1A2E" }}
      >
        Upgrade
      </Link>
    </div>
  );
}
