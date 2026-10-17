# Lessons

Record only evidence-backed lessons.

## Template

- **Context:**
- **Symptom:**
- **Root cause:**
- **Fix:**
- **Validation:**
- **Workflow change:**

## 2026-10-14 — White Night QA findings
- When Escape closes an inspection and opens a native dialog in the same keydown, the native default can immediately close the new dialog. preventDefault before the transition; desktop regression passed.
- A portrait min-height on the app can silently push landscape controls below the viewport. Remove the minimum on short landscape and assert both scrollWidth and scrollHeight; 844×390 touch regression passed.
- @sparticuz/chromium needs its al2023 archive unpacked and LD_LIBRARY_PATH set outside Lambda. tests/browser.mjs restores it from the local npm package without apt.
- Normalize indexed/non-indexed geometry before merging static material batches. Cache inspected models/thumbnails to bound GPU growth; repeated inspection resource counts remained stable in production E2E.

## Catalog entry is part of integration
A working isolated game preview is not enough when the repository already has a game launcher. Verify the real root card-to-game path on ordinary static hosting. Regression coverage: tests/test_game_catalog.py and games/white-night/tests/catalog.mjs, including /AGI/ deployment prefix, cover, WebGL boot, search, keep, reload and no HTTP errors.

## Visual v2 findings
- Split color, normal and roughness maps; data textures must use NoColorSpace. Generated PBR maps are approximations, not calibrated scans.
- Transparent decals/glass must be omitted from SSAO normal/depth; otherwise their rectangular planes occlude geometry incorrectly.
- Newly detailed static pieces should be merged by material. Cache models and thumbnails; E2E confirmed stable resource counts across repeated inspections.
- Readability beat physically expensive optical transmission for thin watch covers. Dial print stays legible using a basic printed surface under a thin reflective coat; real transmission retained only where it visibly helps bottle/flacon glass.
- Ornamental lines on a lathed cup must follow the actual radius profile, not a loose 3-point spline that falls inside the porcelain. Final targeted production capture verifies the repair.
- Raw frame timing must not reuse capped animation dt. Rendering is skipped for idle courtyard/reduced-motion states; software GPU timings remain explicitly non-device evidence.

## 2026-10-15 — Thumbnail output must be display encoded
`readRenderTargetPixels` from a linear render target is not a ready-to-display PNG. Directly writing those bytes into Canvas produced near-black backgrounds and clipped lighting. Render miniature HDR to a HalfFloat target, then use Three OutputPass (the same ACES + sRGB output transfer as the main composer) into an unsigned-byte target before readback. Keep the OutputPass persistent, dispose both temporary targets, and restore parent/position/scale/rotation/renderer state in finally. Add a corner-pixel regression test: linear bytes (4,8,12) must not be accepted as the display background.

Perspective framing must reserve UI space and account for the frontmost depth of rotated bounds; normalize-by-largest-dimension alone cannot handle portrait width or watch straps. Puppeteer changes to isMobile can reload the page: wait for the test bridge after viewport changes.

## 2026-10-15 — Verify actual silhouette pixels, not just timeline labels
A reveal-phase UI test alone passed while the geometry overlay was misaligned: item meshes live under a centered/scaled group, not directly under the root. Build each reused silhouette mesh with `inverse(item.matrixWorld) * source.matrixWorld`. Inspect intermediate images and assert lens-region pixels actually darken. Sharp `.stats()` measures the input: materialize the crop with `.toBuffer()` before statistics. Frozen test-clock captures must stop the RAF renderer too, otherwise normal-motion SwiftShader wastes CPU indefinitely. Run expensive software GPU regressions sequentially rather than overloading the two-core sandbox. Earlier interrupted runs are not final-release evidence.

Book corner deformation was reverted at final review: RoundedBoxGeometry has sparse interior planar vertices, so a nonlinear warp can lift the cover through its title decal even when the decal is tessellated. Keep the authored edge rubs and legible gold print instead of forcing the bend. The title pixel ROI excludes the border to prevent a false positive.

## 2026-10-15 — Multi-angle framing and resize gates
A fit computed once for the authored pose is unsafe after rotation: re-fit current Euler bounds before applying user zoom. Camera-relative lights must follow the item stage, especially when it shifts left in landscape. Underside print planes need +PI/2 normals to face negative Y; bottle print must lie outside its glass base. Native buttons in the pointer-transparent inspection overlay need explicit pointer-events:auto. Puppeteer setViewport can resolve before the native resize listener updates the camera; await the expected stage-bottom before synchronous scripted searches. The initial interrupted pose run exposed this harness race, not a successful release.

The pose matrix then exposed a real off-axis perspective bug on watch/top in landscape: half-stage fitting ignores how near-depth corners shift toward the viewport edge in a left-aligned stage. Fit against the most distant viewport-relative stage edge per axis. Added a projected eight-corner unit regression and the actual viewport width to fitScale.

## 2026-10-15 — «Двор-колодец» is an idiom, not a prop

- **Context:** Visual audit of «Белая ночь» (iteration 12 of the v6 graphics pass).
- **Symptom:** The audit reported "the promised courtyard well is missing" and a literal stone well with a bucket and canopy was built into the courtyard.
- **Root cause:** The audit read the Petersburg idiom «двор-колодец» literally. It names a courtyard enclosed by facades like a well shaft — which the scene already was. A text premise was treated as a missing 3D asset without checking what the term means.
- **Fix:** Removed `addCourtyardWell` entirely at the author's direction; kept the unrelated iteration-12 work (puddles, portrait reframing, bin-anchored callout). The audit closure table now marks the finding as a false positive.
- **Validation:** Fresh `audit-look` frames (search 412/1280) show the enclosed courtyard with no well; unit tests 20/20.
- **Workflow change:** When an audit claims a "promised" element is missing, verify the term's meaning in the work's own context before modelling it. Idioms, titles and metaphors in a premise are not asset lists.

## 2026-10-16 — VR-поездка: «тормозит» — это удвоение сцены плюс дубль теневого прохода

- **Context:** Полевой отчёт по VR-режиму Candy Kingdom Coaster («всё работает, но очень тормозит») после добавления стереопары, камеры-метки и внешнего джойстика.
- **Symptom:** В очках кадры 15–25 к/с и рывки в первые секунды заезда; обычная игра терпима.
- **Root cause:** (1) стереопара рисует сцену целиком дважды без снижения геометрии (260–540 draw call'ов и 0.6–1.9 млн tri на вид) — контракт `auto_light` был реализован только как pixelRatio; (2) `renderer.render()` вызывается на каждый глаз, а `WebGLShadowMap` в three.js r166 при `autoUpdate=true` перерисовывает теневую карту при каждом вызове → карта 2048² и ~100 draw call'ов считаются дважды за кадр; (3) `QualityGovernor.apply()` перезаписывает VR-pixelRatio (1.5 → 2.0/1.4/1) и при переходе уровня уничтожает теневую карту и меняет варианты шейдерных программ — отсюда рывки; (4) `antialias: true` включает MSAA только на VR-пути (composer-таргеты без сэмплов).
- **Fix:** сначала зафиксирован как аудит `VR_PERF_AUDIT.md` с ранжированными правками (F1–F6); затем внедрены F1–F3 и удалён гироскоп (см. запись 2026-10-17 ниже), F4–F6 остаются открытыми.
- **Validation:** детерминированные счётчики (draw calls, теневые проходы, треугольники, пиксели) через `tests/tools/vrperf.mjs` и `tests/tools/vrtri.mjs`; сырые числа в `.studio/evidence/reports/vr-perf-audit.json`. Время кадра в software-GL намеренно не использовано как доказательство.
- **Workflow change:** для тяжёлых режимов (стерео, второй проход, камера) сначала считать draw calls/проходы, а не мс: счётчики переносятся на телефон, а мс SwiftShader — нет.

## 2026-10-17 — VR: тени один раз на кадр, VR-профиль качества, MSAA off, гироскоп убран

- **Context:** Внедрение F1–F3 из VR-перф-аудита плюс требование владельца убрать гироскоп (нет датчика, позыв — только камерой-меткой).
- **Symptom:** До правок на кадр стерео: 722 draw calls, 1.61 млн треугольников, теневая карта 2048² считалась дважды, губернатор посреди поездки менял pixelRatio (1.5 → 2.0/1.4) и пересоздавал теневую карту.
- **Root cause:** `renderer.render()` вызывается на каждый глаз, а `WebGLShadowMap` при `autoUpdate=true` перерисовывает карту при каждом вызове; VR-разрешение и уровень качества делили один и тот же регулятор; `antialias:true` доставался только пути, рисующему прямо в канвас.
- **Fix:** (F1) в `vr.render()` `autoUpdate=false` + `needsUpdate=true` на пару глаз с возвратом флага; (F2) `QualityGovernor.setVr()` — VR-профиль (1024²/PCF, уровень ≤ Medium, вверх не поднимается, pixelRatio не трогается), `world.setQuality(tier,{vr})` пересоздаёт карту только при смене размера, `governor.hold(3)` на входе; (F3) `antialias:false`; гироскоп удалён целиком (listener, `requestPermission`, кватернион ориентации), режим «Осматриваться» → «👀 Обзор сам»; `sw.js` → `ckc-v42`.
- **Validation:** `tests/tools/vrperf.mjs` 8/8 (один теневой проход на кадр, возврат `autoUpdate`, срез уровня, неизменность VR-разрешения при смене уровня, 1024²/PCF, MSAA off, восстановление настроек при выходе); замер: draw calls 722 → 619, треугольники 1.61 → 1.34 млн, теневых пикселей 8.39 → 1.05 Мпикс, MSAA-сэмплов 1.22 млн → 0. Приёмка `vrqa 20/20`, `camqa 29/29`, `remotqa 21/21`, `joystickqa 7/7`, `uiqa 24/24`, Python 15/15.
- **Workflow change:** Счётчики кадра (draw calls/проходы/пиксели) держать регрессией в том же инструменте, которым мерили: `vrperf.mjs` теперь падает с ненулевым кодом, если VR снова начнёт считать тени дважды или губернатор вернёт себе VR-разрешение.

## 2026-10-17 — Две метки: среднее «честной» и «чужой» дельты = съезд к центру
- **Context:** режим «По двум меткам» (`camera-dual`), угол пары = среднее двух индивидуальных дельт.
- **Symptom:** «уводишь взгляд в сторону — очень быстро возвращается к центру», при этом интерфейс показывает обе метки найденными.
- **Root cause:** дельта каждой метки считается от ЕЁ калиброванного места. Пятно чужого оттенка у центра кадра даёт для «правой» метки −17° (её место — справа), поэтому полусумма честной (+19.5°) и чужой (−10.4°) даёт +4.5° — размеренный съезд к центру. Сглаживание в `main.js` догоняет пропорционально разрыву (до 0.85/кадр), а ветка `camWasLost && jump>8` вообще переякоривает жёстко — отсюда «очень быстро».
- **Fix:** среднее только при согласии пары (≤6°); при противоречии — сторона с доверием; отсев мелких пятен; лимит 260°/с на скачок; после >900 мс потери — подтверждение вторым кадром.
- **Validation:** `dualtrace.mjs` (трасса по кадрам, 19.5° → 17.0° вместо старого среднего 4.5°), `camqa` 34/34 с 5 новыми проверками, остальные наборы без изменений.
- **Workflow change:** при жалобе «взгляд сам уезжает» первым делом смотреть, не смешиваются ли в одном числе измерения с разными базами; для камерных режимов держать QA-хук на ЦЕЛЬ взгляда до демпфирования (`camLook()`), иначе многоступенчатое сглаживание маскирует источник.

## 2026-10-17 — Камерный трекер: сначала физика кадра, потом эвристики
- **Context:** режим двух меток, третья итерация правил (после «среднего» и «доверия к сторонам»).
- **Symptom:** владелец: «драйвер должен понимать пространство, скорости и банальную логику… а не веровать в бесовщину по первому мороку».
- **Root cause:** правила были вероятностные (доверие, «ближе к прошлому кадру») и не использовали то, что метки закреплены в мире: порядок, расстояние, предсказуемое место и скорость головы.
- **Fix:** инвариант расстояния пары вместо свободного среднего; прогноз места по скорости за 2.5 с; оттенок за краем кадра игнорируется целиком; неожиданное принимается только вторым согласным кадром; докрутка после потери идёт со скоростью поворота.
- **Validation:** `camqa` 37/37 (шесть правил пары), `dualtrace` по кадрам: малиновое левее оранжевой — старое среднее −10.1° против честных 10.5°; оттенок за краем — среднее 13.7° против 35.5°; оценка скорости 21 °/с при реальных 20 °/с; докрутка 43.9° → 58.9° за секунду потери.
- **Workflow change:** в камерных тестах подавать кадры с реальным темпом (~90 мс): модель зависит от времени, и ленты, поданные за миллисекунды, делают оценку скорости мусором. В headless-стендах полагаться на `__TEST__.step()`, а не на requestAnimationFrame.

## 2026-10-17 — Камера: «сущность» метки и её форма важнее первого кадра
- **Context:** режим меток; после пространственной модели остались ложные срабатывания на коротких бликах и круглых предметах.
- **Symptom:** метка «появлялась на 0.1 с из небытия» и участвовала в ведении взгляда; круглый/вертикальный предмет того же оттенка считался меткой.
- **Root cause:** трекер верил первому кадру детектора; форма пятна вообще не измерялась (анализатор отдавал только центроид и площадь).
- **Fix:** сущность после 300 мс непрерывного наблюдения (идентичность 4 с); bbox/fill в анализаторе; горизонтальный прямоугольник с пропорциями относительно калиброванной формы; у края кадра — только заполненность; калибровка только по сущностям.
- **Validation:** `camqa` 42/42: 0.1 с — не сущность (взгляд стоит), 0.36 с — сущность; круг (aspect 1.02) и вертикальный прямоугольник (0.50) отброшены, горизонтальный (2.0) ведёт; одиночный режим — то же.
- **Workflow change:** в камерных QA-тестах подавать кадры с реальным временем или сдвигать часы явным хуком (`camAgeMarkers`/`camForgetMarkers`); headless иногда замирает на секунды, поэтому циклы подачи должны перезапускать окно наблюдения после длинного фриза, а не считать «7 кадров = 0.5 с».

## 2026-10-17 — «Тормоза после обновления» — это про сеть, а не про кадр
- **Context:** жалоба на тормоза сразу после очередного раунда правок (две метки).
- **Symptom:** игра «дёргается» после обновления, хотя в стационарной езде всё ровно.
- **Root cause:** PWA-кэш был одним версионным бакетом (87 файлов / 7.3 МБ), и каждая смена версии в `sw.js` перекачивала все медиа заново; загрузка совпадала с первым запуском.
- **Fix:** два кэша (код 1.47 МБ с версией, медиа 5.82 МБ без версии), precache по файлам с пропуском уже лежащего, порог полноты install, `/assets/` cache-first, музыка network-first.
- **Validation:** `updatecost.mjs`: обновление 1.47 МБ, 0 запросов к `/assets/`; `pwaqa` 4/4; `uiqa --offline` 26/26; стационарные метрики совпадают с базой.
- **Workflow change:** при жалобе «тормозит» сначала делить время на «после обновления» и «в игре»; стоимость обновления PWA измерять отдельным тестом (`updatecost.mjs`), а не глазами по первому запуску. Медиа и код держать в разных кэшах, иначе каждый релиз = полная перезакачка.

