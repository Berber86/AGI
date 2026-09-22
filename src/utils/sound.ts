import type { BattleEvent } from '@/engine/combat/combat.types';

/**
 * Звуковые плейсхолдеры: синтез через WebAudio, без ассетов.
 * AudioContext создаётся лениво при первом вызове (после клика игрока —
 * политика автоплея браузера это требует).
 */

export type SoundCue =
  | 'hit'
  | 'crit'
  | 'miss'
  | 'shield'
  | 'death'
  | 'heal'
  | 'rout'
  | 'round'
  | 'surprise'
  | 'victory'
  | 'defeat'
  | 'poison';

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
}

function tone(ac: AudioContext, freq: number, dur: number, opts: ToneOpts = {}): void {
  const { type = 'square', gain = 0.04, delay = 0, slideTo } = opts;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(30, freq), t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noiseBurst(ac: AudioContext, dur = 0.05, gain = 0.045, delay = 0): void {
  const t0 = ac.currentTime + delay;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.value = gain;
  const f = ac.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 1600;
  src.connect(f);
  f.connect(g);
  g.connect(ac.destination);
  src.start(t0);
}

export function playCue(cue: SoundCue): void {
  const ac = ensureCtx();
  if (!ac) return;
  try {
    switch (cue) {
      case 'hit':
        noiseBurst(ac, 0.05, 0.05);
        tone(ac, 160, 0.07, { gain: 0.03 });
        break;
      case 'crit':
        tone(ac, 660, 0.08, { gain: 0.05 });
        tone(ac, 990, 0.1, { gain: 0.05, delay: 0.06 });
        noiseBurst(ac, 0.04, 0.04);
        break;
      case 'miss':
        tone(ac, 500, 0.1, { type: 'sine', gain: 0.025, slideTo: 220 });
        break;
      case 'shield':
        tone(ac, 300, 0.08, { type: 'triangle', gain: 0.03 });
        tone(ac, 450, 0.06, { type: 'triangle', gain: 0.02, delay: 0.05 });
        break;
      case 'death':
        tone(ac, 320, 0.4, { type: 'sawtooth', gain: 0.05, slideTo: 70 });
        break;
      case 'heal':
        tone(ac, 520, 0.12, { type: 'sine', gain: 0.03, slideTo: 780 });
        break;
      case 'rout':
        tone(ac, 392, 0.12, { gain: 0.04 });
        tone(ac, 262, 0.2, { gain: 0.04, delay: 0.12 });
        break;
      case 'round':
        tone(ac, 220, 0.05, { type: 'sine', gain: 0.02 });
        break;
      case 'surprise':
        tone(ac, 880, 0.06, { gain: 0.04 });
        tone(ac, 1175, 0.08, { gain: 0.04, delay: 0.05 });
        break;
      case 'victory':
        [523, 659, 784, 1047].forEach((f, i) => tone(ac, f, 0.16, { gain: 0.05, delay: i * 0.11 }));
        break;
      case 'defeat':
        [330, 262, 196, 131].forEach((f, i) => tone(ac, f, 0.2, { type: 'triangle', gain: 0.05, delay: i * 0.13 }));
        break;
      case 'poison':
        tone(ac, 140, 0.1, { type: 'sine', gain: 0.03, slideTo: 90 });
        break;
    }
  } catch {
    // звук не критичен для геймплея
  }
}

/** Какой звук проиграть для события боя. null — тишина. */
export function cueForEvent(ev: BattleEvent): SoundCue | null {
  switch (ev.type) {
    case 'attack':
      if (!ev.hit) return 'miss';
      if (ev.kind === 'cleave') return null;
      if (ev.absorbed >= ev.dmg && ev.dmg > 0) return 'shield';
      return ev.crit ? 'crit' : 'hit';
    case 'death':
      return 'death';
    case 'rout':
      return 'rout';
    case 'heal':
      return ev.source === 'lifesteal' ? 'heal' : null; // регенерацию не озвучиваем
    case 'dot':
      return 'poison';
    case 'roundStart':
      return 'round';
    case 'phase':
      return ev.phase === 'surprise' ? 'surprise' : null;
    default:
      return null;
  }
}
