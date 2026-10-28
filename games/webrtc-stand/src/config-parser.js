// Разбор firebaseConfig из консоли Firebase, статистика задержек и 3D-математика датчиков руки.
// Ключ localStorage совместим с прошлым joystick-stand ('ckc_stand_cfg'),
// поэтому уже сохранённый конфиг подхватывается автоматически.

export const SHARED_CFG_STORAGE_KEY = 'ckc_stand_cfg';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

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
    if (c === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }
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

const cleanZero = (v) => (v === 0 ? 0 : v);

// ============================================================================
// 1. Честный 3D-наклон ладони (БЕЗ компаса alpha и БЕЗ вырождения Эйлера!)
// ============================================================================
// Переводит углы (beta, gamma) стандарта W3C в единичный вектор «Верх Земли»
// в экранных координатах телефона (sx — вправо по экрану, sy — вверх по экрану, sz — из экрана).
// Свойства:
//  - полностью не зависит от alpha (магнитного компаса);
//  - непрерывен даже при переходе gamma через ±90° (где углы Эйлера прыгают на 180°!);
//  - учитывает поворот экрана (портрет / ландшафт).
export function deviceUpVector(betaDeg, gammaDeg, screenAngleDeg = 0) {
  const b = (Number(betaDeg) || 0) * DEG2RAD;
  const g = (Number(gammaDeg) || 0) * DEG2RAD;
  const cb = Math.cos(b);
  const sb = Math.sin(b);
  const cg = Math.cos(g);
  const sg = Math.sin(g);

  // В координатах корпуса телефона: R_y(-gamma) * R_x(-beta) * (0, 0, 1)
  const ux = -cb * sg;
  const uy = sb;
  const uz = cb * cg;

  const ang = (((Number(screenAngleDeg) || 0) % 360) + 360) % 360;
  if (ang === 90) return { x: -uy, y: ux, z: uz };
  if (ang === 180) return { x: -ux, y: -uy, z: uz };
  if (ang === 270) return { x: uy, y: -ux, z: uz };
  return { x: ux, y: uy, z: uz };
}

// Нормализация сырого вектора акселерометра accelerationIncludingGravity (фолбэк, если нет beta/gamma).
export function accelToUpVector(ax, ay, az, screenAngleDeg = 0) {
  const len = Math.hypot(ax, ay, az);
  if (!len || len < 1e-4) return { x: 0, y: 0, z: 1 };
  const ux = ax / len;
  const uy = ay / len;
  const uz = az / len;
  const ang = (((Number(screenAngleDeg) || 0) % 360) + 360) % 360;
  if (ang === 90) return { x: -uy, y: ux, z: uz };
  if (ang === 180) return { x: -ux, y: -uy, z: uz };
  if (ang === 270) return { x: uy, y: -ux, z: uz };
  return { x: ux, y: uy, z: uz };
}

// Поворот текущего вектора u кратчайшей 3D-дугой Родрига так, чтобы нулевой хват u0 совпал с (0, 0, 1).
function alignToZeroGrip(u, u0) {
  if (!u0) return u;
  // c = u0 × (0, 0, 1) = (u0.y, -u0.x, 0), d = u0 · (0, 0, 1) = u0.z
  const cx = u0.y;
  const cy = -u0.x;
  const d = clamp(u0.z, -1, 1);

  if (d < -0.9999) {
    // Телефон калибровали экраном строго в пол: разворот на 180° вокруг оси Y
    return { x: -u.x, y: u.y, z: -u.z };
  }
  // c × u = (cy * u.z, -cx * u.z, cx * u.y - cy * u.x)
  const crossX = cy * u.z;
  const crossY = -cx * u.z;
  const crossZ = cx * u.y - cy * u.x;
  const dotCU = cx * u.x + cy * u.y;
  const k = dotCU / (1 + d);

  return {
    x: d * u.x + crossX + k * cx,
    y: d * u.y + crossY + k * cy,
    z: d * u.z + crossZ,
  };
}

// Главный расчёт симметричного 3D-наклона короткой и длинной стороны относительно любого удобного хвата.
// Возвращает x (-1..+1 вправо), y (-1..+1 вниз на холсте; подъём носа вверх = y < 0) и честные градусы.
export function handTilt3DToPad(
  betaDeg,
  gammaDeg,
  zeroUpVec,
  { spanDeg = 25, screenAngleDeg = 0, invertY = false } = {}
) {
  const u = deviceUpVector(betaDeg, gammaDeg, screenAngleDeg);
  return upVectorToPad(u, zeroUpVec, { spanDeg, invertY });
}

export function upVectorToPad(u, zeroUpVec, { spanDeg = 25, invertY = false } = {}) {
  const v = alignToZeroGrip(u, zeroUpVec || { x: 0, y: 0, z: 1 });
  // Наклон вправо (правая грань вниз => v.x < 0): угол между короткой гранью и горизонтом
  const tiltRightDeg = Math.atan2(-v.x, Math.hypot(v.y, v.z)) * RAD2DEG;
  // Наклон носа вверх (верхняя грань вверх => v.y > 0)
  const tiltUpDeg = Math.atan2(v.y, v.z) * RAD2DEG;

  const signY = invertY ? 1 : -1;
  const x = clamp(tiltRightDeg / spanDeg, -1, 1);
  const y = clamp((signY * tiltUpDeg) / spanDeg, -1, 1);

  return {
    x: cleanZero(x),
    y: cleanZero(y),
    tiltRightDeg: cleanZero(Number(tiltRightDeg.toFixed(1))),
    tiltUpDeg: cleanZero(Number(tiltUpDeg.toFixed(1))),
  };
}

// ============================================================================
// 2. Режим «Указка 3D» (кватернион ZXY для поворотов кисти влево/вправо как пультом ТВ)
// ============================================================================
export function eulerZXYToQuat(alphaDeg, betaDeg, gammaDeg) {
  const z = ((Number(alphaDeg) || 0) * DEG2RAD) / 2;
  const x = ((Number(betaDeg) || 0) * DEG2RAD) / 2;
  const y = ((Number(gammaDeg) || 0) * DEG2RAD) / 2;

  const cz = Math.cos(z), sz = Math.sin(z);
  const cx = Math.cos(x), sx = Math.sin(x);
  const cy = Math.cos(y), sy = Math.sin(y);

  // Внутренний порядок W3C Z - X' - Y'' => q = q_z * q_x * q_y
  return {
    w: cz * cx * cy - sz * sx * sy,
    x: cz * sx * cy - sz * cx * sy,
    y: cz * cx * sy + sz * sx * cy,
    z: sz * cx * cy + cz * sx * sy,
  };
}

function quatMultiply(a, b) {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}

// Вращение в собственной системе координат хвата: qRel = conjugate(zeroQuat) * currentQuat.
// Луч указки выходит из переднего торца телефона вдоль +Y корпуса (0, 1, 0):
//  - поворот носа телефона вправо (или крен вправо) даёт смещение луча +X;
//  - подъём носа телефона вверх даёт смещение луча +Z.
export function handWandQuatToPad(
  alphaDeg,
  betaDeg,
  gammaDeg,
  zeroQuat,
  { spanDeg = 25, invertY = false } = {}
) {
  const cur = eulerZXYToQuat(alphaDeg, betaDeg, gammaDeg);
  if (!zeroQuat) return { x: 0, y: 0, yawRightDeg: 0, pitchUpDeg: 0 };
  const invZero = { w: zeroQuat.w, x: -zeroQuat.x, y: -zeroQuat.y, z: -zeroQuat.z };
  const q = quatMultiply(invZero, cur);

  // Поворачиваем вектор луча f = (0, 1, 0) кватернионом q: f' = q * (0,1,0) * q⁻¹
  const fx = 2 * (q.x * q.y - q.w * q.z);
  const fy = 1 - 2 * (q.x * q.x + q.z * q.z);
  const fz = 2 * (q.y * q.z + q.w * q.x);

  const yawRightDeg = Math.atan2(fx, fy) * RAD2DEG;
  const pitchUpDeg = Math.atan2(fz, Math.hypot(fx, fy)) * RAD2DEG;

  const signY = invertY ? 1 : -1;
  return {
    x: cleanZero(clamp(yawRightDeg / spanDeg, -1, 1)),
    y: cleanZero(clamp((signY * pitchUpDeg) / spanDeg, -1, 1)),
    yawRightDeg: cleanZero(Number(yawRightDeg.toFixed(1))),
    pitchUpDeg: cleanZero(Number(pitchUpDeg.toFixed(1))),
  };
}
