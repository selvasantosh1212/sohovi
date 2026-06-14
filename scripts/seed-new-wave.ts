/**
 * Seeds the 35 new blog posts (wave 2) into Supabase with staggered published_at dates.
 * Posts are spread 1 per business day (Mon–Fri) from Apr 27 → Jun 12, 2026, in an
 * interleaved category order so the calendar doesn't look like a batch dump.
 *
 * Existing posts are NOT touched — upsert only affects the 35 slugs listed here.
 *
 * Run with:  npx tsx scripts/seed-new-wave.ts [--dry-run]
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

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
const POSTS_DIR = resolve(process.cwd(), "app/blog/posts");
const SEED_USER = "seed-admin";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── Editorial calendar: 1 post per business day, categories interleaved ───────
// Format: [slug, "YYYY-MM-DD", hourOffset (9–11am)]
const SCHEDULE: [string, string, number][] = [
  // Week 1: Apr 27–May 1
  ["excel-formulas-data-cleaning",              "2026-04-27", 9],
  ["sohovi-vs-excel-data-quality",              "2026-04-28", 10],
  ["remove-duplicates-google-sheets",           "2026-04-29", 9],
  ["best-free-data-profiling-tools-2026",       "2026-04-30", 11],
  ["find-duplicates-across-two-csv-files",      "2026-05-01", 9],
  // Week 2: May 4–8
  ["data-validation-google-sheets",            "2026-05-04", 10],
  ["openrefine-alternatives-browser",          "2026-05-05", 9],
  ["combine-csvs-different-columns",           "2026-05-06", 11],
  ["excel-scientific-notation-fix",            "2026-05-07", 9],
  ["sohovi-vs-great-expectations",             "2026-05-08", 10],
  // Week 3: May 11–15
  ["trim-clean-invisible-characters-vlookup",  "2026-05-11", 9],
  ["great-expectations-alternatives-simpler",  "2026-05-12", 10],
  ["csv-to-sql-insert-statements",             "2026-05-13", 9],
  ["why-sohovi-never-uploads-your-data",       "2026-05-14", 11],
  ["excel-auto-date-product-codes-fix",        "2026-05-15", 9],
  // Week 4: May 18–22
  ["bulk-import-csv-mysql-postgresql-sqlite",  "2026-05-18", 10],
  ["talend-open-studio-alternatives",          "2026-05-19", 9],
  ["utf8-characters-broken-excel-encoding",    "2026-05-20", 11],
  ["split-large-csv-into-smaller-files",       "2026-05-21", 9],
  ["informatica-data-quality-alternatives-smb","2026-05-22", 10],
  // Week 5: May 25–29
  ["json-to-excel-without-coding",             "2026-05-25", 9],
  ["what-does-excel-formula-do",               "2026-05-26", 10],
  ["monte-carlo-alternatives-small-teams",     "2026-05-27", 9],
  ["csv-to-json-api-formats",                  "2026-05-28", 11],
  ["why-excel-remove-duplicates-misses-most",  "2026-05-29", 9],
  // Week 6: Jun 1–5
  ["conditional-formatting-bad-data",          "2026-06-01", 10],
  ["soda-alternatives-no-data-engineers",      "2026-06-02", 9],
  ["test-data-vs-production-data-pii",         "2026-06-03", 11],
  ["data-quality-tool-pricing-compared-2026",  "2026-06-04", 9],
  ["csv-to-markdown-github-notion",            "2026-06-05", 10],
  // Week 7: Jun 8–12
  ["excel-row-limit-workaround",               "2026-06-08", 9],
  ["data-ladder-winpure-alternatives",         "2026-06-09", 10],
  ["generate-realistic-fake-customer-data",    "2026-06-10", 9],
  ["reorder-rename-drop-csv-columns",          "2026-06-11", 11],
  ["seed-data-demos-100k-rows",                "2026-06-12", 9],
];

// ── Helpers (mirrors seed-md-posts.ts) ───────────────────────────────────────

function readTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

function parseFrontmatter(raw: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const line of raw.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (!key) continue;
    if (val.startsWith("[")) {
      try {
        const arr = JSON.parse(val.replace(/'/g, '"'));
        if (Array.isArray(arr)) { out[key] = arr; continue; }
      } catch { /* fall through */ }
    }
    out[key] = val.replace(/^["']|["']$/g, "");
  }
  return out;
}

function parseMdFile(filepath: string): { fm: Record<string, string | string[]>; body: string } | null {
  const raw = readFileSync(filepath, "utf-8");
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;
  return {
    fm: parseFrontmatter(raw.slice(3, end).trim()),
    body: raw.slice(end + 4).trim(),
  };
}

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

async function main() {
  console.log(`\nSeeding ${SCHEDULE.length} new posts with staggered dates...\n`);
  if (DRY_RUN) console.log("DRY RUN — no writes to Supabase.\n");

  let ok = 0, skip = 0, fail = 0;

  for (const [slug, dateStr, hour] of SCHEDULE) {
    const filepath = join(POSTS_DIR, `${slug}.md`);
    let parsed: ReturnType<typeof parseMdFile>;
    try {
      parsed = parseMdFile(filepath);
    } catch {
      console.warn(`  ⚠ file not found: ${slug}.md`);
      skip++;
      continue;
    }

    if (!parsed) {
      console.warn(`  ⚠ no frontmatter: ${slug}.md`);
      skip++;
      continue;
    }

    const { fm, body } = parsed;
    const title = (fm.title as string)?.trim();
    if (!title) {
      console.warn(`  ⚠ missing title: ${slug}.md`);
      skip++;
      continue;
    }

    const publishedAt = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00.000Z`).toISOString();

    const tags = Array.isArray(fm.supportingKeywords)
      ? (fm.supportingKeywords as string[])
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
      published: true,
      clerk_user_id: SEED_USER,
      read_time_min: readTime(body),
      published_at: publishedAt,
      updated_at: publishedAt,
    };

    if (DRY_RUN) {
      console.log(`  ${dateStr} ${hour}:00  ${slug}`);
      ok++;
      continue;
    }

    const { error } = await supabase
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" });

    if (error) {
      console.error(`  ✗ ${slug}\n    ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${dateStr}  ${slug}`);
      ok++;
    }
  }

  console.log(`\nDone — ${ok} seeded, ${skip} skipped, ${fail} failed.\n`);
  if (!DRY_RUN && fail > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
