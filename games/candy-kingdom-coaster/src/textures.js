// Candy Kingdom Coaster — real image textures.
//
// The art lives in assets/textures/*.jpg (generated, then conditioned by
// assets/textures/build-textures.py). Everything is loaded up front so the
// world is built with its final materials; any file that fails to load (or is
// slow beyond the timeout) resolves to `null` and the caller falls back to the
// procedural canvas texture it used before — the game never blocks on art.
import * as THREE from 'three';

const TEXTURE_ROOT = new URL('../assets/textures/', import.meta.url);

// key → file + sampling setup. `wrap` applies to both axes unless wrapS/wrapT
// are given. Mirrored repeat makes a non-seamless tile continuous for free.
export const TEXTURE_MANIFEST = {
  road:         { file: 'road.jpg' },                                  // composited into the ribbon strip by track.js
  meadow:       { file: 'meadow.jpg', wrap: 'mirror' },                // shoulders, world-scale UVs
  fields:       { file: 'fields.jpg', wrap: 'mirror', repeat: [5, 5] },// far ground disc (~440 m per tile)
  lolliPink:    { file: 'lollipop-pink.jpg' },
  lolliBlue:    { file: 'lollipop-blue.jpg' },
  lolliYellow:  { file: 'lollipop-yellow.jpg' },
  cane:         { file: 'cane.jpg' },
  cookie:       { file: 'cookie.jpg' },
  wall:         { file: 'wall.jpg', wrap: 'mirror', repeat: [4, 2] },  // castle wafer bricks
  donutPink:    { file: 'donut-pink.jpg', wrapT: 'mirror', repeat: [1, 2] },
  donutLilac:   { file: 'donut-lilac.jpg', wrapT: 'mirror', repeat: [1, 2] },
};

const WRAP = {
  clamp: THREE.ClampToEdgeWrapping,
  repeat: THREE.RepeatWrapping,
  mirror: THREE.MirroredRepeatWrapping,
};

export function textureUrl(key) {
  const entry = TEXTURE_MANIFEST[key];
  return entry ? new URL(entry.file, TEXTURE_ROOT).href : null;
}

function configure(tex, entry, anisotropy) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = WRAP[entry.wrapS || entry.wrap || 'clamp'];
  tex.wrapT = WRAP[entry.wrapT || entry.wrap || 'clamp'];
  if (entry.repeat) tex.repeat.set(entry.repeat[0], entry.repeat[1]);
  tex.anisotropy = anisotropy;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Load every manifest texture. Resolves to `{ key: THREE.Texture | null }`.
 *
 * @param {object} opts
 * @param {THREE.WebGLRenderer} [opts.renderer]  used for the anisotropy cap
 * @param {number} [opts.timeoutMs=12000]        give up waiting (slow phones on 3G still get a playable game)
 * @param {(loaded:number,total:number)=>void} [opts.onProgress]
 */
export function loadTextures({ renderer, timeoutMs = 12000, onProgress } = {}) {
  const keys = Object.keys(TEXTURE_MANIFEST);
  const result = Object.fromEntries(keys.map((k) => [k, null]));
  const maxAniso = renderer ? renderer.capabilities.getMaxAnisotropy() : 4;
  const anisotropy = Math.min(8, Math.max(1, maxAniso));
  const loader = new THREE.TextureLoader();
  let done = 0;
  const tick = () => { done++; if (onProgress) onProgress(done, keys.length); };

  const jobs = keys.map((key) => new Promise((resolve) => {
    const entry = TEXTURE_MANIFEST[key];
    loader.load(
      new URL(entry.file, TEXTURE_ROOT).href,
      (tex) => { result[key] = configure(tex, entry, anisotropy); tick(); resolve(); },
      undefined,
      () => { console.warn(`[CKC] texture "${key}" failed to load — using procedural fallback`); tick(); resolve(); }
    );
  }));

  const all = Promise.all(jobs);
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  // Whatever arrived by the deadline is used; stragglers are simply ignored
  // (their materials were already built with the procedural fallback).
  return Promise.race([all, timeout]).then(() => ({ ...result }));
}

/** Count of real textures that made it in — handy for diagnostics/tests. */
export function countLoaded(tex) {
  return Object.values(tex).filter(Boolean).length;
}
