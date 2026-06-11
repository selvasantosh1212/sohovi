import type { Metadata } from "next";
import { getPublishedPosts, getPublishedPostCount } from "@/app/actions/blog";
import { BlogHomeClient } from "@/components/blog/BlogHomeClient";

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
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogListPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const [posts, total] = await Promise.all([
    getPublishedPosts(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getPublishedPostCount(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return <BlogHomeClient posts={posts} page={page} totalPages={totalPages} />;
}
