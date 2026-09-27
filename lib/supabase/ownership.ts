import { createServiceClient } from "@/lib/supabase/server";

/**
 * Confirms an asset belongs to the caller's workspace.
 *
 * Needed because `asset_id` arrives from the client on every write path. A
 * `.eq("clerk_user_id", …)` on an INSERT does not validate anything — it only
 * sets the column — and Supabase `.upsert()` ignores `.eq()` filters entirely,
 * emitting `INSERT … ON CONFLICT DO UPDATE`. Without this check an upsert
 * keyed on `(asset_id, column_name)` can overwrite another workspace's row.
 *
 * @throws when the asset does not exist or is out of scope.
 */
export async function assertAssetInScope(assetId: string, userId: string): Promise<void> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("data_assets")
    .select("id")
    .eq("id", assetId)
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Asset not found.");
}
