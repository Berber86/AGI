// Контрольные кадры зала: старт, вход, ключевые точки, VR-стереопара.
// Запуск: node tests/shot.mjs [http://127.0.0.1:5173/] [tag]
import { launch, openHall, shot } from './browser.mjs';
import fs from 'fs';

const url = process.argv[2] || 'http://127.0.0.1:5173/';
const tag = process.argv[3] || 'run';
const out = `evidence/screenshots/${tag}`;
fs.mkdirSync(out, { recursive: true });

const browser = await launch({ width: 1280, height: 720 });
try {
  const { page, errors } = await openHall(browser, url);
  await shot(page, `${out}/01-start.jpg`, 'стартовый экран');

  await page.evaluate(() => window.__HERMITAGE__.enter());
  await page.evaluate(() => window.__HERMITAGE__.render());
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => window.__HERMITAGE__.render());
  await shot(page, `${out}/02-entry.jpg`, 'у входа');

  const points = await page.evaluate(() => window.__HERMITAGE__.points());
  let i = 3;
  for (const p of points) {
    await page.evaluate((id) => {
      const api = window.__HERMITAGE__;
      api.goto(id);
      api.step(1 / 60, 2);
      api.render();
    }, p.id);
    await new Promise((r) => setTimeout(r, 420));
    await page.evaluate(() => window.__HERMITAGE__.render());
    await new Promise((r) => setTimeout(r, 220));
    await shot(page, `${out}/${String(i).padStart(2, '0')}-point-${p.id}.jpg`, `точка ${p.id} — ${p.name}`);
    i += 1;
  }

  // Крупные планы произведений
  const exhibits = await page.evaluate(() => window.__HERMITAGE__.exhibits());
  for (const ex of exhibits) {
    await page.evaluate((id) => {
      const api = window.__HERMITAGE__;
      api.goto('p3');
      api.lookAtExhibit(id);
      api.step(1 / 60, 2);
      api.render();
    }, ex.id);
    await new Promise((r) => setTimeout(r, 260));
    await page.evaluate(() => window.__HERMITAGE__.render());
    await shot(page, `${out}/exhibit-${ex.id}.jpg`, `экспонат ${ex.id}`);
  }

  // Стереопара (смена isMobile перезагружает страницу — ждём готовности заново)
  await page.setViewport({ width: 1280, height: 720, isMobile: true, hasTouch: true });
  await page.waitForFunction('window.__READY__ === true', { timeout: 240000, polling: 500 });
  await page.evaluate(() => window.__HERMITAGE__.enter());
  await page.evaluate(() => window.__HERMITAGE__.enterVR());
  await new Promise((r) => setTimeout(r, 1400));
  await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    api.goto('p3');
    api.lookAtPoint('p7');
    api.step(1 / 60, 3);
    api.render();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.__HERMITAGE__.render());
  await shot(page, `${out}/vr-stereo.jpg`, 'стереопара VR');
  const info = await page.evaluate(() => window.__HERMITAGE__.info());
  fs.writeFileSync(`${out}/info.json`, JSON.stringify({ info, errors }, null, 2));
  console.log('info', JSON.stringify(info));
  if (errors.length) console.log('ERRORS', errors.slice(0, 10));
} finally {
  await browser.close();
}
