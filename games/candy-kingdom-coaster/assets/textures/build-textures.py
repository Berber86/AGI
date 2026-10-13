#!/usr/bin/env python3
"""Turn the generated source art in `_raw/` into the game-ready textures.

The sources are AI-generated square PNGs (see README.md for the prompts).
This script crops, resizes, lifts brightness where the texture is multiplied
by vertex colours in the game, derives hue-shifted colour variants, and writes
compact JPGs that the runtime loads through `src/textures.js`.

Usage:
    python3 build-textures.py            # rebuild everything into this folder
    python3 build-textures.py --check    # only report sizes of the outputs

Only Pillow is required:  pip install pillow
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageEnhance
except ImportError:  # pragma: no cover - tooling guard
    sys.exit("Pillow is required: pip install pillow")

HERE = Path(__file__).resolve().parent
RAW = HERE / "_raw"


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


def save_jpg(im: Image.Image, name: str, quality: int = 86) -> Path:
    out = HERE / name
    im.convert("RGB").save(out, "JPEG", quality=quality, optimize=True, progressive=False, subsampling=1)
    return out


def load(name: str) -> Image.Image:
    path = RAW / f"{name}.png"
    if not path.is_file():
        sys.exit(f"missing source art: {path}")
    return Image.open(path).convert("RGB")


def build() -> list[Path]:
    written: list[Path] = []

    # Road band: 1024 along the track x 1024 across; composited at runtime.
    road = square_center(load("road")).resize((1024, 1024), Image.LANCZOS)
    road = lift(road, 0.10)
    written.append(save_jpg(road, "road.jpg", 84))

    # Shoulder meadow: multiplied by the zone-tinted vertex colours.
    meadow = square_center(load("meadow")).resize((1024, 1024), Image.LANCZOS)
    meadow = lift(meadow, 0.22)
    written.append(save_jpg(meadow, "meadow.jpg", 82))

    # Far patchwork fields on the big ground disc.
    fields = square_center(load("fields")).resize((1024, 1024), Image.LANCZOS)
    fields = lift(fields, 0.08)
    written.append(save_jpg(fields, "fields.jpg", 82))

    # Lollipop swirl: pink source + two hue-rotated siblings (blue, yellow).
    lolli = square_center(load("lollipop")).resize((512, 512), Image.LANCZOS)
    written.append(save_jpg(lolli, "lollipop-pink.jpg"))
    written.append(save_jpg(hue_shift(lolli, -135), "lollipop-blue.jpg"))
    written.append(save_jpg(hue_shift(lolli, 80), "lollipop-yellow.jpg"))

    # Candy cane stripes.
    cane = square_center(load("cane")).resize((512, 512), Image.LANCZOS)
    written.append(save_jpg(cane, "cane.jpg"))

    # Chocolate chip cookie top.
    cookie = square_center(load("cookie")).resize((512, 512), Image.LANCZOS)
    cookie = ImageEnhance.Brightness(cookie).enhance(1.08)
    written.append(save_jpg(cookie, "cookie.jpg"))

    # Castle wafer bricks: keep the six regular brick rows (the source has an
    # irregular bottom third) so the tile repeats without a scale jump.
    wall_src = load("wall")
    wall = wall_src.crop((0, 82, 1024, 598)).resize((1024, 512), Image.LANCZOS)
    wall = lift(wall, 0.06)
    written.append(save_jpg(wall, "wall.jpg", 82))

    # Donut glaze: pink + lilac variant for the second donut material.
    donut = square_center(load("donut")).resize((512, 512), Image.LANCZOS)
    written.append(save_jpg(donut, "donut-pink.jpg"))
    written.append(save_jpg(hue_shift(donut, -70), "donut-lilac.jpg"))

    return written


def report() -> None:
    total = 0
    for path in sorted(HERE.glob("*.jpg")):
        size = path.stat().st_size
        total += size
        with Image.open(path) as im:
            print(f"{path.name:22s} {im.size[0]:4d}x{im.size[1]:<4d} {size / 1024:7.1f} KB")
    print(f"{'total':22s} {'':9s} {total / 1024:7.1f} KB")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="only list the built textures")
    args = parser.parse_args()
    if not args.check:
        for path in build():
            print(f"wrote {path.relative_to(HERE)}")
    report()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
