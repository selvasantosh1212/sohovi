-- Run this once in your Supabase SQL editor.
-- Column-level context notes — the "Lineage & context metadata" line that the
-- Team tier already sells. Asset-level `purpose` and `business_meaning` were
-- the only context Sohovi stored; this adds the per-column layer.
--
-- Deliberately NOT a lineage graph: we record what a human says a column comes
-- from and what was done to it, not a derived dependency graph. Do not market
-- it as column-level lineage.

create table if not exists column_notes (
  id                    uuid primary key default gen_random_uuid(),
  asset_id              uuid not null references data_assets(id) on delete cascade,
  clerk_user_id         text not null,
  column_name           text not null,
  source_description    text,
  transformation_notes  text,
  owner                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- One note per column per asset; upserts target this constraint.
  unique (asset_id, column_name)
);

create index if not exists column_notes_asset_idx
  on column_notes (asset_id);

-- Every read is scoped by the caller's workspace (orgId ?? userId), matching
-- the access pattern of every other table in this schema.
create index if not exists column_notes_scope_idx
  on column_notes (clerk_user_id);

comment on table column_notes is
  'Human-authored context for a single column: where it comes from, what has been done to it, and who owns it. Gated on the Team plan via PlanLimits.columnNotes.';
comment on column column_notes.source_description is
  'Where this column originates — the upstream system, table and field, as described by a human.';
comment on column column_notes.transformation_notes is
  'What happens to the value between the source and this asset (joins, recodes, unit changes, cleaning).';
comment on column column_notes.owner is
  'Who to ask about this column. Free text, not a Clerk user reference — the owner is often outside the Sohovi workspace.';
