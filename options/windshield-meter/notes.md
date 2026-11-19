---
run: 7
site: withholden
direction: Night shift (windshield tax meter)
---

# Run 7 report (condensed from builder hand-back)

## Deliverables
- out/single/index.html (532 KB, all inlined, 0 runtime requests)
- out/site/ (index.html, css/styles.css, js/main.js, assets/fonts/*.woff2, assets/img/*.webp)
- out/desktop.png (1440x900 light), out/mobile.png (375x812 light)
- work/build.py, make_images.py, shoot.js

## Direction
- Desktop hero: light left with headline; slanted night-street photo right edged by a moving dashed amber lane line; tax savings account as dark frosted glass over the photo. Mobile hero becomes the full night scene.
- Signature: Uber, DoorDash, Lyft sample payouts arrive in turn, each sending a "+$" chip into the balance, which counts to $3,240.18 and 72% (current site's sample data, labelled "Sample figures").
- Colour: interstate blue plus sodium amber complement; mint only for money set aside; Pro plan amber, Hands Free Taxes blue.
- Type: Overpass headings, DM Sans body; Gurmukhi, Bengali, Thai subsets.
- Sections: hero and trust row; problem (W-2 vs 1099 diagram); how it works (4 steps on a lane line); animated payouts split; pricing; FAQ with all 7 answers visible; closing CTA over light trails; footer.

## Checks reported
- No console errors; 0 external requests from single; fonts load in both builds.
- Site vs single mean pixel diff about 0.15/255.
- No horizontal scroll at 320, 375, 768, 1024, 1440.
- Every content.txt line present; FAQ answers match live site word for word.
- Hex audit clean; reduced motion and no-JS show all content.

## Skill steps
- Read SKILL.md; loaded landing-pages (incl. Section 5), color-system, imagery, microanimations, typography. Hallmark not loaded (not named).
- Plan written before code; self-similarity test replaced a generic dark hero with windshield, highway type and lane line.
- Visual Floor items met; screenshot gate at 1440 and 375 both modes plus menus and cookie panel.
- Fixes from screenshots: lane line length, Sign in contrast, pricing reveal never firing, mobile hero stat contrast, pinkish blends, 46px overflow at 320, file:// font preload.

## Skipped or changed
- No AI images: agy 429 on both; images drawn procedurally with PIL (rainy windshield, light trails).
- No build stack (no build step allowed); no checklist service or Playwright regression tests.
- Section labels kept as sentence-case sign markers; emoji flags became language codes.

## Unfinished
- Language switching and cookie choices recorded in browser only.
- No social share image.
- Saved screenshots show cookie notice dismissed.
