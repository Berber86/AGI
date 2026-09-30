# Настоящий браузер в песочнице агента: рецепт

Проверять UI в jsdom — это НЕ проверять браузер. jsdom даёт DOM без рендеринга:
не бывает CSS-ломов, не бывает «кнопка есть, но её перекрыло», не бывает реального
V8/Chromium-поведения. В этой песочнице настоящий Chromium всё же поднимается —
ниже проверенный в бою рецепт (Chromium 153, полный онбординг игры, 0 JS-ошибок).

## Что НЕ сработает в этой песочнице

| Попытка | Почему падает |
|---|---|
| `npx playwright install chromium` | Скачивание с `playwright.azureedge.net` заблокировано egress-политикой (`ECONNRESET`) |
| Системные браузеры | Их просто нет в образе (ни chromium, ни firefox) |
| `apt-get install libnss3 ...` | Пользователь не root: «Could not open lock file», «Permission denied» в `/var/lib/dpkg` |
| Реестр npm | РАБОТАЕТ — через него и пробрасываем бинарь браузера пакетом |

## Рецепт

Чудесное свойство: пакет **`@sparticuz/chromium`** (сделан для AWS Lambda) содержит
бинарь Chromium прямо в npm-пакете — плюс архив `al2023.tar.br` с системными
библиотеками, из-за которых Chromium обычно не стартует («голодный» образ).

### 1. Установка

```bash
mkdir -p /tmp/pwb && cd /tmp/pwb
npm init -y
npm i playwright-core@1.48.2 @sparticuz/chromium
```

`playwright-core` без `playwright` (не тянет скачивание браузеров).

### 2. Распаковка бинаря и системных библиотек

Две ловушки: пакет — CommonJS с ESM-interop (`require()` даёт `{ __esModule, default }`),
а голый бинарь не найдёт `libnspr4`. Поэтому:

```bash
cd /tmp/pwb && node -e "
const fs = require('fs'), zlib = require('zlib');
const chromium = require('@sparticuz/chromium').default;   // <-- .default обязателен
(async () => {
  const path = await chromium.executablePath();            // распакует в /tmp/chromium
  console.log('бинарь:', path);
  const src = fs.readFileSync('node_modules/@sparticuz/chromium/bin/al2023.tar.br');
  fs.writeFileSync('/tmp/al2023.tar', zlib.brotliDecompressSync(src));
})();
" && mkdir -p /tmp/al2 && tar -xf /tmp/al2023.tar -C /tmp/al2
LD_LIBRARY_PATH=/tmp/al2/lib /tmp/chromium --version       # контроль: «Chromium 153.0.8010.0»
```

Без `LD_LIBRARY_PATH=/tmp/al2/lib` бинарь умрёт с
`error while loading shared libraries: libnspr4.so`.

### 3. Запуск из Playwright

```js
process.env.LD_LIBRARY_PATH = '/tmp/al2/lib';
const chromium = require('@sparticuz/chromium').default;
const pw = require('playwright-core');
const browser = await pw.chromium.launch({
  executablePath: '/tmp/chromium',
  args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
  headless: true
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'ru-RU' });
page.on('pageerror', e => console.log('pageerror:', e));   // ловим настоящие JS-ошибки
```

### 4. Раздача приложения

`dist/` НЕ живёт между ходами (исключён из снапшотов, как и `node_modules`) —
перед прогоном `npm ci && npm run build`. Дальше статик:

```bash
python3 -m http.server 8144 --directory /home/user/AGI/dist >/dev/null 2>&1 &
```

Для проверок на уровне модели удобнее раздавать корень репозитория и грузить
`legacy.html`, который собирает `campaign.js` без сборки:
`python3 -m http.server 8145 --directory /home/user/AGI`.

### 5. Заглушки внешнего API (Hydra)

Браузер не смог бы выйти в интернет, да и не должен. Перехват:

```js
await page.route('**/api.hydraai.ru/**', async r => {
  // ВАЖНО: шаг «Проверить ключ» бьёт POST /v1/chat/completions — любой 200 с choices годится
  let content = JSON.stringify({
    scienceName: 'Террасовые сады', scienceDescription: '…',
    buildingName: 'Ступени у воды', buildingDescription: '…',
    category: 'economy', effects: [{ type: 'income_food', amount: 1 }], rationale: '…'
  });
  await r.fulfill({ status: 200, contentType: 'application/json',
    body: JSON.stringify({ choices: [{ message: { content } }] }) });
});
```

Форматы ответов кроются в коде генератора: `src/game/cards.ts` (`PROJECT_SHAPE`,
effects — только из `M.GENERATIVE_EFFECTS`, иначе сработает санитайзер и экран
покажет «Советник не ответил»). Контракт исчерпывающе: ключ проверяется одним
POST, дальше каждый вызов генерации — тем же endpoint'ом с JSON в `content`.

### 6. Прохождение онбординга Infinite Forge

Онбординг — 5 шагов, часть кнопок disabled до выбора; ролевые локаторы Playwright
местами не цепляются, надёжнее нативный клик через `page.evaluate`:

```js
const clickByText = (t) => page.evaluate((t) => {
  const bs = [...document.querySelectorAll('button')]
    .filter(b => !b.disabled && (b.offsetWidth || b.offsetHeight)
      && b.textContent.replace(/\s+/g, ' ').trim().includes(t));
  if (!bs.length) return 0; bs[bs.length - 1].click(); return bs.length;
}, t);
const daleeDisabled = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().includes('Далее'));
  return b ? b.disabled : null;
});
// Шаги 1–3: если «Далее» заблокирована — выбрать первый NЕ-навигационный чип
for (let i = 0; i < 4; i++) {
  if (await daleeDisabled()) {
    await page.evaluate(() => {
      const bs = [...document.querySelectorAll('button')]
        .filter(b => !b.disabled && (b.offsetWidth || b.offsetHeight) && !/Далее|Назад/.test(b.textContent));
      if (bs[0]) bs[0].click();
    });
    await page.waitForTimeout(300);
  }
  await clickByText('Далее'); await page.waitForTimeout(600);
}
// Шаг 4 «ИИ» — обязателен реальный «успех» проверки ключа (моком из п.5)
await page.fill('input[type="password"]', 'test-key-12345');
await clickByText('Проверить'); await page.waitForTimeout(1200);
await clickByText('Далее');   await page.waitForTimeout(700);
// Финал: «Создать первое дело» → генерация проекта → «Начать» — игра жива
await clickByText('Создать первое дело');
```

Подсказки по вкладкам живой игры: боковое меню `Поселение/Карта/Развитие/Кузница/Армия/Настройки`.

### 7. Модельные проверки без UI (движок в настоящем V8)

Когда нужен не клик, а логика `src/game/*.ts` в реальном Chromium: esbuild-бандл
в IIFE + инъекция `<script>`:

```js
// entry_browser.js: import * as battle/cards/M; window.TSB = { battle, cards, M };
require('esbuild').buildSync({ entryPoints: ['entry_browser.js'], bundle: true,
  write: false, format: 'iife', platform: 'browser' });        // текст бандла в переменную
// … в браузере:
await page.goto('http://localhost:8145/legacy.html');          // даёт window.CampaignMvp
await page.addScriptTag({ path: '/tmp/pwb/tsb_bundle.js' });   // даёт window.TSB
const out = await page.evaluate(() => window.TSB.battle.createBattle(/*…*/));
```

`legacy.html` сам по себе кидает безобидный `ReferenceError: updateDeckCount` —
это старый экран, на вердикт модели не влияет (фильтруйте).

### 8. Артефакты доказательств

`/tmp` и `node_modules/` обнуляются между ходами. Поэтому:
скриншоты — не в `/tmp`, а в репозиторий (`docs/browser-verification/`), коммитом.
Сам прогон воспроизводится из этой инструкции заново.

### 9. Грабли в одном месте

| Симптом | Лечение |
|---|---|
| `Chromium: error while loading shared libraries: libnspr4.so` | Распаковать `al2023.tar.br` и выставить `LD_LIBRARY_PATH=/tmp/al2/lib` |
| `chromium.executablePath is not a function` | `require('@sparticuz/chromium').default` |
| Playwright не находит браузер | Передать `executablePath: '/tmp/chromium'` |
| Клики по ролям молчат | Нативный `.click()` через `page.evaluate` + фильтр видимости `offsetWidth` |
| «Советник не ответил» после онбординга | JSON мока не прошёл `sanitizeScienceProject`: сверьтесь с `PROJECT_SHAPE` в `cards.ts` |
| Тесты «фантомно падают» без текста ошибки | `node_modules` утёрся: сначала `npm ci` |
| `dist/index.html` — 404 в статике | `dist/` не персистентен: `npm run build` |

### 10. Быстрая эталонная метка успеха

- `/tmp/chromium --version` под `LD_LIBRARY_PATH` печатает версию;
- после онбординга в DOM есть `НАСТАВНИК · ШАГ 1 из 4`, чипы `12 +0.3 / день`,
  вкладки поселения кликаются, `pageerror` пуст;
- скриншот без искажений (шрифты, боковая панель, тёмная тема).
