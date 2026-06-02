"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const dimensions = [
  { label: "Completeness", score: 94 },
  { label: "Validity",     score: 88 },
  { label: "Uniqueness",   score: 72 },
  { label: "Accuracy",     score: 95 },
  { label: "Consistency",  score: 81 },
  { label: "Integrity",    score: 66 },
];

const sparkPoints = [62, 70, 68, 75, 80, 77, 84, 87];

function Sparkline() {
  const W = 120, H = 40;
  const min = Math.min(...sparkPoints), max = Math.max(...sparkPoints);
  const xs = sparkPoints.map((_, i) => (i / (sparkPoints.length - 1)) * W);
  const ys = sparkPoints.map((v) => H - ((v - min) / (max - min || 1)) * (H - 6) - 3);
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mint)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--mint)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <path d={line} fill="none" stroke="var(--mint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill="var(--mint)" />
    </svg>
  );
}

function ScoreArc({ score }: { score: number }) {
  const r = 38, cx = 50, cy = 54;
  const C = 2 * Math.PI * r;
  const arc = C * 0.75;
  const off = arc - (arc * score) / 100;
  return (
    <svg viewBox="0 0 100 100" width="96" height="96" aria-label={`Score ${score} out of 100`}>
      <title>{`DQ Score ${score}/100`}</title>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E9E9EC" strokeWidth="6"
        strokeDasharray={`${arc} ${C}`} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--mint)" strokeWidth="6"
        strokeDasharray={`${arc} ${C}`} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        fill="#0A0A0A" fontWeight="700" fontSize="22">{score}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
        fill="#8A8A90" fontSize="9">/100</text>
    </svg>
  );
}

function DimensionBars({ animate }: { animate: boolean }) {
  return (
    <div className="flex flex-col gap-[5px]">
      {dimensions.map(({ label, score }, i) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-[10px] w-[76px] shrink-0" style={{ color: "#8A8A90" }}>{label}</span>
          <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: "#E9E9EC" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: animate ? `${score}%` : "0%",
                background: score >= 85 ? "var(--mint)" : score >= 70 ? "#F59E0B" : "#EF4444",
                transitionDuration: "0.9s",
                transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
          <span className="text-[10px] font-semibold w-[20px] text-right" style={{ color: "#0A0A0A" }}>{score}</span>
        </div>
      ))}
    </div>
  );
}

function HeroDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimate(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-[20px] overflow-hidden"
      style={{
        boxShadow: "0 1px 2px rgba(10,10,10,.04), 0 30px 70px -34px rgba(10,10,10,.22)",
        border: "1px solid #E9E9EC",
      }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#0A0A0A" }}>
        <div className="flex gap-1.5">
          {["#FF5C7A", "#FFC53D", "#22E586"].map(c => (
            <div key={c} className="w-[10px] h-[10px] rounded-full" style={{ background: c }} aria-hidden />
          ))}
        </div>
        <span className="font-mono text-[11px] ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          app.sohovi.com/dashboard
        </span>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(0,201,167,0.15)", color: "var(--mint)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden />
          Live
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4" style={{ background: "#F4F4F5" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-mono font-bold text-[15px]" style={{ color: "#0A0A0A" }}>customer_data.csv</div>
            <div className="font-mono text-[10px] mt-0.5" style={{ color: "#8A8A90" }}>128,447 rows · 23 columns · Profiled 3s ago</div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: "var(--mint)", color: "#0A0A0A" }}>
            DQ Score 87
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1.1fr 1fr 0.9fr" }}>
          {/* Col 1: Score gauge */}
          <div className="rounded-[16px] p-3 flex flex-col items-center justify-center gap-1" style={{ background: "#fff", border: "1px solid #E9E9EC" }}>
            <ScoreArc score={87} />
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8A8A90" }}>Overall Health</div>
          </div>

          {/* Col 2: Dimension bars */}
          <div className="rounded-[16px] p-3" style={{ background: "#fff", border: "1px solid #E9E9EC" }}>
            <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#8A8A90" }}>Dimensions</div>
            <DimensionBars animate={animate} />
          </div>

          {/* Col 3: Sparkline + alert + upload */}
          <div className="flex flex-col gap-2">
            <div className="rounded-[14px] p-2.5" style={{ background: "#fff", border: "1px solid #E9E9EC" }}>
              <div className="text-[9px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: "#8A8A90" }}>8-week trend</div>
              <Sparkline />
            </div>
            <div className="rounded-[14px] p-2.5" style={{ background: "rgba(45,127,249,0.08)", border: "1px solid rgba(45,127,249,0.2)" }}>
              <div className="text-[10px] font-bold" style={{ color: "#1B63E6" }}>⚠ Null rate spike</div>
              <div className="font-mono text-[9px] mt-0.5" style={{ color: "#1B63E6", opacity: 0.75 }}>phone col · 12.4%</div>
            </div>
            <div className="rounded-[14px] p-2.5" style={{ background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)" }}>
              <div className="text-[10px] font-bold" style={{ color: "#00876F" }}>🔒 PII detected</div>
              <div className="font-mono text-[9px] mt-0.5" style={{ color: "#00876F", opacity: 0.75 }}>email, phone columns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          <br />to understand your data.
        </h1>

        <p className="mx-auto mt-7 leading-[1.55]" style={{ fontSize: "18px", color: "#5B5B63", maxWidth: "620px", textWrap: "pretty" } as React.CSSProperties}>
          Know exactly where your data is broken. Get instant data quality insights in your browser — no setup, no code, no months-long onboarding.
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
            Get started for free →
          </Link>
        </div>

        {/* Reassurance chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {["No credit card", "Free forever for solo", "Data stays in your browser"].map((t) => (
            <span key={t} className="text-[12px] font-medium px-3 py-1 rounded-full" style={{ color: "#8A8A90", background: "rgba(10,10,10,0.04)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard widget */}
      <div className="mx-auto max-w-[1100px] px-6 mt-14 relative">
        <HeroDashboard />
      </div>
    </section>
  );
}
