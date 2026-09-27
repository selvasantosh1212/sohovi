"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { getScopeId } from "@/lib/clerk/utils";
import { hasFeature } from "@/lib/plans/entitlements";
import { averageScore } from "@/lib/scoring/rollup";

export interface TrendPoint {
  date: string;
  score: number;
  run_count: number;
}

export interface WorstAsset {
  id: string;
  name: string;
  score: number;
  last_run_at: string | null;
}

export interface StaleAsset {
  id: string;
  name: string;
  last_run_at: string | null;
  days_since: number | null;
}

export interface PortfolioHealth {
  trend: TrendPoint[];
  worst: WorstAsset[];
  stale: StaleAsset[];
  /** Days after which an asset counts as stale. */
  slaDays: number;
}

/**
 * The whole-portfolio quality picture: where the average score has been going,
 * which assets are dragging it down, and which have gone quiet.
 *
 * Reads only run metadata. Everything is computed from `asset_runs`, which
 * holds scores and timestamps — never rows.
 *
 * Returns `null` when the workspace's plan does not include it, so callers can
 * render a lock without a second entitlement round-trip.
 */
export async function getPortfolioHealth(slaDays = 30): Promise<PortfolioHealth | null> {
  if (!(await hasFeature("portfolioHealth"))) return null;

  const userId = await getScopeId();
  const supabase = createServiceClient();

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [runsRes, assetsRes] = await Promise.all([
    supabase
      .from("asset_runs")
      .select("run_at, overall_dq_score")
      .eq("clerk_user_id", userId)
      .gte("run_at", since.toISOString())
      .not("overall_dq_score", "is", null)
      .order("run_at", { ascending: true }),
    supabase
      .from("data_assets")
      .select("id, name, latest_dq_score, latest_run_id")
      .eq("clerk_user_id", userId),
  ]);

  // Daily average across every run that day — a day with no runs is simply
  // absent rather than plotted as zero, which would read as a quality collapse.
  const byDay = new Map<string, number[]>();
  for (const r of runsRes.data ?? []) {
    const day = String(r.run_at).slice(0, 10);
    const list = byDay.get(day) ?? [];
    list.push(Number(r.overall_dq_score));
    byDay.set(day, list);
  }

  const trend: TrendPoint[] = [...byDay.entries()]
    .map(([date, values]) => ({
      date,
      score: averageScore(values) ?? 0,
      run_count: values.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const assets = assetsRes.data ?? [];

  // Last run time per asset, for the freshness SLA.
  const runIds = assets
    .map((a) => a.latest_run_id as string | null)
    .filter((id): id is string => id != null);

  const lastRunById = new Map<string, string>();
  if (runIds.length > 0) {
    const { data } = await supabase
      .from("asset_runs")
      .select("id, run_at")
      .in("id", runIds)
      .eq("clerk_user_id", userId);
    for (const r of data ?? []) lastRunById.set(r.id as string, r.run_at as string);
  }

  const now = Date.now();
  const daysSince = (iso: string | null): number | null =>
    iso === null ? null : Math.floor((now - new Date(iso).getTime()) / 86_400_000);

  const worst: WorstAsset[] = assets
    .filter((a): a is typeof a & { latest_dq_score: number } => a.latest_dq_score != null)
    .map((a) => ({
      id: a.id as string,
      name: a.name as string,
      score: Number(a.latest_dq_score),
      last_run_at: lastRunById.get(a.latest_run_id as string) ?? null,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const stale: StaleAsset[] = assets
    .map((a) => {
      const lastRun = a.latest_run_id
        ? lastRunById.get(a.latest_run_id as string) ?? null
        : null;
      return {
        id: a.id as string,
        name: a.name as string,
        last_run_at: lastRun,
        days_since: daysSince(lastRun),
      };
    })
    // Never-run assets count as stale: an asset nobody has ever checked is the
    // most stale thing in the portfolio, not an absence of information.
    .filter((a) => a.days_since === null || a.days_since >= slaDays)
    .sort((a, b) => (b.days_since ?? Infinity) - (a.days_since ?? Infinity))
    .slice(0, 5);

  return { trend, worst, stale, slaDays };
}
