// vrtri.mjs — сколько треугольников уходит в теневой проход и почему в VR он
// считается дважды. Тот же приём инструментовки, что в drawprof.mjs, но
// раздельно для обычного режима и стереопары.
// Usage: node vrtri.mjs [u=0.42]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const U = Number(process.argv[2] || 0.42);

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });

await page.evaluate(() => {
  const { renderer } = window.__TEST__.internals();
  const orig = renderer.renderBufferDirect;
  const acc = { shadow: { calls: 0, tri: 0 }, visible: { calls: 0, tri: 0 } };
  renderer.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    const b = (material.isMeshDepthMaterial || material.isMeshDistanceMaterial) ? acc.shadow : acc.visible;
    let n = geometry.index ? geometry.index.count : geometry.attributes.position.count;
    if (group) n = Math.min(n, group.count);
    n = Math.min(n, geometry.drawRange.count);
    const inst = object.isInstancedMesh ? object.count : (geometry.isInstancedBufferGeometry ? geometry.instanceCount : 1);
    b.calls++; b.tri += (n / 3) * inst;
    return orig.apply(this, arguments);
  };
  window.__TRI__ = {
    measure(frames = 3) {
      acc.shadow.calls = acc.shadow.tri = acc.visible.calls = acc.visible.tri = 0;
      for (let i = 0; i < frames; i++) window.__TEST__.step(1 / 60, 1, true);
      const out = {
        shadow: { calls: +(acc.shadow.calls / frames).toFixed(1), tri: Math.round(acc.shadow.tri / frames) },
        visible: { calls: +(acc.visible.calls / frames).toFixed(1), tri: Math.round(acc.visible.tri / frames) },
      };
      out.shadowShare = +(out.shadow.tri / (out.shadow.tri + out.visible.tri)).toFixed(3);
      return out;
    },
  };
});

const freeze = (u) => page.evaluate((u) => { window.__TEST__.setProgress(u, 0, true); window.__TEST__.snapCamera(); window.__TEST__.step(1 / 60, 2, true); }, u);

await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); window.__TEST__.holdSteer(0); });
await freeze(U);
console.log('normal High', JSON.stringify(await page.evaluate(() => window.__TRI__.measure(3))));

await page.evaluate(() => { window.__TEST__.vrStart('forward', 10, false, 'auto'); window.__TEST__.pinQuality(2); });
await freeze(U);
console.log('VR High    ', JSON.stringify(await page.evaluate(() => window.__TRI__.measure(3))));
console.log('sceneInfo  ', JSON.stringify(await page.evaluate(() => {
  const { renderer } = window.__TEST__.internals();
  return { programs: renderer.info.programs.length, textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries };
})));
await browser.close();
