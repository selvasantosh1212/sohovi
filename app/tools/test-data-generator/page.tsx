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
  twitter: { card: "summary_large_image", title: "Free Random Test Data Generator — Fake CSV Data", description: "Generate realistic fake CSV or JSON data for testing. Up to 100k rows. No signup, browser-based." },
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
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to generate fake test data as CSV",
  step: [
    { "@type": "HowToStep", name: "Choose a preset or define your columns", text: "Start with a customer list, sales records, or employee directory preset — or define your own columns by choosing a name and data type. Supported types include names, emails, UUIDs, dates, countries, and more." },
    { "@type": "HowToStep", name: "Set row count and format", text: "Choose how many rows you need (10 to 100,000) and whether you want CSV or JSON output. CSV is great for spreadsheets and database imports. JSON is useful for APIs and frontend testing." },
    { "@type": "HowToStep", name: "Generate and download", text: "Click Generate. Your file is created instantly in the browser and downloaded automatically. No data is sent to any server." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a test data generator?", acceptedAnswer: { "@type": "Answer", text: "A test data generator creates realistic fake data for software testing, database seeding, UI development, and demos. Instead of using real customer data (which raises privacy concerns), you generate synthetic data that looks real but isn't." } },
    { "@type": "Question", name: "How do I generate fake CSV data?", acceptedAnswer: { "@type": "Answer", text: "Use the presets to start quickly, or define your own columns by choosing a name and data type. Set the row count, click Generate, and download your CSV or JSON file instantly." } },
    { "@type": "Question", name: "Is there a row limit?", acceptedAnswer: { "@type": "Answer", text: "No. You can generate up to 100,000 rows in a single download. The generation runs entirely in your browser — nothing is sent to a server." } },
    { "@type": "Question", name: "What data types are available?", acceptedAnswer: { "@type": "Answer", text: "First/last/full name, email, phone, UUID, integer, float, boolean, date, country, city, company name, URL, lorem ipsum text, and auto-increment ID." } },
    { "@type": "Question", name: "Can I use this data in production?", acceptedAnswer: { "@type": "Answer", text: "No — this is synthetic test data. Names, emails, and phone numbers are randomly generated and not real. Use it for testing, demos, and development only." } },
  ],
};

export default function TestDataGeneratorPage() {
  return (
    <>
      <Script id="test-data-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="test-data-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="test-data-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <TestDataGeneratorClient />
    </>
  );
}
