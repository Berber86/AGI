#!/usr/bin/env python3
"""Generate the PWA icons for «Первичный бульон» without external assets.

Draws the game's signature creature — a striped orange cell with big eyes —
over a deep-water radial background. Run from the game directory:

    python3 assets/make_icons.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent


def radial_background(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    cx = cy = size / 2
    max_d = math.hypot(cx, cy)
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - cx, y - cy) / max_d
            t = min(1.0, d)
            # top-left cyan → deep navy, the palette of the game's water
            r = int(28 + (6 - 28) * t)
            g = int(110 + (34 - 110) * t)
            b = int(158 + (74 - 158) * t)
            px[x, y] = (r, g, b, 255)
    return img


def draw_creature(img: Image.Image, size: int, scale: float = 1.0, maskable: bool = False) -> None:
    d = ImageDraw.Draw(img, "RGBA")
    inset = 0.16 if maskable else 0.10
    body_w = size * (1 - inset * 2) * scale
    body_h = body_w * 0.62
    cx = size / 2
    cy = size / 2 + body_h * 0.06
    left = cx - body_w / 2
    top = cy - body_h / 2
    right = cx + body_w / 2
    bottom = cy + body_h / 2

    # soft glow behind the cell
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([left - size * 0.06, top - size * 0.08, right + size * 0.06, bottom + size * 0.10],
               fill=(150, 240, 255, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.05))
    img.alpha_composite(glow)

    # body: orange gradient built from stacked ellipses
    body = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bd = ImageDraw.Draw(body)
    bd.ellipse([left, top, right, bottom], fill=(255, 154, 77, 255), outline=(120, 48, 20, 255), width=max(2, int(size * 0.008)))
    # belly highlight
    bd.ellipse([left + body_w * 0.12, top + body_h * 0.42, right - body_w * 0.16, bottom - body_h * 0.06],
               fill=(255, 226, 189, 130))
    img.alpha_composite(body)

    # stripes
    stripes = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stripes)
    for i in range(7):
        t = 0.14 + i * 0.12
        x = left + body_w * t
        sd.line([(x, top + body_h * 0.06), (x - body_h * 0.06, bottom - body_h * 0.06)],
                fill=(168, 64, 42, 210), width=max(2, int(size * 0.012)))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse([left, top, right, bottom], fill=255)
    img.paste(Image.alpha_composite(img.crop((0, 0, size, size)), stripes), (0, 0), mask)

    # eyes
    for sign in (-1, 1):
        ex = cx + sign * body_w * 0.17 + body_w * 0.14
        ey = cy - body_h * 0.10
        er = body_h * 0.24
        d.ellipse([ex - er, ey - er, ex + er, ey + er], fill=(255, 253, 246, 255), outline=(52, 20, 8, 220), width=max(2, int(size * 0.006)))
        d.ellipse([ex - er * 0.45 + er * 0.15, ey - er * 0.45, ex + er * 0.45 + er * 0.15, ey + er * 0.45], fill=(74, 31, 12, 255))
        d.ellipse([ex - er * 0.55, ey - er * 0.62, ex - er * 0.2, ey - er * 0.28], fill=(255, 255, 255, 240))

    # cilia
    for i in range(14):
        t = i / 13
        ang = math.pi * (0.72 + t * 0.56)
        x1 = cx + math.cos(ang) * body_w * 0.5
        y1 = cy + math.sin(ang) * body_h * 0.52
        x2 = cx + math.cos(ang) * body_w * 0.62
        y2 = cy + math.sin(ang) * body_h * 0.78
        d.line([(x1, y1), (x2, y2)], fill=(232, 252, 255, 210), width=max(2, int(size * 0.007)))
        x1 = cx + math.cos(-ang) * body_w * 0.5
        y1 = cy + math.sin(-ang) * body_h * 0.52
        x2 = cx + math.cos(-ang) * body_w * 0.62
        y2 = cy + math.sin(-ang) * body_h * 0.78
        d.line([(x1, y1), (x2, y2)], fill=(232, 252, 255, 210), width=max(2, int(size * 0.007)))

    # flagellum
    pts = []
    for i in range(24):
        t = i / 23
        x = left - body_w * 0.02 - t * body_w * 0.42
        y = cy + math.sin(t * 5.2) * body_h * 0.18 * t
        pts.append((x, y))
    d.line(pts, fill=(255, 238, 228, 230), width=max(2, int(size * 0.012)), joint="curve")


def make_icon(size: int, maskable: bool = False) -> Image.Image:
    img = radial_background(size)
    draw_creature(img, size, scale=0.86 if maskable else 1.0, maskable=maskable)
    return img


def main() -> None:
    for size, name in ((512, "icon-512.png"), (192, "icon-192.png")):
        make_icon(size).save(HERE / name)
        print("wrote", HERE / name)
    make_icon(512, maskable=True).save(HERE / "icon-512-maskable.png")
    print("wrote", HERE / "icon-512-maskable.png")


if __name__ == "__main__":
    main()
