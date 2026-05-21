"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { getScopeId } from "@/lib/clerk/utils";
import type { ConnectorType, ConnectorConfigRecord } from "@/types/connectors.types";

// ---- Save (upsert) connector config for an asset --------------------
// Only non-sensitive metadata is persisted — no credentials, no tokens.

export interface SaveConnectorConfigInput {
  asset_id: string;
  connector_type: ConnectorType;
  display_name: string;
  config_meta: Record<string, string>;
}

export async function saveConnectorConfig(
  input: SaveConnectorConfigInput
): Promise<void> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  await supabase.from("connector_configs").upsert(
    {
      asset_id: input.asset_id,
      clerk_user_id: userId,
      connector_type: input.connector_type,
      display_name: input.display_name,
      config_meta: input.config_meta,
      last_connected_at: new Date().toISOString(),
    },
    { onConflict: "asset_id" }
  );
}

// ---- Load connector config for an asset (for badge display) ---------

export async function getConnectorConfig(
  assetId: string
): Promise<ConnectorConfigRecord | null> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("connector_configs")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId)
    .single();

  return data as ConnectorConfigRecord | null;
}
