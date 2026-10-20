/**
 * Звук игры «Сладкие буквы».
 *
 * Приоритет — живой русский голос (Web Speech API): ребёнок должен слышать
 * правильный звук буквы. Если русского голоса в системе нет, игра не молчит:
 * остаются мягкие WebAudio-эффекты, а состояние голоса видно в `describe()`.
 * Всё разблокируется первым касанием — так требуют мобильные браузеры.
 */

const TONE_PLAN = {
  tap: [[660, 0.07, 0.16]],
  good: [[523.25, 0.09, 0.2], [659.25, 0.09, 0.2], [783.99, 0.16, 0.22]],
  star: [[880, 0.08, 0.18], [1174.66, 0.14, 0.2]],
  wrong: [[329.63, 0.14, 0.18], [261.63, 0.2, 0.18]],
  sticker: [
    [523.25, 0.1, 0.2],
    [659.25, 0.1, 0.2],
    [783.99, 0.1, 0.2],
    [1046.5, 0.24, 0.24],
  ],
  win: [
    [523.25, 0.12, 0.2],
    [659.25, 0.12, 0.2],
    [783.99, 0.12, 0.2],
    [1046.5, 0.12, 0.22],
    [1318.5, 0.3, 0.24],
  ],
  empty: [[392, 0.18, 0.16], [293.66, 0.28, 0.16]],
};

let ctx = null;
let master = null;
let enabled = true;
let unlocked = false;
let russianVoice = null;
let voicesLoaded = false;
let speaking = false;
let lastUtteranceFailed = false;
let onVoiceMissing = null;

function ensureContext() {
  if (ctx) return ctx;
  const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);
  return ctx;
}

function pickRussianVoice() {
  const synth = globalThis.speechSynthesis;
  if (!synth || typeof synth.getVoices !== 'function') return null;
  const voices = synth.getVoices() || [];
  if (!voices.length) return null;
  voicesLoaded = true;
  return (
    voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith('ru')) ||
    null
  );
}

function tone([frequency, duration, volume], delay) {
  const audio = ensureContext();
  if (!audio || !enabled) return;
  if (audio.state === 'suspended') audio.resume().catch(() => {});
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  const start = audio.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

export const audio = {
  /** Первый жест пользователя: снимаем блокировку звука в мобильном браузере. */
  unlock() {
    const audioCtx = ensureContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    if (!unlocked) {
      russianVoice = pickRussianVoice();
      const synth = globalThis.speechSynthesis;
      if (synth && typeof synth.addEventListener === 'function') {
        synth.addEventListener('voiceschanged', () => {
          russianVoice = pickRussianVoice();
        });
      }
      unlocked = true;
    }
  },

  setEnabled(on) {
    enabled = Boolean(on);
    if (!enabled) globalThis.speechSynthesis?.cancel?.();
  },

  isEnabled() {
    return enabled;
  },

  /** Есть ли в системе русский голос — показываем это в родительском режиме. */
  describe() {
    return {
      unlocked,
      enabled,
      russianVoice: russianVoice ? `${russianVoice.name} (${russianVoice.lang})` : null,
      speechSupported: Boolean(globalThis.speechSynthesis),
      voicesLoaded,
      lastUtteranceFailed,
    };
  },

  /**
   * Произнести текст. Возвращает true, если запрос ушёл в синтезатор речи.
   * Если русского голоса нет, дёрнет fallback (обычно — мягкий эффект).
   */
  speak(text, { fallback = 'tap' } = {}) {
    if (!enabled || !text) return false;
    const synth = globalThis.speechSynthesis;
    if (!synth || typeof synth.speak !== 'function') {
      this.effect(fallback);
      return false;
    }
    if (!russianVoice) russianVoice = pickRussianVoice();
    if (!russianVoice) {
      lastUtteranceFailed = true;
      this.effect(fallback);
      if (typeof onVoiceMissing === 'function') onVoiceMissing();
      return false;
    }
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = russianVoice.lang || 'ru-RU';
      utterance.voice = russianVoice;
      utterance.rate = 0.82;
      utterance.pitch = 1.15;
      utterance.volume = 1;
      utterance.onstart = () => {
        speaking = true;
      };
      utterance.onend = () => {
        speaking = false;
      };
      utterance.onerror = () => {
        speaking = false;
        lastUtteranceFailed = true;
        this.effect(fallback);
      };
      speaking = true;
      synth.speak(utterance);
      return true;
    } catch (error) {
      lastUtteranceFailed = true;
      this.effect(fallback);
      return false;
    }
  },

  stopSpeaking() {
    globalThis.speechSynthesis?.cancel?.();
    speaking = false;
  },

  isSpeaking() {
    return speaking;
  },

  onVoiceMissing(handler) {
    onVoiceMissing = typeof handler === 'function' ? handler : null;
  },

  effect(name) {
    const plan = TONE_PLAN[name];
    if (!plan || !enabled) return;
    let delay = 0;
    for (const note of plan) {
      tone(note, delay);
      delay += note[1] * 0.72;
    }
  },
};
