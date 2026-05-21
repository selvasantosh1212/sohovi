"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import type { Alert, AlertEvent } from "@/types/app.types";

// ---- Alerts CRUD ---------------------------------------------------------

export async function getAlerts(assetId?: string): Promise<Alert[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  let query = supabase
    .from("alerts")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });
  if (assetId) query = query.eq("asset_id", assetId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Alert[];
}

export interface AlertInput {
  asset_id: string;
  name: string;
  condition: Alert["condition"];
  threshold_value?: number | null;
  dimension?: string | null;
  column_name?: string | null;
}

export async function createAlert(input: AlertInput): Promise<Alert> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("alerts")
    .insert({ ...input, clerk_user_id: userId, is_active: true })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
  return data as Alert;
}

export async function updateAlert(
  alertId: string,
  patch: Partial<Pick<Alert, "name" | "condition" | "threshold_value" | "dimension" | "column_name" | "is_active">>
): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("alerts")
    .update(patch)
    .eq("id", alertId)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
}

export async function deleteAlert(alertId: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("alerts")
    .delete()
    .eq("id", alertId)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
}

// ---- Alert Events --------------------------------------------------------

export async function getAlertEvents(alertId?: string): Promise<AlertEvent[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  // First get alert IDs belonging to this user
  let alertIds: string[] = [];
  if (alertId) {
    alertIds = [alertId];
  } else {
    const { data: userAlerts } = await supabase
      .from("alerts")
      .select("id")
      .eq("clerk_user_id", userId);
    alertIds = (userAlerts ?? []).map((a: { id: string }) => a.id);
  }

  if (alertIds.length === 0) return [];

  const { data, error } = await supabase
    .from("alert_events")
    .select("*")
    .in("alert_id", alertIds)
    .order("triggered_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as AlertEvent[];
}

export async function getUnreadAlertCount(): Promise<number> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data: userAlerts } = await supabase
    .from("alerts")
    .select("id")
    .eq("clerk_user_id", userId);
  const alertIds = (userAlerts ?? []).map((a: { id: string }) => a.id);
  if (alertIds.length === 0) return 0;

  const { count } = await supabase
    .from("alert_events")
    .select("id", { count: "exact", head: true })
    .in("alert_id", alertIds)
    .eq("is_read", false);
  return count ?? 0;
}

export async function markAlertEventsRead(alertId: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  // Verify ownership before updating
  const { data: alert } = await supabase
    .from("alerts")
    .select("id")
    .eq("id", alertId)
    .eq("clerk_user_id", userId)
    .single();

  if (!alert) return;

  await supabase
    .from("alert_events")
    .update({ is_read: true })
    .eq("alert_id", alertId);

  revalidatePath("/dashboard/alerts");
}
