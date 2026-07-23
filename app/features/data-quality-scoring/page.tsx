import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";
const PAGE_URL = `${SITE_URL}/features/data-quality-scoring`;

export const metadata: Metadata = {
  title: "Data Quality Score for CSV & Excel — 10 Dimensions",
  description:
    "Get a transparent 0–100 data quality score built from 10 ISO-standard dimensions — completeness, validity, uniqueness, accuracy, and more — with every failing row explained.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Data Quality Score for CSV & Excel — 10 Dimensions | Sohovi",
    description:
      "A transparent, explainable 0–100 quality score. No black-box weighting — see exactly which rule failed and why.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Quality Score for CSV & Excel — 10 Dimensions | Sohovi",
    description:
      "A transparent, explainable 0–100 quality score. No black-box weighting — see exactly which rule failed and why.",
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
        { "@type": "ListItem", position: 2, name: "Data Quality Scoring", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#page`,
      name: "Data Quality Score for CSV & Excel",
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

export default function DataQualityScoringPage() {
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
              <span style={{ color: "#0A0A0A" }}>Data Quality Scoring</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              A data quality score you can actually explain to your team.
            </h1>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
              <p>
                &ldquo;Our data quality is 82%&rdquo; means nothing if nobody can say why. Sohovi&apos;s
                scoring engine is built so every number — column score, dataset score, or catalog score
                — traces back to a specific rule, a specific formula, and a specific set of failing rows.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                10 ISO-standard dimensions
              </h2>
              <p>
                Every dataset is evaluated across ten dimensions: completeness, accuracy, consistency,
                validity, uniqueness, integrity, timeliness, currency, conformity, and precision. Each
                dimension has a plain formula — for example, completeness is the percentage of non-null
                values in a column, and validity is the percentage of values that match a defined rule
                (a regex, a range, a lookup list, or a cross-column check). There&apos;s no proprietary
                weighting hidden behind the number.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Column, dataset, and catalog level
              </h2>
              <p>
                Scores roll up from individual rules to a column score, from columns to a dataset score,
                and — on the Team plan — from datasets to a catalog-level score across an entire
                business unit. A score under 60 is flagged critical, 60–80 is a warning, 80–95 is good,
                and 95+ is excellent, so anyone on your team can read the color and understand the
                severity instantly.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Drill into any failure
              </h2>
              <p>
                Click into any dimension and see the exact rule that was applied, how many rows passed
                versus failed, and a preview of the failing records themselves. This transparency panel
                is what turns a quality score from a vanity metric into something you can act on —
                Sohovi tells you which rows to fix, not just that something&apos;s wrong.
              </p>

              <h2 className="font-bold pt-2" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
                Track quality over time
              </h2>
              <p>
                Every run is saved to your score history, so you can chart whether quality is improving
                or degrading across weeks or months, catch schema drift the moment a new or renamed
                column shows up, and set alert thresholds that notify you before a quality regression
                reaches production. Rules are suggested automatically based on your{" "}
                <Link href="/features/data-profiling" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  column profile
                </Link>{" "}
                — see how that works, or check what&apos;s included per plan on our{" "}
                <Link href="/pricing" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  pricing page
                </Link>.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0A0A0A" }}
              >
                Score your first dataset free
              </Link>
              <Link
                href="/blog/category/data-quality-dimensions"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Read the DQ dimensions guide
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
