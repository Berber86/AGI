// audio.js — звук без файлов: всё синтезируется в WebAudio на месте.
// Мобильные браузеры требуют разблокировки звука жестом — unlock() вызывается из меню.

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicOn = true;
    this.master = null;
    this.musicTimer = 0;
    this.musicStep = 0;
    this._lastPlay = {};
  }

  unlock() {
    if (!this.ctx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.35;
        this.master.connect(this.ctx.destination);
      } catch (e) { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setEnabled(on) { this.enabled = on; if (this.master) this.master.gain.value = on ? 0.35 : 0; }
  setMusic(on) { this.musicOn = on; }

  // ---- базовые строители ----
  tone({ freq = 440, dur = 0.15, type = 'sine', vol = 0.3, slide = 0, delay = 0, attack = 0.006 }) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  noise({ dur = 0.2, vol = 0.25, freq = 800, q = 1, delay = 0, sweep = 0 }) {
    if (!this.ctx || !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.setValueAtTime(freq, t0); filt.Q.value = q;
    if (sweep) filt.frequency.exponentialRampToValueAtTime(Math.max(40, freq + sweep), t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt); filt.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  // ---- игровые звуки (с защитой от спама) ----
  play(name, opts = {}) {
    const now = performance.now();
    if (this._lastPlay[name] && now - this._lastPlay[name] < 45) return;
    this._lastPlay[name] = now;
    switch (name) {
      case 'eat': this.tone({ freq: 420 + Math.random() * 120, dur: 0.09, type: 'triangle', vol: 0.16, slide: 180 }); break;
      case 'bite': this.noise({ dur: 0.12, vol: 0.22, freq: 520, q: 0.8, sweep: -380 }); break;
      case 'kill':
        this.noise({ dur: 0.3, vol: 0.3, freq: 320, q: 0.7, sweep: -260 });
        this.tone({ freq: 180, dur: 0.28, type: 'sawtooth', vol: 0.14, slide: -90 });
        break;
      case 'hurt': this.tone({ freq: 210, dur: 0.22, type: 'square', vol: 0.18, slide: -110 }); break;
      case 'dash': this.noise({ dur: 0.24, vol: 0.24, freq: 900, q: 0.6, sweep: 700 }); break;
      case 'grow':
        [0, 0.09, 0.18].forEach((d, i) => this.tone({ freq: 320 * (1 + i * 0.35), dur: 0.3, type: 'sine', vol: 0.2, delay: d }));
        break;
      case 'evolve':
        [0, 0.1, 0.2, 0.32].forEach((d, i) => this.tone({ freq: 420 * Math.pow(1.26, i), dur: 0.4, type: 'triangle', vol: 0.16, delay: d }));
        break;
      case 'relic':
        [0, 0.12, 0.26].forEach((d, i) => this.tone({ freq: 660 * Math.pow(1.5, i), dur: 0.6, type: 'sine', vol: 0.2, delay: d }));
        break;
      case 'shock': this.noise({ dur: 0.35, vol: 0.32, freq: 1600, q: 0.5, sweep: -1200 }); break;
      case 'sonic': this.tone({ freq: 820, dur: 0.5, type: 'sine', vol: 0.22, slide: -620 }); break;
      case 'toxin': this.noise({ dur: 0.5, vol: 0.2, freq: 420, q: 0.4, sweep: -200 }); break;
      case 'win':
        [0, 0.16, 0.32, 0.5, 0.72].forEach((d, i) => this.tone({ freq: 392 * Math.pow(1.19, i), dur: 0.75, type: 'triangle', vol: 0.2, delay: d }));
        break;
      case 'death':
        [0, 0.22, 0.5].forEach((d, i) => this.tone({ freq: 220 / (1 + i * 0.35), dur: 0.9, type: 'sawtooth', vol: 0.18, delay: d }));
        break;
      case 'ui': this.tone({ freq: 620, dur: 0.06, type: 'triangle', vol: 0.12 }); break;
      case 'quest':
        [0, 0.1, 0.22].forEach((d, i) => this.tone({ freq: 520 + i * 160, dur: 0.3, type: 'sine', vol: 0.16, delay: d }));
        break;
      case 'event': this.tone({ freq: 300, dur: 0.7, type: 'sine', vol: 0.16, slide: 260 }); break;
      case 'dance':
        [0, 0.12, 0.24, 0.36].forEach((d, i) => this.tone({ freq: 520 * Math.pow(1.12, i), dur: 0.24, type: 'triangle', vol: 0.13, delay: d }));
        break;
      case 'boss':
        [0, 0.3, 0.6].forEach((d, i) => this.tone({ freq: 90 - i * 12, dur: 1.2, type: 'sawtooth', vol: 0.24, delay: d }));
        break;
      default: break;
    }
  }

  // ---- эмбиент: медленная пентатоника, «дыхание» океана ----
  updateMusic(dt, intensity = 0.5) {
    if (!this.ctx || !this.musicOn || !this.enabled) return;
    this.musicTimer -= dt;
    if (this.musicTimer > 0) return;
    this.musicTimer = 2.4 + Math.random() * 2.6;
    const scale = [220, 261.63, 293.66, 349.23, 392, 523.25];
    const f = scale[this.musicStep % scale.length] * (Math.random() < 0.3 ? 0.5 : 1);
    this.musicStep++;
    this.tone({ freq: f, dur: 2.6, type: 'sine', vol: 0.05 + intensity * 0.05 });
    if (Math.random() < 0.4) this.tone({ freq: f * 2, dur: 1.8, type: 'triangle', vol: 0.02 + intensity * 0.02, delay: 0.4 });
    if (intensity > 0.6) this.noise({ dur: 2.2, vol: 0.03, freq: 260, q: 0.4 });
  }
}
