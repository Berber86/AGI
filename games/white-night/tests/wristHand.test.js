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
} from '../src/vr/wristHandFusion.js';
import { createGlovedHand } from '../src/vr/handMesh.js';

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
  assert.ok(Math.abs(farRes.u - 0.54) < 0.02);
  assert.ok(Math.abs(farRes.spanNorm - 0.10) < 0.02);

  const nearRes = tracker.analyzeRgba(nearFrame, 200, 150, 200);
  assert.equal(nearRes.status, 'pair');
  assert.ok(nearRes.spanNorm > farRes.spanNorm * 2.1);
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

test('Gyro-compensated dual-beacon span keeps true depth steady even when wrist tilts 45 deg', () => {
  const fusion = new WristHandFusion();
  const qBase = w3cDeviceQuaternion(0, 90, 0, 0);
  const qBent = qMul(qAxisAngle([1, 0, 0], 50 * DEG), qBase);

  fusion.feedSensor({ q: qBase, ts: 0 });
  fusion.calibrateStretchPose(fusion.lastSensor, { fresh: true, u: 0.52, v: 0.54, spanNorm: 0.10 });
  fusion.feedSensor({ q: qBent, ts: 20 });
  fusion.calibrateBendPose(fusion.lastSensor, { fresh: true, u: 0.54, v: 0.62, spanNorm: 0.24 });

  // Держим руку на средней дистанции (истинный span = 0.17), но поворачиваем запястье на 45° вокруг Y:
  // видимый камерой span сжимается в cos(45°) = 0.707 раза (до ~0.12), однако гироскоп компенсирует сжатие!
  const qTiltedWrist = qMul(qAxisAngle([0, 1, 0], 45 * DEG), qBase);
  const foreshortenedSpan = 0.17 * Math.cos(45 * DEG);
  fusion.feedSensor({ q: qTiltedWrist, ts: 100 });
  let snap;
  for (let i = 0; i < 20; i++) {
    snap = fusion.update(1 / 60, {
      beacon: { fresh: true, status: 'pair', u: 0.52, v: 0.54, spanNorm: foreshortenedSpan, rollRad: 0 },
      phase: 'search',
      now: 100 + i * 16,
    });
  }
  // Без компенсации span=0.12 дал бы optReach=0.86; с компенсацией истинный optReach=0.50!
  assert.ok(snap.reach < 0.75 && snap.reach > 0.45, `compensated reach=${snap.reach}`);
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
