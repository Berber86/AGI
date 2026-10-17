// Запечённые контактные тени на песке.
//
// Тени в сцене выключены (shadowMap под водой дорог и даёт резкие края), но без
// них предметы «висят» над дном, а кадр выглядит плоским. Здесь тени считаются
// один раз при сборке мира: положения всех кораллов, камней и травы
// переносятся в карту, которой красится песок.
//
// Карта используется дважды:
//   • как aoMap песка — притемняет рассеянный свет под кронами;
//   • в шейдере каустики — солнечные зайчики тоже обязаны гаснуть в тени.
import * as THREE from 'three';

/**
 * @param {Array<{x:number,z:number,radius:number,strength?:number}>} items
 * @param {{size?:number, world?:number, sunXZ?:{x:number,z:number}}} opts
 */
export function bakeGroundOcclusion(items, opts = {}) {
  const size = opts.size || 1024;
  const world = opts.world || 420;            // сторона песчаной плоскости в метрах
  const sun = opts.sunXZ || { x: -0.22, z: 0.18 };
  const sunLen = Math.hypot(sun.x, sun.z) || 1;
  const sx = sun.x / sunLen, sz = sun.z / sunLen;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'multiply';

  const toPx = (x, z) => ({
    cx: (0.5 + x / world) * size,
    // Плоскость повёрнута: ось V идёт от +Z к -Z (см. buildSeabed).
    cy: (0.5 - z / world) * size,
  });
  const mToPx = (m) => (m / world) * size;

  for (const it of items) {
    const radius = Math.max(0.15, it.radius || 0.5);
    const strength = Math.min(1, Math.max(0, it.strength ?? 0.55));
    const { cx, cy } = toPx(it.x, it.z);
    const rPx = Math.max(2, mToPx(radius * 2.3));

    // Контакт: узкое тёмное кольцо прямо под предметом.
    const contact = ctx.createRadialGradient(cx, cy, 0, cx, cy, rPx);
    const dark = Math.round(255 * (1 - strength * 0.85));
    contact.addColorStop(0, `rgb(${dark},${dark},${dark})`);
    contact.addColorStop(0.45, `rgb(${Math.round(255 * (1 - strength * 0.45))},${Math.round(255 * (1 - strength * 0.45))},${Math.round(255 * (1 - strength * 0.45))})`);
    contact.addColorStop(1, '#ffffff');
    ctx.fillStyle = contact;
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.fill();

    // Падающая тень: вытянута от солнца, мягкая, слабее контакта.
    const len = radius * 2.6;
    const shX = cx - mToPx(sx * len);
    const shY = cy + mToPx(sz * len);
    const shR = Math.max(2, mToPx(radius * 3.0));
    const cast = ctx.createRadialGradient(shX, shY, 0, shX, shY, shR);
    const dark2 = Math.round(255 * (1 - strength * 0.4));
    cast.addColorStop(0, `rgb(${dark2},${dark2},${dark2})`);
    cast.addColorStop(1, '#ffffff');
    ctx.fillStyle = cast;
    ctx.beginPath();
    ctx.ellipse(shX, shY, shR * 1.15, shR * 0.75, Math.atan2(sz, -sx), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.NoColorSpace;   // это данные, а не цвет
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
