"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

interface HardCTAProps {
  headline: string;
  body: string;
  bullets?: string[];
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function HardCTA({
  headline,
  body,
  bullets,
  primaryHref = "/sign-up",
  primaryLabel = "Start free in Sohovi",
  secondaryHref = "/#pricing",
  secondaryLabel = "See pricing",
}: HardCTAProps) {
  return (
    <div
      className="rounded-2xl p-8 mt-10"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #0D1B3E 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "rgba(0,201,167,0.15)" }}
        >
          <Zap className="w-4 h-4" style={{ color: "var(--mint)" }} />
        </div>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--mint)" }}>
            Take it further with Sohovi
          </p>
          <h3 className="text-[20px] font-bold text-white leading-snug">{headline}</h3>
        </div>
      </div>

      <p className="text-[14px] mb-4 ml-11" style={{ color: "rgba(255,255,255,0.65)" }}>
        {body}
      </p>

      {bullets && bullets.length > 0 && (
        <ul className="ml-11 mb-6 space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.75)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--mint)" }} />
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="ml-11 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-2.5 rounded-full transition-all"
          style={{ background: "var(--mint)", color: "#0D1B3E" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#00B396"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--mint)"; }}
        >
          {primaryLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex items-center gap-2 text-[14px] font-medium px-5 py-2.5 rounded-full transition-all"
          style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.12)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
        >
          {secondaryLabel}
        </Link>
      </div>

      <p className="ml-11 mt-4 text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
        Free plan available — no credit card required.{" "}
        <Link href="/sign-up" className="underline underline-offset-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          Sign up in 30 seconds
        </Link>
      </p>
    </div>
  );
}
