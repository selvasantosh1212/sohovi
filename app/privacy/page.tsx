import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "@/components/landing/PublicNav";
import { Footer } from "@/components/landing/Footer";

const SITE_URL = "https://sohovi.com";

export const metadata: Metadata = {
  title: "Privacy Policy — Sohovi",
  description:
    "Sohovi's Privacy Policy. Learn how we protect your data, why your files never leave your browser, and how we handle Google API data.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy — Sohovi",
    description: "How Sohovi protects your data. Your files never leave your browser.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Sohovi",
    description: "How Sohovi protects your data. Your files never leave your browser.",
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/privacy#page`,
  url: `${SITE_URL}/privacy`,
  name: "Privacy Policy — Sohovi",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Sohovi",
    url: SITE_URL,
    email: "hello@sohovi.com",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">
          <section className="mx-auto max-w-2xl px-6 py-24">
            <nav className="flex items-center gap-2 text-sm mb-12" style={{ color: "#5B5B63" }}>
              <Link href="/" style={{ color: "#5B5B63", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#0A0A0A" }}>Privacy Policy</span>
            </nav>

            <h1
              className="font-extrabold leading-tight mb-4"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-0.04em", color: "#0A0A0A" }}
            >
              Privacy Policy
            </h1>
            <p className="mb-10 text-sm" style={{ color: "#5B5B63" }}>
              Effective date: 16 June 2026
            </p>

            <div className="space-y-8 text-base leading-relaxed" style={{ color: "#5B5B63" }}>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>1. Who we are</h2>
                <p>
                  Sohovi (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a privacy-first data
                  quality platform operated by Selvaganapathy Pari. Our registered domain is{" "}
                  <strong style={{ color: "#0A0A0A" }}>sohovi.com</strong>. Contact us at{" "}
                  <a href="mailto:hello@sohovi.com" className="underline" style={{ color: "#0A0A0A" }}>
                    hello@sohovi.com
                  </a>.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>2. The core principle: your data stays in your browser</h2>
                <p>
                  When you upload a file or connect a data source, all profiling, scoring, and
                  analysis runs inside a{" "}
                  <strong style={{ color: "#0A0A0A" }}>sandboxed Web Worker</strong> in your browser tab.
                  Raw rows, cell values, and file bytes are <strong style={{ color: "#0A0A0A" }}>never
                  transmitted to Sohovi servers</strong>. You can verify this in your browser&apos;s
                  DevTools → Network tab — you will see zero outbound requests containing your data.
                </p>
                <p>
                  The only things we store on our servers are: data quality scores, rule
                  configurations, workflow definitions, and run metadata (timestamps, row counts,
                  column names). Never your actual row values.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>3. Information we collect</h2>
                <p><strong style={{ color: "#0A0A0A" }}>Account information</strong> — When you sign up, we collect your name and email address via Clerk (our authentication provider). This is used solely to identify your account and send transactional emails (billing, password reset).</p>
                <p><strong style={{ color: "#0A0A0A" }}>Usage metadata</strong> — We store non-sensitive metadata about your data assets: asset names, column headers (not values), row counts, DQ scores, rule configurations, and timestamps.</p>
                <p><strong style={{ color: "#0A0A0A" }}>Billing information</strong> — Payment is handled by Dodo Payments. We store only your subscription plan and status; we never see or store card numbers.</p>
                <p><strong style={{ color: "#0A0A0A" }}>Cookies &amp; analytics</strong> — We use cookies required for authentication (Clerk session cookies). We do not run third-party advertising trackers.</p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>4. Google API services — limited use disclosure</h2>
                <p>
                  Sohovi offers an optional Google Sheets connector. When you use it:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>You authenticate via Google OAuth 2.0 and grant Sohovi read-only access to your spreadsheets (<code className="text-sm bg-gray-100 px-1 rounded">spreadsheets.readonly</code> scope).</li>
                  <li>The OAuth access token is stored <strong style={{ color: "#0A0A0A" }}>in browser memory only</strong> and is discarded when your session ends. It is never written to disk, localStorage, or our databases.</li>
                  <li>Your spreadsheet data is fetched directly from Google&apos;s API by your browser and processed locally. <strong style={{ color: "#0A0A0A" }}>Row values are never sent to Sohovi servers.</strong></li>
                  <li>Only non-sensitive metadata (spreadsheet name, sheet tab name, last connected timestamp) is saved to identify the connection — no cell data.</li>
                </ul>
                <p className="mt-2 font-medium" style={{ color: "#0A0A0A" }}>
                  Sohovi&apos;s use of information received from Google APIs will adhere to the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "#0A0A0A" }}
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>5. How we use your information</h2>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>To provide and improve the Sohovi service</li>
                  <li>To authenticate you and manage your subscription</li>
                  <li>To send transactional emails (receipts, password resets)</li>
                  <li>To display your data quality history and scores within the dashboard</li>
                </ul>
                <p>We do <strong style={{ color: "#0A0A0A" }}>not</strong> sell, rent, or share your personal data with third parties for advertising or marketing purposes.</p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>6. Third-party services</h2>
                <p>We use the following sub-processors, each with their own privacy policies:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong style={{ color: "#0A0A0A" }}>Clerk</strong> — authentication and user management</li>
                  <li><strong style={{ color: "#0A0A0A" }}>Supabase</strong> — database (stores metadata only, never raw data)</li>
                  <li><strong style={{ color: "#0A0A0A" }}>Dodo Payments</strong> — payment processing</li>
                  <li><strong style={{ color: "#0A0A0A" }}>Vercel</strong> — hosting and edge infrastructure</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>7. Data retention</h2>
                <p>Account metadata is retained for as long as your account is active. You may delete your account at any time by contacting us at{" "}
                  <a href="mailto:hello@sohovi.com" className="underline" style={{ color: "#0A0A0A" }}>hello@sohovi.com</a>, and we will delete all associated data within 30 days.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>8. Your rights</h2>
                <p>
                  Depending on your location, you may have rights under GDPR, CCPA, or similar laws
                  to access, correct, export, or delete your personal data. To exercise any of these
                  rights, email us at{" "}
                  <a href="mailto:hello@sohovi.com" className="underline" style={{ color: "#0A0A0A" }}>
                    hello@sohovi.com
                  </a>.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>9. Security</h2>
                <p>
                  We use HTTPS for all communications, SOC 2-compliant infrastructure (Supabase,
                  Vercel), and row-level security on all database tables. Because raw data never
                  reaches our servers, our attack surface for data breaches is significantly smaller
                  than traditional cloud platforms.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>10. Changes to this policy</h2>
                <p>
                  We may update this policy from time to time. Material changes will be notified via
                  email or an in-app banner. The effective date at the top of this page always
                  reflects the current version.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-xl" style={{ color: "#0A0A0A" }}>11. Contact</h2>
                <p>
                  For any privacy-related questions or requests, contact us at{" "}
                  <a href="mailto:hello@sohovi.com" className="underline" style={{ color: "#0A0A0A" }}>
                    hello@sohovi.com
                  </a>.
                </p>
              </div>

            </div>

            <div className="mt-14 flex flex-wrap gap-4">
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[16px] font-semibold rounded-xl border transition-all"
                style={{ border: "1px solid #E9E9EC", color: "#0A0A0A" }}
              >
                Terms of Service
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
