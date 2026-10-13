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
const r = await page.evaluate(() => {
  const { scene, camera } = window.__TEST__.internals();
  // whole scene: non-instanced meshes grouped by geometry signature
  const sig = new Map();
  let inst = [];
  scene.traverse((o) => {
    if (o.isInstancedMesh) { const g = o.geometry; const n = (g.index ? g.index.count : g.attributes.position.count) / 3; inst.push({ n: Math.round(n), count: o.count, mat: o.material.type + (o.material.map ? '+map' : ''), geo: g.type, uuid: g.uuid }); return; }
    if (!(o.isMesh || o.isSprite || o.isPoints)) return;
    let car = false; for (let q = o; q; q = q.parent) if (q.name === 'star-racer-7') car = true;
    if (car) return;
    const g = o.geometry;
    const n = Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
    const params = g.parameters ? JSON.stringify(g.parameters).slice(0, 70) : '';
    const col = o.material && o.material.color ? '#' + o.material.color.getHexString() : '';
    const k = (o.isSprite ? 'Sprite' : g.type) + ' ' + params + ' ' + (o.material ? o.material.type : '') + ' ' + n + 'tri';
    const e = sig.get(k) || { count: 0, mats: new Set(), ex: null, parents: new Set() };
    e.count++; e.mats.add(col); if (!e.ex) e.ex = o.getWorldPosition(o.position.clone()).toArray().map(Math.round);
    e.parents.add((o.parent && (o.parent.name || o.parent.type)) + ':' + (o.parent ? o.parent.children.length : 0));
    sig.set(k, e);
  });
  const rows = [...sig.entries()].map(([k, v]) => ({ k, count: v.count, mats: v.mats.size, ex: v.ex, parents: [...v.parents].slice(0, 3).join(' ') })).sort((a, b) => b.count - a.count).slice(0, 40);
  // instanced: by geometry
  const ig = new Map();
  for (const i of inst) { const e = ig.get(i.uuid) || { n: i.n, chunks: 0, total: 0, mat: i.mat, geo: i.geo }; e.chunks++; e.total += i.count; ig.set(i.uuid, e); }
  const irows = [...ig.values()].sort((a, b) => b.n * b.total - a.n * a.total);
  return { rows, irows, far: camera.far, fog: [scene.fog.near, scene.fog.far] };
});
console.log('camera.far', r.far, 'fog', r.fog);
console.log('-- non-instanced meshes (whole scene, minus car) by count');
for (const o of r.rows) console.log(String(o.count).padStart(5), 'mats', String(o.mats).padStart(3), JSON.stringify(o.ex).padEnd(18), o.k, ' parents:', o.parents);
console.log('-- instanced geometries (tri/inst, chunks, total instances, total tri)');
for (const o of r.irows) console.log(String(o.n).padStart(6), String(o.chunks).padStart(4), String(o.total).padStart(6), String(Math.round(o.n * o.total / 1000) + 'k').padStart(7), o.geo, o.mat);
await browser.close();
