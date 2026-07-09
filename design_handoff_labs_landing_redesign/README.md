# Handoff: Sohovi Labs Landing Page Redesign (6 pages)

## Overview
A full redesign of 6 "Labs" validation landing pages — SnapBack, Encore, SignSync, Shopify Tools, RefTrack, and ShipNotes. Each page pitches an unbuilt product idea to gauge demand before building it. The redesign replaces the previous neutral black/white style with the Sohovi marketing design system (navy / terracotta / teal), adds a proper problem → solution → comparison → pricing → waitlist → FAQ narrative, a themed animated hero mockup per product, and a 2-step waitlist + feedback form.

## About the Design Files
The files in this bundle are **design references built as static/interactive HTML prototypes** (single-file "Design Component" documents using a lightweight templating runtime — `support.js`). They are not production code to copy verbatim. The task is to **recreate these designs in the existing Next.js/React/Tailwind codebase** (`app/labs/*`, `components/labs/*`), reusing existing shared components (`LabsHeader`, `LabsFooter`, `FeedbackForm`, `ToolFAQ`, etc.) wherever their behavior matches, and introducing new components only where the redesign requires structure the current components don't have (e.g. the hero product mockup, the "How it works" 3-step section).

Do not embed `support.js` or the custom template syntax (`{{ }}`, `<sc-for>`, `<sc-if>`) in the production app — those are prototyping-only. Rebuild all logic as normal React state/props.

## Fidelity
**High-fidelity.** Colors, spacing, typography, copy, and layout are final/intended. Recreate pixel-close using the values below and the project's existing Tailwind config / `globals.css` tokens where they already match (e.g. `--sohovi-navy`, `--sohovi-teal`, `--sohovi-terracotta`).

## Files in this bundle
- `SnapBack Redesign.dc.html` — database backup tool for Supabase/Neon/Turso teams
- `Encore Redesign.dc.html` — scheduling/billing tool for music lesson teachers
- `SignSync Redesign.dc.html` — team email signature deployment tool
- `Shopify Tools Redesign.dc.html` — single-workflow Shopify automation (workflow TBD by user vote)
- `RefTrack Redesign.dc.html` — flat-fee affiliate tracking for bootstrapped SaaS founders
- `ShipNotes Redesign.dc.html` — GitHub-release-to-changelog tool for indie founders
- `SnapBack Current.dc.html` — a faithful recreation of the **previous** SnapBack page, kept only as a before/after reference. Not part of the new design.

Open any `.dc.html` file directly in a browser to view/interact with it.

## Shared Page Structure (all 6 pages)
Every page follows the same section order:
1. **Honesty strip** — thin navy bar, full width, above the header: *"This tool isn't built yet. This page validates demand — ..."*
2. **Header** — sticky, white/95% + 12px backdrop-blur, border-bottom `#E2E8F0`. Left: "sohovi" wordmark + "Labs" pill badge. Right: nav links ("How It Works", "Pricing") + primary CTA button linking to `#build-this`.
3. **Hero** — 2-column grid (`1.05fr / 0.95fr` on desktop, stacks on mobile). Left: eyebrow pill, H1 with one accent-colored phrase, subhead paragraph, primary + secondary CTA buttons, a row of 3 trust bullets with icons. Right: an animated product mockup card (see "Hero Mockups" below).
4. **How it works** — eyebrow + H2 + intro paragraph, then a 3-column grid of numbered step cards (`01/02/03`, icon, title, body).
5. **Problem** — 2-column layout: sticky left column with eyebrow/H2/intro; right column stacks 3 pain-point cards (icon in red-tinted box, title, body).
6. **Solution ("What we'd build")** — eyebrow + H2 + intro, then a 3-column grid of 6 feature cards (icon, title, body).
7. **Comparison** — eyebrow + H2 + intro, then a comparison table: our column highlighted with a tinted background and check icons, competitor column plain text. 4 rows.
8. **Pricing** — eyebrow + H2 + intro. Either a 3-plan grid (SnapBack, ShipNotes) with the middle/highlighted plan on a dark navy card, a 2-plan grid (Encore, Shopify Tools), or a single dark pricing card (SignSync, RefTrack) for flat/one-plan products.
9. **Waitlist ("build-this" anchor, id used by header/hero CTAs)** — full-bleed dark navy section. White card containing a 4-phase inline form (see "Waitlist Form Flow" below).
10. **FAQ** — eyebrow + H2, then 8-9 accordion rows, single-open-at-a-time.
11. **Footer** — plain white, "early-stage concept from the Sohovi team" note + Privacy/Terms/Contact links.

## Hero Mockups (per page — the key differentiator per product)
Each hero's right column is a white card (`border: 1px solid #E2E8F0`, `border-radius: 16px`, `box-shadow: 0 8px 30px rgba(26,26,46,0.08)`) styled like a small piece of the real product UI, with a header row, 3 content rows, and a footer strip. All rows fade/slide in on mount (staggered), plus one signature looping animation each:

- **SnapBack** — "production-db" backup log. Pulsing teal dot on the "Healthy" status badge (`@keyframes pulseRing`, 2s loop). Thin progress bar under the header animating width 4%→92% and back (`@keyframes barGrow`, 8s ease-in-out infinite alternate) representing time-to-next-backup. 3 log rows (success/success/warning-with-retry).
- **Encore** — Tuesday lesson schedule. "2 makeup credits owed" badge pulses (amber pulse ring). 3 lesson rows (attended / makeup credit / invoice paid). Send icon in the footer bobs horizontally (`@keyframes sendBob`, 1.4s loop) next to "Sent to 3 parents".
- **SignSync** — signature deploy status. Progress bar fills 6%→95% once on mount (`@keyframes barGrow`, 3.5s ease-out). 3 department rows (2 deployed, 1 "Syncing…" with a spinning loader icon, `@keyframes spinSlow`).
- **Shopify Tools** — bulk price sale card. "Scheduled" badge pulses. Thin countdown bar shrinks 96%→8% on a loop (`@keyframes barShrink`, 9s linear infinite) representing time-until-rollback. 2 priced variant rows + a "+212 more variants" summary row.
- **RefTrack** — affiliate dashboard. "$1,240 owed this month" badge has a pulsing teal dot. 3 affiliate rows with click counts and dollar earnings.
- **ShipNotes** — "What's new" changelog widget. Two unread entries have pulsing teal dots (`@keyframes pulseDot`, staggered). 3 changelog entries (2 unread with PR-sourced draft note, 1 read).

Shared keyframes across all pages (identical values, defined per-file in `<style>`):
```css
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
```
Row stagger: `animation: fadeUp 0.5s ease both; animation-delay: 0.1s / 0.2s / 0.3s` for rows 1/2/3. Card itself: `animation: fadeUp 0.6s ease both`.

## Waitlist Form Flow (identical structure, per-product copy/questions)
White card, 4 phases, one visible at a time:
1. **CTA phase** — headline "Count me in", one-line reassurance, single primary button (label configurable per product, e.g. "Let's Build SnapBack →").
2. **Step 1 (email capture)** — email field (+ a product-specific secondary field: name for SnapBack/Encore, company-size pills for SignSync, biggest-pain pills for Shopify Tools, affiliate-count pills for RefTrack, BYOK-AI pills for ShipNotes). Submit → step1-done.
3. **Step1-done** — checkmark icon, "You're on the list", secondary button "Answer a Few Quick Questions" → step 2.
4. **Step 2 (feedback)** — 2-4 product-specific questions (pill-button single-select and/or free-text textareas). Submit → done.
5. **Done** — heart-handshake icon, thank-you copy.

Pill buttons: unselected = white bg / `#E2E8F0` border / navy text. Selected = accent-colored bg / white text / accent border.

## Design Tokens
**Colors (shared base):**
- Navy (primary/dark surfaces): `#1A1A2E`
- Slate background: `#F8FAFC`
- White surface: `#FFFFFF`
- Border: `#E2E8F0` (soft dividers: `#F1F5F9`)
- Body text: `#475569` (muted: `#64748B`, faint: `#94A3B8`)
- Teal (data/trust accent, used for check icons, status dots, "Labs" badge): `#00C9A7` / dark `#007A66`
- Success: `#10B981` / `#059669`
- Warning: `#F59E0B` / `#B45309`
- Error: `#EF4444`

**Per-page accent color** (used for eyebrows, links, primary CTA fill, H1 highlight span, comparison-table tint):
- SnapBack: `#2D7FF9` (blue) — tweakable, alt options `#E07150` terracotta / `#00C9A7` teal
- Encore: `#6D5BA8` (violet) — alts `#E07150` / `#00C9A7`
- SignSync: `#1B63E6` (blue) — alts `#1B63E6` / `#E07150` / `#00C9A7`
- Shopify Tools: `#1B63E6` (user-adjusted from default `#B45309`) — alts `#B45309` / `#E07150`
- RefTrack: `#00C9A7` (user-adjusted from default `#15803D`) — alts `#15803D` / `#1B63E6`
- ShipNotes: `#00876F` (teal-green) — alts `#00C9A7` / `#1B63E6`

Accent "dark" (hover state) = accent darkened ~18% (`v * 0.82` per channel). Accent "tint" (comparison table highlight column) = accent at 6% alpha over white.

**Typography:** Geist Sans (400/500/600/700/800), Geist Mono for monospace bits (filenames, timestamps, prices). H1: `clamp(36px, 4.6vw, 56-58px)`, weight 800, letter-spacing `-0.03em`. H2: `clamp(28px, 3.6vw, 40px)`, weight 700, letter-spacing `-0.02em`. Body: 16-17.5px, line-height 1.6. Eyebrow labels: 12px, uppercase, letter-spacing `0.15em`, accent color.

**Radii:** Buttons 8px. Cards 14-16px. Pills/badges fully round (`9999px`).

**Shadows:** Cards `0 1px 2px rgba(26,26,46,0.04)`; hover `0 4px 12px rgba(26,26,46,0.08)`; hero mockup card `0 8px 30px rgba(26,26,46,0.08)`; highlighted/dark pricing card `0 8px 30px rgba(26,26,46,0.18)`.

**Spacing:** Section vertical padding 88px desktop (72-80px for hero). Max content width 1140px (880px for comparison/pricing, 820px for FAQ, 640px for waitlist card), centered, 24px side padding.

**Icons:** Lucide (via `data-lucide` + `lucide.createIcons()` in the prototype; use `lucide-react` in the real app), stroke width 2, 14-20px depending on context.

## Interactions & Behavior
- Header CTA and hero primary CTA both scroll/link to `#build-this` (the waitlist section).
- FAQ: single-open accordion — clicking a question toggles it open and closes any other open one (chevron rotates 180°).
- Waitlist form: client-side phase state machine (`cta → step1 → step1-done → step2 → done`), no real backend wired in the prototype — hook up to actual signup/feedback API in production.
- Pill-select questions: single-select, clicking toggles the selected value and recolors all pills in the group.
- All buttons/links have a 150ms background-color hover transition; inputs get an accent-colored border on focus.
- Hero mockup animations are presentational only (`aria-hidden="true"` on the whole card) — no user interaction, purely to communicate "this is what the product would look like."

## State Management
Per page, component state needed:
- `phase`: `"cta" | "step1" | "step1-done" | "step2" | "done"` — drives the waitlist form.
- One field per pill-question in step 1/2 (e.g. `wouldPay`, `db`, `teamSize`, `platform`, `painPick`, `catalog`, `affiliates`, `byok`) — string | null.
- `openFaq`: index of the currently-open FAQ row, or null.
- Free-text fields (textareas/inputs in step 2) should be captured into local state and submitted with the rest of the payload on "Send My Answers" — the prototype does not persist these, wire to your actual backend.

## Assets
No external images — everything is CSS/HTML (icons via Lucide, mockups built from styled divs). Fonts loaded from Google Fonts (Geist, Geist Mono) — the production app should use its existing self-hosted/next-font setup instead of the Google Fonts CDN link.

## Copy Reference
Full page copy (headlines, pain points, feature descriptions, comparison rows, pricing, all FAQ Q&A) is present verbatim in each `.dc.html` file's template and should be copied directly into the production components — it's final, not placeholder.
