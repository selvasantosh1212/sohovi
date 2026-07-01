import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getRuns } from "@/app/actions/runs";
import { ScoringDashboard } from "@/components/scoring/ScoringDashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Scoring — ${asset?.name ?? "Asset"}` };
}

export default async function ScoringPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, runs] = await Promise.all([getAsset(assetId), getRuns(assetId)]);

  if (!asset) notFound();

  return (
    <div className="space-y-6 max-w-7xl 2xl:max-w-[1800px]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/dashboard/assets/${assetId}/rules`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />Rules
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href={`/dashboard/assets/${assetId}/runs`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
          >
            <History className="w-3.5 h-3.5" />
            {runs.length} previous run{runs.length !== 1 ? "s" : ""}
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">DQ Scoring</h1>
        <p className="text-sm text-slate-500 mt-1">{asset.name}</p>
      </div>

      <ScoringDashboard
        assetId={assetId}
        fileName={asset.upstream_file_name ?? ""}
      />
    </div>
  );
}
