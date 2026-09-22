"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { getScopeId } from "@/lib/clerk/utils";
import { requireFeature } from "@/lib/plans/entitlements";
import { averageScore } from "@/lib/scoring/rollup";

/** One asset's contribution to its parent's rolled-up score. */
export interface AssetScoreRow {
  id: string;
  name: string;
  score: number | null;
  last_run_at: string | null;
  row_count: number | null;
  failing_rules: number;
  total_rules: number;
}

/** One dimension's average across every scored asset beneath a parent. */
export interface DimensionRollup {
  dimension: string;
  score: number;
  rule_count: number;
}

export interface ScoreBreakdown {
  /** Unweighted mean of the scored assets. `null` when nothing has been run. */
  score: number | null;
  asset_count: number;
  scored_count: number;
  assets: AssetScoreRow[];
  dimensions: DimensionRollup[];
}

interface AssetRow {
  id: string;
  name: string;
  latest_dq_score: number | null;
  latest_run_id: string | null;
}

/**
 * Builds the breakdown for a set of assets: per-asset rows, the rolled-up
 * score, and per-dimension averages taken from each asset's latest run.
 *
 * Only metadata is read — `asset_runs` and `dq_scores` hold scores and counts,
 * never the underlying rows.
 */
async function buildBreakdown(assets: AssetRow[], userId: string): Promise<ScoreBreakdown> {
  // `runIds` come from assets already filtered by clerk_user_id, so every id
  // here is in scope. asset_runs is scoped again defensively; dq_scores has no
  // clerk_user_id column and is reachable only through a scoped run_id.
  const supabase = createServiceClient();
  const runIds = assets.map((a) => a.latest_run_id).filter((id): id is string => id != null);

  const [runsRes, scoresRes] = await Promise.all([
    runIds.length
      ? supabase
          .from("asset_runs")
          .select("id, run_at, row_count")
          .in("id", runIds)
          .eq("clerk_user_id", userId)
      : Promise.resolve({ data: [] as Array<{ id: string; run_at: string; row_count: number | null }> }),
    runIds.length
      ? supabase
          .from("dq_scores")
          .select("run_id, dimension, score, status")
          .in("run_id", runIds)
      : Promise.resolve({ data: [] as Array<{ run_id: string; dimension: string; score: number; status: string }> }),
  ]);

  const runs = new Map(
    (runsRes.data ?? []).map((r) => [r.id, r as { id: string; run_at: string; row_count: number | null }])
  );
  const scores = scoresRes.data ?? [];

  const byRun = new Map<string, Array<{ dimension: string; score: number; status: string }>>();
  for (const s of scores) {
    const list = byRun.get(s.run_id) ?? [];
    list.push(s);
    byRun.set(s.run_id, list);
  }

  const assetRows: AssetScoreRow[] = assets.map((a) => {
    const run = a.latest_run_id ? runs.get(a.latest_run_id) : undefined;
    const ruleScores = a.latest_run_id ? byRun.get(a.latest_run_id) ?? [] : [];
    return {
      id: a.id,
      name: a.name,
      score: a.latest_dq_score,
      last_run_at: run?.run_at ?? null,
      row_count: run?.row_count ?? null,
      failing_rules: ruleScores.filter((r) => r.status === "fail").length,
      total_rules: ruleScores.length,
    };
  });

  // Dimension averages: dq_scores.score is a 0–1 fraction, surfaced as 0–100
  // to match the overall score everywhere else in the UI.
  const byDimension = new Map<string, number[]>();
  for (const s of scores) {
    const list = byDimension.get(s.dimension) ?? [];
    list.push(Number(s.score) * 100);
    byDimension.set(s.dimension, list);
  }

  const dimensions: DimensionRollup[] = [...byDimension.entries()]
    .map(([dimension, values]) => ({
      dimension,
      score: averageScore(values) ?? 0,
      rule_count: values.length,
    }))
    .sort((a, b) => a.score - b.score);

  return {
    score: averageScore(assets.map((a) => a.latest_dq_score)) ?? null,
    asset_count: assets.length,
    scored_count: assets.filter((a) => a.latest_dq_score != null).length,
    assets: assetRows.sort((a, b) => (a.score ?? 101) - (b.score ?? 101)),
    dimensions,
  };
}

/** Score breakdown for one catalog. Team feature. */
export async function getCatalogBreakdown(catalogId: string): Promise<ScoreBreakdown> {
  await requireFeature("catalogScoring");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("data_assets")
    .select("id, name, latest_dq_score, latest_run_id")
    .eq("catalog_id", catalogId)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);

  return buildBreakdown((data ?? []) as AssetRow[], userId);
}

/** Score breakdown for one business unit, across all of its catalogs. Team feature. */
export async function getBusinessUnitBreakdown(businessUnitId: string): Promise<ScoreBreakdown> {
  await requireFeature("catalogScoring");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data: catalogs, error: catErr } = await supabase
    .from("catalogs")
    .select("id")
    .eq("business_unit_id", businessUnitId)
    .eq("clerk_user_id", userId);
  if (catErr) throw new Error(catErr.message);

  const catalogIds = (catalogs ?? []).map((c) => c.id);
  if (catalogIds.length === 0) {
    return { score: null, asset_count: 0, scored_count: 0, assets: [], dimensions: [] };
  }

  const { data, error } = await supabase
    .from("data_assets")
    .select("id, name, latest_dq_score, latest_run_id")
    .in("catalog_id", catalogIds)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);

  return buildBreakdown((data ?? []) as AssetRow[], userId);
}
