#!/usr/bin/env python3
"""Turn the generated source art in `_raw/` into the game-ready textures.

The sources are AI-generated square PNGs (see README.md for the prompts).
This script crops, resizes, lifts brightness where the texture is multiplied
by vertex/instance colours in the game, derives hue-shifted colour variants,
and writes compact lossy WebP files that the runtime loads through
`src/textures.js` (WebP is ~3x smaller than the JPGs we shipped first; every
browser that runs WebGL2 decodes it).

Usage:
    python3 build-textures.py            # rebuild everything into this folder
    python3 build-textures.py --check    # only report sizes of the outputs
    python3 build-textures.py --legacy   # also keep .jpg copies (debugging)

Source lookup order for every texture: `_raw/<name>.png`, then a previously
built `<name>.jpg` / `<name>.webp` in this folder — so the script still runs
(e.g. to re-encode at another quality) when the raw art is not around; `_raw/`
is git-ignored.

Only Pillow (with WebP support) is required:  pip install pillow
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageEnhance, ImageFilter, features
except ImportError:  # pragma: no cover - tooling guard
    sys.exit("Pillow is required: pip install pillow")

if not features.check("webp"):  # pragma: no cover - tooling guard
    sys.exit("this Pillow build has no WebP support")

HERE = Path(__file__).resolve().parent
RAW = HERE / "_raw"
WEBP_METHOD = 6  # slowest / smallest encoder setting; a one-off build step


def square_center(im: Image.Image) -> Image.Image:
    """Crop the largest centred square."""
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))


def lift(im: Image.Image, amount: float) -> Image.Image:
    """Blend towards white: textures that get multiplied by vertex/material
    colours must stay high-key or the scene turns muddy."""
    if amount <= 0:
        return im
    white = Image.new("RGB", im.size, (255, 255, 255))
    return Image.blend(im, white, amount)


def hue_shift(im: Image.Image, degrees: float) -> Image.Image:
    """Rotate hue (degrees) for colour variants; whites/greys are unaffected."""
    hsv = im.convert("HSV")
    h, s, v = hsv.split()
    offset = int(round(degrees / 360.0 * 255)) % 256
    h = h.point(lambda p: (p + offset) % 256)
    return Image.merge("HSV", (h, s, v)).convert("RGB")


def desaturate(im: Image.Image, keep: float) -> Image.Image:
    """keep=0 → greyscale, keep=1 → unchanged. Used for tint-base textures
    (foliage, scoops) whose colour comes from per-instance colours."""
    return ImageEnhance.Color(im).enhance(keep)


def soften(im: Image.Image, radius: float) -> Image.Image:
    """A touch of blur before encoding: the generator's per-pixel grain is
    invisible under mipmapping anyway but costs 30-40 % of the file size."""
    return im.filter(ImageFilter.GaussianBlur(radius)) if radius > 0 else im


def fit(im: Image.Image, size: int, blur: float = 0.0) -> Image.Image:
    """Centre-square crop → size×size → optional soften."""
    return soften(square_center(im).resize((size, size), Image.LANCZOS), blur)


KEEP_JPG = False


def save(im: Image.Image, name: str, quality: int = 78) -> Path:
    """Write <name>.webp (and optionally a .jpg twin for debugging)."""
    out = HERE / f"{name}.webp"
    rgb = im.convert("RGB")
    rgb.save(out, "WEBP", quality=quality, method=WEBP_METHOD)
    if KEEP_JPG:
        rgb.save(HERE / f"{name}.jpg", "JPEG", quality=86, optimize=True, subsampling=1)
    return out


def load(name: str, built: str | None = None) -> Image.Image:
    """Raw generated art if present, otherwise the previously built texture."""
    path = RAW / f"{name}.png"
    if path.is_file():
        return Image.open(path).convert("RGB")
    for cand in ([built] if built else []) + [name]:
        for ext in ("jpg", "webp"):
            legacy = HERE / f"{cand}.{ext}"
            if legacy.is_file():
                return Image.open(legacy).convert("RGB")
    sys.exit(f"missing source art: {path} (and no built {name}.jpg/.webp to fall back on)")


def build() -> list[Path]:
    written: list[Path] = []

    # ---- road band: along the track x across; composited at runtime into a
    # canvas with the cream edge lines + golden dash (track.js). The main
    # strawberry road keeps 1024 (it is on screen the whole ride); the zone
    # variants are 768 — one tile is 12 m, so that is still 64 texels/m.
    road = lift(fit(load("road"), 1024, 0.6), 0.10)
    written.append(save(road, "road", 74))
    # per-zone surfaces: cookie (Gummy Bear Grove), chocolate bar (Cocoa
    # Canyon), vanilla frosting (Marshmallow Valley), waffle (Sugar Castle Run)
    for name, size, blur, lift_amt, q in (
        ("road-cookie", 768, 0.5, 0.06, 70),
        ("road-choco", 1024, 0.0, 0.0, 74),   # smooth bevels: tiny file even at 1024
        ("road-cream", 768, 0.5, 0.0, 72),
        ("road-waffle", 768, 0.5, 0.05, 72),
    ):
        written.append(save(lift(fit(load(name), size, blur), lift_amt), name, q))

    # ---- shoulder meadow: multiplied by the zone-tinted vertex colours.
    written.append(save(lift(fit(load("meadow"), 768, 0.4), 0.22), "meadow", 72))

    # ---- far patchwork fields on the big ground disc (~440 m per tile)
    written.append(save(lift(fit(load("fields"), 768, 0.5), 0.08), "fields", 70))

    # ---- lollipop swirl: pink source + two hue-rotated siblings (blue, yellow)
    lolli = fit(load("lollipop", "lollipop-pink"), 512)
    written.append(save(lolli, "lollipop-pink", 78))
    written.append(save(hue_shift(lolli, -135), "lollipop-blue", 78))
    written.append(save(hue_shift(lolli, 80), "lollipop-yellow", 78))

    # ---- candy cane stripes
    written.append(save(fit(load("cane"), 512), "cane", 78))

    # ---- chocolate chip cookie top (cookie props)
    cookie = fit(load("cookie"), 512, 0.7)
    if (RAW / "cookie.png").is_file():
        cookie = ImageEnhance.Brightness(cookie).enhance(1.08)  # already baked into the shipped file
    written.append(save(cookie, "cookie", 72))

    # ---- castle wafer bricks: keep the six regular brick rows (the source has
    # an irregular bottom third) so the tile repeats without a scale jump.
    if (RAW / "wall.png").is_file():
        wall = lift(load("wall").crop((0, 82, 1024, 598)).resize((1024, 512), Image.LANCZOS), 0.06)
    else:
        wall = load("wall").resize((1024, 512), Image.LANCZOS)
    written.append(save(wall, "wall", 74))

    # ---- donut glaze: pink + lilac variant for the second donut material
    donut = fit(load("donut", "donut-pink"), 512)
    written.append(save(donut, "donut-pink", 76))
    written.append(save(hue_shift(donut, -70), "donut-lilac", 76))

    # ---- tint bases (multiplied by per-instance colours, so near-white):
    # sugar-crystal gumdrop skin → candy-tree foliage + roadside gumdrops
    gum = lift(desaturate(fit(load("gumdrop"), 384, 0.4), 0.15), 0.30)
    written.append(save(gum, "gumdrop", 70))
    # powdered marshmallow → marshmallow stacks + ice-cream scoops
    written.append(save(lift(fit(load("marshmallow"), 384, 0.3), 0.08), "marshmallow", 70))

    # ---- gingerbread wall with royal icing → village house bodies
    ginger = ImageEnhance.Brightness(fit(load("gingerbread"), 512, 0.5)).enhance(1.06)
    written.append(save(ginger, "gingerbread", 74))

    return written


def report() -> None:
    total = 0
    for path in sorted(HERE.glob("*.webp")):
        size = path.stat().st_size
        total += size
        with Image.open(path) as im:
            print(f"{path.name:22s} {im.size[0]:4d}x{im.size[1]:<4d} {size / 1024:7.1f} KB")
    print(f"{'total':22s} {'':9s} {total / 1024:7.1f} KB")


def main() -> int:
    global KEEP_JPG
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="only list the built textures")
    parser.add_argument("--legacy", action="store_true", help="also write .jpg twins")
    args = parser.parse_args()
    KEEP_JPG = args.legacy
    if not args.check:
        for path in build():
            print(f"wrote {path.relative_to(HERE)}")
    report()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
