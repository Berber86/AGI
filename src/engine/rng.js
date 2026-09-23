// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — rng.js
//  Детерминированный ГПСЧ. Один и тот же сид ⇒ одна и та же партия соперников,
//  одни и те же имена карт, один и тот же бой. Это позволяет и тесты писать,
//  и «переигрывать» сражение.
// =============================================================================

export function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 — маленький, быстрый, достаточно равномерный. */
export function makeRng(seed) {
  let a = typeof seed === 'number' ? (seed >>> 0) : hashString(String(seed));
  if (a === 0) a = 0x9e3779b9;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    seed: a,
    int: (n) => Math.floor(next() * n),
    range: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    chance: (p) => next() < p,
    pick: (arr) => (arr && arr.length ? arr[Math.floor(next() * arr.length)] : undefined),
    weighted: (items, weightFn) => {
      let total = 0;
      const w = items.map((it) => { const x = Math.max(0, weightFn(it)); total += x; return x; });
      if (total <= 0) return items[Math.floor(next() * items.length)];
      let r = next() * total;
      for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    },
    shuffle: (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    /** Стабильный «соль»-поток: отдельная последовательность для конкретной цели. */
    fork: (tag) => makeRng((a ^ hashString(String(tag))) >>> 0),
  };
}

export const Rng = { makeRng, hashString };
