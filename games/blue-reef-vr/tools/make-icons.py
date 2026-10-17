#!/usr/bin/env python3
"""Рисует PNG-иконки PWA без внешних библиотек (только zlib/struct).

Иконка: тёмно-бирюзовый круг-толща воды, силуэт кита и пузырьки. Маскируемая
версия кладёт тот же рисунок на полный квадрат с запасом по краям.
"""
from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "assets"


def write_png(path: Path, w: int, h: int, rows: list[bytearray]) -> None:
    raw = b"".join(b"\x00" + bytes(row) for row in rows)

    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    header = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header)
           + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
    path.write_bytes(png)


def mix(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def ellipse(x, y, cx, cy, rx, ry):
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0


def polygon(x, y, pts):
    inside = False
    n = len(pts)
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) / (y2 - y1) * (x2 - x1)
            if x < xi:
                inside = not inside
    return inside


WATER_TOP = (58, 176, 204)
WATER_BOTTOM = (6, 34, 50)
WHALE = (231, 244, 249)
WHALE_DARK = (22, 74, 96)


def draw(size: int, maskable: bool) -> list[bytearray]:
    rows = []
    pad = 0.78 if maskable else 0.94
    for py in range(size):
        row = bytearray()
        for px in range(size):
            nx = (px + 0.5) / size * 2 - 1
            ny = (py + 0.5) / size * 2 - 1
            if maskable:
                # полная заливка квадрата: маска обрежет сама
                r = math.hypot(nx, ny) / math.sqrt(2)
                bg = mix(WATER_TOP, WATER_BOTTOM, min(1.0, r * 1.15))
            else:
                d = math.hypot(nx, ny)
                if d > 1.0:
                    row += bytes((0, 0, 0, 0))
                    continue
                bg = mix(WATER_TOP, WATER_BOTTOM, min(1.0, d / 0.95))
            # вертикальный градиент толщи воды
            v = (py / size)
            bg = mix(bg, WATER_BOTTOM, v * 0.55)

            # координаты рисунка внутри безопасной зоны
            x = (nx / pad + 1) / 2
            y = (ny / pad + 1) / 2
            color = bg
            alpha = 255

            body = ellipse(x, y, 0.46, 0.52, 0.33, 0.155) or ellipse(x, y, 0.19, 0.53, 0.10, 0.125)
            tail = polygon(x, y, [(0.72, 0.52), (0.96, 0.33), (0.90, 0.52), (0.97, 0.70), (0.74, 0.58)])
            flipper = polygon(x, y, [(0.36, 0.62), (0.54, 0.80), (0.44, 0.64)])
            if body or tail or flipper:
                # светлое брюхо и тёмная спина
                t = max(0.0, min(1.0, (y - 0.40) / 0.22))
                color = mix(WHALE, WHALE_DARK, t * 0.85)
            if body and math.hypot(x - 0.155, y - 0.475) < 0.022:
                color = (12, 26, 34)
            # пузырьки
            for bx, by, br in ((0.17, 0.30, 0.030), (0.24, 0.20, 0.020), (0.12, 0.16, 0.014)):
                d = math.hypot(x - bx, y - by)
                if d < br:
                    edge = 1 - d / br
                    color = mix(color, (255, 255, 255), 0.25 + 0.6 * edge)
            row += bytes((color[0], color[1], color[2], alpha))
        rows.append(row)
    return rows


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        write_png(OUT / f"icon-{size}.png", size, size, draw(size, maskable=False))
    write_png(OUT / "icon-512-maskable.png", 512, 512, draw(512, maskable=True))
    print("icons:", sorted(p.name for p in OUT.glob("*.png")))


if __name__ == "__main__":
    main()
