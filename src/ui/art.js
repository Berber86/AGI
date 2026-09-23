// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/art.js
//  Процедурная графика: настоящие шестерни рисуются математикой (SVG-path),
//  а «арт» карты — это сцепление её шестерёнок. Никаких картинок извне:
//  каждая карта выглядит ровно так, как собрана.
// =============================================================================

import { GEARS, DOMAINS } from '../engine/gears.js';
import { hashString, makeRng } from '../engine/rng.js';

const TEETH = { mech: 10, fire: 8, alloy: 12, doctrine: 6, optics: 9, bio: 7, volt: 11, chem: 8, cipher: 14, psyche: 5 };

/** Контур шестерни: чередование внешнего радиуса и впадин. */
export function gearPath(cx, cy, R, teeth, phase = 0) {
  const r = R * 0.74;
  const step = (Math.PI * 2) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * step;
    const p = (rad, ang) => `${(cx + Math.cos(ang) * rad).toFixed(2)} ${(cy + Math.sin(ang) * rad).toFixed(2)}`;
    const pts = [
      p(r, a),
      p(R, a + step * 0.22),
      p(R, a + step * 0.44),
      p(r, a + step * 0.62),
      p(r, a + step * 1.0),
    ];
    d += (i === 0 ? 'M' : 'L') + pts.join('L');
  }
  return d + 'Z';
}

/** Одна шестерня как SVG-разметка. */
export function gearSVG(gearId, size = 34, opts = {}) {
  const g = GEARS[gearId] || GEARS.mech;
  const teeth = TEETH[gearId] || 8;
  const R = size / 2 - 1;
  const cx = size / 2, cy = size / 2;
  const dim = opts.dim ? 0.32 : 1;
  const phase = opts.phase || 0;
  return `<svg class="gear" viewBox="0 0 ${size} ${size}" width="${opts.w || size}" height="${opts.h || size}" style="opacity:${dim}">
    <defs><radialGradient id="gg-${g.id}" cx="35%" cy="30%">
      <stop offset="0%" stop-color="${lighten(g.color, 0.45)}"/><stop offset="100%" stop-color="${darken(g.color, 0.35)}"/>
    </radialGradient></defs>
    <path d="${gearPath(cx, cy, R, teeth, phase)}" fill="url(#gg-${g.id})" stroke="${darken(g.color, 0.55)}" stroke-width="${Math.max(0.6, size / 40)}"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.44}" fill="${darken(g.color, 0.62)}" stroke="${lighten(g.color, 0.2)}" stroke-width="${Math.max(0.5, size / 50)}"/>
    ${opts.letter === false ? '' : `<text x="${cx}" y="${cy + size * 0.115}" text-anchor="middle" font-size="${size * 0.34}" font-weight="700" fill="${lighten(g.color, 0.75)}" font-family="inherit">${g.letter}</text>`}
  </svg>`;
}

/** «Арт» карты: сцепленные шестерни её открытий на фоне домена. */
export function sigilSVG(bp, size = 150) {
  const rng = makeRng(hashString(bp.key || bp.name || 'x'));
  const dom = DOMAINS[bp.domain] || DOMAINS.craft;
  const counts = bp.gearCounts || {};
  const ids = Object.keys(counts);
  const id = `sg-${hashString((bp.key || bp.name) + size)}`;
  const gears = ids.map((gid, i) => {
    const n = counts[gid];
    const R = size * (0.14 + Math.min(0.1, n * 0.035));
    const ang = rng.next() * Math.PI * 2;
    const dist = size * (0.16 + rng.next() * 0.13);
    return { gid, R, cx: size / 2 + Math.cos(ang + i * 2.1) * dist, cy: size / 2 + Math.sin(ang + i * 1.7) * dist * 0.85, phase: rng.next() * 6.28, n };
  }).sort((a, b) => b.R - a.R);

  return `<svg class="sigil" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="${id}-bg" cx="50%" cy="42%">
        <stop offset="0%" stop-color="${lighten(dom.color, 0.12)}" stop-opacity="0.85"/>
        <stop offset="70%" stop-color="${darken(dom.color, 0.62)}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0d0f13" stop-opacity="0.98"/>
      </radialGradient>
      <filter id="${id}-sh"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity="0.55"/></filter>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#${id}-bg)"/>
    ${eraRing(bp.era, size, dom.color)}
    <g filter="url(#${id}-sh)">
      ${gears.map((g) => gearSVGAt(g.gid, g.cx, g.cy, g.R, g.phase, g.n)).join('')}
    </g>
    <text x="${size - 6}" y="${size - 6}" text-anchor="end" font-size="${size * 0.085}" fill="${dom.color}" opacity="0.9" font-weight="700">${dom.glyph}</text>
  </svg>`;
}

function gearSVGAt(gid, cx, cy, R, phase, n) {
  const g = GEARS[gid];
  const teeth = TEETH[gid] || 8;
  return `<g>
    <path d="${gearPath(cx, cy, R, teeth, phase)}" fill="${darken(g.color, 0.18)}" stroke="${lighten(g.color, 0.35)}" stroke-width="${Math.max(0.5, R * 0.06)}" opacity="0.96"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.42}" fill="#12151a" stroke="${g.color}" stroke-width="${Math.max(0.5, R * 0.05)}"/>
    ${n > 1 ? `<text x="${cx}" y="${cy + R * 0.22}" text-anchor="middle" font-size="${R * 0.62}" font-weight="800" fill="${lighten(g.color, 0.6)}">×${n}</text>` : ''}
  </g>`;
}

function eraRing(era, size, color) {
  const r = size * 0.46;
  let s = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-opacity="0.22" stroke-width="1"/>`;
  for (let i = 0; i < era; i++) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    s += `<circle cx="${(size / 2 + Math.cos(a) * r).toFixed(1)}" cy="${(size / 2 + Math.sin(a) * r).toFixed(1)}" r="${size * 0.018}" fill="${color}" opacity="0.75"/>`;
  }
  return s;
}

// --- цвета ------------------------------------------------------------------
function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function hex2rgb(h) {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
export function lighten(hex, amt = 0.2) { const [r, g, b] = hex2rgb(hex); return `rgb(${clamp(r + (255 - r) * amt)},${clamp(g + (255 - g) * amt)},${clamp(b + (255 - b) * amt)})`; }
export function darken(hex, amt = 0.2) { const [r, g, b] = hex2rgb(hex); return `rgb(${clamp(r * (1 - amt))},${clamp(g * (1 - amt))},${clamp(b * (1 - amt))})`; }
