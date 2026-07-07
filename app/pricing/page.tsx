import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";

export const metadata: Metadata = {
  title: "Pricing — Data Quality Tool Plans from Free to Business",
  description:
    "Sohovi pricing: start free with 5 data assets and unlimited profiling runs. Upgrade to Pro ($29/mo) or Business ($59/mo) for AI rule suggestions, trend charts, and team collaboration.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: "Sohovi Pricing — Free, Pro, and Business Plans",
    description:
      "Simple, transparent pricing for data profiling and DQ scoring. Free forever for individuals; Pro and Business plans for teams.",
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sohovi Pricing — Free, Pro, and Business Plans",
    description:
      "Simple, transparent pricing for data profiling and DQ scoring. Free forever for individuals; Pro and Business plans for teams.",
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/pricing#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/pricing#app`,
      name: "Sohovi",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "5 data assets, unlimited profiling, 5 DQ rules per asset" },
        { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD", billingIncrement: "month", description: "Unlimited assets, AI DQ rule suggestions, PDF reports" },
        { "@type": "Offer", name: "Business", price: "59", priceCurrency: "USD", billingIncrement: "month", description: "Team collaboration, business units, cross-column validations, priority support" },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">
          <section className="mx-auto max-w-3xl px-6 pt-24 pb-4">
            <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "#5B5B63" }}>
              <Link href="/" style={{ color: "#5B5B63", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#0A0A0A" }}>Pricing</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Data quality tool pricing — free to start, simple to scale.
            </h1>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "#5B5B63" }}>
              <p>
                Sohovi is priced for the people who actually clean and validate data day to day —
                freelancers, analysts, and small teams — not enterprise procurement departments.
                There&apos;s no demo call, no seat minimums, and no annual contract required to get
                started.
              </p>
              <p>
                Every plan, including Free, includes full <strong style={{ color: "#0A0A0A" }}>client-side data profiling</strong>:
                your CSV and Excel files are read and scored entirely inside your browser, so upgrading
                plans changes your feature limits, never your privacy guarantees. See exactly how that
                works on our{" "}
                <Link href="/security" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                  privacy architecture page
                </Link>.
              </p>
              <p>
                <strong style={{ color: "#0A0A0A" }}>Free</strong> covers 5 data assets, unlimited
                profiling runs, and 5 DQ rules per asset — enough for most individuals validating a
                handful of recurring datasets. <strong style={{ color: "#0A0A0A" }}>Pro</strong> ($29/mo)
                unlocks unlimited assets and rules, the full 10-dimension quality score, AI-suggested
                rules, historical trend charts, and PII detection. <strong style={{ color: "#0A0A0A" }}>Business</strong> ($59/mo)
                adds multi-catalog organization, cross-column validations, a rule-testing sandbox, and
                team collaboration for data teams managing more than one business unit — with a 7-day
                free trial and no credit card required.
              </p>
            </div>
          </section>

          <PricingSection />

          <section className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="font-bold mb-4" style={{ fontSize: "24px", letterSpacing: "-0.025em", color: "#0A0A0A" }}>
              Which plan is right for me?
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "#5B5B63" }}>
              If you&apos;re checking data quality on your own — one CSV export at a time — start on
              Free. If you&apos;re running the same checks every week and want to see whether quality
              is trending up or down, Pro pays for itself the first time it catches a schema change
              before it breaks a downstream report. If you manage data across multiple teams or
              business units, Business gives you the organizational structure — catalogs, ownership
              fields, and lineage metadata — to keep everyone looking at the same source of truth.
            </p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#5B5B63" }}>
              Explore what each plan covers in more depth on our feature pages for{" "}
              <Link href="/features/data-profiling" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                data profiling
              </Link>,{" "}
              <Link href="/features/data-quality-scoring" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                data quality scoring
              </Link>, and{" "}
              <Link href="/features/pii-detection" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                PII detection
              </Link>
              , or try one of our{" "}
              <Link href="/tools" style={{ color: "#0A0A0A", textDecoration: "underline" }}>
                free browser-based CSV tools
              </Link>{" "}
              — no account required.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0A0A0A" }}
              >
                Start for free
              </Link>
              <Link
                href="/#faq"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Read the FAQ
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
