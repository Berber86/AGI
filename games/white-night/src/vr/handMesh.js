// handMesh.js — полное 3D-воплощение игрока от первого лица для VR «Белой ночи»:
//   1. Скульптурные замшевые перчатки (анатомический свод пясти, 4 рельефные костяшки,
//      сухожилия тыла, ладонная чаша со складкой сгиба, манжетный разрез с латунной кнопкой,
//      три изогнутых рантовых шва, фаланги с кожными заломами у суставов).
//   2. Втачные рукава пальто: окат-«раструб» в пройме (никаких шаров на месте плеч!),
//      локтевой сгиб ткани с локтевым отростком, обшлаг с хлястиком-патой на роговой
//      пуговице и вязаный ветрозащитный манжет.
//   3. Двубортное осеннее пальто по ЕДИНОМУ чертёжному профилю (COAT_PROFILE): широкое
//      почти плоское плечо, приталивание, расходящиеся полы с V-разрезом, острые лацканы,
//      отложной воротник-стойка, 6 пуговиц на нормалях сукна, карманы с клапанами,
//      брюки с бедром/коленом/икрой и вязаный шарф-стойка с жгутами и бахромой.
//   4. Спокойная вторая (свободная) рука в перчатке у кармана пальто (а в режимах «Гироскоп»
//      и «2 метки» — обе спокойно опущенные у карманов руки без электронного ремешка).
//   5. Скульптурные брюки со стрелками, коленными заломами и отворотами + шнурованные
//      кожаные ботинки с отрезным мыском, люверсами, рантом и рифлёной подошвой.
//
// Все зеркальные детали (левая/правая рука, лацканы, штанины, ботинки) строятся с честной
// перемоткой треугольников и положительным масштабом (det > 0), а статичные части тела
// слиты по материалам в единые буферы (всего 6 draw calls на всё туловище и ноги!).

import * as THREE from 'three';

const DEG = Math.PI / 180;

// --- Процедурные микротекстуры (DataTexture работает и в WebGL, и в чистом Node.js!) ---
function makeDataTex(w, h, fillPixel, repeatX = 1, repeatY = 1, isColor = true) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const [r, g, b] = fillPixel(x, y, w, h);
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function hash2(x, y) {
  const n = Math.imul(x * 374761393 + y * 668265263, 1274126177) >>> 0;
  return ((n ^ (n >>> 13)) >>> 0) / 4294967295;
}

function createAvatarTextures() {
  // 1) Петербургский драп «ёлочка» (herringbone wool)
  const woolBump = makeDataTex(64, 64, (x, y) => {
    const zig = ((x >> 3) & 1) ? (x + y) : (x - y + 64);
    const rib = Math.sin((zig % 8) * Math.PI * 0.25) * 26;
    const fuzz = (hash2(x, y) - 0.5) * 28;
    const v = Math.max(0, Math.min(255, Math.round(128 + rib + fuzz)));
    return [v, v, v];
  }, 7, 9, false);

  // 2) Бархатистая замша / лайковая кожа перчаток
  const suedeBump = makeDataTex(64, 64, (x, y) => {
    const pore = (hash2(x, y) - 0.5) * 42 + (hash2(x >> 1, y >> 1) - 0.5) * 22;
    const v = Math.max(0, Math.min(255, Math.round(128 + pore)));
    return [v, v, v];
  }, 5, 5, false);

  // 3) Крупная шерстяная вязка в рубчик (шарф и манжеты)
  const knitBump = makeDataTex(64, 64, (x, y) => {
    const col = Math.sin((x / 64) * Math.PI * 16) * 46;
    const loop = Math.sin((y / 64) * Math.PI * 24 + ((x >> 1) & 1) * 1.2) * 22;
    const v = Math.max(0, Math.min(255, Math.round(128 + col + loop)));
    return [v, v, v];
  }, 4, 4, false);

  // 4) Плотный осенний вельвет / шерсть брюк в продольный рубчик
  const trouserBump = makeDataTex(64, 64, (x, y) => {
    const wale = Math.sin((x / 64) * Math.PI * 28) * 34;
    const grain = (hash2(x, y) - 0.5) * 18;
    const v = Math.max(0, Math.min(255, Math.round(128 + wale + grain)));
    return [v, v, v];
  }, 6, 8, false);

  // 5) Зернистая обувная кожа ботинок
  const bootBump = makeDataTex(64, 64, (x, y) => {
    const n1 = hash2(x, y);
    const n2 = hash2((x + 3) >> 1, (y + 5) >> 1);
    const v = Math.max(0, Math.min(255, Math.round(118 + (n1 - 0.5) * 34 + (n2 - 0.5) * 38)));
    return [v, v, v];
  }, 4, 4, false);

  return { woolBump, suedeBump, knitBump, trouserBump, bootBump };
}

// --- Геометрические утилиты (слияние буферов и зеркалирование без отрицательного scale!) ---
function transformGeo(geo, mat4) {
  const ni = geo.index ? geo.toNonIndexed() : geo.clone();
  ni.applyMatrix4(mat4);
  if (!ni.getAttribute('normal')) ni.computeVertexNormals();
  geo.dispose();
  return ni;
}

function mirrorGeoX(srcGeo) {
  const ni = srcGeo.index ? srcGeo.toNonIndexed() : srcGeo.clone();
  const p = ni.getAttribute('position').array;
  for (let i = 0; i < p.length; i += 3) p[i] = -p[i];
  for (let i = 0; i < p.length; i += 9) {
    for (let k = 0; k < 3; k++) {
      const tmp = p[i + 3 + k];
      p[i + 3 + k] = p[i + 6 + k];
      p[i + 6 + k] = tmp;
    }
  }
  const uv = ni.getAttribute('uv');
  if (uv) {
    const u = uv.array;
    for (let i = 0; i < u.length; i += 6) {
      const tx = u[i + 2], ty = u[i + 3];
      u[i + 2] = u[i + 4]; u[i + 3] = u[i + 5];
      u[i + 4] = tx; u[i + 5] = ty;
    }
  }
  ni.computeVertexNormals();
  return ni;
}

function mergeGeos(geos) {
  const list = geos.map((g) => {
    const ni = g.index ? g.toNonIndexed() : g.clone();
    if (!ni.getAttribute('normal')) ni.computeVertexNormals();
    g.dispose();
    return ni;
  });
  let totalVerts = 0;
  for (const g of list) totalVerts += g.getAttribute('position').count;
  const posArr = new Float32Array(totalVerts * 3);
  const normArr = new Float32Array(totalVerts * 3);
  const uvArr = new Float32Array(totalVerts * 2);
  let vOff = 0;
  for (const g of list) {
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    const u = g.getAttribute('uv');
    posArr.set(p.array, vOff * 3);
    normArr.set(n.array, vOff * 3);
    if (u && u.itemSize >= 2) {
      for (let i = 0; i < p.count; i++) {
        uvArr[(vOff + i) * 2] = u.getX(i);
        uvArr[(vOff + i) * 2 + 1] = u.getY(i);
      }
    }
    vOff += p.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
  out.computeBoundingSphere();
  return out;
}

function buildLoftedTube(rings, radialSegs = 24, { capStart = false, capEnd = false } = {}) {
  const ringCount = rings.length;
  const cols = radialSegs + 1;
  const extraVerts = (capStart ? 1 : 0) + (capEnd ? 1 : 0);
  const positions = new Float32Array((ringCount * cols + extraVerts) * 3);
  const uvs = new Float32Array((ringCount * cols + extraVerts) * 2);
  const indices = [];

  for (let r = 0; r < ringCount; r++) {
    const vFrac = r / Math.max(1, ringCount - 1);
    const sample = rings[r];
    for (let c = 0; c <= radialSegs; c++) {
      const uFrac = c / radialSegs;
      const theta = uFrac * Math.PI * 2;
      const [x, y, z] = sample(theta, uFrac);
      const vi = (r * cols + c) * 3;
      const ui = (r * cols + c) * 2;
      positions[vi] = x;
      positions[vi + 1] = y;
      positions[vi + 2] = z;
      uvs[ui] = uFrac;
      uvs[ui + 1] = vFrac;
    }
  }

  // Автоматическая проверка наружной ориентации нормалей по правилу правой руки:
  // сравниваем нормаль первого треугольника с радиус-вектором от оси трубки наружу!
  let cx0 = 0, cy0 = 0, cz0 = 0, cnt0 = 0;
  for (let r = 0; r < Math.min(2, ringCount); r++) {
    for (let c = 0; c < radialSegs; c++) {
      const vi = (r * cols + c) * 3;
      cx0 += positions[vi];
      cy0 += positions[vi + 1];
      cz0 += positions[vi + 2];
      cnt0++;
    }
  }
  cx0 /= Math.max(1, cnt0);
  cy0 /= Math.max(1, cnt0);
  cz0 /= Math.max(1, cnt0);

  const ax = positions[0], ay = positions[1], az = positions[2];
  const bx = positions[3], by = positions[4], bz = positions[5];
  const dx = positions[cols * 3], dy = positions[cols * 3 + 1], dz = positions[cols * 3 + 2];
  const e1x = dx - ax, e1y = dy - ay, e1z = dz - az;
  const e2x = bx - ax, e2y = by - ay, e2z = bz - az;
  const nx = e1y * e2z - e1z * e2y;
  const ny = e1z * e2x - e1x * e2z;
  const nz = e1x * e2y - e1y * e2x;
  const flipWinding = nx * (ax - cx0) + ny * (ay - cy0) + nz * (az - cz0) < 0;

  for (let r = 0; r < ringCount - 1; r++) {
    for (let c = 0; c < radialSegs; c++) {
      const a = r * cols + c;
      const b = a + 1;
      const d = (r + 1) * cols + c;
      const e = d + 1;
      if (flipWinding) indices.push(a, b, d, b, e, d);
      else indices.push(a, d, b, b, d, e);
    }
  }

  let capIdx = ringCount * cols;
  if (capStart) {
    let sx = 0, sy = 0, sz = 0;
    for (let c = 0; c < radialSegs; c++) {
      sx += positions[c * 3];
      sy += positions[c * 3 + 1];
      sz += positions[c * 3 + 2];
    }
    positions[capIdx * 3] = sx / radialSegs;
    positions[capIdx * 3 + 1] = sy / radialSegs;
    positions[capIdx * 3 + 2] = sz / radialSegs;
    uvs[capIdx * 2] = 0.5;
    uvs[capIdx * 2 + 1] = 0;
    for (let c = 0; c < radialSegs; c++) {
      if (flipWinding) indices.push(capIdx, c + 1, c);
      else indices.push(capIdx, c, c + 1);
    }
    capIdx++;
  }
  if (capEnd) {
    const baseR = (ringCount - 1) * cols;
    let sx = 0, sy = 0, sz = 0;
    for (let c = 0; c < radialSegs; c++) {
      sx += positions[(baseR + c) * 3];
      sy += positions[(baseR + c) * 3 + 1];
      sz += positions[(baseR + c) * 3 + 2];
    }
    positions[capIdx * 3] = sx / radialSegs;
    positions[capIdx * 3 + 1] = sy / radialSegs;
    positions[capIdx * 3 + 2] = sz / radialSegs;
    uvs[capIdx * 2] = 0.5;
    uvs[capIdx * 2 + 1] = 1;
    for (let c = 0; c < radialSegs; c++) {
      if (flipWinding) indices.push(capIdx, baseR + c, baseR + c + 1);
      else indices.push(capIdx, baseR + c + 1, baseR + c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// ============================================================================
// 1. СКУЛЬПТУРНАЯ АНАТОМИЯ КИСТИ В ЗАМШЕВОЙ ПЕРЧАТКЕ И РУКАВА ПАЛЬТО
// ============================================================================

/** Одиночная «складка кожи» (залом): канавка с приподнятыми краями. */
function foldWavelet(t, center, width) {
  const d = (t - center) / width;
  return (1 - 2 * d * d) * Math.exp(-d * d);
}

/**
 * Фаланга замшевой перчатки — не «гладкая сосиска», а честная портновская деталь:
 *   1) мыщелки сустава у основания (палец у сустава шире и чуть толще);
 *   2) приподнятые складки кожи на ладонной стороне сгиба (у перчатки залом —
 *      это ВАЛИК: канавка на таком масштабе читается пробитой дырой);
 *   3) морщинка на тыле над суставом;
 *   4) вшитая строчка по тыльной середине — геометрические стежки, без доп. вызовов;
 *   5) ногтевая пластина на дальней фаланге (сплющенная площадка с рамкой-валиком);
 *   6) подушечка кончика и естественный подгиб, «зашитый» в ось.
 */
function buildSculptedPhalanxGeometry(rProx, rDist, len, {
  atJoint = true,
  stitches = true,
  nail = false,
  curl = 0.16,
  pleats = 2,
  steps = 26,
} = {}) {
  const rings = [];
  const stitchPitch = 0.0026;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — у сустава, 1 — к концу фаланги
    const taper = Math.pow(t, 0.92);
    const rad = THREE.MathUtils.lerp(rProx, rDist, taper);
    const condyle = atJoint ? Math.exp(-Math.pow(t / 0.135, 2)) : 0;
    const midWaist = 1 - 0.022 * Math.exp(-Math.pow((t - 0.55) / 0.32, 2));
    const tipT = 0.89;
    const nose = t > tipT ? Math.sqrt(Math.max(0.06, 1 - Math.pow((t - tipT) / (1 - tipT), 1.9))) : 1;
    const z = -t * len;
    const y = -curl * len * Math.pow(t, 2);
    const halfW = rad * (1.155 + condyle * 0.135) * midWaist * nose;
    const halfTop = rad * (0.80 + condyle * 0.10) * midWaist * nose;
    const halfBot = rad * (0.95 + condyle * 0.05) * midWaist * nose;
    const dorsalWrinkle = atJoint ? foldWavelet(t, 0.155, 0.075) * 0.34 : 0;
    const nailBand = nail ? Math.exp(-Math.pow((t - 0.775) / 0.165, 2)) : 0;

    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const ac = Math.abs(c);
      let x = Math.sign(c) * Math.pow(ac, 0.80) * halfW;
      let yy;
      if (sn >= 0) {
        const flat = 1 - 0.22 * nailBand * Math.exp(-Math.pow(x / (halfW * 0.46), 2));
        const ridge = nail
          ? 0.0010 * Math.exp(-Math.pow((Math.abs(x) - halfW * 0.50) / 0.0030, 2)) * nailBand
            + 0.0009 * Math.exp(-Math.pow((t - 0.935) / 0.045, 2)) * Math.exp(-Math.pow(x / (halfW * 0.42), 2))
          : 0;
        const st = stitches
          ? 0.00072 * (Math.sin((t * len) / stitchPitch * Math.PI * 2) > 0.05 ? 1 : 0)
            * Math.exp(-Math.pow(x / 0.0021, 2))
          : 0;
        yy = sn * halfTop * flat + ridge + st + dorsalWrinkle * rad * 0.075 * Math.exp(-Math.pow(x / (halfW * 0.50), 2));
      } else {
        const tipPad = nail ? Math.exp(-Math.pow((t - 0.80) / 0.22, 2)) * 0.30 : 0;
        const pad = 1 + (0.10 * Math.sin(Math.PI * Math.min(1, t * 1.12)) + tipPad) * (1 - ac * 0.35);
        const pleat = Math.exp(-Math.pow((t - 0.098) / 0.050, 2))
          + (pleats > 1 ? Math.exp(-Math.pow((t - 0.208) / 0.042, 2)) * 0.72 : 0);
        yy = sn * halfBot * pad + pleat * rad * 0.175 * Math.exp(-Math.pow(x / (halfW * 0.62), 2));
      }
      return [x, y + yy, z];
    });
  }
  return buildLoftedTube(rings, 26, { capStart: false, capEnd: true });
}

/**
 * Сустав-«линза» (MCP/PIP/DIP): двояковыпуклый disc шире фаланги, поэтому палец
 * читается цепью суставов, а не конусом. hood — приподнятый тыльный капюшон
 * (разгибательный аппарат): именно он даёт линию костяшек на тыле кисти.
 */
function buildGloveJointGeometry(r, halfLen = 0.0088, wide = 1.10, tall = 0.94, hood = 0) {
  const rings = [];
  const steps = 9;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const z = THREE.MathUtils.lerp(halfLen, -halfLen, t);
    const lens = Math.sqrt(Math.max(0.02, 1 - Math.pow((t - 0.5) / 0.5, 2)));
    const rad = r * (0.965 + 0.075 * lens);
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const condyle = 1 + 0.055 * Math.exp(-Math.pow((Math.abs(c) - 0.86) / 0.26, 2)) * lens;
      const ext = sn > 0 ? 1 + (0.09 + hood) * lens : 1;
      return [Math.sign(c) * Math.pow(Math.abs(c), 0.86) * rad * wide * condyle,
        Math.sign(sn) * Math.pow(Math.abs(sn), 0.88) * rad * tall * ext, z];
    });
  }
  return buildLoftedTube(rings, 20, { capStart: true, capEnd: true });
}

/**
 * Кисть в замшевой перчатке — ЛЮФТ по анатомическому чертежу (а не «раздутая сфера»):
 * узкое запястье → клин пясти → широкое поле костяшек, тыльный свод, ладонная чаша,
 * валики тенара/гипотенара, продольный шов и СКРУСНАЯ линия перегиба: край пясти
 * скошен, поэтому пальцы врастают в кожу, как у живой кисти. (side: +1 правая.)
 */
function buildSculptedPalmGeometry(side = 1) {
  const zWrist = 0.0075;
  const zKnuckles = -0.1056;
  const rings = [];
  const steps = 32;
  const knuckleXs = [-0.0318, -0.0106, 0.0116, 0.0324];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const z = THREE.MathUtils.lerp(zWrist, zKnuckles, t);
    let hw = 0.0262 + 0.0210 * Math.pow(t, 0.70);
    hw -= 0.0062 * Math.exp(-Math.pow((t - 1.0) / 0.080, 2)); // край вровень с крайними пальцами
    const top = 0.0130 - 0.0058 * Math.pow(t, 1.2);
    const bot = 0.0106 - 0.0026 * t;
    const arc = -0.0038 * Math.sin(t * Math.PI); // дуга пясти (ладонь «обнимает» цилиндр)
    const wristGather = Math.exp(-Math.pow(t / 0.10, 2));
    const rise = THREE.MathUtils.smoothstep(t, 0.64, 1.0);
    const webMask = THREE.MathUtils.smoothstep(t, 0.80, 1.0);

    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const ac = Math.abs(c);
      const x = Math.sign(c) * Math.pow(ac, 0.80) * hw * (1 + wristGather * 0.02);
      let between = 0;
      for (let k = 0; k < 3; k++) {
        between += Math.exp(-Math.pow((x - side * (knuckleXs[k] + knuckleXs[k + 1]) * 0.5) / 0.0064, 2));
      }
      // у основания каждого пальца кожа ОТХОДИТ назад (палец врастает в неё),
      // а между пальцами остаётся мягкой перемычкой; ладонная сторона обрывается
      // раньше тыльной — как у живой кисти. Никаких острых «клыков».
      const edge = 1 - Math.min(1, between);
      const zz = z + webMask * (0.0016 * edge + 0.0118 * Math.max(0, -sn));
      let y = arc;
      if (sn >= 0) {
        // ТЫЛ: плавный поперечный свод + общий подъём к линии костяшек + продольный
        // шов. Головки пясти даёт не пясть, а суставные «капюшоны» (см. линзу MCP):
        // на шаге люфта 3,4 мм точечные бугорки превращаются в кратеры.
        const dome = 1 + 0.16 * (1 - ac * ac);
        const seam = 0.0012 * Math.exp(-Math.pow(x / 0.0046, 2))
          * THREE.MathUtils.smoothstep(t, 0.06, 0.20) * (1 - 0.35 * THREE.MathUtils.smoothstep(t, 0.86, 1.0));
        y += sn * (top + 0.0026 * rise) * dome + seam;
      } else {
        // ЛАДОНЬ: пологая чаша, валики тенара/гипотенара, поперечная складка
        const hollow = 1 - 0.30 * (1 - ac * ac) * THREE.MathUtils.smoothstep(t, 0.25, 0.85);
        const thenar = Math.exp(-Math.pow((x + side * 0.0330) / 0.0140, 2)) * 0.0034 * (1 - t * 0.45);
        const hypo = Math.exp(-Math.pow((x - side * 0.0335) / 0.0120, 2)) * 0.0026 * (1 - t * 0.30);
        const crease = Math.exp(-Math.pow((t - 0.62) / 0.085, 2)) * 0.0012;
        y += sn * bot * hollow - thenar - hypo + crease * (1 - ac);
      }
      return [x, y, zz];
    });
  }
  return buildLoftedTube(rings, 44, { capStart: true, capEnd: true });
}

/**
 * Раструб перчатки у запястья — ПЛОСКИЙ овал (вбок шире, вперёд-назад выше), а не
 * круг: круглые кольца манжеты протыкают овальное сукно рукава и рвут силуэт.
 * Конец у кисти ОБНИМАЕТ запястье (иначе между кожей и манжетой видна щель).
 */
function buildGloveWristGeometry({ rxHand, ryHand, rxCuff, ryCuff, zCuff = 0.0356, zHand = -0.0058 }) {
  const rings = [];
  const steps = 16;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — со стороны рукава, 1 — со стороны кисти
    const k = Math.pow(t, 0.70);
    const rx = THREE.MathUtils.lerp(rxCuff, rxHand, k);
    const ry = THREE.MathUtils.lerp(ryCuff, ryHand, k);
    const z = THREE.MathUtils.lerp(zCuff, zHand, t);
    const gather = Math.exp(-Math.pow(t / 0.44, 2));
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const puck = gather * Math.sin(theta * 3 - 0.4) * 0.0012;
      return [Math.sign(c) * Math.pow(Math.abs(c), 0.86) * (rx + puck),
        Math.sign(sn) * Math.pow(Math.abs(sn), 0.88) * (ry + puck * 0.62), z];
    });
  }
  return buildLoftedTube(rings, 24, { capStart: true, capEnd: true });
}

/**
 * Шея. Нужна обязательно: без неё высокий воротник и шарф сверху выглядят
 * как полое кольцо, в которое видно пустоту (головы-то нет — это камера).
 * Нижним краем колонна шире горловины, поэтому щели нет, а верх закрыт
 * округлым сводом (тень подбородка), который намеренно НИЖЕ среза ворота:
 * из первых лиц видно мягкую тень внутри шарфа, а не «лысую голову».
 */
function buildNeckGeometry() {
  const rings = [];
  const yShaftTop = -0.2530;
  const yBot = -0.3240;
  const yApex = -0.2442;
  const steps = 9;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — низ (в ворота), 1 — верх шахты
    const y = THREE.MathUtils.lerp(yBot, yShaftTop, t);
    const rx = THREE.MathUtils.lerp(0.0684, 0.0588, t);
    const rz = THREE.MathUtils.lerp(0.0566, 0.0494, t);
    const zc = 0.0090 * Math.pow(1 - t, 2); // лёгкий наклон к подбородку
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      // два мягких жёлоба грудино-ключично-сосцевидных мышц, тыл плоский
      const groove = Math.exp(-Math.pow((Math.abs(c) - 0.60) / 0.24, 2)) * (sn < 0 ? 0.0044 : 0);
      const backFlat = sn > 0 ? 0.94 : 1.0;
      return [Math.sign(c) * Math.pow(Math.abs(c), 0.86) * (rx - groove * 0.30), y,
        zc + Math.sign(sn) * Math.pow(Math.abs(sn), 0.92) * (rz * backFlat - groove)];
    });
  }
  // округлый свод сверху: кольца схлопываются, y идёт дугой
  const domeSegs = 4;
  for (let d = 1; d <= domeSegs; d++) {
    const a = (d / domeSegs) * (Math.PI * 0.5);
    const shrink = Math.cos(a);
    const y = yShaftTop + (yApex - yShaftTop) * Math.sin(a);
    const rx = 0.0588 * shrink + 0.0016;
    const rz = 0.0494 * shrink + 0.0016;
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      return [Math.sign(c) * Math.pow(Math.abs(c), 0.86) * rx, y,
        Math.sign(sn) * Math.pow(Math.abs(sn), 0.92) * rz];
    });
  }
  return buildLoftedTube(rings, 24, { capStart: true, capEnd: true });
}

/**
 * Лента плотной ткани, раскроенная СТРОГО по поверхности пальто: путь задан в плоскости
 * (x, y), а z каждой точки снимается с чертёжного профиля coatFrontZ. Ширина ленты
 * идёт поперёк груди, толщина — вдоль нормали к сукну, поэтому лацкан, клапан кармана
 * или висящий конец шарфа никогда не «всплывают» и не врезаются в корпус.
 * ctrl: [{ x, y, hw }] — контрольные точки портновского чертежа (hw — полуширина ленты).
 */
function buildSurfaceRibbonGeometry(ctrl, {
  gap = 0.0075,
  halfT = 0.0058,
  steps = 26,
  radialSegs = 12,
  widthPow = 0.55,
  thickPow = 1.55,
  ribCount = 0,
  ribAmp = 0.16,
  billow = 0,
  capStart = true,
  capEnd = true,
} = {}) {
  const planar = new THREE.CatmullRomCurve3(
    ctrl.map((p) => new THREE.Vector3(p.x, p.y, 0)), false, 'catmullrom', 0.5
  );
  const n = ctrl.length;
  const halfWAt = (u) => {
    const g = u * (n - 1);
    const i = Math.min(n - 2, Math.max(0, Math.floor(g)));
    return THREE.MathUtils.lerp(ctrl[i].hw ?? 1, ctrl[i + 1].hw ?? 1, THREE.MathUtils.clamp(g - i, 0, 1));
  };
  const rings = [];
  for (let s = 0; s <= steps; s++) {
    const u = s / steps;
    const pt = planar.getPointAt(u);
    const halfW = halfWAt(u);
    const bell = billow * Math.sin(u * Math.PI);
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const cord = ribCount > 0 ? 1 + ribAmp * Math.cos(theta * ribCount) : 1;
      const xw = pt.x + Math.sign(c) * Math.pow(Math.abs(c), widthPow) * halfW * cord;
      const surfZ = coatFrontZ(pt.y, xw);
      const off = gap + bell + Math.sign(sn) * Math.pow(Math.abs(sn), thickPow) * halfT * cord;
      return [xw, pt.y, surfZ - off];
    });
  }
  return buildLoftedTube(rings, radialSegs, { capStart, capEnd });
}

/** Матрица-постановка детали на поверхность пальто: её локальная +Y совпадает с нормалью сукна. */
function coatSurfaceMatrix(x, y, gap = 0.0) {
  const h = 0.0022;
  const f = (xx, yy) => coatFrontZ(yy, xx);
  const fx = (f(x + h, y) - f(x - h, y)) / (2 * h);
  const fy = (f(x, y + h) - f(x, y - h)) / (2 * h);
  const normal = new THREE.Vector3(fx, fy, -1).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, f(x, y) - gap),
    quat,
    new THREE.Vector3(1, 1, 1)
  );
}

/**
 * Скроенный суконный рукав пальто вдоль оси Y (от 0 до 1): широкий, почти цилиндрический
 * рукав-«труба» осеннего пальто с провисанием плотной ткани, локтевой посадкой и наружным швом.
 */
function buildTailoredSleeveGeometry(rBottom, rTop, { gather = 0.0032, oval = 0.86 } = {}) {
  const rings = [];
  const steps = 10;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — ниже по руке (локти/кисть), 1 — выше (плечо)
    const baseR = THREE.MathUtils.lerp(rBottom, rTop, t);
    const clothEase = Math.sin(t * Math.PI) * gather;
    const drape = (1 - t) * 0.0016;
    const y = t - 0.5;
    rings.push((theta) => {
      const cx = Math.cos(theta);
      const cz = Math.sin(theta);
      // Портновское сечение рукава: овальное (уже вбок, больше вперёд-назад) + шов снаружи
      const seam = Math.exp(-Math.pow((theta - 0) / 0.17, 2)) * 0.0015 +
        Math.exp(-Math.pow(Math.abs(theta - Math.PI) / 0.17, 2)) * 0.0012;
      const rx = (baseR + clothEase + seam) * oval;
      const rz = baseR + clothEase * 1.30 + drape;
      const drapeZ = cz < 0 ? cz * clothEase * 0.7 : 0;
      return [cx * rx, y, cz * rz + drapeZ];
    });
  }
  return buildLoftedTube(rings, 18);
}

/**
 * Втачная головка рукава (окат) пальто — честная портновская замена «шару на месте плеча»:
 * короткий конус, чьё широкое основание продолжает плоское плечо корпуса, с посадочными
 * сборками по окату и выпуклым рантовым швом проймы. Строится вдоль локальной +Y (плечо наружу).
 */
function buildSleeveHeadGeometry(rSleeve) {
  const rings = [];
  const steps = 12;
  const yTop = 0.0065;
  const yEnd = -0.0755;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — в пройме (под плечом корпуса), 1 — переход в рукав
    const y = THREE.MathUtils.lerp(yTop, yEnd, t);
    const flare = Math.pow(Math.max(0, 1 - t * 1.02), 1.55);
    const gather = Math.exp(-Math.pow((t - 0.20) / 0.24, 2));
    const seamRidge = Math.exp(-Math.pow((t - 0.40) / 0.085, 2)) * 0.0052;
    const rad = rSleeve * (1 + flare * 0.085) + seamRidge;
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const pucker = gather * Math.sin(theta * 5 + 0.55) * 0.0026;
      return [c * (rad + pucker) * 0.885, y, sn * (rad + pucker) * 1.0];
    });
  }
  return buildLoftedTube(rings, 26, { capStart: true, capEnd: false });
}

/**
 * Локтевой узел рукава: сгиб плотной ткани с выступающим локтевым отростком —
 * сплюснутый вдоль оси руки мыс с острым тыльным гребнем, а не «шар-петля».
 */
function buildElbowHingeGeometry(r) {
  const rings = [];
  const steps = 10;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — со стороны плеча, 1 — со стороны предплечья
    const bulge = 1 + 0.052 * Math.sin(Math.pow(t, 0.82) * Math.PI);
    const rad = r * bulge;
    const y = THREE.MathUtils.lerp(0.036, -0.036, t);
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const olecranon = sn > 0 ? Math.pow(sn, 2.4) * 0.0090 * Math.sin(t * Math.PI) : 0;
      const inner = sn < 0 ? Math.pow(-sn, 2.0) * 0.0042 : 0;
      return [c * rad * 0.885, y, sn * (rad + olecranon) - inner];
    });
  }
  return buildLoftedTube(rings, 20, { capStart: true, capEnd: true });
}

/**
 * Скульптурный сегмент большого пальца замшевой перчатки: сплюснутая каплевидная призма
 * с плоской ногтевой пластиной, пухлой подушечкой, тыльным швом-ребром и ЗАКРУГЛЁННЫМ
 * ногтем на конце. Естественный изгиб пальца «зашит» в геометрию, поэтому палец
 * не выглядит ни палкой, ни нанизанными шариками.
 */
function buildThumbSegmentGeometry({ rBase, rTip, len, curl = 0.16, roundTip = true, swell = 0.10, noseAt = 0.85, nail = false }) {
  const rings = [];
  const steps = 14;
  const tNose = noseAt;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const nose = t > tNose
      ? Math.sqrt(Math.max(0.05, 1 - Math.pow((t - tNose) / (1 - tNose), 1.55)))
      : 1;
    const rad = THREE.MathUtils.lerp(rBase, rTip, Math.pow(t, 0.88)) * (roundTip ? nose : 1);
    const jointSwell = Math.exp(-Math.pow((t - 0.04) / 0.20, 2)) * swell;
    const wrinkle = Math.exp(-Math.pow((t - 0.30) / 0.085, 2)) * 0.075 +
      Math.exp(-Math.pow((t - 0.44) / 0.075, 2)) * 0.045;
    const bell = Math.sin(Math.PI * THREE.MathUtils.clamp(t * 1.04, 0, 1));
    const z = -t * len;
    const y = -curl * len * Math.pow(t, 2);
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const dorsal = sn >= 0;
      // ногтевая пластина: площадка уплощена, рамка — валиком
      const nb = nail ? Math.exp(-Math.pow((t - 0.80) / 0.16, 2)) : 0;
      const rx = rad * (1.14 + jointSwell * 0.55) * (1 + 0.05 * nb);
      const ry = rad * (dorsal ? (0.70 + wrinkle) * (1 - 0.20 * nb * Math.exp(-Math.pow(c / 0.56, 2)))
        + 0.10 * nb * Math.exp(-Math.pow((Math.abs(c) - 0.66) / 0.15, 2)) : 0.95);
      const seam = dorsal ? 0.0011 * bell * Math.exp(-Math.pow(c / 0.52, 2)) : 0;
      const pad = dorsal ? 0 : Math.pow(-sn, 1.15) * rad * 0.14 * bell;
      return [c * rx, y + sn * ry + seam - pad * 0.6, z];
    });
  }
  return buildLoftedTube(rings, 16, { capStart: false, capEnd: !!roundTip });
}

/**
 * Мышца тенара (основание большого пальца): мягкий мускульный объём, в который
 * «врастает» палец — именно он закрывает межпальцевую щель при отведённом пальце.
 */
function buildThenarGeometry(side = 1) {
  const rings = [];
  const steps = 10;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps; // 0 — у запястья, 1 — у основания пальца
    const rad = 0.0138 + Math.sin(t * Math.PI) * 0.0062 - t * 0.0022;
    const x = -side * THREE.MathUtils.lerp(0.0295, 0.0425, Math.pow(t, 0.86));
    const y = -0.0075 + Math.sin(t * Math.PI) * 0.0035;
    const z = THREE.MathUtils.lerp(0.0035, -0.0430, t);
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const toPalm = sn < 0 ? 1.20 : 0.72;
      return [x - side * c * rad * 0.78, y + sn * rad * toPalm, z + c * rad * 0.30];
    });
  }
  return buildLoftedTube(rings, 14, { capStart: true, capEnd: true });
}


// ============================================================================
// 2. СКУЛЬПТУРНОЕ ТУЛОВИЩЕ В ПЕТЕРБУРГСКОМ ПАЛЬТО, БРЮКИ И КОЖАНЫЕ БОТИНКИ
// ============================================================================

// Профиль петербургского пальто — ЕДИНЫЙ источник геометрии всего туловища:
// воротник, лацканы, шарф, пуговицы и клапаны карманов вычисляются из этих колец,
// поэтому ни одна накладная деталь не «всплывает» над сукном и не тонет в нём.
// Ключевой закон оптики от первого лица: |z_front / y| монотонно растёт сверху вниз,
// благодаря чему наружная лицевая сторона корпуса открыта взгляду без самоперекрытия.
const COAT_PROFILE = [
  { y: -0.258, hw: 0.0690, hd: 0.0458, cz: 0.0520, split: 0.000 },
  { y: -0.272, hw: 0.1010, hd: 0.0540, cz: 0.0332, split: 0.000 },
  { y: -0.284, hw: 0.1660, hd: 0.0638, cz: 0.0122, split: 0.000 },
  { y: -0.296, hw: 0.2318, hd: 0.0758, cz: -0.0062, split: 0.000 },
  { y: -0.312, hw: 0.2352, hd: 0.0828, cz: -0.0205, split: 0.000 },
  { y: -0.344, hw: 0.2132, hd: 0.0902, cz: -0.0332, split: 0.000 },
  { y: -0.400, hw: 0.2014, hd: 0.0976, cz: -0.0492, split: 0.000 },
  { y: -0.460, hw: 0.1950, hd: 0.1032, cz: -0.0628, split: 0.000 },
  { y: -0.530, hw: 0.1906, hd: 0.1062, cz: -0.0788, split: 0.000 },
  { y: -0.600, hw: 0.1892, hd: 0.1098, cz: -0.0958, split: 0.000 },
  { y: -0.710, hw: 0.1940, hd: 0.1140, cz: -0.1220, split: 0.035 },
  { y: -0.810, hw: 0.2000, hd: 0.1160, cz: -0.1420, split: 0.075 },
  { y: -0.895, hw: 0.2060, hd: 0.1180, cz: -0.1560, split: 0.115 },
];

const COAT_SHOULDER_Y = -0.296;   // линия плеча (акромион)
const catmullRom = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3);
};

/** Сглаженное сечение пальто на высоте y (сплайн по кольцам портновского чертежа). */
function coatAt(y) {
  const P = COAT_PROFILE;
  const n = P.length;
  let i = 0;
  while (i < n - 2 && y < P[i + 1].y) i++;
  const a = P[Math.max(0, i - 1)];
  const b = P[i];
  const c = P[i + 1];
  const d = P[Math.min(n - 1, i + 2)];
  const span = c.y - b.y;
  const t = span !== 0 ? THREE.MathUtils.clamp((y - b.y) / span, 0, 1) : 0;
  return {
    hw: Math.max(0.05, catmullRom(a.hw, b.hw, c.hw, d.hw, t)),
    hd: Math.max(0.03, catmullRom(a.hd, b.hd, c.hd, d.hd, t)),
    cz: catmullRom(a.cz, b.cz, c.cz, d.cz, t),
    split: Math.max(0, catmullRom(a.split, b.split, c.split, d.split, t)),
  };
}

/** Плоское приподнятое плечо пальто: подъём и расчёт ширины у дельты (вместо шаров!). */
function coatShoulderLift(y) {
  return Math.exp(-Math.pow((y - COAT_SHOULDER_Y) / 0.042, 2));
}

/**
 * Координата z наружной (грудной) поверхности пальто в точке (y, x) — степень
 * суперэллипса 0.84/0.86 точно повторяет ring-функцию корпуса, поэтому деталь,
 * поставленная на coatFrontZ(y, x) - зазор, лежит на сукне как пришитая.
 */
function coatFrontZ(y, x = 0) {
  const p = coatAt(y);
  const lift = coatShoulderLift(y);
  const ax = Math.min(0.999, Math.abs(x) / p.hw);
  const sideW = Math.pow(ax, 1.25);
  let z = p.cz - p.hd * Math.pow(Math.max(0, 1 - Math.pow(ax, 2 / 0.84)), 0.43);
  z += lift * (0.0028 * sideW + 0.0018 * Math.exp(-Math.pow((1 - ax) / 0.30, 2)));
  const skirtFactor = THREE.MathUtils.clamp((-y - 0.60) / 0.28, 0, 1);
  if (skirtFactor < 0.35 && x > -0.052 && x < 0.084) z -= 0.0055;
  if (p.split > 0.001 && Math.abs(x) < p.split) {
    z += (1 - Math.abs(x) / p.split) * p.split * 0.72;
  }
  return z;
}

/**
 * Корпус двубортного осеннего пальто: широкая почти ПЛОСКАЯ линия плеча (уклон всего
 * ~14°, как у честного втачного рукава на подплечнике), приподнятый валик оката,
 * короткая кокетка спинки, приталивание и расходящиеся полы с V-разрезом на запаху.
 */
function buildOvercoatBodyGeometry() {
  const rings = [];
  const yTop = COAT_PROFILE[0].y;
  const yBottom = COAT_PROFILE[COAT_PROFILE.length - 1].y;
  const totalSteps = 34;
  for (let s = 0; s <= totalSteps; s++) {
    const u = s / totalSteps;
    const eased = u < 0.26 ? u * 0.5769 : 0.15 + (u - 0.26) * 1.2192;
    const y = THREE.MathUtils.lerp(yTop, yBottom, THREE.MathUtils.clamp(eased, 0, 1));
    const { hw, hd, cz, split } = coatAt(y);
    const lift = coatShoulderLift(y);
    const yokeBand = Math.exp(-Math.pow((y + 0.344) / 0.024, 2));
    const skirtFactor = THREE.MathUtils.clamp((-y - 0.60) / 0.28, 0, 1);

    rings.push((theta) => {
      // theta = 0 справа (+X), PI/2 сзади (+Z), PI слева (-X), 3PI/2 спереди (-Z)
      const cx = Math.cos(theta);
      const sz = Math.sin(theta);
      const ax = Math.min(1, Math.abs(cx));
      const sx = Math.sign(cx) * Math.pow(Math.abs(cx), 0.84);
      const sza = Math.sign(sz) * Math.pow(Math.abs(sz), 0.86);
      const sideW = Math.pow(ax, 1.25);
      const pleat = skirtFactor * Math.sin(theta * 6) * 0.0055;
      let x = sx * (hw + pleat);
      let z = cz + sza * (hd + pleat * 0.8);

      // 1) Плоское широкое плечо пальто + 2) валик втачного оката у проймы
      const yy = y + lift * sideW * 0.0048;
      x += Math.sign(cx || 1) * lift * (sideW * 0.0028);
      z += lift * 0.0028 * sideW;
      const roll = Math.exp(-Math.pow((1 - ax) / 0.30, 2)) * lift;
      x += Math.sign(cx || 1) * roll * 0.0022;
      z += Math.sign(sz || 1) * roll * 0.0018;

      // 3) Кокетка спинки: короткий горизонтальный шов-перекат под плечами
      if (sz > 0.45) z += yokeBand * (0.4 + 0.6 * sz) * 0.0042;

      // Двубортный запах на груди (правая пола чуть поверх левой спереди sz < -0.55)
      if (sz < -0.55 && skirtFactor < 0.35) {
        const overlap = cx > -0.18 && cx < 0.35 ? -0.0055 : 0;
        z += overlap;
      }

      // Расходящийся треугольный разрез полы пальто внизу спереди (открывает брюки со стрелками!)
      if (split > 0.001 && sz < -0.55 && Math.abs(x) < split) {
        const indent = (1 - Math.abs(x) / split) * split * 0.72;
        z += indent;
      }

      return [x, yy, z];
    });
  }
  // Верх горловины и низ пальто герметично закрыты (capStart/capEnd), исключая просвет сквозь торс!
  return buildLoftedTube(rings, 36, { capStart: true, capEnd: true });
}


/**
 * Отложной воротник пальто: широкая плоская «воронка» вокруг шеи (тыл и бока),
 * приподнятая над линией плеча и переходящая спереди в лацканы (никакого «бублика-трубы»).
 */
function buildCollarBandGeometry() {
  const rings = [];
  const steps = 30;
  const rx = 0.0792;
  const rz = 0.0598;
  const cz = 0.0128;
  for (let s = 0; s <= steps; s++) {
    const u = s / steps;
    const phi = -1.70 + u * 3.40; // 0 — центр спинки, ±1.70 — у конца лацкана
    const frontness = Math.pow(Math.abs(phi) / 1.70, 1.35);
    const px = Math.sin(phi) * rx * (1 + frontness * 0.055);
    const pz = cz + Math.cos(phi) * rz;
    const yBase = -0.3010 + frontness * 0.0042;
    const yTopEdge = -0.2398 - frontness * 0.0180;
    const lean = 0.0122 - frontness * 0.0102; // откинутый назад верх воротника
    const height = (yTopEdge - yBase) * 0.5;
    const midY = (yTopEdge + yBase) * 0.5;
    const thick = 0.0072 + (1 - Math.abs(Math.sin(phi))) * 0.0016;
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const radial = Math.sign(c) * Math.pow(Math.abs(c), 0.72) * thick;
      const vert = Math.sign(sn) * Math.pow(Math.abs(sn), 0.80) * height;
      const ex = Math.sin(phi);
      const ez = Math.cos(phi);
      return [px + ex * radial, midY + vert, pz + ez * radial + lean * (vert / height) * 0.6];
    });
  }
  return buildLoftedTube(rings, 14, { capStart: true, capEnd: true });
}

/**
 * Острый лацкан пальто (правая сторона, x > 0; левая строится зеркалом) — лента сукна,
 * раскроенная точно по груди: широкий раскат у плеча, фирменная «лесенка» выреза
 * и узкий острый кончик у верхней пуговицы.
 */
function buildRightLapelGeometry() {
  return buildSurfaceRibbonGeometry([
    { x: 0.0555, y: -0.2765, hw: 0.0135 },
    { x: 0.0885, y: -0.3030, hw: 0.0305 },
    { x: 0.1115, y: -0.3400, hw: 0.0370 },
    { x: 0.1175, y: -0.3880, hw: 0.0352 },
    { x: 0.1055, y: -0.4360, hw: 0.0305 },
    { x: 0.0892, y: -0.4520, hw: 0.0228 },
    { x: 0.0712, y: -0.4740, hw: 0.0158 },
    { x: 0.0556, y: -0.4885, hw: 0.0072 },
  ], { gap: 0.0068, halfT: 0.0062, steps: 30, radialSegs: 14, billow: 0.0022 });
}

/** Клапан бокового кармана пальто: слегка «пузащая» лента с острым нижним углом. */
function buildPocketFlapGeometry(side = 1) {
  // Клапан кармана: концы ОБЯЗАНЫ оставаться внутри силуэта пальто (на y≈-0.65
  // полуширина сукна ~0.198), иначе внешний край клапана висит перед краем полы
  // и с фронта читается как «игла», торчащая в сторону кисти.
  // Ширина клапана откладывается ПО Z, а у бокового шва сукно уходит вглубь на
  // десятки миллиметров — поэтому дальний конец клапана обязан быть узким и
  // оканчиваться ДО того, как поверхность становится крутой: иначе его «задник»
  // отрывается от сукна и торчит плавником рядом с кистью.
  const geo = buildSurfaceRibbonGeometry([
    { x: 0.0960, y: -0.6370, hw: 0.0056 },
    { x: 0.1170, y: -0.6425, hw: 0.0124 },
    { x: 0.1360, y: -0.6472, hw: 0.0122 },
    { x: 0.1470, y: -0.6500, hw: 0.0034 },
  ], { gap: 0.0014, halfT: 0.0030, steps: 18, radialSegs: 12, billow: 0.0011 });
  return side > 0 ? geo : mirrorGeoX(geo);
}


/**
 * Вязаный шарф-мешок (muffler) в ДВА оборота вокруг шеи — ровно то, что видно
 * из-под подбородка при взгляде вниз в VR: плотный рубчик, нахлёст второго оборота,
 * заправленный конец и один свободно висящий конец, лежащий строго по сукну пальто.
 */
function buildMufflerWrapGeometry({ cy, rx, rz, cz, band, ribs, phase, droop, squashTop = 0.92 }) {
  const rings = [];
  const steps = 44;
  for (let s = 0; s <= steps; s++) {
    const u = s / steps;
    const phi = u * Math.PI * 2; // 0 — строго спереди (-Z)
    const front = Math.max(0, Math.cos(phi));
    const pathX = Math.sin(phi) * rx;
    const pathZ = cz - Math.cos(phi) * rz - droop * front * 0.55;
    const pathY = cy - droop * front;
    const rib = 1 + 0.052 * Math.cos(phi * ribs + phase);
    const underChin = Math.exp(-Math.pow((phi - 0) / 0.55, 2)) + Math.exp(-Math.pow((phi - Math.PI * 2) / 0.55, 2));
    rings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const rr = band * rib;
      const out = Math.sign(c) * Math.pow(Math.abs(c), 0.88) * rr * 1.10;
      const up = sn >= 0
        ? sn * rr * (squashTop - 0.10 * front + 0.05 * underChin)
        : sn * rr * 0.70;
      const ex = Math.sin(phi);
      const ez = -Math.cos(phi);
      return [pathX + ex * out, pathY + up, pathZ + ez * out];
    });
  }
  return buildLoftedTube(rings, 18, { capStart: false, capEnd: false });
}

/**
 * Вязаная стойка шарфа: плотная ТРУБА в рубчик вокруг шеи (её верхний край с подворотом —
 * ровно то, что видно в нижней каёмке кадра, когда опускаешь голову) и один свободный конец,
 * спущенный по грудине в V-вырез лацканов. Шарф намеренно ужат ДО внутри ворота пальто:
 * он не надувается «бубликом» над плечами и не перекрывает лацканы с пуговицами.
 */

/**
 * Тесьма вязаного полотна: несколько отдельных жгутов (именно так резинка читается
 * в крупном плане VR), каждый — своя круглая «трубка», идущая точно по сукну пальто.
 */
function buildCordedBandGeometry(ctrl, {
  gap = 0.0056,
  cords = 5,
  cordR = 0.0058,
  spread = 0.0258,
  steps = 26,
  radialSegs = 10,
  billow = 0.0022,
} = {}) {
  const parts = [];
  for (let k = 0; k < cords; k++) {
    const off = cords === 1 ? 0 : (k / (cords - 1) - 0.5) * 2 * spread;
    const shifted = ctrl.map((c) => ({ x: c.x + off, y: c.y, hw: cordR }));
    parts.push(buildSurfaceRibbonGeometry(shifted, {
      gap, halfT: cordR, steps, radialSegs, widthPow: 1.0, thickPow: 1.0, billow,
    }));
  }
  return mergeGeos(parts);
}

function buildMufflerCollarGeometry() {
  const parts = [];
  const steps = 48;
  const rx = 0.0730;
  const rz = 0.0624;
  const cz = 0.0124;
  const profile = (phi) => {
    const front = Math.max(0, Math.cos(phi));
    const rib = 1 + 0.010 * Math.cos(phi * 12);
    return {
      px: Math.sin(phi) * rx * rib,
      pz: cz - Math.cos(phi) * rz * rib,
      front,
      yBot: -0.3072 - front * 0.0034,
      yTop: -0.2422 - front * 0.0052,
    };
  };

  // 1) Само полотно стойки: сплюснутая «складка» ткани (толщина 7 мм, высота 6.5 см),
  //    с лёгким клёшем наружу к верхнему краю и продольными жгутами вязки.
  const bodyRings = [];
  const hemRings = [];
  for (let s = 0; s <= steps; s++) {
    const phi = (s / steps) * Math.PI * 2;
    const pr = profile(phi);
    const ex = Math.sin(phi);
    const ez = -Math.cos(phi);
    bodyRings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const flare = 1 + 0.075 * Math.max(0, sn);
      const thick = 0.0076 * (1 + 0.20 * pr.front) * flare;
      const midY = (pr.yBot + pr.yTop) * 0.5;
      const halfH = (pr.yTop - pr.yBot) * 0.5;
      const cord = 1 + 0.030 * Math.sin(theta * 10);
      const out = Math.sign(c) * Math.pow(Math.abs(c), 0.70) * thick * cord;
      const vert = Math.sign(sn) * Math.pow(Math.abs(sn), 0.66) * halfH;
      return [pr.px + ex * out, midY + vert, pr.pz + ez * out];
    });
    // 2) Верхний подворот: круглый кант по эллипсу — читается как подогнутая резинка
    hemRings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const r = 0.0052;
      return [pr.px + ex * (r * c + 0.0022), pr.yTop + sn * r * 0.86, pr.pz + ez * (r * c + 0.0022)];
    });
  }
  parts.push(buildLoftedTube(bodyRings, 20, { capStart: false, capEnd: false }));
  parts.push(buildLoftedTube(hemRings, 12, { capStart: false, capEnd: false }));

  // 3) Свободный конец: тесьма из пяти жгутов вязки, лежащая точно по сукну груди
  const tailCtrl = [
    { x: -0.0452, y: -0.2860 },
    { x: -0.0492, y: -0.3260 },
    { x: -0.0518, y: -0.3680 },
    { x: -0.0528, y: -0.4100 },
    { x: -0.0522, y: -0.4460 },
    { x: -0.0502, y: -0.4705 },
  ];
  parts.push(buildCordedBandGeometry(tailCtrl, { gap: 0.0054, cords: 5, cordR: 0.0061, spread: 0.0212, steps: 30, radialSegs: 11, billow: 0.0020 }));

  // 4) Бахрома: каждый жгут оканчивается своей нитью — мгновенно «читается» как шарф
  const hemY = -0.4705;
  for (let f = 0; f < 5; f++) {
    const fx = -0.0502 + (f - 2) * 0.0106;
    const hemZ = coatFrontZ(hemY, fx) - 0.0070;
    const sway = (f - 2) * 0.0022;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(fx, hemY - 0.0015, hemZ + 0.0018),
      new THREE.Vector3(fx + sway * 0.4, hemY - 0.0092, hemZ + 0.0036),
      new THREE.Vector3(fx + sway, hemY - 0.0168, hemZ + 0.0054),
    ]);
    parts.push(new THREE.TubeGeometry(curve, 5, 0.00162, 6, false));
  }

  return mergeGeos(parts);
}

function buildScarfGeometry() {
  return buildMufflerCollarGeometry();
}

function buildRightTrouserLegGeometry(zStanceOffset = 0.012, outAngleRad = -7.5 * DEG) {
  // Правая штанина (x > 0) выходит из-под V-разреза пол пальто (y=-0.81) через колено (-1.13)
  // к классическому портновскому отвороту-манжете у ботинка (-1.445)!
  const legRings = [];
  const steps = 16;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const y = THREE.MathUtils.lerp(-0.81, -1.445, t);
    const kneeFlex = Math.sin(t * Math.PI) * 0.028;
    const cxCenter = THREE.MathUtils.lerp(0.104, 0.128, t);
    const czCenter = THREE.MathUtils.lerp(-0.225, -0.565, t) - kneeFlex + zStanceOffset;
    const isCuff = t > 0.88;
    // Портновский объём: бедро → колено → икра → лёгкий клёш у отворота
    const thigh = 1 + 0.098 * Math.exp(-Math.pow((t - 0.04) / 0.19, 2));
    const knee = 1 + 0.072 * Math.exp(-Math.pow((t - 0.47) / 0.15, 2));
    const calf = 1 + 0.086 * Math.exp(-Math.pow((t - 0.73) / 0.15, 2));
    const baseRx = (THREE.MathUtils.lerp(0.0755, 0.0555, t) + (isCuff ? 0.0058 : 0)) * thigh * knee * calf;
    const baseRz = (THREE.MathUtils.lerp(0.0815, 0.0635, t) + (isCuff ? 0.0062 : 0)) * thigh * knee * (1 + (calf - 1) * 1.35);
    const kneeCrease = Math.exp(-Math.pow((t - 0.52) / 0.09, 2));
    const ankleGather = Math.exp(-Math.pow((t - 0.85) / 0.06, 2));

    legRings.push((theta) => {
      const c = Math.cos(theta);
      const sn = Math.sin(theta);
      const frontCrease = sn < -0.65 ? Math.pow((-sn - 0.65) / 0.35, 1.45) * 0.012 : 0;
      const backCrease = sn > 0.75 ? Math.pow((sn - 0.75) / 0.25, 1.6) * 0.005 : 0;
      const folds =
        kneeCrease * Math.sin(t * 55 + c * 2.5) * 0.0032 +
        ankleGather * Math.cos(t * 70) * 0.0028;

      const lx = c * (baseRx + folds);
      const lz = sn * (baseRz + folds) - frontCrease + backCrease;
      const rot = outAngleRad * t;
      const rx = lx * Math.cos(rot) - lz * Math.sin(rot);
      const rz = lx * Math.sin(rot) + lz * Math.cos(rot);
      return [cxCenter + rx, y, czCenter + rz];
    });
  }
  return buildLoftedTube(legRings, 18, { capStart: true, capEnd: true });
}

function buildRightBootGeometries(zStanceOffset = 0.012, outAngleRad = -7.5 * DEG) {
  // Скульптурный петербургский кожаный ботинок (правый, стопа длиной 29 см от пятки до мыска):
  // возвращает { leatherGeo, soleGeo, eyeletGeo } с честным положительным масштабом!
  const ankleX = 0.128;
  const ankleZ = -0.565 + zStanceOffset;
  const rotMat = new THREE.Matrix4().makeRotationY(outAngleRad);
  const placeMat = new THREE.Matrix4().makeTranslation(ankleX, 0, ankleZ).multiply(rotMat);

  const leatherParts = [];
  const soleParts = [];
  const eyeletParts = [];

  // 1) Скульптурная кожаная колодка (голенище + подъём + союзка + округлый отрезной мысок)
  const vampCurve = [
    { y: -1.432, zc: 0.004, hw: 0.047, hl: 0.052 },
    { y: -1.474, zc: -0.008, hw: 0.049, hl: 0.062 },
    { y: -1.510, zc: -0.044, hw: 0.053, hl: 0.098 },
    { y: -1.536, zc: -0.084, hw: 0.056, hl: 0.134 },
    { y: -1.556, zc: -0.094, hw: 0.055, hl: 0.144 },
  ];
  const bootRings = [];
  const vSteps = 12;
  for (let s = 0; s <= vSteps; s++) {
    const gt = (s / vSteps) * (vampCurve.length - 1);
    const i0 = Math.min(vampCurve.length - 2, Math.floor(gt));
    const f = gt - i0;
    const a = vampCurve[i0], b = vampCurve[i0 + 1];
    const y = THREE.MathUtils.lerp(a.y, b.y, f);
    const zc = THREE.MathUtils.lerp(a.zc, b.zc, f);
    const hw = THREE.MathUtils.lerp(a.hw, b.hw, f);
    const hl = THREE.MathUtils.lerp(a.hl, b.hl, f);

    bootRings.push((theta) => {
      const cx = Math.cos(theta);
      const sz = Math.sin(theta);
      const archTuck = cx < 0 && sz > -0.2 && sz < 0.4 ? 0.005 : 0;
      const x = Math.sign(cx) * Math.pow(Math.abs(cx), 0.84) * hw + archTuck;
      const z = zc + Math.sign(sz) * Math.pow(Math.abs(sz), 0.82) * hl;
      // Шов отрезного мыска (cap-toe ridge) на z ~ -0.162
      const capRidge = Math.exp(-Math.pow((z + 0.162) / 0.008, 2)) * 0.0028;
      return [x, y + capRidge, z];
    });
  }
  leatherParts.push(transformGeo(buildLoftedTube(bootRings, 20, { capStart: true, capEnd: true }), placeMat));

  // Мягкий кожаный валик вокруг лодыжки + язычок под шнуровкой
  const collar = new THREE.TorusGeometry(0.046, 0.0075, 7, 16);
  const mCollar = placeMat.clone().multiply(
    new THREE.Matrix4().makeTranslation(0, -1.452, 0.002).multiply(new THREE.Matrix4().makeRotationX(Math.PI * 0.5))
  );
  leatherParts.push(transformGeo(collar, mCollar));

  // 2) Рант и рифлёная осенняя подошва + наборный каблук
  const soleRings = [
    { y: -1.553, zc: -0.094, hw: 0.0585, hl: 0.150 },
    { y: -1.568, zc: -0.094, hw: 0.0600, hl: 0.152 },
    { y: -1.578, zc: -0.094, hw: 0.0585, hl: 0.150 },
  ].map(({ y, zc, hw, hl }) => (theta) => {
    const cx = Math.cos(theta);
    const sz = Math.sin(theta);
    const lug = Math.sin(theta * 18) * 0.0014;
    return [
      Math.sign(cx) * Math.pow(Math.abs(cx), 0.82) * (hw + lug),
      y,
      zc + Math.sign(sz) * Math.pow(Math.abs(sz), 0.80) * (hl + lug),
    ];
  });
  soleParts.push(transformGeo(buildLoftedTube(soleRings, 20, { capStart: true, capEnd: true }), placeMat));

  // Каблук в пяточной части (z от -0.01 до +0.058)
  const heel = new THREE.CylinderGeometry(0.049, 0.050, 0.016, 12);
  heel.scale(1.02, 1, 0.86);
  const mHeel = placeMat.clone().multiply(new THREE.Matrix4().makeTranslation(0, -1.582, 0.014));
  soleParts.push(transformGeo(heel, mHeel));

  // 3) 4 перекрёстных шнурка + 8 латунных люверсов на подъёме ботинка
  for (let row = 0; row < 4; row++) {
    const ly = -1.468 - row * 0.0145;
    const lz = -0.052 - row * 0.023;
    const spanX = 0.020 + row * 0.0014;

    const laceCurve1 = new THREE.LineCurve3(
      new THREE.Vector3(-spanX, ly, lz),
      new THREE.Vector3(spanX, ly - 0.005, lz - 0.009)
    );
    const laceCurve2 = new THREE.LineCurve3(
      new THREE.Vector3(spanX, ly, lz),
      new THREE.Vector3(-spanX, ly - 0.005, lz - 0.009)
    );
    soleParts.push(transformGeo(new THREE.TubeGeometry(laceCurve1, 1, 0.0028, 5, false), placeMat));
    soleParts.push(transformGeo(new THREE.TubeGeometry(laceCurve2, 1, 0.0028, 5, false), placeMat));

    for (const sx of [-1, 1]) {
      const eye = new THREE.CylinderGeometry(0.0042, 0.0042, 0.0030, 7);
      const mEye = placeMat.clone().multiply(
        new THREE.Matrix4()
          .makeTranslation(sx * (spanX + 0.002), ly, lz)
          .multiply(new THREE.Matrix4().makeRotationX(0.55))
      );
      eyeletParts.push(transformGeo(eye, mEye));
    }
  }

  return {
    leatherGeo: mergeGeos(leatherParts),
    soleGeo: mergeGeos(soleParts),
    eyeletGeo: mergeGeos(eyeletParts),
  };
}

/**
 * Собирает всё статичное 3D-туловище (пальто, воротник, лацканы, шарф, карманы, пуговицы)
 * и ноги (брюки со стрелками + кожаные ботинки) в 7 объединённых буферов!
 */
function buildAvatarBodyGroup(mats) {
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'vr-avatar-body';

  const coatTrimParts = [];
  const buttonAndEyeletParts = [];

  // Пальто + выделенные более светлым суконным кантом воротник, лацканы и клапаны боковых карманов
  const coatBodyGeo = buildOvercoatBodyGeometry();

  // Отложной воротник: плоская «воронка» вокруг шеи (тыл и бока), а не трубка-бублик
  coatTrimParts.push(buildCollarBandGeometry());

  // Острые лацканы, раскроенные точно по чертежу груди (левый — зеркалом, det > 0)
  const rightLapel = buildRightLapelGeometry();
  const leftLapel = mirrorGeoX(rightLapel);
  coatTrimParts.push(rightLapel, leftLapel);

  // Два косых прорезных кармана с клапанами, огибающими корпус (рядом со спокойными руками)
  for (const sx of [-1, 1]) {
    coatTrimParts.push(buildPocketFlapGeometry(sx));
  }

  // 6 двубортных пуговиц: каждая поставлена НА поверхность сукна по её нормали,
  // поэтому не «парит» над грудью и не тонет в ней при любом наклоне головы.
  for (const rowY of [-0.496, -0.590, -0.684]) {
    for (const sx of [-1, 1]) {
      const mBase = coatSurfaceMatrix(sx * 0.058, rowY, 0.0016);
      const btn = new THREE.CylinderGeometry(0.0122, 0.0128, 0.0062, 14);
      buttonAndEyeletParts.push(transformGeo(btn, mBase));
      const rim = new THREE.TorusGeometry(0.0112, 0.0021, 6, 14);
      const mRim = mBase.clone().multiply(new THREE.Matrix4().makeRotationX(Math.PI * 0.5));
      const mRim2 = mRim.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0.0026, 0));
      buttonAndEyeletParts.push(transformGeo(rim, mRim2));
      // Два нитяных ушка в дырочке роговой пуговицы
      for (const dx of [-0.0042, 0.0042]) {
        const stitch = new THREE.CylinderGeometry(0.0012, 0.0012, 0.0042, 6);
        const mStitch = mRim.clone().multiply(
          new THREE.Matrix4().makeTranslation(dx, 0.0034, 0).multiply(new THREE.Matrix4().makeRotationX(Math.PI * 0.5))
        );
        buttonAndEyeletParts.push(transformGeo(stitch, mStitch));
      }
    }
  }

  // Брюки: правая и левая штанины (лёгкая естественная асимметрия стойки 2.6 см)
  const rightLeg = buildRightTrouserLegGeometry(0.012, -7.5 * DEG);
  const leftLegRaw = buildRightTrouserLegGeometry(-0.014, -6.5 * DEG);
  const leftLeg = mirrorGeoX(leftLegRaw);
  leftLegRaw.dispose();

  // Кожаные петербургские ботинки: правый и отзеркаленный левый (scale det = +1!)
  const rBoot = buildRightBootGeometries(0.012, -7.5 * DEG);
  const lBootRaw = buildRightBootGeometries(-0.014, -6.5 * DEG);
  const lBootLeather = mirrorGeoX(lBootRaw.leatherGeo);
  const lBootSole = mirrorGeoX(lBootRaw.soleGeo);
  const lBootEye = mirrorGeoX(lBootRaw.eyeletGeo);
  lBootRaw.leatherGeo.dispose();
  lBootRaw.soleGeo.dispose();
  lBootRaw.eyeletGeo.dispose();

  buttonAndEyeletParts.push(rBoot.eyeletGeo, lBootEye);

  const coatTrimGeo = mergeGeos(coatTrimParts);
  const scarfGeo = buildScarfGeometry();
  const trousersGeo = mergeGeos([rightLeg, leftLeg]);
  const bootsLeatherGeo = mergeGeos([rBoot.leatherGeo, lBootLeather]);
  const bootsSoleGeo = mergeGeos([rBoot.soleGeo, lBootSole]);
  const buttonsGeo = mergeGeos(buttonAndEyeletParts);

  const coatMesh = new THREE.Mesh(coatBodyGeo, mats.sleeveMat);
  const coatTrimMesh = new THREE.Mesh(coatTrimGeo, mats.sleeveFoldMat);
  // Шея — отдельная деталь (не входит в 7 батчей торса): без неё шарф сверху
  // читается как полое кольцо, в которое видно пустоту.
  const neckGeo = buildNeckGeometry();
  const neckMesh = new THREE.Mesh(neckGeo, mats.neckMat);
  const scarfMesh = new THREE.Mesh(scarfGeo, mats.scarfMat);
  const trousersMesh = new THREE.Mesh(trousersGeo, mats.trouserMat);
  const bootsLeatherMesh = new THREE.Mesh(bootsLeatherGeo, mats.bootLeatherMat);
  const bootsSoleMesh = new THREE.Mesh(bootsSoleGeo, mats.bootSoleMat);
  const buttonsMesh = new THREE.Mesh(buttonsGeo, mats.hornButtonMat);

  bodyGroup.add(coatMesh, coatTrimMesh, scarfMesh, trousersMesh, bootsLeatherMesh, bootsSoleMesh, buttonsMesh);

  return {
    bodyGroup,
    neckMesh,
    geos: [coatBodyGeo, coatTrimGeo, scarfGeo, neckGeo, trousersGeo, bootsLeatherGeo, bootsSoleGeo, buttonsGeo],
  };
}

// ============================================================================
// 3. СОЧЛЕНЁННЫЙ КОНСТРУКТОР РУКИ (ИСПОЛЬЗУЕТСЯ ДЛЯ ОБЕИХ РУК — РАБОЧЕЙ И СВОБОДНОЙ)
// ============================================================================

function createArticulatedArm(mats, sharedGeos, { withBeacon = false, initialSide = 'right' } = {}) {
  const armRoot = new THREE.Group();

  // Втачной окат рукава пальто (никаких шаров на месте плеча!)
  const sleeveHead = new THREE.Mesh(sharedGeos.sleeveHeadGeo, mats.sleeveMat);
  armRoot.add(sleeveHead);

  const upperArmSleeve = new THREE.Mesh(sharedGeos.upperSleeveGeo, mats.sleeveMat);
  armRoot.add(upperArmSleeve);

  const elbowJointGroup = new THREE.Group();
  elbowJointGroup.add(new THREE.Mesh(sharedGeos.elbowHingeGeo, mats.sleeveMat));
  // 2 мягкие портновские складки на сгибе локтя
  // 2 мягкие портновские складки на сгибе локтя — строго перпендикулярно оси
  // рукава: наклонённое кольцо неизбежно выкалывает «лезвие» с одной стороны
  const elbowCrease1 = new THREE.Mesh(sharedGeos.elbowCreaseGeo, mats.sleeveFoldMat);
  elbowCrease1.rotation.x = Math.PI * 0.5;
  elbowCrease1.position.set(0, 0.0104, -0.0012);
  const elbowCrease2 = new THREE.Mesh(sharedGeos.elbowCreaseGeo, mats.sleeveFoldMat);
  elbowCrease2.rotation.x = Math.PI * 0.5;
  elbowCrease2.position.set(0, -0.0104, -0.0008);
  elbowJointGroup.add(elbowCrease1, elbowCrease2);
  armRoot.add(elbowJointGroup);

  // Внутренняя сторона раструба обязана быть «тканью», а не пустотой: иначе
  // в щель между перчаткой и рукавом видно черноту
  const forearmSleeve = new THREE.Mesh(sharedGeos.foreSleeveGeo, mats.foreSleeveMat);
  armRoot.add(forearmSleeve);

  // Скроенный обшлаг пальто с хлястиком-патой и пуговицей + вязаная манжета
  const forearmCuffGroup = new THREE.Group();
  armRoot.add(forearmCuffGroup);

  const coatCuffHem = new THREE.Mesh(sharedGeos.coatCuffHemGeo, mats.sleeveFoldInnerMat);
  coatCuffHem.rotation.x = Math.PI * 0.5;
  coatCuffHem.scale.set(0.92, 1.0, 1.08);
  coatCuffHem.position.set(0, 0.0004, 0.0306);
  forearmCuffGroup.add(coatCuffHem);

  // Хлястик-пата рукава пальто с роговой пуговицей (придаёт живой портновский силуэт!)
  const cuffTabGroup = new THREE.Group();
  const cuffTab = new THREE.Mesh(sharedGeos.cuffTabGeo, mats.sleeveFoldMat);
  // ремень лежит ПОВЕРХ отвернутого обшлага, а его эллипс повторяет сечение
  // рукава: иначе свободный конец дуги торчит «лезвием» там, где рукав уже
  cuffTab.scale.set(0.862, 1.0, 1.0);
  const cuffBtn = new THREE.Mesh(sharedGeos.cuffBtnGeo, mats.hornButtonMat);
  cuffBtn.scale.set(1.0, 1.0, 0.86);
  cuffBtn.rotation.z = Math.PI * 0.5;
  cuffBtn.position.set(0.0466, 0.0022, 0);
  cuffTabGroup.add(cuffTab, cuffBtn);
  forearmCuffGroup.add(cuffTabGroup);

  const knitCuff = new THREE.Mesh(sharedGeos.knitCuffGeo, mats.cuffKnitMat);
  knitCuff.rotation.x = Math.PI * 0.5;
  knitCuff.scale.set(0.94, 1.0, 1.06);
  knitCuff.position.set(0, 0.0004, 0.0172);
  forearmCuffGroup.add(knitCuff);

  // Ремешок с двухцветным маячком (показывается ТОЛЬКО на рабочей руке в режиме «Рука-браслет»!)
  let beaconBandGroup = null;
  let miniWristband = null;
  let rivet = null;
  if (withBeacon) {
    beaconBandGroup = new THREE.Group();
    const strap = new THREE.Mesh(sharedGeos.strapGeo, mats.strapMat);
    strap.rotation.x = Math.PI * 0.5;
    strap.scale.set(0.92, 1.0, 1.08);
    strap.position.set(0, 0.0004, 0.0040);
    beaconBandGroup.add(strap);

    miniWristband = new THREE.Group();
    const miniScreen = new THREE.Mesh(sharedGeos.miniScreenGeo, mats.deviceCaseMat);
    miniWristband.add(miniScreen);
    const dotG = new THREE.Mesh(sharedGeos.ledDotGeo, mats.ledGreenMat);
    dotG.position.set(0, 0.0026, -0.0044);
    miniWristband.add(dotG);
    const dotM = new THREE.Mesh(sharedGeos.ledDotGeo, mats.ledMagentaMat);
    dotM.position.set(0, 0.0026, 0.0044);
    miniWristband.add(dotM);
    beaconBandGroup.add(miniWristband);

    rivet = new THREE.Mesh(sharedGeos.rivetGeo, mats.hornButtonMat);
    beaconBandGroup.add(rivet);
    forearmCuffGroup.add(beaconBandGroup);
  }

  // Лучезапястный сустав и скульптурная кисть в замшевой перчатке
  const wristPivot = new THREE.Group();
  armRoot.add(wristPivot);

  const inertiaPivot = new THREE.Group();
  wristPivot.add(inertiaPivot);

  const handBody = new THREE.Group();
  handBody.scale.setScalar(1.0);
  inertiaPivot.add(handBody);

  // Запястье: мягкий раструб перчатки со сборками ткани (вместо «шара-перехода»)
  const wristCuff = new THREE.Mesh(sharedGeos.wristBridgeGeo, mats.gloveMat);
  handBody.add(wristCuff);
  // Обшивной кант устья перчатки — тот самый «сшитый вручную» край
  const gloveBinding = new THREE.Mesh(sharedGeos.gloveBindingGeo, mats.seamMat);
  gloveBinding.scale.set(1.0, 0.62, 1.0);
  gloveBinding.position.set(0, 0, 0.0352);
  handBody.add(gloveBinding);

  const palmMesh = new THREE.Mesh(sharedGeos.palmRightGeo, mats.gloveMat);
  handBody.add(palmMesh);

  // Мышца тенара: отдельная скульптурная масса, в которую врастает большой палец
  const thenarPad = new THREE.Mesh(sharedGeos.thenarRightGeo, mats.palmInnerMat);
  handBody.add(thenarPad);

  // Кнопка-застёжка раструба — с локтевой стороны манжеты (как у вождюльских
  // перчаток), а не на ладони; рог, а не латунь: латунь без env-карты «светится».
  const wristSnapBtn = new THREE.Mesh(sharedGeos.wristSnapGeo, mats.hornButtonMat);
  wristSnapBtn.rotation.z = Math.PI * 0.5;
  handBody.add(wristSnapBtn);

  // Четыре скульптурных трёхфаланговых пальца с кожными заломами у суставов
  const fingers = sharedGeos.fingerTemplates.map((tpl) => {
    const mcp = new THREE.Group();
    mcp.add(new THREE.Mesh(tpl.knuckleGeo, mats.gloveMat));
    mcp.add(new THREE.Mesh(tpl.p1Geo, mats.gloveMat));

    const pip = new THREE.Group();
    pip.position.set(0, 0, -tpl.spec.l1);
    pip.add(new THREE.Mesh(tpl.pipGeo, mats.gloveMat));
    pip.add(new THREE.Mesh(tpl.p2Geo, mats.gloveMat));

    const dip = new THREE.Group();
    dip.position.set(0, 0, -tpl.spec.l2);
    dip.add(new THREE.Mesh(tpl.dipGeo, mats.gloveMat));
    dip.add(new THREE.Mesh(tpl.p3Geo, mats.gloveMat));

    pip.add(dip);
    mcp.add(pip);
    handBody.add(mcp);
    return { spec: tpl.spec, mcp, pip, dip };
  });

  // Большой палец перчатки: КОРОТКИЙ (0.72 длины указательного) двусуставный палец,
  // врастающий основанием в тенар. Сегменты перекрываются (устья спрятаны внутри
  // предыдущего), поэтому суставы читаются как единая скульптурная масса, а не как
  // нанизанные на ось шарики; естественный подгиб «зашит» в саму геометрию фаланг.
  const thumbMeta = new THREE.Group();
  thumbMeta.add(new THREE.Mesh(sharedGeos.thumbMetaGeo, mats.gloveMat));

  const thumbProx = new THREE.Group();
  thumbProx.position.set(0, 0.0004, -0.0248);
  thumbProx.add(new THREE.Mesh(sharedGeos.thumbProxGeo, mats.gloveMat));

  const thumbDist = new THREE.Group();
  thumbDist.position.set(0, 0.0004, -0.0216);
  thumbDist.add(new THREE.Mesh(sharedGeos.thumbDistGeo, mats.gloveMat));

  thumbProx.add(thumbDist);
  thumbMeta.add(thumbProx);
  handBody.add(thumbMeta);

  let armSide = null;
  function setSide(side) {
    const clean = side === 'left' ? 'left' : 'right';
    if (clean === armSide) return;
    armSide = clean;
    const s = clean === 'left' ? -1 : 1;

    palmMesh.geometry = clean === 'left' ? sharedGeos.palmLeftGeo : sharedGeos.palmRightGeo;
    thenarPad.geometry = clean === 'left' ? sharedGeos.thenarLeftGeo : sharedGeos.thenarRightGeo;
    handBody.rotation.set(0.05, s * 0.06, s * 0.24);

    wristSnapBtn.position.set(s * 0.0302, 0.0022, 0.0268);

    for (const f of fingers) {
      f.mcp.position.set(s * f.spec.baseX, f.spec.yOff, f.spec.zOff);
    }

    thumbMeta.position.set(-s * 0.0308, -0.0088, -0.0198);
    thumbMeta.rotation.set(0.05, s * 0.70, -s * 0.34);

    cuffTabGroup.position.set(0, 0.0004, 0.0306);
    cuffTabGroup.rotation.set(0, 0, s > 0 ? -0.34 : Math.PI + 0.34);

    if (miniWristband && rivet) {
      miniWristband.position.set(-s * 0.005, 0.0527, 0.0040);
      miniWristband.rotation.z = s * 0.12;
      rivet.position.set(s * 0.0300, 0.0365, 0.0040);
      rivet.rotation.z = -s * 0.712;
    }
  }

  function setFingerPose(curlAmt, splayAmt, wave = 0, rummagePhase = 0, inertiaFlex = 0) {
    const s = armSide === 'left' ? -1 : 1;
    for (let i = 0; i < fingers.length; i++) {
      const f = fingers[i];
      const ripple = wave * Math.sin(rummagePhase + i * 0.9) * 0.16;
      const cascade = i * 0.052;
      const c = THREE.MathUtils.clamp(curlAmt + cascade + ripple + inertiaFlex, 0.03, 1.35);

      f.mcp.rotation.x = -c * 0.56;
      f.pip.rotation.x = -c * 0.78;
      f.dip.rotation.x = -c * 0.52;
      f.mcp.rotation.y = -s * f.spec.splay * splayAmt;
    }

    const tc = THREE.MathUtils.clamp(curlAmt * 0.70 + inertiaFlex * 0.45, 0.02, 1.0);
    // Мягкая естественная дина: палец лишь немного обнимает ладонь, без «крюка»
    thumbMeta.rotation.x = 0.05 - tc * 0.15;
    thumbMeta.rotation.y = s * (0.70 - tc * 0.13);
    thumbProx.rotation.x = -0.06 - tc * 0.22;
    thumbDist.rotation.x = -0.035 - tc * 0.235;
  }

  // Рабочие векторы для безсингулярной сборки предплечья и рукава
  const segVec = new THREE.Vector3();
  const forearmForward = new THREE.Vector3();
  const wristUp = new THREE.Vector3();
  const wristRight = new THREE.Vector3();
  const cuffX = new THREE.Vector3();
  const cuffY = new THREE.Vector3();
  const cuffZ = new THREE.Vector3();
  const vCuffEnd = new THREE.Vector3();
  const sleeveY = new THREE.Vector3();
  const sleeveZ = new THREE.Vector3();
  const basisMat = new THREE.Matrix4();
  const upAxis = new THREE.Vector3(0, 1, 0);

  function applyJoints(vShoulder, vElbow, vWrist, qArm, elbowBendDeg = 55, lagPitch = 0, lagYaw = 0) {
    wristPivot.position.copy(vWrist);
    wristPivot.quaternion.set(qArm[0], qArm[1], qArm[2], qArm[3]);
    inertiaPivot.rotation.set(lagPitch, lagYaw, 0);

    // 1) Плечевой сегмент рукава (от локтя к плечу) + втачной окат в пройме
    segVec.copy(vShoulder).sub(vElbow);
    const upperLen = Math.max(0.08, segVec.length());
    upperArmSleeve.position.copy(vElbow).addScaledVector(segVec, 0.5);
    upperArmSleeve.scale.set(1.0, upperLen, 1.0);
    upperArmSleeve.quaternion.setFromUnitVectors(upAxis, segVec.normalize());
    sleeveHead.quaternion.copy(upperArmSleeve.quaternion);
    sleeveHead.position.copy(vShoulder);

    // 2) Локтевой сустав со складками
    elbowJointGroup.position.copy(vElbow);
    elbowJointGroup.quaternion.copy(upperArmSleeve.quaternion);
    const creaseScale = 0.92 + THREE.MathUtils.clamp(elbowBendDeg / 120, 0, 1) * 0.16;
    elbowCrease1.scale.set(0.885 * creaseScale, creaseScale, creaseScale);
    elbowCrease2.scale.set(0.885 * creaseScale * 0.97, creaseScale * 0.97, creaseScale * 0.97);

    // 3) Предплечье и обшлаг (невырожденный базис в SO(3) на любых вертикальных углах!)
    forearmForward.copy(vWrist).sub(vElbow);
    const fullForeLen = Math.max(0.10, forearmForward.length());
    forearmForward.divideScalar(fullForeLen);
    cuffZ.copy(forearmForward).negate();

    wristUp.set(0, 1, 0).applyQuaternion(wristPivot.quaternion);
    cuffY.copy(wristUp).addScaledVector(cuffZ, -wristUp.dot(cuffZ));
    if (cuffY.lengthSq() < 1e-4) {
      wristRight.set(1, 0, 0).applyQuaternion(wristPivot.quaternion);
      cuffX.copy(wristRight).addScaledVector(cuffZ, -wristRight.dot(cuffZ)).normalize();
      cuffY.crossVectors(cuffZ, cuffX).normalize();
    } else {
      cuffY.normalize();
      cuffX.crossVectors(cuffY, cuffZ).normalize();
      cuffY.crossVectors(cuffZ, cuffX).normalize();
    }
    basisMat.makeBasis(cuffX, cuffY, cuffZ);

    forearmCuffGroup.position.copy(vWrist);
    forearmCuffGroup.quaternion.setFromRotationMatrix(basisMat);

    vCuffEnd.copy(vWrist).addScaledVector(cuffZ, 0.036);
    segVec.copy(vElbow).sub(vCuffEnd);
    const sleeveLen = Math.max(0.06, segVec.length());
    forearmSleeve.position.copy(vCuffEnd).addScaledVector(segVec, 0.5);
    sleeveY.copy(segVec).normalize();
    sleeveZ.crossVectors(cuffX, sleeveY).normalize();
    basisMat.makeBasis(cuffX, sleeveY, sleeveZ);
    forearmSleeve.quaternion.setFromRotationMatrix(basisMat);
    forearmSleeve.scale.set(1.0, sleeveLen, 1.0);
  }

  setSide(initialSide);
  setFingerPose(0.42, 0.36, 0, 0, 0);

  return {
    group: armRoot,
    wristPivot,
    beaconBandGroup,
    setSide,
    getSide: () => armSide,
    setFingerPose,
    applyJoints,
  };
}

// ============================================================================
// 4. ГЛАВНАЯ ФАБРИКА ПЕРВОЛИЧНОГО 3D-ТЕЛА И РУК «БЕЛОЙ НОЧИ»
// ============================================================================

export function createGlovedHand(initialSide = 'right') {
  const root = new THREE.Group();
  root.name = 'vr-gloved-hand';
  root.visible = false;

  const tex = createAvatarTextures();

  // Материалы в петербургской вечерней палитре «Белой ночи» с тактильным рельефом ткани и кожи
  const mats = {
    gloveMat: new THREE.MeshStandardMaterial({
      color: 0x947a61,
      emissive: 0x231a12,
      emissiveIntensity: 0.46,
      roughness: 0.73,
      metalness: 0.05,
      bumpMap: tex.suedeBump,
      bumpScale: 0.0022,
    }),
    palmInnerMat: new THREE.MeshStandardMaterial({
      color: 0x866e57,
      emissive: 0x160f09,
      emissiveIntensity: 0.40,
      roughness: 0.84,
      metalness: 0.04,
      bumpMap: tex.suedeBump,
      bumpScale: 0.0028,
    }),
    seamMat: new THREE.MeshStandardMaterial({
      color: 0xb39a80,
      emissive: 0x2a2017,
      emissiveIntensity: 0.45,
      roughness: 0.65,
      metalness: 0.06,
    }),
    cuffKnitMat: new THREE.MeshStandardMaterial({
      color: 0x26323e,
      emissive: 0x090e14,
      emissiveIntensity: 0.42,
      roughness: 0.90,
      metalness: 0.03,
      bumpMap: tex.knitBump,
      bumpScale: 0.0042,
    }),
    sleeveMat: new THREE.MeshStandardMaterial({
      color: 0x223041,
      emissive: 0x080e16,
      emissiveIntensity: 0.44,
      roughness: 0.87,
      metalness: 0.05,
      bumpMap: tex.woolBump,
      bumpScale: 0.0042,
    }),
    // та же суконная ткань, но двусторонняя — внутренность раструба рукава
    foreSleeveMat: new THREE.MeshStandardMaterial({
      color: 0x223041,
      emissive: 0x080e16,
      emissiveIntensity: 0.44,
      roughness: 0.92,
      metalness: 0.03,
      bumpMap: tex.woolBump,
      bumpScale: 0.0042,
      side: THREE.DoubleSide,
    }),
    neckMat: new THREE.MeshStandardMaterial({
      color: 0x8d6a4f,
      emissive: 0x1a0f07,
      emissiveIntensity: 0.22,
      roughness: 0.72,
      metalness: 0.0,
    }),
    sleeveFoldMat: new THREE.MeshStandardMaterial({
      color: 0x314358,
      emissive: 0x0c141f,
      emissiveIntensity: 0.45,
      roughness: 0.82,
      metalness: 0.07,
      bumpMap: tex.woolBump,
      bumpScale: 0.0038,
    }),
    // внутренний край обшлага — тоже ткань, иначе в раструбе зияет чёрная дыра
    sleeveFoldInnerMat: new THREE.MeshStandardMaterial({
      color: 0x314358,
      emissive: 0x0c141f,
      emissiveIntensity: 0.45,
      roughness: 0.88,
      metalness: 0.04,
      bumpMap: tex.woolBump,
      bumpScale: 0.0038,
      side: THREE.DoubleSide,
    }),
    scarfMat: new THREE.MeshStandardMaterial({
      color: 0x6d3336,
      emissive: 0x1e0b0c,
      emissiveIntensity: 0.44,
      roughness: 0.90,
      metalness: 0.02,
      bumpMap: tex.knitBump,
      bumpScale: 0.0060,
    }),
    trouserMat: new THREE.MeshStandardMaterial({
      color: 0x41464f,
      emissive: 0x101318,
      emissiveIntensity: 0.42,
      roughness: 0.85,
      metalness: 0.04,
      bumpMap: tex.trouserBump,
      bumpScale: 0.0042,
    }),
    bootLeatherMat: new THREE.MeshStandardMaterial({
      color: 0x4b3021,
      emissive: 0x140b06,
      emissiveIntensity: 0.42,
      roughness: 0.44,
      metalness: 0.14,
      bumpMap: tex.bootBump,
      bumpScale: 0.0034,
    }),
    bootSoleMat: new THREE.MeshStandardMaterial({
      color: 0x16191d,
      emissive: 0x050608,
      emissiveIntensity: 0.34,
      roughness: 0.86,
      metalness: 0.08,
    }),
    hornButtonMat: new THREE.MeshStandardMaterial({
      color: 0x9b7c54,
      emissive: 0x261a0c,
      emissiveIntensity: 0.42,
      roughness: 0.34,
      metalness: 0.50,
    }),
    strapMat: new THREE.MeshStandardMaterial({
      color: 0x3b2c22,
      emissive: 0x120c08,
      emissiveIntensity: 0.40,
      roughness: 0.62,
      metalness: 0.16,
    }),
    deviceCaseMat: new THREE.MeshStandardMaterial({
      color: 0x11161d,
      emissive: 0x04070a,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.35,
    }),
    pipBrassMat: new THREE.MeshStandardMaterial({
      color: 0xe3b878,
      emissive: 0x6e4819,
      emissiveIntensity: 0.55,
      roughness: 0.34,
      metalness: 0.58,
    }),
    ledGreenMat: new THREE.MeshBasicMaterial({ color: 0x00d957 }),
    ledMagentaMat: new THREE.MeshBasicMaterial({ color: 0xe00096 }),
  };

  // Общие скульптурные геометрии для обеих рук (ноль дублирования памяти!)
  const baseFingerSpecs = [
    { baseX: -0.0328, yOff: 0.0015, zOff: -0.0942, l1: 0.0368, l2: 0.0238, l3: 0.0158, w: 0.0186, splay: -0.062 },
    { baseX: -0.0109, yOff: 0.0035, zOff: -0.0994, l1: 0.0408, l2: 0.0262, l3: 0.0168, w: 0.0192, splay: -0.014 },
    { baseX: 0.0119, yOff: 0.0020, zOff: -0.0964, l1: 0.0378, l2: 0.0246, l3: 0.0158, w: 0.0184, splay: 0.030 },
    { baseX: 0.0318, yOff: -0.0020, zOff: -0.0882, l1: 0.0306, l2: 0.0196, l3: 0.0148, w: 0.0164, splay: 0.079 },
  ];

  // 3 фаланги + 3 сустава-линзы на палец: MCP (самый широкий, с разгибательным
  // капюшоном), PIP и DIP. Дальняя фаланга несёт ногтевую пластину и подушечку,
  // у ближней и средней — кожные залоги и вшитые стежки у сустава.
  const fingerTemplates = baseFingerSpecs.map((spec) => ({
    spec,
    knuckleGeo: buildGloveJointGeometry(spec.w * 0.520, 0.0116, 1.07, 1.04, 0.23),
    p1Geo: buildSculptedPhalanxGeometry(spec.w * 0.488, spec.w * 0.448, spec.l1, { curl: 0.185 }),
    pipGeo: buildGloveJointGeometry(spec.w * 0.452, 0.0096, 1.045, 0.96, 0.14),
    p2Geo: buildSculptedPhalanxGeometry(spec.w * 0.432, spec.w * 0.392, spec.l2, { curl: 0.235, pleats: 1 }),
    dipGeo: buildGloveJointGeometry(spec.w * 0.396, 0.0080, 1.03, 0.94, 0.09),
    p3Geo: buildSculptedPhalanxGeometry(spec.w * 0.376, spec.w * 0.312, spec.l3, { curl: 0.300, nail: true, stitches: false, pleats: 1 }),
  }));

  const sharedGeos = {
    sleeveHeadGeo: buildSleeveHeadGeometry(0.0505),
    upperSleeveGeo: buildTailoredSleeveGeometry(0.0478, 0.0505, { gather: 0.0042, oval: 0.885 }),
    elbowHingeGeo: buildElbowHingeGeometry(0.0476),
    // утолщение-«бант» на локте: кольцо обхватывает ОВАЛЬНОЕ сечение рукава
    // (0,885 по ширине), иначе его бока торчат плоскими «крыльями»
    elbowCreaseGeo: new THREE.TorusGeometry(0.0474, 0.0034, 6, 22),
    foreSleeveGeo: buildTailoredSleeveGeometry(0.0410, 0.0470, { gather: 0.0020, oval: 0.90 }),
    coatCuffHemGeo: new THREE.CylinderGeometry(0.0462, 0.0478, 0.033, 20),
    cuffTabGeo: new THREE.TorusGeometry(0.0528, 0.0032, 8, 26, Math.PI * 0.66),
    cuffBtnGeo: new THREE.CylinderGeometry(0.0055, 0.0055, 0.003, 9),
    knitCuffGeo: new THREE.CylinderGeometry(0.0338, 0.0354, 0.052, 18),
    strapGeo: new THREE.CylinderGeometry(0.0452, 0.0468, 0.0185, 20),
    miniScreenGeo: new THREE.BoxGeometry(0.031, 0.0045, 0.017),
    ledDotGeo: new THREE.SphereGeometry(0.0022, 6, 5),
    rivetGeo: new THREE.CylinderGeometry(0.0034, 0.0040, 0.0028, 12),
    wristBridgeGeo: buildGloveWristGeometry({ rxHand: 0.0240, ryHand: 0.0126, rxCuff: 0.0346, ryCuff: 0.0214 }),
    gloveBindingGeo: new THREE.TorusGeometry(0.0342, 0.0024, 8, 26),
    palmRightGeo: buildSculptedPalmGeometry(1),
    palmLeftGeo: buildSculptedPalmGeometry(-1),
    thenarRightGeo: buildThenarGeometry(1),
    thenarLeftGeo: buildThenarGeometry(-1),
    wristSnapGeo: new THREE.CylinderGeometry(0.0034, 0.0036, 0.0026, 10),
    fingerTemplates,
    thumbMetaGeo: buildThumbSegmentGeometry({ rBase: 0.0138, rTip: 0.0124, len: 0.0312, curl: 0.060, swell: 0.04, noseAt: 0.97 }),
    thumbProxGeo: buildThumbSegmentGeometry({ rBase: 0.0126, rTip: 0.0110, len: 0.0266, curl: 0.105, swell: 0.06, noseAt: 0.95 }),
    thumbDistGeo: buildThumbSegmentGeometry({ rBase: 0.0114, rTip: 0.0092, len: 0.0226, curl: 0.130, swell: 0.05, nail: true }),
  };

  // 1) Группа корпуса и ног в гравитационной системе торса (поворачивается qTorsoToCam)
  const bodyRoot = new THREE.Group();
  bodyRoot.name = 'vr-body-root';
  root.add(bodyRoot);

  const staticBody = buildAvatarBodyGroup(mats);
  bodyRoot.add(staticBody.bodyGroup);
  // шея — ВНЕ 7 батчей торса (их количество проверяют тесты), но внутри bodyRoot,
  // чтобы она жила вместе с наклоном головы и торса
  bodyRoot.add(staticBody.neckMesh);

  // Спокойная вторая (свободная) рука внутри системы корпуса — всегда лежит у кармана пальто!
  const passiveArm = createArticulatedArm(mats, sharedGeos, {
    withBeacon: false,
    initialSide: initialSide === 'left' ? 'right' : 'left',
  });
  bodyRoot.add(passiveArm.group);

  // 2) Ведущая рука (в режиме «Рука-браслет» оживает 60 Гц в пространстве камеры;
  //    в режимах «Гироскоп» и «2 метки» спокойно покоится у своего кармана симметрично второй руке!)
  const activeArm = createArticulatedArm(mats, sharedGeos, {
    withBeacon: true,
    initialSide,
  });
  root.add(activeArm.group);

  let currentSide = initialSide === 'left' ? 'left' : 'right';
  let calmTorsoYaw = 0;
  let curl = 0.30;
  let splayFactor = 0.60;
  let rummagePhase = 0;
  let lagPitch = 0;
  let lagYaw = 0;
  let breathPhase = 0;

  function applyHandSide(side) {
    const clean = side === 'left' ? 'left' : 'right';
    currentSide = clean;
    activeArm.setSide(clean);
    passiveArm.setSide(clean === 'left' ? 'right' : 'left');
  }

  // Естественная спокойная поза отдыхающей руки перед карманом пальто (в системе корпуса!):
  // при взгляде вперёд (pitch=0) кисть на -53° скрыта под экраном, а при взгляде вниз (-54°)
  // замшевые перчатки с костяшками и строчкой естественно обрамляют пальто, брюки и ботинки!
  const pSh = new THREE.Vector3();
  const pEl = new THREE.Vector3();
  const pWr = new THREE.Vector3();
  const qRestRight = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.86, 0.22, -0.36, 'YXZ')).toArray();
  const qRestLeft = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.86, -0.22, 0.36, 'YXZ')).toArray();

  function poseRestingArmInTorso(arm, sideStr) {
    const s = sideStr === 'left' ? -1 : 1;
    pSh.set(s * 0.196, -0.290, -0.042);
    pEl.set(s * 0.2335, -0.4945, -0.1170);
    pWr.set(s * 0.1915, -0.6310, -0.2560);
    const qRest = s > 0 ? qRestRight : qRestLeft;
    arm.setSide(sideStr);
    arm.applyJoints(pSh, pEl, pWr, qRest, 46, 0, 0);
    arm.setFingerPose(0.50, 0.26, 0, 0, 0);
  }

  applyHandSide(initialSide);
  poseRestingArmInTorso(passiveArm, currentSide === 'left' ? 'right' : 'left');

  const vShoulder = new THREE.Vector3();
  const vElbow = new THREE.Vector3();
  const vWrist = new THREE.Vector3();
  const qPitch = new THREE.Quaternion();
  const qYaw = new THREE.Quaternion();
  const qTorsoToCam = new THREE.Quaternion();
  const qRestCam = new THREE.Quaternion();
  const xAxis = new THREE.Vector3(1, 0, 0);
  const yAxis = new THREE.Vector3(0, 1, 0);

  return {
    group: root,
    bodyRoot,
    torsoGroup: staticBody.bodyGroup,
    wristPivot: activeArm.wristPivot,
    passiveWristPivot: passiveArm.wristPivot,
    setHandSide: applyHandSide,
    getHandSide: () => currentSide,
    getBodyInfo: () => ({
      visible: root.visible,
      torsoVisible: staticBody.bodyGroup.visible,
      passiveArmSide: passiveArm.getSide(),
      activeArmSide: activeArm.getSide(),
      beaconBandVisible: !!activeArm.beaconBandGroup?.visible,
    }),
    update(dt, {
      visible = false,
      handMode = true,
      handTracked = true,
      handSide = currentSide,
      headLook = null,
      torsoYaw = null,
      shoulderPos = null,
      elbowPos = null,
      pos = { x: 0.16, y: -0.22, z: -0.50 },
      vel = { x: 0, y: 0, z: 0 },
      qArm = [0, 0, 0, 1],
      reach = 0.25,
      elbowBendDeg = 60,
      overBin = false,
      phase = 'search',
      calmLowerProgress = 0,
      beaconActive = false,
    } = {}) {
      root.visible = visible;
      if (!visible) return;

      const safeDt = Math.min(0.1, dt || 1 / 60);
      applyHandSide(handSide);
      const s = currentSide === 'left' ? -1 : 1;

      breathPhase += safeDt * 1.45;
      const breathY = Math.sin(breathPhase) * 0.0005;

      // 1) Спокойная гравитационная ориентация туловища, брюк, ботинок и второй руки:
      //    при взгляде вперёд (pitch=0) пальто и ноги скрыты строго ниже кадра,
      //    а при наклоне головы вниз открываются шарф, лацканы, обе руки, брюки и ботинки!
      const hYaw = Number.isFinite(headLook?.yaw) ? headLook.yaw : 0;
      const hPitch = Number.isFinite(headLook?.pitch) ? headLook.pitch : 0;
      if (Number.isFinite(torsoYaw)) {
        calmTorsoYaw = torsoYaw;
      } else {
        // В режимах «Гироскоп» / «2 метки» корпус стоит абсолютно спокойно, поворачиваясь
        // лишь за естественным анатомическим пределом шеи (±50°).
        calmTorsoYaw = THREE.MathUtils.clamp(calmTorsoYaw, hYaw - 50 * DEG, hYaw + 50 * DEG);
      }

      const relHeadYaw = hYaw - calmTorsoYaw;
      qPitch.setFromAxisAngle(xAxis, -hPitch);
      qYaw.setFromAxisAngle(yAxis, relHeadYaw);
      qTorsoToCam.copy(qPitch).multiply(qYaw);

      bodyRoot.position.set(0, breathY * 0.4, 0);
      bodyRoot.quaternion.copy(qTorsoToCam);

      // Свободная вторая рука всегда спокойно лежит у кармана противоположной стороны пальто
      const passiveSide = currentSide === 'left' ? 'right' : 'left';
      poseRestingArmInTorso(passiveArm, passiveSide);

      // 2) Ведущая рука:
      //    - в режиме «Рука-браслет» (handMode = true): живая 60 Гц биомеханика с ремешком-маяком;
      //    - в режимах «Гироскоп» / «2 метки» (handMode = false) или до первого пакета браслета:
      //      спокойно лежит у своего кармана!
      if (activeArm.beaconBandGroup) {
        activeArm.beaconBandGroup.visible = !!handMode;
      }

      if (!handMode || !handTracked) {
        vShoulder.set(s * 0.196, -0.290, -0.042).applyQuaternion(qTorsoToCam);
        vElbow.set(s * 0.2335, -0.4945, -0.1170).applyQuaternion(qTorsoToCam);
        vWrist.set(s * 0.1915, -0.6310, -0.2560).applyQuaternion(qTorsoToCam);
        const qRestArr = s > 0 ? qRestRight : qRestLeft;
        qRestCam.set(qRestArr[0], qRestArr[1], qRestArr[2], qRestArr[3]).premultiply(qTorsoToCam);
        activeArm.applyJoints(vShoulder, vElbow, vWrist, qRestCam.toArray(), 46, 0, 0);
        activeArm.setFingerPose(0.50, 0.26, 0, 0, 0);
        return;
      }

      vWrist.set(pos.x, pos.y + breathY, pos.z);
      if (shoulderPos) {
        vShoulder.set(shoulderPos.x, shoulderPos.y, shoulderPos.z);
      } else {
        vShoulder.set(s * 0.196, -0.290, -0.042);
      }
      if (elbowPos) {
        vElbow.set(elbowPos.x, elbowPos.y + breathY * 0.5, elbowPos.z);
      } else {
        vElbow.set(s * 0.24, -0.44, -0.26);
      }

      const targetLagPitch = THREE.MathUtils.clamp(-vel.y * 0.08, -0.15, 0.15);
      const targetLagYaw = THREE.MathUtils.clamp(vel.x * 0.07, -0.13, 0.13);
      const lagAlpha = 1 - Math.exp(-safeDt * 16);
      lagPitch += (targetLagPitch - lagPitch) * lagAlpha;
      lagYaw += (targetLagYaw - lagYaw) * lagAlpha;

      activeArm.applyJoints(vShoulder, vElbow, vWrist, qArm, elbowBendDeg, lagPitch, lagYaw);

      let targetCurl = 0.28;
      let targetSplay = 0.58;
      let wave = 0;

      if (phase === 'search') {
        if (reach >= 0.58 && overBin) {
          targetCurl = 0.14;
          targetSplay = 1.05;
          wave = 1;
          rummagePhase += safeDt * 9.5;
        } else if (pos.y < -0.34) {
          targetCurl = 0.48;
          targetSplay = 0.32;
        } else if (pos.y > 0.10) {
          targetCurl = 0.18;
          targetSplay = 0.90;
        } else {
          targetCurl = 0.32;
          targetSplay = 0.52;
        }
      } else if (phase === 'inspect') {
        targetCurl = 0.20 + calmLowerProgress * 0.86;
        targetSplay = (1 - calmLowerProgress) * 0.78 + 0.15;
      }

      const poseAlpha = 1 - Math.exp(-safeDt * 13);
      curl += (targetCurl - curl) * poseAlpha;
      splayFactor += (targetSplay - splayFactor) * poseAlpha;
      activeArm.setFingerPose(curl, splayFactor, wave, rummagePhase, lagPitch * 0.85);

      if (calmLowerProgress > 0.05) {
        mats.pipBrassMat.emissive.setHex(0x88c470);
        mats.pipBrassMat.emissiveIntensity = 0.6 + calmLowerProgress * 0.95;
      } else if (beaconActive) {
        mats.pipBrassMat.emissive.setHex(0x6ca888);
        mats.pipBrassMat.emissiveIntensity = 0.58;
      } else {
        mats.pipBrassMat.emissive.setHex(0x6e4819);
        mats.pipBrassMat.emissiveIntensity = 0.45;
      }
      mats.ledGreenMat.color.setHex(beaconActive ? 0x00ff66 : 0x1e6b3d);
      mats.ledMagentaMat.color.setHex(beaconActive ? 0xff00aa : 0x6b1e52);
    },
    dispose() {
      for (const g of staticBody.geos) g.dispose();
      for (const tpl of sharedGeos.fingerTemplates) {
        tpl.knuckleGeo.dispose();
        tpl.p1Geo.dispose();
        tpl.pipGeo.dispose();
        tpl.p2Geo.dispose();
        tpl.dipGeo.dispose();
        tpl.p3Geo.dispose();
      }
      for (const [k, v] of Object.entries(sharedGeos)) {
        if (k !== 'fingerTemplates' && v?.dispose) v.dispose();
      }
      for (const t of Object.values(tex)) t.dispose();
      for (const m of Object.values(mats)) m.dispose();
    },
  };
}
