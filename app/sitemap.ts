import type { MetadataRoute } from "next";
import { getAllPublishedSlugs, getAllCategories } from "@/app/actions/blog";

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
  const [blogSlugs, categories] = await Promise.all([
    getAllPublishedSlugs(),
    getAllCategories(),
  ]);

  return [
    { url: BASE, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/about`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/tools`, priority: 0.9, changeFrequency: "monthly" },
    ...TOOL_SLUGS.map((s) => ({
      url: `${BASE}/tools/${s}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
      lastModified: new Date("2026-05-31"),
    })),
    ...categories.map((c) => ({
      url: `${BASE}/blog/category/${encodeURIComponent(c)}`,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })),
    ...blogSlugs.map((s) => ({
      url: `${BASE}/blog/${s}`,
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
  ];
}
