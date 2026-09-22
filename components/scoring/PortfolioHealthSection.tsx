import Link from "next/link";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBadge } from "@/components/shared/ScoreBadge";
import type { PortfolioHealth } from "@/app/actions/dashboard";

function formatDay(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function scoreColor(score: number): string {
  if (score >= 95) return "#16a34a";
  if (score >= 80) return "#65a30d";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}

/**
 * A 30-day sparkline of the portfolio's daily average score.
 *
 * Drawn as an inline SVG polyline rather than pulling in a chart library — the
 * dashboard already renders several charts and this one has no interaction.
 * The y-axis is pinned to 0–100 so a flat, healthy line reads as flat rather
 * than being auto-scaled into dramatic noise.
 */
function Sparkline({ points }: { points: PortfolioHealth["trend"] }) {
  if (points.length < 2) {
    return (
      <p className="text-[12px] text-slate-400">
        Not enough runs in the last 30 days to plot a trend.
      </p>
    );
  }

  const W = 600;
  const H = 80;
  const step = W / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(H - (p.score / 100) * H).toFixed(1)}`)
    .join(" ");

  const first = points[0].score;
  const last = points[points.length - 1].score;
  const delta = last - first;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">{last}</span>
        <span
          className={`inline-flex items-center gap-1 text-[13px] font-medium ${
            delta >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {delta >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {delta >= 0 ? "+" : ""}
          {delta} over {points.length} day{points.length === 1 ? "" : "s"}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
        <line x1="0" y1={H * 0.4} x2={W} y2={H * 0.4} stroke="#EEF0F3" strokeWidth="1" />
        <path d={path} fill="none" stroke={scoreColor(last)} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{formatDay(points[0].date)}</span>
        <span>{formatDay(points[points.length - 1].date)}</span>
      </div>
    </div>
  );
}

export function PortfolioHealthSection({ health }: { health: PortfolioHealth }) {
  const { trend, worst, stale, slaDays } = health;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="p-5 border border-[#EEF0F3] rounded-2xl lg:col-span-3">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Portfolio score — last 30 days
        </h3>
        <Sparkline points={trend} />
      </Card>

      <Card className="p-5 border border-[#EEF0F3] rounded-2xl lg:col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Needs attention</h3>
        </div>
        {worst.length === 0 ? (
          <p className="text-[12px] text-slate-400">No assets have been scored yet.</p>
        ) : (
          <div className="space-y-2">
            {worst.map((a) => (
              <Link
                key={a.id}
                href={`/dashboard/assets/${a.id}`}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="text-[13px] font-medium text-slate-700 truncate">{a.name}</span>
                <ScoreBadge score={a.score} size="sm" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Gone quiet</h3>
        </div>
        {stale.length === 0 ? (
          <p className="text-[12px] text-slate-400">
            Every asset has run in the last {slaDays} days.
          </p>
        ) : (
          <div className="space-y-2">
            {stale.map((a) => (
              <Link
                key={a.id}
                href={`/dashboard/assets/${a.id}/upload`}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="text-[13px] font-medium text-slate-700 truncate">{a.name}</span>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {a.days_since === null ? "never run" : `${a.days_since}d`}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
