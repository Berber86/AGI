// Silent exploration regression: no route hints, working touch selection, offline.
// node explorationqa.mjs [gameURL]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.argv.find((a) => /^https?:/.test(a)) || 'http://127.0.0.1:8900/index.html';
const OUT = process.env.QA_OUT || path.resolve('test-results/exploration'); fs.mkdirSync(OUT, { recursive: true });
const results = [], errors = [];
const check = (name, pass, detail) => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${JSON.stringify(detail)}`); };
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 915, height: 412, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } });
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
  await page.evaluate(() => { __TEST__.pinQuality(0); __TEST__.internals().governor.hold(10000); });
  const labels = await page.evaluate(() => {
    let maps = 0;
    __TEST__.internals().forks.group.traverse((o) => {
      const m = o.material?.map;
      if (m?.isCanvasTexture && ((m.image.width === 640 && m.image.height === 256) || (m.image.width === 128 && m.image.height === 256))) maps++;
    });
    return { absentDOM: !document.querySelector('#fork-hint, #fork-live, [data-fork-side]'), directionTextures: maps };
  });
  check('no direction overlay, live announcement, named signboards or painted fork arrows', labels.absentDOM && labels.directionTextures === 0, labels);
  for (let fi = 0; fi < 2; fi++) for (const side of [-1, 1]) {
    await page.evaluate((fi) => {
      const T = __TEST__, { track } = T.internals(); T.startRace(); T.holdSteer(null);
      T.setProgress((track.routes.forks[fi].s0 - 20) / track.length, 0, false);
    }, fi);
    const id = side < 0 ? '#btn-left' : '#btn-right', r = await (await page.$(id)).boundingBox();
    await page.touchscreen.touchStart(r.x + r.width / 2, r.y + r.height / 2);
    const result = await page.evaluate((fi) => {
      const T = __TEST__, { track } = T.internals(), f = track.routes.forks[fi];
      for (let i = 0; i < 210 && T.jumpInfo().s < f.s0 + 4; i++) T.step(1 / 60, 1, false);
      return { selected: f.selected, noHints: !document.querySelector('#fork-hint, #fork-live, [data-fork-side]'), state: T.state() };
    }, fi);
    await page.touchscreen.touchEnd();
    const released = await page.$eval(id, (b) => b.getAttribute('aria-pressed') === 'false');
    check(`fork ${fi + 1}: ${side < 0 ? 'left' : 'right'} touch still selects, silently`, result.selected === (side < 0 ? 0 : 1) && result.noHints && released && result.state === 'racing', { ...result, released });
  }
  const phases = await page.evaluate(() => {
    const T = __TEST__, { track } = T.internals(); let checked = 0, unexpected = 0;
    for (const f of track.routes.forks) for (let side = 0; side < 2; side++) for (const q of [-.2, 0, .08, .5, 1.05]) {
      T.chooseFork(f.id, side); T.setProgress((f.s0 + f.span * q) / track.length, 0, true); T.step(1 / 60, 1, false); checked++;
      if (document.querySelector('#fork-hint, #fork-live, [data-fork-side]')) unexpected++;
    }
    return { checked, unexpected };
  });
  check('no hints before, at, within or after either fork', phases.checked === 20 && phases.unexpected === 0, phases);
  await page.evaluate(() => {
    const T = __TEST__, { track, governor } = T.internals(); T.startRace(); T.chooseFork(track.routes.forks[0].id, 0);
    T.setProgress((track.routes.forks[0].s0 + 8) / track.length, 0, true);
    T.pinQuality(1); governor.hold(10000); T.step(1 / 60, 15, false); T.snapCamera(); T.step(1 / 60, 1, true);
  });
  await page.screenshot({ path: path.join(OUT, 'fork-without-hints.webp'), type: 'webp', quality: 84 });
  const finish = await page.evaluate(() => {
    const T = __TEST__; T.setProgress(.999, 0, false); T.step(1 / 60, 60, false);
    const recap = document.getElementById('finish-route');
    return { state: T.state(), recap: recap.textContent, visible: recap.getBoundingClientRect().height > 0 };
  });
  check('post-race recap is retained', finish.state === 'finish' && finish.visible && finish.recap.includes('Твой маршрут:'), finish);
  await page.waitForFunction('navigator.serviceWorker.controller?.state === "activated"', { timeout: 15000 });
  const cache = await page.evaluate(async () => {
    const c = await caches.open('ckc-v23'), html = await c.match('./index.html');
    return { present: !!html, noOverlay: html ? !(await html.text()).includes('id="fork-hint"') : false };
  });
  check('v23 cache replaces the previous hint UI', cache.present && cache.noOverlay, cache);
  await page.setOfflineMode(true); await page.reload({ waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
  const offline = await page.evaluate(() => ({ ready: document.body.dataset.boot, forks: __TEST__.forks().length,
    noHints: !document.querySelector('#fork-hint, #fork-live, [data-fork-side]') }));
  check('offline reload keeps both forks without restoring hints', offline.ready === 'ready' && offline.forks === 2 && offline.noHints, offline);
  await page.setOfflineMode(false);
  check('no browser errors', errors.length === 0, errors);
} catch (e) { check('test execution', false, e.stack); }
finally { fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ baseURL: BASE, results, errors }, null, 2)); await browser.close(); }
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} exploration checks passed`);
process.exitCode = results.some((r) => !r.pass) ? 1 : 0;
