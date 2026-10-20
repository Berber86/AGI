# Catalog integration correction

- Added White Night card to root index.html, preserving Candy Kingdom Coaster.
- Added cover.webp and checked-in games/white-night/play/ (~1 MB), so root Play works with ordinary static hosting and no Vite installation. Source and intermediate dist remain separate.
- Added npm run export:static and npm run test:catalog; documented the refresh process in the game README.
- Tests: root unittest discovery 15 passed; validator self-test passed; npm run test:catalog passed actual root -> Play -> WebGL -> three taps -> keep -> reload under /AGI/. No browser/HTTP errors.
- Evidence: .studio/evidence/reports/catalog.json and .studio/evidence/screenshots/catalog.png (visually inspected).
- No game source/contract or previous game changes. No permanent deployment or merge performed; push correction on the session branch.
- Future source edits must run npm run export:static and commit play/ alongside sources. Optional next step remains real Android QA and permanent hosting.
