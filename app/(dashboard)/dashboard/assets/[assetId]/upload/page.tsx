import { notFound } from "next/navigation";
import { getAsset } from "@/app/actions/assets";
import { UploadOrConnect } from "@/components/upload/UploadOrConnect";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: asset ? `Upload — ${asset.name}` : "Upload" };
}

export default async function AssetUploadPage({
  params,
  searchParams,
}: {
  params: Promise<{ assetId: string }>;
  searchParams: Promise<{ workflowId?: string }>;
}) {
  const { assetId } = await params;
  const { workflowId } = await searchParams;
  const asset = await getAsset(assetId);
  if (!asset) notFound();

  return (
    <div className="max-w-3xl">
      <UploadOrConnect
        assetId={assetId}
        assetName={asset.name}
        previousSchema={asset.column_schema ?? null}
        workflowId={workflowId ?? null}
      />
    </div>
  );
}
