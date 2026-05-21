import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local without requiring dotenv
function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const contents = readFileSync(envPath, "utf-8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.local missing — rely on shell environment
  }
}
loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_USER = "seed-admin";
const NOW = new Date().toISOString();

function readTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

// ---------------------------------------------------------------------------
// POST CONTENT
// ---------------------------------------------------------------------------

const POST1_CONTENT = `Your last campaign had a 22% open rate. That's decent. But your pipeline didn't move. Conversions were flat. And when you tried to pull attribution data, three different tools gave you three different answers.

Sound familiar? The problem almost certainly isn't your copy, your offer, or your timing. It's your data.

Data quality for marketing operations is one of the most under-diagnosed causes of underperforming campaigns — and one of the most fixable. This guide breaks down exactly what's going wrong, why it costs you more than you think, and how to fix it without a data engineering team.

## What Bad Marketing Data Actually Looks Like

Most marketing teams don't realize they have a data quality problem. They see symptoms: unusually low click-through rates, email bounces that creep up each quarter, attribution reports that don't add up, and lead scoring that keeps flagging the wrong accounts.

The root cause is almost always the same: dirty CRM data that has accumulated over months or years without any systematic cleaning.

Bad marketing data shows up in a few predictable forms:

- **Duplicate contact records** — the same person appears as "John Smith", "john.smith@acme.com", and "J. Smith" in three separate records
- **Invalid or decayed email addresses** — addresses that were real 18 months ago but have since bounced or gone dormant
- **Inconsistent field values** — job titles entered as "VP Marketing", "VP of Marketing", "vp mktg", and "Vice President, Marketing" — all meaning the same thing, but impossible to segment reliably
- **Missing attribution fields** — UTM parameters not captured, source fields left blank, or campaign names formatted differently across tools
- **Stale firmographic data** — company size, industry, or revenue ranges that were true when the lead entered but are now 2 years out of date

Any one of these is annoying. All of them together — which is the typical state of a CRM that's been in use for more than 12 months — quietly sabotage every campaign you run.

### The Real-World Example: SaaS Marketing Ops Team

A mid-size SaaS company with a 40,000-contact HubSpot database ran a Q4 pipeline acceleration campaign. The campaign targeted "VP and Director-level contacts at companies with 50–500 employees in the financial services sector."

The email went to 8,200 contacts. Bounce rate: 6.4%. Open rate: 11%. Meetings booked: 12.

Post-mortem analysis revealed:

- **18% of contacts had no job title** — they were included in the "VP/Director" segment by default
- **2,300 email addresses** had last engagement dates over 24 months ago — effectively dead addresses
- **Company size data** was missing for 31% of records — those contacts were included because the filter defaulted to "unknown = include"
- **Duplicate records** inflated the list by roughly 900 contacts — some people received the email twice

The list wasn't 8,200 qualified contacts. It was closer to 3,500 — padded out with dead weight that tanked deliverability and skewed every reporting metric.

This is what bad CRM data quality looks like in practice. It doesn't announce itself. It just quietly inflates your list size while deflating your results.

## The Hidden Revenue Cost of Marketing Data Problems

Industry estimates from IBM and Gartner consistently put the cost of bad data at between 15% and 25% of revenue for companies that don't actively manage data quality. For marketing teams specifically, the costs cluster around three areas.

**Wasted campaign spend.** Every email sent to an invalid address or unqualified contact is a small waste. Multiply it across thousands of sends, paid re-targeting audiences built from dirty CRM exports, and ABM campaigns targeting the wrong company-size tier — and the number grows fast.

**Broken attribution.** When your UTM data is inconsistent and your contact records have missing source fields, you can't reliably measure what's working. You end up making budget decisions on incomplete signal. Teams that can't attribute spend accurately tend to over-invest in channels that look good in first-touch reports and under-invest in channels that drive actual pipeline.

**Lost credibility with sales.** When marketing passes leads with bad phone numbers, wrong companies, or stale email addresses, sales stops trusting the data. That trust gap is expensive — it creates friction, slows follow-up, and eventually turns into a political problem that no amount of data cleaning can fix retroactively.

For a deeper look at the cost calculation, [see how much bad data is actually costing you](/blog/how-bad-data-costs-your-business-money).

### Attribution Breaks When Your Data Is Dirty

Attribution is fundamentally a data joining problem. You're trying to connect a contact record in your CRM with a touchpoint in your analytics tool, an ad click in your paid media platform, and an opportunity in your pipeline.

If the contact record has an inconsistent email address format, a missing company name, or a duplicate entry — the join fails. The touchpoint doesn't get attributed. The campaign looks like it didn't work. You cut the budget.

This is why data quality for marketing operations isn't just a hygiene issue. It's a strategic issue. Your ability to make good budget decisions depends directly on the accuracy of your data.

## The 5 Most Common Marketing Data Quality Issues

**1. Email address decay.** Contacts change jobs, abandon old email addresses, and set up catch-all filters. Industry estimates suggest roughly 22–25% of email addresses go stale every year (ZeroBounce, 2023). A list you haven't validated in 18 months could have a bad address rate above 30%.

**2. Duplicate contact records.** Duplicates typically represent 10–30% of CRM records in systems older than 2 years (Experian Data Quality). Each duplicate means split engagement history, split lead scores, and inconsistent segmentation.

**3. Inconsistent field values.** Job titles, industries, company sizes, and country names entered freehand by reps or imported from third-party sources without normalization. Segmentation built on these fields is unreliable by definition.

**4. Missing required fields.** Contacts that made it into your CRM without completing required fields — usually because a form validation was bypassed, an import skipped validation, or a manual entry was rushed.

**5. Stale firmographic data.** Company data that was accurate at the point of capture but hasn't been refreshed. Especially problematic for ABM campaigns and account-tier segmentation.

If you're seeing a bounce rate above 2% on a warmed list, that's a strong signal that issues 1 and 2 are already serious. [Fix your bounce rate](/blog/email-bounce-rate-fix) before your next send.

## How to Find and Fix Marketing Data Quality Problems (Step-by-Step)

The good news: you don't need a data engineering team or an enterprise data governance platform to tackle this. You need a structured process and the right tool to surface the problems quickly.

### Step 1: Profile Your Contact Database

Before you can fix anything, you need to see what you're working with. Export your core contact list from your CRM as a CSV file (name, email, job title, company, source, last engagement date, lead score — whatever fields you actually use for segmentation).

Then profile it. Profiling means analyzing each column for completeness (what % of records have a value?), uniqueness (how many duplicate values?), validity (do formats match expected patterns?), and value distribution (what are the most common values?).

[Sohovi](https://sohovi.com) lets you upload your CSV and get an instant data quality report — no setup, no code required. It runs in your browser, so your contact data never leaves your machine.

What you're looking for: columns with high null rates, email columns with formatting anomalies, job title columns with hundreds of distinct values (a sign of freehand entry without normalization), and duplicate email addresses. To understand [what data profiling looks like](/blog/what-is-data-profiling), see our plain-English guide.

### Step 2: Validate Email Addresses Before Every Send

Email validation is the single highest-ROI data quality action for marketing ops teams. Before any campaign send, run your list through a validation check that flags:

- Syntax errors (missing @ symbol, invalid domain format)
- Disposable email addresses (one-time inboxes used to bypass forms)
- Role-based addresses (info@, sales@, support@ — these often bounce or aren't engaged with by an individual)
- Hard bounce history in your ESP

Most ESPs will show you bounce history, but they won't tell you about addresses that are technically valid but will never engage. Combine your ESP's bounce data with an upfront validation pass to [validate your list before every send](/blog/validate-email-list-before-campaign).

### Step 3: Deduplicate Your CRM Records

Run a deduplication pass before any major campaign. Look for exact matches on email address first — those are unambiguous duplicates. Then look for fuzzy matches on name + company (e.g., "Jon Smith at Acme" and "Jonathan Smith at Acme Corp" are probably the same person).

Most CRMs have built-in merge tools for exact duplicates. Fuzzy duplicates typically require exporting to a spreadsheet or using a dedicated deduplication tool.

### Step 4: Standardize Your UTM and Campaign Fields

Attribution breaks happen at the source. Before your next campaign, audit your UTM naming conventions. Make sure every link uses the same format for utm_source, utm_medium, and utm_campaign values — lowercase, no spaces, consistent abbreviations.

If you're importing campaign data from a third-party tool, run a quick format check on the campaign name field before the import. Inconsistent values in this field are invisible until you pull an attribution report — then they surface as "(not set)" or dozens of slight variations of the same campaign name.

### Step 5: Set Up Ongoing Monitoring (Not One-Time Fixes)

A one-time data cleanup feels good. It doesn't stay clean. The most effective marketing ops teams treat data quality as a continuous process, not a project:

- Run an email validation pass before every send above a certain size threshold
- Set a quarterly reminder to profile your core CRM segments
- Add a data quality checkpoint to your campaign launch checklist
- Review your top 5 segments' completeness rates monthly

[Revenue ops teams face the same problem](/blog/data-quality-for-revenue-operations) — and the teams that solve it establish continuous quality checks at the pipeline level, not just at campaign launch.

## Marketing Data Quality Checklist

Apply this checklist before every major campaign and quarterly for your full database:

**Pre-campaign (every time):**

- Email addresses validated for syntax errors and disposable domains
- Bounce list from last campaign suppressed
- Segment filters reviewed — confirm no "null = include" behavior
- UTM parameters tested and formatted consistently
- Duplicate records checked for key segment

**Quarterly database audit:**

- Export core contact list and profile completeness by column
- Identify columns with >15% null rate — flag for remediation
- Run deduplication pass on email + name fields
- Review job title and industry field — check for normalization issues
- Validate firmographic data freshness for ABM target accounts
- Check last engagement date distribution — flag dormant segments

**After any data import:**

- Validate email column before import (not after)
- Confirm field mapping matches expected formats
- Run row-count check post-import to detect silent failures
- Check for duplicates introduced by the import

## Why Traditional Tools Fall Short

Enterprise data quality platforms — Informatica, Talend, IBM DataStage — are built for data engineering teams managing petabyte-scale pipelines. They cost tens of thousands of dollars, require months of implementation, and need a dedicated engineer to operate.

Marketing ops teams need something different: a fast, no-setup tool that can profile a 50,000-row CRM export in 30 seconds and surface actionable problems without a SQL query.

That's exactly what Sohovi is built for. Upload your CSV, get an instant quality report on completeness, duplicates, format issues, and potential PII — entirely in your browser. No IT ticket, no setup, no data leaving your machine.

## What to Do Next

You don't need to fix everything at once. Start with the highest-impact action for your next campaign:

1. **Export your email segment and run a validation pass** — this alone can cut your bounce rate in half
2. **Profile your contact list for null rates** — you'll see immediately which fields are too incomplete to segment on reliably
3. **Deduplicate before your next ABM campaign** — inflated target lists skew every metric you report

If you're ready to stop diagnosing campaigns that should have worked, [try Sohovi free](https://sohovi.com) — upload your CSV and see your data quality score in under a minute. No credit card, no code, no setup required.`;

const POST2_CONTENT = `If your email bounce rate is over 2%, you're not just losing deliverability — you're signaling to Gmail, Outlook, and other inbox providers that your list is unclean. That signal compounds. The longer you send to bad addresses, the lower your inbox placement rate falls for everyone on your list, including the healthy addresses.

Here's exactly what to do.

## Why Bounce Rate Matters More Than Open Rate

A 2% hard bounce rate sounds small. But email providers use bounce rates as a primary trust signal. Industry best practice (per Mailchimp, Klaviyo, and Constant Contact) is to keep hard bounces below 2% and total bounces (hard + soft) below 5%.

Once you cross those thresholds consistently, your sender reputation degrades. Emails start landing in spam — not just for the bad addresses, but for everyone. Your open rate drops not because your subject lines got worse, but because inbox placement got worse.

## Step 1: Separate Hard Bounces from Soft Bounces

Hard bounces = permanent delivery failures (address doesn't exist, domain doesn't exist). Remove these from your list immediately. Never send to a hard bounce address again.

Soft bounces = temporary failures (inbox full, server temporarily down). Soft bounces on 2–3 consecutive sends should be treated the same as hard bounces.

Most ESPs automatically suppress hard bounces. Check your suppression list to make sure it's active and being applied to all sends.

## Step 2: Identify the Source of Bad Addresses

Pull your hard bounce list and look for patterns:

- Are they concentrated in one import or one time period? (Suggests a bad list source)
- Are they clustered in one domain? (Suggests a company domain that's changed)
- Are they contacts with no engagement history? (Suggests they were never valid)

This pattern analysis tells you whether you have a historical problem (bad data from old imports) or an ongoing problem (new contacts entering with bad addresses). The fix is different for each.

## Step 3: Validate Your Current Active List

Before your next send, run your full active list through an email validation check. You're looking for:

- Syntax errors (malformed addresses that somehow bypassed form validation)
- Disposable email domains (Mailinator, TempMail, etc.)
- Role addresses (info@, noreply@) that are technically valid but indicate non-individual inboxes

[Learn how to validate your list before every campaign launch](/blog/validate-email-list-before-campaign) for a full step-by-step process.

## Step 4: Fix the Root Cause

Cleaning your list solves today's problem. Preventing tomorrow's requires fixing where the bad data enters:

- Add real-time email validation to your sign-up forms
- Set a validation checkpoint on any import workflow
- Require double opt-in for cold outreach lists

## Step 5: Monitor the Trend, Not Just the Number

One high-bounce send doesn't define your sender reputation. A consistent pattern of high bounces does. Set up a monthly review of your bounce rate trend — if it's creeping up quarter over quarter, you have a data quality problem that will keep returning until you address the list hygiene upstream.

[Run a full marketing database profile](/blog/data-quality-for-marketing-operations) to see your complete data quality picture — not just bounces, but duplicates, null rates, and format issues across every segment field.

A tool like Sohovi lets you upload your contact CSV and instantly see which rows and columns have quality issues — completeness rates, format anomalies, and duplicate email addresses — all in your browser, with no data uploaded to a server.

The bounce rate is a symptom. Clean data is the cure.`;

const POST3_CONTENT = `If you've ever opened a spreadsheet someone handed you and thought "I have no idea what's in here" — you've already felt the problem that data profiling solves.

Data profiling is the process of examining a dataset to understand its structure, content, and quality before you use it. Think of it like a health check for your data. Before you trust a dataset — whether it's a CSV export from your CRM, a vendor file, or a database table — profiling tells you what's actually in it.

## What Data Profiling Actually Tells You

A data profile answers five core questions about each column in your dataset:

**1. Completeness** — What percentage of rows have a value in this column? A column that's 60% empty is unreliable for filtering or analysis.

**2. Uniqueness** — How many distinct values exist? Are there duplicates? An email column that's 85% unique in a "customers" table suggests significant duplicate records.

**3. Validity** — Do the values match expected formats or patterns? Phone numbers that include letters, dates formatted as text, or emails missing the @ symbol are validity failures.

**4. Value distribution** — What are the most common values? An "industry" column with 400 distinct values (when you expected 20) signals that freehand text entry was used instead of a controlled picklist.

**5. Data type consistency** — Is the column actually storing what it's supposed to? A "revenue" column containing text strings like "N/A" or "$1.2M" instead of numbers will break any calculation that uses it.

## Why Profiling Matters Before You Use Data

Most data quality problems are invisible until they break something. A column looks full until you realize 30% of its values are "N/A" or a single space. A deduplication pass looks clean until you run a profile and find 800 near-duplicate email variations.

Profiling is the step that makes the invisible visible — before you build a campaign segment on a field that's 40% empty, or before you import a file that will create 2,000 duplicate records.

## Who Uses Data Profiling

Data profiling is most commonly used by:

- **Marketing ops teams** checking CRM exports before a campaign send — [see the full guide for marketing ops](/blog/data-quality-for-marketing-operations)
- **Analysts** validating a dataset before building a report
- **Operations managers** auditing an inherited spreadsheet or vendor file
- **Anyone doing a data migration** — profiling the source file before moving data to a new system is essential

## How to Profile a Dataset Without Enterprise Software

Enterprise data profiling tools (IBM Watson Knowledge Catalog, Talend Data Catalog) are built for data engineers managing warehouse-scale systems. They're overkill — and far too expensive — for a single CSV file or a monthly CRM export.

Sohovi is designed for exactly this: upload a CSV or Excel file, get an instant profile of every column — completeness rate, unique value count, format anomalies, and potential PII — entirely in your browser. Your data never leaves your machine. There's no setup, no code, no IT ticket.

For a practical look at what profiling uncovers, see [how bad data actually costs your business money](/blog/how-bad-data-costs-your-business-money).

The most common feedback from first-time profiling users: "I had no idea that column was only 60% complete." That surprise is the entire value of profiling. See the problem before it costs you.`;

const POST4_CONTENT = `The single most preventable campaign failure in email marketing is sending to an unvalidated list. Here's a step-by-step process to validate your email list before every campaign — no coding required.

## Why Validation Before Every Send Matters

Email addresses decay at roughly 22–25% per year (ZeroBounce, 2023 industry data). A list you built 12 months ago could have a 20%+ invalid address rate today — even if you've never had a bounce problem before.

Sending to invalid addresses drives up your hard bounce rate. A bounce rate above 2% triggers deliverability penalties from inbox providers. Once your sender reputation degrades, your open rates drop for your entire list — including the healthy addresses.

Validation before send is insurance. It takes 10 minutes and prevents weeks of reputation recovery.

## Step 1: Export Your Segment as a CSV

Export only the contacts you're planning to send to. Don't validate your entire database every time — validate the specific segment. Narrow lists run faster and flag issues more clearly.

## Step 2: Check for Syntax Errors First

Look for obvious formatting problems in the email column:

- Missing @ symbol
- Double @ symbols
- Spaces inside the address
- Domain with no TLD (.com, .org, .io, etc.)

These are almost always caught by form validation — but imports and manual data entry bypass form validation regularly. [A full data profile](/blog/what-is-data-profiling) will surface these instantly.

## Step 3: Flag Role-Based and Disposable Addresses

Role-based addresses (info@, admin@, noreply@, support@) rarely belong to an individual. They often route to shared inboxes or ticketing systems. They technically "receive" email but rarely produce engagement — and some will hard bounce.

Disposable addresses (Mailinator, Guerrilla Mail, TempMail) were created specifically to avoid real contact. Remove both categories before your send.

## Step 4: Cross-Reference Your Suppression List

Your ESP maintains a suppression list of prior hard bounces, unsubscribes, and spam complaints. Before every send, confirm your segment has been checked against this list. Most ESPs do this automatically — but if you're using a third-party send tool or an imported list, double-check.

## Step 5: Check Last Engagement Date

Technically valid addresses that haven't engaged in 12+ months are high-risk. Many have become spam traps (abandoned email addresses repurposed by ISPs to catch bulk senders). Segment these contacts out of your main send, or run a re-engagement campaign before including them in a standard blast.

For a broader view of all the data quality issues that affect campaign performance — not just email validity, but duplicates, missing fields, and attribution gaps — see the [full guide to data quality for marketing operations](/blog/data-quality-for-marketing-operations).

Sohovi lets you upload your contact CSV and instantly see your email column's validity rate — syntax errors, format anomalies, and duplicate addresses — entirely in your browser. Upload your list and see your results before your next send.`;

const POST5_CONTENT = `Revenue operations runs on data. Pipeline forecasts, quota attainment analysis, territory planning, win/loss reporting — every RevOps output is only as reliable as the underlying data it's built on.

The problem most RevOps teams have isn't lack of data. It's that their CRM, their marketing automation platform, and their product analytics tool each have a slightly different version of the truth — and reconciling them takes hours every week.

That's a data quality problem.

## What Data Quality Means for RevOps

Data quality for revenue operations has four critical dimensions:

**Completeness** — Are the fields your models depend on actually populated? A forecast model built on deal stage + close date + ARR breaks down if 25% of opportunities have no close date.

**Consistency** — Does "Closed Won" mean the same thing in Salesforce as it does in your BI tool? If your CRM admin and your data analyst have different definitions mapped to the same status values, your reports will never match.

**Accuracy** — Is the data reflecting reality? Stale contact roles, wrong company sizes, deal values that haven't been updated since the opportunity was created — these create forecast inflation that doesn't show up until the quarter closes.

**Uniqueness** — Duplicate accounts, duplicate contacts, and duplicate opportunities in your CRM create ghost pipeline. Every deduplication pass finds deals that were counted twice.

## The Most Expensive RevOps Data Problem: Stale Pipeline

Industry estimates suggest that 20–35% of open pipeline in a typical CRM is "zombie pipeline" — opportunities that should have been closed or disqualified months ago but are still showing as active (Clari, 2022 Pipeline Benchmark).

Zombie pipeline inflates your forecast, skews your win rate calculation, and makes it impossible to accurately project close rates. It's a data quality problem masquerading as a forecasting problem.

The fix isn't a better forecasting model. It's a data quality audit of your open pipeline.

## A Practical RevOps Data Quality Audit

**Step 1:** Export your open pipeline as a CSV. Include deal name, amount, stage, close date, last activity date, and contact role.

**Step 2:** Profile the export. Look for:

- Close dates in the past (how much of your "open" pipeline has already missed its close date?)
- Missing contact roles (opportunities with no primary contact are almost always stale)
- Last activity dates older than 30 days in early pipeline stages
- Duplicate account names (fuzzy match — "Acme Corp" and "Acme Corporation" should be one account)

**Step 3:** Flag and remediate. Work with your sales team to close or disqualify stale deals before the next forecast call. This is uncomfortable the first time. It makes your pipeline number more accurate and your forecast far more reliable.

Marketing ops teams deal with the same upstream data problems. [See how data quality affects the full marketing ops stack](/blog/data-quality-for-marketing-operations) — a lot of the root causes are shared.

Sohovi is useful for exactly the kind of CSV-based audit described above. Upload your pipeline export, get an instant profile showing close date completeness, duplicate account names, and missing required fields — all in your browser.

The most effective RevOps teams don't just clean data when it becomes a problem. They profile their pipeline data weekly as a standing operational check — and catch issues before they reach the forecast meeting.`;

const POST6_CONTENT = `Bad data has a cost. It's not abstract. It shows up in real dollars — in campaigns that don't convert, reports that require manual correction, deals that close late because a contact's phone number was wrong, and compliance fines for data that should have been cleaned before it was used.

IBM estimated the annual cost of poor data quality in the United States alone at $3.1 trillion (IBM, 2016). Gartner puts the average organization's cost at $12.9 million per year. Industry estimates vary, but they all point in the same direction: bad data is expensive.

Here's where those costs actually live — for small and mid-size businesses specifically.

## Direct Campaign Waste

Every email sent to an invalid address costs money. The send itself is cheap. The downstream costs aren't:

- Deliverability penalties that tank open rates for your entire list (not just the bad addresses)
- Paid re-targeting audiences built from CRM exports that include duplicates and invalid records
- ABM campaigns targeting the wrong company-size tier because firmographic data was never updated

For marketing ops teams specifically, [data quality issues are the most common cause of underperforming campaigns](/blog/data-quality-for-marketing-operations) — not creative, not timing.

## Time Cost: The Hidden Multiplier

The most underestimated cost of bad data isn't the direct spend. It's the time your team spends working around it.

- An analyst who spends 4 hours a week reconciling mismatched reports between tools is spending 200 hours a year on a problem that shouldn't exist
- A RevOps manager who manually cleans a pipeline export before every forecast call is spending 2 hours per week — 100 hours per year — on data janitorial work
- A marketing ops manager who has to re-segment every list before a send because the CRM fields are unreliable is adding a full day to every campaign cycle

At fully-loaded staff costs, these hours add up fast. The "free" CRM your team uses isn't free when bad data means someone spends 20% of their time cleaning instead of building.

## Compliance Risk

If you handle customer data — and if you're in marketing ops, you almost certainly do — data quality failures carry compliance risk. GDPR and CCPA both include requirements around data accuracy. Sending email marketing to an address where the person has requested deletion, or using data that's materially inaccurate in a regulated context, creates liability.

Most small businesses don't face GDPR enforcement. But the trend is toward stricter data accuracy requirements, not looser ones. Building a clean data practice now costs far less than a retroactive cleanup after a compliance issue.

## The Fix Doesn't Require Enterprise Software

Most companies assume fixing data quality requires expensive tools, IT involvement, or a dedicated data team. It doesn't — not at the scale most small and mid-size businesses operate.

[What data profiling actually shows you](/blog/what-is-data-profiling) is a complete picture of which fields have problems, how severe they are, and where to start. Running that profile on your most important dataset takes minutes, not months.

Sohovi is built for exactly this use case: upload a CSV, get an instant quality score and breakdown — completeness, duplicates, format issues, potential PII — in your browser. No setup. No code. No IT team. Try it free at [sohovi.com](https://sohovi.com).

The first step isn't a year-long data governance project. It's uploading your most important spreadsheet and seeing what's actually in it.`;

// ---------------------------------------------------------------------------
// POSTS ARRAY
// ---------------------------------------------------------------------------

const posts = [
  {
    title: "Data Quality for Marketing Operations: Why Your Campaigns Are Underperforming (And How to Fix It)",
    slug: "data-quality-for-marketing-operations",
    excerpt: "Bad CRM data silently kills marketing ROI. Learn how to find, fix, and prevent data quality problems that hurt campaigns, attribution, and revenue.",
    content: POST1_CONTENT,
    category: "Marketing Operations",
    tags: ["marketing ops", "CRM data quality", "email marketing", "attribution", "data profiling"],
    seo_title: "Data Quality for Marketing Operations: Fix Campaigns, Attribution & CRM Data",
    seo_description: "Bad CRM data silently kills marketing ROI. Learn how to find, fix, and prevent data quality problems that hurt campaigns, attribution, and revenue.",
    published: true,
  },
  {
    title: "Email Bounce Rate Over 2%? Here's Exactly What to Do Next",
    slug: "email-bounce-rate-fix",
    excerpt: "A bounce rate above 2% damages your sender reputation for your entire list — not just the bad addresses. Here's the exact fix, step by step.",
    content: POST2_CONTENT,
    category: "Email Marketing",
    tags: ["email bounce rate", "email list quality", "email validation", "deliverability"],
    seo_title: "Email Bounce Rate Over 2%? Step-by-Step Fix for Marketing Teams",
    seo_description: "A bounce rate above 2% damages your sender reputation for your entire list. Here's the exact step-by-step fix — no technical expertise needed.",
    published: true,
  },
  {
    title: "What Is Data Profiling? A Plain-English Guide for Non-Technical Users",
    slug: "what-is-data-profiling",
    excerpt: "Data profiling tells you what's actually in your dataset — completeness, duplicates, format issues — before it breaks a report or a campaign segment.",
    content: POST3_CONTENT,
    category: "Data Quality Fundamentals",
    tags: ["data profiling", "CSV analysis", "data quality", "no-code"],
    seo_title: "What Is Data Profiling? A Plain-English Guide for Non-Technical Users",
    seo_description: "Data profiling reveals what's really in your dataset — completeness gaps, duplicates, format errors — before they break a report or campaign.",
    published: true,
  },
  {
    title: "How to Validate Your Email List Before a Campaign Launch",
    slug: "validate-email-list-before-campaign",
    excerpt: "Email lists decay at 22–25% per year. Sending without validation drives up bounces and damages deliverability. Here's a 5-step validation process.",
    content: POST4_CONTENT,
    category: "Email Marketing",
    tags: ["email validation", "email list", "campaign prep", "marketing data"],
    seo_title: "How to Validate Your Email List Before a Campaign (5-Step Process)",
    seo_description: "Email lists decay at 22–25% per year. Validate before every send to protect deliverability — here's a step-by-step process, no coding needed.",
    published: true,
  },
  {
    title: "Data Quality for Revenue Operations: Clean Data, Better Forecasting",
    slug: "data-quality-for-revenue-operations",
    excerpt: "Zombie pipeline, mismatched CRM fields, and stale deal data corrupt every forecast. Here's how RevOps teams audit and clean their data fast.",
    content: POST5_CONTENT,
    category: "Revenue Operations",
    tags: ["revenue ops", "CRM data quality", "forecasting", "sales data"],
    seo_title: "Data Quality for Revenue Operations: Fix Pipeline Data for Better Forecasts",
    seo_description: "Zombie pipeline and stale deal data corrupt every forecast. Learn how RevOps teams audit CRM data quality and fix it without enterprise tools.",
    published: true,
  },
  {
    title: "How Bad Data Is Costing Your Business Money (With Real Numbers)",
    slug: "how-bad-data-costs-your-business-money",
    excerpt: "IBM estimates bad data costs $3.1 trillion annually in the US. Here's where those costs show up for small and mid-size businesses — and what to do.",
    content: POST6_CONTENT,
    category: "Business Impact",
    tags: ["data quality ROI", "bad data cost", "business impact", "data errors"],
    seo_title: "How Bad Data Costs Your Business Money: Real Numbers for SMBs",
    seo_description: "Bad data costs IBM-estimated $3.1 trillion annually. Here's where those costs show up for small businesses — and how to fix it without enterprise tools.",
    published: true,
  },
];

// ---------------------------------------------------------------------------
// SEED
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`\nSeeding ${posts.length} blog posts into Supabase...\n`);

  let ok = 0;
  let fail = 0;

  for (const post of posts) {
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

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
