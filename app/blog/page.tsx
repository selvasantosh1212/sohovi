import type { Metadata } from "next";
import { getPublishedPosts } from "@/app/actions/blog";
import { BlogHomeClient } from "@/components/blog/BlogHomeClient";

export const revalidate = 3600;

const SITE_URL = "https://sohovi.com";

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

export default async function BlogListPage() {
  const posts = await getPublishedPosts(24);
  return <BlogHomeClient posts={posts} />;
}
