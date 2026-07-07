/**
 * Seeds all written batch files into Supabase blog_posts.
 * Safe to re-run — uses upsert on slug conflict.
 * Add new batch imports here as more batches are written.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { execFileSync } from "child_process";

// Load .env.local without dotenv dependency
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

function readTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

/**
 * True publish date proxy: the date the batch file was first committed to git.
 * Stable across reseeds (unlike `new Date()`), so re-running this script never
 * drifts every post's published_at to "today" again.
 */
function gitFirstCommitDate(filepath: string): string | null {
  try {
    const out = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--format=%aI", "--", filepath],
      { cwd: process.cwd(), encoding: "utf-8" }
    );
    const dates = out.trim().split("\n").filter(Boolean);
    return dates.length ? dates[dates.length - 1] : null;
  } catch {
    return null;
  }
}

// ── Import all written batches ──────────────────────────────────────────────
import { cat01 } from "./blog-data/cat-01";
import { cat02 } from "./blog-data/cat-02";
import { cat0305 } from "./blog-data/cat-03-05";
import { cat06 } from "./blog-data/cat-06";
import { cat07 } from "./blog-data/cat-07";
import { cat08 } from "./blog-data/cat-08";
import { cat09 } from "./blog-data/cat-09";
import { cat10 } from "./blog-data/cat-10";
import { cat11 } from "./blog-data/cat-11";
import { cat12 } from "./blog-data/cat-12";
import { cat13 } from "./blog-data/cat-13";
import { cat14 } from "./blog-data/cat-14";
import { cat15 } from "./blog-data/cat-15";
import { cat16 } from "./blog-data/cat-16";
import { cat17 } from "./blog-data/cat-17";
import { cat18 } from "./blog-data/cat-18";
import { cat19 } from "./blog-data/cat-19";
import { cat20 } from "./blog-data/cat-20";
import { cat21 } from "./blog-data/cat-21";
import { cat22 } from "./blog-data/cat-22";
import { cat23 } from "./blog-data/cat-23";
import { cat24 } from "./blog-data/cat-24";
import { toolsCluster } from "./blog-data/tools-cluster";
import { cat25 } from "./blog-data/cat-25";
import { cat26 } from "./blog-data/cat-26";
import { cat27 } from "./blog-data/cat-27";
import { cat28 } from "./blog-data/cat-28";
import { cat29 } from "./blog-data/cat-29";
import { cat30 } from "./blog-data/cat-30";
import { cat31 } from "./blog-data/cat-31";
import { cat32 } from "./blog-data/cat-32";
import { catBehavior } from "./blog-data/cat-behavior";

const BATCHES: { posts: typeof cat01; file: string }[] = [
  { posts: cat01, file: "scripts/blog-data/cat-01.ts" },
  { posts: cat02, file: "scripts/blog-data/cat-02.ts" },
  { posts: cat0305, file: "scripts/blog-data/cat-03-05.ts" },
  { posts: cat06, file: "scripts/blog-data/cat-06.ts" },
  { posts: cat07, file: "scripts/blog-data/cat-07.ts" },
  { posts: cat08, file: "scripts/blog-data/cat-08.ts" },
  { posts: cat09, file: "scripts/blog-data/cat-09.ts" },
  { posts: cat10, file: "scripts/blog-data/cat-10.ts" },
  { posts: cat11, file: "scripts/blog-data/cat-11.ts" },
  { posts: cat12, file: "scripts/blog-data/cat-12.ts" },
  { posts: cat13, file: "scripts/blog-data/cat-13.ts" },
  { posts: cat14, file: "scripts/blog-data/cat-14.ts" },
  { posts: cat15, file: "scripts/blog-data/cat-15.ts" },
  { posts: cat16, file: "scripts/blog-data/cat-16.ts" },
  { posts: cat17, file: "scripts/blog-data/cat-17.ts" },
  { posts: cat18, file: "scripts/blog-data/cat-18.ts" },
  { posts: cat19, file: "scripts/blog-data/cat-19.ts" },
  { posts: cat20, file: "scripts/blog-data/cat-20.ts" },
  { posts: cat21, file: "scripts/blog-data/cat-21.ts" },
  { posts: cat22, file: "scripts/blog-data/cat-22.ts" },
  { posts: cat23, file: "scripts/blog-data/cat-23.ts" },
  { posts: cat24, file: "scripts/blog-data/cat-24.ts" },
  { posts: toolsCluster, file: "scripts/blog-data/tools-cluster.ts" },
  { posts: cat25, file: "scripts/blog-data/cat-25.ts" },
  { posts: cat26, file: "scripts/blog-data/cat-26.ts" },
  { posts: cat27, file: "scripts/blog-data/cat-27.ts" },
  { posts: cat28, file: "scripts/blog-data/cat-28.ts" },
  { posts: cat29, file: "scripts/blog-data/cat-29.ts" },
  { posts: cat30, file: "scripts/blog-data/cat-30.ts" },
  { posts: cat31, file: "scripts/blog-data/cat-31.ts" },
  { posts: cat32, file: "scripts/blog-data/cat-32.ts" },
  { posts: catBehavior, file: "scripts/blog-data/cat-behavior.ts" },
];

const ALL_POSTS = BATCHES.flatMap(({ posts, file }) => {
  const publishedAt = gitFirstCommitDate(resolve(process.cwd(), file)) ?? NOW;
  return posts.map((post) => ({ ...post, publishedAt }));
});

// ── Cover image mapping ──────────────────────────────────────────────────────
function getCoverImage(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("dedup")) return "/assets/covers/cover-deduplication.webp";
  if (c.includes("profiling")) return "/assets/covers/cover-data-profiling.webp";
  if (c.includes("governance")) return "/assets/covers/cover-data-governance.webp";
  if (c.includes("ai ") || c.includes("ai &") || c.startsWith("ai")) return "/assets/covers/cover-ai-automation.webp";
  if (c.includes("pipeline") || c.includes("engineering") || c.includes("workflow") || c.includes("migration")) return "/assets/covers/cover-data-pipelines.webp";
  if (c.includes("cleaning") || c.includes("standardiz") || c.includes("validation") || c.includes("how-to") || c.includes("spreadsheet") || c.includes("csv")) return "/assets/covers/cover-data-cleaning.webp";
  if (c.includes("behavioral") || c.includes("analytics") || c.includes("bi &") || c.includes("downstream")) return "/assets/covers/cover-behavioral-scoring.webp";
  return "/assets/covers/cover-data-quality.webp";
}

// ── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\nSeeding ${ALL_POSTS.length} posts from batch files...\n`);
  let ok = 0, fail = 0;

  for (const { publishedAt, ...post } of ALL_POSTS) {
    const { error } = await supabase.from("blog_posts").upsert(
      {
        ...post,
        clerk_user_id: SEED_USER,
        read_time_min: readTime(post.content),
        published_at: publishedAt,
        cover_image_url: post.cover_image_url ?? getCoverImage(post.category),
        og_image_url: post.og_image_url ?? getCoverImage(post.category),
      },
      { onConflict: "slug" }
    );
    if (error) {
      console.error(`  ✗ ${post.slug}\n    ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${post.slug}`);
      ok++;
    }
  }

  console.log(`\nDone — ${ok} upserted, ${fail} failed.\n`);
  if (fail > 0) process.exit(1);
}

seed().catch((err) => { console.error(err); process.exit(1); });
