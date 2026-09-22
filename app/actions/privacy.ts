"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { requireFeature } from "@/lib/plans/entitlements";

/** One PII-flagged column somewhere in a catalog. */
export interface PIIRegisterEntry {
  asset_id: string;
  asset_name: string;
  column_name: string;
  pii_type: string | null;
  inferred_type: string | null;
  null_pct: number | null;
  last_run_at: string | null;
}

export interface PrivacyAudit {
  id: string;
  asset_id: string;
  run_at: string;
  file_name: string | null;
  column_actions: Array<{ column: string; class: string; action: string }>;
  quasi_identifiers: string[];
  target_k: number | null;
  achieved_k: number | null;
  violating_rows: number | null;
  row_count: number | null;
}

/**
 * Every PII-flagged column across a catalog, taken from the profiling summary
 * of each asset's latest run.
 *
 * Reads only aggregates already stored by profiling — flags and counts, never
 * sample values, which profiling masks before storing anyway.
 */
export async function getPIIRegister(catalogId: string): Promise<PIIRegisterEntry[]> {
  await requireFeature("privacyStudio");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data: assets, error: assetErr } = await supabase
    .from("data_assets")
    .select("id, name, latest_run_id")
    .eq("catalog_id", catalogId)
    .eq("clerk_user_id", userId);
  if (assetErr) throw new Error(assetErr.message);

  const scoped = (assets ?? []).filter(
    (a): a is { id: string; name: string; latest_run_id: string } => a.latest_run_id != null
  );
  if (scoped.length === 0) return [];

  const runIds = scoped.map((a) => a.latest_run_id);

  const [summariesRes, runsRes] = await Promise.all([
    supabase
      .from("profiling_summaries")
      .select("asset_id, run_id, column_name, pii_type, inferred_type, null_pct")
      .in("run_id", runIds)
      .eq("pii_detected", true),
    supabase.from("asset_runs").select("id, run_at").in("id", runIds).eq("clerk_user_id", userId),
  ]);

  const runAt = new Map((runsRes.data ?? []).map((r) => [r.id as string, r.run_at as string]));
  const nameById = new Map(scoped.map((a) => [a.id, a.name]));

  return (summariesRes.data ?? [])
    .map((s) => ({
      asset_id: s.asset_id as string,
      asset_name: nameById.get(s.asset_id as string) ?? "Unknown asset",
      column_name: s.column_name as string,
      pii_type: (s.pii_type as string | null) ?? null,
      inferred_type: (s.inferred_type as string | null) ?? null,
      null_pct: (s.null_pct as number | null) ?? null,
      last_run_at: runAt.get(s.run_id as string) ?? null,
    }))
    .sort((a, b) => a.asset_name.localeCompare(b.asset_name) || a.column_name.localeCompare(b.column_name));
}

export async function getPrivacyAudits(assetId: string): Promise<PrivacyAudit[]> {
  await requireFeature("privacyStudio");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("privacy_audits")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .order("run_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as PrivacyAudit[];
}

export interface PrivacyAuditInput {
  asset_id: string;
  file_name?: string | null;
  column_actions: Array<{ column: string; class: string; action: string }>;
  quasi_identifiers: string[];
  target_k?: number | null;
  achieved_k?: number | null;
  violating_rows?: number | null;
  row_count?: number | null;
}

/**
 * Records that a de-identification pass happened and what it achieved.
 *
 * The caller holds the original rows, the de-identified output and the
 * pseudonym maps in memory. None of those may be sent here.
 */
export async function savePrivacyAudit(input: PrivacyAuditInput): Promise<PrivacyAudit> {
  await requireFeature("privacyStudio");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("privacy_audits")
    .insert({
      asset_id: input.asset_id,
      clerk_user_id: userId,
      file_name: input.file_name ?? null,
      column_actions: input.column_actions,
      quasi_identifiers: input.quasi_identifiers,
      target_k: input.target_k ?? null,
      achieved_k: input.achieved_k ?? null,
      violating_rows: input.violating_rows ?? null,
      row_count: input.row_count ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/assets/${input.asset_id}/privacy`);
  return data as PrivacyAudit;
}
