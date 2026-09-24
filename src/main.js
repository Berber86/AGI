// main.js - Master Entry Point for 3D Bonsai Simulator
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Environment } from './models/Environment.js';
import { PotAndSoil } from './models/PotAndSoil.js';
import { BonsaiTree } from './models/BonsaiTree.js';
import { BonsaiGame } from './simulation/BonsaiGame.js';
import { BonsaiUI } from './ui/BonsaiUI.js';
import './ui/bonsai.css';

function initApp() {
  // 1. Canvas Container & WebGL Renderer
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
    preserveDrawingBuffer: true // Required for photo studio snapshot
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // High-fidelity cinematic PBR rendering
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  container.appendChild(renderer.domElement);

  // 2. Camera Controls (OrbitControls)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 2.2, 0);
  controls.minDistance = 3.0;
  controls.maxDistance = 14.0;
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above tatami floor
  controls.update();

  // 3. Build Japanese Environment (Tokonoma room, shoji, tatami, lantern, incense)
  const environment = new Environment(scene);

  // 4. Build Ceramic Pot & Akadama Soil
  const potAndSoil = new PotAndSoil(scene);
  potAndSoil.setupDefaultZenDressing();

  // 5. Build Bonsai Tree
  const tree = new BonsaiTree(scene, {
    species: 'pine',
    style: 'moyogi',
    season: 'summer',
    age: 28,
    soilY: potAndSoil.getSoilSurfaceY()
  });

  // 6. Simulator Life Cycle & Game Engine
  const game = new BonsaiGame(
    tree,
    potAndSoil,
    environment,
    camera,
    controls,
    renderer.domElement
  );

  // 7. Exquisite Japanese Zen UI
  const ui = new BonsaiUI(game, potAndSoil, tree, environment);

  // 8. Animation & Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Update camera controls
    controls.update();

    // Update tree particles (pruning debris)
    tree.update(delta);

    // Update atmospheric particles (incense smoke, dust motes, drifting petals)
    environment.update(delta, elapsed);

    // Update game simulation (water droplets, timers)
    game.update(delta);

    // Render 3D Scene
    renderer.render(scene, camera);
  }

  animate();

  // 9. Window Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
