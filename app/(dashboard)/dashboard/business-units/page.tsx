import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { getBusinessUnits } from "@/app/actions/business-units";
import { getCatalogs } from "@/app/actions/catalogs";
import { getAssets } from "@/app/actions/assets";
import { BUCard } from "@/components/business-units/BUCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = { title: "Business Units" };

export default async function BusinessUnitsPage() {
  const [bus, catalogs, assets] = await Promise.all([
    getBusinessUnits(),
    getCatalogs(),
    getAssets(),
  ]);

  const buWithCounts = bus.map((bu) => {
    const buCatalogIds = catalogs
      .filter((c) => c.business_unit_id === bu.id)
      .map((c) => c.id);
    const buAssets = assets.filter((a) => buCatalogIds.includes(a.catalog_id!));
    const scores = buAssets
      .map((a) => a.latest_dq_score)
      .filter((s): s is number => s != null);
    return {
      ...bu,
      catalog_count: buCatalogIds.length,
      latest_dq_score: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : undefined,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Business Units</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">Top-level grouping for your data catalogs.</p>
        </div>
        <Link
          href="/dashboard/business-units/new"
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: "#1A1A2E" }}
        >
          <Plus className="w-4 h-4" />
          New Business Unit
        </Link>
      </div>

      {buWithCounts.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No business units yet"
          description="Create your first business unit to start organising your data catalogs and assets."
          actionLabel="Create Business Unit"
          actionHref="/dashboard/business-units/new"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {buWithCounts.map((bu) => (
            <BUCard key={bu.id} bu={bu} />
          ))}
        </div>
      )}
    </div>
  );
}
