import type { Metadata } from "next";
import Script from "next/script";
import { SnapbackClient } from "./SnapbackClient";

export const metadata: Metadata = {
  title: "Automated Backups for Supabase, Neon & Turso — SnapBack",
  description:
    "Never lose your Supabase, Neon, or Turso database again. Automated Postgres backup and scheduled database backups streamed to your own S3, R2, or B2 bucket — a simpler, cheaper alternative to point-in-time recovery. Daily, every 12 hours, or weekly.",
  openGraph: {
    title: "Automated Backups for Supabase, Neon & Turso — SnapBack",
    description: "Scheduled database backups streamed to storage you own. No vendor lock-in, no expensive tier jump for real retention.",
  },
  alternates: { canonical: "https://sohovi.com/labs/snapback" },
  twitter: {
    card: "summary_large_image",
    title: "Automated Backups for Supabase, Neon & Turso — SnapBack",
    description: "Scheduled database backups streamed to storage you own.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SnapBack",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "9", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "Automated database backups for Supabase, Neon, and Turso, streamed directly to your own S3-compatible storage bucket.",
  url: "https://sohovi.com/labs/snapback",
};

export default function SnapbackPage() {
  return (
    <>
      <Script id="snapback-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <SnapbackClient />
    </>
  );
}
