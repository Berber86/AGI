// Reveal timeline, measured from the saved frames of two critique series.
//
//   FOLDER_A=../../.studio/evidence/screenshots/visual-v7-critique \
//   FOLDER_B=../../.studio/evidence/screenshots/visual-v8-critique \
//   node tests/series-reveal.mjs
//
// Both series walk the same progress points [0.05 0.2 0.25 0.4 0.55 0.7 0.85 1] in the same
// 412x915 viewport, so frame-to-frame comparison is legitimate. Everything is measured inside
// the stage rect, which is fixed by inspectionRect() and does not move between the series.
import fs from 'node:fs';
import sharp from 'sharp';

const a = process.env.FOLDER_A || '../../.studio/evidence/screenshots/visual-v7-critique';
const b = process.env.FOLDER_B || '../../.studio/evidence/screenshots/visual-v8-critique';
const points = [0.05, 0.2, 0.25, 0.4, 0.55, 0.7, 0.85, 1];
const stage = {x: 20, y: 244, w: 372, h: 371};
const out = process.env.OUT || '../../.studio/evidence/reports/visual-v7-v8-reveal.json';

const file = (folder, p) => `${folder}/reveal-${String(p).replace('.', '_')}.webp`;

const measure = async path => {
  const {data, info} = await sharp(path).raw().toBuffer({resolveWithObject: true});
  let sum = 0, n = 0, max = 0, lit = 0, dark = 0;
  for (let y = stage.y; y < Math.min(info.height, stage.y + stage.h); y++) {
    for (let x = stage.x; x < Math.min(info.width, stage.x + stage.w); x++) {
      const i = (y * info.width + x) * info.channels;
      const v = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
      sum += v; n++;
      if (v > max) max = v;
      if (v >= 90) lit++;
      if (v <= 26) dark++;
    }
  }
  return {mean: +(sum / n).toFixed(1), max: Math.round(max), lit: +(lit / n * 100).toFixed(2), dark: +(dark / n * 100).toFixed(1)};
};

const rows = [];
console.log('p'.padEnd(6), 'mean A→B'.padEnd(17), 'max A→B'.padEnd(13), 'lit% A→B'.padEnd(17), 'dark% A→B');
for (const p of points) {
  const fa = file(a, p), fb = file(b, p);
  if (!fs.existsSync(fa) || !fs.existsSync(fb)) { console.log(String(p).padEnd(6), 'missing frame'); continue; }
  const [sa, sb] = [await measure(fa), await measure(fb)];
  rows.push({p, a: sa, b: sb});
  console.log(String(p).padEnd(6),
    `${sa.mean} → ${sb.mean}`.padEnd(17),
    `${sa.max} → ${sb.max}`.padEnd(13),
    `${sa.lit} → ${sb.lit}`.padEnd(17),
    `${sa.dark} → ${sb.dark}`);
}
// The failure the critique named: the frame gets darker before it gets lighter.
const dip = (key, side) => {
  let worst = {drop: 0, from: null, to: null};
  for (let i = 1; i < rows.length - 1; i++) {
    const d = rows[i][side][key] - rows[0][side][key];
    if (d < worst.drop) worst = {drop: +d.toFixed(1), from: rows[0].p, to: rows[i].p};
  }
  return worst;
};
console.log('\ndarkest dip vs p=0.05 (mean):  A', JSON.stringify(dip('mean', 'a')), ' B', JSON.stringify(dip('mean', 'b')));
console.log('final mean at p=1:            A', rows.at(-1).a.mean, ' B', rows.at(-1).b.mean);
fs.writeFileSync(out, JSON.stringify({stage, a, b, rows}, null, 2));
console.log('REPORT', out);
