import Link from "next/link";
import { Plus, Database } from "lucide-react";
import { getAssets } from "@/app/actions/assets";
import { getCatalogs } from "@/app/actions/catalogs";
import { AssetCard } from "@/components/assets/AssetCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = { title: "Data Assets" };

export default async function AssetsPage() {
  const [assets, catalogs] = await Promise.all([getAssets(), getCatalogs()]);

  return (
    <div className="space-y-6 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Data Assets</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">
            Upload files, run DQ checks, and track data quality over time.
          </p>
        </div>
        <Link
          href="/dashboard/assets/new"
          className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: "#1A1A2E" }}
        >
          <Plus className="w-4 h-4" />
          New Asset
        </Link>
      </div>

      {assets.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No data assets yet"
          description={
            catalogs.length === 0
              ? "Create a business unit and catalog first, then add a data asset."
              : "Add your first data asset to start profiling and running DQ checks."
          }
          actionLabel="New Data Asset"
          actionHref="/dashboard/assets/new"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {assets.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}
