import test from 'node:test';
import assert from 'node:assert/strict';
import { WristBeaconTracker } from '../src/vr/wristBeaconTracker.js';
import {
  WristHandFusion,
  solveTwoBoneArmIK,
  UPPER_ARM_LEN,
  FOREARM_LEN,
  w3cDeviceQuaternion,
  qMul,
  qAxisAngle,
  qRotVec,
  qAngleRad,
} from '../src/vr/wristHandFusion.js';
import { createGlovedHand } from '../src/vr/handMesh.js';
import { WristHostLink } from '../src/vr/wristLink.js';

const DEG = Math.PI / 180;

function makeDualBeaconRgba(w, h, greenSpot, magentaSpot) {
  const data = new Uint8ClampedArray(w * h * 4);
  // Тёмный вечерний фон двора
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 16;
    data[i + 1] = 20;
    data[i + 2] = 28;
    data[i + 3] = 255;
  }
  const paintCircle = (spot, r, g, b) => {
    if (!spot) return;
    const cx = spot.u * w;
    const cy = spot.v * h;
    const rad = spot.rad || 8;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (Math.hypot(x - cx, y - cy) <= rad) {
          const idx = (y * w + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  };
  paintCircle(greenSpot, 0, 255, 102);   // #00ff66
  paintCircle(magentaSpot, 255, 0, 170); // #ff00aa
  return data;
}

test('w3cDeviceQuaternion maps gravity UP (+Y) and screen normal (+Z) accurately', () => {
  // Телефон лежит экраном к небу (alpha=0, beta=0, gamma=0): нормаль экрана +Z смотрит в +Y мира
  const qFlat = w3cDeviceQuaternion(0, 0, 0, 0);
  const nFlat = qRotVec(qFlat, [0, 0, 1]);
  assert.ok(Math.abs(nFlat[1] - 1) < 1e-6);

  // Телефон стоит вертикально экраном к лицу (alpha=0, beta=90, gamma=0): верх +Y -> +Y мира, экран +Z -> +Z мира
  const qUpright = w3cDeviceQuaternion(0, 90, 0, 0);
  const topUpright = qRotVec(qUpright, [0, 1, 0]);
  const scrUpright = qRotVec(qUpright, [0, 0, 1]);
  assert.ok(Math.abs(topUpright[1] - 1) < 1e-6);
  assert.ok(Math.abs(scrUpright[2] - 1) < 1e-6);
});

test('WristBeaconTracker detects dual luminous spots (#00ff66 + #ff00aa) and measures span', () => {
  const tracker = new WristBeaconTracker();
  const farFrame = makeDualBeaconRgba(
    200,
    150,
    { u: 0.49, v: 0.54, rad: 6 },
    { u: 0.59, v: 0.54, rad: 6 }
  );
  const nearFrame = makeDualBeaconRgba(
    200,
    150,
    { u: 0.42, v: 0.60, rad: 10 },
    { u: 0.66, v: 0.60, rad: 10 }
  );

  const farRes = tracker.analyzeRgba(farFrame, 200, 150, 100);
  assert.equal(farRes.status, 'pair');
  assert.ok(Math.abs(farRes.rawU - 0.54) < 0.02);
  assert.ok(Math.abs(farRes.rawSpanNorm - 0.10) < 0.02);

  const nearRes = tracker.analyzeRgba(nearFrame, 200, 150, 200);
  assert.equal(nearRes.status, 'pair');
  // Сырое измерение кадра: «кисть ближе -> пятно крупнее» — это физика оптики, а не
  // слежение. В слияние же уходит spanNorm (сглаженный) — иначе шум центроида 11 раз в
  // секунду пиныл бы позу (именно это и давало «безумные рывки» на реальном телефоне).
  assert.ok(nearRes.rawSpanNorm > farRes.rawSpanNorm * 2.1);
});

test('2-gesture calibration solves arbitrary wrist strap angles (portrait, transverse, oblique)', () => {
  // Проверяем три совершенно разных крепления телефона на ремешке запястья:
  const strapMounts = [
    { name: 'crosswise-upright', qMount: w3cDeviceQuaternion(25, 88, 0, 0) },
    { name: 'lengthwise-rotated-90', qMount: qMul(w3cDeviceQuaternion(25, 88, 0, 0), qAxisAngle([0, 0, 1], 90 * DEG)) },
    { name: 'oblique-tilted-42deg', qMount: qMul(w3cDeviceQuaternion(140, 72, -18, 0), qAxisAngle([0, 0, 1], -42 * DEG)) },
  ];

  for (const mount of strapMounts) {
    const fusion = new WristHandFusion();
    // Поза 1: прямая рука вперёд (heading = 25° или 140°). Ось сгиба локтя в мире — горизонтальная ось вправо от руки!
    const armWorldRight = qRotVec(qAxisAngle([0, 1, 0], 25 * DEG), [1, 0, 0]);
    const qPose1 = mount.qMount;
    // Поза 2: сгибаем локоть вверх на +50° вокруг мировой поперечной оси предплечья
    const qElbowLift = qAxisAngle(armWorldRight, 50 * DEG);
    const qPose2 = qMul(qElbowLift, qPose1);

    fusion.feedSensor({ q: qPose1, linMag: 0, rotRate: 0, ts: 10 });
    const step1 = fusion.calibrateStretchPose();
    assert.equal(step1.ok, true, mount.name);

    fusion.feedSensor({ q: qPose2, linMag: 0, rotRate: 0, ts: 20 });
    const step2 = fusion.calibrateBendPose();
    assert.equal(step2.ok, true, `${mount.name}: ${step2.message}`);
    assert.ok(Math.abs(step2.bendDeg - 50) < 2.5, `${mount.name} bendDeg=${step2.bendDeg}`);

    // Возвращаем руку в прямую позу -> reach ~ 1.0, направление предплечья [0, 0, -1]
    fusion.feedSensor({ q: qPose1, linMag: 0, rotRate: 0, ts: 100 });
    let snap;
    for (let i = 0; i < 15; i++) snap = fusion.update(1 / 60, { phase: 'search', now: 100 + i * 16 });
    assert.ok(snap.reach > 0.9, `${mount.name} reach straight = ${snap.reach}`);
    assert.ok(Math.abs(snap.pitchUpDeg) < 2, `${mount.name} pitch straight = ${snap.pitchUpDeg}`);

    // Сгибаем руку в позу 2 -> reach падает < 0.25, рука подтягивается ближе к игроку
    fusion.feedSensor({ q: qPose2, linMag: 0, rotRate: 0, ts: 400 });
    for (let i = 0; i < 20; i++) snap = fusion.update(1 / 60, { phase: 'search', now: 400 + i * 16 });
    assert.ok(snap.reach < 0.25, `${mount.name} reach bent = ${snap.reach}`);
    assert.ok(snap.pitchUpDeg > 44, `${mount.name} pitch bent = ${snap.pitchUpDeg}`);
  }
});

test('Beacon depth ignores apparent span (foreshortening-immune) but follows the measured bearing', () => {
  const fusion = new WristHandFusion();
  const qBase = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qBase);

  fusion.feedSensor({ q: qBase, ts: 0 });
  fusion.calibrateStretchPose(fusion.lastSensor, { fresh: true, u: 0.52, v: 0.54, spanNorm: 0.10 });
  fusion.feedSensor({ q: qBent, ts: 20 });
  fusion.calibrateBendPose(fusion.lastSensor, { fresh: true, u: 0.54, v: 0.62, spanNorm: 0.24 });

  const runWith = (beacon, frames = 24) => {
    const f = new WristHandFusion();
    f.importCalibration({
      handSide: 'right',
      qStretch: qBase,
      qBend: qBent,
      qBasis: [0, 0, 0, 1],
      qRefInv: qBase,
      bendSpanRad: 50 * DEG,
      bendInwardYawRad: 0,
    });
    let snap = null;
    for (let i = 0; i < frames; i++) {
      f.feedSensor({ q: qBase, linMag: 0.2, rotRate: 0, ts: 100 + i * 16 });
      snap = f.update(1 / 60, { beacon, phase: 'search', now: 100 + i * 16 });
    }
    return { snap, f };
  };

  // 1) Кисть довернута так, что видимый разнос пятен сжимается в cos(45°) (или раздувается).
  //    Направление на маяк и гироскоп не меняются -> глубина обязана остаться той же.
  //    Старая шкала «span = дальномер» требовала поправки tiltCos с клампом и наклоняла
  //    локоть на величину до 60° — именно из-за этого рука «заклинивала» в согнутом виде.
  const base = runWith({ fresh: true, status: 'pair', u: 0.52, v: 0.54, spanNorm: 0.17, rollRad: 0 });
  for (const spanNorm of [0.17 * Math.cos(45 * DEG), 0.17 * Math.cos(70 * DEG), 0.3]) {
    const tilted = runWith({ fresh: true, status: 'pair', u: 0.52, v: 0.54, spanNorm, rollRad: 0 });
    assert.ok(
      Math.abs(tilted.snap.reach - base.snap.reach) < 0.03,
      `span=${spanNorm.toFixed(3)} сдвинул оценку вытянутости: ${tilted.snap.reach} vs ${base.snap.reach}`
    );
  }
  assert.ok(base.snap.trackingSource === 'gyro+beacon', `источник=${base.snap.trackingSource}`);

  // 2) Позитивный контроль: маяк — НЕ декорация. Сдвиг угла на маяк уводит запястье вбок.
  const sideBeat = runWith({ fresh: true, status: 'pair', u: 0.66, v: 0.54, spanNorm: 0.17, rollRad: 0 });
  assert.ok(
    sideBeat.snap.pos.x - base.snap.pos.x > 0.05,
    `сдвиг маяка в кадре не двигает руку: ${base.snap.pos.x} -> ${sideBeat.snap.pos.x}`
  );
});
test('Extended arm rummage produces 3 bin pokes, rotates find, Calm Lower keeps, Sharp Wave discards', () => {
  const fusion = new WristHandFusion();
  const qStraight = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qStraight);
  fusion.feedSensor({ q: qStraight, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qBent, ts: 10 });
  fusion.calibrateBendPose();

  // 1. Вытягиваем руку к баку и делаем 3 движения «порыться» влево-вправо
  let now = 100;
  fusion.feedSensor({ q: qStraight, linMag: 0.2, rotRate: 0, ts: now });
  for (let i = 0; i < 15; i++) {
    now += 16;
    fusion.update(1 / 60, { phase: 'search', handOverBin: true, now });
  }

  let totalPokes = 0;
  for (const deg of [11, -11, 11]) {
    const qSweep = qMul(qAxisAngle([0, 1, 0], deg * DEG), qStraight);
    now += 320;
    fusion.feedSensor({ q: qSweep, linMag: 1.5, rotRate: 65, ts: now });
    const res = fusion.update(1 / 60, { phase: 'search', handOverBin: true, now });
    totalPokes += res.pokes;
  }
  assert.equal(totalPokes, 3, 'Три движения ладонью в баке должны дать 3 открытия');

  // 2. Фаза осмотра находки: вращение кисти крутит 3D-предмет
  now += 100;
  fusion.feedSensor({ q: qStraight, linMag: 0, rotRate: 0, ts: now });
  fusion.onPhaseChange('inspect', now);
  fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });

  const qTurnWrist = qMul(qAxisAngle([0, 1, 0], 35 * DEG), qMul(qAxisAngle([1, 0, 0], -25 * DEG), qStraight));
  now += 500;
  fusion.feedSensor({ q: qTurnWrist, linMag: 0.4, rotRate: 30, ts: now });
  const rotSnap = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
  assert.ok(Math.abs(rotSnap.itemRot.y) > 0.5, `itemRot.y=${rotSnap.itemRot.y}`);
  assert.ok(Math.abs(rotSnap.itemRot.x) > 0.35, `itemRot.x=${rotSnap.itemRot.x}`);
  assert.equal(rotSnap.decision, null);

  // 3. Резкий взмах рукой -> discard + вектор броска
  now += 100;
  fusion.feedSensor({ q: qTurnWrist, linMag: 9.4, rotRate: 310, ts: now });
  const throwSnap = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
  assert.equal(throwSnap.decision, 'discard');
  assert.ok(throwSnap.throwVel && throwSnap.throwVel.z < -4);

  // 4. Спокойное опускание руки вниз -> keep
  now += 1200;
  fusion.feedSensor({ q: qStraight, linMag: 0, rotRate: 0, ts: now });
  fusion.onPhaseChange('inspect', now);
  now += 500;
  const qLowered = qMul(qAxisAngle([1, 0, 0], -34 * DEG), qStraight);
  let keepDecision = null;
  for (let i = 0; i < 50; i++) {
    now += 16;
    fusion.feedSensor({ q: qLowered, linMag: 0.3, rotRate: 8, ts: now });
    const s = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
    if (s.decision) {
      keepDecision = s.decision;
      break;
    }
  }
  assert.equal(keepDecision, 'keep');
});

test('solveTwoBoneArmIK preserves exact upper-arm & forearm bone lengths and bends elbow downward-outward', () => {
  const shoulder = [0.21, -0.27, -0.08];
  const pole = [0.44, -0.86, 0.22];

  const poses = [
    [0.19, -0.14, -0.64], // вытянутая вперёд
    [0.15, -0.22, -0.35], // согнутая в локте у груди
    [0.16,  0.22, -0.44], // высоко поднятая вверх
    [0.22, -0.58, -0.22], // свободно опущенная вниз
    [0.21, -0.10, -1.20], // дальше предела досягаемости (проверка мягкого клампа)
  ];

  for (const target of poses) {
    const ik = solveTwoBoneArmIK(shoulder, target, UPPER_ARM_LEN, FOREARM_LEN, pole);
    const d1 = Math.hypot(
      ik.elbow.x - ik.shoulder.x,
      ik.elbow.y - ik.shoulder.y,
      ik.elbow.z - ik.shoulder.z
    );
    const d2 = Math.hypot(
      ik.wrist.x - ik.elbow.x,
      ik.wrist.y - ik.elbow.y,
      ik.wrist.z - ik.elbow.z
    );
    assert.ok(Math.abs(d1 - UPPER_ARM_LEN) < 1e-4, `upper arm len=${d1}`);
    assert.ok(Math.abs(d2 - FOREARM_LEN) < 1e-4, `forearm len=${d2}`);
    assert.ok(ik.elbowBendDeg >= 0 && ik.elbowBendDeg <= 165);
  }

  // При сгибании руки к груди локоть опускается ниже линии плечо-запястье и угол сгиба > 70°
  const bentIk = solveTwoBoneArmIK(shoulder, [0.15, -0.22, -0.35], UPPER_ARM_LEN, FOREARM_LEN, pole);
  assert.ok(bentIk.elbowBendDeg > 70, `bent elbowBendDeg=${bentIk.elbowBendDeg}`);
  assert.ok(bentIk.elbow.y < shoulder[1] - 0.08, `elbow drops below shoulder: ${bentIk.elbow.y}`);
});

test('Right vs Left handSide mirrors shoulder, elbow, wrist, and 3D glove anatomy with positive scale', () => {
  const qStraight = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qStraight);

  const rightFusion = new WristHandFusion({ handSide: 'right' });
  const leftFusion = new WristHandFusion({ handSide: 'left' });

  for (const f of [rightFusion, leftFusion]) {
    f.feedSensor({ q: qStraight, ts: 0 });
    f.calibrateStretchPose();
    f.feedSensor({ q: qBent, ts: 10 });
    f.calibrateBendPose();
  }

  // Сгибаем обе руки к себе и сравниваем зеркальную симметрию по X
  rightFusion.feedSensor({ q: qBent, ts: 100 });
  leftFusion.feedSensor({ q: qBent, ts: 100 });
  let rSnap, lSnap;
  for (let i = 0; i < 25; i++) {
    rSnap = rightFusion.update(1 / 60, { phase: 'search', now: 100 + i * 16 });
    lSnap = leftFusion.update(1 / 60, { phase: 'search', now: 100 + i * 16 });
  }

  assert.equal(rSnap.handSide, 'right');
  assert.equal(lSnap.handSide, 'left');
  assert.ok(rSnap.shoulderPos.x > 0.18 && lSnap.shoulderPos.x < -0.18);
  assert.ok(Math.abs(rSnap.shoulderPos.x + lSnap.shoulderPos.x) < 1e-3);
  assert.ok(rSnap.elbowPos.x > 0 && lSnap.elbowPos.x < 0);
  assert.ok(Math.abs(rSnap.elbowPos.x + lSnap.elbowPos.x) < 1e-2);
  assert.ok(rSnap.pos.x > 0 && lSnap.pos.x < 0);
  assert.ok(Math.abs(rSnap.pos.x + lSnap.pos.x) < 1e-2);
  assert.ok(Math.abs(rSnap.pos.y - lSnap.pos.y) < 1e-2);
  assert.ok(Math.abs(rSnap.pos.z - lSnap.pos.z) < 1e-2);

  // Проверяем 3D-модель перчатки: положительные масштабы (det > 0) на обеих руках, без вывернутых нормалей
  const hand = createGlovedHand('right');
  hand.update(1 / 60, { visible: true, handSide: 'right', shoulderPos: rSnap.shoulderPos, elbowPos: rSnap.elbowPos, pos: rSnap.pos, vel: rSnap.vel, qArm: rSnap.qArm, elbowBendDeg: rSnap.elbowBendDeg });
  assert.equal(hand.getHandSide(), 'right');
  hand.group.traverse((obj) => {
    assert.ok(obj.scale.x * obj.scale.y * obj.scale.z > 0, `positive det on right hand: ${obj.type}`);
  });

  hand.update(1 / 60, { visible: true, handSide: 'left', shoulderPos: lSnap.shoulderPos, elbowPos: lSnap.elbowPos, pos: lSnap.pos, vel: lSnap.vel, qArm: lSnap.qArm, elbowBendDeg: lSnap.elbowBendDeg });
  assert.equal(hand.getHandSide(), 'left');
  hand.group.traverse((obj) => {
    assert.ok(obj.scale.x * obj.scale.y * obj.scale.z > 0, `positive det on left hand: ${obj.type}`);
  });
  hand.dispose();
});

test('Full vertical range (raise high up, lower relaxed down) + torso grounding when nodding head', () => {
  const fusion = new WristHandFusion({ handSide: 'right' });
  const qStraight = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qStraight);
  fusion.feedSensor({ q: qStraight, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qBent, ts: 10 });
  fusion.calibrateBendPose();

  // 1. Опускаем руку свободно вниз (-55°)
  const qDown = qMul(qAxisAngle([1, 0, 0], -55 * DEG), qStraight);
  fusion.feedSensor({ q: qDown, ts: 100 });
  let downSnap;
  for (let i = 0; i < 30; i++) downSnap = fusion.update(1 / 60, { phase: 'search', now: 100 + i * 16 });
  assert.ok(downSnap.pos.y < -0.45, `lowered arm pos.y=${downSnap.pos.y}`);

  // 2. Поднимаем руку высоко вверх (+82° — выше сгиба локтя, вытягивая к небу!)
  const qHighUp = qMul(qAxisAngle([1, 0, 0], 82 * DEG), qStraight);
  fusion.feedSensor({ q: qHighUp, ts: 700 });
  let upSnap, peakVelY = 0;
  for (let i = 0; i < 30; i++) {
    upSnap = fusion.update(1 / 60, { phase: 'search', now: 700 + i * 16 });
    peakVelY = Math.max(peakVelY, upSnap.vel.y);
  }
  assert.ok(upSnap.pos.y > 0.08, `raised high arm pos.y=${upSnap.pos.y}`);
  assert.ok(peakVelY > 0.5, `spring physics generates upward velocity peakVelY=${peakVelY}`);

  // 3. Привязка к торсу: рука физически неподвижна прямо перед грудью, но игрок поднимает взгляд к небу (+28°):
  // в системе координат камеры рука должна естественно уйти вниз кадра (оставаясь у тела), а не лететь за носом!
  fusion.feedSensor({ q: qStraight, ts: 1300 });
  let levelHeadSnap, raisedHeadSnap;
  for (let i = 0; i < 25; i++) {
    levelHeadSnap = fusion.update(1 / 60, { headLook: { yaw: 0, pitch: 0 }, phase: 'search', now: 1300 + i * 16 });
  }
  for (let i = 0; i < 25; i++) {
    raisedHeadSnap = fusion.update(1 / 60, { headLook: { yaw: 0, pitch: 28 * DEG }, phase: 'search', now: 1800 + i * 16 });
  }
  assert.ok(raisedHeadSnap.pos.y < levelHeadSnap.pos.y - 0.18, `stationary arm stays grounded on torso when head pitches up: level=${levelHeadSnap.pos.y}, lookUp=${raisedHeadSnap.pos.y}`);
});

test('Whole-body turn (+45 deg right) keeps arm centered in front of torso, and chair swivel auto-recenters', () => {
  const fusion = new WristHandFusion('right');
  const qPose1 = w3cDeviceQuaternion(0, 88, 0, 0);
  const qPose2 = qMul(qAxisAngle([0, 1, 0], 40 * DEG), qMul(qAxisAngle([1, 0, 0], 50 * DEG), qPose1));

  fusion.feedSensor({ q: qPose1, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qPose2, ts: 10 });
  const cal = fusion.calibrateBendPose();
  assert.equal(cal.ok, true);

  // 1) Даже после 40° увода к груди на Шаге 2 чистый подъём предплечья вперёд имеет 0° бокового скоса!
  fusion.feedSensor({ q: qMul(qAxisAngle([1, 0, 0], 45 * DEG), qPose1), ts: 50 });
  fusion.update(1 / 60, { now: 66 });
  const fwdCheck = qRotVec(fusion.qArmTorso, [0, 0, -1]);
  assert.ok(Math.abs(fwdCheck[0]) < 0.005, `zero ψ/2 horizontal skew after chest-cross calibration: x=${fwdCheck[0]}`);

  // Базовое положение прямой руки при взгляде прямо (0°)
  let baseSnap;
  fusion.feedSensor({ q: qPose1, ts: 100 });
  for (let i = 0; i < 30; i++) {
    baseSnap = fusion.update(1 / 60, { headLook: { yaw: 0, pitch: 0 }, phase: 'search', now: 100 + i * 16 });
  }

  // 2) Игрок поворачивается всем телом, головой и рукой на 45° ВПРАВО (headYaw = +45°, мир = Ry(-45°)):
  // рука остаётся точно перед тем же правым плечом (без улёта на 90° вбок!)
  const qBodyRight45 = qMul(qAxisAngle([0, 1, 0], -45 * DEG), qPose1);
  fusion.feedSensor({ q: qBodyRight45, ts: 700 });
  let snap;
  for (let i = 0; i < 90; i++) {
    snap = fusion.update(1 / 60, { headLook: { yaw: 45 * DEG, pitch: 0 }, phase: 'search', now: 700 + i * 16 });
  }
  assert.ok(Math.abs(snap.pos.x - baseSnap.pos.x) < 0.03, `arm matches base shoulder alignment after 45° body turn: base=${baseSnap.pos.x}, turned=${snap.pos.x}`);

  // 3) Проверка авто-выравнивания кресла при старте VR (recenterOnSessionStart)
  const fusion2 = new WristHandFusion('right');
  fusion2.feedSensor({ q: qPose1, ts: 0 });
  fusion2.calibrateStretchPose();
  fusion2.feedSensor({ q: qPose2, ts: 10 });
  fusion2.calibrateBendPose();
  // Пока надевал очки, повернулся на кресле на 38° влево (Ry(+38°))
  const qSwiveled = qMul(qAxisAngle([0, 1, 0], 38 * DEG), qPose1);
  fusion2.feedSensor({ q: qSwiveled, ts: 500 });
  fusion2.recenterOnSessionStart(520);
  let recenteredSnap;
  for (let i = 0; i < 20; i++) {
    recenteredSnap = fusion2.update(1 / 60, { headLook: { yaw: 0, pitch: 0 }, phase: 'search', now: 520 + i * 16 });
  }
  // Выпрямленная вперёд рука висит точно под своим плечом (x=0.21), а не свисает
  // кистью к средней линии тела — так требует анатомия плечевого пояса.
  assert.ok(Math.abs(recenteredSnap.pos.x - 0.21) < 0.06, `recentered pos.x=${recenteredSnap.pos.x}`);
});

test('Inspection wrist yaw matches true 1:1 physical direction even with elbow bent 55 deg', () => {
  const fusion = new WristHandFusion('right');
  const qPose1 = w3cDeviceQuaternion(0, 90, 0, 0);
  const qPose2 = qMul(qAxisAngle([1, 0, 0], 55 * DEG), qPose1);
  fusion.feedSensor({ q: qPose1, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qPose2, ts: 10 });
  fusion.calibrateBendPose();

  // Начинаем осмотр с согнутым на 55° локтем (естественная поза осмотра находки!)
  fusion.feedSensor({ q: qPose2, ts: 100 });
  fusion.update(1 / 60, { phase: 'search', now: 116 });
  fusion.onPhaseChange('inspect', 120);
  fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now: 136 });

  // Поворачиваем руку в пространстве корпуса ВЛЕВО (+30° вокруг вертикали +Y):
  // предмет обязан повернуться в +Y (itemRot.y > +0.6), а НЕ зеркально назад и НЕ уйти весь в roll!
  const qTurnLeftInTorso = qMul(qAxisAngle([0, 1, 0], 30 * DEG), qPose2);
  fusion.feedSensor({ q: qTurnLeftInTorso, ts: 300 });
  const snap = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now: 316 });
  assert.ok(snap.itemRot.y > 0.65, `1:1 left yaw rotation itemRot.y=${snap.itemRot.y}`);
  assert.ok(Math.abs(snap.itemRot.z) < 0.15, `minimal parasitic roll when turning horizontally with bent elbow: z=${snap.itemRot.z}`);
});

test('WristBeaconTracker ignores room clutter (plants/posters) and rejects lone false spots', () => {
  const tracker = new WristBeaconTracker();

  // 1) Только зелёный комнатный цветок в углу кадра (без розового напарника) -> строго 'none'!
  const lonePlant = makeDualBeaconRgba(200, 150, { u: 0.12, v: 0.25, rad: 10 }, null);
  const resLone = tracker.analyzeRgba(lonePlant, 200, 150, 1000);
  assert.equal(resLone.status, 'none');

  // 2) В кадре одновременно и тусклый зелёный цветок слева (u=0.10), и яркий двухцветный браслет справа (u=0.64, 0.72)
  const cluttered = makeDualBeaconRgba(
    200,
    150,
    { u: 0.64, v: 0.56, rad: 8 },
    { u: 0.72, v: 0.56, rad: 8 }
  );
  // Дорисуем посторонний зелёный предмет в левом верхнем углу
  for (let y = 18; y <= 34; y++) {
    for (let x = 12; x <= 28; x++) {
      const idx = (y * 200 + x) * 4;
      cluttered[idx] = 20;
      cluttered[idx + 1] = 155;
      cluttered[idx + 2] = 65;
    }
  }
  const resPair = tracker.analyzeRgba(cluttered, 200, 150, 1200);
  assert.equal(resPair.status, 'pair');
  assert.ok(Math.abs(resPair.u - 0.68) < 0.03, `beacon locks onto wrist (0.68), ignoring plant at 0.10: u=${resPair.u}`);
});

test('SO(3) incremental itemQuat & itemRot stay 100% smooth across 90 deg gimbal-lock pole and full 360 deg spin', () => {
  const fusion = new WristHandFusion('right');
  const qPose1 = w3cDeviceQuaternion(0, 90, 0, 0);
  const qPose2 = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qPose1);
  fusion.feedSensor({ q: qPose1, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qPose2, ts: 10 });
  fusion.calibrateBendPose();

  let now = 100;
  fusion.feedSensor({ q: qPose1, ts: now });
  fusion.update(1 / 60, { phase: 'search', now });
  fusion.onPhaseChange('inspect', now);

  let prevQuat = [0, 0, 0, 1];
  let prevRot = { x: 0, y: 0, z: 0 };

  // Проходим наклоном через «полюс Эйлера» 0° -> 132° с одновременным поворотом по Y:
  // старый quatToEulerYXZ взрывался скачком ~150° между 88° и 92°!
  for (let deg = 4; deg <= 132; deg += 4) {
    now += 16;
    const qStep = qMul(
      qAxisAngle([0, 1, 0], (deg * 0.4) * DEG),
      qMul(qAxisAngle([1, 0, 0], deg * DEG), qPose1)
    );
    fusion.feedSensor({ q: qStep, linMag: 0.2, rotRate: 45, ts: now });
    const snap = fusion.update(1 / 60, { phase: 'inspect', revealReady: false, now });
    const dQuatDeg = (qAngleRad(prevQuat, snap.itemQuat) * 180) / Math.PI;
    const dRotJump = Math.hypot(
      snap.itemRot.x - prevRot.x,
      snap.itemRot.y - prevRot.y,
      snap.itemRot.z - prevRot.z
    );
    assert.ok(dQuatDeg < 14, `smooth SO(3) step at ${deg} deg: dQuatDeg=${dQuatDeg}`);
    assert.ok(dRotJump < 0.26, `no Euler branch-cut jump at ${deg} deg: dRotJump=${dRotJump}`);
    prevQuat = snap.itemQuat;
    prevRot = snap.itemRot;
  }
});

test('WristBeaconTracker diagonal spanNorm is invariant to 90 deg roll on 16:9 cameras and Portrait->Landscape rotation', () => {
  // 1) Камера 16:9 (1280x720, aspectY = 0.5625), сжатая в буфер 200x150:
  //    одинаковое физическое расстояние 160px на матрице 1280x720:
  //    - по горизонтали: du = 160 / 1280 = 0.125, dv = 0
  //    - по вертикали (кисть повернулась на 90°): du = 0, dv = 160 / 720 = 0.2222
  const trackerH = new WristBeaconTracker();
  const horiz16x9 = makeDualBeaconRgba(
    200,
    150,
    { u: 0.50 - 0.0625, v: 0.50, rad: 8 },
    { u: 0.50 + 0.0625, v: 0.50, rad: 8 }
  );
  const resH = trackerH.analyzeRgba(horiz16x9, 200, 150, 1000, 720 / 1280);

  const trackerV = new WristBeaconTracker();
  const vert16x9 = makeDualBeaconRgba(
    200,
    150,
    { u: 0.50, v: 0.50 - 80 / 720, rad: 8 },
    { u: 0.50, v: 0.50 + 80 / 720, rad: 8 }
  );
  const resV = trackerV.analyzeRgba(vert16x9, 200, 150, 1000, 720 / 1280);

  assert.equal(resH.status, 'pair');
  assert.equal(resV.status, 'pair');
  const relDiff16x9 = Math.abs(resH.spanNorm - resV.spanNorm) / resH.spanNorm;
  assert.ok(relDiff16x9 < 0.04, `16:9 roll invariance: horiz=${resH.spanNorm}, vert=${resV.spanNorm}`);

  // 2) Переворот телефона-очков из портретной калибровки (480x640) в ландшафтный VR (640x480):
  //    физическая диагональ матрицы та же (800px), поэтому пара пятен длиной 80px сохраняет spanNorm!
  const trackerPort = new WristBeaconTracker();
  const portFrame = makeDualBeaconRgba(
    200,
    150,
    { u: 0.50 - 40 / 480, v: 0.50, rad: 8 },
    { u: 0.50 + 40 / 480, v: 0.50, rad: 8 }
  );
  const resPort = trackerPort.analyzeRgba(portFrame, 200, 150, 1000, 640 / 480);

  const trackerLand = new WristBeaconTracker();
  const landFrame = makeDualBeaconRgba(
    200,
    150,
    { u: 0.50 - 40 / 640, v: 0.50, rad: 8 },
    { u: 0.50 + 40 / 640, v: 0.50, rad: 8 }
  );
  const resLand = trackerLand.analyzeRgba(landFrame, 200, 150, 1000, 480 / 640);
  const relDiffOrient = Math.abs(resPort.spanNorm - resLand.spanNorm) / resLand.spanNorm;
  assert.ok(relDiffOrient < 0.04, `Portrait->Landscape span invariance: port=${resPort.spanNorm}, land=${resLand.spanNorm}`);
});

test('Step 1 & Step 2 calibration captures beacon span without poisoning VR optical center (u, v)', () => {
  const fusion = new WristHandFusion('right');
  const qPose1 = w3cDeviceQuaternion(0, 90, 0, 0);
  const qPose2 = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qPose1);

  // Игрок держит телефон-очки в левой руке сбоку при калибровке: маяк попал на самый край кадра (u=0.14, v=0.86)
  fusion.feedSensor({ q: qPose1, ts: 0 });
  fusion.calibrateStretchPose(fusion.lastSensor, { fresh: true, status: 'pair', u: 0.14, v: 0.86, spanNorm: 0.10 });
  fusion.feedSensor({ q: qPose2, ts: 20 });
  fusion.calibrateBendPose(fusion.lastSensor, { fresh: true, status: 'pair', u: 0.16, v: 0.88, spanNorm: 0.23 });

  assert.equal(fusion.beaconFar.span, 0.10);
  assert.equal(fusion.beaconNear.span, 0.23);
  assert.equal(fusion.beaconFar.u, 0.54, 'optical center u stays neutral for headset VR');
  assert.equal(fusion.beaconFar.v, 0.54, 'optical center v stays neutral for headset VR');

  // Когда очки надеты на голову и рука стоит ровно перед глазами (u=0.54, v=0.54),
  // виртуальная кисть остаётся по центру перед игроком, а не улетает на полметра вправо!
  let snap;
  for (let i = 0; i < 20; i++) {
    fusion.feedSensor({ q: qPose1, ts: 100 + i * 16 });
    snap = fusion.update(1 / 60, {
      beacon: { fresh: true, status: 'pair', u: 0.54, v: 0.54, spanNorm: 0.14 },
      phase: 'search',
      now: 100 + i * 16,
    });
  }
  assert.ok(snap.pos.x > 0.04 && snap.pos.x < 0.26, `centered VR hand x=${snap.pos.x}`);
});

test('Low-bin (-25 deg) inspect entry does not auto-keep, and fast stationary shaft roll does not auto-discard', () => {
  const fusion = new WristHandFusion('right');
  const qStraight = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qStraight);
  fusion.feedSensor({ q: qStraight, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qBent, ts: 10 });
  fusion.calibrateBendPose();

  // 1) Игрок открыл низкий бак с рукой под углом -25° и замер, читая название находки:
  //    предмет НЕ должен сам улетать в коллекцию без реального движения руки вниз!
  let now = 200;
  const qLowBin = qMul(qAxisAngle([1, 0, 0], -25 * DEG), qStraight);
  fusion.feedSensor({ q: qLowBin, linMag: 0.2, rotRate: 4, ts: now });
  fusion.update(1 / 60, { phase: 'search', now });
  fusion.onPhaseChange('inspect', now);
  now += 500;
  for (let i = 0; i < 65; i++) {
    now += 16;
    fusion.feedSensor({ q: qLowBin, linMag: 0.2, rotRate: 4, ts: now });
    const s = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
    assert.equal(s.decision, null, `holding still at entry angle -25 deg must not auto-keep (step ${i})`);
  }

  // 2) Игрок быстро переворачивает находку проворотом кисти вокруг оси предплечья (420 °/с, но ось на месте!):
  //    это осмотр обратной стороны открытки, а НЕ взмах на выброс!
  const qRollStep = qMul(qAxisAngle([0, 0, -1], 7 * DEG), qLowBin);
  now += 16;
  fusion.feedSensor({ q: qRollStep, linMag: 0.9, rotRate: 420, ts: now });
  const rollSnap = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
  assert.equal(rollSnap.decision, null, 'pure longitudinal wrist roll must not trigger discard');

  // 3) Теперь игрок поднимает руку к лицу (+15°) рассмотреть предмет, а затем спокойно опускает к -24° -> keep!
  const qLiftInspect = qMul(qAxisAngle([1, 0, 0], 15 * DEG), qStraight);
  now += 16;
  fusion.feedSensor({ q: qLiftInspect, linMag: 0.5, rotRate: 30, ts: now });
  fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });

  const qCalmDrop = qMul(qAxisAngle([1, 0, 0], -24 * DEG), qStraight);
  let kept = null;
  for (let i = 0; i < 50; i++) {
    now += 16;
    fusion.feedSensor({ q: qCalmDrop, linMag: 0.25, rotRate: 8, ts: now });
    const s = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
    if (s.decision) {
      kept = s.decision;
      break;
    }
  }
  assert.equal(kept, 'keep', 'lowering after lifting to inspect triggers keep');
});

test('createGlovedHand stays non-singular (no NaN / zero quaternion) for straight-up and straight-down vertical arms', () => {
  const hand = createGlovedHand('right');
  const qFlex90Up = qAxisAngle([1, 0, 0], 90 * DEG);
  const qFlex90Down = qAxisAngle([1, 0, 0], -90 * DEG);

  const poses = [
    // Предплечье строго вертикально вверх (cuffZ = (0, -1, 0)), кисть согнута на 90°
    {
      shoulderPos: { x: 0.21, y: -0.27, z: -0.08 },
      elbowPos: { x: 0.21, y: -0.10, z: -0.25 },
      pos: { x: 0.21, y: 0.21, z: -0.25 },
      qArm: qFlex90Down,
    },
    // Предплечье строго вертикально вниз (cuffZ = (0, +1, 0)), кисть согнута на 90°
    {
      shoulderPos: { x: 0.21, y: -0.27, z: -0.08 },
      elbowPos: { x: 0.21, y: -0.35, z: -0.25 },
      pos: { x: 0.21, y: -0.66, z: -0.25 },
      qArm: qFlex90Up,
    },
  ];

  for (const p of poses) {
    hand.update(1 / 60, { visible: true, handSide: 'right', ...p });
    hand.group.updateMatrixWorld(true);
    hand.group.traverse((obj) => {
      for (const comp of obj.quaternion.toArray()) {
        assert.ok(Number.isFinite(comp), `finite quaternion on ${obj.type}`);
      }
      const qLen = Math.hypot(...obj.quaternion.toArray());
      assert.ok(Math.abs(qLen - 1) < 1e-3, `unit quaternion on ${obj.type}: len=${qLen}`);
      for (const el of obj.matrixWorld.elements) {
        assert.ok(Number.isFinite(el), `finite matrixWorld element on ${obj.type}`);
      }
    });
  }
});

test('WristHostLink.isFastHealthy detects dead one-way DataChannel instead of sticking true on 0 timestamp', () => {
  const host = new WristHostLink();
  host.mode = 'firebase';
  host.dcFast = { readyState: 'open' };
  host.dcOpenedAt = 1000;
  host.lastPongAt = 0;
  host.lastFastRxAt = 0;

  // Сразу после открытия даётся 3.5 с на приход первого пакета
  assert.equal(host.isFastHealthy(2500), true);
  // Через 5 с без единого пакета и без pong канал ОБЯЗАН признаться нездоровым, чтобы включились облако и Auto-Heal!
  assert.equal(host.isFastHealthy(6000), false);

  // Пришёл живой пакет на t=6200 -> канал снова здоров, а после 9 с тишины (t=15500) -> снова нездоров
  host.lastFastRxAt = 6200;
  assert.equal(host.isFastHealthy(10000), true);
  assert.equal(host.isFastHealthy(15500), false);
});

test('WristHandFusion suppresses phantom bin pokes and phantom throws when wrist packets stall mid-VR', () => {
  const fusion = new WristHandFusion('right');
  const qStraight = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qStraight);
  fusion.feedSensor({ q: qStraight, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qBent, ts: 10 });
  fusion.calibrateBendPose();

  // Последний пришедший перед обрывом Wi-Fi пакет имел высокое ускорение (9.5 м/с²), и связь замолчала на 2 с:
  let now = 100;
  fusion.feedSensor({ q: qStraight, linMag: 9.5, rotRate: 320, ts: now });
  let stalePokes = 0;
  for (let i = 0; i < 130; i++) {
    now += 16;
    const s = fusion.update(1 / 60, { phase: 'search', handOverBin: true, now });
    if (i > 105) stalePokes += s.pokes;
  }
  assert.equal(fusion.trackingSource, 'stale');
  assert.equal(stalePokes, 0, 'disconnected wrist must not keep poking bin by itself');

  // Даже если в этот момент открыта находка, «застывший» старый пакет НЕ должен её выбрасывать!
  fusion.onPhaseChange('inspect', now);
  now += 600;
  const staleInspect = fusion.update(1 / 60, { phase: 'inspect', revealReady: true, now });
  assert.equal(staleInspect.decision, null, 'stale pre-disconnect impulse must not discard find');
});

test('recenterOnSessionStart defers while player holds Cardboard goggles at forehead, then aligns cleanly when arm lowers', () => {
  const fusion = new WristHandFusion('right');
  const qPose1 = w3cDeviceQuaternion(0, 90, 0, 0);
  const qPose2 = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qPose1);
  fusion.feedSensor({ q: qPose1, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qPose2, ts: 10 });
  fusion.calibrateBendPose();

  // В момент окончания 3-секундного отсчёта игрок повернулся в кресле на +50°,
  // НО его рука задрана вверх к виску (+60° pitch, -75° yaw), поправляя ремешок очков!
  const qHoldingHeadset = qMul(
    qAxisAngle([0, 1, 0], -75 * DEG),
    qMul(qAxisAngle([1, 0, 0], 60 * DEG), qPose1)
  );
  fusion.feedSensor({ q: qHoldingHeadset, linMag: 0.9, rotRate: 48, ts: 500 });
  fusion.recenterOnSessionStart(510);

  assert.equal(fusion.pendingSessionRecenter, true, 'defers recenter while hand is holding headset');
  assert.equal(fusion.yawTrimRad, 0, 'does not lock bogus -75 deg forehead strap offset');

  // Через секунду очки надеты, и игрок спокойно опускает руку вперёд перед собой в кресле (+50° от стола):
  const qArmInChair = qMul(qAxisAngle([0, 1, 0], 50 * DEG), qPose1);
  let snap;
  for (let i = 0; i < 20; i++) {
    const t = 1200 + i * 16;
    fusion.feedSensor({ q: qArmInChair, linMag: 0.1, rotRate: 4, ts: t });
    snap = fusion.update(1 / 60, { phase: 'search', headLook: { yaw: 0, pitch: 0 }, now: t });
  }
  assert.equal(fusion.pendingSessionRecenter, false, 'completed deferred recenter once arm lowered');
  assert.ok(snap.pos.x > 0.04 && snap.pos.x < 0.25, `arm centered in front of chair: x=${snap.pos.x}`);
});

test('WristHostLink protects in-flight WebRTC offers from 1.2s abort livelock and accepts seq=1 immediately on wrist reload', () => {
  const received = [];
  const link = new WristHostLink({ onSensor: (s) => received.push(s) });

  // 1) Пока оффер собирает ICE-кандидаты (< 4.5 с, connectionState = 'connecting'), повторный hello не рвёт его
  link.pc = { connectionState: 'connecting' };
  link.offerStartedAt = 1000;
  assert.equal(link._isOfferNegotiating(2200), true, 'active WebRTC handshake must not be aborted at 1.2s');
  assert.equal(link._isOfferNegotiating(6000), false, 'expired handshake (>4.5s) allows retry');
  link.pc = { connectionState: 'failed' };
  assert.equal(link._isOfferNegotiating(2200), false, 'failed PC allows immediate retry');

  // 2) После 35 секунд работы (seq = 2100) обычное опоздание старого UDP-пакета (seq = 2098) того же sid отбрасывается...
  link._handlePacket({ sid: 's-first', seq: 2100, q: [0, 0, 0, 1] }, true);
  assert.equal(received.length, 1);
  link._handlePacket({ sid: 's-first', seq: 2098, q: [0, 0, 0, 1] }, true);
  assert.equal(received.length, 1, 'out-of-order UDP packet within same session is ignored');

  // ...но при перезагрузке вкладки браслета (новый sid, seq снова 1) пакет принимается МГНОВЕННО без 35-секундной заморозки!
  link._handlePacket({ sid: 's-reloaded', seq: 1, q: [0, 0, 0, 1] }, true);
  assert.equal(received.length, 2, 'reloaded wrist tab seq=1 is accepted with zero dropped frames');
});

test('Neck-only head turn (+45 deg) keeps outstretched arm steady in world space without false elbow bend', () => {
  const fusion = new WristHandFusion('right');
  const qPose1 = w3cDeviceQuaternion(0, 90, 0, 0);
  const qPose2 = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qPose1);
  fusion.feedSensor({ q: qPose1, ts: 0 });
  fusion.calibrateStretchPose();
  fusion.feedSensor({ q: qPose2, ts: 10 });
  fusion.calibrateBendPose();

  // Игрок держит прямую руку неподвижно в сторону бака (0° в комнате),
  // а ПОВОРАЧИВАЕТ ТОЛЬКО ГОЛОВУ на +45° вправо, рассматривая окна двора!
  let snap;
  for (let i = 0; i < 40; i++) {
    const t = 100 + i * 25;
    fusion.feedSensor({ q: qPose1, linMag: 0, rotRate: 0, ts: t });
    snap = fusion.update(0.025, { phase: 'search', headLook: { yaw: 45 * DEG, pitch: 0 }, now: t });
  }
  assert.ok(Math.abs(fusion.torsoYaw) < 2 * DEG, `torso stays still on neck-only turn: torsoYaw=${fusion.torsoYaw / DEG}`);
  assert.ok(snap.reach > 0.92, `arm stays fully extended without false chest bend: reach=${snap.reach}`);

  // Переводим ориентацию кисти из повернувшейся камеры Ry(-45°) обратно в мир двора:
  // рука должна остаться направленной точно вперёд к баку [0, 0, -1]!
  const qWorldArm = qMul(qAxisAngle([0, 1, 0], -45 * DEG), snap.qArm);
  const worldFwd = qRotVec(qWorldArm, [0, 0, -1]);
  assert.ok(Math.abs(worldFwd[0]) < 0.03 && worldFwd[2] < -0.99, `world arm stays aimed at bin: ${JSON.stringify(worldFwd)}`);
});

test('Full 3D Petersburg body (coat, scarf, trousers, boots, dual gloves) stays below forward horizon and grounds cleanly on downward gaze across all VR modes', () => {
  const avatar = createGlovedHand('right');

  // 1) Режим Гироскоп / 2 метки (handMode = false) при взгляде строго вперёд (pitch = 0):
  //    ремешок-маяк скрыт, обе руки симметрично лежат у карманов пальто,
  //    а всё пальто и ноги находятся ниже переднего поля зрения!
  avatar.update(1 / 60, {
    visible: true,
    handMode: false,
    handSide: 'right',
    headLook: { yaw: 0, pitch: 0 },
  });
  avatar.group.updateMatrixWorld(true);

  const infoCalm = avatar.getBodyInfo();
  assert.equal(infoCalm.visible, true);
  assert.equal(infoCalm.torsoVisible, true);
  assert.equal(infoCalm.beaconBandVisible, false, 'beacon strap hidden in gyro/fusion VR');
  assert.equal(infoCalm.activeArmSide, 'right');
  assert.equal(infoCalm.passiveArmSide, 'left');
  assert.equal(avatar.torsoGroup.children.length, 7, 'coat body, lapels/trim, scarf, trousers, boot leather, boot soles, buttons/eyelets batched into 7 meshes');

  // Обе отдыхающие кисти симметричны по X у карманов пальто
  const rWristCalm = avatar.wristPivot.position.clone();
  const lWristCalm = avatar.passiveWristPivot.position.clone();
  assert.ok(Math.abs(rWristCalm.x + lWristCalm.x) < 1e-3, `symmetric resting wrists: R=${rWristCalm.x}, L=${lWristCalm.x}`);
  assert.ok(Math.abs(rWristCalm.y - lWristCalm.y) < 1e-3);

  // Проверяем положительный детерминант масштаба и конечные нормали на каждом объекте аватара,
  // а также что при pitch=0 ни одна вершина пальто/шарфа/ног не залезает в центр экрана (выше -29°)!
  let meshCount = 0;
  let minBootY = Infinity;
  avatar.group.traverse((obj) => {
    const det = obj.scale.x * obj.scale.y * obj.scale.z;
    assert.ok(det > 0, `positive scale determinant on ${obj.type}: det=${det}`);
    if (obj.isMesh) {
      meshCount++;
      const posAttr = obj.geometry.getAttribute('position');
      const normAttr = obj.geometry.getAttribute('normal');
      assert.ok(posAttr && posAttr.count > 0 && normAttr && normAttr.count === posAttr.count);
      for (let i = 0; i < normAttr.count; i += 17) {
        const nx = normAttr.getX(i), ny = normAttr.getY(i), nz = normAttr.getZ(i);
        assert.ok(Number.isFinite(nx) && Number.isFinite(ny) && Number.isFinite(nz));
      }
    }
  });
  assert.ok(meshCount >= 40, `rich articulated 3D avatar mesh count=${meshCount}`);

  for (const child of avatar.torsoGroup.children) {
    const posAttr = child.geometry.getAttribute('position');
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      if (y < minBootY) minBootY = y;
      if (z < -0.05) {
        const elevDeg = Math.atan2(y, -z) / DEG;
        assert.ok(elevDeg < -29, `torso/scarf vertex stays below forward horizon at pitch=0: elev=${elevDeg.toFixed(1)} deg`);
      }
    }
  }
  assert.ok(minBootY < -1.52 && minBootY > -1.65, `boots reach realistic ground height: minBootY=${minBootY.toFixed(3)}m`);

  // 2) Игрок наклоняет голову вниз на -55°: ботинки, стоящие на полу в мире (0, -1.56, -0.35),
  //    поворачиваются через bodyRoot точно в центр взгляда камеры (-Z)!
  avatar.update(1 / 60, {
    visible: true,
    handMode: false,
    handSide: 'right',
    headLook: { yaw: 0, pitch: -55 * DEG },
  });
  avatar.group.updateMatrixWorld(true);
  // Вектор мыска ботинка (0.12, -1.55, -0.75) после поворота bodyRoot на Rx(+55°):
  // zCam = -1.55 * sin(55°) - 0.75 * cos(55°) ≈ -1.70, yCam ≈ -0.27 (точно в поле зрения!)
  const bootToeInCam = avatar.bodyRoot.localToWorld(avatar.wristPivot.position.clone().set(0.12, -1.55, -0.75));
  assert.ok(bootToeInCam.z < -1.50 && Math.abs(bootToeInCam.y) < 0.45, `boots enter downward gaze cone cleanly: ${JSON.stringify(bootToeInCam)}`);

  // 3) Режим Рука-браслет (handMode = true, handSide = 'left'):
  //    ведущая левая рука носит ремешок-маяк и тянется вперёд, а правая спокойно остаётся у кармана!
  avatar.update(1 / 60, {
    visible: true,
    handMode: true,
    handTracked: true,
    handSide: 'left',
    headLook: { yaw: 0, pitch: -15 * DEG },
    torsoYaw: 0,
    shoulderPos: { x: -0.21, y: -0.24, z: -0.14 },
    elbowPos: { x: -0.22, y: -0.28, z: -0.36 },
    pos: { x: -0.14, y: -0.12, z: -0.58 },
    qArm: [0, 0, 0, 1],
    reach: 0.85,
  });
  const infoHand = avatar.getBodyInfo();
  assert.equal(infoHand.beaconBandVisible, true, 'beacon strap visible on active wrist in hand mode');
  assert.equal(infoHand.activeArmSide, 'left');
  assert.equal(infoHand.passiveArmSide, 'right');
  assert.ok(avatar.passiveWristPivot.position.x > 0.15, 'passive right arm stays calmly at right coat pocket');
  assert.ok(avatar.wristPivot.position.z < -0.50, 'active left arm reaches forward toward bin');

  avatar.dispose();
});





