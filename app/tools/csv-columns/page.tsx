import type { Metadata } from "next";
import Script from "next/script";
import { CsvColumnsClient } from "./CsvColumnsClient";

export const metadata: Metadata = {
  title: "Free CSV Column Picker — Select, Drop & Rename Columns Online",
  description:
    "Select, drop, reorder, and rename columns from any CSV file — then download the result. Free, browser-based, your data never leaves your device.",
  keywords: [
    "extract columns csv",
    "select columns csv online",
    "drop columns csv",
    "csv column filter",
    "rename csv columns online",
    "reorder csv columns",
  ],
  openGraph: {
    title: "Free CSV Column Picker — Select, Drop & Rename Columns",
    description: "Pick the columns you want, drop the ones you don't, rename them, reorder — then download. Free, no signup.",
  },
  alternates: { canonical: "https://sohovi.com/tools/csv-columns" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV Column Picker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Select, drop, rename, and reorder columns from any CSV file. Download the result instantly. 100% browser-based.",
  url: "https://sohovi.com/tools/csv-columns",
};

export default function CsvColumnsPage() {
  return (
    <>
      <Script id="csv-cols-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <CsvColumnsClient />
    </>
  );
}
