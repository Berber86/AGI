// wristHandFusion.js — биомеханический 6DoF-трекинг и физика игровой руки
// (правой или левой) для «Белой ночи».
//
// Ключевые возможности:
//   1. Поддержка ПРАВОЙ ('right') и ЛЕВОЙ ('left') руки: зеркалирование плеча,
//      вектора локтя (pole vector), анатомического сгиба к груди и оптического центра.
//   2. Ведущий контур 60 Гц (гироскоп W3C + линейное ускорение по WebRTC) +
//      оптический двухцветный маяк (~10 Гц) с гиро-компенсацией наклона экрана.
//   3. Калибровка в 2 жеста (1: прямая рука вперёд -> 2: согнуть локоть к груди)
//      для произвольного угла крепления ремешка на правой или левой руке.
//   4. Полная биомеханика плечо -> локоть -> запястье -> кисть:
//      - аналитическая двухзвенная инверсная кинематика (2-Bone IK без разрывов);
//      - честное разделение сгибания локтя к груди, поднятия руки высоко вверх
//        и расслабленного опускания руки вниз вдоль тела;
//      - привязка плечевого пояса к корпусу (при подъёме головы к луне опущенная
//        рука остаётся внизу у тела, а не «прилипает» к носу);
//      - критически демпфированная пружинная физика 2-го порядка (масса и плавная
//        скорость vel для живой вторичной инерции пальцев и манжеты).
//   5. Строго без виброотклика и звуков.

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const Q_ENU_TO_GL = [-Math.SQRT1_2, 0, 0, Math.SQRT1_2];

// Длины сегментов руки в метрах видового пространства (плечо L1 + предплечье L2)
export const UPPER_ARM_LEN = 0.33;
export const FOREARM_LEN = 0.31;

/* Порядок приоритетов источников (осознанная схема, а не «кто громче»):
   1. Гироскоп запястья 60 Гц — ВЕДУЩИЙ по движению: он знает каждый кадр, поэтому
      рука не «догоняет» игрока на полпути (запаздывание движения ≈ одна пружина).
   2. Камера ~11 Гц — КОРРЕКТИРУЮЩИЙ по положению: она одна знает абсолют, но говорит
      редко. Её вес поднимается и опускается ТОЛЬКО плавно (OPTIC_W_RATE), а выбор
      корня и длина луча ограничены по скорости — иначе редкий, но резкий кадр оптики
      перетягивает позу и рождает ровно тот рывок, который бесит на телефоне.
   3. Анатомия (длина костей) — закон, а не предпочтение: дальше выпрямленной руки и
      ближе «внутрь плеча» запястье не уходит никогда.
   4. Когда данных нет — держим последнее честное решение (самопроизвольное разгибание
      руки заметнее и хуже, чем сохранение позы).
   5. Выход проходит через пружину критического демпфирования с потолками скорости и
      ускорения — «безумный рывок» становится физически невозможным на уровне вывода.
   Цена: поза отстаёт на ~1 кадр оптики + 60..120 мс пружины. Разовые ложные взмахи
   допустимы: канал жеста (linMag/rotRate) идёт мимо этих фильтров и остаётся резким. */
const OPTIC_TAU_RISE = 0.1; // с — как быстро набираем доверие к маяку
const OPTIC_TAU_FALL = 0.38; // с — как медленно его отпускаем (пропало пятно ≠ проzyła поза)
const OPTIC_W_RATE = 2.2; // 1/с — потолок скорости кроссфейда «гироскоп ↔ оптика»
const MAX_WRIST_SPEED = 4.6; // м/с — быстрее кисть игрока не летает
const MAX_WRIST_ACC = 40; // м/с² — потолок ускорения: он и убирает рывок

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


/**
 * Аналитическая двухзвенная инверсная кинематика (Плечо S -> Локоть E -> Запястье W)
 * по теореме косинусов и анатомическому направлению локтя poleDir.
 */
export function solveTwoBoneArmIK(
  shoulder,
  wristTarget,
  l1 = UPPER_ARM_LEN,
  l2 = FOREARM_LEN,
  poleDir = [0.42, -0.88, 0.20]
) {
  const sx = shoulder.x ?? shoulder[0] ?? 0;
  const sy = shoulder.y ?? shoulder[1] ?? 0;
  const sz = shoulder.z ?? shoulder[2] ?? 0;
  const tx = wristTarget.x ?? wristTarget[0] ?? 0;
  const ty = wristTarget.y ?? wristTarget[1] ?? 0;
  const tz = wristTarget.z ?? wristTarget[2] ?? 0;
  const dx = tx - sx;
  const dy = ty - sy;
  const dz = tz - sz;
  const rawDist = Math.hypot(dx, dy, dz);

  // Мягко удерживаем дистанцию в анатомических пределах (оставляя лёгкий живой микросгиб ~7° на максимуме)
  const minReach = Math.abs(l1 - l2) + 0.045;
  const maxReach = l1 + l2 - 0.008;
  const r = clamp(rawDist, minReach, maxReach);

  const ux = rawDist > 1e-6 ? dx / rawDist : 0;
  const uy = rawDist > 1e-6 ? dy / rawDist : 0;
  const uz = rawDist > 1e-6 ? dz / rawDist : -1;

  const wrist = {
    x: sx + ux * r,
    y: sy + uy * r,
    z: sz + uz * r,
  };

  const a = (l1 * l1 - l2 * l2 + r * r) / (2 * r);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));

  // Ортогонализуем poleDir относительно оси плечо->запястье
  const pNorm = vNorm(poleDir);
  const dotPU = pNorm[0] * ux + pNorm[1] * uy + pNorm[2] * uz;
  let px = pNorm[0] - dotPU * ux;
  let py = pNorm[1] - dotPU * uy;
  let pz = pNorm[2] - dotPU * uz;
  let pLen = Math.hypot(px, py, pz);
  if (pLen < 1e-5) {
    // Запасная перпендикулярная ось, если рука направлена точно вдоль poleDir
    const fb = vCross([ux, uy, uz], [1, 0, 0]);
    const fbN = vNorm(fb);
    px = fbN[0]; py = fbN[1]; pz = fbN[2];
    pLen = 1;
  } else {
    px /= pLen; py /= pLen; pz /= pLen;
  }

  const elbow = {
    x: sx + ux * a + px * h,
    y: sy + uy * a + py * h,
    z: sz + uz * a + pz * h,
  };

  // Внутренний угол сгиба в локте: 0° = полностью прямая линия, ~110° = сильно согнута у груди
  const cosInterior = clamp((l1 * l1 + l2 * l2 - r * r) / (2 * l1 * l2), -1, 1);
  const elbowBendDeg = (Math.PI - Math.acos(cosInterior)) * RAD;

  return { shoulder: { x: sx, y: sy, z: sz }, elbow, wrist, elbowBendDeg, clampedDist: r };
}

/**
 * Насколько можно доверять лучу с маяка: статус пары, «свежесть» пакета и то, не ушёл
 * ли объект за край кадра (на границе пиксели враньяют сильнее всего).
 */
function beaconConfidence(beacon) {
  if (!beacon || !beacon.fresh || beacon.status === 'none') return 0;
  const edgeMargin = Math.min(beacon.u, 1 - beacon.u, beacon.v, 1 - beacon.v);
  if (!(edgeMargin > 0)) return 0; // маяк ушёл за край — направления нам не видно
  const edgeFade = clamp((edgeMargin - 0.015) / 0.05, 0.2, 1);
  return (beacon.status === 'pair' ? 1 : 0.45) * edgeFade;
}

export class WristHandFusion {
  constructor(opts = 'right') {
    const sideArg = typeof opts === 'string' ? opts : opts?.handSide;
    this.handSide = sideArg === 'left' ? 'left' : 'right';

    // Калибровка двух жестов
    this.qStretch = null;
    this.qBend = null;
    this.qBasis = [0, 0, 0, 1];
    this.qRefInv = [0, 0, 0, 1];
    this.bendSpanRad = 52 * DEG;
    this.bendInwardYawRad = 0;
    this.yawTrimRad = 0;
    this.pendingSessionRecenter = false;
    this.pendingRecenterWindowSec = 0;
    this.calibratedStep = 0;

    // Оптическая шкала двухцветного маяка
    const defaultU = this._defaultBeaconU();
    this.beaconFar = { u: defaultU, v: 0.54, span: 0.105, captured: false };
    this.beaconNear = { u: defaultU, v: 0.64, span: 0.235, captured: false };

    // Входные сэмплы
    this.lastSensor = null;
    this.sensorSilentSec = 0;
    this.prevQuat = null;
    this.prevFwd = null;

    // Состояние корпуса (торс мягко доворачивается за большими поворотами головы)
    this.torsoYaw = 0;

    // Пружинно-демпферная физика запястья в пространстве корпуса + проекция в камеру
    const side = this.sideSign;
    this.torsoWristPos = { x: side * 0.16, y: -0.22, z: -0.50 };
    this.torsoWristVel = { x: 0, y: 0, z: 0 };

    this.qArm = [0, 0, 0, 1];
    this.qArmTorso = [0, 0, 0, 1];
    this.shoulderPos = { x: side * 0.21, y: -0.27, z: -0.08 };
    this.elbowPos = { x: side * 0.24, y: -0.44, z: -0.26 };
    this.pos = { x: side * 0.16, y: -0.22, z: -0.50 };
    this.vel = { x: 0, y: 0, z: 0 };
    this.elbowBendDeg = 68;
    this.reach = 0.25;
    this.elevationDeg = 0;
    // Короткая история позы головы (нужна, чтобы переводить ЛУЧ с маяка по тому наклону
    // головы, при котором этот луч был снят, — см. qCamToTorsoAt).
    this.headHist = [];
    this.prevBeaconSpan = NaN; // приращение видимого разноса маяка — страж согласованности
    this.prevSolvedLen = NaN;
    this.beaconRho = NaN; // непрерывность выбора корня оптики (метры от камеры до запястья)
    this.confEff = 0; // сглаженное доверие к маяку (сырое conf — только «данные есть/нет»)
    this.opticRootNear = false; // какая из двух анатомических гипотез выбрана сейчас
    this.opticW = 0; // текущий вес оптики в смеси (растёт и тает только плавно)
    this.bendHoldRad = 0; // последний уверенно решённый угол локтя
    this.holdTiltRad = 0; // наклон оси предплечья в тот же момент
    this.bendHoldSet = false;
    this.opticMotion = 0; // +1 = двигался локоть, -1 = плечо (доля приращения наклона)
    this.screenFacingCos = 0.85;
    this.trackingSource = 'idle';

    // Состояние поиска («порыться в баке»)
    this.rummageAnchorYaw = null;
    this.rummageAnchorPitch = null;
    this.rummageDir = 0;
    this.lastPokeAt = -1000;
    this.dwellAccumSec = 0;

    // Состояние осмотра (кватернион на SO(3) без гимбал-лока!) и выбора судьбы находки
    this.inspectBaseQ = null;
    this.inspectPrevQ = null;
    this.inspectItemQ = [0, 0, 0, 1];
    this.inspectEnteredAt = 0;
    this.maxInspectPitchRad = 0;
    this.maxInspectWristY = 0; // потолок высоты кисти за этот осмотр — «опустить» значит ниже него
    this.itemRot = { x: 0, y: 0, z: 0 };
    this.calmLowerSec = 0;
    this.lastDecisionAt = -2000;
  }

  get sideSign() {
    return this.handSide === 'left' ? -1 : 1;
  }

  _defaultBeaconU() {
    return this.handSide === 'left' ? 0.46 : 0.54;
  }

  /**
   * Переключение активной руки: 'right' (правая) или 'left' (левая).
   */
  setHandSide(side) {
    const next = side === 'left' ? 'left' : 'right';
    if (next === this.handSide) return this.handSide;
    this.handSide = next;
    const s = this.sideSign;
    if (!this.beaconFar.captured) this.beaconFar.u = this._defaultBeaconU();
    if (!this.beaconNear.captured) this.beaconNear.u = this._defaultBeaconU();
    this.torsoWristPos = { x: s * Math.abs(this.torsoWristPos.x), y: this.torsoWristPos.y, z: this.torsoWristPos.z };
    this.torsoWristVel = { x: 0, y: 0, z: 0 };
    this.shoulderPos = { x: s * 0.21, y: -0.27, z: -0.08 };
    this.elbowPos = { x: s * 0.24, y: -0.44, z: -0.26 };
    this.pos = { x: s * Math.abs(this.pos.x), y: this.pos.y, z: this.pos.z };
    this.vel = { x: 0, y: 0, z: 0 };
    return this.handSide;
  }

  exportCalibration() {
    if (this.calibratedStep < 2) return null;
    return {
      handSide: this.handSide,
      qStretch: this.qStretch,
      qBend: this.qBend,
      qBasis: this.qBasis,
      qRefInv: this.qRefInv,
      bendSpanRad: this.bendSpanRad,
      bendInwardYawRad: this.bendInwardYawRad,
      beaconFar: this.beaconFar,
      beaconNear: this.beaconNear,
    };
  }

  importCalibration(data) {
    if (!data || !Array.isArray(data.qBasis) || !Array.isArray(data.qRefInv)) return false;
    if (data.handSide === 'left' || data.handSide === 'right') {
      this.setHandSide(data.handSide);
    }
    this.qStretch = data.qStretch || [0, 0, 0, 1];
    this.qBend = data.qBend || [0, 0, 0, 1];
    this.qBasis = qNormalize(data.qBasis);
    this.qRefInv = qNormalize(data.qRefInv);
    this.bendSpanRad = clamp(Number(data.bendSpanRad) || 52 * DEG, 15 * DEG, 125 * DEG);
    this.bendInwardYawRad = Number(data.bendInwardYawRad) || 0;
    if (data.beaconFar) {
      this.beaconFar = {
        ...this.beaconFar,
        ...data.beaconFar,
        u: this._defaultBeaconU(),
        v: 0.54,
      };
    }
    if (data.beaconNear) {
      this.beaconNear = {
        ...this.beaconNear,
        ...data.beaconNear,
        u: clamp(this._defaultBeaconU() - this.sideSign * 0.03, 0.15, 0.85),
        v: 0.64,
      };
    }
    this.calibratedStep = 2;
    this.yawTrimRad = 0;
    return true;
  }

  feedSensor(sample) {
    if (!sample || !Array.isArray(sample.q) || sample.q.length !== 4) return;
    if (sample.handSide === 'left' || sample.handSide === 'right') {
      this.setHandSide(sample.handSide);
    }
    this.lastSensor = {
      q: qNormalize(sample.q),
      linMag: Math.max(0, Number(sample.linMag) || 0),
      rotRate: Math.max(0, Number(sample.rotRate) || 0),
      acc: Array.isArray(sample.acc) ? sample.acc : [0, 0, 0],
      ts: sample.ts ?? performance.now(),
    };
    this.sensorSilentSec = 0;
  }

  calibrateStretchPose(sensor = this.lastSensor, beacon = null) {
    if (!sensor?.q) {
      return { ok: false, message: 'Нет сигнала от гироскопа на запястье. Подключите браслет.' };
    }
    this.qStretch = qNormalize(sensor.q);
    const upLocal = vNorm(qRotVec(qConj(this.qStretch), [0, 1, 0]));
    let backHint = [0, 0, 1];
    if (Math.abs(vDot(backHint, upLocal)) > 0.9) backHint = [0, 1, 0];
    const rightFallback = vNorm(vCross(upLocal, backHint));
    const backOrtho = vNorm(vCross(rightFallback, upLocal));
    this.qBasis = basisColumnsToQuat(rightFallback, upLocal, backOrtho);
    this.qRefInv = qConj(qMul(this.qStretch, this.qBasis));
    this.yawTrimRad = 0;
    this.torsoYaw = 0;

    const defU = this._defaultBeaconU();
    // Во время калибровки телефон-очки ещё держат в другой руке (не на голове!),
    // поэтому у маяка берём только оптический масштаб дистанции spanNorm, а центр (u, v)
    // строго привязываем к нейтральной оптической оси будущих VR-очков на голове!
    if (beacon && beacon.fresh && beacon.status !== 'none' && beacon.spanNorm > 0.015) {
      this.beaconFar = {
        u: defU,
        v: 0.54,
        span: clamp(beacon.spanNorm, 0.02, 0.42),
        captured: true,
      };
    } else {
      this.beaconFar = { u: defU, v: 0.54, span: 0.105, captured: false };
    }
    this.calibratedStep = 1;
    const armLabel = this.handSide === 'left' ? 'левая рука' : 'правая рука';
    return {
      ok: true,
      step: 1,
      beaconCaptured: this.beaconFar.captured,
      message: `Шаг 1 записан (прямая ${armLabel}). Теперь согните локоть ближе к груди и нажмите Шаг 2.`,
    };
  }

  calibrateBendPose(sensor = this.lastSensor, beacon = null) {
    if (!this.qStretch) {
      return { ok: false, message: 'Сначала выполните Шаг 1 — вытяните прямую руку вперёд.' };
    }
    if (!sensor?.q) {
      return { ok: false, message: 'Нет свежего сигнала гироскопа с браслета.' };
    }
    const qBend = qNormalize(sensor.q);
    const dq = qMul(qConj(this.qStretch), qBend);
    // У приращения важна только величина угла: ось этого конкретного поворота
    // для «Жеста 2» не используется, поэтому разлагать dq на оси некуда.
    const dqw = clamp(dq[3], -1, 1);
    const angleRad = 2 * Math.acos(Math.abs(dqw));
    if (angleRad < 12 * DEG) {
      return {
        ok: false,
        message: 'Согните руку в локте чуть сильнее (хотя бы на 20°) и нажмите Шаг 2 ещё раз.',
      };
    }

    const upLocal = vNorm(qRotVec(qConj(this.qStretch), [0, 1, 0]));
    const g2 = vNorm(qRotVec(qConj(qBend), [0, 1, 0]));
    const cosLift = clamp(vDot(g2, upLocal), -1, 1);
    const projG2 = [
      g2[0] - cosLift * upLocal[0],
      g2[1] - cosLift * upLocal[1],
      g2[2] - cosLift * upLocal[2],
    ];
    const sinLift = Math.hypot(projG2[0], projG2[1], projG2[2]);
    if (sinLift < Math.sin(13 * DEG)) {
      return {
        ok: false,
        message: 'Поднимите предплечье в локте вверх хотя бы на 20° выше горизонтали (не выворачивая кисть).',
      };
    }

    // Проекция гравитации 2-й позы ортогонально гравитации 1-й позы даёт ТОЧНУЮ продольную
    // ось предплечья без ошибки ψ/2, даже если игрок естественно увёл кисть внутрь к груди!
    const fwdLocal = [projG2[0] / sinLift, projG2[1] / sinLift, projG2[2] / sinLift];
    const backLocal = [-fwdLocal[0], -fwdLocal[1], -fwdLocal[2]];
    const rightLocal = vNorm(vCross(upLocal, backLocal));
    const upOrtho = vNorm(vCross(backLocal, rightLocal));

    const qBasisCandidate = basisColumnsToQuat(rightLocal, upOrtho, backLocal);
    const qRefInvCandidate = qConj(qMul(this.qStretch, qBasisCandidate));
    const qBendArm = qMul(qRefInvCandidate, qMul(qBend, qBasisCandidate));
    const bendFwd = qRotVec(qBendArm, [0, 0, -1]);
    const liftAngleRad = Math.atan2(sinLift, cosLift);

    this.qBend = qBend;
    this.qBasis = qBasisCandidate;
    this.qRefInv = qRefInvCandidate;
    this.bendSpanRad = clamp(liftAngleRad, 18 * DEG, 115 * DEG);
    this.bendInwardYawRad = Math.atan2(bendFwd[0], Math.max(0.15, -bendFwd[2]));
    this.yawTrimRad = 0;

    const nearU = clamp(this._defaultBeaconU() - this.sideSign * 0.03, 0.15, 0.85);
    if (beacon && beacon.fresh && beacon.status !== 'none' && beacon.spanNorm > this.beaconFar.span * 1.12) {
      this.beaconNear = {
        u: nearU,
        v: 0.64,
        span: clamp(beacon.spanNorm, this.beaconFar.span + 0.04, 0.58),
        captured: true,
      };
    } else {
      this.beaconNear = {
        u: nearU,
        v: 0.64,
        span: clamp(this.beaconFar.span * 1.95, this.beaconFar.span + 0.07, 0.45),
        captured: false,
      };
    }

    this.calibratedStep = 2;
    const armLabel = this.handSide === 'left' ? 'левая рука' : 'правая рука';
    return {
      ok: true,
      step: 2,
      handSide: this.handSide,
      bendDeg: +(liftAngleRad * RAD).toFixed(1),
      beaconCaptured: this.beaconFar.captured && this.beaconNear.captured,
      message: `Калибровка готова (${armLabel}, сгиб ${Math.round(liftAngleRad * RAD)}°). Можно надевать очки!`,
    };
  }

  /**
   * Мягкая синхронизация горизонтального азимута при входе в VR (после 3-секундного отсчёта):
   * если в момент окончания отсчёта игрок ещё держит шлем руками у лица (рука задрана > 32° вверх
   * или активно движется), откладываем выравнивание на пару секунд, пока он спокойно не опустит
   * руку перед собой, чтобы НЕ записать ложный боковой угол от ремешка очков!
   */
  recenterOnSessionStart(now = performance.now()) {
    this.torsoYaw = 0;
    this.pendingSessionRecenter = false;
    this.pendingRecenterWindowSec = 0;
    if (!this.lastSensor?.q || !this.qStretch) return;
    if (this.sensorSilentSec > 1.6 || now - this.lastSensor.ts > 2000) return;

    const qRaw = qNormalize(qMul(this.qRefInv, qMul(this.lastSensor.q, this.qBasis)));
    const fwd = qRotVec(qRaw, [0, 0, -1]);
    const pitchRad = Math.asin(clamp(fwd[1], -1, 1));
    const handAtHeadOrMoving =
      pitchRad > 32 * DEG ||
      this.lastSensor.rotRate > 38 ||
      this.lastSensor.linMag > 1.3;

    if (handAtHeadOrMoving) {
      this.pendingSessionRecenter = true;
      this.pendingRecenterWindowSec = 10;
      return;
    }

    const horizLen = Math.hypot(fwd[0], fwd[2]);
    if (horizLen < 0.35) return;
    const azRad = Math.atan2(fwd[0], -fwd[2]);
    if (Math.abs(azRad) > 22 * DEG) {
      this.yawTrimRad = azRad;
    }
  }

  _currentTorsoQuat() {
    if (this.lastSensor?.q && this.qStretch) {
      const qYawTrim = qAxisAngle([0, 1, 0], this.yawTrimRad + this.torsoYaw);
      return qNormalize(qMul(qYawTrim, qMul(this.qRefInv, qMul(this.lastSensor.q, this.qBasis))));
    }
    return [...this.qArmTorso];
  }

  onPhaseChange(phase, now = performance.now()) {
    if (phase === 'inspect') {
      const qStart = this._currentTorsoQuat();
      const fwdStart = qRotVec(qStart, [0, 0, -1]);
      this.inspectBaseQ = [...qStart];
      this.inspectPrevQ = [...qStart];
      this.inspectItemQ = [0, 0, 0, 1];
      this.inspectEnteredAt = now;
      this.maxInspectPitchRad = Math.asin(clamp(fwdStart[1], -1, 1));
      this.maxInspectWristY = this.torsoWristPos.y;
      this.itemRot = { x: 0, y: 0, z: 0 };
      this.calmLowerSec = 0;
    } else {
      this.inspectBaseQ = null;
      this.inspectPrevQ = null;
      this.inspectItemQ = [0, 0, 0, 1];
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
   * Главный шаг 60 Гц биомеханики и физики руки.
   */
  update(dt, {
    beacon = null,
    phase = 'search',
    revealReady = false,
    handOverBin = true,
    headLook = { yaw: 0, pitch: 0 },
    now = performance.now(),
  } = {}) {
    const safeDt = clamp(dt || 1 / 60, 0.001, 0.1);
    const sensor = this.lastSensor;
    if (!sensor?.q) {
      this.trackingSource = 'idle';
      return this.snapshot({ pokes: 0, decision: null, throwVel: null });
    }

    if (!this.qStretch) {
      this.calibrateStretchPose(sensor, beacon);
    }

    const side = this.sideSign; // +1 правая, -1 левая
    const headYaw = Number.isFinite(headLook?.yaw) ? headLook.yaw : 0;
    const headPitch = Number.isFinite(headLook?.pitch) ? headLook.pitch : 0;

    // 1. 60 Гц ориентация предплечья и кисти в гравитационной системе корпуса:
    // Внимание на знак: headYaw > 0 — это физический поворот ВПРАВО (Ry(-headYaw) в OpenGL),
    // поэтому переход из мира в повернувшийся корпус требует умножения на Ry(+torsoYaw)!
    const qRawArm = qNormalize(qMul(this.qRefInv, qMul(sensor.q, this.qBasis)));
    if (this.pendingSessionRecenter) {
      this.pendingRecenterWindowSec -= safeDt;
      if (this.pendingRecenterWindowSec <= 0) {
        this.pendingSessionRecenter = false;
      } else {
        const rawFwd = qRotVec(qRawArm, [0, 0, -1]);
        const rawPitch = Math.asin(clamp(rawFwd[1], -1, 1));
        const rawHoriz = Math.hypot(rawFwd[0], rawFwd[2]);
        if (
          rawPitch <= 28 * DEG &&
          rawPitch >= -32 * DEG &&
          rawHoriz >= 0.45 &&
          sensor.rotRate <= 35 &&
          sensor.linMag <= 1.2
        ) {
          const azRad = Math.atan2(rawFwd[0], -rawFwd[2]);
          if (Math.abs(azRad) > 22 * DEG) {
            this.yawTrimRad = azRad;
          }
          this.pendingSessionRecenter = false;
        }
      }
    }

    // Честно разделяем поворот ТОЛЬКО шеи (игрок смотрит по сторонам двора, держа руку в баке)
    // и разворот ВСЕГО корпуса/кресла (когда и голова, и рука поворачиваются в одну сторону вместе)!
    const qTrimOnly = qNormalize(qMul(qAxisAngle([0, 1, 0], this.yawTrimRad), qRawArm));
    const trimFwd = qRotVec(qTrimOnly, [0, 0, -1]);
    const trimHoriz = Math.hypot(trimFwd[0], trimFwd[2]);
    let torsoTargetYaw = this.torsoYaw;
    if (phase === 'search' && trimHoriz > 0.35) {
      const armYawRight = Math.atan2(trimFwd[0], -trimFwd[2]);
      const dHead = headYaw - this.torsoYaw;
      const dArm = armYawRight - this.torsoYaw;
      const dShared = dHead >= 0 ? clamp(dArm, 0, dHead) : clamp(dArm, dHead, 0);
      torsoTargetYaw = clamp(this.torsoYaw + dShared, headYaw - 50 * DEG, headYaw + 50 * DEG);
    } else {
      torsoTargetYaw = clamp(this.torsoYaw, headYaw - 50 * DEG, headYaw + 50 * DEG);
    }
    const yawDiff = torsoTargetYaw - this.torsoYaw;
    if (Math.abs(yawDiff) > 18 * DEG) {
      this.torsoYaw += (yawDiff - Math.sign(yawDiff) * 18 * DEG) * 0.45;
    }
    this.torsoYaw += (torsoTargetYaw - this.torsoYaw) * Math.min(1, safeDt * 3.2);
    const relHeadYaw = headYaw - this.torsoYaw;
    // Перевод из системы корпуса в систему камеры очков: Rx(-headPitch) * Ry(+relHeadYaw)
    const qTorsoToCam = qMul(
      qAxisAngle([1, 0, 0], -headPitch),
      qAxisAngle([0, 1, 0], relHeadYaw)
    );

    const qYawTrim = qAxisAngle([0, 1, 0], this.yawTrimRad + this.torsoYaw);
    this.qArmTorso = qNormalize(qMul(qYawTrim, qRawArm));
    this.qArm = qNormalize(qMul(qTorsoToCam, this.qArmTorso));

    let rotRateDeg = sensor.rotRate;
    if (this.prevQuat && rotRateDeg < 1) {
      rotRateDeg = (qAngleRad(this.prevQuat, this.qArmTorso) / safeDt) * RAD;
    }
    this.prevQuat = [...this.qArmTorso];

    // Защита от обрыва связи / сна экрана браслета посреди игры:
    // если новых пакетов нет > 120 мс, плавно гасим старый импульс linMag/rotRate,
    // а после 1.6 с тишины блокируем любые фантомные «рытья» и авто-решения!
    const silentSec = this.sensorSilentSec;
    this.sensorSilentSec += safeDt;
    const impulseDecay = silentSec > 0.12 ? Math.exp(-(silentSec - 0.12) * 8) : 1;
    const effLinMag = sensor.linMag * impulseDecay;
    rotRateDeg *= impulseDecay;
    const sensorStale = silentSec > 1.6;

    // Куда в пространстве камеры смотрит экран браслета (+Z телефона)
    const screenLocalInArm = qRotVec(qConj(this.qBasis), [0, 0, 1]);
    const screenCamNormal = qRotVec(this.qArm, screenLocalInArm);
    this.screenFacingCos = screenCamNormal[2];

    // 2. Ориентация предплечья из гироскопа (60 Гц). ВАЖНО: наклон оси предплечья
    //    берётся ПОЛНЫМ углом в вертикальной плоскости (atan2), а не asin(): asin
    //    «складывает» движение за 90° (100° сгибания игра видела как 80°, а 140° —
    //    как 40°), из-за чего локоть на первой же половине диапазона упирался и
    //    начинал разгибаться обратно, когда игрок догибал руку к груди.
    const fwd = qRotVec(this.qArmTorso, [0, 0, -1]);
    let swingRateDeg = 0;
    if (this.prevFwd) {
      const cosSwing = clamp(vDot(this.prevFwd, fwd), -1, 1);
      swingRateDeg = (Math.acos(cosSwing) / safeDt) * RAD;
    }
    this.prevFwd = [...fwd];
    const pitchUpRad = Math.asin(clamp(fwd[1], -1, 1));
    const yawRightRad = Math.atan2(fwd[0], Math.max(0.12, Math.hypot(fwd[2], fwd[1] * 0.35)));
    const armTiltRad = Math.atan2(fwd[1], -fwd[2]); // -180°..180°, без «складывания»
    this.elevationDeg = +(armTiltRad * RAD).toFixed(1);

    // 3. ГЕОМЕТРИЯ, а не догадки. Локоть — шарнир с известными длинами костей,
    //    поэтому «где запястье» вычисляется, а не угадывается по наклону кисти:
    //
    //        | ρ·r − (плечо + L2·f) | = L1
    //
    //    r — единичный луч камеры на маяк (его дают просто пиксели u,v и угол обзора),
    //    f — ось предплечья из гироскопа, L1/L2 — плечо и предплечье, ρ — неизвестное
    //    расстояние до запястья. Квадратное уравнение: луч либо проходит через сферу
    //    плеча (тогда два решения — локоть «ближе» или «дальше», берём непрерывное),
    //    либо промахивается (тогда берём ближайшую точку и доверяем гироскопу).
    //    Это и есть ответ на вопрос «когда рука может быть только согнута в локте»:
    //    подъём руки вверх и сгибание локтя дают РАЗНЫЙ луч камеры, поэтому их больше
    //    нельзя перепутать, как это делала старая шкала «pitch -> насколько согнут локоть».
    const chainMax = UPPER_ARM_LEN + FOREARM_LEN; // 0.640 м полностью выпрямленной руки
    const maxChain = chainMax - 0.001;           // совпадает с «живым» пределом IK (микросгиб ~7°)
    const minChain = 0.18;                       // предельный сгиб (~150°, кисть у груди)
    const shoulderLiftY =
      clamp(armTiltRad / (75 * DEG), 0, 1) * 0.075 - clamp(-armTiltRad / (80 * DEG), 0, 1) * 0.03;
    const shoulderTorso = { x: side * 0.21, y: -0.27 + shoulderLiftY, z: -0.08 };

    // Приор без оптики: из общего наклона оси предплечья «сгибание локтя» — это увод
    // кисти ВНУТРЬ к груди, а «подъём руки в небо» с отведением наружу выполняет плечо.
    const inwardCross = clamp(-side * yawRightRad / (26 * DEG), 0, 1);
    const foldRange = Math.max(20 * DEG, this.bendSpanRad); // «полный сгиб» из калибровки
    const upTilt = Math.max(0, armTiltRad);
    let bendGyroRad = 0;
    if (upTilt > 0) {
      // До калибровочного «кисть у груди» приращение наклона — это почти целиком локоть:
      // так устроено тело, плечо при этом почти не двигается. Всё, что выше диапазона
      // сгиба, — работа плеча (руку поднимают вверх), и наружу отведенная кисть
      // усиливает именно эту долю.
      bendGyroRad = Math.min(upTilt, foldRange) * (0.95 + 0.05 * inwardCross);
      if (upTilt > foldRange) {
        bendGyroRad -= Math.min(bendGyroRad * 0.55, (upTilt - foldRange) * (1 - inwardCross) * 1.25);
      }
    } else {
      // Предплечье смотрит вниз — сгибание это или рука висит вдоль тела, камера сейчас
      // не говорит, поэтому это толькоprior: лёгкий физиологический недосгиб (локоть
      // никогда не locked-out на 0°) плюс толика на «кисть далеко за линией тела».
      // На КАНАЛ ЖЕСТА этот prior больше не влияет: reach берётся из расстояния (см. ниже),
      // так что 40° здесь не «ломают» открытие бака — а для позы руки это честная анатомия.
      bendGyroRad = clamp(-armTiltRad * 0.18, 0, 40 * DEG);
    }
    bendGyroRad = clamp(bendGyroRad, 0, 150 * DEG);
    // До удержания и до оптики — независимое показание датчика (им оно и должно судить,
    // какая из двух анатомических гипотез активна, иначе фильтр сам себя кормит).
    const bendSensorRad = bendGyroRad;
    // Глубокий сгиб локтя рука «доделывает» уже без оптики: кисть у груди уходит из
    // кадра шлема. Чтобы не угадывать, чья это работа (локтя или плеча), помним, КАКОЙ
    // сустав двинулся последним по честному измерению, и дельту наклона отдаём ему же.
    // Именно поэтому подъём руки вверх не превращается в сгибание, а догнутый локоть —
    // обратно в разгибание. Через 4 с без маяка приор плавно возвращается к эвристике.
    const beaconUsableNow = beaconConfidence(beacon) > 0.5;
    if (this.bendHoldSet) {
      // Пока оптика видит маяк, авторитет у ГЕОМЕТРИИ: приор-удержание включается только
      // в следам (иначе собственное запаздывание удержания душило бы свежее решение).
      // Пока маяк не виден, удержание работает ПОЛНОСТЬЮ и не «гаснет» со временем:
      // новой информации нет, а самопроизвольное разгибание руки (оно и было жалобой
      // «локоть не сгибается / рука падает») заметно хуже, чем сохранение последнего
      // честного решения. Как только кисть возвращается в кадр, геометрия исправляет всё.
      const holdFade = beaconUsableNow ? 0 : 1;
      // Доля приращения, уходящая в локоть: чему научила оптика, но не больше, чем
      // позволяет признак «кисть идёт к груди». Подъём руки в небо (кисть наружу) не
      // имеет права превращаться в сгибание локтя, даже когда маяк уже не виден.
      const share = clamp(0.5 + 0.5 * this.opticMotion, 0, 1) * (0.35 + 0.65 * inwardCross);
      const dTilt = armTiltRad - this.holdTiltRad;
      // Разгибание руки однозначное (ось предплечья вернулась к калибровочной — локоть
      // обязан разогнуться сразу), а вот догибание вне кадра делим между локтем и плечом.
      const heldBend = this.bendHoldRad + (dTilt >= 0 ? dTilt * share : dTilt);
      bendGyroRad = bendGyroRad + (clamp(heldBend, 0, 150 * DEG) - bendGyroRad) * holdFade;
    }
    const flexAxis = vNorm(vCross([0, 1, 0], fwd));
    const upperDir = qRotVec(qAxisAngle(flexAxis, bendGyroRad), fwd);
    const gyroTarget = {
      x: shoulderTorso.x + UPPER_ARM_LEN * upperDir[0] + FOREARM_LEN * fwd[0],
      y: shoulderTorso.y + UPPER_ARM_LEN * upperDir[1] + FOREARM_LEN * fwd[1],
      z: shoulderTorso.z + UPPER_ARM_LEN * upperDir[2] + FOREARM_LEN * fwd[2],
    };
    let targetTorso = gyroTarget;

    // Поза головы по времени кадра маяка. Трекер работает ~11 Гц: свежий пакет мог быть
    // снят 0.3 с назад, а голову за это время успевают повернуть на 45°. Направление на
    // маяк измерено в КАДРЕ камеры ТОГДА — значит и в систему корпуса его надо переводить
    // по позе головы ТОГДА же. Иначе один взгляд вниз превращает луч в мусор и складывает
    // локоть (именно так и вели себя «прыгающая рука» и застывший локоть на телефоне).
    this.headHist.push({ t: now, yaw: headYaw, pitch: headPitch, torso: this.torsoYaw });
    if (this.headHist.length > 96) this.headHist.splice(0, this.headHist.length - 96);
    const beaconTs = Number.isFinite(beacon?.ts) ? beacon.ts : now;
    let headSnapAtBeacon = this.headHist[this.headHist.length - 1] ?? {
      yaw: headYaw,
      pitch: headPitch,
      torso: this.torsoYaw,
    };
    for (let i = this.headHist.length - 1; i >= 0; i--) {
      if (this.headHist[i].t <= beaconTs) {
        headSnapAtBeacon = this.headHist[i];
        break;
      }
    }
    const qTorsoToCamAtBeacon = qMul(
      qAxisAngle([1, 0, 0], -(headSnapAtBeacon?.pitch ?? headPitch)),
      qAxisAngle([0, 1, 0], (headSnapAtBeacon?.yaw ?? headYaw) - (headSnapAtBeacon?.torso ?? this.torsoYaw))
    );

    // Оптический контур (~11 Гц). Раньше он включался ТОЛЬКО когда экран браслета был
    // повёрнут к камере (жёсткий порог screenFacingCos > 0.18) и тогда перетягивал
    // запястье на 68% — поза «прыгала» между двумя оценщиками на каждом довороте кисти.
    // Теперь направление на маяк камера измеряет при любом наклоне экрана, а плавный
    // вес доверия зависит от края кадра и статуса пары, поэтому скачков больше нет.
    const tanH = Number.isFinite(beacon?.tanH) ? beacon.tanH : 0.6371; // ~65° по горизонтали
    const aspectY = Number.isFinite(beacon?.aspectY) ? beacon.aspectY : 0.75;
    let conf = beaconConfidence(beacon);
    // Страж согласованности: если геометрия луча требует, чтобы кисть ПОДОШЛА ближе,
    // apparent-разнос пятен обязан расти (это единственный независимый от ориентации
    // признак изменения дистанции — сам по себе span measuring в основном наклон экрана).
    // Без этого стража любой сбойный луч (неверное совмещение камеры с осью взгляда,
    // доворот корпуса, помеха) складывал локоть намертво.
    if (conf > 0 && Number.isFinite(beacon?.spanNorm) && Number.isFinite(this.prevBeaconSpan)) {
      const dSpan = beacon.spanNorm - this.prevBeaconSpan;
      const solvedLen = Math.hypot(
        this.torsoWristPos.x - shoulderTorso.x,
        this.torsoWristPos.y - shoulderTorso.y,
        this.torsoWristPos.z - shoulderTorso.z
      );
      const dLen = solvedLen - this.prevSolvedLen;
      if (dSpan > -0.004 && dLen < -0.03) conf *= 0.3; // «сближается», а пятно не растёт
      if (dSpan < 0.004 && dLen > 0.03) conf *= 0.3; // «отдаляется», а пятно не уменьшается
      this.prevSolvedLen = solvedLen;
    } else if (conf > 0) {
      this.prevSolvedLen = Math.hypot(
        this.torsoWristPos.x - shoulderTorso.x,
        this.torsoWristPos.y - shoulderTorso.y,
        this.torsoWristPos.z - shoulderTorso.z
      );
    }
    this.confEff +=
      (conf - this.confEff) *
      (1 - Math.exp(-safeDt / (conf > this.confEff ? OPTIC_TAU_RISE : OPTIC_TAU_FALL)));
    /* Асимметрия, и она принципиальна: свежий честный снимок принимаем СРАЗУ (иначе
       первые 100 мс после захвата маяка позе неоткуда исправляться — на игре это
       «промах мимо бака» и лишняя задержка жеста), а отпускаем медленно (см. τ выше):
       обрыв видимости не должен выдёргивать авторитет у уже решённой позы. */
    const confTrust = Math.max(conf, this.confEff);
    this.prevBeaconSpan = conf > 0 ? beacon.spanNorm : NaN;
    let optTarget = null;
    // Данные (conf > 0) и накопленное доверие (confEff) — разные вещи: луч считаем,
    // только если маяк действительно в кадре СЕЙЧАС, но верим ему в степени confEff.
    if (conf > 0 && confTrust > 0.02) {
      const rayCam = vNorm([
        (beacon.u - 0.5) * 2 * tanH,
        -(beacon.v - 0.5) * 2 * tanH * aspectY,
        -1,
      ]);
      const ray = qRotVec(qConj(qTorsoToCamAtBeacon), rayCam);
      const cx = shoulderTorso.x + FOREARM_LEN * fwd[0];
      const cy = shoulderTorso.y + FOREARM_LEN * fwd[1];
      const cz = shoulderTorso.z + FOREARM_LEN * fwd[2];
      const ac = ray[0] * cx + ray[1] * cy + ray[2] * cz;
      const disc = ac * ac - (cx * cx + cy * cy + cz * cz) + UPPER_ARM_LEN * UPPER_ARM_LEN;
      let rho = ac;
      if (disc > 0) {
        // У луча с сферой плеча ДВА пересечения — это настоящая неоднозначность позы.
        /* Выбор корня: «локоть согнут и кисть близко» против «рука выпрямлена и далеко».
           Судит ЧИСТОЕ показание гироскопа предплечья (bendSensorRad — ДО удержания и ДО
           решения оптики). Это принципиально: прежний приор строился из уже решённой позы,
           и получалась петля обратной связи — на неподвижной руке с шумом маяка локоть
           уползал на 5° каждые 150 мс (замерено зондом). Размер пятна как линейка здесь не
           участвует: он различает «далеко/близко», но подъём прямой руки и сгибание дают
           похожую дистанцию — проверка на синтетическом теле это подтвердила. */
        const root = Math.sqrt(disc);
        const farRoot = ac + root;
        const nearRoot = ac - root;
        const upperDirPrior = qRotVec(qAxisAngle(flexAxis, bendSensorRad), fwd);
        const priorWrist = [
          shoulderTorso.x + UPPER_ARM_LEN * upperDirPrior[0] + FOREARM_LEN * fwd[0],
          shoulderTorso.y + UPPER_ARM_LEN * upperDirPrior[1] + FOREARM_LEN * fwd[1],
          shoulderTorso.z + UPPER_ARM_LEN * upperDirPrior[2] + FOREARM_LEN * fwd[2],
        ];
        const priorCam = qRotVec(qTorsoToCam, priorWrist);
        const priorRho = Math.hypot(priorCam[0], priorCam[1], priorCam[2]) || chainMax;
        this.opticRootNear = Math.abs(nearRoot - priorRho) < Math.abs(farRoot - priorRho);
        rho = this.opticRootNear ? nearRoot : farRoot;
      }
      rho = clamp(rho, minChain * 0.7, maxChain + 0.24);
      if (!Number.isFinite(this.beaconRho)) this.beaconRho = rho;
      const maxRhoStep = 2.4 * safeDt; // оптика редкая — за один кадр рука не «телепортируется»
      this.beaconRho += clamp(rho - this.beaconRho, -maxRhoStep, maxRhoStep);
      optTarget = [
        ray[0] * this.beaconRho,
        ray[1] * this.beaconRho,
        ray[2] * this.beaconRho,
      ];
    }
    // Доверие к оптике — величина НАКОПИТЕЛЬНАЯ: пустой кадр не должен в один миг
    // возвращать весь авторитет гироскопу, а найденный маяк — в один миг перетягивать позу.
    if (optTarget) {
      // Смешиваем НЕ координаты (сredняя двух точек «короче» обеих — именно так локоть
      // и заклинивало), а направление и длину отдельно: луч камеры даёт направление,
      // анатомическое решение — расстояние до запястья.
      const wTarget = clamp(0.78 * confTrust, 0, 0.78);
      // ВВЕРХ вес отпускаем быстро (это просто «увидели маяк» — см. шум, он отфильтрован
      // на уровне измерения), а ВНИЗ — медленно: обрыв видимость не должен выдёргивать
      // позу из-под игрока. Асимметрия и есть «плавность к актуальному состоянию».
      const maxWStep = (wTarget > this.opticW ? 8 : OPTIC_W_RATE) * safeDt;
      this.opticW += clamp(wTarget - this.opticW, -maxWStep, maxWStep);
      const w = this.opticW;
      const gdx = gyroTarget.x - shoulderTorso.x;
      const gdy = gyroTarget.y - shoulderTorso.y;
      const gdz = gyroTarget.z - shoulderTorso.z;
      const odx = optTarget[0] - shoulderTorso.x;
      const ody = optTarget[1] - shoulderTorso.y;
      const odz = optTarget[2] - shoulderTorso.z;
      const gLen = Math.hypot(gdx, gdy, gdz) || 1e-4;
      const oLen = Math.hypot(odx, ody, odz) || 1e-4;
      const dir = vNorm([gdx / gLen + (odx / oLen - gdx / gLen) * w,
                         gdy / gLen + (ody / oLen - gdy / gLen) * w,
                         gdz / gLen + (odz / oLen - gdz / gLen) * w]);
      const len = gLen + (clamp(oLen, minChain, chainMax) - gLen) * w;
      targetTorso = {
        x: shoulderTorso.x + dir[0] * len,
        y: shoulderTorso.y + dir[1] * len,
        z: shoulderTorso.z + dir[2] * len,
      };
    }
    // Петля гистерезиса в 0.1 по метке источника: на границе доверия label не должен
    // мигать 11 раз в секунду (тесты и HUD читают именно её).
    this.trackingSource = sensorStale
      ? 'stale'
      : conf > 0 && confTrust > 0.55
        ? 'gyro+beacon'
        : confTrust < 0.45
          ? 'gyro-only'
          : this.trackingSource;

    if (optTarget && confTrust > 0.5) {
      // Плавная компенсация горизонтального дрейфа гироскопа (до 12°/с): сравниваем
      // не «придуманную» позицию, а ЧЕСТНУЮ проекцию кинематической модели в кадр камеры.
      const expectedCam = qRotVec(qTorsoToCamAtBeacon, [gyroTarget.x, gyroTarget.y, gyroTarget.z]);
      if (expectedCam[2] < -0.08) {
        const expectedU = clamp(0.5 + expectedCam[0] / -expectedCam[2] / (2 * tanH), 0.06, 0.94);
        // МЁРТВАЯ ЗОНА в шум: иначе trim (единственный канал, который крутит весь корпус
        // вслед за маяком) интегрирует шум центроида — и неподвижная рука ползёт со
        // скоростью до 12°/с, а это и есть «ложные взмахи» + дрейф позы в покое.
        const uErrRaw = beacon.u - expectedU;
        const uErr = Math.abs(uErrRaw) < 0.008 ? 0 : uErrRaw - Math.sign(uErrRaw) * 0.008;
        const maxTrimStep = 12 * DEG * safeDt;
        this.yawTrimRad = clamp(
          this.yawTrimRad - clamp(uErr * 0.35, -maxTrimStep, maxTrimStep),
          -180 * DEG,
          180 * DEG
        );
      }
    }

    // Жёсткая анатомическая граница: запястье не может быть дальше выпрямленной руки
    // и не может «провалиться» внутрь плеча. Только она и обязана ограничивать позу —
    // никаких clamp'ов «на глазок» для дальности луча — именно они и заклинивали локоть на ~105°.
    let bendSolvedRad = bendGyroRad;
    {
      const dx = targetTorso.x - shoulderTorso.x;
      const dy = targetTorso.y - shoulderTorso.y;
      const dz = targetTorso.z - shoulderTorso.z;
      const dist = Math.hypot(dx, dy, dz);
      // Угол в локте — из точной теоремы косинусов по решённому расстоянию «плечо-кисть»
      // (никакого остаточного сгибания из-за клампа IK: 0.640 м = полностью прямая рука).
      const distEff = clamp(dist, Math.abs(UPPER_ARM_LEN - FOREARM_LEN), chainMax);
      const cosInt = clamp(
        (UPPER_ARM_LEN * UPPER_ARM_LEN + FOREARM_LEN * FOREARM_LEN - distEff * distEff) /
          (2 * UPPER_ARM_LEN * FOREARM_LEN),
        -1,
        1
      );
      bendSolvedRad = Math.PI - Math.acos(cosInt);
      const lim = dist > maxChain ? maxChain : dist < minChain ? minChain : 0;
      if (lim && dist > 1e-4) {
        const k = lim / dist;
        targetTorso = {
          x: shoulderTorso.x + dx * k,
          y: shoulderTorso.y + dy * k,
          z: shoulderTorso.z + dz * k,
        };
      }
    }

    if (!optTarget) {
      // Маяк пропал — вес оптики не «отваливается» кадром, а съезжает к нулю с той же
      // скоростью: поза уходит к гироскопу плавно, без щелчка.
      this.opticW = Math.max(0, this.opticW - OPTIC_W_RATE * safeDt);
    }

    // 4. Критически демпфированная пружина 2-го порядка (масса предплечья, без дрожи и
    //    перерегулирования) С ПОТОЛКАМИ: скорость и ускорение кисти ограничены, поэтому
    //    даже полностью «сдвинувшаяся» оценка цели не способна дать визуальный рывок —
    //    ошибка съедается за 2-4 кадра заметным, но плавным доводнением.
    const omega = 26; // рад/с (~4.1 Гц собственная частота живой руки)
    const subSteps = Math.max(1, Math.ceil(safeDt / 0.017));
    const hDt = safeDt / subSteps;
    const maxDVel = MAX_WRIST_ACC * hDt;
    for (let s = 0; s < subSteps; s++) {
      const vPrevX = this.torsoWristVel.x;
      const vPrevY = this.torsoWristVel.y;
      const vPrevZ = this.torsoWristVel.z;
      for (const axis of ['x', 'y', 'z']) {
        const err = targetTorso[axis] - this.torsoWristPos[axis];
        const acc = omega * omega * err - 2 * omega * this.torsoWristVel[axis];
        this.torsoWristVel[axis] += clamp(acc * hDt, -maxDVel, maxDVel);
      }
      const sp = Math.hypot(this.torsoWristVel.x, this.torsoWristVel.y, this.torsoWristVel.z);
      // Потолок УСКОРЕНИЯ по модулю (а не по осям): иначе поворот вектора скорости
      // внутри одного шага даёт «пинок» до √3 раз сильнее лимита, и глаз видит рывок.
      if (sp > 1e-6) {
        const kSpeed = Math.hypot(vPrevX, vPrevY, vPrevZ);
        const dSpeed = sp - kSpeed;
        if (Math.abs(dSpeed) > maxDVel) {
          const target = kSpeed + Math.sign(dSpeed) * maxDVel;
          const k = target / sp;
          this.torsoWristVel.x *= k;
          this.torsoWristVel.y *= k;
          this.torsoWristVel.z *= k;
        }
      }
      const sp2 = Math.hypot(this.torsoWristVel.x, this.torsoWristVel.y, this.torsoWristVel.z);
      if (sp2 > MAX_WRIST_SPEED) {
        const k = MAX_WRIST_SPEED / sp2;
        this.torsoWristVel.x *= k;
        this.torsoWristVel.y *= k;
        this.torsoWristVel.z *= k;
      }
      for (const axis of ['x', 'y', 'z']) {
        this.torsoWristPos[axis] += this.torsoWristVel[axis] * hDt;
      }
    }

    // 5. Аналитическая двухзвенная кинематика (2-Bone IK): Плечо -> Локоть -> Запястье
    // Анатомический вектор локтя: направлен вниз, наружу (вправо у правой, влево у левой) и чуть назад;
    // при высоком подъёме руки локоть естественно приподнимается вслед за плечом!
    const elbowLift = clamp((this.torsoWristPos.y + 0.10) * 0.55, -0.15, 0.42);
    const poleTorso = [side * 0.44, -0.86 + elbowLift, 0.22];
    const ik = solveTwoBoneArmIK(
      shoulderTorso,
      this.torsoWristPos,
      UPPER_ARM_LEN,
      FOREARM_LEN,
      poleTorso
    );
    this.torsoWristPos = { ...ik.wrist };
    this.elbowBendDeg = +ik.elbowBendDeg.toFixed(1);

    // Запоминаем решённое сгибание как опору для времени без оптики и заодно
    // «кто именно двигался»: локоть или плечо (знак и доля от приращения наклона).
    // Удержание переписывается ТОЛЬКО когда оптика реально кормит позу в этом кадре:
    // conf > 0 (данные есть) И confTrust > 0.5 (им верят). Иначе после секунды без камеры
    // «накопленное доверие» ещё высоко, а обновлять нечего — и это обнуляло приращение,
    // из-за которого локоть переставал догибаться вне кадра.
    if (conf > 0 && confTrust > 0.5) {
      if (this.bendHoldSet) {
        const dBend = bendSolvedRad - this.bendHoldRad;
        const dElev = armTiltRad - this.holdTiltRad - dBend;
        if (Math.abs(dBend) + Math.abs(dElev) > 1.2 * DEG) {
          this.opticMotion += (clamp(dBend / (Math.abs(dBend) + Math.abs(dElev)), -1, 1) - this.opticMotion) * 0.35;
        }
      }
      this.bendHoldRad = clamp(bendSolvedRad, 0, 150 * DEG);
      this.holdTiltRad = armTiltRad;
      this.bendHoldSet = true;
    }

    // «Насколько рука выпрямлена» (0..1) — из РЕШЁННОГО сгибания локтя, а не из догадок,
    // и нормируется собственным диапазоном игрока из калибровки (жест 2 = полный сгиб).
    /* «Насколько рука выпрямлена» — из РАССТОЯНИЯ плечо-кисть, а не из угла локтя:
       вблизи полной выпрямленности угол = acos(...) и его производная по расстоянию
       уходит в бесконечность — 1 см ошибки смешения оценок давал 20° «сгиба» и reach
       падал с 0.99 до 0.63 (на этом и спотыкалось открытие бака). Расстояние же
       линейно, а калибровка игрока входит аналитически: d(сгиб) = √(L1²+L2²+2L1L2·cos φ),
       где φ = 180° − сгиб, поэтому «полный сгиб» из жеста 2 превращается в расстояние,
       а не в эмпирический коэффициент. */
    const chainSq = UPPER_ARM_LEN * UPPER_ARM_LEN + FOREARM_LEN * FOREARM_LEN;
    const chain2 = 2 * UPPER_ARM_LEN * FOREARM_LEN;
    const distFolded = Math.sqrt(Math.max(0.01, chainSq + chain2 * Math.cos(this.bendSpanRad)));
    const reachSpan = Math.max(0.05, chainMax - distFolded);
    const distNow = Math.hypot(
      targetTorso.x - shoulderTorso.x,
      targetTorso.y - shoulderTorso.y,
      targetTorso.z - shoulderTorso.z
    );
    const reachTarget = clamp(1 - 0.84 * clamp((chainMax - distNow) / reachSpan, 0, 1.15), 0.06, 1.02);
    this.reach += (reachTarget - this.reach) * (1 - Math.exp(-safeDt * 18));

    // Переводим все три сустава и скорость из системы корпуса в систему камеры очков!
    const shCam = qRotVec(qTorsoToCam, [ik.shoulder.x, ik.shoulder.y, ik.shoulder.z]);
    const elCam = qRotVec(qTorsoToCam, [ik.elbow.x, ik.elbow.y, ik.elbow.z]);
    const wrCam = qRotVec(qTorsoToCam, [ik.wrist.x, ik.wrist.y, ik.wrist.z]);
    const velCam = qRotVec(qTorsoToCam, [this.torsoWristVel.x, this.torsoWristVel.y, this.torsoWristVel.z]);

    this.shoulderPos = { x: shCam[0], y: shCam[1], z: shCam[2] };
    this.elbowPos = { x: elCam[0], y: elCam[1], z: elCam[2] };
    this.pos = { x: wrCam[0], y: wrCam[1], z: wrCam[2] };
    this.vel = { x: velCam[0], y: velCam[1], z: velCam[2] };

    // 6. Игровая логика в зависимости от фазы («поиск в баке» vs «осмотр находки»)
    let pokes = 0;
    let decision = null;
    let throwVel = null;

    if (sensorStale) {
      this.dwellAccumSec = 0;
      this.calmLowerSec = 0;
      return this.snapshot({ pokes: 0, decision: null, throwVel: null, pitchUpDeg: +(pitchUpRad * RAD).toFixed(1) });
    }

    if (phase === 'search') {
      const extended = this.reach >= 0.60 && handOverBin;
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
        const accelRummageHit = effLinMag >= 1.35 && rotRateDeg >= 28;

        if (cooldownOk && (wristSweepHit || accelRummageHit)) {
          pokes = 1;
          this.lastPokeAt = now;
          this.rummageDir = newDir;
          this.rummageAnchorYaw = yawRightRad;
          this.rummageAnchorPitch = pitchUpRad;
          this.dwellAccumSec = 0;
        } else if (rotRateDeg >= 12 || effLinMag >= 0.55) {
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
      if (!this.inspectBaseQ || !this.inspectPrevQ) {
        this.inspectBaseQ = [...this.qArmTorso];
        this.inspectPrevQ = [...this.qArmTorso];
        this.inspectItemQ = [0, 0, 0, 1];
        this.inspectEnteredAt = now;
        this.maxInspectPitchRad = pitchUpRad;
        this.maxInspectWristY = this.torsoWristPos.y;
        this.itemRot = { x: 0, y: 0, z: 0 };
      }
      if (pitchUpRad > this.maxInspectPitchRad) {
        this.maxInspectPitchRad = pitchUpRad;
      }
      if (this.torsoWristPos.y > this.maxInspectWristY) {
        this.maxInspectWristY = this.torsoWristPos.y;
      }

      // Инкрементальное геодезическое вращение на группе SO(3) в пространстве корпуса
      // БЕЗ углов Эйлера и БЕЗ гимбал-лока: предмет можно наклонять за 90°, переворачивать
      // вверх дном и крутить на 360°..720° в любую сторону без единого скачка осей!
      let dqStep = qNormalize(qMul(this.qArmTorso, qConj(this.inspectPrevQ)));
      this.inspectPrevQ = [...this.qArmTorso];
      if (dqStep[3] < 0) dqStep = [-dqStep[0], -dqStep[1], -dqStep[2], -dqStep[3]];
      const vLen = Math.hypot(dqStep[0], dqStep[1], dqStep[2]);
      if (vLen > 1e-7) {
        const stepAngle = 2 * Math.atan2(vLen, dqStep[3]);
        const invV = stepAngle / vLen;
        const dwx = dqStep[0] * invV;
        const dwy = dqStep[1] * invV;
        const dwz = dqStep[2] * invV;
        const rx = dwx * 1.55;
        const ry = dwy * 1.75 - dwz * 0.70;
        const rz = dwz * 1.25;
        const phiLen = Math.hypot(rx, ry, rz);
        if (phiLen > 1e-8) {
          const dqItem = qAxisAngle([rx, ry, rz], phiLen);
          this.inspectItemQ = qNormalize(qMul(dqItem, this.inspectItemQ));
        }
        this.itemRot = {
          x: this.itemRot.x + rx,
          y: this.itemRot.y + ry,
          z: this.itemRot.z + rz,
        };
      }

      const armedForDecision =
        revealReady &&
        now - this.inspectEnteredAt >= 450 &&
        now - this.lastDecisionAt >= 900;

      if (armedForDecision) {
        // Отличаем настоящий взмах рукой (ускорение ИЛИ быстрый пространственный мах оси предплечья)
        // от быстрого проворота кисти вокруг своей продольной оси при переворачивании открытки/ключа!
        const sharpAccel = effLinMag >= 7.2;
        const sharpWhip = rotRateDeg >= 245 && effLinMag >= 2.4;
        const spatialWaveWhip = rotRateDeg >= 310 && swingRateDeg >= 195;
        if (sharpAccel || sharpWhip || spatialWaveWhip) {
          decision = 'discard';
          this.lastDecisionAt = now;
          this.calmLowerSec = 0;
          const camFwd = qRotVec(this.qArm, [0, 0, -1]);
          const sideThrow = camFwd[0] >= 0 ? 1 : -1;
          throwVel = {
            x: clamp(camFwd[0] * 7.5 + sideThrow * 3.8 + this.vel.x * 2.2, -9.5, 9.5),
            y: clamp(camFwd[1] * 4.5 + 2.2 + this.vel.y * 1.8, 0.5, 7.5),
            z: -6.8,
          };
        } else {
          // Спокойное опускание руки вниз -> забрать находку в коллекцию (keep).
          // Если игрок открыл бак с уже опущенным предплечьем (~ -25°), требуем реальное
          // дополнительное опускание хотя бы на 16° ниже пика осмотра (или глубоко вдоль пальто <= -38°),
          // чтобы предмет не «проглатывался» сам, пока игрок держит руку неподвижно у края бака!
          const pitchDropFromPeak = this.maxInspectPitchRad - pitchUpRad;
          const intentionalDrop =
            (pitchUpRad <= -21 * DEG && pitchDropFromPeak >= 16 * DEG) ||
            pitchUpRad <= -38 * DEG ||
            // Киста ниже -0.38 м ЕЩЁ и не повод: рука могла прийти в осмотр уже опущенной.
            // Требуем реального опускания относительно самого высокого положения за осмотр
            // (пик ведём так же, как пик наклона) — «спокойно опустил» = ниже пика на 8 см.
            (ik.wrist.y <= -0.38 &&
              ik.wrist.y <= this.maxInspectWristY - 0.08 &&
              pitchDropFromPeak >= 14 * DEG);
          const handCalm = effLinMag < 3.1 && rotRateDeg < 105;
          if (intentionalDrop && handCalm) {
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
      handSide: this.handSide,
      calibratedStep: this.calibratedStep,
      trackingSource: this.trackingSource,
      torsoYaw: +this.torsoYaw.toFixed(4),
      qArm: [...this.qArm],
      shoulderPos: { ...this.shoulderPos },
      elbowPos: { ...this.elbowPos },
      pos: { ...this.pos },
      vel: {
        x: +this.vel.x.toFixed(3),
        y: +this.vel.y.toFixed(3),
        z: +this.vel.z.toFixed(3),
      },
      elbowBendDeg: this.elbowBendDeg,
      elevationDeg: this.elevationDeg,
      reach: +this.reach.toFixed(3),
      screenFacingCos: +this.screenFacingCos.toFixed(3),
      itemRot: { ...this.itemRot },
      itemQuat: [...this.inspectItemQ],
      calmLowerProgress: +clamp(this.calmLowerSec / 0.65, 0, 1).toFixed(2),
      ...extra,
    };
  }
}
