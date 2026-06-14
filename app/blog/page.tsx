import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPublishedPosts, getPublishedPostCount, getAllCategories } from "@/app/actions/blog";
import { BlogHomeClient } from "@/components/blog/BlogHomeClient";
import { slugifyCategory } from "@/lib/blog-utils";

export const revalidate = 3600;

const SITE_URL = "https://sohovi.com";
const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: "Blog — Data Quality Insights",
  description:
    "Tutorials, best practices, and real-world guides on data quality, profiling, PII detection, and CSV validation — from the Sohovi team.",
  keywords: ["data quality", "data profiling", "CSV validation", "data governance", "PII detection"],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Sohovi Blog — Data Quality Insights",
    description:
      "Practical guides on data profiling, DQ scoring, PII detection, and more.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sohovi Blog — Data Quality Insights",
    description: "Practical guides on data profiling, DQ scoring, PII detection, and more.",
  },
};

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function BlogListPage({ searchParams }: Props) {
  const { page: pageParam, category } = await searchParams;

  // Legacy `/blog?category=...` links -> permanent redirect to /blog/category/<slug>
  if (category) {
    const categories = await getAllCategories();
    const decoded = decodeURIComponent(category);
    const match = categories.find(
      (c) => c === decoded || slugifyCategory(c) === slugifyCategory(decoded)
    );
    permanentRedirect(match ? `/blog/category/${slugifyCategory(match)}` : "/blog");
  }

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const [posts, total] = await Promise.all([
    getPublishedPosts(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getPublishedPostCount(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return <BlogHomeClient posts={posts} page={page} totalPages={totalPages} />;
}
