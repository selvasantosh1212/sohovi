/**
 * Seeds all markdown posts from app/blog/posts/ into Supabase blog_posts.
 * Reads frontmatter + content from .md files; upserts on slug conflict.
 * Usage:  npm run seed:md
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnvLocal() {
  try {
    const contents = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of contents.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) process.env[key] = val;
    }
  } catch { /* rely on shell env */ }
}
loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NOW = new Date().toISOString();
const SEED_USER = "seed-admin";
const POSTS_DIR = resolve(process.cwd(), "app/blog/posts");

// ── Helpers ──────────────────────────────────────────────────────────────────

function readTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

/** Parse YAML frontmatter. Handles quoted strings and string[] arrays. */
function parseFrontmatter(raw: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const line of raw.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (!key) continue;

    // Array: ["a", "b", "c"]
    if (val.startsWith("[")) {
      try {
        const arr = JSON.parse(val.replace(/'/g, '"'));
        if (Array.isArray(arr)) { out[key] = arr; continue; }
      } catch { /* fall through to string */ }
    }

    // Quoted string
    out[key] = val.replace(/^["']|["']$/g, "");
  }
  return out;
}

/** Extract frontmatter and body from a markdown file. */
function parseMdFile(filepath: string): {
  fm: Record<string, string | string[]>;
  body: string;
} | null {
  const raw = readFileSync(filepath, "utf-8");
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;
  const fmRaw = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  return { fm: parseFrontmatter(fmRaw), body };
}

/** Take first non-empty paragraph (strips markdown bold markers). */
function makeExcerpt(body: string): string {
  const lines = body.split("\n");
  const paraLines: string[] = [];
  let inPara = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) { if (inPara) break; continue; }
    if (t.startsWith("#") || t.startsWith("[") || t.startsWith("!")) continue;
    paraLines.push(t);
    inPara = true;
    if (paraLines.join(" ").length > 100) break;
  }
  return paraLines.join(" ")
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .slice(0, 300);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const files = readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".md"))
    .sort();

  console.log(`\nFound ${files.length} markdown files in app/blog/posts/\n`);

  let ok = 0, skip = 0, fail = 0;

  for (const file of files) {
    const filepath = join(POSTS_DIR, file);
    const parsed = parseMdFile(filepath);

    if (!parsed) {
      console.warn(`  ⚠ skipped (no frontmatter): ${file}`);
      skip++;
      continue;
    }

    const { fm, body } = parsed;
    const slug = (fm.slug as string)?.trim();
    const title = (fm.title as string)?.trim();

    if (!slug || !title) {
      console.warn(`  ⚠ skipped (missing slug/title): ${file}`);
      skip++;
      continue;
    }

    const tags = Array.isArray(fm.supportingKeywords)
      ? fm.supportingKeywords as string[]
      : typeof fm.supportingKeywords === "string"
        ? (fm.supportingKeywords as string).split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const post = {
      title,
      slug,
      excerpt: makeExcerpt(body),
      content: body,
      category: (fm.category as string) || "Data Quality",
      tags,
      seo_title: (fm.seo_title as string) || title,
      seo_description: (fm.seo_description as string) || "",
      published: true,           // all seeded posts go live
      clerk_user_id: SEED_USER,
      read_time_min: readTime(body),
      published_at: NOW,
    };

    const { error } = await supabase
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" });

    if (error) {
      console.error(`  ✗ ${slug}\n    ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${slug}`);
      ok++;
    }
  }

  console.log(`\nDone — ${ok} upserted, ${skip} skipped, ${fail} failed.\n`);
  if (fail > 0) process.exit(1);
}

seed().catch(err => { console.error(err); process.exit(1); });
