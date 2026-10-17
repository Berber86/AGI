import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, screenshot: { timeout: 120000 } });
page.setDefaultTimeout(120000);
await page.addInitScript(() => localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'balanced', reducedMotion: true, soundOn: false })));
const errors = [];
page.on('console', msg => { if (msg.type()==='error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push('PAGEERROR '+err.message));
await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(14000);
await page.screenshot({ path: 'qa/lobby3.png' });
await page.getByRole('button', { name: /Начать погружение|Продолжить погружение/ }).first().click();
await page.waitForTimeout(10000);
await page.screenshot({ path: 'qa/dive3.png' });
// look up towards whale
await page.mouse.move(720, 500);
await page.mouse.down();
await page.mouse.move(760, 640, { steps: 18 });
await page.mouse.up();
await page.waitForTimeout(3000);
await page.screenshot({ path: 'qa/dive3-up.png' });
// look left
await page.mouse.move(720, 500);
await page.mouse.down();
await page.mouse.move(1050, 500, { steps: 20 });
await page.mouse.up();
await page.waitForTimeout(3000);
await page.screenshot({ path: 'qa/dive3-left.png' });
// driver
await page.getByTitle('VR-драйвер и источник взгляда').click();
await page.waitForTimeout(1200);
await page.getByRole('button', { name: 'QA-подача' }).click();
await page.waitForTimeout(2500);
await page.getByRole('button', { name: 'Смотрю прямо' }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: 'qa/driver3.png' });
// enter VR from driver (second button)
await page.getByRole('button', { name: 'Войти в VR', exact: true }).nth(1).click();
await page.waitForTimeout(6000);
await page.screenshot({ path: 'qa/vr3.png' });
console.log('ERRORS', errors.slice(0,10));
await browser.close();
