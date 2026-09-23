// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/era-up.js
//  Смена эпохи — переломный момент партии: растёт здоровье лидера, поле, колода
//  и энергия. Показываем это отдельным экраном, а не тостом, чтобы игрок
//  понимал, ПОЧЕМУ следующие бои будут другими.
//  Модуль общий: его зовут и «Карта мира», и «Наука».
// =============================================================================

import { el, btn, modal } from './dom.js';
import { banner } from './fx.js';
import { eraOf, ROMAN_ERA, S, DOMAINS, DISCOVERY_LIST, DISCOVERIES } from './shared.js';

/**
 * Пытается сменить эпоху и, если вышло, празднует.
 * @returns {boolean} true, если эпоха действительно сменилась
 */
export function tryAdvanceEra(state, { onChange } = {}) {
  const from = state.era;
  const res = S.advanceEra(state);
  if (!res.ok) return { ok: false, reason: res.reason };
  banner(`ЭПОХА ${ROMAN_ERA[state.era]}`, eraOf(state.era).name, 'me', 1400);
  eraModal(state, from, state.era);
  if (onChange) onChange(state);
  return { ok: true };
}

export function eraModal(st, from, to) {
  const a = eraOf(from), b = eraOf(to);
  const row = (label, av, bv, hint) => el('div', { class: 'erarow' }, [
    el('span', { class: 'erarow__l', text: label }),
    el('span', { class: 'erarow__a', text: String(av) }),
    el('span', { class: 'erarow__arr', text: '→' }),
    el('span', { class: 'erarow__b', text: String(bv) }),
    hint ? el('span', { class: 'erarow__h dim', text: hint }) : null,
  ]);

  const unlocks = S.availableResearch(st).filter((d) => d.era === to);
  const soon = DISCOVERY_LIST.filter((d) => d.era === to && !st.researched.includes(d.id));
  const list = unlocks.length ? unlocks : soon;

  const body = el('div', { class: 'eraup' }, [
    el('div', { class: 'eraup__head' }, [
      el('div', { class: 'eraup__n', text: ROMAN_ERA[to] }),
      el('div', {}, [
        el('b', {}, b.name),
        el('div', { class: 'dim small' }, `вы покинули эпоху «${a.name}»`),
      ]),
    ]),
    el('div', { class: 'eraup__grid' }, [
      row('Здоровье лидера', a.leaderHp, b.leaderHp, `бои длиннее на ${Math.round((b.leaderHp / a.leaderHp - 1) * 100)}%`),
      row('Мест на поле', a.slots, b.slots, 'больше юнитов одновременно'),
      row('Размер колоды', a.deckSize, b.deckSize, `минимум ${Math.max(6, b.deckSize - 4)}`),
      row('Потолок энергии', a.energyCap, b.energyCap, 'дорогие карты стали играбельны'),
      row('Добор за ход', a.draw, b.draw, ''),
      row('Предел руки', a.handLimit, b.handLimit, ''),
      row('Множитель материалов', `×${a.mat}`, `×${b.mat}`, 'доход вырос'),
    ]),
    list.length ? el('div', { class: 'eraup__unlocks' }, [
      el('h4', {}, unlocks.length
        ? `Доступны к изучению (${unlocks.length})`
        : `Открытия эпохи ${ROMAN_ERA[to]} (${list.length})`),
      el('div', { class: 'eraup__list' }, list.slice(0, 16).map((d) => el('span', {
        class: 'unlock',
        title: `${DOMAINS[d.domain]?.name || ''} · шестерни: ${d.gears.join(', ')} · предшественники: ${d.prereq.length ? d.prereq.map((p) => DISCOVERIES[p]?.name || p).join(', ') : 'нет'}`,
      }, [
        el('b', {}, d.name),
        el('span', { class: 'dim' }, `${d.gears.length} шест.`),
      ]))),
    ]) : null,
    el('p', { class: 'hint' }, 'Колоду прошлой эпохи стоит пересобрать: лимит вырос, а ветераны сохранили опыт и звания. Новые открытия дают новые пары шестерёнок — загляните в Мастерскую.'),
  ]);
  const m = modal(`Эпоха ${ROMAN_ERA[to]} — ${b.name}`, body, {
    footer: [btn('Принять эпоху', () => m.close(), 'primary')],
  });
  return m;
}
