# Twin cake serpentines and hanging bridge

The route climbs around a strawberry–vanilla cake, crosses a **dipped suspension
bridge**, and descends clockwise around a chocolate–blueberry cake. Each spiral
makes 1¼ turns. The two landings are at world Y = 36.4 m; the bridge descends to
Y = 27.4 m at its centre. Horizontal span: 84 m; playable arc: 86.504 m. The
complete ride is now ~1,865.49 m.

## Implementation

- `src/course.js`: one distance-parametrised curve shared by driving, road,
  camera and pickups. Analytic tapered spirals meet the bridge with level
  tangents. Its symmetric `64t³(1−t)³` dip has zero first/second derivatives
  at the landings, and its own arc-length table keeps speed measured in metres.
- `config.js` → `CAKE_COURSE`: layout/dimensions, including `bridgeSag: 9`.
  The detour replaces base metres 600–900. Existing ramp/river/tunnel coordinates
  remain **base-course metres**, resolved by `track.fromBaseDistance(s)`; never
  manually offset them. Zone boundaries use the same mapping.
- `src/cakes.js`: tiered cakes, continuous wafer deck, candy guardrails and
  hanging cables with striped anchor posts. Every cross-bearer and hanger uses
  the **local dipped deck height**, not the old flat summit plane. Cables and
  their anchors stay outside the driving envelope; cross-bearers stay below it.
- `src/main.js`: the car follows the steeper bridge pitch. In the concave dip,
  the chase target compensates for the rising road ahead so the body of the
  car remains in frame rather than slipping below the screen. The ordinary
  road and its camera behaviour are unchanged.
- `src/track.js`: no floating grass shoulders on the elevated section.
- `sw.js`: `ckc-v18` refreshes the route, camera and the revised flag-free
  illustration (candy castle, gummy bears and sweets), all available offline.

## Reproduce the checks

Use the repository's [headless browser setup](../../../.agents/skills/arena-game-forge/references/headless-browser-setup.md).
With a static server serving the repository on port 8899:

```sh
cp games/candy-kingdom-coaster/tests/tools/serpentineqa.mjs /home/user/tools/
node /home/user/tools/serpentineqa.mjs --bridge-shots --offline
```

`--screenshots` captures the entire landmark as well. A full alternative game
URL can be passed as an argument. `QA_OUT` controls the output directory
(default `test-results/serpentines`, ignored by Git).

## Verified on 2026-10-14

**13/13 focused checks passed**, including the final camera-framing bound and
a real v18 offline reload. No browser errors. UI/artwork checks: **23/23**;
repository unit tests: **11/11**; validator self-test passed.

## Coverage

- Opposite winding, monotonic cake ascent/descent, a symmetric 9 m bridge dip
  with downhill/uphill halves, flat landings and matching tangents at all joins.
- Metre mapping error below 0.001 m; minimum bend radius ~28.5 m. Maximum grade
  is ~20.2° on the deliberately steeper bridge; the original **14° ordinary-road
  bound remains enforced** (measured ~12.8°). No low-headroom self-intersections.
- Road/curb coverage and cake/scenery clearance through the full steering range.
- 153 chase-camera poses: near road visibility, no scenery occluding the car,
  plus a body-framing bound on all 51 bridge poses (not just a visible helmet).
- Normal/boosted traversals, opposite pitch signs across the dip, soft steering
  walls, and no accidental jumps/drops. The original car-pitch bound is retained
  off the bridge. Complete no-input ride finishes in ~107 seconds and restarts.
- Actual held touch/release on the bridge and portrait rotate hints.
- River → ramp A → cakes → tunnel → ramp B order/spacing preserved.
- Landmark geometry: **30 draws / 89,052 triangles**, under the unchanged
  90,000-triangle budget.
- Real offline reload with both cakes, all 26 textures and the new menu art.

Latest result: `evidence/cake-serpentines-qa.json`. Screenshots:
`cake-sagging-bridge.webp` (profile), `cake-bridge.webp` (downhill),
`cake-bridge-bottom.webp` (valley), `cake-bridge-exit.webp` (uphill), and
`cake-{pair,ascent,descent}.webp`, all in `evidence/`.

Physical Android performance has not been measured. Chromium/SwiftShader is
used for correctness/screenshots, not device FPS; the older broad acceptance
suite is not part of this focused run.
