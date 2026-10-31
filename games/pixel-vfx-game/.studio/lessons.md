# Lessons

Record only evidence-backed lessons.

## Template

- **Context:**
- **Symptom:**
- **Root cause:**
- **Fix:**
- **Validation:**
- **Workflow change:**

## 2026-10-31 — Лесной огонь

- **A multiplicative night destroys pixel art.** Multiplying the framebuffer by a 0..1 factor only ever darkens, so the "lit" area looks like the same muddy ground with the lights turned down. The fix was to *add* warm light into the light buffer inside the fire and lantern radius, and to quantize the falloff into five dithered bands instead of one smooth gradient.
- **Never post-process the HUD.** Text drawn into the same buffer as the world was dimmed to 10% outside the light. Two passes (world → night → UI over the top) fixed the title screen and the score at once.
- **A dithered white hit flash turns a creature into a white blob.** Keep the outline palette index dark and map only the body to white; the silhouette stays readable.
- **Author frames in Node, not in the browser.** `npx vite-node scripts/sheet.ts` writes 1:1 PNGs of real game states in under a second; the browser adds letterboxing, DPR scaling and SwiftShader latency that hide art bugs.
- **Phaser's `Scene.renderer` is taken** — a field with that name collides with the base class type. Use `view`.
- **`networkidle0` never settles with a service worker** that precaches the shell: navigate with `domcontentloaded` and wait for an explicit ready flag.
- **`as const` CONFIG leaks literal types** into class fields (`heroX = CONFIG.fireX` becomes the literal 160) and breaks the first assignment. Annotate numeric fields explicitly.
- **The fire is solid.** Without a push-out radius the hero stands inside the flames while banking, which read as one bright blob and hid both sprites.

## 2026-10-31 · «Готово» без карточки в каталоге — не готово

Игра собиралась и е2е-проходила, но в общем каталоге её не было: пользователь нашёл это первым. Выпуск теперь не закрывается без пути `games/<slug>/play/` + карточки в корневом `index.html` + тестов в `tests/test_game_catalog.py`, и я прогоняю браузерную проверку «клик по карточке → игра готова» до коммита.
