import { AlertTriangle, TrendingDown } from "lucide-react";
import type { AssetRun } from "@/types/app.types";

interface Props {
  runs: AssetRun[];
}

interface Anomaly {
  type: "score_drop" | "schema_change" | "critical";
  message: string;
  runAt: string;
}

function detectAnomalies(runs: AssetRun[]): Anomaly[] {
  const sorted = [...runs]
    .filter((r) => r.overall_dq_score !== null)
    .sort((a, b) => new Date(a.run_at).getTime() - new Date(b.run_at).getTime());

  const anomalies: Anomaly[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].overall_dq_score as number;
    const curr = sorted[i].overall_dq_score as number;
    const drop = prev - curr;
    if (drop >= 10) {
      anomalies.push({
        type: "score_drop",
        message: `Score dropped ${drop.toFixed(0)} points (${prev} → ${curr})`,
        runAt: sorted[i].run_at,
      });
    }
  }

  for (const run of runs) {
    if (run.schema_changed) {
      anomalies.push({
        type: "schema_change",
        message: `Schema changed in run on ${new Date(run.run_at).toLocaleDateString()}`,
        runAt: run.run_at,
      });
    }
    if (run.overall_dq_score !== null && run.overall_dq_score < 60) {
      anomalies.push({
        type: "critical",
        message: `Critical score: ${run.overall_dq_score} on ${new Date(run.run_at).toLocaleDateString()}`,
        runAt: run.run_at,
      });
    }
  }

  // Deduplicate by message
  return anomalies.filter(
    (a, i, arr) => arr.findIndex((x) => x.message === a.message) === i
  );
}

export function AnomalyFlagCard({ runs }: Props) {
  const anomalies = detectAnomalies(runs);

  if (anomalies.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <p className="text-sm text-emerald-700 font-medium">No anomalies detected across recent runs.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 space-y-2 px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span className="text-sm font-semibold text-amber-800">
          {anomalies.length} anomal{anomalies.length !== 1 ? "ies" : "y"} detected
        </span>
      </div>
      {anomalies.map((a, i) => (
        <div key={i} className="flex items-start gap-2">
          <TrendingDown className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">{a.message}</p>
        </div>
      ))}
    </div>
  );
}
