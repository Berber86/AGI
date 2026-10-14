import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = process.env.BASE || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });
await page.evaluate(() => { window.__TEST__.pinQuality(2); window.__TEST__.startRace(); window.__TEST__.fastForwardCountdown(); });
const u = Number(process.argv[2] || 0.12);
const r = await page.evaluate((u) => {
  const { renderer } = window.__TEST__.internals();
  window.__TEST__.setProgress(u, 0, true); window.__TEST__.snapCamera();
  window.__TEST__.step(1 / 60, 2, true);
  const seen = new Map();
  let passIdx = 0, lastRT = undefined;
  const orig = renderer.renderBufferDirect;
  renderer.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    const rt = renderer.getRenderTarget();
    const tag = material.isMeshDepthMaterial || material.isMeshDistanceMaterial ? 'shadow' : (rt && rt.texture && rt.texture.generateMipmaps ? 'transmission' : 'main');
    let n = geometry.index ? geometry.index.count : geometry.attributes.position.count;
    if (group) n = Math.min(n, group.count);
    const inst = object.isInstancedMesh ? object.count : 1;
    const chain = [];
    for (let q = object.parent; q && q.type !== 'Scene'; q = q.parent) if (q.name) chain.push(q.name);
    const key = tag + ' | ' + (object.isInstancedMesh ? 'INST ' : '') + (object.name || geometry.type) + ' <' + chain.slice(0, 2).join('<') + '> ' + material.type + (material.transparent ? '(T)' : '');
    const e = seen.get(key) || { calls: 0, tri: 0, triPer: Math.round(n / 3), inst: 0 };
    e.calls++; e.tri += (n / 3) * inst; e.inst += inst;
    seen.set(key, e);
    return orig.apply(this, arguments);
  };
  window.__TEST__.step(1 / 60, 1, true);
  renderer.renderBufferDirect = orig;
  const rows = [...seen.entries()].map(([k, v]) => ({ k, ...v, tri: Math.round(v.tri) }));
  const tot = {};
  for (const o of rows) { const p = o.k.split(' | ')[0]; tot[p] = tot[p] || { calls: 0, tri: 0 }; tot[p].calls += o.calls; tot[p].tri += o.tri; }
  return { tot, rows };
}, u);
console.log('totals', JSON.stringify(r.tot));
const main = r.rows.filter((o) => o.k.startsWith('main'));
console.log('-- main by calls');
for (const o of main.sort((a, b) => b.calls - a.calls).slice(0, 30)) console.log(String(o.calls).padStart(5), String(Math.round(o.tri / 1000) + 'k').padStart(6), 'per', String(o.triPer).padStart(6), 'inst', String(o.inst).padStart(5), o.k.slice(7));
console.log('-- main by tris');
for (const o of main.sort((a, b) => b.tri - a.tri).slice(0, 30)) console.log(String(o.calls).padStart(5), String(Math.round(o.tri / 1000) + 'k').padStart(6), 'per', String(o.triPer).padStart(6), 'inst', String(o.inst).padStart(5), o.k.slice(7));
await browser.close();
