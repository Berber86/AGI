// castleqa.mjs — verify the Blender Sugar Castle GLB loads, renders, and its draw-call/tri budget.
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH='/tmp/al2023/lib'; process.env.HOME='/tmp';
const BASE=process.env.BASE||'http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html';
const OUT=process.argv[2]||'/home/user/shots';
const browser=await puppeteer.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox','--hide-scrollbars','--mute-audio','--single-process','--no-zygote','--in-process-gpu','--headless'],defaultViewport:{width:960,height:540,isMobile:true,hasTouch:true}});
const page=await browser.newPage();
const errs=[]; const warns=[];
page.on('pageerror',e=>errs.push(String(e).slice(0,200)));
page.on('console',m=>{ if(m.type()==='error')errs.push(m.text().slice(0,200)); if(m.type()==='warning'&&/model|fallback/i.test(m.text()))warns.push(m.text().slice(0,160)); });
await page.goto(BASE,{waitUntil:'networkidle0',timeout:120000});
await page.waitForFunction('window.__READY__===true',{timeout:120000});
await page.evaluate(()=>{window.__TEST__.pinQuality(2);window.__TEST__.startRace();window.__TEST__.fastForwardCountdown();window.__TEST__.hideHUD();});
const waitFrames=n=>page.evaluate(n=>new Promise(r=>{let c=0;const f=()=>{if(++c>=n)r();else requestAnimationFrame(f);};requestAnimationFrame(f);}),n);

// 1) Verify GLB castle present + budget
const info=await page.evaluate(()=>{
  const {scene}=window.__TEST__.internals();
  const xform=(m,x,y,z)=>[m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]];
  const castles=[];
  scene.traverse(o=>{ if(o.name==='sugarCastleGlb') castles.push(o); });
  const report=castles.map(c=>{
    c.updateMatrixWorld(true);
    let tris=0,calls=0,mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];
    c.traverse(o=>{ if(!o.isMesh)return; calls++; const g=o.geometry;
      tris+=Math.floor((g.index?g.index.count:g.attributes.position.count)/3);
      if(!g.boundingBox)g.computeBoundingBox(); const b=g.boundingBox,e=o.matrixWorld.elements;
      for(const x of[b.min.x,b.max.x])for(const y of[b.min.y,b.max.y])for(const z of[b.min.z,b.max.z]){const p=xform(e,x,y,z);for(let i=0;i<3;i++){mn[i]=Math.min(mn[i],p[i]);mx[i]=Math.max(mx[i],p[i]);}}
    });
    return {center:[(mn[0]+mx[0])/2,(mn[1]+mx[1])/2,(mn[2]+mx[2])/2].map(v=>+v.toFixed(1)),tris,calls,
      hasColor:!!c.children[0].geometry.attributes.color, hasUV:!!c.children[0].geometry.attributes.uv,
      vertexColors:c.children[0].material.vertexColors};
  });
  return {glbCastles:report.length, report, modelFallbackWarns:window.__CKC_MODEL_WARNS__||null};
});
console.log('GLB castles found:', info.glbCastles);
console.log(JSON.stringify(info.report,null,1));
console.log('model fallback warnings:', warns.length?warns.join(' | '):'none');
console.log('page errors:', errs.length?errs.join(' | '):'none');

// 2) Screenshots of the main castle (front + side) using its world center
if(info.report.length){
  const c=info.report[0].center;
  const shots=[
    ['glb-castle-front', c[0], c[1]+8, c[2]+110, c[0], c[1]-6, c[2]],
    ['glb-castle-side', c[0]+85, c[1]+2, c[2], c[0], c[1]-6, c[2]],
  ];
  for(const [name,cx,cy,cz,tx,ty,tz] of shots){
    await page.evaluate(([cx,cy,cz,tx,ty,tz])=>{window.__TEST__.fixCam(+cx,+cy,+cz,+tx,+ty,+tz);window.__TEST__.step(1/60,2,true);},[cx,cy,cz,tx,ty,tz]);
    await waitFrames(6);
    await page.screenshot({path:`${OUT}/${name}.png`});
    console.log('shot',name);
  }
}
await browser.close();
