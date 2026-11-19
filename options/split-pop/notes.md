---
title: Withholden homepage, run 10 ("Split Pop")
date: 2026-11-09
skill: frontend-design-masterclass v2.7 (copy in ./skill)
---

# Withholden homepage, run 10: "Split Pop"

## Page purpose

A young 1099 gig worker on a phone comes to see that Withholden automatically sets aside their taxes and keeps their books for every payout, and then starts the 30-day free trial.

Every section supports that one action. The primary CTA reads "Start 30-day free trial" (or the live site's own label for that section) and points to https://withholden.com/sign-up.

## Design direction and why

**Split Pop.** This direction uses saturated full-bleed colour slabs and very large, wide display type. The product's own app UI is the hero subject: a tilted phone shows the tax savings account. Around the phone, a payout chip ("Uber 1099 deposit +$612.40") lands and a lime "$135 to tax savings" slice peels away from it.

- **Palette (OKLCH, split-complementary):**
  - Primary: hot pink, hue 357.
  - Accents: lime, hue 128, and aqua, hue 205.
  - Base: tinted toward pink, with deep plum ink.
  - Category hues are fixed for the whole page. Withholden Pro is always pink and Hands Free Taxes is always aqua. Pink, lime and aqua rotate through the problem items, the steps, the features and the FAQ rules.
  - Dark mode was designed separately, not inverted. It uses deep plum surfaces, pink and lime glows instead of hard shadows, outlined lime step numerals, and plan blocks that are gradients with a coloured top rule.
- **Type:**
  - Unbounded (variable 500 to 900) for display. It is wide and loud, and numbers read well in it.
  - Figtree (variable 400 to 800) for body text.
  - Both are self-hosted as woff2.
- **Signature move: "the split."** The hero chips show it, and the "See it in action" section repeats it as a working control. A slider sets the tax savings percentage on a sample payout, and a two-colour bar and live numbers split it into "Yours to spend" and "To tax savings". Everything is labelled "Sample payout" and "not tax advice".
- **Imagery:** riso-style halftone "stacked coins seen from above", printed in lime and plum dots with deliberate misregistration. It forms the hero image layer and comes back in the final CTA.

**How it differs from the other five options:**
- There is no night, road, highway, windshield, dashboard or lane-line imagery.
- There is no navy or amber, no Overpass, and no calm ledger or paper surface.
- The whole page is bright, saturated and made for a phone.

## Direction Exploration (skill step 1)

| # | Sketch | Score |
|---|---|---|
| A, chosen | **Split Pop.** Pink 357 with lime 128 and aqua 205 (split-complementary). Unbounded with Figtree. Stacked full-bleed colour slabs. The hero is a tilted phone app UI over halftone coins with grain. Signature: the live split slider. | 5 |
| B | **Sticker Sheet.** Tomato, cobalt and butter (triadic). Bricolage Grotesque with Manrope. A neo-brutalist bento grid of app-screen "stickers" with thick outlines. The hero is a collage of app cards. | 3 |
| C | **Mint Receipt Kinetic.** Electric mint with coral (complementary). Syne with Public Sans. A kinetic marquee of payouts with a huge animated number counter as the hero. | 2 |

- **B lost** because its outlines and bento collage read as a templated brutalist kit, and they weaken trust for a money product.
- **C lost** because green-for-money is the Cash App and Robinhood cliché, and a giant counter reads as an invented statistic.

## Skill steps followed

- **Read SKILL.md in full.** Loaded these references:
  - landing-pages.md (hero anatomy, styles, Section 5 conversion and launch readiness, mobile)
  - color-system.md (harmony models, three-group palette, light and dark construction)
  - typography.md (catalogues)
  - imagery.md (three-layer stack)
  - microanimations.md (motion tokens, nav scroll rule)
  - motion-craft.md (easing, durations, press, origin, reduced motion)
  - Skipped as not relevant: data-visualization, mermaid and web-design-themes. hallmark.md was not read because Hallmark was not named.
- **Direction Exploration:** three sketches, scored, one picked (table above).
- **System Lock:** the token block at the top of `css/styles.css` holds:
  - OKLCH colour roles for both modes
  - a fluid type scale with weights
  - radii per level
  - a 4px spacing scale
  - motion tokens (`--duration-*`, `--ease-*`)

  Components consume tokens only. The only literals left are a few one-off animation timings on the hero entrance keyframes and pixel offsets inside the phone mock.
- **Companion skill `taste-skill`:** invoked through the Skill tool after the first build, before the screenshot gate. Changes made on its findings:
  - Removed a decorative status dot from the deposit chip and replaced it with the Uber avatar.
  - Replaced the one `scroll` event listener (the cookie trigger) with an IntersectionObserver.
  - Removed the one em dash. The FAQ answer "AI native — AI is built..." now reads "AI native: AI is built...". The words are unchanged. This follows the operator's no-em-dash rule and taste-skill's ban.

  Taste-skill findings dismissed because they conflict with the Visual Floor or the brief:
  - **Hero stack limit.** The trust line and fact row are real content and must stay visible.
  - **Section-label count.** The five section labels are real content, styled as rotated sticker tabs, not tracked eyebrows.
  - **Hand-rolled icons.** The icons are Lucide-derived 24x24 strokes, which the masterclass allows.
  - **"Fake product UI".** The brief asks for the app UI as the hero. It is a real HTML component labelled "Sample", not a picture of divs pretending to be a screenshot.
- **Imagery:** tried `imagegen.sh -b agy` once. It returned **HTTP 429 RESOURCE_EXHAUSTED** (quota resets in about 2h23m). All imagery was then made in code with PIL:
  - Halftone coins: 61 KB WebP for light mode, 77 KB for dark mode, both lossless with alpha.
  - Grain tile: 4.5 KB.
- **Screenshot gate:** run on `out/single/index.html` at 1440x900 and 375x812, light and dark. I looked at each picture, fixed what they showed, and shot again (three rounds).

## Visual Floor ledger (checked on screenshots)

1. **Hero with a visual: followed.** It has three layers:
   - a pink canvas (a plum gradient in dark mode) with a radial glow
   - the halftone coin image
   - grain on top

   The phone app UI with animated chips is the subject. On mobile the phone peeks into the first viewport.
2. **Palette with colour: followed.** Base, primary and accent groups come from a split-complementary model. Category hues stay consistent, and the accent appears far beyond buttons (bands, steps, plans, FAQ rules, slider). Light and dark modes are both designed, with a toggle in the nav. The first load follows `prefers-color-scheme`, and the visitor's choice is remembered in localStorage inside try/catch.
3. **Motion: followed.**
   - Entrance: headline lines rise from a mask, then the phone springs in, the progress bar fills, income rows stagger in, the deposit chip drops and the saved chip peels off.
   - Scroll reveals use IntersectionObserver with a 70ms stagger.
   - Controls have five states (default, hover, active, focus-visible, disabled styles), with hover gated to fine pointers and press at `scale(.97)`.
   - The trust band is a marquee that pauses on hover.
   - Everything runs on motion tokens.
   - Reduced motion keeps opacity fades and drops movement, drift and the marquee.
4. **Navigation: followed.**
   - A floating pill nav, inset from the edges, gains a blurred backdrop and border after scroll (verified: `is-scrolled`).
   - A sliding lime indicator plus `aria-current` marks the active section (verified: "Pricing").
   - The mobile menu has a burger-to-X animation, focus moves into the menu, and **Escape closes it and returns focus to the burger (verified on both builds)**.
   - Escape also closes the language popover (verified).
5. **All content visible: followed.**
   - All seven FAQ answers are always shown, laid out as a two-column flow, with no accordion.
   - Every claim, price, step, plan feature, trust line and legal paragraph from content.txt is on the page (checked by a script).
   - The language selector is a visible row of all five languages in the footer and in the mobile menu, plus an EN popover in the desktop nav. The flags are replaced with language codes (EN, PA, BN, TH, ES), because the skill bans emoji as UI icons.
6. **Designed negative space: followed.** The final CTA balances the halftone coins against the right-aligned headline. No dead bands showed in the full-page shots.
7. **Screenshot gate: followed.** Results:
   - The browser console was clean on both builds.
   - **0 runtime network requests** from the single file. The only external URLs are outbound links.
   - No horizontal overflow at 1440 or 375.

## Pre-Delivery Checklist groups

- **Visual Floor:** followed (ledger above).
- **Visual Quality:** followed.
  - No emoji icons. One icon set with a 24 viewBox.
  - Hover feedback uses colour and shadow plus small translates, with no layout shift.
  - No pills except functional labels taken from the content ("Core plan", "Full service", "On track", "Sample").
  - Hex audit: no cream, terracotta or tinted-black hits.
  - The one card-like element is the interactive split widget. The plans are pricing blocks, which counts as repeated items.
- **Interaction:** followed. Cursor pointer, hover and focus styles, 44px minimum touch targets, and nav backdrop on scroll.
- **Light/Dark:** followed. Contrast was computed in OKLCH:
  - ink on pink 5.6:1
  - ink on lime 14.4:1
  - plum dark-mode body text 15.6:1
  - white "for 1099" on pink is large text and also has a hard ink offset shadow
- **Layout:** followed. One max-width container, padding below the fixed nav, and checks at 375 and 1440. 320px was not screenshotted separately. The layouts are fluid, so I expect it to hold, but that is unverified.
- **Accessibility:** followed.
  - Semantic landmarks and a skip link.
  - Labelled controls; the slider has `aria-valuetext`.
  - Colour is never the only signal.
  - Reduced-motion handling.
- **Motion System:** followed. Tokens are on `:root`, enters run longer than exits, the menu exit is faster than its enter, the phone and chips use the spring curve, and only transform and opacity are animated. One exception is the split bar, which animates `flex-grow` on a single element.
- **Performance:** followed.
  - Fonts use `font-display: swap`.
  - Images are WebP and under 80 KB each.
  - Scroll work uses IntersectionObserver only.
  - There is a print stylesheet.
  - No `:root:has()`.

## Deliverables and how they were built

- `out/site/`: index.html, css/styles.css, js/main.js, assets/fonts (2 woff2), assets/img (coins-light, coins-dark, grain, favicon). This is the static structure for the developer. It opens directly from disk. A file:// render matched the single file pixel for pixel on mobile; on desktop the only difference was inside the slowly drifting coin layer.
- `out/single/index.html`: 380 KB. CSS, JS, fonts and images are inlined as data URIs, with no runtime requests. It was generated from `out/site` by `work/build_single.py`.
- Screenshots:
  - Required: `out/desktop.png`, `out/mobile.png`, `out/desktop-dark.png`, `out/mobile-dark.png`.
  - Extra: `*-full.png` full-page captures. The cookie bar shows in them because it appears once the visitor scrolls past the hero.

## Things to know, and what is unfinished

- **The images were made in code**, because the agy image quota was exhausted (HTTP 429). No generated photography is used.
- **Language buttons** record the choice, update `aria-pressed` and remember it locally. Actually serving a translated page is the production app's job (locale routing or a cookie).
- **Cookie consent:**
  - The banner uses the real copy.
  - Reject all, Accept all and Manage (an analytics toggle) store a local choice.
  - "Cookie preferences" and "Do Not Sell or Share" reopen the banner, with analytics unticked for the opt-out.
  - The developer must connect these to the real consent and analytics system.
  - The banner appears once the visitor reaches the first section after the hero, not on first paint.
- **Sample figures:** every figure in the phone and split widget comes from the live site's mock-up and is labelled "Sample". The slider's 5 to 40% range is a demo range, not a product limit.
- **Pages and copy:**
  - No testimonials, logos, customers or new numbers were added.
  - Uber, DoorDash and Lyft appear only as letter avatars inside the sample, as on the current site.
  - The H1 and all copy are verbatim. The only exceptions are the em-dash change above and the footer's "·" separators, which became layout gaps with icons.
- **Not done:**
  - Real-device testing.
  - A 320px and 768px screenshot pass.
  - The Front-End Checklist remote audit. It is an external service, and I chose not to send page code to it.
