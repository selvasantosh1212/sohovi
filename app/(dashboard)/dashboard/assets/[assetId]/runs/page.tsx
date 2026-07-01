import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Database, ScanSearch, Filter } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getRuns } from "@/app/actions/runs";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { ScoreTrendChart } from "@/components/trends/ScoreTrendChart";
import { RunComparisonTable } from "@/components/trends/RunComparisonTable";
import { AnomalyFlagCard } from "@/components/trends/AnomalyFlagCard";
import { Tooltip } from "@/components/ui/tooltip";
import { formatScopeConditions } from "@/lib/dq-engine/format-scope-conditions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Run History — ${asset?.name ?? "Asset"}` };
}

export default async function RunsPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, runs] = await Promise.all([getAsset(assetId), getRuns(assetId)]);

  if (!asset) notFound();

  return (
    <div className="space-y-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />{asset.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Run History</h1>
        <p className="text-sm text-slate-500 mt-1">
          {runs.length} upload{runs.length !== 1 ? "s" : ""} recorded ·{" "}
          {runs.filter((r) => r.status === "completed").length} with DQ results
        </p>
      </div>

      {runs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-2">
          <p className="text-slate-500 font-medium">No runs yet</p>
          <p className="text-sm text-slate-400">
            Upload a file, run a DQ check, and save it to see history here.
          </p>
          <Link
            href={`/dashboard/assets/${assetId}/upload`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-[#1E3A5F] hover:underline"
          >
            Upload file →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const isProfileOnly = run.status === "profiled";
            const rowBody = (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0 w-14 flex flex-col items-center justify-center">
                    {run.overall_dq_score !== null ? (
                      <>
                        <span className="text-2xl font-bold text-slate-800">
                          {run.overall_dq_score}
                        </span>
                        <ScoreBadge score={run.overall_dq_score} size="sm" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <ScanSearch className="w-5 h-5" />
                        <span className="text-xs">Profile only</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-800 truncate">
                        {run.file_name}
                      </span>
                      {run.schema_changed && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Schema changed
                        </span>
                      )}
                      {run.scope_conditions && run.scope_conditions.length > 0 && (
                        <Tooltip content={formatScopeConditions(run.scope_conditions)}>
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 cursor-help">
                            <Filter className="w-2.5 h-2.5" />
                            Scoped
                          </span>
                        </Tooltip>
                      )}
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          run.status === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : run.status === "failed"
                            ? "bg-red-50 text-red-700"
                            : run.status === "profiled"
                            ? "bg-sky-50 text-sky-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {run.status === "profiled" ? "profiling only" : run.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(run.run_at).toLocaleString()}
                      </span>
                      {run.row_count !== null && (
                        <span className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          {run.row_count.toLocaleString()} rows
                          {run.column_count !== null && ` · ${run.column_count} cols`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {run.overall_dq_score !== null && (
                  <div className="hidden sm:block w-32 shrink-0">
                    <ScoreBar score={run.overall_dq_score} />
                  </div>
                )}
              </div>
            );

            return isProfileOnly ? (
              <div
                key={run.id}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4"
              >
                {rowBody}
              </div>
            ) : (
              <Link
                key={run.id}
                href={`/dashboard/assets/${assetId}/runs/${run.id}`}
                className="block rounded-xl border border-slate-200 bg-white px-5 py-4 hover:shadow-sm transition-shadow"
              >
                {rowBody}
              </Link>
            );
          })}
        </div>
      )}

      {/* Trend + comparison (only show when there are 2+ DQ runs with scores) */}
      {runs.filter((r) => r.overall_dq_score !== null).length > 1 && (
        <>
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-700">Score Trend</h2>
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
              <ScoreTrendChart runs={runs} />
            </div>
            <AnomalyFlagCard runs={runs} />
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-700">Run Comparison</h2>
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
              <RunComparisonTable runs={runs} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
