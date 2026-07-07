import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/app/actions/blog";
import { formatDate, slugifyCategory } from "@/lib/blog-utils";

export const revalidate = 3600;

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ category: slugifyCategory(c) }));
}

/** Resolve a category slug to its real category name, redirecting legacy URLs. */
async function resolveCategory(categorySlug: string): Promise<string> {
  const categories = await getAllCategories();
  const match = categories.find((c) => slugifyCategory(c) === categorySlug);
  if (match) return match;

  // Legacy `/blog/category/${encodeURIComponent(fullName)}` URLs
  const decoded = decodeURIComponent(categorySlug);
  const legacyMatch = categories.find((c) => c === decoded);
  if (legacyMatch) {
    permanentRedirect(`/blog/category/${slugifyCategory(legacyMatch)}`);
  }

  notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = await resolveCategory(category);
  return {
    title: `${name} — Sohovi Blog`,
    description: `Browse all Sohovi blog posts in the ${name} category.`,
    alternates: { canonical: `https://sohovi.com/blog/category/${slugifyCategory(name)}` },
  };
}

const SITE_URL = "https://sohovi.com";

export default async function CategoryArchivePage({ params }: Props) {
  const { category } = await params;
  const name = await resolveCategory(category);
  const posts = await getPostsByCategory(name);

  if (posts.length === 0) notFound();

  const categorySlug = slugifyCategory(name);
  const pageUrl = `${SITE_URL}/blog/category/${categorySlug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name, item: pageUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: `${name} — Sohovi Blog`,
        isPartOf: { "@id": `${SITE_URL}/blog#collection` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <div className="bh-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bh-hero">
        <nav className="bh-hero__crumb" aria-label="Breadcrumb">
          <Link href="/" className="bh-hero__crumb">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">›</span>
          <span>{name}</span>
        </nav>
        <h1 className="bh-hero__title">{name}</h1>
        <p className="bh-hero__lede">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
      </section>

      <section className="bh-section" aria-label={`${name} articles`}>
        <ul className="bh-list">
          {posts.map((post) => {
            const dateStr = post.published_at ? formatDate(post.published_at) : null;
            return (
              <li key={post.id} className="bh-item">
                <div className="bh-item__date" aria-label="Published date">
                  {dateStr ?? "—"}
                </div>
                <div className="bh-item__body">
                  <h2 className="bh-item__title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt && (
                    <p className="bh-item__excerpt">{post.excerpt}</p>
                  )}
                  {post.read_time_min && (
                    <p className="bh-item__meta">{post.read_time_min} min read</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
