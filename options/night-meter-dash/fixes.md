---
title: Night meter fix log
date: 2026-11-09
design: night-meter-dash (run 8)
---

# Night meter: review fixes

All five fixes are in `site/` (`css/styles.css` and `index.html`). `night-meter-dash.html` was rebuilt with `runs/run-8/work/build_single.py <run folder>`. Nothing else was changed: the content, wording, colors and imagery are the same as before.

## 1. Closing call to action: buttons pushed to the far right

- **Change:** in `css/styles.css`, `.closer__inner` went from two columns (`7fr / 5fr`) to one column, so the buttons now sit directly under the paragraph. `.closer__actions` changed `justify-content` from `flex-end` to `flex-start` and gained `margin-top: var(--space-2)`. The mobile rules were already left-aligned and were not touched.
- **Verified:** screenshots at 1440x900 in light and dark mode show the headline, the paragraph and both buttons left-aligned in one block. At 375x812 the buttons stack full-width under the paragraph, as before.

## 2. FAQ: empty band under "Questions, answered" in light mode

- **Finding:** `.faq__head` was already `position: sticky; top: 120px`, and a scroll probe confirmed that it stuck. The heading was 240px tall and the answers were 905px tall, so any view that was not scrolling (and every full-page screenshot) still showed a band roughly 700px tall. Fixing the sticky behavior alone would not have removed it.
- **Change:** the layout was rebalanced in `css/styles.css`:
  - `.faq__grid` is now a single column.
  - `.faq__head` is a heading row: the marker spans the row, the `h2` sits on the left (`7fr`), and "Still curious?" sits on the right (`5fr`), bottom-aligned with `justify-self: end`. The sticky rule was removed because it is no longer needed.
  - `.qa` runs the full width in 3 columns, so each column is about as wide as before.
  - The `max-width: 1080px` rule now sets `.qa` to 2 columns.
  - The `max-width: 900px` rule sets `.faq__head { display: block }` and restores `.h2 { margin-bottom: var(--space-5) }`.
  - The existing 1-column rule at 720px was kept.
- **Verified:** at 1440 in light and dark mode the heading row sits directly above the 3-column answers, with no empty column. At 375 the stacked order is the same as before. Horizontal overflow at 375 is 0px.

## 3. Display headline letter-spacing too tight

- **Change:** in `css/styles.css`, `letter-spacing` went from `-0.04em` to `-0.025em` on `.hero__title` ("Clean books / for 1099 taxes."). The same change was made on `.closer__title`, the only other headline at display size, which had the same `-0.04em` and the same near-touching letters. Smaller headings (`.h2` at `-0.03em`) were not touched.
- **Verified:** in the 1440 hero screenshot the letters of "Clean books" no longer touch. At 375 both lines still fit without new wrapping.

## 4. "Sample figures" captions and dotted leaders: low contrast on the dark hero

- **Change** (all in `css/styles.css`):
  - `.device__note` (the caption under the phone) now uses `color: var(--night-text)` (was `--night-muted`), `font-weight: 500`, and a dark backing pill (`background: oklch(0.13 0.04 268 / 0.78)`, `padding: 2px 10px`, pill radius). The pill keeps the contrast steady over the bright bokeh and the dashboard edge behind the phone.
  - `.ledger__sample` (the caption on the tax-plan card) now uses `color: var(--night-text)` and `font-weight: 500`. Its dashed border went from alpha 0.3 to 0.55.
  - The dotted leaders (`.terms__row::after`) went from alpha 0.3 to 0.55.
- **Verified:** I measured each caption's pixels in Chromium: I captured the caption's box with the text hidden and compared every background pixel against the computed text color. The ratios are worst background pixel / 5th percentile:

  | Caption | Before | After |
  |---|---|---|
  | `.device__note`, 1440 | 4.61 / 7.50 | 6.95 / 12.06 |
  | `.device__note`, 375 | — | 14.13 / 15.93 |
  | `.ledger__sample`, 1440 | — | 10.72 at the 5th percentile |
  | `.ledger__sample`, 375 | — | 13.13 at the 5th percentile |

  Before the fix, the brightest rendered pixel of the small caption only reached RGB 101,106,117, which is why it read as faint. For `.ledger__sample`, the lowest single value falls on its dashed border, not behind the text. Every caption is now well above 4.5:1. The screenshots show readable captions and visible leaders.

## 5. Theme toggle aria-label wrong before the script runs

- **Change:** in `index.html`, the initial `aria-label` on `[data-theme-toggle]` changed from "Switch to light mode" to the neutral "Switch color theme". `js/main.js` (`syncThemeLabel`) still sets the exact label once it runs.
- **Verified:** I loaded the page in a fresh Chromium profile with JavaScript disabled, for both a light and a dark system preference. The label is "Switch color theme" in both. With JavaScript on, the label is "Switch to dark mode" in light and "Switch to light mode" in dark, and it flips correctly after a click.

## Checks run on the rebuilt `night-meter-dash.html`

- Puppeteer-core with Chromium, `file://`, a fresh browser profile per page, at 1440x900 and at 375x812 (device scale factor 2), in both light and dark mode.
- The console was clean (0 messages, 0 page errors, 0 failed requests) in all four runs.
- Horizontal overflow was 0px at every size.
- `site/` is byte-identical to the fixed source, and `night-meter-dash.html` is byte-identical to the rebuilt single file.
- `screenshots/desktop.png` (1440x900, dark) and `screenshots/mobile.png` (375x812 at 2x, dark) were re-rendered from the fixed build.
- Pre-fix copies are kept for rollback in `runs/run-8/work/site-before-fixes/` and `runs/run-8/work/single-before-fixes.html`.
