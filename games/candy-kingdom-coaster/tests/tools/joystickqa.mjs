// joystickqa.mjs — приёмка стенда задержки (демо-режим в двух вкладках).
// Настоящий Firebase в песочнице недоступен; проверяем транспорт на
// BroadcastChannel: комната по коду, руль доходит до экрана, пинг-понг
// собирает статистику и вердикт, счётчики трафика растут.
// Usage: node joystickqa.mjs (из /home/user/tools)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const BASE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/joystick-stand/index.html';

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 420, height: 800, isMobile: true, hasTouch: true },
  protocolTimeout: 120000,
});

const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const host = await browser.newPage();
const joy = await browser.newPage();
const errors = [];
for (const p of [host, joy]) {
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 120)); });
  await p.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction('!!window.__STAND__', { timeout: 30000 });
}

// 1. экран создаёт комнату в демо-режиме
await host.evaluate(() => { window.__STAND__.demo(); window.__STAND__.host(); });
await sleep(300);
const code = await host.evaluate(() => window.__STAND__.room());
record('комната создана, код из 6 цифр', /^\d{6}$/.test(code || ''), code);

// 2. джойстик входит по коду
await joy.evaluate((c) => { window.__STAND__.demo(); window.__STAND__.join(c); }, code);
await sleep(300);
const joyState = await joy.evaluate(() => window.__STAND__.state());
record('джойстик подключился к той же комнате', joyState.role === 'joy' && joyState.room === code, joyState);

// 3. руль доходит до экрана
await joy.evaluate(() => window.__STAND__.setSteer(true, false));
await sleep(300);
const view = await host.evaluate(() => ({
  left: document.getElementById('view-left').classList.contains('on'),
  right: document.getElementById('view-right').classList.contains('on'),
  link: document.getElementById('host-link').textContent,
}));
record('экран видит нажатое «влево»', view.left && !view.right, view);
await joy.evaluate(() => window.__STAND__.setSteer(false, false));

// 4. реальное касание большой кнопки джойстика
{
  await joy.evaluate(() => document.getElementById('joy-right').scrollIntoView({ block: 'center' }));
  await sleep(250);
  const box = await joy.evaluate(() => {
    const r = document.getElementById('joy-right').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await joy.touchscreen.touchStart(box.x, box.y);
  await sleep(250);
  const during = await host.evaluate(() => document.getElementById('view-right').classList.contains('on'));
  await joy.touchscreen.touchEnd();
  await sleep(250);
  const after = await host.evaluate(() => document.getElementById('view-right').classList.contains('on'));
  record('касание ▶ на джойстике = руль на экране, отпуск = отпущено', during && !after, { during, after });
}

// 5. пинг-понг собирает статистику и вердикт (интервал 2 с — ждём ~12 с)
await sleep(12000);
const joyStats = await joy.evaluate(() => ({
  n: document.getElementById('st-n').textContent,
  rtt: document.getElementById('st-rtt').textContent,
  msgs: document.getElementById('st-msgs').textContent,
  bytes: document.getElementById('st-bytes').textContent,
  verdict: window.__STAND__.verdict(),
}));
record('пинг-понг: есть замеры, медиана и вердикт',
  Number(joyStats.n) >= 5 && joyStats.rtt !== '—' && /Firebase|WebRTC|погранично/.test(joyStats.verdict), joyStats);
record('счётчики сообщений и трафика растут', !/^0 \/ 0$/.test(joyStats.msgs) && !/0 Б \/ 0 Б/.test(joyStats.bytes), joyStats);

await joy.screenshot({ path: '/home/user/AGI/games/candy-kingdom-coaster/tests/evidence/joystick-stand.png' });
record('ошибок на страницах нет', errors.length === 0, errors.slice(0, 3));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\nJOYSTICKQA: ${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
