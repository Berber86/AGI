import { newPage, onboarding, tab, shot, log, clickText, txt } from './lib.mjs';
import fs from 'fs';

const t = [];
const { ctx, page, errors } = await newPage({ profile: '/tmp/v2' });
const put = (...a) => { t.push(a.join(' ')); };

try {
  await page.goto('http://localhost:8144/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await onboarding(page);

  /* ---------- 1. Ополчение: выбор и слоты ---------- */
  await tab(page, 'Армия');
  await page.waitForTimeout(700);
  await shot(page, '01-army-militia');
  const army = await txt(page);
  put('ARMY:', army.split('Кого возьмём в ополчение')[1]?.slice(0, 600)?.replace(/\n/g, ' | '));
  const picked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('вывод ') && b.offsetHeight > 20);
    const names = btns.map(b => b.textContent.replace(/\s+/g, ' ').slice(0, 34));
    ['Топорники', 'Разведчики', 'Охотники'].forEach(w => { const b = btns.find(x => x.textContent.includes(w)); if (b) b.click(); });
    return names;
  });
  await page.waitForTimeout(600);
  await shot(page, '02-army-militia-chosen');
  put('POOL:', JSON.stringify(picked));
  put('STORED PICKS:', await page.evaluate(() => localStorage.getItem('iforge_militia')));
  put('SLOTS:', await page.evaluate(() => [...document.querySelectorAll('div')].filter(d => /ополчение/.test(d.innerText || '') && (d.innerText || '').length < 200).map(d => d.innerText.replace(/\s+/g, ' ').trim()).slice(0, 4)));

  /* ---------- 2. Учебный бой ---------- */
  await clickText(page, 'В бой');
  await page.waitForTimeout(1000);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Начать бой')); if (b) b.click(); });
  await page.waitForTimeout(2500);
  await shot(page, '03-tutorial-battle');
  const energyText = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(d => /^вы/i.test(d.innerText?.trim() || '') && /\d\/\d/.test(d.innerText));
    const opp = [...document.querySelectorAll('div')].find(d => /^враг/i.test(d.innerText?.trim() || '') && /\d\/\d/.test(d.innerText));
    return { me: el ? el.innerText.replace(/\s+/g, ' ').trim() : 'n/a', enemy: opp ? opp.innerText.replace(/\s+/g, ' ').trim() : 'n/a' };
  });
  put('ENERGY:', JSON.stringify(energyText));
  put('SHOTS MAKE SENSE? header:', (await txt(page)).slice(0, 200).replace(/\n/g, ' | '));
  const coach = () => page.evaluate(() => (document.body.innerText.match(/Учебный бой\.[\s\S]{1,160}?(?=\n|$)/) || [])[0]?.replace(/\s+/g, ' '));
  put('COACH1:', await coach());
  put('MILITIA BADGES IN HAND:', await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => /ополч/.test(b.textContent)).length));
  put('ENEMY STRUCTURE WORDS:', await page.evaluate(() => (document.body.innerText.match(/здание/gi) || []).length));

  // ставим самую дешёвую карту из руки
  const deploy = await page.evaluate(() => {
    const vh = window.innerHeight;
    const cards = [...document.querySelectorAll('button')].filter(x => { const r = x.getBoundingClientRect(); return r.top > vh - 220 && r.width > 40 && r.width < 170 && r.height > 40; });
    const costed = cards.map(c => ({ c, cost: parseInt((c.textContent.trim().match(/^(\d+)/) || [])[1] || '99', 10) })).filter(o => o.cost <= 2).sort((a, b) => a.cost - b.cost);
    if (!costed[0]) return 'no affordable card';
    costed[0].c.click();
    return 'picked cost ' + costed[0].cost;
  });
  await page.waitForTimeout(400);
  put('DEPLOY CARD:', deploy);
  await shot(page, '04a-card-selected');
  const slot = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '+ выйти'); if (b) { b.click(); return 'ok'; } return 'no slot'; });
  await page.waitForTimeout(600);
  put('SLOT CLICK:', slot);
  put('COACH2 (after deploy):', await coach());
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Конец\s*хода/.test(x.textContent)); if (b) b.click(); });
  await page.waitForTimeout(2600);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Конец\s*хода/.test(x.textContent)); if (b) b.click(); });
  await page.waitForTimeout(1800);
  put('COACH3 (turn 2):', await coach());
  await shot(page, '04-tutorial-turn2');

  /* ---------- 3. Модалка правил ---------- */
  await clickText(page, 'Правила');
  await page.waitForTimeout(700);
  await shot(page, '05-rules-modal');
  const rules = await txt(page);
  put('RULES MODAL:', rules.slice(rules.indexOf('Как идёт бой'), rules.indexOf('Как идёт бой') + 850).replace(/\n/g, ' | '));
  await page.evaluate(() => { const b = document.querySelector('[aria-label="Закрыть"]'); if (b) b.click(); });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  put('MODAL CLOSED:', await page.evaluate(() => !document.querySelector('[role="dialog"]')));

  /* ---------- выход из боя ---------- */
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Отступить'); if (b) b.click(); });
  await page.waitForTimeout(800);
  await page.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(x => x.textContent.trim() === 'Отступить'); if (bs.length) bs[bs.length - 1].click(); });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'К армии'); if (b) b.click(); });
  await page.waitForTimeout(1000);
  put('AFTER RETREAT URL:', page.url().slice(-60));
  put('AFTER RETREAT TEXT:', (await txt(page)).slice(0, 140).replace(/\n/g, ' | '));

  /* ---------- 4. Кодекс: первое дело -> советник -> приказ ---------- */
  await tab(page, 'Развитие');
  await page.waitForTimeout(700);
  await clickText(page, 'Изучить науку');
  await page.waitForTimeout(1200);
  await clickText(page, 'Построить здание');
  await page.waitForTimeout(1400);
  await shot(page, '06-develop-guided-done');
  put('GUIDE DONE TEXT:', (await txt(page)).slice(0, 260).replace(/\n/g, ' | '));
  await clickText(page, 'Спросить советника');
  await page.waitForTimeout(3200);
  await shot(page, '07-develop-offers');
  const dev = await txt(page);
  put('OFFERS:', dev.slice(dev.indexOf('Выберите один путь'), dev.indexOf('Выберите один путь') + 700).replace(/\n/g, ' | '));
  // приказ «Исследование» уже потрачен первым делом — завершаем день и пробуем снова
  put('BLOCKED BEFORE ENDDAY:', await page.evaluate(() => [...document.querySelectorAll('button')].filter(x => x.textContent.trim() === 'Выбрать').map(x => x.disabled + '|' + (x.title || '').slice(0, 60))));
  await clickText(page, 'Завершить день');
  await page.waitForTimeout(1400);
  await shot(page, '07b-day-report');
  put('DAY REPORT:', (await txt(page)).slice(0, 200).replace(/\n/g, ' | '));
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Наступает день/.test(x.textContent)); if (b) b.click(); });
  await page.waitForTimeout(1200);
  await tab(page, 'Развитие');
  await page.waitForTimeout(800);
  const chooseRes = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Выбрать' && !x.disabled);
    if (b) { b.click(); return 'clicked'; }
    return 'Выбрать disabled';
  });
  await page.waitForTimeout(1600);
  await shot(page, '08-codex-after-accept');
  put('CHOOSE:', chooseRes);
  put('STATE AFTER ACCEPT:', JSON.stringify(await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('iforge_campaign_v4'));
    return { researchUsed: s.player.dailyOrders.researchUsed, ap: s.player.ap, bps: s.player.blueprints.map(b => b.scienceName), offersLeft: s.player.scienceChoices?.projects?.length ?? 0 };
  })));
  put('ORDER BLOCK TEXT:', (await txt(page)).match(/Приказ «Исследование»[^\n]*/)?.join(' ; '));
  await page.waitForTimeout(300);
  put('SECOND OFFER DISABLED:', await page.evaluate(() => [...document.querySelectorAll('button')].filter(x => x.textContent.trim() === 'Выбрать').map(x => x.disabled)));
  const del = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => (x.title || '').includes('Убрать проект'));
    if (b) { b.click(); return 'clicked delete'; }
    return 'no delete button';
  });
  await page.waitForTimeout(1200);
  put('DELETE:', del, '| bps now:', JSON.stringify(await page.evaluate(() => JSON.parse(localStorage.getItem('iforge_campaign_v4')).player.blueprints.map(b => b.scienceName))));
  await shot(page, '08b-codex-after-delete');

  /* ---------- 5. Карта: полные имена ---------- */
  await tab(page, 'Карта');
  await page.waitForTimeout(1000);
  await shot(page, '09-map-names');
  const mapInfo = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('button[aria-label]')];
    return {
      labels: tiles.slice(0, 10).map(b => (b.getAttribute('aria-label') || '').split(',')[0]),
      accented: tiles.map(b => b.getAttribute('aria-label') || '').filter(s => /\u0301/.test(s)),
      clamp: tiles.filter(b => b.querySelector('.line-clamp-2')).length,
      tiles: tiles.length,
      overflow: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth },
    };
  });
  put('MAP:', JSON.stringify(mapInfo));

  /* ---------- 6. Настройки: сгруппированные модели ---------- */
  await clickText(page, 'Настройки');
  await page.waitForTimeout(900);
  await shot(page, '10-settings-models');
  const settings = await page.evaluate(() => ({
    dialog: !!document.querySelector('[role="dialog"]'),
    groups: [...document.querySelectorAll('optgroup')].map(g => ({ label: g.label, n: g.children.length })),
    selected: [...document.querySelectorAll('select')].map(s => s.value),
  }));
  put('SETTINGS:', JSON.stringify(settings));
} catch (e) {
  put('SCRIPT ERROR:', String(e).split('\n')[0]);
} finally {
  fs.writeFileSync('/tmp/pwb/desktop2.txt', t.join('\n\n'));
  log(t.join('\n\n'));
  log('PAGE ERRORS:', JSON.stringify(errors.slice(0, 12)));
  await ctx.close();
}
