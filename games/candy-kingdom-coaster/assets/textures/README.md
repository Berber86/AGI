# Текстуры Candy Kingdom Coaster

Реальные (сгенерированные) текстуры, которыми игра заменяет процедурные canvas-рисунки.
Загружаются `src/textures.js` до построения мира; если файл не загрузился или
таймаут (12 с) истёк — для этого ключа остаётся прежняя процедурная текстура,
игра никогда не блокируется на арте (`tests/evidence/textures-fallback.png`).

| Файл | Где используется | UV / особенности |
|---|---|---|
| `road.webp` 1024² | дорога, зона 0 Lollipop Meadows (`track.js → roadTexture`) | компонуется в canvas 1024²: белые поля для бордюров + полоса `ROAD_BAND = [0.12, 0.88]`; x — вдоль трассы (1 тайл = 12 м, `MirroredRepeat`), кромки и штрих рисуются поверх цветами из `ROAD_SURFACES` |
| `road-cookie.webp` 768² | дорога, зона 1 Gummy Bear Grove — печенье | та же компоновка; 768 px на 12 м = 64 текселя/м |
| `road-choco.webp` 1024² | дорога, зона 2 Cocoa Canyon — шоколадная плитка | сегменты ~2 м; гладкая картинка → всего 17 КБ |
| `road-cream.webp` 768² | дорога, зона 3 Marshmallow Valley — ванильный крем с конфетками | кромки и штрих розовые (на белом кремовые не видны) |
| `road-waffle.webp` 768² | дорога, зона 4 Sugar Castle Run — вафля; **и** рожки мороженого (`propMats.cone`) | `MirroredRepeat`; для рожка 1 тайл на конус |
| `meadow.webp` 768² | обочины (отдельный меш `shoulders`) | мировые UV: 1 тайл = 9 м по обеим осям, `MirroredRepeat`; умножается на vertex-color зоны (поэтому текстура осветлена на 22 %) |
| `fields.webp` 768² | дальний диск земли (r = 1100 м) | `MirroredRepeat` 5×5 → ~440 м на тайл |
| `lollipop-pink/blue/yellow.webp` 512² | леденцы (3 материала + ломаемый частокол + hero-леденец) | крышки `CylinderGeometry` имеют планарную развёртку — спираль ложится ровно; синий и жёлтый — hue-shift из розового |
| `cane.webp` 512² | трости, hero-трость, столбы проезжных ворот | по умолчанию clamp (1 тайл на высоту), как и прежняя процедурная полоска |
| `cookie.webp` 512² | печенье | крышки цилиндра = верх печенья |
| `wall.webp` 1024×512 | стены и башни замка (`wall`, `wallB`), кремовая отделка `wallC` без карты | `MirroredRepeat` 4×2, умножается на розовые цвета материалов |
| `donut-pink/lilac.webp` 512² | «пончиковые сады» | `wrapT = Mirrored`, repeat (1, 2) вдоль кольца; лиловый — hue-shift |
| `gumdrop.webp` 384² | кроны конфетных деревьев (+ стволы, меш склеен) и придорожные мармеладки | почти белая «подложка» (desaturate + lift 0.3): цвет даёт `instanceColor`, карта — сахарную фактуру; `MirroredRepeat` (2, 1) |
| `marshmallow.webp` 384² | зефирные стопки и шарики мороженого (`propMats.marsh`, `propMats.ice`) | подложка под `instanceColor`, `MirroredRepeat` (2, 1) |
| `gingerbread.webp` 512² | стены пряничных домиков (`propMats.ginger`) | `RoundedBoxGeometry`: 1 тайл на грань; без файла — печенье `cookie` |

Без любого из файлов материал получает процедурный фолбэк: у дороги — свой узор на зону (`pattern` в `ROAD_SURFACES`: sprinkles / chips / bar / dots / waffle), у подложек — просто `instanceColor` без карты.

## Пайплайн

1. Исходники — квадратные PNG из генератора изображений, лежат в `_raw/` (в git не попадают, см. корневой `.gitignore`).
2. `python3 build-textures.py` (нужен Pillow с WebP) делает кроп/ресайз, лёгкое размытие перед кодированием, осветление, hue-варианты и пишет **WebP** сюда. Если `_raw/x.png` нет, скрипт берёт уже собранный `x.webp` (так можно перекодировать набор после сброса песочницы).
3. Новые файлы добавляются в `TEXTURE_MANIFEST` (`src/textures.js`) и в список кэша `sw.js` (не забыть поднять версию кэша — сейчас `ckc-v4`).

### Вес

| | файлов | размер |
|---|---|---|
| было (JPEG q86, 1024²/512²) | 11 | 1286 КБ |
| те же 11 в WebP (q70–78, шумные тайлы 1024 → 768 + blur 0.4–0.6) | 11 | 410 КБ (**в 3.1 раза меньше**) |
| новые (4 дороги + 3 подложки) | 7 | 415 КБ |
| **итого сейчас** | **18** | **825 КБ** |

Покрупнее всего `road-cookie.webp` (130 КБ): крошка и крекелюр плохо жмутся; дальше уменьшать — только разрешением. Всё кэшируется service worker'ом, офлайн-режим сохраняется.

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
- **road-cookie** — «golden-brown shortbread cookie surface filling the entire frame, lightly crackled baked dough, scattered dark chocolate chips and a few sugar crystals».
- **road-choco** — «milk chocolate bar filling the entire frame, regular grid of rounded rectangular chocolate segments with soft bevels, smooth glossy warm brown».
- **road-cream** — «white vanilla whipped frosting surface filling the entire frame, soft piped swirls, scattered tiny pastel mini marshmallows and sugar pearls in pink, mint, lilac and lemon, bright high-key».
- **road-waffle** — «golden waffle surface filling the entire frame, regular square grid of deep waffle pockets, light dusting of powdered sugar, warm honey-gold».
- **gumdrop** — «surface of a sugar-coated gumdrop candy filling the entire frame, dense coarse white sugar crystals on a very pale pastel base, bright high-key» (в сборке обесцвечивается и осветляется — это подложка под `instanceColor`).
- **marshmallow** — «soft white marshmallow surface filling the entire frame, fine powdered sugar dusting, subtle pillowy dimples, very bright high-key white».
- **gingerbread** — «gingerbread house wall filling the entire frame, warm brown gingerbread with white royal icing scallop lines and dots, a few small pastel candy buttons, flat front orthographic view».
