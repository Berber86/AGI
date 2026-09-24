// ZenAudio.js - Pure Web Audio API synthesized Japanese soundscape & sound effects
export class ZenAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.ambientRunning = false;
    this.ambientTimer = null;
    this.shishiTimer = null;
    this.windChimeTimer = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    this.masterGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    if (!this.masterGain) return;
    this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Japanese Rin Gong / Singing Bowl (Рин - поющая чаша)
  playRinGong(freq = 440) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const duration = 5.0;

    // Fundamental + bell overtones
    const partials = [
      { f: freq, gain: 0.6, decay: 4.5 },
      { f: freq * 2.76, gain: 0.25, decay: 3.2 },
      { f: freq * 5.4, gain: 0.12, decay: 2.1 },
      { f: freq * 8.9, gain: 0.05, decay: 1.2 }
    ];

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, t);
      // Subtle vibrato/detune
      osc.frequency.linearRampToValueAtTime(p.f * 0.998, t + duration);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(p.gain, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + p.decay);
    });
  }

  // Pruning Shears (Ножницы Сэнтэй - резкий металлический щелчок)
  playShearsCut() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Metallic resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.09);

    // Friction snap (noise)
    const bufferSize = this.ctx.sampleRate * 0.05;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.setValueAtTime(3.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    whiteNoise.start(t);
    whiteNoise.stop(t + 0.05);
  }

  // Watering sound (Полив - мягкий шелест воды)
  playWatering() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const duration = 1.6;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(800, t + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(1400, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.2);
    gain.gain.linearRampToValueAtTime(0.25, t + duration - 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  // Wire bend / wood tension (Хариганэ - скрип дерева и проволоки)
  playWireBend() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(260, t + 0.12);
    osc.frequency.linearRampToValueAtTime(140, t + 0.25);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  // Carving Jin deadwood (Резьба Дзин - стружка сухой древесины)
  playCarveJin() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.25;
    const bufSize = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.7;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.linearRampToValueAtTime(2400, t + dur);
    filter.Q.setValueAtTime(3.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + dur);
  }

  // Shishi-Odoshi (Бамбуковый фонтан: стук бамбука о камень + всплеск)
  playShishiOdoshi() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Hollow wood/bamboo knock (Dual resonant pulses)
    [310, 520, 890].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.12);

      const amp = [0.4, 0.25, 0.15][idx];
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.15);
    });

    // Bamboo stone clack noise
    const bufferSize = this.ctx.sampleRate * 0.08;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, t);
    filter.Q.setValueAtTime(2.5, t);

    const ngain = this.ctx.createGain();
    ngain.gain.setValueAtTime(0.35, t);
    ngain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noise.connect(filter);
    filter.connect(ngain);
    ngain.connect(this.sfxGain);
    noise.start(t);
    noise.stop(t + 0.08);

    // Followed by gentle water trickle
    setTimeout(() => {
      if (this.ctx && !this.isMuted) {
        this.playWaterTrickle();
      }
    }, 180);
  }

  playWaterTrickle() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const dur = 1.0;
    const bsize = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, bsize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bsize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const s = this.ctx.createBufferSource();
    s.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(1100, t);
    f.Q.setValueAtTime(3.0, t);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);

    s.connect(f);
    f.connect(g);
    g.connect(this.ambientGain);
    s.start(t);
    s.stop(t + dur);
  }

  // Wind chime (Фурин - легкий хрустальный перезвон на ветру)
  playWindChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Japanese Pentatonic notes (Insen scale): D, Eb, G, A, C (high octaves)
    const baseFreqs = [1174.66, 1244.51, 1567.98, 1760.00, 2093.00, 2349.32];
    const notesCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < notesCount; i++) {
      const noteDelay = i * (0.09 + Math.random() * 0.12);
      const freq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
      const startTime = t + noteDelay;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(startTime);
      osc.stop(startTime + 1.85);
    }
  }

  // Ambient Japanese Zen Flute & Atmosphere
  startAmbient() {
    if (this.ambientRunning) return;
    this.ensureContext();
    this.ambientRunning = true;

    // Periodic Shakuhachi-style meditative tone
    const playZenTone = () => {
      if (!this.ambientRunning || this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      // Insen Scale D4, Eb4, G4, A4, C5
      const notes = [293.66, 311.13, 392.00, 440.00, 523.25, 587.33];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const dur = 4.5 + Math.random() * 2.5;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      // Subtle breath vibrato
      osc.frequency.linearRampToValueAtTime(freq * 1.005, t + dur * 0.5);
      osc.frequency.linearRampToValueAtTime(freq * 0.998, t + dur);

      // Soft swell
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 1.2);
      gain.gain.linearRampToValueAtTime(0.05, t + dur - 1.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      // Lowpass to give warm wooden flute warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(t);
      osc.stop(t + dur);

      // Schedule next tone
      this.ambientTimer = setTimeout(playZenTone, (dur + 3.0 + Math.random() * 5.0) * 1000);
    };

    // Shishi-odoshi cycling every 18-28 seconds
    const scheduleShishi = () => {
      if (!this.ambientRunning) return;
      this.playShishiOdoshi();
      this.shishiTimer = setTimeout(scheduleShishi, (18 + Math.random() * 10) * 1000);
    };

    // Wind chime cycling every 12-22 seconds
    const scheduleWindChime = () => {
      if (!this.ambientRunning) return;
      if (Math.random() > 0.3) {
        this.playWindChime();
      }
      this.windChimeTimer = setTimeout(scheduleWindChime, (12 + Math.random() * 10) * 1000);
    };

    playZenTone();
    this.shishiTimer = setTimeout(scheduleShishi, 8000);
    this.windChimeTimer = setTimeout(scheduleWindChime, 4000);
  }

  stopAmbient() {
    this.ambientRunning = false;
    if (this.ambientTimer) clearTimeout(this.ambientTimer);
    if (this.shishiTimer) clearTimeout(this.shishiTimer);
    if (this.windChimeTimer) clearTimeout(this.windChimeTimer);
  }
}

export const zenAudio = new ZenAudio();
