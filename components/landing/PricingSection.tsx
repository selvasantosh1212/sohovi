"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

interface Plan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  annualTotal: string | null;
  annualSavings: string | null;
  period: string;
  description: string;
  cta: string;
  ctaHref: string;
  planKey: "free" | "pro" | "business";
  trialNote?: string;
  primary: boolean;
  badge?: string;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    annualTotal: null,
    annualSavings: null,
    period: "forever",
    description: "Perfect for individuals exploring data quality.",
    cta: "Get Started Free",
    ctaHref: "/sign-up",
    planKey: "free",
    primary: false,
    features: [
      "5 data assets",
      "Unlimited profiling runs",
      "5 DQ rules per asset",
      "Basic scoring (column + dataset level)",
      "CSV and Excel support",
      "7-day run history",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "$29",
    annualPrice: "$23",
    annualTotal: "$276/yr",
    annualSavings: "Save $72",
    period: "per month",
    description: "For freelancers and small teams who need more power.",
    cta: "Start Free Trial",
    ctaHref: "",
    planKey: "pro",
    primary: true,
    badge: "Most Popular",
    features: [
      "Unlimited data assets",
      "Unlimited DQ rules",
      "Full 10-dimension scoring",
      "AI DQ Rule suggestions",
      "Historical trend charts",
      "Workflows & automation",
      "Alerts & anomaly detection",
      "PDF/Excel report export",
      "90-day run history",
      "PII detection",
    ],
  },
  {
    name: "Business",
    monthlyPrice: "$59",
    annualPrice: "$49",
    annualTotal: "$588/yr",
    annualSavings: "Save $120",
    period: "per month",
    description: "For data teams managing multiple catalogs and business units.",
    cta: "Start 7-Day Free Trial",
    ctaHref: "",
    planKey: "business",
    trialNote: "7-day free trial · no credit card required",
    primary: false,
    features: [
      "Everything in Pro",
      "Unlimited business units",
      "Catalog-level DQ scoring",
      "Cross-column validations",
      "Remediation + export cleaned file",
      "Rule testing sandbox",
      "Ownership & stewardship fields",
      "Lineage & context metadata",
      "Priority support",
      "Unlimited run history",
    ],
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  async function handlePaidPlan(planKey: "pro" | "business") {
    const interval = isAnnual ? "annual" : "monthly";
    setLoadingPlan(`${planKey}_${interval}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, interval }),
      });

      if (res.status === 401) {
        router.push("/sign-up");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#8A8A90" }}>
            Pricing
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            Simple, transparent pricing.
          </h2>
          <p className="text-lg" style={{ color: "#8A8A90" }}>
            Start free. Scale when you need to. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm font-medium" style={{ color: isAnnual ? "#8A8A90" : "#0A0A0A" }}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
              style={{ background: isAnnual ? "#0A0A0A" : "#E9E9EC" }}
              aria-label="Toggle annual billing"
              aria-pressed={isAnnual}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                style={{ left: isAnnual ? "calc(100% - 1.375rem)" : "0.125rem" }}
              />
            </button>
            <span className="text-sm font-medium" style={{ color: isAnnual ? "#0A0A0A" : "#8A8A90" }}>Annual</span>
            {isAnnual && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FFE439", color: "#0A0A0A" }}>
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const showAnnualNote = isAnnual && plan.annualTotal;
            const isPrimary = plan.primary;
            const interval = isAnnual ? "annual" : "monthly";
            const isLoading = loadingPlan === `${plan.planKey}_${interval}`;

            return (
              <div
                key={plan.name}
                className="relative rounded-[24px] p-8"
                style={
                  isPrimary
                    ? { background: "#0A0A0A", border: "1px solid #0A0A0A", boxShadow: "0 18px 40px -22px rgba(10,10,10,0.25)" }
                    : { background: "#fff", border: "1px solid #E9E9EC", boxShadow: "0 1px 2px rgba(10,10,10,.03), 0 10px 28px -18px rgba(10,10,10,.12)" }
                }
              >
                {isPrimary && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-bold px-3.5 py-1.5 rounded-full" style={{ background: "#0A0A0A", color: "#fff", whiteSpace: "nowrap" }}>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 space-y-2">
                  <h3 className="text-lg font-bold" style={{ color: isPrimary ? "#fff" : "#0A0A0A" }}>{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold tracking-tight" style={{ color: isPrimary ? "#fff" : "#0A0A0A" }}>
                      {price}
                    </span>
                    <span className="mb-1 text-sm" style={{ color: isPrimary ? "rgba(255,255,255,0.45)" : "#8A8A90" }}>/{plan.period}</span>
                  </div>
                  {showAnnualNote && (
                    <p className="text-sm font-medium" style={{ color: isPrimary ? "#FFE439" : "#5B5B63" }}>
                      {plan.annualTotal} billed annually — {plan.annualSavings}
                    </p>
                  )}
                  <p className="text-sm" style={{ color: isPrimary ? "rgba(255,255,255,0.5)" : "#8A8A90" }}>{plan.description}</p>
                </div>

                {plan.planKey === "free" ? (
                  <Link
                    href="/sign-up"
                    className={`w-full block text-center font-semibold py-2.5 text-sm transition-colors ${plan.trialNote ? "mb-1.5" : "mb-7"}`}
                    style={{ background: "#F4F4F5", color: "#0A0A0A", border: "1px solid #E9E9EC", borderRadius: "12px" }}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePaidPlan(plan.planKey as "pro" | "business")}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 text-sm transition-colors ${plan.trialNote ? "mb-1.5" : "mb-7"} disabled:opacity-70 disabled:cursor-not-allowed`}
                    style={
                      isPrimary
                        ? { background: "#FFE439", color: "#0A0A0A", borderRadius: "12px" }
                        : { background: "#F4F4F5", color: "#0A0A0A", border: "1px solid #E9E9EC", borderRadius: "12px" }
                    }
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {plan.cta}
                  </button>
                )}
                {plan.trialNote && (
                  <p className="text-center text-[11px] mb-5" style={{ color: isPrimary ? "rgba(255,255,255,0.4)" : "#8A8A90" }}>{plan.trialNote}</p>
                )}

                <ul className="space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: isPrimary ? "var(--mint)" : "#37376B" }} />
                      <span className="text-sm" style={{ color: isPrimary ? "rgba(255,255,255,0.75)" : "#5B5B63" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-sm mt-10" style={{ color: "#8A8A90", opacity: 0.8 }}>
          All plans include 100% client-side processing — your data never leaves your browser.
        </p>
      </div>
    </section>
  );
}
