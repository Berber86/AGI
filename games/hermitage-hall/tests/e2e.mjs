// E2E в реальном браузере (SwiftShader): взгляд-двелль, переносы, VR-переносы,
// отсутствие HUD в очках, стабильность кадра и доставка всех ассетов.
// Запуск: node tests/e2e.mjs [http://127.0.0.1:5173/]
import { launch, openHall, shot } from './browser.mjs';
import fs from 'fs';

const url = process.argv[2] || 'http://127.0.0.1:5173/';
const report = { url, checks: [], errors: [], ok: false };
const out = 'evidence/reports';
fs.mkdirSync(out, { recursive: true });

function check(name, condition, detail = '') {
  report.checks.push({ name, ok: Boolean(condition), detail });
  console.log(`${condition ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) report.ok = false;
}

const browser = await launch({ width: 1280, height: 720 });
try {
  const { page, errors } = await openHall(browser, url);
  report.errors = errors;

  // 1. Загрузка без ошибок
  const info0 = await page.evaluate(() => window.__HERMITAGE__.info());
  check('страница готова без ошибок консоли', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('сцена: есть отрисовка и прогрев шейдеров', info0.stereoReady === true, JSON.stringify({ calls: info0.drawCalls }));
  check('в зале 9 точек и 8 произведений', await page.evaluate(() => window.__HERMITAGE__.points().length === 9 && window.__HERMITAGE__.exhibits().length === 8));
  const lights = await page.evaluate(() => window.__HERMITAGE__.lights());
  check('источников света не больше девяти', lights <= 9, `${lights} источников`);

  // 2. В зале живут только миниатюры: полотна не грузятся в полном разрешении постоянно.
  const textures = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    return { list: api.textures(), detail: api.detailInfo() };
  });
  const based = textures.list.filter((p) => p.base);
  const biggestBase = Math.max(...based.map((p) => Math.max(...p.base)));
  check('в зале шесть миниатюр, полного разрешения нет', based.length === 6
    && textures.list.every((p) => p.detail === null) && biggestBase <= 720,
  `${based.length} миниатюр, максимум ${biggestBase} px, деталей ${textures.detail.resident.length}`);

  // 3. Файлы высокого разрешения лежат рядом и подгружаются к точке
  const detail = await page.evaluate(async () => {
    const api = window.__HERMITAGE__;
    const res = await api.detail('rembrandt');
    const canvas = api.debugCanvas('rembrandt');
    const tex = api.textures().find((p) => p.id === 'rembrandt');
    return { res, tex, hasMap: canvas.hasMap, isCanvas: canvas.imageIsCanvas };
  });
  check('деталь полотна подгружается по требованию', detail.res && detail.tex.detail
    && Math.max(...detail.tex.detail) >= 1200 && Math.min(...detail.tex.detail) <= 2048,
  JSON.stringify(detail.tex.detail));
  check('деталь лежит вверх ногами? нет', detail.isCanvas === true, `imageIsCanvas=${detail.isCanvas}`);

  // 3. Вход в зал
  await page.evaluate(() => window.__HERMITAGE__.enter());
  const info1 = await page.evaluate(() => window.__HERMITAGE__.info());
  check('вход переводит в режим осмотра', info1.mode === 'explore', info1.mode);

  // 4. Взгляд на медальон копит прогресс ровно 10 секунд
  const dwell = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    api.goto('p1');
    api.lookAtPoint('p3');
    const trace = [];
    let first = null;
    for (let i = 0; i < 900; i += 1) {
      const snap = api.step(1 / 60, 1);
      if (snap.targetId === 'p3' && first === null) first = i / 60;
      if (snap.arrival) {
        trace.push({ t: i / 60, arrival: snap.arrival });
        break;
      }
      if (i % 120 === 0) trace.push({ t: i / 60, progress: Number(snap.progress.toFixed(3)), target: snap.targetId });
    }
    return { trace, first, travel: api.travelInfo() };
  });
  const arrival = dwell.trace.find((t) => t.arrival);
  check('взгляд на медальон завершается прибытием', Boolean(arrival), JSON.stringify(dwell.trace.slice(-3)));
  check('двелль длится около 10 секунд', arrival && arrival.t > 9.6 && arrival.t < 11.2, arrival ? `${arrival.t.toFixed(2)} с` : 'нет');
  check('после прибытия запускается перенос', dwell.travel && dwell.travel.id === 'p3', JSON.stringify(dwell.travel));
  check('в обычном режиме перенос — плавный проход', dwell.travel && dwell.travel.kind === 'glide', dwell.travel?.kind);

  // 5. Проход завершается на новой точке
  const after = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    const t = api.travelInfo();
    if (!t) return { pose: api.pose(), travel: null };
    api.step(1 / 60, Math.ceil((t.duration * 60) + 20));
    return { pose: api.pose(), travel: api.travelInfo() };
  });
  check('перенос привёл на точку p3', after.pose.pointId === 'p3', after.pose.pointId);
  check('после переноса перенос завершён', after.travel === null, JSON.stringify(after.travel));

  // 6. Новая позиция совпадает с координатой точки
  const expected = await page.evaluate(() => window.__HERMITAGE__.points().find((p) => p.id === 'p3').position);
  const dx = Math.abs(after.pose.position[0] - expected[0]);
  const dz = Math.abs(after.pose.position[2] - expected[1]);
  check('камера стоит точно на точке', dx < 0.02 && dz < 0.02, `dx=${dx.toFixed(3)} dz=${dz.toFixed(3)}`);

  // 7. Переход на все девять точек не ломает сцену
  const allPoints = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    const results = [];
    for (const p of api.points()) {
      api.goto(p.id);
      api.render();
      results.push({ id: p.id, point: api.pose().pointId });
    }
    return results;
  });
  check('все девять точек доступны', allPoints.every((r) => r.id === r.point), JSON.stringify(allPoints));

  // 7б. Близкий осмотр полотна: десять секунд взгляда на холст
  const closeUp = await page.evaluate(async () => {
    const api = window.__HERMITAGE__;
    api.goto('p6');
    api.lookAtExhibit('rembrandt');
    await new Promise((r) => setTimeout(r, 500));
    let firstProgress = null;
    let arrived = null;
    for (let i = 0; i < 1200; i += 1) {
      api.step(1 / 60, 1);
      const s = api.study();
      if (firstProgress === null && s.progress > 0) firstProgress = i / 60;
      if (s.closeUp) { arrived = { sec: i / 60, id: s.closeUp }; break; }
    }
    // Подход занимает ~1,9 с: пока он идёт, взгляд ведёт перенос, а не зритель.
    for (let i = 0; i < 200 && api.debugState().travel; i += 1) api.step(1 / 60, 1);
    const coverage = api.coverage('rembrandt');
    // Лупа: подходим вплотную
    const base = coverage.distance;
    api.setCloseUpZoom(1);
    const zoomed = api.coverage('rembrandt');
    // Взгляд в сторону возвращает на точку
    api.setLook(api.pose().yaw + Math.PI, 0);
    api.step(1 / 60, 240);
    const afterLookAway = api.closeUp();
    for (let i = 0; i < 300 && api.closeUp(); i += 1) api.step(1 / 60, 1);
    return {
      firstProgress, arrived, coverage: { width: coverage.widthShare, height: coverage.heightShare, distance: base },
      zoomed: { width: zoomed.widthShare, height: zoomed.heightShare, distance: zoomed.distance },
      afterLookAway, left: api.closeUp() === null, pose: api.pose(), point: api.info().pointId,
      detail: api.textures().find((p) => p.id === 'rembrandt').detail,
    };
  });
  check('взгляд на полотно 10 секунд подводит вплотную',
    Boolean(closeUp.arrived) && closeUp.arrived.id === 'rembrandt' && closeUp.arrived.sec >= 9.5 && closeUp.arrived.sec <= 10.6,
    `через ${closeUp.arrived ? closeUp.arrived.sec.toFixed(2) : '—'} с`);
  check('вблизи холст занимает почти весь кадр',
    closeUp.coverage.height >= 0.95 && closeUp.coverage.height <= 1.6 && closeUp.coverage.width >= 0.5,
    `${Math.round(closeUp.coverage.width * 100)}×${Math.round(closeUp.coverage.height * 100)} % кадра, ${closeUp.coverage.distance.toFixed(2)} м`);
  check('лупа подводит ещё ближе', closeUp.zoomed.distance < closeUp.coverage.distance * 0.55,
    `${closeUp.coverage.distance.toFixed(2)} → ${closeUp.zoomed.distance.toFixed(2)} м`);
  check('крупная текстура подгружена к осмотру', Boolean(closeUp.detail) && Math.max(...closeUp.detail) >= 1200, JSON.stringify(closeUp.detail));
  check('взгляд в сторону возвращает на точку',
    closeUp.afterLookAway === null && closeUp.left && closeUp.point === 'p6',
    JSON.stringify({ afterLookAway: closeUp.afterLookAway, point: closeUp.point }));

  // 7в. Осмотр не срывается: цель — полотно, а не точка на полу.
  // Раньше смотрели строго в холст: промах на раму обнулял накопитель, а
  // совпавший по направлению медальон уносил зрителя на другую точку.
  const frameAim = await page.evaluate(async () => {
    const api = window.__HERMITAGE__;
    api.goto('p2');
    api.lookAtExhibit('vangogh');
    await new Promise((r) => setTimeout(r, 400));
    const base = api.pose();
    api.setLook(base.yaw, base.pitch + 0.22); // выше холста — рама и подсветка
    const points = new Set();
    let arrived = null;
    for (let i = 0; i < 1200; i += 1) {
      api.step(1 / 60, 1);
      points.add(api.pose().pointId);
      if (api.closeUp()) { arrived = { sec: i / 60, id: api.closeUp().id }; break; }
    }
    const left = api.closeUp() ? api.exitCloseUp() : null;
    return { arrived, points: [...points], left, hover: api.hover() };
  });
  check('осмотр ловится и по раме, а не только в центр холста',
    Boolean(frameAim.arrived) && frameAim.arrived.id === 'vangogh' && frameAim.arrived.sec <= 11.2,
    `через ${frameAim.arrived ? frameAim.arrived.sec.toFixed(2) : '—'} с, hover ${frameAim.hover ? frameAim.hover.id : '—'}`);
  check('пока в центре полотно, медальоны не уводят на другую точку',
    frameAim.points.length === 1 && frameAim.points[0] === 'p2', JSON.stringify(frameAim.points));

  // 8. VR-режим и золотая вспышка
  await page.setViewport({ width: 1280, height: 720, isMobile: true, hasTouch: true });
  // Смена isMobile/hasTouch перезагружает страницу — дожидаемся готовности заново.
  await page.waitForFunction('window.__READY__ === true', { timeout: 240000, polling: 500 });
  await page.evaluate(() => { window.__HERMITAGE__.enter(); window.__HERMITAGE__.goto('p1'); });
  const vr = await page.evaluate(async () => {
    const api = window.__HERMITAGE__;
    const mode = await api.enterVR();
    api.goto('p1');
    api.lookAtPoint('p5');
    let snap = null;
    for (let i = 0; i < 900; i += 1) {
      snap = api.step(1 / 60, 1);
      if (snap.arrival) break;
    }
    const travel = api.travelInfo();
    return { mode, arrival: snap?.arrival, travel };
  });
  check('вход в VR переключает режим', vr.mode === 'vr', vr.mode);
  check('в VR перенос тоже случается', vr.arrival === 'p5', String(vr.arrival));
  check('в VR перенос — золотая вспышка, а не проход', vr.travel && vr.travel.kind === 'fade', vr.travel?.kind);

  const vrdone = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    const t = api.travelInfo();
    if (!t) return { pose: api.pose(), travel: null };
    api.step(1 / 60, Math.ceil(t.duration * 60) + 12);
    return { pose: api.pose(), travel: api.travelInfo() };
  });
  check('после вспышки камера на новой точке', vrdone.pose.pointId === 'p5' && vrdone.travel === null, vrdone.pose.pointId);

  // 9. В очках нет HUD — медальоны остаются в мире
  const hudInVR = await page.evaluate(() => {
    const hud = document.getElementById('hud');
    const reticle = document.getElementById('reticle');
    const bodyVR = document.body.classList.contains('vr');
    return {
      bodyVR,
      hudDisplay: getComputedStyle(hud).display,
      reticleDisplay: getComputedStyle(reticle).display,
      markers: window.__HERMITAGE__.markers().filter((m) => m.visible).length,
    };
  });
  check('в очках HUD скрыт', hudInVR.bodyVR && hudInVR.hudDisplay === 'none' && hudInVR.reticleDisplay === 'none', JSON.stringify(hudInVR));
  check('медальоны остаются видимыми в мире', hudInVR.markers >= 8, `видимых ${hudInVR.markers}`);

  // 10. Стереопара: кадр отрисован и кадр не пустой
  const stereo = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    api.render();
    const canvas = document.getElementById('hall');
    const gl = canvas.getContext('webgl2');
    const w = canvas.width;
    const h = canvas.height;
    const read = (x) => {
      const px = new Uint8Array(4 * 8);
      gl.readPixels(Math.floor(x), Math.floor(h / 2), 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let sum = 0;
      for (let i = 0; i < px.length; i += 4) sum += px[i] + px[i + 1] + px[i + 2];
      return sum;
    };
    return { w, h, left: read(w * 0.25), right: read(w * 0.75) };
  });
  check('стереопара: оба глаза что-то рисуют', stereo.left > 0 && stereo.right > 0, JSON.stringify(stereo));
  check('стереопара растянута на весь экран', stereo.w >= 1000 && stereo.h >= 600, `${stereo.w}x${stereo.h}`);
  await shot(page, 'evidence/screenshots/e2e/vr-stereo.jpg', 'VR-стереопара');

  // 11. Выход из VR
  const exited = await page.evaluate(() => {
    window.__HERMITAGE__.exitVR();
    return { mode: window.__HERMITAGE__.info().mode, bodyVR: document.body.classList.contains('vr') };
  });
  check('выход из VR возвращает обычный экран', exited.mode === 'explore' && !exited.bodyVR, JSON.stringify(exited));

  // 12. Качество переключается и не ломает кадр
  const quality = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    api.setQuality('low');
    api.render();
    const low = api.info();
    api.setQuality('high');
    api.render();
    const high = api.info();
    return { low: low.quality, high: high.quality, calls: high.drawCalls };
  });
  check('качество переключается вручную', quality.low === 'low' && quality.high === 'high', JSON.stringify(quality));
  check('draw calls в разумном бюджете', quality.calls < 90, `${quality.calls} вызовов`);

  // 13. Кадр в разумном бюджете времени на SwiftShader
  const timing = await page.evaluate(async () => {
    const api = window.__HERMITAGE__;
    const t0 = performance.now();
    for (let i = 0; i < 5; i += 1) {
      api.setLook(api.pose().yaw + 0.05, 0);
      api.render();
    }
    return (performance.now() - t0) / 5;
  });
  check('один кадр рисуется (SwiftShader)', timing < 4000, `${timing.toFixed(0)} мс/кадр`);

  // 14. Глубина и коллизии кадра: камера не внутри геометрии
  const collisions = await page.evaluate(() => {
    const api = window.__HERMITAGE__;
    const bad = [];
    for (const p of api.points()) {
      api.goto(p.id);
      const info = api.info();
      const [x, , z] = info.position;
      if (Math.abs(x) > 8.4 || Math.abs(z) > 5.9) bad.push(`${p.id}:${x.toFixed(1)},${z.toFixed(1)}`);
    }
    return bad;
  });
  check('все точки внутри зала, не в стене', collisions.length === 0, collisions.join(' '));

  // 15. Скриншоты основной серии — на свежей странице без эмуляции телефона
  const shots = await browser.newPage();
  await shots.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await shots.goto(url, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await shots.waitForFunction('window.__READY__ === true', { timeout: 240000, polling: 500 });
  await shots.evaluate(() => window.__HERMITAGE__.enter());
  for (const [id, name] of [['p1', 'общий вид'], ['p2', 'сирень ван Гога'], ['p6', 'Рембрандт'], ['p7', 'Венера']]) {
    await shots.evaluate((pid) => {
      const api = window.__HERMITAGE__;
      api.goto(pid);
      api.step(1 / 60, 2);
      api.render();
    }, id);
    await shot(shots, `evidence/screenshots/e2e/${id}.jpg`, name);
  }
  await shots.close();

  report.errors = errors;
  report.ok = report.checks.every((c) => c.ok) && errors.length === 0;
} catch (err) {
  report.error = String(err);
  report.ok = false;
  console.error('E2E crashed:', err);
} finally {
  fs.writeFileSync(`${out}/e2e.json`, JSON.stringify(report, null, 2));
  await browser.close();
  const passed = report.checks.filter((c) => c.ok).length;
  console.log(`\nE2E: ${passed}/${report.checks.length} проверок, ok=${report.ok}`);
  process.exit(report.ok ? 0 : 1);
}
