-- ============================================================
-- Connector Configs
-- Run in: Supabase Dashboard > SQL Editor > New Query
--
-- Stores ONLY non-sensitive connector metadata per asset.
-- Credentials, tokens, and API keys are NEVER stored here.
-- ============================================================

create table if not exists connector_configs (
  id                  uuid primary key default gen_random_uuid(),
  asset_id            uuid not null references data_assets(id) on delete cascade,
  clerk_user_id       text not null,
  connector_type      text not null check (connector_type in (
                        'google_sheets', 'airtable', 'cloud_storage_url', 'rest_api'
                      )),
  display_name        text not null,
  config_meta         jsonb not null default '{}',  -- non-sensitive: sheet name, base ID, etc.
  last_connected_at   timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

-- One active connector config per asset (upsert pattern)
create unique index idx_connector_configs_asset on connector_configs(asset_id);
create index idx_connector_configs_user on connector_configs(clerk_user_id);
