import type { Metadata } from "next";
import Script from "next/script";
import { CategorlyClient } from "./CategorlyClient";

export const metadata: Metadata = {
  title: "Stop Chasing Clients to Categorize Transactions — Categorly",
  description:
    "Sync uncategorized transactions from QuickBooks or Xero and send clients a mobile swipe interface with automatic reminders — for bookkeepers with 3+ clients. From $30/mo. Join the waitlist.",
  keywords: [
    "client transaction categorization tool",
    "get clients to categorize transactions",
    "quickbooks uncategorized transactions client",
    "bookkeeping client follow up tool",
    "month end close bookkeeping tool",
    "xero uncategorized transactions",
    "bookkeeper client reminder tool",
    "bookkeeping practice management",
    "client data collection for bookkeepers",
    "automate bookkeeping client follow-up",
  ],
  openGraph: {
    title: "Stop Chasing Clients to Categorize Transactions — Categorly",
    description:
      "One magic link, a mobile swipe interface, and automatic reminders — until every transaction is categorized.",
  },
  alternates: { canonical: "https://sohovi.com/labs/categorly" },
  twitter: {
    card: "summary_large_image",
    title: "Stop Chasing Clients to Categorize Transactions — Categorly",
    description: "One magic link, a mobile swipe interface, and automatic reminders until every transaction is done.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Categorly",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "A client transaction-categorization tool for bookkeepers — syncs uncategorized transactions from QuickBooks or Xero and sends clients a mobile swipe interface with automatic reminders.",
  url: "https://sohovi.com/labs/categorly",
};

export default function CategorlyPage() {
  return (
    <>
      <Script id="categorly-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <CategorlyClient />
    </>
  );
}
