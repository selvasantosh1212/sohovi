import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/app/actions/blog";

export const revalidate = 3600;

const BASE = "https://sohovi.com";

const TOOL_SLUGS = [
  "remove-duplicates",
  "csv-to-json",
  "json-to-csv",
  "csv-columns",
  "csv-to-markdown",
  "csv-to-sql",
  "csv-merger",
  "test-data-generator",
  "formula-explainer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await getAllPublishedSlugs();

  return [
    { url: BASE, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/tools`, priority: 0.9, changeFrequency: "monthly" },
    ...TOOL_SLUGS.map((s) => ({
      url: `${BASE}/tools/${s}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
      lastModified: new Date("2026-05-31"),
    })),
    ...blogSlugs.map((s) => ({
      url: `${BASE}/blog/${s}`,
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
  ];
}
