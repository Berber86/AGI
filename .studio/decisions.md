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

## 2026-10-15 — Стенд задержки телефон-джойстика реализован

- **Decision:** После мини-брейншторма (сценарий «один игрок, два телефона», подключение 6-значным кодом, вердикт по цифрам) утверждён и собран стенд `games/candy-kingdom-coaster/joystick-stand/`: Firebase RTDB событиями + пинг-понг медиана/p95, критерий 300 мс, демо-режим без Firebase. В игру режим пока не встраивается.
- **Evidence:** `tests/tools/joystickqa.mjs` 7/7 (демо-транспорт), `tests/evidence/joystick-stand.png`. Firebase-путь ждёт замера на устройствах пользователя.

## 2026-10-15 — Замер задержки джойстика: Firebase достаточно, WebRTC не нужен

- **Decision:** По замерам пользователя (два телефона через VPN): RTT медиана 295 мс, в одну сторону медиана 148 мс, p95 225 мс, 30 замеров — критерий «медиана ≤ 300 мс» пройден с двукратным запасом. Транспорт будущего режима «экран + джойстик» — Firebase Realtime Database; WebRTC отложен.
- **Evidence:** `games/candy-kingdom-coaster/JOYSTICK_BRAINSTORM.md`, стенд `joystick-stand/`.

## 2026-10-15 — Режим «VR + телефон-джойстик» встроен в игру

- **Decision:** После замеров (медиана 148 мс) пользователь утвердил полный режим: экран подготовки VR получил выбор водителя «Сама едет / Джойстик»; `src/remote.js` (Firebase RTDB событиями + демо-транспорт), страница второго телефона `games/candy-kingdom-coaster/joystick/`, фолбэк на автопилот при обрыве >6 с, карточка джойстика в корневом каталоге.
- **Evidence:** remotqa 6/6, vrqa 15/15, uiqa 24/24, Python 15/15; `tests/evidence/vr-remote-prep.png`, `joystick-page.png`.
- **Limitations:** живой Firebase между двумя телефонами проверен стендом по тому же протоколу; в песочнице интеграция гоняется на демо-транспорте.

## 2026-10-15 — Команды с джойстика: второй режим экрана джойстика

- **Decision:** По запросу пользователя на странице джойстика добавлен переключатель «Руль / Команды»: заново, пауза/продолжить (с возвратом VR-стерео), авторуление поверх руля, взгляд осматриваться/вперёд, стереобазис ±10 см вживую, звук, финиш, выход в меню с двойным нажатием. Протокол: `cmd {name, seq}` + ответное `state` от игры.
- **Evidence:** remotqa 12/12 (полный круг команд), `tests/evidence/joystick-commands.png`.

## 2026-10-16 — Полевые правки джойстика: INP и «комната не найдена»

- **Decision:** По скриншоту пользователя (INP 404 мс на кнопке руля, вечное «Ждём, пока экран создаст комнату…»): сетевые записи убраны из обработчиков нажатий страницы джойстика в отложенный коалесцированный отправитель; добавлена подсказка-чеклист при ненайденной комнате (8 с); экран публикует состояние с момента создания комнаты.
- **Evidence:** remotqa 14/14, uiqa 24/24.

## 2026-10-16 — Стенд трекинга камерой (шторка очков)

- **Decision:** По выбору пользователя строим отдельный стенд `tracking-stand/`: экранная мишень (ТВ/второй телефон), распознавание ярким пятном HSV (ArUco — фаза 2 по необходимости), главный критерий — стабильность и потеря метки (тест покоя 60 с против гироскопа, статистика потерь и повторного поиска, журнал CSV). LLM/VL для потока кадров отклонены аналитически: локальный CV на устройстве.
- **Evidence:** trackingqa 12/12 (синтетические кадры того же конвейера: углы +15°/+10° с ошибкой ≤0,1°), `tests/evidence/tracking-stand.png`, `tracking-target.png`.
- **Limitations:** живая камера/гироскоп — только на устройствах пользователя; вердикт по его цифрам.

## 2026-10-16 — Трекинг-стенд v2: печатные прямоугольные метки

- **Decision:** По живому тесту (экранный лайм выгорает в белый, детектор цеплял чужие зелёные объекты) стенд переведён на крупнейшее связное пятно, режим «Прямоугольник» (крен/оси по моментам), калибровку цвета по реальному объекту (малиновая коробка) и печатную метку с угловой точкой.
- **Evidence:** trackingqa 16/16; `tests/evidence/tracking-rect.png`.

## 2026-10-16 — Взгляд «По метке» внедрён в VR-поездку

- **Decision:** По выбору пользователя камера стала отдельным режимом взгляда (не слияние): `src/camtrack.js`, калибровка цвета коробки в подготовке VR, статус и camToggle на джойстике, авто-обзор при потере метки.
- **Evidence:** camqa 8/8, vrqa 15/15, uiqa 24/24, remotqa 14/14; `tests/evidence/vr-cam-prep.png`.
- **Limitations:** комфортная задержка камеры в очках проверяется только на живом устройстве.

## 2026-10-16 — Перф-фикс режима «По метке» (1–3 FPS на устройстве)

- **Decision:** Обработка камеры вынесена после рендера кадра; поток 640×480@30; адаптивные ярусы анализа 256/192/160 px и 85/115/150 мс по замеру procMs; удешевлена маска. Диагностика procMs видна в подготовке VR.
- **Evidence:** camqa 9/9, uiqa 24/24, vrqa 15/15.

## 2026-10-16 — Перф-фикс камеры, раунд 2: Worker + ярусы 160/128/112

- **Decision:** По отчёту «всё равно невозможно играть»: конвейер камеры в поездке переведён в Web Worker (camtrack-worker.js) с испытательным сроком и автооткатом; главный путь ужат до 160/128/112 px, поток 640×480@24, стерео pixelRatio 1.25 в режиме камеры.
- **Evidence:** camqa 10/10, uiqa 24/24, vrqa 15/15; бенчмарк полного пути 160 px ≈ 1,3 мс медиана (песочница).

## 2026-10-16 — Патчи «По метке»: панель цвета, память края, переякорка

- **Decision:** В подготовку возвращены прицел/пипетка/образец цвета и ползунки строгости; взгляд удерживает угол при потере метки (4 с, дальше — возврат в центр вместо авто-обзора); возврат метки в другом месте переякоривает взгляд после подтверждения вторым кадром; адаптивная скорость догона; джойстик показывает, куда ушла метка.
- **Evidence:** camqa 14/14, uiqa 24/24, vrqa 15/15.

## 2026-10-16 — «По метке»: фикс знака pitch и докрутка за край

- **Decision:** По полевым отчётам: pitch перевёрнут под семантику поворота головы; при потере метки за краем кадра взгляд докручивается в ту же сторону (+12°/с, ≤+10°, ≤1,8 с) — компенсация боковой камеры и полотна очков; в подготовку добавлен совет о сдвиге метки.
- **Evidence:** camqa 17/17, uiqa 24/24.


## 2026-10-16 — Аналоговый джойстик: руль и газ

- **Decision:** Только режим присоединённого внешнего джойстика получает две круглые touch-зоны: компактный горизонтальный руль слева и вертикальный газ справа. Газ: верх 100%, центр 30%, нижняя четверть/отпускание 0%; свежий нулевой газ останавливает машину и оставляет статичный осмотр. При обрыве связи прежний фолбэк на автопилот сохраняется; авто-VR и обычная игра не затронуты.
- **Evidence:** remotqa 19/19, joystickqa 7/7, uiqa 24/24, vrqa 15/15.


## 2026-10-16 — Увеличен тайм-аут фолбэка джойстика

- **Decision:** Внешний джойстик считается свежим 6 секунд вместо 2,5; только после 6 секунд без heartbeat/input игра мягко возвращает автопилот. Нулевой газ при живой связи по-прежнему означает статичный осмотр.


## 2026-10-16 — Подрежим взгляда по двум цветным меткам

- **Decision:** Для живого теста использовать симметричную пару: оранжевая коробка слева, малиновая справа; пресеты плюс отдельная калибровка цвета. При «прямо» обе метки калибруют индивидуальные опорные углы; при уходе одной вторая продолжает измерение, при уходе обеих сохраняются held/return-правила без выдуманного ±80°.
- **Evidence:** camqa 21/21, uiqa 24/24, vrqa 15/15.


## 2026-10-16 — Устранить FPS-просадки от внешнего Firebase-джойстика

- **Decision:** Аналоговый input не должен быть 30–60 Hz RTDB-потоком. Оставить Firebase, но отправлять только последнее изменившееся значение максимум раз в 80 мс и heartbeat раз в секунду; для защиты от VPN-очереди добавить `sid`/`seq` и отбрасывать устаревшие пакеты на игровом телефоне.
- **Reason:** Частые `set()` и `serverTimestamp()` на каждом движении создавали лишнюю очередь сетевых callback-ов и возвращали просадки FPS при живом подключении.
- **Tradeoff:** Добавляется до 80 мс локальной отправочной задержки; это принято ради стабильного рендера и остаётся ниже общей наблюдаемой задержки Firebase.
