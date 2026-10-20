# White Night — playable preview handoff

## State
All four option-based discovery stages completed and explicitly approved. Contract adds 6 junk finds to 12 keepsakes. Workflow delivered; source in `games/white-night/`. Existing game and skill source unchanged. This is a compact Three.js game, not a claim of full AAA production quality.

## Implemented
3-tap bin search, 18 true 3D models, touch/mouse rotation, discard/keep, unique catalog with filters/reinspection, duplicate marking, versioned local storage, completion, confirmed reset, quality mode, reduced-motion support, WebGL error fallback, silent PWA/offline. Fixed facade arch/window overlap, replaced faceted rubbish bags, fixed native Escape cancel closing a newly opened dialog, fixed short-landscape overflow.

## Commands and evidence
- Startup benchmark: QUALIFIED 100/100 (70 code +20 planning +10 integrity).
- `npm run check`, `npm test`, `npm run build` in game: passed; 7 tests.
- `npm run test:e2e`: 16 groups passed against production subpath, 360×800 and 412×915, all models, offline, storage, reset, synthetic visibility, resource reuse and no errors. See `.studio/evidence/reports/e2e.json`.
- `npm run test:desktop`: 3 groups passed against final production preview, mouse drag, catalog, Escape and 844×390 touch. See `desktop.json`.
- Full mobile E2E predates two narrow Escape/CSS fixes. Targeted final desktop/landscape checks plus syntax/unit/build rerun after those fixes.
- `npm audit`: zero vulnerabilities.
- Root `python3 -m unittest discover -s tests -v`: 11 passed.
- Root validator self-test and project validation: passed.
- Screenshots visually inspected: desktop-final, mobile-360-junk, mobile-412-inspect, portrait-initial, portrait-find, landscape-inspect.

## Preview/recovery
Live production preview uses port 5173, bound to 0.0.0.0. Restore with `cd games/white-night && npm ci && npm run build && npm run preview -- --port 5173`. `dist` and node_modules are ignored and must be regenerated after environment reset. Browser tests restore Chromium from npm and its required Linux libs to /tmp. E2E is slow under software WebGL (~8 minutes). Do not confuse desktop software frame timing with Android FPS.

## Limits / next work
No physical Android playtest or permanent deployment. Goal 30 FPS is unverified on hardware. PWA install UI untested on device, offline cache verified in Chromium. Visibility test is synthetic. Optional next task: real Android device QA then publish contents of dist/ under HTTPS. Root static games index intentionally not linked to unbuilt Vite source; deploy compiled output first.
