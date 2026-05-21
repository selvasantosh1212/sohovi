import Link from "next/link";
import type { BlogPost } from "@/types/app.types";
import { formatDate } from "@/lib/blog-utils";

interface Props {
  posts: BlogPost[];
  category?: string | null;
}

const COVER_COLORS = [
  "var(--terracotta-soft)",
  "var(--sage-soft)",
  "var(--sky-soft)",
  "var(--butter-soft)",
];

export function RelatedPosts({ posts, category }: Props) {
  if (!posts.length) return null;

  return (
    <section className="related-section" aria-label="Related posts">
      <div className="related-section__head">
        <h2 className="related-section__title">
          More from{" "}
          <em>{category ?? "Sohovi"}</em>
        </h2>
        <Link href="/blog" className="related-section__all">
          All posts →
        </Link>
      </div>
      <div className="related-grid">
        {posts.map((post, i) => {
          const dateStr = post.published_at ? formatDate(post.published_at) : null;
          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="post-card">
              <div className="post-card__cover" style={{ background: COVER_COLORS[i % COVER_COLORS.length] }}>
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="post-card__cover-inner" />
                )}
                {post.category && (
                  <span className="post-card__tag">{post.category}</span>
                )}
              </div>
              <h3 className="post-card__title">{post.title}</h3>
              <p className="post-card__meta">
                {post.read_time_min ? `${post.read_time_min} min read` : null}
                {post.read_time_min && dateStr ? " · " : null}
                {dateStr}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
