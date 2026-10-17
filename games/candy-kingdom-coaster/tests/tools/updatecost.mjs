// updatecost.mjs — сколько трафика стоит обновление версии PWA.
// Сервер раздаёт игру из репозитория, но /sw.js может подменить версию кэша
// (?phase=v47). Считаем байты/запросы по /assets/ и по коду в каждой фазе.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
// корень репозитория: tests/tools -> игра -> games -> корень
const ROOT = process.env.AGI_ROOT || path.resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
const GAME = '/games/candy-kingdom-coaster';
let phase = 'v46';
const stats = { v46: { assets: 0, assetsBytes: 0, code: 0, codeBytes: 0 }, v47: { assets: 0, assetsBytes: 0, code: 0, codeBytes: 0 } };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let file = decodeURIComponent(url.pathname);
  if (file.endsWith('/sw.js')) {
    let body = fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (phase === 'v47') body = body.replace("ckc-v46", "ckc-v47").replace("ckc-media-v1", "ckc-media-v1");
    res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-cache' });
    res.end(body);
    return;
  }
  const abs = path.join(ROOT, file);
  if (!abs.startsWith(ROOT) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  const buf = fs.readFileSync(abs);
  const s = stats[phase];
  if (file.includes('/assets/')) { s.assets++; s.assetsBytes += buf.length; } else { s.code++; s.codeBytes += buf.length; }
  res.writeHead(200, { 'content-type': MIME[path.extname(abs)] || 'application/octet-stream', 'cache-control': 'no-cache' });
  res.end(buf);
});
await new Promise((r) => server.listen(8901, '127.0.0.1', r));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu'],
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true }, protocolTimeout: 300000,
});
const page = await browser.newPage();
const BASE = 'http://127.0.0.1:8901' + GAME + '/index.html';
const boot = async () => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction('window.__READY__ === true', { timeout: 180000 });
  await new Promise((r) => setTimeout(r, 2500));
};
await boot();
const c0 = await page.evaluate(async () => {
  const out = {};
  for (const k of await caches.keys()) out[k] = (await (await caches.open(k)).keys()).length;
  return out;
});
// Обновление: та же страница, новая версия SW.
phase = 'v47';
const before = JSON.parse(JSON.stringify(stats.v47));
await page.goto(BASE, { waitUntil: 'load', timeout: 180000 });
await page.evaluate(async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  if (reg) await reg.update();
});
await page.waitForFunction(async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  return (await caches.keys()).includes('ckc-v47');
}, { timeout: 120000 }).catch((e) => console.log('wait v47:', String(e).slice(0, 100)));
await new Promise((r) => setTimeout(r, 3000));
const c1 = await page.evaluate(async () => {
  const out = {};
  for (const k of await caches.keys()) out[k] = (await (await caches.open(k)).keys()).length;
  return out;
});
const d = stats.v47;
const upd = { assets: d.assets - before.assets, assetsBytes: d.assetsBytes - before.assetsBytes, code: d.code - before.code, codeBytes: d.codeBytes - before.codeBytes };
const mb = (b) => (b / 1048576).toFixed(2) + ' МБ';
console.log('первая установка:', JSON.stringify(c0));
console.log('после обновления:', JSON.stringify(c1));
console.log(`обновление: медиа ${upd.assets} файлов / ${mb(upd.assetsBytes)}, код ${upd.code} файлов / ${mb(upd.codeBytes)}`);
console.log(`итого обновление: ${mb(upd.assetsBytes + upd.codeBytes)}`);
await browser.close();
server.close();
