// DOM-слой: стартовый экран, панели, подсказки и карточка произведения.
// Внутри VR весь этот слой скрыт: интерфейс там — медальоны на полу.

import { ARTWORKS, SCULPTURES, POINTS, DWELL_SECONDS } from './config.js';

const $ = (id) => document.getElementById(id);

export function createUI(handlers = {}) {
  const el = {
    start: $('start'),
    hud: $('hud'),
    loading: $('loading'),
    loadingFill: $('loading-fill'),
    loadingNote: $('loading-note'),
    loadingTitle: $('loading-title'),
    reticle: $('reticle'),
    arc: $('reticle-arc'),
    dwellNote: $('dwell-note'),
    dwellTitle: $('dwell-title'),
    dwellTime: $('dwell-time'),
    infoCard: $('info-card'),
    infoKind: $('info-kind'),
    infoTitle: $('info-title'),
    infoMeta: $('info-meta'),
    infoNote: $('info-note'),
    debugTravel: $('debug-travel'),
    pointName: $('point-name'),
    back: $('btn-back'),
    recenter: $('btn-recenter'),
    vrSetup: $('vr-setup'),
    settings: $('settings'),
    collection: $('collection'),
    collectionList: $('collection-list'),
    gyroStatus: $('gyro-status'),
    startQuality: $('start-quality'),
    toast: $('toast'),
    fade: $('fade'),
    strip: $('exhibit-strip'),
    webglError: $('webgl-error'),
  };

  let toastTimer = 0;
  let vrHintEl = null;

  function setLoading(progress, note) {
    if (el.loadingFill) el.loadingFill.style.width = `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%`;
    if (note && el.loadingNote) el.loadingNote.textContent = note;
  }

  function hideLoading() {
    el.loading.classList.add('done');
    window.setTimeout(() => { el.loading.hidden = true; }, 650);
  }

  function showStart(show) {
    el.start.classList.toggle('hidden', !show);
  }

  function showHUD(show) {
    el.hud.hidden = !show;
  }

  function setPointName(point) {
    if (!point) return;
    const index = POINTS.findIndex((p) => p.id === point.id) + 1;
    el.pointName.textContent = `Точка ${index} · ${point.name}`;
  }

  // Близкий осмотр: внизу вместо «Вернуть взгляд» — «Отойти», в углу — название холста.
  function setCloseUp(active, title = '') {
    document.body.classList.toggle('studying', Boolean(active));
    if (el.back) el.back.hidden = !active;
    if (el.recenter) el.recenter.hidden = Boolean(active);
    if (el.pointName && active) {
      el.pointName.textContent = `Близкий осмотр · ${title}`;
    }
  }

  function setDwell({ active, progress = 0, point = null }) {
    const frac = Math.max(0, Math.min(1, progress));
    el.arc.style.strokeDashoffset = String(188.5 * (1 - frac));
    el.reticle.classList.toggle('hot', active);
    if (active && point) {
      el.dwellNote.hidden = false;
      el.dwellTitle.textContent = point.name;
      const left = Math.max(0, DWELL_SECONDS * (1 - frac));
      el.dwellTime.textContent = `${left.toFixed(1).replace('.', ',')} с`;
    } else {
      el.dwellNote.hidden = true;
    }
  }

  let infoPinnedUntil = 0;
  function setInfo(exhibit, pin = false) {
    if (pin) infoPinnedUntil = performance.now() + 4200;
    if (performance.now() < infoPinnedUntil && !pin) return;
    if (!exhibit) {
      el.infoCard.hidden = true;
      return;
    }
    el.infoCard.hidden = false;
    el.infoKind.textContent = exhibit.kind === 'painting' ? 'ЖИВОПИСЬ · ЭРМИТАЖ' : 'СКУЛЬПТУРА · ЭРМИТАЖ';
    el.infoTitle.textContent = exhibit.title;
    el.infoMeta.textContent = `${exhibit.author} · ${exhibit.year}`;
    el.infoNote.textContent = exhibit.note || '';
  }

  function setQualityLabel(quality) {
    el.startQuality.textContent = `Графика: ${quality === 'high' ? 'высокая' : 'лёгкая'}`;
    document.querySelectorAll('[data-quality]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.quality === quality));
    });
  }

  function setGyroStatus(text) {
    if (el.gyroStatus) el.gyroStatus.textContent = text;
  }

  function toast(message, ms = 2600) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    document.body.classList.add('toasting');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      el.toast.classList.remove('show');
      document.body.classList.remove('toasting');
    }, ms);
  }

  function openPanel(name) {
    const map = { settings: el.settings, collection: el.collection, vr: el.vrSetup };
    Object.entries(map).forEach(([key, node]) => { if (node) node.hidden = key !== name; });
    if (name) document.body.classList.add('panel-open');
    else document.body.classList.remove('panel-open');
  }

  function closePanels() {
    el.settings.hidden = true;
    el.collection.hidden = true;
    el.vrSetup.hidden = true;
    document.body.classList.remove('panel-open');
  }

  function fadeTo(opacity) {
    el.fade.style.opacity = String(Math.max(0, Math.min(1, opacity)));
  }

  function showVRHint(text = 'Наденьте очки', sub = 'Смотрите на медальон. Десять секунд — и вы у следующей точки.') {
    if (!vrHintEl) {
      vrHintEl = document.createElement('div');
      vrHintEl.className = 'vr-hint';
      vrHintEl.innerHTML = '<h2></h2><p></p>';
      document.getElementById('app').appendChild(vrHintEl);
    }
    vrHintEl.classList.remove('gone');
    vrHintEl.querySelector('h2').textContent = text;
    vrHintEl.querySelector('p').textContent = sub;
    vrHintEl.hidden = false;
  }

  function hideVRHint(delay = 0) {
    if (!vrHintEl) return;
    window.setTimeout(() => {
      if (!vrHintEl) return;
      vrHintEl.classList.add('gone');
      window.setTimeout(() => { if (vrHintEl) vrHintEl.hidden = true; }, 750);
    }, delay);
  }

  function buildCollection() {
    const items = [
      ...ARTWORKS.map((a) => ({ ...a, kind: 'painting' })),
      ...SCULPTURES.map((s) => ({ ...s, kind: 'sculpture' })),
    ];
    el.collectionList.innerHTML = items.map((item) => `
      <article class="collection-item">
        ${item.thumb ? `<img src="./${item.thumb}" alt="" loading="lazy">` : '<div style="width:76px;height:58px;border:1px solid rgba(217,180,106,.25);border-radius:2px"></div>'}
        <div>
          <strong>${item.title}</strong>
          <span>${item.author} · ${item.year}</span>
          <p>${item.technique}</p>
        </div>
      </article>`).join('');
  }

  function buildStrip() {
    el.strip.innerHTML = ARTWORKS.map((a) => `
      <li><img src="./${a.thumb}" alt="" loading="lazy"><b>${a.author.split(' ')[0]}</b> · ${a.title}</li>`).join('');
  }

  function bind() {
    $('btn-enter').addEventListener('click', () => handlers.onEnter && handlers.onEnter());
    $('btn-enter-vr').addEventListener('click', () => handlers.onOpenVR && handlers.onOpenVR());
    $('btn-vr').addEventListener('click', () => handlers.onOpenVR && handlers.onOpenVR());
    $('btn-vr-go').addEventListener('click', () => handlers.onEnterVR && handlers.onEnterVR());
    $('btn-vr-cancel').addEventListener('click', () => { closePanels(); });
    $('btn-settings').addEventListener('click', () => openPanel('settings'));
    $('btn-collection').addEventListener('click', () => openPanel('collection'));
    $('btn-recenter').addEventListener('click', () => handlers.onRecenter && handlers.onRecenter());
    $('btn-back').addEventListener('click', () => handlers.onBack && handlers.onBack());
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => closePanels());
    });
    document.querySelectorAll('[data-quality]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const quality = btn.dataset.quality;
        setQualityLabel(quality);
        handlers.onQuality && handlers.onQuality(quality);
      });
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closePanels();
    });
  }

  bind();
  buildCollection();
  buildStrip();

  return {
    el,
    setLoading,
    hideLoading,
    showStart,
    showHUD,
    setPointName,
    setCloseUp,
    setDwell,
    setInfo,
    setQualityLabel,
    setGyroStatus,
    toast,
    openPanel,
    closePanels,
    fadeTo,
    debugTravel(text) {
      if (!el.debugTravel) return;
      el.debugTravel.hidden = !text;
      el.debugTravel.textContent = text || '';
    },
    showVRHint,
    hideVRHint,
    showWebGLError() {
      el.loading.hidden = true;
      el.webglError.hidden = false;
    },
  };
}
