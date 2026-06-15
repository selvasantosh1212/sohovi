"use client";

import { useState } from "react";
import { Loader2, CreditCard, Check } from "lucide-react";
import type { Plan } from "@/lib/plans/limits";

const PLAN_INFO: Record<Plan, { name: string; description: string }> = {
  free: { name: "Free", description: "5 data assets, 5 rules per asset, 7-day run history." },
  pro: { name: "Pro", description: "Unlimited assets & rules, AI suggestions, alerts, workflows, 90-day run history." },
  business: { name: "Business", description: "Everything in Pro plus business units, rule sandbox, remediation, and unlimited run history." },
};

const UPGRADE_PLANS: {
  key: "pro" | "business";
  name: string;
  monthly: string;
  annual: string;
  features: string[];
}[] = [
  {
    key: "pro",
    name: "Pro",
    monthly: "$29/mo",
    annual: "$23/mo billed annually ($276/yr)",
    features: [
      "Unlimited data assets & rules",
      "AI rule suggestions",
      "Alerts & workflow automation",
      "PDF/Excel report export",
      "90-day run history",
      "PII detection",
    ],
  },
  {
    key: "business",
    name: "Business",
    monthly: "$59/mo",
    annual: "$49/mo billed annually ($588/yr)",
    features: [
      "Everything in Pro",
      "Unlimited business units",
      "Rule sandbox & remediation",
      "Cross-column validations",
      "Catalog-level DQ scoring",
      "Unlimited run history",
    ],
  },
];

interface Props {
  plan: Plan;
}

export function BillingClient({ plan }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  async function handleUpgrade(planKey: "pro" | "business") {
    const interval = isAnnual ? "annual" : "monthly";
    setLoading(`${planKey}_${interval}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, interval }),
      });
      if (!res.headers.get("content-type")?.includes("application/json")) {
        console.error("[checkout] unexpected non-JSON response:", res.status);
        setLoading(null);
        return;
      }
      const data = await res.json();
      if (!res.ok || typeof data.url !== "string" || !data.url) {
        console.error("[checkout] failed:", res.status, data);
        setLoading(null);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error("[checkout] error:", error);
      setLoading(null);
    }
  }

  async function handleManageBilling() {
    setLoading("manage");
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      if (!res.headers.get("content-type")?.includes("application/json")) {
        console.error("[billing-portal] unexpected non-JSON response:", res.status);
        setLoading(null);
        return;
      }
      const data = await res.json();
      if (!res.ok || typeof data.url !== "string" || !data.url) {
        console.error("[billing-portal] failed:", res.status, data);
        setLoading(null);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error("[billing-portal] error:", error);
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="rounded-[16px] border border-[#EEF0F3] bg-white px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Current Plan</p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#0A0A0F" }}>{PLAN_INFO[plan].name}</p>
          <p className="text-sm text-slate-500 mt-1 max-w-md">{PLAN_INFO[plan].description}</p>
        </div>
        {plan !== "free" && (
          <button
            onClick={handleManageBilling}
            disabled={loading === "manage"}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: "#1A1A2E" }}
          >
            {loading === "manage" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Manage Billing
          </button>
        )}
      </div>

      {/* Upgrade options */}
      {plan !== "business" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-[15px] font-semibold text-slate-800">Upgrade your plan</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: isAnnual ? "#8A8A90" : "#0A0A0A" }}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-10 h-5 rounded-full transition-colors duration-200"
                style={{ background: isAnnual ? "#0A0A0A" : "#E9E9EC" }}
                aria-label="Toggle annual billing"
                aria-pressed={isAnnual}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  style={{ left: isAnnual ? "calc(100% - 1.125rem)" : "0.125rem" }}
                />
              </button>
              <span className="text-xs font-medium" style={{ color: isAnnual ? "#0A0A0A" : "#8A8A90" }}>Annual</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {UPGRADE_PLANS.filter((p) => p.key !== plan).map((p) => {
              const interval = isAnnual ? "annual" : "monthly";
              const isLoading = loading === `${p.key}_${interval}`;
              return (
                <div key={p.key} className="rounded-[16px] border border-[#EEF0F3] bg-white p-5 space-y-3">
                  <div>
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-sm text-slate-500">{isAnnual ? p.annual : p.monthly}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#00C9A7" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(p.key)}
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ background: "#1A1A2E" }}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Upgrade to {p.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
