import { newPage, onboarding, tab, clickText, log, shot } from './lib.mjs';
const port = process.argv[2], vpName = process.argv[3];
const VP = { m390: { width: 390, height: 844 }, m360: { width: 360, height: 740 } }[vpName];
const { ctx, page } = await newPage({ profile: `/tmp/p-${port}-${vpName}`, viewport: VP, mobile: true });
await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);
await onboarding(page);
await tab(page, 'Армия');
await page.waitForTimeout(600);
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')].filter(b => /вывод/.test(b.textContent) && b.offsetHeight > 20);
  ['Топорники', 'Разведчики'].forEach(w => { const b = btns.find(x => x.textContent.includes(w)); if (b) b.click(); });
});
await clickText(page, 'В бой');
await page.waitForTimeout(900);
await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Начать бой')); if (b) b.click(); });
await page.waitForTimeout(2600);
const info = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 1) out.push({ tag: el.tagName, cls: String(el.className).slice(0, 80), w: Math.round(r.width), right: Math.round(r.right), txt: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 34) });
  });
  const hand = document.querySelector('.no-scrollbar.flex.min-w-0');
  return { vw, sw: document.documentElement.scrollWidth, count: out.length, worst: out.slice(0, 10),
    handRow: hand ? { w: Math.round(hand.getBoundingClientRect().width), sw: hand.scrollWidth, cards: hand.children.length } : null };
});
log(vpName, JSON.stringify(info, null, 1));
await shot(page, '/tmp/pwb/probe', `${port}-${vpName}-battle`);
await ctx.close();
