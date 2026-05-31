import type { Metadata } from "next";
import Script from "next/script";
import { CsvToMarkdownClient } from "./CsvToMarkdownClient";

export const metadata: Metadata = {
  title: "Free CSV to Markdown Table Converter — GitHub-Flavored Markdown",
  description:
    "Convert any CSV to a Markdown table instantly. GitHub-flavored markdown, alignment control, live preview. Free, browser-based, no signup.",
  keywords: [
    "csv to markdown table",
    "csv to markdown converter",
    "table to markdown",
    "markdown table generator from csv",
    "csv to github table",
    "csv to readme table",
  ],
  openGraph: {
    title: "Free CSV to Markdown Table Converter",
    description: "Turn any CSV into a GitHub-ready Markdown table with alignment options and live preview. No signup.",
  },
  alternates: { canonical: "https://sohovi.com/tools/csv-to-markdown" },
  twitter: { card: "summary_large_image", title: "Free CSV to Markdown Table Converter", description: "Turn any CSV into a GitHub-ready Markdown table with alignment options and live preview. No signup." },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV to Markdown Table Converter",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Convert CSV to GitHub-flavored Markdown tables with alignment control and live preview. 100% browser-based.",
  url: "https://sohovi.com/tools/csv-to-markdown",
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

export default function CsvToMarkdownPage() {
  return (
    <>
      <Script id="csv-md-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <CsvToMarkdownClient />
    </>
  );
}
