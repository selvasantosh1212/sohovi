-- Run this once in your Supabase SQL editor.
-- Alert delivery. Alerts have always evaluated correctly on every run and
-- written alert_events, but nothing ever left the app — users had to open the
-- dashboard to discover that a threshold had been breached.
--
-- Channels are per-workspace (clerk_user_id holds orgId ?? userId, matching
-- every other table), not per-alert: a team wants one Slack channel and one
-- inbox, not a destination per rule.

create table if not exists notification_channels (
  id             uuid primary key default gen_random_uuid(),
  clerk_user_id  text not null,
  type           text not null check (type in ('email', 'slack')),
  -- email: { "address": "..." }   slack: { "webhook_url": "..." }
  config         jsonb not null default '{}'::jsonb,
  label          text,
  is_enabled     boolean not null default true,
  last_sent_at   timestamptz,
  last_error     text,
  created_at     timestamptz not null default now()
);

create index if not exists notification_channels_scope_idx
  on notification_channels (clerk_user_id, is_enabled);

comment on table notification_channels is
  'Where alert events are delivered. One row per destination per workspace. Email is Pro (PlanLimits.alertEmail); Slack is Team (PlanLimits.alertSlack).';
comment on column notification_channels.config is
  'Destination details. Slack webhook URLs are credentials — never expose this column to the client; the UI reads only a masked hint.';
comment on column notification_channels.last_error is
  'Why the most recent delivery attempt failed, if it did. Surfaced in the UI so a dead webhook is visible rather than silently dropping alerts.';

-- Record what was actually delivered, so a missing alert can be distinguished
-- from a delivered-but-ignored one.
alter table alert_events add column if not exists delivered_at timestamptz;
alter table alert_events add column if not exists delivery_error text;

comment on column alert_events.delivered_at is
  'When this event was successfully pushed to at least one notification channel. Null means it only ever appeared in-app.';
