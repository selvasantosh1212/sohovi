# Sohovi — Image System

Complete image library generated from the Sohovi image specification (`image_soho/image.md`). 99 images in one rigid visual language: flat vector, max three colors per image, clean geometric sans type, generous whitespace — no gradients, shadows, textures, emoji, or 3D.

**Open `index.html`** for the browsable gallery.

## Brand palette
| Role | Hex | Name |
|---|---|---|
| Background | `#F4F4F5` | Cream |
| Primary / text | `#0A0A0A` | Ink |
| Brand accent | `#2D7FF9` | Electric Blue |
| Success / live | `#00C9A7` | Mint |
| Call-out | `#FFE439` | Butter |
| Surface | `#FFFFFF` | White |
| Hairline | `#E2E8F2` | — |

Type: Inter / DM Sans (geometric sans). Mono accents: JetBrains Mono. Shapes: 8px radius, 1–1.5px borders, line-art icons.

## Contents (99 images)

| Set | Count | Format | Dimensions | Location |
|---|---|---|---|---|
| Flow / workflow diagrams | 25 | SVG | scalable | `diagrams/blog-flow-*.svg` |
| Before / after comparisons | 12 | SVG | scalable | `diagrams/blog-ba-*.svg` |
| Charts & graphs | 17 | SVG | scalable | `diagrams/blog-chart-*.svg` |
| Tables & dashboard mockups | 14 | SVG | scalable | `diagrams/blog-table-*.svg` |
| Venn / relationship | 4 | SVG | scalable | `diagrams/blog-venn-*.svg` |
| Funnel / pyramid | 4 | SVG | scalable | `diagrams/blog-funnel-*.svg` |
| Video tutorial thumbnails | 9 | WebP | 1280×720 | `assets/video-thumbs/thumb-*.webp` |
| Blog cover images | 8 | WebP | 1200×628 | `assets/covers/cover-*.webp` |
| OG / social cards | 6 | PNG | 1200×630 | `assets/og/og-*.png` |

Naming follows the spec's § 4 convention exactly, so each file drops straight into its production landing spot (Supabase `blog-images/`, `video-thumbs/`, or `/public/og/`).

## How these were built
- **`lib/svglib.js`** — a shared SVG builder library (palette, boxes, arrows, tables, charts, icons, gauges) so all 99 images share one consistent visual language. Every text node carries an explicit `font-family` attribute (the project sanitizer strips `<style>` blocks from SVG).
- **`diagrams/`** — the 76 inline SVGs, used as-is on the web (Inter-first font stack, falls back to the viewer's system sans).
- **`raster/`** — SVG masters for the thumbnails, covers, and OG cards.
- **`assets/`** — the rasterized WebP/PNG deliverables. During rasterization the Inter-first stack is swapped to a guaranteed-installed sans so headless rendering stays crisp. All files are well under the spec's size budgets.

## Regenerating a raster image
Edit the corresponding master in `raster/`, then re-rasterize SVG → WebP/PNG (swap the font stack to a system sans, draw to canvas at native dimensions, encode). See git history / the build scripts used to produce `assets/`.

## Source
Spec: `image_soho/image.md` (Sohovi Image System) — a B2B data-quality platform. The spec is the single source of truth for every prompt and each image's production placement.
