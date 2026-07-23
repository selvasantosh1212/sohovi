import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";
const PAGE_URL = `${SITE_URL}/features/pii-detection`;

export const metadata: Metadata = {
  title: "PII Detection for CSV & Excel Files",
  description:
    "Automatically detect emails, phone numbers, SSNs, credit card numbers, addresses, and API keys in any CSV or Excel file — entirely in your browser, before you share it.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "PII Detection for CSV & Excel Files | Sohovi",
    description:
      "Find personal data and secrets in any spreadsheet before you send it — pattern matching plus entropy analysis, 100% browser-based.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PII Detection for CSV & Excel Files | Sohovi",
    description:
      "Find personal data and secrets in any spreadsheet before you send it — pattern matching plus entropy analysis, 100% browser-based.",
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
        { "@type": "ListItem", position: 2, name: "PII Detection", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#page`,
      name: "PII Detection for CSV & Excel Files",
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

export default function PiiDetectionPage() {
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
              <span style={{ color: "#0A0A0A" }}>PII Detection</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Find PII in any CSV or Excel file before you share it.
            </h1>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
              <p>
                Spreadsheets are one of the most common ways personal data accidentally leaks —
                an export meant for internal analysis gets emailed, uploaded to a shared drive, or
                pasted into a support ticket, and nobody double-checked which columns actually
                contained emails, phone numbers, or national ID numbers. Sohovi&apos;s PII detection
                scans every column of a file and tells you exactly what&apos;s sensitive, before you
                send it anywhere.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                What it detects
              </h2>
              <p>
                The detector combines pattern matching with statistical entropy analysis to catch both
                obvious and obscure sensitive data: email addresses, phone numbers, Social Security
                numbers, credit card numbers, street addresses, and secrets like API keys, AWS access
                keys, and JWTs. High-entropy tokens that don&apos;t match a known secret format — the
                kind of opaque string that&apos;s often an internal auth token — are flagged separately
                using Shannon entropy, so unusual-looking values don&apos;t slip through just because
                they don&apos;t match a regex.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Built into every profiling run
              </h2>
              <p>
                PII detection isn&apos;t a separate step you have to remember to run — it&apos;s part of
                Sohovi&apos;s{" "}
                <Link href="/features/data-profiling" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  data profiling
                </Link>{" "}
                pass on every upload, and it also powers our free, standalone{" "}
                <Link href="/tools/pii-audit" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  PII Audit tool
                </Link>{" "}
                for a quick one-off check with no account required. Either way, flagged columns show
                sample matches and counts so you can decide whether to redact, mask, or exclude them
                before exporting.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Nothing you scan ever leaves your browser
              </h2>
              <p>
                This is precisely the kind of feature where privacy architecture matters most — you
                shouldn&apos;t have to upload a file full of unredacted personal data to a third-party
                server just to find out it contains personal data. Sohovi&apos;s detection runs entirely
                client-side in a Web Worker; the file you&apos;re scanning for sensitive information never
                touches our infrastructure. Full details are on our{" "}
                <Link href="/security" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  security architecture page
                </Link>.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                For research and compliance teams
              </h2>
              <p>
                Teams preparing datasets for open access or third-party sharing can go further with our{" "}
                <Link href="/tools/de-identify" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  de-identification tool
                </Link>
                , which detects direct and quasi-identifiers, applies masking or generalization, and
                checks k-anonymity before export — all in the browser, with a methods log for your
                compliance records.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/tools/pii-audit"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0A0A0A" }}
              >
                Scan a file free
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Create an account
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
