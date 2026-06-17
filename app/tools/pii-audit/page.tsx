import type { Metadata } from "next";
import Script from "next/script";
import { PiiAuditClient } from "./PiiAuditClient";

export const metadata: Metadata = {
  title: "Free PII Scanner — Check Any File for Personal Data Before Sending",
  description:
    "Drag in a CSV or Excel file and instantly see every email, phone number, SSN, address, and API key it contains. 100% in your browser — nothing uploaded.",
  keywords: [
    "pii detector",
    "pii scanner online",
    "find personal data in file",
    "check csv for personal information",
    "detect ssn in excel",
    "scan file for api keys",
    "redact emails from csv online",
    "find pii in spreadsheet",
  ],
  openGraph: {
    title: "Free PII Scanner — Check Any File for Personal Data",
    description: "See every email, phone, SSN, address, and API key in your file before you send it. 100% browser-based.",
  },
  alternates: { canonical: "https://sohovi.com/tools/pii-audit" },
  twitter: {
    card: "summary_large_image",
    title: "Free PII Scanner — Check Any File for Personal Data",
    description: "See every email, phone, SSN, address, and API key in your file before you send it. 100% browser-based.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free PII Scanner",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Scan CSV and Excel files for personal data (PII) and secrets before sending. Detects emails, phones, SSNs, credit cards, addresses, API keys, AWS keys, and JWTs. Runs entirely in your browser.",
  url: "https://sohovi.com/tools/pii-audit",
  datePublished: "2026-06-17",
  dateModified: "2026-06-17",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to check a file for personal data (PII) before sending it",
  step: [
    { "@type": "HowToStep", name: "Upload your file", text: "Drag and drop a CSV or Excel file onto the tool. Nothing is uploaded — the file is read entirely in your browser." },
    { "@type": "HowToStep", name: "Review the risk summary", text: "See a column-by-column breakdown of PII types found: emails, phone numbers, SSNs, addresses, secrets, and more." },
    { "@type": "HowToStep", name: "Download a redacted copy", text: "Click 'Download redacted copy' to get a version with all flagged cells replaced with bullet characters, safe to share." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is my file uploaded to a server?",
      acceptedAnswer: { "@type": "Answer", text: "No. The entire scan runs in your browser using JavaScript. Your file never leaves your device — not even temporarily. Open DevTools → Network tab to verify: you'll see zero file-data requests." },
    },
    {
      "@type": "Question",
      name: "What types of PII does this detect?",
      acceptedAnswer: { "@type": "Answer", text: "Emails, phone numbers, US Social Security Numbers (SSNs), credit card numbers, street addresses, API keys, AWS access keys, JSON Web Tokens (JWTs), and high-entropy secret tokens." },
    },
    {
      "@type": "Question",
      name: "What does 'redacted copy' mean?",
      acceptedAnswer: { "@type": "Answer", text: "Every cell in a flagged column is replaced with bullet characters (••••••••). The structure of your file is preserved — column names, unflagged columns, and row count stay the same." },
    },
    {
      "@type": "Question",
      name: "Does it scan every row?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — every cell in every row is scanned. The counts shown reflect the full file, not a sample." },
    },
  ],
};

export default function PiiAuditPage() {
  return (
    <>
      <Script id="pii-audit-tool-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="pii-audit-howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="pii-audit-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PiiAuditClient />
    </>
  );
}
