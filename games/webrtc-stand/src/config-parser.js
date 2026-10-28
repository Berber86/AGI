// Разбор firebaseConfig из консоли Firebase и расчёт сетевой статистики.
// Ключ localStorage совместим с прошлым joystick-stand ('ckc_stand_cfg'),
// поэтому уже сохранённый конфиг подхватывается автоматически.

export const SHARED_CFG_STORAGE_KEY = 'ckc_stand_cfg';

export function parseFirebaseConfig(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Вставьте текст firebaseConfig из консоли Firebase');
  }
  const a = text.indexOf('{');
  const b = text.lastIndexOf('}');
  if (a < 0 || b <= a) {
    throw new Error('Не нашёл фигурные скобки { ... } объекта конфига');
  }
  const src = text.slice(a, b + 1);
  let out = '';
  let inStr = false;
  let quote = '';
  let esc = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { out += c; esc = false; continue; }
      if (c === '\\') { out += c; esc = true; continue; }
      if (c === quote) { inStr = false; out += '"'; continue; }
      if (c < ' ') continue;
      if (c === '"') { out += '\\"'; continue; }
      out += c;
      continue;
    }
    // Однострочные комментарии // вне строк (не ломает https:// внутри кавычек)
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
    // Многострочные комментарии /* ... */ вне строк
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      quote = c;
      out += '"';
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < src.length && /[\w$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < src.length && /\s/.test(src[k])) k++;
      out += src[k] === ':' ? `"${word}"` : word;
      i = j - 1;
      continue;
    }
    out += c;
  }

  out = out.replace(/,\s*([}\]])/g, '$1');
  const parsed = JSON.parse(out);
  if (!parsed || typeof parsed !== 'object' || !parsed.databaseURL) {
    throw new Error('В конфиге нет поля databaseURL — включите Realtime Database в проекте Firebase');
  }
  return parsed;
}

export function median(samples) {
  if (!samples || !samples.length) return null;
  const sorted = [...samples].sort((x, y) => x - y);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function p95(samples) {
  if (!samples || !samples.length) return null;
  const sorted = [...samples].sort((x, y) => x - y);
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  return sorted[idx];
}

// Средний разброс соседних замеров в одну сторону (оценка «дёрганья» канала).
export function jitterOneWay(rttSamples) {
  if (!rttSamples || rttSamples.length < 2) return null;
  let sum = 0;
  for (let i = 1; i < rttSamples.length; i++) {
    sum += Math.abs(rttSamples[i] - rttSamples[i - 1]) / 2;
  }
  return sum / (rttSamples.length - 1);
}

export function fmtBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} Б`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} КБ`;
  return `${(n / (1024 * 1024)).toFixed(2)} МБ`;
}

export function clamp(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.min(hi, Math.max(lo, n));
}

// Кратчайшая разница углов в градусах (-180..+180) для калибровки гироскопа руки.
export function shortestAngleDeg(currentDeg, zeroDeg) {
  let d = ((currentDeg - zeroDeg + 540) % 360) - 180;
  if (d === -180) d = 180;
  return d;
}

// Перевод углов гироскопа телефона в руке (alpha, beta) в координаты указки (-1..+1).
// alpha в DeviceOrientation растёт против часовой стрелки при взгляде сверху,
// поэтому поворот кисти вправо уменьшает alpha => x = -(alpha - zeroAlpha) / spanDeg.
// Подъём носа телефона вверх увеличивает beta => y = -(beta - zeroBeta) / spanDeg (вверх на холсте = y < 0).
export function handGyroToPad(alpha, beta, zero, spanDeg = 28) {
  if (typeof alpha !== 'number' || typeof beta !== 'number' || !zero) {
    return { x: 0, y: 0 };
  }
  const yawRightDeg = -shortestAngleDeg(alpha, zero.alpha);
  const pitchUpDeg = clamp(beta - zero.beta, -75, 75);
  const x = clamp(yawRightDeg / spanDeg, -1, 1);
  const y = clamp(-pitchUpDeg / spanDeg, -1, 1);
  return {
    x: x === 0 ? 0 : x,
    y: y === 0 ? 0 : y,
  };
}
