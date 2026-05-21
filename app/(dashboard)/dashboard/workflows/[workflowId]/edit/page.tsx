import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWorkflow } from "@/app/actions/workflows";
import { getAssets } from "@/app/actions/assets";
import { WorkflowForm } from "@/components/workflows/WorkflowForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const wf = await getWorkflow(workflowId);
  return { title: `Edit — ${wf?.name ?? "Workflow"}` };
}

export default async function EditWorkflowPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  const [workflow, assets] = await Promise.all([
    getWorkflow(workflowId),
    getAssets(),
  ]);
  if (!workflow) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href={`/dashboard/workflows/${workflowId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />{workflow.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Workflow</h1>
      </div>

      <WorkflowForm assets={assets} workflow={workflow} />
    </div>
  );
}
