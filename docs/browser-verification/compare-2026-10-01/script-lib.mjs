import fs from 'fs';
import mod from '@sparticuz/chromium';
import pw from 'playwright-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2/lib';
const chromiumMod = mod.default || mod;

export function log(...a) { console.log(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')); }

function scienceProject() {
  return { scienceName: 'Обжиг и тигель', scienceDescription: 'Обжиг руды в тигле даёт первую медь.', buildingName: 'Горн у обрыва', buildingDescription: 'Глиняный горн с мехами из шкур.', category: 'science', effects: [{ type: 'income_materials', amount: 1 }], rationale: 'Кузнецы ищут камень и огонь.' };
}
function offers() {
  return { projects: [
    { scienceName: 'Террасное земледелие', scienceDescription: 'Террасы держат воду.', buildingName: 'Ступени у воды', buildingDescription: 'Земляные ступени под ячмень.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }] },
    { scienceName: 'Ограда и дозор', scienceDescription: 'Частокол отделяет своё от чужого.', buildingName: 'Вал с частоколом', buildingDescription: 'Вал в заострённых брёвнах.', category: 'military', effects: [{ type: 'max_hp', amount: 1 }] },
    { scienceName: 'Счёт звёзд', scienceDescription: 'Счёт ночей угадывает время сева.', buildingName: 'Лунный круг', buildingDescription: 'Круг из двенадцати столбов.', category: 'science', effects: [{ type: 'income_knowledge', amount: 1 }] },
  ] };
}
export function contentFor(body) {
  const sys = body?.messages?.[0]?.content || '';
  if (/первое дело народа/.test(sys)) return scienceProject();
  if (/РАЗНЫХ проекта|3 РАЗНЫХ|разных проекта/i.test(sys)) return offers();
  if (/Военный советник кузницы/.test(sys)) return { choices: [
    { card_type: 'unit', title: 'Копейщики обрыва', pitch: 'Держат брод.' },
    { card_type: 'spell', title: 'Дым над водой', pitch: 'Дым слепит врага.' },
    { card_type: 'structure', title: 'Сушильня', pitch: 'Рыба на ветру.' }] };
  if (/ИИ-Кузнец/.test(sys)) return { name: 'Копейщики обрыва', card_type: 'unit', era: 'ancient', emoji: '🛡️', drop_cost: 2, action_cost: 1, hp: 4, atk: 2, description: 'Держат брод.', tags: [], abilities: [], keywords: ['phalanx'], effects: [], monkey_paw: '' };
  if (/летописец/.test(sys)) return { name: 'Рыбацкий навес', description: 'Навес над водой.' };
  return { ok: true };
}

export async function newPage({ profile, viewport = { width: 1440, height: 900 }, mobile = false } = {}) {
  const exe = await chromiumMod.executablePath();
  const ctx = await pw.chromium.launchPersistentContext(profile, {
    executablePath: exe, args: [...chromiumMod.args, '--no-sandbox', '--disable-dev-shm-usage'],
    headless: true, viewport, locale: 'ru-RU', isMobile: mobile, hasTouch: mobile,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + String(e).split('\n')[0]));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
  await page.route('**/api/hydra', async r => {
    let body = {}; try { body = r.request().postDataJSON(); } catch {}
    await r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { content: JSON.stringify(contentFor(body)) } }] }) });
  });
  return { ctx, page, errors };
}

export async function clickText(page, t, timeout = 8000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const n = await page.evaluate((x) => {
      const bs = [...document.querySelectorAll('button,a')].filter(b => (b.offsetWidth || b.offsetHeight) && !b.disabled && b.textContent.replace(/\s+/g, ' ').trim().includes(x));
      if (!bs.length) return 0;
      bs[bs.length - 1].click(); return bs.length;
    }, t);
    if (n) return n;
    await page.waitForTimeout(200);
  }
  return 0;
}

export async function onboarding(page) {
  await clickText(page, 'Перебросить название'); await clickText(page, 'Далее'); await page.waitForTimeout(350);
  await clickText(page, 'Береговые Рыбаки'); await clickText(page, 'Далее'); await page.waitForTimeout(350);
  await clickText(page, 'Река и рыба'); await clickText(page, 'Далее'); await page.waitForTimeout(350);
  await clickText(page, 'Далее'); await page.waitForTimeout(2200);
  await clickText(page, 'Создать первое дело'); await page.waitForTimeout(2600);
  await clickText(page, 'Начать первый день'); await page.waitForTimeout(1200);
}

export async function tab(page, name) {
  await page.evaluate((n) => { const bs = [...document.querySelectorAll('button')].filter(x => x.textContent.trim() === n && x.offsetHeight); const b = bs[bs.length - 1]; if (b) b.click(); }, name);
  await page.waitForTimeout(900);
}

export const txt = (page) => page.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n'));
export const overflow = (page) => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));

export async function shot(page, dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  try {
    await page.screenshot({ path: `${dir}/${name}.png`, timeout: 20000, animations: 'disabled', caret: 'hide' });
    return `${dir}/${name}.png`;
  } catch (e) {
    try {
      await page.evaluate(() => document.querySelectorAll('.animate-pulse-soft,.animate-pulse,.animate-spin').forEach(el => { el.style.animation = 'none'; }));
      await page.screenshot({ path: `${dir}/${name}.png`, timeout: 20000 });
      return `${dir}/${name}.png (retry)`;
    } catch (e2) {
      fs.writeFileSync(`${dir}/${name}.error.txt`, String(e2));
      return `${dir}/${name}.png FAILED`;
    }
  }
}
