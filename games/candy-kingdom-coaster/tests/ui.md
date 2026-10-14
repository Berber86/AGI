# Welcome screen, controls and coaster exit regression

## Changes

- Illustrated, responsive welcome screen with local key art and Latin/Cyrillic
  fonts. Short landscape layouts (including 851×326 and 640×280) keep the
  complete Play action visible, without scrolling the menu.
- Loading and ready are distinct states. Progress advances on completed texture,
  world, car and shader-preparation milestones, not an elapsed-time animation.
  A failed engine import exposes a retry action. Slow texture callbacks cannot
  roll the progress/status backwards. Reduced motion is respected.
- HUD is both hidden and `inert` during loading/menu/pause/finish. Rounded SVG
  steering pads retain thumb-sized hit targets and share keyboard/pointer press
  feedback. Releasing one of two touches on the same button no longer clears
  the other touch's visual state. Blur/cancel safely release all controls.
- The whole background coaster is moved 25 m farther from the route: its base
  offset changes from 70 to 95 m. Supports, rails and the moving train use the
  same translated curve; no extra draw calls or disconnected supports.
- The welcome artwork now has a wafer castle, gummy bears and sweets, with
  no rainbow flag or flagpole. Inspected in both short-phone and desktop views.
- `ckc-v18` refreshes the bootstrap, route/camera, WebP and local fonts.

## Reproduce

From the repository root, with the server on port 8899 and the shared browser
runtime installed by `tests/tools/setup-runtime.mjs`:

```sh
cp games/candy-kingdom-coaster/tests/tools/uiqa.mjs /home/user/tools/uiqa.mjs
node /home/user/tools/uiqa.mjs --offline

cp games/candy-kingdom-coaster/tests/tools/serpentineqa.mjs /home/user/tools/serpentineqa.mjs
node /home/user/tools/serpentineqa.mjs
```

Both scripts accept a full game URL and `$QA_OUT`. Generated reports/screenshots
are written to ignored `test-results/`; only selected small evidence files are
kept here. The UI test first delays the engine to inspect deterministic loading
states, then starts a **fresh, unmocked game** for touch/pause/fullscreen/finish,
geometry checks and an actual offline reload. It waits for an **activated worker
controlling this page**, not merely an existing/activating registration, before
turning off the network.

## Geometry checks

The previous elevated-deck test stopped before the reported obstruction. The new
check measures the coaster against the **whole route**, and raycasts the driving
corridor from the downhill cake through the tunnel and another 180 m beyond it.

- Minimum rail-surface distance from route centreline: **17.87 m**.
- Minimum support-surface distance from route centreline: **18.21 m**.
- Blocked road-envelope rays: **0** (lateral samples through ±7.8 m).
- Moving train's position error relative to its rail path: **0**.

## Verified results — 2026-10-14

- UI/controls/clearance/offline: **23/23 passed**, no browser errors.
- Route/camera/offline regression after the 9 m bridge dip: **13/13 passed**.
  See `evidence/cake-serpentines-qa.json` and [serpentines.md](serpentines.md).
  Its 89,052 triangles satisfy the original 90,000-triangle budget.
- UI evidence was captured with the new illustration on cache v17. The final
  camera-framing adjustment and v18 offline reload are covered by that later
  route run; layout and controls did not change between these runs.
- Repository unit tests: **11/11 passed**; validator self-test passed.

## Evidence

See `evidence/ui-qa.json` for the latest automated result and:

- `welcome-loading.webp` — loading state (56%, reduced motion for capture).
- `welcome-851x326.webp` — ready screen in a short phone-shaped viewport.
- `welcome-1366x768.webp` — desktop layout.
- `driving-controls.webp` — actual in-ride controls on the cake ascent.
- `coaster-clear-road.webp` — the previously obstructed section around 1480 m.

Browser checks use headless Chromium/SwiftShader with mobile touch emulation;
these are not measurements of physical Android frame rate. The older, broad
acceptance suite is not part of this focused run.

## After the two-fork extension — 2026-10-15

The final v22 UI suite passed **25/25**, including the active route hint at
851×326 and 640×280 and an actual offline reload with both forks/all four
routes. Latest result: `evidence/forks-ui-qa.json`; final fork images and the
completed regression summary are listed in [forks.md](forks.md). The coaster
now checks clearance against all alternatives, not just the default route.
The earlier figures/cache versions above describe the preceding UI checkpoint.
