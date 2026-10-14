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


## Игры в этом репозитории

| Игра | Стек | Что внутри |
|---|---|---|
| [Candy Kingdom Coaster](games/candy-kingdom-coaster/) | Three.js, без сборки | 3D-аркада для малышей: конфетная трасса, рампы, мост, музыка |
| [Первичный бульон](games/primordial-broth/) | Canvas 2D, ES-модули, без сборки | Стадия «первичного бульона»: рост клетки, редактор частей тела, пищевая цепочка, PWA |

Обе игры — статические страницы: каталог в корневом `index.html`, запуск из любого подкаталога или с GitHub Pages.

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
│   └── workspace-resets-and-recovery.md ← что теряется при сбросах окружения и как восстанавливаться
├── scripts/
└── templates/
```

Эксплуатационные руководства (браузер, сбросы) — обязательное чтение перед визуальными проверками и после любого «исчезновения» файлов/истории:

- [Установка headless-браузера](.agents/skills/arena-game-forge/references/headless-browser-setup.md)
- [Сбросы окружения и восстановление](.agents/skills/arena-game-forge/references/workspace-resets-and-recovery.md)

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
