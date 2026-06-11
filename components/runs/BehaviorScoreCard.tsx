import { ScoreGauge } from "@/components/scoring/ScoreGauge";
import type { BehaviorFlag } from "@/types/dq.types";

interface Props {
  behaviorScore: number | null;
  flags: BehaviorFlag[];
  runsCompared: number;
}

const METRIC_LABEL: Record<string, string> = {
  null_pct:    "Null Rate",
  unique_pct:  "Cardinality",
  avg_value:   "Mean Value",
  min_value:   "Min Value",
  max_value:   "Max Value",
  std_dev:     "Std Dev",
  row_count:   "Row Count",
  type_shift:  "Type Shift",
  distribution: "Distribution",
};

const SEVERITY_COLOR = {
  high:   { bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-700",    dot: "bg-red-500"    },
  medium: { bg: "bg-amber-50",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400"  },
  low:    { bg: "bg-slate-50",  border: "border-slate-200",  badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400"  },
};

export function BehaviorScoreCard({ behaviorScore, flags, runsCompared }: Props) {
  if (runsCompared < 2) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-600">Behavior Score</p>
        <p className="text-xs text-slate-400 mt-1">
          Available after 2+ runs — currently have {runsCompared} historical run{runsCompared === 1 ? "" : "s"}.
        </p>
      </div>
    );
  }

  const sorted = [...flags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const score = behaviorScore ?? 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-800">Behavior Score</p>
          <p className="text-xs text-slate-400 mt-0.5">Based on {runsCompared} historical run{runsCompared === 1 ? "" : "s"}</p>
        </div>
        <ScoreGauge score={score} size="sm" label="Behavior" animated={false} />
      </div>

      {/* Flags */}
      {sorted.length === 0 ? (
        <div className="px-5 py-4 text-center text-xs text-slate-400">
          No behavioral anomalies detected — data is consistent with historical patterns.
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {sorted.map((flag, i) => {
            const colors = SEVERITY_COLOR[flag.severity];
            return (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 ${colors.bg}`}
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-medium text-slate-800 truncate">
                      {flag.column_name === "__dataset__" ? "Dataset" : flag.column_name}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${colors.badge}`}>
                      {METRIC_LABEL[flag.metric] ?? flag.metric}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize ${colors.badge}`}>
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: flag.message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                  />
                  {flag.z_score < 90 && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      z-score: {flag.z_score.toFixed(1)} · expected ≈ {flag.expected_mean.toFixed(2)} ± {flag.expected_std.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
