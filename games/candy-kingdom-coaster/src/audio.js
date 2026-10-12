// Tiny WebAudio SFX synth — no network assets. Short candy sounds + finish fanfare.
import { Storage } from './storage.js';

let ctx = null;
let master = null;
let muted = Storage.getMuted();

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.85;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ f0 = 440, f1 = f0, t = 0.12, type = 'triangle', gain = 0.22, when = 0, curve = 'exp' }) {
  const c = ensure(); if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(Math.max(1, f0), t0);
  if (f1 !== f0) {
    if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + t);
    else o.frequency.linearRampToValueAtTime(Math.max(1, f1), t0 + t);
  }
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + t + 0.05);
}

function noise({ t = 0.18, gain = 0.16, when = 0, filterFrom = 2400, filterTo = 520 }) {
  const c = ensure(); if (!c) return;
  const t0 = c.currentTime + when;
  const len = Math.max(1, Math.floor(c.sampleRate * t));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
  f.frequency.setValueAtTime(filterFrom, t0);
  f.frequency.exponentialRampToValueAtTime(Math.max(80, filterTo), t0 + t);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t0);
}

const SOUNDS = {
  candy() {
    const base = 620 + Math.random() * 180;
    tone({ f0: base, f1: base * 1.5, t: 0.11, type: 'triangle', gain: 0.24 });
    tone({ f0: base * 2, t: 0.06, type: 'sine', gain: 0.10, when: 0.02 });
  },
  star() {
    const base = 780;
    tone({ f0: base, t: 0.09, type: 'triangle', gain: 0.18 });
    tone({ f0: base * 1.26, t: 0.09, type: 'triangle', gain: 0.18, when: 0.07 });
    tone({ f0: base * 1.6, t: 0.16, type: 'triangle', gain: 0.2, when: 0.14 });
  },
  cupcake() {
    tone({ f0: 320, f1: 720, t: 0.16, type: 'square', gain: 0.10 });
    tone({ f0: 520, f1: 980, t: 0.18, type: 'triangle', gain: 0.18, when: 0.08 });
  },
  boost() {
    noise({ t: 0.5, gain: 0.2, filterFrom: 500, filterTo: 3200 });
    tone({ f0: 220, f1: 880, t: 0.45, type: 'sawtooth', gain: 0.08 });
  },
  click() { tone({ f0: 820, f1: 640, t: 0.055, type: 'triangle', gain: 0.18 }); },
  beep() { tone({ f0: 560, t: 0.12, type: 'triangle', gain: 0.22 }); },
  go() {
    tone({ f0: 720, t: 0.18, type: 'triangle', gain: 0.24 });
    tone({ f0: 1080, t: 0.28, type: 'triangle', gain: 0.2, when: 0.1 });
  },
  bump() {
    tone({ f0: 180, f1: 90, t: 0.1, type: 'sine', gain: 0.16 });
    noise({ t: 0.08, gain: 0.08, filterFrom: 380, filterTo: 160 });
  },
  knock() {
    // woody candy-cane topple
    tone({ f0: 420, f1: 160, t: 0.09, type: 'triangle', gain: 0.2 });
    noise({ t: 0.12, gain: 0.1, filterFrom: 900, filterTo: 220 });
    tone({ f0: 240, f1: 110, t: 0.14, type: 'sine', gain: 0.12, when: 0.05 });
  },
  finish() {
    const seq = [523, 659, 784, 1047, 784, 1047];
    seq.forEach((f, i) => tone({ f0: f, t: i < 3 ? 0.16 : 0.32, type: 'triangle', gain: 0.22, when: i * 0.12 }));
    noise({ t: 0.7, gain: 0.12, filterFrom: 2200, filterTo: 700, when: 0.1 });
  },
};

export const SFX = {
  unlock() { ensure(); },
  play(name) { if (!muted && SOUNDS[name]) SOUNDS[name](); },
  isMuted() { return muted; },
  setMuted(m) {
    muted = !!m;
    Storage.setMuted(muted);
    if (master) master.gain.value = muted ? 0 : 0.85;
    return muted;
  },
  toggleMute() { return this.setMuted(!muted); },
};
