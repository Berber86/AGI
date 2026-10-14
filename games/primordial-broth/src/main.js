// main.js — game loop, state machine, ecosystem manager and the automated test bridge.

import {
  GAME, WORLD, TUNING, STAGES, SIZE_BY_STAGE, BIOMASS_TO_STAGE, PALETTES,
} from './config.js';
import { makeRng } from './rng.js';
import { createCamera, updateCamera, cameraZoomForStage } from './camera.js';
import { createWater, drawVignette, drawWaterOverlay } from './water.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { createFx, burst, ring, popup, updateFx, drawFx, drawPopups, spawnRipple } from './fx.js';
import { createEntity, updateEntity, drawEntity, KIND, REWARD, HOSTILE } from './fauna.js';
import { drawCreature, createTrail, updateTrail, resetTrail, withWorldTransform } from './cell.js';
import { applyPart, recomputeStats, rollChoices, visibleParts } from './mutations.js';
import { createHud } from './hud.js';
import { bokehSprite, hexA } from './sprites.js';

// ------------------------------------------------------------------ setup

const params = new URLSearchParams(location.search);
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const hud = createHud();
const audio = createAudio();
const water = createWater(makeRng(9137));
const cam = createCamera();
const fx = createFx();

const view = { w: 1280, h: 720, dpr: 1 };
const GEN_TOTAL = TUNING.genTargetStages.length;

let quality = params.get('q') === 'low' ? 0.5 : 1;
const qualityLocked = params.get('q') === 'low' || params.get('q') === 'high';
let frameMs = 16.7;
let fps = 60;
let noHud = params.get('nohud') === '1';

const game = {
  mode: 'start',           // start | playing | mutation | won
  paused: false,
  generation: 1,
  hint: '',
  objective: '',
  entities: [],
  entityCounts: {},
  seed: Number(params.get('seed') || Date.now() % 100000),
  rng: makeRng(1),
  run: { time: 0, biomass: 0, dna: 0, eaten: 0, deaths: 0, best: false },
  damageFlash: 0,
  finalPhase: false,
  slowmo: 0,
  player: null,
  metrics: { fps: 60, frameMs: 16, entities: 0, drawn: 0, mode: 'start' },
};

function hpForStage(stage) {
  return TUNING.healthBase + TUNING.healthPerStage * stage;
}

function createPlayer(seed) {
  const rng = makeRng(seed);
  const p = {
    id: 0,
    kind: 'player',
    x: 420,
    y: WORLD.h / 2,
    vx: 0,
    vy: 0,
    heading: 0,
    radius: SIZE_BY_STAGE[0],
    stage: 1,
    hp: hpForStage(1),
    maxHp: hpForStage(1),
    palette: { body: PALETTES[0].body, belly: PALETTES[0].belly, stripe: PALETTES[0].stripe, fin: PALETTES[0].fin, iris: '#4a1f0c' },
    parts: {},
    stats: null,
    trail: createTrail(280),
    waveT: 0,
    flagellaPhase: 0,
    hitFlash: 0,
    mouthOpen: 0,
    invulnT: 0,
    stamina: 1,
    venomStacks: 0,
    shockCd: 1.4,
    dashing: false,
    bodyStretch: 3.15,
  };
  recomputeStats(p);
  void rng;
  return p;
}

function resetRun(seed = game.seed) {
  game.seed = seed;
  game.rng = makeRng(seed);
  game.player = createPlayer(seed);
  game.entities = [];
  game.entityCounts = {};
  game.run = { time: 0, biomass: 0, dna: 0, eaten: 0, deaths: 0, best: false };
  game.generation = 1;
  game.mode = 'playing';
  game.paused = false;
  game.finalPhase = false;
  game.damageFlash = 0;
  game.slowmo = 0;
  resetTrail(game.player.trail, game.player.x, game.player.y);
  cam.x = game.player.x;
  cam.y = game.player.y;
  cam.zoom = cameraZoomForStage(1);
  fx.parts.length = 0;
  fx.popups.length = 0;
  fx.rings.length = 0;
  seedPopulation();
  updateObjectives();
  hud.hideScreens();
  hud.toast('Съешьте планктон — вы растёте, пока вас не съели');
}

// ------------------------------------------------------------------ ecosystem

const TARGETS = [
  // per growth stage: how many of each kind should exist around the player
  { plankton: 230, crumb: 70, debris: 14, cell: 26, swarmling: 0, grazer: 5, hunter: 3, spore: 8 },
  { plankton: 245, crumb: 72, debris: 15, cell: 28, swarmling: 10, grazer: 6, hunter: 4, spore: 9 },
  { plankton: 260, crumb: 74, debris: 16, cell: 28, swarmling: 16, grazer: 6, hunter: 5, spore: 10 },
  { plankton: 270, crumb: 76, debris: 16, cell: 26, swarmling: 20, grazer: 5, hunter: 5, spore: 11 },
  { plankton: 285, crumb: 78, debris: 17, cell: 24, swarmling: 24, grazer: 4, hunter: 6, spore: 12 },
  { plankton: 295, crumb: 80, debris: 17, cell: 22, swarmling: 26, grazer: 4, hunter: 6, spore: 12 },
  { plankton: 305, crumb: 82, debris: 18, cell: 20, swarmling: 28, grazer: 3, hunter: 7, spore: 13 },
  { plankton: 315, crumb: 84, debris: 18, cell: 18, swarmling: 30, grazer: 3, hunter: 7, spore: 14 },
];

const SPAWN_MIN = 200;
const SPAWN_MAX = 900;
const DESPAWN = 1500;

function spawnPosition(rng, player) {
  const a = rng.range(0, Math.PI * 2);
  const d = rng.range(SPAWN_MIN, SPAWN_MAX);
  let x = player.x + Math.cos(a) * d;
  let y = player.y + Math.sin(a) * d;
  // keep spawns inside the world, biased to the direction of travel
  x = Math.max(60, Math.min(WORLD.w - 120, x));
  y = Math.max(60, Math.min(WORLD.h - 60, y));
  return { x, y };
}

function scaledRadius(kind, player, rng) {
  const st = player.stage;
  switch (kind) {
    case KIND.plankton: return rng.range(2.4, 11.5);
    case KIND.crumb: return rng.range(3.4, 9.5);
    case KIND.debris: return rng.range(14, 30) * (0.85 + st * 0.05);
    case KIND.cell: return rng.range(11, 24) * (0.65 + st * 0.13);
    case KIND.swarmling: return rng.range(7, 13) * (0.75 + st * 0.09);
    case KIND.grazer: return rng.range(34, 58) * (0.75 + st * 0.08);
    case KIND.hunter: return player.radius * rng.range(0.82, 1.34);
    case KIND.spore: return rng.range(9, 15) * (0.85 + st * 0.08);
    default: return 10;
  }
}

function spawnOne(kind, rng, player, at) {
  const pos = at || spawnPosition(rng, player);
  const clustered = !at && (kind === KIND.plankton || kind === KIND.crumb);
  if (clustered) {
    // plankton drifts in patches, the way real plankton blooms in the reference
    const patch = game.drift;
    if (patch && Math.hypot(pos.x - patch.x, pos.y - patch.y) > patch.r && rng.next() < 0.35) {
      game.drift = { x: pos.x, y: pos.y, r: rng.range(160, 420) };
    }
    const p = game.drift;
    if (p) {
      pos.x = p.x + (Math.random() * 2 - 1) * p.r;
      pos.y = p.y + (Math.random() * 2 - 1) * p.r;
      pos.x = Math.max(40, Math.min(WORLD.w - 60, pos.x));
      pos.y = Math.max(40, Math.min(WORLD.h - 40, pos.y));
    }
  }
  const e = createEntity(kind, pos.x, pos.y, rng, {
    radius: scaledRadius(kind, player, rng),
    stage: kind === KIND.hunter ? Math.min(6, 2 + Math.floor(player.stage * 0.7)) : undefined,
    palette: kind === KIND.plankton || kind === KIND.crumb ? undefined : rng.pick(PALETTES),
  });
  game.entities.push(e);
  game.entityCounts[kind] = (game.entityCounts[kind] || 0) + 1;
  return e;
}

function seedPopulation() {
  const rng = game.rng;
  const p = game.player;
  const targets = TARGETS[0];
  for (const kind of Object.keys(targets)) {
    const n = targets[kind];
    for (let i = 0; i < n; i += 1) {
      const r = rng.range(120, SPAWN_MAX);
      const a = rng.range(0, Math.PI * 2);
      const e = spawnOne(kind, rng, p, {
        x: Math.max(40, Math.min(WORLD.w - 80, p.x + Math.cos(a) * r)),
        y: Math.max(40, Math.min(WORLD.h - 40, p.y + Math.sin(a) * r)),
      });
      void e;
    }
  }
}

function managePopulation(dt) {
  game.popTimer = (game.popTimer || 0) + dt;
  if (game.popTimer < 0.35) return;
  game.popTimer = 0;
  const rng = game.rng;
  const p = game.player;
  const targets = TARGETS[Math.min(TARGETS.length - 1, p.stage - 1)];
  const final = game.finalPhase;
  for (const kind of Object.keys(targets)) {
    let want = targets[kind];
    if (final && (kind === KIND.plankton || kind === KIND.crumb || kind === KIND.cell)) want += 40;
    if (final && kind === KIND.hunter) want += 2;
    const have = game.entityCounts[kind] || 0;
    if (have < want) {
      const batch = Math.min(14, want - have);
      for (let i = 0; i < batch; i += 1) spawnOne(kind, rng, p);
    }
  }
  // recycle or drop distant entities
  for (const e of game.entities) {
    if (e.eaten) continue;
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d <= DESPAWN) continue;
    const recyclable = e.kind === KIND.plankton || e.kind === KIND.crumb;
    if (recyclable) {
      const pos = spawnPosition(rng, p);
      e.x = pos.x; e.y = pos.y; e.vx = 0; e.vy = 0;
      if (e.trail) e.trail.n = 0;
    } else {
      e.eaten = true;
      game.entityCounts[e.kind] = Math.max(0, (game.entityCounts[e.kind] || 1) - 1);
    }
  }
}

// ------------------------------------------------------------------ combat & growth

function biomassForStage(stage) {
  return BIOMASS_TO_STAGE[Math.max(0, Math.min(STAGES - 1, stage - 1))];
}

function stageForBiomass(biomass) {
  let s = 1;
  for (let i = 0; i < BIOMASS_TO_STAGE.length; i += 1) {
    if (biomass >= BIOMASS_TO_STAGE[i]) s = i + 1;
  }
  return Math.min(STAGES, s);
}

function addBiomass(amount, x, y, label) {
  game.run.biomass += amount;
  game.run.dna += amount * 2.5;
  if (x !== undefined) {
    burst(fx, x, y, { count: 6, color: '#ffe9a8', color2: '#bff6ff', speed: 120, size: 2.4, life: 0.5 });
    if (label) popup(fx, x, y - 6, label, '#ffe9a8', 14);
  }
  const target = stageForBiomass(game.run.biomass);
  if (target > game.player.stage && game.mode === 'playing') growTo(target);
  void target;
}

function growTo(stage) {
  const p = game.player;
  const prev = p.stage;
  p.stage = Math.min(STAGES, stage);
  p.radius = SIZE_BY_STAGE[p.stage - 1];
  const newMax = hpForStage(p.stage);
  p.hp = Math.min(newMax, p.hp + (newMax - p.maxHp) + 16);
  p.maxHp = newMax;
  p.bodyStretch = 3.15 - (p.stage - 1) * 0.06;

  ring(fx, p.x, p.y, p.radius * 5.4, '#cdf6ff', 3.2, 0.8);
  burst(fx, p.x, p.y, { count: 26, color: '#eaffff', color2: '#ffe9a8', speed: 240, size: 3.4, life: 0.9 });
  popup(fx, p.x, p.y - p.radius - 18, `Рост ${p.stage}/${STAGES}`, '#ffe9a8', 20);
  cam.shake = Math.min(1, cam.shake + 0.5);
  audio.grow();
  for (let i = 0; i < 6; i += 1) water.spawnBubble(p.x + (Math.random() * 2 - 1) * p.radius, p.y + (Math.random() * 2 - 1) * p.radius, 5 + Math.random() * 7);

  const targetStage = TUNING.genTargetStages[game.generation - 1];
  if (game.mode === 'playing' && targetStage !== undefined && p.stage >= targetStage) {
    openMutation();
  }
  void prev;
}

function hurtPlayer(amount, fromX, fromY, source) {
  const p = game.player;
  if (p.invulnT > 0) return;
  p.hp -= amount;
  p.hitFlash = 0.9;
  game.damageFlash = Math.min(1, game.damageFlash + amount / 55 + 0.14);
  cam.shake = Math.min(1, cam.shake + 0.35);
  audio.hurt();
  burst(fx, p.x, p.y, { count: 8, color: '#ffb0a0', color2: '#ffe1c0', speed: 150, size: 2.6, life: 0.5 });
  if (source) {
    // spikes retaliate and venom answers
    const st = p.stats;
    if (st.retaliate > 0) damageEntity(source, st.retaliate, true);
    if (st.venom > 0) source.venomT = 3.2;
  }
  if (fromX !== undefined) {
    const dx = p.x - fromX;
    const dy = p.y - fromY;
    const l = Math.hypot(dx, dy) || 1;
    p.vx += (dx / l) * 130;
    p.vy += (dy / l) * 130;
  }
  if (p.hp <= 0) softDefeat();
}

function softDefeat() {
  const p = game.player;
  game.run.deaths += 1;
  game.run.biomass = Math.max(biomassForStage(p.stage), game.run.biomass * TUNING.softDefeatKeepBiomass);
  p.hp = p.maxHp * 0.62;
  p.invulnT = TUNING.softDefeatInvulnS;
  game.damageFlash = 0.9;
  cam.shake = 1;
  audio.softDefeat();
  ring(fx, p.x, p.y, p.radius * 7, '#ff9f6a', 4, 1);
  burst(fx, p.x, p.y, { count: 30, color: '#ffd0a0', color2: '#ff8f6a', speed: 210, size: 3, life: 1 });
  popup(fx, p.x, p.y - p.radius - 22, 'Отдышался!', '#ffd7a8', 22);
  hud.toast('Вас чуть не съели — но части тела и большая часть добычи остались с вами');
  // push nearby predators away so the respawn is fair
  for (const e of game.entities) {
    if (e.eaten || !HOSTILE.has(e.kind)) continue;
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d < 700) {
      const dx = (e.x - p.x) / (d || 1);
      const dy = (e.y - p.y) / (d || 1);
      e.vx += dx * 260;
      e.vy += dy * 260;
      e.stunT = Math.max(e.stunT, 1.4);
    }
  }
}

function damageEntity(e, amount, silent = false) {
  e.hp -= amount;
  e.hitFlash = 1;
  if (!silent) burst(fx, e.x, e.y, { count: 5, color: '#ffd0b0', speed: 130, size: 2.2, life: 0.4 });
  if (e.hp <= 0 && !e.eaten) {
    eatEntity(e, true);
  }
}

function eatEntity(e, killed = false) {
  if (e.eaten) return;
  e.eaten = true;
  game.entityCounts[e.kind] = Math.max(0, (game.entityCounts[e.kind] || 1) - 1);
  const reward = (REWARD[e.kind] || 0.5) * (killed ? 1.15 : 1);
  game.run.eaten += 1;
  const pal = e.palette;
  burst(fx, e.x, e.y, {
    count: Math.min(30, 8 + Math.round(e.radius * 0.5)),
    color: pal.body,
    color2: pal.belly,
    speed: 150 + e.radius * 3,
    size: Math.max(1.6, e.radius * 0.16),
    life: 0.75,
  });
  burst(fx, e.x, e.y, { count: 3, color: pal.stripe, speed: 90, size: Math.max(1.4, e.radius * 0.12), life: 0.6, kind: 'morsel' });
  spawnRipple(fx, e.x, e.y, '#dff8ff', e.radius * 2.6);
  if (e.radius > 14) {
    audio.bigEat();
    cam.shake = Math.min(1, cam.shake + 0.22);
    popup(fx, e.x, e.y - e.radius, `+${reward.toFixed(1)}`, '#bff6ff', 16);
  } else {
    audio.eat(e.radius);
  }
  const p = game.player;
  p.mouthOpen = 1;
  addBiomass(reward, e.x, e.y);
  if (e.kind === KIND.hunter || e.kind === KIND.grazer) {
    popup(fx, e.x, e.y - e.radius - 12, e.kind === KIND.hunter ? 'Хищник съеден!' : 'Крупная добыча!', '#ffe9a8', 18);
  }
}

// ------------------------------------------------------------------ mutations

function openMutation() {
  game.mode = 'mutation';
  const choices = rollChoices(game.player.parts, game.rng, 3);
  game.mutationChoices = choices;
  audio.mutate();
  if (!choices.length) {
    game.mode = 'playing';
    advanceGeneration();
    return;
  }
  hud.setMutationText(choices.length
    ? `Поколение ${game.generation} завершено. Выберите одну часть тела — она останется с вами до конца заплыва.`
    : 'Все части уже собраны.');
  hud.renderMutation(choices, (id) => pickMutation(id));
  hud.showScreen('screen-mutation');
}

function pickMutation(id) {
  applyPart(game.player, id);
  hud.toast(`Мутация: ${id}`);
  hud.showScreen(null);
  game.mode = 'playing';
  audio.mutate();
  ring(fx, game.player.x, game.player.y, game.player.radius * 6.5, '#ffe9a8', 3, 0.8);
  burst(fx, game.player.x, game.player.y, { count: 22, color: '#ffe9a8', color2: '#ffd0ff', speed: 200, size: 3, life: 0.8 });
  advanceGeneration();
}

function advanceGeneration() {
  game.generation += 1;
  if (game.generation > GEN_TOTAL) {
    game.finalPhase = true;
    updateObjectives();
    hud.toast('Финальный спурт: дорастите до 8/8 и доплыть до отмели справа!');
    // dense plankton ahead plus a couple of bigger threats
    const rng = game.rng;
    const p = game.player;
    for (let i = 0; i < 60; i += 1) {
      const x = Math.min(WORLD.w - 120, p.x + rng.range(200, 1600));
      const y = Math.max(60, Math.min(WORLD.h - 60, p.y + rng.range(-900, 900)));
      spawnOne(rng.next() < 0.7 ? KIND.plankton : KIND.cell, rng, p, { x, y });
    }
    return;
  }
  updateObjectives();
}

function updateObjectives() {
  const p = game.player;
  const gen = game.generation;
  if (game.finalPhase) {
    game.hint = 'Финал: отмель на востоке. Ешьте всё, что мельче, обходите хищников.';
    game.objective = p.stage >= STAGES ? 'Доплыть до отмели справа →' : `Дорасти до 8/8 (сейчас ${p.stage}/8)`;
    return;
  }
  const target = TUNING.genTargetStages[gen - 1] ?? STAGES;
  const need = Math.max(0, Math.ceil(biomassForStage(target) - game.run.biomass));
  game.objective = `Поколение ${gen}/${GEN_TOTAL}: дорасти до ${target}/8 — ещё ${need} биомассы`;
  game.hint = 'Собирайте планктон и мелких клеток; вырастете — откроется новая часть тела.';
}

function checkWin() {
  const p = game.player;
  if (!game.finalPhase) return;
  if (p.stage < STAGES) return;
  if (p.x < WORLD.shoreStart + 90) return;
  game.mode = 'won';
  audio.win();
  const timeStr = `${Math.floor(game.run.time / 60)}:${String(Math.floor(game.run.time % 60)).padStart(2, '0')}`;
  let rank = 'Новорождённая клетка';
  if (game.run.time < 260 && game.run.eaten > 120) rank = 'Царь бульона';
  else if (game.run.time < 360) rank = 'Венец экосистемы';
  else if (game.run.time < 480) rank = 'Опытный пловец';
  else rank = 'Терпеливый организм';
  let best = null;
  try {
    const raw = localStorage.getItem(GAME.storagePrefix + 'best');
    best = raw ? JSON.parse(raw) : null;
  } catch { best = null; }
  const record = { time: game.run.time, eaten: game.run.eaten, rank };
  let isBest = false;
  if (!best || record.time < best.time) {
    isBest = true;
    try { localStorage.setItem(GAME.storagePrefix + 'best', JSON.stringify(record)); } catch { /* private mode */ }
  }
  hud.renderWin({
    stage: p.stage,
    eaten: game.run.eaten,
    parts: game.player.stats.partsCount,
    time: timeStr,
    rank,
    best: isBest,
  });
  hud.showScreen('screen-win');
  burst(fx, p.x, p.y, { count: 60, color: '#ffe9a8', color2: '#cdf6ff', speed: 320, size: 4, life: 1.4 });
}

// ------------------------------------------------------------------ player update

function updatePlayer(dt) {
  const p = game.player;
  const input = game.input;
  const v = input.vector();
  const st = p.stats;
  const sizePenalty = 1 - 0.035 * (p.stage - 1);
  const wantsDash = input.isDashHeld() && p.stamina > TUNING.boostMin;
  if (wantsDash && !p.dashing) { audio.dash(); }
  p.dashing = wantsDash;

  let accel = TUNING.accel * sizePenalty * st.speedMul;
  if (wantsDash) {
    accel *= 2.05;
    p.stamina = Math.max(0, p.stamina - TUNING.boostDrain * dt);
    if (Math.random() < dt * 26) water.spawnBubble(p.x - Math.cos(p.heading) * p.radius, p.y - Math.sin(p.heading) * p.radius, 3 + Math.random() * 6);
  } else {
    p.stamina = Math.min(1, p.stamina + TUNING.boostRegen * dt);
  }

  p.vx += v.x * v.magnitude * accel * dt;
  p.vy += v.y * v.magnitude * accel * dt;

  const drag = Math.exp(-(TUNING.drag + (v.magnitude < 0.05 ? 1.5 : 0)) * dt);
  p.vx *= drag;
  p.vy *= drag;

  const maxSpeed = (wantsDash ? TUNING.boostSpeed : TUNING.maxSpeed) * sizePenalty * st.speedMul;
  const sp = Math.hypot(p.vx, p.vy);
  if (sp > maxSpeed) { p.vx = (p.vx / sp) * maxSpeed; p.vy = (p.vy / sp) * maxSpeed; }

  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.x = Math.max(30, Math.min(WORLD.w - 30, p.x));
  p.y = Math.max(30, Math.min(WORLD.h - 30, p.y));

  if (sp > 12) {
    const targetHeading = Math.atan2(p.vy, p.vx);
    let diff = targetHeading - p.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const turn = TUNING.turnRate * st.turnMul * (1 - 0.04 * (p.stage - 1)) * dt;
    p.heading += Math.max(-turn, Math.min(turn, diff));
  }
  p.waveT += dt * (0.6 + Math.min(1.4, sp / 200));
  p.flagellaPhase += dt;
  p.hitFlash = Math.max(0, p.hitFlash - dt * 2.6);
  p.invulnT = Math.max(0, p.invulnT - dt);
  p.mouthOpen = Math.max(0, p.mouthOpen - dt * 2.4);
  p.shockCd -= dt;
  if (p.hp < p.maxHp && p.invulnT <= 0) p.hp = Math.min(p.maxHp, p.hp + TUNING.regenPerS * dt);

  updateTrail(p.trail, p.x, p.y);

  // electric discharge
  if (st.shock > 0 && p.shockCd <= 0) {
    let hitAny = false;
    const reach = p.radius * 3.4;
    for (const e of game.entities) {
      if (e.eaten) continue;
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d < reach + e.radius) {
        hitAny = true;
        e.stunT = Math.max(e.stunT, 1.1);
        damageEntity(e, 5 + p.stage, true);
        ring(fx, e.x, e.y, e.radius * 3, '#9ff0ff', 2, 0.4);
      }
    }
    if (hitAny) {
      audio.shock();
      ring(fx, p.x, p.y, reach, '#9ff0ff', 3, 0.5);
      p.shockCd = 4 / st.shock;
    } else {
      p.shockCd = 0.4;
    }
  }
}

// ------------------------------------------------------------------ interactions

function playerVsEntity(e) {
  const p = game.player;
  const pr = p.radius;
  const er = e.radius;
  const dist = Math.hypot(e.x - p.x, e.y - p.y);
  const contact = pr * 0.92 + er * 0.92;
  if (dist > contact) return;

  const st = p.stats;

  if (e.kind === KIND.spore) {
    const canPop = st.melee > 0 || st.shock > 0;
    if (canPop && p.mouthOpen > 0.2) {
      eatEntity(e, true);
      return;
    }
    if (!e.stingCd || e.stingCd <= 0) {
      hurtPlayer(3.5 + er * 0.22, e.x, e.y, null);
      e.stingCd = 0.7;
      ring(fx, e.x, e.y, er * 2.4, '#c79bff', 2, 0.4);
    }
    return;
  }

  const eatRatio = TUNING.eatSizeRatio - st.eatBonus;
  const canEat = pr >= er * eatRatio;
  const canBeEaten = er >= pr * eatRatio;

  // debris is armour-plated: jaws break it, spikes crack it when big enough
  if (e.kind === KIND.debris) {
    const canBreak = st.debris > 0 || (st.melee >= 9 && pr >= er * 1.25);
    if (canEat && canBreak) { eatEntity(e); return; }
    if (canEat && !canBreak) {
      // nudge it aside instead of eating
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const l = Math.hypot(dx, dy) || 1;
      e.vx += (dx / l) * 60;
      e.vy += (dy / l) * 60;
      return;
    }
  }

  if (canEat) { eatEntity(e); return; }

  const hostileBite = HOSTILE.has(e.kind) || e.kind === KIND.grazer;
  if (canBeEaten || (hostileBite && er >= pr * 0.86)) {
    if (hostileBite) {
      if (e.biteCd <= 0) {
        const dmg = (e.kind === KIND.hunter ? 11 : 6) + er * 0.2 + (e.kind === KIND.spore ? 0 : 0);
        hurtPlayer(dmg, e.x, e.y, e);
        e.biteCd = 1.1;
        e.mouthOpen = 1;
        burst(fx, (e.x + p.x) / 2, (e.y + p.y) / 2, { count: 12, color: '#ffb0a0', color2: '#fff0d0', speed: 180, size: 2.6, life: 0.5 });
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const l = Math.hypot(dx, dy) || 1;
        p.vx += (dx / l) * 210;
        p.vy += (dy / l) * 210;
      }
      return;
    }
    // a peaceful drift: just bump
  }

  // comparable sizes: shove each other; melee parts make the difference
  const dx = e.x - p.x;
  const dy = e.y - p.y;
  const l = Math.hypot(dx, dy) || 1;
  const push = 40;
  e.vx += (dx / l) * push;
  e.vy += (dy / l) * push;
  p.vx -= (dx / l) * push * 0.35;
  p.vy -= (dy / l) * push * 0.35;
  if (st.melee > 0 && (!e.meleeCd || e.meleeCd <= 0)) {
    damageEntity(e, st.melee * (1 + p.stage * 0.05));
    e.meleeCd = 0.5;
    e.stunT = Math.max(e.stunT, 0.35);
  }
}

function poisonTick(e, dt) {
  if (!e.venomT || e.venomT <= 0) return;
  e.venomT -= dt;
  e.hp -= 5.5 * dt;
  if (Math.random() < dt * 6) {
    burst(fx, e.x + (Math.random() * 2 - 1) * e.radius, e.y + (Math.random() * 2 - 1) * e.radius,
      { count: 1, color: '#b687ff', speed: 40, size: 2, life: 0.5, kind: 'blob' });
  }
  if (e.hp <= 0) eatEntity(e, true);
}

function npcPredation(e, dt) {
  if (e.kind !== KIND.hunter && e.kind !== KIND.grazer) return;
  e.huntT = (e.huntT || 0) + dt;
  if (e.huntT < 0.35) return;
  e.huntT = 0;
  for (const other of game.entities) {
    if (other.eaten || other === e) continue;
    if (other.kind !== KIND.cell && other.kind !== KIND.swarmling && other.kind !== KIND.plankton) continue;
    const d = Math.hypot(other.x - e.x, other.y - e.y);
    if (d < e.radius * 1.15 + other.radius) {
      other.eaten = true;
      game.entityCounts[other.kind] = Math.max(0, (game.entityCounts[other.kind] || 1) - 1);
      burst(fx, other.x, other.y, { count: 6, color: other.palette.body, speed: 120, size: 2, life: 0.5 });
      break;
    }
  }
}

// ------------------------------------------------------------------ loop

function updateAttract(dt) {
  const p = game.player;
  game.attractT = (game.attractT || 0) + dt;
  // gentle autopilot so the title screen shows a living broth
  p.heading += Math.sin(game.attractT * 0.35) * 1.1 * dt;
  p.vx += Math.cos(p.heading) * 80 * dt;
  p.vy += Math.sin(p.heading) * 80 * dt;
  const damp = Math.exp(-1.6 * dt);
  p.vx *= damp; p.vy *= damp;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  if (p.x < 200 || p.x > WORLD.w * 0.6) p.heading += Math.PI;
  p.y = Math.max(120, Math.min(WORLD.h - 120, p.y));
  p.waveT += dt;
  p.flagellaPhase += dt;
  updateTrail(p.trail, p.x, p.y);
  for (const e of game.entities) {
    if (e.eaten) continue;
    if (Math.hypot(e.x - p.x, e.y - p.y) > DESPAWN) continue;
    updateEntity(e, dt, { player: p, rng: game.rng, water, quality });
  }
  managePopulation(dt);
  updateFx(fx, dt);
}

function update(dt) {
  if (game.mode === 'start') { updateAttract(dt); return; }
  if (game.mode !== 'playing' || game.paused) {
    updateFx(fx, dt);
    return;
  }
  game.run.time += dt;
  updatePlayer(dt);

  const p = game.player;
  for (const e of game.entities) {
    if (e.eaten) continue;
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d > DESPAWN) continue;
    updateEntity(e, dt, { player: p, rng: game.rng, water, quality });
    poisonTick(e, dt);
    npcPredation(e, dt);
    playerVsEntity(e);
  }
  // sweep dead entities
  if (game.entities.some((e) => e.eaten)) {
    game.entities = game.entities.filter((e) => !e.eaten);
  }
  managePopulation(dt);
  updateFx(fx, dt);
  game.damageFlash = Math.max(0, game.damageFlash - dt * 1.4);
  updateObjectives();
  checkWin();
  void updateCamera;
}

function render(dt) {
  const dpr = view.dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#08243f';
  ctx.fillRect(0, 0, view.w, view.h);

  water.draw(ctx, cam, view, dt, quality);

  // --- world space: entities, player, fx ---
  withWorldTransform(ctx, cam, view);
  const p = game.player;

  drawShoreline(ctx, cam, view);

  let drawn = 0;
  const halfW = view.w / (2 * cam.zoom);
  const halfH = view.h / (2 * cam.zoom);
  const margin = 140;
  const sorted = game.entities
    .filter((e) => Math.abs(e.x - cam.x) < halfW + margin + e.radius * 3
      && Math.abs(e.y - cam.y) < halfH + margin + e.radius * 3)
    .sort((a, b) => a.radius - b.radius);
  for (const e of sorted) {
    // distance LOD for the smallest food specks
    if (e.kind === KIND.plankton && e.radius < 4 && Math.abs(e.x - cam.x) > halfW * 0.9) continue;
    drawEntity(ctx, e, water.time);
    drawn += 1;
  }

  drawFx(ctx, fx, water.time);

  if (p) {
    const ghost = { ...p, parts: visibleParts(p), trail: p.trail };
    // blink while invulnerable
    if (p.invulnT > 0 && Math.floor(water.time * 12) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      drawCreature(ctx, ghost, water.time);
      ctx.restore();
    } else {
      drawCreature(ctx, ghost, water.time);
    }
    // dash glow
    if (p.dashing) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const s = p.radius * 7;
      ctx.globalAlpha = 0.35;
      ctx.drawImage(bokehSprite('#9fe8ff', 0.5), p.x - s / 2 - Math.cos(p.heading) * p.radius, p.y - s / 2 - Math.sin(p.heading) * p.radius, s, s);
      ctx.restore();
    }
  }
  ctx.restore();

  drawPopups(ctx, fx, cam, view);
  drawWaterOverlay(ctx, view, cam, water.time);
  drawVignette(ctx, view, game.damageFlash * 0.55);
  drawStick(ctx);
  if (game.mode === 'playing' && game.finalPhase) drawShoreArrow(ctx);

  game.metrics.drawn = drawn;
  void noHud;
}

function drawShoreline(ctx, cam, view) {
  // sandy shoal on the eastern edge + coral silhouettes
  const x0 = WORLD.shoreStart;
  const x1 = WORLD.shoreEnd;
  if (x0 > cam.x + view.w / cam.zoom) return;
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, 'rgba(214,236,190,0)');
  g.addColorStop(0.35, 'rgba(226,242,196,0.55)');
  g.addColorStop(1, 'rgba(246,247,206,0.95)');
  ctx.fillStyle = g;
  ctx.fillRect(x0, -200, x1 - x0 + 200, WORLD.h + 400);

  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 26; i += 1) {
    const y = (i / 26) * WORLD.h + 40;
    const wob = Math.sin(i * 1.7) * 40;
    const r = 40 + (i % 5) * 18;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(120,200,180,0.5)' : 'rgba(255,225,170,0.45)';
    ctx.beginPath();
    ctx.ellipse(x0 + 40 + wob, y, r * 1.4, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // glitter
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i += 1) {
    const t = (water.time * 0.5 + i * 0.37) % 1;
    const x = x0 + 120 + t * 780;
    const y = ((i * 173) % WORLD.h);
    const a = 0.10 + 0.18 * Math.abs(Math.sin(water.time * 2 + i));
    const s = 24 + (i % 4) * 14;
    ctx.globalAlpha = a;
    ctx.drawImage(bokehSprite('#ffffff', 0.5), x, y, s, s);
  }
  ctx.restore();
}

function drawShoreArrow(ctx) {
  const p = game.player;
  const sx = (p.x - cam.x) * cam.zoom + view.w / 2;
  const sy = (p.y - cam.y) * cam.zoom + view.h / 2;
  const shoreScreenX = (WORLD.shoreStart - cam.x) * cam.zoom + view.w / 2;
  if (shoreScreenX < view.w - 40) return;
  const pulse = 0.6 + 0.4 * Math.sin(water.time * 4);
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#ffe9a8';
  ctx.translate(view.w - 54, sy - 0);
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.lineTo(-12, -18);
  ctx.lineTo(-12, 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  void sx;
}

function drawStick(ctx) {
  const p = game.player;
  const ov = game.input ? game.input.overlay() : { active: false };
  const px = (p.x - cam.x) * cam.zoom + view.w / 2;
  const py = (p.y - cam.y) * cam.zoom + view.h / 2;
  ctx.save();
  if (ov.active) {
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#dff8ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ov.ox, ov.oy, 68, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = 'rgba(223,248,255,0.55)';
    ctx.beginPath();
    ctx.arc(ov.x, ov.y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(ov.x, ov.y);
    ctx.strokeStyle = '#bff6ff';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else {
    // idle hint ring around the creature
    ctx.globalAlpha = 0.18 + 0.08 * Math.sin(water.time * 2.4);
    ctx.strokeStyle = '#dff8ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, p.radius * cam.zoom + 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ boot & loop

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  view.dpr = dpr;
  view.w = window.innerWidth;
  view.h = window.innerHeight;
  canvas.width = Math.floor(view.w * dpr);
  canvas.height = Math.floor(view.h * dpr);
  canvas.style.width = `${view.w}px`;
  canvas.style.height = `${view.h}px`;
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 250));
resize();

game.input = createInput(canvas, {
  onAnyGesture: () => audio.unlock(),
  onPause: () => togglePause(),
});

function togglePause() {
  if (game.mode !== 'playing') return;
  game.paused = !game.paused;
  hud.showScreen(game.paused ? 'screen-pause' : null);
}

window.addEventListener('keydown', (ev) => {
  if (game.mode !== 'mutation') return;
  const index = ['1', '2', '3'].indexOf(ev.key);
  if (index < 0) return;
  const choices = game.mutationChoices || [];
  if (choices[index]) pickMutation(choices[index]);
});

document.getElementById('btn-pause')?.addEventListener('click', togglePause);
document.getElementById('btn-sound')?.addEventListener('click', () => {
  const muted = audio.setMuted(!audio.isMuted());
  document.getElementById('btn-sound').textContent = muted ? '🔇' : '🔊';
});
document.getElementById('btn-full')?.addEventListener('click', () => {
  const el = document.documentElement;
  if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.().catch(() => {});
});
document.getElementById('btn-play')?.addEventListener('click', () => { audio.unlock(); resetRun(); });
document.getElementById('btn-again')?.addEventListener('click', () => resetRun());
document.getElementById('btn-resume')?.addEventListener('click', togglePause);
document.getElementById('btn-restart-pause')?.addEventListener('click', () => resetRun());

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (game.mode === 'playing') { game.paused = true; hud.showScreen('screen-pause'); }
    audio.suspend();
  } else {
    audio.resume();
  }
});

let last = performance.now();
let hudTimer = 0;
let fpsAcc = 0;
let fpsFrames = 0;

function frame(now) {
  const rawDt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  frameMs = frameMs * 0.9 + (rawDt * 1000) * 0.1;
  fpsAcc += rawDt;
  fpsFrames += 1;
  if (fpsAcc > 0.5) {
    fps = fpsFrames / fpsAcc;
    fpsAcc = 0; fpsFrames = 0;
    game.metrics.fps = Math.round(fps);
    game.metrics.frameMs = Math.round(frameMs * 10) / 10;
    if (!qualityLocked) {
      if (frameMs > 30 && quality > 0.5) quality = 0.5;
      else if (frameMs > 46 && quality > 0.35) quality = 0.35;
      else if (frameMs < 15 && quality < 1) quality = 1;
    }
  }

  const dt = rawDt * (game.slowmo > 0 ? 0.35 : 1);
  if (game.slowmo > 0) game.slowmo = Math.max(0, game.slowmo - rawDt);

  update(dt);
  if (game.mode !== 'start' && !game.freezeCam) updateCamera(cam, dt, game.player, view);
  render(dt);

  hudTimer += rawDt;
  if (hudTimer > 0.1 && !noHud) {
    hudTimer = 0;
    hud.update(game);
    hud.drawMinimap(game);
  }
  game.metrics.entities = game.entities.length;
  game.metrics.mode = game.mode;
  requestAnimationFrame(frame);
}

// ------------------------------------------------------------------ test bridge

window.__GAME_TEST__ = {
  ready: true,
  game,
  reset(seed) { resetRun(seed); return true; },
  getState() {
    const p = game.player;
    if (!p) return { mode: game.mode, entities: game.entities.length, stage: 0 };
    return {
      mode: game.mode,
      generation: game.generation,
      finalPhase: game.finalPhase,
      stage: p.stage,
      radius: p.radius,
      hp: p.hp,
      maxHp: p.maxHp,
      stamina: p.stamina,
      x: p.x, y: p.y,
      vx: p.vx, vy: p.vy,
      biomass: game.run.biomass,
      dna: game.run.dna,
      eaten: game.run.eaten,
      time: game.run.time,
      deaths: game.run.deaths,
      parts: Object.keys(p.parts),
      stats: p.stats,
      entities: game.entities.length,
      counts: { ...game.entityCounts },
      objective: game.objective,
      hint: game.hint,
    };
  },
  metrics() { return { ...game.metrics }; },
  spawnKind(kind, dx = 0, dy = 0, radius) {
    const p = game.player;
    const rng = game.rng;
    const e = spawnOne(kind, rng, p, { x: p.x + dx, y: p.y + dy });
    if (radius) { e.radius = radius; if (e.trail) e.trail.n = 0; }
    return e.id;
  },
  /** Put an entity right in front of the nose, so a single step triggers contact. */
  spawnInFront(kind, radius) {
    const p = game.player;
    const d = p.radius * 1.5 + (radius || 20);
    return this.spawnKind(kind, Math.cos(p.heading) * d, Math.sin(p.heading) * d, radius);
  },
  listNearby(kind, maxDist = 400) {
    const p = game.player;
    return game.entities
      .filter((e) => !e.eaten && (!kind || e.kind === kind))
      .map((e) => ({ id: e.id, kind: e.kind, x: e.x, y: e.y, r: e.radius, d: Math.hypot(e.x - p.x, e.y - p.y) }))
      .filter((e) => e.d <= maxDist)
      .sort((a, b) => a.d - b.d);
  },
  entityInfo(id) {
    const e = game.entities.find((x) => x.id === id);
    if (!e) return null;
    return { id: e.id, kind: e.kind, r: e.radius, hp: e.hp, x: e.x, y: e.y, eaten: e.eaten };
  },
  applyTo(id, amount) {
    const e = game.entities.find((x) => x.id === id);
    if (!e) return false;
    damageEntity(e, amount);
    return true;
  },
  eat(id) {
    const e = game.entities.find((x) => x.id === id);
    if (!e) return false;
    eatEntity(e);
    return true;
  },
  teleport(x, y) {
    game.player.x = x;
    game.player.y = y;
    game.player.vx = 0;
    game.player.vy = 0;
    resetTrail(game.player.trail, x, y);
    cam.x = x; cam.y = y;
    return true;
  },
  setPlayerHeading(h) { game.player.heading = h; return true; },
  setZoom(z) { cam.zoom = z; cam.targetZoom = z; return cam.zoom; },
  freezeCamera(v = true) { game.freezeCam = v; return v; },
  addBiomass(n) { addBiomass(n); return game.run.biomass; },
  setStage(stage) {
    const p = game.player;
    p.stage = Math.max(1, Math.min(STAGES, stage));
    p.radius = SIZE_BY_STAGE[p.stage - 1];
    p.maxHp = hpForStage(p.stage);
    p.hp = p.maxHp;
    return p.stage;
  },
  damagePlayer(n, fromX, fromY) { hurtPlayer(n, fromX, fromY, null); return game.player.hp; },
  givePart(id) { applyPart(game.player, id); return Object.keys(game.player.parts); },
  mutationChoices() { return rollChoices(game.player.parts, game.rng, 3); },
  pickMutation(id) { pickMutation(id); return game.generation; },
  step(dt = 1 / 60, count = 1) {
    for (let i = 0; i < count; i += 1) update(dt);
    return game.run.time;
  },
  toShore() { this.teleport(WORLD.shoreStart + 120, WORLD.h / 2); return true; },
  finishNow() {
    // deterministic shortcut used by the acceptance suite
    this.setStage(STAGES);
    if (game.generation <= GEN_TOTAL) {
      while (game.generation <= GEN_TOTAL) {
        const choices = rollChoices(game.player.parts, game.rng, 3);
        if (choices.length) applyPart(game.player, choices[0]);
        game.generation += 1;
      }
      game.finalPhase = true;
    }
    game.run.biomass = Math.max(game.run.biomass, BIOMASS_TO_STAGE[STAGES - 1]);
    this.teleport(WORLD.shoreStart + 120, WORLD.h / 2);
    updateObjectives();
    checkWin();
    return game.mode;
  },
  world: WORLD,
  kindNames: KIND,
  hud,
  water,
  fx,
  camera: cam,
  view,
  toggleAudio: (m) => audio.setMuted(m),
};

function bootAttract() {
  game.seed = Number(params.get('seed') || game.seed);
  game.rng = makeRng(game.seed);
  game.player = createPlayer(game.seed);
  game.mode = 'start';
  seedPopulation();
  resetTrail(game.player.trail, game.player.x, game.player.y);
  cam.x = game.player.x;
  cam.y = game.player.y;
  cam.zoom = cameraZoomForStage(1);
  hud.update(game);
  hud.showScreen('screen-start');
}
bootAttract();

// PWA: register the service worker only in a real deployment (https), never on
// localhost or file:// so development and QA always see fresh files.
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}

hud.partPanel();
hud.update(game);
hud.drawMinimap(game);
requestAnimationFrame(frame);
