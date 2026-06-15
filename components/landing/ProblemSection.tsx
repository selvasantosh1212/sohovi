"use client";

import Link from "next/link";
import { Clock, ArrowUpRight, Building2, Check } from "lucide-react";

const pains = [
  {
    icon: Clock,
    title: "Months to first value",
    body: "Traditional tools require scoping, procurement, consultants, and months of implementation before a single dataset is scored.",
  },
  {
    icon: ArrowUpRight,
    title: "Data uploaded to third-party servers",
    body: "Most DQ platforms require you to connect data sources directly or upload files to their cloud — before you have established trust.",
  },
  {
    icon: Building2,
    title: "Pricing designed for 1,000-person orgs",
    body: "Annual contracts, per-seat licensing, and module add-ons make professional data quality inaccessible to teams that just need to trust their spreadsheets.",
  },
];

const sohovi = [
  "Works in 30 seconds — no setup, no onboarding call",
  "All processing runs inside your browser. No data ever sent.",
  "Full 10-dimension DQ scoring from day one",
  "Transparent pricing — what you see is what you pay",
  "Built for teams of 1 to 50",
];

export function ProblemSection() {
  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#5B5B63" }}>
            The Problem
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            Most data quality tools weren&apos;t built for your team.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
            The traditional approach to data quality is slow, expensive, and assumes you have a dedicated IT department. It also requires your data to travel to external servers before you&apos;ve run a single check.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Pain cards */}
          <div className="lg:col-span-3 space-y-4">
            {pains.map((pain) => {
              const Icon = pain.icon;
              return (
                <div
                  key={pain.title}
                  className="rounded-[24px] p-6 flex gap-5 items-start"
                  style={{
                    background: "#fff",
                    border: "1px solid #E9E9EC",
                    boxShadow: "0 1px 2px rgba(10,10,10,.03), 0 10px 28px -18px rgba(10,10,10,.12)",
                  }}
                >
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "#F4F4F5", border: "1px solid #DBDBDF" }}>
                    <Icon className="w-5 h-5" style={{ color: "#5B5B63" }} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold" style={{ color: "#0A0A0A" }}>{pain.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#5B5B63" }}>{pain.body}</p>
                  </div>
                </div>
              );
            })}
            <p className="text-center text-sm pt-2" style={{ color: "#5B5B63", opacity: 0.8 }}>There&apos;s a different way.</p>
          </div>

          {/* Sohovi contrast */}
          <div className="lg:col-span-2">
            <div
              className="rounded-[24px] p-8 space-y-6 sticky top-24"
              style={{
                background: "#BDBDDA",
                border: "1px solid #E9E9EC",
              }}
            >
              <div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.1em]" style={{ background: "#FFE439", color: "#0A0A0A" }}>
                  The Sohovi Way
                </span>
                <div className="mt-5">
                  <span className="text-5xl font-bold tracking-tight" style={{ color: "#0A0A0A" }}>$0</span>
                  <span className="ml-2 text-sm" style={{ color: "#37376B" }}>/ month to get started</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "#37376B" }}>Pro plans from $29/month when you need more</p>
              </div>

              <ul className="space-y-3">
                {sohovi.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#0A0A0A" }}>
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#37376B" }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="block w-full text-center font-semibold py-3 text-sm text-white transition-colors"
                style={{ background: "#0A0A0A", borderRadius: "12px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#2A2A2E"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A"; }}
              >
                Start Free — No Credit Card
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
