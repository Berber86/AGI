// Иконки интерфейса (SVG — одинаково выглядят на любом телефоне, без эмодзи-шрифтов).
const svg = (body, vb = '0 0 48 48') => `<svg viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICONS = {
  camera: svg('<rect x="5" y="13" width="38" height="27" rx="7" fill="#fff"/><path d="M16 13l3-6h10l3 6z" fill="#fff"/><circle cx="24" cy="26.5" r="9" fill="#7c4dff"/><circle cx="24" cy="26.5" r="5" fill="#b9a3ff"/><circle cx="36" cy="19" r="2.2" fill="#ffc83d"/>'),
  back: svg('<path d="M29 10L15 24l14 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
  play: svg('<path d="M16 9l24 15-24 15z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>'),
  replay: svg('<path d="M12 24a12 12 0 1 0 4-9" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/><path d="M9 8v10h10" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  map: svg('<rect x="7" y="7" width="14" height="14" rx="4" fill="currentColor"/><rect x="27" y="7" width="14" height="14" rx="4" fill="currentColor"/><rect x="7" y="27" width="14" height="14" rx="4" fill="currentColor"/><rect x="27" y="27" width="14" height="14" rx="4" fill="currentColor"/>'),
  eye: svg('<path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z" fill="#fff" stroke="currentColor" stroke-width="3.5"/><circle cx="24" cy="24" r="7.5" fill="#2f6ff0"/><circle cx="24" cy="24" r="3.5" fill="#111"/><circle cx="26.5" cy="21.5" r="1.6" fill="#fff"/>'),
  gear: svg('<path d="M24 15a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm17 12v-6l-5-1a13 13 0 0 0-1.6-3.8l3-4.2-4.3-4.3-4.2 3a13 13 0 0 0-3.9-1.6L24 3h-6l-1 5.1a13 13 0 0 0-3.9 1.6l-4.2-3-4.3 4.3 3 4.2A13 13 0 0 0 6 19l-5 1v6l5 1a13 13 0 0 0 1.6 3.9l-3 4.2 4.3 4.3 4.2-3a13 13 0 0 0 3.9 1.6l1 5h6l1-5a13 13 0 0 0 3.9-1.6l4.2 3 4.3-4.3-3-4.2a13 13 0 0 0 1.6-3.9z" fill="currentColor" transform="translate(3 1) scale(.88)"/>'),
  gallery: svg('<rect x="6" y="9" width="36" height="30" rx="6" fill="#fff"/><circle cx="17" cy="19" r="4" fill="#ffc83d"/><path d="M9 36l10-11 7 7 5-5 8 9z" fill="#2fb84a"/>'),
  close: svg('<path d="M13 13l22 22M35 13L13 35" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>'),
};
