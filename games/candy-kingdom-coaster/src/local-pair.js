// Локальное сопряжение пульта/браслета с экраном (раздающим Wi-Fi) без ввода API Firebase.
//
// Два взаимодополняющих режима в одном модуле:
//   1) «Моя пара» (Auto-Pair, общая для «Сладкой Гонки» и «Белой ночи» через localStorage `agi_pair_v1`):
//      при наличии мобильного интернета на точке доступа два телефона за ~0.5–1 с обмениваются
//      локальными координатами через встроенные бесплатные WSS MQTT 3.1.1 брокеры (без API и ключей)
//      + локальный BroadcastChannel (для двух вкладок), после чего открывают прямой локальный
//      канал WebRTC DataChannel 60 Гц (`iceServers: []`, 2–6 мс) напрямую по точке доступа Wi-Fi.
//   2) «Офлайн QR ↔ QR» (100% без интернета, авиарежим + точка доступа Wi-Fi):
//      сжатие WebRTC Offer/Answer в компактный бинарный токен `AG1.<base64url>` (~95 байт),
//      генерация контрастного векторного QR и сканирование камерой (`BarcodeDetector` + чистый JS-декодер).

import encodeQR from '../vendor/qr/index.js';
import decodeQR from '../vendor/qr/decode.js';

export const SHARED_PAIR_KEY = 'agi_pair_v1';
export const PAIR_BUS_CHANNEL = 'agi-pair-bus-v1';
export const OFFLINE_TOKEN_PREFIX = 'AG1.';

export const DEFAULT_WSS_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://test.mosquitto.org:8081/mqtt',
];

const TEXT_ENC = new TextEncoder();
const TEXT_DEC = new TextDecoder();

// ---------------------------------------------------------------------------
// 1. Общая память пары телефонов («Моя пара» для обеих игр)
// ---------------------------------------------------------------------------

export function normalizePairCode(raw) {
  if (raw === null || raw === undefined) return '';
  const digits = String(raw).replace(/\D/g, '');
  return digits.length === 6 ? digits : '';
}

export function formatPairCode(code) {
  const clean = normalizePairCode(code);
  if (!clean) return '——— ———';
  return `${clean.slice(0, 3)} ${clean.slice(3)}`;
}

export function generateRandomPairCode(exclude = '') {
  for (let i = 0; i < 16; i += 1) {
    const next = String(Math.floor(100000 + Math.random() * 900000));
    if (next !== exclude) return next;
  }
  return '482915';
}

export function loadSavedPairCode(storage = globalThis.localStorage) {
  try {
    if (!storage) return '';
    const raw = storage.getItem(SHARED_PAIR_KEY) || '';
    if (!raw) return '';
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      return normalizePairCode(parsed?.pairCode);
    }
    return normalizePairCode(raw);
  } catch {
    return '';
  }
}

export function savePairCode(code, storage = globalThis.localStorage) {
  const clean = normalizePairCode(code);
  if (!clean) return '';
  try {
    if (storage) {
      storage.setItem(SHARED_PAIR_KEY, clean);
    }
  } catch { /* ignore */ }
  return clean;
}

export function clearSavedPairCode(storage = globalThis.localStorage) {
  try {
    if (storage && typeof storage.removeItem === 'function') {
      storage.removeItem(SHARED_PAIR_KEY);
    } else if (storage) {
      storage.setItem(SHARED_PAIR_KEY, '');
    }
  } catch { /* ignore */ }
}

export function ensureHostPairCode(storage = globalThis.localStorage) {
  const existing = loadSavedPairCode(storage);
  if (existing) return existing;
  return savePairCode(generateRandomPairCode(), storage);
}

export function rotateHostPairCode(storage = globalThis.localStorage) {
  const prev = loadSavedPairCode(storage);
  return savePairCode(generateRandomPairCode(prev), storage);
}

// ---------------------------------------------------------------------------
// 2. Компактный бинарный кодек WebRTC SDP (`AG1.<base64url>`) для Офлайн QR ↔ QR
// ---------------------------------------------------------------------------

function toBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa === 'function'
    ? btoa(bin)
    : Buffer.from(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  if (typeof atob === 'function') {
    const bin = atob(padded);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(padded, 'base64'));
}

function parseIpv4Bytes(addr) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(addr);
  if (!m) return null;
  const nums = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (nums.some((n) => n < 0 || n > 255)) return null;
  return new Uint8Array(nums);
}

function parseLocalUuidBytes(addr) {
  const m = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\.local$/i.exec(addr);
  if (!m) return null;
  const hex = m[1] + m[2] + m[3] + m[4] + m[5];
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function formatUuidLocal(bytes16) {
  const h = Array.from(bytes16, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}.local`;
}

function candidateRank(c) {
  const a = c.addr.toLowerCase();
  if (c.typ === 'host') {
    if (/^(192\.168\.|172\.(1[6-9]|2\d|3[01])\.|10\.|169\.254\.)/.test(a)) return 0;
    if (parseIpv4Bytes(a) && a !== '127.0.0.1') return 1;
    if (a.endsWith('.local')) return 2;
    if (a !== '::1' && a !== '127.0.0.1') return 3;
    return 4;
  }
  return 5;
}

export function extractSdpCandidates(sdp = '', extraCandidates = []) {
  const rawLines = [];
  for (const line of String(sdp).split(/\r?\n/)) {
    if (line.startsWith('a=candidate:')) rawLines.push(line.slice(2).trim());
  }
  for (const item of extraCandidates) {
    if (!item) continue;
    const str = typeof item === 'string' ? item : (item.candidate || '');
    if (str) rawLines.push(str.replace(/^a=/, '').trim());
  }

  const seen = new Set();
  const parsed = [];
  for (const line of rawLines) {
    // candidate:<foundation> <comp> <proto> <prio> <addr> <port> typ <type> ...
    const parts = line.replace(/^candidate:/i, '').trim().split(/\s+/);
    if (parts.length < 8) continue;
    const comp = Number(parts[1]);
    const proto = parts[2].toLowerCase();
    const addr = parts[4];
    const port = Number(parts[5]);
    const typIdx = parts.findIndex((p) => p.toLowerCase() === 'typ');
    const typ = typIdx >= 0 && parts[typIdx + 1] ? parts[typIdx + 1].toLowerCase() : '';
    if (comp !== 1 || proto !== 'udp') continue;
    if (typ !== 'host' && typ !== 'srflx' && typ !== 'prflx') continue;
    if (!addr || !Number.isInteger(port) || port <= 0 || port > 65535) continue;
    const key = `${addr.toLowerCase()}:${port}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parsed.push({ addr, port, typ: typ === 'srflx' ? 'srflx' : 'host' });
  }

  parsed.sort((a, b) => candidateRank(a) - candidateRank(b));
  // Если есть реальные сетевые/mDNS адреса, убираем loopback, чтобы экономить размер QR
  const nonLoopback = parsed.filter((c) => c.addr !== '127.0.0.1' && c.addr !== '::1');
  return (nonLoopback.length > 0 ? nonLoopback : parsed).slice(0, 6);
}

export function packOfflineSignal({
  type = 'offer',
  sdp = '',
  candidates = [],
  game = 'ckc',
  handSide = 'right',
  pairCode = '',
  hid = '',
} = {}) {
  if (!sdp || typeof sdp !== 'string') throw new Error('Пустой SDP для упаковки');
  const lines = sdp.split(/\r?\n/);
  let ufrag = '';
  let pwd = '';
  let fpAlgo = '';
  let fpHex = '';
  let mid = '0';
  let sctpPort = 5000;

  for (const line of lines) {
    if (!ufrag && line.startsWith('a=ice-ufrag:')) ufrag = line.slice(12).trim();
    else if (!pwd && line.startsWith('a=ice-pwd:')) pwd = line.slice(10).trim();
    else if (!fpHex && /^a=fingerprint:/i.test(line)) {
      const m = /^a=fingerprint:(\S+)\s+(\S+)/i.exec(line.trim());
      if (m) {
        fpAlgo = m[1].toLowerCase();
        fpHex = m[2];
      }
    } else if (line.startsWith('a=mid:')) {
      mid = line.slice(6).trim() || '0';
    } else if (line.startsWith('a=sctp-port:')) {
      const p = Number(line.slice(12).trim());
      if (Number.isInteger(p) && p > 0 && p <= 65535) sctpPort = p;
    }
  }
  if (!ufrag || !pwd || !fpHex) {
    throw new Error('В SDP отсутствуют обязательные поля ufrag/pwd/fingerprint');
  }

  const isAnswer = type === 'answer';
  const gameId = game === 'white-night' || game === 'wn' ? 1 : (game === 'ckc' ? 0 : 2);
  const handLeft = handSide === 'left' ? 1 : 0;
  const cleanPair = normalizePairCode(pairCode);
  const hasPair = cleanPair.length === 6;

  const cleanHex = fpHex.replace(/:/g, '');
  const sha256Raw = fpAlgo === 'sha-256' && /^[0-9a-fA-F]{64}$/.test(cleanHex);

  const flags =
    1 | // version = 1 (bits 0..1)
    (isAnswer ? 4 : 0) |
    ((gameId & 3) << 3) |
    (handLeft ? 32 : 0) |
    (hasPair ? 64 : 0) |
    (sha256Raw ? 128 : 0);

  const chunks = [];
  const pushByte = (b) => chunks.push(b & 0xff);
  const pushU16 = (n) => { pushByte(n >>> 8); pushByte(n); };
  const pushBytes = (arr) => { for (let i = 0; i < arr.length; i += 1) chunks.push(arr[i]); };
  const pushShortStr = (s) => {
    const b = TEXT_ENC.encode(String(s));
    if (b.length > 255) throw new Error('Слишком длинное строковое поле SDP');
    pushByte(b.length);
    pushBytes(b);
  };

  pushByte(flags);

  if (hasPair) {
    const n = Number(cleanPair);
    pushByte((n >>> 16) & 0xff);
    pushByte((n >>> 8) & 0xff);
    pushByte(n & 0xff);
  }

  // 4-байтовый идентификатор рукопожатия hid
  const hidHex = String(hid || '').replace(/[^0-9a-fA-F]/g, '').padEnd(8, '7').slice(0, 8);
  for (let i = 0; i < 4; i += 1) {
    pushByte(parseInt(hidHex.slice(i * 2, i * 2 + 2), 16) || 0x42);
  }

  pushShortStr(ufrag);
  pushShortStr(pwd);

  if (sha256Raw) {
    for (let i = 0; i < 32; i += 1) {
      pushByte(parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16));
    }
  } else {
    pushShortStr(`${fpAlgo} ${fpHex}`);
  }

  pushU16(sctpPort);
  pushShortStr(mid);

  const cands = extractSdpCandidates(sdp, candidates);
  pushByte(cands.length);
  for (const c of cands) {
    const v4 = parseIpv4Bytes(c.addr);
    const uuid = !v4 ? parseLocalUuidBytes(c.addr) : null;
    if (v4 && c.typ === 'host') {
      pushByte(0x01);
      pushBytes(v4);
      pushU16(c.port);
    } else if (v4 && c.typ === 'srflx') {
      pushByte(0x04);
      pushBytes(v4);
      pushU16(c.port);
    } else if (uuid && c.typ === 'host') {
      pushByte(0x02);
      pushBytes(uuid);
      pushU16(c.port);
    } else {
      pushByte(c.typ === 'srflx' ? 0x13 : 0x03);
      pushShortStr(c.addr);
      pushU16(c.port);
    }
  }

  return OFFLINE_TOKEN_PREFIX + toBase64Url(new Uint8Array(chunks));
}

export function unpackOfflineSignal(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') throw new Error('Пустой код сигнала');
  let clean = rawToken.trim();
  const idx = clean.indexOf(OFFLINE_TOKEN_PREFIX);
  if (idx >= 0) {
    clean = clean.slice(idx).split(/[\s&#?"']/)[0];
  }
  if (!clean.startsWith(OFFLINE_TOKEN_PREFIX)) {
    throw new Error('Код не распознан (ожидался токен AG1.)');
  }

  const bytes = fromBase64Url(clean.slice(OFFLINE_TOKEN_PREFIX.length));
  let pos = 0;
  const readByte = () => {
    if (pos >= bytes.length) throw new Error('Повреждённый офлайн-код (обрыв данных)');
    return bytes[pos++];
  };
  const readU16 = () => (readByte() << 8) | readByte();
  const readSlice = (n) => {
    if (pos + n > bytes.length) throw new Error('Повреждённый офлайн-код (длина поля)');
    const sub = bytes.subarray(pos, pos + n);
    pos += n;
    return sub;
  };
  const readShortStr = () => TEXT_DEC.decode(readSlice(readByte()));

  const flags = readByte();
  const version = flags & 3;
  if (version !== 1) throw new Error(`Неподдерживаемая версия кода (${version})`);

  const isAnswer = Boolean(flags & 4);
  const gameId = (flags >>> 3) & 3;
  const handSide = (flags & 32) ? 'left' : 'right';
  const hasPair = Boolean(flags & 64);
  const sha256Raw = Boolean(flags & 128);

  let pairCode = '';
  if (hasPair) {
    const n = (readByte() << 16) | (readByte() << 8) | readByte();
    if (n >= 100000 && n <= 999999) pairCode = String(n);
  }

  const hidBytes = readSlice(4);
  const hid = 'h' + Array.from(hidBytes, (b) => b.toString(16).padStart(2, '0')).join('');

  const ufrag = readShortStr();
  const pwd = readShortStr();

  let fingerprintLine = '';
  if (sha256Raw) {
    const fp = readSlice(32);
    const hex = Array.from(fp, (b) => b.toString(16).toUpperCase().padStart(2, '0')).join(':');
    fingerprintLine = `sha-256 ${hex}`;
  } else {
    fingerprintLine = readShortStr();
  }

  const sctpPort = readU16() || 5000;
  const mid = readShortStr() || '0';
  const candCount = readByte();
  const candidates = [];

  for (let i = 0; i < candCount; i += 1) {
    const kind = readByte();
    let addr = '';
    let typ = 'host';
    if (kind === 0x01 || kind === 0x04) {
      const v4 = readSlice(4);
      addr = `${v4[0]}.${v4[1]}.${v4[2]}.${v4[3]}`;
      typ = kind === 0x04 ? 'srflx' : 'host';
    } else if (kind === 0x02) {
      addr = formatUuidLocal(readSlice(16));
      typ = 'host';
    } else {
      addr = readShortStr();
      typ = kind === 0x13 ? 'srflx' : 'host';
    }
    const port = readU16();
    const prio = 2122260223 - i * 256;
    const candStr = `candidate:${i + 1} 1 udp ${prio} ${addr} ${port} typ ${typ} generation 0`;
    candidates.push({ addr, port, typ, candidate: candStr });
  }

  const sessId = `${Math.floor(100000000 + Math.random() * 899999999)}24680`;
  const setup = isAnswer ? 'active' : 'actpass';
  const sdpLines = [
    'v=0',
    `o=- ${sessId} 2 IN IP4 127.0.0.1`,
    's=-',
    't=0 0',
    `a=group:BUNDLE ${mid}`,
    'a=msid-semantic: WMS',
    'm=application 9 UDP/DTLS/SCTP webrtc-datachannel',
    'c=IN IP4 0.0.0.0',
    `a=ice-ufrag:${ufrag}`,
    `a=ice-pwd:${pwd}`,
    'a=ice-options:trickle',
    `a=fingerprint:${fingerprintLine}`,
    `a=setup:${setup}`,
    `a=mid:${mid}`,
    `a=sctp-port:${sctpPort}`,
    'a=max-message-size:262144',
    ...candidates.map((c) => `a=${c.candidate}`),
    '',
  ];

  const game = gameId === 1 ? 'wn' : (gameId === 0 ? 'ckc' : 'generic');
  return {
    type: isAnswer ? 'answer' : 'offer',
    role: isAnswer ? 'answer' : 'offer',
    setup,
    ufrag,
    pwd,
    fingerprint: fingerprintLine.replace(/^sha-256\s+/i, ''),
    sdp: sdpLines.join('\r\n'),
    game,
    handSide,
    pairCode,
    hid,
    candidates,
    token: clean,
  };
}

/**
 * Разбирает любой отсканированный QR или вставленный пользователем текст:
 *   - офлайн-токен (или ссылка с `#off=AG1....` / `?off=AG1....`)
 *   - онлайн-ссылка с `?pair=482915` (и `hand=left|right`, и путём игры)
 *   - просто 6 цифр кода пары
 */
export function parseScannedPayload(rawText) {
  if (!rawText || typeof rawText !== 'string') return { kind: 'unknown' };
  const trimmed = rawText.trim();
  if (!trimmed) return { kind: 'unknown' };

  // 1. Содержит ли компактный офлайн-токен AG1.?
  const agIdx = trimmed.indexOf(OFFLINE_TOKEN_PREFIX);
  if (agIdx >= 0) {
    try {
      const unpacked = unpackOfflineSignal(trimmed.slice(agIdx));
      return {
        kind: unpacked.type === 'answer' ? 'offline-answer' : 'offline-offer',
        ...unpacked,
        payload: unpacked,
        rawUrl: trimmed.startsWith('http') ? trimmed : '',
      };
    } catch (err) {
      return { kind: 'error', error: err?.message || String(err) };
    }
  }

  // 2. Ссылка на страницу пульта/браслета с ?pair=... или ?room=... или ?code=...
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes('pair=') || trimmed.includes('room=') || trimmed.includes('code=')) {
    try {
      const u = new URL(trimmed, 'https://example.invalid');
      const hashParams = new URLSearchParams(u.hash.replace(/^#/, ''));
      const offInHash = hashParams.get('off') || u.searchParams.get('off');
      if (offInHash && offInHash.includes(OFFLINE_TOKEN_PREFIX)) {
        const unpacked = unpackOfflineSignal(offInHash);
        return {
          kind: unpacked.type === 'answer' ? 'offline-answer' : 'offline-offer',
          ...unpacked,
          payload: unpacked,
          rawUrl: trimmed.startsWith('http') ? trimmed : '',
        };
      }
      const pairCode = normalizePairCode(
        u.searchParams.get('pair') || u.searchParams.get('room') || u.searchParams.get('code')
      );
      const handParam = u.searchParams.get('hand');
      const handSide = handParam === 'left' ? 'left' : 'right';
      const pathLower = u.pathname.toLowerCase();
      const game = pathLower.includes('white-night') || pathLower.includes('/wrist')
        ? 'wn'
        : (pathLower.includes('candy-kingdom') || pathLower.includes('/joystick') ? 'ckc' : '');
      if (pairCode) {
        return { kind: 'pair-code', isUrl: true, pairCode, game, handSide, rawUrl: trimmed };
      }
    } catch { /* продолжаем */ }
  }

  // 3. Просто 6-значный код пары
  const codeOnly = normalizePairCode(trimmed);
  if (codeOnly) {
    return { kind: 'pair-code', isUrl: false, pairCode: codeOnly };
  }
  return { kind: 'unknown' };
}

export function buildControllerQrUrl({
  controllerUrl,
  pairCode = '',
  handSide = '',
  offlineToken = '',
  extraParams = null,
} = {}) {
  const base = typeof window !== 'undefined' && window.location
    ? new URL(controllerUrl, window.location.href)
    : new URL(controllerUrl, 'https://localhost/');
  const cleanPair = normalizePairCode(pairCode);
  if (cleanPair) base.searchParams.set('pair', cleanPair);
  if (handSide === 'left' || handSide === 'right') base.searchParams.set('hand', handSide);
  if (extraParams && typeof extraParams === 'object') {
    for (const [k, v] of Object.entries(extraParams)) {
      if (v !== undefined && v !== null && v !== '') base.searchParams.set(k, String(v));
    }
  }
  if (offlineToken) {
    base.hash = `off=${offlineToken}`;
  }
  return base.toString();
}

// ---------------------------------------------------------------------------
// 3. Сборка локального WebRTC соединения без сервера (Офлайн Wi-Fi 60 Гц)
// ---------------------------------------------------------------------------

function waitLocalIceGathering(pc, gatheredList, timeoutMs = 1100) {
  return new Promise((resolve) => {
    let settled = false;
    let quickTimer = null;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(maxTimer);
      clearTimeout(quickTimer);
      resolve();
    };
    const maxTimer = setTimeout(finish, timeoutMs);

    const checkQuick = () => {
      if (pc.iceGatheringState === 'complete') {
        finish();
        return;
      }
      if (gatheredList.length > 0 && !quickTimer) {
        // Как только найден первый локальный кандидат точки доступа, ждём максимум 240 мс остальных
        quickTimer = setTimeout(finish, 240);
      }
    };

    pc.addEventListener('icegatheringstatechange', checkQuick);
    pc.addEventListener('icecandidate', (ev) => {
      if (!ev.candidate) finish();
      else checkQuick();
    });
    checkQuick();
  });
}

export async function createOfflineHostOffer({
  fastLabel = 'fast',
  ctrlLabel = 'ctrl',
  game = 'ckc',
  handSide = 'right',
  pairCode = '',
  timeoutMs = 1100,
} = {}) {
  if (typeof RTCPeerConnection === 'undefined') {
    throw new Error('Браузер не поддерживает WebRTC (RTCPeerConnection)');
  }
  const hidBytes = new Uint8Array(4);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(hidBytes);
  else for (let i = 0; i < 4; i += 1) hidBytes[i] = Math.floor(Math.random() * 256);
  const hid = 'h' + Array.from(hidBytes, (b) => b.toString(16).padStart(2, '0')).join('');

  const pc = new RTCPeerConnection({ iceServers: [] });
  const fast = pc.createDataChannel(fastLabel, { ordered: false, maxRetransmits: 0 });
  const ctrl = pc.createDataChannel(ctrlLabel, { ordered: true });
  const gathered = [];

  pc.addEventListener('icecandidate', (ev) => {
    if (ev.candidate?.candidate) gathered.push(ev.candidate.candidate);
  });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitLocalIceGathering(pc, gathered, timeoutMs);

  const sdp = pc.localDescription?.sdp || offer.sdp;
  const token = packOfflineSignal({
    type: 'offer',
    sdp,
    candidates: gathered,
    game,
    handSide,
    pairCode,
    hid,
  });

  return {
    pc,
    fast,
    ctrl,
    hid,
    token,
    candidatesCount: extractSdpCandidates(sdp, gathered).length,
    async applyAnswer(answerInput) {
      const parsed = typeof answerInput === 'string'
        ? unpackOfflineSignal(answerInput)
        : answerInput;
      if (!parsed || parsed.type !== 'answer') {
        throw new Error('Это не ответный QR джойстика (нужен QR шага 2 с экрана пульта)');
      }
      if (pc.signalingState !== 'have-local-offer') return parsed;
      await pc.setRemoteDescription({ type: 'answer', sdp: parsed.sdp });
      for (const c of parsed.candidates || []) {
        await pc.addIceCandidate({ candidate: c.candidate, sdpMid: '0', sdpMLineIndex: 0 }).catch(() => {});
      }
      return parsed;
    },
  };
}

export async function acceptOfflineOfferAndCreateAnswer(offerInput, {
  fastLabel = 'fast',
  ctrlLabel = 'ctrl',
  timeoutMs = 1100,
  onChannel,
} = {}) {
  if (typeof RTCPeerConnection === 'undefined') {
    throw new Error('Браузер не поддерживает WebRTC (RTCPeerConnection)');
  }
  const offerMeta = typeof offerInput === 'string'
    ? unpackOfflineSignal(offerInput)
    : offerInput;
  if (!offerMeta || offerMeta.type !== 'offer') {
    throw new Error('Отсканированный код не содержит приглашение экрана');
  }

  const pc = new RTCPeerConnection({ iceServers: [] });
  const gathered = [];
  const fastCbs = [];
  const ctrlCbs = [];
  let earlyFast = null;
  let earlyCtrl = null;

  pc.addEventListener('icecandidate', (ev) => {
    if (ev.candidate?.candidate) gathered.push(ev.candidate.candidate);
  });
  pc.addEventListener('datachannel', (ev) => {
    const ch = ev.channel;
    if (onChannel) onChannel(ch);
    if (ch.label === fastLabel) {
      earlyFast = ch;
      for (const cb of fastCbs) cb(ch);
    } else if (ch.label === ctrlLabel) {
      earlyCtrl = ch;
      for (const cb of ctrlCbs) cb(ch);
    }
  });

  await pc.setRemoteDescription({ type: 'offer', sdp: offerMeta.sdp });
  for (const c of offerMeta.candidates || []) {
    await pc.addIceCandidate({ candidate: c.candidate, sdpMid: '0', sdpMLineIndex: 0 }).catch(() => {});
  }

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await waitLocalIceGathering(pc, gathered, timeoutMs);

  const sdp = pc.localDescription?.sdp || answer.sdp;
  const answerToken = packOfflineSignal({
    type: 'answer',
    sdp,
    candidates: gathered,
    game: offerMeta.game,
    handSide: offerMeta.handSide,
    pairCode: offerMeta.pairCode,
    hid: offerMeta.hid,
  });

  return {
    pc,
    offerMeta,
    token: answerToken,
    answerToken,
    pairCode: offerMeta.pairCode,
    hid: offerMeta.hid,
    game: offerMeta.game,
    candidatesCount: extractSdpCandidates(sdp, gathered).length,
    onFastChannel(cb) {
      fastCbs.push(cb);
      if (earlyFast) cb(earlyFast);
    },
    onCtrlChannel(cb) {
      ctrlCbs.push(cb);
      if (earlyCtrl) cb(earlyCtrl);
    },
  };
}

// ---------------------------------------------------------------------------
// 4. Генерация контрастного векторного QR и сканер камеры (Android + iOS)
// ---------------------------------------------------------------------------

export function renderQrMatrix(text, { border = 2, ecc = 'low' } = {}) {
  return encodeQR(String(text), 'raw', { ecc, border });
}

export function renderQrSvg(text, { border = 2, ecc = 'low' } = {}) {
  const mat = renderQrMatrix(text, { border, ecc });
  const n = mat.length;
  let d = '';
  for (let y = 0; y < n; y += 1) {
    const row = mat[y];
    let x = 0;
    while (x < n) {
      if (!row[x]) { x += 1; continue; }
      let run = 1;
      while (x + run < n && row[x + run]) run += 1;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" style="stroke:none" role="img" aria-label="QR-код подключения"><rect width="${n}" height="${n}" fill="#ffffff" stroke="none"/><path d="${d}" fill="#000000" stroke="none"/></svg>`;
}

export function decodeQrFromRgba(rgba, width, height) {
  if (!rgba || !width || !height) return null;
  try {
    const out = decodeQR({ width, height, data: rgba });
    return typeof out === 'string' && out.trim() ? out.trim() : null;
  } catch {
    return null;
  }
}

export class QrCameraScanner {
  constructor({ videoEl = null, facingMode = 'environment', onResult, onDetect, onError, intervalMs = 135 } = {}) {
    this.onDetect = onResult || onDetect || (() => {});
    this.onError = onError || null;
    this.intervalMs = intervalMs;
    this.facingMode = facingMode === 'user' ? 'user' : 'environment';
    this.stream = null;
    this.video = videoEl;
    this.timer = null;
    this.busy = false;
    this.running = false;
    this.canvas = null;
    this.ctx = null;
    this.nativeDetector = null;
    if (typeof BarcodeDetector !== 'undefined') {
      try {
        this.nativeDetector = new BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        this.nativeDetector = null;
      }
    }
  }

  async start(videoEl = this.video, facingMode = this.facingMode) {
    this.stop();
    this.facingMode = facingMode === 'user' ? 'user' : 'environment';
    this.video = videoEl;
    if (!navigator?.mediaDevices?.getUserMedia) {
      const msg = 'Камера недоступна в этом браузере (нужен HTTPS или вставьте код текстом)';
      if (this.onError) {
        this.onError(msg);
        return false;
      }
      throw new Error(msg);
    }

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: this.facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
    } catch {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (err) {
        const msg = err?.message || 'Разрешите доступ к камере для сканирования QR';
        if (this.onError) {
          this.onError(msg);
          return false;
        }
        throw new Error(msg);
      }
    }

    this.stream = stream;
    this.running = true;
    if (this.video) {
      this.video.srcObject = stream;
      this.video.setAttribute('playsinline', '');
      this.video.muted = true;
      try { await this.video.play(); } catch { /* ignore */ }
    }

    this.timer = setInterval(() => {
      this._scanTick().catch(() => {});
    }, this.intervalMs);
    return true;
  }

  async flipCamera() {
    if (!this.video) return false;
    const next = this.facingMode === 'environment' ? 'user' : 'environment';
    return this.start(this.video, next);
  }

  async _scanTick() {
    if (!this.running || this.busy || !this.video) return;
    if (this.video.readyState < 2 || !this.video.videoWidth || !this.video.videoHeight) return;
    this.busy = true;
    try {
      // 1. Аппаратный сканер Android Chrome / macOS, если есть
      if (this.nativeDetector) {
        try {
          const hits = await this.nativeDetector.detect(this.video);
          if (hits && hits.length > 0 && hits[0]?.rawValue) {
            this.onDetect(hits[0].rawValue.trim());
            return;
          }
        } catch { /* переходим на встроенный JS-декодер */ }
      }

      // 2. Встроенный чистый JS-декодер (работает на iOS Safari, Firefox и в любом офлайне)
      if (!this.canvas && typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
      }
      if (!this.ctx) return;

      const vw = this.video.videoWidth;
      const vh = this.video.videoHeight;
      const scale = Math.min(1, 360 / Math.max(vw, vh));
      const cw = Math.max(64, Math.round(vw * scale));
      const ch = Math.max(64, Math.round(vh * scale));
      if (this.canvas.width !== cw || this.canvas.height !== ch) {
        this.canvas.width = cw;
        this.canvas.height = ch;
      }
      this.ctx.drawImage(this.video, 0, 0, cw, ch);
      const img = this.ctx.getImageData(0, 0, cw, ch);
      const decoded = decodeQrFromRgba(img.data, cw, ch);
      if (decoded) {
        this.onDetect(decoded);
      }
    } finally {
      this.busy = false;
    }
  }

  scanRgba(rgba, width, height) {
    const decoded = decodeQrFromRgba(rgba, width, height);
    if (decoded) this.onDetect(decoded);
    return decoded;
  }

  stop() {
    this.running = false;
    this.busy = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.stream) {
      for (const t of this.stream.getTracks()) {
        try { t.stop(); } catch { /* ignore */ }
      }
      this.stream = null;
    }
    if (this.video) {
      try { this.video.srcObject = null; } catch { /* ignore */ }
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Мини-клиент MQTT v3.1.1 поверх WebSocket + BroadcastChannel без API-ключей
// ---------------------------------------------------------------------------

function encodeVarint(len) {
  const out = [];
  let x = len >>> 0;
  do {
    let b = x & 0x7f;
    x >>>= 7;
    if (x > 0) b |= 0x80;
    out.push(b);
  } while (x > 0);
  return out;
}

function encodeUtf8Field(str) {
  const b = TEXT_ENC.encode(str);
  const out = new Uint8Array(2 + b.length);
  out[0] = (b.length >>> 8) & 0xff;
  out[1] = b.length & 0xff;
  out.set(b, 2);
  return out;
}

function buildMqttPacket(headerByte, bodyParts) {
  let total = 0;
  for (const p of bodyParts) total += p.length;
  const rem = encodeVarint(total);
  const pkt = new Uint8Array(1 + rem.length + total);
  pkt[0] = headerByte;
  pkt.set(rem, 1);
  let off = 1 + rem.length;
  for (const p of bodyParts) {
    pkt.set(p, off);
    off += p.length;
  }
  return pkt;
}

export function encodeMqttConnect(clientId, keepAliveSec = 30) {
  const vh = new Uint8Array([
    0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, // "MQTT"
    0x04,                               // Protocol Level 4 (v3.1.1)
    0x02,                               // Clean Session
    (keepAliveSec >>> 8) & 0xff,
    keepAliveSec & 0xff,
  ]);
  return buildMqttPacket(0x10, [vh, encodeUtf8Field(clientId)]);
}

export function encodeMqttSubscribe(packetId, topicFilter) {
  const pid = new Uint8Array([(packetId >>> 8) & 0xff, packetId & 0xff]);
  const qos = new Uint8Array([0x00]);
  return buildMqttPacket(0x82, [pid, encodeUtf8Field(topicFilter), qos]);
}

export function encodeMqttPublish(topic, payloadText, retain = false) {
  const t = encodeUtf8Field(topic);
  const p = TEXT_ENC.encode(payloadText);
  return buildMqttPacket(0x30 | (retain ? 0x01 : 0), [t, p]);
}

export function encodeMqttPingReq() {
  return new Uint8Array([0xc0, 0x00]);
}

export class MqttStreamParser {
  constructor(onPacket) {
    this.onPacket = onPacket;
    this.buf = new Uint8Array(0);
  }

  push(chunk) {
    const incoming = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
    if (!incoming.length) return;
    const merged = new Uint8Array(this.buf.length + incoming.length);
    merged.set(this.buf, 0);
    merged.set(incoming, this.buf.length);
    this.buf = merged;

    while (this.buf.length >= 2) {
      let mult = 1;
      let remLen = 0;
      let idx = 1;
      let completeVarint = false;
      while (idx < this.buf.length && idx <= 4) {
        const b = this.buf[idx++];
        remLen += (b & 0x7f) * mult;
        if ((b & 0x80) === 0) {
          completeVarint = true;
          break;
        }
        mult *= 128;
      }
      if (!completeVarint) {
        if (idx > 4) { this.buf = new Uint8Array(0); }
        return;
      }
      const frameEnd = idx + remLen;
      if (this.buf.length < frameEnd) return;

      const byte0 = this.buf[0];
      const body = this.buf.slice(idx, frameEnd);
      this.buf = this.buf.slice(frameEnd);
      const pktType = byte0 >>> 4;
      const flags = byte0 & 0x0f;

      if (pktType === 3 && body.length >= 2) {
        const tLen = (body[0] << 8) | body[1];
        if (2 + tLen <= body.length) {
          const topic = TEXT_DEC.decode(body.subarray(2, 2 + tLen));
          const qos = (flags >>> 1) & 0x03;
          const payloadOffset = 2 + tLen + (qos > 0 ? 2 : 0);
          if (payloadOffset <= body.length) {
            const text = TEXT_DEC.decode(body.subarray(payloadOffset));
            this.onPacket({ type: 'publish', topic, text, retain: Boolean(flags & 1) });
          }
        }
      } else if (pktType === 2) {
        this.onPacket({ type: 'connack', rc: body[1] ?? 0 });
      } else if (pktType === 9) {
        this.onPacket({ type: 'suback' });
      } else if (pktType === 13) {
        this.onPacket({ type: 'pingresp' });
      }
    }
  }
}

function getBrokerUrls(customBrokers) {
  if (Array.isArray(customBrokers)) return customBrokers;
  if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.__AGI_WSS_BROKERS__)) {
    return globalThis.__AGI_WSS_BROKERS__;
  }
  return DEFAULT_WSS_BROKERS;
}

/**
 * Шина авто-пары: одновременно слушает локальный BroadcastChannel (0 мс в одном браузере)
 * и пул открытых MQTT-over-WSS брокеров (для двух телефонов при наличии интернета на раздаче).
 */
export class AutoPairBus {
  constructor(pairCode, { brokers, wsUrls, onBrokerChange } = {}) {
    this.pairCode = normalizePairCode(pairCode) || '482915';
    this.senderId = 'p' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
    this.brokerUrls = getBrokerUrls(brokers || wsUrls);
    this.onBrokerChange = onBrokerChange || (() => {});
    this.topicPrefix = `agi-vr-v1/${this.pairCode}`;
    this.handlers = new Set();
    this.seenMids = [];
    this.seenSet = new Set();
    this.conns = [];
    this.pendingPublishes = [];
    this.bc = null;
    this.closed = false;
    this._pktId = 1;
    this._reconnectTimer = null;
  }

  start() {
    if (this.closed) return;
    if (typeof BroadcastChannel !== 'undefined' && !this.bc) {
      try {
        this.bc = new BroadcastChannel(PAIR_BUS_CHANNEL);
        this.bc.onmessage = (ev) => {
          const env = ev?.data;
          if (!env || env.pairCode !== this.pairCode) return;
          this._deliver(env);
        };
      } catch { /* ignore */ }
    }
    this._connectBrokers();
    this._reconnectTimer = setInterval(() => {
      if (this.closed) return;
      if (typeof document !== 'undefined' && document.hidden) return;
      if (this.connectedCount() === 0 && this.brokerUrls.length > 0) {
        this._connectBrokers();
      }
    }, 6000);
  }

  connectedCount() {
    return this.conns.filter((c) => c.ready).length;
  }

  _connectBrokers() {
    if (typeof WebSocket === 'undefined' || !this.brokerUrls.length) return;
    // Закрываем мёртвые сокеты перед переподключением
    this.conns = this.conns.filter((c) => {
      if (c.ws && (c.ws.readyState === WebSocket.OPEN || c.ws.readyState === WebSocket.CONNECTING)) {
        return true;
      }
      try { clearInterval(c.pingTimer); c.ws?.close(); } catch { /* ignore */ }
      return false;
    });
    const activeUrls = new Set(this.conns.map((c) => c.url));

    for (const url of this.brokerUrls) {
      if (!url || activeUrls.has(url)) continue;
      let ws;
      try {
        ws = new WebSocket(url, 'mqtt');
        ws.binaryType = 'arraybuffer';
      } catch {
        continue;
      }
      const conn = { url, ws, ready: false, pingTimer: null };
      const parser = new MqttStreamParser((pkt) => {
        if (this.closed) return;
        if (pkt.type === 'connack' && pkt.rc === 0) {
          conn.ready = true;
          try {
            ws.send(encodeMqttSubscribe(this._pktId++, `${this.topicPrefix}/#`));
            for (const item of this.pendingPublishes) {
              ws.send(encodeMqttPublish(item.topic, item.raw, item.retain));
            }
          } catch { /* ignore */ }
          this.onBrokerChange(this.connectedCount());
        } else if (pkt.type === 'publish') {
          try {
            const env = JSON.parse(pkt.text);
            if (env && env.pairCode === this.pairCode) {
              this._deliver(env, pkt.retain);
            }
          } catch { /* ignore */ }
        }
      });

      ws.onopen = () => {
        if (this.closed) { try { ws.close(); } catch {} return; }
        const cid = `agi_${Math.random().toString(36).slice(2, 11)}`;
        try { ws.send(encodeMqttConnect(cid, 30)); } catch { /* ignore */ }
        conn.pingTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try { ws.send(encodeMqttPingReq()); } catch { /* ignore */ }
          }
        }, 22000);
      };
      ws.onmessage = (ev) => {
        if (ev.data instanceof ArrayBuffer) parser.push(new Uint8Array(ev.data));
      };
      const onEnd = () => {
        const wasReady = conn.ready;
        conn.ready = false;
        clearInterval(conn.pingTimer);
        if (wasReady && !this.closed) this.onBrokerChange(this.connectedCount());
      };
      ws.onerror = onEnd;
      ws.onclose = onEnd;
      this.conns.push(conn);
    }
  }

  _deliver(env, isRetained = false) {
    if (!env || env.senderId === this.senderId) return;
    if (env.mid) {
      if (this.seenSet.has(env.mid)) return;
      this.seenSet.add(env.mid);
      this.seenMids.push(env.mid);
      if (this.seenMids.length > 200) {
        const old = this.seenMids.shift();
        this.seenSet.delete(old);
      }
    }
    for (const fn of this.handlers) {
      try { fn(env, isRetained); } catch { /* ignore */ }
    }
  }

  subscribe(fn) {
    this.handlers.add(fn);
    return () => this.handlers.delete(fn);
  }

  publish(subtopic, channel, payload, { retain = false } = {}) {
    if (this.closed) return;
    const mid = `${this.senderId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const env = {
      mid,
      pairCode: this.pairCode,
      senderId: this.senderId,
      channel,
      payload,
      ts: Date.now(),
    };
    if (this.bc) {
      try { this.bc.postMessage(env); } catch { /* ignore */ }
    }
    const topic = `${this.topicPrefix}/${subtopic}`;
    const raw = JSON.stringify(env);
    let sentAny = false;
    for (const c of this.conns) {
      if (c.ready && c.ws?.readyState === WebSocket.OPEN) {
        try {
          c.ws.send(encodeMqttPublish(topic, raw, retain));
          sentAny = true;
        } catch { /* ignore */ }
      }
    }
    if (!sentAny) {
      if (retain) {
        this.pendingPublishes = this.pendingPublishes.filter((p) => p.topic !== topic);
      }
      this.pendingPublishes.push({ topic, raw, retain });
      if (this.pendingPublishes.length > 16) this.pendingPublishes.shift();
    }
  }

  close() {
    this.closed = true;
    clearInterval(this._reconnectTimer);
    this.handlers.clear();
    if (this.bc) {
      try { this.bc.close(); } catch { /* ignore */ }
      this.bc = null;
    }
    for (const c of this.conns.splice(0)) {
      clearInterval(c.pingTimer);
      try { c.ws?.close(); } catch { /* ignore */ }
    }
  }
}

/**
 * Готовый сигнальный адаптер для `RtcHostPeer` и `RtcJoyPeer` (и `WristHostLink`),
 * плюс обмен присутствием (`whois` -> `here`) для универсального хаба «Мой пульт».
 */
export function createAutoPairSignaling(pairCode, {
  game = 'ckc',
  role = 'host', // 'host' | 'joy' | 'controller'
  handSide = 'right',
  brokers,
  wsUrls,
  onFallbackMessage,
  onBrokerChange,
} = {}) {
  const bus = new AutoPairBus(pairCode, { brokers: brokers || wsUrls, onBrokerChange });
  const handlers = { hello: [], offer: [], answer: [], hostCand: [], joyCand: [] };
  let currentHandSide = handSide === 'left' ? 'left' : 'right';
  let presenceTimer = null;

  const announcePresence = (retain = false) => {
    if (role !== 'host') return;
    bus.publish('presence', 'here', {
      game,
      pairCode: bus.pairCode,
      handSide: currentHandSide,
      ts: Date.now(),
    }, { retain });
  };

  bus.subscribe((env, isRetained) => {
    if (env.channel === 'whois' && role === 'host') {
      announcePresence(false);
      return;
    }
    if (env.channel === `sig:${game}`) {
      const { sub, data } = env.payload || {};
      if (isRetained) return;
      const list = handlers[sub];
      if (list && data) {
        for (const fn of [...list]) fn(data);
      }
      return;
    }
    if (env.channel === `fb:${game}` && !isRetained && onFallbackMessage) {
      onFallbackMessage(env.payload);
    }
  });

  bus.start();
  if (role === 'host') {
    announcePresence(true);
    presenceTimer = setInterval(() => announcePresence(false), 8000);
  }

  const off = (sub, fn) => () => {
    const idx = handlers[sub].indexOf(fn);
    if (idx >= 0) handlers[sub].splice(idx, 1);
  };
  const postSig = (sub, data) => bus.publish(`${game}/sig`, `sig:${game}`, { sub, data });

  return {
    bus,
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    async resetForOffer() {},
    // Интерфейс RtcHostPeer / RtcJoyPeer (tilt-rtc.js)
    async sendHello(joySid, meta = {}) {
      postSig('hello', { joySid, hid: meta.hid || null, iceMode: meta.iceMode || 'lan', ts: Date.now() });
    },
    onHello(cb) { handlers.hello.push(cb); return off('hello', cb); },
    async sendOffer(offer, joySid, meta = {}) {
      postSig('offer', {
        type: offer.type || 'offer',
        sdp: offer.sdp,
        joySid: joySid || null,
        hid: meta.hid || offer.hid || null,
        iceMode: meta.iceMode || offer.iceMode || 'lan',
        ts: Date.now(),
      });
    },
    onOffer(cb) { handlers.offer.push(cb); return off('offer', cb); },
    async sendAnswer(answer, joySid, meta = {}) {
      postSig('answer', {
        type: answer.type || 'answer',
        sdp: answer.sdp,
        joySid: joySid || null,
        hid: meta.hid || answer.hid || null,
        ts: Date.now(),
      });
    },
    onAnswer(cb) { handlers.answer.push(cb); return off('answer', cb); },
    async pushCandidate(candRole, cand, joySid, meta = {}) {
      const j = cand?.toJSON ? cand.toJSON() : cand;
      const sub = candRole === 'host' ? 'hostCand' : 'joyCand';
      postSig(sub, {
        candidate: j.candidate !== undefined ? j.candidate : j,
        sdpMid: j.sdpMid ?? null,
        sdpMLineIndex: j.sdpMLineIndex ?? null,
        usernameFragment: j.usernameFragment ?? null,
        joySid: joySid || null,
        hid: meta.hid || j.hid || null,
        ts: Date.now(),
      });
    },
    onCandidate(candRole, cb) {
      const sub = candRole === 'host' ? 'hostCand' : 'joyCand';
      handlers[sub].push(cb);
      return off(sub, cb);
    },
    // Совместимый интерфейс WristHostLink / wrist.js
    async writeHello(payload = {}) {
      postSig('hello', { ...payload, ts: payload.ts || Date.now() });
    },
    async writeOffer(payload = {}) {
      postSig('offer', { type: 'offer', ...payload, ts: payload.ts || Date.now() });
    },
    async writeAnswer(payload = {}) {
      postSig('answer', { type: 'answer', ...payload, ts: payload.ts || Date.now() });
    },
    async pushHostCandidate(item) {
      postSig('hostCand', { ...item, ts: Date.now() });
    },
    async pushJoyCandidate(item) {
      postSig('joyCand', { ...item, ts: Date.now() });
    },
    onHostCandidate(cb) {
      handlers.hostCand.push(cb);
      return off('hostCand', cb);
    },
    onJoyCandidate(cb) {
      handlers.joyCand.push(cb);
      return off('joyCand', cb);
    },
    sendFallback(data) {
      bus.publish(`${game}/fb`, `fb:${game}`, data);
    },
    setHandSide(side) {
      currentHandSide = side === 'left' ? 'left' : 'right';
      announcePresence(true);
    },
    connectedBrokers: () => bus.connectedCount(),
    dispose() {
      clearInterval(presenceTimer);
      bus.close();
    },
  };
}

/**
 * Слушатель для универсального входа «Мой пульт»:
 * отправляет запрос `whois` по коду пары и вызывает `onDetected` / `onGame` сразу, как только
 * отзовётся открытый экран «Сладкой Гонки» или «Белой ночи».
 */
export function watchActiveGameForPair(pairCode, { brokers, wsUrls, onDetected, onGame, onBrokerChange } = {}) {
  const cb = onDetected || onGame;
  const bus = new AutoPairBus(pairCode, { brokers: brokers || wsUrls, onBrokerChange });
  bus.subscribe((env, isRetained) => {
    if (env.channel !== 'here' || !env.payload?.game) return;
    if (isRetained && Math.abs(Date.now() - (env.payload.ts || 0)) > 90000) return;
    if (cb) cb(env.payload);
  });
  bus.start();
  const ask = () => bus.publish('hub', 'whois', { ts: Date.now() });
  ask();
  const timer = setInterval(ask, 1800);
  const stopFn = () => {
    clearInterval(timer);
    bus.close();
  };
  stopFn.askNow = ask;
  stopFn.connectedBrokers = () => bus.connectedCount();
  stopFn.stop = stopFn;
  return stopFn;
}
