import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, screenshot: { timeout: 120000 } });
page.setDefaultTimeout(120000);
await page.addInitScript(() => localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'balanced', reducedMotion: true, soundOn: false })));
await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(14000);
await page.screenshot({ path: 'qa/lobby2.png' });
const start = page.getByRole('button', { name: /Начать погружение|Продолжить погружение/ }).first();
await start.click();
await page.waitForTimeout(9000);
await page.screenshot({ path: 'qa/dive2.png' });
// drag look
await page.mouse.move(720, 450);
await page.mouse.down();
await page.mouse.move(500, 400, { steps: 14 });
await page.mouse.up();
await page.waitForTimeout(4000);
await page.screenshot({ path: 'qa/dive-turned.png' });
// open driver, synthetic camera
await page.getByTitle('VR-драйвер и источник взгляда').click();
await page.waitForTimeout(1500);
await page.getByRole('button', { name: 'QA-подача' }).click();
const canvas = page.locator('canvas').last();
await page.waitForTimeout(2500);
const box = await canvas.boundingBox();
if (box) { await page.mouse.move(box.x + box.width*0.55, box.y+box.height*0.5); await page.waitForTimeout(1800); }
await page.screenshot({ path: 'qa/driver-synth.png' });
// calibrate
await page.getByRole('button', { name: 'Смотрю прямо' }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: 'qa/driver-calib.png' });
// enter vr
await page.getByRole('button', { name: 'Войти в VR', exact: true }).click();
await page.waitForTimeout(5000);
await page.screenshot({ path: 'qa/vr.png' });
console.log('done');
await browser.close();
