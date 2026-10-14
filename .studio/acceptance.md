# Acceptance criteria — «Первичный бульон: Микрогенез»

`game.json` is the approved product contract. Checkboxes are evidence gates, not claims; keep them unchecked until the named behavior is demonstrated.

## Discovery and process

- [x] Four option-based discovery stages completed; the final contract was explicitly approved.
- [x] User-approved iteration unit recorded: one distinct batch of changes.
- [x] Push checkpoints recorded for iterations 3, 6, and 9 on `arena/0934f2ca-agi` only.
- [x] User-approved exception recorded for a separate game directory despite the root skill-repository instruction.
- [ ] Stop early only after the comparison rubric is demonstrated; otherwise iteration 9 is the final cycle and must end with a push, report, and wait.

## Playability and evolution

- [x] One deterministic landscape expedition is playable end to end: start → steer → collect → survive → editor → evolve twice → final encounter/exit → win or lose → restart. (Iteration 4 E2E uses hooks to accelerate resource thresholds and final travel; pickups, touch controls, and milestone thresholds are also tested independently.)
- [x] Touch-only virtual joystick and action buttons cause meaningful state changes; keyboard is never required. (Iteration 3: touch-capable Chromium, 844×390.)
- [x] Nutrients, small prey, and a larger predator have distinct, readable interactions. (Iterations 2–3 browser evidence.)
- [x] Repeated pickup/contact events cannot duplicate rewards or bypass health rules. (Unit and browser idempotence/cooldown checks.)
- [x] Four organs (flagellum, cilia, spines, proboscis) change both cell appearance and gameplay; at least three builds differ on the same seeded route. (19 unit tests; three deterministic outcome signatures.)
- [x] Victory, zero-health defeat, pause/resume, and clean restart are reachable and covered by tests. (Iteration 6 manual pause freezes simulation, resume restores controls, pause restart clears the run; 23/23 E2E checks.)
- [x] No sound is required to understand threats, controls, mutation trade-offs, or outcomes. (All current cues and outcomes are visual/text; no audio is required.)

## Comparison rubric

- [x] Save a same-seed landscape gameplay screenshot each iteration and compare composition/readability to the attached still reference. (Iterations 1–6; qualitative only.)
- [x] Show measurable, repeatable gameplay differences between evolved builds, not cosmetic-only changes. (Same-seed baseline/explorer/defender signatures in iteration 3 report.)
- [x] Preserve the approved food/evolution/survival loop while iterating visuals and performance. (The food web, mutations, and predator survival remain integrated.)
- [x] Do not claim superiority over the original's gameplay: only a still screenshot was supplied, not an executable. Record this limit and leave the overall “better than Spore” judgment to the user.

## Mobile and performance

- [x] Test landscape viewports 800×360 and 915×412 on a touch-capable browser. (Iteration 6: 23/23 browser checks at each target size; plus 844×390. Headless browser only, not physical Android.)
- [x] Keep controls reachable and HUD readable without covering the main cell or critical threats. (Iterations 5–6: bounds checked at 800×360, 844×390, and 915×412; final encounter screenshots retain visible cell, predator, and threat cue.)
- [x] Production asset estimate is at most 10 MB; runtime has no CDN dependency. (Iteration 6 `dist`: 7,346,864 bytes including offline worker and install icons; no remote runtime assets.)
- [ ] Target 60 FPS with a stable automatic 30 FPS quality fallback on constrained devices.
- [x] No blocking console errors, unhandled asset failures, or stuck input after pointer cancel/backgrounding. (Iteration 6: zero browser errors at all three touch viewports; pointercancel and simulated visibility hide/show release input and resume safely.)

## PWA and release

- [x] Production build passes TypeScript checks and browser smoke tests. (Iteration 6: `npm run build` runs TypeScript successfully; 69/69 touch browser checks across three viewports plus production offline smoke 6/6.)
- [ ] Static deployment uses relative paths and the chosen GitHub Pages subpath.
- [x] PWA installs and works offline after one successful online load. (Iteration 6 production manifest/service worker + PNG icons; 6/6 PWA checks, including cold offline navigation and start. Actual physical-device home-screen installation remains untested.)
- [x] Keep concise machine-readable reports and landscape screenshots under `.studio/evidence/`. (Iterations 1–6; per-viewport E2E, production PWA/offline, and pause evidence are included.)
- [x] At each required third iteration, verify then push only to `origin/arena/0934f2ca-agi`. (Iteration 3 passed and was pushed.)
