// Экран «Журнал»: события партии, статистика и справочник шестерёнок/свойств.
import { el, tooltip } from '../dom.js';
import { gearSVG } from '../art.js';
import { GEARS, GEAR_IDS, GEAR_PAIRS, GEAR_TRIPLES, KEYWORDS, DOMAINS, RARITIES, ROMAN_ERA, S, eraOf, DISCOVERY_LIST } from '../shared.js';
import { app } from '../app.js';

export function renderJournal() {
  const st = app.state;
  const root = el('div', { class: 'journal' });

  const stats = el('div', { class: 'card-panel' });
  stats.append(el('h3', {}, 'Летопись'));
  stats.append(el('div', { class: 'deckstats' }, [
    stat('Ходов', st.stats.turns),
    stat('Боёв', st.stats.battles),
    stat('Побед', st.stats.wins),
    stat('Поражений', st.stats.losses),
    stat('Проектов', Object.keys(st.blueprints).length),
    stat('Юнитов', st.roster.length),
    // знаменатель берём из данных: было зашито «/80» при 85 открытиях
    stat('Открытий', `${st.researched.length}/${DISCOVERY_LIST.length}`),
    stat('Регионов', `${st.conquered}/${st.world.regions.length}`),
    stat('Убито врагов', st.stats.kills),
    stat('Пало своих', st.stats.lost),
  ]));
  root.append(stats);

  const msg = el('div', { class: 'card-panel' });
  msg.append(el('h3', {}, 'Журнал'));
  msg.append(el('div', { class: 'logbox logbox--tall' }, (st.messages || []).map((m) => el('div', { class: `log log--${m.kind}` }, m.text))));
  root.append(msg);

  root.append(glossary());
  return root;
}

const stat = (k, v) => el('div', { class: 'dstat' }, [el('b', {}, String(v)), el('span', {}, k)]);

export function glossary() {
  const root = el('div', { class: 'card-panel glossary' });
  root.append(el('h3', {}, 'Справочник'));

  // шестерни
  root.append(el('h4', {}, 'Шестерни'));
  const gRow = el('div', { class: 'gearlist' });
  for (const g of GEAR_IDS) {
    const pairs = Object.entries(GEAR_PAIRS).filter(([k]) => k.split('+').includes(g));
    const node = el('div', { class: 'gearcard', style: { '--c': GEARS[g].color } }, [
      el('span', { html: gearSVG(g, 40) }),
      el('b', {}, GEARS[g].name),
      el('span', { class: 'small dim' }, `${pairs.length} комбинаций`),
    ]);
    tooltip(node, `<b>${GEARS[g].name}</b><br>${pairs.map(([k, v]) => {
      const other = k.split('+').find((x) => x !== g) || g;
      const kw = KEYWORDS[v.kw];
      return `${GEARS[other].name} → <span class="tip-kw">${v.alias || kw.name}</span>`;
    }).join('<br>')}`);
    gRow.append(node);
  }
  root.append(gRow);

  // домены
  root.append(el('h4', {}, 'Домены знания'));
  root.append(el('div', { class: 'domlist' }, Object.values(DOMAINS).map((d) => el('div', { class: 'domcard', style: { '--c': d.color } }, [
    el('b', {}, `${d.glyph} ${d.name}`),
    el('span', { class: 'small' }, `архетип: ${d.archetype} · атака ×${d.atk} · здоровье ×${d.hp}`),
    el('span', { class: 'small dim' }, `шестерни: ${d.gears.map((g) => GEARS[g].name).join(', ')}`),
  ]))));

  // редкости
  root.append(el('h4', {}, 'Редкость = число слотов'));
  root.append(el('div', { class: 'rarlist' }, RARITIES.filter(Boolean).map((r) => el('div', { class: 'rarcard', style: { '--c': r.color } }, [
    el('b', {}, r.name),
    el('span', { class: 'small' }, `${r.slots} слот(а) · до ${r.kwCap} свойств · характеристики ×${r.mult}`),
  ]))));

  // свойства
  root.append(el('h4', {}, 'Свойства'));
  const kwBox = el('div', { class: 'kwgrid' });
  const entries = Object.entries(GEAR_PAIRS).sort((a, b) => (KEYWORDS[b[1].kw]?.priority || 0) - (KEYWORDS[a[1].kw]?.priority || 0));
  const seen = new Set();
  for (const [key, rec] of entries) {
    const kw = KEYWORDS[rec.kw];
    if (!kw) continue;
    const [a, b] = key.split('+');
    const sig = `${rec.kw}|${rec.alias || ''}`;
    kwBox.append(el('div', { class: 'kwcard' }, [
      el('span', { class: 'kwcard__g', html: gearSVG(a, 22) + gearSVG(b, 22) }),
      el('div', {}, [
        el('b', {}, rec.alias || kw.name),
        el('div', { class: 'small dim' }, `${GEARS[a].name} + ${GEARS[b].name}`),
        el('div', { class: 'small' }, kw.text),
      ]),
    ]));
    seen.add(sig);
  }
  // свойства, которых нет в матрице пар (например, Регенерация объявлена отдельно)
  root.append(kwBox);

  // тройки: редкие свойства, которых нет ни в одной паре
  const triples = Object.entries(GEAR_TRIPLES);
  if (triples.length) {
    root.append(el('h4', {}, `Редкие комбинации трёх шестерёнок (${triples.length})`));
    root.append(el('p', { class: 'hint' }, 'Эти свойства не рождаются ни из одной пары: нужны три разные шестерни на карте, то есть редкость выше обычной. Тройка заменяет слабую парную версию того же свойства, а не складывается с ней.'));
    root.append(el('div', { class: 'triples' }, triples.map(([key, rec]) => {
      const kw = KEYWORDS[rec.kw];
      if (!kw) return null;
      const gears = key.split('+');
      return el('div', { class: 'triplecard' }, [
        el('div', { class: 'triplecard__g', html: gears.map((g) => gearSVG(g, 24)).join('') }),
        el('div', {}, [
          el('div', { class: 'triplecard__n', text: `✦ ${rec.alias || kw.name}${rec.lvl && rec.lvl > 1 ? ' ' + 'I'.repeat(rec.lvl) : ''}` }),
          el('div', { class: 'triplecard__gears', text: gears.map((g) => GEARS[g].name).join(' + ') }),
          el('div', { class: 'triplecard__t', text: kw.text }),
        ]),
      ]);
    }).filter(Boolean)));
  }

  // эпохи
  root.append(el('h4', {}, 'Эпохи'));
  root.append(el('table', { class: 'eratab' }, [
    el('tr', {}, ['Эпоха', 'HP лидера', 'Поле', 'Колода', 'Энергия', 'Добор', 'Рука'].map((h) => el('th', {}, h))),
    ...[1, 2, 3, 4, 5, 6].map((n) => {
      const e = eraOf(n);
      return el('tr', {}, [
        el('td', {}, `${ROMAN_ERA[n]} · ${e.name}`), el('td', {}, String(e.leaderHp)), el('td', {}, String(e.slots)),
        el('td', {}, String(e.deckSize)), el('td', {}, `≤${e.energyCap}`), el('td', {}, String(e.draw)), el('td', {}, String(e.handLimit)),
      ]);
    }),
  ]));
  return root;
}
