import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Pencil, Settings2, Clock, Map, Play,
  Database, ScanSearch, Filter,
} from "lucide-react";
import { getWorkflow } from "@/app/actions/workflows";
import { getAsset } from "@/app/actions/assets";
import { getWorkflowRuns } from "@/app/actions/runs";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { WorkflowDeleteButton } from "@/components/workflows/WorkflowDeleteButton";
import { Tooltip } from "@/components/ui/tooltip";
import { formatScopeConditions } from "@/lib/dq-engine/format-scope-conditions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const wf = await getWorkflow(workflowId);
  return { title: wf?.name ?? "Workflow" };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const [workflow, runs] = await Promise.all([
    getWorkflow(workflowId),
    getWorkflowRuns(workflowId),
  ]);
  if (!workflow) notFound();

  const asset = await getAsset(workflow.asset_id).catch(() => null);
  const mappingEntries = Object.entries(workflow.column_mappings ?? {});
  const completedRuns = runs.filter((r) => r.status === "completed");

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/workflows"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Workflows
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-[#1E3A5F]" />
              <h1 className="text-2xl font-bold text-slate-900">{workflow.name}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  workflow.is_active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {workflow.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            {workflow.description && (
              <p className="text-sm text-slate-500 mt-1">{workflow.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/workflows/${workflowId}/edit`}
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />Edit
            </Link>
            <WorkflowDeleteButton
              workflowId={workflowId}
              workflowName={workflow.name}
              redirectAfter="/dashboard/workflows"
            />
          </div>
        </div>
      </div>

      {/* Metadata cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400 mb-1">Data Asset</p>
          {asset ? (
            <Link
              href={`/dashboard/assets/${asset.id}`}
              className="text-sm font-medium text-[#1E3A5F] hover:underline"
            >
              {asset.name}
            </Link>
          ) : (
            <p className="text-sm text-slate-500">—</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3 h-3" />Total Runs
          </div>
          <p className="text-2xl font-bold text-slate-800">{runs.length}</p>
          {completedRuns.length > 0 && (
            <p className="text-xs text-slate-400 mt-0.5">{completedRuns.length} with DQ results</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Map className="w-3 h-3" />Column Mappings
          </div>
          <p className="text-2xl font-bold text-slate-800">{mappingEntries.length}</p>
        </div>
      </div>

      {/* Run Workflow CTA */}
      {asset && (
        <div
          className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
          style={{
            background: "rgba(0,201,167,0.06)",
            border: "1px solid rgba(0,201,167,0.2)",
          }}
        >
          <div>
            <p className="font-semibold text-slate-800">Run this workflow</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Upload a new file for <span className="font-medium">{asset.name}</span>. Column
              mappings will be applied, then you can run the DQ check and save the result to
              this workflow&apos;s history.
            </p>
          </div>
          <Link
            href={`/dashboard/assets/${asset.id}/upload?workflowId=${workflowId}`}
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#00C9A7", color: "#0d1e33" }}
          >
            <Play className="w-3.5 h-3.5" />
            Run Workflow
          </Link>
        </div>
      )}

      {/* Run History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700">Run History</h2>
          {runs.length > 0 && (
            <p className="text-xs text-slate-400">
              {runs.length} run{runs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {runs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center space-y-2">
            <p className="text-sm font-medium text-slate-500">No runs yet</p>
            <p className="text-xs text-slate-400">
              Click &quot;Run Workflow&quot; above, upload a file, run the DQ check, and save it —
              results will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {runs.map((run) => {
              const isProfileOnly = run.status === "profiled";
              const rowBody = (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Score */}
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
                          <span className="text-[10px]">Profile only</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800 truncate text-sm">
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
                              : "bg-sky-50 text-sky-700"
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
                    <div className="hidden sm:block w-28 shrink-0">
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
                  href={`/dashboard/assets/${workflow.asset_id}/runs/${run.id}`}
                  className="block rounded-xl border border-slate-200 bg-white px-5 py-4 hover:shadow-sm transition-shadow"
                >
                  {rowBody}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Column mappings */}
      {mappingEntries.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Column Mappings</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These mappings rename incoming columns to canonical names before DQ rules are applied.
            </p>
          </div>
          <div className="divide-y divide-slate-50">
            {mappingEntries.map(([src, tgt]) => (
              <div key={src} className="flex items-center gap-4 px-5 py-3 text-sm">
                <span className="flex-1 font-mono text-slate-600 truncate">{src}</span>
                <span className="text-slate-300">→</span>
                <span className="flex-1 font-mono text-[#00C9A7] truncate">{tgt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
