// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/art.js
//  Процедурная графика. Никаких картинок извне: каждая карта выглядит ровно
//  так, как собрана.
//
//  Шестерни рисуются математикой (SVG-path с чередованием внешнего радиуса и
//  впадин), «арт» карты — это зубчатая передача её открытий на гравированном
//  фоне домена. Колёса расставляются так, чтобы зубья реально цеплялись друг
//  за друга, а не плавали рядом: расстояние между центрами равно сумме
//  радиусов минус глубина зуба.
// =============================================================================

import { GEARS, DOMAINS } from '../engine/gears.js';
import { hashString, makeRng } from '../engine/rng.js';

const TEETH = { mech: 10, fire: 8, alloy: 12, doctrine: 6, optics: 9, bio: 7, volt: 11, chem: 8, cipher: 14, psyche: 5 };

/** Глубина зуба относительно радиуса: нужна, чтобы колёса цеплялись визуально. */
const TOOTH_DEPTH = 0.26;

// Счётчик уникальных id для <defs>: на странице десятки сигилов одновременно,
// а одинаковые id в SVG — это «градиент первого элемента применяется ко всем».
let uid = 0;
const nextId = (p) => `${p}${(uid++).toString(36)}`;

/** Контур шестерни: чередование внешнего радиуса и впадин. */
export function gearPath(cx, cy, R, teeth, phase = 0) {
  const r = R * (1 - TOOTH_DEPTH);
  const step = (Math.PI * 2) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * step;
    const p = (rad, ang) => `${(cx + Math.cos(ang) * rad).toFixed(2)} ${(cy + Math.sin(ang) * rad).toFixed(2)}`;
    // Трапециевидный зуб: основание шире вершины, как у настоящей нарезки.
    const pts = [
      p(r, a),
      p(R, a + step * 0.24),
      p(R, a + step * 0.42),
      p(r, a + step * 0.60),
      p(r, a + step * 1.0),
    ];
    d += (i === 0 ? 'M' : 'L') + pts.join('L');
  }
  return d + 'Z';
}

/**
 * Одна шестерня как SVG-разметка.
 * opts: { dim, phase, letter, w, h, flat }
 */
export function gearSVG(gearId, size = 34, opts = {}) {
  const g = GEARS[gearId] || GEARS.mech;
  const teeth = TEETH[gearId] || 8;
  const R = size / 2 - 1;
  const cx = size / 2, cy = size / 2;
  const dim = opts.dim ? 0.32 : 1;
  const phase = opts.phase || 0;
  const id = nextId('g');
  const sw = Math.max(0.6, size / 40);

  // Мелкие шестерни (в списках и на кнопках) рисуются плоско: градиент и блик
  // на 13px всё равно не читаются, а стоимость рендера остаётся.
  if (opts.flat || size <= 18) {
    return `<svg class="gear" viewBox="0 0 ${size} ${size}" width="${opts.w || size}" height="${opts.h || size}" style="opacity:${dim}" aria-hidden="true">
      <path d="${gearPath(cx, cy, R, teeth, phase)}" fill="${g.color}" stroke="${darken(g.color, 0.5)}" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${R * 0.4}" fill="${darken(g.color, 0.62)}"/>
      ${opts.letter === false ? '' : `<text x="${cx}" y="${cy + size * 0.115}" text-anchor="middle" font-size="${size * 0.34}" font-weight="700" fill="${lighten(g.color, 0.8)}" font-family="inherit">${g.letter}</text>`}
    </svg>`;
  }

  return `<svg class="gear" viewBox="0 0 ${size} ${size}" width="${opts.w || size}" height="${opts.h || size}" style="opacity:${dim}" aria-hidden="true">
    <defs>
      <radialGradient id="${id}-m" cx="34%" cy="28%" r="78%">
        <stop offset="0%" stop-color="${lighten(g.color, 0.55)}"/>
        <stop offset="46%" stop-color="${g.color}"/>
        <stop offset="100%" stop-color="${darken(g.color, 0.45)}"/>
      </radialGradient>
      <linearGradient id="${id}-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity=".38"/>
        <stop offset="55%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${gearPath(cx, cy, R, teeth, phase)}" fill="url(#${id}-m)" stroke="${darken(g.color, 0.58)}" stroke-width="${sw}"/>
    <path d="${gearPath(cx, cy, R, teeth, phase)}" fill="url(#${id}-b)"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.46}" fill="${darken(g.color, 0.66)}" stroke="${lighten(g.color, 0.22)}" stroke-width="${Math.max(0.5, size / 50)}"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.2}" fill="${darken(g.color, 0.8)}"/>
    ${opts.letter === false ? '' : `<text x="${cx}" y="${cy + size * 0.125}" text-anchor="middle" font-size="${size * 0.36}" font-weight="800" fill="${lighten(g.color, 0.85)}" font-family="inherit" style="paint-order:stroke" stroke="${darken(g.color, 0.75)}" stroke-width="${size / 46}">${g.letter}</text>`}
  </svg>`;
}

/**
 * «Арт» карты: зубчатая передача её открытий на гравированном фоне домена.
 * bp — проект карты (нужны gearCounts, domain, era, key/name, slots).
 */
export function sigilSVG(bp, size = 150) {
  const S = size;
  const rng = makeRng(hashString(bp.key || bp.name || 'x'));
  const dom = DOMAINS[bp.domain] || DOMAINS.craft;
  const counts = bp.gearCounts || {};
  const ids = Object.keys(counts);
  const id = nextId('sg');
  const cx = S / 2, cy = S / 2;
  const slots = bp.slots || ids.length || 1;

  // --- раскладка передачи ---------------------------------------------------
  // Крупнейшее колесо садится в центр, остальные пристраиваются к уже
  // поставленным по касательной — так зубья зацепляются, а не висят в воздухе.
  const placed = ids.map((gid) => ({
    gid,
    n: counts[gid],
    R: S * (0.135 + Math.min(0.085, counts[gid] * 0.03)),
  })).sort((a, b) => b.R - a.R || b.n - a.n);

  const wheels = [];
  placed.forEach((w, i) => {
    if (i === 0) {
      w.cx = cx + (rng.next() - 0.5) * S * 0.05;
      w.cy = cy + (rng.next() - 0.5) * S * 0.05;
      w.phase = rng.next() * Math.PI * 2;
    } else {
      // Цепляемся к случайному из уже поставленных (чаще к первому — к оси).
      const host = wheels[rng.next() < 0.62 ? 0 : Math.floor(rng.next() * wheels.length)];
      const ang = rng.next() * Math.PI * 2;
      const touch = host.R + w.R - S * 0.022;          // лёгкое перекрытие зубьев
      w.cx = host.cx + Math.cos(ang) * touch;
      w.cy = host.cy + Math.sin(ang) * touch * 0.94;
      // Фаза подобрана так, чтобы зуб вошёл во впадину колеса-соседа.
      const teethHost = TEETH[host.gid] || 8, teethW = TEETH[w.gid] || 8;
      w.phase = Math.PI / teethW + ang * (teethHost / teethW) + host.phase * 0.5;
    }
    // Мягко возвращаем в кадр, если колесо вылезло за пределы.
    w.cx = Math.min(S * 0.86, Math.max(S * 0.14, w.cx));
    w.cy = Math.min(S * 0.86, Math.max(S * 0.14, w.cy));
    wheels.push(w);
  });

  const accent = rarityAccent(slots);

  return `<svg class="sigil" viewBox="0 0 ${S} ${S}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="${id}-bg" cx="50%" cy="40%" r="76%">
        <stop offset="0%" stop-color="${lighten(dom.color, 0.16)}" stop-opacity=".92"/>
        <stop offset="52%" stop-color="${darken(dom.color, 0.55)}" stop-opacity=".94"/>
        <stop offset="100%" stop-color="#080a0e" stop-opacity=".99"/>
      </radialGradient>
      <radialGradient id="${id}-vig" cx="50%" cy="46%" r="72%">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".72"/>
      </radialGradient>
      <linearGradient id="${id}-gloss" x1="0" y1="0" x2=".4" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity=".13"/>
        <stop offset="42%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <pattern id="${id}-grid" width="${(S / 12).toFixed(2)}" height="${(S / 12).toFixed(2)}" patternUnits="userSpaceOnUse">
        <path d="M ${(S / 12).toFixed(2)} 0 L 0 0 0 ${(S / 12).toFixed(2)}" fill="none" stroke="${lighten(dom.color, 0.4)}" stroke-width=".5" stroke-opacity=".09"/>
      </pattern>
      <filter id="${id}-sh" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="${(S * 0.012).toFixed(1)}" stdDeviation="${(S * 0.014).toFixed(1)}" flood-color="#000" flood-opacity=".62"/>
      </filter>
      <radialGradient id="${id}-wheel" cx="34%" cy="28%" r="80%">
        <stop offset="0%" stop-color="#fff" stop-opacity=".22"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${S}" height="${S}" fill="url(#${id}-bg)"/>
    <rect width="${S}" height="${S}" fill="url(#${id}-grid)"/>
    ${sunburst(cx, cy, S, dom.color)}
    ${engravedRings(cx, cy, S, dom.color)}
    <text x="${cx}" y="${cy + S * 0.17}" text-anchor="middle" font-size="${S * 0.52}" font-weight="800"
          fill="${lighten(dom.color, 0.5)}" fill-opacity=".07" font-family="inherit">${dom.glyph}</text>

    <g class="sigil__train" filter="url(#${id}-sh)">
      ${wheels.map((w) => wheelSVG(w, id)).join('')}
    </g>

    ${dialRing(cx, cy, S, bp.era || 1, accent)}
    <rect width="${S}" height="${S}" fill="url(#${id}-vig)"/>
    <rect width="${S}" height="${S}" fill="url(#${id}-gloss)"/>
    <circle cx="${cx}" cy="${cy}" r="${S * 0.485}" fill="none" stroke="${accent}" stroke-opacity=".22" stroke-width="${Math.max(0.6, S / 160)}"/>
    <text x="${(S - S * 0.045).toFixed(2)}" y="${(S - S * 0.045).toFixed(2)}" text-anchor="end" font-size="${(S * 0.085).toFixed(2)}"
          fill="${dom.color}" opacity=".92" font-weight="800">${dom.glyph}</text>
  </svg>`;
}

/** Колесо передачи: металл, фаска, спицы, ступица и болт. */
function wheelSVG(w, id) {
  const g = GEARS[w.gid];
  const teeth = TEETH[w.gid] || 8;
  const gid = nextId('w');
  const R = w.R;
  const sw = Math.max(0.5, R * 0.055);
  const hub = R * 0.44;
  // Спицы: 5 штук, у мелких колёс — меньше, чтобы не сливались в кашу.
  const spokes = R > 16 ? (teeth > 9 ? 6 : 5) : 0;
  let spokePath = '';
  for (let i = 0; i < spokes; i++) {
    const a = w.phase + (i / spokes) * Math.PI * 2;
    const x1 = w.cx + Math.cos(a) * hub * 0.92, y1 = w.cy + Math.sin(a) * hub * 0.92;
    const x2 = w.cx + Math.cos(a) * R * 0.7, y2 = w.cy + Math.sin(a) * R * 0.7;
    spokePath += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="${darken(g.color, 0.55)}" stroke-width="${(R * 0.075).toFixed(1)}" stroke-linecap="round" opacity=".85"/>`;
  }
  // Контур зуба весит больше всего остального, поэтому объявляем его один раз
  // и дважды используем через <use>: под металл и под блик фаски.
  const path = gearPath(w.cx, w.cy, R, teeth, w.phase);
  return `<g class="wheel">
    <defs><path id="${gid}-p" d="${path}"/></defs>
    <use href="#${gid}-p" fill="${darken(g.color, 0.22)}" stroke="${lighten(g.color, 0.32)}" stroke-width="${sw}"/>
    <use href="#${gid}-p" fill="url(#${id}-wheel)"/>
    <circle cx="${w.cx}" cy="${w.cy}" r="${(R * 0.74).toFixed(1)}" fill="none" stroke="${darken(g.color, 0.5)}" stroke-width="${(R * 0.05).toFixed(1)}" opacity=".7"/>
    ${spokePath}
    <circle cx="${w.cx}" cy="${w.cy}" r="${hub.toFixed(1)}" fill="#0f1218" stroke="${g.color}" stroke-width="${sw}"/>
    <circle cx="${w.cx}" cy="${w.cy}" r="${(hub * 0.42).toFixed(1)}" fill="${darken(g.color, 0.35)}" opacity=".9"/>
    ${w.n > 1 ? `<text x="${w.cx}" y="${(w.cy + hub * 0.42).toFixed(1)}" text-anchor="middle" font-size="${(hub * 1.05).toFixed(1)}"
      font-weight="800" fill="${lighten(g.color, 0.72)}" style="paint-order:stroke" stroke="#0b0d12" stroke-width="${(hub * 0.22).toFixed(1)}">×${w.n}</text>` : ''}
  </g>`;
}

/** Лучи от центра — гравировка, задающая глубину под колёсами. */
function sunburst(cx, cy, S, color) {
  const rays = 28, r1 = S * 0.06, r2 = S * 0.52;
  // Два суммарных контура (чётные/нечётные лучи) вместо 28 элементов <line>:
  // рисунок тот же, а вес и число узлов рендера — в разы меньше.
  const build = (parity) => {
    let d = '';
    for (let i = parity; i < rays; i += 2) {
      const a = (i / rays) * Math.PI * 2;
      d += `M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}`
        + `L${(cx + Math.cos(a) * r2).toFixed(1)} ${(cy + Math.sin(a) * r2).toFixed(1)}`;
    }
    return d;
  };
  const sw = (S / 220).toFixed(2);
  return `<g opacity=".16" stroke="${lighten(color, 0.55)}" stroke-width="${sw}" fill="none">
    <path d="${build(0)}"/><path d="${build(1)}" opacity=".45"/>
  </g>`;
}

/** Концентрические кольца с насечкой — «чертёжный» фон домена. */
function engravedRings(cx, cy, S, color) {
  const c = lighten(color, 0.3);
  return `<g fill="none" stroke="${c}" stroke-opacity=".16">
    <circle cx="${cx}" cy="${cy}" r="${(S * 0.2).toFixed(1)}" stroke-width="${(S / 260).toFixed(2)}"/>
    <circle cx="${cx}" cy="${cy}" r="${(S * 0.31).toFixed(1)}" stroke-width="${(S / 300).toFixed(2)}" stroke-dasharray="${(S / 60).toFixed(1)} ${(S / 40).toFixed(1)}"/>
    <circle cx="${cx}" cy="${cy}" r="${(S * 0.41).toFixed(1)}" stroke-width="${(S / 300).toFixed(2)}"/>
  </g>`;
}

/** Циферблат эпохи: деления по кругу и горящие точки пройденных эпох. */
function dialRing(cx, cy, S, era, color) {
  const r = S * 0.462;
  const ticks = 24;
  let s = `<g fill="none" stroke="${color}">`;
  // Деления — тоже суммарными контурами: длинные и короткие отдельно.
  const build = (long) => {
    let d = '';
    for (let i = 0; i < ticks; i++) {
      if ((i % 6 === 0) !== long) continue;
      const a = (i / ticks) * Math.PI * 2 - Math.PI / 2;
      const r1 = r - (long ? S * 0.028 : S * 0.014);
      d += `M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}`
        + `L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    }
    return d;
  };
  s += `<path d="${build(true)}" stroke-opacity=".42" stroke-width="${(S / 150).toFixed(2)}"/>`;
  s += `<path d="${build(false)}" stroke-opacity=".2" stroke-width="${(S / 240).toFixed(2)}"/>`;
  for (let i = 0; i < Math.min(6, era); i++) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    const px = cx + Math.cos(a) * r * 0.9, py = cy + Math.sin(a) * r * 0.9;
    s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(S * 0.017).toFixed(2)}" fill="${color}" opacity=".85"/>`;
    s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(S * 0.03).toFixed(2)}" fill="${color}" opacity=".16"/>`;
  }
  return s + '</g>';
}

/** Акцент рамки по редкости: обычная — сталь, легендарная — золото. */
function rarityAccent(slots) {
  return slots >= 4 ? '#e8c766' : slots === 3 ? '#d9b45a' : slots === 2 ? '#c08a4a' : '#93a0b0';
}

// --- цвета ------------------------------------------------------------------
function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function hex2rgb(h) {
  const s = String(h).replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
export function lighten(hex, amt = 0.2) { const [r, g, b] = hex2rgb(hex); return `rgb(${clamp(r + (255 - r) * amt)},${clamp(g + (255 - g) * amt)},${clamp(b + (255 - b) * amt)})`; }
export function darken(hex, amt = 0.2) { const [r, g, b] = hex2rgb(hex); return `rgb(${clamp(r * (1 - amt))},${clamp(g * (1 - amt))},${clamp(b * (1 - amt))})`; }

export { TEETH, rarityAccent };
