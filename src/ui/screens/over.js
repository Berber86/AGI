/**
 * Итог забега.
 *
 * Счёт ведёт движок: все числа здесь — из runSummary, экран ничего не
 * пересчитывает и не «округляет в свою пользу». Кроме сухих итогов показываем
 * финальный флот и причину конца — игрок должен понимать, что именно его убило.
 */

import { runSummary } from '../../engine/run.js';
import { h, num, pct } from '../dom.js';

export function renderOver({ app, state }) {
  const run = state.run;
  const summary = (state.payload && state.payload.summary) || runSummary(run);
  const win = summary.win;

  const root = h('div', { class: 'over' });

  root.append(h('h1', { class: 'over__title ' + (win ? 'over__title--win' : 'over__title--loss'), text: win ? 'Сердцевина взята' : 'Флот потерян' }),
    h('p', { class: 'over__reason', text: summary.reason || (win ? 'Забег пройден.' : 'Забег окончен.') }),
    h('p', { class: 'hint', style: { marginBottom: '22px' }, text: win
      ? `Пройдено узлов: ${num(summary.cleared)}. Трюм вынес ${num(summary.trophies.modules || 0)} модулей.`
      : 'Каждое поражение стоило одной жизни из четырёх. Когда жизни кончаются, забег закрывается — но карта и сборка следующего начнутся с нуля.' }),
    h('div', { class: 'row', style: { justifyContent: 'center', marginBottom: '24px' } },
      h('button', {
        class: 'btn btn--primary',
        type: 'button',
        text: 'Новый забег',
        on: { click: () => { app.forgetSave(); app.go('title'); } },
      }),
      h('button', { class: 'btn btn--ghost', type: 'button', text: 'К заставке', on: { click: () => app.go('title') } }),
    ),
  );

  const t = summary.trophies || {};
  const trophy = (label, value) => h('div', { class: 'trophy' },
    h('div', { class: 'trophy__value', text: String(value) }),
    h('div', { class: 'trophy__label', text: label }));

  root.append(h('div', { class: 'trophies' },
    trophy('сектор', `${Math.min(3, summary.sector)} / 3`),
    trophy('узлов зачищено', num(summary.cleared)),
    trophy('жизней осталось', '♥'.repeat(Math.max(0, summary.lives)) || '—'),
    trophy('запчастей', num(summary.parts)),
    trophy('боёв', num(t.battles || 0)),
    trophy('побед', num(t.wins || 0)),
    trophy('поражений', num(t.losses || 0)),
    trophy('отходов', num(t.retreats || 0)),
    trophy('модулей добыто', num(t.modules || 0)),
    trophy('заточек', num(t.enchants || 0)),
    trophy('провалов заточки', num(t.enchantFails || 0)),
    trophy('разобрано', num(t.salvaged || 0)),
    trophy('корпусов захвачено', num(t.wrecks || 0)),
  ));

  root.append(h('p', { class: 'hint', style: { margin: '14px 0 26px' }, text: t.battles
    ? `Доля выигранных боёв: ${pct((t.wins || 0) / t.battles)}. Отход стоит 20% прочности флота, но сохраняет жизнь — это не поражение.`
    : 'Боев в этом забеге не было.' }));

  if (summary.fleet && summary.fleet.length) {
    root.append(h('div', { class: 'card', style: { textAlign: 'left' } },
      h('h3', { class: 'card__title', text: 'Чем кончил флот' }),
      h('div', { class: 'stack' }, summary.fleet.map((s) => h('div', {},
        h('div', { text: s.name }),
        h('div', { class: 'hint', style: { fontSize: '11.5px' }, text: `${s.hull} · прочность ${num(s.stats.hull)} · щит ${num(s.stats.shield)} · скорость ${num(s.stats.speed, 1)} · темп ${num(s.stats.rate, 2)} · броня ÷${num(s.stats.armorDiv, 2)} · урон ${num(s.stats.dmg)}–${num(s.stats.dmgMax)}` }),
      ))),
    ));
  }

  return root;
}
