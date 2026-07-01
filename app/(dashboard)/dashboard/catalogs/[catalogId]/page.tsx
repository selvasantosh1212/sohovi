import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, Database, Pencil } from "lucide-react";
import { getCatalog } from "@/app/actions/catalogs";
import { getAssets } from "@/app/actions/assets";
import { AssetCard } from "@/components/assets/AssetCard";
import { EmptyState } from "@/components/shared/EmptyState";

export async function generateMetadata({ params }: { params: Promise<{ catalogId: string }> }) {
  const { catalogId } = await params;
  const catalog = await getCatalog(catalogId);
  return { title: catalog?.name ?? "Catalog" };
}

export default async function CatalogDetailPage({ params }: { params: Promise<{ catalogId: string }> }) {
  const { catalogId } = await params;
  const [catalog, assets] = await Promise.all([getCatalog(catalogId), getAssets(catalogId)]);
  if (!catalog) notFound();

  return (
    <div className="space-y-6 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
      <div>
        <Link href="/dashboard/catalogs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />Catalogs
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {catalog.business_unit && (
                <Link href={`/dashboard/business-units/${catalog.business_unit.id}`} className="text-xs text-slate-400 hover:text-slate-600">
                  {catalog.business_unit.name}
                </Link>
              )}
              <span className="text-slate-300 text-xs">›</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{catalog.name}</h1>
            {catalog.description && <p className="text-slate-500 mt-1 max-w-xl">{catalog.description}</p>}
            {catalog.owner_name && <p className="text-sm text-slate-400 mt-1">Steward: {catalog.owner_name}</p>}
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/catalogs/${catalogId}/edit`} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <Pencil className="w-3.5 h-3.5" />Edit
            </Link>
            <Link
              href={`/dashboard/assets/new?catalogId=${catalogId}`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#00C9A7", color: "#0d1e33" }}
            >
              <Plus className="w-4 h-4" />New Asset
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          Data Assets <span className="text-slate-400 font-normal">({assets.length})</span>
        </h2>
        {assets.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No data assets yet"
            description="Add a data asset to upload a CSV or Excel file and start profiling."
            actionLabel="New Data Asset"
            actionHref={`/dashboard/assets/new?catalogId=${catalogId}`}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((a) => <AssetCard key={a.id} asset={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
