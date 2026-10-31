// Синтезированные звуки (WebAudio): никаких файлов, работает офлайн.
let ctx = null;
let enabled = true;

export function setSoundEnabled(on) {
  enabled = on;
}

/** Вызывать из обработчика касания: браузеры разрешают звук только после жеста. */
export function unlockAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    ctx = null;
  }
}

export function suspendAudio() {
  if (ctx && ctx.state === 'running') ctx.suspend();
}

function tone(freq, start, dur, { type = 'sine', vol = 0.18, slide = 0 } = {}) {
  if (!ctx || !enabled) return;
  const t0 = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

function noise(start, dur, vol = 0.2) {
  if (!ctx || !enabled) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = vol;
  src.buffer = buf;
  src.connect(g).connect(ctx.destination);
  src.start(ctx.currentTime + start);
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, { type: 'triangle', vol: 0.12 }),
  shutter: () => {
    noise(0, 0.07, 0.25);
    noise(0.09, 0.05, 0.15);
  },
  pop: (i = 0) => tone(392 * 2 ** (i / 7), 0, 0.12, { type: 'triangle', vol: 0.14 }),
  success: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, { type: 'triangle', vol: 0.16 })),
  star: () => [1319, 1568, 2093].forEach((f, i) => tone(f, i * 0.07, 0.25, { vol: 0.1 })),
  almost: () => {
    tone(440, 0, 0.18, { type: 'sine', vol: 0.14 });
    tone(370, 0.18, 0.3, { type: 'sine', vol: 0.14, slide: -40 });
  },
  scan: () => tone(300, 0, 0.6, { type: 'sine', vol: 0.05, slide: 600 }),
};
