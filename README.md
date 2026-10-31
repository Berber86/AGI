# Arena Game Forge

`arena-game-forge` — переносимый Agent Skill для последовательного создания мобильных браузерных игр в Arena.ai одним агентом, даже если модель и контекст меняются между сессиями.

Главное отличие от генераторов «один промпт → игра»: после первого запроса skill обязательно проводит **2–4 этапа брейншторма с пользователем**. На каждом этапе пользователь получает конкретные варианты ответов и может добавить свой вариант. Кодирование начинается только после утверждения игрового контракта.

## Возможности

- короткий исполняемый benchmark модели в начале каждой Arena-сессии;
- объективные вердикты `QUALIFIED`, `LIMITED`, `REJECT` без самооценки модели;
- случайные параметры задания, одноразовая финальная проверка и контроль целостности workspace;
- 2–4 адаптивных этапа discovery с вариантами ответов;
- сохранение исходного запроса и каждого решения в `.studio/`;
- последовательные роли Director → Designer → Technical Director → Builder → QA → Release;
- продолжение работы другой моделью или в новой сессии без зависимости от истории чата;
- browser-first стек: TypeScript + Phaser + Vite;
- touch-first требования для Android;
- PWA и публикация статической сборки через GitHub Pages;
- детерминированные проверки вместо «поверьте агенту»;
- smoke tests, gameplay invariants, mobile viewports и визуальные evidence-файлы.

## Структура

```text
.agents/skills/arena-game-forge/
├── SKILL.md
├── references/
│   ├── discovery.md
│   ├── mobile-web.md
│   ├── quality-gates.md
│   ├── session-benchmark.md
│   ├── state-contracts.md
│   ├── workflow.md
│   ├── headless-browser-setup.md      ← как ставить headless-браузер для скриншотов/тестов
│   ├── immersive-vr-remote-input.md   ← VR, камера-метки, внешний джойстик и полевой QA
│   ├── lifehacks-and-pitfalls.md      ← проверенные приёмы и тупики живых сессий
│   ├── perf-freeze-triage.md          ← фризы мобильного 3D: шейдерные пермутации, прогрев, 15с-пробник
│   ├── pixel-art-fx.md                ← пиксельные VFX: метод pixelfx, шиты, hit-stop, планка качества
│   └── workspace-resets-and-recovery.md ← что теряется при сбросах окружения и как восстанавливаться
├── scripts/
└── templates/
```

Эксплуатационные руководства (браузер, VR/remote, сбросы) — обязательное чтение перед визуальными/полевыми проверками и после любого «исчезновения» файлов/истории:

- [Установка headless-браузера](.agents/skills/arena-game-forge/references/headless-browser-setup.md)
- [VR, камера и внешний джойстик](.agents/skills/arena-game-forge/references/immersive-vr-remote-input.md)
- [Сбросы окружения и восстановление](.agents/skills/arena-game-forge/references/workspace-resets-and-recovery.md)
- [Диагностика фризов мобильного 3D](.agents/skills/arena-game-forge/references/perf-freeze-triage.md)
- [Пиксельные VFX и спрайтовые эффекты (pixelfx)](.agents/skills/arena-game-forge/references/pixel-art-fx.md)

## Главные выводы полевых замеров (производительность)

Проверено на живых телефонах (Android Chrome, Mali-G57 MC2 и Adreno 610); полная
методика — в [perf-freeze-triage.md](.agents/skills/arena-game-forge/references/perf-freeze-triage.md).

1. **«Нереальные» тормоза мобильного 3D — обычно шейдерные.** Материалы в канвасе и в
   offscreen-таргете composer'а — это РАЗНЫЕ программы (tonemapping/output-пермутации),
   гашение теней губернатором добавляет третий набор. Реальный кейс: вход в VR собирал
   +36 программ в первом стерео-кадре = 30-секундный стопор на телефоне, который после
   лечения выдал 40 FPS в стерео.
2. **`linkProgram` бесплатен, компиляция — до первой отрисовки.** Счётчик линковок ловит
   шторм, но не его стоимость («линковок 136, суммарно 1мс» при «рендер 36558мс»).
   Прогрев обязан и линковать (`renderer.compile`), и **прожигать первую отрисовку**
   каждой программы (реальный draw в угол канваса 2×2, scissor, без autoClear).
3. **`renderer.compile(obj)` от под-объекта компилирует «вслепую»** (нет света в корне →
   `numLights=0`): компилировать от полной сцены с маскированием видимости, очередь —
   по мешам, бюджет ~55мс/кадр.
4. **GPU-ожидание (`gl.finish`) ~0 при огромном render** = дело не в fill rate. Классификация
   фриза — по наибольшей компоненте кадра; «вне кадра» = композитор/презентация/инкрементальный
   GC/система.
5. **«Слабое железо» — последняя гипотеза.** Один и тот же сценарий на двух телефонах
   отличался в разы (линовка ~0.8с против <0.01мс на вызов, CPU-сабмит в ~12 раз) — сначала
   шейдеры/память/драйвер, потом вердикт про железо. Фингерпринт давления памяти: JS-heap
   ×3 + ВСЁ медленнее разом + «вне кадра» огромная при «GC-паузах» 0.
6. **Мерить, а не гадать:** пофреймовый 15с-пробник с классификацией виновников, A/B-чекбоксы
   («без стекла» для композитора), регресс-тесты шейдерного прогрева в headless
   (`qa/shaderwarmup.mjs`, `qa/reeffreeze.mjs`). Обход composer'а отклонён: ACES применяется
   до смешения прозрачностей — A/B 40% при шуме 1–2%.

## Использование в Arena

1. Скопируйте каталог `.agents/skills/arena-game-forge` в игровой репозиторий.
2. Добавьте в корневой `AGENTS.md` требование сначала читать этот skill.
3. Скажите агенту, например:

   > Используй arena-game-forge. Я хочу мобильную браузерную игру про курьера на летающем острове.

4. В начале сессии агент проходит короткий benchmark: исправляет небольшой игровой reducer, составляет mobile vertical-slice plan и получает машинный score.
5. При `REJECT` работа останавливается; при `LIMITED` агент может продолжить только после решения пользователя; при `QUALIFIED` начинается обычный workflow.
6. Агент не должен сразу писать игру. После квалификации он проведёт 2–4 этапа брейншторма через структурированные вопросы.

Запуск benchmark вручную:

```bash
python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py start --project-root .
# выполнить задание из сгенерированного CHALLENGE.md
python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py public-check --project-root .
python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py evaluate --project-root .
```

Для первоначального создания долговременного состояния проекта:

```bash
python3 .agents/skills/arena-game-forge/scripts/init_studio.py \
  --project-root . \
  --name "Sky Courier" \
  --request "Мобильная браузерная игра про курьера на летающем острове"
```

Проверка состояния:

```bash
python3 .agents/skills/arena-game-forge/scripts/validate_project.py \
  --project-root .
```

## Проверка самого skill

```bash
python3 -m unittest discover -s tests -v
python3 .agents/skills/arena-game-forge/scripts/validate_project.py --self-test
python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py self-test
```

## Принцип работы

Skill не симулирует параллельную мультиагентность. Один физический агент выполняет роли последовательно, а Git и `.studio/` выступают общей памятью. Отдельные сессии можно использовать как независимые этапы: дизайн, реализация, QA и релиз.
