/**
 * Экран аномалии: событие с выбором.
 *
 * Варианты показывают подпись риска словами движка («60% эталонный модуль,
 * 40% брак и пробоина»), потому что честная сделка возможна только когда
 * игрок видит обе стороны. Исход тоже показывается здесь же: событие
 * закрывается, но текст результата остаётся на экране до ухода на карту.
 */

import { anomalyChoices, resolveAnomaly, startAmbush } from '../../engine/run.js';
import { h, num } from '../dom.js';

export function renderEvent({ app, state }) {
  const run = state.run;
  const anomaly = run.pendingAnomaly;
  const ui = state.eventUi = state.eventUi || { result: null };

  if (!anomaly && !ui.result) {
    return h('div', { class: 'card' },
      h('h2', { class: 'title-line', text: 'Событие закрыто' }),
      h('p', { class: 'hint', text: 'Аномалия уже разрешена.' }),
      h('button', { class: 'btn btn--primary', type: 'button', text: 'К карте', on: { click: () => { state.eventUi = null; app.go('map'); } } }),
    );
  }

  if (ui.result) {
    const out = ui.result;
    return h('div', { class: 'card' },
      h('h2', { class: 'title-line', text: out.ok ? 'Исход события' : 'Не вышло' }),
      h('p', { class: 'subtitle', text: out.ok ? out.text : out.reason }),
      h('div', { class: 'row row--end' },
        h('button', {
          class: 'btn btn--primary',
          type: 'button',
          text: 'К карте',
          on: {
            click: () => {
              state.eventUi = null;
              app.go('map');
            },
          },
        }),
      ),
    );
  }

  const opts = anomalyChoices(run, anomaly);

  return h('div', { class: 'stack' },
    h('div', { class: 'card' },
      h('h2', { class: 'title-line', text: `${anomaly.icon || '✷'} ${anomaly.name}` }),
      h('p', { class: 'subtitle', text: anomaly.text }),
      h('div', { class: 'stack' }, opts.map((c) => h('button', {
        class: 'btn btn--wide',
        type: 'button',
        style: { justifyContent: 'flex-start', textAlign: 'left' },
        on: {
          click: () => {
            const out = resolveAnomaly(run, c.index);
            if (out.battle) {
              // «Ограбить» ведёт в засаду: событие закрыто, начинается бой.
              state.eventUi = null;
              state.battle = startAmbush(run, out.battle.tier);
              state.battleUi = { targetUid: null };
              app.go('battle');
              return;
            }
            ui.result = out;
            app.render();
          },
        },
      },
      h('span', {}, c.label),
      h('span', { class: 'btn__hint', text: c.hint || '' }),
      ))),
    ),
    h('div', { class: 'card' },
      h('h3', { class: 'card__title', text: 'Чем вы рискуете' }),
      h('p', { class: 'hint', text: `Флот: ${run.fleet.length} ${run.fleet.length === 1 ? 'корабль' : 'корабля'} · запчастей ${num(run.parts)} · жизней ${run.lives}. Прочность при неудаче не восстанавливается сама: чинят доки и победа.` }),
    ),
  );
}
