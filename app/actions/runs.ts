"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans/limits";
import type { AssetRun, DQScore, ProfilingSummary } from "@/types/app.types";
import type { BehaviorFlag, DQRunResult, ScopeCondition } from "@/types/dq.types";
import type { ColumnProfile } from "@/types/profiling.types";
import { computeBehavioralScore } from "@/lib/dq-engine/behavioral-scorer";
import { evaluateAlerts } from "@/app/actions/alerts";

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
  column_profiles?: ColumnProfile[];
  scope_conditions?: ScopeCondition[];
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
      scope_conditions: input.scope_conditions ?? [],
    })
    .select()
    .single();

  if (runErr) throw new Error(runErr.message);

  // 2. Insert per-rule dq_scores rows
  const scoreRows = dqResult.rule_results.map((r) => ({
    run_id: run.id,
    asset_id: input.asset_id,
    column_name: r.column_name ?? "__dataset__",
    description: r.description ?? null,
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

  // 3. Save profiling summaries (aggregated only — no raw row data)
  if (input.column_profiles && input.column_profiles.length > 0) {
    const profilingRows = input.column_profiles.map((p) => ({
      run_id: run.id,
      asset_id: input.asset_id,
      column_name: p.column_name,
      inferred_type: p.inferred_type,
      row_count: p.row_count,
      null_count: p.null_count,
      null_pct: p.null_pct,
      unique_count: p.unique_count,
      unique_pct: p.unique_pct,
      min_value: p.min_value,
      max_value: p.max_value,
      avg_value: p.avg_value,
      std_dev: p.std_dev,
      min_length: p.min_length,
      max_length: p.max_length,
      avg_length: p.avg_length,
      top_values: p.top_values,
      bottom_values: p.bottom_values,
      value_frequency: p.value_frequency,
      pattern_summary: p.pattern_summary,
      pii_detected: p.pii_detected,
      pii_type: p.pii_type,
      outlier_count: p.outlier_count,
      // sample_values intentionally omitted — privacy-first
    }));
    await supabase.from("profiling_summaries").insert(profilingRows);
    // Non-fatal: behavioral scoring degrades gracefully if this fails

    // 3b. Compute behavioral score by comparing against last 10 runs
    const { data: histRuns } = await supabase
      .from("asset_runs")
      .select("id, row_count")
      .eq("asset_id", input.asset_id)
      .eq("clerk_user_id", userId)
      .eq("status", "completed")
      .neq("id", run.id)
      .order("run_at", { ascending: false })
      .limit(10);

    if (histRuns && histRuns.length > 0) {
      const histRunIds = histRuns.map((r) => r.id);
      const { data: histProfiles } = await supabase
        .from("profiling_summaries")
        .select("*")
        .in("run_id", histRunIds);

      if (histProfiles && histProfiles.length > 0) {
        // Group profiles by run_id, preserving order from histRuns
        const profilesByRunId = new Map<string, ProfilingSummary[]>();
        for (const p of histProfiles as ProfilingSummary[]) {
          const arr = profilesByRunId.get(p.run_id) ?? [];
          arr.push(p);
          profilesByRunId.set(p.run_id, arr);
        }
        // oldest-first for the scorer
        const history = histRunIds
          .map((id) => profilesByRunId.get(id) ?? [])
          .filter((g) => g.length > 0)
          .reverse();

        const rowCountHistory = histRuns.map((r) => r.row_count ?? 0).reverse();

        const currentProfiles = input.column_profiles.map((p) => ({
          ...p,
          id: run.id,
          run_id: run.id,
          asset_id: input.asset_id,
          bottom_values: p.bottom_values,
          value_frequency: p.value_frequency,
          sample_values: null,
          created_at: run.run_at,
        })) as unknown as ProfilingSummary[];

        const behaviorResult = computeBehavioralScore(
          currentProfiles,
          history,
          input.row_count,
          rowCountHistory
        );

        await supabase
          .from("asset_runs")
          .update({
            behavior_score: behaviorResult.behavior_score,
            behavior_flags: behaviorResult.flags as unknown as BehaviorFlag[],
            runs_compared: behaviorResult.runs_compared,
          })
          .eq("id", run.id);

        run.behavior_score = behaviorResult.behavior_score;
        run.behavior_flags = behaviorResult.flags;
        run.runs_compared = behaviorResult.runs_compared;
      }
    }
  }

  // 4. Update data_asset with latest score + run id
  await supabase
    .from("data_assets")
    .update({
      latest_run_id: run.id,
      latest_dq_score: dqResult.overall_score,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.asset_id)
    .eq("clerk_user_id", userId);

  // 5. Increment run_count on the associated workflow
  if (input.workflow_id) {
    const { data: wf } = await supabase
      .from("workflows")
      .select("run_count")
      .eq("id", input.workflow_id)
      .eq("clerk_user_id", userId)
      .single();
    if (wf) {
      await supabase
        .from("workflows")
        .update({ run_count: (wf.run_count ?? 0) + 1, updated_at: new Date().toISOString() })
        .eq("id", input.workflow_id)
        .eq("clerk_user_id", userId);
    }
    revalidatePath("/dashboard/workflows");
    revalidatePath(`/dashboard/workflows/${input.workflow_id}`);
  }

  // Evaluate alert conditions non-fatally — a failure here must not break the run save
  try {
    const behaviorFlagsForAlerts =
      run.behavior_flags && Array.isArray(run.behavior_flags) ? (run.behavior_flags as import("@/types/dq.types").BehaviorFlag[]) : [];
    await evaluateAlerts(
      input.asset_id,
      run.id,
      dqResult.overall_score,
      dqResult.rule_results,
      input.schema_changed,
      behaviorFlagsForAlerts
    );
  } catch (err) {
    console.error("[evaluateAlerts] failed silently:", err);
  }

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

// ---- Load runs for a workflow -------------------------------------------

export async function getWorkflowRuns(workflowId: string): Promise<AssetRun[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("asset_runs")
    .select("*")
    .eq("workflow_id", workflowId)
    .eq("clerk_user_id", userId)
    .order("run_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AssetRun[];
}

// ---- Load runs for an asset ---------------------------------------------

export async function getRuns(assetId: string): Promise<AssetRun[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  let query = supabase
    .from("asset_runs")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .order("run_at", { ascending: false });

  const historyDays = PLAN_LIMITS[await getUserPlan()].historyDays;
  if (historyDays !== Infinity) {
    const cutoff = new Date(Date.now() - historyDays * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("run_at", cutoff);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AssetRun[];
}

// ---- Load profiling summaries for a historical run -----------------------

export async function getProfilingForRun(runId: string): Promise<ProfilingSummary[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  // Verify the run belongs to the user before returning its profiling data.
  // profiling_summaries has no clerk_user_id column — ownership is enforced
  // through asset_runs which does have it.
  const { data: run } = await supabase
    .from("asset_runs")
    .select("id")
    .eq("id", runId)
    .eq("clerk_user_id", userId)
    .single();
  if (!run) return [];

  const { data } = await supabase
    .from("profiling_summaries")
    .select("*")
    .eq("run_id", runId)
    .order("column_name", { ascending: true });
  return (data ?? []) as ProfilingSummary[];
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
