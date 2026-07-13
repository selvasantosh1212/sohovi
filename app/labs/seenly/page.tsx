import type { Metadata } from "next";
import Script from "next/script";
import { SeenlyClient } from "./SeenlyClient";

export const metadata: Metadata = {
  title: "Track Your Brand in ChatGPT, Perplexity & AI Overviews — Seenly",
  description:
    "See your mention rate, sentiment, and cited sources across ChatGPT, Perplexity, and Google AI Overviews every week — with content-fix suggestions and white-label reporting for agencies. From $49/mo.",
  keywords: [
    "ai brand visibility monitoring",
    "geo generative engine optimization tool",
    "track brand mentions chatgpt",
    "seo for chatgpt",
    "ai overviews brand tracking",
    "perplexity brand mentions",
    "ai search visibility tool",
    "llm brand monitoring",
    "answer engine optimization",
    "ai citation tracking tool",
  ],
  openGraph: {
    title: "Track Your Brand in ChatGPT, Perplexity & AI Overviews — Seenly",
    description:
      "Weekly mention rate, sentiment, and source citations across the AI engines your customers now ask instead of Google.",
  },
  alternates: { canonical: "https://sohovi.com/labs/seenly" },
  twitter: {
    card: "summary_large_image",
    title: "Track Your Brand in ChatGPT, Perplexity & AI Overviews — Seenly",
    description: "Weekly mention rate, sentiment, and source citations across the AI engines customers now ask.",
  },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Seenly",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/PreOrder" },
  description:
    "An AI brand-visibility monitor — tracks mention rate, sentiment, and cited sources for a brand across ChatGPT, Perplexity, and Google AI Overviews, with content-fix suggestions and white-label agency reporting.",
  url: "https://sohovi.com/labs/seenly",
};

export default function SeenlyPage() {
  return (
    <>
      <Script id="seenly-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <SeenlyClient />
    </>
  );
}
