// Lightweight boot UI: works before Three.js or the game has loaded.
// Percentages mark completed startup work, never a timer pretending to load.
let complete = false, progress = 0;
const $ = (id) => document.getElementById(id);

export function setLoading(value, step, message) {
  if (complete) return;
  const next = Math.min(99, Math.round(value));
  if (next < progress) return; // a timed-out texture can finish late
  progress = next;
  $('loading-hint').textContent = message;
  $('loading-percent').innerHTML = `${progress}<span>%</span>`;
  $('loading-fill').style.width = `${progress}%`;
  $('loading-progress').style.setProperty('--progress', `${progress}%`);
  $('loading-progress').setAttribute('aria-valuenow', String(progress));
  document.querySelectorAll('[data-load-step]').forEach((el) => {
    const i = Number(el.dataset.loadStep);
    el.classList.toggle('done', i < step);
    el.classList.toggle('current', i === step);
  });
}

export function finishLoading() {
  complete = true;
  progress = 100;
  $('loading-progress').setAttribute('aria-valuenow', '100');
  $('loading-fill').style.width = '100%';
  $('loading-panel').classList.add('hidden');
  $('loading-error').classList.add('hidden');
  $('btn-play').disabled = false;
  $('btn-play').classList.remove('hidden');
  document.querySelector('.welcome-action').setAttribute('aria-busy', 'false');
  document.querySelectorAll('[data-ready-control]').forEach((el) => { el.disabled = false; });
  document.body.dataset.boot = 'ready';
}

export function failLoading(message) {
  complete = true;
  $('loading-panel').classList.add('hidden');
  $('btn-play').classList.add('hidden');
  $('btn-play').disabled = true;
  $('loading-error-text').textContent = message;
  $('loading-error').classList.remove('hidden');
  document.querySelector('.welcome-action').setAttribute('aria-busy', 'false');
  document.body.dataset.boot = 'error';
}

// Give the loading screen a paint between expensive synchronous build stages.
export const paintLoading = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
