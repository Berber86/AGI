import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deviceUpVector,
  accelToUpVector,
  handTiltDrive,
  createBroadcastRtcSignaling,
  RtcHostPeer,
  RtcJoyPeer,
} from '../src/tilt-rtc.js';

test('нейтральный хват (±5°) держит спокойный круиз 30% без тормоза и без увода руля', () => {
  const zero = deviceUpVector(35, 0);
  const neutral = handTiltDrive(zero, zero);
  assert.equal(neutral.steer, 0);
  assert.equal(neutral.throttle, 0.3);
  assert.equal(neutral.brake, 0);
  assert.equal(neutral.zone, 'cruise');

  // Лёгкое дрожание руки ±4° остаётся в зоне спокойного круиза 30%
  const slightForward = handTiltDrive(deviceUpVector(31, 1.5), zero);
  assert.equal(slightForward.steer, 0);
  assert.equal(slightForward.throttle, 0.3);
  assert.equal(slightForward.brake, 0);
  assert.equal(slightForward.zone, 'cruise');
});

test('наклон от себя разгоняет до 100%, а наклон на себя плавно включает активный тормоз до стопа', () => {
  const zero = deviceUpVector(30, 0);

  // Наклон вперёд на 15° (beta уменьшается с 30° до 15°) -> разгон > 60%
  const halfGas = handTiltDrive(deviceUpVector(15, 0), zero, { spanDeg: 24 });
  assert.equal(halfGas.zone, 'gas');
  assert.ok(halfGas.throttle > 0.62 && halfGas.throttle < 0.72, `halfGas=${halfGas.throttle}`);
  assert.equal(halfGas.brake, 0);

  // Полный наклон вперёд на 26° (beta 30° -> 4°) -> 100% газа
  const fullGas = handTiltDrive(deviceUpVector(4, 0), zero, { spanDeg: 24 });
  assert.equal(fullGas.throttle, 1);
  assert.equal(fullGas.brake, 0);

  // Плавный отпуск на себя на 7° (beta 30° -> 37°) -> мягкий сброс газа (coast)
  const coast = handTiltDrive(deviceUpVector(37, 0), zero, { spanDeg: 24 });
  assert.equal(coast.zone, 'coast');
  assert.ok(coast.throttle > 0 && coast.throttle < 0.3, `coast=${coast.throttle}`);
  assert.equal(coast.brake, 0);

  // Сильный наклон на себя на 22° (beta 30° -> 52°) -> полный стоп и активный тормоз 100%
  const fullBrake = handTiltDrive(deviceUpVector(52, 0), zero, { spanDeg: 24 });
  assert.equal(fullBrake.zone, 'brake');
  assert.equal(fullBrake.throttle, 0);
  assert.equal(fullBrake.brake, 1);
});

test('боковой наклон влево и вправо симметричен даже при полувертикальном хвате (45°)', () => {
  const zero = deviceUpVector(45, 0);
  const right = handTiltDrive(deviceUpVector(45, 22), zero, { spanDeg: 24 });
  const left = handTiltDrive(deviceUpVector(45, -22), zero, { spanDeg: 24 });

  assert.ok(right.steer > 0.50, `right.steer=${right.steer}`);
  assert.ok(left.steer < -0.50, `left.steer=${left.steer}`);
  assert.ok(Math.abs(right.steer + left.steer) < 0.02, 'левый и правый наклон строго симметричны');
  // При чисто боковом крене педаль остаётся близко к круизу без ложного тормоза
  assert.equal(right.brake, 0);
  assert.equal(left.brake, 0);
});

test('инверсия оси газ/тормоз и резервный акселерометр работают консистентно', () => {
  const zero = deviceUpVector(25, 0);
  const pulledBack20 = deviceUpVector(45, 0);
  const inverted20 = handTiltDrive(pulledBack20, zero, { spanDeg: 24, invertPitch: true });
  assert.equal(inverted20.zone, 'gas');
  assert.ok(inverted20.throttle > 0.84, `throttle=${inverted20.throttle}`);
  assert.equal(inverted20.brake, 0);

  const pulledBackFull = deviceUpVector(50, 0);
  const invertedFull = handTiltDrive(pulledBackFull, zero, { spanDeg: 24, invertPitch: true });
  assert.equal(invertedFull.throttle, 1);

  const accUp = accelToUpVector(0, 4.9, 8.487); // ~30° наклон
  assert.ok(accUp);
  assert.ok(Math.abs(Math.hypot(accUp.x, accUp.y, accUp.z) - 1) < 1e-6);
});

test('сигналинг WebRTC передаёт уникальный hid и iceMode, отсекая устаревшие пакеты от прошлых попыток', async () => {
  const chA = new BroadcastChannel('ckc-test-hid-sig');
  const chB = new BroadcastChannel('ckc-test-hid-sig');
  const sigHost = createBroadcastRtcSignaling(chA, '999111');
  const sigJoy = createBroadcastRtcSignaling(chB, '999111');

  let receivedHello = null;
  sigHost.onHello((h) => { receivedHello = h; });
  await sigJoy.sendHello('joy-1', { hid: 'joy-1-1-abcd', iceMode: 'lan' });
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(receivedHello.joySid, 'joy-1');
  assert.equal(receivedHello.hid, 'joy-1-1-abcd');
  assert.equal(receivedHello.iceMode, 'lan');

  // Проверяем, что RtcJoyPeer игнорирует устаревший offer с чужим hid
  const joyPeer = new RtcJoyPeer(sigJoy, 'joy-1');
  joyPeer.activeHid = 'joy-1-2-fresh';
  await joyPeer._handleOffer({ type: 'offer', sdp: 'v=0', joySid: 'joy-1', hid: 'joy-1-1-stale' });
  assert.equal(joyPeer.pc, null, 'устаревший offer с прошлым hid не должен создавать соединение');

  // И RtcHostPeer игнорирует answer с устаревшим hid
  const hostPeer = new RtcHostPeer(sigHost);
  hostPeer.activeJoySid = 'joy-1';
  hostPeer.activeHid = 'joy-1-2-fresh';
  let setRemoteCalled = false;
  hostPeer.pc = { signalingState: 'have-local-offer', setRemoteDescription: async () => { setRemoteCalled = true; } };
  await hostPeer._handleAnswer({ type: 'answer', sdp: 'v=0', joySid: 'joy-1', hid: 'joy-1-1-stale' });
  assert.equal(setRemoteCalled, false, 'устаревший answer с прошлым hid должен быть отброшен');

  joyPeer.close();
  hostPeer.activeJoySid = null;
  hostPeer.pc = null;
  sigHost.dispose();
  sigJoy.dispose();
  chA.close();
  chB.close();
});

test('RtcJoyPeer переживает временный disconnected без разрыва и включает авто-лечение при реальном обрыве', async () => {
  const ch = new BroadcastChannel('ckc-test-heal');
  const sig = createBroadcastRtcSignaling(ch, '777888');
  const changes = [];
  const joy = new RtcJoyPeer(sig, 'joy-heal', {
    onOpenChange: (open) => changes.push(open),
  });

  // Имитируем открытый прямой канал со свежим pong
  joy.open = true;
  joy.lastPongAt = performance.now();
  joy.fast = { readyState: 'open', send() {}, close() {} };
  assert.equal(joy.isOpen(), true);

  // Имитируем кратковременную заминку Wi-Fi: статус 'disconnected' НЕ должен ронять isOpen()
  joy.statusNote = 'заминка Wi-Fi — удерживаем канал…';
  assert.equal(joy.isOpen(), true, 'временная радиопомеха Wi-Fi не должна обрывать открытый канал');

  // Если pong перестал приходить дольше 8.5 с — isOpen() мгновенно возвращает false для резерва Firebase
  joy.lastPongAt = performance.now() - 9000;
  assert.equal(joy.isOpen(), false, 'при долгом молчании P2P управление бесшовно уходит на резерв');

  // Как только радиоканал ожил и пришёл свежий pong — канал снова активен без пересборки!
  joy.lastPongAt = performance.now();
  assert.equal(joy.isOpen(), true, 'свежий pong мгновенно возвращает прямой канал 60 Гц');

  // Проверяем фиксацию режима «Только локальный Wi-Fi» (без VPN/STUN)
  joy.setPreferLanOnly(true);
  assert.equal(joy.preferLanOnly, true);

  joy.close();
  sig.dispose();
  ch.close();
  assert.equal(changes.includes(false), true);
});


