// landparts.js — геном суши: части тела зверя, их уровни, эффекты и внешний вид.
//
// Отличие от подводных органелл: у части тела есть не только эффект, но и «внешность»
// (visual). Рисует зверя один общий модуль landcreature.js — и для игрока, и для видов NPC,
// поэтому вид существа складывается из тех же признаков, что игрок покупает в редакторе.
// Это и есть главная идея стадии: то, что видишь у соседа, можно отрастить себе.
//
// Единый словарь эффектов (суммируются по всем частям):
//   maxHp, hpMul, regen, armor, knockResist, massMul,
//   speedMul, sprintMul, turnMul, climb,
//   biteDmg, biteRate, meatVal, plantVal, dnaMul, staminaMax, staminaRegen,
//   thirstMax, waterSense, vision, radar, nightVision, stealth,
//   socialGain, singSkill, danceSkill, poseSkill, charmSkill, patience, slotBonus,
//   poison (яд при укусе), abilityId (строка, берётся по приоритету)

import { TAU, clamp, rgba, shade, hash01 } from './util.js';

// Кто рисует часть тела (см. landcreature.js). Значение — просто метка.
export const TABS = [
  { id: 'body', name: 'Тело' },
  { id: 'mouth', name: 'Пасть' },
  { id: 'limbs', name: 'Конечности' },
  { id: 'social', name: 'Социум' },
  { id: 'sense', name: 'Чувства' },
];

// Активные способности суши: кнопка одна, способность — по приоритету.
export const LAND_ABILITY_PRIORITY = ['roar', 'glide', 'venom', 'musk'];

export const LAND_ABILITIES = {
  roar: { name: 'Боевой рёв', short: 'Рёв', icon: '📣', cd: 16, radius: 320, dmg: 10, stun: 1.8, text: 'оглушает всех вокруг и пугает мелких' },
  glide: { name: 'Планирование', short: 'Планир.', icon: '≋', cd: 9, radius: 0, dmg: 14, text: 'длинный рывок сквозь заросли' },
  venom: { name: 'Ядовитый плевок', short: 'Яд', icon: '☣', cd: 13, radius: 190, dmg: 22, stun: 0, text: 'облако яда перед собой' },
  musk: { name: 'Мускус', short: 'Мускус', icon: '❀', cd: 18, radius: 460, dmg: 0, stun: 0, text: 'сбивает хищников с твоего следа' },
};

const P = {};

// ==================================================================
// ТЕЛО
// ==================================================================

P.hide = {
  id: 'hide', name: 'Толстая шкура', icon: '▤', tab: 'body', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'hide',
  desc: 'Плотная кожа держит укусы и колючки. Основа любого зверя, который выходит из гнезда надолго.',
  levels: [
    { dna: 26, eff: { maxHp: 18, armor: 2 } },
    { dna: 52, eff: { maxHp: 34, armor: 5 } },
    { dna: 92, eff: { maxHp: 58, armor: 9 } },
  ],
};

P.hump = {
  id: 'hump', name: 'Жировой горб', icon: '◗', tab: 'body', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'hump',
  desc: 'Запас на сухой сезон: больше крови и воды в теле, но бегать с таким грузом тяжелее.',
  levels: [
    { dna: 34, eff: { maxHp: 22, thirstMax: 14, speedMul: -0.02 } },
    { dna: 64, eff: { maxHp: 42, thirstMax: 26, speedMul: -0.03 } },
    { dna: 104, eff: { maxHp: 68, thirstMax: 42, speedMul: -0.05 } },
  ],
};

P.spine = {
  id: 'spine', name: 'Упругий хребет', icon: '⌇', tab: 'body', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'spine',
  desc: 'Хребет как рессора: дольше бежишь без передышки, легче несёшь своё тело.',
  levels: [
    { dna: 28, eff: { staminaMax: 18, staminaRegen: 0.5, speedMul: 0.03 } },
    { dna: 54, eff: { staminaMax: 34, staminaRegen: 0.9, speedMul: 0.06 } },
    { dna: 90, eff: { staminaMax: 56, staminaRegen: 1.5, speedMul: 0.1 } },
  ],
};

P.armor = {
  id: 'armor', name: 'Костяные пластины', icon: '▦', tab: 'body', slots: 2, maxLevel: 3, reqTier: 3,
  visual: 'armor', reqAch: 'land_armor',
  desc: 'Ряды пластин по спине и бокам. Тяжёлые, зато укус по ним — как по камню.',
  levels: [
    { dna: 58, eff: { armor: 8, knockResist: 0.15, massMul: 0.12, speedMul: -0.03 } },
    { dna: 96, eff: { armor: 15, knockResist: 0.28, massMul: 0.22, speedMul: -0.05 } },
    { dna: 150, eff: { armor: 24, knockResist: 0.42, massMul: 0.34, speedMul: -0.08 } },
  ],
};

// ==================================================================
// ПАСТЬ
// ==================================================================

P.jaws = {
  id: 'jaws', name: 'Челюсти', icon: '◤', tab: 'mouth', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'jaws',
  desc: 'Главный инструмент хищника: чем крупнее пасть, тем быстрее заканчиваются споры.',
  levels: [
    { dna: 26, eff: { biteDmg: 6 } },
    { dna: 50, eff: { biteDmg: 13, biteRate: 0.1 } },
    { dna: 88, eff: { biteDmg: 22, biteRate: 0.2 } },
  ],
};

P.fangs = {
  id: 'fangs', name: 'Клыки', icon: '∨', tab: 'mouth', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'fangs',
  desc: 'Рваные раны не заживают сами: жертва теряет кровь ещё долго после укуса.',
  levels: [
    { dna: 40, eff: { biteDmg: 8, bleed: 1.4 } },
    { dna: 72, eff: { biteDmg: 15, bleed: 2.8 } },
    { dna: 116, eff: { biteDmg: 24, bleed: 4.6 } },
  ],
};

P.beak = {
  id: 'beak', name: 'Крепкий клюв', icon: '⌄', tab: 'mouth', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'beak',
  desc: 'Клюв дробит плоды, орехи и панцири: растительная пища усваивается намного лучше.',
  levels: [
    { dna: 24, eff: { plantVal: 0.7, biteRate: 0.1 } },
    { dna: 48, eff: { plantVal: 1.3, biteRate: 0.2, maxHp: 10 } },
    { dna: 84, eff: { plantVal: 2.0, biteRate: 0.32, maxHp: 20 } },
  ],
};

P.gullet = {
  id: 'gullet', name: 'Зоб', icon: '◍', tab: 'mouth', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'gullet',
  desc: 'Объёмистый зоб переваривает всё и вытягивает из еды больше ДНК.',
  levels: [
    { dna: 34, eff: { meatVal: 0.5, plantVal: 0.4 } },
    { dna: 62, eff: { meatVal: 1.0, plantVal: 0.8, dnaMul: 0.08 } },
    { dna: 100, eff: { meatVal: 1.6, plantVal: 1.3, dnaMul: 0.16 } },
  ],
};

// ==================================================================
// КОНЕЧНОСТИ
// ==================================================================

P.legs = {
  id: 'legs', name: 'Ноги-ходули', icon: '⋀', tab: 'limbs', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'legs',
  desc: 'Длинные ноги уводят от любой пасти. Быстрее бег, но и заметнее силуэт.',
  levels: [
    { dna: 26, eff: { speedMul: 0.07, staminaMax: 10 } },
    { dna: 52, eff: { speedMul: 0.13, staminaMax: 22, sprintMul: 0.1 } },
    { dna: 90, eff: { speedMul: 0.2, staminaMax: 36, sprintMul: 0.2 } },
  ],
};

P.claws = {
  id: 'claws', name: 'Роющие когти', icon: '≡', tab: 'limbs', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'claws',
  desc: 'Когти держат добычу и рвут землю: легче ходить по скалам и раскапывать кладки.',
  levels: [
    { dna: 32, eff: { biteDmg: 5, climb: 0.3 } },
    { dna: 60, eff: { biteDmg: 11, climb: 0.55, biteRate: 0.08 } },
    { dna: 98, eff: { biteDmg: 18, climb: 0.85, biteRate: 0.16 } },
  ],
};

P.tail = {
  id: 'tail', name: 'Хвост-балансир', icon: '〜', tab: 'limbs', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'tail',
  desc: 'Поворот на месте — искусство хвоста. Ещё он гасит толчки при столкновениях.',
  levels: [
    { dna: 24, eff: { turnMul: 0.22, knockResist: 0.08 } },
    { dna: 48, eff: { turnMul: 0.45, knockResist: 0.16, speedMul: 0.02 } },
    { dna: 84, eff: { turnMul: 0.75, knockResist: 0.26, speedMul: 0.04 } },
  ],
};

P.wings = {
  id: 'wings', name: 'Крылья-планеры', icon: '⋁', tab: 'limbs', slots: 2, maxLevel: 3, reqTier: 4,
  visual: 'wings', reqAch: 'land_glide',
  desc: 'Не полёт, но прыжок через овраг: рывок длиннее и мягче, а падение почти не бьёт.',
  levels: [
    { dna: 70, eff: { sprintMul: 0.3, knockResist: 0.1, abilityId: 'glide' } },
    { dna: 112, eff: { sprintMul: 0.5, knockResist: 0.2, speedMul: 0.06, abilityId: 'glide' } },
    { dna: 170, eff: { sprintMul: 0.75, knockResist: 0.3, speedMul: 0.1, abilityId: 'glide' } },
  ],
};

// ==================================================================
// СОЦИУМ
// ==================================================================

P.throat = {
  id: 'throat', name: 'Горловой мешок', icon: '♪', tab: 'social', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'throat',
  desc: 'Песня вида: успокаивает соседей, а на третьем уровне сбивает стаю с ног рёвом.',
  levels: [
    { dna: 30, eff: { singSkill: 1, socialGain: 0.1 } },
    { dna: 56, eff: { singSkill: 2, socialGain: 0.2, slotBonus: 1 } },
    { dna: 96, eff: { singSkill: 3, socialGain: 0.3, slotBonus: 1, abilityId: 'roar' } },
  ],
};

P.plumes = {
  id: 'plumes', name: 'Брачные перья', icon: '♫', tab: 'social', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'plumes',
  desc: 'Танец без перьев — просто бег. Чем ярче убор, тем быстрее растёт симпатия вида.',
  levels: [
    { dna: 28, eff: { danceSkill: 1, socialGain: 0.12 } },
    { dna: 54, eff: { danceSkill: 2, socialGain: 0.24, turnMul: 0.1 } },
    { dna: 92, eff: { danceSkill: 3, socialGain: 0.36, turnMul: 0.2 } },
  ],
};

P.mane = {
  id: 'mane', name: 'Грива', icon: '☰', tab: 'social', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'mane',
  desc: 'Внушительный вид: поза с гривой читается издалека, а мелкие хищники теряют кураж.',
  levels: [
    { dna: 30, eff: { poseSkill: 1, maxHp: 8, socialGain: 0.08 } },
    { dna: 58, eff: { poseSkill: 2, maxHp: 18, socialGain: 0.16, patience: 1 } },
    { dna: 98, eff: { poseSkill: 3, maxHp: 30, socialGain: 0.24, patience: 2 } },
  ],
};

P.brain = {
  id: 'brain', name: 'Мозг вожака', icon: '✦', tab: 'social', slots: 2, maxLevel: 3, reqTier: 2,
  visual: 'brain',
  desc: 'Память на сородичей: одна ячейка генома в подарок и никакой путаницы в чужих танцах.',
  levels: [
    { dna: 46, eff: { socialGain: 0.2, charmSkill: 1, slotBonus: 1 } },
    { dna: 78, eff: { socialGain: 0.35, charmSkill: 2, slotBonus: 2, patience: 1 } },
    { dna: 124, eff: { socialGain: 0.5, charmSkill: 3, slotBonus: 3, patience: 2 } },
  ],
};

// ==================================================================
// ЧУВСТВА И ЗАЩИТА
// ==================================================================

P.eyes = {
  id: 'eyes', name: 'Большие глаза', icon: '◉', tab: 'sense', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'eyes',
  desc: 'Обзор шире, радар дальше. На третьем уровне ты видишь ночью не хуже, чем днём.',
  levels: [
    { dna: 26, eff: { vision: 60, radar: 0.25 } },
    { dna: 52, eff: { vision: 130, radar: 0.5, nightVision: 0.5 } },
    { dna: 88, eff: { vision: 220, radar: 0.9, nightVision: 1 } },
  ],
};

P.nose = {
  id: 'nose', name: 'Чуткий нюх', icon: '⌣', tab: 'sense', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'nose',
  desc: 'Запах воды и падали за сотни шагов: на радаре видны водоёмы и кладки.',
  levels: [
    { dna: 30, eff: { waterSense: 260, radar: 0.2 } },
    { dna: 56, eff: { waterSense: 460, radar: 0.45, stealth: 0.1 } },
    { dna: 92, eff: { waterSense: 700, radar: 0.7, stealth: 0.2 } },
  ],
};

P.spikes = {
  id: 'spikes', name: 'Костяные шипы', icon: '✳', tab: 'sense', slots: 1, maxLevel: 3, reqTier: 2,
  visual: 'spikes',
  desc: 'Всякий, кто вцепится в такую шкуру, получит своё — и отскочит.',
  levels: [
    { dna: 34, eff: { spikeDmg: 7, spikeKnock: 90 } },
    { dna: 62, eff: { spikeDmg: 15, spikeKnock: 150, armor: 3 } },
    { dna: 104, eff: { spikeDmg: 26, spikeKnock: 220, armor: 6 } },
  ],
};

P.venom = {
  id: 'venom', name: 'Ядовитые железы', icon: '☣', tab: 'sense', slots: 1, maxLevel: 3, reqTier: 3,
  visual: 'venom',
  desc: 'Едкая слизь на зубах и в плевке. Мелких тварей убивает быстрее, чем пасть.',
  levels: [
    { dna: 44, eff: { poison: 1.6 } },
    { dna: 78, eff: { poison: 3.4, abilityId: 'venom' } },
    { dna: 128, eff: { poison: 5.6, abilityId: 'venom', biteDmg: 6 } },
  ],
};

P.frill = {
  id: 'frill', name: 'Костяной воротник', icon: '◠', tab: 'sense', slots: 1, maxLevel: 3, reqTier: 3,
  visual: 'frill',
  desc: 'Раскрывается от страха и гордости: и шея закрыта, и поза убедительнее.',
  levels: [
    { dna: 36, eff: { armor: 4, poseSkill: 1 } },
    { dna: 66, eff: { armor: 9, poseSkill: 2, knockResist: 0.12 } },
    { dna: 108, eff: { armor: 16, poseSkill: 3, knockResist: 0.24 } },
  ],
};

P.lungs = {
  id: 'lungs', name: 'Мешки-лёгкие', icon: '◎', tab: 'sense', slots: 1, maxLevel: 3, reqTier: 1,
  visual: 'lungs',
  desc: 'Больше воздуха — больше бега. Восстановление сил и запас воды растут.',
  levels: [
    { dna: 26, eff: { staminaMax: 14, staminaRegen: 0.4, thirstMax: 8 } },
    { dna: 50, eff: { staminaMax: 28, staminaRegen: 0.8, thirstMax: 16 } },
    { dna: 86, eff: { staminaMax: 44, staminaRegen: 1.3, thirstMax: 26 } },
  ],
};

export const LANDPARTS = P;
export const LAND_PART_LIST = Object.values(P);

// Сбор эффектов: берётся ТОЛЬКО текущий уровень детали (уровни — замена, а не стопка).
export function landAggregate(parts) {
  const eff = {};
  const abilities = [];
  for (const id in parts) {
    const part = P[id];
    if (!part) continue;
    const lvl = Math.min(parts[id] ?? 0, part.maxLevel);
    if (lvl <= 0) continue;
    const e = part.levels[lvl - 1].eff;
    for (const k in e) {
      if (k === 'abilityId') { abilities.push(e[k]); continue; }
      eff[k] = (eff[k] ?? 0) + e[k];
    }
  }
  eff.abilityId = LAND_ABILITY_PRIORITY.find((a) => abilities.includes(a)) ?? null;
  return eff;
}

export function landUpkeep(parts) {
  let u = 0.32;
  for (const id in parts) {
    const part = P[id];
    if (!part) continue;
    const lvl = Math.min(parts[id] ?? 0, part.maxLevel);
    if (lvl <= 0) continue;
    u += part.slots * (0.04 * lvl * lvl + 0.09 * lvl) * 0.5;
  }
  return u;
}

export function landPartSlots(parts) {
  let n = 0;
  for (const id in parts) if (P[id]) n += P[id].slots;
  return n;
}

export function landPartUnlocked(part, tier, ach) {
  if (part.reqTier && tier < part.reqTier) return { ok: false, why: `нужен размер ${part.reqTier}` };
  if (part.reqAch && !ach.has(part.reqAch)) return { ok: false, why: 'нужно достижение' };
  return { ok: true };
}

export function landNextLevelCost(parts, id) {
  const part = P[id];
  if (!part) return null;
  const cur = parts[id] ?? 0;
  if (cur >= part.maxLevel) return null;
  return part.levels[cur].dna;
}

// Набор признаков для рисования (landcreature.js): часть → признак.
export function landFeatures(parts) {
  const set = new Set();
  const lvls = {};
  for (const id in parts) {
    const part = P[id];
    const lvl = Math.min(parts[id] ?? 0, part?.maxLevel ?? 0);
    if (!part || lvl <= 0) continue;
    set.add(part.visual);
    lvls[part.visual] = lvl;
  }
  return { set, lvls };
}

// Средний «социальный» уровень вида-игрока: как быстро растёт симпатия.
export function socialStat(stats, action) {
  const base = { sing: stats.singSkill, dance: stats.danceSkill, pose: stats.poseSkill, groom: stats.charmSkill }[action] ?? 0;
  return base;
}

// Мелкая утилита для превью в редакторе: сколько всего признаков даст часть.
export function visualSummary(part) {
  return part.visual ?? '—';
}

// Рисование значка части в списке редактора: та же графика, что на теле, но крупнее.
// ctx уже переведён в центр квадрата; s = { r, lvl, t, phase, color, seed }
export function drawPartIcon(ctx, part, s) {
  const color = s.color ?? '#8fd8b0';
  ctx.save();
  ctx.lineCap = 'round';
  const r = s.r;
  switch (part.visual) {
    case 'hide': {
      ctx.strokeStyle = rgba(color, 0.9); ctx.lineWidth = Math.max(2, r * 0.16);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.62, r * 0.44, 0, 0, TAU); ctx.stroke();
      ctx.fillStyle = rgba(shade(color, 0.6), 0.35);
      for (let i = 0; i < 4; i++) {
        const a = hash01(s.seed + i) * TAU; const d = r * 0.3;
        ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.09, 0, TAU); ctx.fill();
      }
      break;
    }
    case 'hump': {
      ctx.fillStyle = rgba(shade(color, 0.7), 0.9);
      ctx.beginPath(); ctx.ellipse(0, r * 0.08, r * 0.55, r * 0.42, 0, Math.PI, TAU); ctx.fill();
      break;
    }
    case 'spine': {
      ctx.strokeStyle = rgba(color, 0.95); ctx.lineWidth = Math.max(2, r * 0.12);
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) { const x = -r * 0.6 + (i / 8) * r * 1.2; ctx.lineTo(x, Math.sin(i * 0.8) * r * 0.16); }
      ctx.stroke();
      break;
    }
    case 'armor': {
      for (let i = 0; i < 3; i++) {
        const y = -r * 0.28 + i * r * 0.28;
        ctx.fillStyle = rgba(shade(color, 0.75 + i * 0.06), 0.92);
        ctx.beginPath(); ctx.moveTo(-r * 0.5, y); ctx.lineTo(r * 0.5, y); ctx.lineTo(r * 0.32, y + r * 0.22); ctx.lineTo(-r * 0.32, y + r * 0.22); ctx.closePath(); ctx.fill();
      }
      break;
    }
    case 'jaws': {
      ctx.fillStyle = rgba(shade(color, 0.6), 0.95);
      ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.1); ctx.lineTo(r * 0.62, 0); ctx.lineTo(-r * 0.5, r * 0.3); ctx.closePath(); ctx.fill();
      break;
    }
    case 'fangs': {
      ctx.fillStyle = '#f4fff8';
      for (let i = 0; i < 4; i++) {
        const x = -r * 0.34 + i * r * 0.22;
        ctx.beginPath(); ctx.moveTo(x, -r * 0.12); ctx.lineTo(x + r * 0.1, -r * 0.12); ctx.lineTo(x + r * 0.05, r * 0.26); ctx.closePath(); ctx.fill();
      }
      break;
    }
    case 'beak': {
      ctx.fillStyle = rgba('#ffcf6b', 0.95);
      ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.2); ctx.lineTo(r * 0.6, 0); ctx.lineTo(-r * 0.3, r * 0.2); ctx.closePath(); ctx.fill();
      break;
    }
    case 'gullet': {
      ctx.fillStyle = rgba(shade(color, 0.75), 0.8);
      ctx.beginPath(); ctx.arc(r * 0.12, r * 0.1, r * 0.44, 0, TAU); ctx.fill();
      break;
    }
    case 'legs': {
      ctx.strokeStyle = rgba(color, 0.95); ctx.lineWidth = Math.max(2, r * 0.14);
      for (const dx of [-r * 0.28, r * 0.28]) { ctx.beginPath(); ctx.moveTo(dx, -r * 0.1); ctx.lineTo(dx * 1.4, r * 0.62); ctx.stroke(); }
      break;
    }
    case 'claws': {
      ctx.strokeStyle = '#f0f6ef'; ctx.lineWidth = Math.max(1.6, r * 0.1);
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-r * 0.4 + i * r * 0.3, -r * 0.3); ctx.lineTo(-r * 0.5 + i * r * 0.3, r * 0.4); ctx.stroke(); }
      break;
    }
    case 'tail': {
      ctx.strokeStyle = rgba(color, 0.95); ctx.lineWidth = Math.max(2, r * 0.16);
      ctx.beginPath(); ctx.moveTo(-r * 0.1, r * 0.2); ctx.quadraticCurveTo(-r * 0.7, r * 0.1, -r * 0.85, -r * 0.45); ctx.stroke();
      break;
    }
    case 'wings': {
      ctx.fillStyle = rgba(shade(color, 0.8), 0.7);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-r * 0.9, -r * 0.6, -r * 0.2, -r * 0.8); ctx.quadraticCurveTo(r * 0.4, -r * 0.5, 0, 0); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(r * 0.9, r * 0.6, r * 0.2, r * 0.8); ctx.quadraticCurveTo(-r * 0.4, r * 0.5, 0, 0); ctx.fill();
      break;
    }
    case 'throat': {
      ctx.fillStyle = rgba('#ffd9a0', 0.85);
      ctx.beginPath(); ctx.arc(0, r * 0.18, r * 0.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba('#ffb4d0', 0.8); ctx.lineWidth = Math.max(1.6, r * 0.08);
      ctx.beginPath(); ctx.arc(0, r * 0.18, r * 0.52, 0.2, Math.PI - 0.2); ctx.stroke();
      break;
    }
    case 'plumes': {
      ctx.strokeStyle = rgba(['#ff8fb1', '#8fe3ff', '#ffe38f'][s.lvl % 3], 0.95); ctx.lineWidth = Math.max(2, r * 0.11);
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(0, -r * 0.2); ctx.quadraticCurveTo(i * r * 0.5, -r * 0.8, i * r * 0.75, -r * 0.3); ctx.stroke(); }
      break;
    }
    case 'mane': {
      ctx.strokeStyle = rgba(shade(color, 1.25), 0.95); ctx.lineWidth = Math.max(2, r * 0.1);
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * 0.55 + (i / 8) * Math.PI * 0.9;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85); ctx.stroke();
      }
      break;
    }
    case 'brain': {
      ctx.strokeStyle = rgba('#ffd9f0', 0.95); ctx.lineWidth = Math.max(2, r * 0.1);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 0.12, 0, r * 0.3, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(r * 0.16, r * 0.06, r * 0.22, 0, TAU); ctx.stroke();
      break;
    }
    case 'eyes': {
      ctx.fillStyle = '#f7ffff';
      for (const dx of [-r * 0.26, r * 0.26]) { ctx.beginPath(); ctx.arc(dx, -r * 0.05, r * 0.22, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#12303a';
      for (const dx of [-r * 0.26, r * 0.26]) { ctx.beginPath(); ctx.arc(dx, -r * 0.05, r * 0.1, 0, TAU); ctx.fill(); }
      break;
    }
    case 'nose': {
      ctx.fillStyle = rgba(shade(color, 0.5), 0.9);
      ctx.beginPath(); ctx.ellipse(0, r * 0.2, r * 0.42, r * 0.3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#20303a';
      ctx.beginPath(); ctx.arc(-r * 0.14, r * 0.2, r * 0.06, 0, TAU); ctx.arc(r * 0.14, r * 0.2, r * 0.06, 0, TAU); ctx.fill();
      break;
    }
    case 'spikes': {
      ctx.fillStyle = '#e8f2e8';
      for (let i = 0; i < 5; i++) {
        const x = -r * 0.5 + i * r * 0.25;
        ctx.beginPath(); ctx.moveTo(x - r * 0.08, r * 0.2); ctx.lineTo(x, -r * 0.6); ctx.lineTo(x + r * 0.08, r * 0.2); ctx.closePath(); ctx.fill();
      }
      break;
    }
    case 'venom': {
      ctx.fillStyle = rgba('#b9ff6b', 0.9);
      for (let i = 0; i < 3; i++) ctx.beginPath(), ctx.arc(-r * 0.3 + i * r * 0.3, r * 0.1, r * 0.16, 0, TAU), ctx.fill();
      break;
    }
    case 'frill': {
      ctx.fillStyle = rgba(shade(color, 0.65), 0.9);
      ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.7, Math.PI * 1.1, Math.PI * 1.9); ctx.lineTo(0, r * 0.1); ctx.fill();
      break;
    }
    case 'lungs': {
      ctx.fillStyle = rgba('#9fe6ff', 0.7);
      for (const dx of [-r * 0.26, r * 0.26]) { ctx.beginPath(); ctx.ellipse(dx, 0, r * 0.28, r * 0.4, 0, 0, TAU); ctx.fill(); }
      break;
    }
    default: {
      ctx.fillStyle = rgba(color, 0.85);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

export const LAND_EFFECT_NAMES = {
  maxHp: 'Здоровье', hpMul: 'Здоровье %', regen: 'Регенерация', armor: 'Броня', knockResist: 'Устойчивость',
  massMul: 'Масса', speedMul: 'Скорость', sprintMul: 'Сила рывка', turnMul: 'Поворот', climb: 'Скалы',
  biteDmg: 'Укус', biteRate: 'Скорость укуса', bleed: 'Кровотечение', meatVal: 'Мясо', plantVal: 'Растительная пища',
  dnaMul: 'ДНК', staminaMax: 'Выносливость', staminaRegen: 'Восстановление сил', thirstMax: 'Запас воды',
  waterSense: 'Чутьё на воду', vision: 'Обзор', radar: 'Радар', nightVision: 'Ночное зрение', stealth: 'Скрытность',
  socialGain: 'Симпатия', singSkill: 'Пение', danceSkill: 'Танец', poseSkill: 'Поза', charmSkill: 'Ласка',
  patience: 'Терпение', slotBonus: 'Ячейки', poison: 'Яд', spikeDmg: 'Шипы', spikeKnock: 'Отброс шипов',
  abilityId: 'Способность',
};

export function landEffectText(eff) {
  const bits = [];
  for (const k in eff) {
    if (k === 'abilityId') { bits.push(`способность «${LAND_ABILITIES[eff[k]]?.name ?? eff[k]}»`); continue; }
    const v = eff[k];
    const name = LAND_EFFECT_NAMES[k] ?? k;
    const num = typeof v === 'number' ? (Math.abs(v) < 1 ? `${Math.round(v * 100)}%` : Math.round(v)) : v;
    bits.push(`${name} ${v > 0 ? '+' : ''}${num}`);
  }
  return bits.join(', ') || '—';
}

export function landClamp(v, a, b) { return clamp(v, a, b); }
