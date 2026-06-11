import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/app/actions/blog";
import { formatDate } from "@/lib/blog-utils";

export const revalidate = 3600;

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ category: encodeURIComponent(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = decodeURIComponent(category);
  return {
    title: `${name} — Sohovi Blog`,
    description: `Browse all Sohovi blog posts in the ${name} category.`,
    alternates: { canonical: `https://sohovi.com/blog/category/${category}` },
  };
}

export default async function CategoryArchivePage({ params }: Props) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const posts = await getPostsByCategory(name);

  if (posts.length === 0) notFound();

  return (
    <div className="bh-shell">
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
