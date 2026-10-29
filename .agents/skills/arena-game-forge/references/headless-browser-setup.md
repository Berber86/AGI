# Headless-браузер для скриншотов и проверок

Как получать реальные скриншоты игры и гонять автотесты в песочнице Arena, где **нет GPU**, **недоступны debian-зеркала** (`apt-get` не работает), а наружу открыты только `registry.npmjs.org`, `pypi.org`, `github.com` и `files.pythonhosted.org`.

## Состав

| Пакет | Зачем |
|---|---|
| `puppeteer-core` | управление Chromium (CDN-загрузка браузера не нужна и не сработает) |
| `@sparticuz/chromium` | бинарник Chromium + SwiftShader + системные библиотеки, приходит tarball'ом с npm |
| `sharp` | пиксельные пробы по PNG (единственный достоверный способ проверить картинку) |

## Установка (один раз на чистое окружение)

```bash
mkdir -p /home/user/tools && cd /home/user/tools
npm init -y
npm install puppeteer-core sharp @sparticuz/chromium
```

Браузер внутри пакета лежит **brotli-архивами** (`chromium.br`, `swiftshader.tar.br`, `al2023.tar.br`, `fonts.tar.br`). Interop `require()` у пакета ненадёжен — распаковываем вручную скриптом `setup-runtime.mjs` (хранить его рядом с тулами, восстанавливать по этому документу):

```js
// setup-runtime.mjs — recreate /tmp runtime layout
import zlib from 'zlib';
import fs from 'fs';
import { execSync } from 'child_process';

const base = '/home/user/tools/node_modules/@sparticuz/chromium/bin';
const dec = (src, dst) => fs.writeFileSync(dst, zlib.brotliDecompressSync(fs.readFileSync(src)));

dec(`${base}/chromium.br`, '/tmp/chromium');
fs.chmodSync('/tmp/chromium', 0o755);

for (const [name, out] of [['swiftshader.tar.br', '/tmp/sw'], ['al2023.tar.br', '/tmp/al2023'], ['fonts.tar.br', '/tmp/fonts']]) {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync('/tmp/_x.tar', zlib.brotliDecompressSync(fs.readFileSync(`${base}/${name}`)));
  execSync(`tar -xf /tmp/_x.tar -C ${out}`);
}
execSync('cp -r /tmp/sw/* /tmp/ 2>/dev/null || true');           // libEGL/libGLES/libvk — рядом с бинарником
execSync('mkdir -p /tmp/al2023/lib && cp -r /tmp/al2023/* /tmp/al2023/lib/ 2>/dev/null || true');
execSync('mkdir -p /tmp/.fonts && cp -r /tmp/fonts/* /tmp/.fonts/ 2>/dev/null || true');
```

```bash
node setup-runtime.mjs   # → /tmp/chromium + /tmp/al2023/lib + swiftshader
```

**Важно:** `/tmp` не переживает сбросы окружения — прогоняйте `setup-runtime.mjs` перед первым браузерным запуском каждой сессии (см. `workspace-resets-and-recovery.md`).

## Запуск канонического скрипта

```js
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
  ],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
});
```

Размер вьюпорта 844×390 — «телефон в ландшафте». Статику отдаём обычным сервером из корня репозитория:

```bash
cd <repo-root> && python3 -m http.server 8899   # игра по http://127.0.0.1:8899/<путь>/
```

Типовой скриншот: `page.goto(url)` → дождаться готовности (`window.__READY__` или `networkidle0` + пауза) → `page.screenshot({ path })`.

## Тестовые хуки в игре

Для детерминированных проверок выносите в страницу `window.__TEST__`: управление состоянием (`startRace`, `setProgress(u, lateral, freeze)`, `snapCamera`, `finishNow`), диагностику (`roadScreenPoints`, `gameInfo`, `state`), изоляцию сцены (`hideWorldParts`, `hideChild`, `toggleSky`). Без них «поймать» нужный кадр в медленном headless практически невозможно.

## Подводные камни (проверено на практике)

1. **SwiftShader даёт 0,5–15 FPS.** Игровое время с `dt = min(0.05, …)` отстаёт от реального. Тесты должны **поллить** условие с таймаутом 30–90 с, а не ждать «2 секунды и готово». Для чисто логических проверок уменьшайте канвас (`canvas.width = 160`) и/или выключайте отрисовку мира — это ускоряет кадры в разы.
2. **Эмодзи в headless — тофу-квадраты** (в пакете нет эмодзи-шрифтов). На реальных устройствах они рисуются нормально. Не «чините» игру из-за этого; проверяйте текст/цифры пиксельными пробами.
3. **Просмотрщик картинок может показывать СТАРУЮ или смешанную картинку.** Единственный источник правды — `sharp`: считать регионы/цвета из raw-буфера (`img.raw().toBuffer({resolveWithObject:true})`), сравнить «до/после». (`.extract().stats()` у `sharp` возвращает одно и то же — считайте из raw сами.)
4. **Raycaster/проекция**: `camera.updateMatrixWorld(true)` перед `.project()`; у спрайтов нужен `raycaster.camera`.
5. **Цвета**: `Color.setHex('#ff00aa')` (строка) даёт NaN → чёрный материал. Для hex-строк используйте `Color.set(...)`.
6. **Бинарный поиск по сцене** вместо линейного перебора: заморозить кадр (`setProgress(..., true)`), прятать половину детей мира (`hideChild`) и сужать половину — находитель «чёрной точки» за ~8 скриншотов против сотен.
7. **Серверы и фоновые процессы** не переживают сбросы окружения — после сбоя перезапускать (тестовый 8899 и живое превью пользователя).
8. **Многовкладочные тесты (`game` + `joy`) и WebRTC в `--single-process` Chromium:**
   - В фоновой вкладке Chromium зажимает `setTimeout` минимум до `>= 1000 мс`: в коалесцерах отправки проверяйте `wait === 0` (`clearTimeout` + `queueMicrotask`) **до** `if (timer) return;`, а метку `lastSent` двигайте только при реальном изменении пакета (`if (changed)`), иначе холостой heartbeat посадит следующий реальный ввод на секундный таймер.
   - Перед `joy.close()` закрывайте `RTCPeerConnection` на странице через `window.addEventListener('pagehide', () => rtc?.close())` — иначе нативный `PeerConnection::Close()` в `--single-process` блокирует закрытие вкладки на 16–19 с.
   - Для локального `BroadcastChannel`-сигналинга передавайте `iceServers: []` (без внешних STUN-запросов).
   - В headless Chromium определена `DeviceOrientationEvent.requestPermission`, возвращающая `'denied'` на синтетический клик: в QA-скриптах подменяйте её на `async () => 'granted'` и ждите микротик (`await sleep(50)`) после клика по вкладке наклонов перед подачей синтетических углов.
