# Decision log

Append decisions in this format:

## YYYY-MM-DD — Decision title

- **Decision:**
- **Alternatives:**
- **Reason:**
- **Affected artifacts:**
- **Evidence or user answer:**

## 2026-10-14 — Approved white-night game
User approved four-stage contract with 6 junk items added to 12 interesting finds. All 18 are keepable, separated by catalog filters. No lose path per approved relaxed collection. Three.js explicitly requested, overriding default Babylon profile. New game kept isolated in games/white-night alongside existing game, per explicit new-game request; skill and previous game remain untouched. AAA is an aesthetic aspiration, not a deliverable claim. No sound.

## Catalog integration correction
The user pointed out the missing entry in root index.html. Added the White Night card, a compact screenshot cover and a checked-in static distribution in games/white-night/play/. This intentionally supersedes the earlier decision to omit a root link: the existing repository is served directly as static files and must not require a Vite build before the Play button works. dist/ and node_modules remain ignored. npm run export:static refreshes the published copy; no gameplay contract changes.

## Visual revision requested
Verbatim: «Для начала неплохо, но надо сделать графику в пару раз лучше, а находки детальнее». Treat as approved bounded visual revision, not a new game or gameplay redesign. Upgrade PBR maps, lighting/contact shading, architectural details, all 18 inspectable objects including backs. Keep catalog, saves, controls, silent white-night atmosphere and lightweight mode. The phrase “twice as good” is an aesthetic aim, not a measurable performance claim. Refresh tracked static export and cover.

## 2026-10-15 — Three visual iterations approved
User: «Хорошо. Приступай к реализации. Как сделаешь три итерации - пуш». Implement the bounded visual audit in three reviewable passes: presentation; priority models/materials; archive/UI. Keep the approved mechanics, silent courtyard, item IDs and saves. Push only the Arena session branch after the third pass and applicable checks. Remaining audit proposals are not implicitly declared completed.

## 2026-10-15 — Three further visual iterations
User: «Хорошо. Сделай ещё 3 итерации и тоже запуш». Continue the remaining audit in iterations 4–6: authored courtyard/bin details; localized wear on finds; staged search/reveal and restrained feedback. Keep gameplay, save IDs, weighted drops and silence. Push the same session branch after the third additional iteration and checks.
