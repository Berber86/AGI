/**
 * Трофеи после победы.
 *
 * По каждому модулю видно и шанс, и выпавшее число: игрок должен понимать,
 * что трофей сгорел не «назло», а потому что в обломки влито лишнего. Рядом —
 * предложение забрать корпус противника себе: дешевле верфи, но побитым и с
 * чужой сборкой, которую можно переставить или сдать на запчасти.
 */

import { takeLoot, cargoSpace, captureWreck, CARGO_LIMIT, cargo, flagship } from '../../engine/run.js';
import { HULLS, slotList } from '../../engine/ship.js';
import { rarityOf, moduleScore } from '../../engine/modules.js';
import { h, num, pct, moduleEl } from '../dom.js';

export function renderLoot({ app, state }) {
  const run = state.run;
  const loot = run.pendingLoot;
  const capture = run.pendingCapture;
  const boss = Boolean(state.payload && state.payload.boss);

  if (!loot) {
    return h('div', { class: 'card' },
      h('h2', { class: 'title-line', text: 'Трофеев нет' }),
      h('p', { class: 'hint', text: 'Обломки пусты или бой не был выигран.' }),
      h('button', { class: 'btn btn--primary', type: 'button', text: 'К карте', on: { click: () => app.leaveLootAndAdvance({ boss }) } }),
    );
  }

  const picked = new Set(state.lootPicked || []);
  state.lootPicked = picked;

  const space = cargoSpace(run);
  const used = CARGO_LIMIT - space;

  const grid = h('div', { class: 'module-grid' });
  const burnedGrid = h('div', { class: 'module-grid' });
  const meterFill = h('div', { class: `cargo-meter__fill${used + picked.size >= CARGO_LIMIT ? ' cargo-meter__fill--full' : ''}`, style: { width: `${Math.min(100, ((used + picked.size) / CARGO_LIMIT) * 100).toFixed(1)}%` } });
  const meterBar = h('div', { class: 'cargo-meter__bar' }, meterFill);
  const meterText = h('span', { text: `трюм ${used + picked.size} / ${CARGO_LIMIT}` });
  const takeBtn = h('button', { class: 'btn btn--primary', type: 'button', text: 'Взять' });

  function redraw() {
    const list = loot.candidates.slice().sort((a, b) => moduleRank(b.module) - moduleRank(a.module));
    grid.replaceChildren(...list.map((c) => {
      const isPicked = picked.has(c.module.uid);
      const over = !isPicked && picked.size >= space;
      return moduleEl(c.module, {
        selectable: true,
        picked: isPicked,
        meta: `шанс ${pct(c.chance)} · бросок ${pct(c.roll, 1)} → уцелел · с ${c.from}`,
        onPick: () => {
          if (isPicked) picked.delete(c.module.uid);
          else if (picked.size < space) picked.add(c.module.uid);
          else { app.toast(`В трюме нет места: ${CARGO_LIMIT} модулей. Сначала возьмите что-нибудь или сдайте на запчасти.`, 'bad'); return; }
          redraw();
        },
      });
    }));
    if (!list.length) grid.append(h('p', { class: 'hint', text: 'С обломков не снялось ни одного целого модуля.' }));

    burnedGrid.replaceChildren(...loot.burned.map((c) => moduleEl(c.module, {
      burned: true,
      meta: `шанс ${pct(c.chance)} · бросок ${pct(c.roll, 1)} → сгорел в обломках`,
    })));

    const count = picked.size;
    takeBtn.textContent = count ? `Взять ${count} ${plural(count, 'модуль', 'модуля', 'модулей')}` : 'Ничего не брать';
    meterText.textContent = `трюм ${used + count} / ${CARGO_LIMIT}`;
    meterFill.style.width = `${Math.min(100, ((used + count) / CARGO_LIMIT) * 100).toFixed(1)}%`;
    meterFill.className = `cargo-meter__fill${used + count >= CARGO_LIMIT ? ' cargo-meter__fill--full' : ''}`;
    overHint.replaceChildren(...(used + count >= CARGO_LIMIT
      ? [h('span', { class: 'bad', text: 'Трюм забит: следующие трофеи взять некуда.' })]
      : [h('span', { text: `Свободных мест: ${space - count}` })]));
  }

  const overHint = h('span', { class: 'hint' });
  redraw();

  takeBtn.addEventListener('click', () => {
    const uids = [...picked];
    const out = takeLoot(run, uids);
    if (out.taken && out.taken.length) app.toast(`Взято модулей: ${out.taken.length}.`, 'good');
    if (out.refused && out.refused.length) app.toast(`Не влезло: ${out.refused.length}.`, 'bad');
    run.pendingLoot = null;
    state.lootPicked = null;
    app.leaveLootAndAdvance({ boss });
  });

  redraw();

  const captureCard = capture ? capturePanel(run, capture, app, boss) : null;

  return h('div', { class: 'stack' },
    h('div', { class: 'card' },
      h('h2', { class: 'title-line', text: boss ? 'Флагман сектора потоплен' : 'Обломки разобраны' }),
      h('p', { class: 'subtitle', text: `Запчастей +${loot.parts}${loot.bay ? ' · работал «Трофейный трюм» (+25% к шансу снятия)' : ''} · обломков ${loot.candidates.length + loot.burned.length}` }),
      h('div', { class: 'cargo-meter' }, meterBar, meterText, overHint),
    ),

    h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: `Уцелевшие модули · ${loot.candidates.length}` }),
      h('p', { class: 'hint', text: 'Отсортированы по счёту. Клик — взять или вернуть; мест в трюме ограниченно.' }),
      grid,
      h('div', { class: 'row row--end', style: { marginTop: '12px' } },
        h('button', { class: 'btn btn--ghost', type: 'button', text: 'Оставить всё', on: { click: () => { run.pendingLoot = null; state.lootPicked = null; app.leaveLootAndAdvance({ boss }); } } }),
        takeBtn,
      ),
    ),

    loot.burned.length ? h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: `Сгорело в обломках · ${loot.burned.length}` }),
      h('p', { class: 'hint', text: 'Чем больше лишнего урона влито сверх смертельного порога, тем меньше целых модулей. Чистое убийство даёт чистый трофей.' }),
      burnedGrid,
    ) : null,

    captureCard,
  );
}

function capturePanel(run, cap, app, boss) {
  const ship = cap.ship;
  const affordable = run.parts >= cap.price;
  const fleetFull = run.fleet.length >= 3;
  return h('div', { class: 'card', style: { borderColor: 'var(--amber-dim)' } },
    h('h2', { class: 'card__title', text: 'Захватить корпус' }),
    h('div', { class: 'row row--between' },
      h('div', {},
        h('div', { class: 'ship-card__name', text: ship.name }),
        h('div', { class: 'ship-card__hull', text: `${HULLS[ship.hullKey].icon} ${HULLS[ship.hullKey].name} · ${slotList(ship).length} слотов · чужая сборка остаётся` }),
      ),
      h('div', { class: 'mono', style: { textAlign: 'right' } },
        h('div', { text: `цена ${cap.price} запчастей` }),
        h('div', { class: 'hint', text: `у вас ${num(run.parts)} · на верфи корпус стоит дороже` }),
      ),
    ),
    h('div', { class: 'row row--tight', style: { marginTop: '10px' } },
      h('button', {
        class: 'btn btn--primary',
        type: 'button',
        disabled: !affordable || fleetFull,
        text: fleetFull ? 'Флот полон' : affordable ? 'Отбуксировать во флот' : `Не хватает ${cap.price - run.parts}`,
        on: {
          click: () => {
            const out = captureWreck(run, ship);
            if (!out.ok) { app.toast(out.reason, 'bad'); return; }
            app.toast(`${ship.name} вошёл во флот: половина прочности, сборка на месте.`, 'good');
            run.pendingCapture = null;
            app.render();
          },
        },
      }),
      h('button', { class: 'btn btn--ghost', type: 'button', text: 'Оставить обломок', on: { click: () => { run.pendingCapture = null; app.render(); } } }),
    ),
  );
}

/**
 * Порядок в списке трофеев.
 *
 * Счёт берётся из движка (moduleScore), а не считается в интерфейсе заново:
 * переработка, автоподбор и трофеи обязаны ценить модуль одинаково, иначе
 * сортировка подсказывала бы игроку не то, что реально сильнее.
 */
function moduleRank(m) {
  return moduleScore(m) + (rarityOf(m).key === 'pristine' ? 0.05 : 0);
}

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
