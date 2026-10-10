import { Vector2 } from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// Subtle HDR light diffusion. No blur, chromatic aberration or film grain on the HUD.
export class RenderPipeline {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    renderer.info.autoReset = false;
  }
  configure(quality, width, height) {
    this.high = quality === "high";
    if (this.high && !this.composer) {
      this.composer = new EffectComposer(this.renderer);
      const samples = Math.min(4, this.renderer.capabilities.maxSamples);
      this.composer.renderTarget1.samples = samples;
      this.composer.renderTarget2.samples = samples;
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(
        new Vector2(width, height),
        0.23,
        0.55,
        1.05,
      );
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    }
    if (!this.high && this.composer) {
      this.composer.passes.forEach((pass) => pass.dispose?.());
      this.composer.dispose();
      this.composer = null;
      this.bloom = null;
    }
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(width, height);
    }
  }
  render() {
    this.renderer.info.reset();
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}
