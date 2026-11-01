import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SHARED_PAIR_KEY,
  normalizePairCode,
  formatPairCode,
  loadSavedPairCode,
  savePairCode,
  clearSavedPairCode,
  ensureHostPairCode,
  rotateHostPairCode,
  packOfflineSignal,
  unpackOfflineSignal,
  parseScannedPayload,
  buildControllerQrUrl,
  renderQrMatrix,
  renderQrSvg,
  decodeQrFromRgba,
  encodeMqttConnect,
  encodeMqttSubscribe,
  encodeMqttPublish,
  encodeMqttPingReq,
  MqttStreamParser,
  createAutoPairSignaling,
  watchActiveGameForPair,
} from '../src/local-pair.js';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

function matrixToRgba(matrix, scale = 5, margin = 4) {
  const n = matrix.length;
  const size = (n + margin * 2) * scale;
  const rgba = new Uint8ClampedArray(size * size * 4);
  rgba.fill(255);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!matrix[y][x]) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = (x + margin) * scale + dx;
          const py = (y + margin) * scale + dy;
          const idx = (py * size + px) * 4;
          rgba[idx] = 0;
          rgba[idx + 1] = 0;
          rgba[idx + 2] = 0;
          rgba[idx + 3] = 255;
        }
      }
    }
  }
  return { rgba, width: size, height: size };
}

function sampleSdp({ ufrag, pwd, fp, setup = 'actpass', cands = [] }) {
  return [
    'v=0',
    'o=- 123456789 2 IN IP4 127.0.0.1',
    's=-',
    't=0 0',
    'a=group:BUNDLE 0',
    'm=application 9 UDP/DTLS/SCTP webrtc-datachannel',
    'c=IN IP4 0.0.0.0',
    `a=ice-ufrag:${ufrag}`,
    `a=ice-pwd:${pwd}`,
    `a=fingerprint:sha-256 ${fp}`,
    `a=setup:${setup}`,
    'a=mid:0',
    'a=sctp-port:5000',
    ...cands.map((c, i) => `a=candidate:${i + 1} 1 udp 2122260223 ${c.addr} ${c.port} typ host generation 0`),
    '',
  ].join('\r\n');
}

test('общая пара agi_pair_v1 сохраняется, форматируется и переиспользуется между играми', () => {
  const storage = createMemoryStorage();
  assert.equal(normalizePairCode(' 482 915 '), '482915');
  assert.equal(normalizePairCode('12345'), '');
  assert.equal(formatPairCode('482915'), '482 915');

  const code1 = ensureHostPairCode(storage);
  assert.match(code1, /^\d{6}$/);
  assert.equal(storage.getItem(SHARED_PAIR_KEY), code1);
  assert.equal(loadSavedPairCode(storage), code1);
  assert.equal(ensureHostPairCode(storage), code1);

  const code2 = rotateHostPairCode(storage);
  assert.match(code2, /^\d{6}$/);
  assert.notEqual(code2, code1);
  assert.equal(loadSavedPairCode(storage), code2);

  savePairCode('777 888', storage);
  assert.equal(loadSavedPairCode(storage), '777888');
  clearSavedPairCode(storage);
  assert.equal(loadSavedPairCode(storage), '');
});

test('компактный бинарный офлайн-кодек AG1.<base64url> сжимает WebRTC Offer и Answer до <160 символов без потерь', () => {
  const fp = 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99';
  const offerSdp = sampleSdp({
    ufrag: 'uF12',
    pwd: 'secretPasswordForIce24Ch',
    fp,
    setup: 'actpass',
    cands: [
      { addr: '192.168.43.1', port: 54321 },
      { addr: '10.0.0.14', port: 60123 },
      { addr: 'a1b2c3d4-e5f6-4789-abcd-0123456789ab.local', port: 51111 },
    ],
  });

  const offerToken = packOfflineSignal({
    type: 'offer',
    sdp: offerSdp,
    game: 'wn',
    handSide: 'left',
    pairCode: '482915',
    hid: 'h98765432',
  });

  assert.ok(offerToken.startsWith('AG1.'));
  assert.ok(offerToken.length < 160, `Expected compact token < 160 chars, got ${offerToken.length}`);

  const unpackedOffer = unpackOfflineSignal(offerToken);
  assert.equal(unpackedOffer.type, 'offer');
  assert.equal(unpackedOffer.game, 'wn');
  assert.equal(unpackedOffer.handSide, 'left');
  assert.equal(unpackedOffer.pairCode, '482915');
  assert.equal(unpackedOffer.hid, 'h98765432');
  assert.equal(unpackedOffer.ufrag, 'uF12');
  assert.equal(unpackedOffer.pwd, 'secretPasswordForIce24Ch');
  assert.equal(unpackedOffer.fingerprint, fp);
  assert.equal(unpackedOffer.setup, 'actpass');
  assert.deepEqual(
    unpackedOffer.candidates.map((c) => ({ addr: c.addr, port: c.port })),
    [
      { addr: '192.168.43.1', port: 54321 },
      { addr: '10.0.0.14', port: 60123 },
      { addr: 'a1b2c3d4-e5f6-4789-abcd-0123456789ab.local', port: 51111 },
    ],
  );
  assert.match(unpackedOffer.sdp, /a=fingerprint:sha-256 /);
  assert.match(unpackedOffer.sdp, /a=candidate:1 1 udp /);

  const ansSdp = sampleSdp({
    ufrag: 'aU99',
    pwd: 'answerIcePassword24Chars!',
    fp,
    setup: 'active',
    cands: [{ addr: '192.168.43.77', port: 49876 }],
  });
  const ansToken = packOfflineSignal({
    type: 'answer',
    sdp: ansSdp,
    game: 'wn',
    pairCode: '482915',
    hid: 'h98765432',
  });
  assert.ok(ansToken.length < 140);
  const unpackedAns = unpackOfflineSignal(ansToken);
  assert.equal(unpackedAns.type, 'answer');
  assert.equal(unpackedAns.setup, 'active');
  assert.equal(unpackedAns.candidates[0].addr, '192.168.43.77');
  assert.equal(unpackedAns.candidates[0].port, 49876);
});

test('генератор и пиксельный декодер QR безошибочно читают URL пары, офлайн-Offer и офлайн-Answer', () => {
  const fp = '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00';
  const offerSdp = sampleSdp({
    ufrag: 'abcd',
    pwd: '0123456789abcdef01234567',
    fp,
    cands: [{ addr: '192.168.43.1', port: 52222 }],
  });
  const offerToken = packOfflineSignal({
    type: 'offer',
    sdp: offerSdp,
    game: 'ckc',
    pairCode: '654321',
    hid: 'h12345678',
  });

  const qrUrl = buildControllerQrUrl({
    controllerUrl: 'https://example.test/games/candy-kingdom-coaster/joystick/index.html',
    pairCode: '654321',
    offlineToken: offerToken,
  });

  const svg = renderQrSvg(qrUrl);
  assert.match(svg, /fill="#ffffff"/, 'QR SVG обязан иметь белую подложку для тёмных тем');

  const matrix = renderQrMatrix(qrUrl, { ecc: 'low', border: 2 });
  assert.ok(matrix.length <= 65, `QR matrix stays compact (<=65 modules), got ${matrix.length}`);

  const img = matrixToRgba(matrix, 5, 4);
  const decoded = decodeQrFromRgba(img.rgba, img.width, img.height);
  assert.equal(decoded, qrUrl);

  const parsed = parseScannedPayload(decoded);
  assert.equal(parsed.kind, 'offline-offer');
  assert.equal(parsed.token, offerToken);
  assert.equal(parsed.game, 'ckc');
  assert.equal(parsed.payload.game, 'ckc');
  assert.equal(parsed.pairCode, '654321');

  const plainUrl = buildControllerQrUrl({
    controllerUrl: 'https://example.test/games/remote-hub/index.html',
    pairCode: '654321',
  });
  const parsedPair = parseScannedPayload(plainUrl);
  assert.equal(parsedPair.kind, 'pair-code');
  assert.equal(parsedPair.pairCode, '654321');
  assert.equal(parseScannedPayload('').kind, 'unknown');
});

test('MQTT v3.1.1 парсер корректно собирает фрагментированные пакеты и многобайтовые длины', () => {
  const connectPkt = encodeMqttConnect('agi-test-client');
  assert.equal(connectPkt[0], 0x10);
  const subPkt = encodeMqttSubscribe(7, 'agi-vr-v1/482915/#');
  assert.equal(subPkt[0], 0x82);
  const pingPkt = encodeMqttPingReq();
  assert.deepEqual([...pingPkt], [0xc0, 0x00]);

  const bigBody = JSON.stringify({ hello: 'world', pad: 'x'.repeat(300) });
  const pubPkt = encodeMqttPublish('agi-vr-v1/482915/presence', bigBody);

  const connAck = new Uint8Array([0x20, 0x02, 0x00, 0x00]);
  const subAck = new Uint8Array([0x90, 0x03, 0x00, 0x07, 0x00]);
  const pingResp = new Uint8Array([0xd0, 0x00]);

  const seen = [];
  const parser = new MqttStreamParser((pkt) => seen.push(pkt));
  parser.push(connAck);
  parser.push(subAck.subarray(0, 2));
  parser.push(subAck.subarray(2));
  parser.push(pubPkt.subarray(0, 5));
  parser.push(pubPkt.subarray(5, 190));
  parser.push(pubPkt.subarray(190));
  parser.push(pingResp);

  assert.equal(seen[0].type, 'connack');
  assert.equal(seen[1].type, 'suback');
  assert.equal(seen[2].type, 'publish');
  assert.equal(seen[2].topic, 'agi-vr-v1/482915/presence');
  assert.equal(seen[2].text, bigBody);
  assert.equal(seen[3].type, 'pingresp');
});

function mqttTopicMatches(filter, topic) {
  if (filter === topic) return true;
  if (filter.endsWith('/#')) {
    const prefix = filter.slice(0, -1); // включая '/'
    return topic.startsWith(prefix);
  }
  return false;
}

test('AutoPairSignaling и Universal Hub (whois -> here) находят активную игру через WSS MQTT без BroadcastChannel', async () => {
  const clients = new Set();
  const retained = new Map();

  class FakeMqttWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    constructor(url) {
      this.url = url;
      this.readyState = 0;
      this.binaryType = 'arraybuffer';
      this.subs = new Set();
      clients.add(this);
      queueMicrotask(() => {
        if (this.readyState !== 0) return;
        this.readyState = 1;
        this.onopen?.();
      });
    }
    send(raw) {
      const u8 = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
      // Разбираем управляющий пакет от клиента (CONNECT=1, PUBLISH=3, SUBSCRIBE=8, PINGREQ=12)
      let idx = 1;
      let remLen = 0;
      let mult = 1;
      while (idx < u8.length) {
        const b = u8[idx++];
        remLen += (b & 0x7f) * mult;
        if ((b & 0x80) === 0) break;
        mult *= 128;
      }
      const pktType = u8[0] >>> 4;
      const flags = u8[0] & 0x0f;
      const body = u8.subarray(idx, idx + remLen);

      if (pktType === 1) {
        const ack = new Uint8Array([0x20, 0x02, 0x00, 0x00]);
        queueMicrotask(() => this.onmessage?.({ data: ack.buffer }));
      } else if (pktType === 8) {
        const pktIdHi = body[0];
        const pktIdLo = body[1];
        const tLen = (body[2] << 8) | body[3];
        const filter = new TextDecoder().decode(body.subarray(4, 4 + tLen));
        this.subs.add(filter);
        const subAck = new Uint8Array([0x90, 0x03, pktIdHi, pktIdLo, 0x00]);
        queueMicrotask(() => {
          this.onmessage?.({ data: subAck.buffer });
          for (const [topic, text] of retained.entries()) {
            if (mqttTopicMatches(filter, topic)) {
              const out = encodeMqttPublish(topic, text, true);
              this.onmessage?.({ data: out.buffer });
            }
          }
        });
      } else if (pktType === 3) {
        const tLen = (body[0] << 8) | body[1];
        const topic = new TextDecoder().decode(body.subarray(2, 2 + tLen));
        const text = new TextDecoder().decode(body.subarray(2 + tLen));
        const isRetain = Boolean(flags & 1);
        if (isRetain) retained.set(topic, text);
        const out = encodeMqttPublish(topic, text, false);
        for (const peer of clients) {
          if (peer.readyState !== 1) continue;
          for (const f of peer.subs) {
            if (mqttTopicMatches(f, topic)) {
              queueMicrotask(() => peer.onmessage?.({ data: out.buffer }));
              break;
            }
          }
        }
      } else if (pktType === 12) {
        const resp = new Uint8Array([0xd0, 0x00]);
        queueMicrotask(() => this.onmessage?.({ data: resp.buffer }));
      }
    }
    close() {
      this.readyState = 3;
      clients.delete(this);
      this.onclose?.();
    }
  }

  const prevWS = globalThis.WebSocket;
  const prevBC = globalThis.BroadcastChannel;
  globalThis.WebSocket = FakeMqttWebSocket;
  globalThis.BroadcastChannel = undefined;

  let hostSig = null;
  let ctrlSig = null;
  let stopHub = null;
  try {
    hostSig = createAutoPairSignaling('901234', {
      game: 'wn',
      role: 'host',
      brokers: ['wss://mock-broker.local/mqtt'],
    });

    const detected = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout waiting for Universal Hub discovery')), 2000);
      stopHub = watchActiveGameForPair('901234', {
        brokers: ['wss://mock-broker.local/mqtt'],
        onDetected: (info) => {
          clearTimeout(timer);
          resolve(info);
        },
      });
    });
    stopHub();
    stopHub = null;

    assert.equal(detected.game, 'wn');

    ctrlSig = createAutoPairSignaling('901234', {
      game: 'wn',
      role: 'controller',
      brokers: ['wss://mock-broker.local/mqtt'],
    });

    await new Promise((r) => setTimeout(r, 25));

    const gotOffer = new Promise((resolve) => ctrlSig.onOffer(resolve));
    const gotAnswer = new Promise((resolve) => hostSig.onAnswer(resolve));

    await hostSig.writeOffer({ hid: 'h-test', sdp: 'v=0\r\n', iceMode: 'lan' });
    const rxOffer = await gotOffer;
    assert.equal(rxOffer.hid, 'h-test');

    await ctrlSig.writeAnswer({ hid: 'h-test', sdp: 'v=0-ans\r\n' });
    const rxAns = await gotAnswer;
    assert.equal(rxAns.sdp, 'v=0-ans\r\n');
  } finally {
    stopHub?.();
    ctrlSig?.dispose();
    hostSig?.dispose();
    globalThis.WebSocket = prevWS;
    globalThis.BroadcastChannel = prevBC;
  }
});
