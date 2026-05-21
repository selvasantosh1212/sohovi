"use client";

import Link from "next/link";
import { Target, BarChart3, Package, Users, Landmark, Briefcase } from "lucide-react";

const useCases = [
  {
    icon: Target,
    title: "Marketing & Revenue Ops",
    body: "Clean CRM exports, lead lists, and email files before campaigns. Catch invalid emails, duplicate contacts, and missing fields that tank deliverability and waste ad spend.",
  },
  {
    icon: BarChart3,
    title: "Analytics & BI Teams",
    body: "Validate datasets before they feed your dashboards. Score every file for completeness, uniqueness, and consistency — so your reports and KPIs are built on clean, trustworthy data.",
  },
  {
    icon: Package,
    title: "E-commerce & Product",
    body: "Audit product catalog exports for missing descriptions, invalid prices, and duplicate SKUs. Find issues before they reach customers or break your PIM or ERP sync.",
  },
  {
    icon: Users,
    title: "HR & People Operations",
    body: "Verify HRIS exports and applicant data are complete, consistently formatted, and free of duplicates before syncing to payroll, ATS, or benefits platforms.",
  },
  {
    icon: Landmark,
    title: "Finance & Compliance",
    body: "Validate transaction records, expense reports, and financial exports for accuracy and completeness. Generate explainable DQ scores to support audits and regulatory reporting.",
  },
  {
    icon: Briefcase,
    title: "Freelancers & Consultants",
    body: "Deliver clean data to clients as a standard part of every engagement. Run a data quality audit in minutes, export a score report, and add credibility to every deliverable.",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--terracotta)" }}>
            Use Cases
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "var(--ink)" }}
          >
            Built for{" "}
            <em className="serif-accent" style={{ color: "var(--terracotta-deep)" }}>every</em>
            {" "}data team.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--ink-mute)" }}>
            From marketing to finance, here&apos;s how teams use Sohovi to improve data quality, catch
            errors before they spread, and deliver cleaner data — without writing a single line of code.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="rounded-[24px] p-6 space-y-4 transition-all duration-200"
                style={{
                  background: "#fff",
                  border: "1px solid var(--hair)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.08)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 24px -8px rgba(26,26,46,0.14)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.08)"; }}
              >
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{ background: "var(--terracotta-soft)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--terracotta)" }} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold" style={{ color: "var(--ink)" }}>{uc.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-mute)" }}>{uc.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-start">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center text-base font-semibold px-7 py-3 rounded-full text-white transition-colors"
            style={{ background: "var(--terracotta)" }}
          >
            Start for Free →
          </Link>
        </div>
      </div>
    </section>
  );
}
