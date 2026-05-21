import { Check, AlertTriangle } from "lucide-react";
import { AnimatedScoreGauge } from "@/components/landing/AnimatedScoreGauge";

const pillars = [
  {
    id: "profiling",
    label: "Instant Understanding",
    headline: "See everything about your data before you write a single rule.",
    body: "Drop any CSV or Excel file. Sohovi reads every column — null rates, type distributions, unique value counts, outliers, and PII flags — computed entirely client-side, delivered in seconds.",
    bullets: [
      "Null rates, value distributions, and top-N values per column",
      "Automatic type inference: email, phone, date, ID, numeric",
      "PII detection — flags emails, phone numbers, SSNs before you share data",
      "Statistical outlier detection using ±3σ analysis",
    ],
    tags: ["CSV", "Excel", "100K+ rows", "Instant"],
    mockup: <ProfilingMockup />,
  },
  {
    id: "scoring",
    label: "Measurable Quality",
    headline: "A score you can show your team — and explain in plain English.",
    body: "Every DQ score is built from 10 ISO-standard dimensions. You see exactly which rules passed or failed, how many rows are affected, and why. No black-box output.",
    bullets: [
      "10 dimensions: Completeness, Validity, Uniqueness, Accuracy, Consistency, and more",
      "Column-level, dataset-level, and catalog-level scores",
      "Drill into any failing rule to see the exact affected rows",
      "Score history tracked across every run",
    ],
    tags: ["10 Dimensions", "Transparent", "Drillable", "Historical"],
    mockup: <ScoringMockup />,
  },
  {
    id: "rules",
    label: "Intelligent Rules",
    headline: "Rules that already know what kind of column they're looking at.",
    body: "Sohovi's built-in ML engine reads your column names and data patterns to suggest the right quality rules before you ask. Accept, edit, extend, and reuse across any dataset.",
    bullets: [
      "Auto-detects: email → regex rule, ID → uniqueness rule, date → format rule",
      "No external API calls — ML runs entirely in your browser",
      "Save rules as reusable templates across datasets",
      "Custom rules: regex, ranges, lookups, cross-column checks",
    ],
    tags: ["Auto-Suggest", "Custom Rules", "10 Rule Types", "Reusable"],
    mockup: <RulesMockup />,
  },
  {
    id: "trends",
    label: "Continuous Monitoring",
    headline: "Track how your data quality changes — before it breaks production.",
    body: "Run Sohovi weekly against the same dataset. Watch your DQ score improve over time, catch regressions early, and get notified the moment quality drops below your threshold.",
    bullets: [
      "Historical trend charts across every run",
      "Schema drift detection — new columns, removed columns, renames",
      "Anomaly alerts — null spikes, pattern changes, value range shifts",
      "Set per-asset score thresholds",
    ],
    tags: ["Trend Charts", "Schema Drift", "Anomaly Detection", "Threshold Alerts"],
    mockup: <TrendsMockup />,
  },
];

const pillarBgs = [
  "var(--butter-soft)",
  "var(--lavender-soft)",
  "var(--sky-soft)",
  "var(--sage-soft)",
];

function ProfilingMockup() {
  return (
    <div className="rounded-[24px] p-5 space-y-3" style={{ background: "#fff", border: "1px solid var(--hair)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.12)" }}>
      <p className="text-xs font-mono text-slate-400 mb-1">customer_data.csv — profiling results</p>
      {[
        { col: "email", type: "Email", nullRate: 2.3, unique: 98.1, pii: true },
        { col: "customer_id", type: "ID", nullRate: 0, unique: 100, pii: false },
        { col: "phone", type: "Phone", nullRate: 8.7, unique: 91.2, pii: true },
      ].map((c) => (
        <div key={c.col} className="rounded-[14px] p-4 space-y-2" style={{ background: "var(--cream-deep)", border: "1px solid var(--hair)" }}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-slate-800">{c.col}</span>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "rgba(224,113,80,0.10)", color: "#C96040" }}>{c.type}</span>
              {c.pii && <span className="text-xs px-2 py-0.5 rounded font-medium bg-red-50 text-red-500 border border-red-100">PII</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-16">Null {c.nullRate}%</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full" style={{ width: `${100 - c.nullRate}%`, background: "#00C9A7" }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-16">Unique {c.unique}%</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full" style={{ width: `${c.unique}%`, background: "#10B981" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoringMockup() {
  const dims = [
    { label: "Completeness", score: 94, color: "#10B981" },
    { label: "Validity", score: 88, color: "var(--mint)" },
    { label: "Uniqueness", score: 72, color: "#F59E0B" },
    { label: "Accuracy", score: 95, color: "#10B981" },
  ];
  return (
    <div className="rounded-[24px] p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--hair)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.12)" }}>
      <p className="text-xs font-mono text-slate-400">Live DQ Score</p>
      <div className="flex justify-center">
        <AnimatedScoreGauge score={87} />
      </div>
      <div className="space-y-2.5">
        {dims.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-slate-500 text-xs w-24">{d.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full" style={{ width: `${d.score}%`, backgroundColor: d.color }} />
            </div>
            <span className="text-slate-700 text-xs font-medium w-6 text-right">{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesMockup() {
  return (
    <div className="rounded-[24px] p-5 space-y-3" style={{ background: "#fff", border: "1px solid var(--hair)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.12)" }}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-mono text-slate-400">Suggested Rules</p>
        <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: "rgba(224,113,80,0.12)", color: "#C96040" }}>ML SUGGESTED</span>
      </div>
      {[
        { col: "email", rules: ["not_null — HIGH confidence", "regex_match — email format"] },
        { col: "customer_id", rules: ["unique_column — no duplicates"] },
        { col: "age", rules: ["range_check — 0 ≤ age ≤ 120", "not_null"] },
      ].map((item) => (
        <div key={item.col} className="rounded-[14px] p-4 space-y-2" style={{ background: "var(--cream-deep)", border: "1px solid var(--hair)" }}>
          <span className="font-mono text-sm text-slate-800">{item.col}</span>
          {item.rules.map((r) => (
            <div key={r} className="flex items-center gap-2 text-xs text-slate-500">
              <Check className="w-3 h-3 shrink-0" style={{ color: "#E07150" }} />
              {r}
            </div>
          ))}
        </div>
      ))}
      <div
        className="text-center text-sm font-semibold py-2.5 rounded-lg cursor-pointer transition-colors"
        style={{ background: "#E07150", color: "#fff" }}
      >
        Apply All Suggestions →
      </div>
    </div>
  );
}

function TrendsMockup() {
  const bars = [72, 74, 79, 81, 85, 83, 87, 89];
  return (
    <div className="rounded-[24px] p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--hair)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px -10px rgba(26,26,46,0.12)" }}>
      <p className="text-xs font-mono text-slate-400">DQ Score — Last 8 Weeks</p>
      <div className="flex items-end gap-2 h-20">
        {bars.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${(v / 100) * 64}px`,
                background: v >= 85 ? "#10B981" : v >= 75 ? "#00C9A7" : "#F59E0B",
                opacity: 0.85,
              }}
            />
            <span className="text-[10px] text-slate-400">W{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-3.5 flex items-start gap-3 bg-amber-50 border border-amber-100">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-700">Anomaly Detected</p>
          <p className="text-xs text-slate-500 mt-0.5">null_rate spike in column &ldquo;phone&rdquo; — 2 days ago</p>
        </div>
      </div>
    </div>
  );
}

export function CapabilityPillars() {
  return (
    <section id="features" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-20 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--terracotta)" }}>
            Platform Capabilities
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "var(--ink)" }}
          >
            Everything your team needs to{" "}
            <em className="serif-accent" style={{ color: "var(--terracotta-deep)" }}>measure and improve</em>
            {" "}data quality.
          </h2>
        </div>

        {/* Pillars — each in its own pastel color block */}
        <div className="space-y-8">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="rounded-[32px] p-12 grid lg:grid-cols-2 gap-16 items-center"
              style={{
                background: pillarBgs[idx],
                border: "1px solid var(--hair)",
              }}
            >
              {/* Text side */}
              <div className={`space-y-6 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--terracotta)" }}>
                  {pillar.label}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug" style={{ color: "var(--ink)" }}>
                  {pillar.headline}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--ink-mute)" }}>{pillar.body}</p>
                <ul className="space-y-3">
                  {pillar.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm" style={{ color: "var(--ink-soft)" }}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--terracotta)" }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-1">
                  {pillar.tags.map((tag) => (
                    <span key={tag} className="text-[12px] px-3 py-1 rounded-full font-medium" style={{ background: "rgba(26,26,46,0.07)", color: "var(--ink-soft)", border: "1px solid var(--hair-strong)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mockup side */}
              <div className={`flex justify-center ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="w-full max-w-sm">{pillar.mockup}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
