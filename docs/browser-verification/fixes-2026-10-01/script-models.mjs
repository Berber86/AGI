import { newPage, onboarding, tab, clickText, txt, overflow, shot, log } from './lib.mjs';

const OUT = '/tmp/pwb/final';
const t = [];
const put = (...a) => t.push(a.join(' '));
const { ctx, page, errors } = await newPage({ profile: '/tmp/f-final', viewport: { width: 1440, height: 900 } });

try {
  await page.goto('http://localhost:8144/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  await onboarding(page);
  await tab(page, 'Армия');
  await page.waitForTimeout(600);
  await shot(page, OUT, '01-army');
  await clickText(page, 'Настройки');
  await page.waitForTimeout(900);
  await shot(page, OUT, '02-settings-families');
  put('SETTINGS:', JSON.stringify(await page.evaluate(() => ({
    groups: [...document.querySelectorAll('optgroup')].map(g => ({ label: g.label, n: g.children.length })),
    options: [...document.querySelectorAll('optgroup option')].map(o => o.textContent.trim()),
    hint: (document.body.innerText.match(/Модели сгруппированы[^\n]*/) || [])[0],
    selected: [...document.querySelectorAll('select')].map(s => s.value),
  }))));
} catch (e) { put('ERR', String(e).split('\n')[0]); }
log(t.join('\n'));
log('PAGE ERRORS:', JSON.stringify(errors.slice(0, 8)));
await ctx.close();
