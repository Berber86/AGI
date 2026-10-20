/**
 * Браузерная проверка «Сладких букв» в headless Chromium.
 *
 * Доказываем на реальной странице:
 *  - меню, карточка буквы и вафельная доска действительно нарисованы;
 *  - полный круг буквы проходится настоящими движениями указателя по canvas:
 *    обводка → «услышь и найди» → письмо по памяти → наклейка;
 *  - оба исхода наблюдаемы: «коробка опустела» и собранная коробка из пяти наклеек;
 *  - прогресс переживает перезагрузку, родительский сброс его очищает;
 *  - оба мобильных ландшафтных вьюпорта помещаются без прокрутки;
 *  - на портретном экране появляется подсказка повернуть устройство;
 *  - нет ошибок консоли, внешних запросов и превышения бюджета ассетов.
 *
 * Запуск: GAME_URL=... SHOTS_DIR=... REPORTS_DIR=... node tests/browser.mjs
 * (нужен статический сервер из корня репозитория и распакованный chromium).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from '/home/user/tools/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const GAME_URL = process.env.GAME_URL || 'http://127.0.0.1:8899/games/candy-letters/play/';
const SHOTS = process.env.SHOTS_DIR || path.join(ROOT, '.studio/evidence/screenshots');
const REPORTS = process.env.REPORTS_DIR || path.join(ROOT, '.studio/evidence/reports');

fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(REPORTS, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  url: GAME_URL,
  viewports: [],
  checks: [],
  consoleErrors: [],
  loadDiagnostics: [],
  externalRequests: [],
  screenshots: [],
  assets: [],
  fps: null,
  assetBytes: null,
  passed: false,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function check(name, condition, detail = '') {
  report.checks.push({ name, passed: Boolean(condition), detail });
  if (!condition) throw new Error(`check failed: ${name} — ${detail}`);
}

async function shot(page, name) {
  const file = path.join(SHOTS, `candy-${name}.png`);
  await page.screenshot({ path: file });
  const relative = path.relative(ROOT, file);
  if (!report.screenshots.includes(relative)) report.screenshots.push(relative);
  return file;
}

async function newGamePage(browser, viewport = { width: 1024, height: 600 }) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await openGamePage(browser, viewport);
    } catch (error) {
      lastError = error;
      report.retries = (report.retries || 0) + 1;
      await sleep(600 * attempt);
    }
  }
  throw lastError;
}

async function openGamePage(browser, viewport) {
  const page = await browser.newPage();
  await page.setViewport({ ...viewport, hasTouch: true });
  page.on('console', (message) => {
    if (message.type() === 'error' && !/favicon/i.test(message.text())) {
      report.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => report.consoleErrors.push(String(error)));
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(GAME_URL) && !url.startsWith('data:') && !url.startsWith('blob:')) {
      report.externalRequests.push(url);
    }
  });
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  try {
    await page.waitForFunction(() => Boolean(window.__GAME_TEST__), { timeout: 18000 });
  } catch (error) {
    const diagnostics = await page
      .evaluate(() => ({
        ready: document.readyState,
        bridge: typeof window.__GAME_TEST__,
        scripts: [...document.scripts].map((script) => script.src.split('/').pop()),
        menuChildren: document.querySelector('#menu-grid')?.childElementCount ?? -1,
        modulesLoaded: [...document.querySelectorAll('script')].length,
      }))
      .catch(() => 'evaluate failed');
    report.loadDiagnostics = report.loadDiagnostics || [];
    report.loadDiagnostics.push({ attempt, diagnostics });
    await page.close().catch(() => {});
    throw error;
  }
  await page.waitForFunction(
    () => {
      const menu = document.querySelector('[data-screen="menu"]');
      return menu && !menu.hidden;
    },
    { timeout: 15000 },
  );
  await sleep(350);
  return page;
}

async function waitForScreen(page, screen, timeout = 20000) {
  await page.waitForFunction(
    (name) => {
      const section = document.querySelector(`[data-screen="${name}"]`);
      return section && !section.hidden;
    },
    { timeout },
    screen,
  );
}

async function clickSelector(page, selector) {
  const clicked = await page.evaluate((value) => {
    const node = document.querySelector(value);
    if (!node) return false;
    node.click();
    return true;
  }, selector);
  check(`click ${selector}`, clicked, 'element not found');
  await sleep(220);
}

/** Ведёт указатель по контуру буквы — те же точки, что и в эталонном штрихе. */
async function traceWithPointer(page, canvasSelector, letterId) {
  const strokes = await page.evaluate((id) => window.__GAME_TEST__.idealStrokes(id), letterId);
  const box = await page.evaluate((selector) => {
    const rect = document.querySelector(selector).getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }, canvasSelector);
  const size = Math.min(box.width, box.height) - 20;
  const scale = size / 100;
  const toScreen = (x, y) => ({
    x: box.x + (box.width - size) / 2 + x * scale,
    y: box.y + (box.height - size) / 2 + y * scale,
  });

  for (const stroke of strokes) {
    const first = toScreen(stroke[0].x, stroke[0].y);
    await page.mouse.move(first.x, first.y);
    await page.mouse.down();
    for (const point of stroke) {
      const screen = toScreen(point.x, point.y);
      await page.mouse.move(screen.x, screen.y, { steps: 2 });
    }
    await page.mouse.up();
    await sleep(160);
  }
}

/** Сколько пикселей реально нарисовано в canvas (проверка отрисовки, а не вёрстки). */
async function paintedPixels(page, selector, stride = 89) {
  return page.evaluate((value, step) => {
    const canvas = document.querySelector(value);
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let painted = 0;
    for (let i = 3; i < data.length; i += 4 * step) if (data[i] > 0) painted += 1;
    return painted;
  }, selector, stride);
}

async function scenarioMenuAndLetter(browser) {
  const page = await newGamePage(browser);
  const cards = await page.$$eval('#menu-grid .candy-card', (nodes) => nodes.length);
  check('menu shows five candy letters', cards === 5, `cards=${cards}`);
  const menuPainted = await paintedPixels(page, '#menu-grid .candy-card canvas', 13);
  check('menu lollipops are painted', menuPainted > 200, String(menuPainted));
  await shot(page, 'menu');

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await sleep(350);
  const rotateVisible = await page.$eval('#rotate-hint', (node) => !node.hidden);
  check('portrait viewport shows rotate hint', rotateVisible);
  await shot(page, 'portrait-hint');
  report.viewports.push({ name: 'portrait-390x844', rotateHint: rotateVisible });
  await page.setViewport({ width: 1024, height: 600, hasTouch: true });
  await sleep(300);

  await page.click('#menu-grid .candy-card[data-letter="а"]');
  await waitForScreen(page, 'letter');
  await sleep(300);
  const big = await page.$eval('#letter-big', (node) => node.textContent.trim());
  check('letter card shows А', big === 'А', big);
  const cardPainted = await paintedPixels(page, '#letter-canvas', 97);
  check('letter lollipop is painted', cardPainted > 20, String(cardPainted));
  await shot(page, 'letter-a');

  const album = await page.evaluate(() => {
    window.__GAME_TEST__.dispatch({ type: 'open-album' });
    return [...document.querySelectorAll('#album-grid .box-slot')].length;
  });
  check('album shows five box slots', album === 5, String(album));
  await sleep(300);
  await shot(page, 'album-empty');
  await page.evaluate(() => window.__GAME_TEST__.dispatch({ type: 'menu' }));
  await page.close();
}

async function scenarioFullRound(browser) {
  const page = await newGamePage(browser);
  await page.click('#menu-grid .candy-card[data-letter="а"]');
  await waitForScreen(page, 'letter');
  await clickSelector(page, '#start-trace');
  await waitForScreen(page, 'trace');
  await sleep(400);
  const boardPainted = await paintedPixels(page, '#trace-board', 89);
  check('wafer board with dashed strokes is painted', boardPainted > 100, String(boardPainted));
  await shot(page, 'trace-start');

  await traceWithPointer(page, '#trace-board', 'а');
  await sleep(150);
  const traced = await page.evaluate(() => window.__GAME_TEST__.getState());
  check('three real strokes complete the trace', traced.traceStrokesDone === 3, `strokesDone=${traced.traceStrokesDone}`);
  // Глазурь ребёнка остаётся на доске, пока он сам не нажмёт «Дальше».
  await sleep(300);
  await shot(page, 'trace-done');
  const stillTrace = await page.evaluate(() => window.__GAME_TEST__.getState().screen);
  check('finished trace stays visible until the child continues', stillTrace === 'trace', stillTrace);

  await clickSelector(page, '#trace-next');
  await waitForScreen(page, 'listen');
  const afterTrace = await page.evaluate(() => window.__GAME_TEST__.getState());
  check('trace hands over to the listening game', afterTrace.screen === 'listen', afterTrace.screen);
  await sleep(500);
  await shot(page, 'listen');

  const options = await page.$$eval('#listen-grid .listen-candy', (nodes) => nodes.map((node) => node.dataset.letter));
  check('listen shows five unique options', new Set(options).size === 5, options.join(','));
  check('listen includes the target letter', options.includes('а'), options.join(','));

  for (let i = 1; i <= 3; i += 1) {
    await clickSelector(page, '#listen-grid .listen-candy[data-letter="а"]');
    await sleep(320);
    const summary = await page.evaluate(() => window.__GAME_TEST__.getSummary());
    check(`listen answer ${i} counted`, summary.screen === 'listen' || summary.screen === 'write', JSON.stringify(summary));
  }
  await waitForScreen(page, 'write');
  await sleep(350);
  await shot(page, 'write-empty');

  await traceWithPointer(page, '#write-board', 'а');
  await sleep(150);
  await shot(page, 'write-drawn');
  await clickSelector(page, '#write-next');
  await waitForScreen(page, 'sticker');
  await sleep(450);
  await shot(page, 'sticker');
  const afterSticker = await page.evaluate(() => window.__GAME_TEST__.getSummary());
  check('sticker earned', afterSticker.stickers === 1, JSON.stringify(afterSticker));

  // Новая вкладка — как повторный запуск установленного приложения.
  const reopened = await newGamePage(browser);
  const reloaded = await reopened.evaluate(() => window.__GAME_TEST__.getSummary());
  check('progress survives reload', reloaded.stickers === 1, JSON.stringify(reloaded));
  await shot(reopened, 'menu-with-sticker');
  await clickSelector(reopened, '#open-album');
  await waitForScreen(reopened, 'album');
  await sleep(300);
  await shot(reopened, 'album-filled');
  await reopened.close();
  await page.close();
}

async function scenarioLosePath(browser) {
  const page = await newGamePage(browser);
  await page.evaluate(() => {
    const t = window.__GAME_TEST__;
    t.reset(4242);
    t.dispatch({ type: 'choose-letter', letterId: 'о' });
    t.dispatch({ type: 'start-trace' });
    t.submitIdealTrace('о');
  });
  await waitForScreen(page, 'listen');
  await sleep(400);
  const wrong = await page.$eval('#listen-grid .listen-candy:not([data-letter="о"])', (node) => node.dataset.letter);
  for (let i = 0; i < 3; i += 1) {
    await clickSelector(page, `#listen-grid .listen-candy[data-letter="${wrong}"]`);
    await sleep(300);
  }
  await waitForScreen(page, 'empty-box');
  await sleep(400);
  await shot(page, 'empty-box');
  const lost = await page.evaluate(() => window.__GAME_TEST__.getSummary());
  check('three mistakes empty the candy box', lost.lives === 0 && lost.stickers === 0, JSON.stringify(lost));
  await clickSelector(page, '#empty-retry');
  await waitForScreen(page, 'letter');
  const refilled = await page.evaluate(() => window.__GAME_TEST__.getState().lives);
  check('refill restores three candies', refilled === 3, String(refilled));
  await page.close();
}

async function scenarioWinAndParent(browser) {
  const page = await newGamePage(browser);
  const win = await page.evaluate(async () => {
    const t = window.__GAME_TEST__;
    t.reset(777);
    for (const id of ['а', 'о', 'у', 'м', 'с']) {
      t.dispatch({ type: 'choose-letter', letterId: id });
      t.dispatch({ type: 'start-trace' });
      t.submitIdealTrace(id);
      for (let i = 0; i < 3; i += 1) t.dispatch({ type: 'answer-listen', letterId: id });
      t.submitIdealWrite(id);
    }
    return t.getSummary();
  });
  check('all five stickers win the game', win.status === 'won' && win.stickers === 5, JSON.stringify(win));
  await waitForScreen(page, 'win');
  await sleep(500);
  await shot(page, 'win');

  await clickSelector(page, '#win-album');
  await waitForScreen(page, 'album');
  await sleep(350);
  await shot(page, 'album-full');
  const filled = await page.$$eval('#album-grid .box-slot.filled', (nodes) => nodes.length);
  check('album shows five filled slots', filled === 5, String(filled));

  await page.evaluate(() => window.__GAME_TEST__.dispatch({ type: 'menu' }));
  await clickSelector(page, '#open-parent');
  await waitForScreen(page, 'parent');
  await sleep(350);
  await shot(page, 'parent');
  const stats = await page.$eval('#parent-stats', (node) => node.textContent);
  check('parent mode reports five stickers', stats.includes('5 из 5'), stats.replace(/\s+/g, ' '));
  await clickSelector(page, '#reset-progress');
  await waitForScreen(page, 'menu');
  const reset = await page.evaluate(() => window.__GAME_TEST__.getSummary());
  check('parent reset clears the box', reset.stickers === 0, JSON.stringify(reset));

  // В headless нет GPU: SwiftShader честно медленный, поэтому бюджет меряем
  // стоимостью одного кадра сцены, а наблюдаемый FPS пишем в отчёт как справку.
  report.observedHeadlessFps = await page.evaluate(() => window.__GAME_TEST__.clockProgress());
  const frameMs = await page.evaluate(() => window.__GAME_TEST__.benchFrame(24));
  report.frameBudgetMs = Math.round(frameMs * 100) / 100;
  check('one scene frame fits the 30 fps budget (< 33 ms)', frameMs < 33, `frame=${report.frameBudgetMs} ms`);

  const assets = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((entry) => ({ name: entry.name, bytes: entry.encodedBodySize || 0 })),
  );
  report.assets = assets.map((item) => ({ name: item.name.replace(GAME_URL, './'), bytes: item.bytes }));
  report.assetBytes = assets.reduce((sum, item) => sum + item.bytes, 0);
  check('initial payload stays under 0.5 MB', report.assetBytes < 512 * 1024, `${report.assetBytes} bytes`);
  await page.close();
}

async function scenarioMobileViewports(browser) {
  for (const viewport of [
    { width: 844, height: 390, name: 'landscape-844x390' },
    { width: 915, height: 412, name: 'landscape-915x412' },
  ]) {
    const page = await newGamePage(browser, viewport);
    const info = await page.evaluate(() => ({
      rotate: !document.getElementById('rotate-hint').hidden,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      cards: document.querySelectorAll('#menu-grid .candy-card').length,
    }));
    check(`${viewport.name} fits without overflow`, !info.overflow && !info.rotate, JSON.stringify(info));
    await page.click('#menu-grid .candy-card[data-letter="м"]');
    await waitForScreen(page, 'letter');
    await sleep(300);
    await shot(page, viewport.name);
    const traceInfo = await page.evaluate(() => {
      window.__GAME_TEST__.dispatch({ type: 'start-trace' });
      const rect = document.querySelector('#trace-board').getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });
    check(`${viewport.name} trace board is usable`, Math.min(traceInfo.width, traceInfo.height) >= 200, JSON.stringify(traceInfo));
    await sleep(320);
    await shot(page, `trace-${viewport.name}`);
    report.viewports.push({ ...viewport, ...info, board: traceInfo });
    await page.close();
  }
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/tmp/chromium',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-gpu-sandbox',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-zygote',
      '--headless',
    ],
  });

  try {
    await scenarioMenuAndLetter(browser);
    await scenarioFullRound(browser);
    await scenarioLosePath(browser);
    await scenarioWinAndParent(browser);
    await scenarioMobileViewports(browser);
    check('no console errors', report.consoleErrors.length === 0, report.consoleErrors.slice(0, 4).join(' | '));
    check('no external requests', report.externalRequests.length === 0, report.externalRequests.slice(0, 4).join(' | '));
    report.passed = true;
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(REPORTS, 'candy-letters-round.json'), `${JSON.stringify(report, null, 2)}\n`);
  const failed = report.checks.filter((item) => !item.passed);
  console.log(`Browser QA: ${report.checks.length - failed.length}/${report.checks.length} checks passed`);
  console.log(`Screenshots: ${report.screenshots.length}, FPS: ${report.fps}, assets: ${report.assetBytes} bytes`);
  if (failed.length) {
    console.error(failed);
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  fs.writeFileSync(
    path.join(REPORTS, 'candy-letters-round.json'),
    `${JSON.stringify({ ...report, passed: false, error: String(error) }, null, 2)}\n`,
  );
  process.exitCode = 1;
});
