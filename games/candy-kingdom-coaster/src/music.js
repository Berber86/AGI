// Cheerful procedural chiptune for Candy Kingdom Coaster — a 16-bar loop in
// C major (bouncy oom-pah bass, offbeat candy chords, a square-wave lead with
// glockenspiel sparkles, light drums) sequenced on WebAudio. No audio assets,
// so it works offline in the PWA and weighs nothing.
//
// Modes (layers switch instantly, the loop keeps its place):
//   menu   – soft: lead + chords + bells, brushy hats, no bass drum
//   race   – full band
//   boost  – race + 16th hats + sparkling arpeggio
// setMode(mode, { restart: true }) restarts from the downbeat (used at GO!).
import { audioGraph, SFX } from './audio.js';

const BPM = 150;
const SIXTEENTH = 60 / BPM / 4; // 0.1 s
const BARS = 16;
const STEPS = BARS * 16;
const LOOKAHEAD = 0.22; // s of audio scheduled ahead of the clock
const TICK_MS = 50;

// ---- the tune -------------------------------------------------------------
// 8th-note grid per bar (0 = rest). MIDI numbers, C4 = 60.
const MELODY = [
  // A — "skipping down the candy lane"
  [76, 79, 76, 72, 74, 76, 0, 0],   // C
  [74, 79, 74, 71, 67, 71, 74, 0],  // G
  [72, 76, 72, 69, 71, 72, 0, 0],   // Am
  [69, 72, 77, 76, 74, 72, 74, 0],  // F
  [76, 79, 84, 0, 79, 76, 0, 0],    // C
  [74, 0, 71, 74, 79, 0, 78, 74],   // G
  [76, 0, 72, 76, 81, 0, 79, 76],   // Am
  [77, 76, 74, 72, 74, 0, 0, 0],    // F → G
  // B — "up the sugar hill and back"
  [72, 0, 69, 72, 77, 0, 76, 72],   // F
  [74, 0, 71, 74, 79, 0, 78, 74],   // G
  [76, 79, 76, 79, 84, 0, 83, 79],  // C
  [81, 0, 79, 76, 72, 0, 74, 76],   // Am
  [77, 0, 81, 0, 84, 0, 81, 77],    // F
  [79, 0, 83, 0, 86, 0, 83, 79],    // G
  [88, 86, 84, 79, 76, 79, 84, 0],  // C
  [74, 76, 78, 79, 83, 0, 86, 0],   // G (turnaround)
];
// chord per half-bar: [first half, second half]
const C = { root: 36, tri: [60, 64, 67] };
const G = { root: 43, tri: [59, 62, 67] };
const Am = { root: 45, tri: [60, 64, 69] };
const F = { root: 41, tri: [60, 65, 69] };
const CHORDS = [
  [C, C], [G, G], [Am, Am], [F, F], [C, C], [G, G], [Am, Am], [F, G],
  [F, F], [G, G], [C, C], [Am, Am], [F, F], [G, G], [C, C], [G, G],
];

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ---- synth voices ---------------------------------------------------------
let graph = null; // { ctx, master }
let bus = null;   // music gain → master
let noiseBuf = null;

function ensureGraph() {
  if (!graph) {
    graph = audioGraph();
    if (!graph) return null;
    bus = graph.ctx.createGain();
    bus.gain.value = 0;
    bus.connect(graph.master);
    const len = Math.floor(graph.ctx.sampleRate * 0.3);
    noiseBuf = graph.ctx.createBuffer(1, len, graph.ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return graph;
}

function env(g, t, peak, attack, decay, sustain, hold, release) {
  // simple ADSR; events must stay in time order, so the hold never ends
  // before the decay does
  const sus = Math.max(0.0001, peak * sustain);
  const end = Math.max(hold, attack + decay + 0.001);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(sus, t + attack + decay);
  g.gain.setValueAtTime(sus, t + end);
  g.gain.exponentialRampToValueAtTime(0.0001, t + end + release);
}

function lead(midi, t, dur, vel = 1) {
  const { ctx } = graph;
  const o = ctx.createOscillator(); o.type = 'square';
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600; f.Q.value = 0.7;
  const g = ctx.createGain();
  o.frequency.setValueAtTime(mtof(midi), t);
  // chip-style blip: starts a hair sharp and settles
  o.detune.setValueAtTime(35, t);
  o.detune.linearRampToValueAtTime(0, t + 0.03);
  env(g, t, 0.085 * vel, 0.006, 0.07, 0.62, dur, 0.06);
  o.connect(f); f.connect(g); g.connect(bus);
  o.start(t); o.stop(t + dur + 0.1);
  // soft triangle an octave below fattens the thin square
  const o2 = ctx.createOscillator(); o2.type = 'triangle';
  const g2 = ctx.createGain();
  o2.frequency.setValueAtTime(mtof(midi - 12), t);
  env(g2, t, 0.05 * vel, 0.006, 0.07, 0.6, dur, 0.06);
  o2.connect(g2); g2.connect(bus);
  o2.start(t); o2.stop(t + dur + 0.1);
}

function bell(midi, t) {
  const { ctx } = graph;
  const o = ctx.createOscillator(); o.type = 'sine';
  const g = ctx.createGain();
  o.frequency.setValueAtTime(mtof(midi), t);
  env(g, t, 0.07, 0.003, 0.25, 0.25, 0.3, 0.35);
  o.connect(g); g.connect(bus);
  o.start(t); o.stop(t + 0.8);
  const o2 = ctx.createOscillator(); o2.type = 'sine';
  const g2 = ctx.createGain();
  o2.frequency.setValueAtTime(mtof(midi) * 2.76, t); // inharmonic partial = glass
  env(g2, t, 0.016, 0.002, 0.08, 0.1, 0.1, 0.15);
  o2.connect(g2); g2.connect(bus);
  o2.start(t); o2.stop(t + 0.4);
}

function bass(midi, t, dur) {
  const { ctx } = graph;
  const o = ctx.createOscillator(); o.type = 'triangle';
  const g = ctx.createGain();
  o.frequency.setValueAtTime(mtof(midi), t);
  env(g, t, 0.26, 0.005, 0.12, 0.55, dur, 0.05);
  o.connect(g); g.connect(bus);
  o.start(t); o.stop(t + dur + 0.1);
  const s = ctx.createOscillator(); s.type = 'sine';
  const sg = ctx.createGain();
  s.frequency.setValueAtTime(mtof(midi), t);
  env(sg, t, 0.16, 0.005, 0.1, 0.5, dur, 0.05);
  s.connect(sg); sg.connect(bus);
  s.start(t); s.stop(t + dur + 0.1);
}

function chord(tri, t, dur, vel = 1) {
  const { ctx } = graph;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1500;
  const g = ctx.createGain();
  env(g, t, 0.05 * vel, 0.004, 0.06, 0.45, dur, 0.05);
  f.connect(g); g.connect(bus);
  tri.forEach((m, i) => {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(mtof(m), t);
    o.detune.value = (i - 1) * 6; // gentle chorus
    o.connect(f);
    o.start(t); o.stop(t + dur + 0.1);
  });
}

function arp(midi, t) {
  const { ctx } = graph;
  const o = ctx.createOscillator(); o.type = 'triangle';
  const g = ctx.createGain();
  o.frequency.setValueAtTime(mtof(midi), t);
  env(g, t, 0.06, 0.003, 0.05, 0.3, 0.07, 0.05);
  o.connect(g); g.connect(bus);
  o.start(t); o.stop(t + 0.2);
}

function kick(t, vel = 1) {
  const { ctx } = graph;
  const o = ctx.createOscillator(); o.type = 'sine';
  const g = ctx.createGain();
  o.frequency.setValueAtTime(170, t);
  o.frequency.exponentialRampToValueAtTime(44, t + 0.1);
  g.gain.setValueAtTime(0.5 * vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);
  o.connect(g); g.connect(bus);
  o.start(t); o.stop(t + 0.2);
}

function snare(t, vel = 1) {
  const { ctx } = graph;
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1900; f.Q.value = 0.7;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.22 * vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
  src.connect(f); f.connect(g); g.connect(bus);
  src.start(t); src.stop(t + 0.15);
  const o = ctx.createOscillator(); o.type = 'triangle';
  const og = ctx.createGain();
  o.frequency.setValueAtTime(210, t);
  og.gain.setValueAtTime(0.12 * vel, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  o.connect(og); og.connect(bus);
  o.start(t); o.stop(t + 0.1);
}

function hat(t, open = false, vel = 1) {
  const { ctx } = graph;
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7600;
  const g = ctx.createGain();
  const len = open ? 0.14 : 0.035;
  g.gain.setValueAtTime(0.09 * vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(f); f.connect(g); g.connect(bus);
  src.start(t); src.stop(t + len + 0.02);
}

// ---- sequencer ------------------------------------------------------------
const VOLUME = { menu: 0.75, race: 0.5, boost: 0.54 }; // race ≈ -22 dBFS RMS, sits under the SFX
const state = { playing: false, mode: 'menu', step: 0, nextTime: 0, timer: null };

function melodyLen(bar, eighth) {
  // sustain over following rests (up to a half bar) for a singing lead
  let n = 1;
  for (let k = eighth + 1; k < 8 && MELODY[bar][k] === 0 && n < 4; k++) n++;
  return n;
}

function scheduleStep(step, t) {
  const bar = step >> 4, sub = step & 15;
  const mode = state.mode;
  const full = mode !== 'menu';
  const ch = CHORDS[bar][sub < 8 ? 0 : 1];
  const sectionB = bar >= 8;

  // lead on 8ths, bell doubling the first note of every other bar
  if ((sub & 1) === 0) {
    const eighth = sub >> 1;
    const m = MELODY[bar][eighth];
    if (m) {
      const n = melodyLen(bar, eighth);
      lead(m, t, SIXTEENTH * 2 * n * 0.88, full ? 1 : 0.85);
      if ((eighth === 0 && bar % 2 === 0) || (sectionB && eighth === 4)) bell(m + 12, t);
    }
  }
  // oom-pah bass: root / fifth on the quarters, octave pickup before a new chord
  if (full) {
    if (sub % 4 === 0) {
      const q = sub / 4;
      const note = sectionB ? [0, 7, 12, 7][q] : [0, 7, 0, 7][q];
      bass(ch.root + note, t, SIXTEENTH * 3.2);
    } else if (sub === 14 && bar % 4 === 3) bass(ch.root + 12, t, SIXTEENTH * 1.6);
  }
  // candy chords on the offbeats
  if (sub % 4 === 2) chord(ch.tri, t, SIXTEENTH * 1.4, full ? 1 : 0.8);
  // sparkle arpeggio while boosting (16ths over the chord, two octaves up)
  if (mode === 'boost') arp(ch.tri[sub % 3] + 24, t);

  // drums
  if (full) {
    if (sub === 0 || sub === 8) kick(t);
    if ((bar % 2 === 1) && sub === 11) kick(t, 0.7);
    if (sub === 4 || sub === 12) snare(t);
    if (bar % 4 === 3 && sub === 14) snare(t, 0.5);
    const hats16 = mode === 'boost' || sectionB;
    if (hats16 || (sub & 1) === 0) hat(t, bar % 4 === 3 && sub === 14, (sub & 1) ? 0.55 : 1);
  } else if ((sub & 3) === 2) hat(t, false, 0.5); // menu: brushy offbeat tick
}

function tick() {
  if (!state.playing || !graph) return;
  const now = graph.ctx.currentTime;
  if (state.nextTime < now - 0.5) state.nextTime = now + 0.05; // clock jumped (tab hidden): resync
  while (state.nextTime < now + LOOKAHEAD) {
    scheduleStep(state.step, state.nextTime);
    state.step = (state.step + 1) % STEPS;
    state.nextTime += SIXTEENTH;
  }
}

function fadeTo(v, tc = 0.25) {
  if (!bus) return;
  bus.gain.setTargetAtTime(v, graph.ctx.currentTime, tc);
}

export const MUSIC = {
  start(mode = 'menu') {
    if (!ensureGraph()) return false;
    state.mode = mode;
    if (!state.playing) {
      state.playing = true;
      state.step = 0;
      state.nextTime = graph.ctx.currentTime + 0.08;
      state.timer = setInterval(tick, TICK_MS);
    }
    fadeTo(SFX.isMuted() ? 0 : VOLUME[mode] ?? 0.25, 0.4);
    tick();
    return true;
  },
  setMode(mode, { restart = false } = {}) {
    if (!state.playing) return this.start(mode);
    state.mode = mode;
    if (restart && graph) {
      // start the loop again on the downbeat (e.g. right at GO!)
      state.step = 0;
      state.nextTime = graph.ctx.currentTime + 0.03;
    }
    fadeTo(VOLUME[mode] ?? 0.25, restart ? 0.05 : 0.3);
    tick();
    return mode;
  },
  stop(fade = 0.3) {
    if (!state.playing) return;
    state.playing = false;
    clearInterval(state.timer); state.timer = null;
    fadeTo(0, fade);
  },
  isPlaying() { return state.playing; },
  mode() { return state.mode; },
  // QA: render `seconds` of the loop offline (no speakers needed) and return
  // level statistics plus the PCM, so a headless test can check the tune is
  // audible, not clipping and keeps its tempo.
  async renderOffline(seconds = 8, mode = 'race', withPcm = false) {
    const sr = 22050;
    const off = new OfflineAudioContext(1, Math.ceil(sr * seconds), sr);
    const saved = { graph, bus, noiseBuf, mode: state.mode };
    graph = { ctx: off, master: off.destination };
    bus = off.createGain(); bus.gain.value = VOLUME[mode] ?? 0.25; bus.connect(off.destination);
    const len = Math.floor(sr * 0.3);
    noiseBuf = off.createBuffer(1, len, sr);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) nd[i] = Math.random() * 2 - 1;
    state.mode = mode;
    try {
      let t = 0.02, step = 0;
      while (t < seconds) { scheduleStep(step, t); step = (step + 1) % STEPS; t += SIXTEENTH; }
      const buf = await off.startRendering();
      const d = buf.getChannelData(0);
      let peak = 0, sq = 0;
      const beat = Math.round(sr * SIXTEENTH * 4), beats = [];
      for (let b = 0; (b + 1) * beat <= d.length; b++) {
        let e = 0;
        for (let i = b * beat; i < (b + 1) * beat; i++) e += d[i] * d[i];
        beats.push(+Math.sqrt(e / beat).toFixed(4));
      }
      for (let i = 0; i < d.length; i++) { const v = Math.abs(d[i]); if (v > peak) peak = v; sq += d[i] * d[i]; }
      return { seconds, sampleRate: sr, mode, peak: +peak.toFixed(3), rms: +Math.sqrt(sq / d.length).toFixed(4), beatRms: beats,
        pcm: withPcm ? Array.from(d, (v) => Math.round(v * 32767)) : null };
    } finally {
      graph = saved.graph; bus = saved.bus; noiseBuf = saved.noiseBuf; state.mode = saved.mode;
    }
  },
  // QA: structural facts about the tune
  info() {
    return { bpm: BPM, bars: BARS, steps: STEPS, playing: state.playing, mode: state.mode, step: state.step,
      notes: MELODY.flat().filter(Boolean).length, busGain: bus ? +bus.gain.value.toFixed(3) : null };
  },
};
