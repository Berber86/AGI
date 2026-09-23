/**
 * Сохранение забега.
 *
 * Забег — обычные данные: ни функций, ни живого ГПСЧ в нём нет (поток
 * случайностей задаётся зерном `seed` и счётчиком `rngState`, а каждый узел
 * получает собственное подзерно через nodeRng). Поэтому сохранение сводится к
 * честной копии и проверке того, что прочитанное действительно забег.
 *
 * Сохраняться можно только ВНЕ боя. Бой — отдельный объект с тиками, статусами
 * и собственным зерном; вытаскивать его из середины перестрелки значило бы
 * либо потерять состояние, либо дать игроку кнопку «переиграть бросок».
 * Поэтому бой не сохраняется, а интерфейс гасит кнопку сохранения в бою.
 */

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'shipyard-of-bones:save:v1';

/** Хранилище по умолчанию: в браузере localStorage, в Node — пусто. */
function defaultStorage() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  } catch {
    // доступ к localStorage может быть запрещён (приватный режим) — тогда
    // сохранение просто недоступно, игра остаётся играбельной
  }
  return null;
}

/**
 * Забег → переносимый объект.
 * Копия снимается через JSON: это отделяет сохранение от живых объектов,
 * которые интерфейс ещё может менять, и сразу отсеивает несериализуемое.
 */
export function serializeRun(run) {
  const copy = JSON.parse(JSON.stringify(run));
  return { v: SAVE_VERSION, savedAt: Date.now(), run: copy };
}

export function saveToString(run) {
  return JSON.stringify(serializeRun(run));
}

/**
 * Проверка того, что прочитанное похоже на забег, а не на мусор.
 * Возвращает список причин; пустой список — значит годится.
 */
export function validateSave(data) {
  const problems = [];
  if (!data || typeof data !== 'object') return ['Сохранение не является объектом.'];
  if (data.v !== SAVE_VERSION) problems.push(`Версия сохранения ${data.v}, игра ждёт ${SAVE_VERSION}.`);
  const run = data.run;
  if (!run || typeof run !== 'object') { problems.push('В сохранении нет забега.'); return problems; }
  if (typeof run.seed !== 'string') problems.push('Нет зерна забега.');
  if (!Number.isFinite(run.lives)) problems.push('Нет счётчика жизней.');
  if (!Array.isArray(run.fleet) || !run.fleet.length) problems.push('Флот пуст или отсутствует.');
  for (const ship of run.fleet || []) {
    if (!ship || typeof ship !== 'object') { problems.push('Корабль флота повреждён.'); break; }
    if (!ship.hullKey) problems.push(`У корабля ${ship.name || 'без имени'} нет класса корпуса.`);
    if (!ship.installed || typeof ship.installed !== 'object') problems.push(`У корабля ${ship.name || 'без имени'} нет слотов.`);
    if (!Array.isArray(ship.cargo)) ship.cargo = [];
  }
  if (!run.map || !Array.isArray(run.map.nodes) || !run.map.nodes.length) problems.push('Карта сектора отсутствует.');
  if (!run.trophies || typeof run.trophies !== 'object') run && (run.trophies = { battles: 0, wins: 0, losses: 0, retreats: 0, modules: 0, enchants: 0, enchantFails: 0, salvaged: 0, wrecks: 0, bestSector: 1 });
  if (!Array.isArray(run.log)) run && (run.log = []);
  return problems;
}

/**
 * Строка → забег.
 * @returns {{ok:true, run:object, savedAt:number}|{ok:false, reason:string}}
 */
export function loadFromString(text) {
  if (!text) return { ok: false, reason: 'Сохранение пустое.' };
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'Сохранение повреждено: не читается как JSON.' };
  }
  const problems = validateSave(data);
  if (problems.length) return { ok: false, reason: problems[0] };
  return { ok: true, run: data.run, savedAt: data.savedAt || 0 };
}

/**
 * Короткая сводка для экрана «Продолжить»: что это за забег и когда сохранён.
 * Полный забег при этом не разбирается — сводка нужна до решения игрока.
 */
export function saveSummary(data) {
  if (!data || !data.run) return null;
  const run = data.run;
  const ship = run.fleet && run.fleet[0];
  return {
    savedAt: data.savedAt || 0,
    seed: run.seed,
    shipName: ship ? ship.name : '—',
    hullKey: ship ? ship.hullKey : '—',
    fleetSize: Array.isArray(run.fleet) ? run.fleet.length : 0,
    sector: run.sector,
    lives: run.lives,
    parts: run.parts,
    nodes: run.clearedTotal || 0,
    over: run.over || null,
  };
}

/**
 * Записать забег в хранилище.
 * @returns {{ok:true, bytes:number}|{ok:false, reason:string}}
 */
export function saveToStorage(run, storage = defaultStorage()) {
  if (!storage) return { ok: false, reason: 'Хранилище недоступно: браузер не даёт сохранить забег.' };
  const text = saveToString(run);
  try {
    storage.setItem(SAVE_KEY, text);
  } catch (err) {
    return { ok: false, reason: `Сохранение не поместилось: ${err && err.name ? err.name : err}` };
  }
  return { ok: true, bytes: text.length };
}

/** Прочитать забег из хранилища. */
export function loadFromStorage(storage = defaultStorage()) {
  if (!storage) return { ok: false, reason: 'Хранилище недоступно.' };
  let text = null;
  try {
    text = storage.getItem(SAVE_KEY);
  } catch {
    return { ok: false, reason: 'Хранилище не отвечает.' };
  }
  return loadFromString(text);
}

/** Сводка сохранённого забега без его разбора — для экрана заставки. */
export function peekSave(storage = defaultStorage()) {
  if (!storage) return null;
  try {
    const text = storage.getItem(SAVE_KEY);
    if (!text) return null;
    return saveSummary(JSON.parse(text));
  } catch {
    return null;
  }
}

export function hasSave(storage = defaultStorage()) {
  if (!storage) return false;
  try {
    return Boolean(storage.getItem(SAVE_KEY));
  } catch {
    return false;
  }
}

export function clearSave(storage = defaultStorage()) {
  if (!storage) return false;
  try {
    storage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
