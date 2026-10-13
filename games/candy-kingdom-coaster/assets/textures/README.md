# Текстуры Candy Kingdom Coaster

Реальные (сгенерированные) текстуры, которыми игра заменяет процедурные canvas-рисунки.
Загружаются `src/textures.js` до построения мира; если файл не загрузился или
таймаут (12 с) истёк — для этого ключа остаётся прежняя процедурная текстура,
игра никогда не блокируется на арте (`tests/evidence/textures-fallback.png`).

| Файл | Где используется | UV / особенности |
|---|---|---|
| `road.jpg` 1024² | полоса дороги (`track.js → roadTexture`) | компонуется в canvas 1024²: белые поля для бордюров + полоса `ROAD_BAND = [0.12, 0.88]`; x — вдоль трассы (1 тайл = 12 м, `MirroredRepeat`), кремовые кромки и золотой штрих рисуются поверх |
| `meadow.jpg` 1024² | обочины (отдельный меш `shoulders`) | мировые UV: 1 тайл = 9 м по обеим осям, `MirroredRepeat`; умножается на vertex-color зоны (поэтому текстура осветлена на 22 %) |
| `fields.jpg` 1024² | дальний диск земли (r = 1100 м) | `MirroredRepeat` 5×5 → ~440 м на тайл |
| `lollipop-pink/blue/yellow.jpg` 512² | леденцы (3 материала + ломаемый частокол + hero-леденец) | крышки `CylinderGeometry` имеют планарную развёртку — спираль ложится ровно; синий и жёлтый — hue-shift из розового |
| `cane.jpg` 512² | трости, hero-трость, столбы проезжных ворот | по умолчанию clamp (1 тайл на высоту), как и прежняя процедурная полоска |
| `cookie.jpg` 512² | печенье | крышки цилиндра = верх печенья |
| `wall.jpg` 1024×512 | стены и башни замка (`wall`, `wallB`), кремовая отделка `wallC` без карты | `MirroredRepeat` 4×2, умножается на розовые цвета материалов |
| `donut-pink/lilac.jpg` 512² | «пончиковые сады» | `wrapT = Mirrored`, repeat (1, 2) вдоль кольца; лиловый — hue-shift |

## Пайплайн

1. Исходники — квадратные PNG из генератора изображений, лежат в `_raw/` (в git не попадают, см. корневой `.gitignore`).
2. `python3 build-textures.py` (нужен Pillow) делает кроп/ресайз, осветление, hue-варианты и пишет JPG сюда.
3. Новые файлы добавляются в `TEXTURE_MANIFEST` (`src/textures.js`) и в список кэша `sw.js` (не забыть поднять версию кэша).

Суммарный вес — ~1.3 МБ; всё кэшируется service worker'ом, офлайн-режим сохраняется.

## Промпты (для повторной генерации)

Общие требования во всех промптах: flat orthographic top-down, uniform lighting, no shadows,
no text, fills the entire frame, stylized 3D game texture. Бесшовность не гарантируется —
её даёт `MirroredRepeatWrapping` в рантайме.

- **road** — «candy race track road surface: smooth pastel strawberry-pink glossy sugar asphalt with fine sugar-crystal grain, scattered tiny colorful candy sprinkles (red, yellow, green, sky blue, purple, white), sparkling sugar glitter; no road markings».
- **meadow** — «candy-land sugar meadow: pale mint-green frosting grass of tiny sugar crystals and piped-cream tufts, very small pastel candy dots, a few tiny marshmallow pebbles; very bright high-key pastel».
- **fields** — «aerial map of a candy kingdom countryside: patchwork of pastel candy farm fields (mint, strawberry-cream, lemon custard, lilac, baby-blue cotton candy), marshmallow paths, lollipop-tree clusters, winding caramel streams».
- **lollipop** — «round spiral lollipop candy, centered, swirl extends past the edges, hot-pink and creamy-white glossy spiral, no stick».
- **cane** — «candy cane stripes: bold 45° diagonal stripes, glossy cherry-red and creamy-white, equal width».
- **cookie** — «top surface of a golden chocolate chip cookie filling the frame, crackled dough, dark chocolate chips, tiny sugar crystals».
- **wall** — «pastel candy castle wall: rows of pale cream-white sugar wafer bricks with rounded edges, thin pink frosting mortar, tiny pastel sugar pearls» (в сборке берутся верхние 6 ровных рядов).
- **donut** — «smooth glossy pastel pink strawberry donut glaze with scattered small colorful sprinkles, no donut shape, no hole».
