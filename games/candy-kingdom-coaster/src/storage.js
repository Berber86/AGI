// Persistent records & medal collection, stored locally in this browser.
import { GAME } from './config.js';

const P = GAME.storagePrefix;

function read(key, fallback) {
  try {
    const v = localStorage.getItem(P + key);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try { localStorage.setItem(P + key, JSON.stringify(value)); } catch { /* private mode */ }
}

export const Storage = {
  getRecords() {
    return read('records', {
      bestTimeMs: null,      // fastest clean finish
      bestSweets: 0,         // most sweets in one ride
      bestScore: 0,          // best single-ride score
      rides: 0,
      totalMedals: 0,        // sum of all medals ever earned
      totalStars: 0,         // sum of all stars ever earned
      muted: false,
    });
  },
  saveRecords(r) { write('records', r); },
  getMuted() { return !!read('records', { muted: false }).muted; },
  setMuted(m) {
    const r = this.getRecords();
    r.muted = !!m;
    this.saveRecords(r);
  },
  // VR-поездка: режим взгляда и расстояние между стереокамерами (см).
  getVrSettings() {
    return read('vr', { lookMode: 'look', baselineCm: 10, gestureZoom: false });
  },
  saveVrSettings(s) {
    const clean = {
      lookMode: s && (s.lookMode === 'forward' || s.lookMode === 'camera' || s.lookMode === 'camera-dual') ? s.lookMode : 'look',
      camColor: s && typeof s.camColor === 'string' ? s.camColor : 'raspberry',
      camHue: s && Number.isFinite(s.camHue) ? s.camHue : null,
      camLeftColor: s && typeof s.camLeftColor === 'string' ? s.camLeftColor : 'orange',
      camLeftHue: s && Number.isFinite(s.camLeftHue) ? s.camLeftHue : null,
      camRightColor: s && typeof s.camRightColor === 'string' ? s.camRightColor : 'raspberry',
      camRightHue: s && Number.isFinite(s.camRightHue) ? s.camRightHue : null,
      camTol: Math.min(45, Math.max(8, Math.round(+((s && s.camTol) || 26)) || 26)),
      camSat: Math.min(70, Math.max(20, Math.round(+((s && s.camSat) || 42)) || 42)),
      driverMode: s && s.driverMode === 'remote' ? 'remote' : 'auto',
      gestureZoom: !!(s && s.gestureZoom),
      baselineCm: Math.min(150, Math.max(10, Math.round(+((s && s.baselineCm) || 10)) || 10)),
    };
    write('vr', clean);
    return clean;
  },
  // Returns updated records after a finished ride.
  commitRun({ timeMs, sweets, total, score, medalsEarned, starsEarned }) {
    const r = this.getRecords();
    r.rides += 1;
    r.totalMedals += medalsEarned;
    r.totalStars += starsEarned;
    if (r.bestTimeMs == null || timeMs < r.bestTimeMs) r.bestTimeMs = timeMs;
    if (sweets > r.bestSweets) r.bestSweets = sweets;
    if (score > r.bestScore) r.bestScore = score;
    this.saveRecords(r);
    return r;
  },
};
