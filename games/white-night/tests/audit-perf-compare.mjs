// Compare two perf snapshots and enforce a budget. Graphics passes must not cost frames.
//
// Draw calls, triangles and geometries scale with the scene, so they are guarded
// relative to the previous snapshot. Textures do not: a texture is uploaded once
// and then costs nothing per frame, so a relative limit would ban any new surface
// detail for the wrong reason. They are guarded by an absolute allowance instead -
// a small, deliberate number of new textures, not a growing set.
import fs from 'node:fs';

const BUDGET = {drawCalls: 1.12, triangles: 1.12, geometries: 1.25};
const TEXTURE_ALLOWANCE = Number(process.env.TEXTURE_ALLOWANCE || 2);

const [a, b] = process.argv.slice(2);
if (!a || !b) { console.error('usage: node audit-perf-compare.mjs <before.json> <after.json>'); process.exit(2); }
const before = JSON.parse(fs.readFileSync(a));
const after = JSON.parse(fs.readFileSync(b));

const find = (rep, label) => rep.rows.find(r => r.label === label);
let failed = false;
console.log('state'.padEnd(26), 'calls'.padEnd(16), 'tris'.padEnd(16), 'geo'.padEnd(14), 'tex');
for (const row of after.rows) {
  const prev = find(before, row.label);
  if (!prev) { console.log(row.label.padEnd(26), '(no baseline)'); continue; }
  const d = (x, y) => `${x} -> ${y} (${x ? ((y / x - 1) * 100).toFixed(1) : '0.0'}%)`;
  const line = [row.label.padEnd(26),
    d(prev.drawCalls, row.drawCalls).padEnd(16),
    d(prev.triangles, row.triangles).padEnd(16),
    d(prev.geometries, row.geometries).padEnd(14),
    d(prev.textures, row.textures)];
  console.log(line.join(' '));
  for (const key of Object.keys(BUDGET)) {
    const ratio = prev[key] ? row[key] / prev[key] : 1;
    if (ratio > BUDGET[key]) { console.log(`  OVER BUDGET ${row.label} ${key}: ${(ratio).toFixed(3)} > ${BUDGET[key]}`); failed = true; }
  }
  if (row.textures - prev.textures > TEXTURE_ALLOWANCE) {
    console.log(`  OVER BUDGET ${row.label} textures: +${row.textures - prev.textures} > +${TEXTURE_ALLOWANCE}`);
    failed = true;
  }
}
if (after.errors.length) { console.log('PAGE ERRORS', after.errors); failed = true; }
console.log(failed ? 'BUDGET FAILED' : 'BUDGET OK');
process.exit(failed ? 1 : 0);
