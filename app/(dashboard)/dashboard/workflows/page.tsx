import Link from "next/link";
import { Plus, Settings2, Clock } from "lucide-react";
import { getWorkflows } from "@/app/actions/workflows";
import { PlanGate } from "@/components/shared/PlanGate";
import { WorkflowDeleteButton } from "@/components/workflows/WorkflowDeleteButton";

export const metadata = { title: "Workflows" };

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();

  return (
    <div className="space-y-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Workflows</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">
            Reusable DQ check configurations with column mappings.
          </p>
        </div>
        <Link
          href="/dashboard/workflows/new"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "#1A1A2E" }}
        >
          <Plus className="w-4 h-4" />New Workflow
        </Link>
      </div>

      <PlanGate
        minPlan="pro"
        feature="Workflows & Automation"
        description="Reusable workflows and automation are available on the Pro plan. Upgrade to save column-mapping configurations for repeat runs."
      >
      {workflows.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-[#EEF0F3] bg-[#F8FAFC] p-12 text-center space-y-2">
          <p className="text-slate-500 font-medium">No workflows yet</p>
          <p className="text-[13px] text-slate-400">
            Create a workflow to save a reusable DQ configuration for a data asset.
          </p>
          <Link
            href="/dashboard/workflows/new"
            className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-semibold px-4 py-2 rounded-full text-white"
            style={{ background: "#1A1A2E" }}
          >
            Create your first workflow →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="flex items-center rounded-[16px] border border-[#EEF0F3] bg-white hover:shadow-sm transition-shadow duration-150"
            >
              <Link
                href={`/dashboard/workflows/${wf.id}`}
                className="flex-1 min-w-0 flex items-center gap-4 px-5 py-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="rounded-lg p-2 shrink-0" style={{ background: "rgba(26,26,46,0.06)" }}>
                    <Settings2 className="w-4 h-4" style={{ color: "#1A1A2E" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 truncate">{wf.name}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          wf.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {wf.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {wf.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{wf.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {wf.run_count} run{wf.run_count !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {Object.keys(wf.column_mappings ?? {}).length} mapping
                    {Object.keys(wf.column_mappings ?? {}).length !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
              <div className="pr-3">
                <WorkflowDeleteButton workflowId={wf.id} workflowName={wf.name} />
              </div>
            </div>
          ))}
        </div>
      )}
      </PlanGate>
    </div>
  );
}
