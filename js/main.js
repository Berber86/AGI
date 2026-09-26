// main.js — сборка приложения: профиль, звук, ввод, рендер, интерфейс, игровой цикл.

import { CFG, LAND_PATHS } from './config.js';
import { Game as World } from './core.js';
import { LandGame } from './landcore.js';
import { Meta, MILESTONES, ALL_MILESTONES } from './meta.js';
import { Renderer } from './render.js';
import { LandRenderer } from './landrender.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { UI } from './ui.js';
import { canCallAlly, callAlly, recomputeStats, lineageById } from './player.js';
import { recomputeLandStats, landPathById, landDifficultyById, landSummary } from './landplayer.js';
import { clamp, dist } from './util.js';

class App {
  constructor() {
    this.meta = new Meta();
    this.audio = new Audio();
    this.input = new Input();
    this.state = 'load';          // load | menu | playing | paused | dead | win
    this.stage = 'ocean';         // активная стадия: ocean | land
    this.game = null;
    this.fpsSamples = [];
    this.autoQualityChecked = false;
    this.lastMilestoneCheck = 0;
    this.autosaveT = 0;
    this.frame = 0;
    this.lastTime = performance.now();
    this.hudT = 0;
    this.radarT = 0;
    this.deathsThisRun = 0;
    this.previewT = 0;
  }

  async boot() {
    const fill = document.getElementById('load-fill');
    const text = document.getElementById('load-text');
    const steps = [
      'Проращиваем спору…',
      'Собираем бестиарий…',
      'Готовим органеллы…',
      'Настраиваем океан…',
      'Пробуждаем клетку…',
    ];
    for (let i = 0; i < steps.length; i++) {
      text.textContent = steps[i];
      fill.style.width = `${(i + 1) / steps.length * 100}%`;
      await new Promise((r) => setTimeout(r, 130));
    }

    this.renderer = new Renderer(document.getElementById('world'), this.meta.settings);
    this.ui = new UI(this);
    this.ui.bindStatic();
    this.input.attach({
      zone: document.getElementById('stick-zone'),
      base: document.getElementById('stick-base'),
      knob: document.getElementById('stick-knob'),
      dashBtn: document.getElementById('btn-dash'),
      abilityBtn: document.getElementById('btn-ability'),
      nestBtn: document.getElementById('btn-nest'),
      canvas: document.getElementById('world'),
    });
    this.input.autoBite = !!this.meta.settings.autoBite;
    this.input.sens = this.meta.settings.sens ?? 'normal';

    // разблокировка звука первым касанием
    const unlock = () => { this.audio.unlock(); window.removeEventListener('pointerdown', unlock); };
    window.addEventListener('pointerdown', unlock);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') this.pause();
    });

    this.ui.show('scr-title');
    this.updateTitle();
    this.state = 'menu';
    requestAnimationFrame((t) => this.loop(t));
    this.registerSW();
  }

  registerSW() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  updateTitle() {
    const m = this.meta;
    document.getElementById('btn-continue').disabled = !m.hasRun();
    document.getElementById('codex-count').textContent = `${m.codexSet.size}`;
    document.getElementById('ms-count').textContent = `${m.achSet.size}/${ALL_MILESTONES.length}`;
    const st = m.data.stats;
    const beach = st.beachReached ? ' · Берег: да' : '';
    document.getElementById('best-line').textContent =
      `Жизней: ${st.runs} · Побед: ${st.wins} · Лучший размер: ${st.bestTier}${beach} · Глобальная ДНК: ${Math.round(m.data.dna)}`;
  }

  applySettings() {
    this.renderer.settings = this.meta.settings;
    this.renderer.resize();
    if (this.activeRenderer) this.activeRenderer.settings = this.meta.settings;
    this.audio.setEnabled(this.meta.settings.audio);
    this.audio.setMusic(this.meta.settings.music);
    this.input.autoBite = !!this.meta.settings.autoBite;
    this.input.sens = this.meta.settings.sens ?? 'normal';
    this.meta.save();
  }

  // =============== жизнь клетки ===============
  buildWorld(opts) {
    const up = this.meta.data.upgrades;
    const game = new World({
      settings: this.meta.settings,
      meta: this.meta,
      difficulty: opts.difficulty ?? 'normal',
      lineage: opts.lineage ?? 'omni',
      seed: opts.seed ?? (Date.now() % 100000) + 1,
      deathCount: this.deathsThisRun,
    });
    // наследие вида
    game.player.dna += (up.startDna ?? 0) * 15;
    if (up.hardy) {
      game.player.parts.cytoplasm = Math.max(game.player.parts.cytoplasm ?? 0, up.hardy);
      recomputeStats(game.player);
      game.player.hp = game.player.maxHp;
    }
    return game;
  }

  // Старт новой жизни: стадию выбирает игрок, дальше всё одинаково.
  startNewRun(sel) {
    const opts = typeof sel === 'string' ? { lineage: sel } : (sel ?? {});
    if (opts.stage === 'land') return this.startLandRun(opts);
    const lineage = opts.lineage ?? 'omni';
    const game = this.buildWorld({ lineage, difficulty: opts.difficulty ?? 'normal' });
    this.deathsThisRun = 0;
    this.meta.beginRun();
    this.attachGame(game);
    this.state = 'playing';
    this.enterWorld();
    this.audio.unlock();
    this.ui.toast(`Жизнь началась: ${lineageById(lineage).name}`, 'good');
    this.ui.showHint('Веди палец по экрану — клетка плывёт за ним и кусает всё впереди.', 'start');
    setTimeout(() => this.ui.showHint('Зелёные и золотые частицы подтягиваются к мембране — это работа ваших органелл, а не магнит в мире.', 'magnet', 8000), 12000);
  }

  buildLandWorld(opts) {
    const game = new LandGame({
      settings: this.meta.settings,
      meta: this.meta,
      difficulty: opts.difficulty ?? 'normal',
      path: opts.path ?? LAND_PATHS[0].id,
      seed: opts.seed ?? (Date.now() % 100000) + 3,
      deathCount: this.deathsThisRun,
      fromCell: opts.fromCell ?? null,
    });
    const up = this.meta.data.upgrades;
    game.player.dna += (up.startDna ?? 0) * 12;      // наследие вида работает и на суше
    if (up.hardy) {
      game.player.parts.hide = Math.max(game.player.parts.hide ?? 0, up.hardy);
      recomputeLandStats(game.player);
      game.player.hp = game.player.maxHp;
    }
    return game;
  }

  startLandRun(opts) {
    const path = opts.path ?? LAND_PATHS[0].id;
    const game = this.buildLandWorld({ path, difficulty: opts.difficulty, fromCell: opts.fromCell });
    this.deathsThisRun = 0;
    this.meta.beginRun();
    this.attachGame(game);
    this.state = 'playing';
    this.enterWorld();
    this.audio.unlock();
    const p = landPathById(path);
    this.ui.toast(`На берегу: ${p.name}`, 'good');
    this.ui.showHint('Держи палец на экране — зверь бежит за пальцем. Кнопка рывка с зажатием даёт бег.', 'land_start', 9000);
    setTimeout(() => this.ui.showHint('Полоска «Вода» падает всегда: ищи синие пятна водоёмов и пей.', 'land_water', 8000), 11000);
    setTimeout(() => this.ui.showHint('Подойди к зверю и нажми «Общение»: у каждого вида свои любимые действия.', 'land_social', 9000), 22000);
  }

  // Переход из океана на берег: наследие стадии клетки переносится в новую жизнь.
  landingFromCell() {
    const prev = this.game;
    const carry = prev ? {
      tier: prev.player.tier,
      lineage: prev.player.lineage,
      relicGenes: prev.player.relicGenes ?? 0,
      parts: { ...prev.player.parts },
    } : null;
    if (carry) {
      this.meta.data.stats.beachReached = true;
      this.meta.addDna(40);       // за сам переход
      this.meta.save();
    }
    this.startLandRun({ path: this.pickLandPath(carry), difficulty: prev?.difficulty ?? 'normal', fromCell: carry });
    this.ui.toast('Вид выходит на берег: океан позади', 'gold');
    if (carry?.relicGenes) this.ui.toast(`Древние гены дают +${Math.min(60, carry.tier * 5)} ДНК на новом берегу`, 'good');
  }

  // Дорожка суши подбирается по тому, кем вид был в воде.
  pickLandPath(carry) {
    const lin = carry?.lineage;
    if (lin === 'carn') return 'predator';
    if (lin === 'herb') return 'grazer';
    if (lin === 'symb') return 'social';
    return LAND_PATHS[0].id;
  }

  continueRun() {
    const data = this.meta.data.save;
    if (!data) return;
    try {
      const Ctor = data.stage === 'land' ? LandGame : World;
      const game = Ctor.deserialize(data, { settings: this.meta.settings, meta: this.meta, difficulty: data.difficulty });
      this.deathsThisRun = 0;
      this.meta.beginRun();
      this.attachGame(game);
      this.state = 'playing';
      this.enterWorld();
      this.ui.toast(data.stage === 'land' ? 'Зверь продолжает путь' : 'Погружение продолжается', 'good');
    } catch (e) {
      console.error(e);
      this.ui.toast('Сохранение повреждено', 'bad');
      this.meta.clearRun();
    }
  }

  enterWorld() {
    this.ui.hideAll();
    document.getElementById('hud').classList.remove('hidden');
  }

  attachGame(game) {
    this.game = game;
    this.stage = game.stage ?? 'ocean';
    this.appRenderer = this.renderer;
    this.renderer = this.pickRenderer(this.stage);
    this.ui.bindGame(game);
    this.lastMilestoneCheck = 0;
    this.autosaveT = 0;
    // камера сразу на игроке, чтобы не было рывка
    this.renderer.cam.x = game.player.x;
    this.renderer.cam.y = game.player.y;
  }

  // Рендерер по стадии: вода и суша рисуют по-разному, но контракт один.
  pickRenderer(stage) {
    if (stage === 'land') {
      this.landRenderer ??= new LandRenderer(document.getElementById('world'), this.meta.settings);
      return this.landRenderer;
    }
    this.waterRenderer ??= new Renderer(document.getElementById('world'), this.meta.settings);
    return this.waterRenderer;
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.ui.show('scr-pause');
    this.meta.saveRun(this.game);
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.enterWorld();
  }

  quitToMenu() {
    if (this.game && (this.state === 'playing' || this.state === 'paused')) this.meta.saveRun(this.game);
    this.state = 'menu';
    this.ui.show('scr-title');
    this.updateTitle();
  }

  openGenome() {
    if (!this.game) return;
    this.wasPaused = this.state === 'paused' || this.state === 'playing';
    this.state = 'paused';
    this.ui.openGenome(this.game);
  }
  closeGenome() {
    if (this.state === 'paused' && this.game?.player.alive) this.resume();
    else this.ui.show('scr-title');
  }
  recompute() { recomputeStats(this.game.player); this.ui.updateHud(this.game); }
  canCallAlly() { return this.game ? canCallAlly(this.game) : { ok: false }; }

  abilityAction() {
    const p = this.game?.player;
    if (!p) return;
    if (this.state !== 'playing') return;
    if (this.stage === 'land') {
      const res = this.game.useAbility();
      if (!res.ok && res.why) this.ui.toast(res.why, 'bad');
      return;
    }
    if (!p.stats.abilityId) {
      this.ui.toast('Активной способности нет. Её дают мутации: токсины, звуковой орган, электроциты, реактивный сифон, хроматофоры.', 'bad');
      return;
    }
    if (p.cooldowns.ability > 0) return;
    this.input.ability = true;
  }

  nestAction() {
    const game = this.game;
    if (!game || this.state !== 'playing') return;
    if (this.stage === 'land') return this.totemAction();
    const p = game.player;
    const d = dist(p.x, p.y, p.nestPos.x, p.nestPos.y);
    if (d < 320) { this.openGenome(); return; }
    const ally = canCallAlly(game);
    if (ally.ok) {
      const r = callAlly(game);
      this.ui.toast(r.msg ?? r.why, r.ok ? 'good' : 'bad');
      return;
    }
    if (game.finaleStarted || game.boss) { this.ui.toast('Левиафан рядом — пути назад нет. Неси гены в гнездо!', 'bad'); return; }
    if (p.cooldowns.nest > 0) { this.ui.toast(`Гнездо: перезарядка ${Math.ceil(p.cooldowns.nest)} с`, ''); return; }
    const cost = p.tier <= 2 ? 0 : 12;      // раннюю клетку учим дороге домой бесплатно
    if (p.dna < cost) { this.ui.toast(`Дорога к гнезду стоит ${cost} ДНК`, 'bad'); return; }
    p.dna -= cost;
    p.cooldowns.nest = 40;
    this.teleportToNest();
  }

  // Тотемы суши: рядом — редактор тела и отдых до утра, далеко — дорога домой.
  totemAction() {
    const game = this.game;
    const p = game.player;
    const d = dist(p.x, p.y, p.totemPos.x, p.totemPos.y);
    if (d < 340) {
      const rest = game.restAtTotem();
      if (rest.ok) return;
      if (p.hp < p.maxHp * 0.75 || game.lightLevel < 0.45) this.ui.toast(rest.why, '');
      this.openGenome();
      return;
    }
    if (p.cooldowns.totem > 0) { this.ui.toast(`Тотем: перезарядка ${Math.ceil(p.cooldowns.totem)} с`, ''); return; }
    const cost = p.tier <= 2 ? 0 : 12;
    if (p.dna < cost) { this.ui.toast(`Дорога к тотему стоит ${cost} ДНК`, 'bad'); return; }
    p.dna -= cost;
    p.cooldowns.totem = 40;
    for (let i = 0; i < 22; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 120;
      game.spawnParticle(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 'leaf', '#bfe6a0', 3, 0, -30, 1.2);
    }
    p.x = p.totemPos.x + (Math.random() - 0.5) * 160;
    p.y = p.totemPos.y + (Math.random() - 0.5) * 160;
    p.vx = 0; p.vy = 0;
    p.invuln = 1.4;
    this.renderer.cam.x = p.x; this.renderer.cam.y = p.y;
    game.spawnRing(p.x, p.y, 90, '#9fe6a0');
    this.ui.toast('Ты у тотема: можно отрастить части тела или поспать', 'good');
  }

  // Общение (стадия суши)
  trySocial() {
    const game = this.game;
    if (!game || this.stage !== 'land' || this.state !== 'playing') return;
    const c = game.nearestCreature(game.player.x, game.player.y, CFG.land.social.startRadius + 40, (o) => !o.dead && !o.ally && !o.boss);
    if (!c) { this.ui.toast('Рядом нет зверя, с которым можно познакомиться', 'bad'); return; }
    const res = game.trySocial(c);
    if (!res.ok) this.ui.toast(res.why ?? 'Не получилось', 'bad');
  }

  socialAction(action) {
    const game = this.game;
    if (!game || this.stage !== 'land') return;
    if (!game.player.social.active) { this.trySocial(); return; }
    game.socialAction(action);
  }

  teleportToNest() {
    const game = this.game, p = game.player;
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 120;
      game.spawnParticle(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 'bubble', '#bff3ff', 3, 0, -30, 1.2);
    }
    p.x = p.nestPos.x + (Math.random() - 0.5) * 120;
    p.y = p.nestPos.y + (Math.random() - 0.5) * 120;
    p.vx = 0; p.vy = 0;
    p.invuln = 1.4;
    this.renderer.cam.x = p.x; this.renderer.cam.y = p.y;
    game.spawnRing(p.x, p.y, 90, '#7fe7ff');
    this.ui.toast('Ты у гнезда. Мутируй или отдохни.', 'good');
  }

  respawn() {
    const game = this.game, p = game.player;
    const land = this.stage === 'land';
    const loss = [CFG.dna.respawnDnaLoss, 0.35, 0.45][Math.min(this.deathsThisRun, 2)];
    p.dna = Math.floor(p.dna * (1 - loss));
    p.biomass *= (1 - CFG.dna.respawnBiomassLoss);
    p.hp = p.maxHp;
    p.alive = true;
    p.invuln = 3;
    p.vx = 0; p.vy = 0;
    if (land) {
      p.satiety = p.maxSatiety * 0.6;
      p.water = p.maxWater * 0.6;
      p.stamina = p.maxStamina;
      p.bleed.t = 0; p.poison.t = 0; p.slow.t = 0;
      p.x = p.totemPos.x + (Math.random() - 0.5) * 180;
      p.y = p.totemPos.y + (Math.random() - 0.5) * 180;
    } else {
      p.energy = p.maxEnergy;
      p.poison.t = 0; p.slow.t = 0; p.stun = 0;
      p.x = p.nestPos.x + (Math.random() - 0.5) * 100;
      p.y = p.nestPos.y + (Math.random() - 0.5) * 100;
    }
    this.deathsThisRun++;
    this.renderer.cam.x = p.x; this.renderer.cam.y = p.y;
    this.state = 'playing';
    this.enterWorld();
    this.ui.toast(land ? 'Зверь очнулся у тотема' : 'Новая мембрана выросла в гнезде', 'good');
  }

  onDeath(stats) {
    const game = this.game;
    this.state = 'dead';
    this.audio.play('death');
    // в бою с владыкой стадии возрождения нет — только новая жизнь
    const boss = game.boss ?? game.tyrant;
    const canRespawn = !boss && this.deathsThisRun < 3;
    this.meta.save();
    this.ui.renderDeath(stats, canRespawn, this.deathsThisRun);
    this.ui.show('scr-dead');
    this.meta.clearRun();
  }

  onWin(stats, reason) {
    this.state = 'win';
    this.audio.play('win');
    const before = this.meta.data.dna;
    this.meta.onRunEnd(this.game, { won: true });
    const gain = this.meta.data.dna - before;
    const land = this.stage === 'land';
    this.meta.data.stats.beachReached = this.meta.data.stats.beachReached || land;
    this.meta.save();
    this.game.freePlay = true;
    if (this.game.boss) { this.game.boss.dead = true; this.game.boss = null; }
    if (this.game.tyrant) { this.game.tyrant.dead = true; this.game.tyrant = null; }
    this.meta.clearRun();
    this.ui.renderWin(stats, gain, this.game.winReason ?? 'boss');
    this.ui.show('scr-win');
    this.game.won = true;
  }

  continueAfterWin() {
    this.state = 'playing';
    this.meta.beginRun();
    this.enterWorld();
    this.ui.toast(this.stage === 'land' ? 'Свободная игра: берег остаётся твоим' : 'Свободная игра: океан остаётся твоим', 'good');
  }

  // =============== игровой цикл ===============
  loop(now) {
    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const dt = clamp(rawDt || 0.016, 0.0001, CFG.misc.maxDelta);
    this.frame++;

    // измерение производительности: при просадке мягко снижаем качество
    this.fpsSamples.push(rawDt);
    if (this.fpsSamples.length > 90) this.fpsSamples.shift();
    if (!this.autoQualityChecked && this.fpsSamples.length === 90) {
      this.autoQualityChecked = true;
      const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
      if (avg > 0.033 && this.meta.settings.quality === 'high') {
        this.meta.settings.quality = 'medium';
        this.applySettings();
        this.ui.toast('Качество снижено для плавности', '');
      }
    }

    if (this.game && (this.state === 'playing')) {
      const input = this.input.poll();
      if (input.pause) { this.pause(); }
      else {
        this.game.update(dt, input);
        this.checkMilestones();
        this.autosaveT += dt;
        if (this.autosaveT > CFG.misc.autosaveEvery) { this.autosaveT = 0; this.meta.saveRun(this.game); }
      }
    } else {
      this.input.poll();
    }

    if (this.game) {
      this.renderer.updateCamera(this.game, dt);
      this.renderer.draw(this.game, dt);
      this.hudT += dt;
      if (this.hudT > 0.08) {
        this.hudT = 0;
        this.ui.updateHud(this.game);
      }
      this.radarT += dt;
      if (this.radarT > 0.12) {
        this.radarT = 0;
        this.renderer.drawRadar(document.getElementById('radar'), this.game);
      }
      const boss = this.game.boss ?? this.game.tyrant;
      const intensity = boss ? 1 : this.game.event ? 0.7 : 0.4;
      this.audio.updateMusic(dt, intensity);
    }
    this.previewT += dt;
    this.ui?.tickGenomePreview(this.previewT);

    // небольшая пауза на экранах меню — экономим батарею
    if (this.state === 'menu' || this.state === 'load') {
      this.frameSlow = (this.frameSlow ?? 0) + 1;
    }
    requestAnimationFrame((t) => this.loop(t));
  }

  checkMilestones() {
    if (this.game.time - this.lastMilestoneCheck < 1) return;
    this.lastMilestoneCheck = this.game.time;
    const fresh = this.meta.newMilestones(this.game);
    if (this.stage === 'land') {
      const p = this.game.player;
      if (this.game.event?.id === 'drought' && this.game.events.current?.goalDone) p.flags.droughtSurvived = true;
      if (this.game.raining && p.counters.drinks > 0) p.flags.rainDrunk = true;
      if (this.game.lightLevel < 0.35 && p.runTime > 20) p.flags.nightSurvived = true;
    }
    for (const m of fresh) {
      this.audio.play('quest');
      this.ui.toast(`★ ${m.name} · +${m.reward} глобальной ДНК`, 'gold');
    }
    // мелкие счётчики, которые ведёт только ядро
    const p = this.game.player;
    if (this.game.biome === 'abyss') p.flags.visitedAbyss = true;
  }

  haptic(ms) {
    if (!this.meta.settings.haptics) return;
    try { navigator.vibrate?.(ms); } catch { /* необязательно */ }
  }
}

// ------------------------------------------------------------------
const app = new App();
window.__app = app;   // удобно для отладки с телефона
app.boot().catch((e) => {
  console.error(e);
  const t = document.getElementById('load-text');
  if (t) t.textContent = 'Ошибка запуска: ' + e.message;
});
