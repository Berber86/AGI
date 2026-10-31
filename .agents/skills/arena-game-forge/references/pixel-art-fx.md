# Пиксельные VFX и спрайтовые эффекты: метод pixelfx

Разбор библиотеки [patch-gg/pixelfx](https://github.com/patch-gg/pixelfx) (MIT, ~244 эффекта) и её метода.
Читать, когда в контракте игры есть пиксель-арт, «джус» (удары, взрывы, подбор предметов), магия, погода,
UI-поп-апы, или когда визуал игры выглядит как «стикеры на манекене». Работает для canvas, Phaser, PixiJS,
Kaplay и three.js; для Godot/Unity/GameMaker — через спрайт-шиты из этого же репозитория.

Ключевая мысль авторов: **эффект — это не картинка, а маленькая программа**. Код — глина, глаза — судья,
референсы — топливо. Один промпт даёт посредственный эффект; черновик → рендер → взгляд → правка даёт хороший.

---

## 1. Что внутри и что оттуда брать

```text
pixelfx/
├── src/core/          ← рантайм, ~2600 строк, без зависимостей (это и вендорим)
│   ├── painter.js     ← два буфера: color (пиксели) + light (аддитивное свечение)
│   ├── sim.js         ← частицы, осколки, вспышки, band/crystal/sparkle (адаптация Sprite Fusion)
│   ├── fx.js          ← createFrame / createFx / composite
│   ├── act.js rig.js  ← «акт»: тело персонажа, позы, hit-stop
│   ├── actor.js poses.js  ← стоковый манекен 24×38 и READY-поза
│   ├── math.js color.js particles.js shapes.js font.js scene.js chain.js
├── src/fx/<категория>/<имя>.js  ← сами эффекты, по одному файлу
├── tools/             ← render, check, list, new, sheets, act, montage, serve, compare
├── docs/AUTHORING.md  ← контракт, API, планка качества
└── skills/pixelfx/SKILL.md ← тот же метод, оформленный как Agent Skill
```

Категории: moves, fire, explosions, water, ice, lightning, sci-fi, melee, impacts, projectiles,
spawn & death, arcane, holy, shadow, status, nature, weather, ui, pickups, transitions, critters.
Полный список — `docs/CATALOG.md`, поиск — `node tools/list.mjs frost`.

Лицензия MIT (код и эффекты, коммерческое использование разрешено). Часть эффектов адаптирована из
Sprite Fusion (Hugo Duprez, MIT) и Hollow Crown (MIT) — при вендоринге копируйте `NOTICE.md` рядом.
Шрифт Patch Pixel в `gallery/fonts` **не** покрыт лицензией — не тащить.

---

## 2. Модель: два буфера, локальные координаты, детерминизм

- **`color`** — обычные пиксели: непрозрачные, дизеренные (`p.dot`) или реально полупрозрачные (`p.blend`, `p.disc`).
- **`light`** — аддитивное свечение, складывается поверх. «Горячее выглядит горячим» именно из-за него.
- **Локальные координаты.** `(0,0)` — якорь: ступни персонажа, точка удара, основание факела, дуло.
  X вправо, Y вниз, 1 единица = 1 px. Направленные эффекты смотрят вправо (влево — `flip`).
  Наземные эффекты стоят на `y = 0`; кольца на полу — сплюснутые эллипсы (`band(..., sy=0.16)`).
- **Масштаб отсчёта:** стоковый персонаж 24×38 px, детали читаются на 1 px. Канвас 96–320 px.
- **Детерминизм.** Никаких `Math.random()`/`Date`. Всё через `Rng(o.seed)`; кадр 40 всегда одинаков.
  Это же даёт возможность делать скриншот-эталоны для QA.

Два вида эффектов:

| вид | контракт | когда |
|---|---|---|
| **pure** (чистый) | `export function draw(p, t, o)` (+ `drawBack`), кадр = функция времени | циклы (ауры, порталы, водопады, криттеры, погода), дуги, лучи |
| **simulated** (симулируемый) | `export function create(o)` → `{ update(dt), draw(p), drawBack?(p) }` | одноразовые: удары, взрывы, заклинания, искры/дым/обломки |

Рантайм прогоняет `update` шагами по **120 Гц**, поэтому физика одинакова при 30 и 144 fps.
Одноразовый эффект обязан **рисовать пустоту при `t = duration`** (последний дым успевает рассеяться);
цикл обязан стыковаться без шва.

---

## 3. Рантайм API (проверено на 0.3.0)

```js
import { createFrame, clearFrame, createFx, createAct, composite } from "./pixelfx/core/index.js";
import * as frostNova from "./pixelfx/fx/ice/frost-nova.js";
```

```js
const frame = createFrame(320, 180);         // разрешение ИГРЫ в пикселях-арте, не CSS-пиксели
const img = new ImageData(320, 180);         // переиспользуем, НЕ создаём каждый кадр

const fx = createFx(frostNova, {
  x: 160, y: 140,        // точка-якорь в мировых координатах
  flip: false,           // зеркало по X
  angle: 0,              // поворот, радианы
  seed: 4,               // другой «дубль» того же эффекта
  light: 1,              // множитель свечения (0.2–0.5 если «засвечено»)
  palette: undefined,    // рампа цветов, тёмный → яркий; любая длина (ресемплится)
});

function tick(dt) {
  fx.update(dt);                       // шагает симуляцию (120 Гц внутри)
  clearFrame(frame);
  fx.draw(frame, "back");              // то, что за персонажем
  drawCharacters();                    // ваши спрайты
  fx.draw(frame, "front");             // то, что перед персонажем
  composite(frame, img.data, 0xFF201818); // color + light → RGBA; null = прозрачный фон
  ctx.putImageData(img, 0, 0);         // потом апскейл канваса с image-rendering: pixelated
  if (fx.done()) removeFx(fx);         // одиночные заканчиваются сами; цикл гасится fx.stop() (фейд 0.3 с)
}
```

Точные сигнатуры:

- `createFrame(w, h, ox = 0, oy = 0)` → `{ w, h, ox, oy, color: Uint32Array, light: Uint32Array }`.
  **`ox/oy` — это камера**: `Painter.put()` вычитает их, т.е. `frame.ox` — левый верхний угол окна в мире.
  Для скроллящейся камеры: `frame.ox = Math.floor(camX - w / 2)` (целые числа — см. ловушку с дизером).
- `createFx(mod, o)` принимает **namespace модуля** (`import * as mod`), а не функцию: внутри читаются `mod.meta`,
  `mod.create`, `mod.draw`, `mod.drawBack`.
- `fx.meta`, `fx.options`, `fx.t`, `fx.update(dt)`, `fx.draw(frame, "front"|"back")`, `fx.stop()`, `fx.done()`.
- `composite(frame, out, bg = null, lightK = 1)`; `bg` — `null` (прозрачно), число-цвет (`0xAABBGGRR`,
  т.е. обычный `0xRRGGBB` без альфы даст перепутанные каналы) или `Uint32Array` фона в том же порядке.
  На прозрачном фоне свет превращается в цвет с альфой (читается аддитивно на тёмной сцене).
- Несколько эффектов могут рисовать **в один и тот же `frame`** — это и есть смысл общего формата
  (`{ w, h, ox, oy, color, light }`, как у Sprite Fusion VFX).

Настройки эффекта — `meta.options` + переданное: `size`, `count`, `radius`, `reach`, `text`, `height`…
Зарезервированы `x, y, flip, angle, light`. Любая «рампа» опций ресемплится через `fit()`, поэтому
передать палитру другой длины безопасно.

### Готовые палитры

`PAL` из `color.js`: fire ember lava smoke dust ice water electric volt poison holy heal arcane shadow
blood earth stone gold leaf wood metal bone neon cyber matrix candy night. Синий огонь =
`{ palette: PAL.ice }`. Хелперы цвета: `fit ramp at blend mix scale hex rgb luma WHITE`.

### Painter (кратко; полная таблица — `docs/AUTHORING.md`)

| вызов | что рисует |
|---|---|
| `p.px(x,y,c)` / `p.dot(x,y,c,a)` | пиксель: твёрдый / дизеренный по 4×4 Bayer |
| `p.blend(x,y,c,a)` | пиксель с настоящей прозрачностью |
| `p.disc(x,y,r,c,a)` | полупрозрачный диск (дым, пар, туман) |
| `p.line/beam/polyline` | линия 1 px / толстая капсула / ломаная |
| `p.circle ellipse ring rect poly tri arc` | фигуры; цвет и альфа могут быть функциями координат |
| `p.shade(x0,y0,x1,y1,fn)` | попиксельный шейдер (`out.c out.a out.l out.k`) |
| `p.glow / glowLine / glowRing / light` | аддитивный свет |
| `p.sprite(rows, pal, x, y, opts)`, `p.text(...)`, `p.mask/outline`, `p.get(x,y)` | спрайты из строк, пиксельный текст (mini 3×5, big 5×7), силуэты |

---

## 4. Интеграция в игру

### 4.1 Canvas / Phaser / PixiJS

Вендорить `src/core` + нужные файлы эффектов (всё ESM, без сборки и зависимостей), либо
`npm i github:patch-gg/pixelfx`. Для Phaser эффекты рисуются **не** через спрайты, а в отдельный
pixel-buffer-слой поверх/под сценой: один `createFrame` на разрешение игры, `putImageData` в offscreen-canvas,
этот canvas — текстура одного `Image`/`add.image` с `image-rendering: pixelated`.

Правила, которые экономят часы:

1. **Рисуйте в разрешении игры** (например 320×180 или 480×270) и апскейльте целым множителем
   (`imageSmoothingEnabled = false`). Пиксель-арт не терпит дробного масштаба и `devicePixelRatio`.
2. **Один общий `frame` и один `ImageData`** на всю игру; `clearFrame` между кадрами. Создание
   `ImageData` каждый кадр — это GC-паузы на телефоне.
3. `frame.ox/oy` двигайте **целыми** числами (`Math.floor` камеры): дизеринг альфы считается в экранных
   координатах, и дробный скролл заставит полупрозрачные края «шипеть».
4. `draw(frame, "back")` → персонажи → `draw(frame, "front")`: половина эффектов имеет дальнюю/ближнюю часть.
5. Слои света: если сцена светлая, аддитивное свечение выжигает детали — уменьшайте `light` (0.2–0.5)
   или рендерите эффекты на отдельный тёмный слой.
6. `image-rendering: pixelated` на CSS-канвасе; `context.imageSmoothingEnabled = false` при апскейле.

### 4.2 Спрайт-шиты для любого движка (и для мобильного перфа)

```bash
node tools/render.mjs ice/frost-nova --sheet     # -> records/ice/frost-nova/frost-nova.png + .json
node tools/render.mjs fire --sheet               # целая категория
node tools/sheets.mjs                            # вся библиотека в sheets/
```

JSON — формат Aseprite (массив кадров: `frame`, `spriteSourceSize`, `sourceSize`, `duration`) плюс
`meta.pixelfx = { id, name, fps, loop, frames, frameSize, pivot, columns }` и `meta.frameTags`.
Pivot — это `meta.origin` эффекта (например ступни), его и ставьте в `setOrigin`.

Phaser 3. Формат шита совместим с Texture Packer (JSON-Array: `frames` массивом, `filename`/`frame`/
`trimmed`/`spriteSourceSize`/`sourceSize` на месте), поэтому `this.load.atlas` читает его без плагинов
(Aseprite-лоадер из ядра выпилен в 3.60). Более того, парсер Phaser копирует все ключи JSON, кроме `frames`,
в `texture.customData` — значит `meta.pixelfx` (fps, loop, frameSize, pivot, columns) доступен сразу после
загрузки, второй запрос за JSON не нужен. Проверено прогоном `Parser.JSONArray` из Phaser на реальном
выводе `tools/render.mjs`:

```js
preload() {
  this.load.atlas("fx-frost", "assets/fx/frost-nova.png", "assets/fx/frost-nova.json");
}

create() {
  // глобально лучше один раз в конфиге игры: render: { pixelArt: true, antialias: false }
  this.textures.get("fx-frost").setFilter(Phaser.Textures.FilterMode.NEAREST);
  const meta = this.textures.get("fx-frost").customData.meta.pixelfx;
  const names = Object.keys(this.textures.get("fx-frost").frames)
    .filter((n) => n !== "__BASE")
    .sort((a, b) => parseInt(a.split(" ").pop(), 10) - parseInt(b.split(" ").pop(), 10));

  this.anims.create({
    key: "fx-frost",
    frames: names.map((frame) => ({ key: "fx-frost", frame })),
    frameRate: meta.fps,          // 30
    repeat: meta.loop ? -1 : 0,   // одноразовые играются один раз
  });
}
```

```js
// метод сцены: шаг сетки арта -> экранных пикселей
const ART_SCALE = 4;               // ЦЕЛОЕ число: 1 арт-пиксель = 4 экранных

playFx(key, x, y) {
  const meta = this.textures.get(key).customData.meta.pixelfx;
  const [px, py] = meta.pivot, [fw, fh] = meta.frameSize;
  const spr = this.add.sprite(x, y, key)
    .setOrigin(px / fw, py / fh)   // якорь = ступни / точка удара, а не центр кадра
    .setScale(ART_SCALE)
    .play(key);
  spr.once("animationcomplete", () => spr.destroy());
  return spr;
}
```

Если `customData` пуст (старый Phaser < 3.60) — грузите JSON отдельно (`this.load.json(key + "-meta", url)`)
и берите `cache.json.get(key + "-meta").meta.pixelfx`.

При `setOrigin` по pivot и `setScale`, дающем целое число экранных пикселей на арт-пиксель, картинка не мылится.
Свечение в шите «запечено» в цвет с альфой — на тёмной сцене читается аддитивно; на светлой
рендерите эффект на отдельный слой или делайте реколор-версию.

### 4.3 «Удар без тела — это стикер»

Стоковый манекен 24×38 в pixelfx — заглушка для превью. В игре вместо него ваш персонаж, но **тайминг
удара берётся из эффекта**:

```js
import { actTiming } from "./pixelfx/core/index.js";
const T = actTiming(slashModule);
// { windup, recovery, hits: [{ t, freeze, shake, amp, push, skin, at }], poses, onBody, targets }
```

- `windup` секунд — заранее запустить анимацию замаха своего персонажа.
- перед `hits[i].t` — попасть эффектом по цели.
- `freeze` секунд — **hit-stop**: остановить обновление всей сцены (эффекты, физика, анимации, таймеры).
  0.03–0.06 с для лёгких, 0.1–0.2 с для тяжёлых ударов. Это самое дешёвое «мясо» в игре.
- `shake`/`amp` — тряска картинки (сдвиг всего рендера, не камеры-физики).

```js
let freeze = 0;
function update(dt) {
  if (freeze > 0) { freeze -= dt; return; }       // весь мир стоит
  ...
  if (hitLands) freeze = hit.freeze;
}
```

Хочется с телом: `createAct(mod, {x, y})` вместо `createFx` — он сам держит паузу, трясёт и роняет цель;
`node tools/act.mjs <id>` показывает акт пошагово на 12 fps (движение на контакт-шите не видно!),
`node tools/act.mjs <id> --sheet` запекает акт целиком (тело + target) в шит.

### 4.4 Производительность на телефоне

- `node tools/check.mjs <id>` держит планку **< 2 мс на кадр** на эффект. Не гоняйте больше 3–6
  одновременных тяжёлых эффектов; массовые попадания (10+ искр) — это один эффект, а не десять.
- **Дорог не рендер, а `putImageData`**: он декодирует и заливает RGBA каждый кадр. Один буфер на игру,
  один вызов на кадр, маленькое разрешение (320×180 = 57 600 px). Если и этого много — запеките популярные
  эффекты в шиты (GPU-батчинг, ноль JS-работы) и оставьте живой рендер только для «уникальных» случаев
  (эффект следует за движущейся целью, цвет зависит от инстанса).
- Световой буфер — второй проход по всем пикселям. Отключайте его (`light: 0`) в самых дешёвых местах
  или снижайте разрешение эффектов на слабых устройствах.
- `check.mjs` ловит: выход за канвас, одноразовые, не заканчивающиеся пустотой, швы циклов,
  незернированную случайность, медленные кадры.
- Дизеренная альфа против настоящей: `p.dot` даёт «пиксельный» фейд (и мигает при дробном скролле),
  `p.blend/p.disc` — плавный, но дороже в шите (полупрозрачные пиксели). Для мобильных шитов
  предпочитайте `p.dot` для краёв и `disc` только для дыма.

---

## 5. Как делать свои эффекты (метод)

```bash
git clone https://github.com/patch-gg/pixelfx
node tools/render.mjs fire/torch                 # records/fire/torch/contact.png — «глаза»
node tools/list.mjs frost                        # сначала ищем готовое
node tools/new.mjs arcane/my-spell [--loop]      # рабочий каркас
node tools/render.mjs arcane/my-spell --zoom 3 --mp4   # движение, не сэмплы
node tools/act.mjs arcane/my-spell               # акт, 12 fps шагами
node tools/check.mjs arcane/my-spell             # чисто или нет
```

Цикл: **сказать одной фразой с арт-дирекшеном → найти 2–3 ближайших референса и прочитать их код →
черновик (3–5 разных, если направление открыто) → рендер → смотреть как придирчивый пиксель-артист →
чинить худшее → снова рендер**. Минимум три круга; витринные эффекты — больше.
Бенчмарк: поставьте рядом эффект Hugo Duprez того же размера — если у него больше деталей/света/жизни, работа не закончена.

### Планка качества (10 пунктов, сокращённо)

1. **Линии и свет, не заливки.** 1 px рёбра, кольца, трейлы, искры; яркость несёт свет. Белый —
   только самое горячее ядро, тонированная середина, глубокий цвет в тени.
2. **Свет везде:** большое мягкое пятно на малом `k`, тугое горячее в ядре, свет на каждой искре,
   `Lights` вспыхивают в момент удара и гаснут, свет по дугам и лужам на полу.
3. **Полупрозрачные объёмы** — `SMOKE/VAPOUR/DUST/p.disc`, подсвеченные сверху и раздувающиеся.
   Никогда не «шахматка» из дизера вместо дыма.
4. **Настоящее движение:** искры вытягиваются по скорости, падают и отскакивают; обломки кувыркаются
   и оседают; огонь поднимается и превращается в дым; приземление поднимает пыль; drag = быстрый выброс, медленный дрейф.
5. **Хореография фазами:** антиципация/заряд (собирается внутрь) → релиз (1–2 белых «геройских» кадра,
   вспышка, свет, выброс) → разлёт → удержание (мерцания, блики, угли) → распад/таяние → долгое затухание.
6. **Глубина:** кольца на полу — сплюснутые эллипсы, дальняя половина за персонажем, ближняя перед.
7. **Тайминг:** быстрая атака, медленный релиз. Большие эффекты живут 2–4 с, удары — 0.3–0.8 с, но с follow-through.
8. **Читается в 1×**: один фокус, без спекл-шума внутри форм.
9. **Оригинальность:** общие мотивы можно, конкретные спрайты/логотипы чужих игр — нельзя; эффекты Hugo
   не копировать целиком (техники — да).
10. **Чистота:** влезает в канвас, заканчивается пустотой или стыкуется, детерминирован, < 2 мс/кадр.

### Частые болезни и лечение

| видно | лечить |
|---|---|
| в 1× каша | меньше цветов, чёткий силуэт, один фокус, формы крупнее |
| спекл (одинокие шумные пиксели) | ниже порог шума, квантовать через `at()`, без шума на мелких формах |
| «ватно», нет удара | быстро внутрь, медленно наружу (`ease.outQuart/outExpo`), 1–2 белых кадра, короче общее время |
| деревянно | разнообразить каждую частицу (размер/скорость/задержка/жизнь), вторичное движение |
| выцветание | меньше glow (`k` 0.2–0.5), темнее шаги края, белый только в ядре |
| плоско | свет с одной стороны: светлее верх-лево, темнее низ-право; тёмный шаг рампы у основания |
| векторный градиент | жёсткие шаги рампы в цвете; мягкость только в свете и полупрозрачном дыме |
| шов на цикле | `cycle`, `loopNoise(phase)`, целоклеточные прокрутки `tileNoise`, `sin(phase*TAU*n)` |
| одноразовый «щёлкает» и исчезает | пусть сожмётся, дизерится или упадёт до `t = duration` |
| эффект есть, персонаж мёртв | дать акт: замах, релиз-поза, freeze на контакте, реакция цели, восстановление |

### Каркас эффекта

Ниже — рабочий каркас: он проходит `node tools/check.mjs` без предупреждений, а контакт-шит показывает
вспышку → разлёт искр → оседание → пустоту в конце. Проверено на pixelfx 0.3.0.

```js
export const meta = {
  name: "Spark pop", desc: "Sparks burst out of a hot core and settle, lit by a flash at the impact.",
  tags: ["impact"],
  size: [160, 112], origin: [80, 84],   // origin — якорь в пикселях канваса; поля с запасом под разлёт
  duration: 1.2, loop: false, fps: 30, bg: "ground",
  actor: 2,                             // только для превью: рисует стоковый манекен. В игре не нужен.
  options: { palette: ["#151a3d", "#2c58aa", "#62c8f4", "#f2fdff"], seed: 1 },
};

export function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0 }), lights = new Lights();
  lights.add(0, -12, 40, C[4], 0.7, 0.4);
  for (let i = 0; i < 40; i++) {
    const a = R.range(0, Math.PI * 2), sp = R.range(80, 260);
    ps.spawn(P.SPARK, 0, -12, Math.cos(a) * sp, Math.sin(a) * sp - 60, R.range(0.2, 0.6));
  }
  let t = 0;
  return {
    update(dt) { t += dt; ps.update(dt); lights.update(dt); },
    draw(p) {
      if (t < 0.12) sparkle(p, 0, -12, 9 * (1 - t / 0.12), C[5], C[3]);
      ps.draw(p); lights.draw(p);
    },
  };
}
```

Тулкит `sim.js`: `Particles/P/PF` (SPARK, MOTE, STREAK, FLAKE, VAPOUR, DUST, SMOKE, FIRE, BRAND, GRIT,
EMBER, STAR), `Bits/B` (SHARD, CHUNK, DRIP), `Lights`, `Blazes`, `sparkle`, `flare`, `band`, `crystal`;
`GRAVITY = 950 px/s²`. У Hugo в коде мировые единицы 2 на пиксель — скорости, дистанции и гравитацию делить на 2.

При адаптации конкретного рецепта из файла Hugo — двухстрочный кредит в начале своего файла
(`// adapted from Sprite Fusion's open-source <name> … MIT License, Copyright (c) 2026 Hugo Duprez.`).

---

## 6. Ловушки (проверено)

1. **Разные системы координат.** Спрайт-канвас в CSS-пикселях ≠ пиксель-арт. Всегда цепочка
   `мир → арт-пиксель (integer) → экран (целый множитель)`; никакого `devicePixelRatio` в арт-слое.
2. **`ox/oy` — камера**, а не смещение эффекта. Двигайте целыми числами, иначе дизер «шевелится».
3. **`createFx` получает namespace модуля**, не функцию. `import * as mod` — обязательно.
4. **Не мутируйте общий `frame` без `clearFrame`**: цвет `0` не стирает, а «не рисует» — старые пиксели останутся.
5. **Одноразовые должны заканчиваться** (`duration` с запасом на последний дым) и не «щёлкать»; `fx.done()`
   вернёт `true` само, но объект из массива надо убрать руками.
6. **Циклы гасятся `fx.stop()`**, а не удалением — иначе пропадёт фейд 0.3 с.
7. **Hit-stop не должен останавливать сам таймер паузы** (иначе залипнете) и не должен останавливать
   ввод — только мир.
8. **Свет и яркие сцены** несовместимы: аддитивка на светлом фоне выжигает цвет, нужен тёмный слой или `light < 1`.
9. **Шиты теряют интерактивность:** реколор/`flip`/`angle`/`seed` доступны только у живого рендера.
10. **Не тащить `gallery/`, `records/`, `node_modules`, `assets`** в репозиторий игры — только `src/core`,
    нужные эффекты, `NOTICE.md`/`LICENSE`, сгенерированные шиты в `assets/`.
11. **Не «улучшать» эффект вслепую**: любой правке предшествует контакт-шит или mp4. Иначе получите
    красивый код, который на экране — каша.

---

## 7. Как это встроить в workflow arena-game-forge

- **Discovery:** пиксель-арт VFX — это выбор стиля; зафиксируйте в контракте разрешение арт-слоя
  (например 320×180), целый множитель апскейла и «есть ли hit-stop».
- **Technical Director:** решите заранее — **живой рендер** (гибко, но `putImageData` каждый кадр) или
  **запечённые шиты** (дешево, но без рантайм-реколора). Чаще всего гибрид: шиты для частого (искры, пыль,
  подбор), живой рендер для редкого/уникального.
- **Builder:** вендорить `src/core` + выбранные эффекты, один общий `frame`, слой back/front вокруг персонажей,
  `actTiming` → hit-stop в глобальном апдейте.
- **QA:** `node tools/check.mjs <категории>` в CI; контакт-шиты и mp4 — визуальные evidence-файлы для
  quality gates; скриншоты стабильны благодаря seed. Проверяйте на реальном телефоне: `putImageData`
  и свечение — первые кандидаты в бюджет кадра.
- **Release:** `LICENSE`/`NOTICE.md` рядом с вендоренным кодом; шиты — в `assets/`, не в корне.
