"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans/limits";
import type { DQRule } from "@/types/app.types";

export async function getRules(assetId: string): Promise<DQRule[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("dq_rules")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as DQRule[];
}

export interface RuleInput {
  asset_id: string;
  column_name?: string | null;
  description?: string | null;
  dimension: string;
  rule_type: string;
  parameters?: Record<string, unknown>;
  scope_conditions?: import("@/types/dq.types").ScopeCondition[];
  threshold?: number;
  weight?: number;
  is_suggested?: boolean;
}

export async function createRule(input: RuleInput): Promise<DQRule> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const plan = await getUserPlan();
  const ruleLimit = PLAN_LIMITS[plan].maxRulesPerAsset;
  if (ruleLimit !== Infinity) {
    const { count } = await supabase
      .from("dq_rules")
      .select("id", { count: "exact", head: true })
      .eq("asset_id", input.asset_id)
      .eq("clerk_user_id", userId);
    if ((count ?? 0) >= ruleLimit) {
      throw new Error(`Your plan is limited to ${ruleLimit} rules per asset. Upgrade to add more.`);
    }
  }

  // Prevent multiple rule types for the same column + dimension combination
  let dupQuery = supabase
    .from("dq_rules")
    .select("id, rule_type")
    .eq("asset_id", input.asset_id)
    .eq("dimension", input.dimension)
    .eq("clerk_user_id", userId);
  dupQuery = input.column_name
    ? dupQuery.eq("column_name", input.column_name)
    : dupQuery.is("column_name", null);

  const { data: existing } = await dupQuery;
  const conflict = (existing ?? []).find((r) => r.rule_type !== input.rule_type);
  if (conflict) {
    throw new Error(
      `A "${conflict.rule_type}" rule already exists for the "${input.dimension}" dimension on this column. Only one rule type per column–dimension is allowed.`
    );
  }

  const { data, error } = await supabase
    .from("dq_rules")
    .insert({
      ...input,
      clerk_user_id: userId,
      is_active: true,
      parameters: input.parameters ?? {},
      scope_conditions: input.scope_conditions ?? [],
      threshold: input.threshold ?? 0.95,
      weight: input.weight ?? 1,
      is_suggested: input.is_suggested ?? false,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/assets/${input.asset_id}/rules`);
  return data as DQRule;
}

export async function updateRule(
  id: string,
  input: Partial<RuleInput & { threshold: number; weight: number; is_active: boolean }>
): Promise<DQRule> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("dq_rules")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  if (data?.asset_id) revalidatePath(`/dashboard/assets/${data.asset_id}/rules`);
  return data as DQRule;
}

export async function deleteRule(id: string, assetId: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("dq_rules")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/assets/${assetId}/rules`);
}

export async function toggleRule(id: string, isActive: boolean, assetId: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("dq_rules")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/assets/${assetId}/rules`);
}
