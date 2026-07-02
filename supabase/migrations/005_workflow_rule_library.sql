-- Run this once in your Supabase SQL editor.
-- Redesigns Workflows into a reusable rule-template/library system.
-- Workflows no longer hard-require an asset; workflow_rule_sets (never used —
-- FK'd to dq_rules.id, which doesn't survive asset-independent reuse) is
-- replaced by workflow_rules, which stores durable rule *snapshots* (not FKs
-- to dq_rules) so a workflow keeps working even if the original dq_rules row
-- is later edited or deleted. dq_rules gains source_workflow_id for traceability.

-- 1. workflows: asset_id becomes optional provenance, not a hard requirement
alter table workflows alter column asset_id drop not null;
alter table workflows add column if not exists applied_count integer not null default 0;
alter table workflows add column if not exists last_applied_at timestamptz;

comment on column workflows.asset_id is
  'Asset this workflow was originally authored from. Optional — for display/traceability only, not a functional dependency.';
comment on column workflows.run_count is
  'Deprecated — superseded by applied_count. Retained for backward compatibility with existing rows; no longer written by app code.';
comment on column workflows.last_run_at is
  'Deprecated — superseded by last_applied_at. Retained for backward compatibility; no longer written by app code.';
comment on column workflows.column_mappings is
  'Deprecated — column mapping now happens per-apply via applyWorkflowToAsset rather than being stored on the workflow itself. Retained (default {}) to avoid a breaking schema change; UI no longer reads or writes this.';

-- workflows.asset_id is now provenance-only: deleting the origin asset should
-- not destroy a reusable template. Swap the FK from cascade to set null.
do $$
declare
  conname text;
begin
  select tc.constraint_name into conname
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
  where tc.table_name = 'workflows' and tc.constraint_type = 'FOREIGN KEY' and kcu.column_name = 'asset_id';
  if conname is not null then
    execute format('alter table workflows drop constraint %I', conname);
  end if;
end $$;

alter table workflows add constraint workflows_asset_id_fkey
  foreign key (asset_id) references data_assets(id) on delete set null;

-- 2. Drop the orphaned scaffolding table (zero references in app code)
drop table if exists workflow_rule_sets;

-- 3. Replacement: rule *snapshots* owned by a workflow
create table if not exists workflow_rules (
  id                uuid primary key default gen_random_uuid(),
  workflow_id       uuid not null references workflows(id) on delete cascade,
  clerk_user_id     text not null,
  column_name       text,
  description       text,
  dimension         text not null,
  rule_type         text not null,
  parameters        jsonb not null default '{}',
  scope_conditions  jsonb not null default '[]',
  threshold         numeric(5,4) not null default 0.95,
  weight            numeric(5,4) not null default 1.0,
  sort_order        integer not null default 0,
  source_rule_id    uuid references dq_rules(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_workflow_rules_workflow on workflow_rules(workflow_id);
create index if not exists idx_workflow_rules_user on workflow_rules(clerk_user_id);

-- 4. Traceability: which workflow (if any) produced a given dq_rules row
alter table dq_rules add column if not exists source_workflow_id uuid references workflows(id) on delete set null;
create index if not exists idx_rules_source_workflow on dq_rules(source_workflow_id);

-- 5. Apply history — which assets a workflow's rules have been materialized onto
create table if not exists workflow_applications (
  id                uuid primary key default gen_random_uuid(),
  workflow_id       uuid not null references workflows(id) on delete cascade,
  asset_id          uuid not null references data_assets(id) on delete cascade,
  clerk_user_id     text not null,
  rules_created     integer not null default 0,
  rules_skipped     integer not null default 0,
  column_mappings   jsonb not null default '{}',
  applied_at        timestamptz not null default now()
);
create index if not exists idx_workflow_applications_workflow on workflow_applications(workflow_id);
create index if not exists idx_workflow_applications_asset on workflow_applications(asset_id);

-- 6. RLS — every table in this schema enables RLS (service role bypasses it
-- automatically for server-side access; this just blocks the public anon
-- key from reading these tables directly via PostgREST). No policies
-- needed since no anon/authenticated access is ever intended here.
alter table workflow_rules enable row level security;
alter table workflow_applications enable row level security;
