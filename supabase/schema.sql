-- ============================================================
-- Sohovi Database Schema
-- Run this entire file in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- BUSINESS UNITS
-- ============================================================
create table if not exists business_units (
  id              uuid primary key default gen_random_uuid(),
  clerk_user_id   text not null,
  name            text not null,
  description     text,
  owner_name      text,
  owner_email     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_bu_user on business_units(clerk_user_id);

-- ============================================================
-- CATALOGS
-- ============================================================
create table if not exists catalogs (
  id                uuid primary key default gen_random_uuid(),
  business_unit_id  uuid not null references business_units(id) on delete cascade,
  clerk_user_id     text not null,
  name              text not null,
  description       text,
  owner_name        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index idx_catalogs_bu on catalogs(business_unit_id);
create index idx_catalogs_user on catalogs(clerk_user_id);

-- ============================================================
-- DATA ASSETS
-- ============================================================
create table if not exists data_assets (
  id                    uuid primary key default gen_random_uuid(),
  catalog_id            uuid not null references catalogs(id) on delete cascade,
  clerk_user_id         text not null,
  name                  text not null,
  source_system         text,
  upstream_file_name    text,
  purpose               text,
  business_meaning      text,
  owner_name            text,
  owner_email           text,
  latest_run_id         uuid,
  latest_dq_score       numeric(5,2),
  column_schema         jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index idx_assets_catalog on data_assets(catalog_id);
create index idx_assets_user on data_assets(clerk_user_id);

-- ============================================================
-- WORKFLOWS  (referenced by asset_runs, created before)
-- ============================================================
create table if not exists workflows (
  id                uuid primary key default gen_random_uuid(),
  asset_id          uuid not null references data_assets(id) on delete cascade,
  clerk_user_id     text not null,
  name              text not null,
  description       text,
  column_mappings   jsonb default '{}',
  default_scope_conditions jsonb not null default '[]',
  is_active         boolean not null default true,
  run_count         integer not null default 0,
  last_run_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index idx_workflows_asset on workflows(asset_id);
create index idx_workflows_user on workflows(clerk_user_id);

-- ============================================================
-- ASSET RUNS
-- ============================================================
create table if not exists asset_runs (
  id                  uuid primary key default gen_random_uuid(),
  asset_id            uuid not null references data_assets(id) on delete cascade,
  clerk_user_id       text not null,
  run_at              timestamptz not null default now(),
  file_name           text not null,
  file_size_bytes     bigint,
  row_count           integer,
  column_count        integer,
  overall_dq_score    numeric(5,2),
  schema_changed      boolean not null default false,
  schema_diff         jsonb,
  workflow_id         uuid references workflows(id),
  status              text not null default 'completed',
  notes               text,
  scope_conditions    jsonb not null default '[]'
);
create index idx_runs_asset on asset_runs(asset_id);
create index idx_runs_user on asset_runs(clerk_user_id);
create index idx_runs_run_at on asset_runs(run_at desc);

-- ============================================================
-- DQ RULES
-- ============================================================
create table if not exists dq_rules (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references data_assets(id) on delete cascade,
  clerk_user_id   text not null,
  column_name     text,
  description     text,
  dimension       text not null,
  rule_type       text not null,
  parameters      jsonb not null default '{}',
  scope_conditions jsonb not null default '[]',
  threshold       numeric(5,4) not null default 0.95,
  weight          numeric(5,4) not null default 1.0,
  is_active       boolean not null default true,
  is_suggested    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_rules_asset on dq_rules(asset_id);

-- ============================================================
-- DQ SCORES
-- ============================================================
create table if not exists dq_scores (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references asset_runs(id) on delete cascade,
  asset_id        uuid not null,
  column_name     text not null,
  description     text,
  dimension       text not null,
  rule_type       text not null,
  score           numeric(5,4) not null,
  threshold       numeric(5,4),
  status          text not null,
  severity        text,
  total_records   integer,
  failed_records  integer,
  message         text,
  created_at      timestamptz not null default now()
);
create index idx_scores_run on dq_scores(run_id);
create index idx_scores_asset on dq_scores(asset_id);

-- ============================================================
-- PROFILING SUMMARIES  (aggregated only — no raw values)
-- ============================================================
create table if not exists profiling_summaries (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references asset_runs(id) on delete cascade,
  asset_id        uuid not null,
  column_name     text not null,
  inferred_type   text,
  row_count       integer,
  null_count      integer,
  null_pct        numeric(5,2),
  unique_count    integer,
  unique_pct      numeric(5,2),
  min_value       text,
  max_value       text,
  avg_value       numeric,
  std_dev         numeric,
  min_length      integer,
  max_length      integer,
  avg_length      numeric,
  top_values      jsonb,
  bottom_values   jsonb,
  value_frequency jsonb,
  pattern_summary jsonb,
  pii_detected    boolean not null default false,
  pii_type        text,
  outlier_count   integer,
  sample_values   jsonb,
  created_at      timestamptz not null default now()
);
create index idx_profiling_run on profiling_summaries(run_id);
create index idx_profiling_asset on profiling_summaries(asset_id);

-- ============================================================
-- WORKFLOW RULE SETS
-- ============================================================
create table if not exists workflow_rule_sets (
  id            uuid primary key default gen_random_uuid(),
  workflow_id   uuid not null references workflows(id) on delete cascade,
  rule_id       uuid not null references dq_rules(id) on delete cascade,
  sort_order    integer not null default 0
);

-- ============================================================
-- ALERTS
-- ============================================================
create table if not exists alerts (
  id                  uuid primary key default gen_random_uuid(),
  asset_id            uuid not null references data_assets(id) on delete cascade,
  clerk_user_id       text not null,
  name                text not null,
  condition           text not null,
  threshold_value     numeric(5,2),
  dimension           text,
  column_name         text,
  is_active           boolean not null default true,
  last_triggered_at   timestamptz,
  created_at          timestamptz not null default now()
);
create index idx_alerts_asset on alerts(asset_id);
create index idx_alerts_user on alerts(clerk_user_id);

-- ============================================================
-- ALERT EVENTS
-- ============================================================
create table if not exists alert_events (
  id            uuid primary key default gen_random_uuid(),
  alert_id      uuid not null references alerts(id) on delete cascade,
  run_id        uuid not null references asset_runs(id),
  triggered_at  timestamptz not null default now(),
  message       text,
  is_read       boolean not null default false
);
create index idx_alert_events_user_unread on alert_events(is_read);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table if not exists blog_posts (
  id              uuid primary key default gen_random_uuid(),
  clerk_user_id   text not null,
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  content         text not null default '',
  cover_image_url text,
  tags            text[] not null default '{}',
  category        text,
  seo_title       text,
  seo_description text,
  og_image_url    text,
  key_takeaways   text[]   not null default '{}',
  faqs            jsonb    not null default '[]',
  post_type       text     not null default 'explainer',
  pull_quote      text,
  internal_links  jsonb    not null default '[]',
  author_name     text,
  author_role     text,
  author_bio      text,
  published       boolean not null default false,
  published_at    timestamptz,
  view_count      integer not null default 0,
  read_time_min   integer,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_blog_slug on blog_posts(slug);
create index idx_blog_published on blog_posts(published, published_at desc);
create index idx_blog_tags on blog_posts using gin(tags);
create index idx_blog_fts on blog_posts
  using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')));

-- ============================================================
-- ROW LEVEL SECURITY
-- All writes go through Server Actions with service_role key.
-- Enable RLS but allow all for now — restrict per table below.
-- ============================================================
alter table business_units     enable row level security;
alter table catalogs           enable row level security;
alter table data_assets        enable row level security;
alter table workflows          enable row level security;
alter table asset_runs         enable row level security;
alter table dq_rules           enable row level security;
alter table dq_scores          enable row level security;
alter table profiling_summaries enable row level security;
alter table workflow_rule_sets  enable row level security;
alter table alerts             enable row level security;
alter table alert_events       enable row level security;
alter table blog_posts         enable row level security;

-- Service role bypasses RLS automatically — no policy needed for server-side.
-- Public read policy for published blog posts:
create policy "Public can read published blog posts"
  on blog_posts for select
  using (published = true);
