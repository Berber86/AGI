// landcreature.js — как выглядит зверь суши.
//
// Один рисовальщик на всех: виды NPC, игрок, портреты бестиария и превью в редакторе.
// Вид зверя складывается из «плана тела» (quadruped | biped | bird | serpent | insect | crab)
// и набора признаков (features) — тех же, что игрок покупает в геноме. Поэтому купленная
// часть не просто меняет число в статистике: она видна на теле, и её видно у соседа.
//
// Внешность = данные. Никаких спрайтов: всё рисуется путями, чтобы игра работала офлайн.

import { TAU, clamp, rgba, shade, hash01, mixHex } from './util.js';

// Планы тела: сколько ног, есть ли шея, как сидит голова.
export const PLANS = {
  quadruped: { legs: 4, neck: 0.55, headR: 0.52, len: 1.28, width: 0.86, tail: 0.7, footY: 0.34 },
  biped: { legs: 2, neck: 0.42, headR: 0.58, len: 1.0, width: 0.78, tail: 0.5, footY: 0.3 },
  bird: { legs: 2, neck: 0.5, headR: 0.44, len: 0.95, width: 0.72, tail: 0.62, footY: 0.24 },
  serpent: { legs: 0, neck: 0.8, headR: 0.5, len: 1.5, width: 0.66, tail: 1.2, footY: 0 },
  insect: { legs: 6, neck: 0.35, headR: 0.46, len: 1.05, width: 0.7, tail: 0.3, footY: 0.4 },
  crab: { legs: 6, neck: 0.18, headR: 0.5, len: 1.1, width: 1.0, tail: 0.2, footY: 0.46 },
};

export function creatureSpec(opts = {}) {
  const plan = PLANS[opts.plan] ?? PLANS.quadruped;
  return {
    x: opts.x ?? 0, y: opts.y ?? 0, r: opts.r ?? 20, heading: opts.heading ?? 0,
    plan: opts.plan ?? 'quadruped', planData: plan,
    features: opts.features ?? new Set(), lvls: opts.lvls ?? {},
    color: opts.color ?? '#8fd8b0', color2: opts.color2 ?? '#e8ffe8',
    seed: opts.seed ?? 1, phase: opts.phase ?? 0,
    walkPhase: opts.walkPhase ?? 0, walkAmp: opts.walkAmp ?? 1,
    alpha: opts.alpha ?? 1, flash: opts.flash ?? 0, downed: !!opts.downed,
    scale: opts.scale ?? 1, wings: opts.wings ?? 0,   // wings > 0 — раскрытые крылья
  };
}

// Игрок: план тела задаёт выбранная дорожка (path), признаки — купленные части.
export function specFromPlayer(p, opts = {}) {
  const plan = { predator: 'quadruped', grazer: 'quadruped', social: 'biped', titan: 'quadruped' }[p.path] ?? 'quadruped';
  return creatureSpec({
    ...opts, plan,
    features: new Set(p.features ?? []), lvls: p.featureLvls ?? {},
    color: p.color ?? '#8fd8b0', color2: p.color2 ?? '#eaffea',
    seed: p.seed ?? 7, phase: opts.phase ?? 0,
  });
}

export function specFromSpecies(sp, opts = {}) {
  return creatureSpec({
    ...opts, plan: sp.plan,
    features: new Set(sp.features ?? []),
    lvls: opts.lvls ?? {},
    color: sp.colors?.[0] ?? '#8fd8b0', color2: sp.colors?.[1] ?? '#eaffea',
    seed: opts.seed ?? (sp.id.length * 37),
  });
}

// ------------------------------------------------------------------
// Рисование
// ------------------------------------------------------------------
export function drawCreature(ctx, c, t = 0) {
  const r = c.r * c.scale;
  const P = c.planData ?? PLANS[c.plan] ?? PLANS.quadruped;
  const lv = (k) => c.lvls[k] ?? 1;
  const has = (k) => c.features.has(k);
  const walk = c.walkPhase;
  const speedAmp = clamp(c.walkAmp, 0, 2);

  ctx.save();
  ctx.globalAlpha = c.alpha;
  ctx.translate(c.x, c.y);

  // --- тень (всегда в экранных координатах, до поворота)
  ctx.fillStyle = rgba('#000000', 0.22 * c.alpha);
  ctx.beginPath();
  ctx.ellipse(2, r * 0.34, r * 1.05 * P.len, r * 0.52 * P.width, 0, 0, TAU);
  ctx.fill();

  ctx.rotate(c.heading);

  // --- хвост (позади тела)
  if (P.tail > 0) drawTail(ctx, c, r, P, t);

  // --- крылья (сложенные по бокам — за телом)
  if (has('wings')) drawWings(ctx, c, r, P, t, lv('wings'));

  // --- ноги (под телом)
  drawLegs(ctx, c, r, P, walk, speedAmp, lv);

  // --- тело
  const body = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r * 1.5);
  body.addColorStop(0, shade(c.color, 1.2));
  body.addColorStop(0.6, c.color);
  body.addColorStop(1, shade(c.color, 0.7));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * P.len, r * P.width, 0, 0, TAU);
  ctx.fill();

  // блик по спине
  ctx.fillStyle = rgba(c.color2, 0.28);
  ctx.beginPath();
  ctx.ellipse(-r * 0.1, -r * 0.22, r * P.len * 0.72, r * P.width * 0.38, 0, 0, TAU);
  ctx.fill();

  if (has('hide')) drawHide(ctx, c, r, P, lv('hide'));
  if (has('hump')) drawHump(ctx, c, r, P, lv('hump'));
  if (has('spine')) drawSpine(ctx, c, r, P, lv('spine'));
  if (has('armor')) drawArmor(ctx, c, r, P, lv('armor'));
  if (has('spikes')) drawSpikes(ctx, c, r, P, lv('spikes'));
  if (has('gullet')) drawGullet(ctx, c, r, P, lv('gullet'));
  if (has('lungs')) drawLungs(ctx, c, r, P, lv('lungs'), t);

  // --- шея и голова
  const neck = r * P.neck;
  const headX = r * (P.len * 0.82) + neck * 0.6;
  if (has('mane') || has('frill')) drawNeckDecor(ctx, c, r, P, lv, headX, t);
  ctx.fillStyle = shade(c.color, 1.05);
  ctx.beginPath();
  ctx.ellipse(headX, 0, r * P.headR * 1.15, r * P.headR * 0.95, 0, 0, TAU);
  ctx.fill();

  if (has('jaws')) drawJaws(ctx, c, r, headX, lv('jaws'), t);
  if (has('beak')) drawBeak(ctx, c, r, headX, t);
  if (has('fangs') && !has('jaws')) drawFangs(ctx, c, r, headX);
  if (has('horns')) drawHorns(ctx, c, r, headX, lv('horns'));
  if (has('plumes')) drawPlumes(ctx, c, r, headX, lv('plumes'), t);
  if (has('brain')) drawBrain(ctx, c, r, headX, lv('brain'));
  if (has('eyes') || !has('nose')) drawEyes(ctx, c, r, headX, t);
  if (has('nose')) drawNose(ctx, c, r, headX);
  if (has('throat')) drawThroat(ctx, c, r, headX, lv('throat'), t);
  if (has('venom')) drawVenom(ctx, c, r, headX, t);

  // --- вспышка урона
  if (c.flash > 0) {
    ctx.fillStyle = rgba('#ff6b6b', 0.5 * c.flash);
    ctx.beginPath(); ctx.ellipse(r * 0.3, 0, r * P.len, r * P.width, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ------------------------------------------------------------------
function legSet(P) {
  switch (P.legs) {
    case 6: return [[-0.35, 1], [-0.35, -1], [0.05, 1], [0.05, -1], [0.5, 1], [0.5, -1]];
    case 4: return [[0.42, 1], [0.42, -1], [-0.38, 1], [-0.38, -1]];
    case 2: return [[0.1, 1], [0.1, -1]];
    default: return [];
  }
}

function drawLegs(ctx, c, r, P, walk, amp, lv) {
  const legs = legSet(P);
  if (!legs.length) return;
  const long = lv ? lv('legs') : 1;
  const len = r * P.footY * (1 + 0.22 * (long - 1)) * 2.1;
  const color = shade(c.color, 0.82);
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  for (let i = 0; i < legs.length; i++) {
    const [bx, side] = legs[i];
    const off = Math.PI * (i % 2 === 0 ? 0 : 1) + i * 0.6;
    const step = Math.sin(walk + off) * amp * 0.5;
    const lift = Math.max(0, Math.sin(walk + off)) * amp;
    const hx = r * bx * P.len * 0.9, hy = side * r * P.width * 0.78;
    const fx = hx + step * r * 0.32, fy = hy + side * len * 0.5;
    ctx.lineWidth = Math.max(2, r * 0.16);
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.quadraticCurveTo(hx + r * 0.1, hy + side * len * 0.22, fx, fy - lift * r * 0.12);
    ctx.stroke();
    // ступня/коготь
    ctx.lineWidth = Math.max(2, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(fx - r * 0.1, fy - lift * r * 0.12);
    ctx.lineTo(fx + r * 0.12, fy - lift * r * 0.12);
    ctx.stroke();
  }
}

function drawTail(ctx, c, r, P, t) {
  const sway = Math.sin(t * 2.4 + c.phase) * 0.35;
  const len = r * P.tail * 1.5;
  const baseX = -r * P.len * 0.85;
  const tipX = baseX - len, tipY = sway * r * 0.9;
  ctx.strokeStyle = shade(c.color, 0.9);
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(2, r * 0.26);
  ctx.beginPath();
  ctx.moveTo(baseX, 0);
  ctx.quadraticCurveTo(baseX - len * 0.5, sway * r * 0.3, tipX, tipY);
  ctx.stroke();
  ctx.lineWidth = Math.max(1.5, r * 0.12);
  ctx.strokeStyle = shade(c.color2, 0.95);
  ctx.beginPath();
  ctx.moveTo(tipX + len * 0.12, tipY * 0.6);
  ctx.lineTo(tipX - len * 0.1, tipY * 1.5);
  ctx.stroke();
}

function drawWings(ctx, c, r, P, t, lvl) {
  const spread = c.wings > 0 ? clamp(c.wings, 0, 1) : 0;
  const flap = Math.sin(t * 6) * 0.12 * (spread > 0 ? 1 : 0.25);
  for (const side of [1, -1]) {
    ctx.save();
    ctx.rotate(side * (0.35 + spread * 0.7 + flap));
    ctx.fillStyle = rgba(shade(c.color, 1.12), 0.55 + spread * 0.25);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-r * (1.1 + spread * 0.8), -r * 0.7, -r * (0.2 + spread * 0.5), -r * (1.0 + spread * 0.5));
    ctx.quadraticCurveTo(r * 0.5, -r * 0.6, 0, 0);
    ctx.fill();
    ctx.strokeStyle = rgba(shade(c.color, 0.75), 0.5);
    ctx.lineWidth = Math.max(1, r * 0.05 + lvl * 0.4);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHide(ctx, c, r, P, lvl) {
  ctx.fillStyle = rgba(shade(c.color, 0.6), 0.28);
  const n = 8 + lvl * 4;
  for (let i = 0; i < n; i++) {
    const a = hash01(c.seed + i) * TAU;
    const d = Math.sqrt(hash01(c.seed + i * 3)) * 0.85;
    const x = Math.cos(a) * r * P.len * d * 0.85;
    const y = Math.sin(a) * r * P.width * d * 0.85;
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.1, r * 0.07, a, 0, TAU); ctx.fill();
  }
}

function drawHump(ctx, c, r, P, lvl) {
  ctx.fillStyle = rgba(shade(c.color, 0.88), 0.9);
  ctx.beginPath();
  ctx.ellipse(-r * 0.18, 0, r * (0.4 + lvl * 0.07), r * (0.36 + lvl * 0.05), 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = rgba(c.color2, 0.25);
  ctx.beginPath();
  ctx.ellipse(-r * 0.22, -r * 0.06, r * (0.24 + lvl * 0.04), r * (0.2 + lvl * 0.03), 0, 0, TAU);
  ctx.fill();
}

function drawSpine(ctx, c, r, P, lvl) {
  ctx.strokeStyle = rgba(shade(c.color, 1.35), 0.85);
  ctx.lineWidth = Math.max(1.5, r * (0.05 + lvl * 0.02));
  ctx.beginPath();
  for (let i = 0; i <= 10; i++) {
    const x = (-0.7 + (i / 10) * 1.25) * r * P.len;
    const y = Math.sin(i * 0.9 + c.phase) * r * 0.04;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawArmor(ctx, c, r, P, lvl) {
  const plates = 3 + lvl;
  for (let i = 0; i < plates; i++) {
    const x = (-0.6 + (i / (plates - 1)) * 1.2) * r * P.len;
    const w = r * P.width * (1.15 - Math.abs(i / (plates - 1) - 0.5) * 0.35);
    ctx.fillStyle = rgba(shade(c.color, 0.72 + i * 0.02), 0.92);
    ctx.beginPath();
    ctx.moveTo(x - r * 0.16, -w);
    ctx.lineTo(x + r * 0.16, -w);
    ctx.lineTo(x + r * 0.1, w);
    ctx.lineTo(x - r * 0.1, w);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba('#0b1a12', 0.25);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawSpikes(ctx, c, r, P, lvl) {
  ctx.fillStyle = '#f2f7ee';
  const n = 4 + lvl * 2;
  for (let i = 0; i < n; i++) {
    const x = (-0.6 + (i / (n - 1)) * 1.2) * r * P.len * 0.9;
    const h = r * (0.22 + lvl * 0.06);
    ctx.beginPath();
    ctx.moveTo(x - r * 0.07, -r * P.width * 0.6);
    ctx.lineTo(x, -r * P.width * 0.6 - h);
    ctx.lineTo(x + r * 0.07, -r * P.width * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - r * 0.07, r * P.width * 0.6);
    ctx.lineTo(x, r * P.width * 0.6 + h);
    ctx.lineTo(x + r * 0.07, r * P.width * 0.6);
    ctx.closePath();
    ctx.fill();
  }
}

function drawGullet(ctx, c, r, P, lvl) {
  ctx.fillStyle = rgba(shade(c.color, 1.18), 0.75);
  ctx.beginPath();
  ctx.ellipse(r * 0.05, r * P.width * 0.25, r * (0.34 + lvl * 0.06), r * (0.26 + lvl * 0.05), 0, 0, TAU);
  ctx.fill();
}

function drawLungs(ctx, c, r, P, lvl, t) {
  const breathe = 0.9 + Math.sin(t * 2.2 + c.phase) * 0.12;
  ctx.fillStyle = rgba('#a8e6ff', 0.5);
  for (const side of [1, -1]) {
    ctx.beginPath();
    ctx.ellipse(-r * 0.15, side * r * P.width * 0.55, r * (0.2 + lvl * 0.04) * breathe, r * (0.16 + lvl * 0.03) * breathe, 0, 0, TAU);
    ctx.fill();
  }
}

function drawNeckDecor(ctx, c, r, P, lv, headX, t) {
  if (c.features.has('mane')) {
    const lvl = lv('mane');
    ctx.fillStyle = rgba(shade(c.color, 1.3), 0.85);
    const spikes = 7 + lvl * 3;
    const cx = headX - r * 0.55;
    for (let i = 0; i < spikes; i++) {
      const a = -1.3 + (i / (spikes - 1)) * 2.6;
      const len = r * (0.3 + lvl * 0.08);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx + Math.cos(a) * len * 0.4, Math.sin(a) * len * 1.1);
      ctx.lineTo(cx + Math.cos(a + 0.22) * len * 0.42, Math.sin(a + 0.22) * len * 1.12);
      ctx.closePath();
      ctx.fill();
    }
  }
  if (c.features.has('frill')) {
    const lvl = lv('frill');
    const grow = 1 + Math.sin(t * 1.6 + c.phase) * 0.06;
    ctx.fillStyle = rgba(shade(c.color, 0.8), 0.92);
    ctx.beginPath();
    ctx.ellipse(headX - r * 0.35, 0, r * (0.36 + lvl * 0.08) * grow, r * (0.5 + lvl * 0.1) * grow, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = rgba(shade(c.color2, 0.9), 0.6);
    ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.stroke();
  }
}

function drawJaws(ctx, c, r, headX, lvl, t) {
  const open = 0.16 + lvl * 0.05 + Math.sin(t * 3 + c.phase) * 0.06;
  ctx.fillStyle = shade(c.color, 0.85);
  for (const side of [1, -1]) {
    ctx.beginPath();
    ctx.moveTo(headX + r * 0.1, 0);
    ctx.lineTo(headX + r * 0.66, side * r * 0.3 * open * 2);
    ctx.lineTo(headX + r * 0.5, side * r * 0.42 * open);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#3a2b2b';
  ctx.beginPath();
  ctx.ellipse(headX + r * 0.42, 0, r * 0.2, r * 0.18 * open * 2, 0, 0, TAU);
  ctx.fill();
}

function drawBeak(ctx, c, r, headX, t) {
  ctx.fillStyle = '#ffcf7a';
  ctx.beginPath();
  ctx.moveTo(headX + r * 0.2, -r * 0.22);
  ctx.lineTo(headX + r * 0.78, 0);
  ctx.lineTo(headX + r * 0.2, r * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = rgba('#8a6a30', 0.6);
  ctx.lineWidth = Math.max(1, r * 0.04);
  ctx.beginPath();
  ctx.moveTo(headX + r * 0.22, 0);
  ctx.lineTo(headX + r * 0.74, 0);
  ctx.stroke();
}

function drawFangs(ctx, c, r, headX) {
  ctx.fillStyle = '#f7fff8';
  for (const side of [1, -1]) {
    ctx.beginPath();
    ctx.moveTo(headX + r * 0.42, side * r * 0.16);
    ctx.lineTo(headX + r * 0.62, side * r * 0.1);
    ctx.lineTo(headX + r * 0.46, side * r * 0.34);
    ctx.closePath();
    ctx.fill();
  }
}

function drawHorns(ctx, c, r, headX, lvl) {
  ctx.strokeStyle = '#efe6d2';
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(2, r * (0.09 + lvl * 0.02));
  for (const side of [1, -1]) {
    ctx.beginPath();
    ctx.moveTo(headX - r * 0.1, side * r * 0.26);
    ctx.quadraticCurveTo(headX + r * 0.2, side * r * 0.7, headX + r * 0.5, side * r * 0.72);
    ctx.stroke();
  }
}

function drawPlumes(ctx, c, r, headX, lvl, t) {
  const colors = ['#ff8fb1', '#8fe3ff', '#ffe38f'];
  for (let i = 0; i < 2 + lvl; i++) {
    const a = -0.5 + i * (1 / (1 + lvl)) * 0.9;
    const len = r * (0.5 + lvl * 0.12);
    ctx.strokeStyle = rgba(colors[i % colors.length], 0.9);
    ctx.lineWidth = Math.max(1.5, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(headX - r * 0.2, 0);
    ctx.quadraticCurveTo(headX - len * 0.6, Math.sin(t * 3 + i) * r * 0.2 - len * 0.5, headX - len * 0.8, -len * 0.9);
    ctx.stroke();
  }
}

function drawBrain(ctx, c, r, headX, lvl) {
  ctx.fillStyle = rgba('#ffd9f0', 0.55);
  ctx.beginPath();
  ctx.ellipse(headX - r * 0.12, -r * 0.16, r * (0.22 + lvl * 0.05), r * (0.18 + lvl * 0.04), 0, 0, TAU);
  ctx.fill();
}

function drawEyes(ctx, c, r, headX, t) {
  const blink = Math.sin(t * 0.7 + c.phase * 3) > 0.97 ? 0.15 : 1;
  for (const side of [1, -1]) {
    ctx.fillStyle = '#f8ffff';
    ctx.beginPath();
    ctx.ellipse(headX + r * 0.16, side * r * 0.26, r * 0.15, r * 0.15 * blink, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#16242c';
    ctx.beginPath();
    ctx.ellipse(headX + r * 0.2, side * r * 0.26, r * 0.07, r * 0.07 * blink, 0, 0, TAU);
    ctx.fill();
  }
}

function drawNose(ctx, c, r, headX) {
  ctx.fillStyle = rgba('#2a2026', 0.8);
  ctx.beginPath();
  ctx.ellipse(headX + r * 0.6, 0, r * 0.12, r * 0.16, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = rgba(c.color2, 0.6);
  ctx.beginPath();
  ctx.ellipse(headX + r * 0.34, 0, r * 0.2, r * 0.26, 0, 0, TAU);
  ctx.fill();
}

function drawThroat(ctx, c, r, headX, lvl, t) {
  const pulse = 1 + Math.sin(t * 3.4 + c.phase) * 0.12;
  ctx.fillStyle = rgba('#ffd9a0', 0.8);
  ctx.beginPath();
  ctx.ellipse(headX - r * 0.35, 0, r * (0.24 + lvl * 0.05) * pulse, r * (0.2 + lvl * 0.04) * pulse, 0, 0, TAU);
  ctx.fill();
}

function drawVenom(ctx, c, r, headX, t) {
  ctx.fillStyle = rgba('#b9ff6b', 0.85);
  for (let i = 0; i < 3; i++) {
    const drip = (t * 0.6 + i * 0.3) % 1;
    ctx.beginPath();
    ctx.arc(headX + r * (0.5 + i * 0.06), -r * 0.2 + drip * r * 0.4, r * 0.05, 0, TAU);
    ctx.fill();
  }
}

// Портрет для бестиария: вид целиком, крупно, на нейтральном фоне.
export function drawLandPortrait(ctx, sp, size, scale = 1) {
  const r = size * 0.2 * scale;
  ctx.clearRect(0, 0, size, size);
  const grad = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size * 0.7);
  grad.addColorStop(0, rgba(sp.colors[0], 0.22));
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const spec = specFromSpecies(sp, {
    x: size / 2, y: size / 2 + size * 0.04, r, heading: -Math.PI / 2,
    walkPhase: 1.1, walkAmp: 0.6, alpha: 1,
  });
  drawCreature(ctx, spec, 1.2);
  if (sp.boss) {
    ctx.strokeStyle = rgba('#ff8f6b', 0.8);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.46, 0, TAU); ctx.stroke();
  }
}
