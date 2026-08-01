/* ============================================================
   battle-render.js — отрисовка боя «ЭПОХИ» (canvas)
   Живые фигурки: покачивание, походка, взмахи оружия, вспышки
   ударов, затухание смертей, частицы, свечение способностей.
   Яркая казуальная палитра, у каждой эпохи — свой пейзаж.
   Зависит от Engine (window.Engine) — только отрисовка,
   игровую логику не трогает.
   ============================================================ */
window.BattleRender = (() => {
  const E = window.Engine;
  const A = E.ARENA;

  /* ---------- Палитры эпох (яркая казуальная) ---------- */
  // Ключи совпадают с id эпох движка (Engine.TIERS)
  const ERA = {
    stone: {
      sky: ['#ffe3b3', '#ffb96e', '#c96f45'], ground: '#8a5a3a', line: 'rgba(120,70,40,.35)',
      trim: '#ff9d3d',
      hills: ['#b06a3a', '#8a5130'], sun: null, anim: 'embers',
    },
    antiquity: {
      sky: ['#d8f2ff', '#8fd0f0', '#3f86b8'], ground: '#d8c08a', line: 'rgba(90,80,50,.3)',
      trim: '#e8d25a',
      hills: ['#e0c488', '#c4a468'], sun: { x: 700, y: 90, r: 44, color: '#fff3b0' }, anim: 'clouds',
    },
    'early-med': {
      sky: ['#e8f7d4', '#a8d98a', '#5c9a55'], ground: '#5f8a4a', line: 'rgba(50,80,40,.35)',
      trim: '#8fd45a',
      hills: ['#6f9e52', '#51793d'], sun: null, anim: 'mist',
    },
    'high-med': {
      sky: ['#ffe8d0', '#f0a878', '#a05a5a'], ground: '#7a5a4a', line: 'rgba(80,50,40,.35)',
      trim: '#e8555a',
      hills: ['#9c6a52', '#7a4a3a'], sun: { x: 160, y: 110, r: 38, color: '#ffd8a0' }, anim: 'leaves',
    },
    industrial: {
      sky: ['#efe9df', '#b8ad9d', '#6a6155'], ground: '#57504a', line: 'rgba(40,35,30,.4)',
      trim: '#d8a34a',
      hills: ['#6e6558', '#4f483f'], sun: null, anim: 'sparks',
    },
    future: {
      sky: ['#b8b8ff', '#5a6ae0', '#232358'], ground: '#2a2a4a', line: 'rgba(120,140,255,.35)',
      trim: '#6a7af0',
      hills: ['#3a3a6a', '#26264a'], sun: null, anim: 'grid',
    },
  };

  /* ---------- Палитры ролей ---------- */
  const ROLE_COLOR = {
    guard:      { body: '#4a90d9', dark: '#2f66a8', light: '#7ab8f0', skin: '#f0c8a0' },
    fighter:    { body: '#e2574c', dark: '#a83a32', light: '#f08070', skin: '#f0c8a0' },
    archer:     { body: '#58b368', dark: '#3a8a4a', light: '#8ad890', skin: '#f0c8a0' },
    artillery:  { body: '#a05bd6', dark: '#743aa8', light: '#c48af0', skin: '#e8b888' },
    healer:     { body: '#e8a33d', dark: '#b8782a', light: '#ffd488', skin: '#f0d8b0' },
    scout:      { body: '#2aa8a0', dark: '#1c7a74', light: '#5ad0c8', skin: '#e8b888' },
  };

  /* ---------- Состояние анимаций (по id юнита) ---------- */
  const anim = new Map();   // id -> {lastX,lastY,walk,attackAt,flashUntil}
  const deaths = new Map(); // id -> {at, x, y}
  let lastNow = 0;

  function st(u) {
    let s = anim.get(u.id);
    if (!s) { s = { lastX: u.x, lastY: u.y, walk: 0, attackAt: 0, flashUntil: 0 }; anim.set(u.id, s); }
    return s;
  }

  /* ---------- Хелперы ---------- */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    const b = Math.max(0, Math.min(255, (n & 255) + amt));
    return `rgb(${r},${g},${b})`;
  }
  function rr(x, y, w, h, r) {
    const c = arguments[5] || null;
    if (c) { c.beginPath(); } else { ctx.beginPath(); }
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill();
  }
  function hash2(x, y) { return Math.abs(Math.sin(x * 12.9898 + y * 78.233)) * 43758.5453 % 1; }

  /* ---------- Фон эпохи ---------- */
  const particles = {}; // eraId -> массив частиц
  function getParticles(eraId, n) {
    if (!particles[eraId]) {
      const arr = [];
      for (let i = 0; i < n; i++) arr.push({ x: Math.random(), y: Math.random(), s: 0.5 + Math.random(), sp: 0.02 + Math.random() * 0.05, d: Math.random() * Math.PI * 2 });
      particles[eraId] = arr;
    }
    return particles[eraId];
  }

  function drawBackground(t, eraIdx) {
    const P = ERA[E.TIERS[eraIdx].id];
    const g = ctx.createLinearGradient(0, 0, 0, A.H);
    g.addColorStop(0, P.sky[0]); g.addColorStop(.55, P.sky[1]); g.addColorStop(1, P.sky[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, A.W, A.H);

    // солнце
    if (P.sun) {
      const rg = ctx.createRadialGradient(P.sun.x, P.sun.y, 4, P.sun.x, P.sun.y, P.sun.r * 2.4);
      rg.addColorStop(0, P.sun.color); rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(P.sun.x - P.sun.r * 2.4, P.sun.y - P.sun.r * 2.4, P.sun.r * 4.8, P.sun.r * 4.8);
      ctx.fillStyle = '#fff8e0';
      ctx.beginPath(); ctx.arc(P.sun.x, P.sun.y, P.sun.r, 0, Math.PI * 2); ctx.fill();
    }

    // холмы / силуэты
    ctx.fillStyle = P.hills[0];
    ctx.beginPath(); ctx.moveTo(0, A.H);
    for (let x = 0; x <= A.W; x += 30) ctx.lineTo(x, 320 + 60 * Math.sin(x / 120 + 1) + 20 * Math.sin(x / 47));
    ctx.lineTo(A.W, A.H); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.hills[1];
    ctx.beginPath(); ctx.moveTo(0, A.H);
    for (let x = 0; x <= A.W; x += 30) ctx.lineTo(x, 390 + 40 * Math.sin(x / 90) + 15 * Math.sin(x / 33 + 2));
    ctx.lineTo(A.W, A.H); ctx.closePath(); ctx.fill();

    // земля
    ctx.fillStyle = P.ground;
    ctx.fillRect(0, 420, A.W, 80);
    ctx.fillStyle = 'rgba(0,0,0,.12)';
    ctx.fillRect(0, 420, A.W, 6);

    // линия поля
    ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.setLineDash([10, 8]);
    for (const y of A.laneY) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(A.W, y); ctx.stroke(); }
    ctx.setLineDash([]);

    // анимации эпохи
    const id = E.TIERS[eraIdx].id;
    const tt = t;
    if (P.anim === 'embers' || P.anim === 'sparks') {
      const col = P.anim === 'embers' ? 'rgba(255,160,60,' : 'rgba(255,220,120,';
      ctx.fillStyle = col + '.85)';
      for (const p of getParticles(id, 14)) {
        const y = A.H - ((p.y + tt * p.sp) % 1.15) * A.H * 0.75;
        const x = p.x * A.W + Math.sin(tt * 0.8 + p.d) * 14;
        const s = p.s;
        ctx.globalAlpha = Math.max(0, 1 - (1 - y / A.H) * 1.6);
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (P.anim === 'clouds') {
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      for (const p of getParticles(id, 5)) {
        const x = ((p.x + tt * p.sp * 0.12) % 1.3) * A.W - 0.15 * A.W;
        const y = 40 + p.y * 90;
        ctx.beginPath(); ctx.ellipse(x, y, 46 * p.s, 14 * p.s, 0, 0, Math.PI * 2); ctx.fill();
      }
    } else if (P.anim === 'mist') {
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      for (const p of getParticles(id, 6)) {
        const x = ((p.x + tt * p.sp * 0.1) % 1.4) * A.W - 0.2 * A.W;
        const y = 330 + p.y * 90;
        ctx.beginPath(); ctx.ellipse(x, y, 90 * p.s, 12 * p.s, 0, 0, Math.PI * 2); ctx.fill();
      }
    } else if (P.anim === 'leaves') {
      ctx.fillStyle = 'rgba(200,120,70,.75)';
      for (const p of getParticles(id, 12)) {
        const x = ((p.x - tt * p.sp * 0.35) % 1.1) * A.W + 0.05 * A.W;
        const y = (p.y + tt * p.sp * 0.5) % 1 * A.H;
        ctx.save(); ctx.translate(x, y); ctx.rotate(tt * 2 + p.d);
        ctx.fillRect(-2.5, -1.5, 5, 3); ctx.restore();
      }
    } else if (P.anim === 'grid') {
      // неоновая сетка на земле
      ctx.strokeStyle = 'rgba(120,150,255,.35)'; ctx.lineWidth = 1.5;
      for (let i = -1; i < 6; i++) {
        const y = 425 + ((i + tt * 0.5) % 5) * 11;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(A.W, y); ctx.stroke();
      }
      // огни города
      ctx.fillStyle = 'rgba(255,240,160,.9)';
      for (const p of getParticles(id, 16)) {
        const x = p.x * A.W, y = 150 + p.y * 260;
        ctx.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(tt * 1.5 + p.d));
        ctx.fillRect(x, y, 3, 4);
      }
      ctx.globalAlpha = 1;
      // парящие частицы
      ctx.fillStyle = 'rgba(180,200,255,.7)';
      for (const p of getParticles(id + 'b', 10)) {
        const x = p.x * A.W + Math.sin(tt * 0.7 + p.d) * 10;
        const y = ((p.y - tt * p.sp * 0.4) % 1.2) * A.H + 0.1 * A.H;
        ctx.beginPath(); ctx.arc(x, y, p.s * 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  /* ---------- Юниты ---------- */
  function headgear(eraIdx, sc) {
    const c = ROLE_COLOR;
    switch (eraIdx) {
      case 0: // каменный век: волосы + перо
        ctx.fillStyle = '#5a3a2a';
        ctx.beginPath(); ctx.arc(0, -36 * sc, 10 * sc, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = '#e8555a'; ctx.lineWidth = 2 * sc;
        ctx.beginPath(); ctx.moveTo(6 * sc, -42 * sc); ctx.quadraticCurveTo(14 * sc, -52 * sc, 8 * sc, -58 * sc); ctx.stroke();
        break;
      case 1: // античность: шлем с гребнем
        ctx.fillStyle = '#d8c06a';
        ctx.beginPath(); ctx.arc(0, -36 * sc, 10 * sc, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#e8555a';
        ctx.fillRect(-10 * sc, -52 * sc, 20 * sc, 6 * sc);
        ctx.beginPath(); ctx.moveTo(0, -52 * sc); ctx.quadraticCurveTo(3 * sc, -62 * sc, -2 * sc, -68 * sc); ctx.lineTo(-6 * sc, -54 * sc); ctx.fill();
        break;
      case 2: // раннее средневековье: конический шлем
        ctx.fillStyle = '#9aa0a8';
        ctx.beginPath(); ctx.moveTo(-9 * sc, -32 * sc); ctx.lineTo(0, -54 * sc); ctx.lineTo(9 * sc, -32 * sc); ctx.closePath(); ctx.fill();
        ctx.fillRect(-10 * sc, -34 * sc, 20 * sc, 5 * sc);
        break;
      case 3: // высокое средневековье: гранд-хельм
        ctx.fillStyle = '#8a8f98';
        ctx.fillRect(-11 * sc, -50 * sc, 22 * sc, 20 * sc);
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-5 * sc, -46 * sc, 10 * sc, 3 * sc);
        ctx.fillRect(-5 * sc, -38 * sc, 10 * sc, 2 * sc);
        break;
      case 4: // порох и пар: кивер/кепи
        ctx.fillStyle = '#3a3f4a';
        ctx.beginPath(); ctx.moveTo(-10 * sc, -32 * sc); ctx.lineTo(10 * sc, -32 * sc); ctx.lineTo(8 * sc, -48 * sc); ctx.lineTo(-8 * sc, -48 * sc); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#d8a34a';
        ctx.fillRect(-10 * sc, -48 * sc, 20 * sc, 4 * sc);
        break;
      case 5: // будущее: визор + антенна
        ctx.fillStyle = '#3a3f55';
        ctx.beginPath(); ctx.arc(0, -36 * sc, 10 * sc, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#7ae0ff';
        ctx.fillRect(-6 * sc, -40 * sc, 12 * sc, 4 * sc);
        ctx.strokeStyle = '#9aa8ff'; ctx.lineWidth = 1.5 * sc;
        ctx.beginPath(); ctx.moveTo(4 * sc, -46 * sc); ctx.lineTo(9 * sc, -56 * sc); ctx.stroke();
        ctx.fillStyle = '#ff6a7a';
        ctx.beginPath(); ctx.arc(9 * sc, -57 * sc, 2 * sc, 0, Math.PI * 2); ctx.fill();
        break;
    }
  }

  function weapon(role, eraIdx, sc, swing, t) {
    const trim = ERA[E.TIERS[eraIdx].id].trim;
    ctx.save();
    ctx.rotate(swing * 0.7);
    switch (role) {
      case 'guard': // копьё вперёд + щит
        ctx.strokeStyle = '#5a4630'; ctx.lineWidth = 3 * sc;
        ctx.beginPath(); ctx.moveTo(10 * sc, -28 * sc); ctx.lineTo(34 * sc, -58 * sc); ctx.stroke();
        ctx.fillStyle = '#c8ccd4';
        ctx.beginPath(); ctx.moveTo(34 * sc, -58 * sc); ctx.lineTo(37 * sc, -62 * sc); ctx.lineTo(31 * sc, -61 * sc); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#7a8494';
        rr(4 * sc, -46 * sc, 14 * sc, 20 * sc, 3 * sc);
        ctx.fillStyle = trim;
        ctx.beginPath(); ctx.arc(11 * sc, -36 * sc, 3.4 * sc, 0, Math.PI * 2); ctx.fill();
        break;
      case 'fighter': // меч (машет)
        ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 2.5 * sc;
        ctx.beginPath(); ctx.moveTo(12 * sc, -22 * sc); ctx.lineTo(26 * sc, -44 * sc); ctx.stroke();
        ctx.strokeStyle = '#f2f2ea'; ctx.lineWidth = 5 * sc;
        ctx.beginPath(); ctx.moveTo(14 * sc, -26 * sc); ctx.lineTo(28 * sc, -48 * sc); ctx.stroke();
        ctx.fillStyle = trim;
        ctx.fillRect(10 * sc, -26 * sc, 3 * sc, 8 * sc);
        break;
      case 'archer': // лук
        ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 2 * sc;
        ctx.beginPath(); ctx.arc(20 * sc, -30 * sc, 13 * sc, -1.5, 1.0); ctx.stroke();
        ctx.strokeStyle = '#f2f2ea'; ctx.lineWidth = 1.2 * sc;
        ctx.beginPath(); ctx.moveTo(8 * sc, -28 * sc); ctx.lineTo(32 * sc, -32 * sc); ctx.stroke();
        break;
      case 'artillery': // бомбарда
        ctx.fillStyle = '#3a3f4a';
        rr(4 * sc, -30 * sc, 26 * sc, 8 * sc, 2 * sc);
        ctx.fillStyle = '#6a7078';
        rr(22 * sc, -33 * sc, 10 * sc, 14 * sc, 2 * sc);
        ctx.fillStyle = '#ffd97a';
        ctx.beginPath(); ctx.arc(34 * sc, -26 * sc, 4 * sc, 0, Math.PI * 2); ctx.fill();
        break;
      case 'healer': // посох
        ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 2.5 * sc;
        ctx.beginPath(); ctx.moveTo(14 * sc, -8 * sc); ctx.lineTo(14 * sc, -52 * sc); ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(14 * sc, -54 * sc, 5 * sc, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,200,.9)'; ctx.lineWidth = 2 * sc;
        ctx.beginPath(); ctx.arc(14 * sc, -54 * sc, 8 * sc + Math.sin(t * 3) * 1.5, 0, Math.PI * 2); ctx.stroke();
        break;
      case 'scout': // кинжалы
        ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 2 * sc;
        ctx.beginPath(); ctx.moveTo(8 * sc, -18 * sc); ctx.lineTo(26 * sc, -42 * sc); ctx.stroke();
        ctx.strokeStyle = '#e8e4d8'; ctx.lineWidth = 3.4 * sc;
        ctx.beginPath(); ctx.moveTo(9 * sc, -20 * sc); ctx.lineTo(25 * sc, -41 * sc); ctx.stroke();
        ctx.strokeStyle = '#e8e4d8'; ctx.lineWidth = 2.4 * sc;
        ctx.beginPath(); ctx.moveTo(2 * sc, -24 * sc); ctx.lineTo(14 * sc, -44 * sc); ctx.stroke();
        break;
    }
    ctx.restore();
  }

  function drawUnit(u, side, t, now, eraIdx) {
    const s = st(u);
    const sc = u.size || 1;
    const dt = Math.min(0.08, Math.max(0, (now - lastNow) / 1000));
    const moved = Math.hypot(u.x - s.lastX, u.y - s.lastY) > 0.6;
    if (moved) s.walk += dt * 9; else s.walk *= 0.9;
    s.lastX = u.x; s.lastY = u.y;
    const bob = Math.sin(t * 2.4 + u.id * 1.7) * 1.6 * sc + (moved ? Math.abs(Math.sin(s.walk)) * -2.5 * sc : 0);
    const flash = now < s.flashUntil;
    const swing = now - s.attackAt < 260 ? Math.sin(((now - s.attackAt) / 260) * Math.PI) * 0.9 : 0;

    const role = u.role.startsWith('boss') ? 'fighter' : u.role;
    const pal = ROLE_COLOR[role] || ROLE_COLOR.fighter;
    const x = u.x, y = u.y;

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(u.facing, 1);

    // тень
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath(); ctx.ellipse(0, 20 * sc, 19 * sc, 5.5 * sc, 0, 0, Math.PI * 2); ctx.fill();

    // ноги (шагают)
    const legSwing = moved ? Math.sin(s.walk) * 0.5 : 0;
    ctx.strokeStyle = shade(pal.dark, -12); ctx.lineWidth = 4.5 * sc; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-5 * sc, -16 * sc); ctx.lineTo(-5 * sc - legSwing * 6 * sc, -2 * sc); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5 * sc, -16 * sc); ctx.lineTo(5 * sc + legSwing * 6 * sc, -2 * sc); ctx.stroke();

    // тело с градиентом брони
    const bg = ctx.createLinearGradient(-12 * sc, 0, 12 * sc, 0);
    bg.addColorStop(0, pal.dark); bg.addColorStop(.45, pal.body); bg.addColorStop(1, pal.light);
    ctx.fillStyle = bg;
    rr(-11 * sc, -32 * sc, 22 * sc, 20 * sc, 5 * sc);
    // пояс
    ctx.fillStyle = '#3a2f22';
    ctx.fillRect(-11 * sc, -16 * sc, 22 * sc, 3 * sc);
    // плечи
    ctx.fillStyle = pal.dark;
    rr(-13 * sc, -33 * sc, 5 * sc, 8 * sc, 2 * sc);
    rr(8 * sc, -33 * sc, 5 * sc, 8 * sc, 2 * sc);

    // рука-оружие и рука-щит
    ctx.strokeStyle = pal.skin; ctx.lineWidth = 3.6 * sc; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(10 * sc, -28 * sc); ctx.lineTo(16 * sc, -20 * sc); ctx.stroke();

    // голова
    ctx.fillStyle = pal.skin;
    ctx.beginPath(); ctx.arc(0, -38 * sc, 8.6 * sc, 0, Math.PI * 2); ctx.fill();
    headgear(eraIdx, sc);

    // оружие (с замахом при атаке)
    weapon(role, eraIdx, sc, swing, t);

    // вспышка урона
    if (flash) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.beginPath(); ctx.arc(0, -24 * sc, 20 * sc, 0, Math.PI * 2); ctx.fill();
    }

    // ярость: огонь
    if (u.buffs.furyUntil > t) {
      for (let i = 0; i < 5; i++) {
        const a = t * 6 + i * 1.3, r = 16 * sc + Math.sin(t * 5 + i) * 3;
        ctx.fillStyle = i % 2 ? 'rgba(255,120,60,.8)' : 'rgba(255,200,80,.8)';
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r, -30 * sc + Math.sin(a) * r * 0.5);
        ctx.lineTo(Math.cos(a + 0.5) * (r + 5 * sc), -30 * sc + Math.sin(a + 0.5) * (r + 5 * sc) * 0.5);
        ctx.lineTo(Math.cos(a + 0.25) * (r - 4 * sc), -30 * sc + Math.sin(a + 0.25) * (r - 4 * sc) * 0.5);
        ctx.closePath(); ctx.fill();
      }
    }
    // щит-баббл
    if (u.shield > 0) {
      ctx.strokeStyle = 'rgba(130,200,255,.75)'; ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(130,200,255,.10)';
      ctx.beginPath(); ctx.arc(0, -26 * sc, 27 * sc, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // оглушение
    if (u.stunUntil > t) {
      ctx.fillStyle = '#ffd94a';
      for (let i = 0; i < 3; i++) {
        const a = t * 3 + i * 2.1;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 24 * sc, -44 * sc + Math.sin(a) * 5 * sc);
        ctx.lineTo(Math.cos(a + 0.4) * 20 * sc, -46 * sc + Math.sin(a + 0.4) * 5 * sc);
        ctx.lineTo(Math.cos(a + 0.2) * 26 * sc, -47 * sc + Math.sin(a + 0.2) * 5 * sc);
        ctx.closePath(); ctx.fill();
      }
    }
    // агро-восклицание
    if (u.tauntUntil > t) {
      ctx.font = `bold ${14 * sc}px sans-serif`; ctx.textAlign = 'center';
      ctx.fillStyle = '#ff5a5a';
      ctx.fillText('!', 16 * sc, -52 * sc);
    }

    ctx.restore();

    // аура босса
    if (u.boss) {
      ctx.strokeStyle = `rgba(255,120,90,${0.35 + 0.25 * Math.sin(t * 3)})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(x, y - 26 * sc, 40 * sc, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(255,120,90,${0.08 + 0.05 * Math.sin(t * 3)})`;
      ctx.beginPath(); ctx.arc(x, y - 26 * sc, 40 * sc, 0, Math.PI * 2); ctx.fill();
    }

    // полоса HP
    const bw = 46 * sc, bh = 6;
    const by = y - 56 * sc - (u.boss ? 10 : 0);
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    rr(x - bw / 2 - 1, by - 1, bw + 2, bh + 2, 3);
    const pct = Math.max(0, u.hp / u.maxHp);
    const hg = ctx.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0);
    hg.addColorStop(0, pct > .5 ? '#5fd86f' : pct > .25 ? '#ffcf4a' : '#ff6a5a');
    hg.addColorStop(1, pct > .5 ? '#8af09a' : pct > .25 ? '#ffe08a' : '#ff9a8a');
    ctx.fillStyle = hg;
    rr(x - bw / 2, by, bw * pct, bh, 2);
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    rr(x - bw / 2, by, bw * pct, bh * 0.4, 2);

    // имя босса
    if (u.boss) {
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd0b8';
      ctx.fillText(u.name, x, by - 8);
    }
  }

  /* ---------- Корпусы (затухание смерти) ---------- */
  function drawCorpse(u, now) {
    const d = deaths.get(u.id);
    if (!d) return;
    const age = (now - d.at) / 1000;
    if (age > 1.2) { deaths.delete(u.id); return; }
    const alpha = 1 - age / 1.2;
    const sc = u.size || 1;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ROLE_COLOR[u.role.startsWith('boss') ? 'fighter' : u.role].dark;
    ctx.translate(d.x, d.y + age * -12);
    ctx.beginPath(); ctx.arc(0, -18 * sc, 13 * sc, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-9 * sc, -12 * sc, 18 * sc, 12 * sc);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  /* ---------- Эффекты ---------- */
  function drawEffects(effects, now) {
    for (const ef of effects) {
      const age = (now - ef.born) / 1000;
      const k = Math.max(0, 1 - age / ef.ttl);
      ctx.save();
      ctx.globalAlpha = k;
      switch (ef.type) {
        case 'dmg': {
          const jx = (hash2(ef.x + ef.born, ef.y) - 0.5) * 18;
          const pop = Math.min(1, age * 8);
          ctx.font = `bold ${(ef.crit ? 18 : 14) * pop}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = ef.crit ? '#ff9a4a' : '#fff';
          ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3;
          ctx.strokeText((ef.crit ? '✶' : '') + ef.val, ef.x + jx, ef.y - 26 - age * 34);
          ctx.fillText((ef.crit ? '✶' : '') + ef.val, ef.x + jx, ef.y - 26 - age * 34);
          break;
        }
        case 'heal': {
          const jx = (hash2(ef.x + ef.born, ef.y) - 0.5) * 12;
          ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
          ctx.fillStyle = '#5fd86f';
          ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 3;
          ctx.strokeText('+' + ef.val, ef.x + jx, ef.y - 30 - age * 26);
          ctx.fillText('+' + ef.val, ef.x + jx, ef.y - 30 - age * 26);
          break;
        }
        case 'attack': {
          const prog = Math.min(1, age / ef.ttl * 2);
          const x = ef.x1 + (ef.x2 - ef.x1) * prog;
          const y = ef.y1 - 26 + (ef.y2 - ef.y1) * prog;
          ctx.strokeStyle = 'rgba(255,245,210,.9)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(ef.x1, ef.y1 - 26); ctx.lineTo(ef.x2, ef.y2 - 26); ctx.stroke();
          ctx.fillStyle = '#ffe89a';
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
          break;
        }
        case 'abil': {
          ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
          ctx.fillStyle = '#ffd94a';
          ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3;
          ctx.strokeText('✦ ' + ef.name, ef.x, ef.y - 74 - age * 18);
          ctx.fillText('✦ ' + ef.name, ef.x, ef.y - 74 - age * 18);
          break;
        }
        case 'blast': {
          const r = ef.r * (0.3 + age * 1.1);
          ctx.strokeStyle = '#ff9a4a'; ctx.lineWidth = 4;
          ctx.fillStyle = 'rgba(255,140,60,.18)';
          ctx.beginPath(); ctx.arc(ef.x, ef.y - 28, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          break;
        }
        case 'wall': {
          ctx.strokeStyle = 'rgba(130,200,255,.95)'; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.arc(ef.x, ef.y - 28, 30 + age * 14, 0, Math.PI * 2); ctx.stroke();
          break;
        }
        case 'fury': {
          ctx.strokeStyle = 'rgba(255,120,60,.95)'; ctx.lineWidth = 3;
          for (let i = 0; i < 3; i++) {
            const a = age * 9 + i * 2.1;
            ctx.beginPath(); ctx.arc(ef.x + Math.cos(a) * 22, ef.y - 30 + Math.sin(a) * 10, 5, 0, Math.PI * 2); ctx.stroke();
          }
          break;
        }
        case 'backstab': {
          ctx.strokeStyle = 'rgba(255,110,200,.95)'; ctx.lineWidth = 3; ctx.setLineDash([6, 5]);
          ctx.beginPath(); ctx.moveTo(ef.x, ef.y - 30); ctx.lineTo(ef.x2, ef.y2 - 30); ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
          ctx.fillStyle = '#ff8ad0';
          ctx.fillText('✕', (ef.x + ef.x2) / 2, (ef.y + ef.y2) / 2 - 34);
          break;
        }
        case 'mend': {
          ctx.strokeStyle = '#8af09a'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(ef.x, ef.y - 30, 12 + age * 18, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#8af09a';
          ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('✚', ef.x, ef.y - 34);
          break;
        }
        case 'summon': {
          ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
          ctx.fillStyle = '#7ae0ff';
          ctx.fillText('ПРИЗЫВ', ef.x, ef.y - 40 - age * 10);
          break;
        }
        case 'die': {
          ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
          ctx.fillStyle = '#ff8a7a';
          ctx.fillText('✖', ef.x, ef.y - 34 - age * 20);
          break;
        }
      }
      ctx.restore();
    }
  }

  /* ---------- Главная функция кадра ---------- */
  function draw(canvas, sim, effects, now, eraIdx) {
    if (canvas.width !== Math.round(canvas.clientWidth * dpr) || canvas.height !== Math.round(canvas.clientHeight * dpr)) {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    }
    const scale = canvas.clientWidth / A.W;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx.clearRect(0, 0, A.W, A.H);

    const dt = Math.min(0.1, Math.max(0, (now - lastNow) / 1000));
    lastNow = now;
    const t = sim.t;

    drawBackground(t, eraIdx);

    // регистрируем смерти
    for (const side of ['p', 'e']) for (const u of sim.team[side]) {
      if (!u.alive && !deaths.has(u.id)) deaths.set(u.id, { at: now, x: u.x, y: u.y });
    }

    // юниты (по y — дальние раньше)
    const units = [];
    for (const side of ['p', 'e']) for (const u of sim.team[side]) if (u.alive) units.push(u);
    units.sort((a, b) => a.y - b.y);
    for (const u of units) {
      const s = st(u);
      // привязка анимаций к событиям
      for (const ef of effects) {
        if (ef.type === 'attack' && Math.hypot(ef.x1 - u.x, ef.y1 - u.y) < 40) s.attackAt = now;
        if (ef.type === 'dmg' && Math.hypot(ef.x - u.x, ef.y - u.y) < 34) s.flashUntil = now + 130;
      }
      drawUnit(u, u.side, t, now, eraIdx);
    }
    // корпусы
    for (const id of deaths.keys()) {
      for (const side of ['p', 'e']) for (const u of sim.team[side]) {
        if (u.id === id && !u.alive) { drawCorpse(u, now); break; }
      }
    }
    drawEffects(effects, now);
  }

  /* ---------- init ---------- */
  let ctx = null, dpr = 1;
  function setup(canvas) {
    dpr = window.devicePixelRatio || 1;
    ctx = canvas.getContext('2d');
    return ctx;
  }

  return { setup, draw };
})();
