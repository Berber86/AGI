// Прямой канал WebRTC (RTCDataChannel) поверх любого «почтового ящика» (Firebase или BroadcastChannel).
// Написан так, чтобы этот файл можно было целиком забрать в любую будущую VR-игру.

const GOOGLE_STUN_SERVERS = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
];

const CONNECT_TIMEOUT_MS = 9500;
const MAX_BUFFER_BYTES = 16384;

const newSessionId = () =>
  Math.random().toString(36).slice(2, 8) + '-' + Date.now().toString(36).slice(-4);

export class RtcDirectLink {
  constructor({ role, signaling, iceMode = 'stun', onFastMessage, onCtrlMessage, onStateChange }) {
    this.role = role;               // 'host' | 'joy'
    this.signaling = signaling;     // FirebaseBackend | DemoBackend
    this.iceMode = iceMode;         // 'stun' | 'lan'
    this.onFastMessage = onFastMessage || null;
    this.onCtrlMessage = onCtrlMessage || null;
    this.onStateChange = onStateChange || null;

    this.pc = null;
    this.fastDc = null;             // UDP-режим: ordered: false, maxRetransmits: 0 (60 Гц без очереди)
    this.ctrlDc = null;             // Надёжный канал: вибрация, команды, сводка замеров
    this.joySid = null;             // ID текущей попытки знакомства (защищает от старых пакетов в базе)
    this.status = 'idle';           // 'idle' | 'signaling' | 'connecting' | 'open' | 'blocked' | 'dropped'
    this.simulatedDrop = false;

    this.sentPackets = 0;
    this.recvPackets = 0;
    this.sentBytes = 0;
    this.recvBytes = 0;

    this.localCandidatesCount = { host: 0, srflx: 0, relay: 0, other: 0 };
    this.remoteCandidatesCount = 0;
    this.routeInfo = {
      kind: 'unknown',              // 'lan' | 'nat' | 'relay' | 'unknown'
      localType: null,
      remoteType: null,
      protocol: null,
      nativeRttMs: null,
      badgeText: 'Ещё не установлен',
      detailText: 'Ожидание знакомства телефонов через комнату…',
    };

    // 5 понятных шагов знакомства для наглядной шкалы на экране
    this.steps = this._freshSteps();

    this._queuedCandidates = [];
    this._remoteDescReady = false;
    this._connectTimer = null;
    this._routePollTimer = null;
    this._answeredSid = null;

    this._bindSignaling();
  }

  _freshSteps() {
    return [
      { id: 1, title: '1. Вход в комнату (Hello)', state: 'idle', note: 'Ждём второй телефон' },
      { id: 2, title: '2. Анкета экрана (SDP Offer)', state: 'idle', note: 'Ещё не создана' },
      { id: 3, title: '3. Ответ пульта (SDP Answer)', state: 'idle', note: 'Ещё не получен' },
      { id: 4, title: '4. Обмен маршрутами (ICE)', state: 'idle', note: 'Ищем Wi-Fi и интернет-пути' },
      { id: 5, title: '5. Прямая UDP-труба', state: 'idle', note: 'Не открыта' },
    ];
  }

  _setStep(id, state, note) {
    const item = this.steps.find((s) => s.id === id);
    if (item) {
      item.state = state; // 'idle' | 'active' | 'done' | 'fail'
      if (note) item.note = note;
    }
    this._notify();
  }

  _notify() {
    if (this.onStateChange) this.onStateChange(this.getSnapshot());
  }

  setIceMode(mode) {
    this.iceMode = mode === 'lan' ? 'lan' : 'stun';
  }

  _bindSignaling() {
    if (this.role === 'host') {
      this.signaling.handlers.hello = (hello) => {
        // Свежий hello с новым joySid означает явный перезапуск WebRTC со стороны пульта
        if (hello && hello.joySid && hello.joySid !== this.joySid) {
          this.simulatedDrop = false;
        }
        if (this.simulatedDrop) return;
        this._handleHelloOnHost(hello).catch((err) => this._markBlocked(err));
      };
      this.signaling.handlers.answer = (ans) => {
        if (this.simulatedDrop) return;
        this._handleAnswerOnHost(ans).catch((err) => this._markBlocked(err));
      };
    } else {
      this.signaling.handlers.offer = (offer) => {
        if (this.simulatedDrop) return;
        this._handleOfferOnJoy(offer).catch((err) => this._markBlocked(err));
      };
    }

    this.signaling.handlers.remoteCandidate = (candMsg) => {
      if (this.simulatedDrop) return;
      this._handleRemoteCandidate(candMsg).catch(() => {});
    };
  }

  // Запускается со стороны Джойстика сразу после входа в комнату (или по кнопке «Пересобрать WebRTC»).
  async startHandshakeFromJoy() {
    if (this.role !== 'joy') return;
    this.simulatedDrop = false;
    this._cleanupPeer();
    this.steps = this._freshSteps();
    this.joySid = newSessionId();
    this._answeredSid = null;
    this.status = 'signaling';
    this._setStep(1, 'done', `Постучались в комнату (${this.iceMode === 'lan' ? 'только Wi-Fi' : 'Wi-Fi + STUN'})`);
    this._setStep(2, 'active', 'Ждём анкету Offer от Экрана…');
    this._armConnectTimeout();
    await this.signaling.sendHello({
      joySid: this.joySid,
      iceMode: this.iceMode,
      at: Date.now(),
    });
  }

  // На Экране кнопка «Пересобрать WebRTC» просит Джойстик начать свежее рукопожатие.
  requestReconnectFromHost() {
    if (this.role !== 'host') return;
    this.simulatedDrop = false;
    this.signaling.sendCloudCtrl('joy', { cmd: 'renegotiate', iceMode: this.iceMode });
  }

  // Искусственный обрыв прямого канала — чтобы своими глазами проверить авто-фолбэк на Firebase!
  setSimulatedDrop(dropped, { fromRemote = false } = {}) {
    this.simulatedDrop = !!dropped;
    if (this.simulatedDrop) {
      this._cleanupPeer();
      this.status = 'dropped';
      this.routeInfo = {
        kind: 'unknown',
        localType: null,
        remoteType: null,
        protocol: null,
        nativeRttMs: null,
        badgeText: '🧪 WebRTC специально отключён (тест обрыва)',
        detailText: 'Прямая труба разорвана вручную — управление должно бесшовно идти через Firebase Облако!',
      };
      this._setStep(5, 'fail', 'Отключено вручную для проверки фолбэка');
      if (!fromRemote) {
        const target = this.role === 'host' ? 'joy' : 'host';
        this.signaling.sendCloudCtrl(target, { cmd: 'peer-dropped' });
      }
      this._notify();
    } else if (!fromRemote) {
      if (this.role === 'joy') {
        this.startHandshakeFromJoy();
      } else {
        this.requestReconnectFromHost();
      }
    }
  }

  _createPeerConnection(effectiveIceMode) {
    this._activeUseIce = effectiveIceMode;
    const iceServers = effectiveIceMode === 'lan' ? [] : GOOGLE_STUN_SERVERS;
    const pc = new RTCPeerConnection({ iceServers });
    this.pc = pc;
    this._remoteDescReady = false;
    this._queuedCandidates = [];
    this.localCandidatesCount = { host: 0, srflx: 0, relay: 0, other: 0 };
    this.remoteCandidatesCount = 0;

    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !this.joySid) return;
      const candStr = ev.candidate.candidate || '';
      if (candStr.includes(' typ host')) this.localCandidatesCount.host++;
      else if (candStr.includes(' typ srflx')) this.localCandidatesCount.srflx++;
      else if (candStr.includes(' typ relay')) this.localCandidatesCount.relay++;
      else this.localCandidatesCount.other++;

      this._updateIceStepNote();
      this.signaling.sendCandidate(this.role, {
        joySid: this.joySid,
        candidate: ev.candidate.candidate,
        sdpMid: ev.candidate.sdpMid,
        sdpMLineIndex: ev.candidate.sdpMLineIndex,
      }).catch(() => {});
    };

    pc.onconnectionstatechange = () => {
      if (pc !== this.pc) return;
      const st = pc.connectionState;
      clearTimeout(this._discGraceTimer);
      if (st === 'failed') {
        this._markBlocked(new Error('ICE failed'));
      } else if (st === 'disconnected' && this.status === 'open') {
        // Временная заминка радиоканала Wi-Fi (1–4 с): даём ICE 8 секунд ожить самому!
        this._discGraceTimer = setTimeout(() => {
          if (pc === this.pc && pc.connectionState === 'disconnected' && this.status === 'open') {
            this._markBlocked(new Error('Долгая потеря радиоканала (>8 с)'));
          }
        }, 8000);
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc !== this.pc) return;
      const st = pc.iceConnectionState;
      if (st === 'failed') {
        this._markBlocked(new Error('Маршруты ICE не сошлись'));
      }
    };

    return pc;
  }

  _updateIceStepNote() {
    const c = this.localCandidatesCount;
    const note = `Свои пути: Wi-Fi (${c.host}), Интернет STUN (${c.srflx}) · Чужих получено: ${this.remoteCandidatesCount}`;
    const step4 = this.steps.find((s) => s.id === 4);
    if (step4 && step4.state !== 'done') {
      this._setStep(4, 'active', note);
    } else if (step4) {
      step4.note = note;
      this._notify();
    }
  }

  async _handleHelloOnHost(hello) {
    if (!hello || !hello.joySid || hello.joySid === this.joySid) return;
    this._cleanupPeer();
    this.steps = this._freshSteps();
    this.joySid = hello.joySid;
    const useIce = hello.iceMode === 'lan' || this.iceMode === 'lan' ? 'lan' : 'stun';
    this.status = 'signaling';
    this._setStep(1, 'done', 'Джойстик вошёл в комнату и попросил прямой канал');
    this._setStep(2, 'active', 'Собираем SDP Offer и открываем каналы…');
    this._armConnectTimeout();

    await this.signaling.prepareHostHandshake(this.joySid);
    const pc = this._createPeerConnection(useIce);

    // 1) Быстрый игровой канал (UDP-семантика: старые пакеты не задерживают свежие!)
    const fast = pc.createDataChannel('fast', { ordered: false, maxRetransmits: 0 });
    this._bindDataChannel(fast, 'fast');

    // 2) Надёжный канал для команд и виброотклика
    const ctrl = pc.createDataChannel('ctrl', { ordered: true });
    this._bindDataChannel(ctrl, 'ctrl');

    const offer = await pc.createOffer();
    if (pc !== this.pc) return;
    await pc.setLocalDescription(offer);
    await this.signaling.sendOffer({
      joySid: this.joySid,
      iceMode: useIce,
      type: offer.type,
      sdp: offer.sdp,
    });
    this._setStep(2, 'done', 'Анкета Offer отправлена через Firebase');
    this._setStep(3, 'active', 'Ждём SDP Answer от Джойстика…');
  }

  async _handleOfferOnJoy(offer) {
    if (!offer || offer.joySid !== this.joySid) return;
    if (this._answeredSid === offer.joySid) return;
    this._answeredSid = offer.joySid;

    this._setStep(2, 'done', 'Получили анкету Offer от Экрана');
    this._setStep(3, 'active', 'Создаём ответ SDP Answer…');

    const useIce = offer.iceMode === 'lan' || this.iceMode === 'lan' ? 'lan' : 'stun';
    const pc = this._createPeerConnection(useIce);

    pc.ondatachannel = (ev) => {
      if (pc !== this.pc) return;
      const ch = ev.channel;
      this._bindDataChannel(ch, ch.label === 'ctrl' ? 'ctrl' : 'fast');
    };

    await pc.setRemoteDescription({ type: offer.type, sdp: offer.sdp });
    this._remoteDescReady = true;
    await this._flushQueuedCandidates();

    const answer = await pc.createAnswer();
    if (pc !== this.pc) return;
    await pc.setLocalDescription(answer);
    await this.signaling.sendAnswer({
      joySid: this.joySid,
      type: answer.type,
      sdp: answer.sdp,
    });
    this.status = 'connecting';
    this._setStep(3, 'done', 'Ответ Answer отправлен Экрану');
    this._setStep(4, 'active', 'Проверяем прямые маршруты между телефонами…');
  }

  async _handleAnswerOnHost(ans) {
    if (!ans || ans.joySid !== this.joySid || !this.pc) return;
    if (this.pc.signalingState !== 'have-local-offer') return;
    await this.pc.setRemoteDescription({ type: ans.type, sdp: ans.sdp });
    this._remoteDescReady = true;
    this.status = 'connecting';
    this._setStep(3, 'done', 'Ответ Answer принят');
    this._setStep(4, 'active', 'Проверяем прямые маршруты между телефонами…');
    await this._flushQueuedCandidates();
  }

  async _handleRemoteCandidate(candMsg) {
    if (!candMsg || candMsg.joySid !== this.joySid || !candMsg.candidate) return;
    this.remoteCandidatesCount++;
    this._updateIceStepNote();
    const init = {
      candidate: candMsg.candidate,
      sdpMid: candMsg.sdpMid ?? null,
      sdpMLineIndex: candMsg.sdpMLineIndex ?? null,
    };
    if (!this.pc || !this._remoteDescReady) {
      this._queuedCandidates.push(init);
      return;
    }
    await this.pc.addIceCandidate(init);
  }

  async _flushQueuedCandidates() {
    if (!this.pc || !this._remoteDescReady) return;
    const list = this._queuedCandidates.splice(0);
    for (const c of list) {
      try {
        await this.pc.addIceCandidate(c);
      } catch {
        // Игнорируем неподходящий кандидат, остальные маршруты продолжат проверку.
      }
    }
  }

  _bindDataChannel(dc, kind) {
    if (kind === 'fast') this.fastDc = dc;
    else this.ctrlDc = dc;

    dc.onopen = () => {
      if (kind === 'fast') {
        this._clearConnectTimeout();
        this.status = 'open';
        this._setStep(4, 'done');
        this._setStep(5, 'done', 'Канал fast (UDP, 0 ретрансляций) открыт — Firebase больше не нужен!');
        this.inspectRoute();
        clearInterval(this._routePollTimer);
        this._routePollTimer = setInterval(() => this.inspectRoute(), 2500);
        this._notify();
      }
    };

    dc.onclose = () => {
      if (kind === 'fast' && this.status === 'open' && !this.simulatedDrop) {
        this._markBlocked(new Error('DataChannel закрылся'));
      }
    };

    dc.onmessage = (ev) => {
      const raw = typeof ev.data === 'string' ? ev.data : '';
      this.recvPackets++;
      this.recvBytes += raw.length;
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch { return; }
      if (kind === 'fast' && this.onFastMessage) this.onFastMessage(parsed);
      else if (kind === 'ctrl' && this.onCtrlMessage) this.onCtrlMessage(parsed);
    };
  }

  isOpen() {
    return !!(this.status === 'open' && this.fastDc && this.fastDc.readyState === 'open');
  }

  sendFast(obj) {
    if (!this.isOpen()) return false;
    if (this.fastDc.bufferedAmount > MAX_BUFFER_BYTES) return false;
    const raw = JSON.stringify(obj);
    try {
      this.fastDc.send(raw);
      this.sentPackets++;
      this.sentBytes += raw.length;
      return true;
    } catch {
      return false;
    }
  }

  sendCtrl(obj) {
    const ch = this.ctrlDc && this.ctrlDc.readyState === 'open' ? this.ctrlDc : this.fastDc;
    if (!ch || ch.readyState !== 'open') return false;
    const raw = JSON.stringify(obj);
    try {
      ch.send(raw);
      this.sentPackets++;
      this.sentBytes += raw.length;
      return true;
    } catch {
      return false;
    }
  }

  async inspectRoute() {
    if (!this.pc || this.status !== 'open') return this.routeInfo;
    try {
      const stats = await this.pc.getStats();
      const byId = new Map();
      stats.forEach((v) => byId.set(v.id, v));

      let selectedPair = null;
      stats.forEach((report) => {
        if (report.type === 'transport' && report.selectedCandidatePairId) {
          selectedPair = byId.get(report.selectedCandidatePairId) || selectedPair;
        }
      });
      if (!selectedPair) {
        stats.forEach((report) => {
          if (report.type === 'candidate-pair' && report.state === 'succeeded' && (report.nominated || !selectedPair)) {
            selectedPair = report;
          }
        });
      }
      if (!selectedPair) return this.routeInfo;

      const local = byId.get(selectedPair.localCandidateId);
      const remote = byId.get(selectedPair.remoteCandidateId);
      const localType = local?.candidateType || 'unknown';
      const remoteType = remote?.candidateType || 'unknown';
      const protocol = (local?.protocol || remote?.protocol || 'udp').toUpperCase();
      const nativeRttMs = typeof selectedPair.currentRoundTripTime === 'number'
        ? Math.round(selectedPair.currentRoundTripTime * 1000)
        : null;

      const isPrivateAddr = (addr) => {
        if (!addr || typeof addr !== 'string') return false;
        const a = addr.toLowerCase();
        return (
          a.endsWith('.local') ||
          a.startsWith('192.168.') ||
          a.startsWith('10.') ||
          a.startsWith('127.') ||
          a === '::1' ||
          a.startsWith('fe80:') ||
          a.startsWith('fd') ||
          /^172\.(1[6-9]|2\d|3[0-1])\./.test(a)
        );
      };

      const localAddr = local?.address || local?.ip || '';
      const remoteAddr = remote?.address || remote?.ip || '';
      const bothHostOrLanPrflx =
        (localType === 'host' || localType === 'prflx') &&
        (remoteType === 'host' || remoteType === 'prflx') &&
        (
          (localType === 'host' && remoteType === 'host') ||
          this._activeUseIce === 'lan' ||
          (isPrivateAddr(localAddr) && (!remoteAddr || isPrivateAddr(remoteAddr))) ||
          (nativeRttMs !== null && nativeRttMs < 20)
        );

      let kind = 'nat';
      let badgeText = `🟡 Через внешний интернет / NAT (${localType} ↔ ${remoteType}, ${protocol})`;
      let detailText = 'Прямая труба пробилась, но VPN или роутер пустил пакеты через внешний маршрут. Если включить «Доступ к локальной сети» в VPN — пойдёт напрямую по комнате ещё быстрее!';

      if (localType === 'relay' || remoteType === 'relay') {
        kind = 'relay';
        badgeText = `🔵 Через ретранслятор TURN (${protocol})`;
        detailText = 'Прямой проход закрыт сетью, поток идёт через TURN-сервер.';
      } else if (bothHostOrLanPrflx) {
        kind = 'lan';
        badgeText = `🟢 Прямой домашний Wi-Fi (${localType} ↔ ${remoteType}, ${protocol})`;
        detailText = 'Идеальный маршрут! Пакеты летят напрямую между устройствами по локальной сети в обход облака и серверов.';
      }

      this.routeInfo = { kind, localType, remoteType, protocol, nativeRttMs, badgeText, detailText };
      this._notify();
      return this.routeInfo;
    } catch {
      return this.routeInfo;
    }
  }

  _armConnectTimeout() {
    this._clearConnectTimeout();
    this._connectTimer = setTimeout(() => {
      if (this.status !== 'open' && !this.simulatedDrop) {
        this._markBlocked(new Error('Таймаут прямого соединения (9.5 с)'));
      }
    }, CONNECT_TIMEOUT_MS);
  }

  _clearConnectTimeout() {
    if (this._connectTimer) {
      clearTimeout(this._connectTimer);
      this._connectTimer = null;
    }
  }

  _markBlocked(err) {
    if (this.simulatedDrop) return;
    this._clearConnectTimeout();
    this.status = 'blocked';
    const msg = err && err.message ? err.message : 'маршрут закрыт';
    this.routeInfo = {
      kind: 'blocked',
      localType: null,
      remoteType: null,
      protocol: null,
      nativeRttMs: null,
      badgeText: '🔴 Прямой WebRTC заблокирован VPN или строгим NAT',
      detailText: `Причина: ${msg}. Но комната жива — авто-фолбэк ведёт управление через Firebase! Откройте шпаргалку ниже, чтобы подружить VPN с домашним Wi-Fi.`,
    };
    this._setStep(4, 'fail', 'Телефоны не смогли достучаться друг до друга напрямую');
    this._setStep(5, 'fail', 'Активен запасной рельс Firebase Облако');
    this._notify();
  }

  _cleanupPeer() {
    this._clearConnectTimeout();
    clearTimeout(this._discGraceTimer);
    clearInterval(this._routePollTimer);
    this._routePollTimer = null;
    if (this.fastDc) {
      try { this.fastDc.onclose = null; this.fastDc.close(); } catch { /* ignore */ }
      this.fastDc = null;
    }
    if (this.ctrlDc) {
      try { this.ctrlDc.onclose = null; this.ctrlDc.close(); } catch { /* ignore */ }
      this.ctrlDc = null;
    }
    if (this.pc) {
      try {
        this.pc.onconnectionstatechange = null;
        this.pc.oniceconnectionstatechange = null;
        this.pc.onicecandidate = null;
        this.pc.close();
      } catch { /* ignore */ }
      this.pc = null;
    }
  }

  getSnapshot() {
    return {
      status: this.status,
      simulatedDrop: this.simulatedDrop,
      iceMode: this.iceMode,
      sentPackets: this.sentPackets,
      recvPackets: this.recvPackets,
      sentBytes: this.sentBytes,
      recvBytes: this.recvBytes,
      localCandidates: { ...this.localCandidatesCount },
      remoteCandidates: this.remoteCandidatesCount,
      route: { ...this.routeInfo },
      steps: this.steps.map((s) => ({ ...s })),
    };
  }

  destroy() {
    this._cleanupPeer();
  }
}
