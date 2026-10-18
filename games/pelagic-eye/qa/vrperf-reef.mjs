// reefperf.mjs — аудит VR-кадра pelagic-eye (Тишина рифа) тем же методом,
// которым меряли candy-kingdom-coaster (vrperf.mjs): детерминированные счётчики
// draw calls / треугольники / теневые проходы / пиксели, а НЕ миллисекунды в
// software-GL.
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/pelagic-eye/play/index.html';
const DPR = Number(process.argv[2] || 1);

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: DPR },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 300)));
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 4000));

const clickByText = async (text, exact = false, nth = 0) => {
  const ok = await page.evaluate((text, exact, nth) => {
    const buttons = [...document.querySelectorAll('button')].filter((b) => {
      const t = (b.textContent || '').trim();
      return exact ? t === text : t.includes(text);
    });
    if (!buttons[nth]) return false;
    buttons[nth].click();
    return true;
  }, text, exact, nth);
  if (!ok) throw new Error(`button not found: ${text} #${nth}`);
  await new Promise((r) => setTimeout(r, 800));
};
const clickByTitle = async (frag) => {
  const ok = await page.evaluate((frag) => {
    const el = [...document.querySelectorAll('[title]')].find((e) => (e.getAttribute('title') || '').includes(frag));
    if (!el) return false;
    el.click();
    return true;
  }, frag);
  if (!ok) throw new Error(`title not found: ${frag}`);
  await new Promise((r) => setTimeout(r, 800));
};

await clickByText('Начать погружение');
await new Promise((r) => setTimeout(r, 6000));

// --------------------------------------------------------------- инструментовка
await page.evaluate(() => {
  const r = window.__REEF__.renderer;
  const acc = { renderCalls: 0, shadowRenderCalls: 0, shadowDraws: 0, visibleDraws: 0, shadowTri: 0, visibleTri: 0, frames: 0 };
  let shadowInThisCall = false;
  const origBD = r.renderBufferDirect;
  const origRender = r.render;
  const triOf = (geometry, object, group) => {
    let n = geometry.index ? geometry.index.count : geometry.attributes.position.count;
    if (group) n = Math.min(n, group.count);
    n = Math.min(n, geometry.drawRange.count);
    const inst = object.isInstancedMesh ? object.count : (geometry.isInstancedBufferGeometry ? geometry.instanceCount : 1);
    return (n / 3) * inst;
  };
  r.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    const shadow = material.isMeshDepthMaterial || material.isMeshDistanceMaterial;
    if (shadow) { acc.shadowDraws++; acc.shadowTri += triOf(geometry, object, group); shadowInThisCall = true; }
    else { acc.visibleDraws++; acc.visibleTri += triOf(geometry, object, group); }
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
    acc,
    reset() { for (const k of Object.keys(acc)) acc[k] = 0; },
    async measure(frames = 30) {
      this.reset();
      const t0 = performance.now();
      for (let i = 0; i < frames; i++) {
        await new Promise((res) => requestAnimationFrame(res));
      }
      acc.frames = frames;
      const wall = performance.now() - t0;
      return {
        frames,
        msPerFrameSoftware: +(wall / frames).toFixed(1),
        renderCalls: +(acc.renderCalls / frames).toFixed(2),
        shadowRenderCalls: +(acc.shadowRenderCalls / frames).toFixed(2),
        shadowDraws: +(acc.shadowDraws / frames).toFixed(1),
        visibleDraws: +(acc.visibleDraws / frames).toFixed(1),
        shadowTri: Math.round(acc.shadowTri / frames),
        visibleTri: Math.round(acc.visibleTri / frames),
      };
    },
  };
});

const facts = () => page.evaluate(() => {
  const w = window.__REEF__;
  const r = w.renderer;
  let meshes = 0, transparent = 0, skinned = 0, points = 0, lines = 0, lights = 0, doubleSide = 0, withBump = 0, withMap = 0, groups = 0;
  const casters = [];
  w.scene.traverse((o) => {
    if (o.isLight) lights++;
    if (o.isGroup) groups++;
    if (o.isPoints) points++;
    if (o.isLine || o.isLineSegments) lines++;
    if (o.isMesh) {
      meshes++;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (m.transparent) transparent++;
        if (m.side === 2) doubleSide++;
        if (m.bumpMap || m.normalMap) withBump++;
        if (m.map) withMap++;
      }
      if (o.castShadow) casters.push(o.name || o.type);
    }
  });
  const cam = w.camera;
  return {
    calls: r.info.render.calls,
    tri: r.info.render.triangles,
    dpr: r.getPixelRatio(),
    domW: r.domElement.width,
    domH: r.domElement.height,
    stereo: w.settings.vr && w.container.clientWidth > w.container.clientHeight * 1.08,
    vrSetting: w.settings.vr,
    shadowPassesPerPair: w.shadowPassesPerPair,
    shadowAuto: r.shadowMap.autoUpdate,
    shadowEnabled: r.shadowMap.enabled,
    shadowType: r.shadowMap.type,
    shadowMapSize: w.keyLight ? [w.keyLight.shadow.mapSize.x, w.keyLight.shadow.mapSize.y] : null,
    keyCastShadow: w.keyLight ? w.keyLight.castShadow : null,
    shadowFrustum: w.keyLight ? {
      left: w.keyLight.shadow.camera.left, right: w.keyLight.shadow.camera.right,
      top: w.keyLight.shadow.camera.top, bottom: w.keyLight.shadow.camera.bottom,
      near: w.keyLight.shadow.camera.near, far: w.keyLight.shadow.camera.far,
    } : null,
    antialiasContext: (r.getContext().getContextAttributes() || {}).antialias,
    bloomEnabled: w.bloomPass ? w.bloomPass.enabled : null,
    composerTarget: (() => {
      try {
        const t = w.composer?.renderTarget1;
        return t ? { samples: t.samples, w: t.width, h: t.height, type: t.texture.type } : null;
      } catch { return null; }
    })(),
    programs: r.info.programs?.length ?? null,
    geometries: r.info.memory.geometries,
    textures: r.info.memory.textures,
    scene: { meshes, transparent, doubleSide, withBump, withMap, points, lines, lights, groups, casters: casters.length },
    cameraFov: cam.fov, cameraFar: cam.far,
    quality: w.settings.quality,
  };
});

const normalFacts = await facts();
const normalStats = await page.evaluate(() => window.__AUD__.measure(30));
console.log('NORMAL_FACTS', JSON.stringify(normalFacts, null, 1));
console.log('NORMAL_STATS', JSON.stringify(normalStats, null, 1));

// ---- вход в VR через UI (как в qa/counters.mjs)
await clickByTitle('VR-драйвер');
await clickByText('QA-подача');
await clickByText('Смотрю прямо');
await clickByText('Войти в VR', true, 1);
await new Promise((r) => setTimeout(r, 6000));

const vrFacts = await facts();
const vrStats = await page.evaluate(() => window.__AUD__.measure(30));
console.log('VR_FACTS', JSON.stringify(vrFacts, null, 1));
console.log('VR_STATS', JSON.stringify(vrStats, null, 1));
const perf = await page.evaluate(() => window.__PERF__);
console.log('PERF', JSON.stringify(perf, null, 1));

await browser.close();
