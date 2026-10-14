# Acceptance criteria

Authoritative measurable criteria are locked in `game.json` after discovery approval.

## Discovery gate

- [ ] 2–4 brainstorm stages planned.
- [ ] Structured option-based questions used.
- [ ] Game Contract shown to the user.
- [ ] Game Contract explicitly approved.

## Project acceptance (this game)

Полные критерии — в `.studio/game.json` (`acceptanceCriteria`). Ключевое:

- [ ] 8 ступеней роста, 3 поколения, редактор частей «1 из 3».
- [ ] Мягкое поражение: продолжение рядом, собранные части сохраняются.
- [ ] Finał: рост 8/8 + доплыть до отмели = победа.
- [ ] Контрольные кадры не уступают `tests/reference/spore-cell-stage-*.jpg`.

## Playability gate

- [ ] One complete round is playable.
- [ ] Touch input causes meaningful state changes.
- [ ] Win, lose, and restart paths are demonstrated.

## Mobile gate

- [ ] 360×800 viewport checked.
- [ ] 412×915 viewport checked.
- [ ] No keyboard or hover is required.
- [ ] Pause/resume and audio lifecycle checked.

## Release gate

- [ ] Production build passes.
- [ ] Deployment-safe paths checked.
- [ ] Lightweight evidence and known limitations recorded.
