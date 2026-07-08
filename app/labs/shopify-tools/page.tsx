import type { Metadata } from "next";
import Script from "next/script";
import { ShopifyToolsClient } from "./ShopifyToolsClient";

export const metadata: Metadata = {
  title: "Shopify Bulk Price Editor, Order Tagging & Low-Stock Alerts App",
  description:
    "A focused Shopify app that automates one tedious merchant workflow really well — bulk price editing with scheduled rollback, supplier CSV import to Shopify, low-stock alerts, or an order tagging rules engine. Tell us which one hurts most.",
  openGraph: {
    title: "Shopify Bulk Price Editor, Low-Stock Alerts & CSV Tools",
    description: "One Shopify workflow, automated properly — help us decide which one to build first.",
  },
  alternates: { canonical: "https://sohovi.com/labs/shopify-tools" },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Bulk Price Editor, Low-Stock Alerts & CSV Tools",
    description: "One tedious Shopify workflow, automated really well.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Shopify Tools",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "9.99", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description: "A focused Shopify app automating one high-friction merchant workflow: bulk pricing, supplier CSV imports, low-stock alerts, or order tagging.",
  url: "https://sohovi.com/labs/shopify-tools",
};

export default function ShopifyToolsPage() {
  return (
    <>
      <Script id="shopify-tools-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ShopifyToolsClient />
    </>
  );
}
