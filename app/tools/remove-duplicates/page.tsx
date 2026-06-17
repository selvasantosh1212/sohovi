import type { Metadata } from "next";
import Script from "next/script";
import { RemoveDuplicatesClient } from "./RemoveDuplicatesClient";

export const metadata: Metadata = {
  title: "Free Duplicate Row Remover for CSV — No Signup, No Limits",
  description:
    "Upload your CSV and instantly remove duplicate rows — exact match or by selected columns. Free, browser-based, your data never leaves your device.",
  keywords: [
    "remove duplicates csv",
    "deduplicate csv online",
    "find duplicate rows csv",
    "csv duplicate remover free",
    "remove duplicate rows excel",
    "unique rows csv",
    "excel deduplication",
    "csv deduplication tool",
    "normalize csv data",
  ],
  openGraph: {
    title: "Free Duplicate Row Remover for CSV Files",
    description: "Remove exact duplicates or column-subset duplicates from any CSV. 100% browser-based — nothing uploaded.",
  },
  alternates: { canonical: "https://sohovi.com/tools/remove-duplicates" },
  twitter: { card: "summary_large_image", title: "Free Duplicate Row Remover for CSV Files", description: "Remove exact duplicates or column-subset duplicates from any CSV. 100% browser-based — nothing uploaded." },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV Duplicate Row Remover",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Remove duplicate rows from CSV files instantly in your browser. Supports exact-match and column-subset deduplication. No signup required.",
  url: "https://sohovi.com/tools/remove-duplicates",
  datePublished: "2026-05-31",
  dateModified: "2026-06-17",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to remove duplicate rows from a CSV file",
  step: [
    { "@type": "HowToStep", name: "Upload your CSV file", text: "Drop your CSV file into the upload zone. The tool reads it entirely in your browser — nothing is sent to any server." },
    { "@type": "HowToStep", name: "Choose your deduplication mode", text: "Select 'All columns' to remove exact full-row duplicates, or choose specific columns (like email or order ID) to deduplicate by those fields only." },
    { "@type": "HowToStep", name: "Download your clean file", text: "Click Remove duplicates to process your file. Review the stats — rows removed, unique rows kept — then download the clean CSV." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the duplicate row remover work?", acceptedAnswer: { "@type": "Answer", text: "Upload your CSV file and the tool compares each row against all previous rows. You can match on all columns (exact duplicate) or select specific columns — useful when only certain fields define uniqueness, like an email or order ID." } },
    { "@type": "Question", name: "Is my data sent to a server?", acceptedAnswer: { "@type": "Answer", text: "No. Everything runs in your browser using JavaScript. Your file is never uploaded — not even temporarily. Close the tab and all data is gone." } },
    { "@type": "Question", name: "Is there a row limit?", acceptedAnswer: { "@type": "Answer", text: "No. The tool handles files with tens of thousands of rows. Very large files may take a few seconds in the browser." } },
    { "@type": "Question", name: "What's the difference between 'all columns' and 'selected columns' mode?", acceptedAnswer: { "@type": "Answer", text: "All-columns mode removes rows where every cell is identical — true duplicates. Selected-columns mode removes rows where the chosen fields match, even if other columns differ. Use this to deduplicate by customer ID or email while keeping the most recent record." } },
    { "@type": "Question", name: "Does it keep the first or last duplicate?", acceptedAnswer: { "@type": "Answer", text: "It keeps the first occurrence of each duplicate group and removes subsequent ones. The order of your original file is preserved." } },
  ],
};

export default function RemoveDuplicatesPage() {
  return (
    <>
      <Script
        id="remove-dup-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <Script id="remove-dup-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="remove-dup-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <RemoveDuplicatesClient />
    </>
  );
}
