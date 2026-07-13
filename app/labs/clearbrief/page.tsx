import type { Metadata } from "next";
import Script from "next/script";
import { ClearBriefClient } from "./ClearBriefClient";

export const metadata: Metadata = {
  title: "Client Briefs That Don't Cause Revision Cycles — ClearBrief",
  description:
    "Build a reusable intake checklist for any freelance niche, send one link with a progress bar, and let AI flag ambiguous answers before you start work. From $10/mo. Join the waitlist.",
  keywords: [
    "client brief collection tool",
    "content snare alternative",
    "freelancer client intake tool",
    "client onboarding checklist tool",
    "collect files from clients",
    "reusable client intake form",
    "ai brief review tool",
    "freelancer content collection tool",
    "client requirements checklist",
    "client questionnaire tool for freelancers",
  ],
  openGraph: {
    title: "Client Briefs That Don't Cause Revision Cycles — ClearBrief",
    description:
      "A reusable intake checklist for any freelance niche, plus an AI that flags what's still ambiguous before you start.",
  },
  alternates: { canonical: "https://sohovi.com/labs/clearbrief" },
  twitter: {
    card: "summary_large_image",
    title: "Client Briefs That Don't Cause Revision Cycles — ClearBrief",
    description: "A reusable intake checklist, plus AI that flags what's still ambiguous before you start.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClearBrief",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "A client brief and content collection tool for freelancers and agencies in any niche — reusable intake checklists, a progress-bar client link, and AI that flags ambiguous answers before work starts.",
  url: "https://sohovi.com/labs/clearbrief",
};

export default function ClearBriefPage() {
  return (
    <>
      <Script id="clearbrief-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ClearBriefClient />
    </>
  );
}
