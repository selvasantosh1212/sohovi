/**
 * One-time script: spreads all published post dates across the past 6 months
 * at a rate of ~15 posts/week, oldest-first by created_at.
 *
 * Run with:  npx tsx scripts/stagger-dates.ts [--dry-run]
 *
 * --dry-run  prints the proposed dates without writing to Supabase.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

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

const DRY_RUN = process.argv.includes("--dry-run");
const POSTS_PER_WEEK = 15;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error || !posts) {
    console.error("Failed to fetch posts:", error);
    process.exit(1);
  }

  console.log(`Found ${posts.length} published posts.`);

  // Spread backwards from yesterday at POSTS_PER_WEEK cadence
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(10, 0, 0, 0);

  const updates: { id: string; slug: string; published_at: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    // How many full weeks back from yesterday this post should sit
    const weeksBack = Math.floor(i / POSTS_PER_WEEK);
    // Day offset within that week (spread posts across Mon–Fri)
    const dayOffset = (i % POSTS_PER_WEEK) % 5;
    // Hour offset to stagger within the day
    const hourOffset = Math.floor((i % POSTS_PER_WEEK) / 5) * 3;

    const date = new Date(yesterday.getTime() - weeksBack * MS_PER_WEEK);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(date.getHours() - hourOffset);

    updates.push({ id: posts[i].id, slug: posts[i].slug, published_at: date.toISOString() });
  }

  if (DRY_RUN) {
    console.log("\nDry-run — proposed published_at (and updated_at) dates:");
    for (const u of updates) {
      console.log(`  ${u.slug.padEnd(60)} → ${u.published_at}`);
    }
    console.log(`\nDate range: ${updates.at(-1)?.published_at} → ${updates[0]?.published_at}`);
    console.log("Re-run without --dry-run to apply.");
    return;
  }

  let updated = 0;
  for (const u of updates) {
    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ published_at: u.published_at, updated_at: u.published_at })
      .eq("id", u.id);

    if (updateError) {
      console.error(`Failed to update ${u.slug}:`, updateError.message);
    } else {
      updated++;
    }
  }

  console.log(`\nUpdated ${updated}/${updates.length} posts.`);
}

main();
