"""Copy the Withholden design options into a publishable gallery repo.

Usage: python3 -I build_gallery.py <options_dir> <out_dir>

For each design: copies the single-file HTML to designs/<slug>/index.html with a
noindex tag and an "All designs" return link injected, and writes WebP thumbnails
of its screenshots to assets/<slug>/.
"""
import re
import sys
from pathlib import Path

from PIL import Image

SLUGS = [
    "night-meter-dash",
    "night-shift-dusk",
    "morning-ledger",
    "split-pop",
    "night-shift-route",
    "windshield-meter",
]

HEAD_INJECT = '<meta name="robots" content="noindex, nofollow">\n'

BACK_LINK = """
<a href="../../index.html" id="wh-gallery-back" aria-label="Back to all homepage designs">&larr; All designs</a>
<style>
#wh-gallery-back{position:fixed;left:16px;bottom:16px;z-index:2147483647;
font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.01em;
color:#fff;background:rgba(17,17,20,.88);padding:12px 16px;border-radius:999px;
text-decoration:none;box-shadow:0 6px 24px rgba(0,0,0,.28);
-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
border:1px solid rgba(255,255,255,.18);transition:background .2s ease}
#wh-gallery-back:hover{background:rgba(17,17,20,1)}
#wh-gallery-back:focus-visible{outline:3px solid #ffbf3c;outline-offset:3px}
@media print{#wh-gallery-back{display:none}}
</style>
"""

# (source name, output name, max width)
SHOTS = [
    ("desktop.png", "desktop.webp", 1200),
    ("desktop-dark.png", "desktop-alt.webp", 1200),
    ("desktop-light.png", "desktop-alt.webp", 1200),
    ("mobile.png", "mobile.webp", 390),
    ("mobile-dark.png", "mobile-alt.webp", 390),
    ("mobile-light.png", "mobile-alt.webp", 390),
]


def inject(html: str) -> str:
    html, n_head = re.subn(r"(<head[^>]*>)", r"\1\n" + HEAD_INJECT, html, count=1, flags=re.I)
    idx = html.lower().rfind("</body>")
    if n_head != 1 or idx < 0:
        raise SystemExit("missing <head> or </body>")
    return html[:idx] + BACK_LINK + html[idx:]


def main() -> None:
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    for slug in SLUGS:
        html = (src / slug / f"{slug}.html").read_text(encoding="utf-8")
        dest = out / "designs" / slug
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "index.html").write_text(inject(html), encoding="utf-8")

        shots = out / "assets" / slug
        shots.mkdir(parents=True, exist_ok=True)
        made = []
        for name, outname, width in SHOTS:
            p = src / slug / "screenshots" / name
            if not p.exists():
                continue
            im = Image.open(p).convert("RGB")
            if im.width > width:
                im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
            im.save(shots / outname, "WEBP", quality=82, method=6)
            made.append(f"{outname} {im.size[0]}x{im.size[1]}")
        print(slug, "|", ", ".join(made))


if __name__ == "__main__":
    main()
