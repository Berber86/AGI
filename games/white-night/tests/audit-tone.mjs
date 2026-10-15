// Objective tonal read of every find: mean luma, blown-out and crushed pixel share.
import fs from 'node:fs';
import sharp from 'sharp';

const folder = process.env.FOLDER || '../../.studio/evidence/screenshots/visual-v6-audit';
const files = fs.readdirSync(folder).filter(f => f.startsWith('item-') && f.endsWith('.webp')).sort();
const rows = [];
for (const f of files) {
  const {data, info} = await sharp(`${folder}/${f}`).raw().toBuffer({resolveWithObject: true});
  let sum = 0, n = 0, blown = 0, crushed = 0, dark = 0;
  for (let y = 250; y < 620; y++) {
    for (let x = 40; x < 372; x++) {
      const i = (y * info.width + x) * info.channels;
      const l = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
      sum += l; n++;
      if (l >= 248) blown++;
      if (l <= 26) crushed++;
      if (l >= 60) dark++;
    }
  }
  rows.push({
    id: f.replace('item-', '').replace('.webp', ''),
    mean: +(sum / n).toFixed(1),
    blownPct: +(blown / n * 100).toFixed(1),
    crushedPct: +(crushed / n * 100).toFixed(1),
    litPct: +(dark / n * 100).toFixed(1),
  });
}
rows.sort((a, b) => a.mean - b.mean);
console.log('id'.padEnd(10), 'mean'.padEnd(7), 'blown%'.padEnd(8), 'crushed%'.padEnd(9), 'lit%');
for (const r of rows) console.log(r.id.padEnd(10), String(r.mean).padEnd(7), String(r.blownPct).padEnd(8), String(r.crushedPct).padEnd(9), r.litPct);
