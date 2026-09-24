// TextureGenerator.js - AAA Procedural PBR Textures & Normal Map Synthesis
import * as THREE from 'three';

export class TextureGenerator {
  constructor() {
    this.cache = new Map();
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  }

  // Convert heightmap canvas into a tangent-space Normal Map using Sobel operator
  createNormalMapFromHeight(sourceCanvas, strength = 2.5) {
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    const sCtx = sourceCanvas.getContext('2d');
    const imgData = sCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const { canvas: nCanvas, ctx: nCtx } = this.createCanvas(w, h);
    const nImgData = nCtx.createImageData(w, h);
    const nData = nImgData.data;

    // Helper to sample height (grayscale luminosity)
    const sampleH = (x, y) => {
      const cx = (x + w) % w;
      const cy = (y + h) % h;
      const idx = (cy * w + cx) * 4;
      return (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255.0;
    };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // Sobel filter
        const tl = sampleH(x - 1, y - 1);
        const l  = sampleH(x - 1, y);
        const bl = sampleH(x - 1, y + 1);
        const t  = sampleH(x, y - 1);
        const b  = sampleH(x, y + 1);
        const tr = sampleH(x + 1, y - 1);
        const r  = sampleH(x + 1, y);
        const br = sampleH(x + 1, y + 1);

        const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
        const dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);

        let nx = -dX * strength;
        let ny = -dY * strength;
        let nz = 1.0;

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx /= len;
        ny /= len;
        nz /= len;

        const outIdx = (y * w + x) * 4;
        nData[outIdx]     = Math.floor((nx * 0.5 + 0.5) * 255);
        nData[outIdx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
        nData[outIdx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
        nData[outIdx + 3] = 255;
      }
    }

    nCtx.putImageData(nImgData, 0, 0);
    const normalTex = new THREE.CanvasTexture(nCanvas);
    normalTex.wrapS = THREE.RepeatWrapping;
    normalTex.wrapT = THREE.RepeatWrapping;
    return normalTex;
  }

  // 1. Japanese Black Pine Bark: Diffuse, Normal & Roughness Maps
  getPineBarkPBR() {
    if (this.cache.has('pine_pbr')) return this.cache.get('pine_pbr');

    const size = 1024;
    const { canvas: dCanvas, ctx: dCtx } = this.createCanvas(size, size);
    const { canvas: hCanvas, ctx: hCtx } = this.createCanvas(size, size);
    const { canvas: rCanvas, ctx: rCtx } = this.createCanvas(size, size);

    // Height base
    hCtx.fillStyle = '#444444';
    hCtx.fillRect(0, 0, size, size);

    // Diffuse base: dark charcoaly brown
    dCtx.fillStyle = '#221a14';
    dCtx.fillRect(0, 0, size, size);

    // Roughness base: mostly matte
    rCtx.fillStyle = '#cccccc';
    rCtx.fillRect(0, 0, size, size);

    // Fissured scaly pine plates
    const rows = 36;
    const cols = 22;
    const dy = size / rows;
    const dx = size / cols;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * dx + (r % 2 === 0 ? 0 : dx * 0.5);
        const y = r * dy;
        const ox = (Math.random() - 0.5) * 12;
        const oy = (Math.random() - 0.5) * 8;
        const pw = dx * (0.8 + Math.random() * 0.35);
        const ph = dy * (0.75 + Math.random() * 0.3);

        // Height: raised plate
        const plateH = 140 + Math.floor(Math.random() * 80);
        hCtx.fillStyle = `rgb(${plateH},${plateH},${plateH})`;
        hCtx.beginPath();
        hCtx.roundRect(x + ox, y + oy, pw, ph, 8);
        hCtx.fill();

        // Diffuse: plate tone
        const baseShade = 38 + Math.floor(Math.random() * 28);
        dCtx.fillStyle = `rgb(${baseShade + 12}, ${baseShade + 2}, ${baseShade - 6})`;
        dCtx.beginPath();
        dCtx.roundRect(x + ox, y + oy, pw, ph, 8);
        dCtx.fill();

        // Edge highlights on top
        dCtx.strokeStyle = 'rgba(150, 120, 95, 0.45)';
        dCtx.lineWidth = 2.5;
        dCtx.stroke();

        // Roughness: plates are slightly smoother than cracks
        rCtx.fillStyle = '#aaaaaa';
        rCtx.beginPath();
        rCtx.roundRect(x + ox, y + oy, pw, ph, 8);
        rCtx.fill();
      }
    }

    // Deep vertical cracks / fissures
    for (let i = 0; i < 90; i++) {
      let cx = Math.random() * size;
      const lw = 3 + Math.random() * 5;

      hCtx.strokeStyle = '#050505';
      hCtx.lineWidth = lw;
      hCtx.beginPath();
      hCtx.moveTo(cx, 0);

      dCtx.strokeStyle = 'rgba(10, 6, 4, 0.95)';
      dCtx.lineWidth = lw;
      dCtx.beginPath();
      dCtx.moveTo(cx, 0);

      rCtx.strokeStyle = '#ffffff';
      rCtx.lineWidth = lw;
      rCtx.beginPath();
      rCtx.moveTo(cx, 0);

      for (let cy = 0; cy < size; cy += 30) {
        cx += (Math.random() - 0.5) * 10;
        hCtx.lineTo(cx, cy);
        dCtx.lineTo(cx, cy);
        rCtx.lineTo(cx, cy);
      }
      hCtx.stroke();
      dCtx.stroke();
      rCtx.stroke();
    }

    // Lichen specks (Зеленоватые лишайники на старой коре)
    for (let l = 0; l < 400; l++) {
      const lx = Math.random() * size;
      const ly = Math.random() * size;
      const lr = 2 + Math.random() * 6;
      dCtx.fillStyle = Math.random() > 0.4 ? 'rgba(95, 115, 80, 0.35)' : 'rgba(125, 140, 100, 0.25)';
      dCtx.beginPath();
      dCtx.arc(lx, ly, lr, 0, Math.PI * 2);
      dCtx.fill();
    }

    const diffuseTex = new THREE.CanvasTexture(dCanvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;
    diffuseTex.repeat.set(2, 6);

    const normalTex = this.createNormalMapFromHeight(hCanvas, 3.2);
    normalTex.repeat.set(2, 6);

    const roughnessTex = new THREE.CanvasTexture(rCanvas);
    roughnessTex.wrapS = THREE.RepeatWrapping;
    roughnessTex.wrapT = THREE.RepeatWrapping;
    roughnessTex.repeat.set(2, 6);

    const result = { map: diffuseTex, normalMap: normalTex, roughnessMap: roughnessTex };
    this.cache.set('pine_pbr', result);
    return result;
  }

  // 2. Deadwood Jin / Shari PBR (Белесая выветренная древесина веков)
  getDeadwoodPBR() {
    if (this.cache.has('deadwood_pbr')) return this.cache.get('deadwood_pbr');

    const size = 1024;
    const { canvas: dCanvas, ctx: dCtx } = this.createCanvas(size, size);
    const { canvas: hCanvas, ctx: hCtx } = this.createCanvas(size, size);

    // Weathered bone-white driftwood
    dCtx.fillStyle = '#f0e8de';
    dCtx.fillRect(0, 0, size, size);

    hCtx.fillStyle = '#888888';
    hCtx.fillRect(0, 0, size, size);

    // Long fibrous weathered wood grain
    for (let x = 0; x < size; x += 2) {
      const alpha = 0.08 + Math.random() * 0.14;
      const shade = 160 + Math.floor(Math.random() * 40);
      dCtx.fillStyle = `rgba(${shade}, ${shade - 10}, ${shade - 20}, ${alpha})`;
      dCtx.fillRect(x, 0, 1.5, size);

      const hVal = Math.floor(128 + (Math.random() - 0.5) * 50);
      hCtx.fillStyle = `rgb(${hVal},${hVal},${hVal})`;
      hCtx.fillRect(x, 0, 1.5, size);
    }

    // Weather cracks
    for (let i = 0; i < 35; i++) {
      let cx = Math.random() * size;
      dCtx.strokeStyle = 'rgba(100, 85, 75, 0.4)';
      dCtx.lineWidth = 1.5;
      dCtx.beginPath();
      dCtx.moveTo(cx, 0);

      hCtx.strokeStyle = '#222222';
      hCtx.lineWidth = 2.0;
      hCtx.beginPath();
      hCtx.moveTo(cx, 0);

      for (let cy = 0; cy < size; cy += 40) {
        cx += (Math.random() - 0.5) * 6;
        dCtx.lineTo(cx, cy);
        hCtx.lineTo(cx, cy);
      }
      dCtx.stroke();
      hCtx.stroke();
    }

    const diffuseTex = new THREE.CanvasTexture(dCanvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;
    diffuseTex.repeat.set(1, 4);

    const normalTex = this.createNormalMapFromHeight(hCanvas, 2.2);
    normalTex.repeat.set(1, 4);

    const result = { map: diffuseTex, normalMap: normalTex };
    this.cache.set('deadwood_pbr', result);
    return result;
  }

  // 3. Celadon Crackle Glaze PBR (Селадоновый фарфор с глубоким кракелюром)
  getCeladonPBR() {
    if (this.cache.has('celadon_pbr')) return this.cache.get('celadon_pbr');

    const size = 1024;
    const { canvas: dCanvas, ctx: dCtx } = this.createCanvas(size, size);
    const { canvas: hCanvas, ctx: hCtx } = this.createCanvas(size, size);

    // Pale jade celadon glaze
    dCtx.fillStyle = '#a8c5b3';
    dCtx.fillRect(0, 0, size, size);

    hCtx.fillStyle = '#eeeeee';
    hCtx.fillRect(0, 0, size, size);

    // Delicate spiderweb crackle lines (Каннюр)
    dCtx.strokeStyle = 'rgba(45, 65, 55, 0.55)';
    dCtx.lineWidth = 1.2;

    hCtx.strokeStyle = '#333333';
    hCtx.lineWidth = 2.0;

    const crackCount = 180;
    const pts = [];
    for (let i = 0; i < crackCount; i++) {
      pts.push({ x: Math.random() * size, y: Math.random() * size });
    }

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          dCtx.beginPath();
          dCtx.moveTo(pts[i].x, pts[i].y);
          dCtx.lineTo(pts[j].x, pts[j].y);
          dCtx.stroke();

          hCtx.beginPath();
          hCtx.moveTo(pts[i].x, pts[i].y);
          hCtx.lineTo(pts[j].x, pts[j].y);
          hCtx.stroke();
        }
      }
    }

    const diffuseTex = new THREE.CanvasTexture(dCanvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;

    const normalTex = this.createNormalMapFromHeight(hCanvas, 2.8);

    const result = { map: diffuseTex, normalMap: normalTex };
    this.cache.set('celadon_pbr', result);
    return result;
  }

  // 4. Akadama Clay Soil PBR (Гранулированная глина Акадама с нормалями)
  getAkadamaSoilPBR(moisture = 0.65) {
    const key = `akadama_pbr_${Math.round(moisture * 10)}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const size = 1024;
    const { canvas: dCanvas, ctx: dCtx } = this.createCanvas(size, size);
    const { canvas: hCanvas, ctx: hCtx } = this.createCanvas(size, size);
    const { canvas: rCanvas, ctx: rCtx } = this.createCanvas(size, size);

    // Soil base color (dry is pale ochre, wet is rich dark umber)
    const rBase = Math.floor(65 * (1 - moisture * 0.45));
    const gBase = Math.floor(45 * (1 - moisture * 0.45));
    const bBase = Math.floor(30 * (1 - moisture * 0.45));

    dCtx.fillStyle = `rgb(${rBase}, ${gBase}, ${bBase})`;
    dCtx.fillRect(0, 0, size, size);

    hCtx.fillStyle = '#444444';
    hCtx.fillRect(0, 0, size, size);

    // Roughness: wet soil is much glossier
    const rVal = Math.floor(220 - moisture * 140);
    rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
    rCtx.fillRect(0, 0, size, size);

    // 8000 rounded granular pellets
    for (let i = 0; i < 8000; i++) {
      const gx = Math.random() * size;
      const gy = Math.random() * size;
      const gr = 3.0 + Math.random() * 6.5;

      // Height pellet dome
      const gradH = hCtx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      gradH.addColorStop(0, '#ffffff');
      gradH.addColorStop(0.8, '#888888');
      gradH.addColorStop(1, '#222222');
      hCtx.fillStyle = gradH;
      hCtx.beginPath();
      hCtx.arc(gx, gy, gr, 0, Math.PI * 2);
      hCtx.fill();

      // Diffuse pellet
      const dVar = (Math.random() - 0.5) * 26;
      const pr = Math.max(0, Math.min(255, rBase + dVar + 14));
      const pg = Math.max(0, Math.min(255, gBase + dVar + 10));
      const pb = Math.max(0, Math.min(255, bBase + dVar + 4));

      dCtx.fillStyle = `rgb(${pr}, ${pg}, ${pb})`;
      dCtx.beginPath();
      dCtx.arc(gx, gy, gr, 0, Math.PI * 2);
      dCtx.fill();
    }

    const diffuseTex = new THREE.CanvasTexture(dCanvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;
    diffuseTex.repeat.set(3, 3);

    const normalTex = this.createNormalMapFromHeight(hCanvas, 3.5);
    normalTex.repeat.set(3, 3);

    const roughnessTex = new THREE.CanvasTexture(rCanvas);
    roughnessTex.wrapS = THREE.RepeatWrapping;
    roughnessTex.wrapT = THREE.RepeatWrapping;
    roughnessTex.repeat.set(3, 3);

    const result = { map: diffuseTex, normalMap: normalTex, roughnessMap: roughnessTex };
    this.cache.set(key, result);
    return result;
  }

  // 5. Velvet Green Moss PBR (Бархатистый мох Кокэ)
  getMossPBR() {
    if (this.cache.has('moss_pbr')) return this.cache.get('moss_pbr');

    const size = 1024;
    const { canvas: dCanvas, ctx: dCtx } = this.createCanvas(size, size);
    const { canvas: hCanvas, ctx: hCtx } = this.createCanvas(size, size);

    // Emerald moss base
    dCtx.fillStyle = '#1e5223';
    dCtx.fillRect(0, 0, size, size);

    hCtx.fillStyle = '#555555';
    hCtx.fillRect(0, 0, size, size);

    // Micro moss nodules
    for (let i = 0; i < 14000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 2.0 + Math.random() * 4.5;

      const g = 80 + Math.floor(Math.random() * 95);
      const yl = 40 + Math.floor(Math.random() * 50);
      dCtx.fillStyle = `rgba(${yl}, ${g}, 30, 0.75)`;
      dCtx.beginPath();
      dCtx.arc(x, y, r, 0, Math.PI * 2);
      dCtx.fill();

      hCtx.fillStyle = Math.random() > 0.5 ? '#dddddd' : '#777777';
      hCtx.beginPath();
      hCtx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      hCtx.fill();
    }

    const diffuseTex = new THREE.CanvasTexture(dCanvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;
    diffuseTex.repeat.set(4, 4);

    const normalTex = this.createNormalMapFromHeight(hCanvas, 3.0);
    normalTex.repeat.set(4, 4);

    const result = { map: diffuseTex, normalMap: normalTex };
    this.cache.set('moss_pbr', result);
    return result;
  }

  // 6. Realistic Multi-Cluster Pine Needles Sprite (Хвоя)
  getPineFoliageTexture() {
    if (this.cache.has('pine_foliage_hd')) return this.cache.get('pine_foliage_hd');

    const size = 512;
    const { canvas, ctx } = this.createCanvas(size, size);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    // Draw realistic paired pine needles with needle sheath (фасцикула)
    const clusters = 14;
    for (let c = 0; c < clusters; c++) {
      const cAngle = (c / clusters) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const cDist = 20 + Math.random() * 70;
      const baseX = cx + Math.cos(cAngle) * cDist;
      const baseY = cy + Math.sin(cAngle) * cDist;

      // Brown basal sheath
      ctx.fillStyle = '#4a3319';
      ctx.beginPath();
      ctx.arc(baseX, baseY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Radiate 6-8 paired needles from each cluster
      const needleCount = 8;
      for (let n = 0; n < needleCount; n++) {
        const nAngle = cAngle + (n / needleCount - 0.5) * 1.6 + (Math.random() - 0.5) * 0.2;
        const nLen = 65 + Math.random() * 75;
        const endX = baseX + Math.cos(nAngle) * nLen;
        const endY = baseY + Math.sin(nAngle) * nLen;

        // Needle gradient from deep pine green to fresh sunlit apex
        const nGrad = ctx.createLinearGradient(baseX, baseY, endX, endY);
        nGrad.addColorStop(0, 'rgba(25, 60, 25, 0.95)');
        nGrad.addColorStop(0.7, 'rgba(40, 105, 45, 0.9)');
        nGrad.addColorStop(1, 'rgba(95, 155, 60, 0.85)');

        ctx.strokeStyle = nGrad;
        ctx.lineWidth = 2.2 + Math.random() * 0.8;

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        const cpX = baseX + Math.cos(nAngle + 0.08) * (nLen * 0.5);
        const cpY = baseY + Math.sin(nAngle + 0.08) * (nLen * 0.5);
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();

        // Tip shine
        ctx.fillStyle = 'rgba(175, 220, 110, 0.8)';
        ctx.beginPath();
        ctx.arc(endX, endY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dense central cluster
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
    coreGrad.addColorStop(0, 'rgba(20, 50, 20, 0.95)');
    coreGrad.addColorStop(1, 'rgba(25, 65, 25, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('pine_foliage_hd', texture);
    return texture;
  }

  // 7. Japanese Maple Leaf HD
  getMapleLeafTexture(colorMode = 'autumn') {
    const key = `maple_hd_${colorMode}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const size = 512;
    const { canvas, ctx } = this.createCanvas(size, size);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size * 0.65;

    const isAutumn = colorMode === 'autumn';
    const baseColor = isAutumn ? '#c0292b' : '#229954';
    const highlightColor = isAutumn ? '#e67e22' : '#2ecc71';

    const lobeAngles = [-0.68, -0.34, 0, 0.34, 0.68];
    const lobeLengths = [130, 175, 220, 175, 130];

    ctx.save();
    ctx.translate(cx, cy);

    // Leaf silhouette with serrated edges
    ctx.beginPath();
    ctx.moveTo(0, 0);

    lobeAngles.forEach((ang, i) => {
      const len = lobeLengths[i];
      const tipX = Math.sin(ang) * len;
      const tipY = -Math.cos(ang) * len;

      const sL_X = Math.sin(ang - 0.12) * (len * 0.72);
      const sL_Y = -Math.cos(ang - 0.12) * (len * 0.72);
      const sR_X = Math.sin(ang + 0.12) * (len * 0.72);
      const sR_Y = -Math.cos(ang + 0.12) * (len * 0.72);

      ctx.lineTo(sL_X, sL_Y);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(sR_X, sR_Y);
    });

    ctx.closePath();

    // Rich gradient fill
    const grad = ctx.createRadialGradient(0, -100, 20, 0, -100, 240);
    grad.addColorStop(0, highlightColor);
    grad.addColorStop(0.7, baseColor);
    grad.addColorStop(1, isAutumn ? '#6b1111' : '#145a32');

    ctx.fillStyle = grad;
    ctx.fill();

    // Golden / light veins
    ctx.strokeStyle = isAutumn ? 'rgba(255, 230, 150, 0.55)' : 'rgba(210, 255, 180, 0.55)';
    ctx.lineWidth = 2.2;
    lobeAngles.forEach((ang, i) => {
      const len = lobeLengths[i];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.sin(ang) * len * 0.88, -Math.cos(ang) * len * 0.88);
      ctx.stroke();
    });

    // Petiole stem
    ctx.strokeStyle = isAutumn ? '#7a1910' : '#196f3d';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, 50, 0, 90);
    ctx.stroke();

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // 8. Sakura Cherry Blossom Petal HD
  getSakuraFlowerTexture() {
    if (this.cache.has('sakura_flower_hd')) return this.cache.get('sakura_flower_hd');

    const size = 512;
    const { canvas, ctx } = this.createCanvas(size, size);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    // 5 delicate petals
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      const grad = ctx.createLinearGradient(0, 0, 0, -120);
      grad.addColorStop(0, 'rgba(255, 205, 222, 0.98)');
      grad.addColorStop(0.65, 'rgba(255, 238, 245, 0.92)');
      grad.addColorStop(1, 'rgba(255, 252, 253, 0.88)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-55, -45, -65, -100, -22, -125);
      ctx.lineTo(0, -112); // Petal notch
      ctx.lineTo(22, -125);
      ctx.bezierCurveTo(65, -100, 55, -45, 0, 0);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 175, 198, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // Pistils and golden stamens
    for (let j = 0; j < 20; j++) {
      const sa = (j / 20) * Math.PI * 2;
      const slen = 30 + Math.random() * 18;
      const sx = cx + Math.cos(sa) * slen;
      const sy = cy + Math.sin(sa) * slen;

      ctx.strokeStyle = '#f39c12';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ruby center
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('sakura_flower_hd', texture);
    return texture;
  }

  // 9. Juniper Foliage Pad HD
  getJuniperFoliageTexture() {
    if (this.cache.has('juniper_foliage_hd')) return this.cache.get('juniper_foliage_hd');

    const size = 512;
    const { canvas, ctx } = this.createCanvas(size, size);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    for (let r = 140; r > 10; r -= 15) {
      const count = Math.floor(r * 1.2);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * r;
        const px = cx + Math.cos(a) * d;
        const py = cy + Math.sin(a) * d;

        const shade = 65 + Math.floor(Math.random() * 60);
        ctx.fillStyle = `rgba(22, ${shade}, 45, 0.88)`;
        ctx.beginPath();
        ctx.ellipse(px, py, 12 + Math.random() * 8, 6 + Math.random() * 5, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('juniper_foliage_hd', texture);
    return texture;
  }

  // 10. Tatami Rush Straw HD
  getTatamiTexture() {
    if (this.cache.has('tatami_hd')) return this.cache.get('tatami_hd');

    const size = 1024;
    const { canvas, ctx } = this.createCanvas(size, size);

    // Natural dried igusa rush
    ctx.fillStyle = '#c4b685';
    ctx.fillRect(0, 0, size, size);

    // Vertical rush ribs
    for (let x = 0; x < size; x += 4) {
      ctx.fillStyle = (x % 8 === 0) ? 'rgba(140, 125, 85, 0.45)' : 'rgba(235, 222, 185, 0.35)';
      ctx.fillRect(x, 0, 2, size);
    }

    // Horizontal weave breaks
    for (let y = 0; y < size; y += 16) {
      ctx.fillStyle = 'rgba(100, 85, 60, 0.3)';
      ctx.fillRect(0, y, size, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    this.cache.set('tatami_hd', texture);
    return texture;
  }

  // 11. Urushi Lacquer Wood Display Table (Традиционный японский лак уруси)
  getLacqueredWoodPBR() {
    if (this.cache.has('lacquer_pbr')) return this.cache.get('lacquer_pbr');

    const size = 1024;
    const { canvas: dCanvas, ctx: dCtx } = this.createCanvas(size, size);

    // Deep luminous black-red Urushi lacquer (Кэйдзи / Нури)
    dCtx.fillStyle = '#180e0a';
    dCtx.fillRect(0, 0, size, size);

    // Subtle grain ribbons of Japanese cedar / hinoki
    for (let y = 0; y < size; y += 8) {
      const alpha = 0.12 + Math.random() * 0.16;
      dCtx.fillStyle = `rgba(75, 30, 18, ${alpha})`;
      dCtx.fillRect(0, y, size, 4);
    }

    const diffuseTex = new THREE.CanvasTexture(dCanvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;

    const result = { map: diffuseTex };
    this.cache.set('lacquer_pbr', result);
    return result;
  }

  // 12. Shoji Mulberry Washi Paper HD (Васи)
  getShojiPaperTexture() {
    if (this.cache.has('shoji_hd')) return this.cache.get('shoji_hd');

    const size = 1024;
    const { canvas, ctx } = this.createCanvas(size, size);

    ctx.fillStyle = '#faf6ed';
    ctx.fillRect(0, 0, size, size);

    // Natural mulberry kozo fibers
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const len = 12 + Math.random() * 26;
      const ang = Math.random() * Math.PI;

      ctx.strokeStyle = 'rgba(170, 150, 130, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('shoji_hd', texture);
    return texture;
  }
}

export const textureGen = new TextureGenerator();
