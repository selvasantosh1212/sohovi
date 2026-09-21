"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Gauge,
  ListChecks,
  Lock,
  Play,
  Plus,
  ScanSearch,
  ServerOff,
  Share2,
  ShieldCheck,
  Sparkles,
  Table,
  TrendingUp,
  Upload,
  UploadCloud,
  Workflow,
} from "lucide-react";

/* ---------------------------------------------------------------------------
   DQ score tiers — same ordering/semantics as --score-excellent/good/warn/danger
--------------------------------------------------------------------------- */
const tierColor = (v: number) =>
  v >= 95 ? "#2EE6A8" : v >= 80 ? "#00E6C3" : v >= 60 ? "#FFB627" : "#FF5C6C";
const chipBg = (v: number) =>
  v >= 95 ? "rgba(46,230,168,0.14)" : v >= 80 ? "rgba(0,230,195,0.14)" : v >= 60 ? "rgba(255,182,39,0.14)" : "rgba(255,92,108,0.14)";
const chipFg = (v: number) =>
  v >= 95 ? "#39F0A8" : v >= 80 ? "#2DE8C8" : v >= 60 ? "#FFC24B" : "#FF7D8A";
const tierLabel = (v: number) =>
  v >= 95 ? "Excellent" : v >= 80 ? "Good" : v >= 60 ? "Warning" : "Critical";

type TabId = "profiling" | "rules" | "workflow" | "report";

const TABS: { id: TabId; label: string; Icon: typeof ScanSearch }[] = [
  { id: "profiling", label: "Data Profiling", Icon: ScanSearch },
  { id: "rules", label: "DQ Rules", Icon: ListChecks },
  { id: "workflow", label: "Workflows", Icon: Workflow },
  { id: "report", label: "Download DQ Report", Icon: Download },
];

const DIMENSIONS: [string, number][] = [
  ["Completeness", 94], ["Timeliness", 90],
  ["Validity", 88], ["Conformity", 86],
  ["Uniqueness", 72], ["Precision", 79],
  ["Accuracy", 95], ["Traceability", 93],
  ["Consistency", 81], ["Integrity", 66],
];

const COLUMNS: {
  name: string; type: string; nulls: string; distinct: string; score: number; tag: string; rules: string;
}[] = [
  { name: "customer_id", type: "string", nulls: "0.0%", distinct: "126,135", score: 72, tag: "", rules: "unique +1" },
  { name: "phone", type: "string", nulls: "12.4%", distinct: "96,551", score: 66, tag: "PII", rules: "regex +1" },
  { name: "consent_flag", type: "boolean", nulls: "0.0%", distinct: "2", score: 79, tag: "", rules: "allowed_values" },
  { name: "order_total", type: "number", nulls: "0.0%", distinct: "88,120", score: 91, tag: "", rules: "range +1" },
  { name: "country", type: "enum", nulls: "0.3%", distinct: "41", score: 94, tag: "", rules: "lookup" },
  { name: "signup_date", type: "timestamp", nulls: "0.0%", distinct: "1,204", score: 95, tag: "", rules: "max_date" },
];

const SUGGESTIONS = [
  {
    id: "iso", name: "Country codes must be ISO 3166 alpha-2", dimension: "Conformity",
    expr: "country IN ISO_3166_1_ALPHA2", confidence: "97%",
    why: "41 distinct values found — 4 of them (“UK”, “USA”, “EN”, “uk”) are not valid alpha-2 codes.",
  },
  {
    id: "disposable", name: "Block disposable email domains", dimension: "Validity",
    expr: "email.domain NOT IN disposable_domains", confidence: "94%",
    why: "412 rows (0.3%) use known throwaway domains — they pass RFC 5322 but fail delivery.",
  },
  {
    id: "outlier", name: "Order total outlier bound", dimension: "Accuracy",
    expr: "order_total <= p99(order_total) * 1.5", confidence: "91%",
    why: "218 rows sit beyond 3σ of the distribution, including 6 above $2M.",
  },
  {
    id: "fresh", name: "Freshness SLA on signup_date", dimension: "Timeliness",
    expr: "max(signup_date) >= today() - 7d", confidence: "88%",
    why: "The newest row is 2 days old — a 7-day window would catch a stalled export.",
  },
];

const BASE_RULES = [
  { name: "No duplicate customer IDs", expr: "COUNT(DISTINCT customer_id) = COUNT(*)", dimension: "Uniqueness", pass: "98.2%", ok: false },
  { name: "Email matches RFC 5322", expr: "email ~ /^[^@]+@[^@]+\\.[a-z]{2,}$/i", dimension: "Validity", pass: "99.4%", ok: true },
  { name: "Order total within band", expr: "order_total BETWEEN 0 AND 25000", dimension: "Accuracy", pass: "99.9%", ok: true },
  { name: "Phone required for EU rows", expr: "country IN (EU) ⇒ phone IS NOT NULL", dimension: "Completeness", pass: "87.6%", ok: false },
  { name: "Signup date not in future", expr: "signup_date <= TODAY()", dimension: "Timeliness", pass: "100%", ok: true },
];

const REPORT_ITEMS = [
  "Overall score & tier", "10 dimension scores", "23 column profiles",
  "18 rule results", "PII flags per column", "8-week score history",
];

/* Shared class fragments ---------------------------------------------------- */
const CARD = "rounded-[14px] border border-white/10 bg-[#15151F] shadow-[0_1px_2px_rgba(0,0,0,0.38)]";
const CARD_TITLE = "text-[11px] font-bold tracking-[0.12em] text-[#C8CFDD]";
const CARD_META = "font-mono text-[11px] text-[#8B93A6]";
const TABLE_COLS = "minmax(90px,1.3fr) 76px 58px 68px 52px 104px minmax(88px,0.9fr)";

function SohoviMark() {
  return (
    <svg viewBox="0 0 149.81 170.09" className="block h-[27px] w-[24px] shrink-0" aria-hidden>
      <path
        fill="#00E6C3"
        d="M145,39.06,79.65,1.29a9.37,9.37,0,0,0-9.49,0L4.71,39.06A9.5,9.5,0,0,0,0,47.29v75.54a9.48,9.48,0,0,0,4.71,8.22l65.45,37.7a9.06,9.06,0,0,0,9.49,0L145,131.05a9.39,9.39,0,0,0,4.79-8.22V47.29A9.41,9.41,0,0,0,145,39.06ZM74.87,112.88C56.77,63.29,9.35,76.75,9.35,76.75c2.92-21.46,21.84-20.49,21.84-20.49,19.3,26.1,43.68,22.59,43.68,22.59s24.38,3.51,43.75-22.59c0,0,18.92-1,21.77,20.49C140.39,76.75,93,63.29,74.87,112.88Z"
      />
    </svg>
  );
}

/* Small donut used in the dimensions-card footer ---------------------------- */
function MiniDonut({ score, color }: { score: number; color: string }) {
  const C = 100.5; // 2πr, r = 16
  return (
    <span className="relative block h-10 w-10 shrink-0">
      <svg viewBox="0 0 40 40" className="block h-10 w-10 -rotate-90" aria-hidden>
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="4" />
        <circle
          cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[12px] font-bold text-[#F2F4F8]">
        {score}
      </span>
    </span>
  );
}

export function HeroDashboard({ score = 87 }: { score?: number }) {
  const [tab, setTab] = useState<TabId>("profiling");
  const [accepted, setAccepted] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const acceptedRules = SUGGESTIONS.filter((s) => accepted.includes(s.id));
  const openSuggestions = SUGGESTIONS.filter(
    (s) => !accepted.includes(s.id) && !dismissed.includes(s.id),
  );
  const ruleCount = 18 + acceptedRules.length;

  const arc = tierColor(score);
  const gaugeLen = 292.2; // length of the 270° r=62 track
  const angle = ((135 + 2.7 * score) * Math.PI) / 180;
  const markerX = 80 + 62 * Math.cos(angle);
  const markerY = 80 + 62 * Math.sin(angle);

  const moreLabel =
    tab === "profiling" ? "17 more columns below"
    : tab === "rules" ? `${13 + acceptedRules.length} more rules below`
    : tab === "workflow" ? "6 past runs below"
    : "Full report preview below";

  const rules = [
    ...acceptedRules.map((s) => ({
      name: s.name, expr: s.expr, dimension: s.dimension, pass: "not run", ok: true, isNew: true,
    })),
    ...BASE_RULES.map((r) => ({ ...r, isNew: false })),
  ];

  const steps = [
    { label: "Ingest", Icon: Upload, meta: "CSV · 42 MB" },
    { label: "Profile", Icon: ScanSearch, meta: "23 columns" },
    { label: "Apply rules", Icon: ListChecks, meta: `${ruleCount} rules` },
    { label: "Score", Icon: Gauge, meta: "10 dimensions" },
    { label: "Alert", Icon: Bell, meta: "Slack + email" },
  ];

  return (
    <div className="flex justify-center pt-6 pb-6 min-[768px]:pb-[92px] min-[900px]:pt-16 min-[1240px]:pt-16 min-[1240px]:pb-16">
      <div className="relative w-full min-w-0 max-w-[980px]">
        {/* Straddles the top edge of the window at the design width; sits
            above it on narrower screens. In the two-column hero the deck is
            only ~690px wide, so it anchors right to stay off the URL pill. */}
        <div className="mb-4 rounded-[14px] border border-[#9FD8FF] bg-[#E3F4FF] px-4 py-[13px] shadow-[0_12px_28px_-12px_rgba(3,105,161,0.3)] min-[900px]:absolute min-[900px]:top-[-38px] min-[900px]:left-1/2 min-[900px]:z-10 min-[900px]:mb-0 min-[900px]:w-[min(376px,100%)] min-[900px]:-translate-x-1/2 min-[1240px]:left-auto min-[1240px]:right-4 min-[1240px]:translate-x-0">
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#0091FF]">
              <Lock className="h-3 w-3 text-white" aria-hidden />
            </span>
            <span className="text-[12.5px] font-bold text-[#073B5C]">Your data is 100% safe</span>
            <div className="flex-1" />
            <ShieldCheck className="h-[15px] w-[15px] shrink-0 text-[#0369A1]" aria-hidden />
          </div>
          <div className="mt-[7px] text-[12px] leading-[1.5] text-[#0E5B8A]">
            Everything happens inside your browser — your data never reaches a server.
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#15151F] shadow-[0_24px_48px_-20px_rgba(10,10,20,0.42),0_6px_16px_-8px_rgba(10,10,20,0.22)]">

          {/* ---- Browser chrome ------------------------------------------ */}
          <div className="flex items-center gap-[14px] bg-[#12121C] px-4 py-[11px]">
            <div className="flex gap-[7px]" aria-hidden>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <span key={c} className="block h-[11px] w-[11px] rounded-full" style={{ background: c }} />
              ))}
            </div>
            {/* Capped once the privacy card straddles the bar, so the URL pill
                can never grow underneath it — uncapped again at 1240px, where
                the card has moved to the right of the bar. */}
            <div className="flex min-w-0 flex-1 justify-start overflow-hidden min-[900px]:max-w-[calc(50%-200px)] min-[1240px]:max-w-none">
              <div className="flex items-center gap-[7px] rounded-full border border-white/10 bg-white/[0.07] px-[14px] py-1">
                <Lock className="h-3 w-3 shrink-0 text-[#00E6C3]" aria-hidden />
                <span className="font-mono text-[12px] text-white/70">app.sohovi.com</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-[rgba(0,230,195,0.38)] bg-[rgba(0,230,195,0.16)] px-[11px] py-1">
              <span
                className="sv-live block h-1.5 w-1.5 rounded-full bg-[#00E6C3] shadow-[0_0_8px_rgba(0,230,195,0.9)]"
                aria-hidden
              />
              <span className="text-[11px] font-semibold tracking-[0.04em] text-[#00E6C3]">LIVE</span>
            </div>
          </div>

          {/* ---- File header --------------------------------------------- */}
          <div className="flex flex-wrap items-center gap-[14px] border-b border-white/10 bg-[#15151F] px-5 pt-4 pb-[13px]">
            <SohoviMark />
            <div className="min-w-0">
              <div className="font-mono text-[17px] font-medium text-[#F2F4F8]">customer_data.csv</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] text-[#9098AA]">128,447 rows · 23 columns · profiled in 4.2s</span>
                <span className="inline-flex items-center gap-[5px] rounded-full border border-[rgba(0,230,195,0.38)] bg-[rgba(0,230,195,0.12)] px-[9px] py-0.5 text-[11px] font-semibold text-[#2DE8C8]">
                  <ServerOff className="h-[11px] w-[11px]" aria-hidden />
                  0 bytes uploaded
                </span>
              </div>
            </div>
            <div className="min-w-[12px] flex-1" />
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF8A5C] px-[14px] py-2 text-[13px] font-semibold text-white">
              <Play className="h-3.5 w-3.5" aria-hidden />
              Run Workflow
            </span>
          </div>

          {/* ---- Tabs ----------------------------------------------------- */}
          <div role="tablist" aria-label="Dashboard views" className="flex gap-0.5 overflow-x-auto border-b border-white/10 bg-[#15151F] px-5">
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className="flex items-center gap-[7px] whitespace-nowrap px-[15px] py-3 text-[13.5px] transition-colors duration-150"
                  style={{
                    borderBottom: `2.5px solid ${active ? "#00E6C3" : "transparent"}`,
                    color: active ? "#F2F4F8" : "#AAB2C4",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <Icon className="h-[15px] w-[15px]" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ---- Crop area ------------------------------------------------ */}
          <div className="relative bg-[#0A0A12]">
            {/* Crop: 660px at design width. On phones the gauge and dimension
                cards stack and eat the whole budget, so give the tab panel room. */}
            <div className="max-h-[1120px] overflow-hidden pb-[26px] min-[768px]:max-h-[660px] min-[1240px]:max-h-[516px]">

              <div className="flex flex-wrap gap-3 px-5 pt-[14px]">
                {/* Score gauge card */}
                <div className={`${CARD} flex max-w-[238px] flex-[1_1_212px] flex-col items-center px-[14px] pt-[14px] pb-4`}>
                  <div className="flex w-full items-center gap-1.5">
                    <span className={CARD_TITLE}>OVERALL HEALTH</span>
                    <div className="flex-1" />
                    <span className={CARD_META}>#14</span>
                  </div>
                  <div className="relative w-full max-w-[182px]">
                    <svg viewBox="0 0 160 142" className="block h-auto w-full" aria-label={`DQ score ${score} out of 100`}>
                      <title>{`DQ score ${score}/100 — ${tierLabel(score)}`}</title>
                      {/* Tier scale ring: one 270° arc drawn 4× with dash offsets per band */}
                      <path d="M 27.7 133.3 A 74 74 0 1 1 132.3 133.3" fill="none" stroke="#FF5C6C" strokeWidth="3" strokeDasharray="206.2 9999" opacity="0.3" />
                      <path d="M 27.7 133.3 A 74 74 0 1 1 132.3 133.3" fill="none" stroke="#FFB627" strokeWidth="3" strokeDasharray="0 209.2 66.7 9999" opacity="0.45" />
                      <path d="M 27.7 133.3 A 74 74 0 1 1 132.3 133.3" fill="none" stroke="#00E6C3" strokeWidth="3" strokeDasharray="0 279 49.3 9999" opacity="0.5" />
                      <path d="M 27.7 133.3 A 74 74 0 1 1 132.3 133.3" fill="none" stroke="#2EE6A8" strokeWidth="3" strokeDasharray="0 331.3 14.4 9999" opacity="0.6" />
                      <path d="M 36.2 123.8 A 62 62 0 1 1 123.8 123.8" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="13" strokeLinecap="round" />
                      <path
                        className="sv-arc"
                        d="M 36.2 123.8 A 62 62 0 1 1 123.8 123.8"
                        fill="none" stroke={arc} strokeWidth="13" strokeLinecap="round"
                        strokeDasharray={gaugeLen} strokeDashoffset={gaugeLen * (1 - score / 100)}
                        style={{ filter: "drop-shadow(0 0 7px rgba(0,230,195,0.55))" }}
                      />
                      <circle cx={markerX} cy={markerY} r="6.5" fill="#15151F" />
                      <circle cx={markerX} cy={markerY} r="3.5" fill={arc} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pb-2.5">
                      <span className="flex items-baseline gap-[3px]">
                        <span className="text-[46px] font-bold leading-none tracking-[-0.035em] text-[#F2F4F8]">{score}</span>
                        <span className="font-mono text-[13px] text-[#8B93A6]">/100</span>
                      </span>
                      <span className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: arc }}>
                        {tierLabel(score)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#AAB2C4]">
                    <TrendingUp className="h-[13px] w-[13px] text-[#2DE8C8]" aria-hidden />
                    <span><span className="font-bold text-[#2DE8C8]">+6</span> since run #13</span>
                  </div>
                </div>

                {/* Dimensions card */}
                <div className={`${CARD} min-w-0 flex-[1_1_300px] px-4 py-[14px]`}>
                  <div className="mb-[11px] flex items-center justify-between">
                    <span className={CARD_TITLE}>10 DATA QUALITY DIMENSIONS</span>
                    <span className={CARD_META}>
                      <span className="hidden min-[1240px]:inline">6 of 10 · </span>ISO 25012
                    </span>
                  </div>
                  <div className="grid gap-y-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))", columnGap: "22px" }}>
                    {DIMENSIONS.map(([name, value], i) => (
                      <div
                        key={name}
                        className={`grid items-center gap-2 ${i >= 6 ? "min-[1240px]:hidden" : ""}`}
                        style={{ gridTemplateColumns: "78px minmax(36px,1fr) 24px" }}
                      >
                        <span className="whitespace-nowrap text-[12.5px] text-[#C8CFDD]">{name}</span>
                        <span className="block h-[7px] overflow-hidden rounded-full bg-white/[0.09]">
                          <span className="sv-bar block h-full rounded-full" style={{ width: `${value}%`, background: tierColor(value) }} />
                        </span>
                        <span className="text-right font-mono text-[12.5px] font-medium text-[#F2F4F8]">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 border-t border-white/[0.07] pt-3">
                    {[
                      { label: "August customer data", sub: "Dataset score", value: 87, color: "#00E6C3" },
                      { label: "Master & reference data", sub: "Business unit score", value: 79, color: "#FFB627" },
                    ].map((d) => (
                      <div key={d.label} className="flex min-w-0 flex-[1_1_168px] items-center gap-2.5">
                        <MiniDonut score={d.value} color={d.color} />
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] font-semibold text-[#F2F4F8]">{d.label}</span>
                          <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.08em] text-[#8B93A6]">{d.sub}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ---- Tab panel ---------------------------------------------- */}
              <div className="px-5 pt-3">
                <div role="tabpanel" className={`${CARD} overflow-hidden`}>

                  {tab === "profiling" && (
                    <div>
                      <div className="flex items-center justify-between px-4 pt-[13px] pb-[9px]">
                        <span className={CARD_TITLE}>COLUMN PROFILE</span>
                        <span className="text-[11.5px] text-[#9098AA]">6 of 23 columns · sorted by risk</span>
                      </div>
                      <div
                        className="grid gap-2.5 whitespace-nowrap px-4 pb-[7px] text-[10px] font-bold tracking-[0.1em] text-[#8B93A6]"
                        style={{ gridTemplateColumns: TABLE_COLS }}
                      >
                        <span>COLUMN</span><span>TYPE</span>
                        <span className="text-right">NULL %</span><span className="text-right">DISTINCT</span>
                        <span>TAGS</span><span>DQ RULES</span><span className="text-right">DQ SCORE</span>
                      </div>
                      {COLUMNS.map((c) => (
                        <div
                          key={c.name}
                          className="grid items-center gap-2.5 border-t border-white/[0.07] px-4 py-2"
                          style={{ gridTemplateColumns: TABLE_COLS }}
                        >
                          <span className="truncate font-mono text-[12.5px] font-medium text-[#F2F4F8]">{c.name}</span>
                          <span className="justify-self-start rounded-md bg-white/[0.07] px-2 py-[3px] font-mono text-[11px] font-medium text-[#AAB2C4]">{c.type}</span>
                          <span className="text-right font-mono text-[12.5px] text-[#C8CFDD]">{c.nulls}</span>
                          <span className="text-right font-mono text-[12.5px] text-[#C8CFDD]">{c.distinct}</span>
                          {/* Untagged columns keep their grid track — hidden, not removed */}
                          <span
                            className="justify-self-start rounded-full bg-[rgba(255,92,108,0.14)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.04em] text-[#FF7D8A]"
                            style={c.tag ? undefined : { visibility: "hidden" }}
                          >
                            {c.tag || "—"}
                          </span>
                          <span className="justify-self-start whitespace-nowrap rounded-full border border-[rgba(0,230,195,0.3)] bg-[rgba(0,230,195,0.12)] px-2 py-0.5 font-mono text-[10.5px] font-medium text-[#2DE8C8]">{c.rules}</span>
                          <span className="flex items-center justify-end gap-[9px]">
                            <span className="block h-[5px] min-w-[40px] flex-[1_1_auto] overflow-hidden rounded-full bg-white/[0.09]">
                              <span className="block h-full rounded-full" style={{ width: `${c.score}%`, background: tierColor(c.score) }} />
                            </span>
                            <span
                              className="min-w-[30px] rounded-full px-2 py-0.5 text-center font-mono text-[12px] font-bold"
                              style={{ color: chipFg(c.score), background: chipBg(c.score) }}
                            >
                              {c.score}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === "rules" && (
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 px-4 pt-[13px] pb-[11px]">
                        <span className={CARD_TITLE}>CUSTOM DQ RULES</span>
                        <span className={CARD_META}>{`${5 + acceptedRules.length} of ${ruleCount} shown`}</span>
                        <div className="flex-1" />
                        <span className="inline-flex items-center gap-[5px] rounded-lg border border-dashed border-[#3B4254] px-2.5 py-1 text-[12px] text-[#AAB2C4]">
                          <Plus className="h-3 w-3" aria-hidden />
                          New rule
                        </span>
                      </div>

                      {openSuggestions.length > 0 && (
                        <div className="mx-4 mb-[11px] overflow-hidden rounded-xl border border-white/10">
                          <div className="flex flex-wrap items-center gap-[9px] bg-[#12121C] px-3 py-[9px]">
                            <span className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full bg-[#00E6C3]">
                              <Sparkles className="h-[13px] w-[13px] text-[#0D0D1A]" aria-hidden />
                            </span>
                            <span className="text-[13px] font-bold tracking-[-0.01em] text-white">AI rule detector</span>
                            <span className="text-[12px] text-white/65">— inferred from your profile, running locally</span>
                            <div className="flex-1" />
                            <span className="font-mono text-[11px] text-white/65">{`${openSuggestions.length} of ${SUGGESTIONS.length}`}</span>
                          </div>
                          {openSuggestions.map((s) => (
                            <div key={s.id} className="flex flex-wrap items-center gap-2.5 border-t border-white/[0.07] bg-[#15151F] px-3 py-[9px]">
                              <span className="min-w-0 flex-[1_1_240px]">
                                <span className="flex flex-wrap items-center gap-[7px]">
                                  <span className="text-[12.5px] font-semibold text-[#F2F4F8]">{s.name}</span>
                                  <span className="rounded-full bg-white/[0.07] px-[7px] py-px text-[10.5px] text-[#AAB2C4]">{s.dimension}</span>
                                  <span className="rounded-full border border-[rgba(0,230,195,0.38)] bg-[rgba(0,230,195,0.14)] px-[7px] py-px font-mono text-[10.5px] text-[#2DE8C8]">{s.confidence} confidence</span>
                                </span>
                                <span className="mt-[3px] block truncate font-mono text-[11px] text-[#9098AA]">{s.expr}</span>
                                <span className="mt-[3px] block text-[11.5px] text-[#AAB2C4]">{s.why}</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setDismissed((d) => [...d, s.id])}
                                  className="cursor-pointer rounded-lg border border-white/10 px-2.5 py-[5px] text-[12px] text-[#AAB2C4] transition-colors hover:bg-[#0A0A12]"
                                >
                                  Dismiss
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAccepted((a) => [...a, s.id])}
                                  className="inline-flex cursor-pointer items-center gap-[5px] rounded-lg bg-[#FF8A5C] px-[11px] py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#FF6F3C]"
                                >
                                  <Check className="h-3 w-3" aria-hidden />
                                  Add rule
                                </button>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {rules.map((r) => (
                        <div
                          key={r.name}
                          className="grid items-center gap-3 border-t border-white/[0.07] px-4 py-[9px]"
                          style={{ gridTemplateColumns: "20px minmax(120px,1fr) 104px 64px" }}
                        >
                          <span
                            className="ml-[5px] block h-[9px] w-[9px] rounded-full"
                            style={{
                              background: r.isNew ? "#00E6C3" : r.ok ? "#2EE6A8" : "#FFB627",
                              boxShadow: `0 0 0 3px ${r.isNew ? "rgba(0,230,195,0.20)" : r.ok ? "rgba(46,230,168,0.22)" : "rgba(255,182,39,0.22)"}`,
                            }}
                            aria-hidden
                          />
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-[7px]">
                              <span className="text-[12.5px] font-medium text-[#F2F4F8]">{r.name}</span>
                              {r.isNew && (
                                <span className="rounded-full border border-[rgba(255,138,92,0.38)] bg-[rgba(255,138,92,0.14)] px-1.5 py-px text-[9.5px] font-bold tracking-[0.1em] text-[#FF6F3C]">
                                  ADDED FROM AI
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 block truncate font-mono text-[11px] text-[#9098AA]">{r.expr}</span>
                          </span>
                          <span className="text-[11.5px] text-[#AAB2C4]">{r.dimension}</span>
                          <span
                            className="text-right font-mono text-[12px] font-bold"
                            style={{ color: r.isNew ? "#8B93A6" : r.ok ? "#39F0A8" : "#FFC24B" }}
                          >
                            {r.pass}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === "workflow" && (
                    <div className="px-4 pt-[13px] pb-4">
                      <div className="mb-[13px] flex flex-wrap items-center justify-between gap-2">
                        <span className={CARD_TITLE}>SAVED WORKFLOW · customer-weekly</span>
                        <span className="inline-flex items-center gap-[5px] text-[11.5px] text-[#AAB2C4]">
                          <Clock className="h-3 w-3" aria-hidden />
                          Runs every Monday 06:00
                        </span>
                      </div>
                      <div className="flex flex-wrap items-stretch">
                        {steps.map(({ label, Icon, meta }, i) => (
                          <div key={label} className="flex min-w-0 items-center">
                            <div className="min-w-0 rounded-xl border border-white/10 bg-[#0A0A12] px-3 py-2.5">
                              <Icon className="h-[15px] w-[15px] text-[#2DE8C8]" aria-hidden />
                              <span className="mt-[5px] block whitespace-nowrap text-[12px] font-semibold text-[#F2F4F8]">{label}</span>
                              <span className="mt-0.5 block whitespace-nowrap font-mono text-[10.5px] text-[#9098AA]">{meta}</span>
                            </div>
                            {i < steps.length - 1 && (
                              <span className="block h-[1.5px] w-4 shrink-0 bg-[#3B4254]" aria-hidden />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-[13px] flex items-center gap-2 rounded-[10px] border border-white/10 bg-[#0A0A12] px-3 py-2.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2EE6A8]" aria-hidden />
                        <span className="text-[12px] text-[#C8CFDD]">
                          Last run finished in <span className="font-mono text-[#F2F4F8]">4.2s</span> — 2 rules failed, alert sent to <span className="font-mono text-[#F2F4F8]">#data-quality</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {tab === "report" && (
                    <div className="px-4 pt-[13px] pb-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2.5">
                        <span className={CARD_TITLE}>DQ REPORT · customer_data</span>
                        <div className="flex-1" />
                        <span className={CARD_META}>run #14 · 20 Sep 2026</span>
                      </div>
                      <div className="flex flex-wrap items-stretch gap-3">
                        <div className="min-w-0 flex-[1_1_300px] rounded-xl border border-white/10 bg-[#0A0A12] px-[15px] py-[13px]">
                          <span className="text-[10px] font-bold tracking-[0.1em] text-[#8B93A6]">INCLUDED IN THIS REPORT</span>
                          <div className="mt-2.5 grid gap-y-[7px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", columnGap: "16px" }}>
                            {REPORT_ITEMS.map((item) => (
                              <span key={item} className="flex items-center gap-[7px] text-[12.5px] text-[#C8CFDD]">
                                <Check className="h-[13px] w-[13px] shrink-0 text-[#2DE8C8]" aria-hidden />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-[1_1_230px] flex-col justify-center gap-[9px]">
                          <span className="flex items-center justify-center gap-[7px] rounded-[9px] bg-[#FF8A5C] px-3.5 py-[11px] text-[13px] font-bold text-[#0A0A12]">
                            <Download className="h-[15px] w-[15px]" aria-hidden />
                            Download PDF report
                          </span>
                          <span className="flex items-center justify-center gap-[7px] rounded-[9px] border border-white/[0.14] px-3.5 py-2.5 text-[13px] font-semibold text-[#F2F4F8]">
                            <Table className="h-[15px] w-[15px] text-[#2DE8C8]" aria-hidden />
                            Export as Excel
                          </span>
                          <span className="flex items-center justify-center gap-[7px] rounded-[9px] border border-white/[0.14] px-3.5 py-2.5 text-[13px] font-semibold text-[#F2F4F8]">
                            <Share2 className="h-[15px] w-[15px] text-[#2DE8C8]" aria-hidden />
                            Share read-only link
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-[rgba(0,230,195,0.38)] bg-[rgba(0,230,195,0.1)] px-3 py-2.5">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#2DE8C8]" aria-hidden />
                        <span className="text-[12px] text-[#C8CFDD]">
                          The report carries scores, rules and metadata only — <span className="text-[#F2F4F8]">none of your rows leave this browser</span>.
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Crop fade + "more below" affordance */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(180deg, rgba(10,10,18,0) 0%, rgba(10,10,18,0.88) 45%, #0A0A12 100%)" }}
              aria-hidden
            />
            <div className="absolute bottom-[14px] left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-[#15151F] px-[13px] py-[5px] text-[11.5px] font-semibold text-[#AAB2C4] shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              <ChevronDown className="h-[13px] w-[13px] text-[#9098AA]" aria-hidden />
              {moreLabel}
            </div>
          </div>
        </div>

        {/* ---- Floating callouts — overhang on md+, stacked below on mobile --- */}
        <div className="mt-4 flex flex-col gap-3 md:mt-0 md:block">
          <div className="rounded-[14px] border border-[#C9B8FA] bg-[#EFE9FE] px-[15px] py-[13px] shadow-[0_12px_28px_-12px_rgba(76,29,149,0.34)] md:absolute md:bottom-[-34px] md:left-[-18px] md:max-w-[min(318px,34%)]">
            <div className="flex items-center gap-2">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#7C3AED]">
                <UploadCloud className="h-3 w-3 text-white" aria-hidden />
              </span>
              <span className="text-[12.5px] font-bold text-[#3B1D82]">No pipeline to build</span>
            </div>
            <div className="mt-[7px] text-[12px] leading-[1.5] text-[#5B3BB0]">
              Drag and drop your file and get instant DQ health for every dataset, catalog and business unit.
            </div>
          </div>

          <div className="rounded-[14px] border border-[rgba(57,255,136,0.38)] bg-[#08170F] px-[15px] py-[13px] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)] md:absolute md:right-[-18px] md:bottom-[-34px] md:max-w-[min(304px,32%)]">
            <div className="flex items-center gap-2">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#39FF88]">
                <Sparkles className="h-3 w-3 text-[#062012]" aria-hidden />
              </span>
              <span className="text-[12.5px] font-bold text-[#39FF88]">AI rule detector</span>
            </div>
            <div className="mt-[7px] text-[12px] leading-[1.5] text-[#C8F5D9]">
              4 new rules suggested from this profile — including a uniqueness check on <span className="font-mono text-[#39FF88]">customer_id</span>.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
