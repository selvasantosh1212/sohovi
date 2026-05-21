import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBusinessUnits } from "@/app/actions/business-units";
import { createCatalog } from "@/app/actions/catalogs";
import { CatalogForm } from "@/components/catalogs/CatalogForm";

export const metadata = { title: "New Catalog" };

export default async function NewCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ buId?: string }>;
}) {
  const { buId } = await searchParams;
  const businessUnits = await getBusinessUnits();

  if (businessUnits.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <Link href="/dashboard/catalogs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />Back
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">New Catalog</h1>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-800 font-medium mb-2">No business units yet</p>
          <p className="text-amber-700 text-sm mb-4">You need a business unit before creating a catalog.</p>
          <Link href="/dashboard/business-units/new" className="text-sm font-semibold text-amber-800 underline">
            Create Business Unit →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/dashboard/catalogs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />Back to Catalogs
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Catalog</h1>
        <p className="text-slate-500 mt-1">Group related data assets together.</p>
      </div>
      <CatalogForm
        businessUnits={businessUnits}
        defaultBuId={buId}
        onSubmit={createCatalog}
      />
    </div>
  );
}
