// audio.js — procedural WebAudio: no asset files, everything is synthesised.
// The context is only created after the first user gesture (browser requirement).

export function createAudio() {
  let ctx = null;
  let master = null;
  let ambientGain = null;
  let muted = false;
  let started = false;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.75;
    master.connect(ctx.destination);
    return ctx;
  }

  function noiseBuffer(seconds = 0.4) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function startAmbient() {
    if (!ctx || started) return;
    started = true;
    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.0001;
    ambientGain.connect(master);
    ambientGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 3);

    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 52;
    const drone2 = ctx.createOscillator();
    drone2.type = 'sine';
    drone2.frequency.value = 78.5;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 260;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 110;
    lfo.connect(lfoGain);
    lfoGain.connect(lp.frequency);
    const g = ctx.createGain();
    g.gain.value = 0.55;
    drone.connect(lp);
    drone2.connect(g);
    g.connect(lp);
    lp.connect(ambientGain);
    drone.start();
    drone2.start();
    lfo.start();

    // watery bubbles bed
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(2);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 700;
    bp.Q.value = 0.7;
    const ng = ctx.createGain();
    ng.gain.value = 0.05;
    const nLfo = ctx.createOscillator();
    nLfo.frequency.value = 0.23;
    const nLfoGain = ctx.createGain();
    nLfoGain.gain.value = 0.035;
    nLfo.connect(nLfoGain);
    nLfoGain.connect(ng.gain);
    src.connect(bp);
    bp.connect(ng);
    ng.connect(ambientGain);
    src.start();
    nLfo.start();
  }

  function blip({ freq = 440, to = 220, dur = 0.12, type = 'triangle', vol = 0.3, delay = 0 }) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function noiseHit({ freq = 900, dur = 0.18, vol = 0.25, q = 1.2, delay = 0 }) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(Math.max(0.12, dur));
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(freq, t);
    bp.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 0.35), t + dur);
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  return {
    unlock() {
      const c = ensure();
      if (!c) return;
      if (c.state === 'suspended') c.resume();
      startAmbient();
    },
    get ready() { return !!ctx; },
    setMuted(value) {
      muted = value;
      if (master) master.gain.value = muted ? 0 : 0.75;
      return muted;
    },
    isMuted() { return muted; },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); },
    resume() { if (ctx && ctx.state === 'suspended' && !muted) ctx.resume(); },
    eat(size = 1) {
      const base = 380 + Math.min(320, 90 / Math.max(0.4, size));
      blip({ freq: base, to: base * 0.55, dur: 0.1, type: 'triangle', vol: 0.22 });
      noiseHit({ freq: 1400, dur: 0.08, vol: 0.1 });
    },
    bigEat() {
      blip({ freq: 260, to: 130, dur: 0.22, type: 'sawtooth', vol: 0.2 });
      noiseHit({ freq: 700, dur: 0.24, vol: 0.2 });
      blip({ freq: 720, to: 420, dur: 0.14, type: 'sine', vol: 0.16, delay: 0.05 });
    },
    hurt() {
      blip({ freq: 180, to: 70, dur: 0.24, type: 'square', vol: 0.18 });
      noiseHit({ freq: 420, dur: 0.2, vol: 0.2, q: 0.8 });
    },
    dash() { noiseHit({ freq: 1600, dur: 0.3, vol: 0.18, q: 0.6 }); },
    grow() {
      [0, 0.09, 0.18, 0.3].forEach((d, i) => blip({ freq: 420 + i * 130, to: 520 + i * 150, dur: 0.22, type: 'sine', vol: 0.16, delay: d }));
      noiseHit({ freq: 900, dur: 0.5, vol: 0.12, q: 0.5 });
    },
    mutate() {
      [523, 659, 784, 1046].forEach((f, i) => blip({ freq: f, to: f * 1.01, dur: 0.5, type: 'sine', vol: 0.14, delay: i * 0.12 }));
    },
    win() {
      [523, 659, 784, 1046, 1318].forEach((f, i) => blip({ freq: f, to: f, dur: 0.55, type: 'triangle', vol: 0.17, delay: i * 0.16 }));
    },
    softDefeat() {
      [330, 262, 208].forEach((f, i) => blip({ freq: f, to: f * 0.98, dur: 0.45, type: 'sine', vol: 0.15, delay: i * 0.14 }));
    },
    shock() {
      noiseHit({ freq: 2600, dur: 0.22, vol: 0.2, q: 2.4 });
      blip({ freq: 900, to: 300, dur: 0.18, type: 'square', vol: 0.12 });
    },
  };
}
