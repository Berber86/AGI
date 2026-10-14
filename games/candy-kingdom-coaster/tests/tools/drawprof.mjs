// drawprof.mjs — who issues the draw calls / triangles of ONE real frame?
// Hooks renderer.renderBufferDirect and attributes every call to its scene
// branch, separately for the shadow pass and the colour pass.
// Usage: node drawprof.mjs [u...]
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const US = process.argv.slice(2).map(Number);
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });
await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); });
for (const u of (US.length ? US : [0.12, 0.42, 0.8])) {
  const r = await page.evaluate((u) => {
    const { renderer } = window.__TEST__.internals();
    window.__TEST__.setProgress(u, 0, true); window.__TEST__.snapCamera();
    window.__TEST__.step(1 / 60, 2, true);
    const label = (o) => {
      const chain = [];
      for (let q = o; q && q.type !== 'Scene'; q = q.parent) chain.push(q.name || (q.isInstancedMesh ? 'Inst' : q.type));
      chain.reverse();
      return chain.slice(0, 2).join('/') + (chain.length > 2 ? '/…' + chain[chain.length - 1] : '');
    };
    const rows = new Map();
    const orig = renderer.renderBufferDirect;
    renderer.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
      const rt = renderer.getRenderTarget();
      const pass = camera.isOrthographicCamera && rt && rt.depthTexture == null && material.isMeshDepthMaterial || (rt && rt.texture && rt.texture.name === 'shadow') ? 'shadow' : (camera.isOrthographicCamera && !object.isMesh ? 'post' : (material.type === 'MeshDepthMaterial' || material.type === 'MeshDistanceMaterial' ? 'shadow' : (object.isMesh && object.geometry && object.geometry.attributes.position && object.geometry.attributes.position.count === 3 ? 'post' : 'main')));
      const idx = geometry.index;
      let n = idx ? idx.count : geometry.attributes.position.count;
      if (group) n = Math.min(n, group.count);
      n = Math.min(n, geometry.drawRange.count);
      const inst = object.isInstancedMesh ? object.count : (geometry.isInstancedBufferGeometry ? geometry.instanceCount : 1);
      const tri = (n / 3) * inst;
      const k = pass + ' | ' + label(object);
      const e = rows.get(k) || { calls: 0, tri: 0, mats: new Set() };
      e.calls++; e.tri += tri; e.mats.add(material.type + (material.transparent ? '(T)' : ''));
      rows.set(k, e);
      return orig.apply(this, arguments);
    };
    window.__TEST__.step(1 / 60, 1, true);
    renderer.renderBufferDirect = orig;
    const out = [...rows.entries()].map(([k, v]) => ({ k, calls: v.calls, tri: Math.round(v.tri), mats: [...v.mats].join(',') }));
    const tot = { main: { calls: 0, tri: 0 }, shadow: { calls: 0, tri: 0 }, post: { calls: 0, tri: 0 } };
    for (const o of out) { const p = o.k.split(' | ')[0]; tot[p].calls += o.calls; tot[p].tri += o.tri; }
    return { tot, byCalls: out.slice().sort((a, b) => b.calls - a.calls).slice(0, 22), byTri: out.slice().sort((a, b) => b.tri - a.tri).slice(0, 16) };
  }, u);
  console.log(`\n===== u=${u}  totals ${JSON.stringify(r.tot)}`);
  console.log('-- by draw calls');
  for (const o of r.byCalls) console.log(String(o.calls).padStart(6), String(Math.round(o.tri / 1000) + 'k').padStart(7), o.k, ' ', o.mats);
  console.log('-- by triangles');
  for (const o of r.byTri) console.log(String(o.calls).padStart(6), String(Math.round(o.tri / 1000) + 'k').padStart(7), o.k, ' ', o.mats);
}
await browser.close();
