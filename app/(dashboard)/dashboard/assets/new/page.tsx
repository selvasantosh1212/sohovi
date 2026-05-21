import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCatalogs } from "@/app/actions/catalogs";
import { createAsset } from "@/app/actions/assets";
import { AssetForm } from "@/components/assets/AssetForm";

export const metadata = { title: "New Data Asset" };

export default async function NewAssetPage({
  searchParams,
}: {
  searchParams: Promise<{ catalogId?: string }>;
}) {
  const { catalogId } = await searchParams;
  const catalogs = await getCatalogs();

  if (catalogs.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <Link
            href="/dashboard/assets"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">New Data Asset</h1>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-800 font-medium mb-2">No catalogs yet</p>
          <p className="text-amber-700 text-sm mb-4">
            You need a catalog (and a business unit) before creating a data asset.
          </p>
          <Link
            href="/dashboard/business-units/new"
            className="text-sm font-semibold text-amber-800 underline"
          >
            Create Business Unit →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/assets"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Back to Assets
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Data Asset</h1>
        <p className="text-slate-500 mt-1">
          Register a data asset. You'll upload a file and run DQ checks from the asset detail page.
        </p>
      </div>
      <AssetForm
        catalogs={catalogs}
        defaultCatalogId={catalogId}
        onSubmit={createAsset}
      />
    </div>
  );
}
