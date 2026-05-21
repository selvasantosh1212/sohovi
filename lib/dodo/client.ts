import DodoPayments from "dodopayments";

let _client: DodoPayments | null = null;

export function getDodo(): DodoPayments {
  if (!_client) {
    _client = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
      environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
    });
  }
  return _client;
}

export const PRODUCT_IDS: Record<string, string | undefined> = {
  pro_monthly: process.env.DODO_PRODUCT_PRO_MONTHLY,
  pro_annual: process.env.DODO_PRODUCT_PRO_ANNUAL,
  business_monthly: process.env.DODO_PRODUCT_BUSINESS_MONTHLY,
  business_annual: process.env.DODO_PRODUCT_BUSINESS_ANNUAL,
};

export function planFromProductId(productId: string): "pro" | "business" | null {
  if (productId === process.env.DODO_PRODUCT_PRO_MONTHLY) return "pro";
  if (productId === process.env.DODO_PRODUCT_PRO_ANNUAL) return "pro";
  if (productId === process.env.DODO_PRODUCT_BUSINESS_MONTHLY) return "business";
  if (productId === process.env.DODO_PRODUCT_BUSINESS_ANNUAL) return "business";
  return null;
}
