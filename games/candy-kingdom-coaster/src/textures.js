// Candy Kingdom Coaster — real (AI-generated, seamless) texture assets.
// URLs are resolved relative to this module, so they work under any subpath.
import * as THREE from 'three';

export const TEX = {
  road: new URL('../assets/textures/road-candy.jpg', import.meta.url).href,
  ground: new URL('../assets/textures/ground-candy-meadow.jpg', import.meta.url).href,
  cookie: new URL('../assets/textures/cookie-gingerbread.jpg', import.meta.url).href,
};

const loader = new THREE.TextureLoader();

// Loads a tileable photo texture. Renders immediately (empty until the image arrives).
export function photoTexture(url, { repeat = [1, 1], anisotropy = 8 } = {}) {
  const t = loader.load(url);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
}
