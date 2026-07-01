-- Run this once in your Supabase SQL editor.
-- Adds a run-wide scope filter (distinct from per-rule scope_conditions on dq_rules):
-- asset_runs.scope_conditions records what was actually applied to a given run;
-- workflows.default_scope_conditions lets a workflow pre-populate that filter.
alter table asset_runs add column if not exists scope_conditions jsonb not null default '[]';
alter table workflows add column if not exists default_scope_conditions jsonb not null default '[]';
