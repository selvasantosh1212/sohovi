import { auth, currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { getDodo, PRODUCT_IDS } from "@/lib/dodo/client";
import type { CheckoutSessionCreateParams } from "dodopayments/resources/checkout-sessions";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan?: unknown; interval?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { plan, interval } = body;
  if (
    typeof plan !== "string" ||
    typeof interval !== "string" ||
    !["pro", "business"].includes(plan) ||
    !["monthly", "annual"].includes(interval)
  ) {
    return Response.json({ error: "Invalid plan or interval" }, { status: 400 });
  }

  const productId = PRODUCT_IDS[`${plan}_${interval}`];
  if (!productId) {
    return Response.json(
      { error: `Product not configured for ${plan}/${interval}` },
      { status: 500 }
    );
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  const params: CheckoutSessionCreateParams = {
    product_cart: [{ product_id: productId, quantity: 1 }],
    return_url: `${baseUrl}/dashboard?payment=success`,
    cancel_url: `${baseUrl}/#pricing`,
    metadata: { clerk_user_id: userId },
    allowed_payment_method_types: ["credit", "debit"],
    ...(plan === "business" ? { subscription_data: { trial_period_days: 7 } } : {}),
    ...(email ? { customer: { email, name: user?.fullName ?? undefined } } : {}),
  };

  try {
    const session = await getDodo().checkoutSessions.create(params);
    return Response.json({ url: session.checkout_url });
  } catch (error) {
    console.error("[checkout] dodo error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
