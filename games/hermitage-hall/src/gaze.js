// Взгляд-двелль: выбор точки, на которую смотрит посетитель, и накопление 5 секунд.
// Чистая логика без three.js — проверяется юнит-тестами.

export const MARKER_EYE_HEIGHT = 1.45;

export function forwardFromAngles(yaw, pitch) {
  const cp = Math.cos(pitch);
  return [Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp];
}

export function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1e-9;
  return [v[0] / len, v[1] / len, v[2] / len];
}

export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function angleBetween(a, b) {
  return Math.acos(Math.max(-1, Math.min(1, dot(normalize(a), normalize(b)))));
}

export function markerDirection(from, position) {
  return normalize([
    position[0] - from[0],
    MARKER_EYE_HEIGHT - from[1],
    position[1] - from[2],
  ]);
}

/**
 * Двелль по точкам. Возвращает объект с update(dt, view) и снимком состояния.
 * view: { position:[x,y,z], forward:[x,y,z], currentPointId, enabled, ignoreCurrent }
 * ignoreCurrent — из близкого осмотра доступны все медальоны, включая тот,
 * с которого пришли: посетитель стоит уже не на нём.

 */
export function createGaze({
  points,
  dwellSeconds = 10,
  angleDeg = 4.5,
  grace = 0.45,
  decay = 3.2,
  hysteresisDeg = 1.1,
}) {
  const limit = (angleDeg * Math.PI) / 180;
  const hysteresis = (hysteresisDeg * Math.PI) / 180;
  let targetId = null;
  let progress = 0;
  let offSince = 0;
  let touched = false;
  let arrivals = 0;
  let last = { angle: Infinity, candidateId: null };

  function reset(nextTarget = null) {
    targetId = nextTarget;
    progress = 0;
    offSince = 0;
  }

  function pick(view) {
    let best = null;
    let bestAngle = Infinity;
    for (const p of points) {
      if (!view.ignoreCurrent && p.id === view.currentPointId) continue;
      const angle = angleBetween(view.forward, markerDirection(view.position, p.position));
      if (angle > limit) continue;
      const isCurrent = p.id === targetId;
      if (!isCurrent && best && angle > bestAngle - hysteresis) continue;
      if (angle < bestAngle) {
        bestAngle = angle;
        best = p;
      }
    }
    return best ? { id: best.id, angle: bestAngle } : null;
  }

  function update(dt, view) {
    last = { angle: Infinity, candidateId: null };
    if (!view.enabled || !view.currentPointId) {
      reset(null);
      return snapshot();
    }
    const hit = pick(view);
    if (hit) {
      last = { angle: hit.angle, candidateId: hit.id };
      if (hit.id !== targetId) reset(hit.id);
      offSince = 0;
      progress = Math.min(1, progress + dt / dwellSeconds);
      if (progress >= 1) {
        const arrived = targetId;
        arrivals += 1;
        reset(null);
        return { ...snapshot(), arrival: arrived };
      }
    } else if (targetId) {
      offSince += dt;
      if (offSince > grace) {
        progress = Math.max(0, progress - dt * decay);
        if (progress === 0) reset(null);
      }
    }
    if (!targetId) touched = false;
    else touched = true;
    return snapshot();
  }

  function snapshot() {
    return {
      targetId,
      progress,
      angle: last.angle,
      candidateId: last.candidateId,
      arrivals,
      touched,
    };
  }

  return { update, snapshot, reset, get progress() { return progress; }, get targetId() { return targetId; } };
}

/** Прогресс, который видно на медальоне: 0…1 с мягким стартом. */
export function ringFraction(progress) {
  if (progress <= 0) return 0;
  return Math.min(1, Math.pow(progress, 0.72));
}
