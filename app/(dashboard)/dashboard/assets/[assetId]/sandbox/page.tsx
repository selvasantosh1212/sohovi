import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { PlanGate } from "@/components/shared/PlanGate";
import { SandboxClient } from "./SandboxClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Rule Sandbox — ${asset?.name ?? "Asset"}` };
}

export default async function SandboxPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  if (!asset) notFound();

  return (
    <div className="space-y-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}/rules`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Rules
        </Link>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#1E3A5F]" />
          <h1 className="text-2xl font-bold text-slate-900">Rule Sandbox</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Test a DQ rule instantly against your uploaded data — no run saved.
        </p>
      </div>

      <PlanGate
        minPlan="business"
        feature="Rule Sandbox"
        description="The rule testing sandbox is available on the Business plan. Upgrade to test rules instantly against your uploaded data."
      >
        <SandboxClient
          assetId={assetId}
          assetName={asset.name}
          columnSchema={asset.column_schema ?? []}
        />
      </PlanGate>
    </div>
  );
}
