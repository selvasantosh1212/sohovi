import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ToolsGrid } from "./ToolsGrid";

export const metadata: Metadata = {
  title: "Free CSV & Data Tools — No Signup Required",
  description:
    "12 free browser-based tools for CSV conversion, deduplication, SQL generation, PII auditing, and more. Your data never leaves your browser. No signup, no limits.",
  openGraph: {
    title: "Free CSV & Data Tools — No Signup, No Limits | Sohovi",
    description:
      "Convert CSV to JSON, merge files, remove duplicates, generate SQL, and more — all free, in-browser, no signup.",
  },
  alternates: { canonical: "https://sohovi.com/tools" },
  keywords: ["free csv tools", "csv to json converter", "remove duplicate rows csv", "online data tools", "browser based csv tools", "csv to sql", "json to csv", "csv column picker", "pii scanner online", "check spreadsheet for personal data", "compare two csv files", "de-identify dataset"],
  twitter: { card: "summary_large_image", title: "Free CSV & Data Tools — No Signup Required | Sohovi", description: "12 free browser-based tools for CSV, JSON, SQL, PII auditing, de-identification, and more. In-browser, no signup, no limits." },
};

const appListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free CSV and Data Tools by Sohovi",
  description: "Browser-based free tools for CSV conversion, deduplication, SQL generation, and data wrangling.",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Pre-Send PII Audit", url: "https://sohovi.com/tools/pii-audit" },
    { "@type": "ListItem", position: 2, name: "Two-File Reconciler", url: "https://sohovi.com/tools/compare" },
    { "@type": "ListItem", position: 3, name: "Research Data De-Identifier", url: "https://sohovi.com/tools/de-identify" },
    { "@type": "ListItem", position: 4, name: "Duplicate Row Remover", url: "https://sohovi.com/tools/remove-duplicates" },
    { "@type": "ListItem", position: 5, name: "CSV to JSON Converter", url: "https://sohovi.com/tools/csv-to-json" },
    { "@type": "ListItem", position: 6, name: "JSON to CSV Converter", url: "https://sohovi.com/tools/json-to-csv" },
    { "@type": "ListItem", position: 7, name: "CSV Column Picker", url: "https://sohovi.com/tools/csv-columns" },
    { "@type": "ListItem", position: 8, name: "CSV to Markdown Table", url: "https://sohovi.com/tools/csv-to-markdown" },
    { "@type": "ListItem", position: 9, name: "CSV to SQL Generator", url: "https://sohovi.com/tools/csv-to-sql" },
    { "@type": "ListItem", position: 10, name: "CSV Merger", url: "https://sohovi.com/tools/csv-merger" },
    { "@type": "ListItem", position: 11, name: "Test Data Generator", url: "https://sohovi.com/tools/test-data-generator" },
    { "@type": "ListItem", position: 12, name: "Excel Formula Explainer", url: "https://sohovi.com/tools/formula-explainer" },
  ],
};

export default function ToolsHubPage() {
  return (
    <>
      <Script
        id="tools-hub-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appListSchema) }}
      />

      {/* Hero */}
      <section className="pt-16 pb-10 px-6" style={{ background: "var(--cream)" }}>
        <div className="mx-auto max-w-[760px] text-center">
          <div
            className="inline-block text-[12px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(0,201,167,0.1)", color: "#007A65", border: "1px solid rgba(0,201,167,0.2)" }}
          >
            Free tools — no signup required
          </div>
          <h1 className="text-[38px] sm:text-[48px] font-bold leading-tight mb-4" style={{ color: "var(--ink)" }}>
            Free CSV &amp; Data Tools
          </h1>
          <p className="text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            12 browser-based utilities for converting, cleaning, auditing, and wrangling data.
            <strong style={{ color: "var(--ink)" }}> Your files never leave your device.</strong> No signup. No limits.
          </p>
        </div>
      </section>

      {/* Tools grid (client component for hover interactivity) */}
      <section className="pb-20 px-6">
        <div className="mx-auto max-w-[1100px]">
          <ToolsGrid />
        </div>
      </section>

      {/* Related blog guides */}
      <section className="pb-10 px-6">
        <div className="mx-auto max-w-[760px]">
          <h2 className="text-[20px] font-bold mb-4" style={{ color: "var(--ink)" }}>
            Related guides
          </h2>
          <ul className="grid gap-3">
            {[
              { href: "/blog/how-to-check-spreadsheet-for-pii", label: "How to check a spreadsheet for PII before sending it" },
              { href: "/blog/how-to-compare-two-csv-files", label: "How to compare two CSV files and spot every change" },
              { href: "/blog/how-to-de-identify-research-data", label: "How to de-identify research data: masking, generalization, and k-anonymity" },
              { href: "/blog/what-is-data-uniqueness", label: "What is data uniqueness? (and how to find duplicates)" },
              { href: "/blog/what-is-data-cleansing", label: "What is data cleansing?" },
              { href: "/blog/what-is-data-validation", label: "What is data validation?" },
              { href: "/blog/what-is-data-profiling", label: "What is data profiling?" },
              { href: "/blog/what-is-data-normalization", label: "What is data normalization?" },
              { href: "/blog/what-is-etl", label: "What is an ETL pipeline?" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[15px] underline underline-offset-2"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Privacy badge */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-[760px]">
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--paper)", border: "1px solid var(--hair-strong)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,201,167,0.1)" }}
            >
              <svg className="w-6 h-6" style={{ color: "#00C9A7" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="text-[20px] font-bold mb-2" style={{ color: "var(--ink)" }}>
              100% private — your data stays in your browser
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              Every tool processes your files locally using Web APIs. Nothing is uploaded to any server.
              Close the tab and the data is gone. We built these tools to the same privacy standard as{" "}
              <Link href="/" className="underline underline-offset-2 font-medium" style={{ color: "var(--ink)" }}>
                Sohovi
              </Link>
              {" "}— our data quality platform.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
