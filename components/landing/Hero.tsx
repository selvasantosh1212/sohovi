"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HeroDashboard } from "@/components/landing/HeroDashboard";

export function Hero() {
  const penRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = penRef.current;
    if (!path) return;
    const L = Math.ceil(path.getTotalLength());
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const style = document.createElement("style");
    if (reduced) {
      style.textContent = `.hero-pen path{stroke-dasharray:${L};stroke-dashoffset:0;opacity:1}`;
    } else {
      style.textContent = `
        .hero-pen path{stroke-dasharray:${L};stroke-dashoffset:${L};animation:heroPenDraw 5.4s cubic-bezier(.55,0,.3,1) 1s infinite}
        @keyframes heroPenDraw{
          0%{stroke-dashoffset:${L};opacity:1}
          16%,70%{stroke-dashoffset:0;opacity:1}
          85%,100%{stroke-dashoffset:0;opacity:0}
        }`;
    }
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: "64px", paddingBottom: "40px" }}>
      <div className="mx-auto max-w-[1080px] px-6 relative text-center">
        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full text-[12px] font-semibold" style={{ background: "#F4F4F5", border: "1px solid #E9E9EC" }}>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FFE439", color: "#0A0A0A" }}>NEW</span>
          <span style={{ color: "#5B5B63" }}>AI DQ Rule suggestions, now built in</span>
        </div>

        {/* H1 with pen-strike on "expensive tools" */}
        <h1
          className="font-extrabold leading-[1.02] m-0"
          style={{ fontSize: "clamp(40px, 6.4vw, 80px)", letterSpacing: "-0.045em", color: "#0A0A0A", textWrap: "balance" } as React.CSSProperties}
        >
          You don&apos;t need{" "}
          <span className="hero-strike">
            expensive tools
            <svg
              className="hero-pen"
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={penRef}
                pathLength="100"
                d="M2,11 C58,8 104,13.5 150,10.5 C200,7.5 250,13 298,9.5"
              />
            </svg>
          </span>
          <br />to trust your data quality.
        </h1>

        <p className="mx-auto mt-7 leading-[1.55]" style={{ fontSize: "18px", color: "#5B5B63", maxWidth: "620px", textWrap: "pretty" } as React.CSSProperties}>
          Sohovi is a privacy-first <strong style={{ color: "#0A0A0A", fontWeight: 600 }}>data quality tool</strong> that profiles, scores, and validates your CSV and Excel files entirely in your browser — no setup, no code, no upload.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 text-[17px] font-semibold text-white transition-all"
            style={{ background: "#0A0A0A", borderRadius: "12px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#2A2A2E"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A"; }}
          >
            Run Data Profiling & Data Quality checks for free →
          </Link>
        </div>

        {/* Reassurance chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {["No credit card", "Free forever for solo", "Data stays in your browser"].map((t) => (
            <span key={t} className="text-[12px] font-medium px-3 py-1 rounded-full" style={{ color: "#5B5B63", background: "rgba(10,10,10,0.04)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard widget */}
      <div className="mt-14">
        <HeroDashboard />
      </div>
    </section>
  );
}
