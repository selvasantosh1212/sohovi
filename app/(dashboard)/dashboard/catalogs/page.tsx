import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { getCatalogs } from "@/app/actions/catalogs";
import { getAssets } from "@/app/actions/assets";
import { CatalogCard } from "@/components/catalogs/CatalogCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = { title: "Catalogs" };

export default async function CatalogsPage() {
  const [catalogs, assets] = await Promise.all([getCatalogs(), getAssets()]);

  const catalogsWithCounts = catalogs.map((c) => {
    const catAssets = assets.filter((a) => a.catalog_id === c.id);
    const scores = catAssets
      .map((a) => a.latest_dq_score)
      .filter((s): s is number => s != null);
    return {
      ...c,
      asset_count: catAssets.length,
      latest_dq_score: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : undefined,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Catalogs</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">Group your data assets by domain or team.</p>
        </div>
        <Link
          href="/dashboard/catalogs/new"
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: "#1A1A2E" }}
        >
          <Plus className="w-4 h-4" />
          New Catalog
        </Link>
      </div>

      {catalogsWithCounts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No catalogs yet"
          description="Create a catalog to group related data assets. You'll need a business unit first."
          actionLabel="New Catalog"
          actionHref="/dashboard/catalogs/new"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {catalogsWithCounts.map((c) => <CatalogCard key={c.id} catalog={c} />)}
        </div>
      )}
    </div>
  );
}
