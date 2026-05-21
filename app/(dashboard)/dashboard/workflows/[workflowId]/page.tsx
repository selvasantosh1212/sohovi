import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Settings2, Clock, Map } from "lucide-react";
import { getWorkflow } from "@/app/actions/workflows";
import { getAsset } from "@/app/actions/assets";

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
  const workflow = await getWorkflow(workflowId);
  if (!workflow) notFound();

  const asset = await getAsset(workflow.asset_id).catch(() => null);

  const mappingEntries = Object.entries(workflow.column_mappings ?? {});

  return (
    <div className="space-y-6 max-w-3xl">
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
          <Link
            href={`/dashboard/workflows/${workflowId}/edit`}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />Edit
          </Link>
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
          <p className="text-2xl font-bold text-slate-800">{workflow.run_count}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Map className="w-3 h-3" />Column Mappings
          </div>
          <p className="text-2xl font-bold text-slate-800">{mappingEntries.length}</p>
        </div>
      </div>

      {/* Column mappings */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Column Mappings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            These mappings rename incoming columns to canonical names before DQ rules are applied.
          </p>
        </div>
        {mappingEntries.length === 0 ? (
          <p className="px-5 py-4 text-sm text-slate-400">No column mappings defined.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {mappingEntries.map(([src, tgt]) => (
              <div key={src} className="flex items-center gap-4 px-5 py-3 text-sm">
                <span className="flex-1 font-mono text-slate-600 truncate">{src}</span>
                <span className="text-slate-300">→</span>
                <span className="flex-1 font-mono text-[#00C9A7] truncate">{tgt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply to asset */}
      {asset && (
        <div
          className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
          style={{
            background: "rgba(0,201,167,0.06)",
            border: "1px solid rgba(0,201,167,0.2)",
          }}
        >
          <div>
            <p className="font-semibold text-slate-800">Apply this workflow</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Upload a file to {asset.name} with this workflow&apos;s column mappings applied.
            </p>
          </div>
          <Link
            href={`/dashboard/assets/${asset.id}/upload?workflowId=${workflowId}`}
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#00C9A7", color: "#0d1e33" }}
          >
            Upload File →
          </Link>
        </div>
      )}
    </div>
  );
}
