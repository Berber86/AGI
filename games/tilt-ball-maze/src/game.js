/* «Шарик-непоседа» — игра для детей, которые ещё НЕ умеют читать.
 *
 * Поэтому на экране нет ни одного слова: только картинки, эмодзи, цифры
 * и счёт цветных шариков до 10. Каждый собранный шарик — большая цифра
 * на поле, голос произносит число, а нотка становится всё выше.
 *
 * Управление — ТОЛЬКО наклоном телефона, через слияние двух датчиков:
 *   1) DeviceOrientationEvent — гироскоп: углы beta (вперёд-назад) и gamma (влево-вправо);
 *   2) DeviceMotionEvent — акселерометр: accelerationIncludingGravity.
 * На компьютере без датчиков — эмулятор наклона, пишущий в тот же вектор tilt.
 * Касания игрового поля шариком не управляют.
 */
(function () {
  'use strict';

  var LEVELS = window.TILT_LEVELS;
  var SAVE_KEY = 'tiltBallMaze.v3';
  var BALL_COLORS = ['#ef476f', '#f78c6b', '#ffd166', '#a7c957', '#06d6a0', '#4ecdc4', '#118ab2', '#4361ee', '#9b5de5', '#f15bb5'];
  var NUMBER_WORDS = ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять'];
  var COUNT_NOTES = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760];

  // ---------- DOM ----------
  function $(id) { return document.getElementById(id); }
  var canvas = $('game'), ctx = canvas.getContext('2d');
  var sensorNoteEl = $('sensorNote');
  var startOverlay = $('startOverlay'), winOverlay = $('winOverlay'), levelsOverlay = $('levelsOverlay');
  var pauseOverlay = $('pauseOverlay');

  // ---------- Сохранение ----------
  var save = { unlocked: 1, stars: {}, best: {}, sound: true };
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (raw) { var parsed = JSON.parse(raw); if (parsed && typeof parsed === 'object') save = Object.assign(save, parsed); }
  } catch (e) { /* приватный режим — играем без сохранения */ }
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

  // ---------- Звук и голос счёта ----------
  var audioCtx = null;
  function ensureAudio() {
    if (!save.sound) return null;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) { return null; }
  }
  function tone(freq, dur, type, vol, slideTo, delay) {
    var ac = ensureAudio(); if (!ac) return;
    var t0 = ac.currentTime + (delay || 0);
    var osc = ac.createOscillator(), gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.16, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function sndCount(n) {
    var f = COUNT_NOTES[Math.max(0, Math.min(9, n - 1))];
    tone(f, 0.22, 'triangle', 0.22);
    tone(f * 1.5, 0.3, 'sine', 0.12, null, 0.06);
  }
  function speakCount(n) {
    if (!save.sound || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(NUMBER_WORDS[n - 1] || String(n));
      u.lang = 'ru-RU'; u.rate = 0.95; u.pitch = 1.15;
      window.speechSynthesis.speak(u);
    } catch (e) { /* голоса нет — остаются цифра и нотка */ }
  }
  function stopSpeech() {
    if ('speechSynthesis' in window) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }
  function sndBounce(strength) { tone(140 + Math.random() * 40, 0.09, 'sine', Math.min(0.22, 0.06 + strength * 0.03), 70); }
  function sndHole() { tone(520, 0.45, 'sine', 0.18, 110); }
  function sndWin() { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.28, 'triangle', 0.2, null, i * 0.11); }); }
  function vibrate(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} }

  // ---------- Вектор наклона из датчиков ----------
  var inputMode = 'none'; // 'sensor' | 'emu' | 'none'
  var tiltTarget = { x: 0, y: 0 };
  var tilt = { x: 0, y: 0 };
  var gyro = { seen: false, lastTime: 0, beta: 0, gamma: 0, calBeta: 0, calGamma: 0 };
  var accel = { seen: false, lastTime: 0, x: 0, y: 0, calX: 0, calY: 0 };
  var calibrateWhenReady = false;

  function rotateForScreen(x, y) {
    var angle = 0;
    try {
      if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') angle = window.screen.orientation.angle;
      else if (typeof window.orientation === 'number') angle = window.orientation;
    } catch (e) {}
    angle = ((angle % 360) + 360) % 360;
    if (angle === 90) return { x: y, y: -x };
    if (angle === 180) return { x: -x, y: -y };
    if (angle === 270) return { x: -y, y: x };
    return { x: x, y: y };
  }
  function clampUnit(v) { return Math.max(-1, Math.min(1, v)); }

  function sensorTilt() {
    var partsX = 0, partsY = 0, weight = 0;
    if (gyro.seen) {
      var g = rotateForScreen((gyro.gamma - gyro.calGamma) / 28, (gyro.beta - gyro.calBeta) / 28);
      partsX += g.x * 0.55; partsY += g.y * 0.55; weight += 0.55;
    }
    if (accel.seen) {
      var a = rotateForScreen((accel.x - accel.calX) / 9.81, (accel.y - accel.calY) / 9.81);
      partsX += a.x * 0.45; partsY += a.y * 0.45; weight += 0.45;
    }
    if (!weight) return { x: 0, y: 0 };
    return { x: clampUnit(partsX / weight), y: clampUnit(partsY / weight) };
  }

  function onOrientation(e) {
    if (e.beta === null || e.gamma === null) return;
    gyro.beta = e.beta; gyro.gamma = e.gamma;
    gyro.seen = true; gyro.lastTime = performance.now();
    if (calibrateWhenReady && accel.seen) { calibrateWhenReady = false; calibrate('🎯 👍 📱'); }
  }
  function onMotion(e) {
    var a = e.accelerationIncludingGravity;
    if (!a || a.x === null) return;
    accel.x = a.x; accel.y = a.y;
    accel.seen = true; accel.lastTime = performance.now();
    if (calibrateWhenReady && gyro.seen) { calibrateWhenReady = false; calibrate('🎯 👍 📱'); }
  }

  function calibrate(message) {
    gyro.calBeta = gyro.beta; gyro.calGamma = gyro.gamma;
    accel.calX = accel.x; accel.calY = accel.y;
    emu.x = 0; emu.y = 0;
    tiltTarget.x = 0; tiltTarget.y = 0; tilt.x = 0; tilt.y = 0;
    void message;
    vibrate(30);
  }

  // ---------- Эмулятор наклона (компьютер): только стрелки клавиатуры ----------
  var emu = { x: 0, y: 0 };
  var keysDown = {};
  function syncEmuKnob() { /* визуального эмулятора нет: экран во время игры чистый */ }
  window.addEventListener('keydown', function (e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].indexOf(e.key) >= 0) {
      keysDown[e.key] = true;
      if (inputMode === 'emu' && e.key !== 'Escape') e.preventDefault();
      if (e.key === 'Escape' && game.playing) openPause();
    }
  });
  window.addEventListener('keyup', function (e) { delete keysDown[e.key]; });

  function computeTiltTarget() {
    if (inputMode === 'emu') {
      var kx = (keysDown.ArrowRight ? 0.85 : 0) - (keysDown.ArrowLeft ? 0.85 : 0);
      var ky = (keysDown.ArrowDown ? 0.85 : 0) - (keysDown.ArrowUp ? 0.85 : 0);
      if (kx || ky) return { x: kx, y: ky };
      return { x: emu.x, y: emu.y };
    }
    if (inputMode === 'sensor') return sensorTilt();
    return { x: 0, y: 0 };
  }

  // ---------- Игра ----------
  var game = {
    levelIndex: 0, cols: 0, rows: 0, walls: [], stars: [], holes: [],
    start: { x: 1.5, y: 1.5 }, finish: { x: 0.5, y: 0.5 },
    ball: { x: 1.5, y: 1.5, vx: 0, vy: 0, r: 0.34, roll: 0 },
    collected: 0, elapsed: 0, playing: false, won: false,
    falling: 0, fallScale: 1, particles: [], time: 0,
  };
  var lastBounceSnd = 0;

  function loadLevel(index) {
    var lv = LEVELS[index];
    game.levelIndex = index;
    game.cols = lv.grid[0].length; game.rows = lv.grid.length;
    game.walls = []; game.stars = []; game.holes = [];
    var ballIndex = 0;
    for (var y = 0; y < game.rows; y++) {
      game.walls.push([]);
      for (var x = 0; x < game.cols; x++) {
        var c = lv.grid[y][x];
        game.walls[y].push(c === '#');
        if (c === 'S') game.start = { x: x + 0.5, y: y + 0.5 };
        else if (c === 'F') game.finish = { x: x + 0.5, y: y + 0.5 };
        else if (c === '*') game.stars.push({ x: x + 0.5, y: y + 0.5, taken: false, spin: Math.random() * 6.28, color: BALL_COLORS[ballIndex++ % BALL_COLORS.length] });
        else if (c === 'O') game.holes.push({ x: x + 0.5, y: y + 0.5 });
      }
    }
    resetBall();
    game.collected = 0; game.elapsed = 0; game.won = false; game.falling = 0; game.fallScale = 1;
    game.particles = [];
    resizeCanvas();
  }
  function resetBall() {
    game.ball.x = game.start.x; game.ball.y = game.start.y;
    game.ball.vx = 0; game.ball.vy = 0;
  }

  function spawnParticles(x, y, n, colors, speed) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = (0.6 + Math.random() * 0.9) * (speed || 2.4);
      game.particles.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.8,
        life: 0.7 + Math.random() * 0.6, maxLife: 1.2,
        size: 0.05 + Math.random() * 0.07,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function isWall(cx, cy) {
    if (cx < 0 || cy < 0 || cx >= game.cols || cy >= game.rows) return true;
    return game.walls[cy][cx];
  }

  function stepPhysics(dt) {
    var b = game.ball;
    if (game.falling > 0) {
      game.falling -= dt;
      game.fallScale = Math.max(0.05, game.falling / 0.55);
      if (game.falling <= 0) {
        resetBall(); game.fallScale = 1;
      }
      return;
    }
    var ACCEL = 17, MAXV = 7.5;
    b.vx += tilt.x * ACCEL * dt;
    b.vy += tilt.y * ACCEL * dt;
    var damp = Math.exp(-1.1 * dt);
    b.vx *= damp; b.vy *= damp;
    var sp = Math.hypot(b.vx, b.vy);
    if (sp > MAXV) { b.vx = b.vx / sp * MAXV; b.vy = b.vy / sp * MAXV; sp = MAXV; }

    var steps = Math.max(1, Math.min(4, Math.ceil(sp * dt / (b.r * 0.5))));
    var sdt = dt / steps;
    for (var s = 0; s < steps; s++) {
      b.x += b.vx * sdt;
      collide(b, 'x');
      b.y += b.vy * sdt;
      collide(b, 'y');
    }
    b.roll += sp * dt / b.r;

    // Шарики счёта — учимся считать до 10: цифра, голос и нотка на каждый.
    for (var i = 0; i < game.stars.length; i++) {
      var st = game.stars[i];
      if (!st.taken && Math.hypot(b.x - st.x, b.y - st.y) < 0.52) {
        st.taken = true; game.collected++;
        spawnParticles(st.x, st.y, 16, [st.color, '#ffffff', BALL_COLORS[game.collected % BALL_COLORS.length]], 2.6);
        sndCount(game.collected);
        speakCount(game.collected);
      }
    }
    // Ямки.
    for (var h = 0; h < game.holes.length; h++) {
      var hole = game.holes[h];
      if (Math.hypot(b.x - hole.x, b.y - hole.y) < 0.30) {
        game.falling = 0.55; game.fallScale = 1;
        b.vx = 0; b.vy = 0;
        sndHole(); vibrate(60);
        return;
      }
    }
    // Финиш.
    if (!game.won && Math.hypot(b.x - game.finish.x, b.y - game.finish.y) < 0.48) {
      game.won = true;
      stopSpeech();
      sndWin(); vibrate([40, 60, 40, 60, 120]);
      spawnParticles(game.finish.x, game.finish.y, 70, ['#ff5d8f', '#ffd166', '#4ecdc4', '#a78bfa', '#7ee081'], 4.2);
      var idx = game.levelIndex;
      if (game.collected > (save.stars[idx] || 0)) save.stars[idx] = game.collected;
      var secs = Math.round(game.elapsed);
      if (!save.best[idx] || secs < save.best[idx]) save.best[idx] = secs;
      if (idx + 1 < LEVELS.length && save.unlocked < idx + 2) save.unlocked = idx + 2;
      persist();
      setTimeout(showWin, 750);
    }
    // Частицы.
    for (var p = game.particles.length - 1; p >= 0; p--) {
      var pt = game.particles[p];
      pt.life -= dt;
      if (pt.life <= 0) { game.particles.splice(p, 1); continue; }
      pt.vy += 3.2 * dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt;
    }
  }

  function collide(b, axis) {
    var minCx = Math.floor(b.x - b.r), maxCx = Math.floor(b.x + b.r);
    var minCy = Math.floor(b.y - b.r), maxCy = Math.floor(b.y + b.r);
    for (var cy = minCy; cy <= maxCy; cy++) {
      for (var cx = minCx; cx <= maxCx; cx++) {
        if (!isWall(cx, cy)) continue;
        var nearX = Math.max(cx, Math.min(b.x, cx + 1));
        var nearY = Math.max(cy, Math.min(b.y, cy + 1));
        var dx = b.x - nearX, dy = b.y - nearY;
        var d2 = dx * dx + dy * dy;
        if (d2 >= b.r * b.r) continue;
        var impact = axis === 'x' ? Math.abs(b.vx) : Math.abs(b.vy);
        if (d2 > 1e-9) {
          var d = Math.sqrt(d2), push = (b.r - d);
          b.x += dx / d * push; b.y += dy / d * push;
        } else if (axis === 'x') {
          b.x = b.vx > 0 ? cx - b.r - 0.001 : cx + 1 + b.r + 0.001;
        } else {
          b.y = b.vy > 0 ? cy - b.r - 0.001 : cy + 1 + b.r + 0.001;
        }
        if (axis === 'x') {
          if ((dx !== 0 && b.vx * dx < 0) || (dx === 0 && b.vx !== 0)) { b.vx = -b.vx * 0.42; onBounce(impact); }
        } else {
          if ((dy !== 0 && b.vy * dy < 0) || (dy === 0 && b.vy !== 0)) { b.vy = -b.vy * 0.42; onBounce(impact); }
        }
      }
    }
  }
  function onBounce(impact) {
    if (impact < 1.4) return;
    var now = performance.now();
    if (now - lastBounceSnd > 90) { lastBounceSnd = now; sndBounce(impact); }
    if (impact > 3.2) vibrate(12);
  }

  // ---------- Отрисовка ----------
  var view = { tile: 32, w: 0, h: 0, ox: 0, oy: 0 };
  function resizeCanvas() {
    var W = window.innerWidth, H = window.innerHeight;
    var tile = Math.floor(Math.min(W / game.cols, H / game.rows));
    tile = Math.max(14, tile);
    view.tile = tile; view.w = tile * game.cols; view.h = tile * game.rows;
    view.ox = Math.round((W - view.w) / 2); view.oy = Math.round((H - view.h) / 2);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(view.ox, view.oy);
    ctx.scale(tile, tile);
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', function () { setTimeout(resizeCanvas, 120); });

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawStarShape(cx, cy, r, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    for (var k = 0; k < 10; k++) {
      var ang = -Math.PI / 2 + k * Math.PI / 5;
      var rad = k % 2 === 0 ? r : r * 0.48;
      var px = Math.cos(ang) * rad, py = Math.sin(ang) * rad;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    var g = ctx.createRadialGradient(-r * 0.25, -r * 0.3, 0.02, 0, 0, r * 1.25);
    g.addColorStop(0, '#fff3b0'); g.addColorStop(0.55, '#ffd166'); g.addColorStop(1, '#f59e0b');
    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(245,158,11,.75)'; ctx.shadowBlur = r * view.tile * 0.35;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(180,83,9,.65)'; ctx.lineWidth = 0.035;
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    var t = game.time;
    ctx.fillStyle = '#e9defc';
    ctx.fillRect(-view.ox / view.tile - 1, -view.oy / view.tile - 1,
      (view.w + view.ox * 2) / view.tile + 2, (view.h + view.oy * 2) / view.tile + 2);
    ctx.fillStyle = '#7c4a21';
    ctx.fillRect(0, 0, game.cols, game.rows);
    for (var y = 0; y < game.rows; y++) {
      for (var x = 0; x < game.cols; x++) {
        if (game.walls[y][x]) continue;
        ctx.fillStyle = (x + y) % 2 === 0 ? '#ffe9c9' : '#ffdfae';
        ctx.fillRect(x, y, 1, 1);
      }
    }
    ctx.fillStyle = 'rgba(78, 205, 196, .45)';
    ctx.beginPath(); ctx.arc(game.start.x, game.start.y, 0.42, 0, 6.3); ctx.fill();
    for (var wy = 0; wy < game.rows; wy++) {
      for (var wx = 0; wx < game.cols; wx++) {
        if (!game.walls[wy][wx]) continue;
        var grad = ctx.createLinearGradient(wx, wy, wx, wy + 1);
        grad.addColorStop(0, '#b07a3f'); grad.addColorStop(0.5, '#96622c'); grad.addColorStop(1, '#7c4a21');
        ctx.fillStyle = grad;
        ctx.fillRect(wx, wy, 1, 1);
        ctx.fillStyle = 'rgba(255,255,255,.20)';
        roundRect(wx + 0.06, wy + 0.06, 0.88, 0.30, 0.10); ctx.fill();
        ctx.strokeStyle = 'rgba(60,32,8,.45)'; ctx.lineWidth = 0.035;
        roundRect(wx + 0.045, wy + 0.045, 0.91, 0.91, 0.12); ctx.stroke();
      }
    }
    for (var h = 0; h < game.holes.length; h++) {
      var hole = game.holes[h];
      var hg = ctx.createRadialGradient(hole.x - 0.08, hole.y - 0.08, 0.05, hole.x, hole.y, 0.36);
      hg.addColorStop(0, '#160a2e'); hg.addColorStop(0.75, '#2d1454'); hg.addColorStop(1, 'rgba(45,20,84,0)');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hole.x, hole.y, 0.36, 0, 6.3); ctx.fill();
    }
    // Радужный финиш.
    var pulse = 1 + Math.sin(t * 4) * 0.07;
    var rings = ['#ff5d8f', '#ff9f1c', '#ffd166', '#7ee081', '#4ecdc4', '#a78bfa'];
    for (var ri = rings.length - 1; ri >= 0; ri--) {
      ctx.fillStyle = rings[ri];
      ctx.beginPath(); ctx.arc(game.finish.x, game.finish.y, (0.14 + ri * 0.055) * pulse, 0, 6.3); ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(game.finish.x, game.finish.y, 0.13 * pulse, 0, 6.3); ctx.fill();
    ctx.font = (0.30 * pulse) + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🏁', game.finish.x, game.finish.y + 0.02);
    // Звёздочки: золотые, медленно крутятся и покачиваются.
    for (var i = 0; i < game.stars.length; i++) {
      var st = game.stars[i];
      if (st.taken) continue;
      var bob = Math.sin(t * 3 + st.spin) * 0.045;
      ctx.fillStyle = 'rgba(70,30,0,.20)';
      ctx.beginPath(); ctx.ellipse(st.x + 0.03, st.y + 0.20 + bob, 0.17, 0.06, 0, 0, 6.3); ctx.fill();
      drawStarShape(st.x, st.y + bob, 0.27, Math.sin(t * 1.6 + st.spin) * 0.35);
    }
    for (var p = 0; p < game.particles.length; p++) {
      var pt = game.particles[p];
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, 6.3); ctx.fill();
    }
    ctx.globalAlpha = 1;
    drawBall();
  }

  function drawBall() {
    var b = game.ball;
    var scale = game.falling > 0 ? game.fallScale : 1;
    var r = b.r * scale;
    ctx.fillStyle = 'rgba(70,30,0,.28)';
    ctx.beginPath(); ctx.ellipse(b.x + 0.05, b.y + r * 0.82, r * 0.9, r * 0.34, 0, 0, 6.3); ctx.fill();
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(scale, scale);
    ctx.beginPath(); ctx.arc(0, 0, b.r, 0, 6.3); ctx.clip();
    var base = ctx.createRadialGradient(-b.r * 0.35, -b.r * 0.4, b.r * 0.15, 0, 0, b.r * 1.25);
    base.addColorStop(0, '#ff8fab'); base.addColorStop(0.55, '#f43f72'); base.addColorStop(1, '#c21847');
    ctx.fillStyle = base; ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
    ctx.save();
    ctx.rotate(b.roll);
    ctx.fillStyle = 'rgba(255, 209, 102, .85)';
    ctx.fillRect(-b.r, -b.r * 0.62, b.r * 2, b.r * 0.34);
    ctx.fillStyle = 'rgba(78, 205, 196, .85)';
    ctx.fillRect(-b.r, b.r * 0.28, b.r * 2, b.r * 0.34);
    ctx.restore();
    var shine = ctx.createRadialGradient(-b.r * 0.38, -b.r * 0.45, 0.02, -b.r * 0.3, -b.r * 0.35, b.r * 0.75);
    shine.addColorStop(0, 'rgba(255,255,255,.85)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine; ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
    ctx.restore();
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(scale, scale);
    var lookX = Math.max(-1, Math.min(1, b.vx / 4)) * b.r * 0.22;
    var lookY = Math.max(-1, Math.min(1, b.vy / 4)) * b.r * 0.22;
    ctx.fillStyle = '#38104f';
    ctx.beginPath(); ctx.arc(-b.r * 0.34 + lookX, -b.r * 0.10 + lookY, b.r * 0.11, 0, 6.3); ctx.fill();
    ctx.beginPath(); ctx.arc(b.r * 0.34 + lookX, -b.r * 0.10 + lookY, b.r * 0.11, 0, 6.3); ctx.fill();
    ctx.strokeStyle = '#38104f'; ctx.lineWidth = b.r * 0.10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(lookX, b.r * 0.08 + lookY, b.r * 0.34, 0.35, Math.PI - 0.35); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = 'rgba(120,10,50,.35)'; ctx.lineWidth = 0.03;
    ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 6.3); ctx.stroke();
  }

  // ---------- Главный цикл ----------
  var lastFrame = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    var dt = Math.min(0.033, (now - lastFrame) / 1000 || 0.016);
    lastFrame = now;
    if (!game.playing || document.hidden) return;
    game.time += dt;

    var target = computeTiltTarget();
    if (Math.hypot(target.x, target.y) < 0.05) { target.x = 0; target.y = 0; }
    var k = 1 - Math.exp(-dt * 9);
    tilt.x += (target.x - tilt.x) * k;
    tilt.y += (target.y - tilt.y) * k;

    game.elapsed += dt;
    stepPhysics(dt);

    draw();
  }

  // ---------- Экраны и кнопки (только картинки) ----------
  function showWin() {
    if (!game.won) return;
    game.playing = false;
    stopSpeech();
    var winStarsEl = $('winStars');
    winStarsEl.innerHTML = '';
    var need = game.stars.length;
    for (var i = 0; i < need; i++) {
      var star = document.createElement('span');
      star.className = 'win-star' + (i < game.collected ? ' got' : '');
      star.textContent = i < game.collected ? '⭐' : '☆';
      star.style.animationDelay = (i * 0.09) + 's';
      winStarsEl.appendChild(star);
    }
    $('btnNextLevel').style.display = game.levelIndex + 1 < LEVELS.length ? '' : 'none';
    winOverlay.hidden = false;
  }

  function buildLevelGrid() {
    var grid = $('levelGrid');
    grid.innerHTML = '';
    LEVELS.forEach(function (lv, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-btn' + (i === game.levelIndex ? ' current' : '') + (i >= save.unlocked ? ' locked' : '');
      btn.setAttribute('aria-label', 'Лабиринт ' + (i + 1));
      var count = save.stars[i] || 0;
      var starsHtml = '';
      for (var p = 0; p < i + 1; p++) starsHtml += p < count ? '⭐' : '☆';
      btn.innerHTML = '<span class="lv-num">' + (i >= save.unlocked ? '🔒' : String(i + 1)) + '</span>' +
        '<span class="lv-stars">' + starsHtml + '</span>';
      btn.disabled = i >= save.unlocked;
      btn.addEventListener('click', function () {
        levelsOverlay.hidden = true;
        startLevel(i);
      });
      grid.appendChild(btn);
    });
  }

  function startLevel(index) {
    stopSpeech();
    loadLevel(index);
    game.playing = true;
    winOverlay.hidden = true;
    pauseOverlay.hidden = true;
    levelsOverlay.hidden = true;
  }

  function setMode(mode) {
    inputMode = mode;
  }

  async function enableSensorsAndPlay() {
    var btn = $('btnEnableSensors');
    btn.disabled = true; btn.textContent = '📱 ⏳';
    ensureAudio();
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        var p1 = await DeviceOrientationEvent.requestPermission();
        if (p1 !== 'granted') throw new Error('orientation denied');
      }
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        var p2 = await DeviceMotionEvent.requestPermission();
        if (p2 !== 'granted') throw new Error('motion denied');
      }
    } catch (e) {
      btn.disabled = false; btn.textContent = '📱 ▶️';
      sensorNoteEl.textContent = '📱 🔒 ❌';
      return;
    }
    window.addEventListener('deviceorientation', onOrientation, true);
    window.addEventListener('devicemotion', onMotion, true);
    setMode('sensor');
    calibrateWhenReady = true;
    startOverlay.hidden = true;
    startLevel(0);
    setTimeout(function () {
      if (!gyro.seen && !accel.seen) {
        sensorNoteEl.textContent = '📱 ❓';
      } else if (calibrateWhenReady) {
        calibrateWhenReady = false;
        calibrate('🎯 👍 📱');
      }
    }, 1600);
  }

  $('btnEnableSensors').addEventListener('click', enableSensorsAndPlay);
  $('btnEmulator').addEventListener('click', function () {
    ensureAudio();
    setMode('emu');
    startOverlay.hidden = true;
    startLevel(0);
  });
  function openPause() {
    if (!game.playing) return;
    game.playing = false;
    stopSpeech();
    pauseOverlay.hidden = false;
  }
  // Удержание ДВУМЯ пальцами ~1 c — случайное детское касание меню не откроет.
  var pointers = new Map();
  var twoFingerStart = 0;
  canvas.addEventListener('pointerdown', function (e) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size >= 2 && !twoFingerStart) twoFingerStart = performance.now();
  });
  canvas.addEventListener('pointermove', function (e) {
    var pt = pointers.get(e.pointerId);
    if (pt && Math.hypot(e.clientX - pt.x, e.clientY - pt.y) > 32) twoFingerStart = 0;
  });
  function endPointer(e) {
    if (twoFingerStart && performance.now() - twoFingerStart >= 900 && pointers.size >= 2) openPause();
    pointers.delete(e.pointerId);
    if (pointers.size < 2) twoFingerStart = 0;
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  $('btnResume').addEventListener('click', function () {
    pauseOverlay.hidden = true;
    game.playing = true;
    lastFrame = performance.now();
  });
  $('btnCalibrate').addEventListener('click', function () {
    ensureAudio(); calibrate();
    var btn = this;
    btn.textContent = '👍';
    setTimeout(function () { btn.textContent = '🎯'; }, 700);
  });
  $('btnRestart').addEventListener('click', function () { startLevel(game.levelIndex); });
  var levelsReturnTo = 'pause';
  $('btnLevels').addEventListener('click', function () { levelsReturnTo = 'pause'; pauseOverlay.hidden = true; buildLevelGrid(); levelsOverlay.hidden = false; game.playing = false; });
  $('btnWinLevels').addEventListener('click', function () { levelsReturnTo = 'win'; winOverlay.hidden = true; buildLevelGrid(); levelsOverlay.hidden = false; });
  $('btnCloseLevels').addEventListener('click', function () { levelsOverlay.hidden = true; if (levelsReturnTo === 'win') winOverlay.hidden = false; else pauseOverlay.hidden = false; });
  $('btnNextLevel').addEventListener('click', function () { startLevel(Math.min(game.levelIndex + 1, LEVELS.length - 1)); });
  $('btnReplayLevel').addEventListener('click', function () { startLevel(game.levelIndex); });
  $('btnSound').addEventListener('click', function () {
    save.sound = !save.sound; persist();
    this.textContent = save.sound ? '🔊' : '🔇';
    if (!save.sound) stopSpeech();
    if (save.sound) { ensureAudio(); tone(660, 0.12, 'triangle', 0.15); }
  });
  $('btnFullscreen').addEventListener('click', function () {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (e) {}
  });
  document.addEventListener('visibilitychange', function () { lastFrame = performance.now(); });

  // ---------- Старт ----------
  $('btnSound').textContent = save.sound ? '🔊' : '🔇';
  loadLevel(0);
  draw();
  requestAnimationFrame(loop);

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }

  window.__tiltMaze = {
    levels: LEVELS,
    game: game,
    tilt: tilt,
    setTilt: function (x, y) { tiltTarget.x = x; tiltTarget.y = y; tilt.x = x; tilt.y = y; },
    setEmuTilt: function (x, y) { emu.x = x; emu.y = y; syncEmuKnob(); },
    setMode: setMode,
    startLevel: startLevel,
    sensorState: function () { return { mode: inputMode, gyroSeen: gyro.seen, accelSeen: accel.seen }; },
  };

  if (/[?&]emu=1/.test(location.search)) {
    setMode('emu');
    startOverlay.hidden = true;
    startLevel(0);
  }
})();
