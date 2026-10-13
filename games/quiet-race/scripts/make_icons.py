#!/usr/bin/env python3
"""Generate the PWA icons with the standard library only (no Pillow needed)."""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "icons"

PINK = (255, 158, 196)
PINK_DARK = (224, 102, 153)
CREAM = (255, 247, 232)
GRASS = (169, 221, 138)
WHITE = (255, 255, 255)
INK = (90, 70, 50)
SUN = (255, 226, 138)


def write_png(path: Path, width: int, height: int, pixels: list[list[tuple[int, int, int]]]) -> None:
    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for r, g, b in row:
            raw.extend((r, g, b))
    def chunk(tag: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + tag
            + payload
            + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)
        )

    header = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    data = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    path.write_bytes(data)


def rounded_rect(px, size, x0, y0, x1, y1, radius, color):
    for y in range(max(0, int(y0)), min(size, int(y1))):
        for x in range(max(0, int(x0)), min(size, int(x1))):
            dx = min(max(x0 + radius - x, x - (x1 - radius)), 0)
            dy = min(max(y0 + radius - y, y - (y1 - radius)), 0)
            if dx * dx + dy * dy <= radius * radius:
                px[y][x] = color


def disc(px, size, cx, cy, radius, color):
    r2 = radius * radius
    for y in range(max(0, int(cy - radius)), min(size, int(cy + radius) + 1)):
        for x in range(max(0, int(cx - radius)), min(size, int(cx + radius) + 1)):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r2:
                px[y][x] = color


def triangle(px, size, points, color):
    (x1, y1), (x2, y2), (x3, y3) = points
    min_y = max(0, int(min(y1, y2, y3)))
    max_y = min(size - 1, int(max(y1, y2, y3)))
    min_x = max(0, int(min(x1, x2, x3)))
    max_x = min(size - 1, int(max(x1, x2, x3)))
    area = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
    if area == 0:
        return
    for y in range(min_y, max_y + 1):
        for x in range(min_x, max_x + 1):
            w1 = ((x2 - x) * (y3 - y) - (x3 - x) * (y2 - y)) / area
            w2 = ((x3 - x) * (y1 - y) - (x1 - x) * (y3 - y)) / area
            w3 = 1 - w1 - w2
            if w1 >= -0.002 and w2 >= -0.002 and w3 >= -0.002:
                px[y][x] = color


def make_icon(size: int, path: Path) -> None:
    px: list[list[tuple[int, int, int]]] = [[CREAM for _ in range(size)] * 1 for _ in range(size)]
    px = [[CREAM for _ in range(size)] for _ in range(size)]
    s = size / 512.0

    # Grass base + sun + a friendly car, all inside the safe mask area.
    rounded_rect(px, size, 0, 0, size, size, 96 * s, GRASS)
    disc(px, size, 130 * s, 130 * s, 74 * s, SUN)

    # Car body (top-down, rounded) with a windshield and a star.
    rounded_rect(px, size, 176 * s, 120 * s, 336 * s, 420 * s, 68 * s, PINK_DARK)
    rounded_rect(px, size, 186 * s, 128 * s, 326 * s, 412 * s, 60 * s, PINK)
    rounded_rect(px, size, 214 * s, 168 * s, 298 * s, 244 * s, 26 * s, (206, 240, 255))
    rounded_rect(px, size, 214 * s, 300 * s, 298 * s, 358 * s, 24 * s, CREAM)
    disc(px, size, 256 * s, 214 * s, 26 * s, WHITE)

    # Wheels.
    rounded_rect(px, size, 148 * s, 176 * s, 186 * s, 246 * s, 16 * s, INK)
    rounded_rect(px, size, 326 * s, 176 * s, 364 * s, 246 * s, 16 * s, INK)
    rounded_rect(px, size, 148 * s, 300 * s, 186 * s, 370 * s, 16 * s, INK)
    rounded_rect(px, size, 326 * s, 300 * s, 364 * s, 370 * s, 16 * s, INK)

    # Checkered flag in the lower right corner.
    for row in range(4):
        for col in range(5):
            color = WHITE if (row + col) % 2 == 0 else INK
            rounded_rect(
                px,
                size,
                (300 + col * 34) * s,
                (392 + row * 26) * s,
                (334 + col * 34) * s,
                (418 + row * 26) * s,
                4 * s,
                color,
            )

    # A little pennant on the antenna.
    triangle(px, size, [(256 * s, 40 * s), (352 * s, 62 * s), (256 * s, 84 * s)], WHITE)

    write_png(path, size, size, px)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    make_icon(192, OUT / "icon-192.png")
    make_icon(512, OUT / "icon-512.png")
    print(f"icons written to {OUT}")


if __name__ == "__main__":
    main()
