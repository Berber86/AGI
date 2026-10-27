// Общий браузерный контур для скриншотов и e2e. SwiftShader в песочнице медленный:
// все ожидания — поллинг с щедрым таймаутом, без «подожди 2 секунды и готово».
import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

export const CHROME = '/tmp/chromium';

export async function launch({ width = 1280, height = 720, mobile = false } = {}) {
  if (!fs.existsSync(CHROME)) {
    throw new Error('Нет /tmp/chromium — сначала запустите node tests/tools/setup-runtime.mjs');
  }
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio',
      '--single-process', '--no-zygote', '--in-process-gpu', '--headless',
      '--force-device-scale-factor=1',
    ],
    defaultViewport: { width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 },
  });
  return browser;
}

export async function openHall(browser, url, { timeout = 240000 } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('requestfailed', (req) => errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  await page.waitForFunction('window.__READY__ === true', { timeout, polling: 500 });
  return { page, errors };
}

export async function shot(page, file, label = '') {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  const jpeg = file.endsWith('.jpg') || file.endsWith('.jpeg');
  await page.screenshot({ path: file, type: jpeg ? 'jpeg' : 'png', quality: jpeg ? 86 : undefined });
  if (label) console.log(`shot: ${label} -> ${file}`);
  return file;
}

export async function evalPose(page) {
  return page.evaluate(() => window.__HERMITAGE__.pose());
}
