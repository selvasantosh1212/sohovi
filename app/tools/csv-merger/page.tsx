import type { Metadata } from "next";
import Script from "next/script";
import { CsvMergerClient } from "./CsvMergerClient";

export const metadata: Metadata = {
  title: "Free CSV Merger — Combine Multiple CSV Files Online",
  description:
    "Merge or combine multiple CSV files into one download — stack rows or join by a shared column. Free, browser-based, no signup, no row limits.",
  keywords: [
    "merge csv files online",
    "combine csv files",
    "append csv files",
    "join csv files online",
    "stack csv files",
    "merge multiple csv online free",
  ],
  openGraph: {
    title: "Free CSV Merger — Combine Multiple CSV Files Online",
    description: "Stack rows from multiple CSVs or join them by a shared column. Free, browser-based, no limits.",
  },
  alternates: { canonical: "https://sohovi.com/tools/csv-merger" },
  twitter: { card: "summary_large_image", title: "Free CSV Merger — Combine Multiple CSV Files Online", description: "Stack rows from multiple CSVs or join them by a shared column. Free, browser-based, no limits." },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV Merger",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Merge multiple CSV files by stacking rows or joining by a shared column. No row limits. 100% browser-based.",
  url: "https://sohovi.com/tools/csv-merger",
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

export default function CsvMergerPage() {
  return (
    <>
      <Script id="csv-merger-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <CsvMergerClient />
    </>
  );
}
