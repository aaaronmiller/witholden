---
run: 5
site: withholden
direction: Night shift route
---

# Run 5 report (condensed from builder hand-back)

## Deliverables
- out/single/index.html (468 KB, all inlined, no network requests except outbound links, no console output)
- out/site/ (index.html, css/styles.css, js/main.js, assets/fonts 6 woff2, assets/img road-night.webp 56 KB, road-duotone.webp 44 KB)
- out/desktop.png, out/mobile.png (light), desktop-dark.png, mobile-dark.png
- work/build_single.py rebuilds single from site/

## Direction
- Hero: generated driver's-seat night photo on a wet street; light mode uses a navy/amber duotone of the same photo; scrim plus grain.
- Palette (OKLCH): navy base, sodium amber (money set aside), signal blue complement (books and records).
- Type: Overpass headings, Public Sans body, Noto subsets for Punjabi, Bengali, Thai language names.
- Signature: highway-sign section labels; "How it works" as a road with four markers and a scroll-drawn lane line; payout fork diagram (Business books vs Tax savings account).
- Phone mock-up with current site figures, labelled "Sample account".
- Rejected directions: Ledger (green/coral serif editorial), Tiled app showcase (indigo panels).

## Content
- 172 strings verified (content.txt lines plus 7 FAQ answers from live structured data).
- One wording change: copyright separators "·" became full stops.
- All FAQ answers visible; no accordions. Removed "Pricing" and "FAQ" section labels (still in nav).
- Links absolute to withholden.com; language selector with 5 languages (stores wh-lang, does not translate); real cookie notice text with working Reject/Manage/Accept.

## Skill steps
- Read SKILL.md; loaded landing-pages, color-system, imagery, microanimations, motion-craft, typography.
- Three directions written, one chosen; token system written before components.
- Companion skills invoked: imagegen, taste-skill.
- Visual Floor checks passed at 1440 and 375, both modes; reduced-motion verified.
- Fixes from screenshots: 3-line headline, cookie notice over CTA, unreadable signs, dark mode too black, wordmark gap, empty FAQ cell, mobile fork label overlap.
- taste-skill findings dismissed where they conflicted with brief or real content.

## Skipped
- SvelteKit/Bun/Tailwind (no build step allowed).
- Online checklist service and comparable-site research (time).
- Second generated image (agy 429 on 3 of 4 attempts).

## Left for developer
- Serve site/ over HTTP (file:// blocks fonts).
- Wire wh-lang to translations and wh-consent to analytics.
- Restore live favicon (empty favicon used to avoid outside request).
