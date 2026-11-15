---
title: Withholden homepage designs
date: 2026-11-15
---

# Withholden homepage designs

A review page for six homepage design proposals for Withholden. It is published
with GitHub Pages at https://aaaronmiller.github.io/withholden-homepage-options/.

These are proposals, not the live site. Links inside each design point at
withholden.com, and every page asks search engines not to index it.

## Layout

- `index.html`: the gallery. Each card shows the design on desktop and on a phone,
  with a light/dark switch where the design has both modes.
- `designs/<name>/index.html`: each design as a single self-contained page, with an
  "All designs" link added in the bottom-left corner that returns to the gallery.
- `assets/<name>/`: WebP previews made from each design's screenshots;
  `assets/og.jpg` is the link-preview image.

## Rebuilding

The designs and screenshots come from a separate working folder (`withholden/options`,
one folder per design holding `<name>.html` and `screenshots/`). Rebuild the copies in
`designs/` and `assets/` with:

```sh
python3 -I scripts/build_gallery.py <path-to>/withholden/options .
```

The script adds the return link and a `noindex` tag to each design and converts the
screenshots to WebP (it needs Pillow). Edit a design in the source folder and rebuild
rather than editing the copies here.
