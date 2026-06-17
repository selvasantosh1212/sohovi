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
  twitter: { card: "summary_large_image", title: "Free CSV Column Picker — Select, Drop & Rename Columns", description: "Pick the columns you want, drop the ones you don't, rename them, reorder — then download. Free, no signup." },
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
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to select and filter CSV columns online",
  step: [
    { "@type": "HowToStep", name: "Upload your CSV file", text: "Drop your file or click to browse. The tool reads it entirely in your browser. No data is sent anywhere." },
    { "@type": "HowToStep", name: "Configure your columns", text: "Toggle visibility with the eye icon, rename by clicking the column name, drag the grip handle to reorder. Changes are live — the column list reflects your final output." },
    { "@type": "HowToStep", name: "Download your filtered CSV", text: "Click Download to get your file with only the selected columns, in your chosen order, with your new names. All rows are preserved." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I extract specific columns from a CSV?", acceptedAnswer: { "@type": "Answer", text: "Upload your CSV, then uncheck the columns you want to remove (or check only the ones you want to keep). Click Download to get the filtered CSV with only your selected columns." } },
    { "@type": "Question", name: "Can I rename columns?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click on any column name to rename it inline. The renamed headers appear in the downloaded CSV." } },
    { "@type": "Question", name: "Can I reorder columns?", acceptedAnswer: { "@type": "Answer", text: "Yes. Drag the grip handle on the left of each column row to reorder them. The downloaded CSV reflects your new column order." } },
    { "@type": "Question", name: "Is there a row limit?", acceptedAnswer: { "@type": "Answer", text: "No. The tool processes your entire file in-browser. No rows are lost or truncated in the download." } },
    { "@type": "Question", name: "What file formats are supported?", acceptedAnswer: { "@type": "Answer", text: "CSV (.csv, .txt) and Excel (.xlsx, .xls). The tool reads the first sheet of Excel files." } },
  ],
};

export default function CsvColumnsPage() {
  return (
    <>
      <Script id="csv-cols-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="csv-cols-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="csv-cols-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CsvColumnsClient />
    </>
  );
}
