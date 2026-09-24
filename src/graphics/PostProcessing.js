// PostProcessing.js - AAA Cinematic Post-Processing Pipeline
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Master Composer with High Precision RenderTarget
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      samples: 4
    });

    this.composer = new EffectComposer(this.renderer, renderTarget);

    // 2. Base Scene Render Pass
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    // 3. Cinematic Unreal Bloom Pass (Dreamy sunbeams, shoji light, lantern gleam)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.38,  // Strength
      0.65,  // Radius
      0.82   // Threshold (only bright highlights bloom)
    );
    this.composer.addPass(this.bloomPass);

    // 4. Subtle Vignette Pass (Lens corner darkening for photographic depth)
    this.vignettePass = new ShaderPass(VignetteShader);
    this.vignettePass.uniforms['offset'].value = 1.05;
    this.vignettePass.uniforms['darkness'].value = 1.12;
    this.composer.addPass(this.vignettePass);

    // 5. FXAA Anti-Aliasing Pass
    this.fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
    this.composer.addPass(this.fxaaPass);
  }

  setBloomStrength(val) {
    if (this.bloomPass) {
      this.bloomPass.strength = val;
    }
  }

  setSize(width, height) {
    this.composer.setSize(width, height);
    const pixelRatio = this.renderer.getPixelRatio();
    if (this.fxaaPass) {
      this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
      this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
    }
  }

  render() {
    this.composer.render();
  }
}
