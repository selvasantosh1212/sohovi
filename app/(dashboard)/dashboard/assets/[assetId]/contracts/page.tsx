import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileCheck2 } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getContracts, getContractEvaluations } from "@/app/actions/contracts";
import { hasFeature } from "@/lib/plans/entitlements";
import { FeatureLockCard } from "@/components/shared/FeatureLockCard";
import { ContractsClient } from "@/components/contracts/ContractsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Contracts — ${asset?.name ?? "Asset"}` };
}

export default async function ContractsPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, canUse] = await Promise.all([getAsset(assetId), hasFeature("dataContracts")]);
  if (!asset) notFound();

  const [contracts, evaluations] = canUse
    ? await Promise.all([getContracts(assetId), getContractEvaluations(assetId)])
    : [[], {}];

  return (
    <div className="space-y-6 max-w-4xl xl:max-w-5xl">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {asset.name}
        </Link>
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#1E3A5F]" />
          <h1 className="text-2xl font-bold text-slate-900">Data contracts</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Decide in advance what an acceptable file looks like, then accept or bounce every
          arrival against it — with a record of exactly why.
        </p>
      </div>

      {canUse ? (
        <ContractsClient assetId={assetId} contracts={contracts} evaluations={evaluations} />
      ) : (
        <FeatureLockCard
          feature="dataContracts"
          description="Data contracts turn a partner's monthly file into a pass-or-bounce decision: a minimum score, no unexpected schema changes, and the rules that must hold — evaluated automatically on every run. Available on the Team plan."
        />
      )}
    </div>
  );
}
