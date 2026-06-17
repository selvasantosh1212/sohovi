import type { Metadata } from "next";
import Script from "next/script";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Two CSV Files Online — Free Spreadsheet Diff Tool",
  description:
    "Drop two CSV or Excel files and instantly see what changed: added rows, removed rows, and modified cells. Match by any key column. Free, browser-based, nothing uploaded.",
  keywords: [
    "compare two csv files",
    "compare two excel files",
    "spreadsheet diff",
    "reconcile two spreadsheets",
    "find rows in one csv but not another",
    "highlight differences between two csv files",
    "match records between two spreadsheets",
  ],
  openGraph: {
    title: "Compare Two CSV Files — Free Online Diff Tool",
    description: "See added, removed, and changed rows between two spreadsheets. Pick your match key. 100% browser-based.",
  },
  alternates: { canonical: "https://sohovi.com/tools/compare" },
  twitter: {
    card: "summary_large_image",
    title: "Compare Two CSV Files — Free Online Diff Tool",
    description: "See added, removed, and changed rows between two spreadsheets. Pick your match key. 100% browser-based.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Two-File CSV Reconciler",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Compare two CSV or Excel files and see exactly what changed. Upload File A and File B, pick a match key column, and get four result buckets: only in A, only in B, changed rows, unchanged rows. Export each bucket as CSV.",
  url: "https://sohovi.com/tools/compare",
  datePublished: "2026-06-17",
  dateModified: "2026-06-17",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to compare two CSV files for differences",
  step: [
    { "@type": "HowToStep", name: "Upload both files", text: "Drop File A (your baseline) and File B (the updated version) into the two upload zones." },
    { "@type": "HowToStep", name: "Pick your match key", text: "Select the column(s) that uniquely identify each row — such as an ID, email, or order number. The tool auto-suggests likely keys." },
    { "@type": "HowToStep", name: "Review and export", text: "See rows only in A (removed), only in B (added), changed (same key, different values), and unchanged. Export any bucket as CSV." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the file comparison work?",
      acceptedAnswer: { "@type": "Answer", text: "The tool performs a keyed join on your chosen columns. Rows where the key exists in both files are compared cell by cell to detect changes. Rows that exist in only one file are reported as added or removed." },
    },
    {
      "@type": "Question",
      name: "Is my data uploaded to a server?",
      acceptedAnswer: { "@type": "Answer", text: "No. Both files are read and compared entirely in your browser. Nothing is sent to any server." },
    },
    {
      "@type": "Question",
      name: "Do the two files need to have the same columns?",
      acceptedAnswer: { "@type": "Answer", text: "No. The tool builds a merged column set from both files. Columns that exist in only one file are included in the diff results with blank values for the other file." },
    },
    {
      "@type": "Question",
      name: "What is 'fuzzy matching' and why is it not in the free version?",
      acceptedAnswer: { "@type": "Answer", text: "Fuzzy matching tolerates small variations in key values — for example, matching 'Bob Smith' with 'Robert Smith', or 'Inc.' with 'Inc'. This is a more complex operation and is available as a paid Sohovi feature." },
    },
  ],
};

export default function ComparePage() {
  return (
    <>
      <Script id="compare-tool-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="compare-howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="compare-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CompareClient />
    </>
  );
}
