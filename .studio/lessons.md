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
