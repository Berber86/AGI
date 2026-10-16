---
name: arena-game-forge
description: Creates touch-first browser games through a persistent, single-agent studio workflow. Use when a user asks to design, build, continue, review, test, or release a game in Arena.ai. Starts each session with a short executable competency benchmark, requires a 2–4 stage option-based brainstorm before implementation, stores decisions in .studio, defaults to Phaser/TypeScript/PWA, and verifies results with executable quality gates.
---

# Arena Game Forge

Create a playable mobile-browser game without relying on parallel subagents, a stable model identity, or chat history. Work as one physical agent taking one role at a time. Use repository files as durable memory.

## Non-negotiable rules

1. **Treat the first game request as a raw brief, not permission to code.**
2. **Run 2–4 interactive brainstorm stages before implementation.** Never reduce this to one confirmation, even if the user says “decide everything yourself.”
3. In every stage, ask structured questions with **2–4 concrete options per question** and permit a custom answer. Use the platform's `ask_user` UI when available; otherwise present numbered options and wait.
4. Adapt later options to earlier answers. Do not send all stages at once.
5. Persist the verbatim request and each completed stage in `.studio/` immediately.
6. Do not scaffold game code, generate production assets, or install a game engine until the final Game Contract is explicitly approved.
7. Never invent or silently assume a user answer. Recommendations are allowed, simulated consent is not.
8. Execute roles sequentially: Director → Designer → Technical Director → Builder → Mobile QA → Release.
9. Prefer executable evidence over claims. A clean compile alone does not prove a game works.
10. Default output is a static, touch-first browser game suitable for Android and installable as a PWA.

## Start or resume

1. Read `AGENTS.md` if present.
2. Read `.studio/BOOTSTRAP.md`, `.studio/state.json`, `.studio/discovery.json`, `.studio/game.json`, `.studio/backlog.json`, and the newest handoff if they exist.
3. If `.studio/` does not exist, initialize it with `scripts/init_studio.py` or create the equivalent files from `templates/`.
4. Run `scripts/validate_project.py --project-root <root>` before resuming.
5. If discovery is not approved, continue discovery. Never jump to implementation.
6. If discovery is approved, take only the next unblocked backlog item appropriate to the active phase.

## Mandatory brainstorm protocol

Read `references/discovery.md` before asking questions.

Choose the number of stages from the brief:

- **2 stages:** unusually complete brief; resolve remaining uncertainty, then contract lock.
- **3 stages (default):** creative direction, play experience, contract lock.
- **4 stages:** conflicting, broad, 3D, multiplayer, content-heavy, or otherwise risky request; vision, gameplay, presentation/scope, contract lock.

Each non-lock stage should contain 2–4 questions. Each question should contain 2–4 meaningfully different options, one concise recommendation when useful, and custom response enabled. Use plain product language rather than engine terminology.

The final stage must show the proposed Game Contract and ask the user to choose one of:

- approve this MVP;
- approve a leaner version;
- approve one bounded enhancement;
- approve with explicit custom edits.

Record the final completed stage with `name: "contract-lock"`. Only an option that explicitly says **approve** changes discovery to `approved`. If the answer is ambiguous or internally contradictory, leave discovery blocked and ask for resolution rather than coding.

## Approved Game Contract

After approval, write `.studio/game.json` with at least:

- verbatim request reference;
- title and elevator pitch;
- player fantasy, genre, audience, and core loop;
- perspective, orientation, session length, and touch controls;
- progression and difficulty intent;
- visual and audio direction;
- win and lose conditions;
- must-have features and explicit out-of-scope items;
- measurable acceptance criteria;
- platform: mobile browser / Android / PWA;
- selected technical profile and performance budgets.

Set `.studio/discovery.json.status` and `.studio/game.json.status` to `approved`, then move `.studio/state.json.phase` to `planning`.

## Delivery workflow

Read `references/workflow.md` and follow its phase gates.

Default technical choices:

- 2D action/arcade/platform/top-down: TypeScript + Phaser + Vite.
- UI-heavy card, board, or puzzle game: TypeScript + DOM/Canvas; add Phaser only when it simplifies input or animation.
- 3D only when the approved contract requires it: Babylon.js.
- Static client-side game; no backend by default.
- Bundled local assets; no runtime CDN dependency.
- PWA and GitHub Pages compatible production build.

Create the smallest playable vertical slice first. Do not produce a content-heavy shell before proving the core loop.

## Quality gates

Read `references/quality-gates.md` and `references/mobile-web.md` before claiming completion. If the contract includes VR/3D viewing, camera-based tracking, a second-device controller, Firebase/WebRTC, or another asynchronous input source, read `references/immersive-vr-remote-input.md` before technical planning and again before field QA.

A release candidate must demonstrate:

- deterministic install/build/check commands;
- no blocking browser-console errors;
- touch input without a keyboard;
- tested mobile viewports at 360×800 and 412×915;
- observable win and lose paths;
- pause/resume on visibility change;
- WebAudio unlock after a user gesture when audio exists;
- production build with relative deployment-safe paths;
- screenshots plus machine-readable test reports in `.studio/evidence/`;
- a concise handoff that names known limitations.

When practical, expose a test bridge such as `window.__GAME_TEST__` for reset, seeded state, input simulation, state inspection, and metrics.

## Session completion

Before ending a work session:

1. Run all gates applicable to the current phase.
2. Update backlog statuses and evidence paths.
3. Update `.studio/state.json`.
4. Write a timestamped handoff using the template.
5. Record non-obvious fixes in `.studio/lessons.md`.
6. State what is complete, what was actually verified, what remains, and the exact next task.

Do not mark work complete if the preview was not exercised or required evidence is missing.

## Progressive references

- Discovery and structured question protocol: `references/discovery.md`
- Sequential studio workflow and handoffs: `references/workflow.md`
- Android/mobile browser requirements: `references/mobile-web.md`
- Test, playability, visual, and release gates: `references/quality-gates.md`
- Persistent state contracts: `references/state-contracts.md`
- Sandbox resets and git recovery: `references/workspace-resets-and-recovery.md`
- Headless browser setup (no GPU, no apt): `references/headless-browser-setup.md`
- Field-tested lifehacks and pitfalls (UV traps, corridor sweep, perf, camera, test flakes): `references/lifehacks-and-pitfalls.md`
- VR, camera markers, stereo comfort, external Firebase joystick, low-rate input, failure semantics, and field QA: `references/immersive-vr-remote-input.md`
