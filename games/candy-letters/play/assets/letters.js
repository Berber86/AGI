/**
 * Данные букв игры «Сладкие буквы».
 *
 * Каждый штрих описан в условном квадрате 100×100 (x вправо, y вниз — как в canvas),
 * чтобы одну и ту же геометрию можно было рисовать и в вафельной клетке, и на леденце.
 * Порядок штрихов в массиве = порядок обводки, который показываем ребёнку.
 *
 * Команды пути:
 *   ['M', x, y]                    — начать штрих
 *   ['L', x, y]                    — прямая
 *   ['Q', cx, cy, x, y]            — квадратичная кривая
 *   ['C', c1x, c1y, c2x, c2y, x, y] — кубическая кривая
 *   ['Z']                          — замкнуть
 */

export const BOARD = 100;

export const LETTERS = [
  {
    id: 'а',
    upper: 'А',
    lower: 'а',
    sound: 'А',
    speak: 'Ааа',
    praise: 'Буква А',
    flavor: 'Яблоко',
    color: '#ff5d73',
    colorDeep: '#c62746',
    highlight: '#ffd0d8',
    word: 'Арбуз',
    strokes: [
      { hint: 'Горка вверх', path: [['M', 12, 88], ['L', 50, 14]] },
      { hint: 'Горка вниз', path: [['M', 50, 14], ['L', 88, 88]] },
      { hint: 'Поясок', path: [['M', 27, 62], ['L', 73, 62]] },
    ],
  },
  {
    id: 'о',
    upper: 'О',
    lower: 'о',
    sound: 'О',
    speak: 'Ооо',
    praise: 'Буква О',
    flavor: 'Апельсин',
    color: '#ff9f43',
    colorDeep: '#c96a10',
    highlight: '#ffe0b8',
    word: 'Облако',
    strokes: [
      {
        hint: 'Бублик по кругу',
        path: [
          ['M', 50, 10],
          ['C', 78, 10, 90, 30, 90, 50],
          ['C', 90, 70, 78, 90, 50, 90],
          ['C', 22, 90, 10, 70, 10, 50],
          ['C', 10, 30, 22, 10, 50, 10],
          ['Z'],
        ],
      },
    ],
  },
  {
    id: 'у',
    upper: 'У',
    lower: 'у',
    sound: 'У',
    speak: 'Ууу',
    praise: 'Буква У',
    flavor: 'Банан',
    color: '#ffd447',
    colorDeep: '#c99b00',
    highlight: '#fff2b8',
    word: 'Улитка',
    strokes: [
      { hint: 'Палочка вниз', path: [['M', 22, 14], ['L', 58, 58]] },
      {
        hint: 'Хвостик с петелькой',
        path: [
          ['M', 84, 14],
          ['L', 52, 62],
          ['C', 44, 74, 34, 84, 24, 84],
          ['C', 16, 84, 14, 74, 22, 68],
          ['C', 28, 64, 36, 68, 38, 74],
        ],
      },
    ],
  },
  {
    id: 'м',
    upper: 'М',
    lower: 'м',
    sound: 'М',
    speak: 'Ммм',
    praise: 'Буква М',
    flavor: 'Малина',
    color: '#c77dff',
    colorDeep: '#8338ec',
    highlight: '#ecd6ff',
    word: 'Малина',
    strokes: [
      { hint: 'Стенка вниз', path: [['M', 14, 88], ['L', 14, 16]] },
      { hint: 'Уголок вниз', path: [['M', 14, 16], ['L', 48, 62]] },
      { hint: 'Уголок вверх', path: [['M', 48, 62], ['L', 82, 16]] },
      {
        hint: 'Стенка вниз с завитком',
        path: [['M', 82, 16], ['L', 82, 82], ['Q', 83, 90, 92, 86]],
      },
    ],
  },
  {
    id: 'с',
    upper: 'С',
    lower: 'с',
    sound: 'С',
    speak: 'Ссс',
    praise: 'Буква С',
    flavor: 'Слива',
    color: '#4cc9f0',
    colorDeep: '#1d7fb8',
    highlight: '#cdeeff',
    word: 'Сок',
    strokes: [
      {
        hint: 'Половинка бублика',
        path: [
          ['M', 80, 24],
          ['C', 70, 10, 56, 8, 44, 12],
          ['C', 22, 20, 12, 36, 12, 50],
          ['C', 12, 66, 24, 82, 44, 88],
          ['C', 58, 92, 72, 88, 80, 76],
        ],
      },
    ],
  },
];

export const LETTER_IDS = LETTERS.map((letter) => letter.id);

export function letterById(id) {
  return LETTERS.find((letter) => letter.id === id) || null;
}

export function totalStrokes(letter) {
  return letter ? letter.strokes.length : 0;
}

/**
 * Честная детерминированная «псевдослучайность» для перемешивания вариантов
 * в мини-игре «услышь и найди»: один и тот же seed всегда даёт один порядок.
 */
export function seededShuffle(values, seed) {
  const list = [...values];
  let state = Number.isFinite(seed) ? Math.trunc(seed) : 0;
  const next = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
