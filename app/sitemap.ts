import type { MetadataRoute } from "next";
import { getAllPublishedSlugsWithDates, getAllCategories } from "@/app/actions/blog";
import { slugifyCategory } from "@/lib/blog-utils";

export const revalidate = 3600;

const BASE = "https://sohovi.com";

const LABS_SLUGS: { slug: string; lastModified: string }[] = [
  { slug: "snapback", lastModified: "2026-07-07" },
  { slug: "encore", lastModified: "2026-07-07" },
  { slug: "signsync", lastModified: "2026-07-07" },
  { slug: "shopify-tools", lastModified: "2026-07-07" },
  { slug: "reftrack", lastModified: "2026-07-07" },
  { slug: "shipnotes", lastModified: "2026-07-07" },
  { slug: "kickoffbox", lastModified: "2026-07-13" },
];

const TOOL_SLUGS: { slug: string; lastModified: string }[] = [
  { slug: "pii-audit", lastModified: "2026-06-17" },
  { slug: "compare", lastModified: "2026-06-17" },
  { slug: "de-identify", lastModified: "2026-06-17" },
  { slug: "remove-duplicates", lastModified: "2026-06-17" },
  { slug: "csv-to-json", lastModified: "2026-05-31" },
  { slug: "json-to-csv", lastModified: "2026-05-31" },
  { slug: "csv-columns", lastModified: "2026-05-31" },
  { slug: "csv-to-markdown", lastModified: "2026-05-31" },
  { slug: "csv-to-sql", lastModified: "2026-05-31" },
  { slug: "csv-merger", lastModified: "2026-05-31" },
  { slug: "test-data-generator", lastModified: "2026-05-31" },
  { slug: "formula-explainer", lastModified: "2026-05-31" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, categories] = await Promise.all([
    getAllPublishedSlugsWithDates(),
    getAllCategories(),
  ]);

  return [
    { url: BASE, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/pricing`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/security`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/features/data-profiling`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/features/data-quality-scoring`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/features/pii-detection`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/about`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/blog/author/selva-santosh`, priority: 0.5, changeFrequency: "weekly" },
    { url: `${BASE}/tools`, priority: 0.9, changeFrequency: "monthly" },
    ...TOOL_SLUGS.map(({ slug, lastModified }) => ({
      url: `${BASE}/tools/${slug}`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
      lastModified: new Date(lastModified),
    })),
    ...LABS_SLUGS.map(({ slug, lastModified }) => ({
      url: `${BASE}/labs/${slug}`,
      priority: 0.6,
      changeFrequency: "weekly" as const,
      lastModified: new Date(lastModified),
    })),
    ...categories.map((c) => ({
      url: `${BASE}/blog/category/${slugifyCategory(c)}`,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    })),
    ...blogSlugs.map(({ slug, lastModified }) => ({
      url: `${BASE}/blog/${slug}`,
      priority: 0.7,
      changeFrequency: "yearly" as const,
      lastModified: new Date(lastModified),
    })),
  ];
}
