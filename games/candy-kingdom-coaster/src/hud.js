// HUD: chips, minimap, boost meter, popups. DOM-based for crisp mobile text.
import { formatTime, GAME, MEDALS, TIME_MEDAL, ZONES } from './config.js';

export class HUD {
  constructor(root, track) {
    this.track = track;
    this.root = root;
    this.$ = (sel) => root.querySelector(sel);

    this.el = {
      timer: this.$('#hud-timer'),
      zone: this.$('#hud-zone'),
      speed: this.$('#hud-speed'),
      sweets: this.$('#hud-sweets'),
      boost: this.$('#hud-boost-fill'),
      boostWrap: this.$('#hud-boost'),
      score: this.$('#hud-score'),
      popupLayer: this.$('#popup-layer'),
      minimap: this.$('#minimap'),
      btnSound: this.$('#btn-sound'),
      btnPause: this.$('#btn-pause'),
    };
    this.mm = this.el.minimap.getContext('2d');
    this._popupTimer = 0;

    // precompute normalized minimap path
    const pts = track.samples;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    }
    this.mmBounds = { minX, maxX, minZ, maxZ };
  }

  setMuted(m) {
    this.el.btnSound.classList.toggle('is-muted', m);
    this.el.btnSound.textContent = m ? '🔇' : '🔊';
  }

  popup(text, color = '#fff') {
    const div = document.createElement('div');
    div.className = 'popup';
    div.textContent = text;
    div.style.color = color;
    this.el.popupLayer.appendChild(div);
    setTimeout(() => div.remove(), 950);
  }

  update({ timeS, speedKmh, sweets, total, zoneName, zoneIndex, boostCharges, boostActive, score }) {
    this.el.timer.textContent = formatTime(timeS);
    this.el.zone.textContent = zoneName || 'Candy Kingdom';
    this.el.zone.dataset.zone = zoneIndex ?? 0;
    this.el.speed.textContent = `${Math.round(speedKmh)}`;
    this.el.sweets.textContent = `${sweets}/${total}`;
    this.el.score.textContent = `${score}`;
    const pct = Math.min(1, boostCharges / 4) * 100;
    this.el.boost.style.width = `${boostActive ? 100 : pct}%`;
    this.el.boostWrap.classList.toggle('is-boosting', !!boostActive);
    this.el.boostWrap.classList.toggle('is-full', !boostActive && boostCharges >= 4);
  }

  drawMinimap(carU, sweetsList) {
    const c = this.mm;
    const W = this.el.minimap.width, H = this.el.minimap.height;
    const { minX, maxX, minZ, maxZ } = this.mmBounds;
    const pad = 14;
    const sx = (W - pad * 2) / (maxX - minX);
    const sz = (H - pad * 2) / (maxZ - minZ);
    const s = Math.min(sx, sz);
    const ox = pad + ((W - pad * 2) - (maxX - minX) * s) / 2;
    const oy = pad + ((H - pad * 2) - (maxZ - minZ) * s) / 2;
    const map = (p) => [ox + (p.x - minX) * s, oy + (p.z - minZ) * s];

    c.clearRect(0, 0, W, H);
    c.fillStyle = 'rgba(30, 12, 40, 0.35)';
    c.fillRect(0, 0, W, H);

    // track line
    c.lineWidth = 7;
    c.strokeStyle = 'rgba(255,255,255,0.85)';
    c.lineJoin = 'round';
    c.beginPath();
    this.track.samples.forEach((p, i) => {
      const [x, y] = map(p);
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    });
    c.stroke();
    c.lineWidth = 3;
    c.strokeStyle = 'rgba(255, 120, 190, 0.9)';
    c.stroke();

    // finish marker
    const fin = this.track.samples[this.track.samples.length - 1];
    const [fx, fy] = map(fin);
    c.fillStyle = '#fff';
    c.fillRect(fx - 5, fy - 5, 10, 10);
    c.fillStyle = '#333';
    c.fillRect(fx - 5, fy - 5, 5, 5);
    c.fillRect(fx, fy, 5, 5);

    // sweets
    if (sweetsList) {
      for (const it of sweetsList) {
        if (it.collected) continue;
        const [x, y] = map(it.mesh.position);
        c.fillStyle = it.type === 'star' ? '#ffd45e' : it.type === 'cupcake' ? '#ff9ed2' : '#8ef0c8';
        c.beginPath(); c.arc(x, y, 2.6, 0, Math.PI * 2); c.fill();
      }
    }

    // car
    const carP = this.track.getPose(carU * this.track.length, 0);
    const [cx, cy] = map(carP.pos);
    c.fillStyle = '#ff2f86';
    c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.stroke();
  }

  renderMedals({ sweets, total, timeMs, score }) {
    const frac = total ? sweets / total : 0;
    const rows = MEDALS.map((m) => {
      const got = frac >= m.minFraction;
      return `<div class="medal ${got ? 'earned' : 'locked'}">
        <span class="medal-icon">${m.icon}</span>
        <div><b>${m.name}</b><small>${m.requirement}</small></div>
        <span class="medal-state">${got ? '✓' : '—'}</span>
      </div>`;
    }).join('');
    const timeGot = timeMs / 1000 < TIME_MEDAL.maxSeconds;
    const timeRow = `<div class="medal ${timeGot ? 'earned' : 'locked'}">
        <span class="medal-icon">${TIME_MEDAL.icon}</span>
        <div><b>${TIME_MEDAL.name}</b><small>${TIME_MEDAL.requirement}</small></div>
        <span class="medal-state">${timeGot ? '✓' : '—'}</span>
      </div>`;
    return rows + timeRow;
  }
}

export function fillRecordsPanel(el, records) {
  const best = records.bestTimeMs != null ? formatTime(records.bestTimeMs / 1000) : '—:—:—';
  el.innerHTML = `
    <div class="rec"><span>🏆 Медали всего</span><b>${records.totalMedals}</b></div>
    <div class="rec"><span>⭐ Звёзды всего</span><b>${records.totalStars}</b></div>
    <div class="rec"><span>⏱️ Лучшее время</span><b>${best}</b></div>
    <div class="rec"><span>🍬 Сладостей за раз</span><b>${records.bestSweets}</b></div>
    <div class="rec"><span>🎮 Заездов</span><b>${records.rides}</b></div>
  `;
}

export { GAME, ZONES };
