// trackingqa.mjs — приёмка стенда трекинга камерой.
// Настоящей камеры в песочнице нет: синтетические кадры (чёрный фон +
// круг цвета метки) прогоняются через тот же analyze→углы конвейер.
// Usage: node trackingqa.mjs (из /home/user/tools)
import puppeteer from 'puppeteer-core';

process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';

const PAGE = process.argv[2] || 'http://127.0.0.1:8899/games/candy-kingdom-coaster/tracking-stand/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 420, height: 860, isMobile: true, hasTouch: true },
  protocolTimeout: 120000,
});
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS ' : 'FAIL '} ${name}  ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 130)));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 130)); });

await page.goto(PAGE, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__TRACK__', { timeout: 30000 });
record('стенд загрузился, хуки на месте', true, '');

// 1. режим мишени: круг виден, размер регулируется
const target = await page.evaluate(() => {
  window.__TRACK__.setMode(true);
  const dot = document.getElementById('target-dot');
  const before = dot.offsetWidth;
  const slider = document.getElementById('target-size');
  slider.value = 30;
  slider.dispatchEvent(new Event('input'));
  return { before, after: dot.offsetWidth, visible: !document.getElementById('view-target').classList.contains('hidden') };
});
record('мишень: круг виден, ползунок меняет размер', target.visible && target.before > 0 && target.after < target.before, target);

// 2. синтетика по центру: yaw/pitch ≈ 0, дистанция считается
const center = await page.evaluate(() => window.__TRACK__.feed(160, 120, 40));
record('метка по центру: углы около нуля', center.found && Math.abs(center.yaw) < 0.7 && Math.abs(center.pitch) < 0.7, center);
record('дистанция по размеру пятна (~47 см при D=15)', center.distCm > 38 && center.distCm < 58, center.distCm);

// 3. смещение метки: yaw +15°, pitch +10°
const fx = 160 / Math.tan((65 * Math.PI / 180) / 2);
const off = await page.evaluate((dx, dy) => window.__TRACK__.feed(160 + dx, 120 + dy, 40),
  Math.tan(15 * Math.PI / 180) * fx, -Math.tan(10 * Math.PI / 180) * fx);
record('метка правее/выше: yaw≈+15°, pitch≈+10°', off.found && Math.abs(off.yaw - 15) < 1.6 && Math.abs(off.pitch - 10) < 1.6, off);

// 4. потеря и повторный поиск фиксируются статистикой
const loss = await page.evaluate(async () => {
  window.__TRACK__.feed(160, 120, 40);
  await new Promise((r) => setTimeout(r, 60));
  window.__TRACK__.feedEmpty();
  await new Promise((r) => setTimeout(r, 60));
  window.__TRACK__.feedEmpty();
  const mid = window.__TRACK__.state();
  window.__TRACK__.feed(160, 120, 40);
  const end = window.__TRACK__.state();
  return { mid, end };
});
record('потеря метки посчитана один раз', loss.mid.losses >= 1 && loss.end.losses === loss.mid.losses, loss.mid);
record('повторный поиск метки зафиксирован', loss.end.reacq.length >= 1, loss.end);

// 5. калибровка обнуляет углы на текущей метке
const calib = await page.evaluate(() => {
  window.__TRACK__.feed(227, 120, 40);
  window.__TRACK__.calibrate();
  return window.__TRACK__.feed(227, 120, 40);
});
record('после «Смотрю на мишень» та же метка даёт yaw≈0', calib.found && Math.abs(calib.yaw) < 0.7, calib);

// 6. журнал точек
await page.evaluate(() => document.getElementById('btn-point').click());
const rows = await page.evaluate(() => window.__TRACK__.state().rows);
record('точка записывается в журнал', rows === 1, rows);

// 7. короткий тест покоя даёт вердикт-цифры
await page.evaluate(() => {
  window.__TRACK__.calibrate();
  window.__TRACK__.startDrift(2);
  window.__TRACK__.feed(160, 120, 40);
});
await sleep(500);
await page.evaluate(() => { window.__TRACK__.feed(160, 120, 40); window.__TRACK__.feed(161, 120, 40); });
await sleep(2200);
const drift = await page.evaluate(() => window.__TRACK__.state().lastDrift);
record('тест покоя: цифры дрейфа получены, камера стабильна', !!drift && drift.n >= 2 && drift.camDrift < 1, drift);

// 7b. посторонний объект того же цвета больше не уводит центроид
const pair = await page.evaluate(() => {
  window.__TRACK__.feedPair();
  window.__TRACK__.calibrate(); // ноль — по крупной метке
  return window.__TRACK__.feedPair();
});
record('крупнейшее пятно побеждает мелкий «хлебный» объект', pair.found && Math.abs(pair.yaw) < 1.2, pair);

// 7c. прямоугольник: крен по моментам, заполнение, дистанция по длинной стороне
const rect = await page.evaluate(() => {
  window.__TRACK__.feed(160, 120, 40);
  window.__TRACK__.calibrate();
  window.__TRACK__.setShape('rect');
  return window.__TRACK__.feedRect(160, 120, 120, 70, 25);
});
record('прямоугольник: найден, крен ≈ +25°', rect.found && Math.abs(rect.roll - 25) < 4, rect);
record('прямоугольник: заполнение > 85%, дистанция по ширине (~31 см)',
  rect.fill > 0.85 && rect.distCm > 24 && rect.distCm < 40, rect);

// 7d. свой цвет объекта (малиновая коробка): калибровка оттенка
const custom = await page.evaluate(() => {
  window.__TRACK__.setShape('circle');
  window.__TRACK__.setCustomHue(200);
  const good = window.__TRACK__.feedColor(160, 120, 38, [0, 170, 255]);
  const alien = window.__TRACK__.feedColor(160, 120, 38, [255, 0, 255]);
  return { good: good.found, alien: alien.found };
});
record('свой оттенок: свой цвет ловится, чужой — нет', custom.good === true && custom.alien === false, custom);

// 8. режим мишени запоминается после перезагрузки
await page.reload({ waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForFunction('!!window.__TRACK__', { timeout: 30000 });
const persisted = await page.evaluate(() => !document.getElementById('view-target').classList.contains('hidden'));
record('режим мишени пережил перезагрузку', persisted, persisted);

record('ошибок на странице нет', errors.length === 0, errors);

const failed = results.filter((r) => !r.pass);
console.log(`\nTRACKINGQA: ${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
