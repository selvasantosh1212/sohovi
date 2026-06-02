"use client";

import Link from "next/link";
import { Upload, ScanSearch, ListChecks, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your file",
    time: "5 sec",
    body: "Drop a CSV or Excel file. Sohovi reads it locally — nothing is sent anywhere.",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Profile your columns",
    time: "10–30 sec",
    body: "Automatic deep profiling of every column. Null rates, types, PII flags, outliers.",
  },
  {
    number: "03",
    icon: ListChecks,
    title: "Set your quality rules",
    time: "1–2 min",
    body: "Accept ML suggestions or write your own. Regex, ranges, uniqueness, lookups.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Score and track",
    time: "Ongoing",
    body: "Run your rules. Get a DQ score. Come back next week and watch it improve.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#8A8A90" }}>
            How It Works
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            From file to insight in four steps.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#8A8A90" }}>
            No integration setup. No account configuration. Just your file and your answers.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="rounded-[24px] p-6 space-y-4"
                style={{ background: "#F4F4F5", border: "1px solid #E9E9EC" }}
              >
                {/* Step number + time */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest" style={{ color: "#8A8A90", opacity: 0.6 }}>{step.number}</span>
                  <span className="text-[12px] font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(10,10,10,0.05)", color: "#8A8A90" }}>
                    {step.time}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: "#fff", border: "1px solid #DBDBDF" }}>
                  <Icon className="w-5 h-5" style={{ color: "#37376B" }} />
                </div>

                {/* Copy */}
                <div className="space-y-1.5">
                  <h3 className="font-semibold" style={{ color: "#0A0A0A" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#5B5B63" }}>{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-start">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center text-base font-semibold px-7 py-3 text-white transition-colors"
            style={{ background: "#0A0A0A", borderRadius: "12px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#2A2A2E"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A"; }}
          >
            Start for Free →
          </Link>
        </div>
      </div>
    </section>
  );
}
