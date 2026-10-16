// vrperf.mjs — аудит кадра VR-режима и регрессия по перф-правкам F1–F3.
//
// Считает на ОДНОМ И ТОМ ЖЕ кадре трассы (обычный режим vs стереопара):
//   * вызовы renderer.render() и сколько из них несут теневой проход;
//   * draw calls и треугольники по проходам;
//   * пиксели глаз и теневой карты;
// и проверяет инварианты правок:
//   F1 — теневая карта в VR обновляется ОДИН раз за кадр (не два);
//   F2 — VR-профиль губернатора: pixelRatio в VR не перезаписывается сменой
//        уровня, карта теней ≤1024², тип PCF; вход в VR срезает High;
//   F3 — MSAA выключен (antialias:false), сэмплов у таргетов composer нет.
//
// Время кадра в software-GL носит справочный характер и НЕ является
// доказательством для телефона: медианы плавают от прогона к прогону.
// Usage: node vrperf.mjs [u=0.42] [dpr=1|3] [lookMode=camera|forward]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const U = Number(process.argv[2] || 0.42);
const DPR = Number(process.argv[3] || 1);
const LOOK = process.argv[4] || 'camera';

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
  const acc = { renderCalls: 0, shadowRenderCalls: 0, shadowDraws: 0, visibleDraws: 0, shadowTri: 0, visibleTri: 0 };
  let shadowInThisCall = false;
  const origBD = renderer.renderBufferDirect;
  const origRender = renderer.render;
  const triOf = (geometry, object, group) => {
    let n = geometry.index ? geometry.index.count : geometry.attributes.position.count;
    if (group) n = Math.min(n, group.count);
    n = Math.min(n, geometry.drawRange.count);
    const inst = object.isInstancedMesh ? object.count : (geometry.isInstancedBufferGeometry ? geometry.instanceCount : 1);
    return (n / 3) * inst;
  };
  renderer.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    const shadow = material.isMeshDepthMaterial || material.isMeshDistanceMaterial;
    if (shadow) { acc.shadowDraws++; acc.shadowTri += triOf(geometry, object, group); shadowInThisCall = true; }
    else { acc.visibleDraws++; acc.visibleTri += triOf(geometry, object, group); }
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
    reset() { for (const k of Object.keys(acc)) acc[k] = 0; },
    measure(reps = 5) {
      const times = [];
      this.reset();
      for (let i = 0; i < reps; i++) {
        const t0 = performance.now();
        window.__TEST__.step(1 / 60, 1, true);
        times.push(performance.now() - t0);
      }
      times.sort((a, b) => a - b);
      const out = {
        msMedianSoftware: +times[Math.floor(reps / 2)].toFixed(1),
        renderCalls: +(acc.renderCalls / reps).toFixed(2),
        shadowRenderCalls: +(acc.shadowRenderCalls / reps).toFixed(2),
        shadowDraws: +(acc.shadowDraws / reps).toFixed(1),
        visibleDraws: +(acc.visibleDraws / reps).toFixed(1),
        shadowTri: Math.round(acc.shadowTri / reps),
        visibleTri: Math.round(acc.visibleTri / reps),
      };
      out.drawsTotal = +(out.shadowDraws + out.visibleDraws).toFixed(1);
      out.triTotal = out.shadowTri + out.visibleTri;
      this.reset();
      return out;
    },
    facts() {
      const { renderer, composer, world, governor } = window.__TEST__.internals();
      const info = window.__TEST__.vrInfo();
      const pr = renderer.getPixelRatio();
      const sh = world.sun.shadow;
      let eyes = null;
      if (info.layout) {
        const side = Math.round(info.layout.side * pr);
        eyes = { sideCss: info.layout.side, pxPerEye: side * side, pxBothEyes: 2 * side * side };
      }
      return {
        vr: info.active, lookMode: info.lookMode, gyro: info.gyro, lookSource: info.lookSource,
        dpr: window.devicePixelRatio, pixelRatio: pr, governorTier: governor.tier, governorVr: governor.vr,
        antialias: renderer.getContext().getContextAttributes().antialias,
        composerSamples: composer.renderTarget1.samples,
        shadowType: renderer.shadowMap.type, shadowEnabled: renderer.shadowMap.enabled,
        shadowSize: [sh.mapSize.x, sh.mapSize.y], shadowAutoUpdate: renderer.shadowMap.autoUpdate,
        eyes,
        scenePxPerFrame: (eyes ? eyes.pxBothEyes : 0),
      };
    },
  };
});

const checks = [];
const check = (name, pass, detail) => {
  checks.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};
const show = (label, obj) => console.log(label.padEnd(26), JSON.stringify(obj));
const freezeAt = (u) => page.evaluate((u) => { window.__TEST__.setProgress(u, 0, true); window.__TEST__.snapCamera(); window.__TEST__.step(1 / 60, 2, true); }, u);

console.log(`\n=== витрина кадра (u=${U}, dpr=${DPR}, взгляд «${LOOK}») ===`);
await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); window.__TEST__.holdSteer(0); });
await freezeAt(U);
const normalFrame = await page.evaluate(() => window.__AUD__.measure(5));
const normalFacts = await page.evaluate(() => window.__AUD__.facts());
show('normal High frame', normalFrame);
show('normal High facts', normalFacts);

await page.evaluate((look) => window.__TEST__.vrStart(look, 30), LOOK);
await freezeAt(U);
const vrFrame = await page.evaluate(() => window.__AUD__.measure(5));
const vrFacts = await page.evaluate(() => window.__AUD__.facts());
show('VR frame', vrFrame);
show('VR facts', vrFacts);

console.log('\n=== регрессия F1–F3 ===');
check('F1: теневая карта в VR обновляется один раз за кадр, а не два',
  vrFrame.shadowRenderCalls === 1 && vrFrame.renderCalls === 2,
  { renderCalls: vrFrame.renderCalls, shadowRenderCalls: vrFrame.shadowRenderCalls });
check('F1: теневые draw calls в VR не удвоены относительно обычной игры',
  vrFrame.shadowDraws < normalFrame.shadowDraws * 1.35,
  { vr: vrFrame.shadowDraws, normal: normalFrame.shadowDraws });
check('F1: shadowMap.autoUpdate возвращён в true после кадра',
  vrFacts.shadowAutoUpdate === true, vrFacts.shadowAutoUpdate);
check('F2: вход в VR срезал High до Medium',
  vrFacts.governorVr === true && vrFacts.governorTier <= 1, { tier: vrFacts.governorTier, vr: vrFacts.governorVr });

const govProbe = await page.evaluate(() => {
  const { renderer, world, governor } = window.__TEST__.internals();
  const pr = (t) => { window.__TEST__.pinQuality(t); return renderer.getPixelRatio(); };
  const out = { onEntry: renderer.getPixelRatio(), dpr: window.devicePixelRatio };
  out.afterTier2 = pr(2); out.afterTier1 = pr(1); out.afterTier0 = pr(0);
  out.tierAfter = governor.tier;
  out.shadowSizeTier0 = [...(({ world }) => [world.sun.shadow.mapSize.x, world.sun.shadow.mapSize.y])({ world })];
  window.__TEST__.pinQuality(1);
  out.shadowSizeTier1 = [world.sun.shadow.mapSize.x, world.sun.shadow.mapSize.y];
  out.shadowType = renderer.shadowMap.type;
  return out;
});
check('F2: смена уровня в VR не трогает VR-разрешение',
  govProbe.afterTier2 === govProbe.onEntry && govProbe.afterTier1 === govProbe.onEntry && govProbe.afterTier0 === govProbe.onEntry,
  govProbe);
check('F2: карта теней в VR не больше 1024² и тип PCF (1)',
  govProbe.shadowSizeTier1[0] === 1024 && govProbe.shadowType === 1, { size: govProbe.shadowSizeTier1, type: govProbe.shadowType });
check('F3: MSAA выключен, у таргетов composer сэмплов нет',
  vrFacts.antialias === false && vrFacts.composerSamples === 0, { antialias: vrFacts.antialias, samples: vrFacts.composerSamples });

console.log('\n=== выход из VR: настройки возвращаются ===');
const exitFacts = await page.evaluate(() => {
  window.__TEST__.pinQuality(2);
  window.__TEST__.vrStop();
  window.__TEST__.step(1 / 60, 2, true);
  const { renderer, world, governor } = window.__TEST__.internals();
  return { pixelRatio: renderer.getPixelRatio(), dpr: window.devicePixelRatio, shadowType: renderer.shadowMap.type,
    shadowSize: [world.sun.shadow.mapSize.x, world.sun.shadow.mapSize.y], tier: governor.tier, vr: governor.vr, antialias: renderer.getContext().getContextAttributes().antialias };
});
show('после выхода из VR', exitFacts);
check('после выхода из VR: обычный pixelRatio по dpr и PCFSoft-тени',
  exitFacts.vr === false && exitFacts.pixelRatio === Math.min(exitFacts.dpr, 2) && exitFacts.shadowType === 2 && exitFacts.shadowSize[0] === 2048,
  exitFacts);

// Естественный путь (без pinQuality): входим в VR с High и выходим —
// качество обычной игры не должно остаться заниженным навсегда.
const natural = await page.evaluate(() => {
  const { renderer, world, governor } = window.__TEST__.internals();
  window.__TEST__.toMenu();
  window.__TEST__.pinQuality(2);
  const before = { tier: governor.tier, pixelRatio: renderer.getPixelRatio() };
  window.__TEST__.vrStart('camera', 30);
  const inVr = { tier: governor.tier, pixelRatio: renderer.getPixelRatio(), shadow: world.sun.shadow.mapSize.x };
  window.__TEST__.vrStop();
  window.__TEST__.step(1 / 60, 2, true);
  const after = { tier: governor.tier, pixelRatio: renderer.getPixelRatio(), shadow: world.sun.shadow.mapSize.x };
  return { before, inVr, after };
});
show('natural VR round-trip', natural);
check('выход из VR возвращает уровень меню (не остаётся облегчённым)',
  natural.after.tier === natural.before.tier && natural.after.pixelRatio === natural.before.pixelRatio
  && natural.after.shadow === 2048 && natural.inVr.shadow === 1024,
  natural);

const failed = checks.filter((c) => !c.pass);
console.log(`\nVRPERF: ${checks.length - failed.length}/${checks.length} passed (u=${U}, dpr=${DPR}, look=${LOOK})`);
if (failed.length) console.log('FAILED:', failed.map((c) => c.name).join(' | '));
await browser.close();
process.exit(failed.length ? 1 : 0);
