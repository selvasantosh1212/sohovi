"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import type { AssetRun, DQScore } from "@/types/app.types";
import type { DQRunResult } from "@/types/dq.types";

// ---- Save a completed DQ run result to Supabase -------------------------

export interface SaveRunInput {
  asset_id: string;
  file_name: string;
  file_size_bytes: number;
  row_count: number;
  column_count: number;
  schema_changed: boolean;
  schema_diff?: {
    added: string[];
    removed: string[];
    renamed: { from: string; to: string }[];
  } | null;
  workflow_id?: string | null;
  notes?: string | null;
}

export async function saveRunResult(
  input: SaveRunInput,
  dqResult: DQRunResult
): Promise<AssetRun> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  // 1. Insert the asset_run record
  const { data: run, error: runErr } = await supabase
    .from("asset_runs")
    .insert({
      asset_id: input.asset_id,
      clerk_user_id: userId,
      file_name: input.file_name,
      file_size_bytes: input.file_size_bytes,
      row_count: input.row_count,
      column_count: input.column_count,
      overall_dq_score: dqResult.overall_score,
      schema_changed: input.schema_changed,
      schema_diff: input.schema_diff ?? null,
      workflow_id: input.workflow_id ?? null,
      status: "completed",
      notes: input.notes ?? null,
      run_at: dqResult.run_at,
    })
    .select()
    .single();

  if (runErr) throw new Error(runErr.message);

  // 2. Insert per-rule dq_scores rows
  const scoreRows = dqResult.rule_results.map((r) => ({
    run_id: run.id,
    asset_id: input.asset_id,
    column_name: r.column_name ?? "__dataset__",
    dimension: r.dimension,
    rule_type: r.rule_type,
    score: r.score,
    threshold: r.threshold,
    status: r.status,
    severity: r.severity,
    total_records: r.total_records,
    failed_records: r.failed_records,
    message: r.message,
  }));

  if (scoreRows.length > 0) {
    const { error: scoresErr } = await supabase.from("dq_scores").insert(scoreRows);
    if (scoresErr) throw new Error(scoresErr.message);
  }

  // 3. Update data_asset with latest score + run id
  await supabase
    .from("data_assets")
    .update({
      latest_run_id: run.id,
      latest_dq_score: dqResult.overall_score,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.asset_id)
    .eq("clerk_user_id", userId);

  revalidatePath(`/dashboard/assets/${input.asset_id}`);
  revalidatePath(`/dashboard/assets/${input.asset_id}/scoring`);
  revalidatePath("/dashboard");

  return run as AssetRun;
}

// ---- Save a profiling-only snapshot (no DQ run) -------------------------

export interface ProfilingSnapshotResult {
  runId: string;
  schemaDiff: { added: string[]; removed: string[]; renamed: { from: string; to: string }[] } | null;
}

export async function saveProfilingSnapshot(input: {
  asset_id: string;
  file_name: string;
  file_size_bytes: number;
  row_count: number;
  column_schema: string[];
}): Promise<ProfilingSnapshotResult> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  // Fetch the previously stored schema before overwriting it
  const { data: existing } = await supabase
    .from("data_assets")
    .select("column_schema")
    .eq("id", input.asset_id)
    .eq("clerk_user_id", userId)
    .single();

  const oldSchema: string[] = (existing?.column_schema as string[] | null) ?? [];
  const newSet = new Set(input.column_schema);
  const oldSet = new Set(oldSchema);
  const added = input.column_schema.filter((c) => !oldSet.has(c));
  const removed = oldSchema.filter((c) => !newSet.has(c));
  const schemaDiff =
    oldSchema.length > 0 && (added.length > 0 || removed.length > 0)
      ? { added, removed, renamed: [] }
      : null;

  const { data: run, error: runErr } = await supabase
    .from("asset_runs")
    .insert({
      asset_id: input.asset_id,
      clerk_user_id: userId,
      file_name: input.file_name,
      file_size_bytes: input.file_size_bytes,
      row_count: input.row_count,
      column_count: input.column_schema.length,
      overall_dq_score: null,
      schema_changed: schemaDiff !== null,
      schema_diff: schemaDiff,
      status: "profiled",
      run_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (runErr) throw new Error(runErr.message);

  // Keep data_asset metadata current with the latest uploaded file
  await supabase
    .from("data_assets")
    .update({
      upstream_file_name: input.file_name,
      column_schema: input.column_schema,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.asset_id)
    .eq("clerk_user_id", userId);

  revalidatePath(`/dashboard/assets/${input.asset_id}`);
  revalidatePath(`/dashboard/assets/${input.asset_id}/runs`);

  return { runId: run.id, schemaDiff };
}

// ---- Load runs for an asset ---------------------------------------------

export async function getRuns(assetId: string): Promise<AssetRun[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("asset_runs")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .order("run_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AssetRun[];
}

// ---- Load a single run with its DQ scores --------------------------------

export interface RunWithScores {
  run: AssetRun;
  scores: DQScore[];
}

export async function getRunWithScores(runId: string): Promise<RunWithScores | null> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data: run, error: runErr } = await supabase
    .from("asset_runs")
    .select("*")
    .eq("id", runId)
    .eq("clerk_user_id", userId)
    .single();

  if (runErr || !run) return null;

  const { data: scores } = await supabase
    .from("dq_scores")
    .select("*")
    .eq("run_id", runId)
    .order("score", { ascending: true });

  return { run: run as AssetRun, scores: (scores ?? []) as DQScore[] };
}
