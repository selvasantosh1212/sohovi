import type { Metadata } from "next";
import Script from "next/script";
import { DeIdentifyClient } from "./DeIdentifyClient";

export const metadata: Metadata = {
  title: "Free Research Data De-Identifier — Anonymize CSV Datasets In-Browser",
  description:
    "Detect direct and quasi-identifiers, mask or generalize them, check k-anonymity, and export a de-identified dataset with a methods log. 100% in your browser — raw data never uploaded.",
  keywords: [
    "de-identify data",
    "data anonymization tool",
    "anonymize csv online",
    "k-anonymity tool",
    "remove pii from dataset",
    "de-identify research data",
    "anonymize survey data",
    "de-identify health data hipaa safe harbor",
    "prepare research data for open access",
  ],
  openGraph: {
    title: "Free Research Data De-Identifier — Anonymize Datasets In-Browser",
    description: "Detect PII and quasi-identifiers, apply masking/generalization, check k-anonymity. Nothing uploaded.",
  },
  alternates: { canonical: "https://sohovi.com/tools/de-identify" },
  twitter: {
    card: "summary_large_image",
    title: "Free Research Data De-Identifier",
    description: "Detect PII and quasi-identifiers, apply masking/generalization, check k-anonymity. Nothing uploaded.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Research Data De-Identifier",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Upload a CSV or Excel dataset, auto-detect direct identifiers and quasi-identifiers, apply masking, suppression, pseudonymization, and generalization, check k-anonymity, and export a de-identified file with a methods log for IRB/appendix. Runs entirely in the browser.",
  url: "https://sohovi.com/tools/de-identify",
  datePublished: "2026-06-17",
  dateModified: "2026-06-17",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to de-identify a research dataset",
  step: [
    { "@type": "HowToStep", name: "Upload your dataset", text: "Drag in a CSV or Excel file. The tool classifies each column as a direct identifier, quasi-identifier, sensitive attribute, or safe." },
    { "@type": "HowToStep", name: "Review and configure transforms", text: "Override any auto-classification. Choose an action per column: suppress, mask, pseudonymize, generalize, or keep." },
    { "@type": "HowToStep", name: "Check k-anonymity", text: "Select your quasi-identifier columns and a target k. The tool shows the current k, which rows are at risk, and specific generalization suggestions." },
    { "@type": "HowToStep", name: "Export", text: "Download the de-identified file plus a methods log (suitable for IRB documentation or a data appendix) describing every transform applied." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is my data uploaded to a server?",
      acceptedAnswer: { "@type": "Answer", text: "No. Everything runs entirely in your browser. Your raw data never leaves your device — this is a hard requirement for human-subjects and PHI data. Open DevTools → Network to verify: zero file-data requests." },
    },
    {
      "@type": "Question",
      name: "What is k-anonymity?",
      acceptedAnswer: { "@type": "Answer", text: "k-anonymity is a privacy model. A dataset is k-anonymous if every row is indistinguishable from at least k-1 other rows based on its quasi-identifier values. For example, k=3 means no individual is uniquely re-identifiable from age + ZIP code + gender alone. k=5 is a common minimum threshold for research data sharing." },
    },
    {
      "@type": "Question",
      name: "What is the difference between a direct identifier and a quasi-identifier?",
      acceptedAnswer: { "@type": "Answer", text: "Direct identifiers (name, email, SSN, phone) identify a person on their own and must be removed or masked. Quasi-identifiers (age, ZIP, gender, ethnicity) can identify someone when combined — a 87-year-old female in a small ZIP code may be the only person matching that profile. k-anonymity addresses quasi-identifier combinations." },
    },
    {
      "@type": "Question",
      name: "What does 'pseudonymize' mean here?",
      acceptedAnswer: { "@type": "Answer", text: "Pseudonymization replaces each unique value with a stable fake ID (ID-000001, ID-000002, …) for the duration of this session. The same original value always gets the same ID within a file, so you can still link rows. The crosswalk (original → fake ID) is never exported unless you explicitly choose to." },
    },
  ],
};

export default function DeIdentifyPage() {
  return (
    <>
      <Script id="deidentify-tool-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="deidentify-howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="deidentify-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <DeIdentifyClient />
    </>
  );
}
