"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import type { Catalog, CatalogInput } from "@/types/app.types";

export async function getCatalogs(businessUnitId?: string): Promise<Catalog[]> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  let query = supabase
    .from("catalogs")
    .select("*, business_unit:business_units(id, name)")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });
  if (businessUnitId) query = query.eq("business_unit_id", businessUnitId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Catalog[];
}

export async function getCatalog(id: string): Promise<Catalog | null> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("catalogs")
    .select("*, business_unit:business_units(id, name)")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();
  if (error) return null;
  return data as Catalog;
}

export async function createCatalog(input: CatalogInput): Promise<Catalog> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("catalogs")
    .insert({ ...input, clerk_user_id: userId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/catalogs");
  revalidatePath(`/dashboard/business-units/${input.business_unit_id}`);
  revalidatePath("/dashboard");
  return data;
}

export async function updateCatalog(id: string, input: Partial<CatalogInput>): Promise<Catalog> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("catalogs")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/catalogs");
  revalidatePath(`/dashboard/catalogs/${id}`);
  return data;
}

export async function deleteCatalog(id: string): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("catalogs")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/catalogs");
  revalidatePath("/dashboard");
}
