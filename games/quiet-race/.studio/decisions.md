# Decision log

Append decisions in this format:

## YYYY-MM-DD — Decision title

- **Decision:**
- **Alternatives:**
- **Reason:**
- **Affected artifacts:**
- **Evidence or user answer:**

## 2026-10-11 — Keep the generated game outside the skill repository

- **Decision:** Create the game project at `/home/user/games/quiet-race` instead of inside the `Berber86/AGI` checkout.
- **Alternatives:** build inside `Berber86/AGI` (for example `games/quiet-race/`); build in an ignored subdirectory of the skill repo.
- **Reason:** the skill repository's root `AGENTS.md` states the repo is not a generated game project and forbids adding generated games, build output, or large media to it. The Arena snapshot captures the whole `/home/user` workspace, so the game still persists.
- **Affected artifacts:** game project root, `.studio/` state location, future deployment path.
- **Evidence or user answer:** verbatim request in `.studio/request.md`; repo rule in `AGENTS.md` of `Berber86/AGI`.

## 2026-10-11 — Discovery planned as three stages

- **Decision:** Plan 3 discovery stages: (1) creative direction, (2) play experience and presentation, (3) contract lock.
- **Alternatives:** 2 stages (brief resolved quickly), 4 stages (broad or risky scope).
- **Reason:** the genre (racing), audience (5 years), emotional promise (no fear of losing) and platform (mobile browser) are explicit, but the core verb, session shape, controls, visual identity and must-have content are still open. Scope is small and 2D, so a fourth stage is not justified.
- **Affected artifacts:** `.studio/discovery.json` (`plannedStages: 3`), stage naming, contract-lock shape.
- **Evidence or user answer:** verbatim request in `.studio/request.md`.

## 2026-10-11 — Контракт MVP утверждён пользователем

- **Decision:** Строить неспешную гонку «Тихая гонка»: девочка-гонщица на розовом кабриолете, гараж с выбором цвета/флажка/наклейки, светофор «3-2-1-Едем!», автоматическая скорость, руление двумя большими кнопками, обгоны трёх друзей, клетчатый флаг и финиш-праздник, где кубок и медаль получают все.
- **Alternatives:** компактная версия без шариков и смены трасс; расширенная версия с мини-кубком из трёх заездов; свои правки.
- **Reason:** пользователь выбрал вариант «Утвердить MVP» и название «Тихая гонка»; главное требование — отсутствие проигрыша и знакомство с жанром гонок.
- **Affected artifacts:** `.studio/game.json`, `discovery.json`, весь вертикальный срез.
- **Evidence or user answer:** ответ `approve_mvp` + `quiet_race` в этапе contract-lock.

## 2026-10-11 — Технический профиль: Phaser 3 в режиме Canvas + процедурные текстуры

- **Decision:** Phaser + TypeScript + Vite, но все изображения рисуются кодом на canvas-текстурах (`src/game/textures.ts`), звук синтезируется в WebAudio, речь — Web Speech API.
- **Alternatives:** растровые ассеты, спрайтшиты, внешние аудиофайлы.
- **Reason:** контракт запрещает зависимость от интернета и ограничивает бюджет 8 МБ; процедурная графика даёт мгновенную загрузку и нулевые ассеты, а пастельный «мягкий мультик» собирается из простых форм.
- **Affected artifacts:** `src/game/textures.ts`, `src/game/audio.ts`, размер сборки (1.5 МБ).
- **Evidence or user answer:** выбранный стиль `soft_cartoon`; бюджет из `game.json`.

## 2026-10-11 — Дополнительная автономная однофайловая сборка

- **Decision:** Кроме обычной сборки `dist/` собирать `dist-offline/index.html` — один файл со всем движком внутри, без внешних ссылок и сервис-воркера.
- **Alternatives:** только PWA через https-хостинг; только локальный сервер разработки.
- **Reason:** дома может не быть интернета, а на телефоне `file://` не умеет ES-модули и сервис-воркеры; один файл решает и то, и другое.
- **Affected artifacts:** `vite.offline.config.ts`, `scripts/headless-run.mjs --offline`, `package.json` скрипты.
- **Evidence or user answer:** `npm run qa:offline` — 4/4 проверки, включая заезд и финиш с `file://`.

## 2026-10-11 — Хранилище и звук деградируют молча

- **Decision:** Любое обращение к `localStorage` идёт через `src/game/storage.ts` в `try/catch`; отсутствие русского голоса и недоступное хранилище не ломают игру.
- **Alternatives:** считать `localStorage` и голос обязательными (как обычно делают).
- **Reason:** приватный режим, отключённые cookie и страницы `file://` кидают исключения при доступе к хранилищу — на детском телефоне это реальный сценарий.
- **Affected artifacts:** `src/game/storage.ts`, `audio.ts`, `GarageScene.ts`.
- **Evidence or user answer:** прогон автономного файла с `file://` до исправления падал с `SecurityError: localStorage is not available for opaque origins`.

## 2026-10-11 — Публикация в открытом репозитории

- **Decision:** Игра публикуется отдельным открытым репозиторием `quiet-race` с включённым GitHub Pages; личная формулировка исходного запроса в `.studio/request.md` заменена нейтральной с явным примечанием.
- **Alternatives:** приватный репозиторий (на бесплатном тарифе без Pages), публикация в репозиторий скилла, локальный архив.
- **Reason:** открытый репозиторий — самый простой способ дать игру на телефоне по ссылке и поставить её на главный экран; личные детали о ребёнке в публичном репозитории не нужны.
- **Affected artifacts:** `.studio/request.md`, `.studio/handoffs/20261011T095000Z-release.md`, `.studio/state.json`.
- **Evidence or user answer:** выбор пользователя «Отдельный репозиторий, публичный + Pages».

## 2026-10-11 — Камера: вид сзади машины вместо вида сверху

- **Decision:** заезд рисуется псевдо-3D проекцией «из-за машины»: дорога с изгибами, уходящая к горизонту, лента кербов, конфетные стены, замок на горизонте. Симуляция при этом остаётся прежней (дорожки, скорость, шарики), меняется только слой отображения (`src/render/road3d.ts`).
- **Alternatives:** оставить вид сверху и лишь добавить перспективу; перейти на полноценный 3D-движок; сделать «рельсовую» псевдо-3D дорогу без изгибов.
- **Reason:** прямое требование пользователя: «Вид должен быть не сверху а сзади машины», с ориентиром на присланный скриншот и целевым сходством около 80 %.
- **Affected artifacts:** `src/sim/config.ts` (константы проекции), `src/sim/track.ts` (замкнутая петля), `src/render/road3d.ts`, `src/game/textures.ts` (машины и декор со спины), `src/game/hud.ts`, все сцены.
- **Evidence or user answer:** сообщение пользователя с приложенным скриншотом; циклы «сборка → скриншот → критическое сравнение» (10 итераций).

## 2026-10-11 — Три круга и кекс-ускорение вместо одного прямого заезда

- **Decision:** тот же самый заезд 3600 единиц показывается как три круга по 1200 («Круг 1/3» на HUD), а шарики заряжают «кекс-ускорение»: четыре ячейки, затем тап по кексу даёт 2.6 с ускорения ×1.32.
- **Alternatives:** оставить одну длинную прямую; сделать штраф за пропущенные шарики; включать ускорение автоматически по заполнению.
- **Reason:** так ребёнок знакомится с понятиями «круг», «финишный флаг» и «ускорение» из жанра гонок, при этом ничего не проигрывается: ускорение — только награда.
- **Affected artifacts:** `sim/race.ts` (`lap`, `boostCharges`, `boostMs`, события `lap`/`charge`/`boost`), `hud.ts`, `RaceScene.ts`, `tests/race.spec.ts`.
- **Evidence or user answer:** ссылочный HUD из скриншота пользователя («LAP 2/3», шкала кексов 4/4); тест `charges the cupcake meter…` и прогон QA (boosts: 2, lap 2/3).

## 2026-10-11 — Детерминированный seed и замер фаз кадра в QA

- **Decision:** харнесс задаёт `bridge.forceSeed = 4321`, поэтому все скриншоты доказательств — из одного и того же заезда; метрики кадра теперь включают `avgFrameMs`, `renderMs` и `simMs`.
- **Alternatives:** оставить случайные заезды и ловить удачный кадр; мерить только FPS.
- **Reason:** сравнение с эталоном требует повторяемых кадров, а разделение времени на симуляцию и отрисовку показывает, что 20–30 мс кадра в jsdom — это не наш код (0.4 мс отрисовка, 0.1 мс симуляция).
- **Affected artifacts:** `src/game/bridge.ts` (`forceSeed`, `recordPhase`), `scripts/headless-run.mjs`.
- **Evidence or user answer:** `headless-run.json`: `renderMs 0.42`, `simMs 0.15`, `avgFrameMs 23.4`.
