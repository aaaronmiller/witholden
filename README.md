---
title: Withholden homepage designs
date: 2026-11-15
---

# Withholden homepage designs

A review page for six homepage design proposals for Withholden, plus the originals
they are built from. It is published with GitHub Pages; every link is relative, so it
works under any repository name.

These are proposals, not the live site. Links inside each design point at
withholden.com, and every page asks search engines not to index it.

## Layout

- `index.html`: the gallery. Each card shows the design on desktop and on a phone,
  with a light/dark switch where the design has both modes.
- `designs/<name>/index.html`: each design as a single self-contained page, with an
  "All designs" link added in the bottom-left corner that returns to the gallery.
- `assets/<name>/`: WebP previews made from each design's screenshots;
  `assets/og.jpg` is the link-preview image.
- `options/<name>/`: the originals. `<name>.html` is the single-file page, `site/` is the
  same design as separate `index.html`, `css/`, `js/` and `assets/` files for a developer
  (serve it over HTTP, since fonts can fail from disk), `screenshots/` holds the PNG
  captures, and `notes.md` and `fixes.md` are the design logs. `options/README.md`
  explains each option.

## Rebuilding

`designs/` and `assets/` are built from `options/`. Rebuild them with:

```sh
python3 -I scripts/build_gallery.py options .
```

The script adds the return link and a `noindex` tag to each design and converts the
screenshots to WebP (it needs Pillow). Edit a design under `options/` and rebuild
rather than editing the copies in `designs/`. The gallery `index.html` is not generated.
