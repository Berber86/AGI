// body-shots.mjs — собирает «лупу» тела и снимает контрольные кадры в .studio/evidence/screenshots
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { launch } from './browser.mjs';

const gameRoot = path.resolve('.');
const outDir = path.resolve('.body-preview');
const evidence = path.resolve('../../.studio/evidence');
fs.mkdirSync(evidence + '/screenshots', { recursive: true });

const only = process.argv.slice(2);
if (!process.env.SKIP_BUILD) {
  execFileSync('npx', ['vite', 'build', '--config', 'tests/body-preview.vite.config.js'], { cwd: gameRoot, stdio: 'inherit' });
}

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname.replace(/^\//, '')) || 'index.html';
  const file = path.resolve(outDir, rel);
  if (!file.startsWith(outDir + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/tests/body-preview.html`;

const browser = await launch();
const page = await browser.newPage();
page.setDefaultTimeout(120000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.waitForFunction(() => window.__PREVIEW__?.ready, { timeout: 120000 });
const names = only.length ? only : await page.evaluate(() => window.__PREVIEW__.names);
for (const name of names) {
  await page.evaluate((n) => window.__PREVIEW__.render(n), name);
  await page.screenshot({ path: `${evidence}/screenshots/preview-${name}.png`, clip: { x: 0, y: 0, width: 900, height: 900 } });
  console.log('SHOT', name);
}
if (errors.length) console.log('PAGE ERRORS:', errors.slice(0, 6).join(' | '));
await browser.close();
server.close();
