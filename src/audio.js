export class ExpeditionAudio {
  constructor() {
    this.enabled = false;
    this.volume = 0.35;
  }
  async toggle() {
    if (!this.context) this.init();
    if (this.context.state === "suspended") await this.context.resume();
    this.enabled = !this.enabled;
    this.master.gain.setTargetAtTime(
      this.enabled ? this.volume : 0,
      this.context.currentTime,
      0.5,
    );
    return this.enabled;
  }
  init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    const c = this.context;
    this.master = c.createGain();
    this.master.gain.value = 0;
    this.master.connect(c.destination);
    const buf = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + (Math.random() * 2 - 1) * 0.02) / 1.02;
      data[i] = last * 3.5;
    }
    const wind = c.createBufferSource();
    wind.buffer = buf;
    wind.loop = true;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    const gain = c.createGain();
    gain.gain.value = 0.45;
    wind.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    wind.start();
    for (const [f, v] of [
      [55, 0.07],
      [82.41, 0.025],
      [110.1, 0.025],
      [164.81, 0.009],
    ]) {
      const osc = c.createOscillator(),
        g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.value = v;
      osc.connect(g);
      g.connect(this.master);
      osc.start();
    }
  }
  setVolume(v) {
    this.volume = v;
    if (this.context && this.enabled)
      this.master.gain.setTargetAtTime(v, this.context.currentTime, 0.1);
  }
  tone(freq = 440, duration = 0.3, delay = 0) {
    if (!this.enabled || !this.context) return;
    const c = this.context,
      t = c.currentTime + delay,
      o = c.createOscillator(),
      g = c.createGain();
    o.frequency.setValueAtTime(freq, t);
    o.type = "sine";
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.025);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + duration + 0.05);
  }
  scan() {
    this.tone(220, 0.8);
    this.tone(330, 0.9, 0.25);
    this.tone(440, 1, 0.5);
  }
  discovery() {
    [329.63, 440, 659.25, 880].forEach((n, i) => this.tone(n, 1.2, i * 0.16));
  }
}
