// Юнит-тесты распознавания: node games/cube-picture/tests/vision.test.mjs
import { analyze, rotateGrid } from '../src/vision.js';
import { PALETTE, PICTURES, grid } from '../src/pictures.js';
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
};

for (const pic of PICTURES) {
  section(`${pic.emoji} ${pic.id}`);
  const target = grid(pic);
  const cubeSize = (rows) => Math.min(56, Math.floor(250 / Math.max(rows.length, rows[0].length)));

  for (const [name, s] of Object.entries(scenes)) {
    const rows = rotateRows(pic.rows, s.k || 0);
    const real = s.real ? { textures: REAL, bgTexture: REAL.bg, noise: 4 } : {};
    const img = renderScene(rows, { size: 360, cube: s.cube || cubeSize(rows), ...s, ...real, seed: 11 + (s.k || 0) });
    const res = analyze(img, target, PALETTE);
    ok(res.ok, `${pic.id}: верная сборка распознана — ${name} (reason=${res.reason}, ошибок ${res.mismatches.length})`);
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
        const decoy = setCell(pic.rows, r, c, DECOY[ch]);
        res = analyze(renderScene(decoy, { size: 360, cube: cubeSize(decoy), seed: 5 }), target, PALETTE);
        ok(!res.ok, `${pic.id}: ${DECOY[ch] === 'C' ? 'голубой' : 'сиреневый'} вместо (${r},${c}) не засчитан`);
        res = analyze(renderScene(decoy, { size: 360, cube: cubeSize(decoy), textures: REAL, bgTexture: REAL.bg, noise: 4 }), target, PALETTE);
        ok(!res.ok, `${pic.id}: настоящий ${DECOY[ch] === 'C' ? 'голубой' : 'сиреневый'} кубик вместо (${r},${c}) не засчитан`);
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
