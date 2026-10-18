import puppeteer from 'puppeteer-core';
import fs from 'fs';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const URL = process.argv[2];
const OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
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
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => (x.textContent||'').includes('Начать погружение')); b && b.click(); });
await new Promise((r) => setTimeout(r, 3000));
const info = await page.evaluate(() => {
  const w = window.__REEF__;
  Object.defineProperty(w, 'lifeTime', { get: () => 20, set: () => {}, configurable: true });
  // Ближайшая точка траектории черепахи к фиксированной камере (0, 2.6, 0).
  let bestU = 0, bestD = 1e9;
  for (let u = 0; u <= 1; u += 0.002) {
    const p = w.turtlePath.getPoint(u);
    const d = p.x * p.x + (p.y - 2.6) * (p.y - 2.6) + p.z * p.z;
    if (d < bestD) { bestD = d; bestU = u; }
  }
  Object.defineProperty(w, 'turtleProgress', { get: () => bestU, set: () => {}, configurable: true });
  const p = w.turtlePath.getPoint(bestU);
  // Камера и прицел — полностью фиксированы.
  const c = w.camera.position;
  Object.defineProperty(c, 'x', { get: () => 0, set: () => {}, configurable: true });
  Object.defineProperty(c, 'y', { get: () => 2.6, set: () => {}, configurable: true });
  Object.defineProperty(c, 'z', { get: () => 0, set: () => {}, configurable: true });
  const dx = p.x, dy = p.y - 2.6, dz = p.z;
  const horiz = Math.sqrt(dx * dx + dz * dz);
  const yaw = Math.atan2(dx, -dz);
  const pitch = Math.atan2(dy, horiz);
  for (const [key, val] of [['targetYaw', yaw], ['targetPitch', pitch], ['yaw', yaw], ['pitch', pitch]]) {
    Object.defineProperty(w, key, { get: () => val, set: () => {}, configurable: true });
  }
  return { u: bestU, px: p.x.toFixed(1), py: p.y.toFixed(1), pz: p.z.toFixed(1), yaw: yaw.toFixed(2), pitch: pitch.toFixed(2) };
});
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: `${OUT}/turtle.png` });
console.log(OUT, JSON.stringify(info));
await browser.close();
