import type { Metadata } from "next";
import Script from "next/script";
import { ThumblabClient } from "./ThumblabClient";

export const metadata: Metadata = {
  title: "AI Thumbnail Testing & Shorts Auto-Crop for Creators — ThumbLab",
  description:
    "Generate thumbnail variants, preview them against real competitors in a simulated feed, and auto-crop Shorts with captions — before you publish. From $19/mo. Join the waitlist.",
  keywords: [
    "ai thumbnail generator",
    "youtube thumbnail testing tool",
    "thumbnail a/b testing",
    "thumbnail preview tool",
    "predict youtube thumbnail performance",
    "auto crop shorts from long video",
    "youtube shorts caption generator",
    "youtube thumbnail maker for creators",
    "thumbnail click through rate predictor",
    "simulate youtube search results thumbnail",
    "vertical video auto crop tool",
    "youtube title and thumbnail generator",
  ],
  openGraph: {
    title: "AI Thumbnail Testing & Shorts Auto-Crop for Creators — ThumbLab",
    description:
      "See your thumbnail next to real competitors before you upload, then auto-crop the same video into captioned Shorts — one tool, one pass.",
  },
  alternates: { canonical: "https://sohovi.com/labs/thumblab" },
  twitter: {
    card: "summary_large_image",
    title: "AI Thumbnail Testing & Shorts Auto-Crop for Creators — ThumbLab",
    description: "See your thumbnail next to real competitors before you upload, then auto-crop into captioned Shorts.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ThumbLab",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "An AI thumbnail testing and Shorts packaging tool for YouTube creators — generate variants, preview them against real competitors, and auto-crop captioned vertical clips before publishing.",
  url: "https://sohovi.com/labs/thumblab",
};

export default function ThumblabPage() {
  return (
    <>
      <Script id="thumblab-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ThumblabClient />
    </>
  );
}
