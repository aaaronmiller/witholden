---
title: Night shift dusk fix log
date: 2026-11-09
design: night-shift-dusk (run 6)
---

# Night shift dusk: review fixes

All five fixes are in `site/` (`css/styles.css`, `index.html`, `js/main.js` and `assets/img/road-dawn.svg`). `night-shift-dusk.html` was rebuilt with `runs/run-6/work/build_single.py out/site out/single/index.html`. Apart from the items below, the content, wording and look are the same as before.

## 1. Escape did not close the mobile menu

- **Change:** `js/main.js` now has a `document` `keydown` listener next to the existing menu handlers. When the key is Escape and `[data-burger]` has `aria-expanded="true"`, it calls `setMenu(false)` and then `burger.focus()`.
- **Verified:** at 375x812 I opened the menu, focused a menu link and pressed Escape. The menu became `hidden`, `aria-expanded` went back to "false", the label went back to "Open menu", and focus returned to the menu button.

## 2. Slashed zero in body text ("1Ø99", "2Ø26", "3Ø days")

- **Finding:** the bundled Atkinson Hyperlegible Next subset has only a slashed zero (`zero` and `zero.tf`), and there is no OpenType feature that turns the slash off. So `font-feature-settings` cannot fix it.
- **Change:** `css/styles.css` adds a digits-only face, `@font-face "Withholden Figures"`. It uses the existing `overpass-latin.woff2` with `unicode-range: U+0030-0039`. `--font-body` is now `"Withholden Figures", "Atkinson Hyperlegible Next", ...`. Body digits now come from Overpass, the display face, whose zero is plain. All letters still use Atkinson. No new font file was added.
- **Verified:**
  - I wrapped every digit run on the page (53 runs) and asked Chromium (via the Chrome DevTools Protocol call `CSS.getPlatformFontsForNode`) which font actually rendered each one. After the fix: Overpass for 48 runs, Overpass Mono for 4, and Atkinson for **0**. Before the fix, Atkinson rendered 26 of them.
  - A glyph test confirmed that the zeros in Overpass and Overpass Mono are plain.
  - The screenshots show a plain zero in "1099", "2026", "30 days", "$8.99", "$612.40" and the other figures.

## 3. "Start Pro free" was a small dark button next to the amber featured plan

- **Changes:**
  - In `index.html`, the Pro plan's button changed from `btn btn--ink` to `btn btn--amber`, the primary style also used by the hero and the other plan.
  - In `css/styles.css`, `.plan .btn` changed from `align-self: flex-start` to `align-self: stretch` at every width (before, it stretched only below 640px).
- **Verified:** at 1440 in light and dark mode, the screenshots show "Start Pro free" and "Start Hands Free Taxes free" at the same full card width and height, both amber. At 375 both buttons are full width, as before.

## 4. Light-mode hero: road lines and skyline read as haze

- **Change:** only the light (dawn) road art changed. In `runs/run-6/work/make_art.py` the `DAWN` palette now uses:

  | Setting | Before | After |
  |---|---|---|
  | `city` | `#a9b3dd` | `#6874ad` |
  | `city_op` | 0.55 | 0.78 |
  | `asphalt` | `#aeb8e0` | `#8590c4` |
  | `pole` | `#8592c8` | `#55629c` |
  | `lane_op` | 0.85 | 0.95 |
  | `window` | `#ffffff` | `#fff4d6` |

  I regenerated the art and copied in only `assets/img/road-dawn.svg`. The regenerated `road-dusk.svg` is byte-identical to the shipped one (checked with `cmp`), so dark mode is unchanged. The pre-fix generator is kept at `runs/run-6/work/make_art.before-fixes.py`.
- **Rejected approach:** I first tried a light-only CSS `filter: contrast()`. It washed the skyline out to white and turned the sun glow yellow-green, so I removed it.
- **Verified:**
  - The 1440 and 375 light screenshots show a clear skyline, a distinct road surface and visible lane dashes and poles.
  - The dark screenshots look the same as before.
  - The hero text still has strong contrast over the new art. For `.hero__lede`, measured as worst background pixel against the text color: 5.64:1 at 1440 (was 6.72) and 5.92:1 at 375 (was 6.18).

## 5. Problem chart: "Gig payout" bar looked the same as W-2 take-home pay

- **Changes:**
  - In `index.html`, the gig payout bar is now `<i class="bar__keep"></i><i class="bar__owed"></i>` (was a single `bar__keep bar__keep--whole`). The bar is still full length because the payout lands whole. Its last segment sits in the same position as the W-2 bar's withheld slice, and no new numbers or percentages were added.
  - In `css/styles.css`, the new `.bar__owed` segment uses primary-blue diagonal hatching on a pale primary tint, with a 2px dashed primary outline. It is distinct from the solid blue take-home segment and from the W-2's grey withheld hatch.
  - The diagram's `aria-label` changed from "a gig payout lands whole;" to "a gig payout lands whole, with the taxes on it still owed;" so the text alternative describes the new segment. The visible captions are unchanged.
- **Verified:** in light and dark mode, at 1440 and 375, the screenshots show the gig payout bar with a hatched, dashed-outline end segment lined up under the W-2 withheld slice. The existing grow animation still runs.

## Checks run on the rebuilt `night-shift-dusk.html`

- Puppeteer-core with Chromium, `file://`, a fresh browser profile per page, at 1440x900 and at 375x812 (device scale factor 2), in both light and dark mode.
- The console was clean (0 messages, 0 page errors, 0 failed requests) in all four runs.
- Horizontal overflow was 0px at every size.
- `site/` is byte-identical to the fixed source, and `night-shift-dusk.html` is byte-identical to the rebuilt single file.
- I re-rendered `screenshots/desktop.png` (1440x900, dark) and `screenshots/mobile.png` (375x812, dark) from the fixed build.
- I also refreshed the existing `screenshots/desktop-light.png` and `screenshots/mobile-light.png`, at the same sizes, so they no longer show the old hazy light hero. Nothing was deleted.
- Pre-fix copies are kept for rollback in `runs/run-6/work/site-before-fixes/` and `runs/run-6/work/single-before-fixes.html`.

## 2026-11-19: palette separated from night-meter-dash

Both night designs were navy (hue 262-268) with amber (hue 78-86), so they read as one idea. Every hue in this design was rotated in OKLCH: navy to plum (+58 degrees, H320-324) and amber to coral (-42 degrees, H38). Lightness and chroma are unchanged, so contrast ratios are unchanged. Applied to `site/css/styles.css`, `site/index.html`, `site/assets/img/*.svg` and `night-shift-dusk.html`; screenshots retaken; gallery rebuilt.
