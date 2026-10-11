# Persistent state contracts

## Purpose

`.studio/` is the source of truth across sessions and model changes. Chat history may help but must not be required.

## Required files

```text
.studio/
├── BOOTSTRAP.md
├── request.md
├── discovery.json
├── game.json
├── state.json
├── backlog.json
├── acceptance.md
├── decisions.md
├── lessons.md
├── handoffs/
├── benchmarks/
│   ├── latest-result.json
│   └── history.jsonl
└── evidence/
    ├── screenshots/
    ├── reports/
    ├── traces/
    └── videos/
```

Large videos/traces/builds should be ignored unless intentionally retained.

## discovery.json

Required fields:

- `schemaVersion`;
- `status`: `collecting`, `changes_requested`, or `approved`;
- `plannedStages`: integer 2–4;
- `completedStages`: ordered stage records;
- `answers`: normalized decisions;
- `openQuestions`;
- timestamps.

The completed stage count must never exceed `plannedStages`. The final completed stage must be the contract lock before approval.

## game.json

Before approval it may be a draft. Once approved, it is the product contract and should contain:

- concept and player experience;
- controls, orientation, session;
- visual/audio direction;
- progression and difficulty;
- win/lose;
- scope boundaries;
- acceptance criteria;
- technical/mobile profile and budgets.

Changes after approval require a decision entry and impact on backlog/acceptance.

## state.json

Tracks operational state:

- active phase and role;
- current task;
- last action;
- next action;
- blocker list;
- latest handoff;
- current session benchmark run, executable verdict, score, and result path;
- timestamps.

Allowed phases:

- `discovery`;
- `planning`;
- `vertical_slice`;
- `production`;
- `qa`;
- `release`;
- `done`.

No phase after `discovery` is legal until discovery and game contract are approved. Planning and implementation phases also require a `qualified` session benchmark or an explicit user override recorded by path in the decision log. A stale result from a prior session does not replace the required fresh startup benchmark.

## benchmarks/

`latest-result.json` is the most recent executable score. `history.jsonl` is append-only audit history. Generated challenge runs and the active pointer are transient and ignored by Git. Models must not edit verdict files manually.

## backlog.json

Each task includes:

```json
{
  "id": "CORE-001",
  "title": "Implement one complete playable round",
  "ownerRole": "builder",
  "status": "ready",
  "dependencies": [],
  "acceptanceCriteria": [
    "Touch input changes game state",
    "Win and lose can both be reached",
    "Restart produces a clean round"
  ],
  "evidence": []
}
```

A `done` task must have non-empty acceptance criteria and evidence. Dependencies must reference existing task ids.

## decisions.md

Append-only decision log. Include date, decision, alternatives considered, reason, and affected artifacts. Never rewrite history merely because a later decision differs.

## lessons.md

Record reusable, evidence-backed lessons: symptom, root cause, fix, validation, and where the workflow should change. Avoid generic advice.

## Handoffs

Use timestamped names sortable in lexical order, e.g.:

```text
2026-10-11T143000Z-builder.md
```

The newest valid handoff is advisory. JSON state remains authoritative when they conflict; record and resolve the discrepancy.
