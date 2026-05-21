import Link from "next/link";
import type { BlogPost } from "@/types/app.types";
import { AdminEditButton } from "@/components/blog/AdminEditButton";
import { formatDate } from "@/lib/blog-utils";

const COVER_COLORS = [
  "var(--terracotta-soft)",
  "var(--sage-soft)",
  "var(--sky-soft)",
  "var(--butter-soft)",
];

interface Props {
  post: BlogPost;
  colorIndex?: number;
}

export function BlogPostCard({ post, colorIndex = 0 }: Props) {
  const dateStr = post.published_at ? formatDate(post.published_at) : null;
  const coverBg = COVER_COLORS[colorIndex % COVER_COLORS.length];

  return (
    <article className="post-card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Cover */}
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="post-card__cover" style={{ background: coverBg }}>
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
      </Link>

      {/* Body */}
      <div style={{ padding: "14px 2px 0", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Hashtag tags */}
        {post.tags.length > 0 && (
          <div style={{ marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.02em" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="post-card__title" style={{ marginBottom: post.excerpt ? 8 : 12 }}>
          <Link
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              lineHeight: 1.55,
              marginBottom: 12,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as React.CSSProperties}
          >
            {post.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid var(--hair)",
          }}
        >
          <span className="post-card__meta">
            {post.read_time_min ? `${post.read_time_min} min read` : null}
            {post.read_time_min && dateStr ? " · " : null}
            {dateStr}
          </span>
          <AdminEditButton postId={post.id} />
        </div>

      </div>
    </article>
  );
}
