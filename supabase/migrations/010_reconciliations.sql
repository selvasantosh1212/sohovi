-- Run this once in your Supabase SQL editor.
-- Reconciliation history — source-vs-target ETL testing, legacy-to-new
-- migration sign-off and month-end close, as a first-class asset feature
-- rather than only the free /tools/compare page.
--
-- COUNTS ONLY. Both files are parsed in the browser and never uploaded; this
-- table records how many rows landed in each bucket, not which rows. Adding
-- row-level storage here would break the browser-only promise that makes the
-- feature usable on data users are not allowed to upload anywhere.

create table if not exists reconciliations (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references data_assets(id) on delete cascade,
  clerk_user_id   text not null,
  run_at          timestamptz not null default now(),
  -- Names are user-supplied labels for the two sides, not paths.
  file_a_name     text not null,
  file_b_name     text not null,
  key_columns     text[] not null default '{}',
  only_in_a       integer not null default 0,
  only_in_b       integer not null default 0,
  changed         integer not null default 0,
  unchanged       integer not null default 0,
  fuzzy_matched   integer not null default 0,
  notes           text
);

create index if not exists reconciliations_asset_idx
  on reconciliations (asset_id, run_at desc);

comment on table reconciliations is
  'Bucket counts from a keyed two-file comparison. Never stores rows — both files are parsed client-side. Team feature (PlanLimits.reconciliation).';
comment on column reconciliations.fuzzy_matched is
  'Rows paired only by fuzzy key similarity rather than an exact key match. Zero unless fuzzy matching was used.';
