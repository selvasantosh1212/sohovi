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
  twitter: { card: "summary_large_image", title: "Free CSV to JSON Converter — No Signup, No Limits", description: "Convert any CSV to JSON instantly. Array of objects, arrays, or nested by key. 100% browser-based." },
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
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert a CSV file to JSON online",
  step: [
    { "@type": "HowToStep", name: "Upload your file", text: "Drop your CSV or Excel file into the tool. It's read directly in your browser — no server upload happens at any point." },
    { "@type": "HowToStep", name: "Choose your output format", text: "Array of objects (most common for APIs and databases), array of arrays (compact, used by charting libraries), or nested by first column (lookup tables and config files)." },
    { "@type": "HowToStep", name: "Copy or download your JSON", text: "Your JSON appears immediately. Copy it to clipboard or download it as a .json file. Large files are truncated in the preview but the download is always complete." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert a CSV file to JSON?", acceptedAnswer: { "@type": "Answer", text: "Upload your CSV file using the tool above. It reads the first row as headers and converts each subsequent row into a JSON object. You can choose between an array of objects (most common), an array of arrays (compact), or a nested object keyed by the first column." } },
    { "@type": "Question", name: "Is there a file size limit?", acceptedAnswer: { "@type": "Answer", text: "No. The tool runs entirely in your browser and handles files with hundreds of thousands of rows. Very large files may take a few seconds to process." } },
    { "@type": "Question", name: "Does it handle quoted fields and commas inside values?", acceptedAnswer: { "@type": "Answer", text: "Yes. The parser handles RFC 4180 CSV — quoted fields, escaped quotes, and commas inside quoted values are all supported correctly." } },
    { "@type": "Question", name: "What's the difference between the output formats?", acceptedAnswer: { "@type": "Answer", text: "Array of objects creates one JSON object per row — the most common format for APIs and databases. Array of arrays is compact and useful for charting libraries. Nested by first column creates an object keyed by the first column's values — useful for lookup tables." } },
    { "@type": "Question", name: "Can I convert Excel files too?", acceptedAnswer: { "@type": "Answer", text: "Yes. The tool also accepts .xlsx and .xls files — it reads the first sheet and converts it the same way as CSV." } },
  ],
};

export default function CsvToJsonPage() {
  return (
    <>
      <Script id="csv-json-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="csv-json-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="csv-json-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CsvToJsonClient />
    </>
  );
}
