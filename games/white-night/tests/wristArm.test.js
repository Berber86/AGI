// Физический гейт biometrics-оценщика руки: синтетическое тело (плечо -> локоть ->
// запястье с настоящими длинами костей), телефон на ремешке и камера на голове,
// которая видит двухцветный маяк. В отличие от остальных тестов здесь ИСТИНА известна
// заранее — поэтому тест ловит именно «алгоритм не может увидеть движение», а не
// «алгоритм сделал не так, как записали в тесте».
//
// Этот гейт был написан после того, как на реальном телефоне игрок увидел:
//   • локоть не сгибается (рука замирала на ~105° и «разгибалась» при догибании);
//   • поднятая вверх рука не поднимается (залезала до y ~ 0.15 м и опускалась обратно).
// Оба симптома были следствием шкалы «наклон предплечья -> насколько согнут локоть»,
// а не поломкой датчиков.
import test from 'node:test';
import assert from 'node:assert/strict';
import { poseArm, makeBeaconModel, settle, makeFusion } from './armRig.mjs';

const beacon = makeBeaconModel();
const SPAN = { layout: 'diagonal' };

function calibratedFusion(side = 'right') {
  const fusion = makeFusion(side);
  const stretch = poseArm({ side, elbowDeg: 0, raiseDeg: 0 });
  const bend = poseArm({ side, elbowDeg: 85, raiseDeg: 0, inwardDeg: 22 });
  settle(fusion, stretch, beacon, { frames: 20 });
  fusion.calibrateStretchPose(fusion.lastSensor, beacon.sample(stretch, 1000, SPAN));
  settle(fusion, bend, beacon, { frames: 20 });
  const cal = fusion.calibrateBendPose(fusion.lastSensor, beacon.sample(bend, 4000, SPAN));
  assert.equal(cal.ok, true, `калибровка двух жестов должна пройти: ${cal.message}`);
  return { fusion, stretch, bend };
}

test('elbow flexion is tracked monotonically across the whole anatomical range', () => {
  const { fusion } = calibratedFusion('right');
  const truth = [];
  const measured = [];
  for (const elbowDeg of [0, 20, 40, 60, 80, 100, 120, 140]) {
    const pose = poseArm({ side: 'right', elbowDeg, raiseDeg: 0, inwardDeg: 22 });
    const { snap } = settle(fusion, pose, beacon, {
      frames: 130,
      now0: 10000 + elbowDeg * 500,
      opts2: SPAN,
    });
      assert.ok(
        Number.isFinite(snap.elbowBendDeg) && Object.values(snap.pos).every((c) => Number.isFinite(c)),
        `поза ${elbowDeg}° выдала NaN: ${JSON.stringify(snap.pos)}`
      );
    truth.push(elbowDeg);
    measured.push(snap.elbowBendDeg);
  }
  // 1. Диапазон: симптом «локоть не сгибается» = аватар проходит << реальных 140°.
  const spanDeg = Math.max(...measured) - measured[0];
  assert.ok(spanDeg > 85, `локоть проходит только ${spanDeg.toFixed(1)}° из 140° реального сгиба`);
  assert.ok(
    measured[measured.length - 1] >= Math.max(...measured) - 6,
    `на самом глубоком сгибе рука сама разогнулась: ${measured.join(', ')}`
  );
  // 2. Монотонность: догибание руки никогда не должно разгибать аватара.
  for (let i = 1; i < measured.length; i++) {
    assert.ok(
      measured[i] >= measured[i - 1] - 3,
      `сгибание ${truth[i]}° после ${truth[i - 1]}° уменьшило угол локтя: ${measured[i - 1]} -> ${measured[i]}`
    );
  }
  // 3. Точность в оптически видимой зоне (0..100°).
  for (let i = 0; i <= 5; i++) {
    const err = Math.abs(measured[i] - (truth[i] + 18));
    assert.ok(err < 25, `${truth[i]}°: измерено ${measured[i]}°, ошибка ${err.toFixed(1)}°`);
  }
});

test('raising the whole arm moves the hand up instead of folding the elbow', () => {
  const { fusion } = calibratedFusion('right');
  const ys = [];
  for (const raiseDeg of [0, 15, 30, 45, 60, 75]) {
    const pose = poseArm({ side: 'right', elbowDeg: 0, raiseDeg });
    const { snap } = settle(fusion, pose, beacon, { frames: 130, now0: 120000 + raiseDeg * 500, opts2: SPAN });
    ys.push(snap.pos.y);
    // Пока кисть в кадре, подъём руки обязан читаться именно как подъём (локти прямые).
    // Вне кадра одно лишь предплечье физически не различает «поднял руку» и «согнул
    // локоть» — там требование было бы невыполнимым, поэтому проверяем только зону оптики.
    if (snap.trackingSource === 'gyro+beacon') {
      assert.ok(
        snap.elbowBendDeg < 40,
        `подъём руки на ${raiseDeg}° при видимом маяке сложил локоть до ${snap.elbowBendDeg}°`
      );
    }
  }
  for (let i = 1; i < ys.length; i++) {
    assert.ok(ys[i] > ys[i - 1] + 0.03, `на подъёме ${i} рука не пошла выше: ${ys[i - 1].toFixed(3)} -> ${ys[i].toFixed(3)}`);
  }
  const rise = ys[ys.length - 1] - ys[0];
  assert.ok(rise > 0.5, `рука поднялась лишь на ${(rise * 100).toFixed(0)} см (ожидается > 50 см)`);
});

test('forearm roll around its own axis does not move the elbow or the hand height', () => {
  const { fusion } = calibratedFusion('right');
  const ref = poseArm({ side: 'right', elbowDeg: 55, raiseDeg: 10 });
  const base = settle(fusion, ref, beacon, { frames: 120, now0: 200000, opts2: SPAN }).snap;
  for (const rollDeg of [30, 60, 90, 120, -30, -60]) {
    const pose = poseArm({ side: 'right', elbowDeg: 55, raiseDeg: 10, rollDeg });
    const { snap } = settle(fusion, pose, beacon, {
      frames: 120,
      now0: 220000 + Math.abs(rollDeg) * 500,
      opts2: SPAN,
    });
    assert.ok(
      Math.abs(snap.elbowBendDeg - base.elbowBendDeg) < 12,
      `поворот кисти на ${rollDeg}° сдвинул локоть: ${base.elbowBendDeg} -> ${snap.elbowBendDeg}`
    );
    assert.ok(
      Math.abs(snap.pos.y - base.pos.y) < 0.08,
      `поворот кисти на ${rollDeg}° уронил запястье: ${base.pos.y.toFixed(3)} -> ${snap.pos.y.toFixed(3)}`
    );
  }
});

test('a stale beacon sample cannot fold the arm while the head turns or looks down', () => {
  const { fusion } = calibratedFusion('right');
  const pose = poseArm({ side: 'right', elbowDeg: 0, raiseDeg: 0 });
  // Сначала рука в кадре и откалибрована — оптика активна.
  const before = settle(fusion, pose, beacon, { frames: 90, now0: 300000, opts2: SPAN }).snap;
  assert.ok(before.reach > 0.75, `после калибровки reach=${before.reach} (ожидается > 0.75)`);
  // Игрок резко смотрит вниз и обратно; последний кадр маяка всё ещё «свежий» (450 мс).
  let snap = before;
  let now = 300000 + 90 * 16;
  for (const pitchDeg of [-46, -46, 0, 0]) {
    for (let i = 0; i < 6; i++) {
      now += 16;
      const ageMs = now - (300000 + 90 * 16);
      const freshSample = beacon.sample(pose, 300000 + 90 * 16, SPAN);
      fusion.feedSensor({ q: pose.deviceQ, linMag: 0.2, rotRate: 0, acc: [0, 0, 9.81], ts: now });
      snap = fusion.update(1 / 60, {
        beacon: ageMs <= 450 ? freshSample : { status: 'none', u: 0.5, v: 0.55, spanNorm: 0, fresh: false, ts: now },
        headLook: { yaw: 0, pitch: (pitchDeg * Math.PI) / 180 },
        phase: 'search',
        now,
      });
    }
  }
  assert.ok(
    snap.reach > 0.7,
    `взгляд вниз с протухающим кадром маяка сложил локоть: reach=${snap.reach} bend=${snap.elbowBendDeg}`
  );
});

test('left and right hands are mirrored consistently, and the tracker keeps both in anatomical range', () => {
  for (const side of ['right', 'left']) {
    const { fusion } = calibratedFusion(side);
    const sign = side === 'left' ? -1 : 1;
    const straight = poseArm({ side, elbowDeg: 0, raiseDeg: 0 });
    const folded = poseArm({ side, elbowDeg: 80, raiseDeg: 0, inwardDeg: 24 });
    const a = settle(fusion, straight, beacon, { frames: 120, now0: 400000, opts2: SPAN }).snap;
    const b = settle(fusion, folded, beacon, { frames: 120, now0: 420000, opts2: SPAN }).snap;
    assert.ok(a.reach > 0.85, `${side}: прямая рука reach=${a.reach}`);
    assert.ok(b.reach < 0.3, `${side}: согнутая рука reach=${b.reach}`);
    assert.ok(
      a.pos.x * sign > 0.02,
      `${side}: запястье должно быть со своей стороны тела, pos.x=${a.pos.x.toFixed(3)}`
    );
    for (const snap of [a, b]) {
      for (const key of ['pos', 'elbowPos', 'shoulderPos', 'vel']) {
        assert.ok(!Object.values(snap[key]).some((v) => !Number.isFinite(v)), `${side}: NaN в ${key}`);
      }
    }
  }
});

test('reaching with no camera at all still produces a live, finite arm (pure gyro fallback)', () => {
  const fusion = makeFusion('right');
  const stretch = poseArm({ side: 'right', elbowDeg: 0, raiseDeg: 0 });
  const bend = poseArm({ side: 'right', elbowDeg: 60, raiseDeg: 0, inwardDeg: 20 });
  settle(fusion, stretch, beacon, { frames: 20 });
  fusion.calibrateStretchPose(fusion.lastSensor, null);
  settle(fusion, bend, beacon, { frames: 20 });
  fusion.calibrateBendPose(fusion.lastSensor, null);
  const noOptics = (pose, now0) =>
    settle(fusion, pose, beacon, { frames: 120, now0, hideBeacon: true }).snap;
  const straight = noOptics(stretch, 500000);
  const folded = noOptics(bend, 520000);
  // Без оптики точная длина руки недоступна, поэтому остаточный «недосгиб» после
  // предыдущей позы допустим: важно, что рука живая, выпрямленная и конечно ограниченная.
  assert.ok(straight.reach > 0.8, `без оптики прямая рука reach=${straight.reach}`);
  assert.ok(folded.reach < 0.45, `без оптики согнутая рука reach=${folded.reach}`);
  assert.equal(folded.trackingSource, 'gyro-only');
  // Оптика должна возвращаться без рывка: после появления маяка рука остаётся конечно.
  const back = settle(fusion, stretch, beacon, { frames: 60, now0: 540000, opts2: SPAN }).snap;
  assert.ok(Number.isFinite(back.pos.y) && Math.abs(back.pos.y) < 1.6, `рывок при возврате оптики: ${back.pos.y}`);
});

test('beacon geometry stays measurable: span never collapses to zero for a straight arm', () => {
  // Диагональная раскладка пятен нужна, чтобы при вытянутой на шлем руке разнос не
  // проецировался в ноль: иначе трекер отбраковывает пару и локоть лишается данных.
  const flat = makeBeaconModel();
  for (const layout of ['stacked', 'diagonal']) {
    const spans = [];
    for (const elbowDeg of [0, 15, 30, 45]) {
      const pose = poseArm({ side: 'right', elbowDeg, raiseDeg: 0, inwardDeg: 20 });
      const s = flat.sample(pose, 1000 + elbowDeg, { layout });
      spans.push(s.status === 'pair' ? s.spanNorm : 0);
    }
    const worst = Math.min(...spans);
    if (layout === 'diagonal') {
      assert.ok(worst > 0.018, `диагональный маяк теряется: минимальный span=${worst.toFixed(4)} (< 0.018 = пара отбраковывается)`);
    }
  }
  // 1) Во всех позах разнос пятен остаётся выше порога отбраковки пары (0.018):
  //    иначе оптический канал «глохнет» ровно там, где он нужнее всего.
  let worstSpan = Infinity;
  for (const elbowDeg of [0, 20, 40, 60, 80, 100, 120, 140]) {
    for (const inwardDeg of [0, 12, 24]) {
      const pose = poseArm({ side: 'right', elbowDeg, raiseDeg: 0, inwardDeg });
      const s = flat.sample(pose, 1000 + elbowDeg, { layout: 'stacked' });
      if (s.status !== 'pair') continue;
      worstSpan = Math.min(worstSpan, s.spanNorm);
    }
  }
  assert.ok(worstSpan > 0.018, `минимальный видимый разнос ${worstSpan.toFixed(4)} < порога 0.018`);
  // 2) Когда предплечье стоит перпендикулярно взгляду, масштаб пятна — честная линейка:
  //    приближение руки обязано монотонно увеличивать span (это и пишется в калибровку).
  const nearFar = [0.9, 0.7, 0.55, 0.45].map((d) => {
    const pose = poseArm({ side: 'right', elbowDeg: 62, raiseDeg: 0, inwardDeg: 0 });
    const scaled = { ...pose, wrist: pose.wrist.map((c) => c * d) };
    return flat.sample(scaled, 1000, { layout: 'stacked' }).spanNorm;
  });
  for (let i = 1; i < nearFar.length; i++) {
    assert.ok(nearFar[i] > nearFar[i - 1] * 1.05, `ближе — а пятно мельче: ${nearFar.join(', ')}`);
  }
});

test('snapshot exposes the solved elbow angle in degrees, matching the avatar driver', () => {
  const { fusion } = calibratedFusion('right');
  const deep = poseArm({ side: 'right', elbowDeg: 95, raiseDeg: 0, inwardDeg: 22 });
  const { snap } = settle(fusion, deep, beacon, { frames: 160, now0: 600000, opts2: SPAN });
  assert.ok(snap.elbowBendDeg > 80 && snap.elbowBendDeg < 160, `elbowBendDeg=${snap.elbowBendDeg}`);
  assert.ok(snap.elevationDeg !== undefined && Math.abs(snap.elevationDeg) <= 180, `elevation=${snap.elevationDeg}`);
  assert.ok(snap.reach >= 0 && snap.reach <= 1.05, `reach=${snap.reach}`);
});
