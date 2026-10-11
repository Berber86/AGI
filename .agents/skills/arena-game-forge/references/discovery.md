# Discovery: 2–4 stage brainstorm

## Goal

Turn the user's first idea into an approved, bounded Game Contract through real interaction. The interview should be enjoyable and concrete, not a technical questionnaire.

## Invariants

- Complete 2–4 stages, inclusive.
- Ask one stage at a time and wait for answers.
- Every question offers 2–4 distinct options.
- Custom response remains available.
- Do not ask what the user already specified.
- Never ask the user to select Phaser, Canvas, ECS, a physics engine, or another implementation detail unless they explicitly care about it.
- After every stage, save answers to `.studio/discovery.json` before continuing.
- Match the user's language.

## Planning the number of stages

Score the raw brief for uncertainty; do not expose the score unless useful.

Important dimensions:

1. Player fantasy and emotional promise.
2. Core verb or loop.
3. Genre/perspective.
4. Typical session length.
5. Touch interaction and orientation.
6. Visual identity.
7. Progression/difficulty.
8. Must-have content.
9. Release target and offline expectations.

Use:

- **2 stages** when at least seven dimensions are explicit and non-conflicting. Stage 1 resolves the remaining decisions; Stage 2 locks the contract.
- **3 stages** by default.
- **4 stages** for broad scope, contradictions, multiplayer, 3D, procedural worlds, narrative-heavy content, or unclear core gameplay.

Reserve the final stage for contract lock. Never spend all planned stages before showing the synthesized contract.

## Stage patterns

### Stage 1 — Creative direction

Ask only unresolved questions such as:

- What should the player feel most strongly?
- Which core action should dominate play?
- Should the game be score-driven, level-driven, or survival-driven?
- What tone should the world have?

Options must describe player experience, not vague adjectives. Prefer “короткие напряжённые забеги с риском потерять добычу” over “динамично.”

### Stage 2 — Play experience

Typical questions:

- Portrait, landscape, or adaptive orientation?
- One-thumb, two-thumb, taps/swipes, drag, or contextual controls?
- 1–3 minute rounds, 5–10 minute sessions, or longer progression?
- Forgiving, escalating, tactical, or mastery-focused difficulty?

Do not re-ask Android/browser: it is the default platform unless the user changes it.

### Stage 3 — Presentation and scope

Use only when planned:

- visual direction;
- generated art versus procedural graphics;
- audio density;
- progression structure;
- one signature feature;
- explicit cuts needed to protect the MVP.

Offer bounded options. Do not offer “everything.”

### Final stage — Contract lock

Before calling `ask_user`, synthesize the proposed contract in the question itself:

- one-sentence pitch;
- core loop;
- touch controls and orientation;
- session structure;
- visual direction;
- must-have list;
- explicit exclusions;
- acceptance criteria.

Then offer 2–4 approval choices:

1. **Утвердить MVP** — build exactly this.
2. **Утвердить компактную версию** — keep the core loop and cut the named optional feature.
3. **Утвердить расширенную версию** — add exactly one named bounded enhancement.
4. **Утвердить со своими правками** — custom response must state the edits.

A custom answer that merely says “not sure” is not approval. A custom answer selected under “approve with edits” can count as approval only when the edits are concrete and compatible.

## Structured UI pattern

When `ask_user` is available, use this shape and adapt the content:

```json
{
  "questions": [
    {
      "id": "player_fantasy",
      "question": "Какое ощущение должно быть главным в каждом коротком забеге?",
      "options": [
        {
          "id": "precision",
          "label": "Точное мастерство",
          "description": "Игрок учится идеально рассчитывать движение; рекомендую для коротких мобильных сессий."
        },
        {
          "id": "discovery",
          "label": "Открытие и сюрпризы",
          "description": "Каждый забег раскрывает новые события и комбинации."
        },
        {
          "id": "power",
          "label": "Рост силы",
          "description": "Главное удовольствие — быстро собирать усиления и становиться заметно мощнее."
        }
      ],
      "allowCustomResponse": true
    }
  ]
}
```

Ask 2–4 questions in the same stage. Do not call four separate one-question dialogs unless later questions truly depend on each earlier answer.

## Option quality checklist

Every option should be:

- understandable without technical knowledge;
- substantially different from the others;
- compatible with browser and touch constraints;
- honest about scope implications;
- no longer than needed;
- paired with a useful description.

Avoid fake choices where all options lead to the same design. Avoid yes/no questions when concrete alternatives are possible.

## Persistence after each stage

Append an entry to `completedStages`:

```json
{
  "stage": 1,
  "name": "creative-direction",
  "completedAt": "ISO-8601 timestamp",
  "optionsUsed": true,
  "questions": ["player_fantasy", "core_loop"],
  "answers": {
    "player_fantasy": "precision",
    "core_loop": "deliver-under-pressure"
  },
  "summary": "Short precision-focused delivery runs with escalating route hazards."
}
```

Also update:

- `answers` with normalized decisions;
- `openQuestions` with unresolved issues;
- `updatedAt`;
- `state.json.lastAction`.

Keep the verbatim user response when normalization could lose nuance.

## Handling “decide for me”

The brainstorm remains mandatory. Reduce effort rather than skipping it:

- use two stages;
- mark one recommended option per question;
- offer an option such as “Доверяю рекомендации” with a description of the actual choice it implies;
- still obtain explicit approval at contract lock.

## Handling a rejected contract

Do not code. Set `discovery.status` to `changes_requested`, record the requested changes, and resolve them through the remaining stage when possible. If the four-stage budget is exhausted, end the current discovery cycle with a handoff; the next interaction starts a short revision cycle rather than pretending approval.
