// Юнит-тесты распознавания: node games/cube-picture/tests/vision.test.mjs
import { analyze, rotateGrid } from '../src/vision.js';
import { PALETTE, PICTURES, PLAY_COLORS, grid } from '../src/pictures.js';
import { renderScene, rotateRows, setCell } from './synth.mjs';
import { realCubeTextures } from './png.mjs';
import { fileURLToPath } from 'node:url';

const REAL = realCubeTextures(fileURLToPath(new URL('./fixtures-real-cubes.png', import.meta.url)));

let failed = 0;
let passed = 0;
const ok = (cond, msg) => {
  if (cond) passed++;
  else {
    failed++;
    console.log('FAIL  ' + msg);
  }
};
const section = (name) => console.log('\n# ' + name);

section('rotateGrid');
{
  const g = [['A', 'B', null], ['C', 'D', 'E']];
  const r1 = rotateGrid(g, 1).map((row) => row.map((x) => x.v));
  ok(JSON.stringify(r1) === JSON.stringify([['C', 'A'], ['D', 'B'], ['E', null]]), 'поворот на 90° по часовой');
  const r4 = rotateGrid(g, 4).map((row) => row.map((x) => x.v));
  ok(JSON.stringify(r4) === JSON.stringify(g), 'четыре поворота = исходная');
  ok(JSON.stringify(rotateRows(['AB.', 'CDE'], 1)) === JSON.stringify(['CA', 'DB', 'E.']), 'synth.rotateRows совпадает с rotateGrid');
}

// Замены на самый похожий цвет — самые трудные ошибки.
const OTHER = { R: 'K', K: 'R', Y: 'G', G: 'B', B: 'P', P: 'B' };
// Цвета из набора, которых нет в картинках: голубой вместо синего, сиреневый вместо фиолетового.
const DECOY = { B: 'C', P: 'L' };
const scenes = {
  'прямо, бумага': {},
  'поворот 90°': { k: 1 },
  'поворот 180° + наклон 8°': { k: 2, angle: 8 },
  'поворот 270° + наклон −14°': { k: 3, angle: -14 },
  'тёплая лампа': { tint: [1.12, 0.96, 0.72] },
  'холодный свет + шум': { tint: [0.86, 0.96, 1.14], noise: 18 },
  'мелкие кубики, сдвиг': { cube: 34, offset: [30, -20] },
  'рука у края кадра': { specks: [{ x: 0, y: 200, r: 60, color: [222, 170, 140] }] },
  'крошка на столе': { specks: [{ x: 60, y: 330, r: 3, color: [40, 90, 190] }] },
  'серый стол': { bg: 'gray' },
  'кубики светлее (×1.4)': { boost: 1.4 },
  'кубики темнее (×0.75)': { boost: 0.75 },
  'настоящие кубики с фото': { real: true },
  'настоящие кубики, поворот 90° + наклон 10°': { real: true, k: 1, angle: 10 },
  'настоящие кубики, светлее ×1.3': { real: true, boost: 1.3 },
  'настоящие кубики, тёплая лампа': { real: true, tint: [1.1, 0.97, 0.8] },
  'неаккуратно: зазоры и сдвиги': { gap: 9, wobble: 6, angle: 4 },
  'наклон 35°': { angle: 35, cube: 40 },
  'камера под углом (трапеция)': { keystone: 0.25, angle: -6 },
  'всё сразу': { k: 1, angle: 20, wobble: 5, gap: 7, keystone: 0.18, tint: [1.08, 0.97, 0.8], bg: 'gray', noise: 16, cube: 42 },
  // Трудный свет и «характер» камеры — широкий допуск должен справляться.
  'кремовая бумага': { bgColor: [242, 228, 192] },
  'голубоватая тень': { bgColor: [196, 210, 230] },
  'телефон усилил цвета (×1.4)': { sat: 1.4 },
  'блёклые цвета (×0.65)': { sat: 0.65 },
  'тоновая кривая 0.7': { gamma: 0.7 },
  'тоновая кривая 1.4': { gamma: 1.4 },
  'сильная лампа накаливания': { tint: [1.25, 0.95, 0.62] },
  'смешанный свет: лампа слева, окно справа': { tint: [1.15, 0.97, 0.75], tintSide: [0.88, 0.97, 1.15] },
  'настоящие кубики, усиленные цвета': { real: true, sat: 1.4 },
  'настоящие кубики, кремовая бумага': { real: true, bgColor: [242, 228, 192] },
  'настоящие кубики, смешанный свет': { real: true, tint: [1.15, 0.97, 0.75], tintSide: [0.88, 0.97, 1.15] },
  'настоящие кубики, блёклые цвета': { real: true, sat: 0.7 },
};
// Строгий допуск: прежнее поведение на обычном свете.
const STRICT_SCENES = ['прямо, бумага', 'поворот 90°', 'тёплая лампа', 'серый стол', 'настоящие кубики с фото'];

for (const pic of PICTURES) {
  section(`${pic.emoji} ${pic.id}`);
  const target = grid(pic);
  const cubeSize = (rows) => Math.min(56, Math.floor(250 / Math.max(rows.length, rows[0].length)));

  for (const [name, s] of Object.entries(scenes)) {
    const rows = rotateRows(pic.rows, s.k || 0);
    const real = s.real ? { textures: REAL, bgTexture: s.bgColor ? null : REAL.bg, noise: 4 } : {};
    const img = renderScene(rows, { size: 360, cube: s.cube || cubeSize(rows), ...s, ...real, seed: 11 + (s.k || 0) });
    const res = analyze(img, target, PALETTE);
    ok(res.ok, `${pic.id}: верная сборка распознана — ${name} (reason=${res.reason}, ошибок ${res.mismatches.length})`);
    if (STRICT_SCENES.includes(name)) {
      const st = analyze(img, target, PALETTE, { tolerance: 'strict' });
      ok(st.ok, `${pic.id}: строгий допуск — верная сборка распознана — ${name} (reason=${st.reason})`);
    }
    if (s.k && res.ok) ok(res.rotation === s.k * 90 || isSymmetric(pic.rows, s.k, res.rotation), `${pic.id}: угол поворота ${s.k * 90}° (получили ${res.rotation})`);
  }

  // Каждый кубик по очереди: другой цвет / убран / цвет вне палитры.
  pic.rows.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      if (ch === '.') return;
      const swapped = setCell(pic.rows, r, c, OTHER[ch]);
      let res = analyze(renderScene(swapped, { size: 360, cube: cubeSize(swapped), seed: r * 7 + c }), target, PALETTE);
      ok(!res.ok, `${pic.id}: кубик (${r},${c}) ${ch}→${OTHER[ch]} не засчитан`);
      ok(res.mismatches.length === 1 && res.mismatches[0].src[0] === r && res.mismatches[0].src[1] === c,
        `${pic.id}: ошибка указана ровно в клетке (${r},${c}) — получили ${JSON.stringify(res.mismatches.map((m) => m.src))}`);

      const missing = setCell(pic.rows, r, c, '.');
      if (missing.join('').replace(/\./g, '').length) {
        res = analyze(renderScene(missing, { size: 360, cube: cubeSize(pic.rows), seed: r * 5 + c, angle: 3 }), target, PALETTE);
        ok(!res.ok, `${pic.id}: без кубика (${r},${c}) сборка не засчитана`);
      }

      const white = setCell(pic.rows, r, c, 'W');
      res = analyze(renderScene(white, { size: 360, cube: cubeSize(white), seed: 3 }), target, PALETTE);
      ok(!res.ok, `${pic.id}: белый кубик вместо (${r},${c}) не засчитан`);

      if (DECOY[ch]) {
        // Голубой вместо синего, сиреневый вместо фиолетового: широкий допуск засчитывает, строгий — нет.
        const name = DECOY[ch] === 'C' ? 'голубой' : 'сиреневый';
        const decoy = setCell(pic.rows, r, c, DECOY[ch]);
        const synth = renderScene(decoy, { size: 360, cube: cubeSize(decoy), seed: 5 });
        const realImg = renderScene(decoy, { size: 360, cube: cubeSize(decoy), textures: REAL, bgTexture: REAL.bg, noise: 4 });
        ok(analyze(synth, target, PALETTE).ok, `${pic.id}: широкий допуск — ${name} вместо (${r},${c}) засчитан`);
        ok(analyze(realImg, target, PALETTE).ok, `${pic.id}: широкий допуск — настоящий ${name} вместо (${r},${c}) засчитан`);
        ok(!analyze(synth, target, PALETTE, { tolerance: 'strict' }).ok, `${pic.id}: строгий допуск — ${name} вместо (${r},${c}) не засчитан`);
        ok(!analyze(realImg, target, PALETTE, { tolerance: 'strict' }).ok, `${pic.id}: строгий допуск — настоящий ${name} вместо (${r},${c}) не засчитан`);
      }
      {
        const st = analyze(renderScene(swapped, { size: 360, cube: cubeSize(swapped), seed: r * 7 + c }), target, PALETTE, { tolerance: 'strict' });
        ok(!st.ok && st.mismatches.length === 1, `${pic.id}: строгий допуск — ${ch}→${OTHER[ch]} в (${r},${c}) найден`);
      }
      const realSwap = setCell(pic.rows, r, c, OTHER[ch]);
      res = analyze(renderScene(realSwap, { size: 360, cube: cubeSize(realSwap), textures: REAL, bgTexture: REAL.bg, noise: 4, angle: 3 }), target, PALETTE);
      ok(!res.ok && res.mismatches.length === 1, `${pic.id}: настоящие кубики — ${ch}→${OTHER[ch]} в (${r},${c}) найден (ошибок ${res.mismatches.length})`);
    });
  });

  // Лишний кубик рядом с картинкой (новая колонка справа и строка снизу).
  {
    const wider = pic.rows.map((row, i) => row + (i === 0 ? 'G' : '.'));
    let res = analyze(renderScene(wider, { size: 360, cube: cubeSize(wider) }), target, PALETTE);
    ok(!res.ok, `${pic.id}: лишний кубик справа не засчитан`);
    const taller = [...pic.rows, 'R' + '.'.repeat(pic.rows[0].length - 1)];
    res = analyze(renderScene(taller, { size: 360, cube: cubeSize(taller) }), target, PALETTE);
    ok(!res.ok, `${pic.id}: лишний кубик снизу не засчитан`);
  }

  // Пустой стол.
  {
    const res = analyze(renderScene(['.'], { size: 360 }), target, PALETTE);
    ok(!res.ok && res.reason === 'empty', `${pic.id}: пустой стол → reason=empty (получили ${res.reason})`);
  }
}

function isSymmetric(rows, k, rotation) {
  return rotateRows(rows, k).join('|') === rotateRows(rows, rotation / 90).join('|');
}

// Режим «форма»: важна только форма, цвета любые из набора.
const ALL_KEYS = Object.keys(PALETTE);
const occupancy = (rows) => rows.map((r) => r.replace(/[^.]/g, '#')).join('|');
const sameShape = (a, b) => [0, 1, 2, 3].some((k) => occupancy(rotateRows(a, k)) === occupancy(b));
function recolor(rows, seed, keys = ALL_KEYS) {
  let s = seed * 2654435761 >>> 0 || 1;
  const next = () => ((s = (s * 1103515245 + 12345) >>> 0) >>> 8) % keys.length;
  return rows.map((row) => [...row].map((ch) => (ch === '.' ? '.' : keys[next()])).join(''));
}
for (const pic of PICTURES) {
  section(`форма: ${pic.emoji} ${pic.id}`);
  const target = grid(pic);
  const cubeSize = (rows) => Math.min(56, Math.floor(250 / Math.max(rows.length, rows[0].length)));
  const SHAPE = { mode: 'shape' };
  for (const [name, s] of Object.entries({
    'любые цвета': { seed: 1 },
    'другие любые цвета, поворот 90° + наклон 8°': { seed: 2, k: 1, angle: 8 },
    'все кубики одного цвета': { seed: 3, mono: 'G' },
    'настоящие кубики, любые цвета': { seed: 4, real: true },
    // Сиреневый на сером столе камера видит почти серым, как тень, — для этой сцены только 6 игровых цветов.
    'любые цвета, тёплая лампа + серый стол': { seed: 5, tint: [1.12, 0.96, 0.72], bg: 'gray', keys: PLAY_COLORS },
  })) {
    let rows = s.mono ? pic.rows.map((r) => r.replace(/[^.]/g, s.mono)) : recolor(pic.rows, s.seed, s.keys);
    rows = rotateRows(rows, s.k || 0);
    const real = s.real ? { textures: REAL, bgTexture: REAL.bg, noise: 4 } : {};
    const res = analyze(renderScene(rows, { size: 360, cube: cubeSize(rows), ...s, ...real, seed: 11 }), target, PALETTE, SHAPE);
    ok(res.ok, `${pic.id}: форма — ${name} засчитана (reason=${res.reason}, ошибок ${res.mismatches.length})`);
  }
  pic.rows.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      if (ch === '.') return;
      const missing = setCell(recolor(pic.rows, r + c), r, c, '.');
      if (!missing.join('').replace(/\./g, '').length) return;
      const res = analyze(renderScene(missing, { size: 360, cube: cubeSize(pic.rows), seed: r * 5 + c, angle: 3 }), target, PALETTE, SHAPE);
      ok(!res.ok, `${pic.id}: форма без кубика (${r},${c}) не засчитана`);
    });
  });
  {
    const wider = recolor(pic.rows, 9).map((row, i) => row + (i === 0 ? 'Y' : '.'));
    const res = analyze(renderScene(wider, { size: 360, cube: cubeSize(wider) }), target, PALETTE, SHAPE);
    ok(!res.ok, `${pic.id}: форма с лишним кубиком не засчитана`);
    const empty = analyze(renderScene(['.'], { size: 360 }), target, PALETTE, SHAPE);
    ok(!empty.ok && empty.reason === 'empty', `${pic.id}: форма — пустой стол не засчитан`);
  }
  for (const other of PICTURES) {
    if (other === pic || sameShape(other.rows, pic.rows)) continue;
    const res = analyze(renderScene(recolor(other.rows, 4), { size: 360, cube: 50 }), target, PALETTE, SHAPE);
    ok(!res.ok, `форма «${other.id}» не засчитана как «${pic.id}»`);
  }
}

// Другая картинка не должна засчитываться (кроме полностью совпадающих).
section('чужие картинки');
for (const a of PICTURES) {
  for (const b of PICTURES) {
    if (a === b) continue;
    const img = renderScene(a.rows, { size: 360, cube: 50 });
    const res = analyze(img, grid(b), PALETTE);
    ok(!res.ok, `сборка «${a.id}» не засчитана как «${b.id}»`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
