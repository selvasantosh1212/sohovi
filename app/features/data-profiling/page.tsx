import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";
const PAGE_URL = `${SITE_URL}/features/data-profiling`;

export const metadata: Metadata = {
  title: "Data Profiling Tool for CSV & Excel",
  description:
    "Automatically profile every column in your CSV or Excel file — null rates, type inference, distributions, outliers, and PII flags — computed entirely in your browser.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Data Profiling Tool for CSV & Excel | Sohovi",
    description:
      "See null rates, type distributions, outliers, and PII flags for every column, computed client-side in seconds.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Profiling Tool for CSV & Excel | Sohovi",
    description:
      "See null rates, type distributions, outliers, and PII flags for every column, computed client-side in seconds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Data Profiling", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#page`,
      name: "Data Profiling Tool for CSV & Excel",
      url: PAGE_URL,
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Sohovi",
        url: SITE_URL,
        email: "hello@sohovi.com",
      },
    },
  ],
};

export default function DataProfilingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">
          <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
            <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "#5B5B63" }}>
              <Link href="/" style={{ color: "#5B5B63", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#0A0A0A" }}>Data Profiling</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Data profiling for CSV and Excel — see every column before you trust it.
            </h1>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
              <p>
                Before you can score, clean, or build rules against a dataset, you need to understand
                what&apos;s actually in it. Sohovi&apos;s data profiling tool reads a CSV or Excel file
                and, in seconds, tells you exactly what each column contains — without you writing a
                single formula or query.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                What gets profiled
              </h2>
              <p>
                Drop in a file and Sohovi computes, per column: null rate and non-null count, distinct
                value count and cardinality, inferred data type (email, phone, date, numeric ID, free
                text), the most frequent values, and statistical outliers using a ±3σ threshold on
                numeric columns. Wide files with 100,000+ rows are automatically sampled for the
                interactive profiling view, while your DQ rules still run against every row.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Built-in PII detection
              </h2>
              <p>
                Every profiling pass also flags columns that look like they contain personal data —
                emails, phone numbers, SSNs, credit card numbers, street addresses, or API keys and
                secrets — using pattern matching combined with entropy analysis for opaque tokens. You
                see this before you export, share, or build a rule against the column, so sensitive data
                never accidentally ends up in a report you send outside your team. Read more on our{" "}
                <Link href="/features/pii-detection" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  PII detection page
                </Link>.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Runs entirely in your browser
              </h2>
              <p>
                Profiling happens inside a Web Worker in your browser tab — your file is never uploaded
                to a server. That means profiling a spreadsheet full of customer records doesn&apos;t
                create a new copy of sensitive data anywhere outside your machine. Only the aggregated
                profiling summary (not your raw rows) is ever saved, so you can come back and compare
                profiles across runs. Full details on how this is engineered are on our{" "}
                <Link href="/security" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  security architecture page
                </Link>.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                From profile to rule to score
              </h2>
              <p>
                Profiling is the first step in Sohovi&apos;s workflow: once your columns are profiled,
                Sohovi&apos;s ML rule suggester proposes quality rules based on the inferred type of
                each column, and every rule you accept feeds into a full{" "}
                <Link href="/features/data-quality-scoring" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  10-dimension DQ score
                </Link>{" "}
                you can track over time.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0A0A0A" }}
              >
                Profile your first file free
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Try a free CSV tool
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
