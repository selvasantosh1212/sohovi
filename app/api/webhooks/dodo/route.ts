import type { NextRequest } from "next/server";
import type { UnwrapWebhookEvent } from "dodopayments/resources/webhooks/webhooks";
import { getDodo, planFromProductId } from "@/lib/dodo/client";

// Must not parse body — we need raw bytes for signature verification
export const dynamic = "force-dynamic";

async function setClerkPlan(userId: string, plan: "free" | "pro" | "business") {
  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_metadata: { plan } }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Clerk PATCH failed (${res.status}): ${text}`);
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("DODO_WEBHOOK_SECRET is not set");
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: UnwrapWebhookEvent;
  try {
    event = getDodo().webhooks.unwrap(rawBody, {
      headers: Object.fromEntries(request.headers.entries()),
      key: webhookSecret,
    });
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type } = event;

  if (
    type === "subscription.active" ||
    type === "subscription.plan_changed" ||
    type === "subscription.renewed"
  ) {
    const sub = (event as { data: { product_id: string; metadata: Record<string, string> } }).data;
    const userId = sub.metadata?.clerk_user_id;
    if (!userId) {
      console.warn("Dodo webhook: missing clerk_user_id in metadata", { type });
      return Response.json({ received: true });
    }
    const plan = planFromProductId(sub.product_id);
    if (!plan) {
      console.warn("Dodo webhook: unknown product_id", sub.product_id);
      return Response.json({ received: true });
    }
    await setClerkPlan(userId, plan);
  }

  if (
    type === "subscription.cancelled" ||
    type === "subscription.expired" ||
    type === "subscription.on_hold"
  ) {
    const sub = (event as { data: { metadata: Record<string, string> } }).data;
    const userId = sub.metadata?.clerk_user_id;
    if (userId) {
      await setClerkPlan(userId, "free");
    }
  }

  return Response.json({ received: true });
}
