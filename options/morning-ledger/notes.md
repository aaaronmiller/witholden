---
title: Withholden homepage, run 9 ("Morning Ledger")
date: 2026-11-09
skill: frontend-design-masterclass v2.7 (copy in ./skill)
---

# Withholden homepage, run 9: "Morning Ledger"

## Page purpose

A 1099 gig driver lands here to see that Withholden keeps their books and sets their tax money aside as they earn, and then starts the 30-day free trial.

Every section supports that one action. The primary CTA ("Start 30-day free trial", pointing to /sign-up) appears in the hero and again in the closing band, with plan-specific trial buttons in Pricing.

## Direction and why

**Morning Ledger** is a daylight, light-first page built on ledger paper: mint-tinted paper with green row rules and the raspberry double margin rule that real accounting paper carries. Morning window light falls across a linen tabletop in the hero. The feeling is a tidy book with the money already set aside. There is no night, road, windshield, dashboard or lane imagery, no navy and amber, and no Overpass.

- **Palette (OKLCH, structured 3-group).**
  - Base: mint paper, hue 150, L 0.982 / 0.958 / 0.925.
  - Primary: bottle green `oklch(0.45 0.095 158)`.
  - Accent: raspberry `oklch(0.53 0.165 352)`. This is complementary to 158 with a +14 degree shift, and it is the colour of the ledger margin rule.
  - Categories keep their own hue everywhere they appear. Green means books, the Pro plan and primary actions. Raspberry means "set aside" and tax savings: the Saved column, the tax leg of the payout diagram, and the Hands Free plan.
  - Dark mode is an authored evergreen evening, not an inversion. It uses base hue 166 at L 0.195 to 0.27, mint primary, pink-raspberry accent, and a deep green closing band.
- **Type.** Newsreader (an optical-size serif, used for display text and ledger figures) with Hanken Grotesk for body and UI. Both are self-hosted woff2. Neither is Inter, Fraunces, Instrument Serif or Overpass. The serif is justified by the subject: account books and printed ledgers.
- **Signature move.** The hero's sample tax savings account is written in like a ledger. Each income row wipes in left to right. Its set-aside amount then slides into the raspberry "Saved" column, the balance counts up to the sample $3,240.18, and the plan bar fills to 72%. "See it in action" uses a second visual rather than repeating the sheet: one sample payout splits along two drawn paths into Business books and the Tax savings account, with dots travelling each path.
- **Why it won.** I sketched three directions:

  | Direction | Score | Why it lost |
  | --- | --- | --- |
  | Morning Ledger (chosen) | 5 | Won |
  | Envelope Budget: butter base, plum primary, Bricolage Grotesque, bento of paper envelopes | 3 | Too playful for trust-first money, and bento invites card sickness |
  | Swiss Statement: white, vermilion, Archivo plus Plex Mono, oversized numerals | 3 | Red reads as debt or alarm, and the result felt cold |

## Deliverables

- `out/site/`: `index.html`, `css/styles.css`, `js/main.js`, `assets/fonts/*.woff2` (3 files), `assets/img/hero-light.webp` (12 KB), `assets/img/grain.svg`, `assets/img/favicon.svg`.
- `out/single/index.html` (512 KB): everything is inlined as data URIs. Measured result: **0 runtime network requests** and **0 console messages** in all four views.
- Screenshots: `out/desktop.png`, `out/mobile.png`, `out/desktop-dark.png`, `out/mobile-dark.png` (1440x900 and 375x812 folds), plus `out/desktop-full.png` and `out/mobile-menu.png`.
- `work/scripts/` contains the reproducible tooling: `make_hero.py` (hero image), `build_single.py` (the inliner), `shoot.js` (the screenshot and interaction harness) and `fontcheck.js`.

## Content and links

- **Copy.** All copy from content.txt is on the page. The seven FAQ answers come from the live page's markup, where the source text hid them behind accordions. Here all of them are visible as a ruled Q and A list. That covers prices, the trial, trust statements, the four steps, plan features, the legal paragraphs, the address and the phone number.
- **Sample figures.** All figures come from the current site's mock-up. They are labelled "Sample account" and "Sample payout". The figures are internally consistent: 22% of $612.40 / $284.10 / $198.75 rounds to $135 / $62 / $44.
- **Links.**
  - These are absolute links to withholden.com: Sign in, sign-up (every trial CTA), About, Contact, Guidelines (both "Tax guide" and "IRS tax guide"), Investors, /legal/terms, /legal/privacy, /legal/disclosures, and /legal/terms#tax-preparer.
  - Stripe opens in a new tab with `rel="noopener noreferrer"`. The phone number is a `tel:` link.
- **Language selector.** All five languages are visible buttons: English, ਪੰਜਾਬੀ, বাংলা, ไทย and Español, with `lang` attributes. They appear in a strip above the nav on desktop, in the mobile menu, and in the footer. The three copies stay in sync and store the choice. They fire a `withholden:language` event for the developer to connect to the live translation loader, because the live site switches language client-side.
- **Cookie notice.** It uses the live banner's words and its Reject all, Manage and Accept all choices. Manage opens a small panel with a "Necessary cookies" checkbox (always on) and an "Optional analytics cookies" checkbox. The footer's "Cookie preferences" and "Do Not Sell or Share" buttons reopen that panel. The choice is stored locally and announced with a `withholden:cookies` event. No analytics script is included.

## Skill steps followed

- **Read SKILL.md in full.** I loaded the references a new page needs: `color-system.md`, `imagery.md`, `microanimations.md`, `motion-craft.md`, `landing-pages.md` (sections 2 to 5, including conversion and launch readiness) and `typography.md`.
- **Intent identification.** Product type is fintech, consumer and trust-first. I chose a light-first variant instead of the table's dark default, as the brief asked.
- **Direction Exploration.** I wrote three directions, scored them, and gave a one-line reason for each loser (see above).
- **System Lock.** The token block at the top of `styles.css` defines colour roles in OKLCH for both modes, the type scale, weights, radii, a 4px spacing scale, the ledger row height and motion tokens. Components consume tokens. The exceptions are a few literal OKLCH values for button-label ink on the accent buttons, and the closing-band tokens, which are part of the token block.
- **Imagery.** The brief asked for `imagegen.sh -b agy`. **It failed with HTTP 429 RESOURCE_EXHAUSTED** (quota resets in about 2h23m), so the hero image was made in code with PIL and numpy (`work/scripts/make_hero.py`). It shows sage linen weave, skewed window-pane daylight with soft mullion shadows, an olive-sprig shadow and a vignette. It is a 12 KB WebP. The hero uses the three-layer stack: a base canvas with a daylight radial wash, the image layer with a mask and a slow drift, and a grain plus margin-rule layer.
- **Motion.**
  - Each section moves differently:
    - hero copy fades in;
    - ledger rows are written in with a clip-path wipe, with set-aside amounts sliding into place and a count-up;
    - problem entries are revealed by a clip-path wipe;
    - the step track draws and the step numbers fill in sequence;
    - the payout diagram's paths draw, with dots travelling them;
    - the plan bars fill;
    - other blocks use a fade-blur reveal.
  - Buttons have all five states (default, hover lift, scale(0.97) press, focus ring, disabled). Hover is gated to fine pointers. Enter and exit are asymmetric.
  - `prefers-reduced-motion` removes movement but keeps colour and opacity changes, and the SMIL motion is removed.
- **Navigation.** A floating pill nav gains a backdrop once the page leaves the top. Section links get a raspberry underline when active, driven by IntersectionObserver. The mobile menu uses `aria-expanded`, moves focus into the menu, closes on Escape (**verified**: the menu closed and focus returned to the button), closes on an outside click, and closes on a link click.
- **Companion skill `taste-skill`.** I invoked it through the Skill tool after the first full build and fixed what it flagged where the masterclass Visual Floor and the brief allow:
  - The only em dash on the page was in the AI FAQ answer. It became a full stop, with no words changed.
  - The "How it works" split header became a stacked header.
  - I dropped the redundant "The problem" and "FAQ" labels, which repeated their headings and the nav. Section labels now sit on 3 of 6 sections and use an italic serif, not tracked caps.
  - I replaced every `scroll` listener with IntersectionObserver.
- **Contrast.** I computed WCAG contrast from the OKLCH tokens. The lowest pair is tertiary ink on surface in light mode, at **4.84:1**. Body ink is 15.5:1 (light) and 14.9:1 (dark). Primary button labels are 6.9:1 (light) and 9.7:1 (dark).
- **Hex audit.** There are no cream `#F4F1EA`, terracotta `#D97757` or tinted-black `#111` / `#0B0B0B` values in the CSS.
- **Print stylesheet.** It hides the chrome, forces a white background and avoids breaks inside blocks.

## Screenshot gate (checked on the pictures, not the code)

1. **Hero with a visual: pass.** Daylight, linen and ledger sheet on desktop. On mobile the sheet sits directly under the CTAs, and the daylight layer sits behind the text.
2. **Palette with colour: pass.** Green and raspberry carry meaning beyond the buttons. Light and dark modes are both designed.
3. **Motion: pass.** Entrance and scroll reveals were confirmed by the screenshots taken before and after scrolling, which first exposed a bug (see fixes).
4. **Navigation: pass.** Sticky, with a backdrop, an active indicator and a working mobile menu (`out/mobile-menu.png`).
5. **All content visible: pass.** No tabs or accordions. The FAQ is fully open.
6. **Negative space: pass.** The empty right column in the problem section was a bug and is fixed.
7. **Text and decorative lines: pass.**
   - Ledger text sits inside fixed-height rows.
   - The hero margin rule runs outside the text column.
   - The closing band's ruled lines are masked behind the heading and paragraph.
   - The stamp has a solid disc.

## Defects found by looking, then fixed

- **Ledger rows collapsed.** They shared the `.entry` class with the problem section. I renamed it to `.l-entry`.
- **The desktop H1 broke onto three lines.** I rebalanced the columns and the display size, and it now sits on two lines.
- **Problem entries stayed invisible.** A clip-path element does not trigger IntersectionObserver, so wipes are now triggered by their parent element.
- **"Sample payout" overlapped "$612.40" on mobile.** That was a text collision; the label is now in normal flow above the figure.
- **The closing band was a glaring mint slab in dark mode.** It now uses dedicated closing tokens with a deep green surface.
- **The plan bar's gradient had a brown midpoint.** It is now solid primary.

## Skipped or deviated, with reasons

- **SvelteKit, Bun and Tailwind stack (skill section 1).** Skipped. The brief requires plain static files and a single self-contained file with no build step, so the page is semantic HTML, token-driven CSS and vanilla JS.
- **Taste-skill items not applied because the brief or the Visual Floor wins:**
  - **Hero length.** The taste-skill hero rules (subtext of 20 words or fewer, at most 4 text elements) would cut source content. Instead, the lede, assurances and trial terms stay, and the terms are styled as ledger entries.
  - **CTA labels.** "Start free", "Start 30-day free trial", "Try it free" and "Start free trial" are kept as the live site's labels. Unifying them into one label is my recommendation to the owner, not an edit I made.
  - **Icons.** Icons are inline SVG symbols with Lucide geometry, which the masterclass allows; taste-skill prefers an icon package.
  - **Ruled rows.** They are the ledger concept itself, not a default list style.
- **Hallmark.** Not used, since it is opt-in and not named.
- **imagegen-frontend-web.** Not used, because image generation was quota-blocked.
- **GSAP.** Not needed; CSS transitions and IntersectionObserver cover the motion.
- **Front-End Checklist remote MCP.** Not run, to avoid sending page code to an outside service. Accessibility and contrast were checked locally instead.
- **The em dash in the FAQ answer.** I changed one punctuation mark in source copy (see above). The owner may want the live site's wording back.

## Unfinished or to note

- **Hero image.** The agy quota was exhausted, so the hero image is a code-made still, not a photograph. When the quota returns, a generated photo can replace `assets/img/hero-light.webp` with no other change. The prompt used is in this run's history.
- **Opening `out/site/index.html` straight from disk in Chromium.** The console logs 4 messages caused only by the `crossorigin` font preload hints under `file://`. The fonts still load. Served over HTTP, the console is clean (**verified**: 0 errors via a local `http.server`). The single file has no such messages.
- **Single file versus site.** Rendered from `file://`, the two light-mode fold screenshots are pixel-identical. The dark-mode differences come from the timing of the slowly drifting hero image.
- **Non-Latin language names.** The three non-Latin names render with system fonts. No Gurmukhi, Bengali or Thai webfont is bundled.
- **Live behaviour to wire up.** Language switching and the cookie-consent effects are exposed as events (`withholden:language`, `withholden:cookies`) for the developer to connect. The page does not pretend to translate or to run analytics.
- **Structured data.** The live site's FAQ JSON-LD was not carried over. Re-add it if search eligibility still applies.
