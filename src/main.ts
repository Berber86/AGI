import Phaser from 'phaser'
import { SelectionScene } from './game/scenes/SelectionScene'
import { RaceScene } from './game/scenes/RaceScene'

const DPR_CAP = 2

function getRendererConfig() {
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
  return dpr
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#FFF6F9',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    fullscreenTarget: 'game'
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [SelectionScene, RaceScene]
}

const game = new Phaser.Game(config)

// PWA registration only in production
// @ts-ignore
if ((import.meta as any).env?.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // silent fail, no sw file yet is okay for MVP
    })
  })
}

// Handle visibility change for pause/resume - required by mobile-web.md
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.scene.getScenes(true).forEach(s => {
      if (s.scene.isActive()) s.scene.pause()
    })
    // @ts-ignore
    if (game.sound) game.sound.mute = true
  } else {
    game.scene.getScenes(false).forEach(s => {
      if (s.scene.isPaused()) s.scene.resume()
    })
    // @ts-ignore
    if (game.sound) game.sound.mute = false
  }
})

// Cap DPR
game.events.on('ready', () => {
  const dpr = getRendererConfig()
  game.scale.displaySize.setAspectRatio(1280/720)
  // renderer DPR cap handled via scale
  console.log(`[DruzhnyeGonki] DPR capped at ${dpr}`)
})

// Expose for debugging, but test bridge is per scene
// @ts-ignore
window.__GAME__ = game
