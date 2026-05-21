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
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--hair-strong)" strokeWidth="6"
        strokeDasharray={`${arc} ${C}`} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--mint)" strokeWidth="6"
        strokeDasharray={`${arc} ${C}`} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        fill="var(--ink)" fontWeight="700" fontSize="22">{score}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
        fill="var(--ink-mute)" fontSize="9">/100</text>
    </svg>
  );
}

function DimensionBars({ animate }: { animate: boolean }) {
  return (
    <div className="flex flex-col gap-[5px]">
      {dimensions.map(({ label, score }, i) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-[10px] w-[76px] shrink-0" style={{ color: "var(--ink-mute)" }}>{label}</span>
          <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: "var(--hair-strong)" }}>
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
          <span className="text-[10px] font-semibold w-[20px] text-right" style={{ color: "var(--ink)" }}>{score}</span>
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
      style={{ boxShadow: "0 30px 60px -20px rgba(26,26,46,0.18), 0 12px 30px -12px rgba(26,26,46,0.1)", border: "1px solid var(--hair)" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "var(--ink)" }}>
        <div className="flex gap-1.5">
          {["#FF5F57", "#FEBC2E", "#27C840"].map(c => (
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
      <div className="p-4" style={{ background: "var(--cream-deep)" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-mono font-bold text-[15px]" style={{ color: "var(--ink)" }}>customer_data.csv</div>
            <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--ink-mute)" }}>128,447 rows · 23 columns · Profiled 3s ago</div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: "var(--mint)", color: "var(--ink)" }}>
            DQ Score 87
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1.1fr 1fr 0.9fr" }}>
          {/* Col 1: Score gauge */}
          <div className="rounded-[16px] p-3 flex flex-col items-center justify-center gap-1" style={{ background: "#fff", border: "1px solid var(--hair)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
            <ScoreArc score={87} />
            <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--ink-mute)" }}>Overall Health</div>
          </div>

          {/* Col 2: Dimension bars */}
          <div className="rounded-[16px] p-3" style={{ background: "#fff", border: "1px solid var(--hair)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}>
            <div className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--ink-mute)" }}>Dimensions</div>
            <DimensionBars animate={animate} />
          </div>

          {/* Col 3: Sparkline + alert + upload */}
          <div className="flex flex-col gap-2">
            <div className="rounded-[14px] p-2.5" style={{ background: "#fff", border: "1px solid var(--hair)" }}>
              <div className="text-[9px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: "var(--ink-mute)" }}>8-week trend</div>
              <Sparkline />
            </div>
            <div className="rounded-[14px] p-2.5" style={{ background: "var(--terracotta-soft)", border: "1px solid rgba(224,113,80,0.2)" }}>
              <div className="text-[10px] font-bold" style={{ color: "var(--terracotta-deep)" }}>⚠ Null rate spike</div>
              <div className="font-mono text-[9px] mt-0.5" style={{ color: "var(--terracotta-deep)", opacity: 0.75 }}>phone col · 12.4%</div>
            </div>
            <div className="rounded-[14px] p-2.5" style={{ background: "var(--sage-soft)", border: "1px solid var(--sage)" }}>
              <div className="text-[10px] font-bold" style={{ color: "#2D6A4F" }}>🔒 PII detected</div>
              <div className="font-mono text-[9px] mt-0.5" style={{ color: "#2D6A4F", opacity: 0.75 }}>email, phone columns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ paddingTop: "64px", paddingBottom: "40px" }}>
      {/* Soft pastel halos */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 700px 400px at 50% 20%, rgba(255,243,196,0.6), transparent 65%),
            radial-gradient(ellipse 500px 350px at 15% 50%, rgba(221,213,243,0.45), transparent 65%),
            radial-gradient(ellipse 500px 350px at 88% 45%, rgba(212,232,208,0.45), transparent 65%)
          `,
        }}
      />

      <div className="mx-auto max-w-[1080px] px-6 relative text-center">
        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full text-[12px] font-semibold" style={{ background: "var(--terracotta-soft)", border: "1px solid rgba(224,113,80,0.25)" }}>
          <span className="px-1.5 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: "var(--terracotta)" }}>NEW</span>
          <span style={{ color: "var(--terracotta-deep)" }}>AI DQ Rule suggestions, now built in</span>
        </div>

        {/* H1 with italic serif accent */}
        <h1
          className="font-bold leading-[1.04] m-0"
          style={{ fontSize: "clamp(40px, 6.6vw, 84px)", letterSpacing: "-0.035em", color: "var(--ink)" }}
        >
          You don&apos;t need{" "}
          <em className="serif-accent not-italic" style={{ fontStyle: "italic", color: "var(--terracotta-deep)" }}>
            expensive tools
          </em>
          <br />to understand your data.
        </h1>

        <p className="mx-auto mt-7 leading-[1.55]" style={{ fontSize: "19px", color: "var(--ink-soft)", maxWidth: "620px" }}>
          Know exactly where your data is broken. Get instant data quality insights in your browser — no setup, no code, no months-long onboarding.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[16px] font-semibold text-white transition-all"
            style={{ background: "var(--terracotta)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 20px -6px rgba(224,113,80,0.5)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta-deep)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--terracotta)"; }}
          >
            Get started →
          </Link>
        </div>

        {/* Reassurance chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {["No credit card", "Free forever for solo", "Data stays in your browser"].map((t) => (
            <span key={t} className="text-[12px] font-medium px-3 py-1 rounded-full" style={{ color: "var(--ink-mute)", background: "rgba(26,26,46,0.05)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard widget */}
      <div className="mx-auto max-w-[1100px] px-6 mt-14 relative">
        {/* Floating sticker 1 — top-right, butter */}
        <div
          className="absolute -right-2 top-4 z-10 hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold"
          style={{ background: "var(--butter-soft)", border: "1px solid var(--butter)", color: "var(--ink)", transform: "rotate(6deg)", animation: "float 6s ease-in-out infinite" }}
          aria-hidden
        >
          <span>✨</span> profiled in 2.3s
        </div>
        {/* Floating sticker 2 — bottom-left, lavender */}
        <div
          className="absolute -left-2 bottom-8 z-10 hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold"
          style={{ background: "var(--lavender-soft)", border: "1px solid var(--lavender)", color: "var(--ink)", transform: "rotate(-4deg)", animation: "float 9s ease-in-out infinite reverse" }}
          aria-hidden
        >
          <span>🔒</span> zero bytes uploaded
        </div>

        <HeroDashboard />
      </div>

    </section>
  );
}
