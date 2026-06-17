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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to merge multiple CSV files into one",
  step: [
    { "@type": "HowToStep", name: "Upload your CSV files", text: "Click to add your files — you can upload up to 10 at once. Each file is read locally in your browser. Nothing is uploaded to a server." },
    { "@type": "HowToStep", name: "Review the file list", text: "Each uploaded file shows its row count and column count. Remove any file by clicking the trash icon. The tool warns you if schemas differ between files." },
    { "@type": "HowToStep", name: "Merge and download", text: "Click Merge to combine all files. Rows are stacked in upload order. Missing columns across files are filled with blank values. Download the merged CSV instantly." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I merge multiple CSV files into one?", acceptedAnswer: { "@type": "Answer", text: "Upload your CSV files using the tool (you can add up to 10). The Stack mode appends all rows into one file — it unions column headers from all files so no data is lost even if schemas differ. Missing values for columns that don't exist in a particular file are left blank." } },
    { "@type": "Question", name: "What happens if my CSV files have different columns?", acceptedAnswer: { "@type": "Answer", text: "In Stack mode, the tool unions all column headers across all files. Each row gets blank values for columns that didn't exist in its source file. This gives you a complete merged file with no data lost." } },
    { "@type": "Question", name: "Is there a file size or row count limit?", acceptedAnswer: { "@type": "Answer", text: "No. The tool runs entirely in your browser and can handle files with hundreds of thousands of rows. Very large files may take a few seconds to process." } },
    { "@type": "Question", name: "Are the rows from different files kept in order?", acceptedAnswer: { "@type": "Answer", text: "Yes. In Stack mode, rows from each file are appended in the order you uploaded the files. Rows within each file keep their original order." } },
    { "@type": "Question", name: "Can I merge Excel files too?", acceptedAnswer: { "@type": "Answer", text: "The tool currently accepts CSV files. To merge Excel files, first convert them to CSV using a tool like Excel or Google Sheets, then upload here." } },
  ],
};

export default function CsvMergerPage() {
  return (
    <>
      <Script id="csv-merger-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="csv-merger-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="csv-merger-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CsvMergerClient />
    </>
  );
}
