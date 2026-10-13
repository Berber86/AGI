/**
 * All sound is synthesised in the browser: no audio files ship with the game.
 * Voice lines use the Web Speech API when a Russian voice exists; when it does
 * not, the game falls back to musical cues and never breaks.
 */
import { readStore, writeStore } from './storage';

export class AudioKit {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private engine: { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode; lfo: OscillatorNode } | null = null;
  private musicTimer: number | null = null;
  private nextChordTime = 0;
  private chordIndex = 0;
  private voice: SpeechSynthesisVoice | null = null;
  private voiceChecked = false;
  private lastSpeakAt = 0;

  muted = false;

  constructor() {
    this.muted = readStore('quiet-race-muted') === '1';
  }

  /** Must be called from a user gesture (a tap) before anything can be heard. */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.9;
        this.master.connect(this.ctx.destination);
        this.sfxBus = this.ctx.createGain();
        this.sfxBus.gain.value = 0.9;
        this.sfxBus.connect(this.master);
        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.value = 0.55;
        this.musicBus.connect(this.master);
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      this.pickVoice();
    } catch {
      this.ctx = null;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    writeStore('quiet-race-muted', muted ? '1' : '0');
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
    }
    if (muted && typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
  }

  private pickVoice(): void {
    if (this.voiceChecked || typeof speechSynthesis === 'undefined') return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    this.voiceChecked = true;
    this.voice =
      voices.find((item) => item.lang?.toLowerCase().startsWith('ru')) ??
      voices.find((item) => item.lang?.toLowerCase().startsWith('ru')) ??
      null;
  }

  /** Speaks a short Russian phrase; silently does nothing when unsupported. */
  speak(text: string, options: { rate?: number; pitch?: number; minGapMs?: number } = {}): void {
    if (this.muted || typeof speechSynthesis === 'undefined') return;
    this.pickVoice();
    if (!this.voice) return;
    const now = Date.now();
    if (now - this.lastSpeakAt < (options.minGapMs ?? 250)) return;
    this.lastSpeakAt = now;
    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.lang = this.voice.lang || 'ru-RU';
      utterance.rate = options.rate ?? 0.92;
      utterance.pitch = options.pitch ?? 1.15;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    } catch {
      /* speech is a bonus, never a requirement */
    }
  }

  private tone(
    freq: number,
    durationMs: number,
    options: { type?: OscillatorType; gain?: number; delayMs?: number; slideTo?: number; bus?: GainNode | null } = {},
  ): void {
    if (!this.ctx || !this.sfxBus) return;
    const bus = options.bus ?? this.sfxBus;
    if (!bus) return;
    const start = this.ctx.currentTime + (options.delayMs ?? 0) / 1000;
    const end = start + durationMs / 1000;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = options.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (options.slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, options.slideTo), end);
    }
    const peak = options.gain ?? 0.22;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain);
    gain.connect(bus);
    osc.start(start);
    osc.stop(end + 0.05);
  }

  countdown(n: number): void {
    this.tone(520 + (3 - n) * 60, 220, { type: 'triangle', gain: 0.25 });
    this.tone(1040 + (3 - n) * 120, 120, { type: 'sine', gain: 0.08, delayMs: 10 });
  }

  go(): void {
    [660, 880, 1100].forEach((freq, index) => {
      this.tone(freq, 420, { type: 'triangle', gain: 0.22, delayMs: index * 70 });
    });
  }

  balloon(): void {
    [880, 1320].forEach((freq, index) => {
      this.tone(freq, 220, { type: 'sine', gain: 0.2, delayMs: index * 90 });
    });
  }

  overtake(): void {
    [660, 990, 1320].forEach((freq, index) => {
      this.tone(freq, 260, { type: 'triangle', gain: 0.18, delayMs: index * 80 });
    });
  }

  honk(): void {
    this.tone(420, 160, { type: 'square', gain: 0.08 });
    this.tone(560, 160, { type: 'square', gain: 0.06, delayMs: 20 });
  }

  splash(): void {
    this.tone(320, 260, { type: 'sine', gain: 0.16, slideTo: 680 });
    this.tone(180, 200, { type: 'sine', gain: 0.1, slideTo: 120, delayMs: 40 });
  }

  hop(): void {
    this.tone(240, 200, { type: 'triangle', gain: 0.16, slideTo: 520 });
  }

  grassHint(): void {
    this.tone(300, 260, { type: 'sine', gain: 0.12, slideTo: 380 });
  }

  touch(): void {
    this.tone(760, 90, { type: 'sine', gain: 0.12 });
  }

  finish(): void {
    const notes = [523, 659, 784, 1046, 1318];
    notes.forEach((freq, index) => {
      this.tone(freq, 520, { type: 'triangle', gain: 0.2, delayMs: index * 150 });
    });
    this.tone(160, 400, { type: 'sine', gain: 0.12, slideTo: 90, delayMs: 60 });
  }

  startEngine(): void {
    if (!this.ctx || !this.master) return;
    if (this.engine) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = 90;
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      gain.gain.value = 0.0;

      lfo.type = 'sine';
      lfo.frequency.value = 7;
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      osc.start();
      lfo.start();
      gain.gain.setTargetAtTime(0.06, this.ctx.currentTime, 0.3);
      this.engine = { osc, gain, filter, lfo };
    } catch {
      this.engine = null;
    }
  }

  updateEngine(speedFactor: number): void {
    if (!this.ctx || !this.engine) return;
    const freq = 78 + Math.max(0, Math.min(1.4, speedFactor)) * 60;
    this.engine.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.2);
    this.engine.filter.frequency.setTargetAtTime(420 + speedFactor * 220, this.ctx.currentTime, 0.2);
  }

  stopEngine(): void {
    if (!this.ctx || !this.engine) return;
    const { osc, gain, lfo } = this.engine;
    try {
      gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      osc.stop(this.ctx.currentTime + 0.6);
      lfo.stop(this.ctx.currentTime + 0.6);
    } catch {
      /* already stopped */
    }
    this.engine = null;
  }

  startMusic(): void {
    if (!this.ctx || !this.musicBus || this.musicTimer !== null) return;
    this.nextChordTime = this.ctx.currentTime + 0.2;
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), 400);
    this.scheduleMusic();
  }

  stopMusic(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private scheduleMusic(): void {
    if (!this.ctx || !this.musicBus || this.muted) return;
    const chords = [
      [261.6, 329.6, 392.0],
      [196.0, 246.9, 392.0],
      [220.0, 261.6, 329.6],
      [174.6, 220.0, 349.2],
    ];
    while (this.nextChordTime < this.ctx.currentTime + 1.2) {
      const chord = chords[this.chordIndex % chords.length];
      const start = this.nextChordTime;
      const duration = 2.2;
      chord.forEach((freq, voice) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = voice === 0 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.6);
        gain.gain.linearRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(this.musicBus!);
        osc.start(start);
        osc.stop(start + duration + 0.1);
      });
      // A soft bell on top keeps it playful without being busy.
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.value = chord[2] * 2;
      bellGain.gain.setValueAtTime(0.0001, start + 0.4);
      bellGain.gain.linearRampToValueAtTime(0.05, start + 0.5);
      bellGain.gain.linearRampToValueAtTime(0.0001, start + 1.4);
      bell.connect(bellGain);
      bellGain.connect(this.musicBus);
      bell.start(start + 0.4);
      bell.stop(start + 1.6);

      this.nextChordTime += duration;
      this.chordIndex += 1;
    }
  }
}

export const audio = new AudioKit();
