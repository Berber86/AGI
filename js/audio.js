/* ============================================================
   audio.js — аудио-слой «ЭПОХИ» (Web Audio API, без файлов)
   Сессия 4/4 уровня 4/10 — Звуковой дизайнер.
   - Мягкие казуальные звуки боя и интерфейса (синтез)
   - Процедурная музыка по 3 актам (барабаны/флейты → дроны/
     струны → индастриал-пульс), 16 шагов, 112 BPM
   - Кнопка вкл/выкл с памятью выбора (localStorage)
   - Звук стартует после первого клика (правило браузеров)
   - Безопасен в окружениях без AudioContext (noop)
   ============================================================ */
window.AudioFX = (() => {
  let ctx = null, master = null, sfxGain = null, musicGain = null;
  let muted = false;
  let musicTimer = null, nextNoteTime = 0, step = 0, act = 1;
  const STEP = 60 / 112 / 2; // восьмые при 112 BPM
  let lastHitAt = 0;

  /* ---------- init / mute ---------- */
  function init() {
    try { muted = localStorage.getItem('epochs_muted') === '1'; } catch (e) { /* нет доступа — молчим */ }
  }
  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.9; sfxGain.connect(master);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.5; musicGain.connect(master);
    } catch (e) { ctx = null; return false; }
    return true;
  }
  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem('epochs_muted', muted ? '1' : '0'); } catch (e) {}
    if (master) master.gain.value = muted ? 0 : 1;
  }
  function toggle() { setMuted(!muted); return muted; }
  function isMuted() { return muted; }

  /* ---------- синтез-хелперы ---------- */
  function env(dest, t0, dur, peak, attack, release) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(dur, attack + 0.02));
    g.connect(dest);
    return g;
  }
  function tone(type, freq, t0, dur, vol, dest, glideTo) {
    if (!ctx) return;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, freq), t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, glideTo), t0 + dur);
    const g = env(dest || sfxGain, t0, dur, vol, 0.005, 0.12);
    o.connect(g); o.start(t0); o.stop(t0 + dur + 0.06);
  }
  function noiseBurst(t0, dur, vol, filterFreq, dest) {
    if (!ctx) return;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterFreq;
    const g = env(dest || sfxGain, t0, dur, vol, 0.004, 0.1);
    src.connect(f); f.connect(g); src.start(t0);
  }

  /* ---------- звуки (мягкие казуальные) ---------- */
  const SFX = {
    'ui.click':      () => { const t = ctx.currentTime; tone('sine', 720, t, .05, .10); },
    'ui.buy':        () => { const t = ctx.currentTime; tone('triangle', 880, t, .07, .16); tone('triangle', 1318, t + .05, .09, .16); },
    'ui.error':      () => { const t = ctx.currentTime; tone('square', 150, t, .10, .05); },
    'battle.hit':    () => { const t = ctx.currentTime; noiseBurst(t, .05, .07, 900); tone('sine', 140, t, .06, .045, sfxGain, 90); },
    'battle.crit':   () => { const t = ctx.currentTime; noiseBurst(t, .07, .11, 1400); tone('sine', 180, t, .09, .07, sfxGain, 95); tone('sine', 1244, t, .10, .055, sfxGain, 1864); },
    'battle.ability':() => { const t = ctx.currentTime; tone('sine', 420, t, .22, .09, sfxGain, 1250); tone('triangle', 630, t + .03, .20, .045, sfxGain, 1500); },
    'battle.boss':   () => { const t = ctx.currentTime; tone('sine', 90, t, .50, .15, sfxGain, 55); noiseBurst(t, .30, .06, 300); },
    'battle.die':    () => { const t = ctx.currentTime; tone('sine', 420, t, .22, .06, sfxGain, 140); },
    'battle.win':    () => { const t = ctx.currentTime; [523, 659, 784, 1046].forEach((f, i) => tone('triangle', f, t + i * .09, .22, .12)); },
    'battle.lose':   () => { const t = ctx.currentTime; [392, 330, 262].forEach((f, i) => tone('triangle', f, t + i * .14, .30, .09)); },
    'stage.evolve':  () => { const t = ctx.currentTime; noiseBurst(t, .50, .09, 600); tone('sine', 330, t, .40, .07, sfxGain, 660); },
    'stage.artifact':() => { const t = ctx.currentTime; [1046, 1318, 1568, 2093].forEach((f, i) => tone('sine', f, t + i * .04, .18, .055)); },
    'stage.victory': () => { const t = ctx.currentTime; [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone('triangle', f, t + i * .12, .30, .13)); },
    'stage.defeat':  () => { const t = ctx.currentTime; [330, 311, 294, 262].forEach((f, i) => tone('triangle', f, t + i * .22, .45, .08)); },
  };
  function play(name) {
    if (!ensureCtx() || muted) return;
    if (name === 'battle.hit') {
      const t = performance.now();
      if (t - lastHitAt < 70) return; // лимит: не захлёбываемся частыми ударами
      lastHitAt = t;
    }
    const fn = SFX[name];
    if (fn) { try { fn(); } catch (e) { /* звук не должен ронять игру */ } }
  }

  /* ---------- музыка (процедурные треки по актам) ---------- */
  const SCALES = {
    1: [220, 262, 294, 330, 392, 440], // пентатоника (древний мир)
    2: [196, 220, 262, 294, 330, 392], // дорийский (средневековье)
    3: [110, 131, 165, 196, 220, 262], // низкий фригийский (новое время)
  };
  function scheduleStep(s, t) {
    const g = musicGain; if (!g) return;
    if (act === 1) {
      if (s % 4 === 0) tone('sine', 110, t, .30, .45, g, 82);                       // бас-барабан
      if (s % 4 === 2) noiseBurst(t, .03, .05, 4000, g);                            // тарелка
      if (s % 8 === 6) { const f = SCALES[1][Math.floor(Math.random() * 6)] * 2; tone('triangle', f, t, .35, .12, g); }
      if (s % 16 === 12) tone('sine', 165, t, .40, .16, g, 131);                    // тамтам
    } else if (act === 2) {
      if (s % 8 === 0) tone('sine', 98, t, 1.1, .28, g);                            // дрон
      if (s % 8 === 4) tone('sine', 147, t, 1.1, .20, g);
      if (s % 2 === 1) { const f = SCALES[2][Math.floor(Math.random() * 6)]; tone('triangle', f, t, .40, .09, g); }
      if (s % 16 === 14) tone('sine', 1960, t, .80, .045, g);                       // колокол
    } else {
      if (s % 4 === 0) tone('sine', 55, t, .28, .50, g, 41);                        // кик
      if (s % 4 === 2) noiseBurst(t, .02, .035, 6000, g);                           // хэт
      if (s % 2 === 1) { const f = SCALES[3][s % 6]; tone('square', f, t, .16, .04, g, f * 0.99); }
      if (s % 4 === 1) { const f = SCALES[3][(s + 3) % 6] * 4; tone('sine', f, t, .14, .05, g); } // арпеджио
    }
  }
  function startMusic() {
    if (!ensureCtx() || musicTimer) return;
    nextNoteTime = ctx.currentTime + 0.1; step = 0;
    musicTimer = setInterval(() => {
      if (!ctx) return;
      while (nextNoteTime < ctx.currentTime + 0.15) {
        scheduleStep(step % 16, nextNoteTime);
        nextNoteTime += STEP; step++;
      }
    }, 40);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }
  function setAct(a) { act = a; }

  return { init, play, setMuted, toggle, isMuted, setAct, startMusic, stopMusic };
})();
