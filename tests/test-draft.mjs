// Драфт свойств: пул кандидатов, выбор игрока, цена выбора, политика соперников.
import { suite, test, ok, eq, ne, ge, le } from './harness.mjs';
import {
  generateCard, candidatePool, selectKeywords, candidateId, compatible,
} from '../src/engine/cardgen.js';
import { newGame, craft, recraft, recruit, recraftCost } from '../src/engine/state.js';
import { draftForRival, FX_PROFILE, PERSONALITY_IDS } from '../src/engine/civ.js';
import { DISCOVERY_LIST } from '../src/engine/discoveries.js';

suite('Драфт свойств: пул и выбор');

const THREE = ['steel', 'automata', 'telegraph'];
const TWO = ['fire_mastery', 'wheel'];

test('пул кандидатов превышает потолок — выбирать есть из чего', () => {
  const p = candidatePool(THREE);
  ok(p.ok, p.reason || 'пул должен собраться');
  eq(p.kwCap, 3, 'редкая карта: потолок 3');
  ge(p.candidates.length, p.kwCap + 1, 'пул обязан быть больше потолка');
});

test('каждый кандидат несёт устойчивую метку и описание', () => {
  const p = candidatePool(THREE);
  for (const c of p.candidates) {
    ok(typeof c.id === 'string' && c.id.includes('|'), 'метка вида kw|from: ' + c.id);
    eq(c.id, candidateId(c), 'метка воспроизводима');
    ok(c.name && c.text, 'у свойства есть имя и текст');
    ok(Number.isFinite(c.value), 'ценность числовая');
  }
  const ids = p.candidates.map((c) => c.id);
  eq(new Set(ids).size, ids.length, 'метки кандидатов не должны повторяться');
});

test('несобираемый набор возвращает причину, а не пустой пул', () => {
  const all = DISCOVERY_LIST.map((d) => d.id);
  let pair = null;
  for (let i = 0; i < all.length && !pair; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (!compatible(all[i], all[j])) { pair = [all[i], all[j]]; break; }
    }
  }
  ok(pair, 'в данных обязана быть хотя бы одна несовместимая пара');
  const p = candidatePool(pair);
  eq(p.ok, false);
  ok(typeof p.reason === 'string' && p.reason.length > 3, 'причина объясняет отказ: ' + p.reason);
  eq(generateCard(pair), null, 'карта из несобираемого набора не создаётся');
});

test('драфт ставит ровно выбранные свойства', () => {
  const p = candidatePool(THREE);
  const want = [p.candidates[p.candidates.length - 1].id, p.candidates[0].id];
  const bp = generateCard(THREE, { draft: want });
  eq(bp.keywords.length, 2);
  const got = bp.keywords.map((k) => candidateId(k)).sort();
  eq(got.join(','), want.slice().sort().join(','), 'выбор игрока обязан соблюдаться дословно');
  eq(bp.drafted, true, 'карта помечена как собранная драфтом');
});

test('неизвестные метки игнорируются, а не ломают карту', () => {
  const p = candidatePool(THREE);
  const good = p.candidates[0].id;
  const bp = generateCard(THREE, { draft: [good, 'нет|такого', ''] });
  eq(bp.keywords.length, 1);
  eq(bp.keywords[0].name, p.candidates[0].name);
});

test('потолок не пробивается, даже если запросить весь пул', () => {
  const p = candidatePool(THREE);
  const bp = generateCard(THREE, { draft: p.candidates.map((c) => c.id) });
  le(bp.keywords.length, p.kwCap, 'свойств не больше потолка');
});

test('пустой драфт — осознанная карта без свойств, а не откат к авто', () => {
  const bp = generateCard(THREE, { draft: [] });
  eq(bp.keywords.length, 0, 'игрок вправе собрать «голый» корпус');
  eq(bp.drafted, true, 'пустой выбор тоже считается решением');
  eq(bp.spareSlots, 3, 'все слоты остались пустыми');
  ok(typeof bp.blurb === 'string' && bp.blurb.length > 0, 'карта без свойств всё равно описана');
});

test('драфт детерминирован: тот же выбор — та же карта', () => {
  const p = candidatePool(THREE);
  const want = p.candidates.slice(0, 2).map((c) => c.id);
  const a = generateCard(THREE, { draft: want });
  const b = generateCard(THREE, { draft: want });
  eq(JSON.stringify(a.keywords), JSON.stringify(b.keywords));
  eq(a.cost, b.cost);
  eq(a.atk + '/' + a.hp, b.atk + '/' + b.hp);
});

test('меньше свойств — дешевле в энергии: размен настоящий', () => {
  const p = candidatePool(THREE);
  const auto = generateCard(THREE);
  const one = generateCard(THREE, { draft: [p.candidates[0].id] });
  const none = generateCard(THREE, { draft: [] });
  le(one.cost, auto.cost, 'одно свойство не дороже авто-набора');
  le(none.cost, one.cost, 'пустая карта не дороже односвойственной');
  ok(none.cost < auto.cost, 'цена выбора должна быть заметной: пусто ' + none.cost + '⚡ против авто ' + auto.cost + '⚡');
});

test('авто-подбор без драфта заполняет потолок (прежнее поведение)', () => {
  const p = candidatePool(THREE);
  const bp = generateCard(THREE);
  eq(bp.drafted, false);
  eq(bp.draft, null);
  eq(bp.keywords.length, p.kwCap, 'генератор берёт максимум доступного');
  eq(bp.spareSlots, 0);
});

test('selectKeywords усиливает повтор свойства, а не дублирует его', () => {
  const p = candidatePool(THREE);
  const dup = { ...p.candidates[0], from: 'другая+пара' };
  const chosen = selectKeywords([p.candidates[0], dup], 2, null);
  eq(chosen.length, 1, 'одно свойство на карту, даже если его дали две пары');
  ge(chosen[0].lvl, 2, 'повтор превращается в уровень');
});

suite('Драфт свойств: мастерская и перековка');

function mkState() {
  const st = newGame({ seed: 'draft-test' });
  for (const id of THREE) if (!st.researched.includes(id)) st.researched.push(id);
  st.materials = 5000;
  return st;
}

test('craft сохраняет выбранные свойства в чертеже', () => {
  const st = mkState();
  const p = candidatePool(THREE);
  const want = [p.candidates[1].id];
  const r = craft(st, THREE, want);
  ok(r.ok, r.reason || 'крафт должен пройти');
  const bp = st.blueprints[r.bp.key];
  eq(bp.drafted, true);
  eq(bp.keywords.length, 1);
  eq(bp.keywords[0].name, p.candidates[1].name);
});

test('recraft меняет свойства и берёт плату за переработку', () => {
  const st = mkState();
  const p = candidatePool(THREE);
  craft(st, THREE, []);
  const key = [...THREE].sort().join('+');
  const before = st.materials;
  const r = recraft(st, key, p.candidates.slice(0, 3).map((c) => c.id));
  ok(r.ok, r.reason || 'перековка должна пройти');
  eq(st.blueprints[key].keywords.length, 3, 'свойства пересобраны');
  eq(before - st.materials, r.fee, 'взята ровно объявленная плата');
  ge(r.fee, 1, 'перековка не бесплатна');
  ge(st.stats.recrafted, 1, 'перековка учтена в статистике');
});

test('плата за перековку не зависит от числа свойств', () => {
  // Стоимость проекта определяется открытиями и слотами; ценой свойства служит
  // энергия. Если бы плата зависела от свойств, экономика найма поехала бы вслед.
  const st = mkState();
  const p = candidatePool(THREE);
  craft(st, THREE, []);
  const key = [...THREE].sort().join('+');
  const a = recraft(st, key, p.candidates.slice(0, 3).map((c) => c.id));
  const b = recraft(st, key, []);
  eq(a.fee, b.fee, 'одинаковая плата за переработку чертежа');
});

test('recraft не даёт уйти в минус по материалам', () => {
  const st = mkState();
  const p = candidatePool(THREE);
  craft(st, THREE, []);
  const key = [...THREE].sort().join('+');
  st.materials = 0;
  const r = recraft(st, key, p.candidates.slice(0, 3).map((c) => c.id));
  eq(r.ok, false, 'без материалов удорожание невозможно');
  ok(/материал/i.test(r.reason), 'причина про материалы: ' + r.reason);
  eq(st.blueprints[key].keywords.length, 0, 'чертёж не изменился');
});

test('recraft несуществующего проекта отклоняется', () => {
  const st = mkState();
  const r = recraft(st, 'нет+такого', []);
  eq(r.ok, false);
});

test('нанятые юниты сохраняют прежний чертёж после перековки', () => {
  const st = mkState();
  const p = candidatePool(THREE);
  craft(st, THREE, []);
  const key = [...THREE].sort().join('+');
  const rec = recruit(st, key, 1);
  ok(rec.ok, rec.reason || 'найм должен пройти');
  const unit = rec.units[0];
  eq(unit.blueprint.keywords.length, 0, 'юнит собран без свойств');
  recraft(st, key, p.candidates.slice(0, 3).map((c) => c.id));
  eq(unit.blueprint.keywords.length, 0, 'уже собранный юнит не меняется задним числом');
  eq(st.blueprints[key].keywords.length, 3, 'а чертёж — новый');
});

suite('Драфт свойств: соперники');

test('FX_PROFILE покрывает весь словарь свойств движка', () => {
  const all = DISCOVERY_LIST.map((d) => d.id);
  const vocab = new Set();
  for (let i = 0; i < all.length; i++) {
    for (const slots of [1, 2, 3, 4]) {
      const cs = [];
      for (let s = 0; s < slots; s++) {
        const cand = all.filter((id) => cs.every((x) => compatible(x, id)) && cs.filter((x) => x === id).length < 2);
        if (!cand.length) break;
        cs.push(cand[(i * 31 + s * 17) % cand.length]);
      }
      if (cs.length !== slots) continue;
      const p = candidatePool(cs);
      if (p.ok) for (const c of p.candidates) vocab.add(c.fx);
    }
  }
  ge(vocab.size, 40, 'словарь свойств должен быть большим');
  for (const fx of vocab) {
    const row = FX_PROFILE[fx];
    ok(Array.isArray(row), `свойство ${fx} обязано иметь предпочтения личностей`);
    eq(row.length, 4, `${fx}: по весу на каждую из четырёх личностей`);
    for (const v of row) ok(Number.isFinite(v), `${fx}: веса числовые`);
  }
  for (const fx of Object.keys(FX_PROFILE)) ok(vocab.has(fx), `запись ${fx} не соответствует ни одному свойству движка`);
});

test('draftForRival возвращает метки из пула и не превышает потолок', () => {
  const p = candidatePool(THREE);
  for (const pers of PERSONALITY_IDS) {
    const d = draftForRival(THREE, pers);
    ok(Array.isArray(d), `${pers}: драфт обязателен`);
    le(d.length, p.kwCap, `${pers}: не больше потолка`);
    for (const id of d) ok(p.candidates.some((c) => c.id === id), `${pers}: метка ${id} из пула`);
    eq(new Set(d).size, d.length, `${pers}: метки без повторов`);
  }
});

test('личности выбирают разные свойства из одного набора', () => {
  const drafts = {};
  for (const pers of PERSONALITY_IDS) drafts[pers] = draftForRival(THREE, pers).join(',');
  ne(drafts.aggro, drafts.control, 'агрессия и контроль не могут собирать одно и то же');
  const uniq = new Set(Object.values(drafts));
  ge(uniq.size, 3, 'хотя бы три личности из четырёх выбирают по-своему');
});

test('драфт соперника детерминирован', () => {
  eq(draftForRival(THREE, 'control').join(','), draftForRival(THREE, 'control').join(','));
});

test('неизвестная личность получает осмысленный драфт, а не пустой', () => {
  const d = draftForRival(TWO, 'несуществующая');
  ok(Array.isArray(d) && d.length > 0, 'откат к середине не должен обнулять карту');
});
