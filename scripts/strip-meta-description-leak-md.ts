/**
 * One-time script: strips the trailing "**Meta description:** ..." block
 * (a generator artifact) from app/blog/posts/*.md source files, mirroring
 * the cleanup already applied to live Supabase content via
 * scripts/strip-meta-description-leak.ts.
 *
 * Run with:  npx tsx scripts/strip-meta-description-leak-md.ts [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const MARKER = "**Meta description:**";
const POSTS_DIR = resolve(process.cwd(), "app/blog/posts");

function stripLeak(content: string): string | null {
  const idx = content.lastIndexOf(MARKER);
  if (idx === -1) return null;
  if (content.length - idx > 500) return null;

  let trimmed = content.slice(0, idx).replace(/\s+$/, "");
  while (/\n-{3,}\s*$/.test(trimmed)) {
    trimmed = trimmed.replace(/\n-{3,}\s*$/, "").replace(/\s+$/, "");
  }
  return `${trimmed}\n`;
}

function main() {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  let updated = 0;
  let flagged = 0;

  for (const file of files) {
    const path = resolve(POSTS_DIR, file);
    const raw = readFileSync(path, "utf-8");
    if (!raw.includes(MARKER)) continue;

    // Only strip from the body, not front-matter.
    const fmMatch = raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
    if (!fmMatch) {
      console.warn(`${file}: no front-matter found, skipped`);
      flagged++;
      continue;
    }
    const [, frontMatter, body] = fmMatch;
    const stripped = stripLeak(body);
    if (stripped === null) {
      console.warn(`${file}: marker not near end of body - flagged for manual review`);
      flagged++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`${file}: ${body.length} -> ${stripped.length} chars`);
      updated++;
      continue;
    }

    writeFileSync(path, frontMatter + stripped, "utf-8");
    console.log(`${file}: stripped (${body.length} -> ${stripped.length} chars)`);
    updated++;
  }

  console.log(`\n${DRY_RUN ? "Would update" : "Updated"} ${updated} files. Flagged ${flagged} for manual review.`);
  if (DRY_RUN) console.log("Re-run without --dry-run to apply.");
}

main();
