/**
 * One-time script: strips the trailing "**Meta description:** ..." block
 * (a generator artifact) from the body of every blog post that has it.
 *
 * Run with:  npx tsx scripts/strip-meta-description-leak.ts [--dry-run]
 *
 * --dry-run  prints slug + before/after tail without writing to Supabase.
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const MARKER = "**Meta description:**";

function stripLeak(content: string): string | null {
  const idx = content.lastIndexOf(MARKER);
  if (idx === -1) return null;

  // Only treat this as the known generator artifact if it's near the end
  // of the post (otherwise flag for manual review instead of stripping).
  if (content.length - idx > 500) return null;

  let trimmed = content.slice(0, idx).replace(/\s+$/, "");
  // Remove one or more trailing horizontal-rule lines left behind.
  while (/\n-{3,}\s*$/.test(trimmed)) {
    trimmed = trimmed.replace(/\n-{3,}\s*$/, "").replace(/\s+$/, "");
  }
  return `${trimmed}\n`;
}

async function fetchAllPosts() {
  const posts: { id: string; slug: string; content: string }[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, content")
      .ilike("content", `%${MARKER}%`)
      .range(offset, offset + limit - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    posts.push(...data);
    if (data.length < limit) break;
    offset += limit;
  }
  return posts;
}

async function main() {
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} posts containing "${MARKER}"\n`);

  let updated = 0;
  let flagged = 0;

  for (const post of posts) {
    const stripped = stripLeak(post.content);
    if (stripped === null) {
      console.warn(`${post.slug}: marker not near end of content - flagged for manual review`);
      flagged++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`${post.slug}: ${post.content.length} -> ${stripped.length} chars`);
      console.log(`  before tail: ...${JSON.stringify(post.content.slice(-80))}`);
      console.log(`  after  tail: ...${JSON.stringify(stripped.slice(-80))}`);
      updated++;
      continue;
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({ content: stripped })
      .eq("id", post.id);

    if (error) {
      console.error(`${post.slug}: update failed - ${error.message}`);
      continue;
    }
    console.log(`${post.slug}: stripped (${post.content.length} -> ${stripped.length} chars)`);
    updated++;
  }

  console.log(`\n${DRY_RUN ? "Would update" : "Updated"} ${updated} posts. Flagged ${flagged} for manual review.`);
  if (DRY_RUN) console.log("Re-run without --dry-run to apply.");
}

main();
