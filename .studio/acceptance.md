# Acceptance criteria — «Первичный бульон: Микрогенез»

`game.json` is the approved product contract. Checkboxes are evidence gates, not claims; keep them unchecked until the named behavior is demonstrated.

## Discovery and process

- [x] Four option-based discovery stages completed; the final contract was explicitly approved.
- [x] User-approved iteration unit recorded: one distinct batch of changes.
- [x] Push checkpoints recorded for iterations 3, 6, and 9 on `arena/0934f2ca-agi` only.
- [x] User-approved exception recorded for a separate game directory despite the root skill-repository instruction.
- [ ] Stop early only after the comparison rubric is demonstrated; otherwise iteration 9 is the final cycle and must end with a push, report, and wait.

## Playability and evolution

- [ ] One deterministic landscape expedition is playable end to end: start → steer → collect → survive → editor → evolve twice → final encounter/exit → win or lose → restart.
- [x] Touch-only virtual joystick and action buttons cause meaningful state changes; keyboard is never required. (Iteration 3: touch-capable Chromium, 844×390.)
- [x] Nutrients, small prey, and a larger predator have distinct, readable interactions. (Iterations 2–3 browser evidence.)
- [x] Repeated pickup/contact events cannot duplicate rewards or bypass health rules. (Unit and browser idempotence/cooldown checks.)
- [x] Four organs (flagellum, cilia, spines, proboscis) change both cell appearance and gameplay; at least three builds differ on the same seeded route. (15 unit tests; three deterministic outcome signatures.)
- [ ] Victory, zero-health defeat, pause/resume, and clean restart are reachable and covered by tests.
- [ ] No sound is required to understand threats, controls, mutation trade-offs, or outcomes.

## Comparison rubric

- [x] Save a same-seed landscape gameplay screenshot each iteration and compare composition/readability to the attached still reference. (Iterations 1–3; qualitative only.)
- [x] Show measurable, repeatable gameplay differences between evolved builds, not cosmetic-only changes. (Same-seed baseline/explorer/defender signatures in iteration 3 report.)
- [x] Preserve the approved food/evolution/survival loop while iterating visuals and performance. (The food web, mutations, and predator survival remain integrated.)
- [x] Do not claim superiority over the original's gameplay: only a still screenshot was supplied, not an executable. Record this limit and leave the overall “better than Spore” judgment to the user.

## Mobile and performance

- [ ] Test landscape viewports 800×360 and 915×412 on a touch-capable browser.
- [ ] Keep controls reachable and HUD readable without covering the main cell or critical threats.
- [x] Production asset estimate is at most 10 MB; runtime has no CDN dependency. (Iteration 3 `dist`: 7,157,383 bytes; no remote runtime assets.)
- [ ] Target 60 FPS with a stable automatic 30 FPS quality fallback on constrained devices.
- [ ] No blocking console errors, unhandled asset failures, or stuck input after pointer cancel/backgrounding.

## PWA and release

- [ ] Production build passes TypeScript checks and browser smoke tests.
- [ ] Static deployment uses relative paths and the chosen GitHub Pages subpath.
- [ ] PWA installs and works offline after one successful online load.
- [x] Keep concise machine-readable reports and landscape screenshots under `.studio/evidence/`. (Iterations 1–3.)
- [ ] At each required third iteration, verify then push only to `origin/arena/0934f2ca-agi`.
