import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { readSectors, sectorAtHeight } from "./excavation.js";
import { depositUniforms, attachDeposits } from "./deposits.js";
import { createRelicModel, disposeObject } from "./relic-model.js";

/** One reusable context; renders only after input, resize, or cleaning. */
export class RelicInspection {
  mount(host, index, relic, { onBrush, onBrushEnd, onUnavailable } = {}) {
    this.unmount();
    if (this.contextLost) throw new Error("Inspection context is lost");
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        this.contextLost = true;
        this.stopBrush();
        if (this.host) this.onUnavailable?.();
      });
      this.renderer.domElement.addEventListener("webglcontextrestored", () => {
        this.contextLost = false;
      });
    }
    this.host = host;
    this.onBrush = onBrush;
    this.onBrushEnd = onBrushEnd;
    this.onUnavailable = onUnavailable;
    this.tool = "orbit";
    const canvas = this.renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Трёхмерная реликвия. Перетаскивайте для вращения; стрелки — поворот, плюс и минус — масштаб, R — сброс.",
    );
    host.prepend(canvas);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
    this.camera.position.set(0, 0.25, 5.4);
    this.scene.add(new THREE.HemisphereLight(0xc4e5ef, 0x333328, 2));
    const key = new THREE.DirectionalLight(0xffdbab, 4);
    key.position.set(-3, 4, 5);
    const rim = new THREE.DirectionalLight(0x8bdbc9, 3);
    rim.position.set(3, 1, -2);
    this.scene.add(key, rim);
    this.model = createRelicModel(index);
    this.bounds = new THREE.Box3().setFromObject(this.model);
    this.deposits = depositUniforms(this.bounds.min.y, this.bounds.max.y);
    this.model.rotation.set(0.12, -0.32, 0.08);
    this.scene.add(this.model);
    const materials = new Set();
    this.model.traverse((o) => {
      if (o.isMesh) materials.add(o.material);
    });
    materials.forEach((material) => attachDeposits(material, this.deposits));
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 8;
    this.controls.addEventListener("change", this.render);
    this.controls.saveState();
    this.keyHandler = (e) => {
      const moves = {
        ArrowLeft: [0, -0.16],
        ArrowRight: [0, 0.16],
        ArrowUp: [-0.16, 0],
        ArrowDown: [0.16, 0],
      };
      if (moves[e.key]) {
        e.preventDefault();
        this.model.rotation.x += moves[e.key][0];
        this.model.rotation.y += moves[e.key][1];
      } else if (["+", "=", "-"].includes(e.key)) {
        e.preventDefault();
        this.camera.position.multiplyScalar(e.key === "-" ? 1.1 : 0.9);
        this.camera.position.clampLength(3.5, 8);
        this.controls.update();
      } else if (e.code === "KeyR") this.reset();
      else return;
      this.render();
    };
    canvas.addEventListener("keydown", this.keyHandler);
    this.bindBrush(canvas);

    this.observer = new ResizeObserver(() => {
      if (!this.host) return;
      const { width, height } = this.host.getBoundingClientRect();
      this.renderer.setSize(width, height);
      this.camera.aspect = width / Math.max(height, 1);
      this.camera.updateProjectionMatrix();
      this.render();
    });
    this.observer.observe(host);
    this.setClean(relic);
  }
  render = () => {
    if (this.host && this.scene) this.renderer.render(this.scene, this.camera);
  };
  setClean(relic) {
    if (!this.host) return;
    this.deposits.excavation.value.fromArray(
      readSectors(relic).map((v) => v / 100),
    );
    this.render();
  }
  setTool(tool) {
    this.stopBrush();
    this.tool = tool;
    if (!this.host) return;
    this.controls.enabled = tool === "orbit";
    this.host.classList.toggle("brush-mode", tool === "brush");
    this.cursor.hidden = true;
  }
  hitSector(x, y) {
    if (!this.host) return -1;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(
      new THREE.Vector2(
        ((x - rect.left) / rect.width) * 2 - 1,
        (-(y - rect.top) / rect.height) * 2 + 1,
      ),
      this.camera,
    );
    const hit = this.raycaster
      .intersectObject(this.model, true)
      .find((h) => h.object.isMesh);
    if (!hit) return -1;
    const point = this.model.worldToLocal(hit.point.clone());
    return sectorAtHeight(point.y, this.bounds.min.y, this.bounds.max.y);
  }
  bindBrush(canvas) {
    this.raycaster = new THREE.Raycaster();
    this.cursor = document.createElement("span");
    this.cursor.className = "brush-cursor";
    this.cursor.setAttribute("aria-hidden", "true");
    this.cursor.hidden = true;
    this.host.append(this.cursor);
    const move = (e) => {
      if (
        this.tool !== "brush" ||
        (this.brushPointer != null && this.brushPointer !== e.pointerId)
      )
        return;
      const rect = canvas.getBoundingClientRect();
      this.brushPosition = { x: e.clientX, y: e.clientY };
      this.brushSector = this.hitSector(e.clientX, e.clientY);
      this.cursor.hidden = this.brushSector < 0;
      this.cursor.style.left = `${e.clientX - rect.left}px`;
      this.cursor.style.top = `${e.clientY - rect.top}px`;
      this.cursor.dataset.hitSector = this.brushSector;
    };
    const down = (e) => {
      if (this.tool !== "brush" || e.button !== 0 || this.brushPointer != null)
        return;
      e.preventDefault();
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(e.pointerId);
      this.brushPointer = e.pointerId;
      move(e);
      this.brushTick = performance.now();
      this.brushTimer = setInterval(() => {
        const now = performance.now();
        const dt = Math.min(0.1, (now - this.brushTick) / 1000);
        this.brushTick = now;
        this.brushSector = this.hitSector(
          this.brushPosition.x,
          this.brushPosition.y,
        );
        if (this.brushSector >= 0) this.onBrush?.(this.brushSector, dt * 85);
      }, 40);
    };
    const up = (e) => {
      if (e.pointerId === this.brushPointer) this.stopBrush();
    };
    const leave = () => {
      this.brushSector = -1;
      this.cursor.hidden = true;
    };
    const hide = () => {
      if (document.hidden) this.stopBrush();
    };
    this.brushListeners = [
      [canvas, "pointermove", move],
      [canvas, "pointerdown", down],
      [canvas, "pointerup", up],
      [canvas, "pointercancel", up],
      [canvas, "lostpointercapture", up],
      [canvas, "pointerleave", leave],
      [canvas, "blur", this.stopBrush],
      [window, "blur", this.stopBrush],
      [document, "visibilitychange", hide],
    ];
    this.brushListeners.forEach(([target, name, handler]) =>
      target.addEventListener(name, handler),
    );
  }
  stopBrush = () => {
    clearInterval(this.brushTimer);
    const pointer = this.brushPointer;
    this.brushPointer = null;
    if (pointer != null) {
      const canvas = this.renderer.domElement;
      if (canvas.hasPointerCapture(pointer))
        canvas.releasePointerCapture(pointer);
      this.onBrushEnd?.();
    }
  };
  reset() {
    if (!this.host) return;
    this.model.rotation.set(0.12, -0.32, 0.08);
    this.controls.reset();
    this.render();
  }
  unmount() {
    this.stopBrush();
    this.brushListeners?.forEach(([target, name, handler]) =>
      target.removeEventListener(name, handler),
    );
    this.brushListeners = [];
    this.cursor?.remove();
    this.observer?.disconnect();
    this.controls?.dispose();
    if (this.renderer && this.keyHandler)
      this.renderer.domElement.removeEventListener("keydown", this.keyHandler);
    if (this.scene) {
      disposeObject(this.scene);
      this.scene.clear();
      this.renderer.renderLists.dispose();
    }
    this.renderer?.domElement.remove();
    this.host = null;
    this.scene = null;
    this.model = null;
    this.surfaces = [];
  }
}
