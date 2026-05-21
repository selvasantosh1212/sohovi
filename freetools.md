# Sohovi Free Tools — Strategy & Specifications

## Strategic Purpose

Each free tool is an SEO-optimized landing page targeting a specific search query. Users arrive via Google search, get immediate value with zero friction (no signup, no limits, data never leaves the browser), and are shown a clear upgrade path to Sohovi paid.

**These are acquisition tools** — the equivalent of HubSpot's website grader or Canva's color palette generator. They pull in cold traffic from people who have never heard of Sohovi and funnel them toward account creation.

### Free Tools vs. Sohovi Free Tier

| | Sohovi Free Tier | Free Tools |
|---|---|---|
| Requires signup | Yes | No |
| Entry point | Existing users | Cold search traffic (SEO) |
| UX | Full product: hierarchy, history, rules | Single-purpose microtools |
| Purpose | Use the product | Discover the product |
| Data stored | DQ scores in Supabase | Nothing — 100% in-browser |

---

## Overlap with Core Sohovi — Analysis & Decision

The free tools intentionally overlap with core Sohovi. The question is not "does overlap exist?" — it's "is the gap visible?" Each tool is a controlled preview: the user gets the insight, Sohovi gives them the system.

| Tool | Overlap Level | Why it's fine |
|---|---|---|
| Tool 1 — CSV Quality Score Card | HIGH — intentional | It IS the product, lite. 4 dims free vs. 10 dims paid. Gap must be visible in the UI. |
| Tool 2 — PII Finder | HIGH — intentional | `lib/profiling/pii-detector.ts` already exists in core. Just repackage it. Masking/redaction is the paid hook. |
| Tool 3 — Completeness Visualizer | MEDIUM | Completeness is 1 of 10 Sohovi dims. The heatmap format doesn't exist in core — genuine novelty. |
| Tool 4 — Date Standardizer | LOW-MEDIUM | Sohovi DETECTS format issues (conformity dim). This tool FIXES them — a capability core doesn't have. |
| Tool 5 — Name Deduplicator | LOW | Sohovi does exact-duplicate detection. This does fuzzy/semantic (Jaro-Winkler). Genuinely different. |
| Tool 6 — Email Quick-Check | MEDIUM | Sohovi infers email type. This adds MX record lookup + typo correction + unlimited rows. |

### Action per tool on making the gap visible
- **Tool 1:** Show "10 full dimensions available in Sohovi" as a grayed-out locked section below the 4 free dimensions
- **Tool 2:** Show "Auto-mask sensitive fields → Sohovi" as a locked CTA after the PII report
- **Tool 3:** Render a grayed-out "Score trend over time" line chart below the heatmap — "Track this in Sohovi"
- **Tools 4–6:** Gap is structural (permanent rules, SMTP verification, ongoing dedup) — call it out in the hard CTA

---

## Conversion Ideology — The Insight Gap Model

**Principle: Give everything free, sell the future.**

The free tool solves today's problem (find the issues). Sohovi solves the ongoing problem (track, alert, automate, remediate). The CTA never competes with the tool — it extends it.

### 3 rules
1. **Never block results** — full output, always, no teaser walls, no row limits
2. **Contextualize the gap** — CTA text is always specific to the user's actual results (dynamic numbers)
3. **Sell the future, not the present** — "Sohovi tracks this automatically" not "upgrade for more features"

### CTA structure on every tool page

```
[Upload → results delivered in full, no gates]
         ↓
[Soft CTA — inline, mid-results]
  Small teal pill, non-blocking
  e.g. "Track this score over time →"
         ↓
[Hard CTA — end-of-results panel]
  Headline: their actual result number
  Body: 3 specific things Sohovi paid adds
  Buttons: [Start free — it's quick] [See pricing]
         ↓
[Micro-prompt — below hard CTA, one line]
  "Want to save these results? Sign in free →"
  (link only, no modal)
```

### Dynamic conversion triggers per tool (use real numbers from the result)

- **Tool 1:** "Your data scored {score}/100. {n} columns have quality issues. Set a quality threshold and get alerted when it drops — [Start free in Sohovi]"
- **Tool 2:** "Found {n} PII fields ({types}) in your file. Upgrade to auto-mask sensitive columns on every run and generate a GDPR compliance report — [Start free in Sohovi]"
- **Tool 3:** "Your {worst_col} column is only {pct}% complete. Set a completeness threshold alert and track fill-rate over time — [Start free in Sohovi]"
- **Tool 4:** "Standardized {n} values across {k} format variants. Apply this as a permanent rule that runs automatically on every upload — [Start free in Sohovi]"
- **Tool 5:** "Found {n} duplicate vendor clusters across {total} names. Auto-merge clusters and track ongoing deduplication — [Start free in Sohovi]"
- **Tool 6:** "{n} invalid or suspicious email domains detected. Upgrade to SMTP delivery verification and get full bounce-rate prediction — [Start free in Sohovi]"

### What NOT to do
- No modals before or during results
- No row limits or teased/locked output
- No "sign in to see your results" gates
- No countdown timers or urgency tricks
- No generic "upgrade" language — always specific to what they found

### Soft lead capture (optional, non-pushy)
After the hard CTA, offer: **"Email yourself this report"** — user types their email, gets a PDF/link, and that email pre-fills the Clerk sign-up form if they click through. They get value (saved report), we get a lead. Zero friction.

---

## No-Signup Architecture

### Decision: Fully no-signup. All 6 tools are public, ungated.

All processing is already 100% browser-side in the existing codebase. No new infrastructure needed.

### Technical plan

**1. Open the routes — `proxy.ts`**

Add `/tools(.*)` to the `isPublicRoute` matcher. One-line change.

```ts
const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/blog(.*)",
  "/tools(.*)",   // ← add this
]);
```

**2. Route structure**

```
app/
  tools/
    layout.tsx              ← public layout: Sohovi nav + footer, no Clerk, no DashboardShell
    page.tsx                ← tools hub: all 6 tools listed, SEO-optimized
    csv-quality-score/
      page.tsx
    pii-finder/
      page.tsx
    completeness/
      page.tsx
    format-standardizer/
      page.tsx
    name-dedup/
      page.tsx
    email-checker/
      page.tsx
```

**3. Existing code to reuse directly (no changes needed)**

| Existing file | Reused by |
|---|---|
| `workers/file-parser.worker.ts` | All 6 tools — parses CSV upload |
| `workers/profiler.worker.ts` | Tools 1, 2, 3 — column profiling + PII + completeness |
| `workers/dq-runner.worker.ts` | Tool 1 — DQ scoring across dimensions |
| `workers/worker-bridge.ts` | All tools — typed worker spawn utility |
| `lib/profiling/pii-detector.ts` | Tool 2 — PII detection logic, exact reuse |
| `lib/profiling/profiler.ts` | Tools 1, 3 — column stats (null count, formats, uniqueness) |
| `lib/dq-engine/dimensions/completeness.ts` | Tool 1, 3 |
| `lib/dq-engine/dimensions/validity.ts` | Tool 1 |
| `lib/dq-engine/dimensions/uniqueness.ts` | Tool 1 |
| `lib/dq-engine/dimensions/conformity.ts` | Tool 1, 4 |

**4. No Supabase writes**

Free tools use React `useState` only. No Zustand stores. No Supabase calls. All state is ephemeral — gone on page reload. This is the design.

**5. New dependencies needed**

| Tool | Library | Purpose |
|---|---|---|
| Tool 5 — Name Dedup | `talisman` (npm) | Jaro-Winkler fuzzy matching, browser-compatible |
| Tool 6 — Email Check | none | MX lookup via `fetch` to `https://cloudflare-dns.com/dns-query` (DNS-over-HTTPS, no backend needed) |
| All — PDF report | `jspdf` + `jspdf-autotable` | Already in package.json from Session 6 |

**6. Tools layout — design spec**

- Top nav: Sohovi logo (links to `/`) + "Sign in" + "Start free" buttons (right side)
- No sidebar, no dashboard shell
- Color system: Navy #1E3A5F, Teal #00C9A7, Tailwind v4, same shadcn/ui components
- Each tool page: H1 → upload zone → results → soft CTA → hard CTA
- Mobile-responsive (single column on mobile)

---

## Shared Architecture

- **100% browser-side processing** using Web Workers (reuse `workers/` directory)
- **No signup required** to use any tool
- **No raw data sent to server** — data stays in the browser
- **URL pattern:** `/tools/[slug]`
- **CTA pattern:** Soft CTA mid-results, hard CTA at end of results
- **Design system:** Navy #1E3A5F, Teal #00C9A7, Tailwind v4, shadcn/ui

---

## Tool 1 — CSV Data Quality Score Card

**URL:** `/tools/csv-quality-score`
**Tagline:** "Upload your CSV. Get an instant data quality score."

### What it does
- User uploads a CSV file
- Browser runs DQ analysis across 4 dimensions:
  - **Completeness:** % non-null cells per column
  - **Validity:** type consistency per column (text in a number column = invalid)
  - **Uniqueness:** % duplicate rows
  - **Conformity:** format consistency per column (mixed date formats = low conformity)
- Returns: 0–100 DQ score, dimension breakdown, top issues list, downloadable PDF report
- No signup. No file size limits.

### Gap to show in UI
Below the 4 free dimensions, render a grayed-out locked panel:
> "Sohovi paid includes 6 more dimensions: Accuracy, Consistency, Integrity, Timeliness, Currency, Precision — plus custom rules per column, run history, score trends, and threshold alerts."

### Existing code reused
- `workers/file-parser.worker.ts` — parse upload
- `workers/dq-runner.worker.ts` — run 4 dimensions
- `lib/dq-engine/dimensions/completeness.ts`, `validity.ts`, `uniqueness.ts`, `conformity.ts`
- `lib/dq-engine/scorer.ts` — aggregate score

### Why this works
Direct product demo disguised as a free tool. The paid upgrade path is obvious. No SMB-friendly browser equivalent exists — enterprise tools (Great Expectations, Soda Core) require Python.

### Competition
Near zero at the SMB-friendly level.

### Target users
Any of Sohovi's core segments: bookkeepers, e-commerce sellers, ops managers, freelancers.

### Conversion trigger (dynamic)
"Your data scored {score}/100. {n} columns have quality issues. Track scores over time and set quality alerts — [Start free in Sohovi]"

### Blog posts that drive traffic
Category 18 ("What Is a Good Data Quality Score?"), Category 32 Sub-cluster B (Measurement & Benchmarking), new Category 33 topics (407–411), cross-tool topics 441–444.

---

## Tool 2 — PII / Sensitive Data Finder

**URL:** `/tools/pii-finder`
**Tagline:** "Does your CSV contain personal data you didn't know about?"

### What it does
- User uploads CSV
- Browser scans every cell against regex + heuristic patterns for:
  - Email addresses
  - US phone numbers
  - SSNs (XXX-XX-XXXX pattern)
  - Credit card numbers (Luhn check)
  - IP addresses
  - Dates of birth (age inference)
- Returns: which columns likely contain PII, how many cells matched, severity level (Low/Medium/High)
- Downloadable flagged CSV report
- No data leaves the browser

### Gap to show in UI
After the PII report, render a locked feature card:
> "Auto-mask sensitive fields on every upload. Generate a GDPR/CCPA compliance report. Schedule recurring PII audits. → Available in Sohovi paid."

### Existing code reused
- `workers/file-parser.worker.ts` — parse upload
- `lib/profiling/pii-detector.ts` — exact reuse, zero changes needed. Already detects: email, phone, SSN, credit card, IP, person name.

### Why this works
Almost no SMB-friendly free tool exists. Existing options are CLI-only (PiiCatcher, Capital One DataProfiler) or enterprise-priced (PII Tools). GDPR/CCPA awareness is high. Bookkeepers, e-commerce sellers, and ops managers unknowingly hold PII in spreadsheets constantly.

### Competition
LOW — largest white space identified across the entire free-tool landscape.

### Target users
Bookkeepers (financial records), e-commerce sellers (customer lists), ops managers (employee records), freelancers (client data).

### Conversion trigger (dynamic)
"Found {n} PII fields ({types list}) in your file. Upgrade to auto-mask sensitive columns on every run and generate a GDPR compliance report — [Start free in Sohovi]"

### Blog posts that drive traffic
Category 5 (Privacy, PII & Compliance, posts 54–65), new Category 34 topics (412–417).

---

## Tool 3 — Data Completeness Visualizer

**URL:** `/tools/completeness`
**Tagline:** "See exactly which fields are missing — at a glance."

### What it does
- User uploads CSV
- Generates a visual heatmap grid (rows × columns)
- Cells colored by fill-rate:
  - Green: 100% filled
  - Amber: 70–99% filled
  - Red: below 70% filled
- Summary panel: top 5 most incomplete columns, rows with the most missing values, overall completeness %
- Downloadable as PNG/PDF

### Gap to show in UI
Below the heatmap, render a grayed-out locked line chart:
> "Track completeness over time. Set a threshold (e.g. alert me if customer_email drops below 90%) → Available in Sohovi paid."

### Existing code reused
- `workers/file-parser.worker.ts` — parse upload
- `workers/profiler.worker.ts` — provides null_count + null_pct per column, already computed
- `lib/profiling/profiler.ts` — column completeness stats

### Why this works
Missingno (Python library for this) has 4,000+ GitHub stars — proven demand exists. Zero browser-based equivalent for non-technical users exists anywhere.

### Competition
LOW — only Python/R libraries exist, nothing browser-based for SMBs.

### Target users
Ops managers auditing contact lists, bookkeepers checking if required fields are filled, freelancers inheriting "a nightmare spreadsheet."

### Conversion trigger (dynamic)
"Your {worst_col} column is only {pct}% complete. Set a completeness threshold alert and track fill-rate over time — [Start free in Sohovi]"

### Blog posts that drive traffic
Post 19 (Detect missing values/null patterns), Post 406 (Completeness audit in an hour), new Category 35 topics (418–422).

---

## Tool 4 — Date & Format Standardizer

**URL:** `/tools/format-standardizer`
**Tagline:** "Mixed date formats in your CSV? Fix them all in one click."

### What it does
- User uploads CSV
- Tool auto-detects columns with format inconsistencies
- Supported formats:
  - Dates: auto-detects format variants, converts to user-selected target (ISO 8601, US, UK, etc.)
  - Phone numbers: standardize to E.164 or national format
  - Currency: strip symbols, normalize decimal separators
- Shows breakdown: "Column 'invoice_date' has 4 formats: MM/DD/YYYY (340 rows), DD-MM-YYYY (12 rows), Jan 5 2024 (3 rows), 2024/01/05 (8 rows)"
- User picks target format from dropdown
- One-click standardize → download cleaned CSV

### Gap to show in UI
After download:
> "Apply this as a permanent rule in Sohovi. Every new upload auto-standardizes the same columns — no manual work. → Available in Sohovi paid."

### Existing code reused
- `workers/file-parser.worker.ts` — parse upload
- `lib/profiling/profiler.ts` — `detected_date_formats` field from column profile, already computed
- `lib/dq-engine/dimensions/conformity.ts` — format detection logic

### Key differentiator vs. core Sohovi
Core Sohovi *detects* format inconsistency (conformity dimension) but **never transforms** data. This tool actually fixes and outputs a cleaned CSV — a capability core does not have.

### Why this works
Format inconsistency is the #1 pre-import headache for bookkeepers and e-commerce sellers. OpenRefine is the only free alternative but is desktop-only with a steep learning curve. No simple browser tool exists.

### Competition
LOW–MEDIUM.

### Target users
Bookkeepers (bank CSV imports to QuickBooks), e-commerce sellers (Shopify/WooCommerce product feeds), ops managers (merging data from multiple systems).

### Conversion trigger (dynamic)
"Standardized {n} values across {k} format variants. Apply this as a permanent rule that runs on every upload — [Start free in Sohovi]"

### Blog posts that drive traffic
Post 48 (Standardize date formats), Post 154 (Standardize phone number formats), new Category 36 topics (423–428).

---

## Tool 5 — Vendor / Company Name Deduplicator

**URL:** `/tools/name-dedup`
**Tagline:** "Same company, five different spellings. Find them all."

### What it does
- User uploads a CSV column or pastes a list of company/vendor/contact names
- Runs fuzzy matching (Jaro-Winkler algorithm) to group near-duplicates:
  - Example: "Microsoft Corp", "Microsoft Corporation", "MSFT", "Microsoft Inc." → one cluster
- User sets similarity threshold via slider (70%–100%)
- Shows all clusters, suggests canonical name per cluster
- Downloadable cleaned CSV with cluster assignments

### Gap to show in UI
After results:
> "Auto-merge clusters and write back to your vendor master. Track new duplicates as they appear — ongoing deduplication. → Available in Sohovi paid."

### Existing code reused
- `workers/file-parser.worker.ts` — parse upload

### New dependency
- `talisman` npm package — Jaro-Winkler implementation, browser-compatible, no native bindings

### Why this works
Vendor name inconsistency is a top pain for bookkeepers (breaks reconciliation, causes duplicate vendor payments), CRM users (duplicate leads), and ops managers (supplier data). No fuzzy-matching name tool exists that is free, unlimited, and browser-based.

### Competition
MEDIUM. Fuzzymatch.app exists with row limits. Datablist does multi-file dedup (different use case). No standalone tool focuses on company/vendor name normalization.

### Target users
Bookkeepers (vendor names for AP reconciliation), sales teams (CRM cleanup), e-commerce (brand name normalization in product catalogs), ops managers (supplier lists).

### Conversion trigger (dynamic)
"Found {n} duplicate vendor clusters across {total} names. Auto-merge and track ongoing deduplication — [Start free in Sohovi]"

### Blog posts that drive traffic
Post 153 (Standardize company names across duplicates), Post 165 (Fuzzy matching: near-duplicate records), new Category 37 topics (429–434).

---

## Tool 6 — Email List Quick-Check

**URL:** `/tools/email-checker`
**Tagline:** "Check your email list for syntax errors and dead domains — unlimited, no signup."

### What it does
- User uploads a CSV or pastes an email list
- Browser runs:
  - RFC-5322 syntax validation
  - Common typo detection: gmial.com → gmail.com, yahooo.com, hotmial.com, etc.
  - MX record lookup via DNS-over-HTTPS (only the domain name is checked, not the full email address)
- Returns: % valid syntax, % suspicious domains, % likely invalid, downloadable flagged CSV
- **Unlimited rows** — the primary differentiator

### Gap to show in UI
After results:
> "Verify SMTP delivery — confirm each address actually accepts email. Get full bounce-rate prediction before you send. → Available in Sohovi paid."

### Existing code reused
- `workers/file-parser.worker.ts` — parse CSV upload

### New implementation detail
- MX lookup: `fetch('https://cloudflare-dns.com/dns-query?name={domain}&type=MX', { headers: { Accept: 'application/dns-json' } })` — no backend, no API key, entirely browser-side

### Why this works
All existing free email checkers have strict monthly limits (50–600 emails/month): ZeroBounce, Snov.io, Reoon, etc. Privacy-first (no email addresses leave the browser) + unlimited = unique position in market. Tool does NOT do SMTP verification — that is the paid upgrade path.

### Competition
HIGH for the email checker category overall. LOW for the "unlimited + local + no signup" niche.

### Target users
Marketing agencies (pre-campaign email validation), e-commerce sellers (Mailchimp list hygiene), nonprofits (donor database cleanup), bookkeepers (client contact lists).

### Conversion trigger (dynamic)
"{n} invalid or suspicious email domains detected. Upgrade to SMTP delivery verification and get full bounce-rate prediction — [Start free in Sohovi]"

### Blog posts that drive traffic
Post 47 (Validate email addresses in bulk without coding), Category 28 (Marketing Agencies & Email Marketers, posts 337–346), new Category 38 topics (435–440).

---

## Priority Ranking & Build Order

| Priority | Tool | Competition | Build Complexity | Conversion Strength |
|---|---|---|---|---|
| #1 | CSV Data Quality Score Card | Very Low | Medium | Highest — direct product demo |
| #2 | PII / Sensitive Data Finder | Low | Low | High — compliance fear trigger. All code already exists. |
| #3 | Data Completeness Visualizer | Low | Low | High — immediate visual aha moment |
| #4 | Date & Format Standardizer | Low-Medium | Medium | High — immediate fix creates habit |
| #5 | Vendor Name Deduplicator | Medium | Medium | Medium-High — bookkeeper niche |
| #6 | Email List Quick-Check | Medium-High | Medium | Medium — high traffic, crowded but differentiable |

**Recommended MVP:** Build Tools 1–4 first. Add Tools 5 and 6 once core tools are live and indexed.

### Build sequence when ready
1. `proxy.ts` — add `/tools(.*)` to public routes (one line)
2. `app/tools/layout.tsx` — minimal public layout (Sohovi nav + footer, no Clerk/DashboardShell)
3. `app/tools/page.tsx` — tools hub / index page
4. Tool 1 — CSV Quality Score Card
5. Tool 2 — PII Finder (reuses pii-detector.ts directly, lowest effort of all 6)
6. Tool 3 — Completeness Visualizer
7. Tool 4 — Date Standardizer
8. `npm install talisman` → Tool 5 — Name Deduplicator
9. Tool 6 — Email Quick-Check

---

## Content Flywheel

Each tool page should:
1. Have a clear H1 matching a high-intent search query
2. Link to 2–3 relevant blog posts from `blogposts.md`
3. Include a "How it works" section (builds trust + SEO)
4. Include structured data markup: `SoftwareApplication` schema for Google rich results

The blog posts drive organic traffic → readers try the free tool → tool CTA drives signups. The flywheel is built through the content clusters in `blogposts.md` (especially the new Cluster 14, Categories 33–39).
