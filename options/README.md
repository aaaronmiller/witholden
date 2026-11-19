---
title: Withholden homepage options
date: 2026-11-09
---

# Withholden homepage options

Each folder holds one design in two forms:
- `<name>.html`: a single self-contained file. Open it in a browser or host it as is; it needs no server, Node or build step.
- `site/`: the same design as normal files (`index.html`, `css/`, `js/`, `assets/`) for a developer to implement from. Serve it over HTTP; opening it straight from disk can block the fonts.

`screenshots/` has desktop and phone captures. `notes.md` is the designer's report, and `fixes.md` (where present) logs post-review fixes.

## The four to show

| Option | Direction | Feel |
|---|---|---|
| `night-meter-dash` | Night city, tilted phone with a live tax meter, sunrise closing section | Dark, bold, premium. Ranked first in the blind review. |
| `night-shift-dusk` | Drawn golden-hour highway, calm section rhythm | Warm and polished. Ranked second in the blind review. |
| `morning-ledger` | Mint ledger paper, green and raspberry, serif figures, morning light | Light, calm, trustworthy money. |
| `split-pop` | Hot pink, lime and aqua colour blocks, the app as the hero, payout split slider | Loud and young, phone-first. |

## Earlier variations

`night-shift-route` and `windshield-meter` were built in the same round as the first two and share their night-driving direction. The blind review ranked them third and fourth and judged them reskins of the same layout. They are kept for reference.

## Shared notes for the developer

- All copy, prices, FAQ answers and legal text come from the live site; product figures inside phone and account mock-ups are labelled as samples, using the live site's own sample numbers.
- Links point at the live withholden.com URLs.
- The language selector and the cookie notice record the visitor's choice in the browser but are not yet connected to the site's translations or analytics.
- Images were drawn in code where the image generator was out of quota; they can be swapped for generated photos without other changes.
- Each page needs the live favicon and a social share image added.
