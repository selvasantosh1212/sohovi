import { getAssets } from "@/app/actions/assets";
import { getRuns } from "@/app/actions/runs";
import { ReportsClient } from "./ReportsClient";

export const metadata = { title: "Reports — Sohovi" };

export default async function ReportsPage() {
  const assets = await getAssets();

  // Load runs for all assets in parallel (cap at 10 assets to avoid too many queries)
  const assetSample = assets.slice(0, 10);
  const runsPerAsset = await Promise.all(
    assetSample.map(async (a) => ({ asset: a, runs: await getRuns(a.id) }))
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Reports</h1>
        <p className="text-[14px] text-slate-500 mt-1.5">
          Export DQ summaries as PDF or Excel across your data assets.
        </p>
      </div>

      <ReportsClient assetRuns={runsPerAsset} />
    </div>
  );
}
