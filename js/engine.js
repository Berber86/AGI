/* ============================================================
   engine.js — движок боя «ЭПОХИ» (чистая логика, без DOM)
   Данные (эпохи, роли, враги, боссы) + симуляция боя.
   Работает в браузере (window.Engine) и в Node (module.exports)
   — для симуляций баланса.
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.Engine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
"use strict";
const Engine = (() => {

  /* ---------- Данные ---------- */

  const TIERS = [
    { id:'stone',      name:'Каменный век',                act:1, key:'STONE' },
    { id:'antiquity',  name:'Бронза и Античность',         act:1, key:'BRONZE' },
    { id:'early-med',  name:'Раннее Средневековье',        act:2, key:'EARLYMED' },
    { id:'high-med',   name:'Высокое Средневековье',       act:2, key:'HIGMED' },
    { id:'industrial', name:'Эпоха Пороха и Пара',         act:3, key:'GUNPOWDER' },
    { id:'future',     name:'Современность и Будущее',     act:3, key:'FUTURE' },
  ];
  const TIER_MULT = [1.00, 1.35, 1.80, 2.40, 3.20, 4.30];
  const LVL_MULT  = lvl => 1 + 0.35 * (lvl - 1);

  const ROLES = {
    guard: {
      name:'Страж', row:'front',
      names:['Вождь','Гоплит','Рыцарь','Латник','Тяжёлый пехотинец','Киборг-страж'],
      base:{ hp:220, atk:14, iv:1.6, rng:1.2, spd:1.0 },
      abil:{ id:'wall', name:'Стена щитов', cd:10, desc:'Агро всех врагов на себя и щит 25% макс. HP на 4 с' },
    },
    fighter: {
      name:'Боец', row:'front',
      names:['Берсерк','Гладиатор','Мечник','Кондотьер','Коммандос','Киборг-солдат'],
      base:{ hp:150, atk:20, iv:1.2, rng:1.2, spd:1.1 },
      abil:{ id:'fury', name:'Ярость', cd:12, desc:'+90% урона и вампиризм 25% на 5 с' },
    },
    archer: {
      name:'Стрелок', row:'back',
      names:['Охотница','Скифский лучник','Арбалетчик','Мушкетёр','Снайпер','Дрон-снайпер'],
      base:{ hp:90, atk:16, iv:1.4, rng:4.5, spd:0.9 },
      abil:{ id:'volley', name:'Залп', cd:8, desc:'3 выстрела по трём самым раненым врагам' },
    },
    artillery: {
      name:'Артиллерия', row:'back',
      names:['Шаман','Жрец огня','Алхимик','Бомбардир','Ракетчик','Плазменный дрон'],
      base:{ hp:110, atk:22, iv:2.0, rng:4.0, spd:0.8 },
      abil:{ id:'blast', name:'Взрыв', cd:9, desc:'Урон 150% всем врагам в области' },
    },
    healer: {
      name:'Лекарь', row:'back',
      names:['Знахарка','Жрица','Монах-лекарь','Хирург','Полевой медик','Нано-медик'],
      base:{ hp:100, atk:8, iv:1.8, rng:3.5, spd:0.9 },
      abil:{ id:'mend', name:'Восстановление', cd:8, desc:'Лечит самого раненого союзника на 220% атаки' },
    },
    scout: {
      name:'Разведчик', row:'front',
      names:['Следопыт','Всадник','Шевалье','Гусар','Моторазведчик','Дрон-истребитель'],
      base:{ hp:120, atk:17, iv:1.1, rng:1.3, spd:1.3 },
      abil:{ id:'backstab', name:'Удар в спину', cd:10, desc:'Рывок к самому раненому врагу, урон 250%' },
    },
  };
  const ROLE_ORDER = ['guard','fighter','archer','artillery','healer','scout'];

  const ARTIFACTS = {
    totem:   { name:'Тотем предков',   desc:'+20% к здоровью всего отряда' },
    fire:    { name:'Священный огонь', desc:'+20% к атаке всего отряда' },
    drum:    { name:'Боевой барабан',  desc:'+15% к скорости атаки' },
    potion:  { name:'Эликсир жизни',   desc:'+25% к силе лечения' },
    edge:    { name:'Заточенный клинок', desc:'+15% к шансу крита' },
    chariot: { name:'Колесница вождя', desc:'+1 место в отряде' },
  };

  const BOSSES = {
    colossus: {
      name:'Бронзовый колосс', tier:1, size:1.7,
      base:{ hp:950, atk:31, iv:2.2, rng:1.5, spd:0.55 },
      abil:{ id:'quake', name:'Дрожь земли', cd:9, desc:'Область вокруг себя: 150% урона и оглушение 1 с' },
    },
    ironKnight: {
      name:'Железный рыцарь', tier:3, size:1.7,
      base:{ hp:1100, atk:40, iv:1.9, rng:1.4, spd:0.7 },
      abil:{ id:'charge', name:'Таран', cd:10, desc:'Рывок к дальнему врагу: 150% урона и оглушение 1.2 с' },
    },
    neuroColossus: {
      name:'Нейро-колосс', tier:5, size:1.9,
      base:{ hp:1425, atk:50, iv:1.8, rng:2.2, spd:0.65 },
      abil:{ id:'singularity', name:'Сингулярность', cd:12, desc:'Область у дальнего врага: 140% урона + призыв 2 дронов' },
    },
  };

  /* Составы врагов по этапам: {role, tier, m (множитель силы), lvl}
     Босс-этапы: {boss, adds:[...], m} */
  const STAGES = [
    { name:'Племена долины',        foes:[ {r:'guard',m:.65}, {r:'archer',m:.65} ] },
    { name:'Закат каменного века',  foes:[ {r:'guard',m:.75}, {r:'fighter',m:.75}, {r:'archer',m:.75} ] },
    { name:'Кузницы бронзы',        foes:[ {r:'guard',m:.80}, {r:'fighter',m:.80}, {r:'archer',m:.80}, {r:'healer',m:.75} ] },
    { name:'Колосс Античности',     boss:'colossus', foes:[ {r:'guard',m:.85,tier:1}, {r:'archer',m:.85,tier:1} ] },
    { name:'Тени тёмных веков',     foes:[ {r:'guard',m:1.00,tier:2}, {r:'fighter',m:1.00,tier:2}, {r:'archer',m:1.00,tier:2}, {r:'healer',m:.93,tier:2}, {r:'scout',m:.93,tier:2} ] },
    { name:'Мечи и знамёна',        foes:[ {r:'guard',m:1.02,tier:2}, {r:'fighter',m:1.02,tier:2}, {r:'fighter',m:1.02,tier:2}, {r:'artillery',m:1.02,tier:2}, {r:'archer',m:1.02,tier:2}, {r:'healer',m:.95,tier:2} ] },
    { name:'Чёрные доспехи',        foes:[ {r:'guard',m:1.00,tier:3,lvl:2}, {r:'fighter',m:1.00,tier:3,lvl:2}, {r:'scout',m:.97,tier:3,lvl:2}, {r:'artillery',m:1.00,tier:3,lvl:2}, {r:'archer',m:1.00,tier:3,lvl:2}, {r:'healer',m:.92,tier:3,lvl:2} ] },
    { name:'Железный рыцарь',       boss:'ironKnight', foes:[ {r:'guard',m:.85,tier:3,lvl:2}, {r:'guard',m:.85,tier:3,lvl:2}, {r:'archer',m:.90,tier:3,lvl:2}, {r:'healer',m:.82,tier:3,lvl:2} ] },
    { name:'Порох и сталь',         foes:[ {r:'guard',m:1.18,tier:4,lvl:2}, {r:'fighter',m:1.18,tier:4,lvl:2}, {r:'archer',m:1.18,tier:4,lvl:2}, {r:'artillery',m:1.18,tier:4,lvl:2}, {r:'healer',m:1.08,tier:4,lvl:2}, {r:'scout',m:1.12,tier:4,lvl:2} ] },
    { name:'Дым машин',             foes:[ {r:'guard',m:1.20,tier:4,lvl:2}, {r:'fighter',m:1.20,tier:4,lvl:2}, {r:'fighter',m:1.20,tier:4,lvl:2}, {r:'archer',m:1.20,tier:4,lvl:2}, {r:'artillery',m:1.20,tier:4,lvl:2}, {r:'healer',m:1.10,tier:4,lvl:2} ] },
    { name:'Холодная война',        foes:[ {r:'guard',m:1.00,tier:5,lvl:3}, {r:'fighter',m:1.00,tier:5,lvl:3}, {r:'fighter',m:1.00,tier:5,lvl:3}, {r:'archer',m:1.00,tier:5,lvl:3}, {r:'artillery',m:1.00,tier:5,lvl:3}, {r:'healer',m:.95,tier:5,lvl:3} ] },
    { name:'Нейро-колосс',          boss:'neuroColossus', foes:[ {r:'guard',m:.95,tier:5,lvl:2}, {r:'guard',m:.95,tier:5,lvl:2}, {r:'archer',m:1.00,tier:5,lvl:2}, {r:'healer',m:.92,tier:5,lvl:2}, {r:'scout',m:.97,tier:5,lvl:2} ] },
  ];

  const ARENA = {
    W: 900, H: 500,
    laneY: [140, 250, 360],
    playerX: 150, enemyX: 750,
    rngPx: 58,          // 1 единица дальности = 58 px
    spdPx: 55,          // 1 единица скорости = 55 px/с
    size: 46,           // базовый размер юнита
  };

  /* ---------- Артефакты: модификаторы ---------- */
  function artifactMods(list) {
    const m = { hp:1, atk:1, aspd:1, heal:1, crit:0 };
    for (const id of list) {
      if (id==='totem') m.hp += .20;
      if (id==='fire') m.atk += .20;
      if (id==='drum') m.aspd += .15;
      if (id==='potion') m.heal += .25;
      if (id==='edge') m.crit += .15;
    }
    return m;
  }

  /* ---------- Юниты ---------- */
  let UID = 1;
  function makeUnit(role, tier, lvl, side, opts = {}) {
    const R = ROLES[role];
    const base = Object.assign({}, R.base);
    const tm = TIER_MULT[Math.max(0, Math.min(tier, TIER_MULT.length-1))];
    const lm = LVL_MULT(lvl);
    const mods = opts.mods || artifactMods(opts.artifacts || []);
    const m = opts.m || 1;               // персональный множитель (враги)
    const hp  = Math.round(base.hp * tm * lm * mods.hp * m);
    const atk = Math.round(base.atk * tm * lm * mods.atk * m);
    return {
      id: UID++, side, role, tier, lvl, name: R.names[tier],
      x:0, y:0, lane: opts.lane ?? 1, row: opts.row ?? R.row,
      hp, maxHp: hp, atk,
      iv: base.iv / mods.aspd,
      rng: base.rng * ARENA.rngPx,
      spd: base.spd * ARENA.spdPx,
      healMult: mods.heal, crit: 0.10 + mods.crit,
      alive: true, facing: side==='p' ? 1 : -1,
      atkCd: 0.5 + Math.random()*0.6, abilityCd: 2 + Math.random()*3,
      buffs: {}, shield: 0, tauntUntil: 0, stunUntil: 0,
      boss: opts.boss || null,
    };
  }
  function makeBoss(bkey, opts = {}) {
    const B = BOSSES[bkey];
    const tm = TIER_MULT[B.tier];
    const mods = artifactMods(opts.artifacts || []);
    const m = opts.m || 1;
    const hp  = Math.round(B.base.hp * tm * mods.hp * m);
    const atk = Math.round(B.base.atk * tm * mods.atk * m);
    const u = makeUnit('fighter', B.tier, 1, opts.side || 'e', { lane: 1, row: 'front' });
    u.boss = bkey;
    u.role = 'boss:'+bkey;
    u.name = B.name;
    u.hp = u.maxHp = hp; u.atk = atk;
    u.iv = B.base.iv / mods.aspd;
    u.rng = B.base.rng * ARENA.rngPx;
    u.spd = B.base.spd * ARENA.spdPx;
    u.size = B.size;
    u.abilityCd = 4 + Math.random()*3;
    return u;
  }

  /* ---------- СИМУЛЯЦИЯ БОЯ ---------- */
  class Sim {
    constructor(teamP, teamE, opts = {}) {
      this.team = { p: teamP, e: teamE };
      this.t = 0;
      this.events = [];
      this.onEvent = opts.onEvent || (()=>{});
      this.timeout = 150;
      this.enrageAt = 60;
      this.done = false;
      this.winner = null; // 'p' | 'e' | 'draw'
      this.reason = '';
      this.place(teamP, 'p'); this.place(teamE, 'e');
    }
    place(units, side) {
      const off = side==='p' ? -1 : 1;
      const x0 = side==='p' ? ARENA.playerX : ARENA.enemyX;
      for (const u of units) {
        u.side = side;
        u.lane = u.lane ?? 1;
        // передний ряд выдвинут к врагу, задний — у своей кромки
        u.x = x0 + (u.row==='front' ? -off*30 : off*8);
        u.y = ARENA.laneY[u.lane];
        u.alive = true; u.shield = 0; u.tauntUntil = 0; u.stunUntil = 0;
        u.atkCd = Math.random()*0.6; u.abilityCd = 2 + Math.random()*3;
        u.buffs = {};
      }
    }
    alive(side) { return this.team[side].filter(u => u.alive); }
    allAlive() { return this.team.p.filter(u=>u.alive).concat(this.team.e.filter(u=>u.alive)); }

    step(dt) {
      if (this.done) return;
      this.t += dt;
      const enraged = this.t > this.enrageAt ? 1 + 0.08 * Math.floor((this.t - this.enrageAt)/8) : 1;

      for (const side of ['p','e']) {
        for (const u of this.alive(side)) {
          u.abilityCd -= dt;
          this.tryAbility(u, enraged);
        }
      }
      for (const side of ['p','e']) {
        for (const u of this.alive(side)) {
          this.updateUnit(u, dt, enraged);
        }
      }
      // конец боя
      const pAlive = this.alive('p').length, eAlive = this.alive('e').length;
      if (eAlive === 0 && pAlive === 0) this.end('draw');
      else if (eAlive === 0) this.end('p');
      else if (pAlive === 0) this.end('e');
      else if (this.t >= this.timeout) {
        const hpP = this.alive('p').reduce((s,u)=>s+u.hp/u.maxHp,0);
        const hpE = this.alive('e').reduce((s,u)=>s+u.hp/u.maxHp,0);
        this.end(hpP >= hpE ? 'p' : 'e', 'время вышло');
      }
    }
    end(winner, reason='') {
      this.done = true; this.winner = winner; this.reason = reason;
      this.emit({ type:'end', winner, reason });
    }
    emit(ev) { this.events.push(ev); this.onEvent(ev); }

    /* --- поиск цели --- */
    target(u) {
      const foes = this.alive(u.side==='p' ? 'e' : 'p');
      if (!foes.length) return null;
      const taunts = foes.filter(f => f.tauntUntil > this.t);
      if (taunts.length) {
        let best = taunts[0], bd = Infinity;
        for (const f of taunts) { const d = dist(u,f); if (d<bd){bd=d;best=f;} }
        return best;
      }
      let best = null, bd = Infinity;
      for (const f of foes) {
        const same = Math.abs(f.lane - u.lane) <= 0.5;
        const d = dist(u,f) * (same ? 0.78 : 1.0);
        if (d < bd) { bd = d; best = f; }
      }
      return best;
    }
    frontAliveInLane(side, lane) {
      return this.team[side].some(u => u.alive && u.row==='front' && u.lane===lane);
    }
    canAdvance(u) {
      if (u.row === 'front') return true;
      // задний ряд ждёт, пока фронт той же линии жив
      return !this.frontAliveInLane(u.side, u.lane);
    }

    updateUnit(u, dt, enraged) {
      if (u.stunUntil > this.t) { u.atkCd = Math.max(u.atkCd, 0.05); return; }
      // сброс буста ярости по таймеру
      if (u.buffs.furyUntil && this.t > u.buffs.furyUntil) {
        delete u.buffs.atkMult; delete u.buffs.lifesteal; delete u.buffs.furyUntil;
      }
      const tgt = this.target(u);
      if (!tgt) return;
      const d = dist(u, tgt);
      // движение
      if (d > u.rng && this.canAdvance(u)) {
        const blocked = this.team[u.side].some(o =>
          o.alive && o!==u && o.lane===u.lane && Math.abs(o.x-u.x)<50 &&
          (o.x - u.x) * u.facing > 0 && Math.abs(o.y-u.y) < 40 && u.row==='front');
        if (!blocked) {
          const dx = (tgt.x-u.x)/d, dy = (tgt.y-u.y)/d;
          const step = Math.min(u.spd*dt, d - u.rng + 1);
          u.x += dx*step; u.y += dy*step;
        }
      }
      // атака
      u.atkCd -= dt;
      if (u.atkCd <= 0 && d <= u.rng) {
        u.atkCd = u.iv;
        const crit = Math.random() < u.crit;
        let dmg = Math.round(u.atk * (crit ? 1.5 : 1) * (u.buffs.atkMult || 1) * enraged);
        this.damage(u, tgt, dmg, crit);
        this.emit({ type:'attack', x1:u.x, y1:u.y, x2:tgt.x, y2:tgt.y, crit, side:u.side });
        const ls = u.buffs.lifesteal || 0;
        if (ls > 0 && u.hp < u.maxHp) {
          const heal = Math.round(dmg * ls);
          u.hp = Math.min(u.maxHp, u.hp + heal);
          this.emit({type:'heal', x:u.x, y:u.y, val:heal});
        }
      }
    }

    damage(src, dst, amount, crit) {
      if (!dst.alive) return;
      let a = amount;
      if (dst.shield > 0) {
        const absorbed = Math.min(dst.shield, a);
        dst.shield -= absorbed; a -= absorbed;
        this.emit({ type:'shield', x:dst.x, y:dst.y, val:absorbed });
      }
      if (a <= 0) return; // щит поглотил весь урон
      dst.hp -= a;
      this.emit({ type:'dmg', x:dst.x, y:dst.y, val:a, crit: !!crit });
      if (dst.hp <= 0) { dst.hp = 0; dst.alive = false; this.emit({ type:'die', x:dst.x, y:dst.y, side:dst.side }); }
    }
    healAmount(u, amount) {
      const val = Math.round(amount * u.healMult);
      if (u.hp >= u.maxHp) return;
      u.hp = Math.min(u.maxHp, u.hp + val);
      this.emit({ type:'heal', x:u.x, y:u.y, val });
    }

    /* --- способности --- */
    tryAbility(u, enraged) {
      if (u.boss) { this.tryBossAbility(u, enraged); return; }
      const R = ROLES[u.role];
      if (!R || !R.abil) return;
      const ab = R.abil;
      if (u.abilityCd > 0) return;
      const foes = this.alive(u.side==='p' ? 'e' : 'p');
      if (!foes.length) return;
      const allies = this.alive(u.side);
      if (ab.id === 'mend') {
        const hurt = allies.filter(a => a.hp < a.maxHp);
        if (!hurt.length) { u.abilityCd = 1.0; return; } // ждём, пока есть кого лечить
      }
      u.abilityCd = ab.cd;
      this.emit({ type:'abil', x:u.x, y:u.y, name:ab.name, side:u.side });
      const tgt = this.target(u);
      switch (ab.id) {
        case 'wall': {
          u.shield = Math.round(u.maxHp * 0.25);
          u.tauntUntil = this.t + 4;
          this.emit({ type:'wall', x:u.x, y:u.y });
          break;
        }
        case 'fury': {
          u.buffs.atkMult = (u.buffs.atkMult||1) * 1.9;
          u.buffs.lifesteal = 0.25;
          u.buffs.furyUntil = this.t + 5;
          this.emit({ type:'fury', x:u.x, y:u.y });
          break;
        }
        case 'volley': {
          const targets = foes.slice().sort((a,b)=>a.hp/a.maxHp - b.hp/b.maxHp).slice(0,3);
          for (const f of targets) {
            const crit = Math.random() < u.crit;
            const dmg = Math.round(u.atk * 0.8 * (crit ? 1.5 : 1) * enraged);
            this.damage(u, f, dmg, crit);
            this.emit({ type:'attack', x1:u.x, y1:u.y, x2:f.x, y2:f.y, crit:false });
          }
          break;
        }
        case 'blast': {
          const t = tgt;
          const dmg = Math.round(u.atk * 1.5 * enraged);
          for (const f of foes) if (dist(f, t) < 95) this.damage(u, f, dmg, false);
          this.emit({ type:'blast', x:t.x, y:t.y, r:95 });
          break;
        }
        case 'mend': {
          const hurt = allies.filter(a => a.hp < a.maxHp);
          if (!hurt.length) break;
          const target = hurt.sort((a,b)=>a.hp/a.maxHp - b.hp/b.maxHp)[0];
          this.healAmount(target, u.atk * 2.2);
          this.emit({ type:'mend', x:target.x, y:target.y });
          break;
        }
        case 'backstab': {
          const target = foes.slice().sort((a,b)=>a.hp/a.maxHp - b.hp/b.maxHp)[0];
          const crit = Math.random() < u.crit;
          const dmg = Math.round(u.atk * 2.5 * (crit ? 1.5 : 1) * enraged);
          this.damage(u, target, dmg, crit);
          this.emit({ type:'backstab', x:u.x, y:u.y, x2:target.x, y2:target.y });
          break;
        }
      }
    }

    tryBossAbility(u, enraged) {
      const B = BOSSES[u.boss];
      if (u.abilityCd > 0) return;
      const foes = this.alive(u.side==='p' ? 'e' : 'p');
      if (!foes.length) return;
      u.abilityCd = B.abil.cd;
      this.emit({ type:'abil', x:u.x, y:u.y, name:B.abil.name, side:u.side });
      switch (B.abil.id) {
        case 'quake': {
          const dmg = Math.round(u.atk * 1.5 * enraged);
          for (const f of foes) if (dist(f,u) < 130) { this.damage(u, f, dmg, false); f.stunUntil = Math.max(f.stunUntil, this.t + 1); }
          this.emit({ type:'blast', x:u.x, y:u.y, r:130 });
          break;
        }
        case 'charge': {
          let far = foes[0];
          for (const f of foes) if (dist(u,f) > dist(u,far)) far = f;
          const dmg = Math.round(u.atk * 1.7 * enraged);
          const d = dist(u, far) || 1;
          u.x += (far.x-u.x)/d * Math.min(d, 300); u.y += (far.y-u.y)/d * Math.min(d, 300);
          this.damage(u, far, dmg, false); far.stunUntil = Math.max(far.stunUntil, this.t + 1.5);
          this.emit({ type:'backstab', x:u.x, y:u.y, x2:far.x, y2:far.y });
          break;
        }
        case 'singularity': {
          let far = foes[0];
          for (const f of foes) if (dist(u,f) > dist(u,far)) far = f;
          const dmg = Math.round(u.atk * 1.6 * enraged);
          for (const f of foes) if (dist(f, far) < 110) this.damage(u, f, dmg, false);
          this.emit({ type:'blast', x:far.x, y:far.y, r:110 });
          // призыв дронов
          const side = u.side;
          for (let i=0;i<2;i++) {
            const drone = makeUnit('archer', 5, 1, side, { m:0.45, lane: i===0?0:2, row:'back' });
            drone.x = u.x + (side==='p'?40:-40); drone.y = ARENA.laneY[drone.lane];
            drone.atkCd = 1; drone.abilityCd = 99;
            this.team[side].push(drone);
            this.emit({ type:'summon', x:drone.x, y:drone.y });
          }
          break;
        }
      }
    }
  }

  function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }

  /* ---------- Хелперы ---------- */
  function tierOfStage(stageIdx /*1..12*/) {
    return [0,0,1,1,2,2,3,3,4,4,5,5][stageIdx-1];
  }
  function actOfStage(stageIdx){ return TIERS[tierOfStage(stageIdx)].act; }
  function buildEnemySquad(stageIdx, opts={}) {
    const S = STAGES[stageIdx-1];
    const tier = tierOfStage(stageIdx);
    const units = [];
    for (const f of S.foes) {
      const t = f.tier ?? tier;
      const u = makeUnit(f.r, t, f.lvl || 1, 'e', { m:f.m, lane: units.length % 3, row: ROLES[f.r].row });
      units.push(u);
    }
    if (S.boss) {
      const b = makeBoss(S.boss, { side:'e', m: 1 });
      b.lane = 1; b.y = ARENA.laneY[1];
      units.push(b);
    }
    // расставить по линиям аккуратно: фронт/тыл
    assignLanes(units);
    return units;
  }
  function assignLanes(units) {
    const laneOf = (i) => [0,2,1][i % 3];
    // фронтовые в разные линии, затем тыловые
    const front = units.filter(u=>u.row==='front' && !u.boss);
    const back = units.filter(u=>u.row==='back');
    const boss = units.find(u=>u.boss);
    front.forEach((u,i)=>{ u.lane = laneOf(i); u.y = ARENA.laneY[u.lane]; });
    back.forEach((u,i)=>{ u.lane = laneOf(i+1); u.y = ARENA.laneY[u.lane]; });
    if (boss) { boss.lane = 1; boss.y = ARENA.laneY[1]; }
  }

  function runHeadless(teamP, teamE, opts={}) {
    const sim = new Sim(teamP, teamE, { onEvent: opts.onEvent });
    const dt = 0.1;
    let guard = 0;
    while (!sim.done && guard++ < 3000) sim.step(dt);
    return sim;
  }

  return {
    TIERS, TIER_MULT, LVL_MULT, ROLES, ROLE_ORDER, ARTIFACTS, BOSSES, STAGES,
    ARENA, makeUnit, makeBoss, Sim, runHeadless, tierOfStage, actOfStage,
    buildEnemySquad, artifactMods,
  };
})();
return Engine;
});
