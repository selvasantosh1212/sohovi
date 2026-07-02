import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWorkflow, getWorkflowRules } from "@/app/actions/workflows";
import { getAssets } from "@/app/actions/assets";
import { ApplyWorkflowFlow } from "@/components/workflows/ApplyWorkflowFlow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const wf = await getWorkflow(workflowId);
  return { title: `Apply — ${wf?.name ?? "Workflow"}` };
}

export default async function ApplyWorkflowPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const [workflow, workflowRules, assets] = await Promise.all([
    getWorkflow(workflowId),
    getWorkflowRules(workflowId),
    getAssets(),
  ]);
  if (!workflow) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href={`/dashboard/workflows/${workflowId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />{workflow.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Apply Workflow</h1>
        <p className="text-sm text-slate-500 mt-1">
          Materialize &quot;{workflow.name}&quot;&apos;s {workflowRules.length} rule
          {workflowRules.length !== 1 ? "s" : ""} onto a data asset.
        </p>
      </div>

      {workflowRules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center space-y-2">
          <p className="text-sm font-medium text-slate-500">This workflow has no rules yet</p>
          <p className="text-xs text-slate-400">
            Go to a data asset&apos;s Rules page, select rules, and &quot;Save as Workflow&quot; into this workflow first.
          </p>
        </div>
      ) : (
        <ApplyWorkflowFlow workflow={workflow} workflowRules={workflowRules} assets={assets} />
      )}
    </div>
  );
}
