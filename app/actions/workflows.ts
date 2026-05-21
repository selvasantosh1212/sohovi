"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import type { Workflow } from "@/types/app.types";

export interface WorkflowInput {
  asset_id: string;
  name: string;
  description?: string | null;
  column_mappings?: Record<string, string>;
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
  return (data ?? []) as Workflow[];
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

export async function createWorkflow(input: WorkflowInput): Promise<Workflow> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("workflows")
    .insert({
      ...input,
      clerk_user_id: userId,
      column_mappings: input.column_mappings ?? {},
      is_active: true,
      run_count: 0,
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
