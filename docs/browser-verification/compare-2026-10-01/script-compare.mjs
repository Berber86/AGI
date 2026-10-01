import { newPage, onboarding, tab, clickText, txt, overflow, shot, log } from './lib.mjs';
import fs from 'fs';

const OUT = '/home/user/AGI/docs/browser-verification/compare-2026-10-01';
const variant = process.argv[2];           // 'mine' | 'branch'
const port = process.argv[3];
const vpName = process.argv[4];            // 'desktop' | 'm390' | 'm360'
const VP = { desktop: { width: 1440, height: 900 }, m390: { width: 390, height: 844 }, m360: { width: 360, height: 740 } }[vpName];
const mobile = vpName !== 'desktop';
const base = `http://localhost:${port}`;

const t = [];
const put = (...a) => t.push(a.join(' '));
const dir = `${OUT}/${variant}`;
const { ctx, page, errors } = await newPage({ profile: `/tmp/c-${variant}-${vpName}`, viewport: VP, mobile });
const coachLike = () => page.evaluate(() => {
  const m = document.body.innerText;
  const hits = m.match(/Учебный бой[^\n]*\n?[^\n]*/g) || m.match(/Первый ход[^\n]*/g) || [];
  return hits.slice(0, 2).map(s => s.replace(/\s+/g, ' ').trim());
});
const handInfo = () => page.evaluate(() => {
  const vh = window.innerHeight;
  const cards = [...document.querySelectorAll('button')].filter(x => { const r = x.getBoundingClientRect(); return r.top > vh - 300 && r.width > 40 && r.width < 180 && r.height > 40 && r.height < 200; });
  const measure = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
  const inter = (a, b) => (a && b) ? !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y) : null;
  return cards.map((c) => {
    const nameEl = [...c.querySelectorAll('span')].find(s => s.className.includes('line-clamp') || /font-semibold/.test(s.className) && s.textContent.length > 3);
    const badge = [...c.querySelectorAll('span')].find(s => /ополч/i.test(s.textContent));
    return { text: c.innerText.replace(/\s+/g, ' ').slice(0, 40), size: `${Math.round(c.getBoundingClientRect().width)}x${Math.round(c.getBoundingClientRect().height)}`, badge: badge ? badge.textContent.trim() : null, overlap: badge && nameEl ? inter(measure(badge), measure(nameEl)) : null };
  });
});
const endTurnInfo = () => page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => /Конец\s*хода/.test(x.textContent));
  if (!b) return 'none';
  const r = b.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom), vh: window.innerHeight, visible: r.bottom <= window.innerHeight + 1 && r.top >= 0 };
});

try {
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  put(`[${variant}/${vpName}] BASE ${base} viewport ${VP.width}x${VP.height}`);
  put('ONBOARDING OVERFLOW:', JSON.stringify(await overflow(page)));
  await shot(page, dir, `${vpName}-01-onboarding`);
  await onboarding(page);
  await page.waitForTimeout(500);
  put('HOME OVERFLOW:', JSON.stringify(await overflow(page)));

  /* --- Армия: пул ополчения --- */
  await tab(page, 'Армия');
  await page.waitForTimeout(700);
  await shot(page, dir, `${vpName}-02-army`);
  put('ARMY OVERFLOW:', JSON.stringify(await overflow(page)));
  const army = await txt(page);
  put('ARMY POOL TEXT:', (army.match(/ополчени[\s\S]{0,700}/) || [])[0]?.replace(/\n/g, ' | ').slice(0, 700));
  put('ARMY SLOTS TEXT:', (army.match(/Свободные слот[^\n]*/) || [])[0]);
  const clicks = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => (b.offsetWidth || b.offsetHeight) && b.textContent.length < 200);
    const want = ['Топорники', 'Разведчики'];
    const hit = [];
    want.forEach(w => { const b = btns.find(x => x.textContent.includes(w)); if (b) { b.click(); hit.push(w); } });
    return hit;
  });
  await page.waitForTimeout(700);
  put('PICKED VIA UI:', JSON.stringify(clicks));
  put('STORED PICKS:',
    await page.evaluate(() => localStorage.getItem('iforge_militia') || localStorage.getItem('iforge_campaign_v4')?.slice(0, 0) || 'n/a'));
  put('SAVE DECK MILITIA FIELD:', await page.evaluate(() => { try { const s = JSON.parse(localStorage.getItem('iforge_campaign_v4')); return JSON.stringify(s.player.deckMilitia ?? null); } catch { return 'n/a'; } }));
  await shot(page, dir, `${vpName}-03-army-picked`);

  /* --- Первый бой --- */
  await clickText(page, 'В бой');
  await page.waitForTimeout(1000);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Начать бой')); if (b) b.click(); });
  await page.waitForTimeout(2600);
  await shot(page, dir, `${vpName}-04-battle`);
  put('BATTLE OVERFLOW:', JSON.stringify(await overflow(page)));
  put('BATTLE HEAD:', (await txt(page)).split('\n').slice(0, 6).join(' | '));
  put('ENERGY TEXT:', await page.evaluate(() => { const d = [...document.querySelectorAll('div')].find(x => /^вы/i.test(x.innerText.trim()) && /\d\/\d/.test(x.innerText)); return d ? d.innerText.replace(/\s+/g, ' ').trim().slice(0, 60) : 'n/a'; }));
  put('ENEMY STRUCTURE WORDS:', await page.evaluate(() => (document.body.innerText.match(/здание/gi) || []).length));
  put('HAND:', JSON.stringify(await handInfo()));
  put('END TURN:', JSON.stringify(await endTurnInfo()));
  put('HINTS T1:', JSON.stringify(await coachLike()));
  // ход: вывести дешёвую карту и завершить ход
  const depl = await page.evaluate(() => {
    const vh = window.innerHeight;
    const cards = [...document.querySelectorAll('button')].filter(x => { const r = x.getBoundingClientRect(); return r.top > vh - 300 && r.width > 40 && r.width < 180 && r.height > 40 && r.height < 200; });
    const c = cards.map(x => ({ x, cost: parseInt((x.textContent.trim().match(/^(\d+)/) || [])[1] || '99', 10) })).filter(o => o.cost <= 2)[0];
    if (!c) return null;
    const r = c.x.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (depl) { if (mobile) await page.touchscreen.tap(depl.x, depl.y).catch(() => page.mouse.click(depl.x, depl.y)); else await page.mouse.click(depl.x, depl.y); }
  await page.waitForTimeout(500);
  const slotPt = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '+ выйти'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (slotPt) { if (mobile) await page.touchscreen.tap(slotPt.x, slotPt.y).catch(() => page.mouse.click(slotPt.x, slotPt.y)); else await page.mouse.click(slotPt.x, slotPt.y); }
  await page.waitForTimeout(800);
  put('AFTER DEPLOY HINT:', JSON.stringify(await coachLike()));
  await shot(page, dir, `${vpName}-05-battle-deploy`);
  const endPt = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Конец\s*хода/.test(x.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (endPt) { if (mobile) await page.touchscreen.tap(endPt.x, endPt.y).catch(() => page.mouse.click(endPt.x, endPt.y)); else await page.mouse.click(endPt.x, endPt.y); }
  await page.waitForTimeout(3000);
  if (endPt) await page.mouse.click(endPt.x, endPt.y);
  await page.waitForTimeout(1800);
  put('HINTS T2:', JSON.stringify(await coachLike()));

  /* --- шпаргалка/правила --- */
  const opened = await page.evaluate(() => {
    const cands = ['Правила', 'Легенда', 'Как играть'];
    const bs = [...document.querySelectorAll('button')];
    for (const c of cands) { const b = bs.find(x => (x.textContent.includes(c) || (x.title || '').includes(c)) && x.offsetHeight); if (b) { b.click(); return c; } }
    return null;
  });
  await page.waitForTimeout(800);
  put('GUIDE BUTTON:', String(opened));
  await shot(page, dir, `${vpName}-06-guide-modal`);
  const gd = await txt(page);
  const gi = gd.indexOf('рамка');
  put('GUIDE TEXT:', gi >= 0 ? gd.slice(Math.max(0, gi - 300), gi + 400).replace(/\n/g, ' | ') : (gd.match(/бою[\s\S]{0,300}/) || [])[0]?.replace(/\n/g, ' | '));
  await page.evaluate(() => { document.querySelector('[aria-label="Закрыть"]')?.click(); });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  /* --- выход из боя --- */
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Отступить'); if (b) b.click(); });
  await page.waitForTimeout(700);
  await page.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(x => x.textContent.trim() === 'Отступить'); if (bs.length) bs[bs.length - 1].click(); });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'К армии'); if (b) b.click(); });
  await page.waitForTimeout(1000);

  /* --- Развитие: первое дело -> советник -> приказ --- */
  await tab(page, 'Развитие');
  await page.waitForTimeout(700);
  await shot(page, dir, `${vpName}-07-develop-guided`);
  put('GUIDED TEXT:', (await txt(page)).match(/Первое дело народа[\s\S]{0,200}/)?.[0]?.replace(/\n/g, ' | '));
  await clickText(page, 'Изучить науку');
  await page.waitForTimeout(1200);
  await clickText(page, 'Построить здание');
  await page.waitForTimeout(1500);
  await clickText(page, 'Спросить советника');
  await page.waitForTimeout(3200);
  await shot(page, dir, `${vpName}-08-develop-offers`);
  const dev = await txt(page);
  const oi = Math.max(dev.indexOf('Выберите'), dev.indexOf('советник'));
  put('OFFERS BLOCK:', dev.slice(oi, oi + 800).replace(/\n/g, ' | '));
  put('OFFER BUTTONS BEFORE:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('button')].filter(x => /Выбрать|Принять|Занято/.test(x.textContent.trim())).map(x => x.textContent.trim().slice(0, 20) + (x.disabled ? ' [off]' : '') + (x.title ? ' {' + x.title.slice(0, 60) + '}' : '')))));
  const tryPick = () => page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /^(Выбрать|Принять)$/.test(x.textContent.trim()) && !x.disabled);
    if (b) { b.click(); return b.textContent.trim(); }
    return null;
  });
  let pick1 = await tryPick();
  if (!pick1) {
    // приказ «Исследование» потрачен первым делом: пережидаем день, как в реальной игре
    put('ACCEPT BLOCKED DAY 1 — завершаем день');
    await clickText(page, 'Завершить день');
    await page.waitForTimeout(1400);
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Наступает день/.test(x.textContent)); if (b) b.click(); });
    await page.waitForTimeout(1200);
    await tab(page, 'Развитие');
    await page.waitForTimeout(800);
    put('OFFER BUTTONS DAY 2:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('button')].filter(x => /Выбрать|Принять|Занято/.test(x.textContent.trim())).map(x => x.textContent.trim().slice(0, 20) + (x.disabled ? ' [off]' : '')))));
    pick1 = await tryPick();
  }
  await page.waitForTimeout(1600);
  put('ACCEPT CLICK:', String(pick1));
  put('OFFER BUTTONS AFTER:', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('button')].filter(x => /Выбрать|Принять|Занято/.test(x.textContent.trim())).map(x => x.textContent.trim().slice(0, 20) + (x.disabled ? ' [off]' : '')))));
  put('STATE AFTER ACCEPT:', await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const k = keys.find(x => x.startsWith('iforge_campaign')) || keys.find(x => x.startsWith('iforge'));
    try { const s = JSON.parse(localStorage.getItem(k)); return JSON.stringify({ key: k, researchUsed: s?.player?.dailyOrders?.researchUsed, ap: s?.player?.ap, bps: s?.player?.blueprints?.map(b => b.scienceName), offersLeft: s?.player?.scienceChoices?.projects?.length ?? 0 }); } catch { return 'n/a ' + k; }
  }));
  put('BLOCK MESSAGE:', (await txt(page)).match(/(Приказ|Исследование)[^\n]*/g)?.slice(0, 3).join(' ; '));
  // удаление проекта из кодекса
  const del = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /Убрать/.test(x.title || '') || /Убрать|Удалить/.test(x.getAttribute('aria-label') || ''));
    if (b) { b.click(); return 'clicked: ' + (b.title || b.getAttribute('aria-label')); }
    return 'no delete control';
  });
  await page.waitForTimeout(1200);
  put('DELETE:', del, '| bps:', await page.evaluate(() => { try { const k = Object.keys(localStorage).find(x => x.startsWith('iforge_campaign')); const s = JSON.parse(localStorage.getItem(k)); return JSON.stringify(s.player.blueprints.map(b => b.scienceName)); } catch { return 'n/a'; } }));
  await shot(page, dir, `${vpName}-09-develop-after-accept`);

  /* --- Карта --- */
  await tab(page, 'Карта');
  await page.waitForTimeout(1000);
  await shot(page, dir, `${vpName}-10-map`);
  put('MAP OVERFLOW:', JSON.stringify(await overflow(page)));
  put('MAP:', JSON.stringify(await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('button[aria-label]')].filter(b => (b.getAttribute('aria-label') || '').length > 3);
    return {
      labels: tiles.map(b => (b.getAttribute('aria-label') || '').split(',')[0]).slice(0, 8),
      accented: tiles.map(b => b.getAttribute('aria-label') || '').filter(s => /\u0301/.test(s)).length,
      clamp: document.querySelectorAll('.line-clamp-2').length,
      overflowTiles: tiles.filter(b => b.scrollWidth > b.clientWidth + 1).map(b => b.innerText.replace(/\s+/g, ' ').trim()).slice(0, 6),
    };
  })));

  /* --- Настройки --- */
  if (mobile) await page.evaluate(() => { document.querySelector('[aria-label="Настройки"]')?.click(); });
  else await clickText(page, 'Настройки');
  await page.waitForTimeout(900);
  await shot(page, dir, `${vpName}-11-settings`);
  put('SETTINGS:', JSON.stringify(await page.evaluate(() => ({
    dialog: !!document.querySelector('[role="dialog"]'),
    groups: [...document.querySelectorAll('optgroup')].map(g => g.label.slice(0, 40)),
    options: [...document.querySelectorAll('optgroup option')].map(o => o.textContent.trim().slice(0, 30)),
    selected: [...document.querySelectorAll('select')].map(s => s.value),
  }))));
  put('SETTINGS OVERFLOW:', JSON.stringify(await overflow(page)));
} catch (e) {
  put('SCRIPT ERROR:', String(e).split('\n')[0]);
} finally {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/${vpName}-log.txt`, t.join('\n\n'));
  log(t.join('\n\n'));
  log('PAGE ERRORS:', JSON.stringify(errors.slice(0, 8)));
  await ctx.close();
}
