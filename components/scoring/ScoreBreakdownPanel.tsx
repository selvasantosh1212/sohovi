import Link from "next/link";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import type { ScoreBreakdown } from "@/app/actions/rollups";

const DIMENSION_LABELS: Record<string, string> = {
  completeness: "Completeness",
  validity: "Validity",
  accuracy: "Accuracy",
  uniqueness: "Uniqueness",
  consistency: "Consistency",
  integrity: "Integrity",
  timeliness: "Timeliness",
  currency: "Currency",
  conformity: "Conformity",
  precision: "Precision",
};

function formatDate(value: string | null): string {
  if (!value) return "Never run";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * The rolled-up quality picture for a catalog or business unit: the average
 * score, the assets that make it up, and which dimensions are dragging it down.
 *
 * `label` names the level ("catalog" / "business unit") so the copy can say
 * plainly that the score is an unweighted average of member assets.
 */
export function ScoreBreakdownPanel({
  breakdown,
  label,
}: {
  breakdown: ScoreBreakdown;
  label: string;
}) {
  const { score, asset_count, scored_count, assets, dimensions } = breakdown;

  if (asset_count === 0) {
    return (
      <Card className="p-6 border border-[#EEF0F3] rounded-2xl">
        <p className="text-sm text-slate-500">
          No assets in this {label} yet. Add one and run it to see a rolled-up score.
        </p>
      </Card>
    );
  }

  const weakest = dimensions.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 border border-[#EEF0F3] flex flex-col gap-3 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4" />
            {label === "catalog" ? "Catalog" : "Business unit"} score
          </div>
          {score !== null ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">{score}</span>
                <ScoreBadge score={score} size="sm" />
              </div>
              <ScoreBar score={score} />
              <p className="text-[11px] text-slate-400">
                Average of {scored_count} scored asset{scored_count === 1 ? "" : "s"} — each
                asset counts equally, regardless of row count.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Not scored yet — run at least one asset in this {label}.
            </p>
          )}
        </Card>

        <Card className="p-5 border border-[#EEF0F3] flex flex-col gap-2 rounded-2xl">
          <div className="text-sm text-slate-500">Coverage</div>
          <div className="text-3xl font-bold text-slate-900">
            {scored_count}
            <span className="text-lg text-slate-400 font-medium">/{asset_count}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {asset_count - scored_count === 0
              ? "Every asset has been run."
              : `${asset_count - scored_count} asset${asset_count - scored_count === 1 ? " has" : "s have"} never been run and are excluded from the average.`}
          </p>
        </Card>

        <Card className="p-5 border border-[#EEF0F3] flex flex-col gap-2 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <AlertTriangle className="w-4 h-4" />
            At risk
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {assets.filter((a) => a.score !== null && a.score < 60).length}
          </div>
          <p className="text-[11px] text-slate-400">Assets scoring below 60.</p>
        </Card>
      </div>

      {weakest.length > 0 && (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Weakest dimensions</h3>
          <div className="space-y-2.5">
            {weakest.map((d) => (
              <div key={d.dimension} className="flex items-center gap-3">
                <span className="text-[13px] text-slate-600 w-32 shrink-0">
                  {DIMENSION_LABELS[d.dimension] ?? d.dimension}
                </span>
                <div className="flex-1">
                  <ScoreBar score={d.score} />
                </div>
                <span className="text-[13px] font-medium text-slate-700 w-10 text-right">
                  {d.score}
                </span>
                <span className="text-[11px] text-slate-400 w-16 text-right">
                  {d.rule_count} rule{d.rule_count === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Assets by score</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-[#EEF0F3]">
                <th className="font-medium py-2 pr-4">Asset</th>
                <th className="font-medium py-2 pr-4 text-right">Score</th>
                <th className="font-medium py-2 pr-4 text-right">Failing rules</th>
                <th className="font-medium py-2 pr-4 text-right">Rows</th>
                <th className="font-medium py-2 text-right">Last run</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-b border-[#F5F6F8] last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link
                      href={`/dashboard/assets/${a.id}`}
                      className="text-slate-700 hover:text-slate-900 font-medium"
                    >
                      {a.name}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-right">
                    {a.score !== null ? (
                      <ScoreBadge score={a.score} size="sm" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-600">
                    {a.total_rules > 0 ? `${a.failing_rules}/${a.total_rules}` : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-500">
                    {a.row_count?.toLocaleString() ?? "—"}
                  </td>
                  <td className="py-2.5 text-right text-slate-500">{formatDate(a.last_run_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
