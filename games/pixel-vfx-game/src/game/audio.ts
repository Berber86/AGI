// Procedural WebAudio: nothing to download, and it only starts after a real gesture. Fire crackle is a
// filtered noise bed; hits, pickups and chimes are short shaped tones.

export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private fireGain: GainNode | null = null;
  private unlocked = false;
  muted = false;

  get ready(): boolean {
    return this.unlocked;
  }

  /** Call from a pointer handler: browsers only allow audio to start on a gesture. */
  unlock(): void {
    if (this.unlocked) {
      void this.ctx?.resume();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.7;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.unlocked = true;
    this.startFire();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
  }

  suspend(): void {
    void this.ctx?.suspend();
  }

  resume(): void {
    void this.ctx?.resume();
  }

  private noiseBuffer(seconds = 2): AudioBuffer | null {
    if (!this.ctx) return null;
    const len = Math.floor(this.ctx.sampleRate * seconds);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buf;
  }

  private startFire(): void {
    const ctx = this.ctx;
    const master = this.master;
    const buf = this.noiseBuffer(3);
    if (!ctx || !master || !buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 480;
    const gain = ctx.createGain();
    gain.gain.value = 0.16;
    // slow breathing so the fire is never a static hiss
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.23;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain).connect(gain.gain);
    src.connect(lp).connect(gain).connect(master);
    src.start();
    lfo.start();
    this.fireGain = gain;
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    vol: number,
    slideTo?: number,
    delay = 0,
  ): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || this.muted) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, vol: number, freq: number, q = 1, delay = 0): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || this.muted) return;
    const buf = this.noiseBuffer(0.5);
    if (!buf) return;
    const t0 = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq;
    bp.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(gain).connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  strike(): void {
    this.noise(0.13, 0.16, 1900, 0.8);
    this.tone(320, 0.08, "triangle", 0.05, 180);
  }

  hitCreature(): void {
    this.noise(0.1, 0.2, 700, 1.2);
    this.tone(120, 0.12, "square", 0.07, 70);
  }

  kill(): void {
    this.noise(0.22, 0.16, 420, 0.9);
    this.tone(90, 0.2, "sawtooth", 0.05, 55);
  }

  pickup(): void {
    this.tone(660, 0.1, "triangle", 0.09, 990);
  }

  bank(): void {
    this.tone(523, 0.12, "sine", 0.11);
    this.tone(784, 0.16, "sine", 0.09, undefined, 0.07);
    this.tone(1046, 0.2, "sine", 0.06, undefined, 0.15);
  }

  damage(): void {
    this.tone(140, 0.22, "sawtooth", 0.1, 60);
    this.noise(0.2, 0.18, 300, 0.7);
  }

  over(): void {
    this.tone(392, 0.3, "triangle", 0.1, 196);
    this.tone(196, 0.6, "sine", 0.08, 98, 0.18);
  }

  start(): void {
    this.tone(392, 0.12, "triangle", 0.07);
    this.tone(587, 0.16, "triangle", 0.06, undefined, 0.09);
  }

  /** The fire dies down as the night closes in: quiet, but it is the only warning the player gets. */
  setNight(night: number): void {
    if (this.fireGain && this.ctx) {
      const target = 0.16 * (1 - night * 0.5);
      this.fireGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.4);
    }
  }
}
