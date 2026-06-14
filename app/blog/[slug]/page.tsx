import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getRelatedPosts } from "@/app/actions/blog";
import { AdminEditButton } from "@/components/blog/AdminEditButton";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { BlogTOC } from "@/components/blog/BlogTOC";
import { KeyTakeaways } from "@/components/blog/KeyTakeaways";
import { BlogFAQ } from "@/components/blog/BlogFAQ";
import { BlogPostAuthor } from "@/components/blog/BlogPostAuthor";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { extractToc, formatDate, slugifyCategory } from "@/lib/blog-utils";
import { injectInlineSohoviMentions } from "@/lib/blog-cta";
import { injectInternalLinks, cleanInternalLinkPlaceholders } from "@/lib/blog-internal-links";
import { resolveDiagram } from "@/lib/blog/diagram-map";
import rehypeSlug from "rehype-slug";

// On-demand ISR: pages render on first request and are cached for 1 hour.
// Not pre-rendered at build time to avoid MDX compilation errors on arbitrary Supabase content.
export const revalidate = 3600;
export const dynamicParams = true;

const SITE_URL = "https://sohovi.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? undefined;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const imageUrl = post.og_image_url ?? post.cover_image_url ?? undefined;
  const publishedAt = post.published_at ?? undefined;
  const modifiedAt =
    post.updated_at > (post.published_at ?? "") ? post.updated_at : (post.published_at ?? post.updated_at);

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      section: post.category ?? undefined,
      tags: post.tags,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

function buildJsonLd(post: Awaited<ReturnType<typeof getPostBySlug>>, slug: string) {
  if (!post) return null;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? "";

  const graph: object[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ...(post.category
          ? [{ "@type": "ListItem", position: 3, name: post.category, item: `${SITE_URL}/blog/category/${slugifyCategory(post.category)}` }]
          : []),
        { "@type": "ListItem", position: post.category ? 4 : 3, name: post.title, item: canonicalUrl },
      ],
    },
    {
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      headline: title,
      description,
      url: canonicalUrl,
      datePublished: post.published_at ?? post.created_at,
      dateModified:
        post.updated_at > (post.published_at ?? "") ? post.updated_at : (post.published_at ?? post.updated_at),
      author: {
        "@type": "Organization",
        name: post.author_name ?? "Sohovi Team",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Sohovi",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/sohovi.svg` },
      },
      image: post.og_image_url ?? post.cover_image_url
        ? { "@type": "ImageObject", url: post.og_image_url ?? post.cover_image_url, width: 1200, height: 630 }
        : undefined,
      keywords: post.tags.join(", "),
      articleSection: post.category ?? "Data Quality",
      wordCount: post.content.split(/\s+/).length,
      timeRequired: `PT${post.read_time_min ?? 5}M`,
    },
  ];

  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.id, post.category);

  const toc = extractToc(post.content);
  const dateStr = post.published_at ? formatDate(post.published_at) : null;
  const jsonLd = buildJsonLd(post, slug);
  const authorInitial = (post.author_name ?? "S").charAt(0).toUpperCase();

  return (
    <>
      {/* JSON-LD structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* Breadcrumb + admin button */}
      <div className="article-wrap" style={{ maxWidth: 1200 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <nav className="article-crumbs" aria-label="Breadcrumb">
            <Link href="/" style={{ color: "var(--ink-mute)", textDecoration: "none" }}>Home</Link>
            <span aria-hidden="true" style={{ color: "var(--hair-strong)" }}>/</span>
            <Link href="/blog" style={{ color: "var(--ink-mute)", textDecoration: "none" }}>Blog</Link>
            {post.category && (
              <>
                <span aria-hidden="true" style={{ color: "var(--hair-strong)" }}>/</span>
                <span style={{ color: "var(--ink-soft)" }}>{post.category}</span>
              </>
            )}
          </nav>
          <AdminEditButton postId={post.id} />
        </div>
      </div>

      {/* Article header */}
      <div className="article-wrap">
        <header className="article-header">
          {/* Category chip */}
          {post.category && (
            <Link
              href={`/blog/category/${slugifyCategory(post.category)}`}
              className="chip--accent"
              style={{ textDecoration: "none" }}
            >
              {post.category}
            </Link>
          )}

          {/* H1 */}
          <h1 className="article-title">{post.title}</h1>

          {/* Lede / excerpt */}
          {post.excerpt && (
            <p className="article-lede">{post.excerpt}</p>
          )}

          {/* Byline */}
          <div className="byline">
            <div className="byline__avatar" aria-hidden="true">{authorInitial}</div>
            <div className="byline__info">
              <span className="byline__name">{post.author_name ?? "Sohovi Team"}</span>
              <span className="byline__role">{post.author_role ?? "Data quality, for people who ship"}</span>
            </div>
            <div className="byline__meta">
              {dateStr && (
                <time dateTime={post.published_at ?? ""}>{dateStr}</time>
              )}
              {dateStr && post.read_time_min && (
                <span aria-hidden="true">·</span>
              )}
              {post.read_time_min && (
                <span>{post.read_time_min} min read</span>
              )}
            </div>
          </div>
          {post.author_bio && (
            <p className="byline__bio">{post.author_bio}</p>
          )}
        </header>
      </div>

      {/* Key takeaways */}
      {post.key_takeaways && post.key_takeaways.length >= 3 && (
        <div className="article-wrap" style={{ maxWidth: 1200, marginBottom: 0 }}>
          <KeyTakeaways items={post.key_takeaways} />
        </div>
      )}

      {/* Two-column: TOC + prose */}
      <div className="article-wrap" style={{ maxWidth: 1200 }}>
        <div className="article__layout">
          {/* Sticky TOC sidebar */}
          <BlogTOC items={toc} />

          {/* Article body */}
          <div
            className="prose prose__drop"
            id="article-body"
          >
            {/* Pull quote — rendered above MDX body */}
            {post.pull_quote && (
              <div className="pullquote">
                <p>{post.pull_quote}</p>
              </div>
            )}

            {(() => {
              const cleaned = cleanInternalLinkPlaceholders(
                post.content
                  .replace(/<!--[\s\S]*?-->/g, "")
                  .replace(/<(?![a-zA-Z/!])/g, "&lt;")
              );
              const withLinks = injectInternalLinks(cleaned, slug);
              const withCTAs = injectInlineSohoviMentions(withLinks, post.category, post.tags ?? []);
              const withDiagrams = withCTAs.replace(
                /\[IMAGE:\s*(.*?)\]/g,
                (_, desc: string) => {
                  const file = resolveDiagram(desc);
                  return file ? `\n\n![${desc}](/diagrams/${file})\n\n` : "";
                }
              );
              return (
                <MDXRemote source={withDiagrams} options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }} />
              );
            })()}

            {/* Internal links */}
            {post.internal_links && post.internal_links.length > 0 && (
              <div className="internal-links">
                <p className="internal-links__label">Keep Reading</p>
                {post.internal_links.map((link, i) => (
                  <Link key={i} href={link.href} className="internal-links__item">
                    <span className="internal-links__item-title">{link.title}</span>
                    <svg className="internal-links__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ accordion */}
      <BlogFAQ faqs={post.faqs ?? []} />

      {/* Author block */}
      <div style={{ padding: "0 28px 0", maxWidth: 1200, margin: "0 auto 64px" }}>
        <BlogPostAuthor
          name={post.author_name}
          role={post.author_role}
          bio={post.author_bio}
        />
      </div>

      {/* Final CTA */}
      <div className="final-cta-wrap">
        <div className="final-cta">
          <div className="final-cta__bg" aria-hidden="true" />
          <div className="final-cta__inner">
            <p className="final-cta__eyebrow">Start for free</p>
            <h2 className="final-cta__title">
              Stop guessing. <em>Start knowing</em> your data quality.
            </h2>
            <p className="final-cta__text">
              Sohovi profiles your datasets in minutes — surfacing completeness gaps,
              type mismatches, and duplicate patterns before they reach production.
            </p>
            <div className="final-cta__row">
              <Link
                href="/sign-up"
                className="btn-teal"
                style={{ padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-block" }}
              >
                Try Sohovi free
              </Link>
              <Link
                href="/blog"
                className="btn-outline-light"
                style={{ padding: "12px 24px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-block" }}
              >
                More articles
              </Link>
            </div>
            <p className="final-cta__meta">No credit card required · Free forever plan</p>
          </div>
        </div>
      </div>

      {/* Related posts */}
      <RelatedPosts posts={related} category={post.category} />
    </>
  );
}
