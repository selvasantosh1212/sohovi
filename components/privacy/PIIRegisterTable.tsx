import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PIIRegisterEntry } from "@/app/actions/privacy";

/**
 * Every PII-flagged column across a catalog, in one table.
 *
 * The question this answers is the one asked before a vendor hand-off or an
 * audit: "where is the personal data in this domain, and who owns it?" —
 * previously only answerable by opening each asset's profile in turn.
 */
export function PIIRegisterTable({ entries }: { entries: PIIRegisterEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card className="p-6 border border-[#EEF0F3] rounded-2xl">
        <p className="text-sm text-slate-500">
          No PII detected in the latest run of any asset in this catalog. Assets that have never
          been run are not represented here.
        </p>
      </Card>
    );
  }

  const assetCount = new Set(entries.map((e) => e.asset_id)).size;

  return (
    <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
      <div className="flex items-start gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-slate-700">PII register</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">
            {entries.length} flagged column{entries.length === 1 ? "" : "s"} across {assetCount}{" "}
            asset{assetCount === 1 ? "" : "s"}, from each asset&rsquo;s latest run.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
              <th className="font-medium py-2 pr-4">Asset</th>
              <th className="font-medium py-2 pr-4">Column</th>
              <th className="font-medium py-2 pr-4">Type</th>
              <th className="font-medium py-2 pr-4 text-right">Empty</th>
              <th className="font-medium py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={`${e.asset_id}-${e.column_name}`}
                className="border-b border-[#F5F6F8] last:border-0"
              >
                <td className="py-2.5 pr-4">
                  <Link
                    href={`/dashboard/assets/${e.asset_id}`}
                    className="text-slate-700 hover:text-slate-900 font-medium"
                  >
                    {e.asset_name}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 font-mono text-slate-600">{e.column_name}</td>
                <td className="py-2.5 pr-4">
                  <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                    {e.pii_type ?? "PII"}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-right text-slate-500">
                  {e.null_pct != null ? `${Math.round(e.null_pct)}%` : "—"}
                </td>
                <td className="py-2.5 text-right">
                  <Link
                    href={`/dashboard/assets/${e.asset_id}/privacy`}
                    className="text-[12px] font-medium text-slate-500 hover:text-slate-800 underline"
                  >
                    De-identify
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
