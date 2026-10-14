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
