// Экран «Карта мира»: регионы, соперники, смена эпохи, начало боя.
import { el, btn, mount, clear, modal, tooltip } from '../dom.js';
import { tryAdvanceEra } from '../era-up.js';
import { gearSVG } from '../art.js';
import { DOMAINS, eraOf, ROMAN_ERA, S, PERSONALITIES, HOME_POS, canAttackRegion, buildRival, applyDifficulty, rivalPower, DISCOVERY_LIST, effectiveBlueprint } from '../shared.js';
import { app, render, persist, toast } from '../app.js';
import { renderCard } from '../cards.js';
import { autoplay } from '../../engine/autoplay.js';
import { makeRng } from '../../engine/rng.js';

let selected = null;

/**
 * Сброс состояния экрана карты.
 *
 * `selected` живёт на уровне модуля, поэтому между партиями (и между тестами)
 * он удерживает выбранный регион — а renderMap показывает либо панель региона,
 * либо обзор державы, так что «залипший» выбор прячет целый экран.
 * Симметрично resetBattleUi() на боевом экране.
 */
export function resetMapUi() { selected = null; }

export function renderMap() {
  const st = app.state;
  if (selected && !st.world.regions.some((r) => r.id === selected)) selected = null;
  const root = el('div', { class: 'map-wrap' });
  root.append(el('div', { class: 'map-main' }, [mapSVG(st), legend()]));
  const aside = el('aside', { class: 'map-aside' });
  aside.append(selected ? regionPanel(st, st.world.regions.find((r) => r.id === selected)) : overviewPanel(st));
  aside.append(eraPanel(st));
  root.append(aside);
  return root;
}

// -----------------------------------------------------------------------------
function mapSVG(st) {
  const box = el('div', { class: 'map' });
  const w = 100, h = 100;
  let paths = '';
  for (const r of st.world.regions) {
    if (r.conquered || r.boss) {
      paths += `<line x1="${HOME_POS.x}" y1="${HOME_POS.y}" x2="${r.x}" y2="${r.y}" stroke="${r.conquered ? DOMAINS[st.legacy].color : '#5a4a2a'}" stroke-width="0.35" stroke-dasharray="${r.conquered ? '' : '1.2 1.2'}" opacity="0.75"/>`;
    }
  }
  let nodes = `<g><circle cx="${HOME_POS.x}" cy="${HOME_POS.y}" r="4.2" fill="${DOMAINS[st.legacy].color}" stroke="#fff3" stroke-width="0.5"/>
    <text x="${HOME_POS.x}" y="${HOME_POS.y + 1.6}" text-anchor="middle" font-size="3.4" fill="#12151a" font-weight="800">${DOMAINS[st.legacy].glyph}</text>
    <text x="${HOME_POS.x}" y="${HOME_POS.y - 5.6}" text-anchor="middle" font-size="2.8" fill="#e8dcc0">${st.civName}</text></g>`;

  for (const r of st.world.regions) {
    const c = DOMAINS[r.civ.domains[0]].color;
    const locked = !canAttackRegion(st, r);
    const fill = r.conquered ? DOMAINS[st.legacy].color : locked ? '#2b3038' : c;
    const rad = r.boss ? 5.4 : 3.4 + r.era * 0.22;
    nodes += `<g class="rnode${locked && !r.conquered ? ' rnode--locked' : ''}${selected === r.id ? ' rnode--sel' : ''}" data-id="${r.id}" tabindex="0" role="button" aria-label="${r.name}, эпоха ${ROMAN_ERA[r.era]}, ${r.conquered ? 'ваша земля' : r.civ.name}">
      <circle cx="${r.x}" cy="${r.y}" r="${rad}" fill="${fill}" opacity="${r.conquered ? 0.55 : locked ? 0.5 : 0.92}" stroke="${selected === r.id ? '#fff' : '#0d0f13'}" stroke-width="${selected === r.id ? 0.9 : 0.5}"/>
      ${r.boss ? `<circle cx="${r.x}" cy="${r.y}" r="${rad + 1.6}" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="1 1"/>` : ''}
      <text x="${r.x}" y="${r.y + 1.3}" text-anchor="middle" font-size="${rad * 0.9}" fill="#0d0f13" font-weight="800">${r.conquered ? '✓' : ROMAN_ERA[r.era]}</text>
      <text x="${r.x}" y="${r.y + rad + 3.2}" text-anchor="middle" font-size="2.5" fill="#cbbfa4">${r.name}</text>
      <text x="${r.x}" y="${r.y + rad + 6.2}" text-anchor="middle" font-size="2.1" fill="${c}" opacity="0.9">${r.conquered ? 'ваша земля' : r.civ.name}</text>
    </g>`;
  }

  box.innerHTML = `<svg viewBox="0 0 ${w} ${h}" class="map__svg" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="mapbg" cx="30%" cy="20%"><stop offset="0%" stop-color="#22262e"/><stop offset="100%" stop-color="#101318"/></radialGradient>
      <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#ffffff08" stroke-width="0.2"/></pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#mapbg)"/><rect width="${w}" height="${h}" fill="url(#grid)"/>
    ${paths}${nodes}
  </svg>`;
  box.querySelectorAll('.rnode').forEach((g) => {
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => { selected = g.dataset.id; refreshMap(); });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selected = g.dataset.id; refreshMap(); }
    });
    const region = st.world.regions.find((r) => r.id === g.dataset.id);
    if (region) tooltip(g, regionTip(st, region));
  });
  return box;
}

function regionTip(st, r) {
  const dom = DOMAINS[r.civ.domains[0]];
  const locked = !canAttackRegion(st, r);
  if (r.conquered) return `<b>${r.name}</b> · ваша земля<br><span class="tip-ok">✓ присоединён, доход учтён</span>`;
  const rows = [
    `<b>${r.name}</b> · эпоха ${ROMAN_ERA[r.era]}`,
    `<span class="tip-sub">${r.civ.name} · ${dom.glyph} ${dom.name} · ${PERSONALITIES[r.civ.personality].name}</span>`,
    `Награда: ${r.reward.science} 🔬, ${r.reward.materials} 🧱${r.boss ? ' <b class="tip-kw">(босс ×3)</b>' : ''}`,
    locked ? `<span class="tip-bad">🔒 нужна эпоха ${Math.max(1, r.era - 1)}+</span>` : '<span class="tip-ok">⚔ можно атаковать</span>',
  ];
  return rows.join('<br>');
}

function refreshMap() {
  const root = document.querySelector('.screen--map');
  if (root) mount(root, renderMap());
}

function legend() {
  return el('div', { class: 'map-legend' }, [
    ...Object.values(DOMAINS).map((d) => el('span', { class: 'lg', style: { '--c': d.color } }, [el('i', {}, d.glyph), d.name])),
    el('span', { class: 'lg lg--dim' }, [el('i', {}, '🔒'), 'нужна более поздняя эпоха']),
  ]);
}

// -----------------------------------------------------------------------------
function overviewPanel(st) {
  const info = S.deckInfo(st);
  const box = el('div', { class: 'card-panel' });
  box.append(el('h3', {}, 'Ваша держава'));
  box.append(el('div', { class: 'kv' }, [
    kv('Эпоха', `${ROMAN_ERA[st.era]} · ${eraOf(st.era).name}`),
    kv('Здоровье лидера в бою', eraOf(st.era).leaderHp),
    kv('Колода', `${info.count}/${info.max} (минимум ${info.min})`),
    kv('Открытий изучено', `${st.researched.length} / ${DISCOVERY_LIST.length}`),
    kv('Проектов / юнитов', `${Object.keys(st.blueprints).length} / ${st.roster.length}`),
    kv('Доход за ход', `+${S.ECONOMY.income(st).science} 🔬  +${S.ECONOMY.income(st).materials} 🧱`),
  ]));
  if (!info.valid) {
    box.append(el('div', { class: 'warn' }, `Колода не собрана: нужно ${info.min}–${info.max} юнитов. Загляните в «Колоду».`));
    box.append(btn('Перейти к колоде', () => { app.tab = 'deck'; render(); }, 'primary'));
  } else {
    box.append(el('div', { class: 'ok' }, `Колода готова: ${info.count} юнитов, средняя цена ${info.avgCost.toFixed(1)}⚡, свойств ${info.kw}.`));
  }
  box.append(el('p', { class: 'hint' }, 'Выберите регион на карте, чтобы увидеть соперника и начать бой. Атаковать можно земли, чья эпоха не выше вашей +1.'));
  return box;
}

const kv = (k, v) => el('div', { class: 'kv__row' }, [el('span', {}, k), el('b', {}, String(v))]);

function regionPanel(st, region) {
  const box = el('div', { class: 'card-panel' });
  const locked = !canAttackRegion(st, region);
  const c = DOMAINS[region.civ.domains[0]].color;
  box.append(el('div', { class: 'rp-head' }, [
    el('h3', {}, `${region.name}`),
    el('span', { class: 'era-badge', style: { background: c }, text: `Эпоха ${ROMAN_ERA[region.era]}` }),
  ]));
  if (region.conquered) {
    box.append(el('div', { class: 'ok' }, '✓ Регион присоединён. Доход учтён.'));
    box.append(btn('← Другой регион', () => { selected = null; refreshMap(); }));
    return box;
  }
  box.append(el('div', { class: 'kv' }, [
    kv('Цивилизация', region.civ.name),
    kv('Домены', region.civ.domains.map((d) => `${DOMAINS[d].glyph} ${DOMAINS[d].name}`).join(', ')),
    kv('Доктрина войны', PERSONALITIES[region.civ.personality].name),
    kv('Награда', `+${region.reward.science} 🔬  +${region.reward.materials} 🧱`),
  ]));
  box.append(el('p', { class: 'hint' }, PERSONALITIES[region.civ.personality].desc));

  if (locked) {
    box.append(el('div', { class: 'warn' }, `🔒 Нужна эпоха ${Math.max(1, region.era - 1)}+ (у вас ${ROMAN_ERA[st.era]}). Смените эпоху или берите доступные земли.`));
    return box;
  }

  // разведка
  const rng = makeRng(`${st.seed}:scout:${region.id}:${st.stats.battles}`);
  const rival = applyDifficulty(buildRival(region, rng, st.difficulty), st.difficulty);
  const p = rivalPower(rival);
  // Оценка угрозы сама по себе бесполезна: игроку не с чем её сравнить.
  // Считаем свою колоду той же формулой (с поправкой на ветеранство) и
  // выносим вердикт — иначе выбор региона остаётся гаданием.
  const mine = myDeckPower(st);
  const odds = verdictOf(mine.score, p.score);
  box.append(el('div', { class: 'scout' }, [
    el('h4', {}, 'Разведка (приблизительно)'),
    el('div', { class: 'scout__vs' }, [
      el('div', { class: 'scout__col' }, [
        el('span', { class: 'scout__who' }, 'Вы'),
        el('b', { class: 'scout__score' }, String(mine.score)),
      ]),
      el('div', { class: `scout__odds scout__odds--${odds.tone}` }, [
        el('span', {}, odds.label),
        el('span', { class: 'scout__ratio' }, odds.ratio),
      ]),
      el('div', { class: 'scout__col' }, [
        el('span', { class: 'scout__who' }, region.civ.name),
        el('b', { class: 'scout__score' }, String(p.score)),
      ]),
    ]),
    el('div', { class: 'kv' }, [
      kv('Юнитов в колоде', `${mine.count} / ${rival.deck.length}`),
      kv('Суммарная атака', `${mine.atk} / ${p.atk}`),
      kv('Суммарное здоровье', `${mine.hp} / ${p.hp}`),
      kv('Свойств', `${mine.kw} / ${p.kw}`),
    ]),
    el('p', { class: `scout__tip scout__tip--${odds.tone}`, text: odds.tip }),
    el('div', { class: 'scout__cards' }, rival.deck.slice(0, 8).map((u) => renderCard(u, { size: 'xs' }))),
  ]));

  const info = S.deckInfo(st);
  const ready = info.valid;
  box.append(el('div', { class: 'row' }, [
    btn('⚔ В бой', () => startFight(st, region, false), 'primary', { disabled: !ready, title: ready ? '' : 'Соберите колоду' }),
    btn('⚡ Автобой', () => startFight(st, region, true), '', { disabled: !ready, title: 'Бой разыгрывается автоматически, вы видите только итог и журнал' }),
    btn('← Назад', () => { selected = null; refreshMap(); }),
  ]));
  if (!ready) box.append(el('div', { class: 'warn' }, `Колода: ${info.count}/${info.min}–${info.max}. Соберите её во вкладке «Колода».`));
  return box;
}

/**
 * Сила собственной колоды той же формулой, что и rivalPower, — иначе сравнивать
 * бессмысленно. Ветеранство учитывается: юнит 3-го звания реально сильнее чертежа.
 */
function myDeckPower(st) {
  const units = st.deck.map((id) => st.roster.find((u) => u.id === id)).filter(Boolean);
  const decks = units.map((u) => ({ blueprint: effectiveBlueprint(u) }));
  const p = rivalPower({ deck: decks });
  return { ...p, count: units.length };
}

/** Вердикт по соотношению сил: что делать игроку с этой разницей. */
function verdictOf(my, foe) {
  const r = foe > 0 ? my / foe : (my > 0 ? 2 : 1);
  const ratio = `${Math.round(r * 100)}%`;
  if (r >= 1.3) return { tone: 'good', label: 'вы заметно сильнее', ratio, tip: 'Хорошая цель: перевес сил на вашей стороне. Бой должен пройти без больших потерь.' };
  if (r >= 1.05) return { tone: 'good', label: 'небольшой перевес', ratio, tip: 'Перевес на вашей стороне, но размен может быть дорогим — следите за прогнозом в консоли блока.' };
  if (r >= 0.9) return { tone: 'even', label: 'силы равны', ratio, tip: 'Бой на равных: исход решит розыгрыш и блокирование. Если хотите надёжнее — сначала укрепите колоду или возьмите регион слабее.' };
  if (r >= 0.7) return { tone: 'warn', label: 'соперник сильнее', ratio, tip: 'Вы уступаете. Стоит нанять ещё юнитов, собрать колоду плотнее или атаковать более слабую землю — поражение откатит доход.' };
  return { tone: 'bad', label: 'вы намного слабее', ratio, tip: 'Почти верное поражение. Смените эпоху, изучите открытия и пересоберите колоду, прежде чем идти сюда.' };
}

function startFight(st, region, auto) {
  const res = S.startBattle(st, region.id);
  if (!res.ok) { toast(res.reason, 'bad', 4000); return; }
  if (auto) {
    autoplay(res.battle);
    const won = res.battle.over?.winner === 'me';
    S.finishBattle(st, res.battle, won ? 'win' : 'lose');
    persist();
    showAutoReport(res.battle, region, won);
    refreshMap();
    return;
  }
  app.battle = res.battle;
  app.battleCtx = { region, rival: res.rival };
  app.screen = 'battle';
  render();
}

function showAutoReport(b, region, won) {
  const body = el('div', {}, [
    el('p', { class: won ? 'ok' : 'bad' }, won ? `🏆 «${region.name}» взят за ${b.round} раундов!` : `💀 Поражение от ${b.sides.foe.name} за ${b.round} раундов.`),
    el('div', { class: 'kv' }, [
      kv('Ваш лидер', `${Math.max(0, b.sides.me.leader.hp)}/${b.sides.me.leader.maxHp}`),
      kv('Лидер врага', `${Math.max(0, b.sides.foe.leader.hp)}/${b.sides.foe.leader.maxHp}`),
      kv('Пало ваших юнитов', b.sides.me.grave.length),
      kv('Убито врагов', b.sides.foe.grave.length),
    ]),
    el('div', { class: 'logbox logbox--tall' }, b.log.map((l) => el('div', { class: `log log--${l.kind}` }, l.text))),
  ]);
  const m = modal(`Автобой: ${region.name}`, body, { footer: [btn('Закрыть', () => m.close(), 'primary')] });
}

// -----------------------------------------------------------------------------
function eraPanel(st) {
  const box = el('div', { class: 'card-panel card-panel--era' });
  const r = S.eraRequirements(st);
  box.append(el('h3', {}, st.era >= 6 ? 'Последняя эпоха' : `Смена эпохи → ${ROMAN_ERA[r.next]}`));
  if (st.era >= 6) {
    box.append(el('p', { class: 'hint' }, 'Вы в эпохе Атома. Возьмите Сердцевину, чтобы выиграть партию.'));
    return box;
  }
  const e = eraOf(r.next);
  box.append(el('p', { class: 'hint' }, `Эпоха ${ROMAN_ERA[r.next]} · ${e.name}: лидер ${e.leaderHp} HP, поле ${e.slots}, колода ${e.deckSize}, энергия до ${e.energyCap}, добор ${e.draw}.`));
  box.append(el('div', { class: 'reqs' }, [
    req('🔬 Наука', r.science.have, r.science.need),
    req('🚩 Регионы', r.regions.have, r.regions.need),
    req(`📜 Открытия эпохи ${st.era}`, r.discoveries.have, r.discoveries.need),
  ]));
  const chk = S.canAdvanceEra(st);
  box.append(btn('🏛 Сменить эпоху', () => {
    const res = tryAdvanceEra(st, { onChange: () => { persist(); render(); } });
    if (!res.ok) toast(res.reason, 'bad', 4200);
  }, chk.ok ? 'primary' : '', { disabled: !chk.ok, title: chk.ok ? '' : chk.reason }));
  return box;
}

function req(label, have, need) {
  const ok = have >= need;
  return el('div', { class: `req${ok ? ' req--ok' : ''}` }, [
    el('span', {}, label),
    el('b', {}, `${Math.min(have, need)}/${need}`),
    el('div', { class: 'bar' }, el('i', { style: { width: `${Math.min(100, (have / Math.max(1, need)) * 100)}%` } })),
  ]);
}
