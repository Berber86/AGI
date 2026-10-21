// Minimal synthesized audio (contract: shot + explosion only).
// WebAudio is created/resumed only after a user gesture (quality gate).
let ctx = null;
export function unlockAudio() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { ctx = null; } }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return !!ctx;
}
function tone(freqA, freqB, dur, type, gainPeak) {
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freqA, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, freqB), t + dur);
  g.gain.setValueAtTime(gainPeak, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur);
}
export function playShot() { tone(880, 160, 0.18, 'sawtooth', 0.12); }
export function playExplosion() {
  tone(140, 34, 0.4, 'triangle', 0.22);
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime; const len = Math.floor(ctx.sampleRate * 0.25);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  src.connect(g).connect(ctx.destination); src.start(t);
}
export function audioInfo() { return { available: !!ctx, state: ctx ? ctx.state : 'none' }; }
