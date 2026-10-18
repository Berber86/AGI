// reefactors.mjs — доля анимированных обитателей в VR-кадре (draw calls / tri).
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = '/tmp/al2023/lib';
process.env.HOME = '/tmp';
const browser = await puppeteer.launch({
  executablePath: '/tmp/chromium', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--hide-scrollbars', '--mute-audio', '--single-process', '--no-zygote', '--in-process-gpu', '--headless'],
  defaultViewport: { width: 1100, height: 700, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 300000,
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('pelagic-eye.settings.v1', JSON.stringify({ ipd: 6.4, quality: 'high', reducedMotion: false, soundOn: false }));
  Element.prototype.requestFullscreen = function () { return Promise.reject(new Error('no fullscreen')); };
});
await page.goto('http://127.0.0.1:8899/games/pelagic-eye/play/index.html', { waitUntil: 'networkidle0', timeout: 180000 });
await new Promise((r) => setTimeout(r, 4000));
const click = async (t) => {
  await page.evaluate((t) => {
    const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').trim().includes(t));
    b[0] && b[0].click();
  }, t);
  await new Promise((r) => setTimeout(r, 900));
};
await click('Начать погружение');
await new Promise((r) => setTimeout(r, 6000));
await page.evaluate(() => [...document.querySelectorAll('[title]')].find((e) => (e.title || '').includes('VR-драйвер'))?.click());
await new Promise((r) => setTimeout(r, 900));
await click('QA-подача');
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').trim() === 'Смотрю прямо');
  b[0] && b[0].click();
});
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].filter((x) => (x.textContent || '').trim() === 'Войти в VR');
  b[b.length - 1].click();
});
await new Promise((r) => setTimeout(r, 3000));

const out = await page.evaluate(async () => {
  const w = window.__REEF__;
  const r = w.renderer;
  w.debugSetVrGovTier(2, true); // freeze: чистый tier 2
  const acc = { draws: 0, tri: 0 };
  const origBD = r.renderBufferDirect;
  r.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    if (!material.isMeshDepthMaterial && !material.isMeshDistanceMaterial) {
      acc.draws++;
      let n = geometry.index ? geometry.index.count : geometry.attributes.position.count;
      if (group) n = Math.min(n, group.count);
      n = Math.min(n, geometry.drawRange.count);
      acc.tri += (n / 3) * (object.isInstancedMesh ? object.count : 1);
    }
    return origBD.apply(this, arguments);
  };
  const measure = async (frames = 8) => {
    acc.draws = 0; acc.tri = 0;
    for (let i = 0; i < frames; i++) await new Promise((res) => requestAnimationFrame(res));
    return { drawsPerPair: +(acc.draws / frames).toFixed(1), triPerPair: Math.round(acc.tri / frames) };
  };

  // Все «живые» акторы: рыбы, кит, черепаха, манта, медузы, угорь, школы.
  const actors = [];
  w.fishActors.forEach((a) => actors.push(a.group));
  if (w.whaleAdult) actors.push(w.whaleAdult.rig.group);
  if (w.whaleCalf) actors.push(w.whaleCalf.rig.group);
  if (w.turtleRig) actors.push(w.turtleRig.group);
  if (w.mantaRig) actors.push(w.mantaRig.group);
  w.jellyfish.forEach((j) => actors.push(j));
  if (w.eelAnchor) actors.push(w.eelAnchor);
  w.schools.forEach((s) => actors.push(s.mesh));

  const withActors = await measure();
  actors.forEach((o) => { o.visible = false; });
  const withoutActors = await measure();
  actors.forEach((o) => { o.visible = true; });

  // Сколько мешей в акторах и сколько из них реально видно в стерео
  let actorMeshes = 0, visibleActorMeshes = 0;
  actors.forEach((o) => o.traverse((m) => {
    if (m.isMesh || m.isPoints) {
      actorMeshes++;
      if (o.visible && m.visible && (!o.parent || true)) visibleActorMeshes++;
    }
  }));
  const fishGroups = w.fishActors.map((a) => ({ visible: a.group.visible, meshes: (() => { let n = 0; a.group.traverse((m) => { if (m.isMesh) n++; }); return n; })() }));

  r.renderBufferDirect = origBD;
  return {
    withActors,
    withoutActors,
    actorsShare: {
      drawsPerPair: +(withActors.drawsPerPair - withoutActors.drawsPerPair).toFixed(1),
      triPerPair: withActors.triPerPair - withoutActors.triPerPair,
    },
    actorMeshes,
    fishGroups,
    whaleMeshes: (() => { let n = 0; if (w.whaleAdult) w.whaleAdult.rig.group.traverse((m) => { if (m.isMesh) n++; }); return n; })(),
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
