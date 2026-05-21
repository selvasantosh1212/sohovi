/**
 * Seeds all written batch files into Supabase blog_posts.
 * Safe to re-run — uses upsert on slug conflict.
 * Add new batch imports here as more batches are written.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

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

const ALL_POSTS = [
  ...cat01,
  ...cat02,
  ...cat0305,
  ...cat06,
  ...cat07,
  ...cat08,
  ...cat09,
  ...cat10,
  ...cat11,
  ...cat12,
  ...cat13,
  ...cat14,
  ...cat15,
  ...cat16,
  ...cat17,
  ...cat18,
  ...cat19,
  ...cat20,
  ...cat21,
  ...cat22,
  ...cat23,
  ...cat24,
];

// ── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\nSeeding ${ALL_POSTS.length} posts from batch files...\n`);
  let ok = 0, fail = 0;

  for (const post of ALL_POSTS) {
    const { error } = await supabase.from("blog_posts").upsert(
      {
        ...post,
        clerk_user_id: SEED_USER,
        read_time_min: readTime(post.content),
        published_at: NOW,
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
