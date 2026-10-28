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
    yaw = Math.atan2(-m20, 1 - 2 * (x * x + z * z));
  }
  return { yaw, pitch, roll };
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
    this.calibratedStep = 0;

    // Оптическая шкала двухцветного маяка
    const defaultU = this._defaultBeaconU();
    this.beaconFar = { u: defaultU, v: 0.54, span: 0.105, captured: false };
    this.beaconNear = { u: defaultU, v: 0.64, span: 0.235, captured: false };

    // Входные сэмплы
    this.lastSensor = null;
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
   * если игрок повернулся на кресле, надевая очки, и рука ушла > 22° вбок от нового взгляда,
   * компенсируем этот поворот кресла, чтобы рука смотрела вперёд вместе с игроком.
   */
  recenterOnSessionStart(now = performance.now()) {
    this.torsoYaw = 0;
    if (!this.lastSensor?.q || !this.qStretch) return;
    if (now - this.lastSensor.ts > 2000) return;
    const qRaw = qNormalize(qMul(this.qRefInv, qMul(this.lastSensor.q, this.qBasis)));
    const fwd = qRotVec(qRaw, [0, 0, -1]);
    const horizLen = Math.hypot(fwd[0], fwd[2]);
    if (horizLen < 0.35) return; // рука почти вертикальна — азимут не трогаем
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

    // Корпус мягко поворачивается вслед за большими поворотами головы по горизонту,
    // но строго сохраняет гравитационную вертикаль при кивках вверх/вниз!
    const yawDiff = headYaw - this.torsoYaw;
    if (Math.abs(yawDiff) > 18 * DEG) {
      this.torsoYaw += (yawDiff - Math.sign(yawDiff) * 18 * DEG) * 0.45;
    }
    this.torsoYaw += (headYaw - this.torsoYaw) * Math.min(1, safeDt * 2.8);
    const relHeadYaw = headYaw - this.torsoYaw;
    // Перевод из системы корпуса в систему камеры очков: Rx(-headPitch) * Ry(+relHeadYaw)
    const qTorsoToCam = qMul(
      qAxisAngle([1, 0, 0], -headPitch),
      qAxisAngle([0, 1, 0], relHeadYaw)
    );
    const qCamToTorso = qConj(qTorsoToCam);

    // 1. 60 Гц ориентация предплечья и кисти в гравитационной системе корпуса:
    // Внимание на знак: headYaw > 0 — это физический поворот ВПРАВО (Ry(-headYaw) в OpenGL),
    // поэтому переход из мира в повернувшийся корпус требует умножения на Ry(+torsoYaw)!
    const qYawTrim = qAxisAngle([0, 1, 0], this.yawTrimRad + this.torsoYaw);
    this.qArmTorso = qNormalize(qMul(qYawTrim, qMul(this.qRefInv, qMul(sensor.q, this.qBasis))));
    this.qArm = qNormalize(qMul(qTorsoToCam, this.qArmTorso));

    let rotRateDeg = sensor.rotRate;
    if (this.prevQuat && rotRateDeg < 1) {
      rotRateDeg = (qAngleRad(this.prevQuat, this.qArmTorso) / safeDt) * RAD;
    }
    this.prevQuat = [...this.qArmTorso];

    // Куда в пространстве камеры смотрит экран браслета (+Z телефона)
    const screenLocalInArm = qRotVec(qConj(this.qBasis), [0, 0, 1]);
    const screenCamNormal = qRotVec(this.qArm, screenLocalInArm);
    this.screenFacingCos = screenCamNormal[2];

    // 2. Биомеханическая оценка позы руки в пространстве корпуса:
    //    - выпрямление вперёд (pitch ~ 0°)
    //    - сгибание локтя к груди (pitch вверх + увод внутрь к груди)
    //    - поднятие всей руки высоко вверх (высокий подъём предплечья > bendSpan + наружу/вверх)
    //    - плавное опускание руки вниз (pitch < 0° до -80° вдоль пальто)
    const fwd = qRotVec(this.qArmTorso, [0, 0, -1]);
    let swingRateDeg = 0;
    if (this.prevFwd) {
      const cosSwing = clamp(vDot(this.prevFwd, fwd), -1, 1);
      swingRateDeg = (Math.acos(cosSwing) / safeDt) * RAD;
    }
    this.prevFwd = [...fwd];
    const pitchUpRad = Math.asin(clamp(fwd[1], -1, 1));
    const yawRightRad = Math.atan2(fwd[0], Math.max(0.12, Math.hypot(fwd[2], fwd[1] * 0.35)));
    this.elevationDeg = +(pitchUpRad * RAD).toFixed(1);

    // Оцениваем, сгибает ли игрок руку в локте к груди или поднимает всю руку высоко вверх:
    // у правой руки (side=+1) поворот внутрь к груди — это yaw < 0; у левой (side=-1) — yaw > 0.
    const inwardCross = clamp(-side * yawRightRad / (28 * DEG), -0.35, 1.0);
    const highRaiseBlend = clamp((pitchUpRad - (this.bendSpanRad + 6 * DEG)) / (26 * DEG), 0, 1);

    let kinReach;
    let shoulderLiftY = 0;
    if (pitchUpRad >= 0) {
      const bendProgress = clamp(pitchUpRad / Math.max(0.32, this.bendSpanRad), 0, 1.15);
      // При сгибе к груди дальность укорачивается к ~0.14; но если руку поднимают высоко вверх (> bendSpan)
      // или ведут вертикально вверх без увода к груди — рука вытягивается вверх к небу!
      const chestBendFactor = clamp(0.96 + inwardCross * 0.12 - highRaiseBlend * 0.78, 0.18, 1.05);
      kinReach = clamp(1 - bendProgress * 0.84 * chestBendFactor, 0.12, 1.02);
      shoulderLiftY = highRaiseBlend * 0.08 + clamp(pitchUpRad / (75 * DEG), 0, 1) * 0.04;
    } else {
      // Опускание руки вниз: от 0° до -75° вся рука естественно уходит по дуге вниз от плеча!
      const downFrac = clamp(-pitchUpRad / (72 * DEG), 0, 1);
      kinReach = clamp(1 - downFrac * 0.62, 0.28, 1.02);
      shoulderLiftY = -downFrac * 0.035;
    }

    const shoulderTorso = {
      x: side * 0.21,
      y: -0.27 + shoulderLiftY,
      z: -0.08,
    };

    // Целевая точка запястья в пространстве корпуса по кинематике плеча и локтя
    const maxChain = UPPER_ARM_LEN + FOREARM_LEN - 0.015; // ~0.625 м от плеча
    const minChain = 0.25; // согнутый у груди локоть
    let radialDist;
    let targetTorso;

    if (pitchUpRad < -8 * DEG) {
      // При опускании вниз рука описывает естественную маятниковую дугу от плеча вниз к бедру
      const downFrac = clamp(-pitchUpRad / (70 * DEG), 0, 1);
      radialDist = 0.56 - downFrac * 0.09;
      targetTorso = {
        x: shoulderTorso.x + fwd[0] * radialDist * 0.82 - side * (1 - downFrac) * 0.06,
        y: shoulderTorso.y + fwd[1] * radialDist * 0.95 + (1 - downFrac) * 0.14,
        z: shoulderTorso.z - Math.max(0.18, -fwd[2]) * radialDist * 0.96,
      };
    } else {
      radialDist = minChain + kinReach * (maxChain - minChain);
      // При сгибе локтя к груди кисть поднимается к уровню груди/осмотра, а не заваливается назад за камеру
      const chestTuck = 1 - kinReach;
      targetTorso = {
        x: shoulderTorso.x + fwd[0] * radialDist * 0.88 - side * (0.09 + chestTuck * 0.03),
        y: shoulderTorso.y + fwd[1] * (0.20 + kinReach * 0.36 + highRaiseBlend * 0.18) + kinReach * 0.15,
        z: shoulderTorso.z - (0.28 + kinReach * 0.31) * clamp(-fwd[2] + chestTuck * 0.45, 0.36, 1.05),
      };
    }

    // 3. Оптический якорь двухцветного маяка (~10 Гц) — переводим из кадра камеры в корпус!
    let finalReach = kinReach;
    const canTrustBeacon =
      beacon &&
      beacon.fresh &&
      beacon.status !== 'none' &&
      this.screenFacingCos > 0.18;

    if (canTrustBeacon) {
      this.trackingSource = 'gyro+beacon';
      if (beacon.status === 'pair' && beacon.spanNorm > 0.015) {
        const tiltCos = clamp(this.screenFacingCos, 0.42, 1.0);
        const trueSpan = beacon.spanNorm / tiltCos;
        const denom = Math.max(0.035, this.beaconNear.span - this.beaconFar.span);
        const optReach = clamp((this.beaconNear.span - trueSpan) / denom, 0.06, 1.06);
        finalReach = kinReach * 0.35 + optReach * 0.65;

        const optCamZ = -0.38 - optReach * 0.32;
        const optCamX = clamp((beacon.u - this.beaconFar.u) * 1.15 + side * 0.10, -0.54, 0.54);
        const optCamY = clamp((this.beaconFar.v - beacon.v) * 0.94 - 0.11, -0.56, 0.46);
        const optTorso = qRotVec(qCamToTorso, [optCamX, optCamY, optCamZ]);

        targetTorso.x = targetTorso.x * 0.32 + optTorso[0] * 0.68;
        targetTorso.y = targetTorso.y * 0.32 + optTorso[1] * 0.68;
        targetTorso.z = targetTorso.z * 0.35 + optTorso[2] * 0.65;

        // Плавная компенсация горизонтального дрейфа гироскопа (до 12°/с)
        const expectedCamVec = qRotVec(qTorsoToCam, [
          shoulderTorso.x + fwd[0] * 0.48 - side * 0.08,
          shoulderTorso.y + fwd[1] * 0.35,
          -0.55,
        ]);
        const expectedU = clamp(this.beaconFar.u + (expectedCamVec[0] - side * 0.10) * 0.65, 0.1, 0.9);
        const uErr = beacon.u - expectedU;
        const maxTrimStep = 12 * DEG * safeDt;
        this.yawTrimRad = clamp(
          this.yawTrimRad - clamp(uErr * 0.35, -maxTrimStep, maxTrimStep),
          -180 * DEG,
          180 * DEG
        );
      } else {
        const optCamX = clamp((beacon.u - this.beaconFar.u) * 1.10 + side * 0.10, -0.52, 0.52);
        const optCamY = clamp((this.beaconFar.v - beacon.v) * 0.90 - 0.11, -0.54, 0.44);
        const optTorso = qRotVec(qCamToTorso, [optCamX, optCamY, targetTorso.z]);
        targetTorso.x = targetTorso.x * 0.55 + optTorso[0] * 0.45;
        targetTorso.y = targetTorso.y * 0.55 + optTorso[1] * 0.45;
      }
    } else {
      this.trackingSource = 'gyro-only';
    }

    // 4. Критически демпфированная пружина 2-го порядка (масса предплечья, без дрожи и перерегулирования!)
    const omega = 26; // рад/с (~4.1 Гц собственная частота живой руки)
    const subSteps = Math.max(1, Math.ceil(safeDt / 0.017));
    const hDt = safeDt / subSteps;
    for (let s = 0; s < subSteps; s++) {
      for (const axis of ['x', 'y', 'z']) {
        const err = targetTorso[axis] - this.torsoWristPos[axis];
        const acc = omega * omega * err - 2 * omega * this.torsoWristVel[axis];
        this.torsoWristVel[axis] += acc * hDt;
        this.torsoWristPos[axis] += this.torsoWristVel[axis] * hDt;
      }
    }
    this.reach += (finalReach - this.reach) * (1 - Math.exp(-safeDt * 18));

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
        const accelRummageHit = sensor.linMag >= 1.35 && rotRateDeg >= 28;

        if (cooldownOk && (wristSweepHit || accelRummageHit)) {
          pokes = 1;
          this.lastPokeAt = now;
          this.rummageDir = newDir;
          this.rummageAnchorYaw = yawRightRad;
          this.rummageAnchorPitch = pitchUpRad;
          this.dwellAccumSec = 0;
        } else if (rotRateDeg >= 12 || sensor.linMag >= 0.55) {
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
        this.itemRot = { x: 0, y: 0, z: 0 };
      }
      if (pitchUpRad > this.maxInspectPitchRad) {
        this.maxInspectPitchRad = pitchUpRad;
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
        const sharpAccel = sensor.linMag >= 7.2;
        const sharpWhip = rotRateDeg >= 245 && sensor.linMag >= 2.4;
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
            (ik.wrist.y <= -0.38 && pitchDropFromPeak >= 14 * DEG);
          const handCalm = sensor.linMag < 3.1 && rotRateDeg < 105;
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
