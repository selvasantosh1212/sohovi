import type { Metadata } from "next";
import Script from "next/script";
import { RemoveDuplicatesClient } from "./RemoveDuplicatesClient";

export const metadata: Metadata = {
  title: "Free Duplicate Row Remover for CSV — No Signup, No Limits",
  description:
    "Upload your CSV and instantly remove duplicate rows — exact match or by selected columns. Free, browser-based, your data never leaves your device.",
  keywords: [
    "remove duplicates csv",
    "deduplicate csv online",
    "find duplicate rows csv",
    "csv duplicate remover free",
    "remove duplicate rows excel",
    "unique rows csv",
  ],
  openGraph: {
    title: "Free Duplicate Row Remover for CSV Files",
    description: "Remove exact duplicates or column-subset duplicates from any CSV. 100% browser-based — nothing uploaded.",
  },
  alternates: { canonical: "https://sohovi.com/tools/remove-duplicates" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV Duplicate Row Remover",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Remove duplicate rows from CSV files instantly in your browser. Supports exact-match and column-subset deduplication. No signup required.",
  url: "https://sohovi.com/tools/remove-duplicates",
};

export default function RemoveDuplicatesPage() {
  return (
    <>
      <Script
        id="remove-dup-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <RemoveDuplicatesClient />
    </>
  );
}
