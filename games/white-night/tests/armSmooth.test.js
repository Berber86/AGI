// Гейт ПЛАВНОСТИ и приоритетов источников трекинга руки.
//
// Почему он вообще есть: на телефоне игрок жаловался не только на «локоть не сгибается»,
// но и на «дёргается». Причина системная: камера говорит ~11 раз в секунду, а гироскоп
// запястья — 60. Если редкое измерение (а оно шумное: центр светового пятна прыгает на
// полпикселя) перетягивает позу целиком в одном кадре — видим это как резкий пинок.
//
// Выбранный порядок приоритетов (он же — цена и выгода, которые принимает игра):
//   1. гироскоп 60 Гц ведёт ДВИЖЕНИЕ (каждый кадр, поэтому рука не «догоняет» игрока);
//   2. камера 11 Гц лишь МЕНЯЕТ ВЗГЛЯД на абсолют: сначала фильтр измерения (трекер),
//      потом плавный вес доверия (слияние), потом потолки скорости/ускорения (вывод);
//   3. анатомия (длины костей) — закон, а не предпочтение;
//   4. когда данных нет — держим последнее честное решение.
// Следствие: поза отстаёт на ~1 кадр оптики + 60..120 мс пружины, зато рывок физически
// невозможен. Единичные «ложные взмахи» допустимы: канал жеста (linMag/rotRate) идёт
// мимо этих фильтров и остаётся резким — иначе игрок перестал бы бросать предмет.
//
// Измерено на этом же синтетическом теле (было -> стало):
//   взмах с шумом оптики: пик. скорость кисти 7.99 -> 4.6 м/с (потолок), пик. ускорение
//     434 -> 40 м/с², скачок угла локтя за кадр 21.8° -> 9°;
//   рука стоит, пакеты теряются: дрейф «компенсации дрейфа гироскопа» 4.60° -> 0.80°,
//     пик. призрачная скорость 0.36 -> 0.07 м/с, разброс локтя 0.8° -> 0.1°;
//   лаг за движущейся рукой не изменился (0 мс на тестовом свипе) — плавность досталась
//     без «резиновой» руки.
import test from 'node:test';
import assert from 'node:assert/strict';
import { poseArm, makeBeaconModel, settle, makeFusion, sub3 } from './armRig.mjs';

const DT = 1 / 60;
const SPAN = { layout: 'diagonal' };
const NOISE = 0.006; // ±0.5 пикселя на кадре 200×150 — типовой дребезг центроида

let seedState = 987654321;
function noiseFn() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff - 0.5;
}

function calibrated(side = 'right') {
  const fusion = makeFusion(side);
  const stretch = poseArm({ side, elbowDeg: 0, raiseDeg: 0 });
  const bend = poseArm({ side, elbowDeg: 85, raiseDeg: 0, inwardDeg: 22 });
  settle(fusion, stretch, makeBeaconModel(), { frames: 20 });
  const flat = makeBeaconModel();
  fusion.calibrateStretchPose(fusion.lastSensor, flat.sample(stretch, 1000, SPAN));
  settle(fusion, bend, flat, { frames: 20 });
  const cal = fusion.calibrateBendPose(fusion.lastSensor, flat.sample(bend, 4000, SPAN));
  assert.equal(cal.ok, true, `калибровка двух жестов должна пройти: ${cal.message}`);
  return { fusion, flat };
}

/**
 * Прогон руки через слияние с ЧЕСТНЫМ протоколом камеры: новый снимок раз в 90 мс
 * (11 Гц), между ними трекер отдаёт последний кадр с растущим возрастом — как
 * wristBeaconTracker.sample() на реальном устройстве.
 * mode 'held' — как в игре; mode 'gappy' — обрывочный канал (bluetooth-мост теряет
 * пакеты): самый злой случай для весов, на нём и ломалась плавность.
 */
function stream(fusion, flat, { frames, poseAt, gap = 9, mode = 'held', noise = NOISE, dropFrom = -1, dropTo = -1, impulse = false }) {
  let now = 90000;
  let last = { status: 'none', u: 0.5, v: 0.55, spanNorm: 0, fresh: false, ts: now - 1000, ageMs: 1000 };
  const rows = [];
  for (let i = 0; i < frames; i++) {
    now += DT * 1000;
    const pose = poseAt(i * DT, i);
    // impulse: рука геометрически неподвижна, но ИМУ шепчет «что-то происходит»
    // (дрожание рук, шум акселерометра, телефон на широком ремешке болтается).
    // Именно на этом протоколе старый код и раскручивал петлю обратной связи.
    fusion.feedSensor({
      q: pose.deviceQ,
      linMag: impulse ? 1 + Math.abs(noiseFn()) * 0.6 : 1,
      rotRate: impulse ? 40 + Math.abs(noiseFn()) * 30 : 0,
      acc: [0, 0, 9.81],
      ts: now,
    });
    const blocked = dropFrom >= 0 && i >= dropFrom && i < dropTo;
    if (!blocked && i % gap === 0) {
      last = flat.sample(pose, now, { ...SPAN, noise: () => noiseFn() * noise * 2 });
    }
    const beacon = blocked
      ? { status: 'none', u: 0.5, v: 0.55, spanNorm: 0, fresh: false, ts: now, ageMs: 999 }
      : mode === 'held'
        ? {
            ...last,
            ageMs: Math.round(now - last.ts),
            fresh: last.status !== 'none' && now - last.ts <= 450,
          }
        : i % gap === 0
          ? last
          : null;
    const snap = fusion.update(DT, {
      beacon,
      phase: 'search',
      headLook: { yaw: 0, pitch: 0 },
      now,
    });
    rows.push({
      i,
      pose: [fusion.torsoWristPos.x, fusion.torsoWristPos.y, fusion.torsoWristPos.z],
      truth: pose.wrist,
      bend: snap.elbowBendDeg,
      trim: fusion.yawTrimRad,
      w: fusion.opticW,
      source: snap.trackingSource,
    });
  }
  return rows;
}

const stepStats = (rows, from = 0) => {
  const speed = [];
  const accel = [];
  for (let i = from + 1; i < rows.length; i++) {
    speed.push(Math.hypot(...sub3(rows[i].pose, rows[i - 1].pose)) / DT);
  }
  for (let i = 1; i < speed.length; i++) {
    accel.push(Math.abs(speed[i] - speed[i - 1]) / DT);
  }
  return { speed, accel };
};

test('шум камеры не двигает неподвижную руку: покоящаяся кисть стоит на месте', () => {
  const { fusion, flat } = calibrated('right');
  const pose = poseArm({ side: 'right', elbowDeg: 40, raiseDeg: 20, inwardDeg: 12 });
  const rows = stream(fusion, flat, { frames: 260, poseAt: () => pose, mode: 'held' });
  const steady = rows.slice(60);
  let maxStep = 0;
  for (let i = 1; i < steady.length; i++) {
    maxStep = Math.max(maxStep, Math.hypot(...sub3(steady[i].pose, steady[i - 1].pose)));
  }
  // 1.5 мм за кадр = 9 см/с: шум центроида не имеет права превращаться в «жест».
  assert.ok(maxStep <= 0.0015, `неподвижная кисть прошла ${maxStep.toFixed(5)} м за кадр (шум оптики)`);
  // 2. Разброс угла локтя в покое.
  const bends = steady.map((r) => r.bend);
  const spread = Math.max(...bends) - Math.min(...bends);
  assert.ok(spread <= 6, `в покое локоть гуляет на ${spread.toFixed(1)}° (шум маяка превращается в сгибание)`);
  // 3. Дрейф компенсации гироскопа: без мёртвой зоны trim интегрирует шум и рука
  //    уезжает со скоростью до 12°/с — это и есть «ложные взмахи на ровном месте».
  const trimDrift = Math.abs(steady[steady.length - 1].trim - steady[0].trim) * (180 / Math.PI);
  assert.ok(trimDrift <= 1.5, `компенсация дрейфа унесла руку на ${trimDrift.toFixed(2)}° при неподвижной кисти`);
  // 4. Истина: поза не должна уплывать далеко.
  const err = steady.map((r) => Math.hypot(...sub3(r.pose, r.truth))).sort((a, b) => a - b);
  assert.ok(err[Math.floor(err.length * 0.95)] <= 0.08, `ошибка позы в покое p95 = ${err[Math.floor(err.length * 0.95)].toFixed(3)} м`);
});

test('петля обратной связи «оптика -> удержание -> оптика» исключена: поза не распрямляется сама', () => {
  // Инвариант: «локоть согнут и близко» vs «рука выпрямлена и далеко» выбирает ЧИСТОЕ
  // показание гироскопа, а не уже решённая поза. Как только выбор начинает читаться из
  // результата (через удержание или через «линейку» размера пятна), фильтр кормит сам
  // себя: в варианте с «размером пятна как судьёй» локоть уезжал на 28° за 0.65 с на абсолютно неподвижной
  // руке, и монотонность сгибания ломалась. Гейт ниже держит именно этот инвариант:
  // при теряющихся пакетах (самый злой протокол) решённый угол не ползёт.
  const { fusion, flat } = calibrated('right');
  const pose = poseArm({ side: 'right', elbowDeg: 55, raiseDeg: 10, inwardDeg: 16 });
  const rows = stream(fusion, flat, { frames: 240, poseAt: () => pose, mode: 'gappy', impulse: true });
  const steady = rows.slice(60).map((r) => r.bend);
  const start = steady[Math.floor(steady.length * 0.25)];
  const end = steady[steady.length - 1];
  assert.ok(
    Math.abs(end - start) <= 6,
    `локоть сам уползал с ${start.toFixed(1)}° до ${end.toFixed(1)}° за ${((steady.length * DT) | 0)} с неподвижной руки ` +
      `(траектория: ${steady.filter((_, i) => i % 12 === 0).map((v) => v.toFixed(0)).join(' → ')})`
  );
  // И рука не «проваливается» в ноль: диапазон остаётся физичным.
  assert.ok(Math.max(...steady) <= 150 && Math.min(...steady) >= 0, 'угол локтя вышел за анатомический диапазон');
});

test('рывок физически невозможен: скорость и ускорение кисти ограничены даже при скачке данных', () => {
  const { fusion, flat } = calibrated('right');
  // Телепорт позы + телепорт маяка: игрок резко махнул рукой, оптика врала, что кисть
  // в полуметре дальше. Задача — доехать плавно, а не щёлкнуть.
  const rows = stream(fusion, flat, {
    frames: 150,
    mode: 'held',
    poseAt: (t) =>
      poseArm({
        side: 'right',
        elbowDeg: t < 0.6 ? 10 : 120,
        raiseDeg: t < 0.6 ? 0 : -35,
        inwardDeg: t < 0.6 ? 0 : 28,
      }),
  });
  const { speed, accel } = stepStats(rows);
  const maxSpeed = Math.max(...speed);
  const maxAccel = Math.max(...accel);
  assert.ok(maxSpeed <= 5.0, `кисть прошила ${maxSpeed.toFixed(2)} м/с (потолок 4.6 м/с) — это и есть «безумный рывок»`);
  assert.ok(maxAccel <= 45, `ускорение кисти ${maxAccel.toFixed(0)} м/с² (потолок 40) — кадр-пенок`);
});

test('доверие к камере набирается и теряется плавно, а не щелчком', () => {
  const { fusion, flat } = calibrated('right');
  const pose = poseArm({ side: 'right', elbowDeg: 35, raiseDeg: 15, inwardDeg: 14 });
  // 1) Возврат маяка после секунды слепоты: вес обязан вырасти постепенно, а поза —
  //    не дёрнуться на первом же подтверждённом кадре.
  const rows = stream(fusion, flat, {
    frames: 200,
    poseAt: () => pose,
    mode: 'held',
    dropFrom: 40,
    dropTo: 100,
  });
  const w = rows.map((r) => r.w);
  let maxRise = 0;
  for (let i = 1; i < w.length; i++) maxRise = Math.max(maxRise, w[i] - w[i - 1]);
  assert.ok(maxRise <= 0.2, `вес оптики подскочил на ${maxRise.toFixed(3)} за кадр — кроссфейд источников не плавный`);
  let maxFall = 0;
  for (let i = 1; i < w.length; i++) maxFall = Math.max(maxFall, w[i - 1] - w[i]);
  // Спад медленный: обрыв видимости не должен выдёргивать позу из-под игрока.
  assert.ok(maxFall <= 0.08, `вес оптики упал на ${maxFall.toFixed(3)} за кадр — после пропажи маяка рука дёрнется`);
  const jumpAtLoss = Math.hypot(...sub3(rows[41].pose, rows[40].pose));
  assert.ok(jumpAtLoss <= 0.004, `в кадр потери маяка кисть сместилась на ${(jumpAtLoss * 100).toFixed(1)} см`);
  // 2) Метка источника не мигает: счёт смен 'gyro+beacon' <-> 'gyro-only' при стабильной
  //    картинке должен быть нулевым (гистерезис 0.45..0.55).
  const switches = rows.slice(120).reduce((n, r, i, arr) => n + (i > 0 && r.source !== arr[i - 1].source ? 1 : 0), 0);
  assert.equal(switches, 0, `метка источника мигала ${switches} раз при неподвижной руке — HUD и тесты видят разные режимы`);
});

test('плавность не съедает отзыв: лаг за движущейся рукой < 130 мс, сгибание проходит весь диапазон', () => {
  const { fusion, flat } = calibrated('right');
  const frames = 200;
  const rows = stream(fusion, flat, {
    frames,
    mode: 'held',
    poseAt: (t) => {
      const k = Math.min(1, t / 2.4);
      const s = 0.5 - 0.5 * Math.cos(Math.PI * k);
      return poseArm({ side: 'right', elbowDeg: 100 * s, raiseDeg: 30 * s, inwardDeg: 20 * s });
    },
  });
  // Лаг: ищем сдвиг истины назад по времени, при котором ошибка минимальна.
  const pose = rows.map((r) => r.pose);
  const truth = rows.map((r) => r.truth);
  let best = { lag: 0, e: Infinity };
  for (let lag = 0; lag <= 12; lag++) {
    let sum = 0;
    let n = 0;
    for (let i = 40; i < frames - 2; i++) {
      sum += Math.hypot(...sub3(pose[i], truth[i - lag]));
      n++;
    }
    const mean = sum / Math.max(1, n);
    if (mean < best.e) best = { lag, e: mean };
  }
  const lagMs = best.lag * DT * 1000;
  assert.ok(lagMs <= 130, `запаздывание позы ${lagMs.toFixed(0)} мс (допускаем ~1 кадр оптики + пружину)`);
  // И при этом диапазон движения сохраняется: локоть честно проходит > 70°.
  const bends = rows.map((r) => r.bend);
  assert.ok(
    Math.max(...bends.slice(-40)) - Math.min(...bends.slice(0, 40)) > 70,
    `за время плавно-фильтрованного сгибания локоть прошёл только ${(Math.max(...bends.slice(-40)) - Math.min(...bends.slice(0, 40))).toFixed(1)}°`
  );
});
