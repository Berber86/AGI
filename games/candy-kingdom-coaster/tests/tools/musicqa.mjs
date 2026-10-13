// musicqa.mjs — render the procedural tune offline in headless Chromium, save WAVs, print level stats
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib'; process.env.HOME = '/tmp';
const BASE = 'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT = process.argv[2] || '/home/user/shots';
const browser = await puppeteer.launch({ executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--mute-audio','--autoplay-policy=no-user-gesture-required','--single-process','--no-zygote','--in-process-gpu','--headless'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true } });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 120000 });
const wav = (pcm, sr) => {
  const b = Buffer.alloc(44 + pcm.length * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + pcm.length * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(pcm.length * 2, 40);
  for (let i = 0; i < pcm.length; i++) b.writeInt16LE(Math.max(-32768, Math.min(32767, pcm[i])), 44 + i * 2);
  return b;
};
for (const [mode, secs] of [['menu', 6.4], ['race', 12.8], ['boost', 6.4]]) {
  const r = await page.evaluate(async ([mode, secs]) => {
    const { MUSIC } = await import('./src/music.js');
    const T = window.__TEST__; T.startRace(); // ensure the audio graph exists (unlock)
    return MUSIC.renderOffline(secs, mode, true);
  }, [mode, secs]);
  fs.writeFileSync(`${OUT}/music-${mode}.wav`, wav(r.pcm, r.sampleRate));
  console.log(`${mode}: ${secs}s peak=${r.peak} rms=${r.rms} beats=${r.beatRms.slice(0, 16).join(',')}`);
}
const info = await page.evaluate(() => window.__TEST__.music());
console.log('info', JSON.stringify(info), 'errors', errors);
await browser.close();
