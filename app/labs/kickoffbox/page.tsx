import type { Metadata } from "next";
import Script from "next/script";
import { KickoffboxClient } from "./KickoffboxClient";

export const metadata: Metadata = {
  title: "Collect Website Content From Clients, Without Chasing — KickoffBox",
  description:
    "Send one link. Get logos, copy, images, and logins back from clients automatically. The content collection tool built for web designers — flat $12/mo, no per-request fees. Join the waitlist.",
  keywords: [
    "client content collection tool",
    "collect website content from clients",
    "website content collection for web designers",
    "client onboarding for web designers",
    "how to get content from web design clients",
    "website content questionnaire template",
    "client file upload portal",
    "automatic client reminders",
    "website kickoff checklist",
    "new website client questionnaire",
    "collect logos and files from clients",
    "client intake form for web designers",
    "free website content questionnaire template",
    "website kickoff checklist pdf",
    "client reminder email templates",
  ],
  openGraph: {
    title: "Collect Website Content From Clients, Without Chasing — KickoffBox",
    description:
      "One link gets you every logo, copy doc, image, and login your client owes you — with automatic, polite reminders until it's done.",
  },
  alternates: { canonical: "https://sohovi.com/labs/kickoffbox" },
  twitter: {
    card: "summary_large_image",
    title: "Collect Website Content From Clients, Without Chasing — KickoffBox",
    description: "One link gets you every logo, copy doc, image, and login your client owes you.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "KickoffBox",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "A client content collection tool built for web designers — send one link, get logos, copy, images, and logins back automatically with polite, automatic reminders.",
  url: "https://sohovi.com/labs/kickoffbox",
};

export default function KickoffboxPage() {
  return (
    <>
      <Script id="kickoffbox-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <KickoffboxClient />
    </>
  );
}
