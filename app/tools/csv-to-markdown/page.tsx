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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert a CSV to a Markdown table",
  step: [
    { "@type": "HowToStep", name: "Upload a CSV or paste CSV text", text: "Switch between file upload and paste mode. The tool accepts standard CSV with commas, quoted fields, and any number of columns." },
    { "@type": "HowToStep", name: "Adjust alignment and cell length", text: "Set alignment (left, center, right) per column using the toggles. Use the cell length slider to truncate long values so your table stays readable." },
    { "@type": "HowToStep", name: "Copy to clipboard", text: "Click Copy to get the full Markdown table. Paste it directly into GitHub READMEs, GitLab wikis, Notion, Obsidian, or any Markdown editor." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert a CSV to a Markdown table?", acceptedAnswer: { "@type": "Answer", text: "Upload your CSV file or paste the CSV text. The tool reads the first row as headers and converts each subsequent row into a Markdown table row. You can control column alignment (left, center, right) and truncate long cells." } },
    { "@type": "Question", name: "What is GitHub-flavored Markdown (GFM)?", acceptedAnswer: { "@type": "Answer", text: "GitHub-flavored Markdown is the dialect of Markdown used on GitHub, GitLab, and many documentation tools. GFM tables use pipe characters (|) as column separators and require a separator row after the header with dashes and optional colons for alignment." } },
    { "@type": "Question", name: "How do I set column alignment?", acceptedAnswer: { "@type": "Answer", text: "Use the alignment toggles above the output. Left alignment (default) uses dashes only. Center alignment adds colons on both sides (:---:). Right alignment adds a colon on the right (---:)." } },
    { "@type": "Question", name: "Can I paste CSV text instead of uploading a file?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click 'Paste CSV text' to switch to a text area where you can paste directly. Useful for small tables you're copying from a spreadsheet." } },
    { "@type": "Question", name: "Does it work for large files?", acceptedAnswer: { "@type": "Answer", text: "Yes — there's no row limit. The output is truncated in the browser preview for performance, but the Copy button always gives you the full table." } },
  ],
};

export default function CsvToMarkdownPage() {
  return (
    <>
      <Script id="csv-md-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="csv-md-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="csv-md-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CsvToMarkdownClient />
    </>
  );
}
