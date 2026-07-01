-- Run this once in your Supabase SQL editor.
-- Adds an optional free-text description and generic scope/filter conditions to dq_rules.
alter table dq_rules add column if not exists description text;
alter table dq_rules add column if not exists scope_conditions jsonb not null default '[]';
