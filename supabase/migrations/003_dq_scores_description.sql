-- Run this once in your Supabase SQL editor.
-- Persists the rule's user-authored description alongside its score in run history.
alter table dq_scores add column if not exists description text;
