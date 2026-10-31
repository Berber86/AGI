// Палитра и картинки «Кубик-картинка».
// Палитру легко поправить под реальные кубики ребёнка: hue — оттенок (0–360),
// как его видит камера телефона; fill — цвет кубика на экране.

export const PALETTE = {
  R: { name: 'красный', hue: 355, fill: '#e8322f', dark: '#a8181a', light: '#ff7a6b' },
  O: { name: 'оранжевый', hue: 24, fill: '#ff8a1c', dark: '#c25700', light: '#ffbd70' },
  Y: { name: 'жёлтый', hue: 52, fill: '#ffd21f', dark: '#c99a00', light: '#fff07a' },
  G: { name: 'зелёный', hue: 125, fill: '#2fb84a', dark: '#17802c', light: '#7de38d' },
  B: { name: 'синий', hue: 215, fill: '#2f6ff0', dark: '#1a44a8', light: '#7eaaff' },
  P: { name: 'фиолетовый', hue: 285, fill: '#9b4fd6', dark: '#62289a', light: '#cf9bf5' },
};

// '.' — пустая клетка. Строки одинаковой длины; у каждой строки и столбца
// есть хотя бы один кубик (рамка картинки плотная — так её проще узнать на фото).
// Не больше 4 кубиков одного цвета на картинку.
export const PICTURES = [
  { id: 'traffic', emoji: '🚦', anim: 'traffic', rows: ['R', 'Y', 'G'] },
  { id: 'snake', emoji: '🐍', anim: 'snake', rows: ['G..', 'GGY'], chain: [[0, 0], [1, 0], [1, 1], [1, 2]] },
  { id: 'flower', emoji: '🌷', anim: 'flower', rows: ['.R.', 'RYR', '.G.'] },
  { id: 'rocket', emoji: '🚀', anim: 'rocket', rows: ['.R.', '.B.', 'PBP', '.O.'] },
  { id: 'fish', emoji: '🐟', anim: 'fish', rows: ['B.O.', '.OOP', 'B.O.'] },
  { id: 'car', emoji: '🚗', anim: 'car', rows: ['.BB.', 'RRRY', 'P..P'] },
  { id: 'house', emoji: '🏠', anim: 'house', rows: ['.R.', 'RRR', 'YBY', 'G.G'] },
  { id: 'butterfly', emoji: '🦋', anim: 'butterfly', rows: ['O.O', 'OBO', 'PBP', 'P.P'] },
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
  return Object.keys(PALETTE).filter((k) => counts[k]).map((k) => [k, counts[k]]);
}
