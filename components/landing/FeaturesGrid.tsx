import {
  BarChart3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  GitBranch,
  AlertTriangle,
  FileSearch,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Deep Data Profiling",
    description:
      "Row counts, null rates, unique values, type inference, top/bottom 5 values, frequency tables, outliers, PII detection — all computed client-side in seconds.",
    badge: "Core",
    color: "#1E3A5F",
  },
  {
    icon: ShieldCheck,
    title: "10-Dimension DQ Engine",
    description:
      "Apply rules across Completeness, Accuracy, Validity, Uniqueness, Consistency, Integrity, Timeliness, Currency, Conformity, and Precision.",
    badge: "Core",
    color: "#1E3A5F",
  },
  {
    icon: Sparkles,
    title: "Smart Rule Suggestions",
    description:
      "Built-in ML engine auto-detects column types (email, phone, date, amount, ID, postal) and suggests the right DQ rules — no API key needed.",
    badge: "ML",
    color: "#00C9A7",
  },
  {
    icon: BarChart3,
    title: "Transparent DQ Scores",
    description:
      "Column-level, dataset-level, catalog-level, and business unit-level scores. Every score shows exactly which rules passed or failed and why.",
    badge: "Scoring",
    color: "#00C9A7",
  },
  {
    icon: TrendingUp,
    title: "Historical Trend Tracking",
    description:
      "Upload the same file weekly, and Sohovi tracks DQ score evolution over time. Detect regressions before they hit production.",
    badge: "Trends",
    color: "#10B981",
  },
  {
    icon: Wrench,
    title: "Client-Side Remediation",
    description:
      "Trim whitespace, fill nulls, standardize dates, deduplicate rows — preview impact and export the cleaned file. Nothing leaves your browser.",
    badge: "Fix",
    color: "#10B981",
  },
  {
    icon: GitBranch,
    title: "Reusable Workflows",
    description:
      "Save your ruleset as a workflow. Re-run it next week with one click. Handle column additions, removals, and renames gracefully.",
    badge: "Automation",
    color: "#F59E0B",
  },
  {
    icon: AlertTriangle,
    title: "Alerts & Anomaly Detection",
    description:
      "Set score thresholds and get notified when quality drops. Detect schema drift, null spikes, and pattern changes between runs.",
    badge: "Monitoring",
    color: "#F59E0B",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#00C9A7" }}>
            Everything you need
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Enterprise data quality for real teams
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Inspired by Collibra, Informatica IDQ, and Alation — but lightweight,
            affordable, and designed for teams who actually use it.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ background: `${f.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${f.color}15`, color: f.color }}
                  >
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
