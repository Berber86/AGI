import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 700 }, deviceScaleFactor: 1, screenshot: { timeout: 120000 } });
page.setDefaultTimeout(120000);
await page.addInitScript(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'balanced', reducedMotion: true, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(7000);
await page.getByRole('button', { name: /Начать погружение|Продолжить погружение/ }).first().click();
await page.waitForTimeout(3000);
const normal = await page.evaluate(() => ({ auto: window.__REEF__.renderer.shadowMap.autoUpdate, calls: window.__REEF__.renderer.info.render.calls, frame: window.__REEF__.frame, w: window.__REEF__.container.clientWidth, h: window.__REEF__.container.clientHeight }));
await page.getByTitle('VR-драйвер и источник взгляда').click();
await page.waitForTimeout(700);
await page.getByRole('button', { name: 'QA-подача' }).click();
await page.getByRole('button', { name: 'Войти в VR', exact: true }).nth(1).click();
await page.waitForTimeout(3000);
const inVr = await page.evaluate(() => {
  const r = window.__REEF__;
  return {
    auto: r.renderer.shadowMap.autoUpdate,
    needs: r.renderer.shadowMap.needsUpdate,
    calls: r.renderer.info.render.calls,
    triangles: r.renderer.info.render.triangles,
    frame: r.frame,
    w: r.container.clientWidth,
    h: r.container.clientHeight,
    dpr: r.renderer.getPixelRatio(),
    stereo: r.settings.vr && r.container.clientWidth > r.container.clientHeight * 1.08,
    frameCount: r.frame,
    loc: location.href,
    lastHeadingAt: r.headingCallbackAt,
  };
});
await page.waitForTimeout(2000);
const inVr2 = await page.evaluate(() => ({ calls: window.__REEF__.renderer.info.render.calls, frame: window.__REEF__.frame }));
await page.waitForTimeout(2000);
const inVr3 = await page.evaluate(() => ({ calls: window.__REEF__.renderer.info.render.calls, frame: window.__REEF__.frame, fps: window.__PERF__?.fps }));
console.log(JSON.stringify({ normal, inVr, inVr2, inVr3, errors }, null, 1));
await browser.close();
