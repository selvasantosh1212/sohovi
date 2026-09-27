"use client";

import { useEffect, useRef, useState } from "react";
import { Geist } from "next/font/google";
import { CloudUpload, Lock, ShieldCheck, Sparkles } from "lucide-react";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/* Illustrative figures — the dimension scores and revenue are not derived
   from the sample rows shown. */
const SCORE = 87;
const GAUGE_TRACK = 179.07; // 270° of a r=38 circle
const GAUGE_CIRC = 238.76; // 2πr, r = 38

// DQ scale: ≥95 emerald, 80–94 teal, 60–79 amber, <60 red
const tierColor = (v: number) =>
  v >= 95 ? "#10B981" : v >= 80 ? "#00C9A7" : v >= 60 ? "#F59E0B" : "#EF4444";

const DIMENSIONS: [string, number][] = [
  ["Completeness", 98],
  ["Uniqueness", 92],
  ["Validity", 88],
  ["Consistency", 74],
];

const ISSUES = [
  { title: "Duplicate order IDs", meta: "38 rows · Uniqueness" },
  { title: "3 spellings of one region", meta: "1,912 rows · Consistency" },
  { title: "Negative order totals", meta: "214 rows · Validity" },
];

type Flag = { tone: "error" | "warn"; marker?: number; markerFirst?: boolean };
type Cell = string | { value: string; flag: Flag };

const ROWS: Cell[][] = [
  [{ value: "SO-10482", flag: { tone: "error", marker: 1 } }, "Europe", "1", "249.00"],
  [{ value: "SO-10482", flag: { tone: "error" } }, "Europe", "2", "138.00"],
  ["SO-10484", { value: "N. America", flag: { tone: "warn", marker: 2 } }, "6", "468.00"],
  ["SO-10485", "APAC", "1", { value: "-1,240.00", flag: { tone: "error", marker: 3, markerFirst: true } }],
];

const HEADERS = ["order_id", "region", "qty", "order_total"];
const RIGHT_ALIGNED = new Set([2, 3]);
// qty carries no flag, so it gives way first on phones.
const colClass = (i: number) =>
  [RIGHT_ALIGNED.has(i) ? "text-right" : "", i === 2 ? "hidden sm:table-cell" : ""].join(" ");

const PANEL = "rounded-[10px] border border-white/[0.06] bg-[#0D0D1A]";
const LABEL = "text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94A3B8]";
const FLOAT =
  "box-border flex flex-col gap-[5px] rounded-[12px] px-[14px] py-3 sm:absolute sm:z-[2]";

function Marker({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#00C9A7] text-[9px] font-bold text-[#0D0D1A]"
      style={{ width: size, height: size, fontFamily: "inherit" }}
    >
      {n}
    </span>
  );
}

function FlaggedValue({ value, flag }: { value: string; flag: Flag }) {
  const tone =
    flag.tone === "error"
      ? "bg-[rgba(239,68,68,0.14)] shadow-[inset_0_0_0_1px_rgba(239,68,68,0.45)] text-[#FCA5A5]"
      : "bg-[rgba(245,158,11,0.14)] shadow-[inset_0_0_0_1px_rgba(245,158,11,0.45)] text-[#FCD34D]";
  const marker = flag.marker ? <span className={geist.className}><Marker n={flag.marker} /></span> : null;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[5px] px-[5px] py-[3px] ${tone}`}>
      {flag.markerFirst && marker}
      {value}
      {!flag.markerFirst && marker}
    </span>
  );
}

function IconTile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]"
      style={{ background: bg }}
    >
      {children}
    </span>
  );
}

export function HeroWidget() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // Fill the gauge and bars once the widget scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const gaugeFill = (GAUGE_TRACK * SCORE) / 100;

  return (
    <div
      ref={rootRef}
      className={`${geist.className} relative mx-auto w-full max-w-[600px] text-[#1A1A2E] antialiased sm:pt-[40px] sm:pb-[48px]`}
    >
      {/* ---- Privacy float ------------------------------------------------ */}
      <div
        className={`${FLOAT} mb-3 border border-[rgba(0,201,167,0.35)] bg-[#EFFBF8] shadow-[0_16px_32px_rgba(26,26,46,0.14)] sm:top-0 sm:right-[-16px] sm:mb-0 sm:w-[260px] sm:max-w-[calc(100%-32px)]`}
      >
        <div className="flex items-center gap-2">
          <IconTile bg="#00C9A7">
            <Lock className="h-3 w-3 text-[#0D0D1A]" strokeWidth={2.4} aria-hidden />
          </IconTile>
          <span className="text-[13px] font-semibold text-[#1A1A2E]">Your data stays private</span>
        </div>
        <span className="text-[12px] leading-[1.45] text-[#475569] [text-wrap:pretty]">
          Every check runs inside your browser — your data never reaches a server.
        </span>
      </div>

      {/* ---- Card shell --------------------------------------------------- */}
      <div className="relative z-[1] overflow-hidden rounded-[14px] bg-[#1A1A2E] shadow-[0_24px_48px_rgba(26,26,46,0.2),0_4px_12px_rgba(26,26,46,0.08)]">
        {/* Browser bar */}
        <div className="flex items-center gap-[14px] border-b border-white/[0.08] bg-[#0D0D1A] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-[3px] text-[11px] text-[#94A3B8]">
            <Lock className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
            app.sohovi.com
          </div>
        </div>

        {/* File header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-[18px] py-[14px]">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-[14px] font-medium text-white">sales_orders_q3.xlsx</span>
            <span className="whitespace-nowrap text-[12px] text-[#94A3B8]">
              48,210 rows · 12 columns · profiled in 2.1s
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[rgba(0,201,167,0.3)] bg-[rgba(0,201,167,0.12)] px-2.5 py-1 text-[11px] font-medium text-[#5EEAD4]">
            <ShieldCheck className="h-3 w-3 text-[#00C9A7]" strokeWidth={2} aria-hidden />
            0 bytes uploaded
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 px-[14px] pt-[14px] pb-[14px] sm:pb-10">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
            {/* Score panel */}
            <div className={`${PANEL} flex flex-col gap-3 p-[14px]`}>
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 100 100" width="72" height="72" className="shrink-0" aria-hidden>
                  <circle
                    cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9"
                    strokeDasharray={`${GAUGE_TRACK} ${GAUGE_CIRC}`} strokeLinecap="round"
                    transform="rotate(135 50 50)"
                  />
                  <circle
                    cx="50" cy="50" r="38" fill="none" stroke="#00C9A7" strokeWidth="9"
                    strokeDasharray={`${GAUGE_TRACK} ${GAUGE_CIRC}`} strokeLinecap="round"
                    transform="rotate(135 50 50)"
                    strokeDashoffset={shown ? GAUGE_TRACK - gaugeFill : GAUGE_TRACK}
                    className="transition-[stroke-dashoffset] duration-[800ms] ease-in-out motion-reduce:transition-none"
                    style={{ opacity: shown ? 1 : 0 }}
                  />
                  <text
                    x="50" y="53" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF"
                    fontWeight="700" fontSize="28" fontFamily="inherit"
                  >
                    {SCORE}
                  </text>
                </svg>
                <div className="flex min-w-0 flex-col gap-[3px]">
                  <span className={LABEL}>DQ Score</span>
                  <span className="text-[16px] font-semibold text-white">Good</span>
                  <span className="whitespace-nowrap text-[11px] font-medium text-[#34D399]">+6 vs. last month</span>
                </div>
              </div>
              <div className="flex flex-col gap-[3px] border-t border-white/[0.08] pt-3">
                <span className={LABEL}>Revenue Affected</span>
                <span className="text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-white">$41,380</span>
                <span className="text-[11px] text-[#94A3B8]">252 orders · 1.2% of Q3</span>
              </div>
            </div>

            {/* Dimension panel */}
            <div className={`${PANEL} flex flex-col justify-center gap-[9px] p-[14px]`}>
              <span className={`${LABEL} mb-0.5`}>By Dimension</span>
              {DIMENSIONS.map(([name, v]) => (
                <div key={name} className="grid grid-cols-[84px_minmax(0,1fr)_22px] items-center gap-2.5">
                  <span className="text-[12px] text-[#CBD5E1]">{name}</span>
                  <div className="h-[5px] rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full transition-[width] duration-1000 ease-in-out motion-reduce:transition-none"
                      style={{ width: shown ? `${v}%` : "0%", background: tierColor(v) }}
                    />
                  </div>
                  <span className="text-right font-mono text-[11px] text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table + issues panel */}
          <div className={`${PANEL} overflow-hidden px-2.5 pt-1.5 pb-2.5 sm:px-[14px]`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse whitespace-nowrap font-mono text-[11px] text-[#CBD5E1] sm:text-[12px]">
                <thead>
                  <tr className="text-left text-[10px] text-[#94A3B8]">
                    {HEADERS.map((h, i) => (
                      <th
                        key={h}
                        className={`border-b border-white/10 px-1.5 py-1.5 font-medium ${colClass(i)}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, i) => {
                        const flagged = typeof cell !== "string";
                        const cls = [
                          flagged ? "px-0.5 py-[2px]" : "px-1.5 py-[5px]",
                          r < ROWS.length - 1 ? "border-b border-white/[0.06]" : "",
                          colClass(i),
                        ].join(" ");
                        return (
                          <td key={i} className={cls}>
                            {flagged ? <FlaggedValue value={cell.value} flag={cell.flag} /> : cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex flex-col border-t border-white/10 pt-1">
              {ISSUES.map((issue, i) => (
                <div key={issue.title} className="flex items-center gap-2.5 py-[5px]">
                  <Marker n={i + 1} size={16} />
                  <span className="min-w-0 text-[13px] font-semibold text-white">{issue.title}</span>
                  <span className="ml-auto whitespace-nowrap text-[11px] text-[#94A3B8]">{issue.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Bottom floats: stacked on phones, pinned to the corners above ---- */}
      <div className="mt-3 grid gap-3 sm:contents">
        <div
          className={`${FLOAT} border border-[#E2E8F0] bg-white shadow-[0_16px_32px_rgba(26,26,46,0.14)] sm:bottom-0 sm:left-[-24px] sm:w-[230px] sm:max-w-[calc(50%-8px)]`}
        >
          <div className="flex items-center gap-2">
            <IconTile bg="#1A1A2E">
              <CloudUpload className="h-3 w-3 text-white" strokeWidth={2.4} aria-hidden />
            </IconTile>
            <span className="text-[13px] font-semibold text-[#1A1A2E]">No pipeline to build</span>
          </div>
          <span className="text-[12px] leading-[1.45] text-[#475569] [text-wrap:pretty]">
            Drop in this month’s export, get a score in seconds.
          </span>
        </div>
        <div
          className={`${FLOAT} border border-[rgba(0,201,167,0.4)] bg-[#0D0D1A] shadow-[0_16px_32px_rgba(26,26,46,0.2)] sm:right-[-16px] sm:bottom-0 sm:w-[240px] sm:max-w-[calc(50%-8px)]`}
        >
          <div className="flex items-center gap-2">
            <IconTile bg="#00C9A7">
              <Sparkles className="h-3 w-3 text-[#0D0D1A]" strokeWidth={2.4} aria-hidden />
            </IconTile>
            <span className="text-[13px] font-semibold text-white">AI rule detector</span>
          </div>
          <span className="text-[12px] leading-[1.45] text-[#CBD5E1] [text-wrap:pretty]">
            3 rules suggested — incl. a uniqueness check on{" "}
            <span className="font-mono text-[#5EEAD4]">order_id</span>.
          </span>
        </div>
      </div>
    </div>
  );
}
