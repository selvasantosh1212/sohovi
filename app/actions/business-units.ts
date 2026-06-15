"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans/limits";
import type { BusinessUnit, BusinessUnitInput } from "@/types/app.types";

export async function getBusinessUnits(): Promise<BusinessUnit[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("business_units")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBusinessUnit(id: string): Promise<BusinessUnit | null> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("business_units")
    .select("*")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function createBusinessUnit(input: BusinessUnitInput): Promise<BusinessUnit> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const plan = await getUserPlan();
  const limit = PLAN_LIMITS[plan].maxBusinessUnits;
  if (limit !== Infinity) {
    const { count } = await supabase
      .from("business_units")
      .select("id", { count: "exact", head: true })
      .eq("clerk_user_id", userId);
    if ((count ?? 0) >= limit) {
      throw new Error(`Your plan is limited to ${limit} business unit${limit === 1 ? "" : "s"}. Upgrade to add more.`);
    }
  }

  const { data, error } = await supabase
    .from("business_units")
    .insert({ ...input, clerk_user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/business-units");
  revalidatePath("/dashboard");
  return data;
}

export async function updateBusinessUnit(id: string, input: Partial<BusinessUnitInput>): Promise<BusinessUnit> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("business_units")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/business-units");
  revalidatePath(`/dashboard/business-units/${id}`);
  return data;
}

export async function deleteBusinessUnit(id: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("business_units")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/business-units");
  revalidatePath("/dashboard");
}
