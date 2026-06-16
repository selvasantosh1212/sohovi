import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";

export const metadata: Metadata = {
  title: "Terms of Service — Sohovi",
  description:
    "Sohovi's Terms of Service. Read our terms covering subscriptions, acceptable use, and your rights as a Sohovi user.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: "Terms of Service — Sohovi",
    description: "Sohovi's Terms of Service covering subscriptions, acceptable use, and your rights.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — Sohovi",
    description: "Sohovi's Terms of Service covering subscriptions, acceptable use, and your rights.",
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/terms#page`,
  url: `${SITE_URL}/terms`,
  name: "Terms of Service — Sohovi",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Sohovi",
    url: SITE_URL,
    email: "hello@sohovi.com",
  },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">
          <section className="mx-auto max-w-2xl px-6 py-24">
            <nav className="flex items-center gap-2 text-sm mb-12" style={{ color: "#5B5B63" }}>
              <Link href="/" style={{ color: "#5B5B63", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#0A0A0A" }}>Terms of Service</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-4"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Terms of Service
            </h1>
            <p className="mb-10 text-sm" style={{ color: "#5B5B63" }}>
              Effective date: 16 June 2026
            </p>

            <div className="space-y-8 text-base leading-relaxed" style={{ color: "#5B5B63" }}>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>1. Acceptance</h2>
                <p>
                  By creating an account or using Sohovi (&ldquo;Service&rdquo;), you agree to these
                  Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service.
                  These Terms form a binding agreement between you and Sohovi, operated by
                  Selvaganapathy Pari (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>2. The Service</h2>
                <p>
                  Sohovi is a browser-based data quality platform. All file and spreadsheet data
                  is processed locally in your browser — raw data is never transmitted to our
                  servers. We reserve the right to modify, suspend, or discontinue any part of the
                  Service with reasonable notice.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>3. Accounts</h2>
                <p>
                  You must provide accurate information when creating an account. You are
                  responsible for maintaining the security of your credentials. Notify us
                  immediately at{" "}
                  <a href="mailto:hello@sohovi.com" className="underline" style={{ color: "#0A0A0A" }}>
                    hello@sohovi.com
                  </a>{" "}
                  if you suspect unauthorised access.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>4. Subscriptions and billing</h2>
                <p>
                  Sohovi offers a free tier and paid plans (Pro, Business). Paid plans are billed
                  monthly or annually via Dodo Payments. Prices are shown in USD and may be subject
                  to local taxes.
                </p>
                <p>
                  <strong style={{ color: "#0A0A0A" }}>Cancellation</strong> — You may cancel your
                  subscription at any time from the Billing page in the dashboard. Your plan remains
                  active until the end of the current billing period; we do not issue pro-rated refunds
                  for partial periods.
                </p>
                <p>
                  <strong style={{ color: "#0A0A0A" }}>Failed payments</strong> — If a payment fails,
                  we will retry it. After repeated failures your account may be downgraded to the free
                  tier.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>5. Acceptable use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
                  <li>Attempt to reverse-engineer, decompile, or extract the source code of the Service</li>
                  <li>Use automated means (bots, scrapers) to access the Service in a way that places unreasonable load on our infrastructure</li>
                  <li>Upload content that infringes third-party intellectual property rights</li>
                  <li>Share your account credentials with third parties</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>6. Your data and content</h2>
                <p>
                  You retain all rights to the data and files you bring into Sohovi. Because raw
                  data never leaves your browser, we have no access to it and make no claim over it.
                  The metadata we store (scores, rules, timestamps) can be exported or deleted on
                  request.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>7. Intellectual property</h2>
                <p>
                  The Sohovi name, logo, and software are owned by us and protected by intellectual
                  property law. Nothing in these Terms grants you a right to use our trademarks or
                  branding.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>8. Disclaimer of warranties</h2>
                <p>
                  The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
                  warranties of any kind, express or implied, including merchantability, fitness for a
                  particular purpose, or non-infringement. We do not warrant that the Service will be
                  uninterrupted, error-free, or free of harmful components.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>9. Limitation of liability</h2>
                <p>
                  To the maximum extent permitted by law, Sohovi&apos;s total liability to you for any
                  claim arising out of or relating to these Terms or the Service shall not exceed the
                  amount you paid us in the 12 months preceding the claim. We are not liable for
                  indirect, incidental, consequential, or punitive damages.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>10. Governing law</h2>
                <p>
                  These Terms are governed by the laws of India. Any disputes shall be subject to
                  the exclusive jurisdiction of the courts located in Tamil Nadu, India.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>11. Changes to these Terms</h2>
                <p>
                  We may update these Terms from time to time. We will notify you of material changes
                  via email or an in-app notice at least 14 days before they take effect. Continued
                  use of the Service after the effective date constitutes acceptance.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>12. Contact</h2>
                <p>
                  Questions about these Terms? Email us at{" "}
                  <a href="mailto:hello@sohovi.com" className="underline" style={{ color: "#0A0A0A" }}>
                    hello@sohovi.com
                  </a>.
                </p>
              </div>

            </div>

            <div className="mt-14 flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                About Sohovi
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
