"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getScopeId } from "@/lib/clerk/utils";
import { requireFeature, hasFeature } from "@/lib/plans/entitlements";
import { sendEmail, escapeHtml } from "@/lib/email/send";

export type ChannelType = "email" | "slack";

/** A channel as the client is allowed to see it — never the raw config. */
export interface NotificationChannel {
  id: string;
  type: ChannelType;
  label: string | null;
  /** Masked destination, safe to render: an address, or a Slack webhook tail. */
  hint: string;
  is_enabled: boolean;
  last_sent_at: string | null;
  last_error: string | null;
  created_at: string;
}

interface ChannelRow {
  id: string;
  type: ChannelType;
  config: { address?: string; webhook_url?: string };
  label: string | null;
  is_enabled: boolean;
  last_sent_at: string | null;
  last_error: string | null;
  created_at: string;
}

const FEATURE_FOR: Record<ChannelType, "alertEmail" | "alertSlack"> = {
  email: "alertEmail",
  slack: "alertSlack",
};

/**
 * A Slack webhook URL is a credential — anyone holding it can post to the
 * channel. Only ever show its tail so a user can tell two webhooks apart
 * without the value being readable from the page source.
 */
function toHint(row: ChannelRow): string {
  if (row.type === "email") return row.config.address ?? "";
  const url = row.config.webhook_url ?? "";
  const tail = url.slice(-6);
  return tail ? `hooks.slack.com/…${tail}` : "Slack webhook";
}

function toChannel(row: ChannelRow): NotificationChannel {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    hint: toHint(row),
    is_enabled: row.is_enabled,
    last_sent_at: row.last_sent_at,
    last_error: row.last_error,
    created_at: row.created_at,
  };
}

export async function getNotificationChannels(): Promise<NotificationChannel[]> {
  // Rendered on the alerts page for every plan; the UI shows locked buttons
  // rather than an error.
  if (!(await hasFeature("alerts"))) return [];
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("notification_channels")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ChannelRow[]).map(toChannel);
}

export interface SaveChannelInput {
  type: ChannelType;
  /** Email address, or Slack incoming-webhook URL. */
  destination: string;
  label?: string | null;
}

export async function saveNotificationChannel(
  input: SaveChannelInput
): Promise<NotificationChannel> {
  await requireFeature(FEATURE_FOR[input.type]);
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const destination = input.destination.trim();
  if (input.type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)) {
      throw new Error("That does not look like an email address.");
    }
  } else if (!destination.startsWith("https://hooks.slack.com/")) {
    throw new Error(
      "A Slack channel needs an incoming-webhook URL starting with https://hooks.slack.com/"
    );
  }

  const config = input.type === "email" ? { address: destination } : { webhook_url: destination };

  const { data, error } = await supabase
    .from("notification_channels")
    .insert({
      clerk_user_id: userId,
      type: input.type,
      config,
      label: input.label?.trim() || null,
      is_enabled: true,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/alerts");
  return toChannel(data as ChannelRow);
}

export async function deleteNotificationChannel(id: string): Promise<void> {
  await requireFeature("alerts");
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("notification_channels")
    .delete()
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
}

export async function setChannelEnabled(id: string, enabled: boolean): Promise<void> {
  await requireFeature("alerts");
  const userId = await getScopeId();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("notification_channels")
    .update({ is_enabled: enabled })
    .eq("id", id)
    .eq("clerk_user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
}

import {
  sendAlertNotification,
  renderAlertEmail,
  renderSlackBlocks,
  postToSlack,
  type AlertPayload,
} from "@/lib/notifications/deliver";

/** Sends a sample alert to one channel so a user can confirm it works. */
export async function sendTestNotification(channelId: string): Promise<{ ok: boolean; error?: string }> {
  const userId = await getScopeId();
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("notification_channels")
    .select("*")
    .eq("id", channelId)
    .eq("clerk_user_id", userId)
    .single();
  if (!data) return { ok: false, error: "Channel not found." };

  const channel = data as ChannelRow;
  await requireFeature(FEATURE_FOR[channel.type]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://sohovi.com";
  const payload: AlertPayload = {
    assetId: "test",
    assetName: "Test asset",
    alertName: "Sohovi test notification",
    message: "If you can read this, alert delivery is working.",
    score: 87,
  };

  try {
    if (channel.type === "email") {
      const address = channel.config.address;
      if (!address) throw new Error("Channel has no email address configured.");
      const ok = await sendEmail({
        to: address,
        subject: "Sohovi test notification",
        html: renderAlertEmail(payload, appUrl),
      });
      if (!ok) throw new Error("Resend rejected the message.");
    } else {
      const webhook = channel.config.webhook_url;
      if (!webhook) throw new Error("Channel has no webhook URL configured.");
      await postToSlack(webhook, renderSlackBlocks(payload, appUrl));
    }

    await supabase
      .from("notification_channels")
      .update({ last_sent_at: new Date().toISOString(), last_error: null })
      .eq("id", channel.id);
    revalidatePath("/dashboard/alerts");
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delivery failed.";
    await supabase
      .from("notification_channels")
      .update({ last_error: message })
      .eq("id", channel.id);
    revalidatePath("/dashboard/alerts");
    return { ok: false, error: message };
  }
}
