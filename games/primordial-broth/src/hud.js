// hud.js — DOM HUD. Mirrors the reference layout: objective panel top-left,
// clock and buttons top-right, growth + health + parts along the bottom, minimap right.

import { PART_ORDER, PARTS, STAGES, WORLD, SIZE_BY_STAGE, BIOMASS_TO_STAGE } from './config.js';

const $ = (id) => document.getElementById(id);

export function createHud() {
  const el = {
    gen: $('hud-gen'),
    stage: $('hud-stage'),
    growthFill: $('hud-growth-fill'),
    growthText: $('hud-growth-text'),
    dna: $('hud-dna'),
    hint: $('hud-hint'),
    clock: $('hud-clock'),
    healthFill: $('hud-health-fill'),
    healthText: $('hud-health-text'),
    staminaFill: $('hud-stamina-fill'),
    slots: $('hud-slots'),
    minimap: $('hud-minimap'),
    toast: $('hud-toast'),
    objective: $('hud-objective'),
    partsPanel: $('parts-panel'),
  };

  // part slots: 8 like the reference strip
  const slots = [];
  if (el.slots) {
    for (let i = 0; i < 8; i += 1) {
      const d = document.createElement('div');
      d.className = 'slot';
      d.innerHTML = '<span class="slot-icon">·</span>';
      el.slots.appendChild(d);
      slots.push(d);
    }
  }

  let toastTimer = 0;

  function renderSlots(player) {
    const owned = PART_ORDER.filter((id) => player.parts[id]);
    for (let i = 0; i < slots.length; i += 1) {
      const slot = slots[i];
      const id = owned[i];
      if (id) {
        slot.classList.add('filled');
        slot.style.setProperty('--part-color', PARTS[id].color);
        slot.innerHTML = `<span class="slot-icon">${PARTS[id].icon}</span>`;
        slot.title = PARTS[id].name;
      } else {
        slot.classList.remove('filled');
        slot.innerHTML = '<span class="slot-icon">·</span>';
        slot.title = 'Пустой слот';
      }
    }
  }

  function formatClock(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return {
    el,
    update(game) {
      const { player, run } = game;
      if (el.gen) el.gen.textContent = String(game.generation);
      if (el.stage) el.stage.textContent = `${player.stage}/${STAGES}`;

      const lo = BIOMASS_TO_STAGE[player.stage - 1] ?? 0;
      const hi = BIOMASS_TO_STAGE[Math.min(STAGES - 1, player.stage)] ?? lo + 1;
      const pct = player.stage >= STAGES ? 1 : Math.max(0, Math.min(1, (run.biomass - lo) / Math.max(1, hi - lo)));
      if (el.growthFill) el.growthFill.style.width = `${(pct * 100).toFixed(1)}%`;
      if (el.growthText) el.growthText.textContent = player.stage >= STAGES ? 'максимум' : `${Math.max(0, Math.ceil(hi - run.biomass))} до роста`;

      if (el.dna) el.dna.textContent = String(Math.floor(run.dna));
      if (el.clock) el.clock.textContent = formatClock(run.time);

      const hpPct = Math.max(0, player.hp / player.maxHp);
      if (el.healthFill) el.healthFill.style.width = `${(hpPct * 100).toFixed(1)}%`;
      if (el.healthText) el.healthText.textContent = `${Math.ceil(player.hp)}/${Math.round(player.maxHp)}`;
      if (el.staminaFill) el.staminaFill.style.width = `${(player.stamina * 100).toFixed(1)}%`;

      renderSlots(player);

      if (el.hint) el.hint.textContent = game.hint;
      if (el.objective) el.objective.textContent = game.objective;
    },
    toast(text, ms = 2400) {
      if (!el.toast) return;
      el.toast.textContent = text;
      el.toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.toast.classList.remove('show'), ms);
    },
    drawMinimap(game) {
      const cv = el.minimap;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      const w = cv.width;
      const h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const sx = w / WORLD.w;
      const sy = h / WORLD.h;

      // water
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, 'rgba(10,40,80,0.85)');
      g.addColorStop(0.8, 'rgba(20,70,110,0.85)');
      g.addColorStop(1, 'rgba(150,220,190,0.9)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(230,250,200,0.85)';
      ctx.fillRect(WORLD.shoreStart * sx, 0, (WORLD.shoreEnd - WORLD.shoreStart) * sx, h);

      // food blips
      ctx.fillStyle = 'rgba(190,240,255,0.6)';
      for (const e of game.entities) {
        if (e.eaten) continue;
        if (e.kind === 'plankton' || e.kind === 'crumb') {
          if ((e.id % 5) !== 0) continue;
          ctx.fillRect(e.x * sx, e.y * sy, 1, 1);
        }
      }
      for (const e of game.entities) {
        if (e.eaten) continue;
        const hostile = e.kind === 'hunter' || e.kind === 'spore';
        if (e.kind === 'hunter') ctx.fillStyle = 'rgba(255,120,90,0.95)';
        else if (e.kind === 'spore') ctx.fillStyle = 'rgba(190,140,255,0.9)';
        else if (e.kind === 'grazer') ctx.fillStyle = 'rgba(160,230,210,0.95)';
        else continue;
        const r = Math.max(1.4, e.radius * sx * 1.4);
        ctx.beginPath();
        ctx.arc(e.x * sx, e.y * sy, r, 0, Math.PI * 2);
        ctx.fill();
        void hostile;
      }

      // player + view cone
      const px = game.player.x * sx;
      const py = game.player.y * sy;
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(px, py, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,209,102,0.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(game.player.heading) * 9, py + Math.sin(game.player.heading) * 9);
      ctx.stroke();
    },
    showScreen(id) {
      ['screen-start', 'screen-mutation', 'screen-win', 'screen-pause'].forEach((s) => {
        const node = $(s);
        if (!node) return;
        node.classList.toggle('visible', s === id);
      });
    },
    hideScreens() { this.showScreen(null); },
    renderMutation(choices, onPick) {
      const wrap = $('mutation-cards');
      if (!wrap) return;
      wrap.innerHTML = '';
      choices.forEach((id, index) => {
        const def = PARTS[id];
        const card = document.createElement('button');
        card.className = 'mut-card';
        card.style.setProperty('--card-color', def.color);
        card.innerHTML = `
          <span class="mut-icon">${def.icon}</span>
          <span class="mut-name">${def.name}</span>
          <span class="mut-blurb">${def.blurb}</span>
          <span class="mut-key">${index + 1}</span>
        `;
        card.addEventListener('click', () => onPick(id, index));
        wrap.appendChild(card);
      });
    },
    setMutationText(text) {
      const node = $('mutation-sub');
      if (node) node.textContent = text;
    },
    renderWin(stats) {
      const node = $('win-stats');
      if (!node) return;
      node.innerHTML = `
        <div><b>${stats.stage}/8</b><span>размер</span></div>
        <div><b>${stats.eaten}</b><span>съедено</span></div>
        <div><b>${stats.parts}</b><span>частей тела</span></div>
        <div><b>${stats.time}</b><span>время заплыва</span></div>
        <div><b>${stats.rank}</b><span>звание</span></div>
        <div><b>${stats.best ? 'да' : 'нет'}</b><span>личный рекорд</span></div>
      `;
    },
    partPanel() {
      // helper for the start screen: show the seven parts with icons
      if (!el.partsPanel) return;
      el.partsPanel.innerHTML = PART_ORDER.map((id) => {
        const p = PARTS[id];
        return `<span class="pp" style="--pp:${p.color}">${p.icon} ${p.name}</span>`;
      }).join('');
    },
    sizesByStage: SIZE_BY_STAGE,
  };
}
