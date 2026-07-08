import type { Metadata } from "next";
import Script from "next/script";
import { ShipNotesClient } from "./ShipNotesClient";

export const metadata: Metadata = {
  title: "Free Changelog Tool & Changelog Widget for Indie SaaS — ShipNotes",
  description:
    "A Beamer and Canny alternative for solo founders: a hosted changelog page and embeddable 'what's new' widget, auto-drafted from your GitHub releases, with optional BYOK AI polish.",
  openGraph: {
    title: "Free Changelog Tool for Indie SaaS — ShipNotes",
    description: "Beautiful, embeddable changelogs auto-drafted from your GitHub releases — free to start.",
  },
  alternates: { canonical: "https://sohovi.com/labs/shipnotes" },
  twitter: {
    card: "summary_large_image",
    title: "Free Changelog Tool for Indie SaaS — ShipNotes",
    description: "A Beamer alternative built for solo founders.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShipNotes",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description: "Changelog tool for indie SaaS founders — auto-drafted from GitHub releases, with an embeddable widget.",
  url: "https://sohovi.com/labs/shipnotes",
};

export default function ShipNotesPage() {
  return (
    <>
      <Script id="shipnotes-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ShipNotesClient />
    </>
  );
}
