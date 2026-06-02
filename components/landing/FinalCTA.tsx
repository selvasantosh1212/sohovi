"use client";

import Link from "next/link";

export function FinalCTA() {
  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "#FFE439" }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center space-y-8 relative">
        <div className="space-y-4">
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            Start measuring your data quality today.
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "rgba(10,10,10,0.65)" }}>
            Free forever for individual use. Pro plans from $29/month when you need more.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center font-semibold px-8 py-3 text-base transition-all text-white"
            style={{ background: "#0A0A0A", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#2A2A2E"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A"; }}
          >
            Start for Free →
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center font-semibold px-8 py-3 text-base transition-all"
            style={{ border: "1.5px solid rgba(10,10,10,0.25)", color: "#0A0A0A", background: "transparent", borderRadius: "12px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,10,10,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            View Pricing
          </Link>
        </div>

        <p className="text-sm" style={{ color: "rgba(10,10,10,0.5)" }}>
          No credit card required &nbsp;·&nbsp; 100% browser-based &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </section>
  );
}
