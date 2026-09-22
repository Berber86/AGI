/**
 * Детерминированный генератор случайных чисел (mulberry32).
 * Вся игровая логика получает RNG явно — никаких Math.random внутри engine/.
 */
export interface Rng {
  /** Число в [0, 1). */
  next(): number;
  /** Целое в [min, max] включительно. */
  int(min: number, max: number): number;
  /** Число с плавающей точкой в [min, max). */
  float(min: number, max: number): number;
  /** Истина с вероятностью pct процентов. */
  chance(pct: number): boolean;
  /** Случайный элемент массива. */
  pick<T>(arr: readonly T[]): T;
  /** Копия массива в случайном порядке. */
  shuffle<T>(arr: readonly T[]): T[];
}

export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    float(min, max) {
      return min + next() * (max - min);
    },
    chance(pct) {
      if (pct <= 0) return false;
      if (pct >= 100) return true;
      return next() * 100 < pct;
    },
    pick(arr) {
      if (arr.length === 0) throw new Error('rng.pick: пустой массив');
      return arr[Math.floor(next() * arr.length)]!;
    },
    shuffle(arr) {
      const out = [...arr];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j]!, out[i]!];
      }
      return out;
    },
  };
}

/** Быстрый строковый хеш (FNV-1a 32 бит) — для получения seed из идентификаторов. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Комбинирует несколько компонент в один seed. */
export function combineSeed(...parts: (number | string)[]): number {
  return hashString(parts.map(String).join('|'));
}
