// vrperf.mjs — что именно стоит кадров в VR-режиме (стереопара + джойстик)?
// Сравнивает ОДИН И ТОТ ЖЕ кадр трассы в обычном режиме и в VR:
//   * сколько вызовов renderer.render() на кадр и сколько из них несут теневой проход;
//   * сколько draw call'ов на кадр (всего / теневых);
//   * сколько пикселей растеризуется (глаза против теневой карты);
//   * что делает губернатор качества с pixelRatio в VR.
// Время кадра в software-GL меряем медианой, но в выводы его берём только как
// «software»-ориентир: абсолютные мс не переносятся на телефон.
// Usage: node vrperf.mjs [u=0.42] [dpr=1]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const U = Number(process.argv[2] || 0.42);
const DPR = Number(process.argv[3] || 1);

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: DPR },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });

// --------------------------------------------------------------- инструментовка
await page.evaluate(() => {
  const { renderer } = window.__TEST__.internals();
  const acc = { renderCalls: 0, shadowRenderCalls: 0, shadowDraws: 0, visibleDraws: 0 };
  let shadowInThisCall = false;
  let frames = 0;
  const origBD = renderer.renderBufferDirect;
  const origRender = renderer.render;
  renderer.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    if (material.isMeshDepthMaterial || material.isMeshDistanceMaterial) { acc.shadowDraws++; shadowInThisCall = true; }
    else acc.visibleDraws++;
    return origBD.apply(this, arguments);
  };
  renderer.render = function (scene, camera) {
    acc.renderCalls++;
    shadowInThisCall = false;
    const r = origRender.apply(this, arguments);
    if (shadowInThisCall) acc.shadowRenderCalls++;
    return r;
  };
  window.__AUD__ = {
    acc,
    reset() { acc.renderCalls = 0; acc.shadowRenderCalls = 0; acc.shadowDraws = 0; acc.visibleDraws = 0; frames = 0; },
    measure(reps = 5) {
      const times = [];
      this.reset();
      for (let i = 0; i < reps; i++) {
        const t0 = performance.now();
        window.__TEST__.step(1 / 60, 1, true);
        times.push(performance.now() - t0);
      }
      frames = reps;
      times.sort((a, b) => a - b);
      const out = {
        msMedian: +times[Math.floor(reps / 2)].toFixed(1),
        renderCalls: +(acc.renderCalls / reps).toFixed(2),
        shadowRenderCalls: +(acc.shadowRenderCalls / reps).toFixed(2),
        shadowDraws: +(acc.shadowDraws / reps).toFixed(1),
        visibleDraws: +(acc.visibleDraws / reps).toFixed(1),
      };
      out.drawsTotal = +(out.shadowDraws + out.visibleDraws).toFixed(1);
      this.reset();
      return out;
    },
    pixelAccounting() {
      const { renderer, world } = window.__TEST__.internals();
      const info = window.__TEST__.vrInfo();
      const pr = renderer.getPixelRatio();
      const cw = renderer.domElement.width, ch = renderer.domElement.height;
      const sh = world.sun.shadow;
      const shadowPx = world.sun.castShadow ? sh.mapSize.x * sh.mapSize.y : 0;
      let eyes = null;
      if (info.layout) {
        const side = Math.round(info.layout.side * pr);
        eyes = { sideCss: info.layout.side, pxPerEye: side * side, pxBothEyes: 2 * side * side };
      }
      return {
        dpr: window.devicePixelRatio, pixelRatio: pr, buffer: `${cw}x${ch}`, bufferPx: cw * ch,
        vr: info.active, lookMode: info.lookMode, baselineCm: info.baselineCm, eyes,
        shadowMapPx: shadowPx, shadowSize: [sh.mapSize.x, sh.mapSize.y], shadowAutoUpdate: renderer.shadowMap.autoUpdate,
        scenePxPerFrame: (eyes ? eyes.pxBothEyes : cw * ch) + shadowPx * (info.active ? 2 : 1),
      };
    },
  };
});

const rows = {};
const show = (label, obj) => { rows[label] = obj; console.log(label.padEnd(30), JSON.stringify(obj)); };

const freezeAt = (u) => page.evaluate((u) => {
  window.__TEST__.setProgress(u, 0, true);
  window.__TEST__.snapCamera();
  window.__TEST__.step(1 / 60, 2, true);
}, u);

// --- 1. обычная игра, High ---------------------------------------------------
await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); window.__TEST__.holdSteer(0); });
await freezeAt(U);
show('normal High', await page.evaluate(() => window.__AUD__.measure(5)));
show('normal High pixels', await page.evaluate(() => window.__AUD__.pixelAccounting()));

// --- 2. VR-поездка, тот же кадр, High ---------------------------------------
await page.evaluate((u) => { window.__TEST__.vrStart('forward', 10, false, 'auto'); window.__TEST__.pinQuality(2); }, U);
await freezeAt(U);
show('VR High', await page.evaluate(() => window.__AUD__.measure(5)));
show('VR High pixels', await page.evaluate(() => window.__AUD__.pixelAccounting()));

// --- 3. VR High без теней (насколько теневой проход определяет кадр) --------
await page.evaluate(() => { window.__TEST__.pinQuality(0); });
await freezeAt(U);
show('VR Low (без теней)', await page.evaluate(() => window.__AUD__.measure(5)));
show('VR Low pixels', await page.evaluate(() => window.__AUD__.pixelAccounting()));

// --- 4. VR High + тени один раз на кадр (эмуляция возможного фикса) ---------
await page.evaluate(() => {
  window.__TEST__.pinQuality(2);
  const { renderer } = window.__TEST__.internals();
  window.__AUD__.dedup = true;
  renderer.shadowMap.autoUpdate = false;
  const origStep = window.__TEST__.step;
  window.__TEST__.step = function (dt, n, r) { const { renderer } = window.__TEST__.internals(); if (r) renderer.shadowMap.needsUpdate = true; return origStep.call(this, dt, n, r); };
});
await freezeAt(U);
show('VR High тени 1x/кадр', await page.evaluate(() => window.__AUD__.measure(5)));

// --- 5. губернатор качества в VR: чем он перезапишет VR-pixelRatio ----------
show('Губернатор в VR', await page.evaluate(() => {
  const { renderer } = window.__TEST__.internals();
  const out = { vrPixelRatioСейчас: renderer.getPixelRatio(), dpr: window.devicePixelRatio, deviceScaleFactor: window.devicePixelRatio };
  window.__TEST__.pinQuality(2); out.послеTier2 = renderer.getPixelRatio();
  window.__TEST__.pinQuality(1); out.послеTier1 = renderer.getPixelRatio();
  window.__TEST__.pinQuality(0); out.послеTier0 = renderer.getPixelRatio();
  window.__TEST__.pinQuality(2);
  return out;
}));

console.log('\n=== итог ===');
for (const [k, v] of Object.entries(rows)) console.log(k.padEnd(30), JSON.stringify(v));
await page.screenshot({ path: `/home/user/shots/vrperf-dpr${DPR}.png` });
await browser.close();
