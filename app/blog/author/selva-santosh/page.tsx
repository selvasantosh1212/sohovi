import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/app/actions/blog";
import { formatDate } from "@/lib/blog-utils";

export const revalidate = 3600;

const SITE_URL = "https://sohovi.com";
const AUTHOR_NAME = "Selva Santosh";
const AUTHOR_ROLE = "Founder, Sohovi — data quality, for people who ship";
const AUTHOR_BIO =
  "Selva is the founder of Sohovi, a privacy-first data quality tool that profiles and scores CSV/Excel data entirely in the browser. Writes practical, no-nonsense guides on data quality, profiling, and governance for teams who need to ship — not run an enterprise data program.";

export const metadata: Metadata = {
  title: `${AUTHOR_NAME} — Sohovi Blog`,
  description: AUTHOR_BIO,
  alternates: { canonical: `${SITE_URL}/blog/author/selva-santosh` },
  openGraph: {
    title: `${AUTHOR_NAME} — Sohovi Blog`,
    description: AUTHOR_BIO,
    url: `${SITE_URL}/blog/author/selva-santosh`,
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: `${AUTHOR_NAME} — Sohovi Blog`,
    description: AUTHOR_BIO,
  },
};

export default async function AuthorPage() {
  const posts = await getPublishedPosts(100, 0);
  const pageUrl = `${SITE_URL}/blog/author/selva-santosh`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: AUTHOR_NAME, item: pageUrl },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        mainEntity: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person-selva-santosh`,
          name: AUTHOR_NAME,
          jobTitle: AUTHOR_ROLE,
          description: AUTHOR_BIO,
          url: pageUrl,
          worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Sohovi" },
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
          <span>{AUTHOR_NAME}</span>
        </nav>
        <h1 className="bh-hero__title">{AUTHOR_NAME}</h1>
        <p className="bh-hero__lede">{AUTHOR_ROLE}</p>
        <p className="bh-hero__lede">{AUTHOR_BIO}</p>
      </section>

      <section className="bh-section" aria-label={`Articles by ${AUTHOR_NAME}`}>
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
