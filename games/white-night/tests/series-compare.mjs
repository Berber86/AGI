// Side-by-side read of two saved critique series, find by find.
//
//   FOLDER_A=../../.studio/evidence/screenshots/visual-v7-critique \
//   FOLDER_B=../../.studio/evidence/screenshots/visual-v8-critique \
//   node tests/series-compare.mjs
//
// Both folders must hold item-<id>.webp frames shot in the same 412x915 viewport with
// the same stage rect, which is what tests/critique-capture.mjs guarantees. The numbers
// are deliberately mask-free: the whole stage rect is measured, so a change in the
// reveal veil cannot move a pixel from "backdrop" to "find" and confound the result.
import fs from 'node:fs';
import sharp from 'sharp';

const a = process.env.FOLDER_A || '../../.studio/evidence/screenshots/visual-v7-critique';
const b = process.env.FOLDER_B || '../../.studio/evidence/screenshots/visual-v8-critique';
const stage = {x: 20, y: 244, width: 372, height: 371};
const out = process.env.OUT || '../../.studio/evidence/reports/visual-v7-v8-frames.json';

const stat = async file => {
  const {data, info} = await sharp(file).raw().toBuffer({resolveWithObject: true});
  const lum = [];
  let crushed = 0, blown = 0, lit = 0;
  for (let y = stage.y; y < Math.min(info.height, stage.y + stage.height); y++) {
    for (let x = stage.x; x < Math.min(info.width, stage.x + stage.width); x++) {
      const i = (y * info.width + x) * info.channels;
      const v = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
      lum.push(v);
      if (v <= 26) crushed++;
      if (v >= 248) blown++;
      if (v >= 90) lit++;
    }
  }
  lum.sort((p, q) => p - q);
  const at = f => +lum[Math.min(lum.length - 1, Math.floor(lum.length * f))].toFixed(1);
  const mean = +(lum.reduce((s, v) => s + v, 0) / lum.length).toFixed(1);
  // Texture energy: median local sd over 6x6 patches that are actually lit.
  const sds = [];
  for (let y = stage.y + 36; y < stage.y + stage.height - 40; y += 8) {
    for (let x = stage.x + 20; x < stage.x + stage.width - 20; x += 8) {
      let s = 0, s2 = 0, n = 0;
      for (let j = 0; j < 6; j++) for (let i2 = 0; i2 < 6; i2++) {
        const i = ((y + j) * info.width + x + i2) * info.channels;
        const v = data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
        s += v; s2 += v * v; n++;
      }
      const m = s / n;
      if (m > 40) sds.push(Math.sqrt(Math.max(0, s2 / n - m * m)));
    }
  }
  sds.sort((p, q) => p - q);
  return {
    mean, median: at(.5), p25: at(.25), p75: at(.75),
    crushed: +(crushed / lum.length * 100).toFixed(1),
    blown: +(blown / lum.length * 100).toFixed(2),
    lit: +(lit / lum.length * 100).toFixed(1),
    texture: sds.length ? +sds[Math.floor(sds.length / 2)].toFixed(2) : null,
  };
};

const ids = fs.readdirSync(b).filter(f => /^item-[a-z]+\.webp$/.test(f)).map(f => f.slice(5, -5)).sort();
const rows = [];
console.log('id'.padEnd(9), 'median A→B'.padEnd(16), 'mean A→B'.padEnd(15), 'crushed% A→B'.padEnd(17), 'lit% A→B'.padEnd(14), 'texture A→B');
for (const id of ids) {
  const fa = `${a}/item-${id}.webp`, fb = `${b}/item-${id}.webp`;
  if (!fs.existsSync(fa) || !fs.existsSync(fb)) continue;
  const [sa, sb] = [await stat(fa), await stat(fb)];
  rows.push({id, a: sa, b: sb});
  console.log(id.padEnd(9),
    `${sa.median} → ${sb.median}`.padEnd(16),
    `${sa.mean} → ${sb.mean}`.padEnd(15),
    `${sa.crushed} → ${sb.crushed}`.padEnd(17),
    `${sa.lit} → ${sb.lit}`.padEnd(14),
    `${sa.texture} → ${sb.texture}`);
}
const agg = key => ({
  a: {min: Math.min(...rows.map(r => r.a[key])), max: Math.max(...rows.map(r => r.a[key]))},
  b: {min: Math.min(...rows.map(r => r.b[key])), max: Math.max(...rows.map(r => r.b[key]))},
});
const med = key => ({
  a: [+(rows.reduce((s, r) => s + r.a[key], 0) / rows.length).toFixed(1), Math.min(...rows.map(r => r.a[key])), Math.max(...rows.map(r => r.a[key]))],
  b: [+(rows.reduce((s, r) => s + r.b[key], 0) / rows.length).toFixed(1), Math.min(...rows.map(r => r.b[key])), Math.max(...rows.map(r => r.b[key]))],
});
console.log('\nfinds compared:', rows.length);
for (const key of ['median', 'mean', 'crushed', 'blown', 'lit', 'texture']) {
  const m = med(key);
  console.log(key.padEnd(8), 'A avg', String(m.a[0]).padEnd(6), `[${m.a[1]}..${m.a[2]}]`.padEnd(14), '→ B avg', String(m.b[0]).padEnd(6), `[${m.b[1]}..${m.b[2]}]`);
}
fs.writeFileSync(out, JSON.stringify({stage, a, b, rows}, null, 2));
console.log('REPORT', out);
