import type { Metadata } from "next";
import Script from "next/script";
import { RefTrackClient } from "./RefTrackClient";

export const metadata: Metadata = {
  title: "Affiliate Tracking Software for Small SaaS — RefTrack",
  description:
    "A simple affiliate program for small SaaS founders and a Rewardful / FirstPromoter alternative for teams with 5-20 affiliates: $19/mo flat, no percentage of revenue, no per-affiliate fees.",
  openGraph: {
    title: "Flat-Fee Affiliate Tracking for Micro-SaaS — RefTrack",
    description: "Referral links, commission tracking, and payout export — without enterprise affiliate-platform pricing.",
  },
  alternates: { canonical: "https://sohovi.com/labs/reftrack" },
  twitter: {
    card: "summary_large_image",
    title: "Flat-Fee Affiliate Tracking for Micro-SaaS — RefTrack",
    description: "A Rewardful alternative for founders with 5-20 affiliates.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RefTrack",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "19", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description: "Flat-fee affiliate tracking for micro-SaaS founders with 5-20 affiliates.",
  url: "https://sohovi.com/labs/reftrack",
};

export default function RefTrackPage() {
  return (
    <>
      <Script id="reftrack-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <RefTrackClient />
    </>
  );
}
