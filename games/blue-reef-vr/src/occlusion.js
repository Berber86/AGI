// Запечённые контактные тени на песке.
//
// Тени в сцене выключены (shadowMap под водой дорог и даёт резкие края), но без
// них предметы «висят» над дном, а кадр выглядит плоским. Здесь тени считаются
// один раз при сборке мира: положения всех кораллов, камней и травы
// переносятся в карту, которой красится песок.
//
// Карта двухканальная:
//   • R — затенение: как aoMap песка (рассеянный свет под кронами) и как
//     множитель каустики (солнечные зайчики тоже гаснут в тени);
//   • G — неоднородность самого песка: пятна разной крупности, ракушечный
//     сор, более тёмный налёт на склоне рифа. Без него дно выглядит одним
//     ровным листом, каким бы детальным ни был тайл текстуры.
import * as THREE from 'three';
import { mulberry32 } from './noise.js';

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

  // --- канал G: неоднородность песка ---------------------------------------
  const tint = document.createElement('canvas');
  tint.width = tint.height = size;
  const tctx = tint.getContext('2d');
  tctx.fillStyle = '#808080';
  tctx.fillRect(0, 0, size, size);
  const trnd = mulberry32(90210);
  // Крупные пятна: участки более светлого выбеленного песка и более тёмного,
  // с налётом, — их границы мягкие, как на настоящем дне.
  for (let i = 0; i < 90; i++) {
    const x = trnd() * size, y = trnd() * size;
    const r = size * (0.03 + trnd() * 0.13);
    const light = trnd() < 0.5;
    const g = tctx.createRadialGradient(x, y, 0, x, y, r);
    const a = 0.10 + trnd() * 0.22;
    g.addColorStop(0, light ? `rgba(255,255,255,${a.toFixed(3)})` : `rgba(0,0,0,${a.toFixed(3)})`);
    g.addColorStop(1, 'rgba(128,128,128,0)');
    tctx.fillStyle = g;
    tctx.beginPath();
    tctx.arc(x, y, r, 0, Math.PI * 2);
    tctx.fill();
  }
  // Склон рифа за поляной темнее: там оседает органика и растёт налёт.
  {
    const g = tctx.createRadialGradient(size / 2, size / 2, size * 0.10, size / 2, size / 2, size * 0.42);
    g.addColorStop(0, 'rgba(128,128,128,0)');
    g.addColorStop(1, 'rgba(40,40,40,0.42)');
    tctx.fillStyle = g;
    tctx.fillRect(0, 0, size, size);
  }
  // Ракушечный сор: мелкие светлые точки.
  for (let i = 0; i < 1400; i++) {
    const x = trnd() * size, y = trnd() * size;
    const r = 0.6 + trnd() * 1.9;
    tctx.fillStyle = `rgba(235,235,235,${(0.12 + trnd() * 0.3).toFixed(3)})`;
    tctx.beginPath();
    tctx.arc(x, y, r, 0, Math.PI * 2);
    tctx.fill();
  }

  // Собираем R (тени) и G (песок) в одну текстуру: один семпл на обе задачи.
  const ao = ctx.getImageData(0, 0, size, size).data;
  const tn = tctx.getImageData(0, 0, size, size).data;
  const merged = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    merged.data[i * 4] = ao[i * 4];
    merged.data[i * 4 + 1] = tn[i * 4];
    merged.data[i * 4 + 2] = 255;
    merged.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(merged, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.NoColorSpace;   // это данные, а не цвет
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
