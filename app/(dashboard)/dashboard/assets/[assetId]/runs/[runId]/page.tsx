import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Database, FileText } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getRunWithScores, getProfilingForRun } from "@/app/actions/runs";
import { ScoreGauge } from "@/components/scoring/ScoreGauge";
import { ScoreBadge } from "@/components/shared/ScoreBadge";
import { BehaviorScoreCard } from "@/components/runs/BehaviorScoreCard";
import { ColumnProfileCard } from "@/components/profiling/ColumnProfileCard";
import { summaryToProfile } from "@/lib/profiling/profiling-adapter";
import type { BehaviorFlag } from "@/types/dq.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string; runId: string }>;
}) {
  const { runId } = await params;
  return { title: `Run ${runId.slice(0, 8)}…` };
}

const DIMENSION_BADGE: Record<string, string> = {
  completeness: "bg-blue-100 text-blue-700",
  validity:     "bg-purple-100 text-purple-700",
  accuracy:     "bg-green-100 text-green-700",
  uniqueness:   "bg-yellow-100 text-yellow-700",
  consistency:  "bg-orange-100 text-orange-700",
  integrity:    "bg-red-100 text-red-700",
  timeliness:   "bg-teal-100 text-teal-700",
  currency:     "bg-cyan-100 text-cyan-700",
  conformity:   "bg-indigo-100 text-indigo-700",
  precision:    "bg-pink-100 text-pink-700",
};

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ assetId: string; runId: string }>;
}) {
  const { assetId, runId } = await params;
  const [asset, runData, profilingSummaries] = await Promise.all([
    getAsset(assetId),
    getRunWithScores(runId),
    getProfilingForRun(runId),
  ]);

  if (!asset || !runData) notFound();

  const { run, scores } = runData;

  // Group scores by column
  const byColumn = scores.reduce<Record<string, typeof scores>>((acc, s) => {
    const key = s.column_name ?? "__dataset__";
    acc[key] = acc[key] ?? [];
    acc[key].push(s);
    return acc;
  }, {});

  const columnNames = Object.keys(byColumn).sort((a, b) => {
    // Sort by worst score first
    const aMin = Math.min(...byColumn[a].map((s) => s.score));
    const bMin = Math.min(...byColumn[b].map((s) => s.score));
    return aMin - bMin;
  });

  const failedScores = scores.filter((s) => s.status === "fail");
  const passedScores = scores.filter((s) => s.status === "pass");

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/assets/${assetId}/runs`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Run History
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 truncate max-w-lg">
              {run.file_name}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(run.run_at).toLocaleString()}
              </span>
              {run.row_count !== null && (
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {run.row_count.toLocaleString()} rows · {run.column_count} cols
                </span>
              )}
              {run.file_size_bytes !== null && (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {(run.file_size_bytes / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <ScoreBadge score={run.overall_dq_score ?? 0} size="md" />
          </div>
        </div>
      </div>

      {/* Score gauges — DQ + Behavior side by side */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <ScoreGauge score={run.overall_dq_score ?? 0} size="lg" label="Overall DQ Score" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          {[
            { label: "Total Rules", value: scores.length },
            { label: "Passed", value: passedScores.length, className: "text-emerald-600" },
            { label: "Failed", value: failedScores.length, className: "text-red-500" },
            { label: "Columns", value: columnNames.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center"
            >
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.className ?? "text-slate-800"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral score card */}
      <BehaviorScoreCard
        behaviorScore={run.behavior_score ?? null}
        flags={(run.behavior_flags as BehaviorFlag[]) ?? []}
        runsCompared={run.runs_compared ?? 0}
      />

      {/* Schema change banner */}
      {run.schema_changed && run.schema_diff && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="font-medium text-amber-800 text-sm mb-2">Schema changed since last run</p>
          <div className="flex gap-6 text-xs text-amber-700">
            {run.schema_diff.added.length > 0 && (
              <span>+ {run.schema_diff.added.join(", ")}</span>
            )}
            {run.schema_diff.removed.length > 0 && (
              <span>− {run.schema_diff.removed.join(", ")}</span>
            )}
          </div>
        </div>
      )}

      {/* Data Profile — shapes, patterns, outliers from stored profiling_summaries */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Data Profile</h2>
        {profilingSummaries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profilingSummaries.map((s) => (
              <ColumnProfileCard key={s.column_name} profile={summaryToProfile(s)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No profiling snapshot available for this run.</p>
        )}
      </div>

      {/* Per-column breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Rule Results by Column</h2>
        <div className="space-y-3">
          {columnNames.map((col) => {
            const colScores = byColumn[col];
            const colFails = colScores.filter((s) => s.status === "fail");
            const worstScore = Math.min(...colScores.map((s) => s.score));
            return (
              <div key={col} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-slate-800">
                      {col === "__dataset__" ? "Dataset" : col}
                    </span>
                    {colFails.length > 0 && (
                      <span className="text-xs text-red-500 font-medium">
                        {colFails.length} fail{colFails.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          worstScore >= 0.95
                            ? "bg-emerald-400"
                            : worstScore >= 0.8
                            ? "bg-[#00C9A7]"
                            : worstScore >= 0.6
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${Math.round(worstScore * 100)}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        worstScore >= 0.95
                          ? "text-emerald-600"
                          : worstScore >= 0.8
                          ? "text-[#00C9A7]"
                          : worstScore >= 0.6
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {Math.round(worstScore * 100)}%
                    </span>
                  </div>
                </div>

                {/* Score rows */}
                <div className="divide-y divide-slate-50">
                  {colScores.map((score) => (
                    <div
                      key={score.id}
                      className={`flex items-center gap-3 px-4 py-2.5 ${
                        score.status === "fail" ? "bg-red-50/30" : ""
                      }`}
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize ${
                          DIMENSION_BADGE[score.dimension] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {score.dimension}
                      </span>
                      <span className="flex-1 text-xs text-slate-700 truncate">
                        {score.rule_type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[200px] hidden md:block">
                        {score.message ?? ""}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {score.failed_records !== null && score.failed_records > 0 && (
                          <span className="text-[10px] text-red-400">
                            {score.failed_records.toLocaleString()} failed
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            score.status === "pass"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {score.status === "pass" ? "PASS" : "FAIL"}
                        </span>
                        <span className="text-xs font-bold text-slate-700 w-8 text-right">
                          {Math.round(score.score * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
