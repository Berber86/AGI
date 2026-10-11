import Phaser from 'phaser';
import { PALETTES, type Theme } from '../sim/config';
import { VIEW } from '../render/road3d';
import { audio } from './audio';

export const INK = '#5a4632';

/** The speaker icon always follows the current mute state. */
export function soundIconKey(): string {
  return audio.muted ? 'icon-mute' : 'icon-sound';
}

export function text(
  scene: Phaser.Scene,
  x: number,
  y: number,
  value: string,
  options: { size?: number; color?: string; align?: string; bold?: boolean } = {},
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, value, {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      fontSize: `${options.size ?? 34}px`,
      color: options.color ?? INK,
      align: options.align ?? 'center',
      fontStyle: options.bold === false ? 'normal' : 'bold',
    })
    .setOrigin(0.5);
}

/** Full-bleed theme sky, used by the garage and the finish scene. */
export function skyBackground(scene: Phaser.Scene, theme: Theme): Phaser.GameObjects.Image {
  return scene.add.image(0, 0, `sky-${theme}`).setOrigin(0, 0).setDisplaySize(VIEW.w, VIEW.h).setDepth(-20);
}

/** Candy verge that fills the lower part of a menu scene. */
export function meadowBackground(scene: Phaser.Scene, y: number, theme: Theme): void {
  const palette = PALETTES[theme];
  const graphics = scene.add.graphics().setDepth(-19);
  graphics.fillStyle(palette.ground, 1);
  graphics.fillRect(0, y, VIEW.w, VIEW.h - y);
  graphics.fillStyle(palette.groundAlt, 1);
  graphics.fillRect(0, y + 26, VIEW.w, VIEW.h - y - 26);
}

export interface CircleButtonOptions {
  size?: number;
  iconScale?: number;
  label?: string;
  labelColor?: string;
  onTap: () => void;
}

export function circleButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  baseKey: string,
  iconKey: string,
  options: CircleButtonOptions,
): Phaser.GameObjects.Container {
  const size = options.size ?? 300;
  const container = scene.add.container(x, y);
  const base = scene.add.image(0, 0, baseKey).setDisplaySize(size, size);
  const icon = scene.add.image(0, 0, iconKey).setDisplaySize(size * (options.iconScale ?? 0.42), size * (options.iconScale ?? 0.42));
  container.add([base, icon]);
  if (options.label) {
    container.add(
      text(scene, 0, size * 0.62, options.label, {
        size: 30,
        color: options.labelColor ?? '#ffffff',
      }),
    );
  }
  container.setSize(size, size);
  container.setInteractive(
    new Phaser.Geom.Circle(size * 0.5, size * 0.5, size * 0.52),
    Phaser.Geom.Circle.Contains,
  );
  container.on('pointerdown', () => {
    scene.tweens.add({ targets: container, scale: 0.9, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
    options.onTap();
  });
  return container;
}

export function iconButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  iconKey: string,
  onTap: () => void,
  size = 96,
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const back = scene.add.circle(0, 0, size * 0.5, 0xffffff, 0.34);
  back.setStrokeStyle(6, 0xffffff, 0.7);
  const icon = scene.add.image(0, 0, iconKey).setDisplaySize(size * 0.5, size * 0.5);
  container.add([back, icon]);
  container.setSize(size, size);
  container.setInteractive(
    new Phaser.Geom.Circle(size * 0.5, size * 0.5, size * 0.58),
    Phaser.Geom.Circle.Contains,
  );
  container.on('pointerdown', () => {
    scene.tweens.add({ targets: container, scale: 0.86, duration: 80, yoyo: true });
    onTap();
  });
  return container;
}

/** Simple, dependable confetti burst built from tweened sprites. */
export function confettiBurst(scene: Phaser.Scene, x: number, y: number, amount = 30, spread = 600): void {
  for (let i = 0; i < amount; i += 1) {
    const piece = scene.add.image(x + Phaser.Math.Between(-spread / 2, spread / 2), y, `confetti-${i % 6}`);
    piece.setScale(Phaser.Math.FloatBetween(0.8, 1.6));
    piece.setAngle(Phaser.Math.Between(0, 360));
    piece.setDepth(99980);
    const dx = Phaser.Math.Between(-280, 280);
    const dy = Phaser.Math.Between(140, 520);
    scene.tweens.add({
      targets: piece,
      x: piece.x + dx,
      y: piece.y + dy,
      angle: piece.angle + Phaser.Math.Between(-540, 540),
      alpha: { from: 1, to: 0 },
      duration: Phaser.Math.Between(1200, 2400),
      ease: 'Quad.easeOut',
      onComplete: () => piece.destroy(),
    });
  }
}

export function sparkleBurst(scene: Phaser.Scene, x: number, y: number, amount = 8): void {
  for (let i = 0; i < amount; i += 1) {
    const spark = scene.add.image(x, y, `sparkle-${i % 5}`).setDepth(99970);
    spark.setScale(Phaser.Math.FloatBetween(0.5, 1.2));
    scene.tweens.add({
      targets: spark,
      x: x + Phaser.Math.Between(-190, 190),
      y: y + Phaser.Math.Between(-170, 40),
      alpha: { from: 1, to: 0 },
      scale: 0.1,
      duration: Phaser.Math.Between(450, 950),
      ease: 'Quad.easeOut',
      onComplete: () => spark.destroy(),
    });
  }
}
