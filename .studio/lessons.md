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
- **Fix:** не внесён — зафиксирован как аудит `VR_PERF_AUDIT.md` с ранжированными правками (F1–F6) и ожидаемым выигрышем.
- **Validation:** детерминированные счётчики (draw calls, теневые проходы, треугольники, пиксели) через `tests/tools/vrperf.mjs` и `tests/tools/vrtri.mjs`; сырые числа в `.studio/evidence/reports/vr-perf-audit.json`. Время кадра в software-GL намеренно не использовано как доказательство.
- **Workflow change:** для тяжёлых режимов (стерео, второй проход, камера) сначала считать draw calls/проходы, а не мс: счётчики переносятся на телефон, а мс SwiftShader — нет.
