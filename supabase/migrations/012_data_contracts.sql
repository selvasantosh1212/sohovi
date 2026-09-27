-- Run this once in your Supabase SQL editor.
-- Data contracts — the vendor file acceptance gate.
--
-- The valuable framing is not "a contract object" but accept-or-bounce a
-- partner's monthly file, with a record of why. Composes machinery that
-- already exists: rules, schema-change detection, run scores and (since 009)
-- alert delivery.

create table if not exists data_contracts (
  id                        uuid primary key default gen_random_uuid(),
  asset_id                  uuid not null references data_assets(id) on delete cascade,
  clerk_user_id             text not null,
  name                      text not null,
  description               text,
  -- A run at or above this overall DQ score passes the score condition.
  min_pass_threshold        numeric(5,2) not null default 95,
  -- When true, any added/removed/renamed column fails the contract outright.
  require_no_schema_change  boolean not null default true,
  -- Rules that must individually pass. Empty means "every rule on the asset".
  required_rule_ids         uuid[] not null default '{}',
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now()
);

create index if not exists data_contracts_asset_idx
  on data_contracts (asset_id, is_active);

-- One verdict per contract per run, so a bounced file has an evidence trail.
create table if not exists contract_evaluations (
  id             uuid primary key default gen_random_uuid(),
  contract_id    uuid not null references data_contracts(id) on delete cascade,
  run_id         uuid not null references asset_runs(id) on delete cascade,
  clerk_user_id  text not null,
  evaluated_at   timestamptz not null default now(),
  passed         boolean not null,
  overall_score  numeric(5,2),
  -- [{ "check": "score", "passed": false, "detail": "82 < 95" }, …]
  failures       jsonb not null default '[]'::jsonb,
  unique (contract_id, run_id)
);

create index if not exists contract_evaluations_contract_idx
  on contract_evaluations (contract_id, evaluated_at desc);

comment on table data_contracts is
  'Acceptance criteria for a file arriving on an asset. Team feature (PlanLimits.dataContracts).';
comment on column data_contracts.required_rule_ids is
  'Rules that must pass individually. Empty array means every rule on the asset must pass — stored as empty rather than expanded so the contract follows the asset as rules are added.';
comment on table contract_evaluations is
  'The verdict for one run against one contract. Counts and reasons only — never rows.';
