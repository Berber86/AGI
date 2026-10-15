export const ITEMS = [
  { id: 'camera', name: 'Смена-8М', subtitle: 'Плёночный фотоаппарат', era: 'ЛОМО · 1970-е', rarity: 'rare', description: 'Кто-то снимал на неё белые ночи. Кажется, затвор ещё работает.', weight: 6 },
  { id: 'teacup', name: 'Чашка с кобальтом', subtitle: 'Фарфор с золотой каймой', era: 'Ленинград · 1980-е', rarity: 'rare', description: 'Блюдце потерялось, а привычка пить чай красиво — нет.', weight: 7 },
  { id: 'watch', name: 'Часы «Ракета»', subtitle: 'Механические наручные часы', era: 'Петродворец · 1970-е', rarity: 'rare', description: 'Стрелки замерли без семи двенадцать. У каждого своё время.', weight: 5 },
  { id: 'cassette', name: 'Кассета «Белые ночи»', subtitle: 'Домашняя запись', era: 'Сторона А · 1991', rarity: 'ordinary', description: 'На наклейке выцветшие буквы. Саундтрек чьего-то лета.', weight: 11 },
  { id: 'duck', name: 'Фарфоровая уточка', subtitle: 'Маленькая статуэтка', era: 'Без клейма · XX век', rarity: 'ordinary', description: 'Пережила два переезда и один подоконник. Ищет третий.', weight: 9 },
  { id: 'book', name: 'Томик Блока', subtitle: 'Стихотворения', era: 'Лениздат · 1982', rarity: 'ordinary', description: 'Между страницами — запах старой бумаги. Петербург не отпускает.', weight: 10 },
  { id: 'key', name: 'Ключ от парадной', subtitle: 'Латунный ключ', era: 'Неизвестный адрес', rarity: 'ordinary', description: 'Тяжёлый, потёртый, совершенно бесполезный. Или нет?', weight: 10 },
  { id: 'badge', name: 'Значок «Ленинград»', subtitle: 'Эмаль и латунь', era: 'Сувенир · 1980-е', rarity: 'ordinary', description: 'Маленький кораблик на синей эмали. Город, который всегда с собой.', weight: 10 },
  { id: 'record', name: 'Пластинка «Мелодия»', subtitle: 'Винил, 33 оборота', era: 'Ленинградский завод', rarity: 'rare', description: 'Пара царапин не мешает хорошей музыке. Особенно в тишине.', weight: 6 },
  { id: 'perfume', name: 'Флакон духов', subtitle: 'Гранёное стекло', era: 'Винтаж · 1960-е', rarity: 'rare', description: 'На дне осталось немного янтарного света.', weight: 5 },
  { id: 'horse', name: 'Медный конёк', subtitle: 'Сувенирная фигурка', era: 'Безымянная мастерская', rarity: 'legendary', description: 'Не всадник, но тоже медный. Патина ему к лицу.', weight: 2 },
  { id: 'compass', name: 'Карманный компас', subtitle: 'Латунный корпус', era: 'Север всегда рядом', rarity: 'legendary', description: 'Теперь можно потеряться в этом городе чуть более осознанно.', weight: 3 },
  { id: 'bottle', name: 'Пустая бутылка', subtitle: 'Зелёное стекло', era: 'Хлам · стекло', rarity: 'junk', description: 'Ни записки, ни джинна. Просто очень петербургский оттенок зелёного.', weight: 13 },
  { id: 'can', name: 'Консервная банка', subtitle: 'Пустая, зато с крышкой', era: 'Хлам · металл', rarity: 'junk', description: 'Лучшее в этой банке уже случилось. Осталась форма.', weight: 13 },
  { id: 'cup', name: 'Мятый стаканчик', subtitle: 'Кофе закончился', era: 'Хлам · бумага', rarity: 'junk', description: 'Кто-то допил свой капучино и пошёл дальше.', weight: 12 },
  { id: 'box', name: 'Картонная коробка', subtitle: 'Слегка промокла', era: 'Хлам · картон', rarity: 'junk', description: 'Подарок внутри не обнаружен. Коробка тоже неплохая.', weight: 12 },
  { id: 'lid', name: 'Ржавая крышка', subtitle: 'От неизвестной банки', era: 'Хлам · жесть', rarity: 'junk', description: 'Небольшой круговорот ржавчины в природе.', weight: 12 },
  { id: 'paper', name: 'Старая газета', subtitle: 'Вчерашние новости', era: 'Хлам · бумага', rarity: 'junk', description: 'Прогноз обещал дождь. В этом городе трудно ошибиться.', weight: 12 },
];
export const RARITY = { ordinary: { label: 'Обычная находка', color: '#c5d2c1' }, rare: { label: 'Редкая находка', color: '#b8dbee' }, legendary: { label: 'Особая находка', color: '#e8c789' }, junk: { label: 'Самый обычный хлам', color: '#bcb6aa' } };
export const SAVE_KEY = 'white-night-finds-v1';
export function initialState(saved = {}) {
  return { phase: 'search', taps: 0, current: null, reviewing: false, collection: [...new Set((Array.isArray(saved.collection) ? saved.collection : []).filter(id => ITEMS.some(i => i.id === id)))], searches: Number.isSafeInteger(saved.searches) && saved.searches >= 0 ? saved.searches : 0, lastKept: Array.isArray(saved.lastKept) ? saved.lastKept.filter(id => ITEMS.some(i => i.id === id)).slice(0, 3) : [] };
}
export function chooseItem(random = Math.random) {
  let value = Math.max(0, Math.min(.999999, random())) * ITEMS.reduce((sum, item) => sum + item.weight, 0);
  return ITEMS.find(item => (value -= item.weight) < 0) ?? ITEMS.at(-1);
}
export function transition(state, action) {
  if (action.type === 'reset') return initialState();
  if (action.type === 'tap' && state.phase === 'search') {
    if (state.taps < 2) return { ...state, taps: state.taps + 1 };
    const id = ITEMS.some(i => i.id === action.itemId) ? action.itemId : ITEMS[0].id;
    return { ...state, taps: 0, current: id, reviewing: false, phase: 'inspect', searches: state.searches + 1 };
  }
  if (action.type === 'review' && state.collection.includes(action.id)) return { ...state, phase: 'inspect', current: action.id, reviewing: true };
  if (state.phase === 'inspect' && ['keep','discard','close'].includes(action.type)) {
    const kept = action.type === 'keep' && !state.reviewing;
    return { ...state, phase: 'search', current: null, reviewing: false, collection: kept ? [...new Set([...state.collection, state.current])] : state.collection, lastKept: kept ? [state.current, ...state.lastKept.filter(i => i !== state.current)].slice(0,3) : state.lastKept };
  }
  return state;
}
export function loadSave(storage) { try { const raw = JSON.parse(storage.getItem(SAVE_KEY) || '{}'); return initialState(raw?.version === 1 ? raw : {}); } catch { return initialState(); } }
export function saveState(storage, state) { try { storage.setItem(SAVE_KEY, JSON.stringify({ version: 1, collection: state.collection, searches: state.searches, lastKept: state.lastKept })); return true; } catch { return false; } }
