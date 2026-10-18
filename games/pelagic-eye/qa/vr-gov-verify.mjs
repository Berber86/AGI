// reefverify.mjs — проверка трёх VR-правок рифа (v2: губернатор замораживается
// во время замеров, порядок: чистые счётчики tier 2 → 1 → 0 → естественный
// срез → выход → balanced).
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 300)));
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto('http://127.0.0.1:8899/games/pelagic-eye/play/index.html', { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 4000));
const click = async (t, nth = 0) => {
  const ok = await page.evaluate((t, nth) => {
    const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').trim().includes(t));
    if (!b[nth]) return false;
    b[nth].click();
    return true;
  }, t, nth);
  await new Promise((r) => setTimeout(r, 900));
  return ok;
};
const clickExact = async (t, nth = 0) => {
  const ok = await page.evaluate((t, nth) => {
    const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').trim() === t);
    const target = b[nth] || b[b.length - 1];
    if (!target) return false;
    target.click();
    return true;
  }, t, nth);
  await new Promise((r) => setTimeout(r, 900));
  return ok;
};
await click('Начать погружение');
await new Promise((r) => setTimeout(r, 6000));

await page.evaluate(() => {
  const r = window.__REEF__.renderer;
  const acc = { renderCalls: 0, shadowRenderCalls: 0, shadowDraws: 0, visibleDraws: 0, transDraws: 0 };
  let shadowInThisCall = false;
  const origBD = r.renderBufferDirect;
  const origRender = r.render;
  r.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    const shadow = material.isMeshDepthMaterial || material.isMeshDistanceMaterial;
    if (shadow) { acc.shadowDraws++; shadowInThisCall = true; }
    else {
      acc.visibleDraws++;
      if (material.transparent) acc.transDraws++;
    }
    return origBD.apply(this, arguments);
  };
  r.render = function (scene, camera) {
    acc.renderCalls++;
    shadowInThisCall = false;
    const out = origRender.apply(this, arguments);
    if (shadowInThisCall) acc.shadowRenderCalls++;
    return out;
  };
  window.__AUD__ = {
    reset() { for (const k of Object.keys(acc)) acc[k] = 0; },
    async measure(frames = 10) {
      this.reset();
      for (let i = 0; i < frames; i++) await new Promise((res) => requestAnimationFrame(res));
      return {
        renderCalls: +(acc.renderCalls / frames).toFixed(2),
        shadowRenderCalls: +(acc.shadowRenderCalls / frames).toFixed(2),
        shadowDraws: +(acc.shadowDraws / frames).toFixed(1),
        visibleDraws: +(acc.visibleDraws / frames).toFixed(1),
        transDraws: +(acc.transDraws / frames).toFixed(1),
      };
    },
    vis() {
      const w = window.__REEF__;
      return {
        tier: w.vrGovTier,
        contactShadows: w.contactShadows.visible,
        causticFloor: w.causticFloor.visible,
        shaftsVisible: w.shafts.filter((s) => s.visible).length,
        snowDrawRange: w.marineSnow.geometry.drawRange.count,
        keyCastShadow: w.keyLight.castShadow,
      };
    },
  };
});

const report = { errors };
report.composerNormal = await page.evaluate(() => {
  const t = window.__REEF__.composer.renderTarget1;
  return { samples: t.samples, w: t.width, h: t.height };
});

// ---- вход в VR; сразу замораживаем губернатор на tier 2 (качество high)
await page.evaluate(() => [...document.querySelectorAll('[title]')].find((e) => (e.title || '').includes('VR-драйвер'))?.click());
await new Promise((r) => setTimeout(r, 900));
await click('QA-подача');
await clickExact('Смотрю прямо');
const entered = await clickExact('Войти в VR', 1);
await new Promise((r) => setTimeout(r, 3000));
report.vrEntry = await page.evaluate(async () => {
  const w = window.__REEF__;
  w.debugSetVrGovTier(2, true); // freeze
  await new Promise((r) => setTimeout(r, 400));
  return {
    vr: w.settings.vr,
    composerSamplesInVr: w.composer.renderTarget1.samples,
    dpr: w.renderer.getPixelRatio(),
    vis: window.__AUD__.vis(),
  };
});
report.tier2 = await page.evaluate(async () => ({
  stats: await window.__AUD__.measure(10),
  vis: window.__AUD__.vis(),
}));
report.tier1 = await page.evaluate(async () => {
  window.__REEF__.debugSetVrGovTier(1, true);
  return { stats: await window.__AUD__.measure(10), vis: window.__AUD__.vis() };
});
report.tier0 = await page.evaluate(async () => {
  window.__REEF__.debugSetVrGovTier(0, true);
  return { stats: await window.__AUD__.measure(10), vis: window.__AUD__.vis() };
});
report.backTo2 = await page.evaluate(async () => {
  window.__REEF__.debugSetVrGovTier(2, true);
  return { stats: await window.__AUD__.measure(8), vis: window.__AUD__.vis() };
});

// ---- естественный срез: размораживаем, wall-fps в песочнице ~2 → сам упадёт
report.naturalBefore = await page.evaluate(() => {
  window.__REEF__.debugSetVrGovTier(2, false);
  return { tier: window.__REEF__.vrGovTier };
});
await new Promise((r) => setTimeout(r, 12000));
report.naturalAfter = await page.evaluate(() => ({
  tier: window.__REEF__.vrGovTier,
  log: (window.__VR_LOG__ || []).slice(-4),
}));

// ---- выход из VR восстанавливает профиль целиком
await click('Выйти из VR');
await new Promise((r) => setTimeout(r, 2500));
report.afterExit = await page.evaluate(() => {
  const w = window.__REEF__;
  return {
    vr: w.settings.vr,
    shadowMapSize: [w.keyLight.shadow.mapSize.x, w.keyLight.shadow.mapSize.y],
    dpr: w.renderer.getPixelRatio(),
    vis: window.__AUD__.vis(),
  };
});

// ---- balanced в VR = tier 1 из коробки; вход в VR при balanced = tier 1
await page.evaluate(() => window.__REEF__.setQuality('balanced'));
// Кнопка HUD открывает мастерскую; вход делает кнопка уже ВНУТРИ мастерской.
let reentered = false;
for (let i = 0; i < 3 && !reentered; i++) {
  await clickExact('Войти в VR', 1);
  reentered = await page.evaluate(() => window.__REEF__.settings.vr === true);
}
await new Promise((r) => setTimeout(r, 2500));
report.balancedOnEntry = await page.evaluate(() => {
  const w = window.__REEF__;
  w.debugSetVrGovTier(w.vrGovTier, true);
  return { vr: w.settings.vr, quality: w.settings.quality, vis: window.__AUD__.vis() };
});
report.balancedSwitchInVr = await page.evaluate(async () => {
  const w = window.__REEF__;
  w.setQuality('high');
  w.debugSetVrGovTier(2, true);
  w.setQuality('balanced'); // срез прямо в VR
  await new Promise((r) => setTimeout(r, 300));
  return { vr: w.settings.vr, vis: window.__AUD__.vis() };
});
report.buttons = { entered, reentered };
console.log(JSON.stringify(report, null, 1));
await browser.close();
