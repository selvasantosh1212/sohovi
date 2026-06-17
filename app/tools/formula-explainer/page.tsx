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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to understand an Excel formula in plain English",
  step: [
    { "@type": "HowToStep", name: "Paste your formula", text: "Copy any Excel or Google Sheets formula from your spreadsheet and paste it into the text box above. Include the leading = sign." },
    { "@type": "HowToStep", name: "Click Explain", text: "The tool identifies the function name, retrieves its full documentation, and shows you what it does, what each argument means, a worked example, and pro tips." },
    { "@type": "HowToStep", name: "Understand and apply", text: "Read the plain-English explanation, check the argument breakdown, and use the example to understand how to adapt the formula to your own data." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What Excel formulas does this tool explain?", acceptedAnswer: { "@type": "Answer", text: "The tool covers 40+ common Excel and Google Sheets functions including VLOOKUP, XLOOKUP, INDEX/MATCH, IF, IFS, SUMIF, SUMIFS, COUNTIF, COUNTIFS, IFERROR, text functions (LEFT, RIGHT, MID, TRIM, SUBSTITUTE), date functions (TODAY, DATEDIF, YEAR, MONTH), and dynamic array functions (UNIQUE, FILTER)." } },
    { "@type": "Question", name: "Does it work with Google Sheets formulas?", acceptedAnswer: { "@type": "Answer", text: "Yes. Most Excel formulas are identical in Google Sheets. XLOOKUP, UNIQUE, and FILTER are available in both Excel 365 and Google Sheets. A few functions have different names but the behavior is the same." } },
    { "@type": "Question", name: "Can it explain nested formulas?", acceptedAnswer: { "@type": "Answer", text: "The tool identifies the outermost function and explains it in detail. For complex nested formulas like =IFERROR(INDEX(C:C, MATCH(A2, B:B, 0)), \"Not found\"), it explains IFERROR and notes the nesting pattern. Understanding the outer function is usually the key to understanding the whole formula." } },
    { "@type": "Question", name: "What if my formula isn't recognized?", acceptedAnswer: { "@type": "Answer", text: "The tool covers the most commonly used functions. If your formula isn't in the library, try pasting just the function name and we'll add it to the list if there's demand." } },
    { "@type": "Question", name: "Is VLOOKUP or XLOOKUP better?", acceptedAnswer: { "@type": "Answer", text: "XLOOKUP is strictly better: it can look left (VLOOKUP can't), handles not-found natively, doesn't break when you insert columns, and can return multiple columns. If you're on Excel 365 or Google Sheets, use XLOOKUP. If you're on an older version of Excel, VLOOKUP is still the standard." } },
  ],
};

export default function FormulaExplainerPage() {
  return (
    <>
      <Script id="formula-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="formula-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="formula-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FormulaExplainerClient />
    </>
  );
}
