/**
 * Alert delivery internals.
 *
 * Deliberately NOT in a `"use server"` module: every export of one is a public
 * endpoint, and `sendAlertNotification` writes to `alert_events` — a table with
 * no tenancy column — so exposing it would let any authenticated caller stamp
 * arbitrary tenants' events and push attacker-controlled text into a
 * workspace's Slack channel. It is called from `evaluateAlerts` and nowhere
 * else.
 */
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, escapeHtml } from "@/lib/email/send";
import { can, type Feature } from "@/lib/plans/features";
import type { Plan } from "@/lib/plans/limits";

type ChannelType = "email" | "slack";

interface ChannelRow {
  id: string;
  type: ChannelType;
  config: { address?: string; webhook_url?: string };
  is_enabled: boolean;
}

const FEATURE_FOR: Record<ChannelType, Feature> = {
  email: "alertEmail",
  slack: "alertSlack",
};

export interface AlertPayload {
  assetId: string;
  assetName: string;
  alertName: string;
  message: string;
  score: number;
}

export function renderAlertEmail(p: AlertPayload, appUrl: string): string {
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px">
      <h2 style="margin:0 0 4px;font-size:18px;color:#0A0A0F">${escapeHtml(p.alertName)}</h2>
      <p style="margin:0 0 16px;color:#64748b;font-size:14px">
        Triggered on <strong>${escapeHtml(p.assetName)}</strong>
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:#0A0A0F">${escapeHtml(p.message)}</p>
      <p style="margin:0 0 20px;color:#64748b;font-size:14px">
        Current DQ score: <strong>${p.score}</strong>
      </p>
      <a href="${appUrl}/dashboard/assets/${encodeURIComponent(p.assetId)}"
         style="display:inline-block;background:#1A1A2E;color:#fff;text-decoration:none;
                font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px">
        Open the asset
      </a>
      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px">
        Sent because you have an alert configured in Sohovi. Scores and rule names only —
        never your data.
      </p>
    </div>`;
}

/** Neutralizes Slack mrkdwn control characters in interpolated text. */
function escapeMrkdwn(value: string): string {
  return value.replace(/[&<>*_`~|]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : `\\${c}`
  );
}

export function renderSlackBlocks(p: AlertPayload, appUrl: string) {
  const alertName = escapeMrkdwn(p.alertName);
  const message = escapeMrkdwn(p.message);
  const assetName = escapeMrkdwn(p.assetName);
  return {
    text: `${alertName}: ${message}`,
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: `*${alertName}*\n${message}` },
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `*${assetName}* · DQ score *${p.score}*` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open the asset" },
            url: `${appUrl}/dashboard/assets/${encodeURIComponent(p.assetId)}`,
          },
        ],
      },
    ],
  };
}

export async function postToSlack(webhookUrl: string, body: unknown): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Slack returned ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

/**
 * Pushes a triggered alert to every enabled channel the workspace's plan
 * allows.
 *
 * Only the asset name, alert name, score and message are sent — never rows,
 * column values or samples. Failures are recorded on the channel and on the
 * event, never thrown: the run and the alert_event are already committed by
 * the time this is called, and a dead webhook must not fail a DQ run.
 */
export async function sendAlertNotification(
  payload: AlertPayload,
  userId: string,
  plan: Plan,
  eventIds: string[] = [],
  alertIds: string[] = []
): Promise<void> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("notification_channels")
    .select("*")
    .eq("clerk_user_id", userId)
    .eq("is_enabled", true);

  const channels = (data ?? []) as ChannelRow[];
  if (channels.length === 0) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://sohovi.com";
  let anyDelivered = false;
  let lastFailure: string | null = null;

  for (const channel of channels) {
    // Re-check per channel: a workspace that downgrades keeps its rows, and
    // Slack delivery must stop even though the row still exists.
    if (!can(plan, FEATURE_FOR[channel.type])) continue;

    try {
      if (channel.type === "email") {
        const address = channel.config.address;
        if (!address) throw new Error("Channel has no email address configured.");
        const ok = await sendEmail({
          to: address,
          subject: `${payload.alertName} — ${payload.assetName}`,
          html: renderAlertEmail(payload, appUrl),
        });
        if (!ok) throw new Error("Resend rejected the message.");
      } else {
        const webhook = channel.config.webhook_url;
        if (!webhook) throw new Error("Channel has no webhook URL configured.");
        await postToSlack(webhook, renderSlackBlocks(payload, appUrl));
      }

      anyDelivered = true;
      await supabase
        .from("notification_channels")
        .update({ last_sent_at: new Date().toISOString(), last_error: null })
        .eq("id", channel.id);
    } catch (err) {
      lastFailure = err instanceof Error ? err.message : "Delivery failed.";
      console.error(`[notifications] ${channel.type} delivery failed`, err);
      await supabase
        .from("notification_channels")
        .update({ last_error: lastFailure })
        .eq("id", channel.id);
    }
  }

  if (eventIds.length > 0 && alertIds.length > 0) {
    // alert_events carries no clerk_user_id, so constrain the write by the
    // alert ids this evaluation just fired for — those were read under the
    // caller's scope — as well as by event id.
    await supabase
      .from("alert_events")
      .update({
        delivered_at: anyDelivered ? new Date().toISOString() : null,
        delivery_error: anyDelivered ? null : lastFailure,
      })
      .in("id", eventIds)
      .in("alert_id", alertIds);
  }
}

