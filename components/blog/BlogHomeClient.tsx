"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types/app.types";
import { formatDate, slugifyCategory } from "@/lib/blog-utils";

export function BlogHomeClient({
  posts,
  page = 1,
  totalPages = 1,
}: {
  posts: BlogPost[];
  page?: number;
  totalPages?: number;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))),
  ];

  const [featured, ...rest] = posts;

  const filtered = rest.filter((p) => {
    const catMatch = activeCategory === "all" || p.category === activeCategory;
    const q = search.toLowerCase().trim();
    const textMatch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? "").toLowerCase().includes(q);
    return catMatch && textMatch;
  });

  function resetFilters() {
    setSearch("");
    setActiveCategory("all");
  }

  if (posts.length === 0) {
    return (
      <div className="bh-shell">
        <div className="bh-hero">
          <p className="bh-hero__lede">No posts yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bh-shell">
      {/* Hero */}
      <section className="bh-hero">
        <nav className="bh-hero__crumb" aria-label="Breadcrumb">
          <Link href="/" className="bh-hero__crumb">Home</Link>
          <span aria-hidden="true">›</span>
          <span>Blog</span>
        </nav>

        <h1 className="bh-hero__title">
          Data Quality{" "}
          <em>Insights</em>
        </h1>

        <p className="bh-hero__lede">
          Tutorials, best practices, and real-world guides — all privacy-first.
        </p>

        {/* Search */}
        <div className="bh-search">
          <svg className="bh-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            className="bh-search__input"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search articles"
          />
          {!search && <kbd className="bh-search__kbd">/</kbd>}
        </div>
      </section>

      {/* Sticky chip filter bar */}
      {categories.length > 1 && (
        <div className="bh-chipbar" role="navigation" aria-label="Filter by category">
          <div className="bh-chipbar__inner">
            {categories.map((cat) => (
              cat === "all" ? (
                <button
                  key="all"
                  className={`bh-chip${activeCategory === "all" ? " is-active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                  aria-pressed={activeCategory === "all"}
                >
                  All
                </button>
              ) : (
                <a
                  key={cat}
                  href={`/blog/category/${slugifyCategory(cat)}`}
                  className={`bh-chip${activeCategory === cat ? " is-active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setActiveCategory(cat); }}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </a>
              )
            ))}
          </div>
        </div>
      )}

      {/* Featured post */}
      {featured && (
        <section className="bh-feature" aria-label="Featured article">
          <p className="bh-feature__tag">Featured</p>
          <h2 className="bh-feature__title">
            <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
          </h2>
          {featured.excerpt && (
            <p className="bh-feature__excerpt">{featured.excerpt}</p>
          )}
          <div className="bh-feature__meta">
            {featured.category && <span>{featured.category}</span>}
            {featured.category && (featured.published_at || featured.read_time_min) && (
              <span aria-hidden="true">·</span>
            )}
            {featured.published_at && (
              <span>{formatDate(featured.published_at)}</span>
            )}
            {featured.read_time_min && featured.published_at && (
              <span aria-hidden="true">·</span>
            )}
            {featured.read_time_min && (
              <span>{featured.read_time_min} min read</span>
            )}
          </div>
        </section>
      )}

      {/* Latest articles */}
      <section className="bh-section" aria-label="Latest articles">
        <p className="bh-section__label">Latest articles</p>

        {filtered.length === 0 ? (
          <div className="bh-empty">
            <p className="bh-empty__title">Nothing found</p>
            <p className="bh-empty__sub">Try a different search or category.</p>
            <button className="bh-empty__reset" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="bh-list">
            {filtered.map((post) => {
              const dateStr = post.published_at ? formatDate(post.published_at) : null;
              return (
                <li key={post.id} className="bh-item">
                  <div className="bh-item__date" aria-label="Published date">
                    {dateStr ?? "—"}
                  </div>
                  <div className="bh-item__body">
                    {post.category && (
                      <p className="bh-item__cat">{post.category}</p>
                    )}
                    <h3 className="bh-item__title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
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
        )}
      </section>

      {/* Pagination — plain <a> links so crawlers can follow them */}
      {totalPages > 1 && (
        <nav className="bh-pagination" aria-label="Blog pagination">
          {page > 1 && (
            <a href={`/blog?page=${page - 1}`} className="bh-pagination__link" rel="prev">
              ← Newer
            </a>
          )}
          <span className="bh-pagination__info">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a href={`/blog?page=${page + 1}`} className="bh-pagination__link" rel="next">
              Older →
            </a>
          )}
        </nav>
      )}

    </div>
  );
}
