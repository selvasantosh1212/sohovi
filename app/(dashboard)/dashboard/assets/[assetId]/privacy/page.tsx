import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getPrivacyAudits } from "@/app/actions/privacy";
import { hasFeature } from "@/lib/plans/entitlements";
import { FeatureLockCard } from "@/components/shared/FeatureLockCard";
import { PrivacyStudioPanel } from "@/components/privacy/PrivacyStudioPanel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: `Privacy — ${asset?.name ?? "Asset"}` };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, canUse] = await Promise.all([getAsset(assetId), hasFeature("privacyStudio")]);
  if (!asset) notFound();

  const history = canUse ? await getPrivacyAudits(assetId) : [];

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
          <ShieldOff className="w-5 h-5 text-[#1E3A5F]" />
          <h1 className="text-2xl font-bold text-slate-900">Privacy Studio</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Classify the personal data in a file, de-identify it, and measure whether the result can
          still be re-identified — before it goes to a vendor, an offshore team or a researcher.
        </p>
      </div>

      {canUse ? (
        <PrivacyStudioPanel assetId={assetId} history={history} />
      ) : (
        <FeatureLockCard
          feature="privacyStudio"
          description="Privacy Studio classifies every column as direct, quasi-identifying, sensitive or safe, applies suppression, masking, pseudonymization and generalization, and reports the k-anonymity you achieved. Available on the Team plan."
        />
      )}
    </div>
  );
}
