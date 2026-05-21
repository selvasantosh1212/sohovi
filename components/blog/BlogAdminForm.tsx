"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPost, updatePost } from "@/app/actions/blog";
import type { BlogPostInput } from "@/app/actions/blog";
import type { BlogPost } from "@/types/app.types";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-teal-600 underline">$1</a>')
    .split(/\n{2,}/)
    .map((block) => {
      if (/^<(h[1-6]|blockquote|li|ul|ol)/.test(block.trim())) return block;
      return `<p>${block.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

interface Props {
  post?: BlogPost;
}

export function BlogAdminForm({ post }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Core fields
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tagsRaw, setTagsRaw] = useState(post?.tags?.join(", ") ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [tab, setTab] = useState<"write" | "preview">("write");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.og_image_url ?? "");

  // Rich content fields
  const [postType, setPostType] = useState<string>(post?.post_type ?? "explainer");
  const [keyTakeawaysRaw, setKeyTakeawaysRaw] = useState(
    (post?.key_takeaways ?? []).join("\n")
  );
  const [pullQuote, setPullQuote] = useState(post?.pull_quote ?? "");
  const [authorName, setAuthorName] = useState(post?.author_name ?? "");
  const [authorRole, setAuthorRole] = useState(post?.author_role ?? "");
  const [authorBio, setAuthorBio] = useState(post?.author_bio ?? "");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(
    post?.faqs ?? []
  );
  const [internalLinks, setInternalLinks] = useState<{ href: string; title: string }[]>(
    post?.internal_links ?? []
  );

  const isEdit = !!post;

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!isEdit) setSlug(generateSlug(v));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { q: "", a: "" }]);
  }
  function updateFaq(i: number, field: "q" | "a", value: string) {
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  }
  function removeFaq(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addLink() {
    setInternalLinks((prev) => [...prev, { href: "", title: "" }]);
  }
  function updateLink(i: number, field: "href" | "title", value: string) {
    setInternalLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }
  function removeLink(i: number) {
    setInternalLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    const keyTakeaways = keyTakeawaysRaw
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    const cleanedFaqs = faqs.filter((f) => f.q.trim() && f.a.trim());
    const cleanedLinks = internalLinks.filter((l) => l.href.trim() && l.title.trim());

    const input: BlogPostInput = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      cover_image_url: coverImageUrl || undefined,
      tags,
      category: category || undefined,
      seo_title: seoTitle || undefined,
      seo_description: seoDescription || undefined,
      og_image_url: ogImageUrl || undefined,
      post_type: postType || undefined,
      key_takeaways: keyTakeaways.length ? keyTakeaways : undefined,
      pull_quote: pullQuote || undefined,
      author_name: authorName || undefined,
      author_role: authorRole || undefined,
      author_bio: authorBio || undefined,
      faqs: cleanedFaqs.length ? cleanedFaqs : undefined,
      internal_links: cleanedLinks.length ? cleanedLinks : undefined,
      published,
    };

    startTransition(async () => {
      try {
        if (isEdit) {
          await updatePost(post!.id, input);
          toast.success("Post updated");
        } else {
          await createPost(input);
          toast.success("Post created");
        }
        router.push("/blog/admin");
        router.refresh();
      } catch (err) {
        toast.error((err as Error).message);
      }
    });
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07150]/40";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";
  const sectionCls = "border border-gray-100 rounded-xl p-4 space-y-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className={labelCls} htmlFor="title">Title *</label>
        <input
          id="title"
          className={inputCls}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          placeholder="Your post title"
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls} htmlFor="slug">Slug *</label>
        <input
          id="slug"
          className={inputCls}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="url-friendly-slug"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls} htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          className={inputCls}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="Short summary shown in list view and as the article lede"
        />
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-4 mb-2">
          <span className={labelCls} style={{ marginBottom: 0 }}>Content (Markdown) *</span>
          <div className="ml-auto flex border border-gray-200 rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`px-3 py-1.5 font-medium transition-colors ${tab === "write" ? "bg-[#1A1A2E] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-3 py-1.5 font-medium transition-colors ${tab === "preview" ? "bg-[#1A1A2E] text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Preview
            </button>
          </div>
        </div>
        {tab === "write" ? (
          <textarea
            className={`${inputCls} font-mono`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            required
            placeholder="Write in Markdown…"
          />
        ) : (
          <div
            className="w-full border border-gray-200 rounded-lg px-4 py-3 min-h-[20rem] prose prose-sm max-w-none overflow-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      {/* Category + tags + post type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="category">Category</label>
          <input
            id="category"
            className={inputCls}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Data Quality"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            className={inputCls}
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="csv, data, quality"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="post-type">Post Type</label>
          <select
            id="post-type"
            className={inputCls}
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option value="explainer">Explainer</option>
            <option value="how-to">How-To</option>
            <option value="listicle">Listicle</option>
            <option value="review">Review</option>
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="cover">Cover Image URL</label>
          <input
            id="cover"
            className={inputCls}
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      {/* Key takeaways */}
      <details className={sectionCls}>
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer list-none flex items-center gap-2">
          <span>Key Takeaways</span>
          <span className="text-xs font-normal text-gray-400">(≥3 to show TLDR block · one per line)</span>
        </summary>
        <div className="mt-3">
          <textarea
            className={`${inputCls} font-mono`}
            value={keyTakeawaysRaw}
            onChange={(e) => setKeyTakeawaysRaw(e.target.value)}
            rows={5}
            placeholder={"<strong>Key insight one:</strong> brief explanation\n<strong>Key insight two:</strong> brief explanation\n<strong>Key insight three:</strong> brief explanation"}
          />
          <p className="text-xs text-gray-400 mt-1">HTML &lt;strong&gt; tags are allowed for bold lead text.</p>
        </div>
      </details>

      {/* Pull quote */}
      <details className={sectionCls}>
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer list-none">
          Pull Quote <span className="text-xs font-normal text-gray-400">(displayed as styled serif blockquote)</span>
        </summary>
        <div className="mt-3">
          <textarea
            className={inputCls}
            value={pullQuote}
            onChange={(e) => setPullQuote(e.target.value)}
            rows={2}
            placeholder="A memorable sentence or statistic worth highlighting…"
          />
        </div>
      </details>

      {/* FAQs */}
      <details className={sectionCls}>
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer list-none flex items-center gap-2">
          <span>FAQs</span>
          <span className="text-xs font-normal text-gray-400">(drives FAQ accordion + FAQPage JSON-LD schema)</span>
        </summary>
        <div className="mt-3 space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">FAQ {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <input
                className={inputCls}
                value={faq.q}
                onChange={(e) => updateFaq(i, "q", e.target.value)}
                placeholder="Question"
              />
              <textarea
                className={inputCls}
                value={faq.a}
                onChange={(e) => updateFaq(i, "a", e.target.value)}
                rows={2}
                placeholder="Answer"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFaq}
            className="text-sm font-medium text-[#E07150] hover:text-[#C45A3C] transition-colors"
          >
            + Add FAQ
          </button>
        </div>
      </details>

      {/* Internal links */}
      <details className={sectionCls}>
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer list-none flex items-center gap-2">
          <span>Internal Links</span>
          <span className="text-xs font-normal text-gray-400">(shown as &quot;Keep Reading&quot; links at end of article)</span>
        </summary>
        <div className="mt-3 space-y-3">
          {internalLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                className={`${inputCls} flex-1`}
                value={link.title}
                onChange={(e) => updateLink(i, "title", e.target.value)}
                placeholder="Link title"
              />
              <input
                className={`${inputCls} flex-1`}
                value={link.href}
                onChange={(e) => updateLink(i, "href", e.target.value)}
                placeholder="/blog/some-post"
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-xs text-red-400 hover:text-red-600 pt-2 whitespace-nowrap"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="text-sm font-medium text-[#E07150] hover:text-[#C45A3C] transition-colors"
          >
            + Add Link
          </button>
        </div>
      </details>

      {/* Author */}
      <details className={sectionCls}>
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer list-none">
          Author <span className="text-xs font-normal text-gray-400">(defaults to &quot;Sohovi Team&quot; if blank)</span>
        </summary>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="author-name">Name</label>
              <input
                id="author-name"
                className={inputCls}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Sohovi Team"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="author-role">Role</label>
              <input
                id="author-role"
                className={inputCls}
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Data quality, for people who ship"
              />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="author-bio">Bio</label>
            <textarea
              id="author-bio"
              className={inputCls}
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              rows={2}
              placeholder="One or two sentences about the author…"
            />
          </div>
        </div>
      </details>

      {/* SEO / Open Graph */}
      <details className={sectionCls}>
        <summary className="text-sm font-semibold text-gray-700 cursor-pointer list-none">
          SEO / Open Graph
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className={labelCls} htmlFor="seo-title">SEO Title <span className="font-normal text-gray-400">(≤60 chars)</span></label>
            <input
              id="seo-title"
              className={inputCls}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Defaults to post title if blank"
              maxLength={60}
            />
            <p className="text-xs text-gray-400 mt-0.5">{seoTitle.length}/60</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="seo-desc">Meta Description <span className="font-normal text-gray-400">(150–160 chars)</span></label>
            <textarea
              id="seo-desc"
              className={inputCls}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              placeholder="Defaults to excerpt if blank"
              maxLength={160}
            />
            <p className="text-xs text-gray-400 mt-0.5">{seoDescription.length}/160</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="og-image">OG Image URL <span className="font-normal text-gray-400">(1200×630)</span></label>
            <input
              id="og-image"
              className={inputCls}
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </details>

      {/* Published toggle + submit */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            role="checkbox"
            aria-checked={published}
            tabIndex={0}
            onClick={() => setPublished(!published)}
            onKeyDown={(e) => e.key === " " && setPublished(!published)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${published ? "bg-[#E07150]" : "bg-gray-300"}`}
            style={{ position: "relative" }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              style={{ transform: published ? "translateX(20px)" : "translateX(0)" }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {published ? "Published" : "Draft"}
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#1A1A2E" }}
        >
          {pending ? "Saving…" : isEdit ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
