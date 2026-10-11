import Phaser from 'phaser';
import { UI, VIEW, COLORS } from './layout';
import { audio } from './audio';

export function text(
  scene: Phaser.Scene,
  x: number,
  y: number,
  value: string,
  options: { size?: number; color?: string; align?: string; bold?: boolean } = {},
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, value, {
      fontFamily: UI.fontFamily,
      fontSize: `${options.size ?? UI.fontSize.small}px`,
      color: options.color ?? '#5a4632',
      align: options.align ?? 'center',
      fontStyle: options.bold === false ? 'normal' : 'bold',
    })
    .setOrigin(0.5);
}

export interface CircleButtonOptions {
  size?: number;
  iconScale?: number;
  iconTint?: number;
  label?: string;
  labelColor?: string;
  onTap: () => void;
}

/** A big, forgiving round button: taps anywhere on it count, and it squashes back. */
export function circleButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  baseKey: string,
  iconKey: string,
  options: CircleButtonOptions,
): Phaser.GameObjects.Container {
  const size = options.size ?? UI.buttonSize;
  const container = scene.add.container(x, y);
  const base = scene.add.image(0, 0, baseKey).setDisplaySize(size, size);
  const icon = scene.add.image(0, 0, iconKey).setDisplaySize(size * (options.iconScale ?? 0.42), size * (options.iconScale ?? 0.42));
  if (options.iconTint !== undefined) icon.setTint(options.iconTint);
  container.add([base, icon]);
  if (options.label) {
    container.add(
      text(scene, 0, size * 0.62, options.label, {
        size: UI.fontSize.tiny,
        color: options.labelColor ?? '#ffffff',
      }),
    );
  }
  container.setSize(size, size);
  // Custom hit areas live in the object's local space, which Phaser offsets by
  // displayOrigin (size / 2 for a sized container), so the circle is centred there.
  container.setInteractive(
    new Phaser.Geom.Circle(size * 0.5, size * 0.5, size * 0.52),
    Phaser.Geom.Circle.Contains,
  );
  container.on('pointerdown', () => {
    audio.touch();
    scene.tweens.add({ targets: container, scale: 0.9, duration: 90, yoyo: true, ease: 'Quad.easeOut' });
    options.onTap();
  });
  return container;
}

/** Small square icon button used for pause and sound. */
export function iconButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  iconKey: string,
  onTap: () => void,
  size = UI.hudSize,
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
    audio.touch();
    scene.tweens.add({ targets: container, scale: 0.86, duration: 80, yoyo: true });
    onTap();
  });
  return container;
}

export function soundIconKey(): string {
  return audio.muted ? 'icon-mute' : 'icon-sound';
}

/** A happy confetti burst built from simple images with tweens (no particle API risk). */
export function confettiBurst(scene: Phaser.Scene, x: number, y: number, amount = 34, spread = 420): void {
  for (let i = 0; i < amount; i += 1) {
    const key = `confetti-${i % 5}`;
    const piece = scene.add.image(x + Phaser.Math.Between(-spread / 2, spread / 2), y, key);
    piece.setScale(Phaser.Math.FloatBetween(0.7, 1.5));
    piece.setAngle(Phaser.Math.Between(0, 360));
    piece.setDepth(60);
    const dx = Phaser.Math.Between(-260, 260);
    const dy = Phaser.Math.Between(120, 460);
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
    const spark = scene.add.image(x, y, `sparkle-${i % 5}`).setDepth(55);
    spark.setScale(Phaser.Math.FloatBetween(0.5, 1.1));
    scene.tweens.add({
      targets: spark,
      x: x + Phaser.Math.Between(-140, 140),
      y: y + Phaser.Math.Between(-140, 60),
      alpha: { from: 1, to: 0 },
      scale: 0.1,
      duration: Phaser.Math.Between(450, 900),
      ease: 'Quad.easeOut',
      onComplete: () => spark.destroy(),
    });
  }
}

/** Soft sky gradient used by the garage and finish scenes. */
export function paintSky(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.setDepth(-20);
  for (let i = 0; i < 60; i += 1) {
    const t = i / 59;
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(0xcdeeff),
      Phaser.Display.Color.ValueToColor(0xfff3d6),
      60,
      i,
    );
    graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
    graphics.fillRect(0, (VIEW.h / 60) * i, VIEW.w, VIEW.h / 60 + 1);
    void t;
  }
}

export function paintMeadow(scene: Phaser.Scene, y: number, color = COLORS.grassLight): void {
  const graphics = scene.add.graphics();
  graphics.setDepth(-15);
  graphics.fillStyle(color);
  graphics.fillRect(0, y, VIEW.w, VIEW.h - y);
  graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).darken(12).color);
  graphics.fillRect(0, y + 60, VIEW.w, VIEW.h - y - 60);
}
