import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { PrivacySection } from "@/components/landing/PrivacySection";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";

export const metadata: Metadata = {
  title: "Data Security & Privacy Architecture",
  description:
    "How Sohovi keeps your data private: zero server upload, browser-only processing via Web Workers, no raw row storage, and GDPR-friendly by design.",
  alternates: { canonical: `${SITE_URL}/security` },
  openGraph: {
    title: "Sohovi Security & Privacy Architecture",
    description:
      "Zero server upload. All profiling, scoring, and rule evaluation runs client-side in your browser. Here's exactly how it works.",
    url: `${SITE_URL}/security`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sohovi Security & Privacy Architecture",
    description:
      "Zero server upload. All profiling, scoring, and rule evaluation runs client-side in your browser. Here's exactly how it works.",
  },
};

const securityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/security#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Security", item: `${SITE_URL}/security` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/security#page`,
      name: "Sohovi Security & Privacy Architecture",
      url: `${SITE_URL}/security`,
      description:
        "How Sohovi keeps your data private: zero server upload, browser-only processing via Web Workers, no raw row storage.",
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

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securityJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">
          <section className="mx-auto max-w-3xl px-6 pt-24 pb-4">
            <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "#5B5B63" }}>
              <Link href="/" style={{ color: "#5B5B63", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#0A0A0A" }}>Security</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Data security architecture: your rows never leave your browser.
            </h1>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
              <p>
                Most data quality and profiling tools ask you to upload a file to their servers before
                they can analyze it. That upload is a security and compliance liability the moment your
                CSV or Excel file contains customer emails, phone numbers, SSNs, or any other sensitive
                column. Sohovi is built specifically to remove that liability: there is no upload step
                for your raw data, ever.
              </p>
              <p>
                Instead, when you drop a file into Sohovi, it&apos;s read locally using the browser&apos;s
                native File API and processed inside a sandboxed <strong style={{ color: "#0A0A0A" }}>Web Worker</strong> —
                an isolated JavaScript thread that has no ability to make outbound network requests with
                your file contents. Profiling, the 10-dimension DQ scoring engine, rule evaluation, and
                PII detection all run in that worker. The only things ever written to our database are
                aggregated DQ scores, rule definitions, and run metadata — never a single raw row.
              </p>
              <p>
                This isn&apos;t a policy promise, it&apos;s a verifiable architecture. Open your browser&apos;s
                DevTools, go to the Network tab, and run a profiling pass on a real file — you&apos;ll see
                zero outbound requests carrying your data. See our{" "}
                <Link href="/pricing" style={{ color: "#0A0A0A", textDecoration: "underline" }}>pricing page</Link>{" "}
                for what&apos;s included at each plan, or read about how{" "}
                <Link href="/features/pii-detection" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  PII detection
                </Link>{" "}
                flags sensitive columns before you ever share results with a teammate.
              </p>
            </div>
          </section>

          <PrivacySection />

          <section className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="font-bold mb-4" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
              Compliance and regulated data
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "#5B5B63" }}>
              Because raw data never transits our servers, Sohovi does not act as a data processor for
              your customer or patient records under GDPR, HIPAA, or similar frameworks — there is
              nothing on our infrastructure to process, store, or breach. Teams in healthcare, finance,
              and HR typically clear internal security review quickly because the usual questions
              (where is data stored, who has access, what happens on a breach) have a simple answer:
              nowhere, no one, and nothing, respectively.
            </p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#5B5B63" }}>
              Have a specific security questionnaire or need a written data processing statement for
              procurement? Reach out at{" "}
              <a href="mailto:hello@sohovi.com" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                hello@sohovi.com
              </a>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0A0A0A" }}
              >
                Try Sohovi free
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Read the privacy policy
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
