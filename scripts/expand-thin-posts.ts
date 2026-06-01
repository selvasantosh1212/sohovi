/**
 * Expands thin blog posts (<800 words) in Supabase to meet SEO minimum word counts.
 * Run with: ANTHROPIC_API_KEY=your_key npx ts-node scripts/expand-thin-posts.ts
 *
 * Follows blogposts.md content rules:
 * - "What Is" / Glossary: 900–1,300 words
 * - How-To / Step-by-Step: 1,500–2,500 words
 * - Comparison / "vs.": 1,200–2,000 words
 * - Problem-aware / FAQ: 800–1,400 words
 * - Industry / role use case: 1,200–2,000 words
 * - SMB scenario / story-driven: 1,000–1,800 words
 */

import Anthropic from "@anthropic-ai/sdk";

const SUPABASE_URL = "https://bcginhamyaevilukcwsy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("Set ANTHROPIC_API_KEY environment variable");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  post_type: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
}

function getTargetWordCount(postType: string, title: string): number {
  const t = title.toLowerCase();
  if (t.startsWith("what is") || t.includes("glossary")) return 1100;
  if (postType === "how-to" || t.startsWith("how to") || t.startsWith("how ")) return 1600;
  if (t.includes(" vs ") || t.includes(" vs.")) return 1400;
  if (t.includes("faq") || t.includes("?")) return 1000;
  return 1100; // default
}

async function fetchThinPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=id,slug,title,content,category,post_type,seo_title,seo_description,tags&limit=${limit}&offset=${offset}`,
      { headers: SUPABASE_HEADERS }
    );
    const data: Post[] = await res.json();
    if (!data.length) break;

    for (const p of data) {
      const wc = (p.content || "").split(/\s+/).length;
      if (wc < 800) posts.push(p);
    }

    offset += limit;
    if (data.length < limit) break;
  }

  // Sort by word count ascending (thinnest first)
  posts.sort((a, b) => a.content.split(/\s+/).length - b.content.split(/\s+/).length);
  return posts;
}

async function expandPost(post: Post): Promise<string> {
  const targetWords = getTargetWordCount(post.post_type, post.title);
  const currentWords = post.content.split(/\s+/).length;

  const systemPrompt = `You are an expert content writer for Sohovi, a data quality tool for small businesses.

RULES (must follow exactly):
- Write in plain English for non-technical small business owners
- Short paragraphs: max 4-5 sentences each
- No filler openers ("In today's world", "Data is the new oil")
- No fabricated statistics — hedge with "industry estimates suggest" or cite IBM/Gartner/ZeroBounce/Experian
- Max 2 Sohovi mentions per post: one soft CTA mid-post, one hard CTA at end
- DO NOT mention any specific competitor brand names (Collibra, Alation, Informatica, Talend, Tableau, Looker, etc.) — use generic terms like "enterprise data governance platforms"
- Use markdown for H2 (##) and H3 (###) headings
- Primary keyword must appear in H1, first paragraph, and at least one H2
- End with a hard CTA directing to Sohovi

SOHOVI CTAs (use these exactly):
- Soft (mid-post): "[Sohovi](https://sohovi.com) lets you upload your CSV and get an instant data quality report — no setup, no code required."
- Hard (end): "If you're ready to stop guessing about your data quality, [Sohovi](https://sohovi.com) is built for exactly this. Upload your first CSV free — no credit card, no IT team, no code needed."`;

  const userPrompt = `Expand this blog post from ${currentWords} words to approximately ${targetWords} words.

Title: ${post.title}
Category: ${post.category}

EXISTING CONTENT (keep all of this, expand it with more depth, examples, and actionable steps):
${post.content}

Requirements:
- Keep all existing headings and content — only ADD to them, do not remove anything
- Add concrete examples, real-world scenarios, and step-by-step details
- Add 2-3 new H2 sections that cover related angles the existing post misses
- Make every section genuinely helpful and actionable
- Return only the final expanded markdown content (no frontmatter, no meta description)`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  return (message.content[0] as { type: string; text: string }).text;
}

async function patchPost(id: string, content: string, readTimeMin: number): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`, {
    method: "PATCH",
    headers: SUPABASE_HEADERS,
    body: JSON.stringify({ content, read_time_min: readTimeMin }),
  });
}

async function main() {
  console.log("Fetching thin posts from Supabase...");
  const posts = await fetchThinPosts();
  console.log(`Found ${posts.length} posts under 800 words\n`);

  const startFrom = parseInt(process.env.START_FROM || "0");
  const batchSize = parseInt(process.env.BATCH_SIZE || "10");
  const batch = posts.slice(startFrom, startFrom + batchSize);

  console.log(`Processing batch: posts ${startFrom + 1}–${startFrom + batch.length} of ${posts.length}\n`);

  let success = 0;
  let failed = 0;

  for (const post of batch) {
    const beforeWc = post.content.split(/\s+/).length;
    process.stdout.write(`Expanding: ${post.slug} (${beforeWc}w → target ${getTargetWordCount(post.post_type, post.title)}w)... `);

    try {
      const expanded = await expandPost(post);
      const afterWc = expanded.split(/\s+/).length;
      const readTime = Math.ceil(afterWc / 200);

      await patchPost(post.id, expanded, readTime);
      console.log(`✅ ${afterWc}w (read: ${readTime}min)`);
      success++;

      // Rate limit: 1 second between API calls
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`❌ ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`);
  console.log(`Next batch: START_FROM=${startFrom + batchSize} BATCH_SIZE=${batchSize} npx ts-node scripts/expand-thin-posts.ts`);
}

main().catch(console.error);
