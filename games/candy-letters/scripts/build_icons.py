"""Генератор иконок «Сладких букв» без внешних зависимостей.

Рисует леденец со спиралью и буквой А прямо в растр, затем пишет PNG через zlib.
Запуск:  python3 games/candy-letters/scripts/build_icons.py
"""
from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parents[1] / "play"

# Буква А из play/assets/letters.js — тот же путь, только растеризованный.
LETTER_A = [
    [("M", 12, 88), ("L", 50, 14)],
    [("M", 50, 14), ("L", 88, 88)],
    [("M", 27, 62), ("L", 73, 62)],
]


def clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def mix(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def stroke_polyline(commands, step=1.0):
    """Разворачивает M/L путь в список точек."""
    points = []
    cursor = (0.0, 0.0)
    for command in commands:
        if command[0] == "M":
            cursor = (float(command[1]), float(command[2]))
            points.append(cursor)
        elif command[0] == "L":
            target = (float(command[1]), float(command[2]))
            length = math.hypot(target[0] - cursor[0], target[1] - cursor[1])
            steps = max(1, int(length / step))
            for i in range(1, steps + 1):
                t = i / steps
                points.append((cursor[0] + (target[0] - cursor[0]) * t, cursor[1] + (target[1] - cursor[1]) * t))
            cursor = target
    return points


def spiral_points(turns=3.2, steps=260):
    points = []
    for i in range(steps + 1):
        t = i / steps
        angle = t * math.tau * turns
        r = t * 0.98
        points.append((math.cos(angle) * r, math.sin(angle) * r))
    return points


def distance_to_polyline(px, py, points):
    best = math.inf
    for i in range(1, len(points)):
        ax, ay = points[i - 1]
        bx, by = points[i]
        dx, dy = bx - ax, by - ay
        length_sq = dx * dx + dy * dy
        if length_sq == 0:
            continue
        t = clamp01(((px - ax) * dx + (py - ay) * dy) / length_sq)
        cx, cy = ax + dx * t, ay + dy * t
        best = min(best, math.hypot(px - cx, py - cy))
    return best


def render(size: int, supersample: int = 2) -> bytes:
    """Возвращает RGB-байты картинки size×size (суперсэмплинг сглаживает края)."""
    width = size * supersample
    pixels = bytearray(width * width * 3)

    candy = (255, 93, 115)
    candy_deep = (198, 39, 70)
    cream = (255, 248, 251)
    white = (255, 255, 255)
    bg_top = (255, 226, 239)
    bg_bottom = (255, 209, 178)

    spiral = spiral_points()
    letter_lines = [stroke_polyline(path, 1.0) for path in LETTER_A]

    center = width / 2
    radius = width * 0.42
    letter_scale = radius * 2 * 0.62 / 100.0
    letter_ox = center - 50 * letter_scale
    letter_oy = center - 50 * letter_scale
    spiral_width = radius * 0.24
    letter_width = letter_scale * 11.0
    letter_points = [
        [(letter_ox + x * letter_scale, letter_oy + y * letter_scale) for (x, y) in line]
        for line in letter_lines
    ]

    for y in range(width):
        for x in range(width):
            dx = (x + 0.5 - center) / radius
            dy = (y + 0.5 - center) / radius
            dist = math.hypot(dx, dy)
            index = (y * width + x) * 3

            if dist <= 1.0:
                # Внутри леденца: крем + спираль
                nx = (x + 0.5 - center) / radius
                ny = (y + 0.5 - center) / radius
                angle = math.atan2(ny, nx)
                radial = math.hypot(nx, ny)
                swirl = (angle / math.tau * 3.2 - radial + 1.0) % 1.0
                base = cream if swirl > 0.5 else mix(candy, cream, 0.0)
                if swirl <= 0.5:
                    base = candy
                # Блик сверху слева
                highlight = clamp01(1.0 - math.hypot(nx + 0.42, ny + 0.46) / 0.42)
                color = mix(base, white, highlight * 0.42)

                # Контур-ободок
                if dist > 0.94:
                    color = mix(color, white, clamp01((dist - 0.94) / 0.06) * 0.85)

                # Спираль поверх, чтобы буква читалась
                if dist < 0.99:
                    d_spiral = distance_to_polyline(nx, ny, spiral) * radius
                    if d_spiral < spiral_width * 0.5:
                        color = mix(color, candy, 0.75)

                # Буква А — белая с тёмной каёмкой
                d_letter = min(distance_to_polyline(x + 0.5, y + 0.5, line) for line in letter_points)
                if d_letter < letter_width * 0.5:
                    color = white
                elif d_letter < letter_width * 0.5 + letter_scale * 2.4:
                    color = mix(color, candy_deep, 0.55)
            else:
                # Фон: плавный градиент + мягкая тень под леденцом
                t = clamp01(y / width)
                color = mix(bg_top, bg_bottom, t)
                shadow = clamp01(1.0 - (dist - 1.0) / 0.12)
                color = mix(color, (214, 150, 150), shadow * 0.45)

            pixels[index] = int(color[0])
            pixels[index + 1] = int(color[1])
            pixels[index + 2] = int(color[2])

    if supersample == 1:
        return bytes(pixels)

    # Усредняем блоки суперсэмплинга — дешёвое сглаживание.
    out = bytearray(size * size * 3)
    for y in range(size):
        for x in range(size):
            r = g = b = 0
            for sy in range(supersample):
                for sx in range(supersample):
                    index = ((y * supersample + sy) * width + (x * supersample + sx)) * 3
                    r += pixels[index]
                    g += pixels[index + 1]
                    b += pixels[index + 2]
            total = supersample * supersample
            index = (y * size + x) * 3
            out[index] = r // total
            out[index + 1] = g // total
            out[index + 2] = b // total
    return bytes(out)


def write_png(path: Path, size: int, rgb: bytes, height: int | None = None) -> None:
    height = height or size
    raw = bytearray()
    stride = size * 3
    for y in range(height):
        raw.append(0)  # filter type 0
        raw.extend(rgb[y * stride : (y + 1) * stride])

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    header = struct.pack(">IIBBBBB", size, height, 8, 2, 0, 0, 0)
    payload = b"\x89PNG\r\n\x1a\n"
    payload += chunk(b"IHDR", header)
    payload += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    payload += chunk(b"IEND", b"")
    path.write_bytes(payload)


def render_cover(width: int = 960, height: int = 540) -> bytes:
    """Обложка для витрины: кондитерская страна и пять букв-леденцов."""
    candy_colors = [
        ((255, 93, 115), "А"),
        ((255, 159, 67), "О"),
        ((255, 212, 71), "У"),
        ((199, 125, 255), "М"),
        ((76, 201, 240), "С"),
    ]
    pixels = bytearray(width * height * 3)
    horizon = int(height * 0.74)
    center_y = int(height * 0.44)
    radius = height * 0.19

    for y in range(height):
        for x in range(width):
            index = (y * width + x) * 3
            if y < horizon:
                t = y / horizon
                color = mix((255, 242, 214), (255, 222, 235), t)
            else:
                t = (y - horizon) / (height - horizon)
                color = mix((139, 90, 60), (109, 64, 40), t)
            # Вафельный забор
            if horizon - height * 0.09 < y < horizon + height * 0.01:
                post = int((x % (width * 0.035)) )
                if post < width * 0.024:
                    color = (246, 211, 163)
            pixels[index] = int(color[0])
            pixels[index + 1] = int(color[1])
            pixels[index + 2] = int(color[2])

    for index_in_row, (color, glyph) in enumerate(candy_colors):
        cx = width * (0.13 + index_in_row * 0.185)
        cy = center_y - (index_in_row % 2) * height * 0.05
        r = radius * (0.82 + (index_in_row % 3) * 0.06)
        # Палочка
        for y in range(int(cy + r * 0.6), int(cy + r * 2.6)):
            for x in range(int(cx - r * 0.07), int(cx + r * 0.07)):
                if 0 <= x < width and 0 <= y < height:
                    index = (y * width + x) * 3
                    pixels[index] = 232
                    pixels[index + 1] = 180
                    pixels[index + 2] = 140
        # Леденец
        for y in range(int(cy - r) - 2, int(cy + r) + 2):
            for x in range(int(cx - r) - 2, int(cx + r) + 2):
                if not (0 <= x < width and 0 <= y < height):
                    continue
                nx = (x - cx) / r
                ny = (y - cy) / r
                dist = math.hypot(nx, ny)
                index = (y * width + x) * 3
                if dist <= 1.0:
                    angle = math.atan2(ny, nx)
                    swirl = (angle / math.tau * 3.2 - dist + 1.0) % 1.0
                    base = color if swirl <= 0.5 else (255, 248, 251)
                    if dist > 0.93:
                        base = mix(base, (255, 255, 255), 0.7)
                    # Буква по центру
                    glyph_mask = (
                        (0.66 < abs(nx) < 0.86 and ny > -0.35 and ny < 0.5)
                        or (abs(ny - 0.42) < 0.12 and abs(nx) < 0.5)
                    )
                    if glyph_mask:
                        base = (255, 255, 255)
                    pixels[index] = int(base[0])
                    pixels[index + 1] = int(base[1])
                    pixels[index + 2] = int(base[2])
    return bytes(pixels)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cover = render_cover()
    write_png(OUT_DIR / "cover.png", 960, cover, height=540)
    print(f"cover.png: 960x540, {(OUT_DIR / 'cover.png').stat().st_size} bytes")
    for size, name in ((192, "icon-192.png"), (512, "icon-512.png")):
        supersample = 2 if size <= 192 else 1
        rgb = render(size * supersample, supersample=1) if supersample == 1 else render(size, supersample)
        write_png(OUT_DIR / name, size, rgb)
        print(f"{name}: {size}x{size}, {(OUT_DIR / name).stat().st_size} bytes")


if __name__ == "__main__":
    main()
