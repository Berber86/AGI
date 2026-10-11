import Phaser from 'phaser';
import { COLORS, ROAD, VIEW } from './layout';
import { CAR_COLORS, FLAGS, type Theme } from '../sim/config';

type Ctx = CanvasRenderingContext2D;

const ROAD_TILE_W = ROAD.laneWidth * 3 + ROAD.shoulder * 2;
const ROAD_TILE_H = 560;
const GRASS_TILE = 512;

function css(color: number, alpha = 1): string {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shade(color: number, amount: number): number {
  const r = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (color & 0xff) + amount));
  return (r << 16) | (g << 8) | b;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function circle(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
}

function makeTexture(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  draw: (ctx: Ctx, w: number, h: number) => void,
): string {
  if (scene.textures.exists(key)) return key;
  const texture = scene.textures.createCanvas(key, w, h);
  if (!texture) return key;
  const ctx = texture.getContext();
  ctx.save();
  draw(ctx, w, h);
  ctx.restore();
  texture.refresh();
  return key;
}

const THEME_PALETTE: Record<Theme, { grass: number; grassAlt: number; dirt: number; asphalt: number }> = {
  meadow: { grass: 0x9fdc83, grassAlt: 0x8fd074, dirt: 0xd8c08a, asphalt: 0x9aa2b0 },
  river: { grass: 0xa9dfa0, grassAlt: 0x93d18c, dirt: 0xe0cfa0, asphalt: 0x94a0ae },
  city: { grass: 0xb6d6a2, grassAlt: 0xa4c98f, dirt: 0xd9cba8, asphalt: 0xa9aab4 },
};

function grassTexture(scene: Phaser.Scene, theme: Theme): string {
  const key = `grass-${theme}`;
  const palette = THEME_PALETTE[theme];
  return makeTexture(scene, key, GRASS_TILE, GRASS_TILE, (ctx, w, h) => {
    ctx.fillStyle = css(palette.grass);
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = css(palette.grassAlt, 0.45);
    for (let i = 0; i < 22; i += 1) {
      const x = ((i * 149) % (w - 80)) + 40;
      const y = ((i * 233) % (h - 80)) + 40;
      ctx.beginPath();
      ctx.ellipse(x, y, 62, 34, (i % 7) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const flowerColors = [0xfff3f8, 0xffe9a8, 0xffc7dd];
    for (let i = 0; i < 16; i += 1) {
      const x = ((i * 97) % (w - 80)) + 40;
      const y = ((i * 173) % (h - 80)) + 40;
      ctx.fillStyle = css(flowerColors[i % flowerColors.length], 0.95);
      for (let p = 0; p < 5; p += 1) {
        const a = (p / 5) * Math.PI * 2;
        circle(ctx, x + Math.cos(a) * 7, y + Math.sin(a) * 7, 5);
        ctx.fill();
      }
      ctx.fillStyle = css(0xffd166);
      circle(ctx, x, y, 4);
      ctx.fill();
    }
  });
}

function roadTexture(scene: Phaser.Scene, theme: Theme): string {
  const key = `road-${theme}`;
  const palette = THEME_PALETTE[theme];
  return makeTexture(scene, key, ROAD_TILE_W, ROAD_TILE_H, (ctx, w, h) => {
    const shoulder = ROAD.shoulder;
    const roadX = shoulder;
    const roadW = w - shoulder * 2;

    // Grass base, then dirt shoulders, then asphalt.
    ctx.fillStyle = css(palette.grass);
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = css(palette.dirt);
    ctx.fillRect(roadX - shoulder, 0, shoulder, h);
    ctx.fillRect(roadX + roadW, 0, shoulder, h);

    const gradient = ctx.createLinearGradient(roadX, 0, roadX + roadW, 0);
    gradient.addColorStop(0, css(shade(palette.asphalt, -14)));
    gradient.addColorStop(0.5, css(shade(palette.asphalt, 10)));
    gradient.addColorStop(1, css(shade(palette.asphalt, -14)));
    ctx.fillStyle = gradient;
    ctx.fillRect(roadX, 0, roadW, h);

    ctx.fillStyle = css(0xffffff, 0.05);
    for (let i = 0; i < 90; i += 1) {
      const x = roadX + ((i * 61) % (roadW - 20)) + 10;
      const y = ((i * 131) % (h - 10)) + 5;
      ctx.beginPath();
      ctx.ellipse(x, y, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Solid edge lines.
    ctx.fillStyle = css(COLORS.line, 0.92);
    ctx.fillRect(roadX + 12, 0, 10, h);
    ctx.fillRect(roadX + roadW - 22, 0, 10, h);

    // Dashed lane separators (period 140 divides the tile height evenly).
    const dashY = 60;
    const period = 140;
    for (let y = 0; y < h; y += period) {
      for (const lane of [1, 2]) {
        const x = roadX + lane * ROAD.laneWidth - 5;
        ctx.fillStyle = css(COLORS.line, 0.85);
        roundRect(ctx, x, y + 30, 10, dashY, 5);
        ctx.fill();
      }
    }
  });
}

function carShadow(ctx: Ctx, w: number, h: number, pad = 14): void {
  ctx.fillStyle = 'rgba(61, 43, 31, 0.18)';
  roundRect(ctx, pad, pad + 10, w - pad * 2, h - pad * 2, 40);
  ctx.fill();
}

function wheels(ctx: Ctx, w: number, h: number, color = 0x3f3a44): void {
  ctx.fillStyle = css(color);
  const wheelW = w * 0.16;
  const wheelH = h * 0.2;
  roundRect(ctx, -wheelW * 0.25, h * 0.16, wheelW, wheelH, wheelW * 0.4);
  ctx.fill();
  roundRect(ctx, w - wheelW * 0.75, h * 0.16, wheelW, wheelH, wheelW * 0.4);
  ctx.fill();
  roundRect(ctx, -wheelW * 0.25, h * 0.62, wheelW, wheelH, wheelW * 0.4);
  ctx.fill();
  roundRect(ctx, w - wheelW * 0.75, h * 0.62, wheelW, wheelH, wheelW * 0.4);
  ctx.fill();
}

function friendlyFace(ctx: Ctx, cx: number, cy: number, scale = 1, ink = 0x4a3b30): void {
  ctx.fillStyle = css(ink, 0.85);
  circle(ctx, cx - 16 * scale, cy, 7 * scale);
  ctx.fill();
  circle(ctx, cx + 16 * scale, cy, 7 * scale);
  ctx.fill();
  ctx.strokeStyle = css(ink, 0.8);
  ctx.lineWidth = 5 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy + 8 * scale, 16 * scale, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

export function heroCarKey(scene: Phaser.Scene, colorId: string, flagId: string, stickerId: string): string {
  const color = CAR_COLORS.find((item) => item.id === colorId) ?? CAR_COLORS[0];
  const flag = FLAGS.find((item) => item.id === flagId) ?? FLAGS[0];
  const key = `hero-${color.id}-${flag.id}-${stickerId}`;
  const w = 150;
  const h = 250;
  return makeTexture(scene, key, w, h, (ctx) => {
    carShadow(ctx, w, h, 10);
    wheels(ctx, w, h);

    const bodyX = w * 0.18;
    const bodyW = w * 0.64;
    ctx.fillStyle = css(color.dark);
    roundRect(ctx, bodyX - 4, h * 0.04, bodyW + 8, h * 0.92, 44);
    ctx.fill();
    ctx.fillStyle = css(color.body);
    roundRect(ctx, bodyX, h * 0.06, bodyW, h * 0.88, 40);
    ctx.fill();

    ctx.fillStyle = css(shade(color.body, 26), 0.9);
    roundRect(ctx, bodyX + 8, h * 0.08, bodyW - 16, h * 0.22, 28);
    ctx.fill();

    // Windshield and cockpit.
    ctx.fillStyle = 'rgba(206, 240, 255, 0.95)';
    roundRect(ctx, bodyX + 10, h * 0.3, bodyW - 20, h * 0.2, 26);
    ctx.fill();
    ctx.fillStyle = css(0xfdf0e0, 0.9);
    roundRect(ctx, bodyX + 14, h * 0.54, bodyW - 28, h * 0.18, 22);
    ctx.fill();

    // Sticker on the hood.
    ctx.save();
    ctx.translate(w / 2, h * 0.2);
    const size = 20;
    ctx.fillStyle = css(0xffffff, 0.92);
    if (stickerId === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.8);
      ctx.bezierCurveTo(-size * 1.5, -size * 0.3, -size * 0.5, -size * 1.4, 0, -size * 0.5);
      ctx.bezierCurveTo(size * 0.5, -size * 1.4, size * 1.5, -size * 0.3, 0, size * 0.8);
      ctx.fill();
    } else if (stickerId === 'flower') {
      for (let p = 0; p < 5; p += 1) {
        const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
        circle(ctx, Math.cos(a) * 11, Math.sin(a) * 11, 9);
        ctx.fill();
      }
      ctx.fillStyle = css(0xffd166);
      circle(ctx, 0, 0, 7);
      ctx.fill();
    } else {
      const spikes = 5;
      ctx.beginPath();
      for (let p = 0; p < spikes * 2; p += 1) {
        const radius = p % 2 === 0 ? 22 : 10;
        const a = (p / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Antenna with the chosen pennant.
    ctx.strokeStyle = css(0x6b5a4a, 0.85);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(w - bodyX - 6, h * 0.12);
    ctx.lineTo(w - bodyX - 10, -2);
    ctx.stroke();
    ctx.fillStyle = css(flag.color);
    ctx.beginPath();
    ctx.moveTo(w - bodyX - 10, -2);
    ctx.lineTo(w - bodyX + 44, 12);
    ctx.lineTo(w - bodyX - 10, 26);
    ctx.closePath();
    ctx.fill();

    friendlyFace(ctx, w / 2, h * 0.09, 1.05);
  });
}

export function rivalCarKey(scene: Phaser.Scene, index: number): string {
  const key = `rival-${index}`;
  const w = 150;
  const h = 250;
  const bodies = [0xf4846f, 0xffd166, 0x8fb8f0];
  const body = bodies[index % bodies.length];
  return makeTexture(scene, key, w, h, (ctx) => {
    carShadow(ctx, w, h, 10);
    wheels(ctx, w, h, 0x4a4450);
    const bodyX = w * 0.18;
    const bodyW = w * 0.64;
    ctx.fillStyle = css(shade(body, -38));
    roundRect(ctx, bodyX - 4, h * 0.04, bodyW + 8, h * 0.92, 42);
    ctx.fill();
    ctx.fillStyle = css(body);
    roundRect(ctx, bodyX, h * 0.06, bodyW, h * 0.88, 38);
    ctx.fill();

    ctx.fillStyle = 'rgba(206, 240, 255, 0.92)';
    roundRect(ctx, bodyX + 10, h * 0.26, bodyW - 20, h * 0.2, 24);
    ctx.fill();
    ctx.fillStyle = css(0xfdf0e0, 0.9);
    roundRect(ctx, bodyX + 14, h * 0.5, bodyW - 28, h * 0.2, 22);
    ctx.fill();

    // Cute animal heads seen from above.
    const headX = w / 2;
    const headY = h * 0.16;
    ctx.fillStyle = css(0xf7e0c8);
    circle(ctx, headX, headY, 34);
    ctx.fill();
    if (index === 0) {
      ctx.fillStyle = css(0xf2c9a0);
      circle(ctx, headX - 30, headY - 22, 14);
      ctx.fill();
      circle(ctx, headX + 30, headY - 22, 14);
      ctx.fill();
      ctx.fillStyle = css(0xff8f6b);
      roundRect(ctx, headX - 38, headY - 30, 76, 20, 10);
      ctx.fill();
    } else if (index === 1) {
      ctx.fillStyle = css(0x6b4a34);
      circle(ctx, headX - 34, headY + 6, 16);
      ctx.fill();
      circle(ctx, headX + 34, headY + 6, 16);
      ctx.fill();
      ctx.fillStyle = css(0xffd166);
      circle(ctx, headX, headY - 12, 8);
      ctx.fill();
    } else {
      ctx.fillStyle = css(0xd9b48a);
      ctx.beginPath();
      ctx.moveTo(headX - 30, headY - 20);
      ctx.lineTo(headX - 10, headY - 48);
      ctx.lineTo(headX + 6, headY - 16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(headX + 30, headY - 20);
      ctx.lineTo(headX + 10, headY - 48);
      ctx.lineTo(headX - 6, headY - 16);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function treeTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'tree', 280, 320, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(61, 43, 31, 0.16)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 26, 80, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0x9a6b4a);
    roundRect(ctx, w / 2 - 20, h - 110, 40, 100, 16);
    ctx.fill();
    const greens = [0x6fbf5e, 0x7fcf6b, 0x8fdc78];
    const spots: Array<[number, number, number]> = [
      [w / 2, h * 0.36, 92],
      [w / 2 - 62, h * 0.5, 62],
      [w / 2 + 62, h * 0.5, 62],
      [w / 2, h * 0.62, 70],
    ];
    spots.forEach(([x, y, r], i) => {
      ctx.fillStyle = css(greens[i % greens.length]);
      circle(ctx, x, y, r);
      ctx.fill();
    });
    ctx.fillStyle = css(0xfff3f8, 0.7);
    circle(ctx, w / 2 - 30, h * 0.3, 12);
    ctx.fill();
  });
}

function bushTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'bush', 200, 140, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(61, 43, 31, 0.14)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 18, 70, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0x7ecc6a);
    circle(ctx, w * 0.34, h * 0.62, 48);
    ctx.fill();
    circle(ctx, w * 0.66, h * 0.62, 48);
    ctx.fill();
    ctx.fillStyle = css(0x8fdc78);
    circle(ctx, w * 0.5, h * 0.42, 52);
    ctx.fill();
    ctx.fillStyle = css(0xff9ec4, 0.9);
    circle(ctx, w * 0.42, h * 0.4, 7);
    ctx.fill();
    circle(ctx, w * 0.62, h * 0.55, 7);
    ctx.fill();
  });
}

function flowerTexture(scene: Phaser.Scene, key: string, petal: number): string {
  return makeTexture(scene, key, 70, 90, (ctx, w, h) => {
    ctx.fillStyle = css(0x6fbf5e);
    ctx.fillRect(w / 2 - 4, h * 0.45, 8, h * 0.5);
    ctx.fillStyle = css(petal);
    for (let p = 0; p < 6; p += 1) {
      const a = (p / 6) * Math.PI * 2;
      circle(ctx, w / 2 + Math.cos(a) * 15, h * 0.36 + Math.sin(a) * 15, 11);
      ctx.fill();
    }
    ctx.fillStyle = css(0xffd166);
    circle(ctx, w / 2, h * 0.36, 10);
    ctx.fill();
  });
}

function balloonTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'balloon', 110, 150, (ctx, w, h) => {
    ctx.strokeStyle = css(0x8a7a6a, 0.8);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.72);
    ctx.quadraticCurveTo(w / 2 + 12, h * 0.86, w / 2 - 6, h - 6);
    ctx.stroke();
    const gradient = ctx.createRadialGradient(w * 0.4, h * 0.3, 8, w / 2, h * 0.42, 62);
    gradient.addColorStop(0, css(0xfff0f6));
    gradient.addColorStop(0.5, css(0xff9ec4));
    gradient.addColorStop(1, css(0xe06699));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.4, 46, 54, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.6);
    circle(ctx, w * 0.36, h * 0.28, 12);
    ctx.fill();
  });
}

function puddleTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'puddle', 230, 150, (ctx, w, h) => {
    ctx.fillStyle = css(0x8fd0f5, 0.85);
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 96, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xcdeeff, 0.9);
    ctx.beginPath();
    ctx.ellipse(w / 2 - 16, h / 2 - 12, 40, 22, -0.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function moundTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'mound', 210, 140, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(61, 43, 31, 0.14)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 20, 78, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0x86cf72);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.66, 84, 48, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 84, h * 0.62, 168, 20);
    ctx.fillStyle = css(0x8fdc78);
    ctx.beginPath();
    ctx.ellipse(w / 2 - 10, h * 0.6, 60, 34, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xfff3f8);
    circle(ctx, w * 0.42, h * 0.46, 10);
    ctx.fill();
    ctx.fillStyle = css(0xffd166);
    circle(ctx, w * 0.42, h * 0.46, 5);
    ctx.fill();
  });
}

function bannerTexture(scene: Phaser.Scene): string {
  const w = ROAD_TILE_W;
  const h = 170;
  return makeTexture(scene, 'banner', w, h, (ctx) => {
    ctx.fillStyle = css(0xe8e2d4);
    roundRect(ctx, 20, 10, 26, h - 20, 12);
    ctx.fill();
    roundRect(ctx, w - 46, 10, 26, h - 20, 12);
    ctx.fill();
    const check = 26;
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < Math.ceil((w - 90) / check); col += 1) {
        ctx.fillStyle = (row + col) % 2 === 0 ? css(0xffffff) : css(0x3d3d4a);
        ctx.fillRect(46 + col * check, 26 + row * check, check, check);
      }
    }
    ctx.fillStyle = css(0x3d3d4a, 0.2);
    ctx.fillRect(46, 26 + 4 * check, w - 92, 6);
  });
}

function ribbonTexture(scene: Phaser.Scene): string {
  const w = ROAD_TILE_W;
  const h = 64;
  return makeTexture(scene, 'ribbon', w, h, (ctx) => {
    ctx.fillStyle = css(0xff7fa8);
    roundRect(ctx, 0, 6, w, h - 12, 12);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.9);
    for (let i = 0; i < 14; i += 1) {
      ctx.fillRect(20 + i * 52, 16, 24, h - 32);
    }
  });
}

function cupTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'cup', 240, 260, (ctx, w, h) => {
    ctx.fillStyle = css(0xffd166);
    ctx.beginPath();
    ctx.moveTo(w * 0.28, h * 0.2);
    ctx.lineTo(w * 0.72, h * 0.2);
    ctx.lineTo(w * 0.62, h * 0.66);
    ctx.lineTo(w * 0.38, h * 0.66);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffe6a8);
    ctx.fillRect(w * 0.28, h * 0.2, w * 0.44, 14);
    ctx.fillStyle = css(0xe0a92c);
    ctx.fillRect(w * 0.44, h * 0.66, w * 0.12, 30);
    roundRect(ctx, w * 0.26, h * 0.78, w * 0.48, 26, 12);
    ctx.fill();
    ctx.strokeStyle = css(0xe0a92c);
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w * 0.2, h * 0.34, 26, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.34, 26, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = css(0xff9ec4);
    circle(ctx, w / 2, h * 0.42, 22);
    ctx.fill();
  });
}

function medalTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'medal', 160, 200, (ctx, w, h) => {
    ctx.fillStyle = css(0x8fd0f5);
    ctx.beginPath();
    ctx.moveTo(w * 0.3, 0);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.2, h * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xff7fa8);
    ctx.beginPath();
    ctx.moveTo(w * 0.7, 0);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.8, h * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffd166);
    circle(ctx, w / 2, h * 0.68, 54);
    ctx.fill();
    ctx.fillStyle = css(0xffe6a8);
    circle(ctx, w / 2, h * 0.68, 40);
    ctx.fill();
    ctx.fillStyle = css(0xe0a92c);
    circle(ctx, w / 2, h * 0.68, 14);
    ctx.fill();
  });
}

function starTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'star', 140, 140, (ctx, w, h) => {
    ctx.fillStyle = css(0xffd166);
    ctx.strokeStyle = css(0xe0a92c);
    ctx.lineWidth = 8;
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? 62 : 28;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(w / 2 + Math.cos(a) * radius, h / 2 + Math.sin(a) * radius);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

function heartTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'heart', 140, 130, (ctx, w, h) => {
    ctx.fillStyle = css(0xff7fa8);
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.92);
    ctx.bezierCurveTo(w * -0.1, h * 0.42, w * 0.2, h * -0.1, w / 2, h * 0.32);
    ctx.bezierCurveTo(w * 0.8, h * -0.1, w * 1.1, h * 0.42, w / 2, h * 0.92);
    ctx.fill();
  });
}

function confettiTextures(scene: Phaser.Scene): void {
  const colors = [0xff9ec4, 0xffd166, 0x8fd0f5, 0xb388ff, 0x7ed957];
  colors.forEach((color, index) => {
    makeTexture(scene, `confetti-${index}`, 34, 34, (ctx, w, h) => {
      ctx.fillStyle = css(color);
      roundRect(ctx, 2, 6, w - 4, h - 12, 8);
      ctx.fill();
    });
    makeTexture(scene, `sparkle-${index}`, 60, 60, (ctx, w, h) => {
      ctx.fillStyle = css(color);
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const radius = i % 2 === 0 ? 26 : 9;
        const a = (i / 8) * Math.PI * 2;
        ctx.lineTo(w / 2 + Math.cos(a) * radius, h / 2 + Math.sin(a) * radius);
      }
      ctx.closePath();
      ctx.fill();
    });
  });
}

function uiTextures(scene: Phaser.Scene): void {
  makeTexture(scene, 'btn-steer', 300, 300, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
    roundRect(ctx, 0, 0, w, h, 70);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 10;
    roundRect(ctx, 8, 8, w - 16, h - 16, 62);
    ctx.stroke();
  });

  makeTexture(scene, 'arrow', 150, 150, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.5);
    ctx.lineTo(w * 0.62, h * 0.16);
    ctx.lineTo(w * 0.62, h * 0.36);
    ctx.lineTo(w * 0.86, h * 0.36);
    ctx.lineTo(w * 0.86, h * 0.64);
    ctx.lineTo(w * 0.62, h * 0.64);
    ctx.lineTo(w * 0.62, h * 0.84);
    ctx.closePath();
    ctx.fill();
  });

  const circleButton = (key: string, fill: number, stroke: number) =>
    makeTexture(scene, key, 320, 320, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(61, 43, 31, 0.16)';
      circle(ctx, w / 2, h / 2 + 10, 142);
      ctx.fill();
      ctx.fillStyle = css(fill);
      circle(ctx, w / 2, h / 2, 142);
      ctx.fill();
      ctx.strokeStyle = css(stroke);
      ctx.lineWidth = 14;
      circle(ctx, w / 2, h / 2, 132);
      ctx.stroke();
    });

  circleButton('btn-go', 0x7ed957, 0x4fae33);
  circleButton('btn-again', 0xffd166, 0xe0a92c);
  circleButton('btn-car', 0x8fd0f5, 0x4d9fd1);

  makeTexture(scene, 'icon-play', 140, 140, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h * 0.22);
    ctx.lineTo(w * 0.78, h * 0.5);
    ctx.lineTo(w * 0.34, h * 0.78);
    ctx.closePath();
    ctx.fill();
  });

  makeTexture(scene, 'icon-again', 150, 150, (ctx, w, h) => {
    ctx.strokeStyle = css(0xffffff);
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 44, -0.4 * Math.PI, 1.15 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = css(0xffffff);
    ctx.beginPath();
    ctx.moveTo(w / 2 + 18, h * 0.16);
    ctx.lineTo(w / 2 + 62, h * 0.3);
    ctx.lineTo(w / 2 + 16, h * 0.46);
    ctx.closePath();
    ctx.fill();
  });

  makeTexture(scene, 'icon-car', 170, 170, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.22, h * 0.34, w * 0.56, h * 0.36, 22);
    ctx.fill();
    roundRect(ctx, w * 0.34, h * 0.2, w * 0.32, h * 0.22, 16);
    ctx.fill();
    ctx.fillStyle = css(0xffffff);
    circle(ctx, w * 0.34, h * 0.74, 14);
    ctx.fill();
    circle(ctx, w * 0.66, h * 0.74, 14);
    ctx.fill();
  });

  makeTexture(scene, 'icon-pause', 140, 140, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.3, h * 0.24, 22, h * 0.52, 11);
    ctx.fill();
    roundRect(ctx, w * 0.58, h * 0.24, 22, h * 0.52, 11);
    ctx.fill();
  });

  makeTexture(scene, 'icon-sound', 140, 140, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.22, h * 0.4, 20, h * 0.2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.5);
    ctx.lineTo(w * 0.62, h * 0.28);
    ctx.lineTo(w * 0.62, h * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(0xffffff);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w * 0.62, h * 0.5, 26, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.62, h * 0.5, 42, -0.6, 0.6);
    ctx.stroke();
  });

  makeTexture(scene, 'icon-mute', 140, 140, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.22, h * 0.4, 20, h * 0.2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.5);
    ctx.lineTo(w * 0.62, h * 0.28);
    ctx.lineTo(w * 0.62, h * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(0xffffff);
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(w * 0.72, h * 0.38);
    ctx.lineTo(w * 0.9, h * 0.62);
    ctx.moveTo(w * 0.9, h * 0.38);
    ctx.lineTo(w * 0.72, h * 0.62);
    ctx.stroke();
  });

  makeTexture(scene, 'icon-hud-balloon', 120, 120, (ctx, w, h) => {
    ctx.fillStyle = css(0xff9ec4);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.44, 36, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.7);
    circle(ctx, w * 0.4, h * 0.32, 9);
    ctx.fill();
    ctx.strokeStyle = css(0x8a7a6a, 0.9);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.72);
    ctx.quadraticCurveTo(w / 2 + 8, h * 0.86, w / 2 - 4, h - 6);
    ctx.stroke();
  });

  makeTexture(scene, 'rotate-phone', 300, 300, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    roundRect(ctx, w * 0.32, h * 0.16, w * 0.36, h * 0.68, 26);
    ctx.fill();
    ctx.fillStyle = css(0x8fd0f5);
    roundRect(ctx, w * 0.36, h * 0.22, w * 0.28, h * 0.5, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.42, Math.PI * 0.15, Math.PI * 0.62);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.42, Math.PI * 1.15, Math.PI * 1.62);
    ctx.stroke();
  });

  makeTexture(scene, 'card', 520, 700, (ctx, w, h) => {
    ctx.fillStyle = css(COLORS.card);
    roundRect(ctx, 0, 0, w, h, 60);
    ctx.fill();
    ctx.strokeStyle = css(0xe6d6bb);
    ctx.lineWidth = 10;
    roundRect(ctx, 10, 10, w - 20, h - 20, 52);
    ctx.stroke();
  });
}

function lampTexture(scene: Phaser.Scene, key: string, color: number, glow: boolean): string {
  return makeTexture(scene, key, 150, 150, (ctx, w, h) => {
    if (glow) {
      ctx.fillStyle = css(color, 0.35);
      circle(ctx, w / 2, h / 2, 72);
      ctx.fill();
    }
    ctx.fillStyle = css(color);
    circle(ctx, w / 2, h / 2, 52);
    ctx.fill();
    ctx.fillStyle = css(shade(color, glow ? 60 : 20), 0.85);
    circle(ctx, w * 0.4, h * 0.36, 16);
    ctx.fill();
  });
}

function decorationTextures(scene: Phaser.Scene): void {
  makeTexture(scene, 'house', 300, 320, (ctx, w, h) => {
    ctx.fillStyle = css(0xffe0d0);
    roundRect(ctx, w * 0.16, h * 0.4, w * 0.68, h * 0.56, 18);
    ctx.fill();
    ctx.fillStyle = css(0xf4846f);
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * 0.42);
    ctx.lineTo(w * 0.5, h * 0.06);
    ctx.lineTo(w * 0.92, h * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0x8fd0f5);
    roundRect(ctx, w * 0.26, h * 0.52, w * 0.2, h * 0.2, 10);
    ctx.fill();
    roundRect(ctx, w * 0.56, h * 0.52, w * 0.2, h * 0.2, 10);
    ctx.fill();
    ctx.fillStyle = css(0x9a6b4a);
    roundRect(ctx, w * 0.42, h * 0.74, w * 0.18, h * 0.22, 10);
    ctx.fill();
  });

  makeTexture(scene, 'lamp', 140, 340, (ctx, w, h) => {
    ctx.fillStyle = css(0xb9b3c8);
    roundRect(ctx, w / 2 - 10, h * 0.1, 20, h * 0.86, 10);
    ctx.fill();
    ctx.fillStyle = css(0xfff3c4);
    circle(ctx, w / 2, h * 0.1, 34);
    ctx.fill();
  });

  makeTexture(scene, 'buoy', 140, 190, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.34, h * 0.3, w * 0.32, h * 0.5, 22);
    ctx.fill();
    ctx.fillStyle = css(0xf4846f);
    ctx.fillRect(w * 0.3, h * 0.46, w * 0.4, 26);
    ctx.fillStyle = css(0x8fd0f5);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.82, w * 0.42, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  makeTexture(scene, 'reed', 120, 260, (ctx, w, h) => {
    ctx.strokeStyle = css(0x6fbf5e);
    ctx.lineWidth = 12;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(w * (0.3 + i * 0.2), h);
      ctx.quadraticCurveTo(w * (0.2 + i * 0.3), h * 0.5, w * (0.4 + i * 0.2), h * 0.12);
      ctx.stroke();
    }
    ctx.fillStyle = css(0x9a6b4a);
    roundRect(ctx, w * 0.34, h * 0.06, 18, 60, 9);
    ctx.fill();
  });

  makeTexture(scene, 'cloud', 320, 170, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff, 0.92);
    circle(ctx, w * 0.32, h * 0.6, 56);
    ctx.fill();
    circle(ctx, w * 0.52, h * 0.44, 66);
    ctx.fill();
    circle(ctx, w * 0.72, h * 0.62, 50);
    ctx.fill();
    roundRect(ctx, w * 0.22, h * 0.56, w * 0.6, h * 0.3, 30);
    ctx.fill();
  });

  makeTexture(scene, 'sun', 340, 340, (ctx, w, h) => {
    ctx.fillStyle = css(COLORS.sun, 0.5);
    circle(ctx, w / 2, h / 2, 150);
    ctx.fill();
    ctx.fillStyle = css(COLORS.sun);
    circle(ctx, w / 2, h / 2, 104);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.45);
    circle(ctx, w * 0.36, h * 0.36, 30);
    ctx.fill();
  });
}

export interface TextureBundle {
  themes: Theme[];
}

/** Builds every procedural texture once, so scenes only place sprites. */
export function buildTextures(scene: Phaser.Scene): TextureBundle {
  const themes: Theme[] = ['meadow', 'river', 'city'];
  themes.forEach((theme) => {
    grassTexture(scene, theme);
    roadTexture(scene, theme);
  });
  treeTexture(scene);
  bushTexture(scene);
  flowerTexture(scene, 'flower-pink', 0xff9ec4);
  flowerTexture(scene, 'flower-white', 0xfff3f8);
  flowerTexture(scene, 'flower-sun', 0xffd166);
  balloonTexture(scene);
  puddleTexture(scene);
  moundTexture(scene);
  bannerTexture(scene);
  ribbonTexture(scene);
  cupTexture(scene);
  medalTexture(scene);
  starTexture(scene);
  heartTexture(scene);
  confettiTextures(scene);
  uiTextures(scene);
  decorationTextures(scene);
  lampTexture(scene, 'lamp-off', 0x6b7280, false);
  lampTexture(scene, 'lamp-red', 0xff6b6b, true);
  lampTexture(scene, 'lamp-yellow', 0xffd166, true);
  lampTexture(scene, 'lamp-green', 0x7ed957, true);
  return { themes };
}

/** Theme decorations are placed along the road by the race scene. */
export function decorationKeysFor(theme: Theme): string[] {
  if (theme === 'city') return ['house', 'lamp', 'house', 'bush'];
  if (theme === 'river') return ['reed', 'buoy', 'bush', 'reed'];
  return ['tree', 'bush', 'flower-pink', 'tree', 'flower-white', 'bush'];
}

export const VIEW_SIZE = VIEW;
