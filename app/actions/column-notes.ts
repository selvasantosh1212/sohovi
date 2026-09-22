"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { requireFeature } from "@/lib/plans/entitlements";

export interface ColumnNote {
  id: string;
  asset_id: string;
  column_name: string;
  source_description: string | null;
  transformation_notes: string | null;
  owner: string | null;
  created_at: string;
  updated_at: string;
}

export interface ColumnNoteInput {
  asset_id: string;
  column_name: string;
  source_description?: string | null;
  transformation_notes?: string | null;
  owner?: string | null;
}

/** Every column note on an asset, keyed by column name for easy lookup. */
export async function getColumnNotes(assetId: string): Promise<Record<string, ColumnNote>> {
  await requireFeature("columnNotes");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("column_notes")
    .select("*")
    .eq("asset_id", assetId)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);

  return Object.fromEntries(((data ?? []) as ColumnNote[]).map((n) => [n.column_name, n]));
}

/**
 * Creates or replaces the note for one column.
 *
 * A note whose fields are all blank is deleted rather than stored empty, so
 * clearing a note in the UI removes its badge instead of leaving a hollow row.
 */
export async function upsertColumnNote(input: ColumnNoteInput): Promise<ColumnNote | null> {
  await requireFeature("columnNotes");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const source = input.source_description?.trim() || null;
  const transformation = input.transformation_notes?.trim() || null;
  const owner = input.owner?.trim() || null;

  if (!source && !transformation && !owner) {
    await deleteColumnNote(input.asset_id, input.column_name);
    return null;
  }

  const { data, error } = await supabase
    .from("column_notes")
    .upsert(
      {
        asset_id: input.asset_id,
        clerk_user_id: userId,
        column_name: input.column_name,
        source_description: source,
        transformation_notes: transformation,
        owner,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "asset_id,column_name" }
    )
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/assets/${input.asset_id}/profile`);
  return data as ColumnNote;
}

export async function deleteColumnNote(assetId: string, columnName: string): Promise<void> {
  await requireFeature("columnNotes");
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("column_notes")
    .delete()
    .eq("asset_id", assetId)
    .eq("column_name", columnName)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/assets/${assetId}/profile`);
}
