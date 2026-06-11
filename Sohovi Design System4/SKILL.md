---
name: sohovi-design
description: Use this skill to generate well-branded images and interfaces for Sohovi, a B2B data quality platform — for production or for throwaway prototypes/mocks. Contains the Sohovi visual language (palette, type, shape rules), a shared SVG builder library, and 99 ready-made images: inline blog diagrams (flows, before/after, charts, tables, venn, funnel), video thumbnails, blog covers, and OG social cards.
user-invocable: true
---

Read `readme.md` in this skill first, then explore the other files.

## What's here
- `readme.md` — the image guide and full manifest (palette, type, formats, naming, locations).
- `index.html` — browsable gallery of all 99 images.
- `lib/svglib.js` — shared SVG builder (palette `P`, `svg/box/arrow/table/icon/gauge/...`). Load with `const L = new Function(await readFile('lib/svglib.js'))()`. Every text node sets `font-family` directly (the file sanitizer strips `<style>` from SVG).
- `diagrams/*.svg` — 76 inline blog diagrams, web-ready.
- `raster/**` — editable SVG masters for thumbnails, covers, OG cards.
- `assets/**` — rasterized deliverables: `video-thumbs/*.webp` (1280×720), `covers/*.webp` (1200×628), `og/*.png` (1200×630).

## Brand rules (non-negotiable)
- Palette, max 3 colors per image: Cream `#F4F4F5`, Ink `#0A0A0A`, Electric Blue `#2D7FF9`, Mint `#00C9A7`, Butter `#FFE439` (call-outs only), White `#FFFFFF`, hairline `#E2E8F2`.
- Type: Inter / DM Sans (geometric sans); JetBrains Mono for code/data. 8px radius, 1–1.5px borders, line-art icons.
- No gradients, shadows, textures, emoji, 3D, or clutter. Whitespace is a design element.

## How to work
- **New image like an existing one:** reuse `lib/svglib.js` and follow the matching generator pattern; keep the same dimensions and naming (`blog-[id]-[slug].svg`, `thumb-NN-[slug].webp`, `cover-[topic].webp`, `og-[page].png`).
- **Rasterizing:** draw the SVG to a canvas at native size and encode (WebP for thumbs/covers, PNG for OG). Swap the Inter-first font stack to a system sans (e.g. `DejaVu Sans, Arial, sans-serif`) before headless rendering so text stays crisp.
- **Visual artifacts (slides, mocks, throwaway prototypes):** copy assets out and produce static HTML for the user to view.
- **Production code:** copy assets and apply the rules here to design natively on-brand.

If invoked with no other guidance, ask the user what they want to build, ask a few focused questions, then act as an expert Sohovi designer who outputs HTML artifacts or production-ready assets.

## Source of truth
`image_soho/image.md` (the Sohovi Image System spec) — every image and its production landing spot.
