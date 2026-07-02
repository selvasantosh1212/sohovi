"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { createRule } from "@/app/actions/rules";
import type { DQRule, Workflow, WorkflowRule, WorkflowApplication } from "@/types/app.types";
import type { ScopeCondition } from "@/types/dq.types";

export interface WorkflowInput {
  asset_id?: string | null;
  name: string;
  description?: string | null;
  default_scope_conditions?: ScopeCondition[];
}

export async function getWorkflows(assetId?: string): Promise<Workflow[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  let query = supabase
    .from("workflows")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });
  if (assetId) query = query.eq("asset_id", assetId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const workflows = (data ?? []) as Workflow[];
  if (workflows.length === 0) return workflows;

  const { data: ruleRows } = await supabase
    .from("workflow_rules")
    .select("workflow_id")
    .in("workflow_id", workflows.map((w) => w.id));
  const counts = new Map<string, number>();
  for (const r of (ruleRows ?? []) as { workflow_id: string }[]) {
    counts.set(r.workflow_id, (counts.get(r.workflow_id) ?? 0) + 1);
  }
  return workflows.map((w) => ({ ...w, rule_count: counts.get(w.id) ?? 0 }));
}

export async function getWorkflow(id: string): Promise<Workflow | null> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();
  return data as Workflow | null;
}

export async function getWorkflowRules(workflowId: string): Promise<WorkflowRule[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("workflow_rules")
    .select("*")
    .eq("workflow_id", workflowId)
    .eq("clerk_user_id", userId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as WorkflowRule[];
}

export async function getWorkflowApplications(workflowId: string): Promise<WorkflowApplication[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("workflow_applications")
    .select("*, asset:data_assets(id, name)")
    .eq("workflow_id", workflowId)
    .eq("clerk_user_id", userId)
    .order("applied_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as WorkflowApplication[];
}

export async function createWorkflow(input: WorkflowInput): Promise<Workflow> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  if (!input.name.trim()) throw new Error("Workflow name is required.");
  const { data, error } = await supabase
    .from("workflows")
    .insert({
      asset_id: input.asset_id ?? null,
      clerk_user_id: userId,
      name: input.name.trim(),
      description: input.description ?? null,
      default_scope_conditions: input.default_scope_conditions ?? [],
      is_active: true,
      run_count: 0,
      applied_count: 0,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/workflows");
  return data as Workflow;
}

export async function updateWorkflow(
  id: string,
  input: Partial<WorkflowInput & { is_active: boolean }>
): Promise<Workflow> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("workflows")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/workflows");
  revalidatePath(`/dashboard/workflows/${id}`);
  return data as Workflow;
}

export async function deleteWorkflow(id: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("workflows")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/workflows");
}

// ---- Author: promote existing asset rules into a reusable workflow -------

export interface PromoteRulesInput {
  rule_ids: string[];
  source_asset_id: string;
  workflow_id?: string; // add to an existing workflow
  new_workflow?: { name: string; description?: string | null }; // or create a new one
}

export async function promoteRulesToWorkflow(input: PromoteRulesInput): Promise<Workflow> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  if (!input.workflow_id && !input.new_workflow) {
    throw new Error("Specify either an existing workflow or details for a new one.");
  }
  if (input.rule_ids.length === 0) {
    throw new Error("Select at least one rule to save as a workflow.");
  }

  const { data: rules, error: rulesErr } = await supabase
    .from("dq_rules")
    .select("*")
    .in("id", input.rule_ids)
    .eq("clerk_user_id", userId);
  if (rulesErr) throw new Error(rulesErr.message);
  if (!rules || rules.length !== input.rule_ids.length) {
    throw new Error("One or more selected rules could not be found.");
  }

  let workflow: Workflow;
  if (input.workflow_id) {
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", input.workflow_id)
      .eq("clerk_user_id", userId)
      .single();
    if (error || !data) throw new Error("Workflow not found.");
    workflow = data as Workflow;
  } else {
    workflow = await createWorkflow({
      asset_id: input.source_asset_id,
      name: input.new_workflow!.name,
      description: input.new_workflow!.description ?? null,
    });
  }

  const { count: existingCount } = await supabase
    .from("workflow_rules")
    .select("id", { count: "exact", head: true })
    .eq("workflow_id", workflow.id);

  const snapshotRows = (rules as DQRule[]).map((r, i) => ({
    workflow_id: workflow.id,
    clerk_user_id: userId,
    column_name: r.column_name,
    description: r.description,
    dimension: r.dimension,
    rule_type: r.rule_type,
    parameters: r.parameters,
    scope_conditions: r.scope_conditions,
    threshold: r.threshold,
    weight: r.weight,
    sort_order: (existingCount ?? 0) + i,
    source_rule_id: r.id,
  }));

  const { error: insertErr } = await supabase.from("workflow_rules").insert(snapshotRows);
  if (insertErr) throw new Error(insertErr.message);

  revalidatePath("/dashboard/workflows");
  revalidatePath(`/dashboard/workflows/${workflow.id}`);
  revalidatePath(`/dashboard/assets/${input.source_asset_id}/rules`);
  return workflow;
}

export async function removeWorkflowRule(workflowRuleId: string, workflowId: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("workflow_rules")
    .delete()
    .eq("id", workflowRuleId)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/workflows/${workflowId}`);
}

// ---- Apply: materialize a workflow's rules onto a (possibly different) asset

export interface ApplyWorkflowInput {
  workflow_id: string;
  target_asset_id: string;
  /** workflow_rules.column_name (canonical) -> target asset's real column name */
  column_mapping: Record<string, string>;
}

export interface ApplyWorkflowResult {
  created: DQRule[];
  skipped: { rule: WorkflowRule; reason: string }[];
}

export async function applyWorkflowToAsset(input: ApplyWorkflowInput): Promise<ApplyWorkflowResult> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const [{ data: workflow }, { data: wfRules }] = await Promise.all([
    supabase.from("workflows").select("*").eq("id", input.workflow_id).eq("clerk_user_id", userId).single(),
    supabase
      .from("workflow_rules")
      .select("*")
      .eq("workflow_id", input.workflow_id)
      .eq("clerk_user_id", userId)
      .order("sort_order", { ascending: true }),
  ]);
  if (!workflow) throw new Error("Workflow not found.");
  const rules = (wfRules ?? []) as WorkflowRule[];
  if (rules.length === 0) throw new Error("This workflow has no rules to apply.");

  const created: DQRule[] = [];
  const skipped: ApplyWorkflowResult["skipped"] = [];

  for (const wr of rules) {
    const mappedColumn = wr.column_name
      ? input.column_mapping[wr.column_name] ?? wr.column_name
      : null;
    try {
      const rule = await createRule({
        asset_id: input.target_asset_id,
        column_name: mappedColumn,
        description: wr.description,
        dimension: wr.dimension,
        rule_type: wr.rule_type,
        parameters: wr.parameters,
        scope_conditions:
          wr.scope_conditions && wr.scope_conditions.length > 0
            ? wr.scope_conditions
            : (workflow as Workflow).default_scope_conditions ?? [],
        threshold: wr.threshold,
        weight: wr.weight,
        source_workflow_id: input.workflow_id,
      });
      created.push(rule);
    } catch (err) {
      skipped.push({ rule: wr, reason: err instanceof Error ? err.message : "Failed to create rule." });
    }
  }

  if (created.length > 0) {
    await supabase.from("workflow_applications").insert({
      workflow_id: input.workflow_id,
      asset_id: input.target_asset_id,
      clerk_user_id: userId,
      rules_created: created.length,
      rules_skipped: skipped.length,
      column_mappings: input.column_mapping,
    });
    await supabase
      .from("workflows")
      .update({
        applied_count: ((workflow as Workflow).applied_count ?? 0) + 1,
        last_applied_at: new Date().toISOString(),
      })
      .eq("id", input.workflow_id)
      .eq("clerk_user_id", userId);
  }

  revalidatePath(`/dashboard/assets/${input.target_asset_id}/rules`);
  revalidatePath(`/dashboard/workflows/${input.workflow_id}`);
  revalidatePath("/dashboard/workflows");

  return { created, skipped };
}
