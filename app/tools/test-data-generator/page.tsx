import type { Metadata } from "next";
import Script from "next/script";
import { TestDataGeneratorClient } from "./TestDataGeneratorClient";

export const metadata: Metadata = {
  title: "Free Random Test Data Generator — Generate Fake CSV Data Online",
  description:
    "Generate realistic fake CSV test data online for free. Define columns, set row count (up to 100k), download as CSV or JSON. No signup, no limits.",
  keywords: [
    "fake data generator csv",
    "random test data generator",
    "mock data generator",
    "generate fake csv data",
    "synthetic data generator",
    "dummy data generator csv",
  ],
  openGraph: {
    title: "Free Random Test Data Generator — Fake CSV Data",
    description: "Generate realistic fake CSV or JSON data for testing. Up to 100k rows. No signup, browser-based.",
  },
  alternates: { canonical: "https://sohovi.com/tools/test-data-generator" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free Random Test Data Generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Generate realistic fake CSV or JSON data for testing. Custom column types, up to 100k rows. 100% browser-based.",
  url: "https://sohovi.com/tools/test-data-generator",
};

export default function TestDataGeneratorPage() {
  return (
    <>
      <Script id="test-data-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <TestDataGeneratorClient />
    </>
  );
}
