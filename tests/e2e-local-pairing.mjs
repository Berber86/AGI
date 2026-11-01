// End-to-end приёмка гибридного локального спаривания двух телефонов без Google Firebase API:
// 1) Общая постоянная пара agi_pair_v1 между «Сладкой Гонкой», «Белой ночью» и хабом «Мой пульт»
//    в двух полностью изолированных BrowserContext (никакого общего BroadcastChannel или localStorage!).
// 2) Авто-вход «Мой пульт» (/games/remote-hub/) с автоопределением открытой игры и редиректом.
// 3) 100% офлайн взаимное спаривание по 2 QR-кодам (экран <-> пульт) при полном отсутствии сети
//    (window.__AGI_WSS_BROKERS__ = []) с честным пиксельным декодированием отрисованных SVG QR!
// 4) Проверка отсутствия открытого поля firebaseConfig на главном экране и вёрстки 390×844 / 360×640.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const requireFromTools = createRequire('/home/user/tools/package.json');
const puppeteer = requireFromTools('puppeteer-core');

process.env.LD_LIBRARY_PATH = ['/tmp/al2023/lib', process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
process.env.HOME = '/tmp';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const SHOTS_DIR = path.join(REPO_ROOT, '.studio/evidence/screenshots/local-pairing');
const REPORT_PATH = path.join(REPO_ROOT, '.studio/evidence/reports/local-pairing-e2e.json');
fs.mkdirSync(SHOTS_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- Минимальный RFC 6455 WebSocket + MQTT v3.1.1 брокер (0 внешних зависимостей) ---
function encodeWsFrame(payloadBytes, opcode = 0x02) {
  const len = payloadBytes.length;
  let header;
  if (len < 126) {
    header = Buffer.from([0x80 | opcode, len]);
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, Buffer.from(payloadBytes)]);
}

function encodeMqttVarLen(len) {
  const out = [];
  let x = len;
  do {
    let b = x % 128;
    x = Math.floor(x / 128);
    if (x > 0) b |= 0x80;
    out.push(b);
  } while (x > 0);
  return Buffer.from(out);
}

function buildMqttPublishPacket(topic, payloadBuf, retain = false) {
  const topicBuf = Buffer.from(topic, 'utf8');
  const tLen = Buffer.alloc(2);
  tLen.writeUInt16BE(topicBuf.length, 0);
  const rem = topicBuf.length + 2 + payloadBuf.length;
  return Buffer.concat([
    Buffer.from([0x30 | (retain ? 0x01 : 0x00)]),
    encodeMqttVarLen(rem),
    tLen,
    topicBuf,
    payloadBuf,
  ]);
}

function topicMatches(filter, topic) {
  if (filter === topic) return true;
  if (filter.endsWith('/#')) return topic.startsWith(filter.slice(0, -1));
  return false;
}

function createServerWithMqttBroker(rootDir) {
  const mqttClients = new Set();
  const retained = new Map();

  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    let rel = decodeURIComponent(u.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const filePath = path.resolve(rootDir, '.' + rel);
    if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(fs.readFileSync(filePath));
  });

  server.on('upgrade', (req, socket) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) { socket.destroy(); return; }
    const accept = crypto
      .createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
      .digest('base64');
    const proto = req.headers['sec-websocket-protocol'];
    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
    ];
    if (proto && proto.includes('mqtt')) headers.push('Sec-WebSocket-Protocol: mqtt');
    socket.write(headers.join('\r\n') + '\r\n\r\n');

    const client = {
      socket,
      subs: new Set(),
      wsBuf: Buffer.alloc(0),
      mqttBuf: Buffer.alloc(0),
      sendMqtt(pkt) {
        if (!socket.destroyed) socket.write(encodeWsFrame(pkt, 0x02));
      },
    };
    mqttClients.add(client);

    const handleMqttBytes = (chunk) => {
      client.mqttBuf = Buffer.concat([client.mqttBuf, chunk]);
      while (client.mqttBuf.length >= 2) {
        let idx = 1;
        let remLen = 0;
        let mult = 1;
        let complete = false;
        while (idx < client.mqttBuf.length) {
          const b = client.mqttBuf[idx++];
          remLen += (b & 0x7f) * mult;
          if ((b & 0x80) === 0) { complete = true; break; }
          mult *= 128;
        }
        if (!complete || client.mqttBuf.length < idx + remLen) break;
        const headerByte = client.mqttBuf[0];
        const pktType = headerByte >>> 4;
        const flags = headerByte & 0x0f;
        const body = client.mqttBuf.subarray(idx, idx + remLen);
        client.mqttBuf = client.mqttBuf.subarray(idx + remLen);

        if (pktType === 1) { // CONNECT -> CONNACK
          client.sendMqtt(Buffer.from([0x20, 0x02, 0x00, 0x00]));
        } else if (pktType === 8) { // SUBSCRIBE -> SUBACK
          const idHi = body[0], idLo = body[1];
          const tLen = body.readUInt16BE(2);
          const filter = body.subarray(4, 4 + tLen).toString('utf8');
          client.subs.add(filter);
          client.sendMqtt(Buffer.from([0x90, 0x03, idHi, idLo, 0x00]));
          for (const [rTopic, rPayload] of retained.entries()) {
            if (topicMatches(filter, rTopic)) {
              client.sendMqtt(buildMqttPublishPacket(rTopic, rPayload, true));
            }
          }
        } else if (pktType === 3) { // PUBLISH
          const tLen = body.readUInt16BE(0);
          const topic = body.subarray(2, 2 + tLen).toString('utf8');
          const qos = (flags >> 1) & 0x03;
          const payloadStart = 2 + tLen + (qos > 0 ? 2 : 0);
          const payload = Buffer.from(body.subarray(payloadStart));
          if (flags & 0x01) retained.set(topic, payload);
          const out = buildMqttPublishPacket(topic, payload, false);
          for (const peer of mqttClients) {
            for (const f of peer.subs) {
              if (topicMatches(f, topic)) {
                peer.sendMqtt(out);
                break;
              }
            }
          }
        } else if (pktType === 12) { // PINGREQ -> PINGRESP
          client.sendMqtt(Buffer.from([0xd0, 0x00]));
        }
      }
    };

    socket.on('data', (chunk) => {
      client.wsBuf = Buffer.concat([client.wsBuf, chunk]);
      while (client.wsBuf.length >= 2) {
        const b0 = client.wsBuf[0];
        const b1 = client.wsBuf[1];
        const opcode = b0 & 0x0f;
        const masked = (b1 & 0x80) !== 0;
        let len = b1 & 0x7f;
        let offset = 2;
        if (len === 126) {
          if (client.wsBuf.length < 4) break;
          len = client.wsBuf.readUInt16BE(2);
          offset = 4;
        } else if (len === 127) {
          if (client.wsBuf.length < 10) break;
          len = Number(client.wsBuf.readBigUInt64BE(2));
          offset = 10;
        }
        const maskLen = masked ? 4 : 0;
        if (client.wsBuf.length < offset + maskLen + len) break;
        const mask = masked ? client.wsBuf.subarray(offset, offset + 4) : null;
        const data = Buffer.from(client.wsBuf.subarray(offset + maskLen, offset + maskLen + len));
        client.wsBuf = client.wsBuf.subarray(offset + maskLen + len);
        if (masked) {
          for (let i = 0; i < data.length; i++) data[i] ^= mask[i & 3];
        }
        if (opcode === 0x08) { socket.end(); return; }
        if (opcode === 0x09) { socket.write(encodeWsFrame(data, 0x0a)); continue; }
        if (opcode === 0x01 || opcode === 0x02) handleMqttBytes(data);
      }
    });

    const cleanup = () => mqttClients.delete(client);
    socket.on('close', cleanup);
    socket.on('error', cleanup);
  });

  return server;
}

// Честно делает РЕАЛЬНЫЙ скриншот элемента на странице (со всеми применёнными CSS-стилями!)
// и декодирует его пиксели через decodeQrFromRgba!
async function decodeRenderedSvgQrOnPage(page, containerSelector, localPairModuleUrl) {
  const handle = await page.$(containerSelector);
  assert.ok(handle, `QR container not found: ${containerSelector}`);
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), containerSelector);
  await sleep(60);
  const b64 = await handle.screenshot({ type: 'png', encoding: 'base64' });
  await handle.dispose();
  return page.evaluate(async (pngB64, modUrl) => {
    const mod = await import(modUrl);
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = `data:image/png;base64,${pngB64}`;
    });
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, w, h);
    return mod.decodeQrFromRgba(data, w, h);
  }, b64, localPairModuleUrl);
}

const checks = [];
const errors = [];
function pass(name, detail = {}) {
  checks.push({ name, passed: true, detail });
  console.log(`PASS  ${name}`);
}

const server = createServerWithMqttBroker(REPO_ROOT);
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const ORIGIN = `http://127.0.0.1:${port}`;
const WS_BROKER = `ws://127.0.0.1:${port}/mqtt`;
const LOCAL_PAIR_MOD = `${ORIGIN}/games/candy-kingdom-coaster/src/local-pair.js`;

const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium',
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox',
    '--hide-scrollbars',
    '--mute-audio',
  ],
  defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  protocolTimeout: 180000,
});

function attachErrorCollector(page, label) {
  page.on('pageerror', (e) => errors.push(`${label} pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${label} console.error: ${m.text()}`);
  });
}

async function assertNoHorizontalOverflow(page, label) {
  const m = await page.evaluate(() => ({
    innerW: window.innerWidth,
    scrollW: document.documentElement.scrollWidth,
  }));
  assert.ok(m.scrollW <= m.innerW + 2, `${label} horizontal overflow: scrollW=${m.scrollW} > innerW=${m.innerW}`);
  return m;
}

let report = { passed: false, checks, errors };

try {
  // =========================================================================
  // 1. Витрина каталога (390×844): карточка «Мой пульт · Авто-вход»
  // =========================================================================
  const catCtx = await browser.createBrowserContext();
  const catPage = await catCtx.newPage();
  attachErrorCollector(catPage, 'catalog');
  await catPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await catPage.goto(`${ORIGIN}/index.html`, { waitUntil: 'networkidle0' });
  const hubCard = await catPage.$eval('[data-game="remote-hub"]', (el) => ({
    href: el.querySelector('a.play')?.getAttribute('href') || el.getAttribute('href'),
    text: el.textContent.replace(/\s+/g, ' ').trim(),
  }));
  assert.equal(hubCard.href, './games/remote-hub/index.html');
  assert.match(hubCard.text, /Мой пульт/);
  await assertNoHorizontalOverflow(catPage, 'catalog-390x844');
  await catPage.screenshot({ path: path.join(SHOTS_DIR, '01-catalog-mobile.png') });
  await catCtx.close();
  pass('Каталог содержит карточку «Мой пульт · Авто-вход» без горизонтального скролла на 390×844', hubCard);

  // =========================================================================
  // 2. Авто-спаривание «Сладкая Гонка» <-> «Мой пульт» между ДВУМЯ изолированными телефонами
  // =========================================================================
  const screenPhoneCtx = await browser.createBrowserContext();
  const ctrlPhoneCtx = await browser.createBrowserContext();

  const screenPage = await screenPhoneCtx.newPage();
  attachErrorCollector(screenPage, 'screen-phone');
  await screenPage.evaluateOnNewDocument((wsUrl) => {
    window.__AGI_WSS_BROKERS__ = [wsUrl];
  }, WS_BROKER);
  await screenPage.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await screenPage.goto(`${ORIGIN}/games/candy-kingdom-coaster/index.html`, { waitUntil: 'networkidle0', timeout: 90000 });
  await screenPage.waitForFunction('window.__READY__ === true', { timeout: 90000 });

  // Открываем экран подготовки VR и выбираем режим «Второй телефон»
  await screenPage.evaluate(() => {
    document.getElementById('btn-vr').click();
    document.getElementById('vr-driver-remote').click();
  });
  await screenPage.waitForSelector('#screen-vr:not(.hidden)');
  await sleep(300);

  // Проверяем, что главный интерфейс НЕ требует вставлять Firebase API (details закрыт!)
  const ckcUiState = await screenPage.evaluate(() => {
    const details = document.getElementById('vr-fb-details');
    const cfg = document.getElementById('vr-cfg');
    const codeText = document.getElementById('vr-room-code')?.textContent?.trim() || '';
    const savedPair = localStorage.getItem('agi_pair_v1');
    const hasSvgQr = Boolean(document.querySelector('#vr-pair-qr svg'));
    return {
      detailsOpen: details?.open ?? null,
      cfgVisible: cfg?.checkVisibility ? cfg.checkVisibility() : null,
      firebaseHiddenByDefault: Boolean(details && !details.open && cfg && !cfg.checkVisibility()),
      codeText,
      savedPair,
      hasSvgQr,
    };
  });
  assert.equal(ckcUiState.firebaseHiddenByDefault, true, `Firebase textarea must stay collapsed: ${JSON.stringify(ckcUiState)}`);
  assert.match(ckcUiState.savedPair, /^\d{6}$/);
  assert.equal(ckcUiState.hasSvgQr, true);
  await screenPage.evaluate(() => document.getElementById('vr-pair-qr')?.scrollIntoView({ block: 'center' }));
  await sleep(100);
  await screenPage.screenshot({ path: path.join(SHOTS_DIR, '02-ckc-vr-prep-pair.png') });

  // Сканируем пиксели QR-кода с экрана «Сладкой Гонки»!
  const ckcScannedQrUrl = await decodeRenderedSvgQrOnPage(screenPage, '#vr-pair-qr', LOCAL_PAIR_MOD);
  assert.ok(ckcScannedQrUrl.includes(`pair=${ckcUiState.savedPair}`), `Decoded QR URL: ${ckcScannedQrUrl}`);

  // На втором телефоне открываем универсальный «Мой пульт» с кодом пары — он обязан сам найти «Сладкую Гонку»!
  const ctrlPage = await ctrlPhoneCtx.newPage();
  attachErrorCollector(ctrlPage, 'ctrl-phone');
  await ctrlPage.evaluateOnNewDocument((wsUrl) => {
    window.__AGI_WSS_BROKERS__ = [wsUrl];
  }, WS_BROKER);
  await ctrlPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  // Сначала проверим сам экран «Мой пульт» до редиректа (с флагом без автоперехода? нет, проверим вёрстку на лету или отдельной вкладкой без брокера)
  await ctrlPage.goto(`${ORIGIN}/games/remote-hub/index.html?pair=${ckcUiState.savedPair}`, { waitUntil: 'domcontentloaded' });
  await ctrlPage.waitForFunction(
    () => location.pathname.includes('/games/candy-kingdom-coaster/joystick/'),
    { timeout: 15000 },
  );
  await ctrlPage.waitForFunction('Boolean(window.__JOY__)', { timeout: 15000 });

  // Ждём, пока автоматический локальный WebRTC 60 Гц откроется между двумя изолированными контекстами!
  let ckcLink = null;
  for (let i = 0; i < 40; i++) {
    ckcLink = await screenPage.evaluate(() => window.__TEST__.remoteInfo());
    if (ckcLink?.rtcOpen && ckcLink?.kind === 'local') break;
    await sleep(200);
  }
  assert.equal(ckcLink?.kind, 'local');
  assert.equal(ckcLink?.rtcOpen, true, `Expected CKC local WebRTC open, got ${JSON.stringify(ckcLink)}`);

  // Отправляем аналоговый руль и газ по прямому WebRTC 60 Гц!
  await ctrlPage.evaluate(() => window.__JOY__.setDrive(0.82, 0.65, 0));
  await sleep(150);
  const ckcAfterDrive = await screenPage.evaluate(() => window.__TEST__.remoteInfo());
  assert.equal(ckcAfterDrive.fresh, true);
  assert.ok(ckcAfterDrive.rtcPackets > 0);
  assert.ok(Math.abs(ckcAfterDrive.steer - 0.82) < 0.03);

  const joyFirebaseCollapsed = await ctrlPage.evaluate(() => {
    const d = document.getElementById('fb-fallback-details');
    return Boolean(d && !d.open);
  });
  assert.equal(joyFirebaseCollapsed, true);
  await assertNoHorizontalOverflow(ctrlPage, 'ckc-joystick-390x844');
  await ctrlPage.screenshot({ path: path.join(SHOTS_DIR, '03-ckc-joystick-connected-390x844.png') });

  await ctrlPage.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await assertNoHorizontalOverflow(ctrlPage, 'ckc-joystick-360x640');
  await ctrlPage.screenshot({ path: path.join(SHOTS_DIR, '04-ckc-joystick-360x640.png') });
  pass('«Сладкая Гонка» + «Мой пульт»: авто-редирект и прямой WebRTC 60 Гц между двумя изолированными телефонами без Firebase API', {
    pair: ckcUiState.savedPair,
    rtcPackets: ckcAfterDrive.rtcPackets,
  });

  // =========================================================================
  // 3. Общая постоянная пара agi_pair_v1: переключение на «Белую ночь» БЕЗ повторного ввода кода!
  // =========================================================================
  await ctrlPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await screenPage.goto(`${ORIGIN}/games/white-night/play/index.html?test=1`, { waitUntil: 'networkidle0', timeout: 90000 });
  await screenPage.waitForFunction('Boolean(window.__GAME_TEST__)', { timeout: 60000 });

  await screenPage.evaluate(() => {
    window.__GAME_TEST__.vr.open();
    window.__GAME_TEST__.vr.setMode('hand');
  });
  await sleep(250);

  const wnPrepState = await screenPage.evaluate(() => {
    const details = document.getElementById('vr-hand-fb-details');
    const fbInput = document.getElementById('vr-hand-fb');
    const codeText = document.getElementById('vr-hand-code')?.textContent?.trim() || '';
    const savedPair = localStorage.getItem('agi_pair_v1');
    const hasSvgQr = Boolean(document.querySelector('#vr-hand-qr svg'));
    return {
      firebaseHiddenByDefault: Boolean(details && !details.open && fbInput && !fbInput.checkVisibility()),
      codeText,
      savedPair,
      hasSvgQr,
      vr: window.__GAME_TEST__.vr.info().wrist.link,
    };
  });
  assert.equal(wnPrepState.savedPair, ckcUiState.savedPair, 'Белая ночь обязана подхватить ту же пару agi_pair_v1!');
  assert.equal(wnPrepState.vr.roomCode, ckcUiState.savedPair);
  assert.equal(wnPrepState.firebaseHiddenByDefault, true);
  assert.equal(wnPrepState.hasSvgQr, true);
  await screenPage.evaluate(() => document.getElementById('vr-hand-qr')?.scrollIntoView({ block: 'center' }));
  await sleep(100);
  await screenPage.screenshot({ path: path.join(SHOTS_DIR, '05-wn-vr-prep-shared-pair.png') });

  // Открываем «Мой пульт» на втором телефоне БЕЗ кода пары в URL — он сам помнит agi_pair_v1 и открывает браслет «Белой ночи»!
  await ctrlPage.goto(`${ORIGIN}/games/remote-hub/index.html?test=1`, { waitUntil: 'domcontentloaded' });
  await ctrlPage.waitForFunction(
    () => location.pathname.includes('/games/white-night/') && location.pathname.includes('/wrist/'),
    { timeout: 15000 },
  );
  await ctrlPage.waitForFunction('Boolean(window.__WRIST_TEST__)', { timeout: 15000 });

  // Подаём живую ориентацию запястья 60 Гц и ждём открытия прямого WebRTC DataChannel
  await ctrlPage.evaluate(() => window.__WRIST_TEST__.setPose({ alpha: 15, beta: 75, gamma: -10 }));
  let wnHostLink = null;
  for (let i = 0; i < 40; i++) {
    await ctrlPage.evaluate((i0) => window.__WRIST_TEST__.setPose({ alpha: 15 + i0 * 0.2, beta: 75, gamma: -10 }), i);
    wnHostLink = await screenPage.evaluate(() => window.__GAME_TEST__.vr.info().wrist.link);
    if (wnHostLink?.p2pOpen && wnHostLink?.fresh) break;
    await sleep(200);
  }
  assert.equal(wnHostLink?.mode, 'local');
  assert.equal(wnHostLink?.p2pOpen, true, `Expected WN local WebRTC open, got ${JSON.stringify(wnHostLink)}`);
  assert.equal(wnHostLink?.fresh, true);

  await assertNoHorizontalOverflow(ctrlPage, 'wn-wrist-390x844');
  await ctrlPage.screenshot({ path: path.join(SHOTS_DIR, '07-wn-wrist-connected-390x844.png') });
  pass('Общая пара agi_pair_v1: «Белая ночь» и «Мой пульт» соединяются по 60 Гц WebRTC автоматически без ввода кода', {
    pair: wnPrepState.savedPair,
    rxHz: wnHostLink.rxHz,
  });

  await screenPhoneCtx.close();
  await ctrlPhoneCtx.close();

  // =========================================================================
  // 3b. Скриншот и проверка самого экрана «Мой пульт» (390×844 и 360×640) в режиме ожидания
  // =========================================================================
  const hubUiCtx = await browser.createBrowserContext();
  const hubUiPage = await hubUiCtx.newPage();
  attachErrorCollector(hubUiPage, 'remote-hub-ui');
  await hubUiPage.evaluateOnNewDocument(() => { window.__AGI_WSS_BROKERS__ = []; });
  await hubUiPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await hubUiPage.goto(`${ORIGIN}/games/remote-hub/index.html?pair=482915`, { waitUntil: 'networkidle0' });
  await assertNoHorizontalOverflow(hubUiPage, 'remote-hub-390x844');
  await hubUiPage.screenshot({ path: path.join(SHOTS_DIR, '06-remote-hub-mobile.png') });
  await hubUiPage.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await assertNoHorizontalOverflow(hubUiPage, 'remote-hub-360x640');
  await hubUiCtx.close();
  pass('Универсальный хаб «Мой пульт» чисто отрендерен на 390×844 и 360×640 без горизонтального переполнения');

  // =========================================================================
  // 4. 100% ОФЛАЙН взаимное спаривание по 2 QR-кодам (НОЛЬ интернета, brokers = []) — «Сладкая Гонка»
  // =========================================================================
  const offCkcScreenCtx = await browser.createBrowserContext();
  const offCkcJoyCtx = await browser.createBrowserContext();
  const offCkcScreen = await offCkcScreenCtx.newPage();
  const offCkcJoy = await offCkcJoyCtx.newPage();
  attachErrorCollector(offCkcScreen, 'off-ckc-screen');
  attachErrorCollector(offCkcJoy, 'off-ckc-joy');
  await offCkcScreen.evaluateOnNewDocument(() => { window.__AGI_WSS_BROKERS__ = []; });
  await offCkcJoy.evaluateOnNewDocument(() => { window.__AGI_WSS_BROKERS__ = []; });

  await offCkcScreen.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await offCkcScreen.goto(`${ORIGIN}/games/candy-kingdom-coaster/index.html`, { waitUntil: 'networkidle0', timeout: 90000 });
  await offCkcScreen.waitForFunction('window.__READY__ === true', { timeout: 90000 });
  await offCkcScreen.evaluate(() => {
    document.getElementById('btn-vr').click();
    document.getElementById('vr-driver-remote').click();
  });
  await sleep(200);

  // Шаг 1: экран игры включает «Офлайн по 2 QR» и обновляет свой QR-код компактным AG1-оффером
  await offCkcScreen.evaluate(() => document.getElementById('vr-offline-toggle').click());
  await offCkcScreen.waitForFunction(
    () => (document.getElementById('vr-offline-status')?.textContent || '').includes('Шаг 1')
      || (document.getElementById('vr-offline-status')?.textContent || '').includes('Камера недоступна'),
    { timeout: 15000 },
  );

  // Честно декодируем пиксели обновлённого SVG QR шага 1 прямо с экрана игры!
  const ckcOfflineOfferUrl = await decodeRenderedSvgQrOnPage(offCkcScreen, '#vr-pair-qr', LOCAL_PAIR_MOD);
  assert.ok(ckcOfflineOfferUrl.includes('off=AG1.'), `Expected offline offer URL with off=AG1., got ${ckcOfflineOfferUrl}`);

  // Шаг 2: второй телефон открывает отсканированную QR-ссылку шага 1 (при полном отсутствии брокеров!)
  await offCkcJoy.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const localOfferUrl = new URL(ckcOfflineOfferUrl);
  await offCkcJoy.goto(`${ORIGIN}${localOfferUrl.pathname}${localOfferUrl.search}${localOfferUrl.hash}`, { waitUntil: 'networkidle0' });
  await offCkcJoy.waitForSelector('#qr-ans-box:not(.hidden) svg', { timeout: 15000 });
  await offCkcJoy.screenshot({ path: path.join(SHOTS_DIR, '08-ckc-offline-answer-qr.png') });

  // Честно декодируем пиксели ответного QR шага 2 с экрана джойстика!
  const ckcAnswerToken = await decodeRenderedSvgQrOnPage(offCkcJoy, '#qr-ans-svg', LOCAL_PAIR_MOD);
  assert.ok(ckcAnswerToken.startsWith('AG1.'), `Expected AG1 answer token, got ${ckcAnswerToken}`);

  // Передаём распознанный ответ шага 2 на экран игры — прямой 60 Гц WebRTC обязан открыться без единого сервера!
  await offCkcScreen.evaluate((tok) => window.__TEST__.remoteOfflineAnswer(tok), ckcAnswerToken);

  let offCkcInfo = null;
  for (let i = 0; i < 30; i++) {
    offCkcInfo = await offCkcScreen.evaluate(() => window.__TEST__.remoteInfo());
    if (offCkcInfo?.rtcOpen) break;
    await sleep(150);
  }
  assert.equal(offCkcInfo?.rtcOpen, true, `Offline CKC WebRTC did not open: ${JSON.stringify(offCkcInfo)}`);
  assert.equal(offCkcInfo?.brokersOnline, 0);

  await offCkcJoy.evaluate(() => window.__JOY__.setDrive(-0.64, 0.8, 0));
  await sleep(150);
  const offCkcDrive = await offCkcScreen.evaluate(() => window.__TEST__.remoteInfo());
  assert.ok(offCkcDrive.rtcPackets > 0);
  assert.ok(Math.abs(offCkcDrive.steer - (-0.64)) < 0.03);
  await offCkcScreenCtx.close();
  await offCkcJoyCtx.close();
  pass('100% офлайн 2-QR рукопожатие в «Сладкой Гонке» (0 серверов, пиксельный декод обоих QR -> WebRTC 60 Гц)', {
    offerUrlLen: ckcOfflineOfferUrl.length,
    answerLen: ckcAnswerToken.length,
    rtcPackets: offCkcDrive.rtcPackets,
  });

  // =========================================================================
  // 5. 100% ОФЛАЙН взаимное спаривание по 2 QR-кодам (НОЛЬ интернета, brokers = []) — «Белая ночь»
  // =========================================================================
  const offWnScreenCtx = await browser.createBrowserContext();
  const offWnWristCtx = await browser.createBrowserContext();
  const offWnScreen = await offWnScreenCtx.newPage();
  const offWnWrist = await offWnWristCtx.newPage();
  attachErrorCollector(offWnScreen, 'off-wn-screen');
  attachErrorCollector(offWnWrist, 'off-wn-wrist');
  await offWnScreen.evaluateOnNewDocument(() => { window.__AGI_WSS_BROKERS__ = []; });
  await offWnWrist.evaluateOnNewDocument(() => { window.__AGI_WSS_BROKERS__ = []; });

  await offWnScreen.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await offWnScreen.goto(`${ORIGIN}/games/white-night/play/index.html?test=1`, { waitUntil: 'networkidle0', timeout: 90000 });
  await offWnScreen.waitForFunction('Boolean(window.__GAME_TEST__)', { timeout: 60000 });
  await offWnScreen.evaluate(() => {
    window.__GAME_TEST__.vr.open();
    window.__GAME_TEST__.vr.setMode('hand');
  });
  await sleep(150);

  // Шаг 1: нажимаем «Без интернета (QR ↔ QR)» в «Белой ночи»
  await offWnScreen.evaluate(() => document.getElementById('vr-hand-offline-btn').click());
  await offWnScreen.waitForFunction(
    () => window.__GAME_TEST__.vr.info().wrist.link.offlineReady === true,
    { timeout: 15000 },
  );
  await sleep(150);

  // Декодируем пиксели QR шага 1 с экрана «Белой ночи»
  const wnOfflineOfferUrl = await decodeRenderedSvgQrOnPage(offWnScreen, '#vr-hand-qr', LOCAL_PAIR_MOD);
  assert.ok(wnOfflineOfferUrl.includes('off=AG1.'), `Expected WN offline offer URL, got ${wnOfflineOfferUrl}`);

  // Шаг 2: открываем отсканированный URL на браслете «Белой ночи» (0 интернета!)
  await offWnWrist.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const localWnUrl = new URL(wnOfflineOfferUrl);
  localWnUrl.searchParams.set('test', '1');
  await offWnWrist.goto(`${ORIGIN}${localWnUrl.pathname}${localWnUrl.search}${localWnUrl.hash}`, { waitUntil: 'networkidle0' });
  await offWnWrist.waitForSelector('#qr-ans-box:not([hidden]) svg', { timeout: 15000 });
  await offWnWrist.screenshot({ path: path.join(SHOTS_DIR, '09-wn-offline-answer-qr.png') });

  // Декодируем пиксели ответного QR шага 2 с браслета
  const wnAnswerToken = await decodeRenderedSvgQrOnPage(offWnWrist, '#qr-ans-svg', LOCAL_PAIR_MOD);
  assert.ok(wnAnswerToken.startsWith('AG1.'), `Expected WN AG1 answer token, got ${wnAnswerToken}`);

  // Применяем ответ шага 2 на экране «Белой ночи»
  await offWnScreen.evaluate((tok) => window.__GAME_TEST__.vr.wristOfflineAnswer(tok), wnAnswerToken);

  let offWnLink = null;
  for (let i = 0; i < 30; i++) {
    await offWnWrist.evaluate((i0) => window.__WRIST_TEST__.setPose({ alpha: -20 + i0 * 0.2, beta: 60, gamma: 8 }), i);
    offWnLink = await offWnScreen.evaluate(() => window.__GAME_TEST__.vr.info().wrist.link);
    if (offWnLink?.p2pOpen && offWnLink?.fresh) break;
    await sleep(150);
  }
  assert.equal(offWnLink?.p2pOpen, true, `Offline WN WebRTC did not open: ${JSON.stringify(offWnLink)}`);
  assert.equal(offWnLink?.brokersOnline, 0);
  assert.equal(offWnLink?.fresh, true);
  await offWnScreenCtx.close();
  await offWnWristCtx.close();
  pass('100% офлайн 2-QR рукопожатие в «Белой ночи» (0 серверов, пиксельный декод обоих QR -> браслет 60 Гц)', {
    offerUrlLen: wnOfflineOfferUrl.length,
    answerLen: wnAnswerToken.length,
    rxHz: offWnLink.rxHz,
  });

  // =========================================================================
  // 6. Ноль ошибок консоли и необработанных исключений во всех сценариях
  // =========================================================================
  assert.deepEqual(errors, [], `Unexpected browser errors: ${JSON.stringify(errors)}`);
  pass('Ноль ошибок страницы и ошибок консоли во всех сценариях спаривания');

  report = { passed: true, checks, errors };
} catch (err) {
  report = { passed: false, checks, errors, error: err?.stack || String(err) };
  console.error(err);
} finally {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  try { await Promise.race([browser.close(), sleep(3000)]); } catch {}
  try { browser.process()?.kill('SIGKILL'); } catch {}
  server.closeAllConnections?.();
  await new Promise((r) => server.close(r));
  process.exit(report.passed ? 0 : 1);
}
