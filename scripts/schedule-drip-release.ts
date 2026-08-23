/**
 * One-time script: schedules the "audience-template" backlog (Small Business,
 * Industry Use Cases, Local Service Businesses, etc. — the categories the
 * content audit flagged as the actual duplication problem) to release on a
 * real weekly cadence instead of all being visible at once.
 *
 * `published_at` doubles as the release gate everywhere in app/actions/blog.ts
 * (`published_at <= now()`), so no cron job is needed — a post just becomes
 * visible on its own once its scheduled `published_at` passes. Setting all
 * the future dates now, in one run, is sufficient for an ongoing weekly
 * cadence with zero further intervention.
 *
 * Run with:  npx tsx scripts/schedule-drip-release.ts [--dry-run]
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
const POSTS_PER_WEEK = 5;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// The audience-template categories identified in the content audit —
// everything else (evergreen/topical categories) stays visible as-is.
const DRIP_CATEGORIES = [
  "Small Business",
  "Industry Use Cases",
  "Local Service Businesses",
  "Solopreneurs & Ops",
  "Business Function Use Cases",
  "Marketing Agencies",
  "Marketing Agencies & Email Marketers",
  "E-Commerce Data Quality",
  "Accounting & Bookkeeping",
  "Nonprofits",
  "Platform-Specific Data Quality",
  "Freelancers & Data",
  "Email Marketing",
  "Marketing Operations",
];

/** Random hour/minute within a plausible business-hours publish window. */
function randomBusinessTime(date: Date): Date {
  const d = new Date(date);
  const hour = 8 + Math.floor(Math.random() * 10); // 8am-6pm
  const minute = Math.floor(Math.random() * 60);
  d.setHours(hour, minute, Math.floor(Math.random() * 60), 0);
  return d;
}

async function main() {
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, published_at")
    .eq("published", true)
    .in("category", DRIP_CATEGORIES)
    .order("published_at", { ascending: true });

  if (error || !posts) {
    console.error("Failed to fetch posts:", error);
    process.exit(1);
  }

  console.log(`Found ${posts.length} posts in drip-release categories.`);

  const daysPerPost = 7 / POSTS_PER_WEEK;
  const now = new Date();

  const updates = posts.map((post, i) => {
    const dayOffset = Math.floor(i * daysPerPost);
    const scheduledDate = new Date(now);
    scheduledDate.setDate(scheduledDate.getDate() + dayOffset);
    const publishedAt = randomBusinessTime(scheduledDate).toISOString();
    return { id: post.id, slug: post.slug, publishedAt };
  });

  const totalWeeks = (updates[updates.length - 1] ? Math.ceil((updates.length * daysPerPost) / 7) : 0);
  console.log(`Scheduling at ${POSTS_PER_WEEK}/week — full backlog releases over ~${totalWeeks} weeks.\n`);

  let ok = 0, fail = 0;
  for (const { id, slug, publishedAt } of updates) {
    if (DRY_RUN) {
      console.log(`  [dry-run] ${slug} -> published_at: ${publishedAt}`);
      continue;
    }
    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ published_at: publishedAt })
      .eq("id", id);
    if (updateError) {
      console.error(`  ✗ ${slug}: ${updateError.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${slug} -> ${publishedAt}`);
      ok++;
    }
  }

  console.log(`\nDone — ${ok} scheduled, ${fail} failed.\n`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
