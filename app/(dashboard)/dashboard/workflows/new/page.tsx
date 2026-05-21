import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAssets } from "@/app/actions/assets";
import { WorkflowForm } from "@/components/workflows/WorkflowForm";

export const metadata = { title: "New Workflow" };

export default async function NewWorkflowPage({
  searchParams,
}: {
  searchParams: Promise<{ assetId?: string }>;
}) {
  const { assetId } = await searchParams;
  const assets = await getAssets();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/dashboard/workflows"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Workflows
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Workflow</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a reusable DQ configuration with column mappings.
        </p>
      </div>

      <WorkflowForm assets={assets} defaultAssetId={assetId} />
    </div>
  );
}
