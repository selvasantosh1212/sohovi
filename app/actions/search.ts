"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { getScopeId } from "@/lib/clerk/utils";

export interface SearchResult {
  type: "asset" | "catalog" | "business_unit";
  id: string;
  title: string;
  subtitle?: string;
  score?: number | null;
  href: string;
}

export async function smartSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const results: SearchResult[] = [];

  const [buRes, catRes, assetRes] = await Promise.all([
    supabase
      .from("business_units")
      .select("id, name, description")
      .eq("clerk_user_id", userId)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(5),

    supabase
      .from("catalogs")
      .select("id, name, description")
      .eq("clerk_user_id", userId)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(5),

    supabase
      .from("data_assets")
      .select("id, name, purpose, latest_dq_score")
      .eq("clerk_user_id", userId)
      .or(`name.ilike.%${q}%,purpose.ilike.%${q}%`)
      .limit(5),
  ]);

  for (const bu of buRes.data ?? []) {
    results.push({
      type: "business_unit",
      id: bu.id,
      title: bu.name,
      subtitle: bu.description ?? undefined,
      href: `/dashboard/business-units/${bu.id}`,
    });
  }

  for (const cat of catRes.data ?? []) {
    results.push({
      type: "catalog",
      id: cat.id,
      title: cat.name,
      subtitle: cat.description ?? undefined,
      href: `/dashboard/catalogs/${cat.id}`,
    });
  }

  for (const asset of assetRes.data ?? []) {
    results.push({
      type: "asset",
      id: asset.id,
      title: asset.name,
      subtitle: asset.purpose ?? undefined,
      score: asset.latest_dq_score,
      href: `/dashboard/assets/${asset.id}`,
    });
  }

  return results;
}
