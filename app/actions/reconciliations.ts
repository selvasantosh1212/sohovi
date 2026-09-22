"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { requireFeature } from "@/lib/plans/entitlements";

export interface Reconciliation {
  id: string;
  asset_id: string;
  run_at: string;
  file_a_name: string;
  file_b_name: string;
  key_columns: string[];
  only_in_a: number;
  only_in_b: number;
  changed: number;
  unchanged: number;
  fuzzy_matched: number;
  notes: string | null;
}

export interface ReconciliationInput {
  asset_id: string;
  file_a_name: string;
  file_b_name: string;
  key_columns: string[];
  only_in_a: number;
  only_in_b: number;
  changed: number;
  unchanged: number;
  fuzzy_matched?: number;
  notes?: string | null;
}

export async function getReconciliations(assetId: string): Promise<Reconciliation[]> {
  await requireFeature("reconciliation");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("reconciliations")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .order("run_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as Reconciliation[];
}

/**
 * Records the outcome of a comparison.
 *
 * Only the bucket counts, the key columns and the two file *names* are stored.
 * The caller has the rows in memory and must not send them.
 */
export async function saveReconciliation(
  input: ReconciliationInput
): Promise<Reconciliation> {
  await requireFeature("reconciliation");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("reconciliations")
    .insert({
      asset_id: input.asset_id,
      clerk_user_id: userId,
      file_a_name: input.file_a_name,
      file_b_name: input.file_b_name,
      key_columns: input.key_columns,
      only_in_a: input.only_in_a,
      only_in_b: input.only_in_b,
      changed: input.changed,
      unchanged: input.unchanged,
      fuzzy_matched: input.fuzzy_matched ?? 0,
      notes: input.notes?.trim() || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/assets/${input.asset_id}/reconcile`);
  return data as Reconciliation;
}
