import type { Metadata } from "next";
import Script from "next/script";
import { EncoreClient } from "./EncoreClient";

export const metadata: Metadata = {
  title: "Music Teacher Scheduling Software & Student Management — Encore",
  description:
    "A MyMusicStaff alternative built for private music teachers and studios: music lesson scheduling, attendance, practice assignments, and parent billing in one place — for any instrument.",
  openGraph: {
    title: "Music Teacher Scheduling & Student Management — Encore",
    description: "Recurring lessons, student progress, practice assignments, and parent billing — built for how music teachers actually teach.",
  },
  alternates: { canonical: "https://sohovi.com/labs/encore" },
  twitter: {
    card: "summary_large_image",
    title: "Music Teacher Scheduling & Student Management — Encore",
    description: "A modern MyMusicStaff alternative for private and studio music teachers.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Encore",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "19", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description: "Booking and student management software for private and studio music teachers.",
  url: "https://sohovi.com/labs/encore",
};

export default function EncorePage() {
  return (
    <>
      <Script id="encore-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <EncoreClient />
    </>
  );
}
