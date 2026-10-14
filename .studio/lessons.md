# Lessons

Record only evidence-backed lessons.

## Template

- **Context:**
- **Symptom:**
- **Root cause:**
- **Fix:**
- **Validation:**
- **Workflow change:**

## 2026-10-14 — Headless Chromium needs the packaged runtime libraries

- **Context:** Browser smoke for iteration 1 failed to launch Chromium from `@sparticuz/chromium`.
- **Symptom:** `/tmp/chromium` exited with code 127 because `libnspr4.so` was missing.
- **Root cause:** `chromium.executablePath()` extracts the binary, but the sandbox also needs the companion `al2023` libraries and SwiftShader from the package's Brotli archives.
- **Fix:** Use Node's built-in Brotli decoder on `al2023.tar.br`, `fonts.tar.br`, and `swiftshader.tar.br`, extract the tar files into `/tmp`, and call `chromium.executablePath()` to extract Chromium. These tarballs place the shared libraries in `/tmp/lib`, so use `LD_LIBRARY_PATH=/tmp/lib`.
- **Validation:** Iterations 1–4 Puppeteer smoke runs launched Chromium 153 and passed all browser checks; a fresh extraction verified `/tmp/lib/libnspr4.so`.
- **Workflow change:** After a fresh sandbox reset, recreate the four archives from the local npm package and confirm the actual `lib` directory before choosing `LD_LIBRARY_PATH` (do not assume an extra `/tmp/al2023` subdirectory).

## 2026-10-14 — Watch the initial Babylon bundle size

- **Context:** Iteration 2 production build after adding food-web visuals.
- **Symptom:** Vite emitted a 6.75 MB minified entry bundle and warned about chunks over 500 kB.
- **Root cause:** The Babylon root barrel import currently pulls a broad set of modules into the application entry.
- **Fix:** No fix yet; the initial transfer remains inside the approved 10 MB ceiling, but it needs a dedicated optimization pass before release.
- **Validation:** `npm run build` passed; reported entry was 1.475 MB gzip.
- **Workflow change:** In a later iteration, switch to direct Babylon subpath imports/code splitting and measure actual built output rather than treating TypeScript build success as the performance gate.

## 2026-10-14 — Camera follow smoothing must be time-based

- **Context:** Capturing the final encounter after a deterministic player relocation during headless browser QA.
- **Symptom:** The cell stayed at the screen edge and the exit beacon remained offscreen after a fixed wait, despite updating camera target every frame.
- **Root cause:** A fixed per-frame interpolation factor made camera movement depend on frame rate; software-rendered Chromium advanced too few frames in the capture interval.
- **Fix:** Compute the camera interpolation fraction from elapsed seconds (`1 - exp(-8 * dt)`) and call `ArcRotateCamera.setTarget`.
- **Validation:** The same 600 ms headless capture then centered the cell and displayed the final gate; iteration 4 browser suite passed 17/17.
- **Workflow change:** Use elapsed time, not a fixed number of animation frames, for smoothing that must remain responsive on constrained devices.

## 2026-10-14 — Offline smoke must cover Vite's dynamic bundle and public assets

- **Context:** Adding an offline-first PWA shell in iteration 6.
- **Symptom:** Precaching only `index.html` and the entry module would miss Babylon's emitted dynamic JS chunks and public icons; a page could appear cached but fail after a cold offline navigation.
- **Root cause:** Vite emits many output chunks, while `public/` files are copied separately and are not all represented as emitted bundle entries.
- **Fix:** Generate the service worker from the production output bundle, explicitly include public manifest/icons, then cache-first serve same-origin GET requests and claim the active page.
- **Validation:** Production Chromium reported 83 cache entries (76 JS, 1 CSS), validated cached 192px/512px manifest icons, then loaded and started the app after switching offline and navigating cold; 6/6 PWA checks passed.
- **Workflow change:** For PWA changes, test the production build with an actual service worker and offline navigation; a dev-server smoke or successful registration alone is insufficient.
