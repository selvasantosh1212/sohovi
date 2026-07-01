import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, BookOpen, Pencil } from "lucide-react";
import { getBusinessUnit } from "@/app/actions/business-units";
import { getCatalogs } from "@/app/actions/catalogs";
import { CatalogCard } from "@/components/catalogs/CatalogCard";
import { EmptyState } from "@/components/shared/EmptyState";

export async function generateMetadata({ params }: { params: Promise<{ buId: string }> }) {
  const { buId } = await params;
  const bu = await getBusinessUnit(buId);
  return { title: bu?.name ?? "Business Unit" };
}

export default async function BUDetailPage({ params }: { params: Promise<{ buId: string }> }) {
  const { buId } = await params;
  const [bu, catalogs] = await Promise.all([getBusinessUnit(buId), getCatalogs(buId)]);
  if (!bu) notFound();

  return (
    <div className="space-y-6 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
      {/* Breadcrumb + header */}
      <div>
        <Link href="/dashboard/business-units" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Business Units
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{bu.name}</h1>
            {bu.description && <p className="text-slate-500 mt-1 max-w-xl">{bu.description}</p>}
            {bu.owner_name && (
              <p className="text-sm text-slate-400 mt-1">Owner: {bu.owner_name}{bu.owner_email ? ` · ${bu.owner_email}` : ""}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/business-units/${buId}/edit`}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Link>
            <Link
              href={`/dashboard/catalogs/new?buId=${buId}`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#00C9A7", color: "#0d1e33" }}
            >
              <Plus className="w-4 h-4" />
              New Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Catalogs */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          Catalogs <span className="text-slate-400 font-normal">({catalogs.length})</span>
        </h2>
        {catalogs.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No catalogs yet"
            description="Add a catalog to group related data assets together."
            actionLabel="New Catalog"
            actionHref={`/dashboard/catalogs/new?buId=${buId}`}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogs.map((c) => <CatalogCard key={c.id} catalog={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
