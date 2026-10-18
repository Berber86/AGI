import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto('http://127.0.0.1:8899/games/pelagic-eye/play/index.html', { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 4000));
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').includes('Начать погружение'));
  b[0].click();
});
await new Promise((r) => setTimeout(r, 8000));
await page.evaluate(() => { const w = window.__REEF__; w.targetYaw = -0.55; w.targetPitch = -0.18; });
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: '/tmp/reef-noise/a.png' });
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: '/tmp/reef-noise/b.png' });
await browser.close();
