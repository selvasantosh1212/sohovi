import type { Metadata } from "next";
import Script from "next/script";
import { SignSyncClient } from "./SignSyncClient";

export const metadata: Metadata = {
  title: "Email Signature Generator & Manager for Small Teams — SignSync",
  description:
    "An Exclaimer alternative for small businesses: a team email signature generator that deploys brand-consistent Gmail signatures for your whole company, $1/user/month with no 100-seat minimum.",
  openGraph: {
    title: "Email Signature Manager for Small Teams — SignSync",
    description: "Deploy brand-consistent signatures to every Gmail user on your team in one click — no enterprise pricing, no seat minimum.",
  },
  alternates: { canonical: "https://sohovi.com/labs/signsync" },
  twitter: {
    card: "summary_large_image",
    title: "Email Signature Manager for Small Teams — SignSync",
    description: "An Exclaimer alternative built for 20-200 person teams.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SignSync",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "1", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description: "Email signature management for small teams — brand-consistent Gmail signatures deployed in one click.",
  url: "https://sohovi.com/labs/signsync",
};

export default function SignSyncPage() {
  return (
    <>
      <Script id="signsync-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <SignSyncClient />
    </>
  );
}
