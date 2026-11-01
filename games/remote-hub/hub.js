import {
  loadSavedPairCode,
  savePairCode,
  clearSavedPairCode,
  normalizePairCode,
  formatPairCode,
  QrCameraScanner,
  parseScannedPayload,
  watchActiveGameForPair,
} from './local-pair.js';

const $ = (id) => document.getElementById(id);
const els = {
  radarPill: $('radar-pill'),
  radarText: $('radar-text'),
  savedPairRow: $('saved-pair-row'),
  savedPairDigits: $('saved-pair-digits'),
  forgetPairBtn: $('forget-pair-btn'),
  scanQrBtn: $('scan-qr-btn'),
  pasteBtn: $('paste-btn'),
  qrScanBox: $('qr-scan-box'),
  qrScanVideo: $('qr-scan-video'),
  scanFlipBtn: $('scan-flip-btn'),
  scanStopBtn: $('scan-stop-btn'),
  qrScanStatus: $('qr-scan-status'),
  pairInput: $('pair-input'),
  savePairBtn: $('save-pair-btn'),
  pairMsg: $('pair-msg'),
  launchCkc: $('launch-ckc'),
  launchWn: $('launch-wn'),
};

const qs = new URLSearchParams(location.search);
const hashParams = new URLSearchParams(location.hash.startsWith('#') ? location.hash.slice(1) : '');
const noRedirect = qs.get('noRedirect') === '1';

const hubState = {
  pairCode: '',
  brokersOnline: 0,
  detectedGame: null,
  targetUrl: '',
  redirected: false,
};

let stopWatcher = null;
let qrScanner = null;

export function controllerUrlForGame(game, pairCode = '', offlineToken = '') {
  const base = game === 'wn'
    ? '../white-night/play/wrist/index.html'
    : '../candy-kingdom-coaster/joystick/index.html';
  const u = new URL(base, location.href);
  const clean = normalizePairCode(pairCode);
  if (clean) {
    u.searchParams.set('pair', clean);
    u.searchParams.set('auto', '1');
  }
  if (offlineToken) u.hash = `off=${encodeURIComponent(offlineToken)}`;
  if (new URLSearchParams(location.search).has('test')) u.searchParams.set('test', '1');
  return u.toString();
}

function navigateToController(url, label) {
  hubState.targetUrl = url;
  els.radarPill.className = 'radar-pill ok';
  els.radarText.textContent = label;
  if (noRedirect) return;
  if (hubState.redirected) return;
  hubState.redirected = true;
  location.assign(url);
}

function updateManualLinks(code) {
  const clean = normalizePairCode(code);
  els.launchCkc.href = clean
    ? `../candy-kingdom-coaster/joystick/index.html?pair=${clean}`
    : '../candy-kingdom-coaster/joystick/index.html';
  els.launchWn.href = clean
    ? `../white-night/play/wrist/index.html?pair=${clean}`
    : '../white-night/play/wrist/index.html';
}

function stopActiveWatcher() {
  if (stopWatcher) {
    stopWatcher();
    stopWatcher = null;
  }
}

function stopScanner() {
  if (qrScanner) {
    qrScanner.stop();
    qrScanner = null;
  }
  els.qrScanBox.hidden = true;
}

function activatePair(rawCode) {
  const clean = normalizePairCode(rawCode);
  stopActiveWatcher();
  hubState.pairCode = clean;
  hubState.detectedGame = null;
  hubState.targetUrl = '';
  updateManualLinks(clean);

  if (!clean) {
    els.savedPairRow.hidden = true;
    els.radarPill.className = 'radar-pill';
    els.radarText.textContent = '◈ Нет сохранённой пары — сканируйте QR с экрана';
    return;
  }

  savePairCode(clean);
  els.pairInput.value = clean;
  els.savedPairDigits.textContent = formatPairCode(clean);
  els.savedPairRow.hidden = false;
  els.radarPill.className = 'radar-pill';
  els.radarText.textContent = `◈ Ищем открытую VR-игру на паре ${formatPairCode(clean)}…`;

  stopWatcher = watchActiveGameForPair(clean, {
    onBrokerChange: (count) => {
      hubState.brokersOnline = count;
    },
    onDetected: ({ game }) => {
      if (game !== 'ckc' && game !== 'wn') return;
      hubState.detectedGame = game;
      const gameTitle = game === 'wn' ? '«Белая ночь»' : '«Сладкая Гонка»';
      const target = controllerUrlForGame(game, clean);
      navigateToController(target, `⚡ Найдена ${gameTitle} — открываем пульт 60 Гц…`);
    },
  });
}

function handleAnyPayload(raw) {
  const parsed = parseScannedPayload(raw);
  if (parsed.kind === 'offline-offer') {
    const game = parsed.payload.game === 'wn' ? 'wn' : 'ckc';
    const cleanPair = normalizePairCode(parsed.payload.pairCode || '') || loadSavedPairCode();
    if (cleanPair) {
      savePairCode(cleanPair);
      hubState.pairCode = cleanPair;
      updateManualLinks(cleanPair);
    }
    hubState.detectedGame = game;
    const target = controllerUrlForGame(game, cleanPair, parsed.token);
    navigateToController(
      target,
      `◈ Офлайн-приглашение распознано (${game === 'wn' ? 'Белая ночь' : 'Сладкая Гонка'}) — открываем шаг 2…`,
    );
    return true;
  }
  if (parsed.kind === 'pair-code') {
    els.pairMsg.textContent = `Пара ${formatPairCode(parsed.pairCode)} сохранена! Ищем активную игру на экране…`;
    activatePair(parsed.pairCode);
    return true;
  }
  return false;
}

els.savePairBtn.addEventListener('click', () => {
  const code = normalizePairCode(els.pairInput.value);
  if (!code) {
    els.pairMsg.textContent = 'Введите ровно 6 цифр с экрана игры.';
    return;
  }
  els.pairMsg.textContent = `Пара ${formatPairCode(code)} сохранена для обеих игр.`;
  activatePair(code);
});

els.forgetPairBtn.addEventListener('click', () => {
  clearSavedPairCode();
  els.pairInput.value = '';
  els.pairMsg.textContent = 'Сохранённая пара сброшена.';
  activatePair('');
});

els.scanQrBtn.addEventListener('click', async () => {
  if (qrScanner) {
    stopScanner();
    return;
  }
  els.qrScanBox.hidden = false;
  els.qrScanStatus.textContent = 'Запускаем камеру…';
  qrScanner = new QrCameraScanner({
    videoEl: els.qrScanVideo,
    facingMode: 'environment',
    onResult: (raw) => {
      if (handleAnyPayload(raw)) stopScanner();
    },
  });
  try {
    await qrScanner.start();
    els.qrScanStatus.textContent = 'Наведите камеру на QR на экране игры…';
  } catch (err) {
    els.qrScanStatus.textContent = `Камера недоступна (${err?.message || err}) — введите 6 цифр или нажмите «Код».`;
  }
});

els.scanFlipBtn.addEventListener('click', () => {
  qrScanner?.flipCamera().catch(() => {});
});
els.scanStopBtn.addEventListener('click', stopScanner);

els.pasteBtn.addEventListener('click', async () => {
  let raw = '';
  try { raw = await navigator.clipboard.readText(); } catch { /* ignore */ }
  if (!raw) raw = window.prompt('Вставьте код или QR-ссылку с первого телефона:') || '';
  if (raw && !handleAnyPayload(raw)) {
    els.pairMsg.textContent = 'Код не распознан.';
  }
});

window.addEventListener('pagehide', () => {
  stopScanner();
  stopActiveWatcher();
});

if ('serviceWorker' in navigator && !location.search.includes('test')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Инициализация из URL (#off=AG1..., ?pair=XXXXXX) или сохранённой пары
const initOffline = hashParams.get('off') || qs.get('off') || '';
const initPair = normalizePairCode(qs.get('pair') || '');
if (initOffline) {
  handleAnyPayload(initOffline);
} else if (initPair) {
  activatePair(initPair);
} else {
  activatePair(loadSavedPairCode());
}

window.__HUB__ = {
  state: () => ({ ...hubState }),
  activatePair,
  handlePayload: handleAnyPayload,
};
