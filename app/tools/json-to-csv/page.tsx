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
  twitter: { card: "summary_large_image", title: "Free JSON to CSV Converter — Paste or Upload JSON", description: "Convert any JSON array to CSV. Auto-flattens nested objects. Browser-based, no signup." },
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
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert JSON to CSV online",
  step: [
    { "@type": "HowToStep", name: "Paste your JSON or upload a file", text: "Paste JSON directly from an API response, a file, or a database export. Or click 'Upload .json file' to load a file from your computer." },
    { "@type": "HowToStep", name: "Click Convert", text: "The tool validates the JSON, unions all keys across all objects, flattens nested objects using dot notation, and generates a CSV string in milliseconds." },
    { "@type": "HowToStep", name: "Download or copy your CSV", text: "Click Download to save a .csv file, or Copy CSV to paste directly into Excel, Google Sheets, or another tool. The download is always the full output — the preview is truncated for display." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert JSON to CSV?", acceptedAnswer: { "@type": "Answer", text: "Paste your JSON directly into the text area or upload a .json file. The tool automatically detects if it's an array of objects, a single object, or a nested structure, flattens it, and produces a clean CSV you can download or copy." } },
    { "@type": "Question", name: "How does it handle nested JSON?", acceptedAnswer: { "@type": "Answer", text: "Nested objects are flattened using dot notation. For example, {\"address\": {\"city\": \"London\"}} becomes a column named 'address.city'. Arrays within objects are converted to their string representation." } },
    { "@type": "Question", name: "What if my JSON has inconsistent keys?", acceptedAnswer: { "@type": "Answer", text: "No problem. The tool unions all unique keys across all objects and uses them as headers. Missing values for a key in any particular row are left empty." } },
    { "@type": "Question", name: "Is there a size limit?", acceptedAnswer: { "@type": "Answer", text: "No. The tool runs entirely in your browser. Paste as much JSON as you like — it handles millions of rows, though very large inputs may take a moment." } },
    { "@type": "Question", name: "Can I convert a JSON API response to CSV?", acceptedAnswer: { "@type": "Answer", text: "Yes — this is one of the most common use cases. Copy the JSON response from your browser's network tab or an API client like Postman, paste it here, and download the CSV." } },
  ],
};

export default function JsonToCsvPage() {
  return (
    <>
      <Script id="json-csv-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="json-csv-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="json-csv-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <JsonToCsvClient />
    </>
  );
}
