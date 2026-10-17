import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ------------------------------------------------------------------ */
/*  Random + noise                                                     */
/* ------------------------------------------------------------------ */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(x: number, y: number, seed: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return h - Math.floor(h);
}

function smoothNoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

export function fbm(x: number, y: number, seed = 1, octaves = 4) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value += amp * smoothNoise(x * freq, y * freq, seed + i * 13);
    freq *= 2.03;
    amp *= 0.5;
  }
  return value;
}

/* ------------------------------------------------------------------ */
/*  Procedural textures                                                */
/* ------------------------------------------------------------------ */

function canvasOf(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

export function makeSandTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x / 48, y / 48, 4, 4);
      const ripple = Math.sin(y * 0.11 + n * 6.4 + Math.sin(x * 0.035) * 2.4) * 0.5 + 0.5;
      const grain = hash(x, y, 22);
      const v = n * 0.46 + ripple * 0.36 + grain * 0.18;
      image.data[i] = 196 + v * 34;
      image.data[i + 1] = 183 + v * 32;
      image.data[i + 2] = 146 + v * 27;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = i % 3 === 0 ? "#f0dfb4" : "#6b624b";
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * size,
      Math.random() * size,
      1 + Math.random() * 3,
      1 + Math.random() * 2,
      Math.random() * 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.anisotropy = 8;
  return texture;
}

export function makeSandBumpTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x / 34, y / 34, 7, 3);
      const ripple = Math.sin(y * 0.18 + n * 8 + Math.sin(x * 0.08) * 3) * 0.5 + 0.5;
      const v = Math.floor((n * 0.35 + ripple * 0.65) * 255);
      image.data[i] = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  return texture;
}

export function makeCausticTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = "rgba(208,255,246,.9)";
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 20; col++) {
      const cx = (col + 0.5) * (size / 20) + Math.sin(row * 2.3 + col) * 5;
      const cy = (row + 0.5) * (size / 20) + Math.cos(col * 1.7 + row) * 5;
      const radius = 8 + ((row + col) % 4) * 2.2;
      ctx.lineWidth = 1.4 + ((row * col) % 3) * 0.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.random() * Math.PI, Math.random() * Math.PI + Math.PI * 1.15);
      ctx.stroke();
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.8, Math.random() * Math.PI, Math.random() * Math.PI + Math.PI * 0.65);
      ctx.stroke();
    }
  }
  ctx.filter = "blur(1.2px)";
  ctx.drawImage(canvas, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = 4;
  return texture;
}

export function makeWhaleSkinTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x / 52, y / 52, 17, 5);
      const spots = fbm(x / 9, y / 9, 31, 2);
      const v = n * 0.75 + spots * 0.25;
      image.data[i] = 132 + v * 62;
      image.data[i + 1] = 158 + v * 58;
      image.data[i + 2] = 170 + v * 52;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  ctx.globalAlpha = 0.14;
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 8 + 1;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, "#dce8e4");
    grad.addColorStop(1, "rgba(220,232,228,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.anisotropy = 8;
  return texture;
}

export function makeShellTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#4e5d45";
  ctx.fillRect(0, 0, size, size);
  const rand = mulberry32(31);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = col * 56 + (row % 2) * 28 + 14;
      const y = row * 56 + 20;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const r = 23 + rand() * 5;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      const tone = rand();
      ctx.fillStyle = `rgb(${92 + tone * 44},${104 + tone * 34},${70 + tone * 22})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(28,43,35,.7)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = "rgba(216,211,152,.24)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function makeCoralSkinTexture(seed = 7): THREE.CanvasTexture {
  const size = 256;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x / 22, y / 22, seed, 4);
      const pores = fbm(x / 5, y / 5, seed + 9, 2);
      const v = 158 + n * 62 + (pores > 0.62 ? -22 : 0);
      image.data[i] = v;
      image.data[i + 1] = v * 0.95;
      image.data[i + 2] = v * 0.9;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const rand = mulberry32(seed + 31);
  // Полипы: светлые точки с тёмным колечком.
  for (let i = 0; i < 420; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 2.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,240,220,${0.16 + rand() * 0.22})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r + 1.1, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(40,22,18,${0.1 + rand() * 0.16})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 3.2);
  texture.anisotropy = 8;
  return texture;
}

export function makeSoftCircleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,.95)");
  grad.addColorStop(0.35, "rgba(220,255,246,.55)");
  grad.addColorStop(1, "rgba(200,255,246,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeBubbleTexture(): THREE.CanvasTexture {
  const size = 96;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  const grad = ctx.createRadialGradient(size * 0.42, size * 0.38, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,.2)");
  grad.addColorStop(0.7, "rgba(190,250,244,.06)");
  grad.addColorStop(0.9, "rgba(220,255,252,.55)");
  grad.addColorStop(1, "rgba(220,255,252,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(240,255,252,.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeCoralBumpTexture(seed = 4): THREE.CanvasTexture {
  const size = 128;
  const canvas = canvasOf(size);
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x / 10, y / 10, seed, 3);
      const v = Math.floor(n * 255);
      image.data[i] = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/* ------------------------------------------------------------------ */
/*  Reef geometry                                                      */
/* ------------------------------------------------------------------ */

export function makeRockGeometry(seed: number, scale = 1): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const geo = new THREE.SphereGeometry(1, 34, 22);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const stretch = 0.85 + rand() * 0.4;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const big = fbm(v.x * 1.35 + 2.4, v.z * 1.35 + v.y * 0.8, seed, 4);
    const small = fbm(v.x * 3.6, v.z * 3.2 + v.y * 2.1, seed + 19, 3);
    const ridged = 1 - Math.abs(small * 2 - 1);
    const radius = 1 + (big - 0.5) * 0.78 + (ridged - 0.5) * 0.26;
    v.multiplyScalar(radius);
    v.y = Math.max(v.y, -0.42);
    v.x *= stretch;
    v.z *= 0.9 + rand() * 0.2;
    v.y *= 0.66;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  // Вершинная «корка»: тёмные и светлые участки, как обрастание на камне.
  const normals = geo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const crust = fbm(pos.getX(i) * 4.2 + seed, pos.getZ(i) * 4.2 + pos.getY(i) * 2.2, seed + 7, 3);
    const light = 0.58 + crust * 0.42 + Math.max(0, normals.getY(i)) * 0.16;
    c.setRGB(light * 1.02, light * 0.99, light * 0.92);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.scale(scale, scale, scale);
  return geo;
}

export function makeBranchCoral(seed: number): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const parts: THREE.BufferGeometry[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const axis = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  const branch = (origin: THREE.Vector3, dir: THREE.Vector3, length: number, radius: number, depth: number) => {
    const end = origin.clone().addScaledVector(dir, length);
    const cyl = new THREE.CylinderGeometry(radius * 0.7, radius, length, 7, 1, false);
    cyl.translate(0, length / 2, 0);
    quat.setFromUnitVectors(up, dir.clone().normalize());
    cyl.applyQuaternion(quat);
    cyl.translate(origin.x, origin.y, origin.z);
    parts.push(cyl);
    if (depth <= 0) {
      // Кораллит: короткая чашечка на кончике, а не белый шар.
      const cup = new THREE.CylinderGeometry(radius * 0.9, radius * 0.55, radius * 1.2, 5);
      cup.translate(end.x, end.y + radius * 0.4, end.z);
      parts.push(cup);
      return;
    }
    const children = depth === 2 ? 4 : 3;
    for (let i = 0; i < children; i++) {
      axis.set(rand() - 0.5, rand() * 0.25 + 0.2, rand() - 0.5).normalize();
      const nextDir = dir.clone().applyAxisAngle(axis, 0.42 + rand() * 0.42).normalize();
      nextDir.y = Math.max(nextDir.y, 0.18);
      nextDir.normalize();
      branch(
        end.clone().multiplyScalar(1 - rand() * 0.08),
        nextDir,
        length * (0.7 + rand() * 0.14),
        radius * 0.68,
        depth - 1
      );
    }
  };

  const trunks = 6 + Math.floor(rand() * 3);
  for (let i = 0; i < trunks; i++) {
    const tilt = new THREE.Vector3(rand() - 0.5, 1, rand() - 0.5).normalize();
    branch(
      new THREE.Vector3((rand() - 0.5) * 0.7, 0, (rand() - 0.5) * 0.7),
      tilt,
      0.68 + rand() * 0.3,
      0.085 + rand() * 0.03,
      2
    );
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  if (merged) {
    merged.computeVertexNormals();
    // Вершинный градиент: основание в тени, кончики веток светлее и
    // «живее». Это читается как живые полипы без сотен отдельных мешей.
    const pos = merged.attributes.position as THREE.BufferAttribute;
    const normals = merged.attributes.normal as THREE.BufferAttribute;
    const color = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const nY = normals.getY(i);
      const tip = THREE.MathUtils.smoothstep(y, 0.6, 2.2);
      const light = 0.44 + tip * 0.46 + Math.max(0, nY) * 0.1;
      c.setRGB(light, light * (0.9 + tip * 0.1), light * (0.86 + tip * 0.14));
      color[i * 3] = c.r;
      color[i * 3 + 1] = c.g;
      color[i * 3 + 2] = c.b;
    }
    merged.setAttribute("color", new THREE.BufferAttribute(color, 3));
  }
  return merged || new THREE.CylinderGeometry(0.1, 0.18, 1, 6);
}

export function makeFanCoral(seed: number): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const parts: THREE.BufferGeometry[] = [];
  const fanCount = 11;
  for (let i = 0; i < fanCount; i++) {
    const points: THREE.Vector3[] = [];
    const bias = (i / (fanCount - 1) - 0.5) * 1.9;
    const height = 1.1 + rand() * 0.8;
    const segments = 9;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      points.push(
        new THREE.Vector3(
          bias * t * t + Math.sin(t * 3.4 + i * 0.7) * 0.16 * t,
          t * height,
          Math.sin(t * 2.0 + i * 1.7) * 0.18 + Math.cos(t * 4.1 + i) * 0.05
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(points);
    parts.push(new THREE.TubeGeometry(curve, 14, 0.014 + rand() * 0.009, 4, false));
    // Перекладины, создающие «сетку» веера.
    for (let cross = 2; cross < segments; cross += 2) {
      const target = cross / segments;
      if (target > 0.9) continue;
      const point = points[cross];
      if (!point) continue;
      const left = points[Math.max(0, cross - 1)];
      const outward = new THREE.Vector3(bias * 0.28, 0.08 + rand() * 0.1, 0);
      const bar = new THREE.CatmullRomCurve3([left, point.clone().add(outward)]);
      parts.push(new THREE.TubeGeometry(bar, 4, 0.009, 3, false));
      if (cross % 4 === 0) {
        const rib = new THREE.CatmullRomCurve3([
          point.clone().add(new THREE.Vector3(0, -0.12, 0)),
          point.clone().add(new THREE.Vector3(bias * 0.1, 0.02, 0.02)),
          point.clone().add(outward.multiplyScalar(1.7)),
        ]);
        parts.push(new THREE.TubeGeometry(rib, 4, 0.006, 3, false));
      }
    }
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  return merged || new THREE.SphereGeometry(0.2, 6, 6);
}

export function makeBrainCoral(seed: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 22, 14);
  const rand = mulberry32(seed);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const meander = Math.sin(v.x * 9 + Math.sin(v.z * 4.2 + v.y * 1.6) * 3.4) * 0.055;
    const secondary = Math.cos(v.z * 11 + Math.sin(v.x * 3.1) * 2.6) * 0.035;
    const noise = (fbm(v.x * 1.8 + 2, v.z * 1.8 + v.y, seed, 3) - 0.5) * 0.2;
    v.multiplyScalar(1 + noise + meander + secondary);
    v.y *= 0.66;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  void rand;
  return geo;
}

export function makeAnemone(seed: number): { tentacles: THREE.BufferGeometry; tips: Float32Array } {
  const rand = mulberry32(seed);
  const parts: THREE.BufferGeometry[] = [];
  const tipPositions: number[] = [];
  const count = 56;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.16;
    const radius = 0.16 + rand() * 0.5;
    const height = 0.3 + rand() * 0.4;
    const base = new THREE.Vector3(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius);
    const mid = new THREE.Vector3(
      Math.cos(angle) * (radius + 0.16 + rand() * 0.16),
      height * 0.6,
      Math.sin(angle) * (radius + 0.16 + rand() * 0.16)
    );
    const tip = new THREE.Vector3(
      Math.cos(angle) * (radius + 0.05 + rand() * 0.18),
      height + 0.18 + rand() * 0.18,
      Math.sin(angle) * (radius + 0.05 + rand() * 0.18)
    );
    const curve = new THREE.CatmullRomCurve3([base, mid, tip]);
    const tube = new THREE.TubeGeometry(curve, 4, 0.05 + rand() * 0.024, 4, false);
    parts.push(tube);
    tipPositions.push(tip.x, tip.y + 0.02, tip.z);
  }
  const base = new THREE.SphereGeometry(0.62, 16, 9, 0, Math.PI * 2, 0, Math.PI / 2);
  base.scale(1, 0.38, 1);
  parts.push(base);
  const merged = mergeGeometries(parts, false) || new THREE.SphereGeometry(0.2, 6, 6);
  parts.forEach((part) => part.dispose());
  merged.computeVertexNormals();
  const pos = merged.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const foot = new THREE.Color("#6a4f46");
  const stem = new THREE.Color("#d99680");
  const tipColor = new THREE.Color("#ffc2a4");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = THREE.MathUtils.smoothstep(y, 0.05, 0.72);
    c.copy(foot).lerp(stem, THREE.MathUtils.smoothstep(t, 0, 0.5)).lerp(tipColor, THREE.MathUtils.smoothstep(t, 0.45, 1));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  merged.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return {
    tentacles: merged,
    tips: new Float32Array(tipPositions),
  };
}

export function makeTubeSponges(seed: number): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const parts: THREE.BufferGeometry[] = [];
  const count = 4 + Math.floor(rand() * 4);
  for (let i = 0; i < count; i++) {
    const h = 0.7 + rand() * 1.5;
    const r = 0.1 + rand() * 0.11;
    const cylinder = new THREE.CylinderGeometry(r * 0.92, r, h, 10, 1, true);
    cylinder.translate((rand() - 0.5) * 0.7, h / 2, (rand() - 0.5) * 0.55);
    parts.push(cylinder);
    const rim = new THREE.TorusGeometry(r * 0.9, 0.035, 5, 14);
    rim.rotateX(Math.PI / 2);
    rim.translate((rand() - 0.5) * 0.7, h, (rand() - 0.5) * 0.55);
    parts.push(rim);
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  return merged || new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
}

export function makeKelpGeometry(seed: number, strands = 6, height = 4.4, width = 0.18): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const phases: number[] = [];
  const indices: number[] = [];
  let vertexOffset = 0;

  for (let s = 0; s < strands; s++) {
    const angle = rand() * Math.PI * 2;
    const originX = (rand() - 0.5) * 1.4;
    const originZ = (rand() - 0.5) * 1.4;
    const h = height * (0.55 + rand() * 0.65);
    const segs = 14;
    const phase = rand() * Math.PI * 2;
    const leanX = Math.sin(angle) * (0.4 + rand() * 0.5);
    const leanZ = Math.cos(angle) * (0.4 + rand() * 0.5);
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const y = t * h;
      const cx = originX + leanX * t * t + Math.sin(t * 2.2 + phase) * 0.12 * t;
      const cz = originZ + leanZ * t * t + Math.cos(t * 1.7 + phase) * 0.12 * t;
      const half = width * (0.42 + 0.78 * Math.sin(Math.min(1, t * 1.3) * Math.PI * 0.9)) * (1 - t * 0.42);
      const side = new THREE.Vector3(Math.cos(angle + Math.PI / 2), 0, -Math.sin(angle + Math.PI / 2));
      positions.push(cx + side.x * half, y, cz + side.z * half);
      positions.push(cx - side.x * half, y, cz - side.z * half);
      normals.push(0, 0.2, 1, 0, 0.2, 1);
      uvs.push(0, t, 1, t);
      const tone = 0.22 + t * 0.45 + rand() * 0.05;
      const col = new THREE.Color().setHSL(0.16 + t * 0.03, 0.35, 0.2 + tone * 0.28);
      colors.push(col.r, col.g, col.b, col.r, col.g, col.b);
      phases.push(phase, phase);
    }
    const base = vertexOffset;
    for (let i = 0; i < segs; i++) {
      const a = base + i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    vertexOffset += (segs + 1) * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function makeStarfishGeometry(seed: number): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const shape = new THREE.Shape();
  const arms = 5;
  for (let i = 0; i <= arms * 2; i++) {
    const angle = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 2;
    const outer = i % 2 === 0;
    const radius = outer ? 0.48 + rand() * 0.08 : 0.18;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.quadraticCurveTo(Math.cos(angle - 0.16) * radius * 1.05, Math.sin(angle - 0.16) * radius * 1.05, x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.055, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.025, bevelSegments: 2 });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/* ------------------------------------------------------------------ */
/*  Fish                                                               */
/* ------------------------------------------------------------------ */

export type FishKind = "clown" | "tang" | "angel" | "butterfly";

interface FishStyle {
  base: string;
  top: string;
  belly: string;
  fin: string;
  flat: number;
  tall: number;
  glow: string;
  iridescence: number;
  finRay: number;
}

const FISH_STYLES: Record<FishKind, FishStyle> = {
  clown: { base: "#ff8330", top: "#ef6a20", belly: "#ffb277", fin: "#ff9c55", flat: 0.64, tall: 0.98, glow: "#5c1c04", iridescence: 0.08, finRay: 0.9 },
  tang: { base: "#1d7dd7", top: "#0b4c96", belly: "#67bdf5", fin: "#ffd24a", flat: 0.4, tall: 1.12, glow: "#042842", iridescence: 0.65, finRay: 1.05 },
  angel: { base: "#e8be57", top: "#c38b2b", belly: "#f6e4ad", fin: "#f0d894", flat: 0.3, tall: 1.5, glow: "#3a2305", iridescence: 0.2, finRay: 0.8 },
  butterfly: { base: "#f8d652", top: "#d9b025", belly: "#fff2c2", fin: "#ffe9a2", flat: 0.27, tall: 1.4, glow: "#4a3506", iridescence: 0.18, finRay: 1.15 },
};

/** Полосы и маска рисуются прямо в текстуру вдоль оси тела — это дешевле
 *  десятка тор-колец и выглядит как окраска, а не как обручи. */
export function makeFishTexture(kind: FishKind): THREE.CanvasTexture {
  const W = 1024;
  const H = 384;
  const canvas = canvasOf(1024);
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(W, H);
  const palette: Record<FishKind, { base: string; top: string; belly: string; band: string }> = {
    clown: { base: "#ff7b28", top: "#f2611c", belly: "#ffb06a", band: "#fff4e2" },
    tang: { base: "#1f83e0", top: "#0e4f9e", belly: "#6cc4f4", band: "#0a2a52" },
    angel: { base: "#e3bd57", top: "#b8892b", belly: "#f8e9b8", band: "#3b6d9c" },
    butterfly: { base: "#f4d24e", top: "#d5a91e", belly: "#fff0b8", band: "#2a2412" },
  };
  const p = palette[kind];
  const base = new THREE.Color(p.base);
  const top = new THREE.Color(p.top);
  const belly = new THREE.Color(p.belly);
  const band = new THREE.Color(p.band);
  const c = new THREE.Color();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const along = x / W;
      // v=0.75 — спина, v=0.25 — брюхо. Раньше окраска зависела от неверной
      // половины окружности, и тела рыб читались коричневой «маской».
      const v = y / H;
      const dorsal = THREE.MathUtils.smoothstep(v, 0.52, 0.92);
      const ventral = THREE.MathUtils.smoothstep(v, 0.46, 0.1);
      c.copy(base).lerp(top, dorsal * 0.75).lerp(belly, ventral * 0.7);
      const fine = Math.sin(along * 180 + v * 9) * 0.02 + Math.sin(v * 46) * 0.012;
      let painted = false;
      if (kind === "clown") {
        const bands = [0.22, 0.5, 0.79];
        for (const b of bands) {
          if (Math.abs(along - b) < 0.042) { c.copy(band).multiplyScalar(0.92 + Math.sin(v * 20) * 0.04); painted = true; }
          if (Math.abs(along - b) > 0.042 && Math.abs(along - b) < 0.056) { c.copy(new THREE.Color("#2a0f04")); painted = true; }
        }
      }
      if (kind === "tang") {
        if (along > 0.3 && along < 0.7 && v > 0.56 && v < 0.86) { c.copy(band); painted = true; }
        if (along > 0.88) c.copy(new THREE.Color("#ffd24a"));
      }
      if (kind === "angel") {
        const stripe = Math.abs(((along * 7) % 1) - 0.5) < 0.11 && v > 0.42;
        if (stripe) { c.copy(band).multiplyScalar(0.9); painted = true; }
      }
      if (kind === "butterfly") {
        if (along > 0.36 && along < 0.47) { c.copy(band); painted = true; }
        if (along > 0.82 && v > 0.52 && v < 0.9) { c.copy(new THREE.Color("#211c0d")); painted = true; }
        if (along > 0.9) c.copy(new THREE.Color("#f4d97c"));
      }
      if (!painted) c.addScalar(fine);
      // Чешуйчатый блик только по светлой части тела.
      const scaleGlint = Math.max(0, Math.sin((along * 210 + v * 40))) * 0.03 * dorsal;
      image.data[i] = Math.min(255, Math.max(0, (c.r + scaleGlint) * 255));
      image.data[i + 1] = Math.min(255, Math.max(0, (c.g + scaleGlint) * 255));
      image.data[i + 2] = Math.min(255, Math.max(0, (c.b + scaleGlint) * 255));
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  return texture;
}

const fishTextureCache = new Map<FishKind, THREE.CanvasTexture>();
function fishTexture(kind: FishKind) {
  let texture = fishTextureCache.get(kind);
  if (!texture) {
    texture = makeFishTexture(kind);
    fishTextureCache.set(kind, texture);
  }
  return texture;
}

function finGeometry(points: [number, number][]) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape, 6);
  geo.rotateY(-Math.PI / 2);
  return geo;
}

const fishBodyCache = new Map<string, THREE.BufferGeometry>();
const fishFinCache = new Map<string, THREE.BufferGeometry>();
const fishTailCache = new Map<string, THREE.BufferGeometry>();
const fishEyeCache = new Map<string, THREE.BufferGeometry>();
const fishMaterialCache = new Map<string, { body: THREE.MeshPhysicalMaterial; fin: THREE.MeshStandardMaterial; eye: THREE.MeshStandardMaterial }>();

function layoutFin(geo: THREE.BufferGeometry, x: number, y: number, z: number, rz = 0, ry = 0, scale = 1) {
  const matrix = new THREE.Matrix4();
  matrix.compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, rz)),
    new THREE.Vector3(scale, scale, scale)
  );
  geo.applyMatrix4(matrix);
  return geo;
}

/**
 * Рыба собирается в ПЯТЬ draw calls: тело, статичные спинной/анальный
 * плавники, хвост на шарнире, грудные плавники и глаза. Раньше это было
 * ~12 отдельных мешей на рыбу — в стереопаре такой риф рисовался дважды и
 * именно это, вместе с двойным shadow pass, роняло FPS в VR.
 */
export function buildFish(kind: FishKind, scale = 1): THREE.Group {
  const style = FISH_STYLES[kind];
  const group = new THREE.Group();
  group.name = "fish";

  let materials = fishMaterialCache.get(kind);
  if (!materials) {
    materials = {
      body: new THREE.MeshPhysicalMaterial({
        map: fishTexture(kind),
        roughness: 0.48,
        metalness: 0.02,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        iridescence: style.iridescence,
        iridescenceIOR: 1.32,
        sheen: 0.4,
        sheenColor: new THREE.Color(style.fin),
        emissive: new THREE.Color(style.glow),
        emissiveIntensity: 0.22,
      }),
      fin: new THREE.MeshStandardMaterial({
        color: new THREE.Color(style.fin),
        roughness: 0.58,
        metalness: 0.02,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.94,
        emissive: new THREE.Color(style.fin),
        emissiveIntensity: 0.12,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: "#070d0d",
        roughness: 0.25,
        metalness: 0.0,
        emissive: new THREE.Color("#2b2620"),
        emissiveIntensity: 0.25,
      }),
    };
    fishMaterialCache.set(kind, materials);
  }

  let bodyGeo = fishBodyCache.get(kind);
  if (!bodyGeo) {
    const profile: [number, number][] = [
      [0.03, -1.0],
      [0.14, -0.9],
      [0.3, -0.62],
      [0.42, -0.2],
      [0.46, 0.12],
      [0.42, 0.46],
      [0.33, 0.72],
      [0.2, 0.9],
      [0.03, 1.02],
    ];
    bodyGeo = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 20);
    bodyGeo.rotateX(Math.PI / 2);
    bodyGeo.scale(style.flat, style.tall, 1);
    bodyGeo.computeVertexNormals();
    // Lathe раскладывает UV вокруг тела, а окраска нарисована вдоль тела.
    // Пересобираем UV: u — от хвоста к голове, v — вокруг рыбы.
    const pos = bodyGeo.attributes.position as THREE.BufferAttribute;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      uv[i * 2] = THREE.MathUtils.clamp((z + 1.04) / 2.08, 0, 1);
      uv[i * 2 + 1] = (Math.atan2(y, x) / (Math.PI * 2) + 0.5);
    }
    bodyGeo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    fishBodyCache.set(kind, bodyGeo);
  }
  const body = new THREE.Mesh(bodyGeo, materials.body);
  body.castShadow = true;
  group.add(body);

  let finGeo = fishFinCache.get(kind);
  if (!finGeo) {
    const dorsal = finGeometry([[0, 0], [0.32, 0.3], [0.18, 0.46], [-0.1, 0.42], [-0.46, 0.2], [-0.44, 0]]);
    layoutFin(dorsal, 0, (0.3 * style.tall) / style.tall, 0.2);
    dorsal.scale(1, style.tall, 1);
    const anal = finGeometry([[0, 0], [0.24, -0.2], [0.05, -0.3], [-0.28, -0.14], [-0.26, 0]]);
    anal.scale(1, style.tall, 1);
    layoutFin(anal, 0, -0.28, -0.15);
    const merged = mergeGeometries([dorsal, anal], false);
    dorsal.dispose();
    anal.dispose();
    finGeo = merged || dorsal;
    fishFinCache.set(kind, finGeo);
  }
  const fins = new THREE.Mesh(finGeo, materials.fin);
  fins.castShadow = false;
  group.add(fins);

  let tailGeo = fishTailCache.get(kind);
  if (!tailGeo) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.07);
    shape.quadraticCurveTo(-0.22, 0.3, -0.62 * style.finRay, 0.52);
    shape.quadraticCurveTo(-0.46 * style.finRay, 0.1, -0.34 * style.finRay, 0);
    shape.quadraticCurveTo(-0.46 * style.finRay, -0.1, -0.62 * style.finRay, -0.52);
    shape.quadraticCurveTo(-0.22, -0.3, 0, -0.07);
    shape.closePath();
    tailGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.018, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 1 });
    tailGeo.rotateY(Math.PI / 2);
    tailGeo.scale(1, style.tall * 1.05, 1);
    fishTailCache.set(kind, tailGeo);
  }
  const tailPivot = new THREE.Group();
  tailPivot.name = "tail";
  tailPivot.position.z = -0.96;
  const tail = new THREE.Mesh(tailGeo, materials.fin);
  tailPivot.add(tail);
  group.add(tailPivot);

  const pectoralMesh = new THREE.Mesh(
    (() => {
      const left = finGeometry([[0, 0], [-0.12, 0.2], [-0.3, 0.24], [-0.22, -0.02]]);
      left.scale(1, style.tall * 0.9, 1);
      layoutFin(left, -0.3 * style.flat, -0.06, 0.3, -0.7, -0.35);
      const right = finGeometry([[0, 0], [-0.12, 0.2], [-0.3, 0.24], [-0.22, -0.02]]);
      right.scale(1, style.tall * 0.9, 1);
      layoutFin(right, 0.3 * style.flat, -0.06, 0.3, 0.7, 0.35);
      const merged = mergeGeometries([left, right], false);
      left.dispose();
      right.dispose();
      return merged || new THREE.BoxGeometry(0.01, 0.01, 0.01);
    })(),
    materials.fin
  );
  group.add(pectoralMesh);

  let eyeGeo = fishEyeCache.get(kind);
  if (!eyeGeo) {
    const eyeScale = 0.034 * (kind === "clown" ? 1.05 : 1.1);
    const eyeX = 0.24 * style.flat;
    const parts: THREE.BufferGeometry[] = [];
    for (const side of [-1, 1]) {
      const iris = new THREE.SphereGeometry(eyeScale * 1.3, 8, 6);
      iris.translate(side * eyeX, 0.2 * style.tall, 0.74);
      const pupil = new THREE.SphereGeometry(eyeScale, 8, 6);
      pupil.translate(side * (eyeX + 0.012), 0.2 * style.tall, 0.77);
      parts.push(iris, pupil);
    }
    eyeGeo = mergeGeometries(parts, false) || parts[0];
    parts.forEach((part) => part.dispose());
    fishEyeCache.set(kind, eyeGeo);
  }
  const eyes = new THREE.Mesh(eyeGeo, materials.eye);
  group.add(eyes);
  // Зрачок-бусина: без него голова темнеет в воде и теряет взгляд.
  const beadGeo = new THREE.SphereGeometry(0.028, 8, 6);
  const beadMat = new THREE.MeshBasicMaterial({ color: "#f4fffb" });
  for (const side of [-1, 1]) {
    const bead = new THREE.Mesh(beadGeo, beadMat);
    bead.position.set(side * 0.24 * style.flat, 0.2 * style.tall, 0.79);
    bead.scale.setScalar(kind === "clown" ? 1 : 0.8);
    group.add(bead);
  }

  group.scale.setScalar(scale);
  group.userData.tail = tailPivot;
  group.userData.pectorals = [pectoralMesh];
  group.userData.kind = kind;
  return group;
}

export function makeSchoolFishGeometry(): THREE.BufferGeometry {
  const body = new THREE.SphereGeometry(1, 12, 9).toNonIndexed();
  body.deleteAttribute("uv");
  body.scale(0.2, 0.34, 0.74);
  const tail = new THREE.BufferGeometry();
  tail.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [0, 0, -0.58, 0, 0.34, -1.06, 0, -0.04, -0.7, 0, 0, -0.58, 0, -0.04, -0.7, 0, -0.34, -1.06],
      3
    )
  );
  tail.computeVertexNormals();
  const dorsal = new THREE.BufferGeometry();
  dorsal.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0.2, -0.2, 0, 0.42, -0.04, 0, 0.24, 0.24], 3)
  );
  dorsal.computeVertexNormals();
  const geom = mergeGeometries([body, tail, dorsal], false);
  body.dispose();
  tail.dispose();
  dorsal.dispose();
  geom?.computeVertexNormals();
  return geom || new THREE.SphereGeometry(0.2, 6, 6);
}
