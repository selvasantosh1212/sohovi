-- Run this once in your Supabase SQL editor.
-- Shared feedback/validation table for the /labs/* pre-launch landing pages
-- (one page per unreleased micro-SaaS idea: snapback, encore, signsync,
-- shopify-tools, reftrack, shipnotes). Two-phase capture: Step 1 (email
-- capture on "Let's build this tool") inserts a row with just the fixed
-- columns; Step 2 (optional 5-8 question survey) updates that same row by
-- id, so one row always represents one visitor's full journey rather than
-- two disjoint submissions.

create table if not exists newtools_form (
  id                  uuid primary key default gen_random_uuid(),
  tool_slug           text not null,
  email               text not null,
  name                text,
  would_pay           text,               -- 'yes' | 'maybe' | 'no' — set by Step 2
  how_solve_today     text,
  must_have_reason    text,
  additional_feedback text,
  tool_answers        jsonb not null default '{}'::jsonb,
  survey_completed_at timestamptz,        -- null = Step 1 only, never reached Step 2
  referrer            text,
  landing_query       text,
  user_agent          text,
  created_at          timestamptz not null default now()
);
create index if not exists idx_newtools_form_tool_slug  on newtools_form(tool_slug);
create index if not exists idx_newtools_form_created_at on newtools_form(created_at desc);

-- RLS — enabled per this schema's convention (service role bypasses it
-- automatically for server-side access; this just blocks the public anon
-- key from reading/writing this table directly via PostgREST). No policies
-- needed since all reads/writes go through Server Actions with the service
-- role key — no anon/authenticated access is ever intended here.
alter table newtools_form enable row level security;
