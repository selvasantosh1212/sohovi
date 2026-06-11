# Handoff: Sohovi Marketing Landing Page — "Instant" Revamp

## Overview
A full visual revamp of the Sohovi marketing landing page (Hero → Brand strip → Capabilities → Pricing → Final CTA → Footer). The look is inspired by modern SaaS sites (instant.one / Linear): a **flat pure-white canvas**, **heavy near-black headlines**, a **calm monochrome frame** where color lives mostly inside the product mockups, plus a **signature yellow accent** (`#FFE439`) and **periwinkle capability cards** (`#BDBDDA`). The hero headline features a hand-drawn **yellow pen-strike** animation that crosses out the words "expensive tools".

The content/copy is unchanged from the original site — this handoff is about look, feel, color, type, and the one hero animation.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — a prototype showing the intended look and behavior, **not production code to copy verbatim**. The task is to **recreate this design in the target codebase's existing environment** (the real Sohovi app is Next.js 16 + Tailwind v4 + shadcn/ui — see the design system notes) using its established components and patterns. Lift the exact tokens (hex, fonts, spacing, radii, animation timing) documented below; rebuild the structure with the codebase's own primitives.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, and the hero interaction are all specified below with exact values. Recreate pixel-faithfully.

---

## Design Tokens (EXACT — use these verbatim)

> The base design system (`colors_and_type.css`) ships an "Electric Data – Light" theme (cool off-white canvas, blue/green accents). **This landing page overrides those tokens at the page level** to the flat-white + monochrome + yellow scheme. The values below are the **effective** values for this page — use them as the source of truth.

### Brand / accent colors
| Token | Hex / value | Usage |
|---|---|---|
| **Signature yellow** | `#FFE439` | NEW badge fill, "Apply all suggestions" button, featured pricing CTA ("Start 14-day trial"), Final-CTA panel background, footer privacy-badge text + icon |
| **Periwinkle** | `#BDBDDA` (`rgb(189,189,218)`) | Capability card backgrounds (all 3) |
| **Navy ink** | `#37376B` (`rgb(55,55,107)`) | Eyebrow/labels on periwinkle & yellow surfaces, capability-card check icons |
| **Black** | `#0A0A0A` | Headlines, primary buttons, "Most Popular" badge, featured-card border, footer privacy-badge fill |
| **Dark gray (hover/CTA)** | `#2A2A2E` | Hero primary button fill, primary button hover |

### Canvas / surfaces
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FFFFFF` | Page canvas (flat white) |
| `--bg-soft` | `#F4F4F5` | Neutral product tiles / section wells |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#F1F1F3` | Hover / inputs / track |
| `--surface-3` | `#E8E8EB` | Active / popover / scrollbar thumb |
| `--line` | `#E9E9EC` | Hairline borders |
| `--line-soft` | `#F1F1F3` | Faint internal dividers |

### Text
| Token | Hex | Usage |
|---|---|---|
| `--text` | `#0A0A0A` | Headlines / primary ink |
| `--text-soft` | `#5B5B63` | Body / secondary |
| `--text-mute` | `#8A8A90` | Meta, captions, eyebrows |
| `--text-faint` | `#BDBDC2` | Footer fine print, disabled |

### Data-viz colors (kept from the design system — used ONLY inside the product mockups)
| Token | Hex | Usage |
|---|---|---|
| `--score-high` | `#10B981` | DQ score ≥95 (emerald) |
| `--score-good` | `#0AAEC0` | DQ score 80–94 (teal) |
| `--score-warn` | `#E0900C` | DQ score 60–79 (amber) |
| `--score-danger` | `#E5484D` | DQ score <60 (red) |
| `--green` / `--green-bright` | `#13B981` / `#0E9E68` | "Live" pill, hero feature checks, PII-found tile |
| `--blue` | `#2D7FF9` | "ML SUGGESTED" chip, column-type chips in mock |
| Mock window dots | `#FF5C7A` `#FFC53D` `#22E586` | Traffic-light dots in the browser-chrome mock |

> Rule of thumb: **the page chrome is monochrome + yellow/periwinkle. Vivid blues/greens/ambers only appear inside the dashboard mock cards** (gauges, score bars, chips).

---

## Typography (EXACT)

**Font families** (loaded via Google Fonts):
```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');
```
- **Sans (UI + headlines):** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Mono (filenames, column names, technical metadata):** `'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace`
- (`Instrument Serif` is in the base system but **not used** on this page.)

> In the production Next.js app, load Inter + Geist Mono via `next/font/google` rather than the CDN `@import`. Match the weights above.

**Type ramp** (class → size / weight / line-height / letter-spacing). Note the landing page makes headlines **heavier and tighter** than the base system:
| Class | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|
| `.ds-display` (hero H1) | `clamp(40px, 6.4vw, 80px)` | **800** | 1.02 | **-0.045em** | `--text` |
| `.ds-h1` (section titles) | `clamp(30px, 4.2vw, 52px)` | **800** | 1.05 | **-0.038em** | `--text` |
| `.ds-h2` (pillar headlines) | `clamp(22px, 2.4vw, 30px)` | 700 | 1.15 | **-0.028em** | `--text` |
| `.ds-h3` | 19px | 600 | 1.3 | -0.015em | `--text` |
| `.ds-lead` (hero subhead) | 18px | 400 | 1.55 | — | `--text-soft` |
| `.ds-body` (pillar body) | 15px | 400 | 1.6 | — | `--text-soft` |
| `.ds-sm` | 13px | 400 | — | — | `--text-soft` |
| `.ds-meta` | 12px | 400 | — | — | `--text-mute` |
| `.ds-eyebrow` (UPPERCASE kicker) | 11px | 700 | — | **0.16em** | `--text-mute` (navy `#37376B` on colored panels) |
| `.ds-mono` | 13px | 400 | — | 0 | `--text` |

> The base `.ds-grad-text` (blue→green gradient word) is **disabled** on this page — accent words render as solid `--text` (black). Do not reintroduce the gradient.

---

## Radii, shadows, spacing

**Radii**
- Buttons: **12px** (base system pills are overridden to a soft rect here)
- Cards/panels (`--radius-lg`): **20px**
- Capability cards & Final-CTA panel: **28px** (inline)
- Hero product-mock frame: 20px; inner mock cards: 12–14px
- Pills / badges / chips: `999px`

**Shadows** (soft, low, tinted near-black — never pure black, no glow)
- Card resting: `0 1px 2px rgba(10,10,10,.03), 0 10px 28px -18px rgba(10,10,10,.12)`
- Card hover: `0 1px 2px rgba(10,10,10,.04), 0 16px 38px -20px rgba(10,10,10,.18)`
- Hero product mock: `0 1px 2px rgba(10,10,10,.04), 0 30px 70px -34px rgba(10,10,10,.22)`
- Featured pricing card: `0 0 0 1px #0A0A0A, 0 18px 40px -22px rgba(10,10,10,.25)` (black 1px ring + lift)

**Layout / spacing**
- Page max-width: nav `1180px`, hero copy `980px`, hero mock `920px`, pricing `1080px`, capabilities `1180px`. Centered with `padding: 0 24px`.
- Section vertical padding: Capabilities `88px 0`, Pricing `72px 0`, Final CTA `40px 24px 80px`.
- Capability card padding: `44px`; inner grid `2 columns, gap 48px`, image/text order alternates per row.

---

## Components

### Buttons (`.sv-btn`)
- Base: `inline-flex; gap 8px; font-family Inter; font-weight 600; border-radius 12px; border 1px solid transparent; transition: background/box-shadow/border-color/color .16s ease`.
- Sizes: `sm` = `7px 14px / 13px`; `md` = `10px 18px / 14px`; `lg` = `13px 24px / 15px`.
- **Primary:** bg `#0A0A0A`, text `#fff`; hover bg `#2A2A2E`. (Hero primary CTA sets bg `#2A2A2E` directly.)
- **Outline:** bg `#fff`, text `--text`, border `--line`; hover bg `--surface-2`, border `#DBDBDF`.
- **Yellow CTA variant** (used for "Apply all suggestions" and the featured pricing button): bg `#FFE439`, text `#0A0A0A`.
- Primary CTAs carry a trailing `→` (Lucide `arrow-right`, `iconRight`).

### Cards (`.sv-card`)
- White fill, `1px solid --line`, radius `--radius-lg` (20px), resting/hover shadows above. No glow, no transform on hover.

### Capability cards (the 3 big rows)
- Background **periwinkle `#BDBDDA`**, border `1px solid --line`, radius 28px, padding 44px.
- Eyebrow label: navy `#37376B`, 11px, 700, uppercase, `0.16em`.
- Body text: card 3 ("Intelligent Rules") uses solid black `#000`; cards 1–2 use `--text-soft`.
- Bullet check icons: **navy `#37376B`** (Lucide `check`, size 16) — chosen for legibility on periwinkle (yellow checks were illegible there).
- Each card contains a white product-mock `Card` on one side (profiling rows / score gauge / suggested-rules list).

### Chips / badges (pill, `999px`)
- `inline-flex; gap; padding ~3px 9px / 7px 12px; font 10.5–11.5px; font-weight 600–700`.
- NEW badge: bg `#FFE439`, text `#0A0A0A`.
- "MOST POPULAR": bg `#0A0A0A`, text `#fff`, `white-space: nowrap`.
- "Zero bytes uploaded" (footer privacy): bg `#0A0A0A`, Lucide `shield-check` icon + text both `#FFE439`, `white-space: nowrap`.
- In-mock chips ("ML SUGGESTED", column types): blue tint from base system.

### Icons
- **Lucide** exclusively, stroke-width 2. Sizes: 12px inline / 14–16px in lists / 17px in lg buttons.
- Single-color, tinted to adjacent text or accent. Never gradient.

### Nav
- Sticky pill nav, max-width 1180px, `border-radius 999px`, `1px solid --line`, glass background `rgba(255,255,255,.72)` + `backdrop-filter: blur(14px)`, gains a soft shadow after 12px scroll. Logo = 26px black rounded square with "S" + wordmark SVG.

---

## The hero pen-strike animation (signature interaction)

The hero H1 reads: **"You don't need _expensive tools_ to understand your data."** The phrase "expensive tools" is wrapped in `<span class="hero-strike">` and gets a hand-drawn **yellow pen stroke** drawn across it on a loop.

**Markup:**
```html
<span class="hero-strike">expensive tools<svg class="hero-pen" viewBox="0 0 300 20"
  preserveAspectRatio="none" aria-hidden="true">
  <path pathLength="100" d="M2,11 C58,8 104,13.5 150,10.5 C200,7.5 250,13 298,9.5" />
</svg></span>
```

**CSS:**
```css
.hero-strike {            /* MUST be inline-block so the SVG can take full width */
  position: relative; display: inline-block; white-space: nowrap; color: var(--text);
  animation: heroStrikeText 5.4s cubic-bezier(.65,0,.35,1) 1s infinite;
}
.hero-pen {               /* overlays the phrase, slightly wider, vertically centered */
  position: absolute; left: -2%; width: 104%; top: 52%; height: 0.52em;
  transform: translateY(-50%); overflow: visible; pointer-events: none;
}
.hero-pen path {
  fill: none; stroke: #FFE439; stroke-width: 4.6;
  stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke;
  stroke-dasharray: 2000; stroke-dashoffset: 2000; /* placeholder; real value set by JS */
}
@keyframes heroStrikeText {  /* words dim to gray while the line is drawn */
  0%, 6%   { color: var(--text); }
  20%, 70% { color: var(--text-mute); }
  86%,100% { color: var(--text); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-strike { animation: none; color: var(--text-mute); }
  .hero-pen path { animation: none; stroke-dashoffset: 0; opacity: 1; }
}
```

**JS (critical):** browsers ignore `pathLength` when computing `stroke-dasharray` under `preserveAspectRatio="none"`, which breaks the line into segments. So **measure the real drawn length and set the dash exactly**, then inject the draw-on keyframes:
```js
const path = document.querySelector(".hero-pen path");
const L = Math.ceil(path.getTotalLength());
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const css = reduce
  ? `.hero-pen path{stroke-dasharray:${L};stroke-dashoffset:0;opacity:1}`
  : `.hero-pen path{stroke-dasharray:${L};stroke-dashoffset:${L};
       animation:heroPenDraw 5.4s cubic-bezier(.55,0,.3,1) 1s infinite}
     @keyframes heroPenDraw{
       0%{stroke-dashoffset:${L};opacity:1}
       16%,70%{stroke-dashoffset:0;opacity:1}
       85%,100%{stroke-dashoffset:0;opacity:0}}`;
// append `css` in a <style> after the SVG mounts
```
> In React, do this in a `useEffect` / ref callback after layout; re-measure on resize if the headline can reflow. Easing: draw-on `cubic-bezier(.55,0,.3,1)`, ~5.4s full loop (1s initial delay, draw 0→16%, hold to 70%, fade out by 85%).

---

## Per-section spec

1. **Nav** — sticky glass pill (see Components → Nav). Links: Features · How it works · Free tools · Pricing · FAQ. Right: "Sign in" text link + black "Get started" button.
2. **Hero** — centered. NEW yellow badge + "AI DQ rule suggestions, now built in". H1 with pen-strike. Lead subhead (max 600px). Two CTAs: black "Get started free →" (bg `#2A2A2E`) + outline "Watch demo" (Lucide `play`). Trust row: 3 items with green check icons. Below: a white browser-chrome **product mock** (filename, "Live" pill, score gauge, dimension bars, Null-spike + PII-found tiles).
3. **Brand strip** — "Trusted by data teams at" + marquee of 8 names (`--text-faint`), masked edges, `mkt-marquee 38s linear infinite`.
4. **Capabilities** — eyebrow "PLATFORM CAPABILITIES" + `.ds-h1`. Three periwinkle rows (Instant Understanding / Measurable Quality / Intelligent Rules), alternating text↔mock sides, navy labels + navy check bullets, neutral chips, each with a white product mock. "Apply all suggestions" button in row 3 is **yellow**.
5. **Pricing** — eyebrow "PRICING" + `.ds-h1`. 3 cards (Solo $0 / Team $24 featured / Enterprise Custom). Featured card: black border + ring, black "MOST POPULAR" pill, **yellow "Start 14-day trial" button (black text)**. Feature lists use green check icons.
6. **Final CTA** — full **yellow `#FFE439`** rounded panel (28px). Navy "GET STARTED" eyebrow, black `.ds-h1`, lead, black "Get started free →" + white "Book a demo" buttons.
7. **Footer** — white, hairline top border. Logo + blurb + black "Zero bytes uploaded" privacy pill (yellow icon+text). 3 link columns (Product / Resources / Company). Bottom row: © line + "Made for data teams who care." (mono, `--text-faint`).

---

## Interactions & behavior
- **Nav:** adds shadow after `scrollY > 12` (300ms transition). Link hover: `--text-soft` → `--text`.
- **Buttons:** color-darken on hover only (no transform). 160ms ease.
- **Cards:** shadow deepens on hover (180ms), no transform.
- **Pen-strike:** ~5.4s loop as specified; respects `prefers-reduced-motion`.
- **Brand marquee:** continuous 38s linear loop.
- No parallax, no scroll-linked motion, no bounce/spring.

## State management
Static marketing page — no app state. Only local UI state: nav scrolled boolean. (Mock data — dimensions, columns, plans — is hard-coded display data.)

## Assets
- **Logo:** `assets/sohovi-logo.svg` (black wordmark, single path, viewBox 314.84 × 78.41). Plus a 26px black rounded-square "S" mark beside it.
- **Icons:** Lucide (`check`, `arrow-right`, `play`, `shield-check`, `alert-triangle`, etc.). In production use `lucide-react`.
- No photos, no illustrations, no gradients, no textures.

## Files in this bundle
- `index.html` — page shell: Google-font load, **page-level token overrides + component CSS overrides + pen-strike CSS**, and the pen-strike measurement JS. The most important file for exact values.
- `Hero.jsx` — Nav, Hero, hero product mock.
- `Sections.jsx` — Brand strip, Capabilities (+ pillar mocks), Pricing, Final CTA, Footer.
- `Primitives.jsx` — shared `Icon`, `Card`, `Button`, `Chip`, score widgets (gauge / bars / badge).
- `colors_and_type.css` — base design-system tokens + `.ds-*` type classes (the page overrides a subset; see Tokens).
- `_kit.css` — base `.sv-btn` / `.sv-card` component classes (the page overrides a subset).

> To preview the reference: open `index.html` (it expects `colors_and_type.css` two levels up and `_kit.css` one level up in the original project; paths are noted in each file's `<head>`). Treat the rendered page as the visual target.

## Screenshots (visual reference)
In `screenshots/` — the rendered design target:
- `01-hero.png` — Hero: nav, yellow NEW badge, H1 with the yellow pen-strike (shown fully drawn), CTAs, trust row.
- `02-capabilities.png` — Capabilities header + first periwinkle card (Instant Understanding) with its white profiling mock.
- `03-capability-card-intelligent-rules.png` — Third periwinkle card: navy labels + navy check bullets, white suggested-rules mock, **yellow "Apply all suggestions"** button.
- `04-pricing.png` — Three pricing cards; featured "Team" card with black ring, black "MOST POPULAR" pill, **yellow "Start 14-day trial"** button.
- `05-final-cta-and-footer.png` — Yellow Final-CTA panel + footer with the black "Zero bytes uploaded" privacy pill.
