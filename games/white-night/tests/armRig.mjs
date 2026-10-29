// armRig.mjs — синтетическая «физическая» рука для проверки биомеханики.
//
// Это НЕ заглушка под конкретную реализацию: здесь моделируется настоящее
// тело (плечо -> локоть -> запястье с известными длинами костей), телефон на
// ремешке (жёстко закреплён на предплечье) и камера на голове, которая видит
// два светящихся пятна на экране телефона. На выходе — ровно те сигналы,
// которые игра получает с реальных устройств: кватернион гироскопа в системе
// W3C/GL и показания трекера маяка (u, v, spanNorm, status).
//
// Зачем: чтобы честно ответить на вопрос «а может ли алгоритм вообще увидеть
// сгибание локтя и подъём руки, если данные с датчиков физически корректны?»

import { WristHandFusion, UPPER_ARM_LEN, FOREARM_LEN, qRotVec } from '../src/vr/wristHandFusion.js';
import { WristBeaconTracker } from '../src/vr/wristBeaconTracker.js';

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

export const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm3 = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

// Формула Родрига: поворот вектора v на rad вокруг оси k.
export function rotAxis(v, k, rad) {
  const kn = norm3(k);
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const kv = dot3(kn, v);
  const kvx = cross3(kn, v);
  return [
    v[0] * c + kvx[0] * s + kn[0] * kv * (1 - c),
    v[1] * c + kvx[1] * s + kn[1] * kv * (1 - c),
    v[2] * c + kvx[2] * s + kn[2] * kv * (1 - c),
  ];
}

// Кватернион из матрицы поворота (столбцы = образы базисных векторов, т.е. local -> world).
export function quatFromAxes(x, y, z) {
  const m00 = x[0], m01 = y[0], m02 = z[0];
  const m10 = x[1], m11 = y[1], m12 = z[1];
  const m20 = x[2], m21 = y[2], m22 = z[2];
  const tr = m00 + m11 + m22;
  let q;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    q = [(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, 0.25 * s];
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    q = [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s];
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    q = [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s];
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    q = [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s];
  }
  const l = Math.hypot(q[0], q[1], q[2], q[3]);
  return q.map((c) => c / l);
}

// Позиция плеча в системе корпуса — тот же якорь, что использует игра/аватар.
export const SHOULDER = { right: [0.21, -0.27, -0.08], left: [-0.21, -0.27, -0.08] };

/**
 * Прямая кинематика руки. Все углы — «истина», с которой сравниваем алгоритм.
 *  elbowDeg  — сгибание локтя (0 = рука выпрямлена, 140 = кисть у груди)
 *  raiseDeg  — подъём всей руки вперёд-вверх в плече (0 = горизонталь)
 *  spreadDeg — отведение в сторону (положительный = наружу)
 *  rollDeg   — пронация/супинация предплечья (вращение руки вокруг своей оси)
 */
export function poseArm({
  side = 'right',
  elbowDeg = 0,
  raiseDeg = 0,
  spreadDeg = 0,
  inwardDeg = 0,
  rollDeg = 0,
  screenUpDeg = 0,
} = {}) {
  const s = side === 'left' ? -1 : 1;
  const shoulder = SHOULDER[side] ? [...SHOULDER[side]] : [s * 0.21, -0.27, -0.08];
  const FORWARD = [0, 0, -1];
  const UP = [0, 1, 0];

  // Плоскость сгибания: ось локтя горизонтальна и перпендикулярна плечу.
  // Отведение в сторону наклоняет эту ось вперёд-назад (как настоящий шарнир).
  const spread = spreadDeg * DEG;
  const flexAxis = norm3([
    Math.cos(spread),
    0,
    -s * Math.sin(spread),
  ]);

  // 1) Плечо: подъём вперёд-вверх + отведение в сторону.
  let upper = rotAxis(FORWARD, flexAxis, raiseDeg * DEG);
  upper = norm3(rotAxis(upper, cross3(UP, FORWARD), -s * spread));

  // 2) Локоть: предплечье — это плечо, довёрнутое вокруг той же оси.
  const total = (raiseDeg + elbowDeg) * DEG;
  let fore = rotAxis(FORWARD, flexAxis, total);
  fore = norm3(rotAxis(fore, cross3(UP, FORWARD), -s * spread));
  const foreUp = rotAxis(UP, flexAxis, total);

  // Живой сгиб локтя к груди — это не только подъём предплечья, но и увод кисти
  // ВНУТРЬ (к грудине): без него одним гироскопом сгибание и подъём неразличимы.
  const sideSign = side === 'left' ? -1 : 1;
  const foreInward = norm3(rotAxis(fore, [0, 1, 0], sideSign * inwardDeg * DEG));
  const upperInward = norm3(rotAxis(upper, [0, 1, 0], sideSign * inwardDeg * DEG * 0.35));

  const elbow = add3(shoulder, scale3(upperInward, UPPER_ARM_LEN));
  const wrist = add3(elbow, scale3(foreInward, FOREARM_LEN));

  // 3) Пронация кисти + естественный доворот экрана «на себя» (screenUpDeg).
  let devZ = rotAxis(foreUp, fore, rollDeg * DEG);
  devZ = rotAxis(devZ, norm3(cross3(fore, foreUp)), screenUpDeg * DEG);
  const devY = scale3(fore, -1); // верхняя грань телефона смотрит в локоть
  const devX = norm3(cross3(devY, devZ));

  return {
    side,
    shoulder,
    upper,
    elbow,
    wrist,
    flexAxis,
    elbowDeg,
    raiseDeg,
    // Истинный угол сгибания локтя для сверки с snapshot().elbowBendDeg.
    truthBendDeg: elbowDeg,
    truthElevDeg: Math.asin(clamp(dot3(foreInward, UP), -1, 1)) * RAD,
    fore: foreInward,
    deviceQ: quatFromAxes(devX, devY, devZ),
    screenNormal: devZ,
  };
}

// ---- Оптика: что увидит камера на голове --------------------------------
// Телефон: ~64.8 x 141.9 мм активного экрана, пятна разнесены на 105 мм
// (расчёт по вёрстке страницы браслета: H - 2*18px - диаметр пятна).
export const PHONE = { widthM: 0.0648, heightM: 0.1419, dotSepM: 0.105, dotRadiusM: 0.0148 };

export const BEACON_LAYOUTS = {
  // Как сейчас в вёрстке страницы браслета: пятна вверху и внизу экрана (вдоль его
  // длинной грани). Для телефона на запястье это ось, параллельная предплечью.
  stacked: { acrossFrac: 0.0, alongFrac: 1.0, dotM: 0.0295 },
  // Диагональ: пятна в противоположных углах — поперёк предплечья тоже есть составная.
  diagonal: { acrossFrac: 0.55, alongFrac: 1.0, dotM: 0.0208 },
};

export function makeBeaconModel(opts = {}) {
  const hfovDeg = opts.hfovDeg ?? 65;
  const aspectY = opts.aspectY ?? 0.75; // кадр задней камеры 4:3
  const tanH = Math.tan((hfovDeg / 2) * DEG);
  const tanV = tanH * aspectY;
  const tracker = new WristBeaconTracker(null);
  const sep = opts.dotSepM ?? PHONE.dotSepM;

  const project = (p) => ({
    u: 0.5 + p[0] / (-p[2]) / (2 * tanH),
    v: 0.5 - p[1] / (-p[2]) / (2 * tanV),
  });

  return {
    hfovDeg,
    aspectY,
    sep,
    // Возвращает ровно тот объект, который main.js отдаёт в wristFusion.update().
    sample(pose, now = performance.now(), opts2 = {}) {
      const n = pose.screenNormal;
      const toCam = scale3(pose.wrist, -1);
      const dist = Math.max(0.08, Math.hypot(...pose.wrist));
      const cosView = clamp(dot3(n, norm3(toCam)), 0, 1);
      if (opts2.hideBeacon) {
        return { status: 'none', u: 0.5, v: 0.55, spanNorm: 0, fresh: false, ts: now, ageMs: 0 };
      }
      // Два пятна на экране: +sep/2 и -sep/2 вдоль верхней грани телефона.
      const top = add3(pose.wrist, scale3(norm3(cross3(pose.fore, n)), 0));
      void top;
      const axis = norm3(cross3([0, 1, 0], n)); // «вдоль экрана, горизонтально» не нужен: пятна вдоль devY
      void axis;
      const layout = BEACON_LAYOUTS[opts2.layout || 'stacked'];
      const devY = norm3(scale3(pose.fore, -1));
      const devX = norm3(cross3(devY, n));
      const along = (sep * layout.alongFrac) / 2;
      const across = (sep * layout.acrossFrac) / 2;
      const off = add3(scale3(devY, along), scale3(devX, across));
      const d1 = add3(pose.wrist, off);
      const d2 = sub3(pose.wrist, off);
      let p1 = project(d1);
      let p2 = project(d2);
      if (
        [p1, p2].some((p) => !(p.u > 0.02 && p.u < 0.98 && p.v > 0.02 && p.v < 0.98))
      ) {
        return { status: 'none', u: 0.5, v: 0.55, spanNorm: 0, fresh: false, ts: now, ageMs: 999, offFrame: true };
      }
      if (opts2.pairVisible === false) {
        // Камера различила только одно пятно (перегиб запястья, помеха).
        return {
          status: 'single',
          u: p1.u,
          v: p1.v,
          spanNorm: 0.12,
          fresh: true,
          ts: now,
          ageMs: 20,
        };
      }
      // Шум центроида добавляется ДО трекера — иначе гейт не проверял бы, что фильтр
      // измерения действительно гасит дребезг (шум после фильтра был бы «сырым» пинком).
      if (opts2.noise) {
        const j = opts2.noise;
        p1 = { u: p1.u + j(), v: p1.v + j() };
        p2 = { u: p2.u + j(), v: p2.v + j() };
      }
      const injected = tracker.inject({ distal: p1, proximal: p2 }, now);
      const fovFudge = opts2.spanFudge ?? 1;
      const span = injected.spanNorm * fovFudge;
      return {
        status: injected.status,
        u: injected.u,
        v: injected.v,
        spanNorm: span,
        // Сырое измерение оптики (для тестов «что видно в кадре» и калибровки-линейки):
        // spanNorm выше — сглаженный, его видит слияние.
        rawU: injected.rawU ?? injected.u,
        rawV: injected.rawV ?? injected.v,
        rawSpanNorm: (injected.rawSpanNorm ?? injected.spanNorm) * fovFudge,
        rawRollRad: injected.rawRollRad ?? injected.rollRad,
        rollRad: injected.rollRad,
        fresh: true,
        ts: now,
        ageMs: 20,
        cosView,
        dist,
      };
    },
    // Для калибровки «на глаз», когда телефон-очки ещё в руках, а не на голове.
    sampleHandHeld(pose, now = performance.now(), camPos = [0, -0.05, 0.15]) {
      const shifted = { ...pose, wrist: sub3(pose.wrist, camPos), screenNormal: pose.screenNormal, fore: pose.fore };
      const s = this.sample(shifted, now);
      return s;
    },
  };
}

// ---- Прогон через реальную механику игры --------------------------------
export function settle(fusion, pose, beaconModel, { frames = 90, dt = 1 / 60, now0 = 0, phase = 'search', headLook = { yaw: 0, pitch: 0 }, hideBeacon = false, opts2 = {} } = {}) {
  let now = now0;
  let last = null;
  for (let i = 0; i < frames; i++) {
    now += dt * 1000;
    fusion.feedSensor({
      q: pose.deviceQ,
      linMag: 1,
      rotRate: 0,
      acc: [0, 0, 9.81],
      ts: now,
    });
    const beacon = hideBeacon ? { status: 'none', u: 0.5, v: 0.55, spanNorm: 0, fresh: false, ts: now } : beaconModel.sample(pose, now, opts2);
    last = fusion.update(dt, { beacon, phase, headLook, now });
  }
  return { snap: last, now };
}

export function makeFusion(side = 'right') {
  return new WristHandFusion(side);
}
