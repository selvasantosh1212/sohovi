import type { Metadata } from "next";
import Script from "next/script";
import { CsvToSqlClient } from "./CsvToSqlClient";

export const metadata: Metadata = {
  title: "Free CSV to SQL INSERT Generator — MySQL, PostgreSQL, SQLite",
  description:
    "Convert CSV files to SQL INSERT statements online for free. Supports MySQL, PostgreSQL, SQLite, and MSSQL. Includes CREATE TABLE. Browser-based, no signup.",
  keywords: [
    "csv to sql",
    "csv to sql insert statements",
    "csv to sql generator online",
    "csv to mysql insert",
    "csv to postgresql insert",
    "import csv to sql",
  ],
  openGraph: {
    title: "Free CSV to SQL INSERT Generator — MySQL, PostgreSQL, SQLite",
    description: "Generate SQL INSERT statements from any CSV. Multi-dialect, CREATE TABLE included. Free, no signup.",
  },
  alternates: { canonical: "https://sohovi.com/tools/csv-to-sql" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free CSV to SQL INSERT Generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Generate SQL INSERT statements from CSV files. Supports MySQL, PostgreSQL, SQLite, MSSQL. Includes CREATE TABLE. 100% browser-based.",
  url: "https://sohovi.com/tools/csv-to-sql",
};

export default function CsvToSqlPage() {
  return (
    <>
      <Script id="csv-sql-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <CsvToSqlClient />
    </>
  );
}
