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
    <section className="py-24" style={{ background: "var(--cream)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--terracotta)" }}>
            The Problem
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "var(--ink)" }}
          >
            Most data quality tools{" "}
            <em className="serif-accent" style={{ color: "var(--terracotta-deep)" }}>weren&apos;t built</em>
            {" "}for your team.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--ink-mute)" }}>
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
                    border: "1px solid var(--hair)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.12)",
                  }}
                >
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: "var(--cream-deep)", border: "1px solid var(--hair-strong)" }}>
                    <Icon className="w-5 h-5" style={{ color: "var(--ink-mute)" }} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold" style={{ color: "var(--ink)" }}>{pain.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-mute)" }}>{pain.body}</p>
                  </div>
                </div>
              );
            })}
            <p className="text-center text-sm pt-2" style={{ color: "var(--ink-mute)", opacity: 0.6 }}>There&apos;s a different way.</p>
          </div>

          {/* Sohovi contrast */}
          <div className="lg:col-span-2">
            <div
              className="rounded-[24px] p-8 space-y-6 sticky top-24"
              style={{
                background: "var(--sage-soft)",
                border: "2px solid var(--sage)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white uppercase tracking-[0.1em]" style={{ background: "var(--terracotta)" }}>
                  The Sohovi Way
                </span>
                <div className="mt-5">
                  <span className="text-5xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>$0</span>
                  <span className="ml-2 text-sm" style={{ color: "var(--ink-mute)" }}>/ month to get started</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "var(--ink-mute)" }}>Pro plans from $29/month when you need more</p>
              </div>

              <ul className="space-y-3">
                {sohovi.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "var(--ink-soft)" }}>
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--terracotta)" }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="block w-full text-center font-semibold py-3 rounded-full text-sm text-white transition-colors"
                style={{ background: "var(--terracotta)" }}
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
