import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 1, screenshot: { timeout: 120000 } });
page.setDefaultTimeout(120000);
await page.addInitScript(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'balanced', reducedMotion: true, soundOn: false }));
  // эмулируем браузер очков, который не умеет fullscreen
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
const errors = [];
page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR '+e.message));
await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);
await page.getByRole('button', { name: /Начать погружение|Продолжить погружение/ }).first().click();
await page.waitForTimeout(4000);
await page.getByTitle('VR-драйвер и источник взгляда').click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'QA-подача' }).click();
await page.waitForTimeout(1200);
await page.getByRole('button', { name: 'Войти в VR', exact: true }).nth(1).click();
await page.waitForTimeout(10000);
const info = await page.evaluate(() => ({ vrLog: window.__VR_LOG__, worldVr: window.__REEF__?.settings?.vr, providerInterval: window.__REEF__?.provider?.getInfo?.().intervalMs, providerTier: window.__REEF__?.provider?.getInfo?.().tier, perf: window.__PERF__, buttons: [...document.querySelectorAll('button')].map(b => (b.textContent||'').trim()).slice(-6), fs: !!document.fullscreenElement }));
console.log(JSON.stringify(info, null, 1));
await page.screenshot({ path: 'qa/nofs-vr.png' });
console.log('ERRORS', errors.slice(0,8));
await browser.close();
