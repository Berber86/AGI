# Handoff — 2026-10-17, «Голубой риф VR»

## Role / phase

- **Role:** Builder → QA (последовательно, один агент)
- **Phase:** qa
- **Current task:** вертикальный срез игры собран и проверен автоматически;
  остаётся живая проверка на телефоне и в очках.

## Completed

- Брейншторм из 3 этапов записан и утверждён (`discovery.json`, `BRAINSTORM.md`),
  контракт зафиксирован в `game.json`.
- Игра собрана: стереопара без WebXR, обзор по камере-меткам, подводный мир.
- Портирован трекер меток из Candy Kingdom Coaster (сущность 0.15 с, форма,
  пара, пространственная модель) без жестов MediaPipe.
- Мир: песчаное дно, 6 типов кораллов и травы, 9 видов рыб (297 на максимуме),
  горбатый кит 11.5 м, поверхность воды с окном Снелла, столбы света, взвесь,
  пузырьки.
- PWA: манифест, иконки, service worker с раздельными кэшами кода и медиа.
- QA-наборы и численный аудит кадров.
- Карточка игры в корневом `index.html` витрины + обложка `cover.webp`;
  переход из витрины проверен набором `rootqa`.

## Changed files

- `games/blue-reef-vr/**` — новая игра (index.html, styles.css, src/*, sw.js,
  manifest.webmanifest, assets/*, vendor/three, tests/tools/*, tools/*).
- `games/blue-reef-vr/.studio/**` — контракт, отчёты, снимки.
- `index.html` (корень репозитория) — карточка игры в витрине.
- `games/blue-reef-vr/cover.webp` — обложка 1280×720 для витрины.

## Verification

| Проверка | Результат | Evidence |
|---|---|---|
| `node vrqa.mjs` | 26/26 | `.studio/evidence/reports/vrqa.json` |
| `node camqa.mjs` | 24/24 | `.studio/evidence/reports/camqa.json` |
| `node sceneqa.mjs` | 15/15 | `.studio/evidence/reports/sceneqa.json` |
| `node pwaqa.mjs` | 8/8 | `.studio/evidence/reports/pwaqa.json` |
| `node audit.mjs` | 7 кадров, 0 ошибок консоли | `.studio/evidence/reports/visual-audit.json`, `screenshots/audit/*` |
| `node rootqa.mjs` | 8/8 | `.studio/evidence/reports/rootqa.json` |
| Статика | без сборки, относительные пути | ручная проверка под путем `/games/blue-reef-vr/` |

## Decisions

- Гироскоп не используется никогда: только метки и режим «прямо».
- Потеря метки — удержание угла, без автопана и без возврата к центру.
- Пресеты качества только ручные: игра сама не ухудшает картинку.
- Тени отключены: под водой их заменяет рассеянный свет, а стереопара
  удваивала бы стоимость теневой карты.
- Текстуры и геометрия — процедурные: в репозитории нет медиа-ассетов.

## Blockers and known risks

- Живого устройства нет: FPS, нагрев, оправа очков, освещение и реальные коробки
  не проверены. Статус поля — `not device-tested`.
- Камера требует HTTPS: на http-домене метки не заработают.
- Снимки сделаны на программном GL (SwiftShader): они доказывают, что сцена
  рисуется, но не доказывают производительность.

## Exact next action

Прогнать игру на реальном телефоне в очках: калибровка двух коробок, диапазон
поворота, FPS на пресетах «Сбалансированно» и «Плавно», частота потери метки.

## Run / preview instructions

```bash
# из корня репозитория
python3 -m http.server 8899
# http://127.0.0.1:8899/games/blue-reef-vr/index.html
# QA: bash games/blue-reef-vr/tests/tools/bootstrap.sh, затем в /home/user/tools:
# node vrqa.mjs && node camqa.mjs && node sceneqa.mjs && node pwaqa.mjs && node audit.mjs
```
