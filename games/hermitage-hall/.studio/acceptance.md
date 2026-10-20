# Приёмка

Каждая строка — из `game.json` → `acceptanceCriteria`. Статус: `pass`, `fail`, `not-tested`.

| Критерий | Статус | Чем подтверждён |
|---|---|---|
| Взгляд на медальон копит 10 ± 0,3 с и переносит на точку | pass | `evidence/reports/e2e.json`: 9,98 с; `tests/logic.test.js` |
| В обычном режиме перенос — плавный проход, в VR — золотая вспышка | pass | `tests/logic.test.js`, кадр `evidence/screenshots/final/vr-stereo.jpg` |
| В VR-режиме в DOM нет HUD, прицела и кнопок | pass | e2e «в VR нет HUD»; `body.vr` в `src/styles.css` |
| Все шесть картин в разрешении ≥ 1200 px по длинной стороне | pass | e2e: 2560×1719, 2560×1691, 1689×2200, 1708×2200, 2200×1776, 2200×1742 |
| Девять точек достижимы, камера стоит точно в координате | pass | e2e: прибытие ±0,000, все точки внутри зала |
| Свайп управляет взглядом без гироскопа | pass | e2e: `source: touch` |
| Стереопара рисует оба глаза на весь экран | pass | e2e: left/right непустые, 1280×720 |
| Нет ошибок консоли; production-сборка работает из подкаталога | pass | 26/26 на `:8902/games/hermitage-hall/play/` |
| PWA: манифест, иконки, раздельные кэши кода и медиа | pass | `tests/test_game_catalog.py`, `play/sw.js`, `play/manifest.webmanifest` |
| Живой телефон: знак гироскопа, FPS, яркость в линзах | not-tested | нет устройства в песочнице; см. README |

Последний полный прогон: 2026-10-21, `E2E: 26/26 проверок, ok=true`,
`npm test` — 19/19, `python3 -m unittest tests.test_game_catalog` — 10/10.
