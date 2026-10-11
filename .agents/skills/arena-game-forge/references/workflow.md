# Sequential studio workflow

## Operating model

There is one physical agent. Roles are constraints on one stage of work, not fictional parallel workers. Never claim that several agents independently reviewed a result unless separate sessions actually did so.

Repository state replaces conversational memory. Each role consumes artifacts and produces artifacts for the next role.

## Phase -1 — Session qualification

Before reading or changing the game project, complete exactly one generated benchmark run from `session-benchmark.md`. Continue the full workflow only on `qualified`. A `limited` or `reject` verdict cannot be upgraded by the model's own prose.

## Phase 0 — Bootstrap

**Role:** Director

1. Capture the initial request verbatim in `.studio/request.md`.
2. Initialize durable state.
3. Decide whether discovery needs 2, 3, or 4 stages.
4. Set `state.phase = "discovery"`.

Gate: required state files parse and project validation passes.

## Phase 1 — Discovery

**Roles:** Director, then Designer

Run the option-based protocol in `discovery.md`. Do not create game source code.

Gate:

- planned stages are between 2 and 4;
- final stage presents a synthesized contract;
- explicit approval exists;
- game contract has measurable success criteria.

## Phase 2 — Planning

**Role:** Technical Director

1. Select the simplest technical profile compatible with the contract.
2. Identify the riskiest gameplay assumption.
3. Decompose work into small backlog tasks with acceptance criteria.
4. Mark only unblocked work `ready`.
5. Define testing hooks before implementation.

Recommended initial epics:

1. Runtime shell and PWA foundation.
2. Smallest playable core loop.
3. Win/lose and restart.
4. Mobile controls and responsive UI.
5. Game feel and coherent assets.
6. Automated QA and release.

Gate: there is a vertical-slice path that proves the core loop before content expansion.

## Phase 3 — Vertical slice

**Role:** Builder

Implement the narrowest complete loop:

```text
start → player action → meaningful game-state change → escalating response → win or lose → restart
```

Use procedural shapes and sound placeholders first. Do not block core mechanics on asset generation.

After each task:

- run relevant checks;
- update status and evidence paths;
- do not mark done when acceptance criteria are not demonstrated.

Gate: a user can play one complete round with touch input.

## Phase 4 — Presentation and depth

**Roles:** Designer, Builder

Only after the vertical slice passes:

- tune pacing and difficulty;
- add bounded progression;
- establish a coherent art direction;
- replace only high-value placeholders;
- add game feel, feedback, sound, and accessibility;
- keep asset and performance budgets visible.

Do not add a new system merely to make the project look larger.

Gate: the approved player fantasy is visible in both mechanics and presentation.

## Phase 5 — QA

**Role:** Mobile QA

Review as a black box first. Run the game before reading implementation details when possible.

Test:

- loading and first interaction;
- touch controls and gesture conflicts;
- win, lose, restart, pause, and resume;
- deterministic seed or reproducible scenario;
- console/network errors;
- mobile layouts;
- game-specific invariants;
- production build.

A QA rejection reopens the owning backlog task with evidence. It does not silently patch scope.

## Phase 6 — Release

**Role:** Release Manager

1. Produce a static build.
2. Verify relative asset paths and service-worker scope.
3. Verify the production build, not only the dev server.
4. Prepare GitHub Pages deployment.
5. Write release notes and known limitations.
6. Keep large videos/build output out of Git unless explicitly required.

Gate: the user can open the published URL on Android and start a game without developer tools.

## Backlog discipline

Each task must include:

- stable id;
- title and owner role;
- status: `blocked`, `ready`, `in_progress`, `review`, `done`;
- dependencies;
- acceptance criteria;
- evidence paths;
- files or subsystem ownership when useful.

One session should normally complete one coherent task or one gate, not an unbounded phase.

## Handoff discipline

At session end write `.studio/handoffs/<timestamp>-<role>.md` containing:

- role and phase;
- completed work;
- changed files;
- exact commands run and results;
- evidence paths;
- decisions made;
- blockers and risks;
- exact next ready task;
- preview/build instructions.

A future model should be able to continue by reading files without access to the previous chat.

## Independent review through sessions

Model variability can be used deliberately:

- session A establishes design;
- session B implements;
- session C performs QA from acceptance criteria and evidence;
- session D handles fixes or release.

Do not require this split for every small change, but use it for final QA when feasible.
