// main.js - Master Entry Point with AAA Post-Processing Pipeline
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Environment } from './models/Environment.js';
import { PotAndSoil } from './models/PotAndSoil.js';
import { BonsaiTree } from './models/BonsaiTree.js';
import { BonsaiGame } from './simulation/BonsaiGame.js';
import { BonsaiUI } from './ui/BonsaiUI.js';
import { PostProcessing } from './graphics/PostProcessing.js';
import './ui/bonsai.css';

function initApp() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    50
  );
  camera.position.set(0, 2.6, 7.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // AAA Cinematic PBR rendering setup
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  container.appendChild(renderer.domElement);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 2.2, 0);
  controls.minDistance = 3.0;
  controls.maxDistance = 14.0;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;
  controls.update();

  // Environment (Tokonoma, tatami, shoji, lantern, incense, shishi-odoshi)
  const environment = new Environment(scene);

  // Ceramic Pot & Akadama Soil PBR
  const potAndSoil = new PotAndSoil(scene);
  potAndSoil.setupDefaultZenDressing();

  // Bonsai Tree with organic gnarls & PBR
  const tree = new BonsaiTree(scene, {
    species: 'pine',
    style: 'moyogi',
    season: 'summer',
    age: 28,
    soilY: potAndSoil.getSoilSurfaceY()
  });

  // Simulator Engine & Game Loop
  const game = new BonsaiGame(
    tree,
    potAndSoil,
    environment,
    camera,
    controls,
    renderer.domElement
  );

  // AAA Cinematic Post-Processing (UnrealBloom + Vignette + FXAA)
  const postProcessing = new PostProcessing(renderer, scene, camera);

  // Japanese Zen UI
  const ui = new BonsaiUI(game, potAndSoil, tree, environment);

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    controls.update();

    // Wind sway & falling particle physics
    tree.update(delta, elapsed);

    // Incense smoke, dust motes, drifting petals, shishi-odoshi rocker arm
    environment.update(delta, elapsed);

    // Water shower particles
    game.update(delta);

    // Render through AAA post-processing pipeline
    postProcessing.render();
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    postProcessing.setSize(w, h);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
