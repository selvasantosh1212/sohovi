import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPublishedPosts, getPublishedPostCount, getAllCategories } from "@/app/actions/blog";
import { BlogHomeClient } from "@/components/blog/BlogHomeClient";
import { slugifyCategory } from "@/lib/blog-utils";

export const revalidate = 3600;

const SITE_URL = "https://sohovi.com";
const PAGE_SIZE = 24;

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const canonical = page > 1 ? `${SITE_URL}/blog?page=${page}` : `${SITE_URL}/blog`;
  const title = page > 1 ? `Blog — Data Quality Insights (Page ${page})` : "Blog — Data Quality Insights";
  const description =
    "Tutorials, best practices, and real-world guides on data quality, profiling, PII detection, and CSV validation — from the Sohovi team.";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog#collection`,
        url: `${SITE_URL}/blog`,
        name: "Sohovi Blog — Data Quality Insights",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, i) => ({
            "@type": "ListItem",
            position: (page - 1) * PAGE_SIZE + i + 1,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHomeClient posts={posts} page={page} totalPages={totalPages} />
    </>
  );
}
