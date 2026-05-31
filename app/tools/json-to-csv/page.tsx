import type { Metadata } from "next";
import Script from "next/script";
import { JsonToCsvClient } from "./JsonToCsvClient";

export const metadata: Metadata = {
  title: "Free JSON to CSV Converter Online — Flatten Nested JSON",
  description:
    "Convert JSON to CSV online for free. Paste JSON or upload a .json file. Flattens nested objects automatically. Browser-based — nothing uploaded.",
  keywords: [
    "json to csv",
    "convert json to csv online",
    "json array to csv",
    "flatten json to csv",
    "json to spreadsheet",
    "json to excel",
  ],
  openGraph: {
    title: "Free JSON to CSV Converter — Paste or Upload JSON",
    description: "Convert any JSON array to CSV. Auto-flattens nested objects. Browser-based, no signup.",
  },
  alternates: { canonical: "https://sohovi.com/tools/json-to-csv" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free JSON to CSV Converter",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Convert JSON arrays to CSV online for free. Supports nested JSON flattening. No upload — 100% browser-based.",
  url: "https://sohovi.com/tools/json-to-csv",
};

export default function JsonToCsvPage() {
  return (
    <>
      <Script id="json-csv-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <JsonToCsvClient />
    </>
  );
}
