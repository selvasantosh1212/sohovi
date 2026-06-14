/**
 * One-time script: restores the 10 "Tools, Technology & Buying Guides" posts
 * whose live Supabase `content` is just the H1 title (no body), using the
 * full drafts already present in scripts/blog-data/cat-10.ts.
 *
 * Run with:  npx tsx scripts/restore-gutted-posts.ts [--dry-run]
 *
 * --dry-run  prints before/after word counts without writing to Supabase
 *            or touching the .md files.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { cat10 } from "./blog-data/cat-10";

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

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function main() {
  console.log(`Found ${cat10.length} entries in cat-10.ts\n`);

  for (const entry of cat10) {
    const fullContent = `# ${entry.title}\n\n${entry.content.trim()}\n`;
    const wc = wordCount(fullContent);
    const readTime = Math.max(1, Math.ceil(wc / 200));

    const { data: existing, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, content")
      .eq("slug", entry.slug)
      .maybeSingle();

    if (fetchError || !existing) {
      console.error(`${entry.slug}: not found in Supabase (${fetchError?.message ?? "no row"})`);
      continue;
    }

    const beforeWc = wordCount(existing.content || "");

    if (DRY_RUN) {
      console.log(`${entry.slug}: ${beforeWc}w -> ${wc}w (read_time_min: ${readTime})`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ content: fullContent, excerpt: entry.excerpt, read_time_min: readTime })
      .eq("id", existing.id);

    if (updateError) {
      console.error(`${entry.slug}: update failed - ${updateError.message}`);
      continue;
    }

    // Keep the source .md file in sync (front-matter + restored body)
    const mdPath = resolve(process.cwd(), "app/blog/posts", `${entry.slug}.md`);
    try {
      const md = readFileSync(mdPath, "utf-8");
      const fmMatch = md.match(/^---\n[\s\S]*?\n---\n/);
      if (fmMatch) {
        const frontMatter = fmMatch[0];
        writeFileSync(mdPath, `${frontMatter}\n${fullContent}`, "utf-8");
      } else {
        console.warn(`${entry.slug}: .md front-matter not found, skipped file update`);
      }
    } catch {
      console.warn(`${entry.slug}: .md file not found at ${mdPath}, skipped file update`);
    }

    console.log(`${entry.slug}: ${beforeWc}w -> ${wc}w (read_time_min: ${readTime}) - updated`);
  }

  if (DRY_RUN) console.log("\nDry-run only — re-run without --dry-run to apply.");
}

main();
