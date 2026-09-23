/**
 * Детерминированный ГПСЧ.
 *
 * Один забег = одно зерно. Подпотоки помечаются через fork(tag), чтобы
 * перерисовка интерфейса или предпросмотр трофея не съедали случайность боя:
 * игрок обязан видеть ровно тот бросок, который случился, а не пересчитанный.
 */

export function hashSeed(str) {
  let h = 2166136261 >>> 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRng(seed, state) {
  // Вторым аргументом принимается сохранённое состояние: забег переживает
  // перезагрузку страницы только если поток случайностей продолжается с той же
  // точки, а не начинается заново и не повторяет уже случившиеся броски.
  let a = (typeof state === 'number' ? state >>> 0 : hashSeed(seed)) || 1;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rng = {
    seed: String(seed),
    /** Внутреннее состояние потока — для сохранения забега. */
    state: () => a,
    next,
    /** Целое в [min, max] включительно. */
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    /** Вещественное в [min, max). */
    float: (min, max) => min + next() * (max - min),
    /** Бросок вероятности. Возвращает и результат, и выпавшее число —
     *  прозрачность требует показывать бросок, а не только исход. */
    roll: (p) => { const v = next(); return { hit: v < p, value: v }; },
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    /** Взвешенный выбор: items — массив, weightOf(item, i) — вес. */
    weighted(items, weightOf) {
      let total = 0;
      const weights = items.map((it, i) => { const w = Math.max(0, weightOf(it, i)); total += w; return w; });
      if (total <= 0) return items[0] ?? null;
      let r = next() * total;
      for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    },
    shuffle(arr) {
      const out = arr.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
    /** n элементов без возврата. */
    sample(arr, n) { return rng.shuffle(arr).slice(0, Math.max(0, n)); },
    fork: (tag) => makeRng(`${seed}:${tag}`),
  };
  return rng;
}
