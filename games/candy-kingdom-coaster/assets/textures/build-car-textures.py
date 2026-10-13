#!/usr/bin/env python3
"""Build the textures of the "Star Racer 7" car (src/car.js, src/lily.js).

Inputs
  _raw/car-unicorn.png  generated sticker art on a chroma-green background
  _raw/car-quilt.png    generated quilted-leather upholstery
  _raw/car-polka.png    generated pink polka-dot satin (the hood bow)
  _raw/car-plush.png    generated white plush fur (fuzzy dice)
  fonts/Fredoka-Bold.woff2  (SIL OFL, see fonts/OFL.txt) for the livery lettering

Outputs (all WebP; decals are RGBA with a fully transparent border so the
runtime decal projector can clamp UVs without bleeding):
  car-unicorn.webp   512²  RGBA  door unicorn (mirrored on the left side at runtime)
  car-lettering.webp 1024×256 RGBA  "STAR RACER 7"
  car-roundel.webp   256²  RGBA  hood race-number roundel
  car-plate.webp     256×128 RGB  licence plate
  car-emblem.webp    128²  RGBA  hubcap / helmet emblem (star + heart)
  car-quilt.webp     512²  RGB   seats
  car-polka.webp     512²  RGB   bow
  car-plush.webp     256²  RGB   fuzzy dice

Usage:  python3 build-car-textures.py        (Pillow with WebP + FreeType)
Like build-textures.py, a missing _raw/x.png falls back to the built x.webp.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required: pip install pillow")

HERE = Path(__file__).resolve().parent
RAW = HERE / "_raw"
FONT = HERE / "fonts" / "Fredoka-Bold.woff2"

PINK = (255, 79, 163)
PINK_DEEP = (214, 34, 120)
PLUM = (92, 22, 70)
CREAM = (255, 248, 252)
GOLD = (255, 205, 72)


def load(name: str, mode: str = "RGB") -> Image.Image:
    p = RAW / f"{name}.png"
    if p.is_file():
        return Image.open(p).convert(mode)
    built = HERE / f"{name}.webp"
    if built.is_file():
        return Image.open(built).convert(mode)
    sys.exit(f"missing source art: {p}")


def save(im: Image.Image, name: str, quality: int = 82) -> None:
    out = HERE / f"{name}.webp"
    if im.mode == "RGBA":
        im.save(out, "WEBP", quality=quality, alpha_quality=90, method=6)
    else:
        im.convert("RGB").save(out, "WEBP", quality=quality, method=6)
    print(f"{out.name:22s} {im.size[0]}x{im.size[1]} {im.mode:4s} {out.stat().st_size / 1024:6.1f} KB")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT), size)


def star_points(cx, cy, r_out, r_in, n=5, rot=-math.pi / 2):
    pts = []
    for i in range(n * 2):
        r = r_out if i % 2 == 0 else r_in
        a = rot + i * math.pi / n
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    return pts


def sparkle(d: ImageDraw.ImageDraw, cx, cy, r, fill):
    """4-point twinkle star."""
    k = r * 0.28
    d.polygon([(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k),
               (cx, cy + r), (cx - k, cy + k), (cx - r, cy), (cx - k, cy - k)], fill=fill)


def heart(d: ImageDraw.ImageDraw, cx, cy, s, fill):
    pts = []
    for i in range(64):
        t = i / 64 * 2 * math.pi
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * s / 17, cy - y * s / 17))
    d.polygon(pts, fill=fill)


def supersample(w: int, h: int, k: int = 4):
    return Image.new("RGBA", (w * k, h * k), (0, 0, 0, 0)), k


# ---------------------------------------------------------------- unicorn
def build_unicorn() -> None:
    if not (RAW / "car-unicorn.png").is_file():
        print("car-unicorn: no _raw source, keeping the built car-unicorn.webp")
        return
    im = load("car-unicorn", "RGB")
    px = im.load()
    w, h = im.size
    alpha = Image.new("L", im.size, 0)
    ap = alpha.load()
    out = Image.new("RGBA", im.size)
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            green = g - max(r, b)          # how "chroma-green" the pixel is
            a = 1.0 - min(1.0, max(0.0, (green - 40) / 70.0))
            if green > 0:                  # despill the green fringe
                g = max(r, b)
            ap[x, y] = int(a * 255)
            op[x, y] = (r, g, b, int(a * 255))
    bbox = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    out = out.crop(bbox)
    # fit into 512² with an 12 px transparent margin, keep aspect
    side = 512 - 24
    s = side / max(out.size)
    out = out.resize((max(1, int(out.size[0] * s)), max(1, int(out.size[1] * s))), Image.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    canvas.paste(out, ((512 - out.size[0]) // 2, (512 - out.size[1]) // 2), out)
    save(canvas, "car-unicorn", 86)


# ---------------------------------------------------------------- lettering
def build_lettering() -> None:
    W, H = 1024, 256
    im, k = supersample(W, H)
    d = ImageDraw.Draw(im)
    f = font(124 * k)
    text = "STAR RACER"
    tw = d.textlength(text, font=f)
    f7 = font(176 * k)
    t7 = d.textlength("7", font=f7)
    gap = 26 * k
    total = tw + gap + t7
    x0 = (W * k - total) / 2
    base = 186 * k
    # soft drop shadow
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    for (t, ff, xx) in ((text, f, x0), ("7", f7, x0 + tw + gap)):
        sd.text((xx + 6 * k, base + 8 * k), t, font=ff, anchor="ls", fill=(60, 0, 40, 110),
                stroke_width=16 * k, stroke_fill=(60, 0, 40, 110))
    sh = sh.filter(ImageFilter.GaussianBlur(6 * k))
    im = Image.alpha_composite(im, sh)
    d = ImageDraw.Draw(im)
    for (t, ff, xx) in ((text, f, x0), ("7", f7, x0 + tw + gap)):
        d.text((xx, base), t, font=ff, anchor="ls", fill=PLUM, stroke_width=14 * k, stroke_fill=PLUM)
        d.text((xx, base), t, font=ff, anchor="ls", fill=CREAM, stroke_width=8 * k, stroke_fill=PINK_DEEP)
    # glossy top half: lighter cream overlay clipped to the glyphs
    gloss = Image.new("RGBA", im.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(gloss)
    for (t, ff, xx) in ((text, f, x0), ("7", f7, x0 + tw + gap)):
        gd.text((xx, base), t, font=ff, anchor="ls", fill=(255, 255, 255, 255))
    mask = gloss.split()[3]
    band = Image.new("L", im.size, 0)
    ImageDraw.Draw(band).rectangle([0, 0, W * k, base - 80 * k], fill=150)
    band = band.filter(ImageFilter.GaussianBlur(8 * k))
    gl = Image.new("RGBA", im.size, (255, 255, 255, 0))
    gl.putalpha(ImageChops.multiply(mask, band))
    im = Image.alpha_composite(im, gl)
    d = ImageDraw.Draw(im)
    # twinkles
    for (cx, cy, r) in ((40, 70, 26), (990, 60, 30), (950, 210, 16), (70, 200, 14)):
        sparkle(d, cx * k, cy * k, r * k, GOLD + (255,))
    im = im.resize((W, H), Image.LANCZOS)
    clear_border(im, 6)
    save(im, "car-lettering", 88)


def clear_border(im: Image.Image, px: int) -> None:
    d = ImageDraw.Draw(im)
    w, h = im.size
    for box in ((0, 0, w, px), (0, h - px, w, h), (0, 0, px, h), (w - px, 0, w, h)):
        d.rectangle(box, fill=(0, 0, 0, 0))


# ---------------------------------------------------------------- roundel
def build_roundel() -> None:
    S = 256
    im, k = supersample(S, S)
    d = ImageDraw.Draw(im)
    c = S * k / 2
    R = 112 * k
    d.ellipse([c - R, c - R, c + R, c + R], fill=PLUM)
    R2 = 104 * k
    d.ellipse([c - R2, c - R2, c + R2, c + R2], fill=CREAM)
    R3 = 90 * k
    d.ellipse([c - R3, c - R3, c + R3, c + R3], outline=PINK, width=8 * k)
    for i in range(10):
        a = i / 10 * 2 * math.pi
        d.polygon(star_points(c + math.cos(a) * 97 * k, c + math.sin(a) * 97 * k, 7 * k, 3 * k), fill=GOLD)
    d.text((c, c + 6 * k), "7", font=font(170 * k), anchor="mm", fill=PINK, stroke_width=8 * k, stroke_fill=PINK_DEEP)
    im = im.resize((S, S), Image.LANCZOS)
    clear_border(im, 4)
    save(im, "car-roundel", 88)


# ---------------------------------------------------------------- plate
def build_plate() -> None:
    W, H = 256, 128
    im, k = supersample(W, H)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, W * k, H * k], radius=18 * k, fill=PINK_DEEP)
    d.rounded_rectangle([6 * k, 6 * k, (W - 6) * k, (H - 6) * k], radius=13 * k, fill=CREAM)
    d.rounded_rectangle([12 * k, 12 * k, (W - 12) * k, (H - 12) * k], radius=9 * k, outline=PINK, width=3 * k)
    d.text((W * k / 2 + 20 * k, H * k / 2 + 4 * k), "STAR 7", font=font(54 * k), anchor="mm", fill=PINK_DEEP)
    heart(d, 36 * k, H * k / 2 + 2 * k, 13 * k, PINK)
    for x in (22, W - 22):
        for y in (22, H - 22):
            d.ellipse([(x - 4) * k, (y - 4) * k, (x + 4) * k, (y + 4) * k], fill=(210, 190, 205))
    im = im.resize((W, H), Image.LANCZOS)
    save(im.convert("RGB"), "car-plate", 88)


# ---------------------------------------------------------------- emblem
def build_emblem() -> None:
    S = 128
    im, k = supersample(S, S)
    d = ImageDraw.Draw(im)
    c = S * k / 2
    d.polygon(star_points(c, c + 4 * k, 58 * k, 26 * k), fill=PLUM)
    d.polygon(star_points(c, c + 4 * k, 52 * k, 22 * k), fill=GOLD)
    d.polygon(star_points(c - 6 * k, c - 2 * k, 30 * k, 12 * k), fill=(255, 236, 160))
    heart(d, c, c + 6 * k, 16 * k, PINK)
    im = im.resize((S, S), Image.LANCZOS)
    clear_border(im, 3)
    save(im, "car-emblem", 90)


# ---------------------------------------------------------------- fabrics
def square(im: Image.Image, size: int, blur: float = 0.0) -> Image.Image:
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)).resize((size, size), Image.LANCZOS)
    return im.filter(ImageFilter.GaussianBlur(blur)) if blur else im


def build_fabrics() -> None:
    save(square(load("car-quilt"), 512, 0.3), "car-quilt", 80)
    save(square(load("car-polka"), 512, 0.4), "car-polka", 80)
    save(square(load("car-plush"), 256, 0.3), "car-plush", 78)


if __name__ == "__main__":
    build_unicorn()
    build_lettering()
    build_roundel()
    build_plate()
    build_emblem()
    build_fabrics()
