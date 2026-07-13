import type { Metadata } from "next";
import Script from "next/script";
import { QuoteNudgeClient } from "./QuoteNudgeClient";

export const metadata: Metadata = {
  title: "Send Quotes From Your Phone, Get Invoices Paid — QuoteNudge",
  description:
    "Build a branded quote from your phone in 2 minutes, get notified when it's viewed, and let automatic follow-up chase unanswered quotes and unpaid invoices. WhatsApp-first. From $25/mo.",
  keywords: [
    "quote follow up app for contractors",
    "invoice chasing app for trades",
    "whatsapp quote tool for contractors",
    "plumber quoting app",
    "electrician invoice app",
    "contractor quote software",
    "quote viewed notification tool",
    "sms invoice reminder app",
    "small contractor invoicing tool",
    "job quote app for phone",
  ],
  openGraph: {
    title: "Send Quotes From Your Phone, Get Invoices Paid — QuoteNudge",
    description:
      "A branded quote in 2 minutes, a notification when it's viewed, and automatic follow-up until it's accepted and paid.",
  },
  alternates: { canonical: "https://sohovi.com/labs/quotenudge" },
  twitter: {
    card: "summary_large_image",
    title: "Send Quotes From Your Phone, Get Invoices Paid — QuoteNudge",
    description: "A branded quote in 2 minutes, and automatic follow-up until it's accepted and paid.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "QuoteNudge",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "A quote and invoice follow-up tool for trades and contractors — build a branded quote from your phone, get notified when it's viewed, and let automatic follow-up chase unanswered quotes and unpaid invoices.",
  url: "https://sohovi.com/labs/quotenudge",
};

export default function QuoteNudgePage() {
  return (
    <>
      <Script id="quotenudge-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <QuoteNudgeClient />
    </>
  );
}
