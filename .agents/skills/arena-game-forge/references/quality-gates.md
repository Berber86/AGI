# Quality gates and evidence

## Evidence hierarchy

Strongest to weakest:

1. Automated runtime assertion against the production build.
2. Recorded deterministic playthrough or browser trace.
3. Screenshot tied to a named state and viewport.
4. Build/test command output.
5. Source inspection.
6. Agent assertion without evidence.

Never use level 6 to close an acceptance criterion.

## Gate 0 — Session qualification

Before project work, run the generated one-shot benchmark described in `session-benchmark.md`. The executable result is authoritative:

- `qualified` permits the full workflow;
- `limited` permits planning/review only unless the user explicitly overrides;
- `reject` stops project work.

A model's explanation, confidence, reputation, or prior-session score cannot upgrade the current verdict.

## Gate 1 — Discovery

Pass only when:

- 2–4 stages were planned;
- structured options were used;
- completed stages are persisted;
- the final Game Contract was explicitly approved;
- must-have and out-of-scope lists exist;
- win and lose conditions are testable.

The validator must reject implementation phases while discovery is unapproved.

## Gate 2 — Project health

Generated projects should expose stable commands, normally:

```bash
npm run check
npm run test
npm run build
npm run test:e2e
npm run gate
```

`gate` should aggregate non-interactive checks. Do not invent successful output when a command does not exist; create the script or report the gap.

## Gate 3 — Core playability

Prove the complete loop:

- boot;
- first meaningful input;
- state change;
- pressure, challenge, or decision;
- win;
- lose;
- restart.

Test game-specific invariants. Examples:

- waiting forever cannot produce the best score;
- holding one control indefinitely is not dominant;
- one collision cannot score repeatedly every frame;
- the player cannot win before required objectives;
- lose state stops gameplay mutation;
- restart clears transient state.

When possible, use seeded randomness and a test bridge:

```ts
interface GameTestBridge {
  isReady(): boolean;
  reset(seed?: number): void | Promise<void>;
  getState(): unknown;
  simulateInput(action: string, payload?: unknown): void;
  advance?(milliseconds: number): void;
  getMetrics?(): Record<string, number>;
}
```

Expose it as `window.__GAME_TEST__` in test/dev mode and avoid shipping privileged debug mutations when unnecessary.

## Gate 4 — Mobile interaction

At 360×800 and 412×915:

- capture initial, active play, win/lose, and menu/pause states as relevant;
- interact using pointer/touch emulation, not only keyboard;
- check hit targets and overlays;
- confirm no page scroll fights the game;
- confirm controls release correctly after visibility/focus changes;
- inspect browser console and failed requests.

Save lightweight evidence under `.studio/evidence/`. Keep large videos and traces out of Git by default.

## Gate 5 — Visual review

Functional correctness comes first. Then perform a bounded visual loop:

1. Capture the actual game at fixed states, seeds, and viewports.
2. Compare with the approved visual direction or target image.
3. Review composition, hierarchy, readability, consistency, feedback, and mobile UI.
4. Write concrete findings with state/viewport locations.
5. Fix high-impact findings.
6. Repeat at most three rounds unless the user approves more.

A beautiful title screen cannot compensate for unreadable play. A screenshot score cannot prove interaction works.

When independent subagents are unavailable, use a later session as an external reviewer when practical. The reviewer should inspect acceptance criteria and captures before implementation code.

## Gate 6 — Performance

At minimum record:

- production bundle sizes;
- initial asset weight;
- entity/particle ceilings;
- representative frame timing or FPS;
- **update cost**: bytes a returning device downloads when the cache version
  changes (code and media measured separately, in bytes and request count);
- memory/listener growth observations for repeated restart cycles.

If the game has VR, a camera tracker, or any continuous input, also record the
per-frame input cost (`procMs`, analysis time) and the render counters
(draw calls, render passes, shadow passes) rather than frame time alone. In a
software-GL sandbox, frame time is a property of the sandbox; counters and
microbenchmarks are the evidence.

Do not claim low-end Android performance based only on a desktop preview. Label untested device claims explicitly.

## Gate 7 — Release

Verify the production build from its deployed-style base path:

- direct URL loads;
- reload on a nested/subpath does not break assets;
- manifest and icons resolve;
- service worker does not cache development files;
- offline behavior matches the contract, verified by an actual offline reload;
- code and immutable media live in separate caches, so a version bump does not
  re-download the media;
- version/update path is documented, including the first-migration caveat;
- no secret or development-only endpoint is embedded;
- known limitations are listed.

## Completion report

The final report should separate:

- **Implemented** — source exists;
- **Automatically verified** — named command and result;
- **Visually inspected** — named screenshots/viewports;
- **Device-tested** — actual device/browser, only if true;
- **Not verified** — honest limitations.

Executable gates must be deterministic under a slow headless GPU (teleport-based, polling, single-shot transitions). Known flake patterns and their fixes: `references/lifehacks-and-pitfalls.md`.
