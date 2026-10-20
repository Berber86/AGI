// Перемещение между точками: плавный проход (обычный экран) и золотая вспышка (VR).

export function clamp01(t) {
  return Math.max(0, Math.min(1, t));
}

export function smoothstep(t) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function easeInOutCubic(t) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function shortestAngle(from, to) {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function lerpAngle(from, to, t) {
  return from + shortestAngle(from, to) * t;
}

/**
 * Плавный проход по дуге. from/to — [x, z] точки на полу, eye — высота глаз.
 * Возвращает sample(t), где t — нормализованное время 0…1.
 */
export function createGlide({ from, to, fromYaw, fromPitch, toYaw, toPitch, duration = null, eye = 1.65 }) {
  const [ax, az] = from;
  const [bx, bz] = to;
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz) || 1e-6;
  // Комфортная скорость: пик около 2,3 м/с — как спокойный шаг по залу.
  const travelTime = duration || Math.min(7.5, Math.max(1.5, 0.55 * len + 0.9));
  // Небольшая дуга вбок — камера не идёт по прямой сквозь мебель.
  const sideX = (-dz / len) * Math.min(0.65, len * 0.08);
  const sideZ = (dx / len) * Math.min(0.65, len * 0.08);
  const cx = (ax + bx) / 2 + sideX;
  const cz = (az + bz) / 2 + sideZ;

  function sample(t) {
    const u = clamp01(t);
    const e = smoothstep(u);
    const k = 1 - e;
    const x = k * k * ax + 2 * k * e * cx + e * e * bx;
    const z = k * k * az + 2 * k * e * cz + e * e * bz;
    const lift = Math.sin(Math.PI * e) * Math.min(0.16, len * 0.02);
    const look = smoothstep((u - 0.18) / 0.82);
    return {
      position: [x, eye + lift, z],
      yaw: lerpAngle(fromYaw, toYaw, look),
      pitch: fromPitch + (toPitch - fromPitch) * look,
      done: u >= 1,
      duration: travelTime,
    };
  }

  sample.duration = travelTime;
  return { sample, duration: travelTime, kind: 'glide' };
}

/** Золотая вспышка: 1 → 0 прозрачность, подмена кадра в середине. */
export function createFade({ out = 0.42, hold = 0.22, back = 0.62 }) {
  const duration = out + hold + back;
  return {
    duration,
    kind: 'fade',
    sample(t) {
      const time = clamp01(t) * duration;
      if (time < out) {
        return { alpha: smoothstep(time / out), swapped: false, done: false };
      }
      if (time < out + hold) {
        return { alpha: 1, swapped: true, done: false };
      }
      const tail = (time - out - hold) / back;
      return { alpha: 1 - smoothstep(tail), swapped: true, done: tail >= 1 };
    },
  };
}

export function createTravel({ mode, from, to, fromYaw, fromPitch, toYaw, toPitch, eye }) {
  if (mode === 'fade') {
    const fade = createFade({});
    return {
      kind: 'fade',
      duration: fade.duration,
      sample(t) {
        const s = fade.sample(t);
        return {
          ...s,
          position: s.swapped ? [to[0], eye, to[1]] : [from[0], eye, from[1]],
          yaw: s.swapped ? toYaw : fromYaw,
          pitch: s.swapped ? toPitch : fromPitch,
        };
      },
    };
  }
  return createGlide({ from, to, fromYaw, fromPitch, toYaw, toPitch, eye });
}
