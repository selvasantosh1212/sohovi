-- Run this once in your Supabase SQL editor.
-- Privacy Studio history. anonymize.ts and k-anonymity.ts were production
-- quality but reachable only from the free /tools/de-identify page; this
-- brings de-identification into the paid product as an asset-level feature.
--
-- METADATA ONLY. De-identification runs entirely in the browser — the
-- original file, the de-identified output and the pseudonym maps never leave
-- it. Persisting any of those would destroy the one property that makes this
-- usable on data a user is forbidden to upload anywhere.

create table if not exists privacy_audits (
  id                uuid primary key default gen_random_uuid(),
  asset_id          uuid not null references data_assets(id) on delete cascade,
  clerk_user_id     text not null,
  run_at            timestamptz not null default now(),
  file_name         text,
  -- [{ "column": "email", "class": "direct", "action": "mask" }, …]
  column_actions    jsonb not null default '[]'::jsonb,
  quasi_identifiers text[] not null default '{}',
  target_k          integer,
  achieved_k        integer,
  violating_rows    integer,
  row_count         integer
);

create index if not exists privacy_audits_asset_idx
  on privacy_audits (asset_id, run_at desc);

comment on table privacy_audits is
  'Record of a de-identification pass: which columns were treated how, and the k-anonymity achieved. Never stores values, output rows or pseudonym maps. Team feature (PlanLimits.privacyStudio).';
comment on column privacy_audits.achieved_k is
  'Smallest equivalence-class size across the chosen quasi-identifiers. k=1 means at least one row is unique on those columns and therefore re-identifiable.';
