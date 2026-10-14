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
