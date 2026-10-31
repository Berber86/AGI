# Acceptance criteria

Authoritative measurable criteria are locked in `game.json` after discovery approval.

## Discovery gate

- [x] 3 brainstorm stages planned and completed (`discovery.json`).
- [x] Structured option-based questions used in every stage.
- [x] Game Contract shown to the user at stage 3.
- [x] Game Contract explicitly approved (lean version: no upgrades, two finds, two creatures).

## Playability gate

- [x] One complete round is playable: drag to move, walk over a find, carry it to the fire, strike creatures.
- [x] Touch input causes meaningful state changes (real touch tap starts the run, real drag moves the hero in e2e).
- [x] Lose and restart paths are demonstrated (`.studio/evidence/reports/e2e.json`).
- [x] Record path: the best score is written to `localStorage` and shown as "НОВЫЙ РЕКОРД".

## Mobile gate

- [x] 360x800 viewport checked: landscape-only game shows an accessible orientation prompt.
- [x] 412x915 viewport checked.
- [x] No keyboard or hover is required; one thumb, no buttons.
- [x] Pause/resume on `visibilitychange`, audio suspended when hidden and unlocked on a gesture.

## Release gate

- [x] Production build passes (`npm run build`), PWA shell checked (1.21 MB, relative paths, no CDN).
- [x] Deployment-safe relative paths verified by the build check and by serving `dist/` from a plain static server.
- [x] Evidence and known limitations recorded in `.studio/evidence/reports/`.
