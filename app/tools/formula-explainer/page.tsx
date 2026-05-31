import type { Metadata } from "next";
import Script from "next/script";
import { FormulaExplainerClient } from "./FormulaExplainerClient";

export const metadata: Metadata = {
  title: "Free Excel Formula Explainer — Understand Any Formula in Plain English",
  description:
    "Paste any Excel or Google Sheets formula and get a plain-English explanation instantly. Covers VLOOKUP, SUMIF, IF, INDEX/MATCH, and 50+ functions. Free, no signup.",
  keywords: [
    "explain excel formula",
    "excel formula explainer",
    "what does this excel formula do",
    "excel formula translator",
    "google sheets formula explainer",
    "understand excel formula",
  ],
  openGraph: {
    title: "Free Excel Formula Explainer — Plain English Formula Translator",
    description: "Paste any Excel or Google Sheets formula — get a clear plain-English explanation. Covers 50+ functions. Free, no signup.",
  },
  alternates: { canonical: "https://sohovi.com/tools/formula-explainer" },
  twitter: { card: "summary_large_image", title: "Free Excel Formula Explainer — Plain English Formula Translator", description: "Paste any Excel or Google Sheets formula — get a clear plain-English explanation. Covers 50+ functions. Free, no signup." },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free Excel Formula Explainer",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Paste any Excel or Google Sheets formula and get a plain-English explanation. Covers 50+ functions. 100% browser-based, no signup.",
  url: "https://sohovi.com/tools/formula-explainer",
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

export default function FormulaExplainerPage() {
  return (
    <>
      <Script id="formula-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <FormulaExplainerClient />
    </>
  );
}
