import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitCompareArrows } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getReconciliations } from "@/app/actions/reconciliations";
import { hasFeature } from "@/lib/plans/entitlements";
import { FeatureLockCard } from "@/components/shared/FeatureLockCard";
import { ReconcileFlow } from "@/components/reconcile/ReconcileFlow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Reconcile — ${asset?.name ?? "Asset"}` };
}

export default async function ReconcilePage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, canReconcile, canFuzzy] = await Promise.all([
    getAsset(assetId),
    hasFeature("reconciliation"),
    hasFeature("fuzzyMatching"),
  ]);
  if (!asset) notFound();

  const history = canReconcile ? await getReconciliations(assetId) : [];

  return (
    <div className="space-y-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {asset.name}
        </Link>
        <div className="flex items-center gap-2">
          <GitCompareArrows className="w-5 h-5 text-[#1E3A5F]" />
          <h1 className="text-2xl font-bold text-slate-900">Reconcile</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Compare two files on a shared key to see what moved, what changed and what went
          missing — source against target after a migration, or this month against last.
        </p>
      </div>

      {canReconcile ? (
        <ReconcileFlow assetId={assetId} history={history} canFuzzy={canFuzzy} />
      ) : (
        <FeatureLockCard
          feature="reconciliation"
          description="Reconciliation compares a source and a target file on a shared key and splits the result into missing, new, changed and unchanged — with fuzzy matching for near-miss keys. Available on the Team plan."
        />
      )}
    </div>
  );
}
