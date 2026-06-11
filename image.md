# Sohovi — Image System

> Single source of truth for every image in the product. Use this file to create, recreate, and place images correctly.

---

## § 0 — How to Use This File

**Workflow for every image:**

1. Find the image prompt below (search by ID or section)
2. Copy the **Design Language block from § 1** and paste it at the start of your Claude Design session
3. Copy the individual prompt and paste it next
4. Claude Design generates the image
5. Export at the **exact format and dimensions** listed in the prompt's `Export as:` line
6. Name the file using the `File name:` line
7. Upload to the storage location noted in `After export:` (Supabase Storage bucket or `/public/og/` in the repo)
8. Copy the public URL (or use the `/public/` relative path) and paste it into the code field listed

**Re-creating an image:** Every prompt is self-contained. The design language, colors, dimensions, and composition are all in the prompt — no prior context needed. Just start a fresh Claude Design session with § 1 + the prompt.

---

## § 1 — Sohovi Design Language

> **Copy this entire block and paste it at the start of every Claude Design session before any individual prompt.**

---

### Sohovi Brand & Design Language — Reference for Image Generation

**Brand personality:** Data clarity, trustworthy, minimal. Sohovi is a B2B data quality platform. Every image should feel precise, calm, and professional — like a well-designed dashboard, not a marketing slide.

**Color palette — use at most 3 colors per image:**

| Role | Hex | Name | When to use |
|---|---|---|---|
| Background | `#F4F4F5` | Cream | Default canvas for all illustrations |
| Primary / text | `#0A0A0A` | Ink | Lines, borders, labels, dark fills |
| Brand accent | `#2D7FF9` | Electric Blue | Highlights, CTAs, key elements, active states |
| Success / live | `#00C9A7` | Mint | Good outcomes, checkmarks, approved states |
| Call-out | `#FFE439` | Butter | Annotations, badges, "NEW" labels |
| Surface | `#FFFFFF` | White | Card fills, table cells, inner panels |

Choose Electric Blue as the primary accent for most images. Swap in Mint when the concept is about success/health. Use Butter only for call-out badges. Never use more than 3 palette colors in a single image.

**Typography:**
- Clean geometric sans-serif only (Inter, DM Sans, or equivalent)
- No decorative, script, or display fonts
- Labels: 12–14 px, `#0A0A0A`
- Section headers inside diagrams: 14–16 px bold
- Do not render large body text — images are illustrations, not documents

**Shape language:**
- 8 px rounded corners on all rectangles and cards
- Flat fills — no gradients, no drop shadows, no blurs
- Borders: 1–1.5 px `#0A0A0A` or `#E2E8F2` (light gray hairline)
- Icons: outline/line-art style, 20–24 px, `#0A0A0A` or accent color
- Arrows: 1.5 px solid or dashed `#0A0A0A`; arrowheads small and clean

**Composition rules:**
- White space is a design element — do not fill every pixel
- Alignment: left-to-right or top-to-bottom flow for process diagrams
- No decorative backgrounds, patterns, or textures
- No photography, no 3D, no isometric perspective
- Minimum 24 px padding inside any card or panel

**Anti-patterns — never include:**
- Gradients (linear or radial)
- Drop shadows or glows
- Realistic textures or materials
- Stock illustration characters or clipart
- Emoji
- More than 3 colors
- Busy or cluttered layouts

**SVG quality:** Design at the stated pixel dimensions. Output must be clean vector paths — no embedded rasters.

---

## § 2 — Image Specs & Performance Guide

| Image type | Format | Dimensions | Max file size | Why |
|---|---|---|---|---|
| Blog diagram | **SVG** | Design at 1200×700 (scalable) | 50 KB | Vectors are ~5–20 KB, crisp on retina, no blur at any size |
| Blog cover | **WebP** | 1200×628 px | 120 KB | WebP is 30–50% smaller than PNG/JPEG at same visual quality |
| Blog OG image | **PNG** | 1200×630 px | 200 KB | PNG has universal Open Graph crawler compatibility |
| Video thumbnail | **WebP** | 1280×720 px | 150 KB | 16:9 ratio, WebP for fast load in the learn section |
| Page OG static | **PNG** | 1200×630 px | 200 KB | Placed in `/public/og/` — served by Next.js static file server |

**Loading performance notes:**
- SVG diagrams load near-instantly and scale perfectly — always prefer SVG for any line-art or flat illustration
- WebP covers load ~2× faster than equivalent JPEG; compress to ≤120 KB before uploading
- Static OG PNGs in `/public/og/` are served from the CDN edge — no additional optimization needed
- All blog images are loaded via standard `<img>` tags (not Next.js `<Image>`), so the file itself must already be optimized before upload
- Video thumbnails: export at 1280×720 WebP, compress with `cwebp -q 82`

---

## § 3 — Production Placement Map

### Blog Cover Images

- **Stored as:** URL string in `cover_image_url` field on `BlogPost` (`/types/app.types.ts` line 210)
- **Rendered in:**
  - `/components/blog/BlogPostCard.tsx` lines 27–35 — card grid thumbnails (fallback: colored background)
  - `/app/blog/[slug]/page.tsx` line 196 — article hero image (max-height 460px, object-fit cover)
- **How to update:** Open Blog Admin → find the post → paste public URL into **"Cover Image URL"** field (`/components/blog/BlogAdminForm.tsx` line 279)
- **Storage:** Upload to Supabase Storage bucket `blog-images/covers/` → make public → copy URL

### Blog OG Images

- **Stored as:** URL string in `og_image_url` field on `BlogPost` (`/types/app.types.ts` line 215)
- **Fallback chain:** `og_image_url ?? cover_image_url` — if OG is blank, the cover is used for social cards
- **Used in:** `/app/blog/[slug]/page.tsx` lines 37–60 — injected into OpenGraph and Twitter card metadata (1200×630 spec)
- **Also used in:** JSON-LD Article schema at line 102–103 of the same file
- **How to update:** Open Blog Admin → find the post → paste public URL into **"OG Image URL"** field (`/components/blog/BlogAdminForm.tsx` line 490)
- **Storage:** Upload to Supabase Storage bucket `blog-images/og/` → make public → copy URL

### Blog Inline Diagrams

- **Stored as:** URL string in `cover_image_url` or inline in post content (markdown `![alt](url)`)
- **Storage:** Upload to Supabase Storage bucket `blog-images/diagrams/` → copy public URL → embed in post body
- **Format:** SVG preferred; paste the SVG public URL as a standard markdown image

### Video Thumbnails ⚠️ Code change required first

- **Current state:** `/components/learn/VideoCard.tsx` line 30 shows a CSS gradient placeholder — no thumbnail field exists yet
- **Before using thumbnails, a developer must:**
  1. Add `thumbnailUrl?: string` to the `VideoEntry` type in `/components/learn/VideoCard.tsx`
  2. Replace the gradient div with `<img src={entry.thumbnailUrl} ... />` (with fallback to gradient if undefined)
  3. Add `thumbnailUrl` values to each video entry in `/lib/learn/guides.ts`
- **Storage:** Upload WebP files to Supabase Storage bucket `video-thumbs/` → copy public URL → add to guides.ts

### Page-Level OG Images (Static)

- **Current state:** No OG images defined for homepage, tools index, tool detail pages, or blog index
- **How to add:**
  1. Place PNG file at `/public/og/[slug].png` in the repo
  2. Add the `images` array to the page's existing metadata export:

```typescript
// /app/layout.tsx — homepage default OG
openGraph: {
  images: [{ url: '/og/homepage.png', width: 1200, height: 630 }],
}

// /app/blog/page.tsx — blog index OG
openGraph: {
  images: [{ url: '/og/blog.png', width: 1200, height: 630 }],
}

// /app/tools/page.tsx — tools hub OG
openGraph: {
  images: [{ url: '/og/tools.png', width: 1200, height: 630 }],
}

// /app/tools/csv-to-markdown/page.tsx
openGraph: {
  images: [{ url: '/og/tool-csv-to-markdown.png', width: 1200, height: 630 }],
}

// /app/tools/json-to-csv/page.tsx
openGraph: {
  images: [{ url: '/og/tool-json-to-csv.png', width: 1200, height: 630 }],
}

// /app/tools/test-data-generator/page.tsx
openGraph: {
  images: [{ url: '/og/tool-test-data-generator.png', width: 1200, height: 630 }],
}
```

---

## § 4 — File Naming Convention

```
Blog diagrams:    blog-[id]-[kebab-slug].svg
                  e.g.  blog-flow-01-automated-dq-workflow.svg
                        blog-chart-03-zscore-bell-curve.svg
                        blog-table-12-ai-rule-builder.svg

Blog covers:      cover-[topic-slug].webp
                  e.g.  cover-deduplication.webp
                        cover-data-governance.webp

Blog OG:          og-blog-[post-slug].png
                  e.g.  og-blog-what-is-data-quality.png

Video thumbs:     thumb-[nn]-[kebab-slug].webp
                  e.g.  thumb-01-org-setup.webp
                        thumb-09-behavioral-scoring.webp

Page OG (static): og-[page-slug].png
                  e.g.  og-homepage.png
                        og-tools.png
                        og-tool-csv-to-markdown.png
```

---

## § 5 — Blog Post Diagrams

> Before each Claude Design session: paste the full § 1 Design Language block first, then the individual prompt below.

Each prompt is labeled with an ID, used-in reference, export spec, file name, and placement instruction.

---

### 5.1 — Flow / Workflow Diagrams

---

#### `blog-flow-01` — Automated DQ Workflow
**Used in:** cat-07

> Flat vector flow diagram on a `#F4F4F5` cream background. Four horizontal steps connected by right-pointing arrows: **Data Import** → **Automated Quality Check** → **Pass / Fail decision diamond** → **Alert (fail path)** or **Approve (pass path)**. Boxes are white (`#FFFFFF`) with `#0A0A0A` ink borders and labels. The decision diamond and the arrow routing to "Alert" are filled `#2D7FF9` electric blue. No gradients. Clean sans-serif labels. SVG-scale flat vector illustration, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-01-automated-dq-workflow.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed URL in blog post body as `![Automated DQ Workflow](url)`

---

#### `blog-flow-02` — Data Quality Framework Components
**Used in:** cat-11

> Flat vector circular hub-and-spoke diagram on `#F4F4F5` cream. Center hub labeled **Data Quality** in a `#0A0A0A` filled circle with white text. Five satellite circles equally spaced around it: **Dimensions**, **Measurement**, **Governance**, **Remediation**, **Prevention**. Connecting lines are `#0A0A0A`. Satellite circles are white with `#0A0A0A` borders. One satellite (Measurement) is highlighted with a `#2D7FF9` electric blue fill and white text. No gradients, no shadows. Clean sans-serif labels. Flat vector, SVG-scale, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-02-dq-framework-components.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-11 post body

---

#### `blog-flow-03` — Source-to-Report Data Problem Cascade
**Used in:** cat-06, cat-11

> Flat vector two-row diagram on `#F4F4F5` cream. **Row A (bad path):** Source → Data Import (with duplicate/incomplete icons) → Report → Misleading Conclusion (X mark in `#0A0A0A`). **Row B (good path):** Source → Quality Check (shield icon in `#2D7FF9`) → Clean Data → Accurate Report (checkmark in `#00C9A7` mint). Boxes white with `#0A0A0A` borders. Arrows `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-03-problem-cascade.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-06 and cat-11 post bodies

---

#### `blog-flow-04` — Duplicate Cascade into Downstream Metrics
**Used in:** cat-23

> Flat vector tree diagram on `#F4F4F5` cream. Root node: **Source CRM (Duplicate Record)** filled `#2D7FF9` electric blue. Three child nodes branching down: **Pipeline Dashboard (inflated)**, **Revenue Report (inflated)**, **Forecast Model (inflated)** — each filled `#0A0A0A` with white text. Connecting lines `#0A0A0A`. All nodes have rounded corners 8 px. Labels in clean sans-serif. No gradients. Flat vector SVG.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-04-duplicate-cascade.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-23 post body

---

#### `blog-flow-05` — ETL Pipeline with Quality Gates
**Used in:** cat-15, cat-21

> Flat vector horizontal pipeline diagram on `#F4F4F5` cream. Six labeled rectangular stages left-to-right: **Source Systems** → **Extract** → **Transform** → **Load** → **Data Warehouse** → **BI Tools**. Between Extract/Transform and Transform/Load, insert a small `#2D7FF9` electric blue shield icon labeled **Quality Gate**. Boxes are white with `#0A0A0A` borders. Connecting arrows `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-flow-05-etl-quality-gates.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 and cat-21 post bodies

---

#### `blog-flow-06` — ETL Validation at Each Stage
**Used in:** cat-21

> Flat vector three-stage pipeline diagram on `#F4F4F5` cream. Three vertical columns: **Extraction**, **Transformation**, **Load**. Each column has a white box for the process step and a smaller `#2D7FF9` electric blue badge below it labeled "Validation Check". Arrows connect columns left-to-right. Column boxes have `#0A0A0A` borders. Clean sans-serif labels. No gradients. Flat vector SVG.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-06-etl-validation-stages.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-21 post body

---

#### `blog-flow-07` — API Integration Validation Flow
**Used in:** cat-21

> Flat vector horizontal flow diagram on `#F4F4F5` cream. Six steps with arrows: **Incoming Data** → **Schema Check** → **Transformation** → **Destination Write** → **Reconciliation Count Check** → **Done**. Schema Check and Reconciliation nodes are `#2D7FF9` electric blue fills with white text. Other nodes white with `#0A0A0A` borders. A fail branch from Schema Check routes down to a **Reject Queue** box (diagonal `#0A0A0A` hatch pattern). Clean flat vector, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-flow-07-api-validation-flow.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-21 post body

---

#### `blog-flow-08` — Streaming Pipeline with Dead Letter Queue
**Used in:** cat-21

> Flat vector horizontal streaming pipeline on `#F4F4F5` cream. Four nodes: **Producer** → **Validator** → **Consumer Queue** (success path) and from Validator a downward arrow to **Dead Letter Queue** (fail path). Consumer Queue and Producer are white with `#0A0A0A` borders. Validator is `#2D7FF9` electric blue. Dead Letter Queue is `#0A0A0A` filled with white text. An alert bell icon appears beside Dead Letter Queue. Flat vector, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-08-streaming-dead-letter-queue.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-21 post body

---

#### `blog-flow-09` — Workflow Routing Based on Account Tier
**Used in:** cat-21

> Flat vector workflow diagram on `#F4F4F5` cream. Entry node: **Record Arrives**. Decision diamond: **Account Tier Field — Populated?**. Yes path routes right to **Process Normally** (white box). No/blank path routes down to **Flag for Review** (`#2D7FF9` blue fill, white text). A third branch for **Inconsistent** routes to **Quarantine** (`#0A0A0A` fill, white text). Clean sans-serif. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×800)
**File name:** `blog-flow-09-account-tier-routing.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-21 post body

---

#### `blog-flow-10` — Training Data Quality → Model Quality
**Used in:** cat-23

> Flat vector two-column comparison diagram on `#F4F4F5` cream. Left column header: **Clean Training Data** (white box). Arrow points down to: **Reliable Predictions** (`#00C9A7` mint fill, white text). Right column header: **Noisy / Incomplete Data** (white box with diagonal hatch lines in `#0A0A0A`). Arrow points down to: **Systematic Bias & Errors** (`#0A0A0A` fill, white text). A vertical center divider line separates columns. Labels in clean sans-serif. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-10-training-data-model-quality.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-23 post body

---

#### `blog-flow-11` — Deduplication Strategy Cycle
**Used in:** cat-08, cat-14

> Flat vector circular four-step cycle diagram on `#F4F4F5` cream. Four nodes connected in a clockwise loop: **Define** (top) → **Prevent** (right) → **Detect** (bottom) → **Resolve** (left) → back to Detect. Nodes are white rounded rectangles with `#0A0A0A` borders. **Define** node is `#2D7FF9` electric blue fill with white text. Arrows between nodes are `#0A0A0A`. Labels in clean sans-serif. No gradients. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 900×900)
**File name:** `blog-flow-11-dedup-strategy-cycle.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 and cat-14 post bodies

---

#### `blog-flow-12` — Prevention vs. Reactive Dedup Cycle
**Used in:** cat-17

> Flat vector two-panel diagram on `#F4F4F5` cream. **Panel A (Reactive):** A circular loop — Imports Create Duplicates → Cleanup Removes Them → Imports Create More. Arrows `#0A0A0A`. An X mark `#0A0A0A` overlaid on the loop. **Panel B (Prevention):** A single horizontal flow — Data Entry → Dedup Check (shield in `#2D7FF9`) → Clean Database. A `#00C9A7` mint checkmark beside Panel B. Labels in clean sans-serif. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-flow-12-prevention-vs-reactive.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-flow-13` — Pre-Send Marketing Automation Quality Check
**Used in:** cat-08

> Flat vector horizontal workflow on `#F4F4F5` cream. Five steps: **Campaign Created** → **Email Validity Filter** (`#2D7FF9` blue fill, white text) → **Suppression Check** → **Quality Approved** → **Send**. Each step is a white rounded rectangle with `#0A0A0A` border except the highlighted filter step. Connecting arrows `#0A0A0A`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-flow-13-presend-quality-check.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-flow-14` — Dead Letter Queue Alert Workflow
**Used in:** cat-09

> Flat vector flow diagram on `#F4F4F5` cream. Top entry: **Record Arrives**. Decision diamond: **Validation Check**. Passes path routes right to **Process Normally** (white box). Fails path routes down to **Dead Letter Queue** (`#0A0A0A` fill, white text). From Dead Letter Queue: a clock icon with label **Alert when queue exceeds threshold** in `#2D7FF9` electric blue. Clean sans-serif labels. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×800)
**File name:** `blog-flow-14-dead-letter-queue-alert.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-flow-15` — Data Lineage Diagram
**Used in:** cat-15

> Flat vector left-to-right lineage diagram on `#F4F4F5` cream. Four nodes with labeled connecting arrows: **CRM** → **ETL** → **Data Warehouse** → **BI Dashboard**. Each transformation arrow is labeled with a short action (Clean, Restructure, Aggregate). Nodes are white rounded rectangles with `#0A0A0A` borders. The ETL node is `#2D7FF9` electric blue fill with white text. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-flow-15-data-lineage.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 post body

---

#### `blog-flow-16` — Master Data Management — Golden Record
**Used in:** cat-15

> Flat vector diagram on `#F4F4F5` cream. Three source system boxes at left: **CRM**, **Billing**, **Support** (white boxes with `#0A0A0A` borders). Arrows from all three converge on a center **MDM Layer** node in `#2D7FF9` blue. An arrow points right to a **Golden Record** box (`#0A0A0A` fill, white text). Labels in clean sans-serif. No gradients. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-16-mdm-golden-record.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 post body

---

#### `blog-flow-17` — HR Data: HRIS + Payroll + Benefits Gap
**Used in:** cat-19

> Flat vector three-column diagram on `#F4F4F5` cream. Three system columns side-by-side: **HRIS**, **Payroll**, **Benefits & Access Control**. Each column is a white box with `#0A0A0A` border. A horizontal row for a sample employee record spans all three with dashed connecting lines. One field in the Benefits & Access Control column is highlighted `#2D7FF9` electric blue, labeled "Termination Processing Gap". A small warning icon (`#0A0A0A`) beside it. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-flow-17-hr-termination-gap.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-19 post body

---

#### `blog-flow-18` — Six Entry Points for Null Values
**Used in:** cat-09

> Flat vector diagram on `#F4F4F5` cream. A central **Database** cylinder in `#0A0A0A` with white label. Six inbound arrows entering from the sides, each labeled: **Form Skipping**, **Import Gaps**, **Schema Changes**, **Integration Failures**, **Deletion**, **"Not Available"**. Arrow lines are `#2D7FF9` electric blue. Entry-point labels are in white boxes with `#0A0A0A` borders. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-18-null-entry-points.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-flow-19` — Three-System Contact Unification (CRM + MAP + Billing)
**Used in:** cat-08

> Flat vector diagram on `#F4F4F5` cream. Three columns: **CRM**, **MAP**, **Billing**. Each has a white rounded box with a sample contact stub inside. A common **Email Key** label in `#2D7FF9` electric blue sits between them with bidirectional arrows. At the bottom, a single **Unified Record** box (`#0A0A0A` fill, white text) aggregates all three, with ownership arrows from each system column. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×800)
**File name:** `blog-flow-19-three-system-unification.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-flow-20` — List Import Dedup Check
**Used in:** cat-08, cat-17

> Flat vector horizontal flow diagram on `#F4F4F5` cream. Steps: **Incoming CSV File** → **Dedup Check** (shield icon in `#2D7FF9`) → decision diamond: **New or Existing?** → **New Records batch** (left) and **Update Existing batch** (right). Both end at **Database** (`#0A0A0A` fill). Boxes are white with `#0A0A0A` borders. Decision diamond is `#2D7FF9` fill. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-flow-20-list-import-dedup.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 and cat-17 post bodies

---

#### `blog-flow-21` — Analyst Workflow with Upfront Quality Check
**Used in:** cat-15

> Flat vector horizontal timeline diagram on `#F4F4F5` cream. Five milestone nodes on a line: **Data Received** → **Quality Check** (highlighted `#2D7FF9` node) → **Cleaning** → **Analysis** → **Insight Delivery**. A bracket between Quality Check and Cleaning labeled "Time Saved" in `#00C9A7` mint. Clean sans-serif labels. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-flow-21-analyst-workflow.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 post body

---

#### `blog-flow-22` — Raw CSV to Analysis-Ready Dataset
**Used in:** cat-15

> Flat vector five-stage horizontal pipeline on `#F4F4F5` cream. Stages: **Raw CSV** → **Discovery** → **Cleaning** → **Transformation** → **Validation** → **Analysis-Ready Dataset**. Each stage is a white rounded box with `#0A0A0A` border. The final output box is `#00C9A7` mint fill with white text. Connecting arrows `#0A0A0A`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-flow-22-raw-csv-to-clean.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 post body

---

#### `blog-flow-23` — Proactive vs. Reactive Monitoring
**Used in:** cat-22

> Flat vector two-column comparison on `#F4F4F5` cream. **Left (Reactive):** Timeline shows users encounter a problem → report → investigation → fix. An X mark in `#0A0A0A`. **Right (Proactive):** System detects anomaly → alert → fix → users never affected. A `#00C9A7` mint checkmark. Column headers in white boxes with `#0A0A0A` borders. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-flow-23-proactive-vs-reactive.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-22 post body

---

#### `blog-flow-24` — Five Integration Checkpoints
**Used in:** cat-10

> Flat vector vertical checklist diagram on `#F4F4F5` cream. Five rows, each with a checkpoint shield icon in `#2D7FF9` electric blue on the left and a label on the right: **File Receipt**, **Form Entry**, **Pipeline Run**, **Report Prep**, **System Export**. Rows alternate white and `#F4F4F5` backgrounds. A vertical dotted line connects checkpoint icons. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 900×800)
**File name:** `blog-flow-24-integration-checkpoints.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-10 post body

---

#### `blog-flow-25` — Validation Layer Between Sources and Warehouse
**Used in:** cat-21

> Flat vector architecture diagram on `#F4F4F5` cream. Left: three **Source System** boxes (white, `#0A0A0A` borders). Arrows point right to a **Validation Layer** box in `#2D7FF9` electric blue (single tall panel). Two outbound arrows: one right to **Data Warehouse** (white box), one downward to **Quarantine / Failed Records** (`#0A0A0A` fill, white text). Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-flow-25-validation-layer.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-21 post body

---

### 5.2 — Before / After Comparisons

---

#### `blog-ba-01` — Dirty vs. Clean Dataset
**Used in:** cat-08, cat-12

> Flat vector two-panel comparison on `#F4F4F5` cream. **Left panel (Before):** A 4-column table with one row showing a duplicate entry (diagonal `#0A0A0A` hatch), one row with a wrong format (underline), and one row with a blank cell (outlined `#2D7FF9`). **Right panel (After):** Same table, all rows clean with a `#00C9A7` mint checkmark column. Panels separated by a thin vertical divider. "Before" / "After" headers in clean sans-serif. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-ba-01-dirty-vs-clean.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 and cat-12 post bodies

---

#### `blog-ba-02` — Phone Number Normalization
**Used in:** cat-08, cat-17

> Flat vector two-column table on `#F4F4F5` cream. **Left column:** Six phone numbers in mixed formats — `(555) 123-4567`, `555.123.4567`, `555-123-4567`, `15551234567`, `+1 555 123 4567`, `5551234567` — mismatched formats highlighted with `#2D7FF9` blue text. **Right column:** All six normalized to `+1-555-123-4567` in `#0A0A0A`. Column headers: "Mixed Formats" / "E.164 Standard". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-ba-02-phone-normalization.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 and cat-17 post bodies

---

#### `blog-ba-03` — Address Normalization
**Used in:** cat-08

> Flat vector two-panel comparison on `#F4F4F5` cream. **Left:** `123 main st. apt 5b los angelas CA 900025` — a `#2D7FF9` wavy underline on `los angelas` and the extra `0` in ZIP. **Right:** `123 Main St Apt 5B, Los Angeles, CA 90025` with a `#00C9A7` mint checkmark. Both in white boxes with `#0A0A0A` borders. "Before" / "After" labels. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×600)
**File name:** `blog-ba-03-address-normalization.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-ba-04` — Duplicate Contacts → Merged Record
**Used in:** cat-08, cat-14, cat-23

> Flat vector three-panel diagram on `#F4F4F5` cream. **Panel 1:** "John Smith, john@work.com, 2 interactions" — white box with `#2D7FF9` dashed border. **Panel 2:** "John Smith, j.smith@work.com, 5 interactions" — white box with `#2D7FF9` dashed border. Merge arrow points right. **Panel 3:** "John Smith, john@work.com, 7 interactions" — white box with `#00C9A7` mint left border accent. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-ba-04-duplicate-contacts-merged.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08, cat-14, cat-23 post bodies

---

#### `blog-ba-05` — State Values: 6 Formats → ISO Codes
**Used in:** cat-17

> Flat vector two-column table on `#F4F4F5` cream. **Left column (Before):** Six rows — `California`, `Calif.`, `CA`, `ca`, `Cal`, `CALIFORNIA` — non-standard values highlighted with `#2D7FF9` left border. **Right column (After):** All rows show `CA` with a `#00C9A7` mint dot. Column headers "Raw Values" / "Standardized". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×700)
**File name:** `blog-ba-05-state-iso-normalization.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-ba-06` — Character Encoding: Garbled → Correct
**Used in:** cat-17

> Flat vector two-cell comparison on `#F4F4F5` cream. **Left cell:** `JosÃ© GarcÃ­a` — the encoding artifacts highlighted `#2D7FF9` with a small warning icon. **Right cell:** `José García` with a `#00C9A7` mint left border. A right-pointing arrow between cells labeled "UTF-8 Fix". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×500)
**File name:** `blog-ba-06-encoding-fix.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-ba-07` — Contact Record Enrichment
**Used in:** cat-08

> Flat vector two-panel comparison on `#F4F4F5` cream. **Left panel:** A contact record — Name, Email rows filled; Company, Title, Location rows are empty (blank cells outlined in `#2D7FF9` dashed blue). **Right panel:** Same record with Company, Title, Location filled, and a small "Enriched" badge in `#00C9A7` mint. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-ba-07-contact-enrichment.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-ba-08` — Mismatched Schema: Expected vs. Received
**Used in:** cat-17, cat-18

> Flat vector two-column schema comparison on `#F4F4F5` cream. **Left column (Expected):** 5 field names in white rows. **Right column (Received):** 5 fields — 3 matching, 1 renamed (highlighted `#2D7FF9`), 1 missing (empty row with `#0A0A0A` diagonal hatch). Column headers "Expected Schema" / "Received File". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-ba-08-schema-mismatch.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 and cat-18 post bodies

---

#### `blog-ba-09` — Mixed Date Formats in a Column
**Used in:** cat-17

> Flat vector one-column table on `#F4F4F5` cream. Column header: "date_of_birth". Eight rows with mixed formats: `2024-01-15` (ISO, white row), `01/15/2024` (`#2D7FF9` left border), `15-Jan-2024` (`#2D7FF9`), `Jan 15 2024` (`#2D7FF9`), `20240115` (`#2D7FF9`), `15.01.2024` (`#2D7FF9`). A flag icon beside ambiguous dates. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 800×800)
**File name:** `blog-ba-09-date-format-variants.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-ba-10` — Order ID Format: Valid vs. Flagged
**Used in:** cat-12

> Flat vector one-column table on `#F4F4F5` cream. Column header: "order_id". Five rows: `INV-12345` with `#00C9A7` checkmark, `INV-67890` with `#00C9A7` checkmark, `inv12345` with `#2D7FF9` warning icon, `INV12345` with `#2D7FF9` warning, `inv-ABCDE` with `#2D7FF9` warning. Header note: "Format Rule: INV-NNNNN". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 800×700)
**File name:** `blog-ba-10-order-id-format-validation.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-12 post body

---

#### `blog-ba-11` — Cross-Field Failure: Cancelled Status + Null Date
**Used in:** cat-12

> Flat vector two-cell illustration on `#F4F4F5` cream. Two white boxes side-by-side: **`subscription_status = "Cancelled"`** and **`cancellation_date = NULL`** (with `#2D7FF9` dashed border and warning icon). An arrow between them labeled "Cross-Field Failure". Below: caption "If Cancelled, date must be present." Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×500)
**File name:** `blog-ba-11-cross-field-failure.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-12 post body

---

#### `blog-ba-12` — USPS Address Normalization (Three Steps)
**Used in:** cat-08

> Flat vector three-step left-to-right on `#F4F4F5` cream. **Step 1:** `123 main st. ste 400` (white box, `#2D7FF9` underlines). Arrow "Normalize". **Step 2:** `123 Main St Suite 400` (white box, `#00C9A7` left border). Arrow "Validate (USPS)". **Step 3:** `123 Main Street Suite 400` with USPS check badge in `#00C9A7`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×500)
**File name:** `blog-ba-12-usps-address-normalization.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

### 5.3 — Charts and Graphs

---

#### `blog-chart-01` — Data Quality Score Declining Over 18 Months
**Used in:** cat-06, cat-22

> Flat vector line chart on `#F4F4F5` cream. X-axis: 18 months. Y-axis: Quality Score 75–100%. A single `#0A0A0A` line starting at 98% declining to 83%. Three `#2D7FF9` electric blue annotation callouts along the decline: "Import Event", "System Change", "Drift". Grid hairlines at 10% opacity. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-01-quality-score-decline.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-06 and cat-22 post bodies

---

#### `blog-chart-02` — Order Status Distribution: Run 1 vs. Run 2
**Used in:** cat-behavior

> Flat vector grouped bar chart on `#F4F4F5` cream. X-axis: status values (`pending`, `shipped`, `delivered`, `cancelled_fraud`). Y-axis: record %. **Run 1 bars:** `#0A0A0A`. **Run 2 bars:** `#2D7FF9`. The `cancelled_fraud` Run 2 bar is notably tall (22%) with a flag icon. Legend: "Run 1 / Run 2". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-02-order-status-distribution.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-behavior post body

---

#### `blog-chart-03` — Z-Score Bell Curve with Flagged Outlier
**Used in:** cat-behavior

> Flat vector bell curve on `#F4F4F5` cream. Smooth normal distribution in `#0A0A0A`. Two dashed vertical lines at z = −3 and z = +3. Tails beyond ±3 filled `#2D7FF9` at 20% opacity. A solid `#2D7FF9` dot at z ≈ +4.8 labeled "Flagged". X-axis: "Z-Score", Y-axis: "Frequency". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-03-zscore-bell-curve.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-behavior post body

---

#### `blog-chart-04` — Null Rate Heatmap Across 5 Runs
**Used in:** cat-behavior

> Flat vector heatmap grid on `#F4F4F5` cream. Rows: 5 column names. Columns: Run 1–5. Cells: white = low null rate, `#2D7FF9` at 20% = moderate, solid `#2D7FF9` = high. Cell at `customer_email × Run 5` is solid `#2D7FF9` with a red-dot warning. Headers in `#0A0A0A`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-04-null-rate-heatmap.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-behavior post body

---

#### `blog-chart-05` — Pipeline Detection Cost by Stage
**Used in:** cat-09

> Flat vector bar chart on `#F4F4F5` cream. X-axis: four stages (Ingestion, Transformation, Warehouse, Consumption). Y-axis: Relative Cost (Low → High). Bars increase in height left-to-right. First two bars `#0A0A0A` fill (shorter). Last two bars `#2D7FF9` fill (taller). A line connecting bar tops labeled "Cost increases downstream". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-05-pipeline-detection-cost.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-chart-06` — DQ Problem Types by Annual Cost
**Used in:** cat-09

> Flat vector horizontal bar chart on `#F4F4F5` cream. Y-axis: 6 problem types (Duplicates, Incomplete Data, Wrong Formats, Stale Data, Integration Errors, Unknown Types). X-axis: Relative Annual Cost. Bars sorted longest-to-shortest. All bars `#0A0A0A`. Top bar (Duplicates) is `#2D7FF9` to highlight. Labels at bar ends. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-06-dq-problem-cost.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-chart-07` — One-Time Cleanup vs. Ongoing Maintenance
**Used in:** cat-22

> Flat vector line chart on `#F4F4F5` cream. X-axis: 24 months. Y-axis: Quality Score 60–100%. **Line A (One-Time):** spikes to 95% at month 3 then degrades to 72% by month 24. `#0A0A0A` dashed. **Line B (Ongoing):** holds steady at 88–93%. `#2D7FF9` solid. Annotations: "Cleanup spike" / "Steady baseline". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-07-cleanup-vs-maintenance.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-22 post body

---

#### `blog-chart-08` — Three DQ Metrics Over 12 Months
**Used in:** cat-22

> Flat vector multi-line chart on `#F4F4F5` cream. X-axis: 12 months. Y-axis: Score %. Three lines: **Completeness** (`#0A0A0A` solid), **Uniqueness** (`#2D7FF9` solid), **Validity** (`#0A0A0A` dashed). One spike on Uniqueness at month 7. A gradual decline in Completeness from month 9. Inline labels at right end of each line. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-08-three-dq-metrics.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-22 post body

---

#### `blog-chart-09` — Email List Funnel: 100K to High-Quality
**Used in:** cat-08

> Flat vector funnel diagram on `#F4F4F5` cream. Five horizontal bands narrowing top to bottom: **100,000 Raw Emails** → **85,000 Valid Format** → **75,000 Deliverable** → **72,000 Not Stale** → **70,000 High-Quality**. Bands in `#0A0A0A` at 20/40/60/80/100% opacity top to bottom. Final band `#2D7FF9`. Labels on right side of each band. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×800)
**File name:** `blog-chart-09-email-list-funnel.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-chart-10` — Address Validation Funnel
**Used in:** cat-08

> Flat vector funnel diagram on `#F4F4F5` cream. Four bands: **100% Input** → **80% Format Valid** → **68% USPS Deliverable** → **55% Geocoded & Verified**. Bands in `#0A0A0A` opacity gradient lightest-to-darkest. Bottom band `#2D7FF9`. Right-side percentage labels. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×800)
**File name:** `blog-chart-10-address-validation-funnel.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-chart-11` — Where Email Bounces Come From (Stacked Bar)
**Used in:** cat-08

> Flat vector stacked horizontal bar on `#F4F4F5` cream. One bar representing 100 email addresses, five segments: **75 Valid & Deliverable** (`#0A0A0A`), **15 Decayed/Stale** (`#0A0A0A` 60%), **5 Invalid Format** (`#2D7FF9` 80%), **3 Role-Based** (`#2D7FF9` 50%), **2 Disposable** (`#2D7FF9` 30%). Labels above each segment. Title: "Where Bounces Come From". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×500)
**File name:** `blog-chart-11-email-bounce-sources.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-chart-12` — Schema Drift vs. Statistical Drift (Two-Column)
**Used in:** cat-behavior

> Flat vector two-column split diagram on `#F4F4F5` cream. **Left (Schema Drift):** A table showing columns added/removed across three time periods — `+new_col`, `−removed_col` in `#2D7FF9`. **Right (Statistical Drift):** A bar chart of null rate over 5 runs, bars rising 2%→18%, last bar solid `#2D7FF9` labeled "Drift Detected". Column divider in `#0A0A0A`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-chart-12-schema-vs-statistical-drift.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-behavior post body

---

#### `blog-chart-13` — Five-Level Maturity Chart
**Used in:** cat-11

> Flat vector horizontal stepped chart on `#F4F4F5` cream. Five equal-width columns increasing in height: **Unaware** → **Reactive** → **Defined** → **Managed** → **Optimized**. Each is a white box with `#0A0A0A` border and a short descriptor below. **Managed** column is `#2D7FF9` fill with white text. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-chart-13-maturity-model.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-11 post body

---

#### `blog-chart-14` — Prevention vs. Remediation vs. Cost of Inaction
**Used in:** cat-11

> Flat vector three-column bar chart on `#F4F4F5` cream. Three bars: **Prevention** (short, `#00C9A7` mint), **Remediation** (medium, `#2D7FF9` blue), **Cost of Inaction** (tall, `#0A0A0A`). Dollar-sign labels above each bar. X-axis labels in clean sans-serif. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×700)
**File name:** `blog-chart-14-prevention-cost-comparison.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-11 post body

---

#### `blog-chart-15` — Quality Score with Threshold Line (Three Zones)
**Used in:** cat-09

> Flat vector line chart on `#F4F4F5` cream. X-axis: time. Y-axis: quality score %. A solid `#0A0A0A` line fluctuating 78–97%. A dashed horizontal threshold at 85% in `#0A0A0A`. Three background zones: below threshold (`#2D7FF9` at 8% opacity), in range (white), at target (`#00C9A7` at 8% opacity). Labels for each zone. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-chart-15-quality-threshold-zones.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-chart-16` — Status Field: 20+ Variants (Bar)
**Used in:** cat-17

> Flat vector horizontal bar chart on `#F4F4F5` cream. Y-axis: 20 distinct values of a "Status" field — `Active`, `active`, `ACTIVE`, `Active ` (trailing space), `Inactve` (typo), etc. X-axis: record count. Canonical values (`Active`, `Inactive`) have `#0A0A0A` bars. All variants have `#2D7FF9` bars. Title: "Status Field — 20+ Variants". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×900)
**File name:** `blog-chart-16-status-field-variants.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-chart-17` — Industry Field: 150+ Values → 12 Categories
**Used in:** cat-08

> Flat vector two-panel comparison on `#F4F4F5` cream. **Panel A:** Bar chart — 12 industry bars plus a towering "Other (138 variants)" bar in `#2D7FF9`. **Panel B:** Same chart post-standardization — only 12 clean `#0A0A0A` bars. Label: "Standardized: 12 Categories". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×700)
**File name:** `blog-chart-17-industry-field-standardization.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

### 5.4 — Tables and Dashboard Mockups

---

#### `blog-table-01` — Data Profile Report Table
**Used in:** cat-06, cat-07, cat-15

> Flat vector table mockup on `#F4F4F5` cream. Five columns: **Field Name**, **Null Rate**, **Distinct Values**, **Most Common Value**, **Data Type**. Four rows alternating white/`#F4F4F5`. Two cells highlighted `#2D7FF9` for anomalies (e.g., 34% null rate). Column headers bold `#0A0A0A`. Rounded outer border. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-table-01-data-profile-report.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-06, cat-07, cat-15 post bodies

---

#### `blog-table-02` — Data Quality Scorecard Table
**Used in:** cat-07, cat-11

> Flat vector scorecard table on `#F4F4F5` cream. Five columns: **Dataset**, **Dimension**, **Current Score**, **Target**, **Owner**. Four rows. Current Score cells show small progress bars: `#00C9A7` mint for ≥90%, `#2D7FF9` for 75–89%, `#0A0A0A` for <75%. Headers in bold `#0A0A0A`. Rounded table border. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-table-02-dq-scorecard.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-07 and cat-11 post bodies

---

#### `blog-table-03` — Rule Definition Template
**Used in:** cat-12, cat-21

> Flat vector two-column key-value table on `#F4F4F5` cream. Left column (`#F4F4F5` fill): **Field**, **Valid Condition**, **Failure Condition**, **Response Policy**. Right column (white fill): filled for an email rule — `email`, `matches RFC 5322 regex`, `flag + error tag`, `quarantine + notify`. The Failure Condition row has a `#2D7FF9` left border accent. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×600)
**File name:** `blog-table-03-rule-definition-template.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-12 and cat-21 post bodies

---

#### `blog-table-04` — Quality Threshold Dashboard
**Used in:** cat-09

> Flat vector dashboard mockup on `#F4F4F5` cream. Four rows for fields: **email**, **phone**, **address**, **company**. Columns: **Field**, **Target Score**, **Current Score**. Current Score cells have `#00C9A7` mint or `#2D7FF9` blue dot indicators (mint = at target, blue = below). Header row `#0A0A0A` fill with white text. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×600)
**File name:** `blog-table-04-quality-threshold-dashboard.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-table-05` — Data Observability Dashboard (4-card)
**Used in:** cat-22

> Flat vector 2×2 card grid on `#F4F4F5` cream. Four white rounded cards: **Freshness** (clock icon), **Volume** (bar chart icon), **Schema** (grid icon), **Distribution** (wave icon). Each card has `#0A0A0A` border. The **Volume** card has a `#2D7FF9` badge labeled "Anomaly Detected". Icons in `#0A0A0A`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×700)
**File name:** `blog-table-05-observability-dashboard.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-22 post body

---

#### `blog-table-06` — Pre-Migration Quality Dashboard
**Used in:** cat-08

> Flat vector dashboard table on `#F4F4F5` cream. Columns: **Object Type** (Contacts, Accounts, Opportunities), **Completeness Rate**, **Duplicate Count**. Completeness rates as small `#0A0A0A` horizontal bars. Duplicate counts as `#2D7FF9` badges for high counts. Header row `#0A0A0A` fill with white text. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×600)
**File name:** `blog-table-06-premigration-quality-dashboard.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 post body

---

#### `blog-table-07` — Data Dictionary Spreadsheet
**Used in:** cat-15

> Flat vector spreadsheet mockup on `#F4F4F5` cream. Six columns: **Field Name**, **Business Name**, **Description**, **Data Type**, **Allowed Values**, **Owner**. Three sample rows alternating white/`#F4F4F5`. One cell in Allowed Values has a `#2D7FF9` dropdown arrow. Column headers bold `#0A0A0A`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×600)
**File name:** `blog-table-07-data-dictionary.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 post body

---

#### `blog-table-08` — Tiered Threshold Table
**Used in:** cat-09

> Flat vector four-row table on `#F4F4F5` cream. Columns: **Tier**, **Example Fields**, **Acceptable Error Rate**. Tier 1 row `#0A0A0A` fill with white text (most strict). Tier 2 row `#2D7FF9` at 20% tint. Tier 3 at 10% tint. Tier 4 white. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×600)
**File name:** `blog-table-08-tiered-thresholds.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-09 post body

---

#### `blog-table-09` — Vendor Master Dedup (IBM Variants)
**Used in:** cat-08, cat-12

> Flat vector three-row table on `#F4F4F5` cream. Columns: **Vendor ID**, **Name in System**, **Payment Terms**. Rows: `V-001 / IBM / Net-30`, `V-002 / I.B.M. / Net-60`, `V-003 / IBM Corp. / Net-30` — all with `#2D7FF9` left borders. Below a divider: a single consolidated row `V-001 / IBM / Net-30` with a `#00C9A7` mint checkmark labeled "Canonical Record". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×600)
**File name:** `blog-table-09-vendor-master-dedup.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-08 and cat-12 post bodies

---

#### `blog-table-10` — Product ID Mapping Across 4 Systems
**Used in:** cat-15

> Flat vector five-column table on `#F4F4F5` cream. Columns: **CRM SKU**, **ERP SKU**, **Catalog SKU**, **Billing SKU**, **Master SKU**. One product row: four different IDs per system, last column (Master SKU) is `#00C9A7` mint fill with white text. Column headers `#0A0A0A` bold. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×500)
**File name:** `blog-table-10-product-id-mapping.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-15 post body

---

#### `blog-table-11` — Pivot Table: Case Variants That Should Be One Value
**Used in:** cat-17

> Flat vector pivot table mockup on `#F4F4F5` cream. Three rows: `Active / 142`, `active / 38`, `ACTIVE / 17` — all with `#2D7FF9` left borders. Below a horizontal rule: `Active / 197` row with `#00C9A7` mint fill. Title: "Status field — variants that should be one value". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 800×600)
**File name:** `blog-table-11-pivot-case-variants.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-table-12` — AI Rule Builder UI Mockup
**Used in:** cat-21

> Flat vector UI mockup on `#F4F4F5` cream. Two-panel interface. **Left panel:** A column selector dropdown showing `email_address`. Below it a text input: "must be a valid email format". A `#2D7FF9` "Generate Rules" button. **Right panel:** Two rule cards — `not_null` (confidence 98%, `#00C9A7` badge) and `format_check: RFC 5322` (confidence 94%, `#00C9A7` badge). Cards are white with `#0A0A0A` borders. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-table-12-ai-rule-builder.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-21 post body

---

#### `blog-table-13` — Static DQ Score vs. Behavior Score (Side-by-Side)
**Used in:** cat-behavior

> Flat vector two-card UI mockup on `#F4F4F5` cream. **Left card:** "DQ Run — Score: 97" with `#00C9A7` mint "PASSING" badge. **Right card:** "Behavior Score: 30" with `#2D7FF9` "Anomaly Detected" badge, small label "null_rate ↑ unexpected". Both cards are white with `#0A0A0A` borders. Title above: "Same dataset, two signals". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×600)
**File name:** `blog-table-13-dq-vs-behavior-score.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-behavior post body

---

#### `blog-table-14` — Behavioral Scoring: 5 Blind Spots Checklist
**Used in:** cat-behavior

> Flat vector two-column comparison checklist on `#F4F4F5` cream. **Column A (Static Rules):** 5 rows — ✓ Format valid, ✓ Not null (threshold), ✓ Range in bounds, ✗ Null rate spike, ✗ Value distribution shift. **Column B (Behavioral Scoring):** All 5 rows ✓. Column A ✓ marks `#00C9A7`, ✗ marks `#0A0A0A`. Column B all `#00C9A7`. Bold column headers. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-table-14-behavioral-scoring-blindspots.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-behavior post body

---

### 5.5 — Venn / Relationship Diagrams

---

#### `blog-venn-01` — Governance & Quality Venn
**Used in:** cat-22

> Flat vector Venn diagram on `#F4F4F5` cream. Two overlapping circles: **Governance** (left, `#0A0A0A` stroke, white fill, label "Policies, Roles, Ownership") and **Data Quality** (right, `#2D7FF9` stroke, white fill, label "Accuracy, Completeness, Consistency"). Overlap filled `#2D7FF9` at 15% opacity, labeled "Standards & Stewardship". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×700)
**File name:** `blog-venn-01-governance-quality-venn.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-22 post body

---

#### `blog-venn-02` — Accuracy Within DQ Dimensions
**Used in:** cat-11

> Flat vector nested diagram on `#F4F4F5` cream. Large outer circle: **Data Quality** (`#0A0A0A` stroke, white fill). Inside: five shapes for Completeness, Validity, Uniqueness, Consistency, Timeliness. **Accuracy** shape is `#2D7FF9` fill. All labeled. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1000×800)
**File name:** `blog-venn-02-accuracy-within-dq.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-11 post body

---

#### `blog-venn-03` — Two Databases Merging (Complexity)
**Used in:** cat-17

> Flat vector three-stage diagram on `#F4F4F5` cream. Left circle: System A — own schema, DQ problems. Right circle: System B — own schema, DQ problems. Overlap: Shared entities. Below: merged circle "Combined Database" with a "Schema Conflict" badge in `#2D7FF9`. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-venn-03-database-merge-complexity.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-17 post body

---

#### `blog-venn-04` — Data Management Wheel
**Used in:** cat-11

> Flat vector pie/wheel on `#F4F4F5` cream. Eight equal segments: Data Governance, Data Quality, Data Architecture, Data Modeling, Data Security, Data Integration, Data Warehousing, Master Data. All segments white with `#0A0A0A` dividers. **Data Quality** segment is `#2D7FF9` fill with white label. Small `#0A0A0A` center circle labeled "DM". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 900×900)
**File name:** `blog-venn-04-data-management-wheel.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-11 post body

---

### 5.6 — Funnel / Pyramid Diagrams

---

#### `blog-funnel-01` — Prevention vs. Detective Controls
**Used in:** cat-11

> Flat vector funnel on `#F4F4F5` cream. Wide top: **All Incoming Data**. Large filter layer: **Preventive Controls** in `#2D7FF9` — blocks most bad data. Narrow band below: residual. Small bottom layer: **Detective Controls** in `#0A0A0A`, catching residual. Right-side labels: "Most errors blocked here" / "Small residual caught here". Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 900×900)
**File name:** `blog-funnel-01-prevention-vs-detective.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-11 post body

---

#### `blog-funnel-02` — 2×2 Priority Matrix
**Used in:** cat-22

> Flat vector 2×2 matrix on `#F4F4F5` cream. X-axis: Business Impact (Low → High). Y-axis: Fix Effort (Low → High). Quadrants: **Quick Wins** (top-left, `#00C9A7` light fill), **Strategic** (top-right, `#2D7FF9` light fill), **Low Priority** (bottom-left, white), **Deprioritize** (bottom-right, `#0A0A0A` 10% fill). Each quadrant has one example DQ issue. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 900×900)
**File name:** `blog-funnel-02-priority-matrix.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-22 post body

---

#### `blog-funnel-03` — Recovery Spectrum
**Used in:** cat-18

> Flat vector horizontal spectrum on `#F4F4F5` cream. A long bar divided into five segments: **Easily Recoverable** → **Recoverable with Effort** → **Partially Recoverable** → **Difficult** → **Unrecoverable**. Segments fade from `#00C9A7` mint (left) through `#2D7FF9` (center) to `#0A0A0A` (right). One example label below each segment. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1400×500)
**File name:** `blog-funnel-03-recovery-spectrum.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-18 post body

---

#### `blog-funnel-04` — AI Automation Suitability by Problem Type
**Used in:** cat-18

> Flat vector two-column checklist on `#F4F4F5` cream. **Column A (High AI):** Format standardization ✓, Duplicate detection ✓, Missing value imputation ✓ — `#00C9A7` checkmarks. **Column B (Low AI):** Business rule logic ✗, Relationship validation ✗, Governance decisions ✗ — `#2D7FF9` X marks. Column headers bold. Flat vector SVG, max 3 colors.

**Export as:** SVG (design at 1200×700)
**File name:** `blog-funnel-04-ai-automation-suitability.svg`
**After export:** Upload to Supabase Storage `blog-images/diagrams/` → embed in cat-18 post body

---

## § 6 — Video Tutorial Thumbnails

> Each thumbnail is 16:9. The word "Sohovi" appears as plain sans-serif text in bottom-left corner — do not attempt to recreate the SVG logo mark, just the word.

---

#### `thumb-01` — Getting Started: Org Setup

> Flat vector 16:9 image on `#F4F4F5` cream. Center: simple org hierarchy — one top node (Admin) in `#0A0A0A` filled circle with white label, two child nodes (Team A, Team B) in white circles with `#0A0A0A` borders, connected by lines. Top-right: a small gear icon in `#2D7FF9`. Top-left: bold "01" in `#2D7FF9`. Bottom-left: "Sohovi" in small `#0A0A0A` sans-serif. Max 3 colors, flat vector, no gradients.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-01-org-setup.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add URL to the matching video entry in `/lib/learn/guides.ts` as `thumbnailUrl` (requires code change — see § 3)

---

#### `thumb-02` — Connecting Your Data

> Flat vector 16:9 on `#F4F4F5` cream. Center: three source icons left (CSV file, database cylinder, API symbol) in white with `#0A0A0A` outlines, arrows pointing right to a center hub circle in `#2D7FF9` labeled "Sohovi" in white. Arrows `#0A0A0A`. Top-left: bold "02" in `#2D7FF9`. Bottom-left: "Sohovi" in small `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-02-connecting-data.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-03` — Understanding Data Profiling

> Flat vector 16:9 on `#F4F4F5` cream. Center: a simplified 3-column data profile table (Field, Null %, Distinct), 4 rows, one cell highlighted `#2D7FF9`. Above the table a magnifying glass icon in `#0A0A0A`. Top-left: "03" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-03-data-profiling.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-04` — Building Data Quality Rules

> Flat vector 16:9 on `#F4F4F5` cream. Center: a white rounded rule card with `#0A0A0A` border. Inside: two key-value rows — "Field: email" and "Condition: valid format". A `#00C9A7` checkmark beside the rule. A wrench icon in `#2D7FF9` top-right of the card. Top-left: "04" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-04-building-rules.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-05` — Running Checks & Reading Scores

> Flat vector 16:9 on `#F4F4F5` cream. Center: a large circular score gauge — arc 0–100, needle at 87. Arc filled `#2D7FF9` to the needle. "87" in large `#0A0A0A` inside the circle. A small play button icon beside the gauge. Top-left: "05" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-05-running-checks.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-06` — Alerts & Monitoring

> Flat vector 16:9 on `#F4F4F5` cream. Center: a bell icon in `#0A0A0A` with a `#2D7FF9` notification dot. Below the bell, a simplified line chart (`#0A0A0A` line) with one spike annotated by a `#2D7FF9` dashed vertical line labeled "Alert". Top-left: "06" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-06-alerts-monitoring.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-07` — Remediation & Reporting

> Flat vector 16:9 on `#F4F4F5` cream. Center: two mini table panels side-by-side — left panel has `#0A0A0A` dashed-border cells (problematic rows), right panel has `#00C9A7` checkmark cells (clean). A right-pointing arrow between them. Top-left: "07" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-07-remediation-reporting.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-08` — AI Rule Builder

> Flat vector 16:9 on `#F4F4F5` cream. Center: a simplified chat-style UI card — a text input reading "must be a valid email" in `#0A0A0A`, and two generated rule chips in `#2D7FF9`: "not_null" and "format_check". A four-pointed AI spark icon in `#0A0A0A` above the card. Top-left: "08" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-08-ai-rule-builder.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

#### `thumb-09` — Behavioral Scoring & Data Drift Detection

> Flat vector 16:9 on `#F4F4F5` cream. Center: a line chart (`#0A0A0A`) trending steadily then spiking. At the spike a `#2D7FF9` dashed vertical line with a "Drift Detected" badge. Below: two score badges — "DQ Score: 97 ✓" (white, `#00C9A7` border) and "Behavior Score: 30 !" (`#2D7FF9` fill, white text). Top-left: "09" in `#2D7FF9`. Bottom-left: "Sohovi" in `#0A0A0A`. Flat vector, max 3 colors.

**Export as:** WebP 1280×720 px (max 150 KB)
**File name:** `thumb-09-behavioral-scoring.webp`
**After export:** Upload to Supabase Storage `video-thumbs/` → add as `thumbnailUrl` in guides.ts

---

## § 7 — Blog Post Cover Images

> 1200×628 px, WebP. Heavy use of white space. An illustration on the right half, blank text area on the left (headline will be overlaid by the blog template). A color anchor strip on the left edge.

---

#### `cover-data-quality` — Data Quality (General)

> Flat vector 1200×628 WebP cover on white (`#FFFFFF`). Right side (60% of width): a 3-column miniature table with `#2D7FF9` electric blue header and sample cells showing a checkmark and an X. Left side (40%): empty white space for headline overlay. Left edge: a `#0A0A0A` vertical strip 16 px wide. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-data-quality.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin → Cover Image URL for data quality posts

---

#### `cover-deduplication` — Deduplication & Matching

> Flat vector 1200×628 cover on white. Right side: two overlapping record cards (white, `#0A0A0A` border) with a merge arrow → a single unified card in `#2D7FF9`. Left: empty space. Left edge: `#2D7FF9` vertical strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-deduplication.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for deduplication posts

---

#### `cover-data-governance` — Data Governance

> Flat vector 1200×628 cover on white. Right side: an org chart — Governance Policy node (`#0A0A0A` fill, white text) at top, Data Steward and Data Owner below (white nodes, `#0A0A0A` borders), connected by `#0A0A0A` lines. Left: empty space. Left edge: `#0A0A0A` vertical strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-data-governance.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for governance posts

---

#### `cover-ai-automation` — AI & Automation

> Flat vector 1200×628 cover on white. Right side: a large four-pointed AI spark icon in `#2D7FF9` (centered in right half). Below it: two small rule chips in `#0A0A0A` — "not_null" and "format_check". Left: empty space. Left edge: `#2D7FF9` vertical strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-ai-automation.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for AI/automation posts

---

#### `cover-data-pipelines` — Data Pipelines & ETL

> Flat vector 1200×628 cover on white. Right side: four horizontal pipeline stage boxes (white, `#0A0A0A` borders) connected by arrows. Middle box (Transform) is `#2D7FF9` fill. Left: empty space. Left edge: `#0A0A0A` strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-data-pipelines.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for pipeline posts

---

#### `cover-data-profiling` — Data Profiling & Assessment

> Flat vector 1200×628 cover on white. Right side: a magnifying glass (`#0A0A0A` outline) over a miniature table. Inside the lens: a highlighted `#2D7FF9` cell. Left: empty space. Left edge: `#2D7FF9` strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-data-profiling.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for profiling posts

---

#### `cover-behavioral-scoring` — Behavioral Scoring

> Flat vector 1200×628 cover on white. Right side: a line chart with a sudden spike. At the spike: a `#2D7FF9` dashed vertical line and an "Anomaly" badge. Chart line `#0A0A0A`. Left: empty space. Left edge: `#0A0A0A` strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-behavioral-scoring.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for behavioral scoring posts

---

#### `cover-data-cleaning` — Data Cleaning & Standardization

> Flat vector 1200×628 cover on white. Right side: a before/after column pair — left cell with `#2D7FF9` messy values, right cell with `#00C9A7` mint clean values, arrow between them. Left: empty space. Left edge: `#2D7FF9` strip 16 px. Flat vector, max 3 colors.

**Export as:** WebP 1200×628 px (max 120 KB)
**File name:** `cover-data-cleaning.webp`
**After export:** Upload to Supabase Storage `blog-images/covers/` → paste URL in Blog Admin for cleaning/standardization posts

---

## § 8 — OG / Social Cards (1200×630)

> Static files. After export, place in `/public/og/[filename]` in the repo. Then add the `images` array to the matching page metadata (see § 3 for exact code snippets).

---

#### `og-homepage` — Homepage OG Card

> Flat vector 1200×630 social card. Background: `#0A0A0A` ink (full bleed). Left 55%: a large white sans-serif headline area — placeholder text "Clean data. Better decisions." in white at ~48 px bold. Right 45%: a white rounded card (mockup of Sohovi's run detail screen) showing a mini circular quality score gauge in `#2D7FF9` electric blue and one row of column quality bars below in `#00C9A7`. Bottom-right: "sohovi.com" in small white sans-serif. Top-left: "Sohovi" wordmark in white bold sans-serif 24 px. No gradients. Flat vector PNG.

**Export as:** PNG 1200×630 px (max 200 KB)
**File name:** `og-homepage.png`
**After export:** Place at `/public/og/og-homepage.png` → add `images: [{ url: '/og/og-homepage.png', width: 1200, height: 630 }]` to `openGraph` in `/app/layout.tsx`

---

#### `og-blog-index` — Blog Index OG Card

> Flat vector 1200×630 social card. Background: `#F4F4F5` cream. Left 50%: a stack of three overlapping blog post card shapes (white, `#0A0A0A` thin borders). Right 50%: large `#0A0A0A` text placeholder "Data Quality Insights". Top-left: "Sohovi" wordmark in `#0A0A0A` bold. An `#2D7FF9` electric blue 8 px horizontal strip along the very bottom edge. Flat vector PNG.

**Export as:** PNG 1200×630 px (max 200 KB)
**File name:** `og-blog.png`
**After export:** Place at `/public/og/og-blog.png` → add `images` array to `openGraph` in `/app/blog/page.tsx`

---

#### `og-tools-index` — Tools Hub OG Card

> Flat vector 1200×630 social card. Background: `#F4F4F5` cream. Center: a 2×2 grid of four tool icon cards (white, `#0A0A0A` borders) — CSV symbol, JSON `{}` symbol, test-data grid symbol, validator checkmark symbol. One card is `#2D7FF9` fill. Top-left: "Sohovi" wordmark in `#0A0A0A`. Bottom: "Free Data Quality Tools" label in `#0A0A0A`. Flat vector PNG.

**Export as:** PNG 1200×630 px (max 200 KB)
**File name:** `og-tools.png`
**After export:** Place at `/public/og/og-tools.png` → add `images` array to `openGraph` in `/app/tools/page.tsx`

---

#### `og-tool-csv-to-markdown` — CSV to Markdown Tool OG Card

> Flat vector 1200×630 social card. Background: `#F4F4F5` cream. Center: a CSV column list box (white, `#0A0A0A` text) → right-pointing `#2D7FF9` arrow → a Markdown table box (white, `#0A0A0A` pipe characters and text). Top-left: "Sohovi" wordmark. Bottom: "CSV → Markdown" in bold `#0A0A0A`. Flat vector PNG.

**Export as:** PNG 1200×630 px (max 200 KB)
**File name:** `og-tool-csv-to-markdown.png`
**After export:** Place at `/public/og/og-tool-csv-to-markdown.png` → add `images` array to `openGraph` in `/app/tools/csv-to-markdown/page.tsx`

---

#### `og-tool-json-to-csv` — JSON to CSV Tool OG Card

> Flat vector 1200×630 social card. Background: `#F4F4F5` cream. Center: a `{ … }` JSON symbol box (white, `#0A0A0A`) → right-pointing `#2D7FF9` arrow → a spreadsheet grid box (white, `#0A0A0A` grid lines). Top-left: "Sohovi" wordmark. Bottom: "JSON → CSV" in bold `#0A0A0A`. Flat vector PNG.

**Export as:** PNG 1200×630 px (max 200 KB)
**File name:** `og-tool-json-to-csv.png`
**After export:** Place at `/public/og/og-tool-json-to-csv.png` → add `images` array to `openGraph` in `/app/tools/json-to-csv/page.tsx`

---

#### `og-tool-test-data-generator` — Test Data Generator OG Card

> Flat vector 1200×630 social card. Background: `#F4F4F5` cream. Center: a white rounded table card (3 columns, 4 rows). Header row is `#2D7FF9` fill with white labels (Name, Email, ID). A small wand/sparkle icon in `#0A0A0A` above-right the card. Top-left: "Sohovi" wordmark. Bottom: "Generate Test Data" in bold `#0A0A0A`. Flat vector PNG.

**Export as:** PNG 1200×630 px (max 200 KB)
**File name:** `og-tool-test-data-generator.png`
**After export:** Place at `/public/og/og-tool-test-data-generator.png` → add `images` array to `openGraph` in the test data generator tool page

---

*End of Sohovi Image System — every prompt is self-contained, every image has a production landing spot.*
