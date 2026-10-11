import Phaser from 'phaser';
import { CAR_COLORS, FLAGS, PALETTES, THEMES, type Theme } from '../sim/config';

type Ctx = CanvasRenderingContext2D;

export const VIEW_SIZE = { w: 1600, h: 800 } as const;

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
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
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

function star(ctx: Ctx, x: number, y: number, r: number, spikes = 5, inner = 0.45): void {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? r : r * inner;
    const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
}

function heart(ctx: Ctx, x: number, y: number, size: number): void {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.85);
  ctx.bezierCurveTo(x - size * 1.5, y + size * 0.1, x - size * 0.55, y - size * 1.1, x, y - size * 0.35);
  ctx.bezierCurveTo(x + size * 0.55, y - size * 1.1, x + size * 1.5, y + size * 0.1, x, y + size * 0.85);
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
  if (!ctx) return key;
  ctx.save();
  draw(ctx, w, h);
  ctx.restore();
  texture.refresh();
  return key;
}

// ---------------------------------------------------------------------------
// Theme: sky, mountains, castle, hills
// ---------------------------------------------------------------------------

function skyTexture(scene: Phaser.Scene, theme: Theme): string {
  const palette = PALETTES[theme];
  return makeTexture(scene, `sky-${theme}`, VIEW_SIZE.w, VIEW_SIZE.h, (ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, css(palette.skyTop));
    gradient.addColorStop(0.45, css(palette.skyMid));
    gradient.addColorStop(0.78, css(palette.skyHorizon));
    gradient.addColorStop(1, css(shade(palette.skyHorizon, -8)));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Soft candy haze just above the horizon.
    ctx.fillStyle = css(0xffffff, 0.35);
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.42, w * 0.75, h * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function mountainsTexture(scene: Phaser.Scene, theme: Theme): string {
  const palette = PALETTES[theme];
  const w = 2400;
  const h = 420;
  return makeTexture(scene, `mountains-${theme}`, w, h, (ctx) => {
    const peaks: Array<[number, number, number]> = [
      [260, 300, 210],
      [560, 380, 250],
      [900, 250, 190],
      [1240, 340, 260],
      [1620, 300, 220],
      [2000, 360, 240],
      [2320, 260, 200],
    ];
    for (const [x, height, width] of peaks) {
      ctx.fillStyle = css(palette.mountain, 0.85);
      ctx.beginPath();
      ctx.moveTo(x - width, h);
      ctx.quadraticCurveTo(x - width * 0.35, h - height * 0.9, x, h - height);
      ctx.quadraticCurveTo(x + width * 0.35, h - height * 0.9, x + width, h);
      ctx.closePath();
      ctx.fill();
      // Snow cap.
      ctx.fillStyle = css(0xffffff, 0.85);
      ctx.beginPath();
      ctx.moveTo(x - width * 0.3, h - height * 0.62);
      ctx.quadraticCurveTo(x - width * 0.12, h - height * 0.95, x, h - height);
      ctx.quadraticCurveTo(x + width * 0.12, h - height * 0.95, x + width * 0.3, h - height * 0.62);
      ctx.quadraticCurveTo(x, h - height * 0.74, x - width * 0.3, h - height * 0.62);
      ctx.fill();
    }
  });
}

function castleTexture(scene: Phaser.Scene, theme: Theme): string {
  const palette = PALETTES[theme];
  const wall = palette.castleWall;
  const roof = palette.castleRoof;
  const w = 1100;
  const h = 780;
  return makeTexture(scene, `castle-${theme}`, w, h, (ctx) => {
    const tower = (cx: number, top: number, width: number, roofHeight: number, flag: boolean) => {
      ctx.fillStyle = css(wall);
      roundRect(ctx, cx - width / 2, top, width, h - top - 40, 14);
      ctx.fill();
      ctx.fillStyle = css(shade(wall, -22), 0.5);
      ctx.fillRect(cx - width / 2, top, width * 0.16, h - top - 40);
      // Roof.
      ctx.fillStyle = css(roof);
      ctx.beginPath();
      ctx.moveTo(cx - width * 0.62, top + 6);
      ctx.quadraticCurveTo(cx, top - roofHeight, cx + width * 0.62, top + 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = css(shade(roof, 30), 0.7);
      ctx.beginPath();
      ctx.moveTo(cx - width * 0.2, top + 4);
      ctx.quadraticCurveTo(cx - width * 0.04, top - roofHeight * 0.9, cx + width * 0.1, top + 4);
      ctx.closePath();
      ctx.fill();
      // Windows.
      for (let row = 0; row < 3; row += 1) {
        const wy = top + 90 + row * 120;
        if (wy > h - 120) break;
        ctx.fillStyle = css(0x9fd8ff, 0.9);
        roundRect(ctx, cx - width * 0.16, wy, width * 0.32, 62, 30);
        ctx.fill();
        ctx.strokeStyle = css(0xfff0b8);
        ctx.lineWidth = 8;
        roundRect(ctx, cx - width * 0.16, wy, width * 0.32, 62, 30);
        ctx.stroke();
      }
      // Door.
      ctx.fillStyle = css(0x9a6b8f, 0.85);
      roundRect(ctx, cx - width * 0.18, h - 150, width * 0.36, 110, 40);
      ctx.fill();
      if (flag) {
        ctx.strokeStyle = css(0xfff0b8);
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(cx, top - roofHeight + 8);
        ctx.lineTo(cx, top - roofHeight - 70);
        ctx.stroke();
        ctx.fillStyle = css(0xff8fc0);
        ctx.beginPath();
        ctx.moveTo(cx, top - roofHeight - 70);
        ctx.lineTo(cx + 88, top - roofHeight - 42);
        ctx.lineTo(cx, top - roofHeight - 12);
        ctx.closePath();
        ctx.fill();
      }
    };

    // Back wall.
    ctx.fillStyle = css(shade(wall, -12));
    roundRect(ctx, 200, 380, 700, h - 420, 22);
    ctx.fill();
    // Towers.
    tower(200, 300, 190, 150, false);
    tower(900, 300, 190, 150, false);
    tower(550, 150, 250, 210, true);
    // Candy dots on the walls.
    for (let i = 0; i < 26; i += 1) {
      const x = 220 + ((i * 137) % 660);
      const y = 400 + ((i * 91) % 300);
      ctx.fillStyle = css(i % 2 === 0 ? 0xff8fc0 : 0x9fd8ff, 0.55);
      circle(ctx, x, y, 9);
      ctx.fill();
    }
  });
}

function ferrisTexture(scene: Phaser.Scene, theme: Theme): string {
  const palette = PALETTES[theme];
  const size = 700;
  return makeTexture(scene, `ferris-${theme}`, size, size, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h * 0.42;
    const radius = w * 0.38;
    ctx.strokeStyle = css(0xffffff, 0.95);
    ctx.lineWidth = 14;
    circle(ctx, cx, cy, radius);
    ctx.stroke();
    ctx.lineWidth = 8;
    for (let i = 0; i < 10; i += 1) {
      const angle = (i / 10) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
      const cabinColors = [0xff8fc0, 0xffd166, 0x8fd0f5, 0xa8f0d8, 0xd0b3ff];
      ctx.fillStyle = css(cabinColors[i % cabinColors.length]);
      roundRect(
        ctx,
        cx + Math.cos(angle) * radius - 26,
        cy + Math.sin(angle) * radius - 5,
        52,
        44,
        16,
      );
      ctx.fill();
    }
    ctx.fillStyle = css(0xfff0b8);
    circle(ctx, cx, cy, 26);
    ctx.fill();
    // Legs.
    ctx.strokeStyle = css(0xe6e0f0, 0.95);
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.6, h);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + radius * 0.6, h);
    ctx.stroke();
    void palette;
  });
}

function coasterTexture(scene: Phaser.Scene, theme: Theme): string {
  const palette = PALETTES[theme];
  return makeTexture(scene, `coaster-${theme}`, 1000, 400, (ctx, w, h) => {
    ctx.strokeStyle = css(0xffffff, 0.9);
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.bezierCurveTo(w * 0.18, h * 0.1, w * 0.34, h * 0.95, w * 0.5, h * 0.45);
    ctx.bezierCurveTo(w * 0.66, h * 0.05, w * 0.82, h * 0.9, w, h * 0.6);
    ctx.stroke();
    ctx.strokeStyle = css(0xffd166, 0.85);
    ctx.lineWidth = 8;
    for (const x of [w * 0.16, w * 0.34, w * 0.52, w * 0.7, w * 0.88]) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.55);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    ctx.fillStyle = css(0xff8fc0);
    roundRect(ctx, w * 0.46, h * 0.38, 96, 54, 20);
    ctx.fill();
    void palette;
  });
}

function candyHillTexture(scene: Phaser.Scene, theme: Theme): string {
  const palette = PALETTES[theme];
  return makeTexture(scene, `hill-${theme}`, 900, 380, (ctx, w, h) => {
    ctx.fillStyle = css(shade(palette.ground, 18), 0.95);
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h, w * 0.42, h * 0.62, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(palette.groundAlt, 0.95);
    ctx.beginPath();
    ctx.ellipse(w * 0.72, h, w * 0.4, h * 0.78, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xfff0f6, 0.5);
    for (let i = 0; i < 18; i += 1) {
      circle(ctx, (i * 97) % w, h - ((i * 53) % 120) - 20, 10);
      ctx.fill();
    }
  });
}

// ---------------------------------------------------------------------------
// Candy props
// ---------------------------------------------------------------------------

function lollipopTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'lollipop', 220, 520, (ctx, w, h) => {
    ctx.fillStyle = css(0xfff6ea);
    roundRect(ctx, w / 2 - 18, h * 0.4, 36, h * 0.6, 18);
    ctx.fill();
    const cx = w / 2;
    const cy = h * 0.29;
    const r = w * 0.44;
    ctx.fillStyle = css(0xff8fc0);
    circle(ctx, cx, cy, r);
    ctx.fill();
    ctx.fillStyle = css(0xfff6ea);
    circle(ctx, cx, cy, r * 0.86);
    ctx.fill();
    ctx.fillStyle = css(0xff8fc0);
    circle(ctx, cx, cy, r * 0.7);
    ctx.fill();
    ctx.strokeStyle = css(0xfff6ea);
    ctx.lineWidth = 22;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 4; a += 0.2) {
      const radius = 12 + a * 12;
      if (radius > r * 0.66) break;
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    }
    ctx.stroke();
    ctx.fillStyle = css(0xffffff, 0.6);
    circle(ctx, cx - r * 0.4, cy - r * 0.42, r * 0.14);
    ctx.fill();
  });
}

function candyCaneTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'candycane', 200, 460, (ctx, w, h) => {
    const stripe = (path: () => void) => {
      ctx.strokeStyle = css(0xffffff);
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.beginPath();
      path();
      ctx.stroke();
      ctx.save();
      ctx.strokeStyle = css(0xff7f7f);
      ctx.lineWidth = 40;
      ctx.setLineDash([26, 34]);
      ctx.beginPath();
      path();
      ctx.stroke();
      ctx.restore();
    };
    stripe(() => {
      ctx.moveTo(w * 0.5, h * 0.98);
      ctx.lineTo(w * 0.5, h * 0.34);
      ctx.arc(w * 0.62, h * 0.3, w * 0.14, Math.PI, Math.PI * 1.9);
    });
  });
}

function gumdropTexture(scene: Phaser.Scene, key: string, color: number, size = 180): string {
  return makeTexture(scene, key, size, size * 0.85, (ctx, w, h) => {
    ctx.fillStyle = css(shade(color, -30), 0.35);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.93, w * 0.42, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(color);
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.9);
    ctx.quadraticCurveTo(w * 0.5, h * -0.15, w * 0.9, h * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.55);
    for (let i = 0; i < 12; i += 1) {
      circle(ctx, w * 0.2 + ((i * 47) % (w * 0.6)), h * 0.4 + ((i * 29) % (h * 0.4)), 4);
      ctx.fill();
    }
  });
}

function candyTreeTexture(scene: Phaser.Scene, key: string, canopy: number): string {
  return makeTexture(scene, key, 320, 420, (ctx, w, h) => {
    ctx.fillStyle = css(shade(0xffffff, -40), 0.2);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.96, w * 0.3, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xf7e6d2);
    roundRect(ctx, w / 2 - 22, h * 0.5, 44, h * 0.46, 18);
    ctx.fill();
    ctx.fillStyle = css(0xff8fc0, 0.7);
    for (let i = 0; i < 5; i += 1) {
      roundRect(ctx, w / 2 - 24, h * 0.52 + i * 34, 48, 14, 7);
      ctx.fill();
    }
    const blobs: Array<[number, number, number]> = [
      [w * 0.5, h * 0.3, 108],
      [w * 0.27, h * 0.42, 74],
      [w * 0.73, h * 0.42, 74],
      [w * 0.5, h * 0.5, 66],
    ];
    for (const [x, y, r] of blobs) {
      ctx.fillStyle = css(canopy);
      circle(ctx, x, y, r);
      ctx.fill();
    }
    ctx.fillStyle = css(0xffffff, 0.5);
    circle(ctx, w * 0.38, h * 0.22, 26);
    ctx.fill();
    ctx.fillStyle = css(0xffd166);
    for (let i = 0; i < 6; i += 1) {
      star(ctx, w * 0.25 + ((i * 71) % (w * 0.5)), h * 0.24 + ((i * 53) % (h * 0.3)), 14);
      ctx.fill();
    }
  });
}

function cupcakeTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'cupcake', 240, 260, (ctx, w, h) => {
    // Wrapper.
    ctx.fillStyle = css(0xffd9a8);
    ctx.beginPath();
    ctx.moveTo(w * 0.24, h * 0.52);
    ctx.lineTo(w * 0.76, h * 0.52);
    ctx.lineTo(w * 0.68, h * 0.94);
    ctx.lineTo(w * 0.32, h * 0.94);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffbf80, 0.9);
    for (let i = 0; i < 5; i += 1) {
      ctx.fillRect(w * (0.28 + i * 0.09), h * 0.55, 10, h * 0.36);
    }
    // Frosting.
    ctx.fillStyle = css(0xff9ec4);
    circle(ctx, w * 0.5, h * 0.44, w * 0.27);
    ctx.fill();
    circle(ctx, w * 0.34, h * 0.5, w * 0.2);
    ctx.fill();
    circle(ctx, w * 0.66, h * 0.5, w * 0.2);
    ctx.fill();
    ctx.fillStyle = css(0xffc2da);
    circle(ctx, w * 0.5, h * 0.34, w * 0.16);
    ctx.fill();
    // Cherry.
    ctx.fillStyle = css(0xe23b52);
    circle(ctx, w * 0.5, h * 0.2, w * 0.09);
    ctx.fill();
    ctx.strokeStyle = css(0x6fbf5e);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.13);
    ctx.quadraticCurveTo(w * 0.6, h * 0.04, w * 0.66, h * 0.1);
    ctx.stroke();
    // Sprinkles.
    const colors = [0x8fd0f5, 0xffd166, 0xa8f0d8, 0xd0b3ff];
    for (let i = 0; i < 10; i += 1) {
      ctx.fillStyle = css(colors[i % colors.length]);
      const x = w * 0.3 + ((i * 53) % (w * 0.4));
      const y = h * 0.42 + ((i * 31) % (h * 0.14));
      roundRect(ctx, x, y, 14, 8, 4);
      ctx.fill();
    }
  });
}

function heartBalloonTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'balloon-heart', 170, 230, (ctx, w, h) => {
    ctx.strokeStyle = css(0xd8c8e8);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.62);
    ctx.quadraticCurveTo(w * 0.62, h * 0.8, w * 0.48, h * 0.98);
    ctx.stroke();
    const gradient = ctx.createRadialGradient(w * 0.4, h * 0.24, 8, w * 0.5, h * 0.36, w * 0.5);
    gradient.addColorStop(0, css(0xffe1f0));
    gradient.addColorStop(0.55, css(0xff8fc0));
    gradient.addColorStop(1, css(0xe0559b));
    ctx.fillStyle = gradient;
    heart(ctx, w / 2, h * 0.36, 62);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.65);
    circle(ctx, w * 0.36, h * 0.22, 15);
    ctx.fill();
  });
}

function syrupPuddleTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'puddle', 260, 170, (ctx, w, h) => {
    ctx.fillStyle = css(0xb388ff, 0.85);
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.44, h * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xe0d0ff, 0.9);
    ctx.beginPath();
    ctx.ellipse(w / 2 - 16, h / 2 - 12, w * 0.2, h * 0.16, -0.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function candyBumpTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'mound', 240, 160, (ctx, w, h) => {
    ctx.fillStyle = css(0x7fc98a, 0.25);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.88, w * 0.44, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xa8f0c8);
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * 0.86);
    ctx.quadraticCurveTo(w * 0.5, h * -0.1, w * 0.92, h * 0.86);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.6);
    for (let i = 0; i < 10; i += 1) {
      circle(ctx, w * 0.2 + ((i * 61) % (w * 0.6)), h * 0.4 + ((i * 37) % (h * 0.35)), 5);
      ctx.fill();
    }
    ctx.fillStyle = css(0xff8fc0);
    circle(ctx, w * 0.5, h * 0.34, 18);
    ctx.fill();
  });
}

// ---------------------------------------------------------------------------
// Cars: rear view, because the game is played from behind the car
// ---------------------------------------------------------------------------

function rearCarBase(
  ctx: Ctx,
  w: number,
  h: number,
  body: number,
  dark: number,
  driver: (ctx: Ctx, w: number, h: number) => void,
  decals?: (ctx: Ctx, w: number, h: number) => void,
): void {
  // Ground shadow.
  ctx.fillStyle = 'rgba(61, 43, 31, 0.16)';
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.94, w * 0.42, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rear tyres: wide, dark and low, so they read as wheels below the body.
  for (const cx of [w * 0.17, w * 0.83]) {
    ctx.fillStyle = css(0x3b3644);
    roundRect(ctx, cx - w * 0.075, h * 0.66, w * 0.15, h * 0.3, w * 0.05);
    ctx.fill();
    ctx.fillStyle = css(0x6d6678);
    roundRect(ctx, cx - w * 0.035, h * 0.72, w * 0.07, h * 0.18, w * 0.03);
    ctx.fill();
    ctx.fillStyle = css(0xd9d3e4);
    circle(ctx, cx, h * 0.78, w * 0.022);
    ctx.fill();
  }

  // Cockpit opening and seats.
  ctx.fillStyle = css(shade(dark, -30));
  roundRect(ctx, w * 0.22, h * 0.2, w * 0.56, h * 0.3, 40);
  ctx.fill();
  ctx.fillStyle = css(0xfff3ea);
  roundRect(ctx, w * 0.3, h * 0.22, w * 0.16, h * 0.24, 26);
  ctx.fill();
  roundRect(ctx, w * 0.54, h * 0.22, w * 0.16, h * 0.24, 26);
  ctx.fill();

  driver(ctx, w, h);

  // Body.
  ctx.fillStyle = css(dark);
  roundRect(ctx, w * 0.1, h * 0.42, w * 0.8, h * 0.46, 44);
  ctx.fill();
  ctx.fillStyle = css(body);
  roundRect(ctx, w * 0.115, h * 0.44, w * 0.77, h * 0.42, 40);
  ctx.fill();
  ctx.fillStyle = css(shade(body, 26), 0.85);
  roundRect(ctx, w * 0.13, h * 0.46, w * 0.74, h * 0.12, 30);
  ctx.fill();

  // Bumper and tail lights.
  ctx.fillStyle = css(shade(dark, -18));
  roundRect(ctx, w * 0.12, h * 0.78, w * 0.76, h * 0.12, 26);
  ctx.fill();
  for (const cx of [w * 0.25, w * 0.75]) {
    ctx.fillStyle = css(0xff6b6b);
    roundRect(ctx, cx - w * 0.08, h * 0.6, w * 0.16, h * 0.11, 18);
    ctx.fill();
    ctx.fillStyle = css(0xffd166, 0.95);
    roundRect(ctx, cx - w * 0.045, h * 0.625, w * 0.09, h * 0.06, 12);
    ctx.fill();
  }
  // Plate.
  ctx.fillStyle = css(0xfffdf5);
  roundRect(ctx, w * 0.42, h * 0.79, w * 0.16, h * 0.1, 12);
  ctx.fill();
  ctx.fillStyle = css(dark);
  ctx.font = `bold ${Math.round(h * 0.075)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('7', w * 0.5, h * 0.87);

  decals?.(ctx, w, h);
}

/**
 * «Лиля», seen from behind: the back of her helmet, her ponytail and her
 * shoulders. No face, because the camera sits behind the car.
 */
function driverGirl(ctx: Ctx, w: number, h: number): void {
  const cx = w * 0.5;
  const cy = h * 0.24;
  const r = w * 0.1;
  // Hair under the helmet.
  ctx.fillStyle = css(0x8b5a3c);
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.25, r * 1.02, r * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  // Helmet, seen from the back.
  ctx.fillStyle = css(0xff8fc0);
  circle(ctx, cx, cy, r);
  ctx.fill();
  ctx.fillStyle = css(0xffb3d6);
  ctx.beginPath();
  ctx.ellipse(cx, cy - r * 0.28, r * 0.86, r * 0.62, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = css(0xffffff, 0.95);
  star(ctx, cx, cy + r * 0.1, r * 0.42);
  ctx.fill();
  // Ponytail hanging to the right of the helmet.
  ctx.fillStyle = css(0x8b5a3c);
  ctx.beginPath();
  ctx.ellipse(cx + r * 1.15, cy + r * 0.55, r * 0.32, r * 0.6, 0.45, 0, Math.PI * 2);
  ctx.fill();
  // Shoulders in her pink race suit.
  ctx.fillStyle = css(0xff8fc0);
  roundRect(ctx, cx - w * 0.15, h * 0.3, w * 0.3, h * 0.2, w * 0.06);
  ctx.fill();
  ctx.fillStyle = css(0xfff3ea, 0.9);
  roundRect(ctx, cx - w * 0.02, h * 0.3, w * 0.04, h * 0.2, w * 0.02);
  ctx.fill();
}

function driverAnimal(ctx: Ctx, w: number, h: number, kind: 'cat' | 'bunny' | 'bear', fur: number): void {
  const cx = w * 0.5;
  const cy = h * 0.16;
  ctx.fillStyle = css(0xfff0d8);
  roundRect(ctx, cx - w * 0.12, h * 0.05, w * 0.24, h * 0.22, 40);
  ctx.fill();
  ctx.fillStyle = css(fur);
  circle(ctx, cx, cy, w * 0.078);
  ctx.fill();
  if (kind === 'cat') {
    ctx.fillStyle = css(fur);
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + dir * w * 0.05, cy - h * 0.05);
      ctx.lineTo(cx + dir * w * 0.1, cy - h * 0.13);
      ctx.lineTo(cx + dir * w * 0.005, cy - h * 0.08);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = css(0xffb3c8);
    circle(ctx, cx - w * 0.03, cy + h * 0.012, w * 0.008);
    ctx.fill();
    circle(ctx, cx + w * 0.03, cy + h * 0.012, w * 0.008);
    ctx.fill();
  } else if (kind === 'bunny') {
    ctx.fillStyle = css(fur);
    for (const dir of [-1, 1]) {
      ctx.save();
      ctx.translate(cx + dir * w * 0.04, cy - h * 0.07);
      ctx.rotate(dir * 0.25);
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.05, w * 0.025, h * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = css(0xff8fb0);
    circle(ctx, cx, cy + h * 0.01, w * 0.012);
    ctx.fill();
  } else {
    ctx.fillStyle = css(shade(fur, -20));
    circle(ctx, cx - w * 0.06, cy - h * 0.05, w * 0.028);
    ctx.fill();
    circle(ctx, cx + w * 0.06, cy - h * 0.05, w * 0.028);
    ctx.fill();
    ctx.fillStyle = css(0x6b4a34);
    circle(ctx, cx, cy + h * 0.012, w * 0.016);
    ctx.fill();
  }
}

/** Draws one of the three flag or sticker shapes: a star, a heart or a flower. */
function badgeShape(ctx: Ctx, x: number, y: number, size: number, kind: string, color: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = css(color);
  if (kind === 'heart') {
    heart(ctx, 0, -size * 0.15, size * 0.62);
    ctx.fill();
  } else if (kind === 'flower') {
    for (let i = 0; i < 5; i += 1) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      circle(ctx, Math.cos(angle) * size * 0.34, Math.sin(angle) * size * 0.34, size * 0.26);
      ctx.fill();
    }
    ctx.fillStyle = css(0xfff7d6);
    circle(ctx, 0, 0, size * 0.2);
    ctx.fill();
  } else {
    star(ctx, 0, 0, size * 0.55);
    ctx.fill();
  }
  ctx.restore();
}

export function heroCarKey(scene: Phaser.Scene, colorId: string, flagId = 'star', stickerId = 'star'): string {
  const color = CAR_COLORS.find((item) => item.id === colorId) ?? CAR_COLORS[0];
  const flag = FLAGS.find((item) => item.id === flagId) ?? FLAGS[0];
  const sticker = FLAGS.find((item) => item.id === stickerId) ?? FLAGS[0];
  const key = `hero-rear-${color.id}-${flag.id}-${sticker.id}`;
  const w = 600;
  const h = 320;
  return makeTexture(scene, key, w, h, (ctx) => {
    rearCarBase(ctx, w, h, color.body, color.dark, driverGirl, (inner) => {
      // White bow on the boot lid, like the reference car.
      inner.save();
      inner.translate(w * 0.7, h * 0.52);
      inner.fillStyle = css(0xfffdf8);
      inner.beginPath();
      inner.moveTo(0, 0);
      inner.lineTo(-38, -26);
      inner.lineTo(-34, 16);
      inner.closePath();
      inner.fill();
      inner.beginPath();
      inner.moveTo(0, 0);
      inner.lineTo(38, -26);
      inner.lineTo(34, 16);
      inner.closePath();
      inner.fill();
      inner.fillStyle = css(0xff8fc0);
      circle(inner, 0, -2, 12);
      inner.fill();
      inner.restore();
    });
    // The chosen flag waves on a little mast on the left of the cockpit…
    ctx.save();
    ctx.strokeStyle = css(0xfffdf5);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(w * 0.16, h * 0.34);
    ctx.lineTo(w * 0.14, h * 0.02);
    ctx.stroke();
    ctx.translate(w * 0.14, h * 0.06);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(46, 8, 88, 2);
    ctx.lineTo(88, 46);
    ctx.quadraticCurveTo(46, 52, 0, 44);
    ctx.closePath();
    ctx.fillStyle = css(flag.color);
    ctx.fill();
    ctx.restore();
    // …and the chosen sticker sits on the boot lid.
    badgeShape(ctx, w * 0.42, h * 0.66, 58, sticker.id, 0xfffdf5);
  });
}

export function rivalCarKey(scene: Phaser.Scene, index: number): string {
  const key = `rival-rear-${index}`;
  const w = 560;
  const h = 300;
  const bodies: Array<{ body: number; dark: number; kind: 'cat' | 'bunny' | 'bear'; fur: number }> = [
    { body: 0xf4846f, dark: 0xc75a48, kind: 'cat', fur: 0xd8d4e8 },
    { body: 0xffd166, dark: 0xd9a02c, kind: 'bunny', fur: 0xfff0d8 },
    { body: 0x8fb8f0, dark: 0x5d87c8, kind: 'bear', fur: 0xc9a082 },
  ];
  const spec = bodies[index % bodies.length];
  return makeTexture(scene, key, w, h, (ctx) => {
    rearCarBase(ctx, w, h, spec.body, spec.dark, (inner) =>
      driverAnimal(inner, w, h, spec.kind, spec.fur),
    );
  });
}

// ---------------------------------------------------------------------------
// HUD art
// ---------------------------------------------------------------------------

function avatarTexture(scene: Phaser.Scene): string {
  return makeTexture(scene, 'avatar', 240, 240, (ctx, w, h) => {
    ctx.fillStyle = css(0xffe6f2);
    circle(ctx, w / 2, h / 2, w * 0.5);
    ctx.fill();
    ctx.fillStyle = css(0xffb3d9);
    circle(ctx, w / 2, h * 0.62, w * 0.42);
    ctx.fill();
    // Suit.
    ctx.fillStyle = css(0xff8fc0);
    roundRect(ctx, w * 0.22, h * 0.66, w * 0.56, h * 0.36, 40);
    ctx.fill();
    // Ponytail.
    ctx.fillStyle = css(0x8b5a3c);
    ctx.beginPath();
    ctx.ellipse(w * 0.72, h * 0.56, w * 0.1, h * 0.16, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Face.
    ctx.fillStyle = css(0xffd9bd);
    circle(ctx, w * 0.5, h * 0.48, w * 0.22);
    ctx.fill();
    // Helmet.
    ctx.fillStyle = css(0xff8fc0);
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.47, w * 0.245, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.92);
    roundRect(ctx, w * 0.26, h * 0.45, w * 0.48, h * 0.05, 16);
    ctx.fill();
    star(ctx, w * 0.5, h * 0.33, w * 0.06);
    ctx.fillStyle = css(0xffffff);
    ctx.fill();
    // Face details.
    ctx.fillStyle = css(0x4a3b30);
    circle(ctx, w * 0.42, h * 0.52, w * 0.028);
    ctx.fill();
    circle(ctx, w * 0.58, h * 0.52, w * 0.028);
    ctx.fill();
    ctx.fillStyle = css(0xffffff);
    circle(ctx, w * 0.43, h * 0.51, w * 0.01);
    ctx.fill();
    circle(ctx, w * 0.59, h * 0.51, w * 0.01);
    ctx.fill();
    ctx.strokeStyle = css(0xd06a7a);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.56, w * 0.06, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = css(0xff9ec4, 0.6);
    circle(ctx, w * 0.34, h * 0.57, w * 0.035);
    ctx.fill();
    circle(ctx, w * 0.66, h * 0.57, w * 0.035);
    ctx.fill();
  });
}

function gantryTexture(scene: Phaser.Scene, lit: number): string {
  const key = `gantry-${lit}`;
  return makeTexture(scene, key, 520, 560, (ctx, w, h) => {
    ctx.fillStyle = css(0xe8e2f0);
    roundRect(ctx, w * 0.06, h * 0.2, 34, h * 0.8, 16);
    ctx.fill();
    roundRect(ctx, w * 0.88, h * 0.2, 34, h * 0.8, 16);
    ctx.fill();
    ctx.fillStyle = css(0x5c5468);
    roundRect(ctx, w * 0.02, h * 0.06, w * 0.96, h * 0.34, 34);
    ctx.fill();
    const colors = [0xff6b6b, 0xffd166, 0x7ed957];
    for (let i = 0; i < 3; i += 1) {
      const on = lit > i;
      ctx.fillStyle = css(on ? colors[i] : 0x3f3a4a);
      circle(ctx, w * (0.22 + i * 0.28), h * 0.23, w * 0.1);
      ctx.fill();
      if (on) {
        ctx.fillStyle = css(colors[i], 0.35);
        circle(ctx, w * (0.22 + i * 0.28), h * 0.23, w * 0.15);
        ctx.fill();
      }
    }
    ctx.fillStyle = css(0xffffff, 0.9);
    roundRect(ctx, w * 0.1, h * 0.42, w * 0.8, 20, 10);
    ctx.fill();
  });
}

function uiBasics(scene: Phaser.Scene): void {
  makeTexture(scene, 'arrow', 170, 170, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.5);
    ctx.lineTo(w * 0.6, h * 0.17);
    ctx.lineTo(w * 0.6, h * 0.37);
    ctx.lineTo(w * 0.84, h * 0.37);
    ctx.lineTo(w * 0.84, h * 0.63);
    ctx.lineTo(w * 0.6, h * 0.63);
    ctx.lineTo(w * 0.6, h * 0.83);
    ctx.closePath();
    ctx.fill();
  });

  makeTexture(scene, 'steer-pad', 360, 360, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    circle(ctx, w / 2, h / 2, w * 0.5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = 10;
    circle(ctx, w / 2, h / 2, w * 0.46);
    ctx.stroke();
  });

  const circleButton = (key: string, fill: number, stroke: number, size = 320) =>
    makeTexture(scene, key, size, size, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(61, 43, 31, 0.18)';
      circle(ctx, w / 2, h / 2 + 12, w * 0.44);
      ctx.fill();
      ctx.fillStyle = css(fill);
      circle(ctx, w / 2, h / 2, w * 0.44);
      ctx.fill();
      ctx.strokeStyle = css(stroke);
      ctx.lineWidth = 14;
      circle(ctx, w / 2, h / 2, w * 0.41);
      ctx.stroke();
    });
  circleButton('btn-go', 0x7ed957, 0x4fae33);
  circleButton('btn-again', 0xffd166, 0xe0a92c);
  circleButton('btn-car', 0x8fd0f5, 0x4d9fd1);

  makeTexture(scene, 'icon-play', 140, 140, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    ctx.beginPath();
    ctx.moveTo(w * 0.32, h * 0.2);
    ctx.lineTo(w * 0.8, h * 0.5);
    ctx.lineTo(w * 0.32, h * 0.8);
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
    ctx.moveTo(w / 2 + 20, h * 0.14);
    ctx.lineTo(w / 2 + 64, h * 0.3);
    ctx.lineTo(w / 2 + 18, h * 0.46);
    ctx.closePath();
    ctx.fill();
  });

  makeTexture(scene, 'icon-car', 170, 170, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.2, h * 0.36, w * 0.6, h * 0.34, 22);
    ctx.fill();
    roundRect(ctx, w * 0.33, h * 0.22, w * 0.34, h * 0.2, 16);
    ctx.fill();
    circle(ctx, w * 0.33, h * 0.74, 15);
    ctx.fill();
    circle(ctx, w * 0.67, h * 0.74, 15);
    ctx.fill();
  });

  makeTexture(scene, 'icon-pause', 150, 150, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.3, h * 0.24, 24, h * 0.52, 12);
    ctx.fill();
    roundRect(ctx, w * 0.58, h * 0.24, 24, h * 0.52, 12);
    ctx.fill();
  });

  makeTexture(scene, 'icon-sound', 150, 150, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.2, h * 0.4, 20, h * 0.2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.5);
    ctx.lineTo(w * 0.6, h * 0.28);
    ctx.lineTo(w * 0.6, h * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(0xffffff);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w * 0.6, h * 0.5, 24, -0.6, 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.6, h * 0.5, 40, -0.6, 0.6);
    ctx.stroke();
  });

  makeTexture(scene, 'icon-mute', 150, 150, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    roundRect(ctx, w * 0.2, h * 0.4, 20, h * 0.2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.5);
    ctx.lineTo(w * 0.6, h * 0.28);
    ctx.lineTo(w * 0.6, h * 0.72);
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

  makeTexture(scene, 'clock', 130, 130, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff);
    circle(ctx, w / 2, h / 2, w * 0.42);
    ctx.fill();
    ctx.fillStyle = css(0xff8fc0);
    circle(ctx, w / 2, h / 2, w * 0.33);
    ctx.fill();
    ctx.strokeStyle = css(0xffffff);
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    ctx.lineTo(w / 2 + w * 0.16, h / 2);
    ctx.moveTo(w / 2, h / 2);
    ctx.lineTo(w / 2, h * 0.28);
    ctx.stroke();
  });

  makeTexture(scene, 'rotate-phone', 320, 320, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
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

  makeTexture(scene, 'card', 640, 460, (ctx, w, h) => {
    ctx.fillStyle = css(0xfff7ea);
    roundRect(ctx, 0, 0, w, h, 60);
    ctx.fill();
    ctx.strokeStyle = css(0xe6d6bb);
    ctx.lineWidth = 10;
    roundRect(ctx, 10, 10, w - 20, h - 20, 52);
    ctx.stroke();
  });

  // ---- finish-line party art ----
  makeTexture(scene, 'cup', 260, 300, (ctx, w, h) => {
    ctx.fillStyle = css(0xffe28a);
    roundRect(ctx, w * 0.3, h * 0.12, w * 0.4, h * 0.3, 20);
    ctx.fill();
    ctx.fillStyle = css(0xffcf5c);
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.14);
    ctx.quadraticCurveTo(w * 0.06, h * 0.2, w * 0.32, h * 0.36);
    ctx.lineTo(w * 0.36, h * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.14);
    ctx.quadraticCurveTo(w * 0.94, h * 0.2, w * 0.68, h * 0.36);
    ctx.lineTo(w * 0.64, h * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xf7b23c);
    roundRect(ctx, w * 0.46, h * 0.4, w * 0.08, h * 0.24, 10);
    ctx.fill();
    ctx.fillStyle = css(0xffd166);
    roundRect(ctx, w * 0.24, h * 0.62, w * 0.52, h * 0.14, 18);
    ctx.fill();
    roundRect(ctx, w * 0.16, h * 0.76, w * 0.68, h * 0.14, 18);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.6);
    star(ctx, w * 0.5, h * 0.26, 26);
    ctx.fill();
  });

  makeTexture(scene, 'medal', 220, 260, (ctx, w, h) => {
    ctx.fillStyle = css(0xff8fab);
    ctx.beginPath();
    ctx.moveTo(w * 0.3, 0);
    ctx.lineTo(w * 0.46, h * 0.52);
    ctx.lineTo(w * 0.24, h * 0.58);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0x8fd0f5);
    ctx.beginPath();
    ctx.moveTo(w * 0.7, 0);
    ctx.lineTo(w * 0.54, h * 0.52);
    ctx.lineTo(w * 0.76, h * 0.58);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css(0xffd166);
    circle(ctx, w * 0.5, h * 0.68, w * 0.32);
    ctx.fill();
    ctx.fillStyle = css(0xfff3c4);
    circle(ctx, w * 0.5, h * 0.68, w * 0.24);
    ctx.fill();
    ctx.fillStyle = css(0xf7b23c);
    star(ctx, w * 0.5, h * 0.68, w * 0.17);
    ctx.fill();
  });

  makeTexture(scene, 'banner', 1000, 200, (ctx, w, h) => {
    ctx.fillStyle = css(0xffffff, 0.94);
    roundRect(ctx, 0, 0, w, h, 40);
    ctx.fill();
    ctx.strokeStyle = css(0xff9ec4);
    ctx.lineWidth = 12;
    roundRect(ctx, 10, 10, w - 20, h - 20, 32);
    ctx.stroke();
    ctx.fillStyle = css(0xff9ec4);
    for (let i = 0; i < 14; i += 1) {
      ctx.beginPath();
      ctx.moveTo(40 + i * 66, h - 6);
      ctx.lineTo(72 + i * 66, h - 6);
      ctx.lineTo(56 + i * 66, h - 54);
      ctx.closePath();
      ctx.fill();
    }
  });

  makeTexture(scene, 'star', 160, 160, (ctx, w, h) => {
    ctx.fillStyle = css(0xffd166);
    star(ctx, w / 2, h / 2, w * 0.46);
    ctx.fill();
  });

  makeTexture(scene, 'heart', 160, 160, (ctx, w, h) => {
    ctx.fillStyle = css(0xff7fa8);
    heart(ctx, w / 2, h * 0.44, w * 0.34);
    ctx.fill();
  });

  makeTexture(scene, 'flower', 160, 160, (ctx, w, h) => {
    ctx.fillStyle = css(0xb388ff);
    for (let i = 0; i < 5; i += 1) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      circle(ctx, w / 2 + Math.cos(angle) * w * 0.24, h / 2 + Math.sin(angle) * w * 0.24, w * 0.19);
      ctx.fill();
    }
    ctx.fillStyle = css(0xfff7d6);
    circle(ctx, w / 2, h / 2, w * 0.15);
    ctx.fill();
  });

  // Party bunting strung across the road.
  makeTexture(scene, 'bunting', 900, 130, (ctx, w, h) => {
    const colors = [0xff9ec4, 0xffd166, 0x8fd0f5, 0xb388ff, 0x7ed957, 0xfffdf8];
    ctx.strokeStyle = css(0xfffdf8, 0.95);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.22);
    ctx.quadraticCurveTo(w * 0.5, h * 0.42, w, h * 0.22);
    ctx.stroke();
    for (let i = 0; i < 12; i += 1) {
      const t = (i + 0.5) / 12;
      const x = t * w;
      const y = h * 0.22 + Math.sin(t * Math.PI) * h * 0.2;
      ctx.fillStyle = css(colors[i % colors.length]);
      ctx.beginPath();
      ctx.moveTo(x - 24, y);
      ctx.lineTo(x + 24, y);
      ctx.lineTo(x, y + h * 0.5);
      ctx.closePath();
      ctx.fill();
    }
  });

  makeTexture(scene, 'icon-balloon', 150, 190, (ctx, w, h) => {
    ctx.fillStyle = css(0xff9ec4);
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.4, w * 0.36, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = css(0xfffdf5);
    ctx.beginPath();
    ctx.moveTo(w / 2 - 16, h * 0.68);
    ctx.lineTo(w / 2 + 16, h * 0.68);
    ctx.lineTo(w / 2, h * 0.76);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(0xfffdf5);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.76);
    ctx.quadraticCurveTo(w * 0.62, h * 0.9, w / 2, h);
    ctx.stroke();
  });
}

function confettiAndSparkles(scene: Phaser.Scene): void {
  const colors = [0xff9ec4, 0xffd166, 0x8fd0f5, 0xb388ff, 0x7ed957, 0xffffff];
  colors.forEach((color, index) => {
    makeTexture(scene, `confetti-${index}`, 40, 40, (ctx, w, h) => {
      ctx.fillStyle = css(color);
      roundRect(ctx, 2, 8, w - 4, h - 16, 10);
      ctx.fill();
    });
    makeTexture(scene, `sparkle-${index}`, 70, 70, (ctx, w, h) => {
      ctx.fillStyle = css(color);
      star(ctx, w / 2, h / 2, 30);
      ctx.fill();
    });
  });
}

function cloudsAndSun(scene: Phaser.Scene): void {
  makeTexture(scene, 'cloud', 420, 220, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    circle(ctx, w * 0.3, h * 0.62, 62);
    ctx.fill();
    circle(ctx, w * 0.5, h * 0.44, 76);
    ctx.fill();
    circle(ctx, w * 0.72, h * 0.64, 56);
    ctx.fill();
    roundRect(ctx, w * 0.2, h * 0.58, w * 0.6, h * 0.32, 34);
    ctx.fill();
  });

  makeTexture(scene, 'sun', 360, 360, (ctx, w, h) => {
    ctx.fillStyle = css(0xfff3c4, 0.45);
    circle(ctx, w / 2, h / 2, w * 0.48);
    ctx.fill();
    ctx.fillStyle = css(0xffe9a8);
    circle(ctx, w / 2, h / 2, w * 0.34);
    ctx.fill();
    ctx.fillStyle = css(0xffffff, 0.5);
    circle(ctx, w * 0.4, h * 0.38, w * 0.12);
    ctx.fill();
  });
}

export interface TextureBundle {
  themes: Theme[];
}

/** Builds every theme-independent texture once, so scenes only place sprites. */
export function buildTextures(scene: Phaser.Scene): TextureBundle {
  lollipopTexture(scene);
  candyCaneTexture(scene);
  gumdropTexture(scene, 'gumdrop-pink', 0xffb3d1);
  gumdropTexture(scene, 'gumdrop-mint', 0xa8f0d8);
  gumdropTexture(scene, 'gumdrop-sun', 0xffe0a3);
  gumdropTexture(scene, 'gumdrop-sky', 0xb8e8ff);
  candyTreeTexture(scene, 'candytree-pink', 0xffb3d1);
  candyTreeTexture(scene, 'candytree-mint', 0xa8f0c8);
  candyTreeTexture(scene, 'candytree-lilac', 0xd9c4ff);
  cupcakeTexture(scene);
  heartBalloonTexture(scene);
  syrupPuddleTexture(scene);
  candyBumpTexture(scene);
  avatarTexture(scene);
  for (let lit = 0; lit <= 3; lit += 1) gantryTexture(scene, lit);
  uiBasics(scene);
  confettiAndSparkles(scene);
  cloudsAndSun(scene);
  CAR_COLORS.forEach((color) => heroCarKey(scene, color.id));
  for (let i = 0; i < 3; i += 1) rivalCarKey(scene, i);
  return { themes: [...THEMES] };
}

/** Builds the textures of one theme (sky, mountains, castle, skyline, hills). */
export function buildThemeTextures(scene: Phaser.Scene, theme: Theme): void {
  skyTexture(scene, theme);
  mountainsTexture(scene, theme);
  castleTexture(scene, theme);
  ferrisTexture(scene, theme);
  coasterTexture(scene, theme);
  candyHillTexture(scene, theme);
}

/** Candy sprinkles that decorate the verge beside the road. */
export const VERGE_PROPS = ['lollipop', 'candycane', 'gumdrop-pink', 'gumdrop-mint', 'candytree-pink', 'candytree-mint'] as const;
export const WALL_PROPS = ['gumdrop-sun', 'gumdrop-sky', 'gumdrop-pink', 'gumdrop-mint'] as const;
