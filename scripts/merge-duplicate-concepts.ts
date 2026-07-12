/**
 * One-time script: consolidates 12 groups of duplicate "data quality concept"
 * posts (same topic, written 2-3x under different slugs by different content
 * pipelines) into a single canonical URL per concept, redirecting the rest.
 *
 * Run with:  npx tsx scripts/merge-duplicate-concepts.ts [--dry-run]
 *
 * Requires migration 007_blog_redirect_noindex.sql to be applied first.
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

const GROUPS: { canonical: string; losers: string[] }[] = [
  { canonical: "what-is-data-completeness", losers: ["data-completeness", "data-completeness-definition-measurement"] },
  { canonical: "what-is-data-accuracy", losers: ["data-accuracy", "data-accuracy-present-valid-but-wrong"] },
  { canonical: "what-is-data-consistency", losers: ["data-consistency", "data-consistency-same-information-different-systems"] },
  { canonical: "what-is-data-validity", losers: ["data-validity", "data-validity-values-conform-rules"] },
  { canonical: "what-is-data-uniqueness", losers: ["data-uniqueness", "data-uniqueness-duplicate-records"] },
  { canonical: "what-is-data-timeliness", losers: ["data-timeliness", "data-timeliness-fresh-data-quality-dimension"] },
  { canonical: "what-is-data-conformity", losers: ["data-conformity", "data-conformity-standardizing-formats"] },
  { canonical: "what-is-data-precision", losers: ["data-precision", "data-precision-too-much-too-little-detail"] },
  { canonical: "what-is-data-lineage", losers: ["data-lineage-where-data-comes-from"] },
  { canonical: "what-is-master-data-management", losers: ["master-data-management-data-quality"] },
  { canonical: "what-is-data-quality-framework", losers: ["data-quality-framework-practical-introduction"] },
  { canonical: "data-governance-vs-data-quality", losers: ["data-quality-vs-data-governance", "data-quality-vs-data-governance-how-they-work-together"] },
];

async function main() {
  let ok = 0, fail = 0, missing = 0;

  for (const { canonical, losers } of GROUPS) {
    const { data: canonicalRow, error: canonicalErr } = await supabase
      .from("blog_posts")
      .select("slug, published")
      .eq("slug", canonical)
      .maybeSingle();

    if (canonicalErr || !canonicalRow) {
      console.error(`  ✗ canonical missing: ${canonical}`);
      missing++;
      continue;
    }
    if (!canonicalRow.published) {
      console.warn(`  ⚠ canonical ${canonical} is not published — reseed app/blog/posts before running this`);
    }

    for (const loser of losers) {
      if (DRY_RUN) {
        console.log(`  [dry-run] ${loser} -> redirect_to: ${canonical}`);
        continue;
      }
      const { error } = await supabase
        .from("blog_posts")
        .update({ redirect_to: canonical })
        .eq("slug", loser);

      if (error) {
        console.error(`  ✗ ${loser}: ${error.message}`);
        fail++;
      } else {
        console.log(`  ✓ ${loser} -> ${canonical}`);
        ok++;
      }
    }
  }

  console.log(`\nDone — ${ok} redirected, ${fail} failed, ${missing} canonical rows missing.\n`);
  if (fail > 0 || missing > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
