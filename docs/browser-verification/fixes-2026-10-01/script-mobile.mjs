import { newPage, onboarding, tab, shot, log, clickText, txt } from './lib.mjs';
import fs from 'fs';

const t = [];
const put = (...a) => t.push(a.join(' '));
const { ctx, page, errors } = await newPage({ profile: '/tmp/m1', viewport: { width: 390, height: 844 }, mobile: true });
const overflow = () => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, ok: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 }));
const coach = () => page.evaluate(() => (document.body.innerText.match(/Учебный бой\.[\s\S]{1,160}?(?=\n|$)/) || [])[0]?.replace(/\s+/g, ' '));

try {
  await page.goto('http://localhost:8144/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await shot(page, 'm01-onboarding');
  put('ONBOARDING OVERFLOW:', JSON.stringify(await overflow()));
  await onboarding(page);
  await page.waitForTimeout(600);
  await shot(page, 'm02-home');
  put('HOME OVERFLOW:', JSON.stringify(await overflow()));
  put('BOTTOM NAV:', await page.evaluate(() => { const n = document.querySelector('nav.fixed.inset-x-0.bottom-0'); return n ? n.innerText.replace(/\s+/g, ' ').trim() + ' | h=' + n.getBoundingClientRect().height : 'no nav'; }));

  // --- Армия ---
  await tab(page, 'Армия');
  await page.waitForTimeout(700);
  await shot(page, 'm03-army');
  put('ARMY OVERFLOW:', JSON.stringify(await overflow()));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => /вывод/.test(b.textContent) && b.offsetHeight > 20);
    ['Разведчики на лошадях', 'Топорники племени'].forEach(w => { const b = btns.find(x => x.textContent.includes(w)); if (b) b.click(); });
  });
  await page.waitForTimeout(600);
  await shot(page, 'm04-army-picked');
  put('PICKS:', await page.evaluate(() => localStorage.getItem('iforge_militia')));
  put('SLOTS VISIBLE:', await page.evaluate(() => [...document.querySelectorAll('div')].filter(d => /ОПОЛЧЕНИЕ/.test(d.innerText || '') && (d.innerText || '').length < 90).map(d => d.innerText.replace(/\s+/g, ' ').trim())));

  // --- Бой ---
  await clickText(page, 'В бой');
  await page.waitForTimeout(1000);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Начать бой')); if (b) b.click(); });
  await page.waitForTimeout(2600);
  await shot(page, 'm05-battle');
  put('BATTLE OVERFLOW:', JSON.stringify(await overflow()));
  put('BATTLE ENERGY:', await page.evaluate(() => { const d = [...document.querySelectorAll('div')].find(x => /^вы/i.test(x.innerText.trim()) && /\d\/\d/.test(x.innerText)); return d ? d.innerText.replace(/\s+/g, ' ').trim().split('\n')[0] : 'n/a'; }));
  put('COACH1:', await coach());
  put('TOUCH TARGETS:', JSON.stringify(await page.evaluate(() => {
    const vh = window.innerHeight;
    const hand = [...document.querySelectorAll('button')].filter(x => { const r = x.getBoundingClientRect(); return r.top > vh - 260 && r.width > 40 && r.width < 170 && r.height > 40; });
    const end = [...document.querySelectorAll('button')].find(x => /Конец\s*хода/.test(x.textContent));
    const eb = end?.getBoundingClientRect();
    return { handCards: hand.length, handSize: hand[0] ? `${Math.round(hand[0].getBoundingClientRect().width)}x${Math.round(hand[0].getBoundingClientRect().height)}` : 'n/a', endTurn: eb ? `${Math.round(eb.width)}x${Math.round(eb.height)} visible=${eb.bottom <= vh + 1}` : 'none' };
  })));
  // ставим карту тапом
  const tapDeploy = await page.evaluate(() => {
    const vh = window.innerHeight;
    const cards = [...document.querySelectorAll('button')].filter(x => { const r = x.getBoundingClientRect(); return r.top > vh - 260 && r.width > 40 && r.width < 170 && r.height > 40; });
    const c = cards.map(x => ({ x, cost: parseInt((x.textContent.trim().match(/^(\d+)/) || [])[1] || '99', 10) })).filter(o => o.cost <= 2)[0];
    if (!c) return 'no card';
    const r = c.x.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (typeof tapDeploy === 'object') await page.touchscreen.tap(tapDeploy.x, tapDeploy.y).catch(async () => { await page.mouse.click(tapDeploy.x, tapDeploy.y); });
  await page.waitForTimeout(400);
  await shot(page, 'm06-card-selected');
  const slotPt = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '+ выйти'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  put('DEPLOY CARD POINT:', JSON.stringify(tapDeploy), 'SLOT POINT:', JSON.stringify(slotPt));
  if (slotPt) await page.touchscreen.tap(slotPt.x, slotPt.y).catch(async () => { await page.mouse.click(slotPt.x, slotPt.y); });
  await page.waitForTimeout(700);
  put('COACH2:', await coach());
  await shot(page, 'm07-after-deploy');
  const endPt = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Конец\s*хода/.test(x.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (endPt) await page.touchscreen.tap(endPt.x, endPt.y).catch(async () => { await page.mouse.click(endPt.x, endPt.y); });
  await page.waitForTimeout(2800);
  if (endPt) await page.mouse.click(endPt.x, endPt.y);
  await page.waitForTimeout(1600);
  put('COACH3 TURN2:', await coach());
  await shot(page, 'm08-turn2');
  put('BATTLE OVERFLOW T2:', JSON.stringify(await overflow()));

  // правила на телефоне
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => (x.title || '').includes('Правила боя')); if (b) b.click(); });
  await page.waitForTimeout(800);
  await shot(page, 'm09-rules-modal');
  put('RULES MODAL FITS:', JSON.stringify(await page.evaluate(() => { const d = document.querySelector('[role="dialog"] > div:last-child'); if (!d) return 'no dialog'; const r = d.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), withinVh: r.height <= window.innerHeight + 1, scrollable: d.scrollHeight > d.clientHeight }; })));
  put('RULES HAS TEXT:', (await txt(page)).includes('Золотая рамка — отряд готов действовать'));
  await page.evaluate(() => { document.querySelector('[aria-label="Закрыть"]')?.click(); });
  await page.waitForTimeout(500);

  // выход из боя
  await clickText(page, 'Отступить');
  await page.waitForTimeout(800);
  await page.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(x => x.textContent.trim() === 'Отступить'); if (bs.length) bs[bs.length - 1].click(); });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'К армии'); if (b) b.click(); });
  await page.waitForTimeout(900);

  // --- Карта, Развитие, Кузница ---
  for (const [name, shotName] of [['Карта', 'm10-map'], ['Развитие', 'm11-develop'], ['Кузница', 'm12-forge']]) {
    await tab(page, name);
    await page.waitForTimeout(900);
    await shot(page, shotName);
    put(name.toUpperCase() + ' OVERFLOW:', JSON.stringify(await overflow()));
    if (name === 'Карта') {
      put('MAP LABELS:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('button[aria-label]')].map(b => (b.getAttribute('aria-label') || '').split(',')[0]).slice(0, 6))));
      put('MAP CLAMP COUNT:', await page.evaluate(() => [...document.querySelectorAll('.line-clamp-2')].length));
    }
  }

  // --- Настройки (шестерёнка в шапке) ---
  await page.evaluate(() => { document.querySelector('[aria-label="Настройки"]')?.click(); });
  await page.waitForTimeout(900);
  await shot(page, 'm13-settings');
  put('SETTINGS:', JSON.stringify(await page.evaluate(() => ({ dialog: !!document.querySelector('[role="dialog"]'), groups: [...document.querySelectorAll('optgroup')].map(g => g.label.slice(0, 24)), options: document.querySelectorAll('optgroup option').length }))));
  put('SETTINGS OVERFLOW:', JSON.stringify(await overflow()));
} catch (e) {
  put('SCRIPT ERROR:', String(e).split('\n')[0]);
} finally {
  fs.writeFileSync('/tmp/pwb/mobile.txt', t.join('\n\n'));
  log(t.join('\n\n'));
  log('PAGE ERRORS:', JSON.stringify(errors.slice(0, 10)));
  await ctx.close();
}
