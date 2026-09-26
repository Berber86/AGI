// parts.js — геном: органеллы, их уровни, эффекты и процедурная отрисовка.
//
// Каждая деталь описывает:
//   tab      — вкладка редактора (structure | metabolism | movement | senses)
//   slots    — сколько ячеек генома занимает установленная деталь
//   layers   — где рисовать: 'back' (позади тела), 'body' (на теле), 'front' (спереди)
//   levels[] — уровни: { dna: цена улучшения, eff: {эффект: значение} }
//   draw(g, s) — процедурная графика; g уже переведён в центр клетки и повёрнут по курсу,
//                s = { r, color, lvl, t, seed, phase }
//
// Единый словарь эффектов (суммируются по всем деталям):
//   maxHp, hpMul, speedMul, turnMul, armor, regen,
//   spikeDmg, spikeKnock, poison, stunOnBite, slowOnBite, lifeSteal, rushOnKill,
//   plantVal, meatVal, dnaMul, eatAll,
//   energyMax, energyRegen, upkeepMul, symbionts,
//   magnet, vision, dashPower, dashCd, cloakOnHit, attractSmall, nightVision,
//   abilityId (строка, берётся по приоритету), massMul, armorPierce

import { TAU, clamp, mixHex, shade, rgba, hash01 } from './util.js';

const C = (s, a = 1) => rgba(s.color, a);

// ---------- общие помощники рисования ----------
function ellipse(g, x, y, rx, ry, rot = 0) {
  g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, TAU); g.fill();
}
function seg(g, x1, y1, x2, y2, w, col, cap = 'round') {
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineWidth = w; g.strokeStyle = col; g.lineCap = cap; g.stroke();
}
function wobble(s, lane = 0) {
  return Math.sin(s.t * 4.2 + s.phase + lane * 1.9) * 0.5 + Math.sin(s.t * 7.1 + s.phase * 2 + lane) * 0.2;
}

// ==================================================================
// СТРУКТУРА
// ==================================================================

const cytoplasm = {
  id: 'cytoplasm', name: 'Цитоплазменное ядро', icon: '◉', tab: 'structure', slots: 0,
  maxLevel: 5, reqTier: 1,
  desc: 'Плотная цитоплазма утолщает мембрану и ускоряет заживление, но делает клетку тяжелее.',
  levels: [
    { dna: 24, eff: { maxHp: 12, regen: 0.35, speedMul: -0.01 } },
    { dna: 44, eff: { maxHp: 16, regen: 0.45, speedMul: -0.01 } },
    { dna: 70, eff: { maxHp: 22, regen: 0.6, speedMul: -0.02 } },
    { dna: 104, eff: { maxHp: 30, regen: 0.8, speedMul: -0.02 } },
    { dna: 148, eff: { maxHp: 44, regen: 1.1, speedMul: -0.03 } },
  ],
  layers: ['body'],
  draw(g, s) {
    const n = 5 + s.lvl * 3;
    g.fillStyle = rgba(shade(s.color, 0.35), 0.5);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + s.t * 0.16 + hash01(s.seed + i) * 0.6;
      const d = s.r * (0.3 + hash01(s.seed + i * 3) * 0.45);
      const rr = s.r * (0.06 + hash01(s.seed + i * 7) * 0.05) * (0.6 + s.lvl * 0.2);
      ellipse(g, Math.cos(a) * d, Math.sin(a) * d, rr, rr * 0.8, a);
    }
  },
};

const armor = {
  id: 'armor', name: 'Хитиновая мантия', icon: '🛡', tab: 'structure', slots: 1,
  maxLevel: 3, reqTier: 3, reqAch: 'ms_armor',
  desc: 'Панцирь из чешуек гасит удары. Крупная клетка теряет часть подвижности.',
  levels: [
    { dna: 46, eff: { armor: 9, speedMul: -0.04, massMul: 0.1 } },
    { dna: 78, eff: { armor: 14, speedMul: -0.04, massMul: 0.12 } },
    { dna: 118, eff: { armor: 21, speedMul: -0.05, massMul: 0.15 } },
  ],
  layers: ['body'],
  draw(g, s) {
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = -0.9 + (i / (n - 1)) * 1.8;
      const rr = s.r * 0.9;
      g.save(); g.rotate(a);
      g.beginPath();
      g.moveTo(rr * 0.62, 0);
      g.quadraticCurveTo(rr * 0.9, -rr * 0.30, rr * 0.72, -rr * 0.56 * (0.7 + s.lvl * 0.14));
      g.quadraticCurveTo(rr * 0.5, -rr * 0.34, rr * 0.62, 0);
      g.fillStyle = rgba(shade(s.color, -0.42 + s.lvl * 0.05), 0.92);
      g.fill(); g.strokeStyle = rgba(shade(s.color, 0.4), 0.55); g.lineWidth = Math.max(1, s.r * 0.045); g.stroke();
      g.restore();
    }
  },
};

const spikes = {
  id: 'spikes', name: 'Шипы', icon: '✦', tab: 'structure', slots: 1,
  maxLevel: 3, reqTier: 1,
  desc: 'Костные иглы по всему периметру. Врагу больно вас касаться: контактный урон и отбрасывание.',
  levels: [
    { dna: 34, eff: { spikeDmg: 7, spikeKnock: 130 } },
    { dna: 58, eff: { spikeDmg: 12, spikeKnock: 220 } },
    { dna: 92, eff: { spikeDmg: 19, spikeKnock: 330, armorPierce: 0.15 } },
  ],
  layers: ['back'],
  draw(g, s) {
    const n = 5 + s.lvl * 3;
    const len = s.r * (0.34 + s.lvl * 0.17);
    g.fillStyle = rgba(shade(s.color, -0.25), 0.95);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + 0.4 + Math.sin(s.t * 1.5 + i) * 0.05;
      const wob = 1 + wobble(s, i) * 0.06;
      const bx = Math.cos(a) * s.r * 0.88, by = Math.sin(a) * s.r * 0.88;
      const tx = Math.cos(a) * (s.r * 0.88 + len * wob), ty = Math.sin(a) * (s.r * 0.88 + len * wob);
      const px = Math.cos(a + Math.PI / 2) * s.r * 0.13, py = Math.sin(a + Math.PI / 2) * s.r * 0.13;
      g.beginPath(); g.moveTo(bx + px, by + py); g.lineTo(tx, ty); g.lineTo(bx - px, by - py); g.closePath(); g.fill();
      g.strokeStyle = rgba(shade(s.color, 0.55), 0.35); g.lineWidth = Math.max(0.8, s.r * 0.03); g.stroke();
    }
  },
};

const membrane = {
  id: 'membrane', name: 'Скользкая мембрана', icon: '≈', tab: 'structure', slots: 1,
  maxLevel: 3, reqTier: 4,
  desc: 'Двойной липидный слой с муцином: удары скользят по поверхности, раны закрываются сами.',
  levels: [
    { dna: 52, eff: { armor: 6, regen: 0.5 } },
    { dna: 86, eff: { armor: 10, regen: 0.8 } },
    { dna: 128, eff: { armor: 16, regen: 1.2, slowResist: 1 } },
  ],
  layers: ['front'],
  draw(g, s) {
    g.save();
    g.strokeStyle = rgba(shade(s.color, 0.6), 0.28 + s.lvl * 0.1);
    g.lineWidth = Math.max(1.2, s.r * (0.07 + s.lvl * 0.03));
    g.beginPath();
    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;
      const rr = s.r * (1.03 + Math.sin(a * 5 + s.t * 2.4) * 0.018 + wobble(s, i) * 0.012);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.97;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath(); g.stroke();
    g.restore();
  },
};

const hydro = {
  id: 'hydro', name: 'Гидроскелет', icon: '⌒', tab: 'structure', slots: 1,
  maxLevel: 2, reqTier: 5, reqAch: 'ms_sprint',
  desc: 'Тургорная полость под давлением: разгон резче, рывок мощнее.',
  levels: [
    { dna: 70, eff: { dashPower: 0.25, speedMul: 0.05 } },
    { dna: 116, eff: { dashPower: 0.45, speedMul: 0.09, dashCd: -0.08 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    g.strokeStyle = rgba(shade(s.color, 0.5), 0.5);
    g.lineWidth = Math.max(1, s.r * (0.05 + s.lvl * 0.03));
    for (let k = 0; k < 2 + s.lvl; k++) {
      const a = (k / (2 + s.lvl)) * TAU + s.t * 0.5;
      g.beginPath();
      g.arc(0, 0, s.r * 0.55, a, a + 1.1);
      g.stroke();
    }
    g.restore();
  },
};

// ==================================================================
// ОБМЕН ВЕЩЕСТВ
// ==================================================================

const filter = {
  id: 'filter', name: 'Фильтрующий аппарат', icon: '❦', tab: 'metabolism', slots: 1,
  maxLevel: 3, reqTier: 1,
  desc: 'Гребёнка для водорослей: растительная пища питает заметно сытнее.',
  levels: [
    { dna: 30, eff: { plantVal: 0.7 } },
    { dna: 54, eff: { plantVal: 1.3, magnet: 26 } },
    { dna: 88, eff: { plantVal: 2.1, magnet: 44 } },
  ],
  layers: ['front'],
  draw(g, s) {
    const n = 4 + s.lvl;
    g.save(); g.translate(s.r * 0.72, 0);
    for (let i = 0; i < n; i++) {
      const y = (i / (n - 1) - 0.5) * s.r * 0.62;
      seg(g, 0, y, s.r * 0.26, y + wobble(s, i) * 6, Math.max(1, s.r * 0.07), rgba(shade(s.color, 0.45), 0.85));
    }
    g.restore();
  },
};

const vacuole = {
  id: 'vacuole', name: 'Пищеварительная вакуоль', icon: '◍', tab: 'metabolism', slots: 1,
  maxLevel: 3, reqTier: 1,
  desc: 'Кислая среда внутри клетки: мясо усваивается быстрее и выгоднее.',
  levels: [
    { dna: 32, eff: { meatVal: 0.5 } },
    { dna: 56, eff: { meatVal: 1.0, dnaMul: 0.08 } },
    { dna: 94, eff: { meatVal: 1.7, dnaMul: 0.16, eatAll: 1 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    const pulse = 1 + Math.sin(s.t * 2.2 + s.phase) * 0.08;
    for (let i = 0; i < 1 + s.lvl; i++) {
      const a = s.t * 0.3 + (i / (1 + s.lvl)) * TAU;
      const x = Math.cos(a) * s.r * 0.34, y = Math.sin(a) * s.r * 0.34;
      g.beginPath(); g.arc(x, y, s.r * 0.2 * pulse, 0, TAU);
      g.fillStyle = rgba('#ffca7a', 0.22 + s.lvl * 0.06); g.fill();
      g.strokeStyle = rgba('#ffd88f', 0.35); g.lineWidth = 1; g.stroke();
    }
    g.restore();
  },
};

const mito = {
  id: 'mito', name: 'Митохондрии', icon: '⚡', tab: 'metabolism', slots: 1,
  maxLevel: 4, reqTier: 2,
  desc: 'Энергетические станции клетки: больше запас и быстрее восстановление сил.',
  levels: [
    { dna: 36, eff: { energyMax: 18, energyRegen: 1.1 } },
    { dna: 62, eff: { energyMax: 26, energyRegen: 1.7 } },
    { dna: 96, eff: { energyMax: 36, energyRegen: 2.4 } },
    { dna: 142, eff: { energyMax: 50, energyRegen: 3.3 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    for (let i = 0; i < 1 + s.lvl; i++) {
      const a = s.t * 0.22 + (i / (1 + s.lvl)) * TAU + 1.2;
      const x = Math.cos(a) * s.r * 0.5, y = Math.sin(a) * s.r * 0.5;
      g.save(); g.translate(x, y); g.rotate(a);
      ellipse(g, 0, 0, s.r * 0.16, s.r * 0.09, 0);
      g.fillStyle = rgba('#ff9d6b', 0.55); g.fill();
      g.strokeStyle = rgba('#ffd2b0', 0.4); g.lineWidth = 1;
      g.beginPath();
      for (let k = -2; k <= 2; k++) { g.moveTo(k * s.r * 0.05, -s.r * 0.08); g.quadraticCurveTo(k * s.r * 0.05 + 3, 0, k * s.r * 0.05, s.r * 0.08); }
      g.stroke(); g.restore();
    }
    g.restore();
  },
};

const lytik = {
  id: 'lytik', name: 'Литические ферменты', icon: '✹', tab: 'metabolism', slots: 1,
  maxLevel: 3, reqTier: 2,
  desc: 'Растворяют добычу изнутри: больше ДНК с каждой жертвы и падали.',
  levels: [
    { dna: 42, eff: { dnaMul: 0.22 } },
    { dna: 72, eff: { dnaMul: 0.42, biteRate: 0.12 } },
    { dna: 112, eff: { dnaMul: 0.7, biteRate: 0.22, lifeSteal: 0.08 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save(); g.strokeStyle = rgba('#b6ff9a', 0.4 + s.lvl * 0.1); g.lineWidth = Math.max(1, s.r * 0.05);
    for (let i = 0; i < 3 + s.lvl * 2; i++) {
      const a = hash01(s.seed + i) * TAU, d = s.r * (0.2 + 0.5 * hash01(s.seed + i * 5));
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      g.beginPath(); g.arc(x, y, s.r * 0.045, 0, TAU); g.stroke();
      seg(g, x, y, x + Math.cos(a) * s.r * 0.07, y + Math.sin(a) * s.r * 0.07, 1.2, rgba('#dfffcd', 0.4));
    }
    g.restore();
  },
};

const toxin = {
  id: 'toxin', name: 'Токсины', icon: '☣', tab: 'metabolism', slots: 1,
  maxLevel: 3, reqTier: 3,
  desc: 'Ядовитые везикулы: укус отравляет цель, а на 2-м уровне открывается токсинное облако.',
  levels: [
    { dna: 58, eff: { poison: 3.2 } },
    { dna: 92, eff: { poison: 6.4, abilityId: 'toxin' } },
    { dna: 136, eff: { poison: 11, abilityId: 'toxin', poisonArmorPierce: 1 } },
  ],
  layers: ['front'],
  draw(g, s) {
    g.save();
    const n = 3 + s.lvl * 2;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + s.t * 0.4;
      const x = Math.cos(a) * s.r * 0.7, y = Math.sin(a) * s.r * 0.7;
      const pulse = 1 + Math.sin(s.t * 3 + i) * 0.15;
      ellipse(g, x, y, s.r * 0.11 * pulse, s.r * 0.09 * pulse, a);
      g.fillStyle = rgba('#c9ff5e', 0.5 + s.lvl * 0.1); g.fill();
      g.strokeStyle = rgba('#eaffc9', 0.5); g.lineWidth = 1; g.stroke();
    }
    g.restore();
  },
};

const bissus = {
  id: 'bissus', name: 'Биссусовые нити', icon: '≋', tab: 'metabolism', slots: 1,
  maxLevel: 2, reqTier: 4,
  desc: 'Липкие нити выстреливают при укусе: жертва теряет ход и не может уйти.',
  levels: [
    { dna: 56, eff: { slowOnBite: 0.3, slowFactor: 0.45 } },
    { dna: 96, eff: { slowOnBite: 0.8, slowFactor: 0.3, spikeKnock: 90 } },
  ],
  layers: ['front'],
  draw(g, s) {
    g.save(); g.strokeStyle = rgba(shade(s.color, 0.7), 0.35); g.lineWidth = Math.max(1, s.r * 0.035);
    for (let i = 0; i < 3 + s.lvl * 3; i++) {
      const a = s.t * 0.6 + hash01(s.seed + i * 11) * TAU;
      const r0 = s.r * 1.0, r1 = s.r * (1.15 + 0.25 * hash01(s.seed + i));
      g.beginPath();
      g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      g.quadraticCurveTo(Math.cos(a + 0.3) * r1, Math.sin(a + 0.3) * r1, Math.cos(a + 0.1) * r1 * 1.2, Math.sin(a + 0.1) * r1 * 1.2);
      g.stroke();
    }
    g.restore();
  },
};

// ==================================================================
// ДВИЖЕНИЕ
// ==================================================================

const flagellum = {
  id: 'flagellum', name: 'Жгутик', icon: '➰', tab: 'movement', slots: 1,
  maxLevel: 4, reqTier: 1,
  desc: 'Длинный хвост с моторным белком — основной движитель клетки.',
  levels: [
    { dna: 26, eff: { speedMul: 0.12 } },
    { dna: 46, eff: { speedMul: 0.21 } },
    { dna: 74, eff: { speedMul: 0.3, turnMul: 0.06 } },
    { dna: 112, eff: { speedMul: 0.4, turnMul: 0.12 } },
  ],
  layers: ['back'],
  draw(g, s) {
    const len = s.r * (1.5 + s.lvl * 0.34);
    const tails = s.lvl >= 3 ? 2 : 1;
    for (let t = 0; t < tails; t++) {
      const off = tails === 1 ? 0 : (t - 0.5) * s.r * 0.34;
      g.beginPath();
      g.moveTo(-s.r * 0.82, off);
      const ph = s.t * (5.4 + s.lvl * 0.9) + t * 0.9 + s.phase;
      for (let i = 1; i <= 7; i++) {
        const u = i / 7;
        const x = -s.r * 0.82 - len * u;
        const y = off + Math.sin(ph - u * 3.4) * s.r * (0.1 + u * 0.3);
        g.lineTo(x, y);
      }
      g.lineWidth = Math.max(1.6, s.r * (0.16 + s.lvl * 0.02)) * (1 - 0.35 * 0);
      g.strokeStyle = rgba(shade(s.color, 0.15), 0.85); g.lineCap = 'round'; g.stroke();
      g.lineWidth = Math.max(0.8, s.r * 0.05); g.strokeStyle = rgba('#ffffff', 0.18); g.stroke();
    }
  },
};

const cilia = {
  id: 'cilia', name: 'Реснички', icon: '⁂', tab: 'movement', slots: 1,
  maxLevel: 3, reqTier: 1,
  desc: 'Сотни микроскопических волосков: идеальная управляемость и приток мелкой пищи.',
  levels: [
    { dna: 24, eff: { turnMul: 0.3, magnet: 22 } },
    { dna: 44, eff: { turnMul: 0.5, magnet: 40, speedMul: 0.05 } },
    { dna: 72, eff: { turnMul: 0.75, magnet: 62, speedMul: 0.09 } },
  ],
  layers: ['front'],
  draw(g, s) {
    const n = 12 + s.lvl * 8;
    g.strokeStyle = rgba(shade(s.color, 0.7), 0.55); g.lineWidth = Math.max(0.7, s.r * 0.026);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const px = Math.cos(a), py = Math.sin(a);
      const beat = Math.sin(s.t * 7 + i * 0.7 + s.phase) * 0.22;
      g.beginPath();
      g.moveTo(px * s.r * 0.96, py * s.r * 0.96);
      g.quadraticCurveTo(px * s.r * 1.12, py * s.r * 1.12, px * s.r * 1.2 + Math.cos(a + 1.57) * s.r * beat, py * s.r * 1.2 + Math.sin(a + 1.57) * s.r * beat);
      g.stroke();
    }
  },
};

const fins = {
  id: 'fins', name: 'Плавники', icon: '⌇', tab: 'movement', slots: 1,
  maxLevel: 3, reqTier: 2,
  desc: 'Широкие ласты стабилизируют тело: скорость, поворот и устойчивость к толчкам.',
  levels: [
    { dna: 32, eff: { speedMul: 0.08, turnMul: 0.15, knockResist: 0.25 } },
    { dna: 58, eff: { speedMul: 0.14, turnMul: 0.25, knockResist: 0.45 } },
    { dna: 92, eff: { speedMul: 0.21, turnMul: 0.35, knockResist: 0.65 } },
  ],
  layers: ['front'],
  draw(g, s) {
    const sp = 0.6 + s.lvl * 0.22;
    for (const sgn of [-1, 1]) {
      g.save(); g.scale(1, sgn); g.rotate(Math.sin(s.t * 3 + s.phase) * 0.12 * sp);
      g.beginPath();
      g.moveTo(s.r * 0.3, s.r * 0.6);
      g.quadraticCurveTo(s.r * 0.05, s.r * (0.9 + sp * 0.7), -s.r * 0.55, s.r * (0.75 + sp * 0.45));
      g.quadraticCurveTo(-s.r * 0.3, s.r * 0.6, s.r * 0.3, s.r * 0.6);
      g.fillStyle = rgba(shade(s.color, 0.25), 0.5); g.fill();
      g.strokeStyle = rgba(shade(s.color, 0.7), 0.55); g.lineWidth = Math.max(1, s.r * 0.04); g.stroke();
      g.restore();
    }
  },
};

const jet = {
  id: 'jet', name: 'Реактивный сифон', icon: '⇉', tab: 'movement', slots: 1,
  maxLevel: 2, reqTier: 5,
  desc: 'Выбрасывает струю воды: рывок становится дальше и перезаряжается быстрее.',
  levels: [
    { dna: 76, eff: { dashPower: 0.45, dashCd: -0.18 } },
    { dna: 124, eff: { dashPower: 0.8, dashCd: -0.32, abilityId: 'jetstream' } },
  ],
  layers: ['back'],
  draw(g, s) {
    g.save(); g.translate(-s.r * 0.8, 0);
    g.beginPath(); g.moveTo(0, -s.r * 0.2); g.lineTo(s.r * 0.3, 0); g.lineTo(0, s.r * 0.2); g.closePath();
    g.fillStyle = rgba(shade(s.color, -0.3), 0.9); g.fill();
    const p = (Math.sin(s.t * 6) * 0.5 + 0.5) * (0.4 + s.lvl * 0.3);
    g.beginPath(); g.moveTo(-s.r * 0.2, 0); g.lineTo(-s.r * (0.6 + p * 1.3), -s.r * 0.14 * (0.5 + p)); g.lineTo(-s.r * (0.6 + p * 1.3), s.r * 0.14 * (0.5 + p)); g.closePath();
    g.fillStyle = rgba('#bfefff', 0.16 + p * 0.16); g.fill();
    g.restore();
  },
};

const gills = {
  id: 'gills', name: 'Жабровые пластины', icon: '❯', tab: 'movement', slots: 1,
  maxLevel: 2, reqTier: 3,
  desc: 'Дышат растворённым кислородом: обмен веществ дешевле, энергия восстанавливается быстрее.',
  levels: [
    { dna: 48, eff: { upkeepMul: -0.14, energyRegen: 1.0 } },
    { dna: 84, eff: { upkeepMul: -0.26, energyRegen: 2.0, nightVision: 1 } },
  ],
  layers: ['front'],
  draw(g, s) {
    g.save();
    for (const sgn of [-1, 1]) {
      for (let i = 0; i < 2 + s.lvl; i++) {
        const a = sgn * (0.5 + i * 0.3) + Math.sin(s.t * 2 + i) * 0.05;
        g.save(); g.rotate(a);
        g.beginPath(); g.moveTo(s.r * 0.7, 0); g.quadraticCurveTo(s.r * 1.05, s.r * 0.1, s.r * 1.2, 0);
        g.quadraticCurveTo(s.r * 1.05, -s.r * 0.06, s.r * 0.7, 0); g.closePath();
        g.fillStyle = rgba(shade(s.color, 0.35), 0.5); g.fill();
        g.strokeStyle = rgba('#ffd8d8', 0.35); g.lineWidth = 1; g.stroke();
        g.restore();
      }
    }
    g.restore();
  },
};

// ==================================================================
// ОРГАНЫ ЧУВСТВ И СИМБИОЗ
// ==================================================================

const eyespot = {
  id: 'eyespot', name: 'Глазное пятно', icon: '◉', tab: 'senses', slots: 1,
  maxLevel: 3, reqTier: 1,
  desc: 'Светочувствительные клетки: видно дальше, радар шире, добыча подсвечена.',
  levels: [
    { dna: 28, eff: { vision: 90 } },
    { dna: 52, eff: { vision: 190, radar: 0.25 } },
    { dna: 88, eff: { vision: 320, radar: 0.5, nightVision: 1 } },
  ],
  layers: ['front'],
  draw(g, s) {
    for (const sgn of [-1, 1]) {
      const ex = s.r * 0.5, ey = sgn * s.r * 0.42;
      g.beginPath(); g.arc(ex, ey, s.r * (0.15 + s.lvl * 0.03), 0, TAU);
      g.fillStyle = rgba('#f4ffff', 0.92); g.fill();
      g.beginPath(); g.arc(ex + s.r * 0.04, ey, s.r * (0.07 + s.lvl * 0.02), 0, TAU);
      g.fillStyle = rgba('#17202a', 0.95); g.fill();
      g.beginPath(); g.arc(ex + s.r * 0.07, ey - s.r * 0.03, s.r * 0.025, 0, TAU);
      g.fillStyle = 'rgba(255,255,255,0.9)'; g.fill();
    }
  },
};

const symbionts = {
  id: 'symbionts', name: 'Симбионты', icon: '∞', tab: 'senses', slots: 1,
  maxLevel: 3, reqTier: 2,
  desc: 'Живые спутники внутри цитоплазмы: кормят энергией и защищают, отвлекая хищников.',
  levels: [
    { dna: 44, eff: { symbionts: 1, energyRegen: 0.8, maxHp: 8 } },
    { dna: 78, eff: { symbionts: 2, energyRegen: 1.5, maxHp: 16 } },
    { dna: 124, eff: { symbionts: 3, energyRegen: 2.4, maxHp: 28, regen: 0.6 } },
  ],
  layers: ['back'],
  draw(g, s) {
    g.save();
    for (let i = 0; i < s.lvl; i++) {
      const a = s.t * (0.8 + i * 0.2) + (i / 3) * TAU;
      const d = s.r * 0.72;
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      g.beginPath(); g.arc(x, y, s.r * 0.17, 0, TAU);
      g.fillStyle = rgba('#8ff0ff', 0.55); g.fill();
      g.strokeStyle = rgba('#dcffff', 0.6); g.lineWidth = 1.2; g.stroke();
      g.beginPath(); g.arc(x - s.r * 0.04, y - s.r * 0.04, s.r * 0.06, 0, TAU);
      g.fillStyle = 'rgba(255,255,255,0.75)'; g.fill();
    }
    g.restore();
  },
};

const luciferin = {
  id: 'luciferin', name: 'Люциферин', icon: '✺', tab: 'senses', slots: 1,
  maxLevel: 2, reqTier: 2,
  desc: 'Биолюминесценция: свет приманивает планктон, а в темноте вы видите всё.',
  levels: [
    { dna: 40, eff: { glow: 1, magnet: 40, nightVision: 1 } },
    { dna: 72, eff: { glow: 2, magnet: 78, nightVision: 1, attractSmall: 1 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    const n = 4 + s.lvl * 3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + s.t * 0.25;
      const x = Math.cos(a) * s.r * 0.58, y = Math.sin(a) * s.r * 0.58;
      const p = 0.55 + Math.sin(s.t * 2.6 + i * 1.4) * 0.35;
      const grd = g.createRadialGradient(x, y, 0, x, y, s.r * 0.3);
      grd.addColorStop(0, `rgba(190,255,220,${0.55 * p})`);
      grd.addColorStop(1, 'rgba(120,255,200,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, s.r * 0.3, 0, TAU); g.fill();
      g.beginPath(); g.arc(x, y, s.r * 0.05, 0, TAU);
      g.fillStyle = `rgba(235,255,245,${0.6 + p * 0.4})`; g.fill();
    }
    g.restore();
  },
};

const chromatophore = {
  id: 'chromatophore', name: 'Хроматофоры', icon: '◐', tab: 'senses', slots: 1,
  maxLevel: 2, reqTier: 4,
  desc: 'Пигментные клетки мгновенно меняют цвет: после удара клетка уходит в невидимость.',
  levels: [
    { dna: 62, eff: { cloakOnHit: 1.4 } },
    { dna: 108, eff: { cloakOnHit: 2.6, abilityId: 'mirage' } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    for (let i = 0; i < 2 + s.lvl * 2; i++) {
      const a = hash01(s.seed + i * 13) * TAU;
      const d = s.r * (0.25 + hash01(s.seed + i * 3) * 0.5);
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      ellipse(g, x, y, s.r * 0.11, s.r * 0.08, a);
      g.fillStyle = rgba(shade(s.color, -0.35), 0.4); g.fill();
    }
    g.restore();
  },
};

const sonic = {
  id: 'sonic', name: 'Звуковой орган', icon: '◎', tab: 'senses', slots: 1,
  maxLevel: 2, reqTier: 4, reqAch: 'ms_sonic',
  desc: 'Мембранный резонатор: собирает эхо и бьёт звуковой волной, оглушая всё вокруг.',
  levels: [
    { dna: 74, eff: { vision: 120, abilityId: 'sonic' } },
    { dna: 120, eff: { vision: 200, abilityId: 'sonic', sonicPower: 1 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    const p = 0.5 + Math.sin(s.t * 3.4) * 0.5;
    for (let i = 0; i < 3; i++) {
      g.beginPath(); g.arc(s.r * 0.1, 0, s.r * (0.25 + i * 0.2 + p * 0.08), 0, TAU);
      g.strokeStyle = rgba('#cfe9ff', 0.28 - i * 0.07 + s.lvl * 0.05); g.lineWidth = Math.max(1, s.r * 0.035); g.stroke();
    }
    g.restore();
  },
};

const electric = {
  id: 'electric', name: 'Электроциты', icon: '⚡', tab: 'senses', slots: 1,
  maxLevel: 2, reqTier: 5, reqAch: 'ms_electric',
  desc: 'Мышечные пластины-конденсаторы: разряд бьёт по всем, кто рядом, и парализует их.',
  levels: [
    { dna: 82, eff: { spikeDmg: 4, abilityId: 'shock' } },
    { dna: 132, eff: { spikeDmg: 7, armorPierce: 0.25, abilityId: 'shock', shockPower: 1 } },
  ],
  layers: ['body'],
  draw(g, s) {
    g.save();
    for (let i = 0; i < 3 + s.lvl * 2; i++) {
      const a = (i / (3 + s.lvl * 2)) * TAU + s.t * 0.9;
      const x = Math.cos(a) * s.r * 0.78, y = Math.sin(a) * s.r * 0.78;
      g.beginPath(); g.moveTo(x, y);
      g.lineTo(x + Math.cos(a + 2.1) * s.r * 0.14, y + Math.sin(a + 2.1) * s.r * 0.14);
      g.lineTo(x + Math.cos(a - 1.4) * s.r * 0.12, y + Math.sin(a - 1.4) * s.r * 0.12);
      g.strokeStyle = rgba('#fff2a8', 0.35 + Math.sin(s.t * 8 + i) * 0.15); g.lineWidth = Math.max(1, s.r * 0.03); g.stroke();
    }
    g.restore();
  },
};

// ==================================================================
export const PARTS = {
  cytoplasm, armor, spikes, membrane, hydro,
  filter, vacuole, mito, lytik, toxin, bissus,
  flagellum, cilia, fins, jet, gills,
  eyespot, symbionts, luciferin, chromatophore, sonic, electric,
};

export const PART_LIST = Object.values(PARTS);

export const TABS = [
  { id: 'structure', name: 'Структура' },
  { id: 'metabolism', name: 'Обмен' },
  { id: 'movement', name: 'Движение' },
  { id: 'senses', name: 'Чувства' },
];

// Приоритет активной способности, если их открыто несколько.
export const ABILITY_PRIORITY = ['shock', 'sonic', 'jetstream', 'toxin', 'mirage'];

export const ABILITIES = {
  shock: { name: 'Электрошок', short: 'Разряд', icon: '⚡', cd: 13, radius: 150, dmg: 16, stun: 1.4, text: 'разряд по всем вокруг' },
  sonic: { name: 'Ультразвук', short: 'Ультразвук', icon: '◎', cd: 12, radius: 300, dmg: 6, stun: 2.0, text: 'оглушает всех в округе' },
  jetstream: { name: 'Реактивный рывок', short: 'Реакт. рывок', icon: '⇉', cd: 8, radius: 0, dmg: 18, text: 'дальний таранный рывок' },
  toxin: { name: 'Ядовитое облако', short: 'Яд', icon: '☣', cd: 14, radius: 210, dmg: 26, stun: 0.5, text: 'отравляет зону' },
  mirage: { name: 'Мираж', short: 'Мираж', icon: '◐', cd: 15, radius: 0, dmg: 0, text: 'невидимость и ускорение' },
};

// Проверка требований детали (уровень клетки + достижение).
export function partUnlocked(part, tier, ach) {
  if (part.reqTier && tier < part.reqTier) return { ok: false, why: `нужен размер ${part.reqTier}` };
  if (part.reqAch && !ach.has(part.reqAch)) return { ok: false, why: 'нужно достижение' };
  return { ok: true };
}

// Итоговые эффекты установленного набора деталей: parts = { id: level }
export function aggregate(parts) {
  const eff = {};
  for (const id in parts) {
    const p = PARTS[id]; if (!p) continue;
    const lvl = Math.min(parts[id], p.maxLevel);
    for (let i = 0; i < lvl; i++) {
      const e = p.levels[i].eff;
      for (const k in e) {
        if (k === 'abilityId') { (eff.abilities ??= []).push(e[k]); continue; }
        eff[k] = (eff[k] ?? 0) + e[k];
      }
    }
  }
  if (eff.abilities) {
    eff.abilities = [...new Set(eff.abilities)];
    eff.abilityId = ABILITY_PRIORITY.find((a) => eff.abilities.includes(a)) ?? null;
  } else eff.abilityId = null;
  return eff;
}

// Стоимость следующего уровня детали или null, если максимум.
export function nextLevelCost(parts, id) {
  const p = PARTS[id]; if (!p) return null;
  const cur = parts[id] ?? 0;
  if (cur >= p.maxLevel) return null;
  return p.levels[cur].dna;
}

export function partSlots(parts) {
  let n = 0;
  for (const id in parts) if (PARTS[id]) n += PARTS[id].slots;
  return n;
}

export function upkeepOf(parts) {
  // Обмен веществ: каждая деталь требует энергии тем больше, чем её уровень и «масса».
  let up = 0.32; // базовое дыхание клетки
  for (const id in parts) {
    const p = PARTS[id]; if (!p) continue;
    const w = p.slots === 0 ? 0.55 : 1;
    up += parts[id] * parts[id] * 0.055 * w + parts[id] * 0.1 * w;
  }
  return up;
}
