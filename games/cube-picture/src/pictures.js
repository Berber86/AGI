// Палитра и картинки «Кубик-картинка».
//
// Палитра снята с фото настоящих кубиков (2026-10-31, комнатный тёплый свет).
// rel — цвет грани кубика ОТНОСИТЕЛЬНО белого фона (бумага/простыня = 1,1,1) по каналам R,G,B.
// Так распознавание не зависит от яркости и тёплого/холодного света: важно только, чем кубик
// отличается от фона. fill/dark/light — цвета кубика на экране.
// twin: при широком допуске засчитывается за этот цвет картинки.
// decoy: цвет есть в наборе, но в картинках не используется — игра его узнаёт, чтобы
// при строгом допуске голубой вместо синего или сиреневый вместо фиолетового НЕ засчитывались.

export const PALETTE = {
  Y: { name: 'жёлтый', rel: [1.152, 0.879, 0.391], fill: '#f5c63c', dark: '#b88a0e', light: '#ffe58a' },
  R: { name: 'красный', rel: [1.117, 0.536, 0.601], fill: '#ef5b5b', dark: '#b0303a', light: '#ff9a92' },
  K: { name: 'розовый', rel: [0.972, 0.479, 0.667], fill: '#e0508e', dark: '#a02a62', light: '#ff8fc0' },
  P: { name: 'фиолетовый', rel: [0.607, 0.457, 0.652], fill: '#8455a8', dark: '#56307a', light: '#b58ad8' },
  G: { name: 'зелёный', rel: [0.4, 0.521, 0.471], fill: '#2f8a4e', dark: '#195a30', light: '#6cc48a' },
  B: { name: 'синий', rel: [0.297, 0.371, 0.616], fill: '#3456b8', dark: '#1d3278', light: '#7a96e8' },
  C: { name: 'голубой', rel: [0.421, 0.629, 0.862], fill: '#5d9be0', dark: '#3a6aa8', light: '#a8d0ff', decoy: true, twin: 'B' },
  L: { name: 'сиреневый', rel: [0.931, 0.786, 0.942], fill: '#d9b3dc', dark: '#a883ab', light: '#f3e0f4', decoy: true, twin: 'P' },
};

export const PLAY_COLORS = Object.keys(PALETTE).filter((k) => !PALETTE[k].decoy);

// '.' — пустая клетка. Строки одинаковой длины; у каждой строки и столбца есть хотя бы
// один кубик (рамка картинки плотная — так её проще узнать на фото).
// Кубиков каждого цвета у ребёнка 2–3, поэтому в картинке не больше 2 одного цвета.
export const MAX_PER_COLOR = 2;

export const PICTURES = [
  { id: 'traffic', emoji: '🚦', anim: 'traffic', rows: ['R', 'Y', 'G'] },
  { id: 'snake', emoji: '🐍', anim: 'snake', rows: ['G..', 'GPY'], chain: [[0, 0], [1, 0], [1, 1], [1, 2]] },
  { id: 'flower', emoji: '🌷', anim: 'flower', rows: ['.R.', 'KYK', '.G.'] },
  { id: 'rocket', emoji: '🚀', anim: 'rocket', rows: ['.R.', '.B.', 'PBP', '.Y.'] },
  { id: 'fish', emoji: '🐟', anim: 'fish', rows: ['B.R.', '.KYP', 'B.R.'] },
  { id: 'car', emoji: '🚗', anim: 'car', rows: ['.BB.', 'KRRY', 'P..P'] },
  { id: 'house', emoji: '🏠', anim: 'house', rows: ['.K.', 'RKR', 'YBY', 'G.G'] },
  { id: 'butterfly', emoji: '🦋', anim: 'butterfly', rows: ['K.K', 'RBR', 'PBP', 'Y.Y'] },
];

export function grid(picture) {
  return picture.rows.map((row) => [...row].map((ch) => (ch === '.' ? null : ch)));
}

export function cubeCount(picture) {
  return picture.rows.join('').replace(/\./g, '').length;
}

export function colorCounts(picture) {
  const counts = {};
  for (const ch of picture.rows.join('')) if (ch !== '.') counts[ch] = (counts[ch] || 0) + 1;
  return [...Object.keys(PALETTE), '*'].filter((k) => counts[k]).map((k) => [k, counts[k]]);
}

/** Режим «форма»: та же картинка, все кубики — «любого цвета» ('*'). */
export function asShape(picture) {
  return { ...picture, rows: picture.rows.map((r) => r.replace(/[^.]/g, '*')) };
}

/**
 * Картинка в цветах, из которых её собрал ребёнок (режим «форма»): cells — клетки результата
 * проверки (src — клетка образца, got — увиденный цвет). Неузнанный цвет — цвет образца.
 */
export function coloredBy(picture, cells) {
  const rows = picture.rows.map((r) => [...r]);
  for (const cell of cells || []) {
    if (!cell.src || !cell.want || !cell.got) continue;
    const [r, c] = cell.src;
    if (PALETTE[cell.got]) rows[r][c] = cell.got;
  }
  return { ...picture, rows: rows.map((r) => r.join('')), roles: picture.rows.map((r) => [...r]) };
}
