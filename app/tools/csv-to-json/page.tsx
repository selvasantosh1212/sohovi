import type { Metadata } from "next";
import Script from "next/script";
import { CsvToJsonClient } from "./CsvToJsonClient";

export const metadata: Metadata = {
  title: "Free CSV to JSON Converter Online — No Signup, No Limits",
  description:
    "Convert CSV files to JSON arrays online for free. Supports array of objects, array of arrays, or nested JSON. Browser-based — your data never leaves your device.",
  keywords: [
    "csv to json",
    "convert csv to json online",
    "csv to json array",
    "csv to json converter free",
    "convert csv to json python alternative",
    "csv to json no upload",
  ],
  openGraph: {
    title: "Free CSV to JSON Converter — No Signup, No Limits",
    description: "Convert any CSV to JSON instantly. Array of objects, arrays, or nested by key. 100% browser-based.",
  },
  alternates: { canonical: "https://sohovi.com/tools/csv-to-json" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV to JSON Converter",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Convert CSV files to JSON online for free. Supports multiple output formats. No file upload — 100% browser-based.",
  url: "https://sohovi.com/tools/csv-to-json",
};

export default function CsvToJsonPage() {
  return (
    <>
      <Script id="csv-json-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <CsvToJsonClient />
    </>
  );
}
