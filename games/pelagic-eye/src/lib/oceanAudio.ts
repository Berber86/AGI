/**
 * Синтезированная подводная атмосфера: без внешних файлов, чтобы сборка
 * оставалась одним документом. Стартует только по явному жесту пользователя.
 */
export class OceanAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;
  private started = false;

  async start() {
    if (this.started) {
      await this.resume();
      this.setEnabled(true);
      return;
    }
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    try {
      const ctx = new AudioCtor();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      this.master = master;

      const ambience = ctx.createGain();
      ambience.gain.value = 0.28;
      ambience.connect(master);

      // Мягкий шум океана + подводное «одеяло».
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 5, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = last * 0.985 + white * 0.015;
        data[i] = last * 2.8;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 480;
      lowpass.Q.value = 0.8;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.3;
      noise.connect(lowpass).connect(noiseGain).connect(ambience);
      noise.start();

      // Медленная модуляция «дыхания» воды.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.055;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 160;
      lfo.connect(lfoGain).connect(lowpass.frequency);
      lfo.start();

      // Две низкие дроны, создающие объём.
      [46, 55.5, 73.2].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const gain = ctx.createGain();
        gain.gain.value = index === 2 ? 0.008 : 0.028;
        const pan = ctx.createStereoPanner();
        pan.pan.value = index === 0 ? -0.4 : index === 1 ? 0.45 : 0;
        osc.connect(gain).connect(pan).connect(ambience);
        osc.start();
      });

      // Воздушный «шлейф» высоких частиц.
      const shimmerFilter = ctx.createBiquadFilter();
      shimmerFilter.type = "bandpass";
      shimmerFilter.frequency.value = 2400;
      shimmerFilter.Q.value = 0.55;
      const shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0.018;
      const shimmer = ctx.createBufferSource();
      shimmer.buffer = noiseBuffer;
      shimmer.loop = true;
      shimmer.connect(shimmerFilter).connect(shimmerGain).connect(ambience);
      shimmer.start();

      this.started = true;
      await this.resume();
      this.setEnabled(true, true);
    } catch {
      // Аудио не критично для наблюдения.
    }
  }

  async resume() {
    if (this.ctx?.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        /* no-op */
      }
    }
  }

  setEnabled(on: boolean, immediate = false) {
    this.enabled = on;
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(on ? 0.5 : 0, now, immediate ? 0.05 : 0.5);
  }

  get isEnabled() {
    return this.enabled;
  }

  setLevel(level: number) {
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(this.enabled ? level : 0, this.ctx.currentTime, 0.2);
  }

  playBubble() {
    if (!this.ctx || !this.enabled || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const start = 380 + Math.random() * 420;
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(start * 2.4, now + 0.1);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    const pan = ctx.createStereoPanner();
    pan.pan.value = Math.random() * 1.4 - 0.7;
    osc.connect(gain).connect(pan).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playWhaleCall() {
    if (!this.ctx || !this.enabled || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const group = ctx.createGain();
    group.gain.setValueAtTime(0.0001, now);
    group.gain.exponentialRampToValueAtTime(0.16, now + 0.45);
    group.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    const pan = ctx.createStereoPanner();
    pan.pan.value = -0.25;
    group.connect(filter).connect(pan).connect(this.master);

    const fundamental = ctx.createOscillator();
    fundamental.type = "sine";
    fundamental.frequency.setValueAtTime(178, now);
    fundamental.frequency.linearRampToValueAtTime(84, now + 2.1);
    fundamental.frequency.linearRampToValueAtTime(52, now + 3.7);
    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.value = 0.7;
    fundamental.connect(fundamentalGain).connect(group);

    const overtone = ctx.createOscillator();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(263, now + 0.1);
    overtone.frequency.linearRampToValueAtTime(154, now + 2.4);
    overtone.frequency.linearRampToValueAtTime(104, now + 3.6);
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.value = 0.2;
    overtone.connect(overtoneGain).connect(group);

    fundamental.start(now);
    overtone.start(now + 0.08);
    fundamental.stop(now + 4);
    overtone.stop(now + 4);
  }

  dispose() {
    if (this.ctx) {
      this.ctx.close().catch(() => undefined);
    }
    this.ctx = null;
    this.master = null;
    this.started = false;
    this.enabled = false;
  }
}
