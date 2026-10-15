// Build contact sheets from the audit screenshots so a whole set can be reviewed at once.
import fs from 'node:fs';
import sharp from 'sharp';

const folder = process.argv[2] || '../../.studio/evidence/screenshots/visual-v6-audit';
const out = process.argv[3] || '../../.studio/evidence/screenshots/visual-v6-audit/sheets';
const group = Number(process.argv[4] || 4);
const cols = Number(process.argv[5] || 2);
fs.mkdirSync(out, {recursive: true});

const files = fs.readdirSync(folder).filter(f => f.endsWith('.webp') && f !== 'sheets.webp').sort();
const cell = 460;
const rows = Math.ceil(group / cols);
const sheets = [];
for (let i = 0; i < files.length; i += group) {
  const chunk = files.slice(i, i + group);
  const composites = [];
  for (let j = 0; j < chunk.length; j++) {
    const buf = await sharp(`${folder}/${chunk[j]}`).resize(cell, Math.round(cell * 2.2), {fit: 'contain', background: '#000'}).toBuffer();
    composites.push({input: buf, left: (j % cols) * cell, top: Math.floor(j / cols) * Math.round(cell * 2.2)});
  }
  const name = `sheet-${String(sheets.length + 1).padStart(2, '0')}.webp`;
  await sharp({create: {width: cols * cell, height: rows * Math.round(cell * 2.2), channels: 3, background: '#111'}})
    .composite(composites).webp({quality: 84}).toFile(`${out}/${name}`);
  sheets.push({name, files: chunk});
}
fs.writeFileSync(`${out}/index.json`, JSON.stringify(sheets, null, 2));
console.log(sheets.map(s => s.name + ': ' + s.files.join(', ')).join('\n'));
