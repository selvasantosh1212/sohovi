import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { RemediationClient } from "./RemediationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Remediation — ${asset?.name ?? "Asset"}` };
}

export default async function RemediationPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  if (!asset) notFound();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}/scoring`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Scoring
        </Link>
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#1E3A5F]" />
          <h1 className="text-2xl font-bold text-slate-900">Remediation</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Review failed records, get fix suggestions, and export a cleaned file.
        </p>
      </div>

      <RemediationClient
        assetId={assetId}
        assetName={asset.name}
        fileName={asset.upstream_file_name ?? undefined}
      />
    </div>
  );
}
