#!/usr/bin/env python3
"""Regenerate public/favicon.svg and public/favicon.ico from the MO wordmark.

    python3 tools/make-favicon.py

The mark matches the one the app draws in its sidebar header: 'Source Serif 4',
weight 700, italic, #b4213d. Source Serif 4 ships no italic face, so the app's
italic is a browser-synthesized oblique -- reproduced here as a shear.

Glyph outlines are pulled from the cached original font and embedded as SVG
paths rather than a <text> element, so the icon does not depend on the viewer
having the font installed.

Needs fontTools (for the outlines) and ImageMagick `magick` (for the .ico).
"""

import subprocess
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

ROOT = Path(__file__).resolve().parent.parent
# The unsubsetted copy cached by tools/subset-glyphs.mjs; the shipped font is
# glyph-subsetted, so read the original to stay independent of that pipeline.
FONT = ROOT / "extracted/fonts-full/6dc69a7d-4aec-456a-8d2a-e6aed1b02e33.woff2"

TEXT = "MO"
SLANT = 0.20          # right-leaning oblique
SIZE = 64             # viewBox
PAD_X = 5
FG = "#b4213d"        # crimson, as in the app header
BG = "#F0EDE4"        # cream
RADIUS = 12


def main() -> int:
    if not FONT.exists():
        print(f"missing {FONT} -- run `npm run unbundle && npm run convert` first",
              file=sys.stderr)
        return 1

    font = instancer.instantiateVariableFont(
        TTFont(FONT), {"wght": 700, "opsz": 20}, inplace=False
    )
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()

    # Lay the letters out on one baseline, sheared for the italic look.
    recorder, x = RecordingPen(), 0
    for ch in TEXT:
        name = cmap[ord(ch)]
        glyphs[name].draw(TransformPen(recorder, Transform(1, 0, SLANT, 1, x, 0)))
        x += glyphs[name].width

    bounds = BoundsPen(None)
    recorder.replay(bounds)
    x0, y0, x1, y1 = bounds.bounds
    w, h = x1 - x0, y1 - y0

    # Fit to width, centre vertically, and flip y-up font units to y-down SVG.
    scale = (SIZE - 2 * PAD_X) / w
    out = RecordingPen()
    recorder.replay(TransformPen(out, Transform(
        scale, 0, 0, -scale,
        PAD_X - x0 * scale,
        SIZE / 2 + (h / 2 + y0) * scale,
    )))
    pen = SVGPathPen(None)
    out.replay(pen)

    svg_path = ROOT / "public/favicon.svg"
    svg_path.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" '
        f'role="img" aria-label="MPLADS Oversight">\n'
        f'  <title>MPLADS Oversight</title>\n'
        f'  <rect width="{SIZE}" height="{SIZE}" rx="{RADIUS}" fill="{BG}"/>\n'
        f'  <path d="{pen.getCommands()}" fill="{FG}"/>\n'
        f"</svg>\n"
    )

    png = ROOT / "public/.favicon-tmp.png"
    ico = ROOT / "public/favicon.ico"
    subprocess.run(["magick", "-background", "none", str(svg_path),
                    "-resize", "256x256", str(png)], check=True)
    subprocess.run(["magick", str(png),
                    "-define", "icon:auto-resize=64,48,32,16", str(ico)], check=True)
    png.unlink()

    print(f"favicon.svg {svg_path.stat().st_size} B, "
          f"favicon.ico {ico.stat().st_size} B")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
