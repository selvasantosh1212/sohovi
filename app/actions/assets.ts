"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import type { DataAsset, DataAssetInput } from "@/types/app.types";

export async function getAssets(catalogId?: string): Promise<DataAsset[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  let query = supabase
    .from("data_assets")
    .select("*, catalog:catalogs(id, name)")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });
  if (catalogId) query = query.eq("catalog_id", catalogId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as DataAsset[];
}

export async function getAsset(id: string): Promise<DataAsset | null> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("data_assets")
    .select("*, catalog:catalogs(id, name)")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();
  if (error) return null;
  return data as DataAsset;
}

export async function createAsset(input: DataAssetInput): Promise<DataAsset> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("data_assets")
    .insert({ ...input, clerk_user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/assets");
  revalidatePath(`/dashboard/catalogs/${input.catalog_id}`);
  revalidatePath("/dashboard");
  return data;
}

export async function updateAsset(id: string, input: Partial<DataAssetInput>): Promise<DataAsset> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("data_assets")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/assets");
  revalidatePath(`/dashboard/assets/${id}`);
  return data;
}

export async function deleteAsset(id: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("data_assets")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/assets");
  revalidatePath("/dashboard");
}

export async function getDashboardCounts(): Promise<{
  business_units: number;
  catalogs: number;
  assets: number;
  avg_dq_score: number | null;
  has_run: boolean;
  active_rules: number;
  open_alerts: number;
}> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const [buRes, catRes, assetRes, runRes, rulesRes, alertIdsRes] = await Promise.all([
    supabase.from("business_units").select("id", { count: "exact", head: true }).eq("clerk_user_id", userId),
    supabase.from("catalogs").select("id", { count: "exact", head: true }).eq("clerk_user_id", userId),
    supabase.from("data_assets").select("latest_dq_score").eq("clerk_user_id", userId),
    supabase.from("asset_runs").select("id", { count: "exact", head: true }).eq("clerk_user_id", userId),
    supabase.from("dq_rules").select("id", { count: "exact", head: true }).eq("clerk_user_id", userId).eq("is_active", true),
    supabase.from("alerts").select("id").eq("clerk_user_id", userId),
  ]);

  const scores = (assetRes.data ?? [])
    .map((a) => a.latest_dq_score)
    .filter((s): s is number => s !== null);

  const avg = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const alertIds = (alertIdsRes.data ?? []).map((a: { id: string }) => a.id);
  let openAlerts = 0;
  if (alertIds.length > 0) {
    const { count } = await supabase
      .from("alert_events")
      .select("id", { count: "exact", head: true })
      .in("alert_id", alertIds)
      .eq("is_read", false);
    openAlerts = count ?? 0;
  }

  return {
    business_units: buRes.count ?? 0,
    catalogs: catRes.count ?? 0,
    assets: assetRes.data?.length ?? 0,
    avg_dq_score: avg,
    has_run: (runRes.count ?? 0) > 0,
    active_rules: rulesRes.count ?? 0,
    open_alerts: openAlerts,
  };
}
