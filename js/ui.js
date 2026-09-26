// ui.js — интерфейс: экраны, HUD, редактор генома, бестиарий, достижения, задания.
// Модуль читает состояние игры и вызывает методы движка; игровой логики тут нет.

import { CFG, LINEAGES, DIFFICULTY_ORDER } from './config.js';
import { PARTS, PART_LIST, TABS, partUnlocked, nextLevelCost, partSlots } from './parts.js';
import { SPECIES, FAMILY, FAMILY_NAME, FOOD_KINDS } from './species.js';
import { MILESTONES, Meta } from './meta.js';
import { evolveCost, tryEvolve, refundGenome, partSlotsUsed, activeAbility, lineageById } from './player.js';
import { drawGenomePreview } from './render.js';
import { drawPortrait } from './cellrender.js';
import { clamp, fmt, fmtTime, dist, rgba } from './util.js';

const $ = (id) => document.getElementById(id);

const ABILITY_NAME = {
  shock: 'Электрошок', sonic: 'Ультразвук', jetstream: 'Реактивный рывок',
  toxin: 'Ядовитое облако', mirage: 'Мираж',
};

export class UI {
  constructor(app) {
    this.app = app;             // { meta, audio, input }
    this.game = null;
    this.activeScreen = 'scr-title';
    this.tab = 'structure';
    this.toastQueue = [];
    this.lastQuestSig = '';
    this.shownHints = {};
  }

  // ================= экраны =================
  show(id) {
    this.activeScreen = id;
    for (const el of document.querySelectorAll('.screen')) el.classList.toggle('show', el.id === id);
    const hud = $('hud');
    const inGame = !['scr-load', 'scr-title', 'scr-newrun'].includes(id);
    hud.classList.toggle('hidden', !inGame);
  }
  hideAll() { this.show(this.activeScreen); }
  isScreen(id) { return this.activeScreen === id; }
  screenIsMenu() { return ['scr-title', 'scr-newrun', 'scr-help', 'scr-codex', 'scr-milestones', 'scr-settings'].includes(this.activeScreen); }

  bindStatic() {
    const app = this.app;
    const click = (id, fn) => $(id)?.addEventListener('click', () => { app.audio.play('ui'); fn(); });

    click('btn-continue', () => this.app.continueRun());
    click('btn-newrun', () => { this.renderNewRun(); this.show('scr-newrun'); });
    click('btn-newrun-back', () => this.show('scr-title'));
    click('btn-newrun-start', () => this.app.startNewRun(this.sel.lineage, this.sel.difficulty));
    click('btn-codex', () => { this.renderCodex(); this.show('scr-codex'); });
    click('btn-milestones', () => { this.renderMilestones(); this.show('scr-milestones'); });
    click('btn-settings', () => { this.renderSettings(); this.show('scr-settings'); });
    click('btn-help', () => { this.renderHelp(); this.show('scr-help'); });
    click('btn-menu', () => this.app.pause());
    click('btn-resume', () => this.app.resume());
    click('btn-pause-codex', () => { this.renderCodex(true); this.show('scr-codex'); });
    click('btn-pause-missions', () => { this.renderMissions(); this.show('scr-missions'); });
    click('btn-pause-settings', () => { this.renderSettings(true); this.show('scr-settings'); });
    click('btn-quit', () => this.app.quitToMenu());
    click('btn-evolve', () => this.app.openGenome());
    click('btn-genome-close', () => this.app.closeGenome());
    click('btn-win-continue', () => this.app.continueAfterWin());
    click('btn-win-menu', () => this.app.quitToMenu());
    click('btn-dash', () => this.app.input?.fire('dash'));
    click('btn-nest', () => this.app.nestAction());
    click('btn-ability', () => this.app.abilityAction());

    for (const el of document.querySelectorAll('[data-close]')) {
      el.addEventListener('click', () => {
        app.audio.play('ui');
        if (this.app.state === 'paused') this.app.resume(); else this.show('scr-title');
      });
    }
    this.sel = { lineage: LINEAGES[0].id, difficulty: 'normal' };
    window.addEventListener('orientationchange', () => setTimeout(() => this.updateRotateHint(), 200));
    this.updateRotateHint();
  }

  updateRotateHint() {
    const portrait = window.innerHeight >= window.innerWidth;
    $('rotate-hint').classList.toggle('hidden', portrait);
    setTimeout(() => $('rotate-hint').classList.add('hidden'), 6000);
  }

  // ================= HUD =================
  bindGame(game) {
    this.game = game;
    const app = this.app;

    game.on('grow', ({ tier }) => {
      app.audio.play('grow');
      this.toast(`Размер ${tier}! Клетка выросла`, 'gold');
      this.showHint('Рост открыл новые ячейки генома. Загляни в «Мутировать».', 'grow' + tier);
    });
    game.on('evolve', ({ id, level }) => {
      app.audio.play('evolve');
      this.toast(`${PARTS[id].name} → уровень ${level}`, 'good');
      const abId = PARTS[id].levels[level - 1]?.eff.abilityId;
      if (abId) this.toast(`Новая способность: ${ABILITY_NAME[abId] ?? abId} — кнопка слева от рывка`, 'gold');
    });
    game.on('relic', ({ count }) => {
      app.audio.play('relic');
      this.toast(`Древний ген ${count}/3!`, 'gold');
      if (count === 3) this.showHint('Три гена вместе разбудили хозяина бездны. Неси их в гнездо — или убей его.', 'relic3');
    });
    game.on('cache', ({ amount }) => this.toast(`Кладка ДНК: +${amount}`, 'good'));
    game.on('codex', ({ id }) => {
      const sp = SPECIES.find((s) => s.id === id);
      if (sp) this.toast(`Новый вид: ${sp.name}`, '');
    });
    game.on('kill', ({ species, first }) => { app.audio.play('kill'); if (first) this.toast(`Впервые убит: ${species.name} (+ДНК)`, 'good'); });
    game.on('bite', () => app.audio.play('bite'));
    game.on('bitePlayer', () => app.audio.play('hurt'));
    game.on('playerHit', () => { app.audio.play('hurt'); app.haptic(18); });
    game.on('dash', () => { app.audio.play('dash'); app.haptic(8); });
    game.on('dance', ({ species, sync }) => { app.audio.play('dance'); this.toast(`Танец принят: ${species.name} (${sync}/3)`, 'good'); });
    game.on('allyCall', ({ species, n }) => {
      const sp = SPECIES.find((s) => s.id === species);
      this.toast(`Стая «${sp?.name ?? species}» откликнулась: ${n} существ`, 'good');
    });
    game.on('eventStart', ({ name, desc }) => {
      app.audio.play('event');
      this.toast(`Событие: ${name}`, 'gold');
      this.showEventBanner(name);
      this.showHint(desc, 'ev_' + name, 4000);
    });
    game.on('eventGoal', ({ reward, text }) => { app.audio.play('quest'); this.toast(`Цель события: ${text} (+${reward} ДНК)`, 'gold'); });
    game.on('eventEnd', () => this.showEventBanner(null));
    game.on('questDone', ({ mission, reward }) => { app.audio.play('quest'); this.toast(`Задание выполнено: ${mission.name} (+${reward} ДНК)`, 'gold'); });
    game.on('banner', ({ text, kind }) => this.toast(text, kind));
    game.on('boundary', () => this.toast('Дальше — поверхностная плёнка. Поверни назад.', 'bad'));
    game.on('shock', () => app.audio.play('shock'));
    game.on('sonic', () => app.audio.play('sonic'));
    game.on('toxin', () => app.audio.play('toxin'));
    game.on('ink', () => this.toast('Чернильное облако!', ''));
    game.on('bossSpawn', () => { app.audio.play('boss'); this.showEventBanner('ЛЕВИАФАН'); this.toast('Левиафан идёт за тобой', 'bad'); });
    game.on('bossPhase', ({ phase }) => this.toast(`Левиафан: фаза ${phase}`, 'bad'));
    game.on('finaleStart', () => this.showHint('Донеси древние гены в гнездо ◉ — или убей Левиафана.', 'finale', 9000));
    game.on('nestWin', () => this.toast('Геном вида доставлен в гнездо — стадия пройдена!', 'gold'));
    game.on('win', ({ stats, reason }) => this.app.onWin(stats, reason));
    game.on('death', ({ stats }) => this.app.onDeath(stats));
    game.on('stageGoal', ({ text }) => this.toast(`Цель: ${text}`, ''));
    game.on('biomeChange', ({ to }) => {
      const names = { shallows: 'Мелководье', reef: 'Коралловый риф', trench: 'Разлом', abyss: 'Бездна' };
      const tips = {
        shallows: 'Тут светло и много планктона. Хорошо для быстрого роста.',
        reef: 'Риф кишит жизнью: и вкусной, и опасной. Держи ухо востро.',
        trench: 'Холодно и темно. Хищники здесь крупнее, зато ДНК богаче.',
        abyss: 'Солнце сюда не достаёт. Без биолюминесценции ты почти слеп.',
      };
      this.toast(`${names[to]}`, 'gold');
      this.showHint(tips[to], 'biome_' + to);
    });
  }

  toast(text, kind = '') {
    const box = $('toasts');
    const el = document.createElement('div');
    el.className = `toast ${kind}`;
    el.textContent = text;
    box.appendChild(el);
    while (box.children.length > 4) box.removeChild(box.firstChild);
    setTimeout(() => el.remove(), CFG.misc.toastDuration * 1000);
  }

  showHint(text, key = text, ms = CFG.misc.hintTime * 1000) {
    if (!this.app.meta.settings.showHints) return;
    if (this.shownHints[key]) return;
    this.shownHints[key] = true;
    const el = $('hint');
    el.textContent = text;
    el.classList.remove('hidden');
    clearTimeout(this._hintT);
    this._hintT = setTimeout(() => el.classList.add('hidden'), ms);
  }

  showEventBanner(name) {
    const el = $('event-banner');
    if (!name) { el.classList.add('hidden'); el.textContent = ''; return; }
    el.textContent = `⚑ ${name}`;
    el.classList.remove('hidden');
  }

  updateHud(game) {
    const p = game.player;
    const st = p.stats;
    const hpPct = clamp(p.hp / p.maxHp, 0, 1);
    $('bar-hp-fill').style.width = `${hpPct * 100}%`;
    $('bar-hp-txt').textContent = `${Math.ceil(p.hp)}/${Math.round(p.maxHp)}`;
    $('bar-hp-fill').parentElement.classList.toggle('low', hpPct < 0.3);

    const enPct = clamp(p.energy / st.maxEnergy, 0, 1);
    $('bar-en-fill').style.width = `${enPct * 100}%`;
    $('bar-en-txt').textContent = `${Math.round(p.energy)} · −${st.upkeep.toFixed(1)}/с`;
    $('bar-en-fill').parentElement.classList.toggle('low', enPct < 0.18);

    const need = CFG.player.growth[Math.min(p.tier - 1, CFG.player.growth.length - 1)] ?? 1;
    const pct = p.tier >= CFG.player.maxTier ? 1 : clamp(p.biomass / need, 0, 1);
    $('bar-gr-fill').style.width = `${pct * 100}%`;
    $('bar-gr-txt').textContent = p.tier >= CFG.player.maxTier ? 'Максимальный размер' : `Рост: ${Math.floor(p.biomass)}/${need}`;

    $('dna-txt').textContent = Math.floor(p.dna);
    $('tier-txt').textContent = p.tier;

    const lin = lineageById(p.lineage);
    const diet = p.parts.filter ? (p.parts.vacuole ? 'Всеяден' : 'Растительноядный') : (p.parts.vacuole ? 'Плотоядный' : 'Всеяден');
    $('diet-chip').textContent = `${lin.icon} ${diet}`;
    const rep = $('rep-chip');
    const allies = game.countAllies();
    if (allies > 0 || p.relicGenes > 0) {
      rep.classList.remove('hidden');
      rep.textContent = `Союзники ${allies} · Гены ${p.relicGenes}/3`;
    } else rep.classList.add('hidden');

    const biome = game.biome;
    const names = { shallows: 'Мелководье', reef: 'Коралловый риф', trench: 'Разлом', abyss: 'Бездна' };
    const depth = { shallows: 20, reef: 130, trench: 340, abyss: 720 }[biome];
    if (this._lastBiome !== biome) {
      const first = !this._lastBiome;
      this._lastBiome = biome;
      if (!first) this.toast(`Зона: ${names[biome]} · ${depth} м`, '');
    }
    document.querySelector('.zone-name').textContent = names[biome];
    document.querySelector('.zone-depth').textContent = `глубина ${depth} м`;
    $('radar-zone').textContent = names[biome];

    const hours = Math.floor(game.dayPhase * 24);
    const mins = Math.floor((game.dayPhase * 24 % 1) * 60);
    const dayN = 1 + Math.floor(game.time / CFG.day.length);
    document.querySelector('.clock-icon').textContent = game.lightLevel > 0.55 ? '☀' : game.lightLevel > 0.3 ? '☁' : '☾';
    document.querySelector('.clock-text').textContent = `${game.lightLevel > 0.55 ? 'День' : game.lightLevel > 0.3 ? 'Сумерки' : 'Ночь'} ${dayN} · ${String(hours % 24).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    // способность
    const ab = activeAbility(p);
    const ico = $('ability-ico'), nm = $('ability-name'), cd = $('ability-cd');
    if (ab) {
      ico.textContent = ab.icon; nm.textContent = ab.short ?? ab.name;
      const ratio = p.cooldowns.ability / ab.cd;
      cd.style.transform = `scaleY(${clamp(ratio, 0, 1)})`;
      $('btn-ability').classList.toggle('ready', p.cooldowns.ability <= 0);
    } else {
      ico.textContent = '✷'; nm.textContent = 'нет';
      cd.style.transform = 'scaleY(1)';
      $('btn-ability').classList.add('disabled');
    }
    $('dash-cd').style.transform = `scaleY(${clamp(p.cooldowns.dash / (CFG.player.dashCooldown * st.dashCdMul), 0, 1)})`;

    // кнопка гнезда: контекстное действие
    const nest = $('btn-nest');
    const dNest = dist(p.x, p.y, p.nestPos.x, p.nestPos.y);
    const friendly = this.app.canCallAlly();
    const finalRace = game.finaleStarted && p.relicGenes >= CFG.progression.relicGenesForWin;
    if (dNest < 320) {
      nest.querySelector('.act-name').textContent = finalRace ? 'Домой!' : 'Геном';
      nest.classList.add('armed');
    } else if (friendly.ok) { nest.querySelector('.act-name').textContent = 'Зов'; nest.classList.add('armed'); }
    else { nest.querySelector('.act-name').textContent = 'Гнездо'; nest.classList.remove('armed'); }
    if (finalRace && !this._finalHintShown) {
      this._finalHintShown = true;
      this.showHint('Гены при тебе: дойди до гнезда и заверши стадию — или убей Левиафана.', 'finalRace', 12000);
    }
    $('nest-cd').style.transform = `scaleY(${clamp(p.cooldowns.nest / 40, 0, 1)})`;

    // полоса Левиафана
    const bb = $('boss-bar');
    document.getElementById('hud').classList.toggle('boss-fight', !!(game.boss && !game.boss.dead));
    if (game.boss && !game.boss.dead) {
      bb.classList.remove('hidden');
      $('boss-hp-fill').style.width = `${clamp(game.boss.hp / game.boss.maxHp, 0, 1) * 100}%`;
    } else bb.classList.add('hidden');

    // опасность
    $('danger-vignette').classList.toggle('on', hpPct < 0.3 || !!game.boss);
    this.updateQuests(game);
  }

  updateQuests(game) {
    const list = game.quests.list();
    const sig = list.map((m) => `${m.id}:${m.progress}/${m.need}${m.done ? 'd' : ''}`).join('|');
    if (sig === this.lastQuestSig) return;
    this.lastQuestSig = sig;
    const box = $('quest-tracker');
    box.innerHTML = '';
    let shown = 0;
    for (const m of list) {
      if (m.kind !== 'stage' && m.done && shown > 1) continue;
      if (shown >= 3) break;
      shown++;
      const el = document.createElement('div');
      el.className = `quest${m.main ? ' main' : ''}${m.done ? ' done' : ''}`;
      el.innerHTML = `<b>${m.name}</b><br>${m.desc}${m.need > 1 ? ` <span class="qprog">${m.progress}/${m.need}</span>` : ''}`;
      box.appendChild(el);
    }
  }

  // ================= Геном =================
  renderNewRun() {
    const app = this.app;
    const box = $('lineage-cards');
    box.innerHTML = '';
    for (const lin of LINEAGES) {
      const locked = lin.unlock && !app.meta.achSet.has(lin.unlock);
      const el = document.createElement('button');
      el.className = `card${this.sel.lineage === lin.id && !locked ? ' sel' : ''}${locked ? ' locked' : ''}`;
      el.innerHTML = `<h4>${lin.icon} ${lin.name}${locked ? ' 🔒' : ''}</h4><p>${lin.desc}</p>
        <div class="tags">${lin.perks.map((p) => `<span class="tag">${p}</span>`).join('')}</div>
        ${locked ? `<p class="tiny bad">Откроется достижением «Симбиоз»</p>` : ''}`;
      el.addEventListener('click', () => {
        if (locked) { this.toast('Родословная закрыта: нужно достижение «Симбиоз»', 'bad'); return; }
        app.audio.play('ui');
        this.sel.lineage = lin.id;
        this.renderNewRun();
      });
      box.appendChild(el);
    }
    const dbox = $('difficulty-cards');
    dbox.innerHTML = '';
    for (const id of DIFFICULTY_ORDER) {
      const d = CFG.difficulty[id];
      const el = document.createElement('button');
      el.className = `card${this.sel.difficulty === id ? ' sel' : ''}`;
      el.innerHTML = `<h4>${d.name}</h4><p>${d.desc}</p>`;
      el.addEventListener('click', () => { app.audio.play('ui'); this.sel.difficulty = id; this.renderNewRun(); });
      dbox.appendChild(el);
    }
  }

  openGenome(game) {
    this.game = game;
    this.renderGenome();
    this.show('scr-genome');
  }

  renderGenome() {
    const game = this.game;
    const p = game.player;
    $('g-dna').textContent = Math.floor(p.dna);
    $('g-slots').textContent = `${partSlotsUsed(p)}/${p.stats.slots}`;
    $('g-upkeep').textContent = p.stats.upkeep.toFixed(1);

    // вкладки
    const tabs = $('g-tabs');
    tabs.innerHTML = '';
    for (const t of TABS) {
      const el = document.createElement('button');
      el.className = `tab${this.tab === t.id ? ' sel' : ''}`;
      el.textContent = t.name;
      el.addEventListener('click', () => { this.app.audio.play('ui'); this.tab = t.id; this.renderGenome(); });
      tabs.appendChild(el);
    }

    // список деталей
    const box = $('g-parts');
    box.innerHTML = '';
    const list = PART_LIST.filter((part) => part.tab === this.tab);
    const nearNest = dist(p.x, p.y, p.nestPos.x, p.nestPos.y) < 320;
    for (const part of list) {
      const lvl = p.parts[part.id] ?? 0;
      const lock = partUnlocked(part, p.tier, this.app.meta.achSet);
      const cost = evolveCost(game, part.id);
      const el = document.createElement('div');
      el.className = `part${lvl >= part.maxLevel ? ' maxed' : ''}${!lock.ok ? ' locked' : ''}${lvl > 0 ? ' installed' : ''}`;
      const effNow = lvl > 0 ? this._effectsText(part.levels[lvl - 1].eff) : '';
      const effNext = cost ? this._effectsText(part.levels[lvl].eff) : '';
      el.innerHTML = `
        <div class="part-ico">${part.icon}</div>
        <div class="part-body">
          <div class="part-name"><span>${part.name}</span>
            <span class="lv">${Array.from({ length: part.maxLevel }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</span>
          </div>
          <div class="part-desc">${part.desc}</div>
          ${lvl > 0 ? `<div class="part-meta">сейчас: ${effNow}</div>` : ''}
          ${cost ? `<div class="part-meta">дальше: ${effNext} <span class="cost">${cost.total} ДНК</span>${cost.surcharge ? `<span class="up">+${Math.round(cost.surcharge * 100)}% вне гнезда</span>` : ''} <span class="slots">ячеек: ${part.slots}</span></div>` : '<div class="part-meta">максимальный уровень</div>'}
          ${!lock.ok ? `<div class="req">🔒 ${lock.why}</div>` : ''}
        </div>
        <div class="part-btns">
          <button class="buy" ${(!cost || !lock.ok || p.dna < cost.total) ? 'disabled' : ''}>${cost ? (lvl > 0 ? 'Улучшить' : 'Вставить') : 'МАКС'}</button>
          ${lvl > 0 && part.slots > 0 ? '<button class="rm">Убрать</button>' : ''}
        </div>`;
      el.querySelector('.buy')?.addEventListener('click', () => {
        const r = tryEvolve(game, part.id);
        this.toast(r.msg, r.ok ? 'good' : 'bad');
        if (r.ok) { this.app.audio.play('evolve'); this.renderGenome(); this.updateHud(game); }
      });
      el.querySelector('.rm')?.addEventListener('click', () => {
        const lin = lineageById(p.lineage);
        const keep = lin.startParts?.[part.id] ?? 0;
        if (lvl <= keep) { this.toast('Стартовая органелла — не убрать', 'bad'); return; }
        let back = 0;
        for (let l = keep; l < lvl; l++) back += part.levels[l].dna;
        p.dna += Math.round(back * 0.6);
        p.parts[part.id] = keep;
        if (keep === 0) delete p.parts[part.id];
        this.app.recompute();
        this.toast(`Убрано, возвращено ${Math.round(back * 0.6)} ДНК`, '');
        this.renderGenome();
      });
      box.appendChild(el);
    }

    $('g-hint').textContent = nearNest
      ? 'Рядом с гнездом мутации дешевле. Выбирай ячейки с умом.'
      : 'Ты в открытом океане: мутации дороже на 25%. Вернись к гнезду ◉ для скидки.';

    this._renderGenomeStats();
  }

  _effectsText(eff) {
    const names = {
      maxHp: 'Здоровье', speedMul: 'Скорость', turnMul: 'Управляемость', armor: 'Броня', regen: 'Регенерация',
      spikeDmg: 'Шипы', spikeKnock: 'Отброс', poison: 'Яд/с', plantVal: 'Растительная пища', meatVal: 'Мясо',
      dnaMul: 'ДНК', energyMax: 'Запас энергии', energyRegen: 'Восстановление', upkeepMul: 'Обмен веществ',
      symbionts: 'Симбионты', magnet: 'Притяжение пищи', vision: 'Обзор', dashPower: 'Сила рывка', dashCd: 'Перезарядка рывка',
      cloakOnHit: 'Невидимость', slowOnBite: 'Замедление', stunOnBite: 'Оглушение', lifeSteal: 'Вампиризм',
      knockResist: 'Устойчивость', biteRate: 'Скорость укуса', armorPierce: 'Пробитие брони', abilityId: 'Способность',
      attractSmall: 'Приманка', nightVision: 'Ночное зрение', radar: 'Радар', glow: 'Свечение', eatAll: 'Всеядность',
      massMul: 'Масса', slowFactor: 'Сила замедления', slowResist: 'Стойкость',
    };
    const bits = [];
    for (const k in eff) {
      if (k === 'abilityId') { bits.push(`способность «${eff[k]}»`); continue; }
      const v = eff[k];
      const name = names[k] ?? k;
      bits.push(`${name} ${v > 0 ? '+' : ''}${typeof v === 'number' ? (Math.abs(v) < 1 ? Math.round(v * 100) + '%' : Math.round(v)) : v}`);
    }
    return bits.join(', ') || '—';
  }

  _renderGenomeStats() {
    const game = this.game, p = game.player;
    const s = p.stats;
    const rows = [
      ['Здоровье', Math.round(s.maxHp)],
      ['Скорость', Math.round(s.baseSpeed)],
      ['Управляемость', s.turnRate.toFixed(1)],
      ['Броня', `${Math.round((1 - 1 / (1 + s.armor / 34)) * 100)}%`],
      ['Регенерация', `${s.regen.toFixed(1)}/с`],
      ['Энергия', `${Math.round(s.maxEnergy)} (−${s.upkeep.toFixed(1)}/с)`],
      ['Обзор', Math.round(s.vision)],
      ['Ячейки', `${partSlotsUsed(p)}/${s.slots}`],
    ];
    const box = $('g-stats');
    box.innerHTML = rows.map(([k, v]) => `<div class="st"><span>${k}</span><b>${v}</b></div>`).join('');
  }

  tickGenomePreview(t) {
    if (!this.game || !this.isScreen('scr-genome')) return;
    drawGenomePreview($('g-canvas'), this.game.player, t);
  }

  // ================= Бестиарий =================
  renderCodex(inGame = false) {
    const meta = this.app.meta;
    const box = $('codex-list');
    box.innerHTML = '';
    const groups = {};
    for (const sp of SPECIES) (groups[sp.family] ??= []).push(sp);
    for (const fam of Object.keys(groups)) {
      const head = document.createElement('h3');
      head.textContent = FAMILY_NAME[fam] ?? fam;
      box.appendChild(head);
      for (const sp of groups[fam]) {
        const seen = meta.codexSet.has(sp.id);
        const el = document.createElement('div');
        el.className = `codex-entry${seen ? '' : ' locked'}`;
        if (!seen) {
          el.innerHTML = `<h4><span>???</span><span class="muted tiny">не изучен</span></h4>
            <p>Встреться с этим существом в океане, чтобы открыть запись.</p>`;
          box.appendChild(el);
          continue;
        }
        const canvas = document.createElement('canvas');
        canvas.width = 72; canvas.height = 72;
        canvas.style.cssText = 'width:56px;height:56px;float:left;margin:0 10px 6px 0;border-radius:50%';
        drawPortrait(canvas.getContext('2d'), sp, 72, 1);
        el.appendChild(canvas);
        el.insertAdjacentHTML('beforeend', `<h4><span>${sp.icon} ${sp.name}</span><span class="tiny muted">уровень ${sp.tierMin}–${sp.tierMax}</span></h4>
          <p class="lore">${sp.lore}</p>
          <p>${sp.habitat}</p>
          <div class="stats">
            <span>Здоровье ×${sp.hpMul.toFixed(2)}</span>
            <span>Урон ×${sp.dmgMul.toFixed(2)}</span>
            <span>Скорость ×${sp.speedMul.toFixed(2)}</span>
            ${sp.venom ? `<span>Яд ${sp.venom}</span>` : ''}
            ${sp.ranged ? '<span>Дальний бой</span>' : ''}
            ${sp.alpha ? '<span>★ альфа</span>' : ''}
            ${sp.boss ? '<span>☠ босс</span>' : ''}
            ${sp.ability ? `<span>способность: ${sp.ability}</span>` : ''}
          </div>`);
        box.appendChild(el);
      }
    }
    $('codex-count').textContent = `${meta.codexSet.size}/${SPECIES.length}`;
  }

  // ================= Достижения =================
  renderMilestones() {
    const meta = this.app.meta;
    const box = $('ms-list');
    box.innerHTML = '';
    for (const m of MILESTONES) {
      const done = meta.achSet.has(m.id);
      const el = document.createElement('div');
      el.className = `ms-entry${done ? ' done' : ''}`;
      el.innerHTML = `<h4><span>${done ? '★ ' : '· '}${m.name}</span><span class="rew">+${m.reward} ДНК</span></h4><p>${m.desc}</p>`;
      box.appendChild(el);
    }
    const legacy = document.createElement('div');
    legacy.innerHTML = `<h3>Наследие вида — глобальная ДНК: <b>${Math.round(meta.data.dna)}</b></h3>
      <p class="tiny muted">Тратится между жизнями и остаётся навсегда.</p>`;
    box.appendChild(legacy);
    for (const l of Meta.LEGACY) {
      const lvl = meta.data.upgrades[l.id] ?? 0;
      const cost = lvl < l.max ? l.cost[lvl] : null;
      const el = document.createElement('div');
      el.className = `ms-entry${lvl > 0 ? ' done' : ''}`;
      el.innerHTML = `<h4><span>${l.name} — ур. ${lvl}/${l.max}</span><span class="rew">${cost ? cost + ' ДНК' : 'максимум'}</span></h4><p>${l.desc}</p>`;
      if (cost) {
        const btn = document.createElement('button');
        btn.className = 'big';
        btn.style.marginTop = '6px';
        btn.textContent = `Купить за ${cost}`;
        btn.disabled = meta.data.dna < cost;
        btn.addEventListener('click', () => {
          const r = meta.buyLegacy(l.id);
          this.toast(r.msg, r.ok ? 'good' : 'bad');
          this.renderMilestones();
        });
        el.appendChild(btn);
      }
      box.appendChild(el);
    }
    $('ms-count').textContent = `${meta.achSet.size}/${MILESTONES.length}`;
  }

  // ================= Задания =================
  renderMissions() {
    const box = $('missions-list');
    box.innerHTML = '';
    if (!this.game) return;
    const list = this.game.quests.list();
    for (const m of list) {
      const el = document.createElement('div');
      el.className = `mission${m.done ? ' done' : ''}`;
      el.innerHTML = `<h4><span>${m.main ? '⌘ ' : ''}${m.name}</span>${m.reward ? `<span class="rew">+${m.reward} ДНК</span>` : ''}</h4>
        <p>${m.desc}</p>
        ${m.need > 1 ? `<p class="mprog">Прогресс: ${m.progress}/${m.need}</p>` : ''}
        ${m.done ? '<p class="good">Выполнено</p>' : ''}`;
      box.appendChild(el);
    }
    const act = document.createElement('div');
    act.innerHTML = `<h3>Событие океана</h3>`;
    const ev = this.game.event;
    act.insertAdjacentHTML('beforeend', ev
      ? `<div class="mission"><h4>${ev.name}</h4><p>${ev.desc}</p></div>`
      : '<p class="muted tiny">Сейчас океан спокоен. Скоро что-то произойдёт.</p>');
    box.appendChild(act);
  }

  // ================= Настройки =================
  renderSettings(inGame = false) {
    const meta = this.app.meta;
    const box = $('settings-list');
    box.innerHTML = '';

    const seg = (label, hint, options, value, onPick) => {
      const row = document.createElement('div');
      row.className = 'set-row';
      row.innerHTML = `<div class="lbl">${label}<small>${hint}</small></div>`;
      const wrap = document.createElement('div');
      wrap.className = 'seg';
      for (const o of options) {
        const b = document.createElement('button');
        b.textContent = o.label;
        if (o.value === value) b.className = 'sel';
        b.addEventListener('click', () => { this.app.audio.play('ui'); onPick(o.value); this.renderSettings(inGame); });
        wrap.appendChild(b);
      }
      row.appendChild(wrap);
      box.appendChild(row);
    };

    const toggle = (label, hint, value, onSet) => {
      const row = document.createElement('div');
      row.className = 'set-row';
      row.innerHTML = `<div class="lbl">${label}<small>${hint}</small></div>`;
      const sw = document.createElement('button');
      sw.className = `switch${value ? ' on' : ''}`;
      sw.innerHTML = '<i></i>';
      sw.addEventListener('click', () => { this.app.audio.play('ui'); onSet(!value); this.renderSettings(inGame); });
      row.appendChild(sw);
      box.appendChild(row);
    };

    seg('Качество графики', 'Влияет на частоту кадров и детализацию.',
      Object.keys(CFG.quality).map((k) => ({ label: CFG.quality[k].name, value: k })),
      meta.settings.quality, (v) => { meta.settings.quality = v; this.app.applySettings(); });
    toggle('Звук', 'Плеск, укусы, эволюция.', meta.settings.audio, (v) => { meta.settings.audio = v; this.app.audio.setEnabled(v); });
    toggle('Эмбиент-музыка', 'Тихие тона океана.', meta.settings.music, (v) => { meta.settings.music = v; this.app.audio.setMusic(v); });
    toggle('Вибрация', 'Отклик при уроне и рывке.', meta.settings.haptics, (v) => { meta.settings.haptics = v; });
    toggle('Подсказки', 'Обучение и советы в игре.', meta.settings.showHints, (v) => { meta.settings.showHints = v; });
    toggle('Авто-рывок', 'Рывок при отпускании стика.', meta.settings.autoDash, (v) => { meta.settings.autoDash = v; });
    toggle('Авто-укус', 'Кусать без удержания экрана.', meta.settings.autoBite, (v) => { meta.settings.autoBite = v; this.app.input.autoBite = v; });

    const stats = meta.data.stats;
    const info = document.createElement('div');
    info.innerHTML = `<h3>Итоги вида</h3>
      <div class="st" style="font-size:.74rem;line-height:1.5">
        Жизней: <b>${stats.runs}</b> · Побед: <b>${stats.wins}</b><br>
        Лучший размер: <b>${stats.bestTier}</b> · Лучшее время: <b>${fmtTime(stats.bestTime)}</b><br>
        Всего убийств: <b>${stats.totalKills}</b> · Смертей: <b>${stats.deaths}</b><br>
        Глобальная ДНК: <b>${Math.round(meta.data.dna)}</b> · Открыто видов: <b>${meta.codexSet.size}/${SPECIES.length}</b>
      </div>`;
    box.appendChild(info);

    const reset = document.createElement('button');
    reset.className = 'big ghost';
    reset.style.marginTop = '10px';
    reset.textContent = 'Сбросить весь прогресс';
    reset.addEventListener('click', () => {
      if (!confirm('Удалить достижения, бестиарий и глобальную ДНК?')) return;
      meta.reset();
      this.renderSettings(inGame);
      this.toast('Прогресс сброшен', '');
    });
    box.appendChild(reset);
    meta.save();
  }

  // ================= Помощь =================
  renderHelp() {
    const box = $('help-body');
    box.innerHTML = `
      <h3>Что происходит</h3>
      <p>Ты — клетка в древнем океане. Ешь биомассу, расти, мутируй, заводи союзников и найди три древних гена, чтобы завершить стадию клетки.</p>
      <h3>Управление</h3>
      <ul>
        <li><span class="k">Стик слева</span> — плыть. Пока держишь палец, клетка кусает всё впереди.</li>
        <li><span class="k">»</span> — рывок: короткое ускорение и неуязвимость.</li>
        <li><span class="k">Особая кнопка</span> — способность, открытая мутацией (шок, ультразвук, ядовитое облако…).</li>
        <li><span class="k">◉</span> — у гнезда открывает геном; рядом с другом — зов стаи; иначе — подсказка пути домой.</li>
        <li>Клавиатура: <span class="k">WASD</span>, <span class="k">Space</span> — рывок, <span class="k">E</span> — способность, <span class="k">F</span> — гнездо, <span class="k">Esc</span> — пауза.</li>
      </ul>
      <h3>Как расти</h3>
      <ul>
        <li>Растительная биомасса (зелёные и золотые точки) — быстрый рост, но мало ДНК.</li>
        <li>Мясо — куски плоти, трупы и сами существа — больше ДНК.</li>
        <li>Энергия тратится на органеллы постоянно. Растёт обмен веществ — расти, значит больше есть.</li>
        <li>Дошёл до конца шкалы роста — стал крупнее, обзор шире, ячеек генома больше.</li>
      </ul>
      <h3>Мутации</h3>
      <ul>
        <li>Геном открывается у гнезда ◉ (или в паузе). Вне гнезда мутации дороже на 25%.</li>
        <li>Каждая деталь занимает ячейки. Ячеек становится больше с ростом.</li>
        <li>Детали отмечаются достижениями и размером. Убирая деталь, возвращается 60% ДНК.</li>
      </ul>
      <h3>Общение вместо драки</h3>
      <ul>
        <li>Останови клетку рядом с существом и не кусай его — начнётся <b>танец</b> (кольцо синхронизации).</li>
        <li>Завершённый танец даёт репутацию с видом, а вид с высокой репутацией становится союзником.</li>
        <li>Союзники плывут за тобой и дерутся с врагами. Зов стаи — у кнопки ◉.</li>
        <li>Убийство существа рядом с другим видом — это «кормление»: репутация растёт.</li>
      </ul>
      <h3>Опасности</h3>
      <ul>
        <li>Крупные клетки бьют при столкновении. Клетка крупнее тебя в 1.22 раза может проглотить тебя одним укусом.</li>
        <li>Стрекачи стреляют с дистанции, микота травит спорами, сепиола ставит чернильную завесу.</li>
        <li>События океана: цветение, шторм, миграция, охота, падёж. У каждого — своя цель и награда.</li>
        <li>Три древних гена будят Левиафана: донеси гены в гнездо или убей его.</li>
      </ul>
      <h3>Смерть и наследие</h3>
      <ul>
        <li>Гибель не отменяет прогресс: достижения и глобальная ДНК остаются, бестиарий пополняется.</li>
        <li>Наследие даёт стартовую ДНК и здоровье — покупается в «Достижениях».</li>
        <li>Можно возродиться в гнезде, потеряв часть запаса ДНК, или начать новую жизнь.</li>
      </ul>`;
  }

  // ================= Экраны итогов =================
  renderDeath(stats, canRespawn, deathCount) {
    const box = $('death-stats');
    box.innerHTML = `
      <div class="st"><b>${stats.tier}</b><span>размер</span></div>
      <div class="st"><b>${stats.kills}</b><span>убийств</span></div>
      <div class="st"><b>${fmtTime(stats.time)}</b><span>прожито</span></div>
      <div class="st"><b>${stats.relics}/3</b><span>древних генов</span></div>
      <div class="st"><b>${stats.dances}</b><span>танцев</span></div>
      <div class="st"><b>${stats.allies}</b><span>союзников</span></div>`;
    const actions = $('death-actions');
    actions.innerHTML = '';
    if (canRespawn) {
      const btn = document.createElement('button');
      btn.className = 'big primary';
      btn.textContent = `Возродиться в гнезде (−${Math.round(CFG.dna.respawnDnaLoss * 100)}% ДНК)`;
      btn.addEventListener('click', () => this.app.respawn());
      actions.appendChild(btn);
    }
    const nw = document.createElement('button');
    nw.className = 'big';
    nw.textContent = 'Новая жизнь';
    nw.addEventListener('click', () => { this.renderNewRun(); this.show('scr-newrun'); });
    actions.appendChild(nw);
    const menu = document.createElement('button');
    menu.className = 'big ghost';
    menu.textContent = 'В меню';
    menu.addEventListener('click', () => this.app.quitToMenu());
    actions.appendChild(menu);
    const info = document.createElement('p');
    info.className = 'muted tiny';
    info.textContent = `Жизнь №${deathCount + 1}. Достижения и бестиарий сохранены.`;
    actions.appendChild(info);
  }

  renderWin(stats, metaGain, reason) {
    const box = $('win-body');
    const lore = reason === 'nest'
      ? 'Три древних гена возвращены в гнездо, где началась жизнь. Колония приняла новое знание:'
        + ' твой вид выходит на берег эволюции, оставляя океан позади. Следующая стадия — уже не вода.'
      : 'Левиафан, хозяин бездны, побеждён. Его реликтовые гены теперь твои.'
        + ' Твой вид выходит на берег эволюции, оставляя океан позади. Следующая стадия — уже не вода.';
    box.innerHTML = `
      <div class="st wide lore">${lore}</div>
      <div class="st"><b>${stats.tier}</b><span>финальный размер</span></div>
      <div class="st"><b>${stats.kills}</b><span>убийств</span></div>
      <div class="st"><b>${fmtTime(stats.time)}</b><span>время жизни</span></div>
      <div class="st"><b>${stats.dances}</b><span>танцев</span></div>
      <div class="st"><b>+${metaGain}</b><span>глобальной ДНК</span></div>
      <div class="st"><b>${this.app.meta.achSet.size}</b><span>достижений всего</span></div>`;
  }
}
