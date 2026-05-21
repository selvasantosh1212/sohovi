import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAsset, updateAsset } from "@/app/actions/assets";
import { getCatalogs } from "@/app/actions/catalogs";
import { AssetForm } from "@/components/assets/AssetForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: asset ? `Edit ${asset.name}` : "Edit Asset" };
}

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, catalogs] = await Promise.all([getAsset(assetId), getCatalogs()]);
  if (!asset) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Back to {asset.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Asset</h1>
        <p className="text-slate-500 mt-1">Update the metadata for this data asset.</p>
      </div>
      <AssetForm
        existing={asset}
        catalogs={catalogs}
        onSubmit={async (values) => {
          "use server";
          await updateAsset(assetId, values);
        }}
      />
    </div>
  );
}
