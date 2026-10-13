// HUD: chips, boost meter, popups. DOM-based for crisp mobile text.
import { formatTime, GAME, MEDALS, TIME_MEDAL, ZONES } from './config.js';

export class HUD {
  constructor(root, track) {
    this.track = track;
    this.root = root;
    this.$ = (sel) => root.querySelector(sel);

    this.el = {
      sweets: this.$('#hud-sweets'),
      sweetsFill: this.$('#hud-sweets-fill'),
      cakeRow: this.$('#hud-cakes'),
      popupLayer: this.$('#popup-layer'),
      btnSound: this.$('#btn-sound'),
      btnPause: this.$('#btn-pause'),
    };
    this.cakes = [...root.querySelectorAll('#hud-cakes .cake')];
    this._popupTimer = 0;
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

  update({ timeS, speedKmh, sweets, total, boostCharges, boostActive, score }) {
    // icon-first HUD: big candy count + bars + cupcake charges (no words)
    const s = `${sweets}`;
    if (this.el.sweets.textContent !== s) {
      this.el.sweets.textContent = s;
      this.el.sweets.classList.remove('bump');
      void this.el.sweets.offsetWidth;
      this.el.sweets.classList.add('bump');
    }
    this.el.sweetsFill.style.width = `${Math.min(100, total ? (sweets / total) * 100 : 0)}%`;
    this.cakes.forEach((c, i) => c.classList.toggle('charged', boostActive || i < boostCharges));
    this.el.cakeRow.classList.toggle('is-boosting', !!boostActive);
    document.body.classList.toggle('is-boosting', !!boostActive);
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
