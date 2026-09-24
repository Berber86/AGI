// TextureGenerator.js - High-fidelity procedural textures for Bonsai 3D
import * as THREE from 'three';

export class TextureGenerator {
  constructor() {
    this.cache = new Map();
  }

  // Helper to create a canvas
  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  }

  // 1. Japanese Black Pine Bark (Кора черной сосны - грубые чешуйки и глубокие борозды)
  getPineBarkTexture() {
    if (this.cache.has('pine_bark')) return this.cache.get('pine_bark');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Base deep dark brown
    ctx.fillStyle = '#2b231d';
    ctx.fillRect(0, 0, 512, 512);

    // Fissured scaly plates
    for (let y = 0; y < 512; y += 18) {
      for (let x = 0; x < 512; x += 32) {
        const ox = (Math.random() - 0.5) * 8;
        const oy = (Math.random() - 0.5) * 6;
        const w = 28 + (Math.random() - 0.5) * 10;
        const h = 16 + (Math.random() - 0.5) * 6;

        // Bark plate shading
        const tone = 40 + Math.floor(Math.random() * 30);
        const r = tone + 10;
        const g = tone;
        const b = tone - 8;
        ctx.fillStyle = `rgb(${r},${g},${b})`;

        ctx.beginPath();
        ctx.roundRect(x + ox, y + oy, w, h, 4);
        ctx.fill();

        // Highlight top edge
        ctx.strokeStyle = `rgba(130, 105, 85, 0.4)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Shadow bottom edge
        ctx.strokeStyle = `rgba(15, 10, 8, 0.7)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy + h);
        ctx.lineTo(x + ox + w, y + oy + h);
        ctx.stroke();
      }
    }

    // Vertical fissure streaks
    for (let i = 0; i < 70; i++) {
      const vx = Math.random() * 512;
      ctx.strokeStyle = 'rgba(12, 8, 6, 0.85)';
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      let curX = vx;
      for (let vy = 0; vy < 512; vy += 25) {
        curX += (Math.random() - 0.5) * 6;
        ctx.lineTo(curX, vy);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 6);
    this.cache.set('pine_bark', texture);
    return texture;
  }

  // 2. Japanese Maple Bark (Кора клена - гладкая, благородная серо-коричневая)
  getMapleBarkTexture() {
    if (this.cache.has('maple_bark')) return this.cache.get('maple_bark');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Warm silver-grey wood base
    ctx.fillStyle = '#5c544d';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle vertical fiber striations
    for (let x = 0; x < 512; x += 2) {
      const alpha = 0.08 + Math.random() * 0.12;
      const shade = Math.random() > 0.5 ? 255 : 30;
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
      ctx.fillRect(x, 0, 1 + Math.random() * 2, 512);
    }

    // Gentle lenticel speckles
    for (let i = 0; i < 400; i++) {
      const lx = Math.random() * 512;
      const ly = Math.random() * 512;
      ctx.fillStyle = 'rgba(40, 35, 30, 0.35)';
      ctx.fillRect(lx, ly, 3 + Math.random() * 4, 1.2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 4);
    this.cache.set('maple_bark', texture);
    return texture;
  }

  // 3. Shimpaku Juniper Bark (Волокнистая красноватая кора можжевельника)
  getJuniperBarkTexture() {
    if (this.cache.has('juniper_bark')) return this.cache.get('juniper_bark');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Rich cinnamon/reddish-brown base
    ctx.fillStyle = '#4a2c1f';
    ctx.fillRect(0, 0, 512, 512);

    // Stringy fibrous peeling ribbons
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 512;
      const w = 2 + Math.random() * 4;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(125, 70, 48, 0.45)' : 'rgba(40, 20, 14, 0.6)';
      ctx.fillRect(x, 0, w, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 5);
    this.cache.set('juniper_bark', texture);
    return texture;
  }

  // 4. Deadwood Jin / Shari (Мертвая белесая древесина, отполированная веками)
  getDeadwoodTexture() {
    if (this.cache.has('deadwood')) return this.cache.get('deadwood');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Bleached bone-white wood
    ctx.fillStyle = '#e8ded4';
    ctx.fillRect(0, 0, 512, 512);

    // Fine weathered grain lines
    for (let x = 0; x < 512; x += 3) {
      const alpha = 0.05 + Math.random() * 0.1;
      ctx.fillStyle = `rgba(160, 145, 130, ${alpha})`;
      ctx.fillRect(x, 0, 1.5, 512);
    }

    // Weathered fissures
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512;
      ctx.strokeStyle = 'rgba(120, 105, 95, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let cx = x;
      for (let y = 0; y < 512; y += 30) {
        cx += (Math.random() - 0.5) * 4;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 4);
    this.cache.set('deadwood', texture);
    return texture;
  }

  // 5. Pine Needle Foliage Sprite (Хвоя черной сосны - реалистичные пучки игл)
  getPineFoliageTexture() {
    if (this.cache.has('pine_foliage')) return this.cache.get('pine_foliage');

    const { canvas, ctx } = this.createCanvas(256, 256);
    ctx.clearRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    // Draw radial needle tufts radiating outward
    const needleCount = 65;
    for (let i = 0; i < needleCount; i++) {
      const angle = (i / needleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const length = 55 + Math.random() * 55;
      const endX = cx + Math.cos(angle) * length;
      const endY = cy + Math.sin(angle) * length;

      // Color variation between deep evergreen and fresh spring tip
      const green = 65 + Math.floor(Math.random() * 45);
      const r = 25 + Math.floor(Math.random() * 20);
      ctx.strokeStyle = `rgba(${r}, ${green}, 35, 0.9)`;
      ctx.lineWidth = 1.8 + Math.random() * 1.0;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 8, cy + Math.sin(angle) * 8);
      // Slight natural needle curve
      const cpX = cx + Math.cos(angle + 0.1) * (length * 0.5);
      const cpY = cy + Math.sin(angle + 0.1) * (length * 0.5);
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.stroke();

      // Sharp lighter tip
      ctx.fillStyle = 'rgba(85, 120, 50, 0.85)';
      ctx.beginPath();
      ctx.arc(endX, endY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dense cluster core
    const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
    gradient.addColorStop(0, 'rgba(25, 55, 20, 0.95)');
    gradient.addColorStop(1, 'rgba(35, 75, 30, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('pine_foliage', texture);
    return texture;
  }

  // 6. Japanese Maple Leaf Foliage (Дланевидный лист момидзи)
  getMapleLeafTexture(colorMode = 'autumn') {
    const key = `maple_${colorMode}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(256, 256);
    ctx.clearRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 160;

    // Colors: Autumn scarlet/crimson or Summer emerald
    const isAutumn = colorMode === 'autumn';
    const baseColor = isAutumn ? '#d63031' : '#27ae60';
    const edgeColor = isAutumn ? '#e17055' : '#2ecc71';
    const centerColor = isAutumn ? '#7c1314' : '#1e824c';

    // 5 pointed maple leaf lobes
    const lobeAngles = [-0.65, -0.32, 0, 0.32, 0.65];
    const lobeLengths = [65, 85, 105, 85, 65];

    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = baseColor;
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1.5;

    // Draw five serrated lobes
    ctx.beginPath();
    ctx.moveTo(0, 0);

    lobeAngles.forEach((angle, idx) => {
      const len = lobeLengths[idx];
      const tipX = Math.sin(angle) * len;
      const tipY = -Math.cos(angle) * len;

      const sideL_X = Math.sin(angle - 0.12) * (len * 0.7);
      const sideL_Y = -Math.cos(angle - 0.12) * (len * 0.7);
      const sideR_X = Math.sin(angle + 0.12) * (len * 0.7);
      const sideR_Y = -Math.cos(angle + 0.12) * (len * 0.7);

      ctx.lineTo(sideL_X, sideL_Y);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(sideR_X, sideR_Y);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Leaf veins
    ctx.strokeStyle = isAutumn ? 'rgba(255, 215, 0, 0.45)' : 'rgba(200, 255, 180, 0.4)';
    ctx.lineWidth = 1.2;
    lobeAngles.forEach((angle, idx) => {
      const len = lobeLengths[idx];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.sin(angle) * len * 0.85, -Math.cos(angle) * len * 0.85);
      ctx.stroke();
    });

    // Stem
    ctx.strokeStyle = isAutumn ? '#8b1e0f' : '#166534';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(5, 25, 0, 50);
    ctx.stroke();

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set(key, texture);
    return texture;
  }

  // 7. Sakura Cherry Blossom Petal Sprite (Лепестки цветущей сакуры)
  getSakuraFlowerTexture() {
    if (this.cache.has('sakura_flower')) return this.cache.get('sakura_flower');

    const { canvas, ctx } = this.createCanvas(256, 256);
    ctx.clearRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    // 5 soft blush pink heart-notched petals
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Petal gradient
      const grad = ctx.createLinearGradient(0, 0, 0, -60);
      grad.addColorStop(0, 'rgba(255, 210, 225, 0.95)');
      grad.addColorStop(0.6, 'rgba(255, 235, 242, 0.9)');
      grad.addColorStop(1, 'rgba(255, 248, 250, 0.85)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-26, -22, -32, -50, -10, -60);
      ctx.lineTo(0, -54); // Notch in center of petal
      ctx.lineTo(10, -60);
      ctx.bezierCurveTo(32, -50, 26, -22, 0, 0);
      ctx.fill();

      // Subtle translucent edge stroke
      ctx.strokeStyle = 'rgba(255, 185, 205, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    // Flower center: golden stamen filaments and ruby pistil
    ctx.fillStyle = '#f39c12';
    for (let j = 0; j < 14; j++) {
      const sa = (j / 14) * Math.PI * 2;
      const slen = 16 + Math.random() * 8;
      const sx = cx + Math.cos(sa) * slen;
      const sy = cy + Math.sin(sa) * slen;

      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Deep ruby core
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('sakura_flower', texture);
    return texture;
  }

  // 8. Juniper Foliage Pad (Можжевеловые облака - плотная чешуевидная зелень)
  getJuniperFoliageTexture() {
    if (this.cache.has('juniper_foliage')) return this.cache.get('juniper_foliage');

    const { canvas, ctx } = this.createCanvas(256, 256);
    ctx.clearRect(0, 0, 256, 256);

    const cx = 128;
    const cy = 128;

    // Dense cloud-like clusters
    for (let r = 70; r > 5; r -= 10) {
      const count = Math.floor(r * 0.8);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const dist = Math.random() * r;
        const px = cx + Math.cos(a) * dist;
        const py = cy + Math.sin(a) * dist;

        const shade = 70 + Math.floor(Math.random() * 45);
        ctx.fillStyle = `rgba(28, ${shade}, 45, 0.85)`;

        ctx.beginPath();
        ctx.ellipse(px, py, 6 + Math.random() * 4, 3 + Math.random() * 3, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('juniper_foliage', texture);
    return texture;
  }

  // 9. Velvet Green Moss (Бархатистый мох кокэ - подушечки мха для почвы)
  getMossTexture() {
    if (this.cache.has('moss_texture')) return this.cache.get('moss_texture');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Deep forest green base
    ctx.fillStyle = '#225424';
    ctx.fillRect(0, 0, 512, 512);

    // Thousands of tiny moss nodules
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = 1.5 + Math.random() * 3.5;

      const green = 80 + Math.floor(Math.random() * 80);
      const yellow = 40 + Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgba(${yellow}, ${green}, 25, 0.7)`;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    this.cache.set('moss_texture', texture);
    return texture;
  }

  // 10. Akadama Granular Soil (Гранулированная глина Акадама)
  getAkadamaSoilTexture(moisture = 0.6) {
    const key = `akadama_${Math.round(moisture * 10)}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Dry soil is pale tan, wet soil is rich dark umber
    const rBase = Math.floor(65 * (1 - moisture * 0.5));
    const gBase = Math.floor(45 * (1 - moisture * 0.5));
    const bBase = Math.floor(32 * (1 - moisture * 0.5));
    ctx.fillStyle = `rgb(${rBase}, ${gBase}, ${bBase})`;
    ctx.fillRect(0, 0, 512, 512);

    // Akadama clay rounded granules
    for (let i = 0; i < 4500; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const r = 2.5 + Math.random() * 4.5;

      const delta = (Math.random() - 0.5) * 20;
      const gr = Math.max(0, Math.min(255, rBase + delta + 15));
      const gg = Math.max(0, Math.min(255, gBase + delta + 10));
      const gb = Math.max(0, Math.min(255, bBase + delta));

      ctx.fillStyle = `rgb(${gr}, ${gg}, ${gb})`;
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();

      // Top highlight if wet
      if (moisture > 0.4) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.12 * moisture})`;
        ctx.beginPath();
        ctx.arc(gx - 1, gy - 1, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    this.cache.set(key, texture);
    return texture;
  }

  // 11. Pot Glazes: Celadon Crackle (Селадон с кракелюром)
  getCeladonGlazeTexture() {
    if (this.cache.has('celadon')) return this.cache.get('celadon');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Pale jade-green celadon base
    ctx.fillStyle = '#9cb8a6';
    ctx.fillRect(0, 0, 512, 512);

    // Spiderweb crackle lines (Каннюр / Кракелюр)
    ctx.strokeStyle = 'rgba(70, 90, 80, 0.45)';
    ctx.lineWidth = 1;

    // Voronoi-like polygonal crackle cells
    const points = [];
    for (let i = 0; i < 120; i++) {
      points.push({ x: Math.random() * 512, y: Math.random() * 512 });
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 65) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('celadon', texture);
    return texture;
  }

  // 12. Tokoname Terracotta Pot Texture (Матовая токонамэ-керамика)
  getTokonamePotTexture() {
    if (this.cache.has('tokoname_pot')) return this.cache.get('tokoname_pot');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Warm unglazed iron-rich clay
    ctx.fillStyle = '#6b3f2b';
    ctx.fillRect(0, 0, 512, 512);

    // Micro specks and pottery wheel marks
    for (let y = 0; y < 512; y += 4) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(125, 75, 55, 0.15)' : 'rgba(75, 40, 25, 0.2)';
      ctx.fillRect(0, y, 512, 2);
    }

    for (let i = 0; i < 1500; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(35, 18, 12, 0.5)' : 'rgba(165, 110, 85, 0.3)';
      ctx.fillRect(px, py, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('tokoname_pot', texture);
    return texture;
  }

  // 13. Traditional Tatami Mat (Татами с плетением и зеленой каймой хери)
  getTatamiTexture() {
    if (this.cache.has('tatami')) return this.cache.get('tatami');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Natural dried igusa rush straw
    ctx.fillStyle = '#c5b88a';
    ctx.fillRect(0, 0, 512, 512);

    // Woven rush ribbing
    for (let x = 0; x < 512; x += 4) {
      ctx.fillStyle = (x % 8 === 0) ? 'rgba(150, 135, 95, 0.4)' : 'rgba(230, 215, 175, 0.3)';
      ctx.fillRect(x, 0, 2, 512);
    }

    // Horizontal weave breaks
    for (let y = 0; y < 512; y += 12) {
      ctx.fillStyle = 'rgba(120, 105, 75, 0.25)';
      ctx.fillRect(0, y, 512, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    this.cache.set('tatami', texture);
    return texture;
  }

  // 14. Polished Lacquer Wood Display Table (Лакированный столик сёку)
  getLacqueredWoodTexture() {
    if (this.cache.has('lacquer_wood')) return this.cache.get('lacquer_wood');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Deep dark cedar/hinoki lacquer
    ctx.fillStyle = '#221510';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle rich warm wood grain
    for (let y = 0; y < 512; y += 6) {
      const alpha = 0.15 + Math.random() * 0.15;
      ctx.fillStyle = `rgba(65, 35, 22, ${alpha})`;
      ctx.fillRect(0, y, 512, 3);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('lacquer_wood', texture);
    return texture;
  }

  // 15. Shoji Washi Paper (Японская бумага васи)
  getShojiPaperTexture() {
    if (this.cache.has('shoji_paper')) return this.cache.get('shoji_paper');

    const { canvas, ctx } = this.createCanvas(512, 512);

    // Soft warm translucent ivory
    ctx.fillStyle = '#f8f4ec';
    ctx.fillRect(0, 0, 512, 512);

    // Mulberry bark fibers (Кодзо)
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const len = 8 + Math.random() * 18;
      const ang = Math.random() * Math.PI;

      ctx.strokeStyle = 'rgba(180, 165, 145, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.cache.set('shoji_paper', texture);
    return texture;
  }
}

export const textureGen = new TextureGenerator();
