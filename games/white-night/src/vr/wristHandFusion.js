// wristHandFusion.js — 6DoF-трекинг игровой руки для «Белой ночи».
//
// Архитектура:
//   1. Ведущий контур на каждом кадре (60 Гц): гироскоп (кватернион W3C) +
//      линейное ускорение акселерометра с телефона-браслета по WebRTC P2P.
//   2. Оптический якорь (~10 Гц): двухцветный светящийся маяк на экране браслета
//      в задней камере VR-очков. Подтягивает реальную дальность вытянутой руки
//      (с поправкой на наклон экрана по гироскопу!) и убирает горизонтальный дрейф.
//   3. Калибровка в 2 жеста при произвольном креплении телефона на запястье:
//      - Жест 1 (stretch): прямая рука вытянута вперёд к баку;
//      - Жест 2 (bend):    рука согнута в локте ближе к груди.
//      Из пары кватернионов вычисляется ортонормированный анатомический базис
//      предплечья qB, работающий одинаково при продольном, поперечном или косом ремешке.
//   4. Игровые действия рукой (строго без вибрации):
//      - Поиск в баке: вытянутая рука (reach >= 0.62) + движения «порыться» -> pokes;
//      - Осмотр находки: вращение кисти крутит 3D-модель находки по всем осям;
//      - Выбросить находку: резкий взмах рукой (ускорение / рывок угловой скорости);
//      - Забрать в коллекцию: спокойно опустить руку вниз и подержать ~0.65 с.

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
// Поворот из W3C ENU (+Z вверх) в OpenGL/Three.js (+Y вверх, -Z вперёд): Rx(-90°)
const Q_ENU_TO_GL = [-Math.SQRT1_2, 0, 0, Math.SQRT1_2];

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export function qNormalize([x, y, z, w]) {
  const len = Math.hypot(x, y, z, w);
  if (len < 1e-9) return [0, 0, 0, 1];
  return [x / len, y / len, z / len, w / len];
}

export function qConj([x, y, z, w]) {
  return [-x, -y, -z, w];
}

export function qMul(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

export function qAxisAngle([ax, ay, az], rad) {
  const len = Math.hypot(ax, ay, az);
  if (len < 1e-9) return [0, 0, 0, 1];
  const half = rad * 0.5;
  const s = Math.sin(half) / len;
  return [ax * s, ay * s, az * s, Math.cos(half)];
}

export function qRotVec(q, v) {
  const [qx, qy, qz, qw] = q;
  const [vx, vy, vz] = v;
  const ix = qw * vx + qy * vz - qz * vy;
  const iy = qw * vy + qz * vx - qx * vz;
  const iz = qw * vz + qx * vy - qy * vx;
  const iw = -qx * vx - qy * vy - qz * vz;
  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
}

export function qSlerp(a, b, t) {
  const u = clamp(t, 0, 1);
  let [bx, by, bz, bw] = b;
  let dot = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
  if (dot < 0) {
    dot = -dot;
    bx = -bx; by = -by; bz = -bz; bw = -bw;
  }
  if (dot > 0.9995) {
    return qNormalize([
      a[0] + (bx - a[0]) * u,
      a[1] + (by - a[1]) * u,
      a[2] + (bz - a[2]) * u,
      a[3] + (bw - a[3]) * u,
    ]);
  }
  const theta = Math.acos(clamp(dot, -1, 1));
  const sinT = Math.sin(theta);
  const wa = Math.sin((1 - u) * theta) / sinT;
  const wb = Math.sin(u * theta) / sinT;
  return [
    a[0] * wa + bx * wb,
    a[1] * wa + by * wb,
    a[2] * wa + bz * wb,
    a[3] * wa + bw * wb,
  ];
}

export function qAngleRad(a, b) {
  const dot = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);
  return 2 * Math.acos(clamp(dot, 0, 1));
}

/**
 * Кватернион устройства из W3C DeviceOrientation (alpha, beta, gamma) в мире +Y вверх.
 * В локальной системе телефона: +X вправо экрана, +Y вверх экрана, +Z наружу из экрана.
 */
export function w3cDeviceQuaternion(alphaDeg = 0, betaDeg = 0, gammaDeg = 0, screenAngleDeg = 0) {
  const qZ = qAxisAngle([0, 0, 1], alphaDeg * DEG);
  const qX = qAxisAngle([1, 0, 0], betaDeg * DEG);
  const qY = qAxisAngle([0, 1, 0], gammaDeg * DEG);
  const qEnu = qMul(qMul(qZ, qX), qY);
  const qGl = qMul(Q_ENU_TO_GL, qEnu);
  if (!screenAngleDeg) return qNormalize(qGl);
  const qScr = qAxisAngle([0, 0, 1], -screenAngleDeg * DEG);
  return qNormalize(qMul(qGl, qScr));
}

function vDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vCross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function vNorm(a) {
  const len = Math.hypot(a[0], a[1], a[2]);
  if (len < 1e-9) return [1, 0, 0];
  return [a[0] / len, a[1] / len, a[2] / len];
}

/**
 * Перевод ортонормированных столбцов [colX, colY, colZ] (det = +1) в кватернион.
 */
function basisColumnsToQuat(colX, colY, colZ) {
  const m00 = colX[0], m01 = colY[0], m02 = colZ[0];
  const m10 = colX[1], m11 = colY[1], m12 = colZ[1];
  const m20 = colX[2], m21 = colY[2], m22 = colZ[2];
  const tr = m00 + m11 + m22;
  let x, y, z, w;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1.0) * 2;
    w = 0.25 * s;
    x = (m21 - m12) / s;
    y = (m02 - m20) / s;
    z = (m10 - m01) / s;
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
    w = (m21 - m12) / s;
    x = 0.25 * s;
    y = (m01 + m10) / s;
    z = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
    w = (m02 - m20) / s;
    x = (m01 + m10) / s;
    y = 0.25 * s;
    z = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
    w = (m10 - m01) / s;
    x = (m02 + m20) / s;
    y = (m12 + m21) / s;
    z = 0.25 * s;
  }
  return qNormalize([x, y, z, w]);
}

function quatToEulerYXZ([x, y, z, w]) {
  const m20 = 2 * (x * z - w * y);
  const m21 = 2 * (y * z + w * x);
  const m22 = 1 - 2 * (x * x + y * y);
  const m01 = 2 * (x * y - w * z);
  const m11 = 1 - 2 * (x * x + z * z);
  const m02 = 2 * (x * z + w * y);
  const pitch = Math.asin(-clamp(m21, -1, 1));
  let yaw = 0;
  let roll = 0;
  if (Math.abs(m21) < 0.9999) {
    yaw = Math.atan2(m02, m22);
    roll = Math.atan2(m01, m11);
  } else {
    yaw = Math.atan2(-m20, m00Fallback(x, z));
  }
  return { yaw, pitch, roll };
}

function m00Fallback(x, z) {
  return 1 - 2 * (x * x + z * z);
}

export class WristHandFusion {
  constructor() {
    // Калибровка двух жестов
    this.qStretch = null;
    this.qBend = null;
    this.qBasis = [0, 0, 0, 1];
    this.qRefInv = [0, 0, 0, 1];
    this.bendSpanRad = 52 * DEG;
    this.yawTrimRad = 0;
    this.calibratedStep = 0; // 0 = нет, 1 = есть прямая рука, 2 = полная калибровка

    // Оптическая шкала двухцветного маяка
    this.beaconFar = { u: 0.54, v: 0.54, span: 0.105, captured: false };
    this.beaconNear = { u: 0.55, v: 0.64, span: 0.235, captured: false };

    // Последние входные сэмплы
    this.lastSensor = null;
    this.prevQuat = null;

    // Текущее 6DoF состояние руки в пространстве камеры/головы
    this.qArm = [0, 0, 0, 1];
    this.pos = { x: 0.19, y: -0.25, z: -0.52 };
    this.reach = 0.25; // 0 = согнута у груди, 1 = полностью вытянута к баку
    this.screenFacingCos = 0.85;
    this.trackingSource = 'idle'; // 'idle' | 'gyro+beacon' | 'gyro-only'

    // Состояние поиска («порыться в баке»)
    this.rummageAnchorYaw = null;
    this.rummageAnchorPitch = null;
    this.rummageDir = 0;
    this.lastPokeAt = -1000;
    this.dwellAccumSec = 0;

    // Состояние осмотра и выбора судьбы находки
    this.inspectBaseQ = null;
    this.inspectEnteredAt = 0;
    this.itemRot = { x: 0, y: 0, z: 0 };
    this.calmLowerSec = 0;
    this.lastDecisionAt = -2000;
  }

  /**
   * Загрузка сохранённой калибровки (если пользователь уже калибровал ремешок).
   */
  exportCalibration() {
    if (this.calibratedStep < 2) return null;
    return {
      qStretch: this.qStretch,
      qBend: this.qBend,
      qBasis: this.qBasis,
      qRefInv: this.qRefInv,
      bendSpanRad: this.bendSpanRad,
      beaconFar: this.beaconFar,
      beaconNear: this.beaconNear,
    };
  }

  importCalibration(data) {
    if (!data || !Array.isArray(data.qBasis) || !Array.isArray(data.qRefInv)) return false;
    this.qStretch = data.qStretch || [0, 0, 0, 1];
    this.qBend = data.qBend || [0, 0, 0, 1];
    this.qBasis = qNormalize(data.qBasis);
    this.qRefInv = qNormalize(data.qRefInv);
    this.bendSpanRad = clamp(Number(data.bendSpanRad) || 52 * DEG, 15 * DEG, 125 * DEG);
    if (data.beaconFar) this.beaconFar = { ...this.beaconFar, ...data.beaconFar };
    if (data.beaconNear) this.beaconNear = { ...this.beaconNear, ...data.beaconNear };
    this.calibratedStep = 2;
    this.yawTrimRad = 0;
    return true;
  }

  feedSensor(sample) {
    if (!sample || !Array.isArray(sample.q) || sample.q.length !== 4) return;
    this.lastSensor = {
      q: qNormalize(sample.q),
      linMag: Math.max(0, Number(sample.linMag) || 0),
      rotRate: Math.max(0, Number(sample.rotRate) || 0),
      acc: Array.isArray(sample.acc) ? sample.acc : [0, 0, 0],
      ts: sample.ts ?? performance.now(),
    };
  }

  /**
   * Жест 1: прямая рука вытянута вперёд к мусорному баку.
   */
  calibrateStretchPose(sensor = this.lastSensor, beacon = null) {
    if (!sensor?.q) {
      return { ok: false, message: 'Нет сигнала от гироскопа на запястье. Подключите браслет.' };
    }
    this.qStretch = qNormalize(sensor.q);
    // Предварительный базис на случай, если шаг 2 ещё не нажат:
    // +Y = мировой верх, а горизонтальное направление берём от нормали экрана к камере
    const upLocal = vNorm(qRotVec(qConj(this.qStretch), [0, 1, 0]));
    let backHint = [0, 0, 1]; // экран обращён к очкам (+Z)
    if (Math.abs(vDot(backHint, upLocal)) > 0.9) backHint = [0, 1, 0];
    const rightFallback = vNorm(vCross(upLocal, backHint));
    const backOrtho = vNorm(vCross(rightFallback, upLocal));
    this.qBasis = basisColumnsToQuat(rightFallback, upLocal, backOrtho);
    this.qRefInv = qConj(qMul(this.qStretch, this.qBasis));
    this.yawTrimRad = 0;

    if (beacon && beacon.fresh && beacon.spanNorm > 0.015) {
      this.beaconFar = {
        u: clamp(beacon.u, 0.15, 0.85),
        v: clamp(beacon.v, 0.15, 0.88),
        span: clamp(beacon.spanNorm, 0.02, 0.42),
        captured: true,
      };
    } else {
      this.beaconFar = { u: 0.54, v: 0.54, span: 0.105, captured: false };
    }
    this.calibratedStep = 1;
    return {
      ok: true,
      step: 1,
      beaconCaptured: this.beaconFar.captured,
      message: 'Шаг 1 записан (прямая рука). Теперь согните локоть ближе к груди и нажмите Шаг 2.',
    };
  }

  /**
   * Жест 2: рука согнута в локте ближе к груди (удобная поза отдыха).
   * По паре (qStretch, qBend) находится точная ось сгиба локтя при любом угле ремешка.
   */
  calibrateBendPose(sensor = this.lastSensor, beacon = null) {
    if (!this.qStretch) {
      return { ok: false, message: 'Сначала выполните Шаг 1 — вытяните прямую руку вперёд.' };
    }
    if (!sensor?.q) {
      return { ok: false, message: 'Нет свежего сигнала гироскопа с браслета.' };
    }
    const qBend = qNormalize(sensor.q);
    const dq = qMul(qConj(this.qStretch), qBend);
    // Приводим dq к положительному скаляру w >= 0, чтобы ось соответствовала углу [0..pi]
    const sign = dq[3] < 0 ? -1 : 1;
    const dqx = dq[0] * sign;
    const dqy = dq[1] * sign;
    const dqz = dq[2] * sign;
    const dqw = clamp(dq[3] * sign, -1, 1);
    const angleRad = 2 * Math.acos(clamp(dqw, 0, 1));
    if (angleRad < 12 * DEG) {
      return {
        ok: false,
        message: 'Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз.',
      };
    }

    const upLocal = vNorm(qRotVec(qConj(this.qStretch), [0, 1, 0]));
    const rawBendAxis = vNorm([dqx, dqy, dqz]);
    // Проецируем ось сгиба локтя ортогонально вертикали upLocal -> получаем точную ось +X (вправо)
    const proj = [
      rawBendAxis[0] - vDot(rawBendAxis, upLocal) * upLocal[0],
      rawBendAxis[1] - vDot(rawBendAxis, upLocal) * upLocal[1],
      rawBendAxis[2] - vDot(rawBendAxis, upLocal) * upLocal[2],
    ];
    const projLen = Math.hypot(proj[0], proj[1], proj[2]);
    if (projLen < 0.25) {
      return {
        ok: false,
        message: 'Движение было почти чисто горизонтальным. Поднимите предплечье в локте вверх к груди.',
      };
    }
    const rightLocal = [proj[0] / projLen, proj[1] / projLen, proj[2] / projLen];
    // +Z канонического предплечья направлен от кисти к локтю (назад), т.к. -Z направлен вперёд к баку:
    // right (+X) × up (+Y) = +Z (backAlongForearm)
    const backLocal = vNorm(vCross(rightLocal, upLocal));
    const upOrtho = vNorm(vCross(backLocal, rightLocal));

    this.qBend = qBend;
    this.qBasis = basisColumnsToQuat(rightLocal, upOrtho, backLocal);
    this.qRefInv = qConj(qMul(this.qStretch, this.qBasis));
    this.bendSpanRad = clamp(angleRad, 18 * DEG, 115 * DEG);
    this.yawTrimRad = 0;

    if (beacon && beacon.fresh && beacon.spanNorm > this.beaconFar.span * 1.12) {
      this.beaconNear = {
        u: clamp(beacon.u, 0.1, 0.9),
        v: clamp(beacon.v, 0.1, 0.92),
        span: clamp(beacon.spanNorm, this.beaconFar.span + 0.04, 0.58),
        captured: true,
      };
    } else {
      this.beaconNear = {
        u: this.beaconFar.u + 0.02,
        v: clamp(this.beaconFar.v + 0.1, 0.2, 0.9),
        span: clamp(this.beaconFar.span * 1.95, this.beaconFar.span + 0.07, 0.45),
        captured: false,
      };
    }

    this.calibratedStep = 2;
    return {
      ok: true,
      step: 2,
      bendDeg: +(angleRad * RAD).toFixed(1),
      beaconCaptured: this.beaconFar.captured && this.beaconNear.captured,
      message: `Калибровка готова (сгиб ${Math.round(angleRad * RAD)}°). Можно вставлять телефон в очки!`,
    };
  }

  onPhaseChange(phase, now = performance.now()) {
    if (phase === 'inspect') {
      this.inspectBaseQ = [...this.qArm];
      this.inspectEnteredAt = now;
      this.itemRot = { x: 0, y: 0, z: 0 };
      this.calmLowerSec = 0;
    } else {
      this.inspectBaseQ = null;
      this.calmLowerSec = 0;
    }
    if (phase === 'search') {
      this.rummageAnchorYaw = null;
      this.rummageAnchorPitch = null;
      this.rummageDir = 0;
      this.dwellAccumSec = 0;
    }
  }

  /**
   * Главный шаг 60 Гц синтеза руки.
   * @param {number} dt — шаг кадра в секундах
   * @param {object} opts — { beacon, phase, revealReady, handOverBin, now }
   */
  update(dt, {
    beacon = null,
    phase = 'search',
    revealReady = false,
    handOverBin = true,
    now = performance.now(),
  } = {}) {
    const safeDt = clamp(dt || 1 / 60, 0.001, 0.1);
    const sensor = this.lastSensor;
    if (!sensor?.q) {
      this.trackingSource = 'idle';
      return this.snapshot({ pokes: 0, decision: null, throwVel: null });
    }

    // Если пользователь ещё не нажал калибровку, автоматически инициализируем мягкую базу
    if (!this.qStretch) {
      this.calibrateStretchPose(sensor, beacon);
    }

    // 1. 60 Гц ориентация предплечья и кисти в пространстве головы/камеры
    const qYawTrim = qAxisAngle([0, 1, 0], this.yawTrimRad);
    const qWorldToArm = qMul(qYawTrim, qMul(this.qRefInv, qMul(sensor.q, this.qBasis)));
    this.qArm = qNormalize(qWorldToArm);

    // Оценка угловой скорости (если телефон не прислал rotationRate — считаем из дельты кватерниона)
    let rotRateDeg = sensor.rotRate;
    if (this.prevQuat && rotRateDeg < 1) {
      rotRateDeg = (qAngleRad(this.prevQuat, this.qArm) / safeDt) * RAD;
    }
    this.prevQuat = [...this.qArm];

    // Куда в пространстве камеры смотрит экран браслета (+Z телефона)
    const screenLocalInArm = qRotVec(qConj(this.qBasis), [0, 0, 1]);
    const screenCamNormal = qRotVec(this.qArm, screenLocalInArm);
    this.screenFacingCos = screenCamNormal[2]; // > 0 — экран повернут к очкам

    // 2. Кинематическая оценка положения руки от плеча/локтя (мгновенная, 60 Гц!)
    const forwardVec = qRotVec(this.qArm, [0, 0, -1]); // на прямой руке [0, 0, -1]
    const pitchUpRad = Math.asin(clamp(forwardVec[1], -1, 1));
    const yawRightRad = Math.atan2(forwardVec[0], Math.max(0.15, -forwardVec[2]));

    // При сгибе локтя вверх к груди (pitchUpRad > 0) дальность уменьшается от 1 до ~0.12;
    // при спокойном опускании руки вниз (pitchUpRad < -25°) рука уходит вниз-ближе
    let kinReach;
    if (pitchUpRad >= 0) {
      kinReach = clamp(1 - (pitchUpRad / Math.max(0.32, this.bendSpanRad)) * 0.85, 0.08, 1.05);
    } else {
      kinReach = clamp(1 + (pitchUpRad / (62 * DEG)) * 0.65, 0.18, 1.05);
    }

    const shoulder = { x: 0.19, y: -0.24, z: -0.18 };
    const armLen = 0.30 + kinReach * 0.56; // от -0.48 м (у груди) до -1.04 м (вытянута вперёд)
    const kinX = shoulder.x + forwardVec[0] * armLen * 0.88 - (1 - kinReach) * 0.03;
    const kinY = shoulder.y + forwardVec[1] * armLen * 0.82 + kinReach * 0.14;
    const kinZ = shoulder.z - armLen * Math.max(0.38, -forwardVec[2]);

    // 3. Оптический якорь двухцветного маяка (~10 Гц) — без рывков подтягивает позицию и дальность
    let targetReach = kinReach;
    let targetX = kinX;
    let targetY = kinY;
    const canTrustBeacon =
      beacon &&
      beacon.fresh &&
      beacon.status !== 'none' &&
      this.screenFacingCos > 0.18;

    if (canTrustBeacon) {
      this.trackingSource = 'gyro+beacon';
      const optX = clamp((beacon.u - this.beaconFar.u) * 1.18 + 0.06, -0.52, 0.55);
      const optY = clamp((this.beaconFar.v - beacon.v) * 0.92 - 0.10, -0.52, 0.42);
      if (beacon.status === 'pair' && beacon.spanNorm > 0.015) {
        // Компенсируем перспективное сжатие двух пятен при наклоне запястья (по данным гироскопа!)
        const tiltCos = clamp(this.screenFacingCos, 0.42, 1.0);
        const trueSpan = beacon.spanNorm / tiltCos;
        const denom = Math.max(0.035, this.beaconNear.span - this.beaconFar.span);
        const optReach = clamp((this.beaconNear.span - trueSpan) / denom, 0.05, 1.1);
        targetReach = kinReach * 0.35 + optReach * 0.65;
        targetX = kinX * 0.30 + optX * 0.70;
        targetY = kinY * 0.30 + optY * 0.70;

        // Мягкая подстройка горизонтального дрейфа гироскопа по положению маяка (до 12°/с)
        const expectedU = clamp(this.beaconFar.u + forwardVec[0] * 0.42, 0.1, 0.9);
        const uErr = beacon.u - expectedU;
        const maxTrimStep = 12 * DEG * safeDt;
        this.yawTrimRad = clamp(
          this.yawTrimRad - clamp(uErr * 0.35, -maxTrimStep, maxTrimStep),
          -55 * DEG,
          55 * DEG
        );
      } else {
        targetX = kinX * 0.55 + optX * 0.45;
        targetY = kinY * 0.55 + optY * 0.45;
      }
    } else {
      this.trackingSource = 'gyro-only';
    }

    const posAlpha = 1 - Math.exp(-safeDt * 18);
    this.reach += (targetReach - this.reach) * posAlpha;
    const targetZ = -0.44 - this.reach * 0.54;
    this.pos.x += (targetX - this.pos.x) * posAlpha;
    this.pos.y += (targetY - this.pos.y) * posAlpha;
    this.pos.z += (targetZ - this.pos.z) * posAlpha;

    // 4. Игровая логика в зависимости от фазы («поиск в баке» vs «осмотр находки»)
    let pokes = 0;
    let decision = null;
    let throwVel = null;

    if (phase === 'search') {
      const extended = this.reach >= 0.62 && handOverBin;
      if (extended) {
        if (this.rummageAnchorYaw === null) {
          this.rummageAnchorYaw = yawRightRad;
          this.rummageAnchorPitch = pitchUpRad;
        }
        const dYaw = yawRightRad - this.rummageAnchorYaw;
        const dPitch = pitchUpRad - this.rummageAnchorPitch;
        const sweepDeg = Math.hypot(dYaw, dPitch) * RAD;
        const signedSweep = Math.abs(dYaw) >= Math.abs(dPitch) ? dYaw : dPitch;
        const newDir = signedSweep >= 0 ? 1 : -1;

        const cooldownOk = now - this.lastPokeAt >= 270;
        const wristSweepHit = sweepDeg >= 6.8 && (this.rummageDir === 0 || newDir !== this.rummageDir);
        const accelRummageHit = sensor.linMag >= 1.35 && rotRateDeg >= 28;

        if (cooldownOk && (wristSweepHit || accelRummageHit)) {
          pokes = 1;
          this.lastPokeAt = now;
          this.rummageDir = newDir;
          this.rummageAnchorYaw = yawRightRad;
          this.rummageAnchorPitch = pitchUpRad;
          this.dwellAccumSec = 0;
        } else if (rotRateDeg >= 12 || sensor.linMag >= 0.55) {
          // Мягкая помощь при плавном помешивании рукой в баке
          this.dwellAccumSec += safeDt;
          if (this.dwellAccumSec >= 0.62 && cooldownOk) {
            pokes = 1;
            this.lastPokeAt = now;
            this.dwellAccumSec = 0;
          }
        }
      } else {
        this.rummageAnchorYaw = null;
        this.rummageAnchorPitch = null;
        this.rummageDir = 0;
        this.dwellAccumSec = 0;
      }
    } else if (phase === 'inspect') {
      if (!this.inspectBaseQ) {
        this.inspectBaseQ = [...this.qArm];
        this.inspectEnteredAt = now;
      }
      // Вращение находки от поворота кисти (с удобным коэффициентом 1.65x, чтобы видеть предмет со всех сторон)
      const qInspectDelta = qMul(qConj(this.inspectBaseQ), this.qArm);
      const eul = quatToEulerYXZ(qInspectDelta);
      this.itemRot = {
        x: clamp(-eul.pitch * 1.55, -Math.PI, Math.PI),
        y: clamp(-eul.yaw * 1.75 - eul.roll * 0.65, -Math.PI * 1.5, Math.PI * 1.5),
        z: clamp(-eul.roll * 1.35, -Math.PI, Math.PI),
      };

      const armedForDecision =
        revealReady &&
        now - this.inspectEnteredAt >= 450 &&
        now - this.lastDecisionAt >= 900;

      if (armedForDecision) {
        // Резкий взмах рукой -> выбросить находку (discard)
        const sharpAccel = sensor.linMag >= 7.2;
        const sharpWhip = rotRateDeg >= 255 && sensor.linMag >= 2.6;
        const pureFastWhip = rotRateDeg >= 340;
        if (sharpAccel || sharpWhip || pureFastWhip) {
          decision = 'discard';
          this.lastDecisionAt = now;
          this.calmLowerSec = 0;
          const sideSign = forwardVec[0] >= 0 ? 1 : -1;
          throwVel = {
            x: clamp(forwardVec[0] * 7.5 + sideSign * 3.8, -9, 9),
            y: clamp(forwardVec[1] * 4.5 + 2.2, 0.5, 7),
            z: -6.8,
          };
        } else {
          // Спокойное опускание руки вниз -> забрать находку в коллекцию (keep)
          const handLowered = pitchUpRad <= -23 * DEG || this.pos.y <= -0.35;
          const handCalm = sensor.linMag < 3.1 && rotRateDeg < 105;
          if (handLowered && handCalm) {
            this.calmLowerSec += safeDt;
            if (this.calmLowerSec >= 0.65) {
              decision = 'keep';
              this.lastDecisionAt = now;
              this.calmLowerSec = 0;
            }
          } else {
            this.calmLowerSec = Math.max(0, this.calmLowerSec - safeDt * 2.2);
          }
        }
      }
    }

    return this.snapshot({ pokes, decision, throwVel, pitchUpDeg: +(pitchUpRad * RAD).toFixed(1) });
  }

  snapshot(extra = {}) {
    return {
      calibratedStep: this.calibratedStep,
      trackingSource: this.trackingSource,
      qArm: [...this.qArm],
      pos: { ...this.pos },
      reach: +this.reach.toFixed(3),
      screenFacingCos: +this.screenFacingCos.toFixed(3),
      itemRot: { ...this.itemRot },
      calmLowerProgress: +clamp(this.calmLowerSec / 0.65, 0, 1).toFixed(2),
      ...extra,
    };
  }
}
