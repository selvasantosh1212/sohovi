import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { FlaskConical } from "lucide-react";
import { LabsHeader } from "@/components/labs/LabsHeader";

const SITE_URL = "https://sohovi.com";

export const metadata: Metadata = {
  title: "Sohovi Labs — Micro-SaaS Ideas We're Validating",
  description:
    "12 demand-validation pages for micro-SaaS tools we haven't built yet. Each one is a real problem we're considering solving — join the waitlist for the ones you'd actually use, and we'll build them if enough people raise a hand.",
  openGraph: {
    title: "Sohovi Labs — Micro-SaaS Ideas We're Validating",
    description:
      "12 early-stage product ideas, each validated with a real landing page before we write a line of product code. Tell us which ones you want built.",
  },
  alternates: { canonical: `${SITE_URL}/labs` },
  twitter: {
    card: "summary_large_image",
    title: "Sohovi Labs — Micro-SaaS Ideas We're Validating",
    description:
      "12 early-stage product ideas, each validated with a real landing page before we write a line of product code.",
  },
};

const LABS = [
  {
    slug: "snapback",
    name: "SnapBack",
    tagline: "Automated Postgres backups for Supabase, Neon & Turso, streamed to storage you own.",
  },
  {
    slug: "encore",
    name: "Encore",
    tagline: "Scheduling, attendance, and parent billing for private music teachers and studios.",
  },
  {
    slug: "signsync",
    name: "SignSync",
    tagline: "Deploys brand-consistent Gmail signatures for your whole team — no seat minimum.",
  },
  {
    slug: "shopify-tools",
    name: "Shopify Tools",
    tagline: "Bulk price editing, low-stock alerts, and order tagging automation for Shopify merchants.",
  },
  {
    slug: "reftrack",
    name: "RefTrack",
    tagline: "Flat-fee affiliate tracking for small SaaS teams with 5–20 affiliates.",
  },
  {
    slug: "shipnotes",
    name: "ShipNotes",
    tagline: "A hosted changelog and embeddable widget auto-drafted from your GitHub releases.",
  },
  {
    slug: "kickoffbox",
    name: "KickoffBox",
    tagline: "Collects logos, copy, images, and logins from clients — without the chasing.",
  },
  {
    slug: "thumblab",
    name: "ThumbLab",
    tagline: "AI thumbnail testing against real competitors, plus Shorts auto-crop with captions.",
  },
  {
    slug: "categorly",
    name: "Categorly",
    tagline: "A mobile swipe interface for clients to categorize their own uncategorized transactions.",
  },
  {
    slug: "quotenudge",
    name: "QuoteNudge",
    tagline: "Send a branded quote from your phone and automate follow-up on unpaid invoices.",
  },
  {
    slug: "seenly",
    name: "Seenly",
    tagline: "Tracks your brand's mention rate and sentiment across ChatGPT, Perplexity, and AI Overviews.",
  },
  {
    slug: "clearbrief",
    name: "ClearBrief",
    tagline: "A reusable client intake checklist that flags ambiguous answers before you start work.",
  },
];

const labsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Sohovi Labs — Micro-SaaS Ideas We're Validating",
  description: "Demand-validation pages for micro-SaaS tools Sohovi is considering building.",
  itemListElement: LABS.map((lab, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: lab.name,
    url: `${SITE_URL}/labs/${lab.slug}`,
  })),
};

export default function LabsIndexPage() {
  return (
    <>
      <Script
        id="labs-hub-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(labsListSchema) }}
      />
      <LabsHeader
        accent="#00C9A7"
        honestyStripText="These are demand-validation pages, not live products — join the waitlist for the ideas you'd actually use."
      />

      {/* Hero */}
      <section style={{ background: "#F8FAFC", padding: "64px 24px 40px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              color: "#475569",
            }}
          >
            <FlaskConical style={{ width: "14px", height: "14px", color: "#00C9A7" }} />
            12 ideas, not yet built
          </div>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#1A1A2E",
            }}
          >
            Sohovi Labs
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.6, color: "#475569", margin: 0 }}>
            Every page below is a real problem we&apos;re considering solving, validated before we
            write a line of product code.{" "}
            <strong style={{ color: "#1A1A2E" }}>Join the waitlist for the ones you&apos;d actually use</strong>
            {" "}— if enough people raise a hand, we build it and email you first.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "8px 24px 80px" }}>
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {LABS.map((lab) => (
            <Link
              key={lab.slug}
              href={`/labs/${lab.slug}`}
              style={{
                display: "block",
                padding: "24px",
                borderRadius: "14px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "inherit",
                textDecoration: "none",
                transition: "border-color 150ms, transform 150ms",
              }}
              className="labs-index-card"
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#1A1A2E",
                }}
              >
                {lab.name}
              </h2>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.55, color: "#64748B" }}>
                {lab.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .labs-index-card:hover { border-color: #00C9A7 !important; transform: translateY(-2px); }
      `}</style>
    </>
  );
}
