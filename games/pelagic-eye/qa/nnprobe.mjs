import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const URL = process.argv[2];
const TAG = process.argv[3];
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 600000,
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 5000));
const out = await page.evaluate(() => {
  const w = window.__REEF__;
  Object.defineProperty(w, 'lifeTime', { get: () => 0, set: () => {}, configurable: true });
  let bestU = 0, bestD = 1e9;
  for (let u = 0; u <= 1; u += 0.002) {
    const p = w.turtlePath.getPoint(u);
    const d = p.x * p.x + (p.y - 2.6) * (p.y - 2.6) + p.z * p.z;
    if (d < bestD) { bestD = d; bestU = u; }
  }
  Object.defineProperty(w, 'turtleProgress', { get: () => bestU, set: () => {}, configurable: true });
  return new Promise((resolve) => setTimeout(() => {
    const g = w.turtleRig.group;
    g.updateMatrixWorld(true);
    const applyM = (m, x, y, z) => {
      const e = m.elements;
      return [e[0]*x + e[4]*y + e[8]*z + e[12], e[1]*x + e[5]*y + e[9]*z + e[13], e[2]*x + e[6]*y + e[10]*z + e[14]];
    };
    const pts = [];
    const isOld = !g.children.some((c) => c.isMesh && c.geometry && c.geometry.getAttribute && c.geometry.getAttribute('aAnim'));
    if (isOld) {
      g.traverse((o) => {
        if (!o.isMesh) return;
        const geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry;
        const pos = geo.getAttribute('position');
        for (let k = 0; k < pos.count; k++) pts.push(applyM(o.matrixWorld, pos.getX(k), pos.getY(k), pos.getZ(k)));
        if (geo !== o.geometry) geo.dispose();
      });
    } else {
      // поза при t=0 как в шейдере
      const amp = [0.42, 0.26, 0.16], freq = [1.08, 1.08, 0.24], phase = [0, 1.8, 0];
      const axis = [[1,0,0],[1,0,0],[0,1,0]];
      const angle = (part) => Math.sin(0 * freq[part-1] + phase[part-1]) * amp[part-1];
      const rot = (v, a, ang) => {
        const c = Math.cos(ang), s = Math.sin(ang);
        const dot = a[0]*v[0] + a[1]*v[1] + a[2]*v[2];
        const cr = [a[1]*v[2]-a[2]*v[1], a[2]*v[0]-a[0]*v[2], a[0]*v[1]-a[1]*v[0]];
        return [v[0]*c + cr[0]*s + a[0]*dot*(1-c), v[1]*c + cr[1]*s + a[1]*dot*(1-c), v[2]*c + cr[2]*s + a[2]*dot*(1-c)];
      };
      g.traverse((o) => {
        if (!o.isMesh) return;
        const aAnim = o.geometry.getAttribute('aAnim');
        const pos = o.geometry.getAttribute('position');
        for (let i = 0; i < pos.count; i++) {
          let v = [pos.getX(i), pos.getY(i), pos.getZ(i)];
          if (aAnim) {
            const part = Math.round(aAnim.getX(i));
            if (part > 0) {
              const pv = [aAnim.getY(i), aAnim.getZ(i), aAnim.getW(i)];
              const rel = [v[0]-pv[0], v[1]-pv[1], v[2]-pv[2]];
              const rr = rot(rel, axis[part-1], angle(part));
              v = [pv[0]+rr[0], pv[1]+rr[1], pv[2]+rr[2]];
            }
          }
          pts.push(applyM(o.matrixWorld, v[0], v[1], v[2]));
        }
      });
    }
    resolve(pts);
  }, 2500));
});
const fs = await import('fs');
fs.writeFileSync(`/tmp/pts-${TAG}.json`, JSON.stringify(out));
console.log(TAG, out.length, 'pts');
await browser.close();
