# Bhavita Textiles — Pixel Spec (Home & About)

Reference images: `landing_pixel_grid.png` (881×1785px) and `about_pixel_grid.png` (904×1739px), gridlines every 50px, labeled every 100px. All coordinates below are `(x, y)` in px from top-left of the *reference image*, not the live site — use them as ratios/checkpoints, not literal screen pixels, since real viewport width will differ.

**Context:** the current build is functionally close but not pixel-accurate. This doc exists so the next pass focuses purely on layout, asset, typography, and spacing fixes — no new content/copy changes needed, that part is already correct.

---

## Color tokens (sampled directly from reference PNGs)

| Token | Hex | Used for |
|---|---|---|
| `--cream-bg` | `#F9F4EC` | Page background, hero, light sections |
| `--cream-bg-alt` | `#F1E8DA` | Top utility bar background |
| `--cream-panel` | `#E7DECE` | "Let's Grow Together" panel bg |
| `--dark-green` | `#0C3832` | Stats banner, footer, dark CTA panels |
| `--dark-green-alt` | `#0E3C35` | Secondary dark-green surfaces |
| `--dark-brown` | `#774822` | "Our Story" left image panel overlay |
| `--gold` | `#AD8247` | Primary CTA buttons, top-bar CTA |
| `--gold-light` | `#BE9C6C` | Secondary/lighter gold buttons |
| `--ink` | `#2A2620` (est.) | Headings — sample manually from text glyphs if needed, background sampling isn't reliable on thin text strokes |

> Note: text-color samples came back unreliable (anti-aliasing pulls in background), so pull exact heading/body ink color with a dropper on a thick glyph stroke in your design tool rather than trusting an automated sample.

---

## LANDING PAGE — section map (image is 881×1785)

| y-range (px) | Section | Notes |
|---|---|---|
| 0–55 | Top utility bar + nav | **Not in scope — do not touch** |
| 55–460 | Hero | Left: eyebrow → H1 (2-line, "for" italic) → subhead → body → gold CTA → 4-icon feature row. Right: full-bleed hero image (folded textiles + branded box), text badge top-right corner "TRUSTED BY BUSINESSES / CRAFTED / FOR TOMORROW" |
| 460–500 | Section divider | Small centered ornament + "OUR WHOLESALE COLLECTIONS" heading + subtext, centered |
| 500–720 | Collections grid | 6 cards, equal-width columns, image (~140px tall) + title (uppercase, small) + 1-line description + "VIEW RANGE →" link. Grid gutter ~4–6px, cards flush left/right to container |
| 780–870 | Stats banner | Full-bleed `--dark-green`, 5 stat blocks in a row, divided, gold numbers/labels, vertically centered ~805–860 |
| 900–1090 | "Who Do We Supply To?" | Centered heading+subtext ~915–950, then 7-icon row ~980–1075, icons ~40px, label bold caps, 1-line description below each |
| 1100–1330 | Custom Manufacturing | 2-col: left image panel (~415px wide), right `--dark-green` panel with eyebrow/H2/body/gold CTA, vertically centered content |
| 1100–1330 (right col, same row) | Wholesale Process | Heading + subtext top-left of this column, then 4-step row with icon+number+title+description, evenly spaced |
| 1360–1500 | "Let's Grow Together" | Cream panel bg, H2 left, subtext, 2 CTAs (gold filled + outline) left; 4 icon-badges + decorative fabric image right edge |
| 1500–1785 | Footer | Full-bleed `--dark-green`, 4-column link grid + logo/tagline column, bottom bar with copyright + tagline + legal links |

---

## ABOUT PAGE — section map (image is 904×1739)

| y-range (px) | Section | Notes |
|---|---|---|
| 0–65 | Top utility bar + nav | **Not in scope** |
| 65–390 | Hero | Left: "ABOUT US" eyebrow, 2-line H1, subhead, body, gold "OUR JOURNEY" CTA. Right: full-bleed image of stacked folded fabric + hanging brand tag, dark overlay badge bottom-right "MORE THAN TEXTILES. A PARTNER IN PROGRESS" |
| 390–615 | Our Story | 2-col: left `--dark-brown` image panel (loom weaving photo, ~340px wide) with "Our Story" + "From tradition to tomorrow." centered on image. Right: cream bg, 2-paragraph body copy + peacock feather graphic (right edge) with pull-quote "Tradition inspires us. Your trust drives us." |
| 615–740 | Stats strip | 5 stat blocks (icon + number + label) evenly spaced left-to-right, followed by a `--dark-green` box on the far right: "TRUSTED BY BUSINESSES. CRAFTED FOR TOMORROW." |
| 750–915 | What We Do | Left: heading + body + gold "VIEW OUR COLLECTION" CTA. Right: 4-image grid (2×2 or 1×4 row), each labeled bottom-center over dark gradient overlay: Premium Quality / Wide Range / Custom Solutions / Reliable Supply |
| 940–1090 | Our Values | Heading top-left, 5 icons in a row (outline style, brown) each with 2-line caps label underneath, right-edge pull-quote over soft fabric image: "Rooted in values. Growing with purpose." |
| 1090–1310 | Manufacturing Strength + Sustainability | 3-col: left dark image ("CRAFTED BY PEOPLE. INSPIRED BY HERITAGE." overlay text), middle = heading + body + 5-item checklist (check icon + text), right = leaf icon + "Sustainable Future" heading + body + gold "OUR SUSTAINABILITY" CTA |
| 1310–1460 | Our Global Presence | Left: globe icon + heading + body. Center: world map graphic with route/dot markers. Right: "INDIAN TEXTILES FOR A BRIGHTER, MORE BEAUTIFUL TOMORROW." (right-aligned caps) |
| 1460–1560 | CTA banner | Full-bleed `--dark-green`, centered heading "Let's Build Something Beautiful Together" + subtext + 2 CTAs (gold filled + outline), peacock feather graphic bottom-right with "QUALITY / PARTNERSHIP / GROWTH" labels |
| 1560–1739 | Footer | Same structure as Landing footer, adjusted link columns (Products / Company / Resources / Get in Touch) |

---

## Typography (visual read, confirm against your type scale)

- **Display/H1**: serif, ~40–44px, tight line-height (~1.05), one word italicized in hero ("*for*")
- **Section H2**: serif, ~30–34px
- **Eyebrow labels**: sans, ~11px, uppercase, letter-spacing ~0.15–0.2em, gold/brown color
- **Body copy**: sans, ~14–15px, line-height ~1.6, muted ink-2 color
- **Card titles** (collections grid): sans, ~12px, bold, uppercase, tight tracking
- **Stat numbers**: serif, ~26–28px
- **Buttons**: sans, ~11px, uppercase, bold, letter-spacing ~0.15em

---

## Spacing checkpoints to verify against current build

- Hero left-column max-width should stop well before the image split (~55% / 45% split on Landing, similar on About)
- Collections grid cards: no visible gap should be wider than the card gutter — currently common failure point is uneven card widths
- Dark-green full-bleed sections must run edge-to-edge (`100vw`), not be constrained to the container — check `stats banner`, `custom manufacturing right panel`, `footer`, and both closing CTA banners
- Icon rows (Who Do We Supply To / Our Values / Process steps) must be evenly distributed with equal gutter, not left-packed
- Peacock feather and world-map graphics are decorative — confirm these exist as real assets in the project, not placeholders

---

## Deliverables attached
- `landing_pixel_grid.png` — Landing page reference with 50px grid + pixel-coordinate labels
- `about_pixel_grid.png` — About page reference with 50px grid + pixel-coordinate labels
- This spec (`pixel_spec.md`)

**Status:** current implementation is content/structure-correct but still needs layout, asset, typography, and spacing passes to match these references pixel-for-pixel. Use the gridded images above to check exact section boundaries and alignment while implementing.
