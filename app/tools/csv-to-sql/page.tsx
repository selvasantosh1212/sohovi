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
  twitter: { card: "summary_large_image", title: "Free CSV to SQL INSERT Generator — MySQL, PostgreSQL, SQLite", description: "Generate SQL INSERT statements from any CSV. Multi-dialect, CREATE TABLE included. Free, no signup." },
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
  datePublished: "2026-05-31",
  dateModified: "2026-05-31",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to generate SQL INSERT statements from CSV",
  step: [
    { "@type": "HowToStep", name: "Upload your CSV file", text: "Drop your file into the upload zone. The tool reads your headers as column names and your rows as values. No data is sent to any server." },
    { "@type": "HowToStep", name: "Configure table name, dialect, and options", text: "Set your target table name (defaults to the filename). Choose your SQL dialect — MySQL, PostgreSQL, SQLite, or MSSQL. Enable CREATE TABLE to get a full schema statement with inferred column types." },
    { "@type": "HowToStep", name: "Generate, copy, or download", text: "Click Generate SQL to produce the statements. Copy to clipboard or download as a .sql file. The preview is truncated for large outputs, but the download is always complete." },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert a CSV to SQL INSERT statements?", acceptedAnswer: { "@type": "Answer", text: "Upload your CSV, set the table name and dialect, then click Generate SQL. The tool reads the headers as column names and generates one INSERT statement per batch of rows (default 100 rows per INSERT for performance)." } },
    { "@type": "Question", name: "Which SQL dialects are supported?", acceptedAnswer: { "@type": "Answer", text: "MySQL, PostgreSQL, SQLite, and Microsoft SQL Server (MSSQL). The differences include identifier quoting (backticks vs double-quotes vs square brackets), data type names, and CREATE TABLE syntax." } },
    { "@type": "Question", name: "Does it include a CREATE TABLE statement?", acceptedAnswer: { "@type": "Answer", text: "Yes — enable the 'Include CREATE TABLE' toggle and the tool will infer column types (INTEGER, DECIMAL, VARCHAR/TEXT) from your data and generate the full table definition." } },
    { "@type": "Question", name: "How are NULL values handled?", acceptedAnswer: { "@type": "Answer", text: "Empty cells and cells containing the text 'null' (case-insensitive) are converted to SQL NULL. All other values are escaped as string literals with single quotes doubled." } },
    { "@type": "Question", name: "Is there a row limit?", acceptedAnswer: { "@type": "Answer", text: "No. The tool processes your entire file in the browser. For very large outputs, the preview is truncated at 10,000 characters but the download always contains the full SQL." } },
  ],
};

export default function CsvToSqlPage() {
  return (
    <>
      <Script id="csv-sql-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="csv-sql-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="csv-sql-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CsvToSqlClient />
    </>
  );
}
