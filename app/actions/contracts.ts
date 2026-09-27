"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { requireFeature, hasFeature } from "@/lib/plans/entitlements";
import { assertAssetInScope } from "@/lib/supabase/ownership";
import type {
  DataContract,
  DataContractInput,
  ContractEvaluation,
  ContractFailure,
} from "@/types/contracts.types";

export async function getContracts(assetId: string): Promise<DataContract[]> {
  await requireFeature("dataContracts");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("data_contracts")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as DataContract[];
}

export async function createContract(input: DataContractInput): Promise<DataContract> {
  await requireFeature("dataContracts");
  const userId = await getScopeId();
  await assertAssetInScope(input.asset_id, userId);
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("data_contracts")
    .insert({
      asset_id: input.asset_id,
      clerk_user_id: userId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      min_pass_threshold: input.min_pass_threshold,
      require_no_schema_change: input.require_no_schema_change,
      required_rule_ids: input.required_rule_ids ?? [],
      is_active: true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/assets/${input.asset_id}/contracts`);
  return data as DataContract;
}

export async function setContractActive(id: string, active: boolean): Promise<void> {
  await requireFeature("dataContracts");
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("data_contracts")
    .update({ is_active: active })
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select("asset_id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/assets/${data.asset_id}/contracts`);
}

export async function deleteContract(id: string): Promise<void> {
  await requireFeature("dataContracts");
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("data_contracts")
    .select("asset_id")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();
  const { error } = await supabase
    .from("data_contracts")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  if (data) revalidatePath(`/dashboard/assets/${data.asset_id}/contracts`);
}

export async function getContractEvaluations(
  assetId: string
): Promise<Record<string, ContractEvaluation[]>> {
  await requireFeature("dataContracts");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data: contracts } = await supabase
    .from("data_contracts")
    .select("id")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId);

  const ids = (contracts ?? []).map((c) => c.id as string);
  if (ids.length === 0) return {};

  const { data } = await supabase
    .from("contract_evaluations")
    .select("*")
    .in("contract_id", ids)
    .eq("clerk_user_id", userId)
    .order("evaluated_at", { ascending: false })
    .limit(100);

  const byContract: Record<string, ContractEvaluation[]> = {};
  for (const row of (data ?? []) as ContractEvaluation[]) {
    (byContract[row.contract_id] ??= []).push(row);
  }
  return byContract;
}

/**
 * Evaluates every active contract on an asset against a completed run and
 * records a verdict for each.
 *
 * Called from `saveRunResult` after the run and its scores are committed.
 * Reads scores back from Supabase rather than taking them as arguments so a
 * verdict always reflects what was actually stored.
 *
 * Never throws to its caller: a contract problem must not fail the DQ run that
 * produced the data being judged.
 */
export async function evaluateContracts(
  assetId: string,
  runId: string
): Promise<ContractEvaluation[]> {
  if (!(await hasFeature("dataContracts"))) return [];

  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data: contracts } = await supabase
    .from("data_contracts")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .eq("is_active", true);

  if (!contracts || contracts.length === 0) return [];

  const [{ data: run }, { data: scores }] = await Promise.all([
    supabase
      .from("asset_runs")
      .select("overall_dq_score, schema_changed, schema_diff")
      .eq("id", runId)
      .eq("clerk_user_id", userId)
      .single(),
    supabase.from("dq_scores").select("id, rule_type, column_name, status").eq("run_id", runId),
  ]);

  if (!run) return [];

  const overall = run.overall_dq_score != null ? Number(run.overall_dq_score) : null;
  const ruleResults = scores ?? [];
  const failedRules = ruleResults.filter((r) => r.status === "fail");

  const evaluations: ContractEvaluation[] = [];

  for (const contract of contracts as DataContract[]) {
    const failures: ContractFailure[] = [];

    if (overall === null) {
      failures.push({ check: "score", passed: false, detail: "This run produced no score." });
    } else if (overall < Number(contract.min_pass_threshold)) {
      failures.push({
        check: "score",
        passed: false,
        detail: `DQ score ${overall} is below the required ${contract.min_pass_threshold}.`,
      });
    }

    if (contract.require_no_schema_change && run.schema_changed) {
      failures.push({
        check: "schema",
        passed: false,
        detail: "The file's columns changed since the previous run.",
      });
    }

    // Every failing rule fails the contract.
    //
    // There is deliberately no per-rule subset: dq_scores carries no reference
    // back to dq_rules (its `id` is the score row's own PK), so a contract
    // cannot name individual rules without a join key that does not exist.
    // Filtering on it silently passed contracts whose named rules had failed,
    // which is the worst possible failure mode for an acceptance gate.
    if (failedRules.length > 0) {
      for (const r of failedRules) {
        failures.push({
          check: "rule",
          passed: false,
          detail: `${r.rule_type}${r.column_name ? ` on ${r.column_name}` : ""} failed.`,
        });
      }
    }

    const passed = failures.length === 0;

    const { data: saved } = await supabase
      .from("contract_evaluations")
      .upsert(
        {
          contract_id: contract.id,
          run_id: runId,
          clerk_user_id: userId,
          passed,
          overall_score: overall,
          failures,
        },
        { onConflict: "contract_id,run_id" }
      )
      .select()
      .single();

    if (saved) evaluations.push(saved as ContractEvaluation);
  }

  revalidatePath(`/dashboard/assets/${assetId}/contracts`);
  return evaluations;
}
