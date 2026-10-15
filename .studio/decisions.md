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

## 2026-10-15 — Third set of visual passes
User: «Хорошо, делай ещё 3 итерации». Continue approved visual scope: 7 twilight lighting, 8 landscape composition, 9 controlled multi-angle inspection/cavity review. Preserve saves/rules/silence. Same session branch; follow previous delivery pattern and push after three commits. Git metadata reset again: fetched remote and mixed-reset only; working tree matched pushed 6f1c8f8 without replacing files. Existing session benchmark remains qualified 100; no new session challenge repeated.

## 2026-10-15 — VR-поездка для Candy Kingdom Coaster: контракт утверждён с правками

- **Decision:** Добавить в Candy Kingdom Coaster режим «VR-поездка» для линзовых очков: автономный полный заезд, экран делится на два квадратных стереокадра, два предстартовых режима взгляда («Осматриваться» гироскопом в окне вокруг трассы с авто-обзором без гироскопа / «Смотреть вперёд»), запоминаемый ползунок стереобазиса 10–150 см. Без дисторсии линз, WebXR и управления внутри очков. Контракт: `games/candy-kingdom-coaster/VR_BRAINSTORM.md`.
- **Alternatives:** Простое деление экрана без стерео; полная игра с рулением в VR; настройка внутри очков взглядом/громкостью — отклонены пользователем на этапах 1–4R.
- **Reason:** Брейншторм из 4 этапов + уточнение 4R завершён; пользователь утвердил MVP со своими правками дословно: «Давай два режима внутри очков. В одной камера осматривается, а в другой нет. Плюс настройка расстояния между двумя камерами. Ну там 20см-150см например.»; уточнение: переключение перед стартом, ползунок перед стартом с началом в 10 см.
- **Affected artifacts:** `games/candy-kingdom-coaster/VR_BRAINSTORM.md` (контракт). Код не изменялся.
- **Evidence or user answer:** Ответы этапов 1–4R в VR_BRAINSTORM.md. Осознанные риски: полная тряска/ускорения в VR (`same_ride`) и гиперстерео до 150 см — выбор пользователя.

## 2026-10-15 — VR-поездка реализована

- **Decision:** Реализован утверждённый контракт «VR-поездка» для Candy Kingdom Coaster: `src/vr.js` (стереопара из двух квадратов, взгляд гироскопом в окне ±35°/±20° или авто-обзор, ползунок камер 10–150 см из `Storage`), автопилот полного заезда с вариативными развилками в `src/main.js`, экран подготовки и кнопка в меню, кэш SW v26.
- **Evidence:** `tests/tools/vrqa.mjs` 15/15 (автопилот: финиш ~107 с, 136/151 сладостей, развилки по плану); uiqa 24/24; Python 15/15; скриншоты `tests/evidence/vr-stereo.png`, `vr-prep.png`. gameqa 6/7 — падение knock-теста воспроизводится на чистом дереве (не регрессия).
- **Limitations:** гироскоп не проверен на физическом устройстве (только подмена событий); дисторсии линз нет по контракту.
