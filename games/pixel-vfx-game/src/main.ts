import Phaser from "phaser";
import { PlayScene } from "./game/scene.js";
import { CONFIG } from "./game/world.js";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: CONFIG.w,
  height: CONFIG.h,
  backgroundColor: "#08110d",
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: CONFIG.w,
    height: CONFIG.h,
  },
  render: { antialias: false, pixelArt: true, roundPixels: true, powerPreference: "low-power" },
  fps: { target: 60, min: 30 },
  banner: false,
  scene: [PlayScene],
};

const game = new Phaser.Game(config);

window.addEventListener("load", () => {
  document.getElementById("boot")?.classList.add("hidden");
});
setTimeout(() => document.getElementById("boot")?.classList.add("hidden"), 1200);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("./sw.js").catch(() => {
      /* offline install is a bonus, not a requirement to play */
    });
  });
}

export { game };
