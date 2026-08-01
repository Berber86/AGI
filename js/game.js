/* ============================================================
   game.js — логика игры и UI-слой «ЭПОХИ»
   Состояние партии, экраны (меню/расстановка/бой/магазин),
   оверлеи, магазин, эволюция, артефакты, финалы.
   Отрисовка боя делегируется BattleRender, звук — AudioFX.
   ============================================================ */
(() => {
  const E = window.Engine;
  const BR = window.BattleRender;
  const AF = window.AudioFX;

  /* ================== СОСТОЯНИЕ ПАРТИИ ================== */
  const R = {
    screen: 'menu',
    stage: 1,
    gold: 0,
    attemptsLeft: 3,
    squad: [],
    bench: [],
    placed: [],
    artifacts: [],
    snapshot: null,
    stats: { stageLosses: 0, startTime: 0 },
  };

  const $ = id => document.getElementById(id);

  /* ================== ИКОНКИ (SVG) ================== */
  const ROLE_ICONS = {
    guard: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.2 9.2-8 11C7.2 20.2 4 16 4 11V5z" fill="#4a90d9"/><path d="M12 6v8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 9l7 2.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
    fighter: '<svg viewBox="0 0 24 24"><path d="M4 20L14 10l-2-2L2 18z" fill="#e2574c"/><path d="M13.5 9.5L21 2l1 1-7.5 7.5z" fill="#c8ccd4"/><rect x="11" y="7" width="3" height="5" rx="1" fill="#8a4a2a" transform="rotate(-45 12.5 9.5)"/></svg>',
    archer: '<svg viewBox="0 0 24 24"><path d="M3 15a9 9 0 0 1 18 0" fill="none" stroke="#58b368" stroke-width="2.4" stroke-linecap="round"/><path d="M3 15h18" stroke="#f2f2ea" stroke-width="1.6"/><path d="M21 15l3-6" stroke="#8a6a3a" stroke-width="2" stroke-linecap="round"/></svg>',
    artillery: '<svg viewBox="0 0 24 24"><circle cx="15" cy="12" r="8" fill="#3a3f4a"/><path d="M17 6l4-3" stroke="#d8a34a" stroke-width="2.4" stroke-linecap="round"/><circle cx="7" cy="7" r="2.6" fill="#ff9d3d"/></svg>',
    healer: '<svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#e8a33d" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="#ffd488" stroke-width="1.6"/></svg>',
    scout: '<svg viewBox="0 0 24 24"><path d="M6 20l8-8-2-2-8 8z" fill="#2aa8a0"/><path d="M13 13l6-8-2-2-8 6z" fill="#c8ccd4"/><path d="M5 21l-3-3" stroke="#8a4a2a" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  const ROLE_ICON_COLORS = {
    guard: '#4a90d9', fighter: '#e2574c', archer: '#58b368',
    artillery: '#a05bd6', healer: '#e8a33d', scout: '#2aa8a0',
  };
  const ART_ICONS = {
    totem: '🗿', fire: '🔥', drum: '🥁', potion: '⚗️', edge: '🗡️', chariot: '🎖️',
  };
  const ERA_ICONS = {
    stone: '🪨', antiquity: '🏛️', 'early-med': '🛡️', 'high-med': '⚔️',
    industrial: '💣', future: '🚀',
  };

  /* ================== ЮНИТЫ ИГРОКА ================== */
  function playerUnit(role, tier, lvl, opts = {}) {
    const u = E.makeUnit(role, tier, lvl, 'p', { artifacts: R.artifacts, lane: 1 });
    u.lane = opts.lane ?? 1; u.row = opts.row ?? E.ROLES[role].row;
    return u;
  }
  function squadCap() {
    const base = [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6][Math.min(R.stage - 1, 11)];
    return Math.min(base + (R.artifacts.includes('chariot') ? 1 : 0), 6);
  }
  function unitStatsText(u) {
    return `<span class="st-hp">❤ ${u.maxHp}</span> · <span class="st-atk">⚔ ${u.atk}</span> · <span class="st-asp">⏱ ${u.iv.toFixed(1)}с</span>${u.crit > 0.1 ? ` · <span class="st-crit">крит ${Math.round(u.crit * 100)}%</span>` : ''}`;
  }
  function unitAbilText(roleOrBoss) {
    if (roleOrBoss.startsWith('boss:')) {
      const b = E.BOSSES[roleOrBoss.slice(5)];
      return `✦ ${b.abil.name} — ${b.abil.desc}`;
    }
    const a = E.ROLES[roleOrBoss].abil;
    return `✦ ${a.name} — ${a.desc}`;
  }
  function roleIconSvg(role, size = 26) {
    return `<span class="r-icon" style="width:${size}px;height:${size}px">${ROLE_ICONS[role] || ''}</span>`;
  }

  /* ================== НОВАЯ ПАРТИЯ ================== */
  function newRun() {
    R.stage = 1; R.gold = 0; R.attemptsLeft = 3;
    R.artifacts = [];
    R.squad = [
      playerUnit('guard', 0, 1, { lane: 0, row: 0 }),
      playerUnit('fighter', 0, 1, { lane: 1, row: 0 }),
      playerUnit('archer', 0, 1, { lane: 2, row: 0 }),
    ];
    R.bench = [];
    R.stats = { stageLosses: 0, startTime: Date.now(), wins: 0 };
    R.placed = [];
    placeAuto();
    AF.startMusic(); // первый клик — можно включать звук
    showScreen('roster');
  }

  /* ================== ЭКРАНЫ ================== */
  function showScreen(name) {
    R.screen = name;
    $('screen-menu').classList.toggle('hidden', name !== 'menu');
    $('screen-roster').classList.toggle('hidden', name !== 'roster');
    $('screen-battle').classList.toggle('hidden', name !== 'battle');
    $('screen-shop').classList.toggle('hidden', name !== 'shop');
    $('topbar').classList.toggle('hidden', name === 'menu');
    if (name === 'roster') renderRoster();
    if (name === 'shop') renderShop();
    if (name === 'battle') startBattle();
    updateTopbar();
  }

  function updateTopbar() {
    $('chpStage').innerHTML = `Этап <b>${R.stage}/12</b>`;
    const t = E.tierOfStage(R.stage);
    AF.setAct(E.TIERS[t].act); // музыка по актам
    $('chpTier').innerHTML = `${ERA_ICONS[E.TIERS[t].id] || ''} ${E.TIERS[t].name}`;
    $('chpAct').innerHTML = `Акт ${['', 'I', 'II', 'III'][E.TIERS[t].act]} · ${['', 'Древний мир', 'Средневековье', 'Новое время и будущее'][E.TIERS[t].act]}`;
    $('chpGold').textContent = R.gold;
    $('chpSquad').innerHTML = `Отряд <b>${R.squad.length}</b>/<b>${squadCap()}</b>`;
    $('chpAttempts').innerHTML = `Попытки <b>${R.attemptsLeft}/3</b>`;
    $('chpAttempts').className = 'chip' + (R.attemptsLeft === 1 ? ' chip-bad' : '');
    $('chpArtifacts').innerHTML = R.artifacts.length
      ? R.artifacts.map(a => `${ART_ICONS[a] || '✨'} ${E.ARTIFACTS[a].name}`).join(' · ')
      : '';
  }

  /* ================== РАССТАНОВКА ================== */
  function placeAuto() {
    const units = R.squad.concat(R.bench);
    const front = units.filter(u => E.ROLES[u.role] && E.ROLES[u.role].row === 'front');
    const back = units.filter(u => E.ROLES[u.role] && E.ROLES[u.role].row === 'back');
    const order = front.concat(back).slice(0, squadCap());
    R.placed = [];
    order.forEach((u, i) => {
      R.placed.push({ id: u.id, lane: i % 3, row: E.ROLES[u.role].row === 'front' ? 0 : 1 });
    });
  }

  function renderRoster() {
    const tier = E.tierOfStage(R.stage);
    const S = E.STAGES[R.stage - 1];
    $('rstAct').textContent = `Акт ${['', 'I', 'II', 'III'][E.TIERS[tier].act]} · ${['', 'Древний мир', 'Средневековье', 'Новое время и будущее'][E.TIERS[tier].act]}`;
    $('rstStage').textContent = `Этап ${R.stage} · ${S.name}`;
    $('rstTier').innerHTML = `${ERA_ICONS[E.TIERS[tier].id] || ''} Эпоха: ${E.TIERS[tier].name}${S.boss ? ' · <span class="boss-tag">⚠ БОСС</span>' : ''}`;
    renderEnemySummary(S);

    const grid = $('rstGrid');
    grid.innerHTML = '';
    ['Верх', 'Центр', 'Низ'].forEach((ln, lane) => {
      const laneDiv = document.createElement('div');
      laneDiv.className = 'lane';
      const label = document.createElement('div');
      label.className = 'lane-label';
      label.textContent = ln;
      laneDiv.appendChild(label);
      [0, 1].forEach(row => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        const placed = R.placed.find(p => p.lane === lane && p.row === row);
        if (placed) {
          const u = R.squad.find(x => x.id === placed.id) || R.bench.find(x => x.id === placed.id);
          if (u) {
            slot.classList.add('occupied');
            const cls = u.row === 0 ? 'slot-front' : 'slot-back';
            slot.classList.add(cls);
            slot.innerHTML = `
              <span class="slot-lvl">ур.${u.lvl}</span>
              ${roleIconSvg(u.role, 30)}
              <span class="s-name">${u.name}</span>
              <span class="s-role">${E.ROLES[u.role].name}</span>`;
            slot.title = unitAbilText(u.role);
          }
        } else {
          slot.innerHTML = `<span class="s-empty">${row === 0 ? 'перед' : 'тыл'}</span>`;
        }
        slot.onclick = () => {
          if (placed) {
            R.placed = R.placed.filter(p => !(p.lane === lane && p.row === row));
            AF.play('ui.click');
          } else {
            openPicker(lane, row);
          }
          renderRoster();
        };
        laneDiv.appendChild(slot);
      });
      grid.appendChild(laneDiv);
    });

    const benchEl = $('rstBench');
    benchEl.innerHTML = '';
    $('rstBenchEmpty').classList.toggle('hidden', R.bench.length > 0);
    for (const u of R.bench) {
      const c = unitCard(u, { small: true });
      c.onclick = () => {
        const placed = R.placed.find(p => p.id === u.id);
        if (placed) R.placed = R.placed.filter(p => p.id !== u.id);
        else autoPlace(u);
        AF.play('ui.click');
        renderRoster();
      };
      benchEl.appendChild(c);
    }
  }

  /* Сводка врагов этапа (решение Критика: бои не вслепую) */
  function renderEnemySummary(S) {
    const counts = {};
    for (const f of S.foes) counts[f.r] = (counts[f.r] || 0) + 1;
    const el = $('rstEnemySummary');
    const parts = Object.keys(counts).map(r => {
      const n = counts[r];
      return `<span class="es-item" title="${E.ROLES[r].name}">${roleIconSvg(r, 18)} ×${n}</span>`;
    });
    if (S.boss) {
      parts.push(`<span class="es-item es-boss" title="${E.BOSSES[S.boss].abil.name} — ${E.BOSSES[S.boss].abil.desc}">${roleIconSvg('fighter', 20)} ${E.BOSSES[S.boss].name}</span>`);
    }
    el.innerHTML = `<span class="es-label">Враги:</span> ${parts.join('')}`;
  }

  function autoPlace(u) {
    if (R.placed.some(p => p.id === u.id)) { R.placed = R.placed.filter(p => p.id !== u.id); return; }
    if (R.placed.length >= squadCap()) { AF.play('ui.error'); return; }
    const lane = R.placed.length % 3, row = E.ROLES[u.role].row === 'front' ? 0 : 1;
    R.placed.push({ id: u.id, lane, row });
  }

  function openPicker(lane, row) {
    const free = R.squad.concat(R.bench).filter(u => !R.placed.some(p => p.id === u.id));
    const picker = document.createElement('div');
    picker.className = 'panel';
    picker.innerHTML = `<div class="muted" style="margin-bottom:10px">Поставить в линию <b>${['Верх', 'Центр', 'Низ'][lane]}</b>, ряд <b>${row === 0 ? 'перед' : 'тыл'}</b>:</div>`;
    const cards = document.createElement('div');
    cards.className = 'picker';
    if (!free.length) cards.innerHTML = '<div class="muted">Нет свободных юнитов</div>';
    for (const u of free) {
      const c = unitCard(u, {});
      c.onclick = () => {
        if (R.placed.length >= squadCap()) { AF.play('ui.error'); return; }
        R.placed.push({ id: u.id, lane, row });
        AF.play('ui.click');
        closeOverlay();
        renderRoster();
      };
      cards.appendChild(c);
    }
    picker.appendChild(cards);
    const cancel = document.createElement('div');
    cancel.className = 'center';
    cancel.style.marginTop = '12px';
    cancel.innerHTML = '<button class="btn">Отмена</button>';
    cancel.onclick = closeOverlay;
    picker.appendChild(cancel);
    showOverlay('', picker, null, null);
  }

  function unitCard(u, opts = {}) {
    const card = document.createElement('div');
    card.className = 'ucard' + (opts.small ? ' ucard-small' : '');
    const t = E.TIERS[u.tier];
    card.innerHTML = `
      <div class="ucard-top">
        ${roleIconSvg(u.role, opts.small ? 22 : 28)}
        <span class="era-tag">${ERA_ICONS[t.id] || ''} ${t.name}</span>
      </div>
      <div class="u-name">${u.name}</div>
      <div class="u-role">${E.ROLES[u.role].name} · ур.${u.lvl}${u.lvl > 1 ? '<span class="lvl-pips">' + '✚'.repeat(u.lvl - 1) + '</span>' : ''}</div>
      <div class="u-stats">${unitStatsText(u)}</div>`;
    return card;
  }

  /* ================== БОЙ ================== */
  const canvas = $('battleCanvas');
  BR.setup(canvas);
  let battleSim = null, battleUnits = null;
  let battleSpeed = 1, battleAccum = 0, battleInstant = false;
  let battleEffects = [];
  let battleLastNow = 0;

  function startBattle() {
    const placedUnits = [];
    for (const p of R.placed) {
      const u = R.squad.find(x => x.id === p.id) || R.bench.find(x => x.id === p.id);
      if (u) placedUnits.push(u);
    }
    for (const u of R.squad.concat(R.bench)) u.hp = u.maxHp;

    const tier = E.tierOfStage(R.stage);
    const enemies = E.buildEnemySquad(R.stage);
    battleUnits = { p: placedUnits, e: enemies };
    battleSpeed = 1; battleAccum = 0; battleInstant = false;
    battleEffects = [];
    $('vsPlayer').textContent = `⚔ Ваш отряд (${placedUnits.length})`;
    $('vsEnemy').textContent = `Враги (${enemies.length})${E.STAGES[R.stage - 1].boss ? ' · ⚠ БОСС' : ''}`;
    $('vsTier').textContent = `${E.TIERS[tier].name} · Этап ${R.stage}/12`;
    $('battleMsg').classList.add('hidden');
    battleSim = new E.Sim(placedUnits, enemies, {
      onEvent: (ev) => {
        battleEffects.push(Object.assign({ ttl: 0.6, born: performance.now() }, ev));
        if (ev.type === 'dmg') AF.play(ev.crit ? 'battle.crit' : 'battle.hit');
        else if (ev.type === 'abil') AF.play(ev.side === 'e' ? 'battle.boss' : 'battle.ability');
        else if (ev.type === 'die') AF.play('battle.die');
      },
    });
    requestAnimationFrame(battleLoop);
  }

  function battleLoop(now) {
    if (R.screen !== 'battle' || !battleSim) return;
    const dtReal = Math.min(0.1, (now - (battleLastNow || now)) / 1000);
    battleLastNow = now;
    if (!battleInstant) {
      battleAccum += dtReal * battleSpeed;
      while (battleAccum >= 0.1 && !battleSim.done) { battleSim.step(0.1); battleAccum -= 0.1; }
    } else {
      while (!battleSim.done) battleSim.step(0.1);
    }
    BR.draw(canvas, battleSim, battleEffects, now, E.tierOfStage(R.stage));
    if (battleSim.done) {
      battleEffects = [];
      showBattleResult();
      return;
    }
    requestAnimationFrame(battleLoop);
  }

  /* --- результат боя --- */
  function showBattleResult() {
    const msg = $('battleMsg');
    const big = $('battleMsgBig'), sub = $('battleMsgSub');
    msg.classList.remove('hidden');
    msg.querySelectorAll('.btn').forEach(b => b.remove());
    if (battleSim.winner === 'p') {
      AF.play('battle.win');
      big.textContent = 'ПОБЕДА';
      big.style.color = 'var(--good)';
      sub.innerHTML = `Этап ${R.stage} пройден. Золото: <b>+${stageReward()}</b>${E.STAGES[R.stage - 1].boss ? ' · Плюс награда босса' : ''}`;
      const btn = document.createElement('button');
      btn.className = 'btn primary btn-lg';
      btn.textContent = 'ДАЛЬШЕ →';
      btn.onclick = () => { btn.remove(); onStageWin(); };
      msg.appendChild(btn);
    } else {
      AF.play('battle.lose');
      big.textContent = 'ПОРАЖЕНИЕ';
      big.style.color = 'var(--bad)';
      R.attemptsLeft--;
      R.stats.stageLosses++;
      sub.innerHTML = R.attemptsLeft > 0
        ? `Этап переигрывается с начала. Осталось попыток: <b>${R.attemptsLeft}</b>`
        : `Попытки закончились. Партия окончена.`;
      const btn = document.createElement('button');
      btn.className = 'btn primary btn-lg';
      btn.textContent = R.attemptsLeft > 0 ? '↺ ПЕРЕИГРАТЬ ЭТАП' : 'ИТОГИ ПАРТИИ';
      btn.onclick = () => { btn.remove(); if (R.attemptsLeft > 0) retryStage(); else showDefeat(); };
      msg.appendChild(btn);
    }
    updateTopbar();
  }

  function stageReward() { return 12 + R.stage + (E.STAGES[R.stage - 1].boss ? 8 : 0); }

  function onStageWin() {
    const reward = stageReward();
    R.gold += reward;
    R.stats.wins++;
    const S = E.STAGES[R.stage - 1];
    if (S.boss) {
      showBossReward(() => afterStageReward());
    } else {
      afterStageReward();
    }
  }
  function afterStageReward() {
    R.attemptsLeft = 3;
    if ([2, 4, 6, 8, 10].includes(R.stage)) {
      evolveArmy();
    } else if (R.stage >= 12) {
      showVictory();
    } else {
      showScreen('shop');
    }
  }

  /* --- эволюция армии --- */
  function evolveArmy() {
    const fromTier = E.tierOfStage(R.stage);
    const toTier = fromTier + 1;
    const rows = [];
    for (const u of R.squad.concat(R.bench)) {
      const oldName = u.name;
      u.tier = toTier;
      const nu = playerUnit(u.role, toTier, u.lvl);
      u.name = nu.name;
      u.maxHp = nu.maxHp; u.hp = nu.maxHp; u.atk = nu.atk;
      u.iv = nu.iv; u.rng = nu.rng; u.spd = nu.spd; u.crit = nu.crit; u.healMult = nu.healMult;
      rows.push({ from: oldName, to: u.name, role: E.ROLES[u.role].name });
    }
    AF.play('stage.evolve');
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="big">⏳ НОВАЯ ЭПОХА</div>
      <div class="sub">Эпоха сменяется: <b>${ERA_ICONS[E.TIERS[fromTier].id]} ${E.TIERS[fromTier].name}</b>
      → <b>${ERA_ICONS[E.TIERS[toTier].id]} ${E.TIERS[toTier].name}</b>.<br>
      Армия эволюционирует вместе с историей — новые имена, вооружение и сила.</div>
      <div class="evolve-list">${rows.map(r => `
        <div class="evolve-row"><span class="from">${r.role} · ${r.from}</span><span class="arrow">➜</span><span class="to">${r.to}</span></div>`).join('')}</div>`;
    showOverlay('', box, () => {
      if (R.stage >= 12) showVictory(); else showScreen('shop');
    });
  }

  /* --- награда босса --- */
  function showBossReward(onDone) {
    const pool = Object.keys(E.ARTIFACTS).filter(a => !R.artifacts.includes(a));
    const options = [];
    while (options.length < 3) {
      const a = pool[Math.floor(Math.random() * pool.length)];
      if (!options.includes(a)) options.push(a);
    }
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="big">⚜ БОСС ПОВЕРЖЕН</div>
      <div class="sub">Выберите артефакт эпохи — он усилит отряд до конца партии:</div>
      <div class="artifacts"></div>`;
    const wrap = box.querySelector('.artifacts');
    for (const id of options) {
      const a = E.ARTIFACTS[id];
      const card = document.createElement('div');
      card.className = 'acard';
      card.innerHTML = `<div class="a-ico">${ART_ICONS[id] || '✨'}</div>
        <div class="a-name">${a.name}</div><div class="a-desc">${a.desc}</div>`;
      card.onclick = () => {
        R.artifacts.push(id);
        for (const u of R.squad.concat(R.bench)) recalcUnit(u);
        AF.play('stage.artifact');
        closeOverlay(); onDone();
      };
      wrap.appendChild(card);
    }
    showOverlay('', box);
  }
  function recalcUnit(u) {
    const fresh = playerUnit(u.role, u.tier, u.lvl);
    u.maxHp = fresh.maxHp; u.hp = Math.min(u.hp, fresh.maxHp); u.atk = fresh.atk;
    u.iv = fresh.iv; u.rng = fresh.rng; u.spd = fresh.spd; u.crit = fresh.crit; u.healMult = fresh.healMult;
  }

  /* --- переигрывание --- */
  function retryStage() {
    if (R.snapshot) {
      R.squad = R.snapshot.squad.map(u => {
        const fresh = playerUnit(u.role, u.tier, u.lvl);
        return Object.assign(u, { hp: fresh.maxHp, maxHp: fresh.maxHp, atk: fresh.atk,
          iv: fresh.iv, rng: fresh.rng, spd: fresh.spd, crit: fresh.crit, healMult: fresh.healMult });
      });
      R.bench = R.snapshot.bench.slice();
      R.gold = R.snapshot.gold;
      R.placed = R.snapshot.placed.map(p => Object.assign({}, p));
    }
    showScreen('roster');
  }

  /* ================== МАГАЗИН ================== */
  function renderShop() {
    $('shpGold').textContent = R.gold;
    const tier = E.tierOfStage(R.stage + 1);
    const offers = [];
    const roles = E.ROLE_ORDER.slice();
    shuffle(roles);
    offers.push({ type: 'recruit', role: roles[0], cost: recruitCost(tier) });
    if (Math.random() < 0.5) offers.push({ type: 'recruit', role: roles[1], cost: recruitCost(tier) });
    else offers.push(upgradeOffer());
    if (Math.random() < 0.6) offers.push(upgradeOffer());
    else offers.push({ type: 'recruit', role: roles[2], cost: recruitCost(tier) });

    const wrap = $('shpCards');
    wrap.innerHTML = '';
    for (const off of offers) {
      const card = document.createElement('div');
      card.className = 'ucard shop-card';
      if (off.type === 'recruit') {
        const u = playerUnit(off.role, tier, 1);
        const afford = R.gold >= off.cost;
        const hasRoom = R.squad.length + R.bench.length < 6;
        card.classList.toggle('disabled', !afford || !hasRoom);
        card.innerHTML = `
          <div class="shop-badge badge-recruit">наём</div>
          <div class="cost">${off.cost} ⚜</div>
          ${roleIconSvg(u.role, 34)}
          <div class="u-name">${u.name}</div>
          <div class="u-role">${E.ROLES[u.role].name} · ${ERA_ICONS[E.TIERS[tier].id]} ${E.TIERS[tier].name}</div>
          <div class="u-stats">${unitStatsText(u)}</div>
          <div class="abil-note">${unitAbilText(u.role)}</div>`;
        card.onclick = () => {
          if (!afford) { AF.play('ui.error'); flash('Не хватает золота'); return; }
          if (!hasRoom) { AF.play('ui.error'); flash('Отряд и скамейка полны (макс. 6)'); return; }
          R.gold -= off.cost;
          R.bench.push(playerUnit(off.role, tier, 1));
          AF.play('ui.buy');
          flash(`Нанят: ${E.ROLES[off.role].names[tier]}`);
          renderShop(); updateTopbar();
        };
      } else {
        const u = off.unit;
        const cost = upgradeCost(u.lvl);
        const afford = R.gold >= cost;
        card.classList.toggle('disabled', !afford || u.lvl >= 4);
        card.innerHTML = `
          <div class="shop-badge badge-upgrade">прокачка</div>
          <div class="cost">${cost} ⚜</div>
          ${roleIconSvg(u.role, 34)}
          <div class="u-name">${u.name}</div>
          <div class="u-role">${E.ROLES[u.role].name} · ур.${u.lvl} → <b>ур.${u.lvl + 1}</b></div>
          <div class="u-stats">${unitStatsText(u)}</div>`;
        card.onclick = () => {
          if (u.lvl >= 4) return;
          if (!afford) { AF.play('ui.error'); flash('Не хватает золота'); return; }
          R.gold -= cost;
          u.lvl++;
          recalcUnit(u);
          AF.play('ui.buy');
          flash(`Прокачано: ${u.name} до ур.${u.lvl}`);
          renderShop(); updateTopbar();
        };
      }
      wrap.appendChild(card);
    }
  }
  function recruitCost(tier) { return 12 + 5 * tier; }
  function upgradeCost(lvl) { return 10 + 6 * lvl; }
  function upgradeOffer() {
    const pool = R.squad.concat(R.bench).filter(u => u.lvl < 4);
    if (!pool.length) return { type: 'recruit', role: E.ROLE_ORDER[Math.floor(Math.random() * E.ROLE_ORDER.length)], cost: recruitCost(E.tierOfStage(R.stage + 1)) };
    return { type: 'upgrade', unit: pool[Math.floor(Math.random() * pool.length)] };
  }
  function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }

  /* ================== ФИНАЛЫ ================== */
  function showVictory() {
    AF.play('stage.victory');
    const minutes = Math.round((Date.now() - R.stats.startTime) / 6000) / 10;
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="big big-green">🏆 ИМПЕРИЯ БУДУЩЕГО</div>
      <div class="sub">Нейро-колосс повержен. Армия прошла путь от каменного топора до плазмы —
      история завершилась там, где начинается будущее.</div>
      <div class="panel stats-panel">
        <div class="stat-line"><span>Этапов пройдено</span><b>12 / 12</b></div>
        <div class="stat-line"><span>Потеряно попыток</span><b>${R.stats.stageLosses}</b></div>
        <div class="stat-line"><span>Время партии</span><b>${minutes} мин</b></div>
        <div class="stat-line"><span>Артефактов</span><b>${R.artifacts.length} ✨</b></div>
      </div>`;
    showOverlay('', box, newRun, '⚔ НОВАЯ ПАРТИЯ');
  }
  function showDefeat() {
    AF.play('stage.defeat');
    const minutes = Math.round((Date.now() - R.stats.startTime) / 6000) / 10;
    const box = document.createElement('div');
    box.innerHTML = `
      <div class="big big-red">АРМИЯ ПАЛА</div>
      <div class="sub">История не дождалась армии на этапе <b>${R.stage}</b> — эпоха
      ${E.TIERS[E.tierOfStage(R.stage)].name} оказалась сильнее.</div>
      <div class="panel stats-panel">
        <div class="stat-line"><span>Этапов пройдено</span><b>${R.stats.wins} / 12</b></div>
        <div class="stat-line"><span>Потеряно попыток</span><b>${R.stats.stageLosses}</b></div>
        <div class="stat-line"><span>Время партии</span><b>${minutes} мин</b></div>
        <div class="stat-line"><span>Артефактов</span><b>${R.artifacts.length} ✨</b></div>
      </div>`;
    showOverlay('', box, newRun, '⚔ НОВАЯ ПАРТИЯ');
  }

  /* ================== ОВЕРЛЕЙ ================== */
  function showOverlay(html, node, onClose, btnLabel) {
    const ov = $('overlay');
    const box = $('overlayBox');
    box.innerHTML = '';
    if (html) box.innerHTML = html;
    if (node) box.appendChild(node);
    if (btnLabel !== null) {
      const foot = document.createElement('div');
      foot.className = 'center';
      foot.style.marginTop = '18px';
      const btn = document.createElement('button');
      btn.className = 'btn primary btn-lg';
      btn.textContent = btnLabel || 'Продолжить';
      btn.onclick = () => { closeOverlay(); if (onClose) onClose(); };
      foot.appendChild(btn);
      box.appendChild(foot);
    }
    ov.classList.remove('hidden');
  }
  function closeOverlay() { $('overlay').classList.add('hidden'); $('overlayBox').innerHTML = ''; }
  let flashTimer = null;
  function flash(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    document.body.appendChild(el);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => el.remove(), 1700);
  }

  /* ================== ЗВУК ================== */
  function updateSoundUI() {
    const on = !AF.isMuted();
    const b = $('btnSound'); if (b) b.textContent = on ? '🔊 Звук: вкл' : '🔇 Звук: выкл';
    const t = $('topSound'); if (t) t.textContent = on ? '🔊' : '🔇';
  }
  $('btnSound').onclick = () => { AF.toggle(); AF.play('ui.click'); updateSoundUI(); };
  $('topSound').onclick = () => { AF.toggle(); AF.play('ui.click'); updateSoundUI(); };

  /* ================== СОБЫТИЯ ================== */
  $('btnStart').onclick = () => { AF.play('ui.click'); newRun(); };
  $('btnFight').onclick = () => {
    AF.play('ui.click');
    const free = R.squad.concat(R.bench).filter(u => !R.placed.some(p => p.id === u.id));
    for (const u of free) autoPlace(u);
    if (!R.placed.length) { AF.play('ui.error'); flash('Расставьте хотя бы один отряд!'); return; }
    R.snapshot = {
      squad: R.squad.slice(), bench: R.bench.slice(), gold: R.gold,
      placed: R.placed.map(p => Object.assign({}, p)),
    };
    showScreen('battle');
  };
  $('btnAuto').onclick = () => { AF.play('ui.click'); placeAuto(); renderRoster(); };
  $('btnSkip').onclick = () => {
    AF.play('ui.click');
    if (R.stage >= 12) showVictory();
    else { R.stage++; R.attemptsLeft = 3; showScreen('roster'); }
  };
  $('btnSpeed1').onclick = () => { battleSpeed = 1; $('btnSpeed1').classList.add('primary'); $('btnSpeed2').classList.remove('primary'); };
  $('btnSpeed2').onclick = () => { battleSpeed = 2; $('btnSpeed2').classList.add('primary'); $('btnSpeed1').classList.remove('primary'); };
  $('btnInstant').onclick = () => { battleInstant = true; };
  $('btnSpeed1').classList.add('primary');

  // меню: лента эпох
  const strip = $('menuEpochs');
  strip.innerHTML = E.TIERS.map(t =>
    `<div class="era-node"><span class="era-ico">${ERA_ICONS[t.id]}</span><span>${t.name}</span></div>`
  ).join('<span class="era-arrow">→</span>');

  updateTopbar();
  AF.init();
  updateSoundUI();
})();
