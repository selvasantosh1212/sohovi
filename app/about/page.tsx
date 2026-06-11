import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";

export const metadata: Metadata = {
  title: "About Sohovi — Privacy-First Data Quality",
  description:
    "Learn about Sohovi: who built it, why we built it, and how our privacy-first approach keeps your data in your browser where it belongs.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Sohovi — Privacy-First Data Quality",
    description:
      "Learn about Sohovi: who built it, why we built it, and how our privacy-first approach keeps your data in your browser where it belongs.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sohovi — Privacy-First Data Quality",
    description:
      "Learn about Sohovi: who built it, why we built it, and how our privacy-first approach keeps your data in your browser where it belongs.",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#page`,
  url: `${SITE_URL}/about`,
  name: "About Sohovi",
  description:
    "Sohovi is a privacy-first data quality platform built for data analysts and small teams. All data processing happens entirely in your browser.",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Sohovi",
    url: SITE_URL,
    email: "hello@sohovi.com",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/sohovi.svg` },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">
          <section className="mx-auto max-w-2xl px-6 py-24">
            <nav className="flex items-center gap-2 text-sm mb-12" style={{ color: "#8A8A90" }}>
              <Link href="/" style={{ color: "#8A8A90", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#0A0A0A" }}>About</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-8"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Built for teams who can&apos;t afford to trust bad data.
            </h1>

            <div className="space-y-6 text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
              <p>
                Sohovi is a{" "}
                <strong style={{ color: "#0A0A0A" }}>privacy-first data quality tool</strong>{" "}
                built for data analysts, engineers, and small business teams who need to understand
                and improve the quality of their data — without sending it to third-party servers.
              </p>

              <p>
                Traditional enterprise DQ platforms take months to implement, cost a fortune, and
                still require your data to travel to someone else&apos;s infrastructure. We built
                Sohovi because we were frustrated by that trade-off.
              </p>

              <h2
                className="font-bold pt-4"
                style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}
              >
                How it works
              </h2>

              <p>
                When you drop a CSV or Excel file into Sohovi, everything — profiling, scoring,
                rule evaluation, PII detection — runs inside a{" "}
                <strong style={{ color: "#0A0A0A" }}>sandboxed Web Worker</strong> in your browser.
                No file bytes ever leave your device. The only data we store are your DQ scores,
                rule configurations, and run metadata — never your actual rows.
              </p>

              <p>
                You can verify this yourself: open DevTools → Network tab, then drop a file in
                Sohovi. You&apos;ll see zero outbound requests containing your file data.
              </p>

              <h2
                className="font-bold pt-4"
                style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}
              >
                Our approach to data quality
              </h2>

              <p>
                Sohovi scores data across{" "}
                <strong style={{ color: "#0A0A0A" }}>10 ISO-standard quality dimensions</strong>:
                completeness, accuracy, consistency, validity, uniqueness, integrity, timeliness,
                currency, conformity, and precision. Every score uses a transparent formula — no
                black-box algorithms, no proprietary weighting.
              </p>

              <p>
                We believe data quality tooling should be understandable. If your completeness
                score drops, Sohovi tells you exactly which columns failed and why.
              </p>

              <h2
                className="font-bold pt-4"
                style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}
              >
                Contact
              </h2>

              <p>
                Questions, feedback, or partnership enquiries — reach us at{" "}
                <a
                  href="mailto:hello@sohovi.com"
                  className="underline hover:no-underline transition-all"
                  style={{ color: "#0A0A0A" }}
                >
                  hello@sohovi.com
                </a>
                .
              </p>
            </div>

            <div className="mt-14 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0A0A0A" }}
              >
                Try Sohovi free
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Read the blog
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
