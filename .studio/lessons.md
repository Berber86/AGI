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
- **Fix:** Extract the four runtime archives into `/tmp` following `references/headless-browser-setup.md` and run with `LD_LIBRARY_PATH=/tmp/al2023/lib`.
- **Validation:** Iteration 1 and 2 Puppeteer smoke runs launched Chromium 153 and passed all checks.
- **Workflow change:** Before running the per-game E2E script in a fresh sandbox, restore the bundled Chromium runtime and set its library path.

## 2026-10-14 — Watch the initial Babylon bundle size

- **Context:** Iteration 2 production build after adding food-web visuals.
- **Symptom:** Vite emitted a 6.75 MB minified entry bundle and warned about chunks over 500 kB.
- **Root cause:** The Babylon root barrel import currently pulls a broad set of modules into the application entry.
- **Fix:** No fix yet; the initial transfer remains inside the approved 10 MB ceiling, but it needs a dedicated optimization pass before release.
- **Validation:** `npm run build` passed; reported entry was 1.475 MB gzip.
- **Workflow change:** In a later iteration, switch to direct Babylon subpath imports/code splitting and measure actual built output rather than treating TypeScript build success as the performance gate.
