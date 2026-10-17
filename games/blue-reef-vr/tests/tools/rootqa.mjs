// rootqa.mjs — витрина: новая игра реально открывается из корневого index.html.
//   node rootqa.mjs
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const ROOT_URL = process.env.ROOT_URL || 'http://127.0.0.1:8899/index.html';
const GAME_PATH = '/games/blue-reef-vr/index.html';
const ROOT = process.env.ROOT || '/home/user/AGI/games/blue-reef-vr';
const REPORT = path.join(ROOT, '.studio/evidence/reports/rootqa.json');

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail: String(detail) });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ` — ${detail}` : ''));
};

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
    '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 900, height: 700, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text().slice(0, 200)); });
page.on('requestfailed', (r) => pageErrors.push('REQFAIL ' + r.url().slice(-60)));

await page.goto(ROOT_URL, { waitUntil: 'load', timeout: 120000 });

// Карточка есть и ведёт в игру
{
  const cards = await page.evaluate((gamePath) => {
    const all = [...document.querySelectorAll('.card')];
    return {
      total: all.length,
      titles: all.map((c) => (c.querySelector('h2') || {}).textContent || ''),
      hrefs: all.map((c) => (c.querySelector('a.play') || {}).getAttribute?.('href') || ''),
      mine: all.filter((c) => (c.querySelector('a.play') || {}).getAttribute?.('href') === '.' + gamePath).length,
    };
  }, GAME_PATH);
  check('витрина: карточка игры есть и ровно одна', cards.mine === 1, `карточек всего ${cards.total}: ${cards.titles.join(' | ')}`);

  const link = await page.evaluate((gamePath) => {
    const a = [...document.querySelectorAll('a.play')].find((x) => x.getAttribute('href') === '.' + gamePath);
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return { text: a.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) };
  }, GAME_PATH);
  check('витрина: кнопка «Играть» заметна и крупная', link && link.h >= 40 && link.text.includes('Играть'), JSON.stringify(link));

  const thumb = await page.evaluate((gamePath) => {
    const img = [...document.querySelectorAll('img.thumb')].find((i) => (i.closest('.card')?.querySelector('a.play') || {}).getAttribute?.('href') === '.' + gamePath);
    return img ? { src: img.getAttribute('src'), complete: img.complete, w: img.naturalWidth, h: img.naturalHeight } : null;
  }, GAME_PATH);
  check('витрина: обложка загрузилась', thumb && thumb.complete && thumb.w > 0, JSON.stringify(thumb));
  check('витрина: обложка 16:9', thumb && Math.abs(thumb.w / thumb.h - 16 / 9) < 0.02, thumb ? `${thumb.w}×${thumb.h}` : 'нет');
}

// Реальный переход: клик по кнопке ведёт в игру, и игра поднимается
{
  const target = await page.evaluate((gamePath) => {
    const a = [...document.querySelectorAll('a.play')].find((x) => x.getAttribute('href') === '.' + gamePath);
    a.click();
    return location.href;
  }, GAME_PATH);
  await page.waitForNavigation({ waitUntil: 'load', timeout: 120000 }).catch(() => {});
  const url = page.url();
  check('переход: клик открывает игру по относительному пути', url.endsWith(GAME_PATH), `${target} → ${url}`);
  let booted = true;
  try {
    await page.waitForFunction('window.__TEST__ && window.__TEST__.ready === true', { timeout: 180000 });
  } catch { booted = false; }
  const st = booted ? await page.evaluate(() => window.__TEST__.state()) : null;
  check('переход: игра поднимается из витрины', booted === true, st ? JSON.stringify({ mode: st.mode, preset: st.preset }) : 'не поднялась');
  if (booted) {
    const world = await page.evaluate(() => window.__TEST__.worldInfo());
    check('переход: мир на месте (рыбы и кит)', world.fishTotal > 0 && world.whale.lengthM > 0, `рыб ${world.fishTotal}, кит ${world.whale.lengthM} м`);
  }
}

check('нет ошибок страницы и битых запросов', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

const passed = results.filter((r) => r.ok).length;
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify({
  suite: 'rootqa',
  generatedAt: new Date().toISOString(),
  rootUrl: ROOT_URL,
  total: results.length,
  passed,
  failed: results.length - passed,
  results,
}, null, 2) + '\n');
console.log(`\nROOTQA ${passed}/${results.length}`);
await browser.close();
process.exit(passed === results.length ? 0 : 1);
