// Дымовые проверки «Шарик-непоседа»: node games/tilt-ball-maze/tests/smoke.mjs
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok  ' : 'FAIL  ') + msg); if (!cond) failed++; };

// Файлы на месте
for (const f of ['index.html', 'styles.css', 'src/levels.js', 'src/game.js', 'manifest.webmanifest', 'sw.js', 'icon.svg', 'cover.svg']) {
  ok(existsSync(join(root, f)), `файл ${f}`);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
const js = readFileSync(join(root, 'src/game.js'), 'utf8');

// Управление — только датчики наклона
ok(js.includes('deviceorientation'), 'слушается DeviceOrientationEvent (гироскоп)');
ok(js.includes('devicemotion'), 'слушается DeviceMotionEvent (акселерометр)');
ok(js.includes('accelerationIncludingGravity'), 'акселерометр: accelerationIncludingGravity');
ok(js.includes('requestPermission'), 'iOS-разрешения на датчики запрашиваются');
ok(js.includes('calBeta') && js.includes('calGamma'), 'есть калибровка нуля наклона');
ok(!/canvas\.addEventListener\('pointer/.test(js) && !/canvas\.addEventListener\("pointer/.test(js),
  'игровое поле НЕ управляет шариком касаниями');
ok(!/addEventListener\('touchmove'/.test(js.split('emuPad')[0]), 'нет тач-управления шариком вне эмулятора');
ok(js.includes("inputMode === 'emu'"), 'эмулятор наклона — отдельный явный режим для компьютера');
ok(js.includes('window.__tiltMaze'), 'есть тестовый хук window.__tiltMaze');
ok(html.includes('btnEnableSensors'), 'стартовый экран: большая кнопка с телефоном и треугольником');
ok(js.includes('NUMBER_WORDS') && js.includes('speechSynthesis'), 'счёт до 10 произносится голосом');
ok(js.includes('popCount') && js.includes('sndCount'), 'каждый шарик: большая цифра и нотка');

// Уровни: структура и проходимость (BFS от старта)
const LEVELS = require(join(root, 'src/levels.js'));
ok(Array.isArray(LEVELS) && LEVELS.length >= 5, `уровней >= 5 (сейчас ${LEVELS.length})`);

for (const [i, lv] of LEVELS.entries()) {
  const tag = `уровень ${i + 1} «${lv.name}»`;
  const h = lv.grid.length, w = lv.grid[0].length;
  ok(lv.grid.every(r => r.length === w), `${tag}: все строки одной ширины`);
  ok(lv.grid[0].split('').every(c => c === '#') && lv.grid[h - 1].split('').every(c => c === '#'), `${tag}: верх/низ закрыты стенами`);
  let start, finish; const stars = [];
  lv.grid.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === 'S') start = [x, y];
    if (c === 'F') finish = [x, y];
    if (c === '*') stars.push([x, y]);
  }));
  ok(!!start && !!finish, `${tag}: есть старт и финиш`);
  ok(stars.length === 10, `${tag}: ровно 10 шариков для счёта до десяти (сейчас ${stars.length})`);
  const seen = new Set([start.join(',')]); const q = [start];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if (seen.has(k) || !lv.grid[ny] || lv.grid[ny][nx] === '#' || lv.grid[ny][nx] === undefined) continue;
      seen.add(k); q.push([nx, ny]);
    }
  }
  ok(seen.has(finish.join(',')), `${tag}: финиш достижим от старта`);
  ok(!/[A-Za-zА-Яа-яЁё]/.test(lv.hintEmoji || ''), `${tag}: подсказка — только картинки, без букв`);
  ok(stars.every(s => seen.has(s.join(','))), `${tag}: все звёздочки достижимы`);
}

// Физика: грубая симуляция «шарик не проходит сквозь стены» на чистой логике уровней не проверяется,
// но проверяем ключевые константы/функции в исходнике.
ok(js.includes('function collide'), 'есть столкновение шарика со стенами');
ok(js.includes('function stepPhysics'), 'есть шаг физики');
ok(js.includes('ACCEL'), 'ускорение шарика задаётся наклоном');

// Ни одного слова на экране (для нечитающего ребёнка)
const visibleHtml = html
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<title>[\s\S]*?<\/title>/g, '')
  .replace(/aria-label="[^"]*"/g, '')
  .replace(/<script[\s\S]*?<\/script>/g, '');
const textNodes = [...visibleHtml.matchAll(/>([^<>]+)</g)].map(m => m[1].trim()).filter(Boolean);
ok(textNodes.every(t => !/[A-Za-zА-Яа-яЁё]/.test(t)), 'на экране нет слов: только эмодзи, картинки и цифры (' + JSON.stringify(textNodes) + ')');
const toasts = [...js.matchAll(/showToast\('([^']*)'/g)].map(m => m[1]);
ok(toasts.every(t => !/[A-Za-zА-Яа-яЁё]/.test(t)), 'все всплывающие сообщения — без букв: ' + JSON.stringify(toasts));

console.log(failed ? `\n❌ Провалено проверок: ${failed}` : '\n✅ Все проверки пройдены');
process.exit(failed ? 1 : 0);
