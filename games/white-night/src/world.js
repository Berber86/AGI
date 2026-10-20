import * as THREE from 'three';
import { revealFrame, REVEAL_SECONDS } from './reveal.js';
import { RUBBISH, windowTreatment } from './environment.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { PRESENTATION, ZOOM, inspectionRect, fitScale, inspectionPose } from './presentation.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { materials as M, canvasTexture, textTexture, pbrMaps, seeded, distress } from './materials.js';
import { RenderPipeline } from './rendering.js';
import { addFacadeDetails, addWindowDetails, addWindowLife, addCourtyardDetails, addBinDetails, addGateFacade, addRoofBand, LIT } from './scenery.js';
import { createNightSky } from './sky.js';
import { box, cyl, ball, torus, mesh, createItem, detailScale } from './models.js';
const rand=seeded(137);
function batch(group){
  group.updateWorldMatrix(true,true);
  const toLocal=new THREE.Matrix4().copy(group.matrixWorld).invert(),batches=new Map();
  group.traverse(o=>{
    if(!o.isMesh||Array.isArray(o.material))return;
    const key=o.material.uuid;let batch=batches.get(key);
    if(!batch){batch={material:o.material,geos:[]};batches.set(key,batch);}
    const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toLocal,o.matrixWorld));
    g.deleteAttribute('uv1');batch.geos.push(g);o.geometry.dispose();
  });
  group.clear();
  for(const {material,geos} of batches.values()){
    const geo=mergeGeometries(geos,false);
    if(geo){const m=new THREE.Mesh(geo,material);m.receiveShadow=!material.transparent;m.castShadow=!material.transparent&&!material.transmission;group.add(m);}
    geos.forEach(g=>g.dispose());
  }
}
export class World {
 constructor(canvas){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  // Render scale is adaptive: the cap is the best the device can show, and a
  // governor lowers only the pixel count (never materials, shadows or AO) when
  // a phone cannot hold the target. Quality settings stay untouched.
  this.maxPixelRatio=Math.min(devicePixelRatio||1,1.75);this.pixelRatio=Math.min(this.maxPixelRatio,1.5);
  this.perf={samples:0,meanMs:0,fps:0,dpr:this.pixelRatio,drops:0,raises:0};
  this.renderer.setPixelRatio(this.pixelRatio);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#16222f');this.scene.fog=new THREE.FogExp2('#1c2b3a',.0118);
  // Static white-night sky with stars and a moon. Four draw calls in total and
  // no per-frame work: the dome, the star points, the moon and its halo.
  this.sky=createNightSky();this.scene.add(this.sky.group);
  this.camera=new THREE.PerspectiveCamera(46,1,.1,70);this.scene.add(this.camera);
   this.eyeL=new THREE.PerspectiveCamera(62,1,.1,70);this.eyeR=new THREE.PerspectiveCamera(62,1,.1,70);this.vrStereo=false;this.vrInspectLock=false;this.baseCameraPosition=new THREE.Vector3();this.baseCameraQuaternion=new THREE.Quaternion();this.lockedCameraQuaternion=new THREE.Quaternion();this.headLook={yaw:0,pitch:0};this.headInspectBase=null;this.headInspectRotation=null;this.normalStage=null;
  const pmrem=new THREE.PMREMGenerator(this.renderer);const room=new RoomEnvironment();this.envTarget=pmrem.fromScene(room,.03);this.scene.environment=this.envTarget.texture;this.scene.environmentIntensity=.15;room.dispose();pmrem.dispose();
  // White night: a cold moon from high above, a weak cool bounce, and warm sodium
  // spill from the street. The light count is unchanged on purpose - a point light
  // costs every lit fragment, so warmth comes from emissive surfaces instead.
  this.hemi=new THREE.HemisphereLight(0x8aabd6,0x141e27,1.12);this.scene.add(this.hemi);
  const sun=new THREE.DirectionalLight(0xa9c8f0,1.62);sun.position.set(-6,11,2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-6;sun.shadow.normalBias=.012;sun.shadow.bias=-.00025;sun.shadow.radius=3;this.scene.add(sun);this.sun=sun;
  const fill=new THREE.DirectionalLight(0x51739c,.62);fill.position.set(5,5,-4);this.scene.add(fill);
  this.static=new THREE.Group();this.scene.add(this.static);
  // Scenery is authored with reduced subdivisions: walls, mouldings, leaves and
  // pipes never need the tessellation a hero find needs. The models keep full
  // detail because they are examined up close.
  detailScale(.5);this.buildCourtyard();detailScale(1);batch(this.static);
  this.bin=new THREE.Group();this.scene.add(this.bin);this.buildBin();this.bin.rotation.y=-.18;
  // A depth-tested veil sits BEHIND the find, not over it like a CSS filter.
  // It uses no additional render target or blur pass, including in low quality.
  this.inspectionVeil=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0x172b3c,transparent:true,opacity:.96,depthWrite:false,toneMapped:false,fog:false}));
  this.inspectionVeil.position.z=-6;this.inspectionVeil.visible=false;this.inspectionVeil.renderOrder=-10;this.camera.add(this.inspectionVeil);
  this.silhouette=new THREE.Group();this.silhouetteMat=new THREE.MeshBasicMaterial({color:0x101d2b,transparent:true,opacity:1,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  this.itemAnchor=new THREE.Group();this.camera.add(this.itemAnchor);this.itemAnchor.position.set(0,0,-4.2);
  const shadowTex=canvasTexture((c,s2)=>{const g=c.createRadialGradient(s2/2,s2/2,0,s2/2,s2/2,s2/2);g.addColorStop(0,'rgba(3,7,11,.62)');g.addColorStop(.55,'rgba(3,7,11,.34)');g.addColorStop(1,'rgba(3,7,11,0)');c.fillStyle=g;c.fillRect(0,0,s2,s2);},128);
  this.itemShadow=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,toneMapped:false}));
  this.itemShadow.renderOrder=-5;this.itemShadow.visible=false;this.itemAnchor.add(this.itemShadow);this.inspectLamp=new THREE.PointLight(0xfff4e7,17,9,2);this.inspectLamp.position.set(-1.5,2,-1.8);this.camera.add(this.inspectLamp);this.inspectLamp.visible=false;
  this.itemRim=new THREE.PointLight(0xc5e3ff,18,8,2);this.itemRim.position.set(1.6,.7,-3.8);this.camera.add(this.itemRim);this.itemRim.visible=false;
  this.pipeline=new RenderPipeline(this.renderer,this.scene,this.camera,{samples:matchMedia('(pointer: coarse)').matches?2:4});this.thumbnailOutput=new OutputPass();
  this.modelCache=new Map();this.thumbCache=new Map();this.item=null;this.zoom=1;this.targetX=.08;this.targetY=-.2;this.inspect=false;this.time=0;this.kick=0;this.pointer=new THREE.Vector2();this.raycaster=new THREE.Raycaster();this.frames=[];this.low=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
  this.motionQuery.addEventListener('change',e=>{this.reduced=e.matches;if(e.matches){this.finishReveal();this.kick=0;}this.dirty=true;});
  this.resize();
 }
 buildCourtyard(){
  const groundMat=new THREE.MeshStandardMaterial({...pbrMaps('courtyard-stone',[18,18]),normalScale:new THREE.Vector2(1.2,1.2),roughness:.7,metalness:.13,color:0x9aa0a2});mesh(new THREE.PlaneGeometry(38,38),groundMat,this.static,[0,-.03,0],[-Math.PI/2,0,0]);
  const plaster=new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/plaster.jpg`);plaster.colorSpace=THREE.SRGBColorSpace;plaster.wrapS=plaster.wrapT=THREE.RepeatWrapping;plaster.repeat.set(3,3);plaster.anisotropy=4;
  const wall=new THREE.MeshStandardMaterial({map:plaster,color:0x8a877b,roughness:.92,bumpMap:plaster,bumpScale:.065});const side=wall.clone();side.color.set(0x79837f);const stone=new THREE.MeshStandardMaterial({color:0x7d827a,roughness:.9});const trim=new THREE.MeshStandardMaterial({color:0xa3a496,roughness:.84});const dark=new THREE.MeshStandardMaterial({color:0x2c3630,roughness:.78});const roof=new THREE.MeshStandardMaterial({color:0x252e33,metalness:.32,roughness:.74});
  const reflected=canvasTexture((c,s)=>{const sky=c.createLinearGradient(0,0,s,s);sky.addColorStop(0,'#788b91');sky.addColorStop(.48,'#495b60');sky.addColorStop(1,'#1d302c');c.fillStyle=sky;c.fillRect(0,0,s,s);c.save();c.transform(1,.16,-.07,1,0,0);for(let x=-30;x<s;x+=94){c.fillStyle='#283b3a';c.fillRect(x,70,65,s);for(let y=94;y<s;y+=104){c.fillStyle='#83938b';c.globalAlpha=.24;c.fillRect(x+6,y,24,66);c.fillRect(x+34,y,24,66);}}c.restore();const sheen=c.createLinearGradient(0,0,s,s*.8);sheen.addColorStop(0,'rgba(238,246,238,.20)');sheen.addColorStop(.38,'rgba(238,246,238,.03)');sheen.addColorStop(.62,'rgba(238,246,238,0)');c.fillStyle=sheen;c.beginPath();c.moveTo(0,s);c.lineTo(s*.52,0);c.lineTo(s*.78,0);c.lineTo(s*.24,s);c.closePath();c.fill();c.fillStyle='rgba(18,31,31,.55)';c.beginPath();c.moveTo(0,82);c.lineTo(120,38);c.lineTo(150,38);c.lineTo(150,12);c.lineTo(178,12);c.lineTo(178,34);c.lineTo(335,66);c.lineTo(360,30);c.lineTo(386,30);c.lineTo(386,72);c.lineTo(512,96);c.lineTo(512,0);c.lineTo(0,0);c.closePath();c.fill();c.fillStyle='rgba(255,190,110,.5)';for(let i=0;i<24;i++)c.fillRect(28+(i*67)%470,150+(i*89)%300,7,10);});
  const glassMats=[0x687d7c,0x859794,0x9eaea4,0x465957].map(c=>new THREE.MeshStandardMaterial({color:c,map:reflected,metalness:.24,roughness:.28}));const lit=LIT;
  const facade=(width,height,pos,rotation,mat)=>{
   const g=new THREE.Group();g.position.set(...pos);g.rotation.y=rotation;this.static.add(g);
   box(g,[width,height,.65],[0,height/2,0],mat,0);box(g,[width,.75,.78],[0,.375,.025],stone,0);
   for(const y of [3.2,6.15,9.1,12.1]){box(g,[width,.14,.87],[0,y,.055],trim,0);box(g,[width,.07,.98],[0,y+.09,.08],stone,0);}
   box(g,[width,.35,1.06],[0,height-.12,.05],trim,0);
   addFacadeDetails(g,width,height,rotation===0?0:rotation>0?37:73);
   addRoofBand(g,width,height,roof,trim);
   let cols=Math.floor(width/2.45);for(let col=0;col<cols;col++)for(let row=0;row<4;row++){
    let x=(col-(cols-1)/2)*2.47,y=1.72+row*2.95;if(rotation===0&&row===0&&Math.abs(x+3.8)<1.2)continue;const w=1.16,h=1.91;
    box(g,[w+.26,h+.27,.14],[x,y,.38],trim,0);box(g,[w+.05,h+.06,.1],[x,y,.47],dark,0);const treatment=windowTreatment(col,row,rotation===0?0:rotation>0?1:2);
    const glazing=treatment==='lit'?lit:glassMats[(col+row)%glassMats.length];box(g,[w,h,.04],[x,y,.54],glazing,0);
    for(const dx of [-w/2,w/2,0])box(g,[.048,h,.09],[x+dx,y,.58],stone,0);for(const dy of [-h/2,h/2,.24])box(g,[w,.047,.09],[x,y+dy,.58],stone,0);box(g,[w+.4,.12,.43],[x,y-h/2-.09,.55],trim,0);
    addWindowDetails(g,x,y,w,h,stone,dark,trim);
    addWindowLife(g,x,y,w,h,treatment,trim,glazing,(rotation>0?100:200)+row*10+col);
   }
   // Drainpipes, fixing collars and irregular patched plaster.
   for(const x of [-width/2+.35,width/2-.38]){cyl(g,.07,.07,height,[x,height/2,.53],dark,[0,0,0],12);for(let y=1;y<height;y+=2)cyl(g,.087,.087,.055,[x,y,.53],M.rust,[0,0,0],12);}
   for(let i=0;i<13;i++){const x=(rand()-.5)*width,y=.8+rand()*.3;box(g,[.2+rand()*.7,.06+rand()*.14,.02],[x,y,.335],stone,0);}
   return g;
  };
  // Three plain sides and the fourth - the street passage - straight ahead of
  // the default camera. The courtyard is now a closed well: four walls, one arch.
  facade(20,14,[-8,0,1.5],Math.PI/2,side);facade(20,14,[9,0,1.5],-Math.PI/2,wall);
  facade(20,13.5,[.5,0,11.6],Math.PI,wall);
  const gateWall=new THREE.Group();gateWall.position.set(0,0,-7);this.static.add(gateWall);
  addGateFacade(gateWall,{width:20,height:13.5,stone,trim,dark,wall,glass:glassMats,lit,seed:101,gateX:1.55});
  addRoofBand(gateWall,20,13.5,roof,trim);
  // Address enamel plaque and utility fittings beside the passage.
  const plate=new THREE.MeshStandardMaterial({map:textTexture('',{bg:'#263e4c',color:'#ebe8d7',lines:['ДОХОДНЫЙ ДОМ','17'],font:76}),roughness:.42});box(this.static,[.8,.6,.07],[-2.75,2.5,-6.51],M.black);mesh(new THREE.PlaneGeometry(.75,.55),plate,this.static,[-2.75,2.5,-6.465]);
  box(this.static,[.85,1.25,.15],[4.1,1.4,-6.53],stone,.03);box(this.static,[.74,1.14,.025],[4.1,1.4,-6.44],dark,.005);for(let i=0;i<6;i++)box(this.static,[.45,.025,.015],[4.1,1.65+i*.07,-6.415],M.black,0);
  // Gas pipe follows the facade.
  cyl(this.static,.036,.036,18,[0,5.35,-6.48],M.rust,[0,0,Math.PI/2],12);
  // Cables stretched high above the courtyard.
  for(let j=0;j<2;j++){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-8,9+j,2),new THREE.Vector3(0,7.8+j,1),new THREE.Vector3(9,9+j,-1)]);mesh(new THREE.TubeGeometry(curve,24,.012,4,false),M.black,this.static);}
  // Kerbs, damp seams and scattered leaves.
  for(const x of [-7.2,8.2])box(this.static,[.24,.17,22],[x,.065,0],stone,.025);
  const leafMat=new THREE.MeshStandardMaterial({color:0x7f6940,roughness:1,side:THREE.DoubleSide});for(let i=0;i<50;i++){let x=(rand()-.5)*13,z=(rand()-.5)*14;mesh(new THREE.CircleGeometry(.025+rand()*.035,5),leafMat,this.static,[x,.008,z],[-Math.PI/2,rand()*3,rand()*6]);}
  // Soft damp patches are reflective but never perfect mirrors.
  const wet=new THREE.MeshStandardMaterial({color:0x24384a,emissive:0x16293c,emissiveIntensity:.5,transparent:true,opacity:.55,roughness:.07,metalness:.85,depthWrite:false});for(let i=0;i<10;i++){const m=mesh(new THREE.CircleGeometry(.55+rand(),40),wet,this.static,[(rand()-.5)*10,.005,(rand()-.5)*9],[-Math.PI/2,0,0]);m.scale.set(1.8,.35+rand()*.45,1);}
  this.buildProps();addCourtyardDetails(this.static,this.scene);
 }
 buildProps(){
  const g=this.static;const bagMat=new THREE.MeshStandardMaterial({color:0x19251d,roughness:.64,metalness:.03,bumpMap:M.leather.bumpMap,bumpScale:.005});
  for(const {x,z,scale:s} of RUBBISH){
    const profile=[[0,0],[.29,.015],[.47,.06],[.54,.29],[.49,.56],[.37,.82],[.15,1],[.062,1.11],[.02,1.14]].map(([a,b])=>new THREE.Vector2(a*s*1.7,b*s*1.55));
    const geo=new THREE.LatheGeometry(profile,64),p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const px=p.getX(i),y=p.getY(i),pz=p.getZ(i),a=Math.atan2(pz,px);const crease=1+.08*Math.sin(a*13+y*12)+.045*Math.sin(a*21-y*7);p.setXYZ(i,px*crease,y,pz*crease);}geo.computeVertexNormals();mesh(geo,bagMat,g,[x,.02,z]);
    torus(g,.066*s,.018,[x,s*1.66,z],M.black,[Math.PI/2,0,0]);
    for(let i=0;i<3;i++)box(g,[.042,.16,.027],[x+Math.sin(i*2)*.04,s*1.84,z+Math.cos(i*2)*.035],bagMat,.006,[.2,i*2,.23]);
  }
  // Abandoned bicycle near the back wall.
  const bike=new THREE.Group();bike.position.set(3.5,.63,-5.84);bike.rotation.z=-.1;g.add(bike);for(const x of [-.68,.68]){torus(bike,.48,.038,[x,0,0],M.black);torus(bike,.44,.014,[x,0,0],M.silver);for(let i=0;i<12;i++){let a=i*Math.PI/6;const start=new THREE.Vector3(x,0,0),end=new THREE.Vector3(x+Math.cos(a)*.44,Math.sin(a)*.44,0);const path=new THREE.LineCurve3(start,end);mesh(new THREE.TubeGeometry(path,1,.004,3),M.silver,bike);}}
  const connect=(a,b)=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);mesh(new THREE.TubeGeometry(new THREE.LineCurve3(start,end),1,.025,6),M.red,bike);};for(const [a,b] of [[[-.68,0,0],[-.2,.65,0]],[[-.2,.65,0],[.13,0,0]],[[.13,0,0],[-.68,0,0]],[[-.2,.65,0],[.5,.6,0]],[[.5,.6,0],[.13,0,0]],[[.5,.6,0],[.68,0,0]],[[.5,.6,0],[.48,.85,0]]])connect(a,b);box(bike,[.32,.07,.16],[-.23,.72,0],M.black);box(bike,[.3,.035,.04],[.57,.86,0],M.silver);
  const crateMat=new THREE.MeshStandardMaterial({color:0x7b745c,roughness:1});box(g,[.9,.49,.7],[-3.3,.25,-2.6],crateMat,.02);for(let i=0;i<3;i++)box(g,[.92,.016,.018],[-3.3,.12+i*.16,-2.24],M.black,0);
  const newspaper=createItem('paper');newspaper.scale.setScalar(.32);newspaper.rotation.set(-Math.PI/2,0,.35);newspaper.position.set(2.0,.04,.7);g.add(newspaper);
  const bottle=createItem('bottle');bottle.traverse(o=>{if(o.isMesh&&o.material.transmission){o.material=o.material.clone();o.material.transmission=0;o.material.transparent=true;o.material.opacity=.72;o.material.color.set(0x446e43);}});bottle.scale.setScalar(.32);bottle.rotation.set(0,0,Math.PI/2+.05);bottle.position.set(-1.9,.11,1.35);g.add(bottle);
 }
 buildBin(){
  const g=this.bin;const steel=new THREE.MeshStandardMaterial({...pbrMaps('steel-paint'),normalScale:new THREE.Vector2(.65,.65),roughness:.83,metalness:.35,color:0xc2d0ba});this.binMaterial=steel;
  const edge=steel.clone();edge.color.set(0x72856b);const lidmat=new THREE.MeshStandardMaterial({color:0x263c2d,roughness:.58,metalness:.06,bumpMap:M.leather.bumpMap,bumpScale:.007});
  const bodyGeo=new THREE.BoxGeometry(2.55,1.6,1.7,20,12,12);const p=bodyGeo.attributes.position;for(let i=0;i<p.count;i++){let y=p.getY(i);const t=.9+(y+.8)*.0625;p.setX(i,p.getX(i)*t);p.setZ(i,p.getZ(i)*t);if(Math.abs(p.getZ(i))>.7)p.setZ(i,p.getZ(i)+-.026*Math.exp(-((p.getX(i)-.35)**2+(y-.1)**2)*9));}bodyGeo.computeVertexNormals();mesh(bodyGeo,steel,g,[0,1.22,0]);
  box(g,[2.68,.105,1.83],[0,2.02,0],edge,.035);box(g,[2.34,.075,1.55],[0,.4,0],edge,.02);
  for(const x of [-1.08,1.08]){box(g,[.055,1.51,.05],[x,1.2,.812],edge,.008);box(g,[.055,1.5,.05],[x,1.2,-.813],edge,.008);}
  for(const x of [-.69,.69]){box(g,[.044,1.22,.054],[x,1.26,.849],edge,.008);box(g,[.044,1.22,.054],[x,1.26,-.849],edge,.008);}
  for(const x of [-1.275,1.275]){box(g,[.06,.065,1.25],[x,1.65,0],edge);box(g,[.065,1.3,.05],[x,1.23,.5],edge);box(g,[.065,1.3,.05],[x,1.23,-.5],edge);box(g,[.19,.18,.7],[x,1.7,0],edge);box(g,[.06,.08,.6],[x*1.11,1.7,0],M.silver);}
  // Rubber caster wheels and galvanized forks.
  for(const x of [-.95,.95])for(const z of [-.58,.58]){box(g,[.15,.19,.12],[x,.35,z],M.silver);cyl(g,.18,.18,.15,[x,.19,z],M.black,[0,0,Math.PI/2],28);cyl(g,.067,.067,.16,[x,.19,z],M.silver,[0,0,Math.PI/2],24);}
  this.lid=new THREE.Group();this.lid.position.set(0,2.08,-.92);g.add(this.lid);box(this.lid,[2.79,.13,1.99],[0,.03,.94],lidmat,.065);for(let i=-4;i<=4;i++)box(this.lid,[.065,.07,1.66],[i*.27,.11,.94],edge,.026);box(this.lid,[.65,.09,.1],[0,.045,1.99],M.black,.025);for(const x of [-.87,.87])cyl(g,.095,.095,.31,[x,2.06,-.93],M.silver,[0,0,Math.PI/2]);
  const stencilMap=canvasTexture((c,w,r)=>{c.fillStyle='#cac9ad';c.textAlign='center';c.font='bold 110px Arial';c.fillText('Т Б О',w/2,220);c.font='bold 82px Arial';c.fillText('№ 017',w/2,347);c.globalCompositeOperation='destination-out';for(let i=0;i<1600;i++){c.globalAlpha=r()*.7;c.fillRect(r()*w,r()*w,1+r()*4,1+r()*3);}});
  const stencil=new THREE.MeshStandardMaterial({map:stencilMap,transparent:true,depthWrite:false,roughness:.9});mesh(new THREE.PlaneGeometry(.73,.56),stencil,g,[.62,1.31,.865]);
  const sticker=new THREE.MeshStandardMaterial({map:textTexture('',{bg:'#d7d2b6',color:'#464c3c',lines:['БЕРЕГИТЕ','ПЕТЕРБУРГ'],font:58}),roughness:.94});mesh(new THREE.PlaneGeometry(.39,.3),sticker,g,[-.92,1.65,.871],[0,0,-.09]);
  const warning=canvasTexture((ctx,s)=>{ctx.fillStyle='#d3cdb5';ctx.fillRect(0,0,s,s);ctx.fillStyle='#93493c';for(let x=-s;x<s*2;x+=130){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+64,0);ctx.lineTo(x+s+64,s);ctx.lineTo(x+s,s);ctx.fill();}distress(ctx,s,s,seeded(25),5000);});const stripe=new THREE.MeshStandardMaterial({map:warning,roughness:.75});for(const x of [-1.1,1.1])mesh(new THREE.PlaneGeometry(.16,.53),stripe,g,[x,1.33,.847]);
  const shadow=canvasTexture((ctx,s)=>{const grad=ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s*.48);grad.addColorStop(0,'rgba(0,8,4,.8)');grad.addColorStop(.5,'rgba(0,8,4,.5)');grad.addColorStop(1,'rgba(0,8,4,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,s,s);},128);mesh(new THREE.PlaneGeometry(4.5,3.5),new THREE.MeshBasicMaterial({map:shadow,transparent:true,depthWrite:false}),g,[0,.012,0],[-Math.PI/2,0,0]);
  addBinDetails(g,this.lid,steel);g.remove(this.lid);batch(g);batch(this.lid);g.add(this.lid);
 }
 // Free look in the plain (non-VR) search view: swipe up raises the head to the
 // sky, swipe right turns right, and the bin stays tappable because hit testing
 // uses this same camera. Yaw is bounded so the well never turns its back.
 lookBy(dx,dy){
  if(this.vrStereo)return this.headLook;
  this.headLook.yaw=THREE.MathUtils.clamp(this.headLook.yaw+dx*.0022,-.72,.72);
  this.headLook.pitch=THREE.MathUtils.clamp(this.headLook.pitch-dy*.0022,-.16,1.05);
  this.applyCameraPose();this.dirty=true;return this.headLook;
 }
 resetLook(){this.headLook={yaw:0,pitch:0};this.applyCameraPose();this.dirty=true;return this.headLook;}
 lookInfo(){const d=THREE.MathUtils.radToDeg;return {yawDeg:+d(this.headLook.yaw).toFixed(1),pitchDeg:+d(this.headLook.pitch).toFixed(1)};}
 setView(view){this.viewOverride=view||null;this.resize();return {fov:this.camera.fov,position:this.camera.position.toArray(),quaternion:this.camera.quaternion.toArray()};}
 resize(){
  this.dirty=true;const w=innerWidth,h=innerHeight;
  this.renderer.setSize(w,h);this.camera.aspect=w/h;
  const portrait=w/h<.8;this.camera.fov=portrait?52:43;
  // The portrait frame is narrow, so the search view steps back far enough to show
  // the yard (well, lamps, arch) instead of a close-up of one bin. The inspection
  // item is anchored in camera space, so this only reframes the courtyard.
  const landscape=!portrait&&h<=520&&w>650,wide=!portrait&&!landscape&&w>1050;
  this.camera.position.set(landscape?4.15:wide?4.3:portrait?2.6:4.2,landscape?2.65:wide?3.4:portrait?3.5:3.55,landscape?8.1:wide?7.4:portrait?10.3:7.8);
  this.camera.lookAt(landscape?.25:wide?.6:portrait?.9:0,landscape?1.32:wide?2.65:portrait?2.6:2.4,0);
  if(this.viewOverride){const {fov=this.camera.fov,position,target}=this.viewOverride;this.camera.fov=fov;if(position)this.camera.position.set(...position);if(target)this.camera.lookAt(...target);}
  this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld(true);this.baseCameraPosition.copy(this.camera.position);this.baseCameraQuaternion.copy(this.camera.quaternion);this.applyCameraPose();
  this.portrait=portrait;const styles=getComputedStyle(document.documentElement);
  this.stage=inspectionRect(w,h,parseFloat(styles.getPropertyValue('--safe-top'))||0,parseFloat(styles.getPropertyValue('--safe-bottom'))||0);this.normalStage={...this.stage};if(this.vrStereo){const side=Math.min(w/2,h)*.72;this.stage={x:(w/2-side)/2,y:(h-side)/2,width:side,height:side};}
  const perPixel=2*4.2*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))/h;
  if(this.vrStereo)this.itemAnchor.position.set(0,0,-4.2);else this.itemAnchor.position.set((this.stage.x+this.stage.width/2-w/2)*perPixel,(h/2-this.stage.y-this.stage.height/2)*perPixel,-4.2);
  this.inspectionVeil.scale.set(2*6*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))*w/h,2*6*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2)),1);
  document.querySelector('#app').style.setProperty('--stage-bottom',`${this.stage.y+this.stage.height}px`);
  this.updateItemLights();if(this.item)this.fitItem();
  this.pipeline?.resize(w,h,this.renderer.getPixelRatio());
 }
 fitItem(){
  const bounds=this.item.userData.bounds;
  const box=new THREE.Box3(new THREE.Vector3(...bounds.min),new THREE.Vector3(...bounds.max));
  box.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.item.rotation));
  const size=box.getSize(new THREE.Vector3()).multiplyScalar(.5);
  this.baseScale=this.vrStereo?((2*4.2*Math.tan(THREE.MathUtils.degToRad(31))*.56)/Math.max(.001,Math.max(size.x,size.y)*2)):fitScale(size,this.stage,innerHeight,this.camera.fov,4.2,innerWidth);
  this.item.scale.setScalar(this.baseScale*this.zoom);
  const s=this.baseScale*this.zoom;
  this.itemShadow.scale.set(Math.max(size.x*s*2.5,.3),Math.max(size.x*s*.85,.16),1);
  this.itemShadow.position.set(0,-size.y*s-.05,-.3);
 }
 inspectionBounds(){
  if(!this.item)return null;
  this.scene.updateMatrixWorld(true);
  const b=this.item.userData.bounds,bounds=new THREE.Box3(new THREE.Vector3(...b.min),new THREE.Vector3(...b.max)),points=[];
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
   const p=new THREE.Vector3(x,y,z).applyMatrix4(this.item.matrixWorld).project(this.camera);points.push({x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2});
  }
  return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y)),stage:this.stage};
 }
 poke(step=1){this.kick=this.reduced?0:1;this.kickAmp=[.12,.24,.42][Math.min(2,Math.max(0,step-1))];this.dirty=true;}
 applyCameraPose(){
   if(!this.baseCameraPosition)return;this.camera.position.copy(this.baseCameraPosition);
   if(this.vrInspectLock)this.camera.quaternion.copy(this.lockedCameraQuaternion);
   else{this.camera.quaternion.copy(this.baseCameraQuaternion);this.camera.rotateY(-this.headLook.yaw);this.camera.rotateX(this.headLook.pitch);}
   this.camera.updateMatrixWorld(true);
  }
  setVrStereo(on){this.vrStereo=!!on;this.static.visible=true;if(!on){this.vrInspectLock=false;this.headInspectBase=null;this.headInspectRotation=null;}this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,innerWidth,innerHeight);this.applyCameraPose();this.resize();this.dirty=true;}
  setHeadLook(yaw=0,pitch=0){this.headLook={yaw:Number.isFinite(yaw)?yaw:0,pitch:Number.isFinite(pitch)?pitch:0};
   if(this.vrInspectLock&&this.item&&this.headInspectBase&&this.headInspectRotation){const dyaw=THREE.MathUtils.euclideanModulo(this.headLook.yaw-this.headInspectBase.yaw+Math.PI,Math.PI*2)-Math.PI;this.targetY=this.headInspectRotation.y+dyaw*1.5;this.targetX=THREE.MathUtils.clamp(this.headInspectRotation.x-(this.headLook.pitch-this.headInspectBase.pitch)*1.5,-Math.PI,Math.PI);this.pose='head';}
   else this.applyCameraPose();this.dirty=true;return this.vrInfo();}
  lockInspectionView(){this.lockedCameraQuaternion.copy(this.camera.quaternion);this.vrInspectLock=true;this.headInspectBase={...this.headLook};this.headInspectRotation={x:this.targetX,y:this.targetY,z:this.targetZ};this.applyCameraPose();this.dirty=true;return this.vrInfo();}
  unlockInspectionView(){this.vrInspectLock=false;this.headInspectBase=null;this.headInspectRotation=null;this.applyCameraPose();this.dirty=true;return this.vrInfo();}
  syncEyeCameras(w=innerWidth,h=innerHeight){const aspect=Math.max(.1,(w/2)/Math.max(1,h));for(const [eye,side] of [[this.eyeL,-1],[this.eyeR,1]]){eye.aspect=aspect;eye.fov=62;eye.updateProjectionMatrix();eye.position.copy(this.camera.position);eye.quaternion.copy(this.camera.quaternion);eye.position.add(new THREE.Vector3(side*.032,0,0).applyQuaternion(this.camera.quaternion));eye.updateMatrixWorld(true);}}
  renderStereo(){const w=innerWidth,h=innerHeight,half=Math.floor(w/2);this.syncEyeCameras(w,h);this.renderer.setScissorTest(true);this.renderer.setViewport(0,0,half,h);this.renderer.setScissor(0,0,half,h);this.renderer.render(this.scene,this.eyeL);this.renderer.setViewport(half,0,w-half,h);this.renderer.setScissor(half,0,w-half,h);this.renderer.render(this.scene,this.eyeR);this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,w,h);}
  gazeHitsBin(){this.camera.updateMatrixWorld(true);this.pointer.set(0,0);this.raycaster.setFromCamera(this.pointer,this.camera);return this.raycaster.intersectObject(this.bin,true).length>0;}
  vrInfo(){const d=THREE.MathUtils.radToDeg;return {stereo:!!this.vrStereo,inspectLock:!!this.vrInspectLock,yawDeg:+d(this.headLook.yaw).toFixed(2),pitchDeg:+d(this.headLook.pitch).toFixed(2),targetX:+d(this.targetX||0).toFixed(2),targetY:+d(this.targetY||0).toFixed(2),stage:this.stage,cameraQuaternion:this.camera.quaternion.toArray().map(v=>+v.toFixed(5))};}
  hitBin(x,y){this.pointer.set(x/innerWidth*2-1,-y/innerHeight*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);return this.raycaster.intersectObject(this.bin,true).length>0;}
 binScreen(){this.camera.updateMatrixWorld(true);const p=new THREE.Vector3(0,1.2,0).project(this.camera);return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};}
 // The left edge of the bin, used to anchor the callout to the bin itself.
 binEdge(){this.camera.updateMatrixWorld(true);const p=new THREE.Vector3(-1.26,1.12,.22).project(this.camera);return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};}
 getModel(id){if(!this.modelCache.has(id))this.modelCache.set(id,createItem(id));return this.modelCache.get(id);}
 show(id,{review=false}={}){
  this.dirty=true;this.testRevealHold=false;this.zoom=1;this.headLook={yaw:0,pitch:0};this.applyCameraPose();if(this.item){this.item.remove(this.silhouette);this.itemAnchor.remove(this.item);}this.silhouette.clear();
  this.itemId=id;this.pose='front';this.item=this.getModel(id);this.itemAnchor.add(this.item);
  this.inspectLamp.intensity=PRESENTATION[id].lamp??17;this.itemRim.intensity=PRESENTATION[id].rim??18;
  this.updateItemLights();
  this.item.rotation.set(...PRESENTATION[id].rotation);this.targetX=this.item.rotation.x;this.targetY=this.item.rotation.y;this.targetZ=this.item.rotation.z;
  this.fitItem();this.inspect=true;this.inspectionVeil.visible=true;this.inspectLamp.visible=true;this.itemRim.visible=true;this.itemShadow.visible=true;
  const meshes=[];this.item.traverse(o=>{if(o.isMesh){o.castShadow=false;meshes.push(o);}});
  if(!this.reduced&&!review){
    this.item.updateMatrixWorld(true);const inverseRoot=this.item.matrixWorld.clone().invert();
    for(const o of meshes){const m=new THREE.Mesh(o.geometry,this.silhouetteMat);m.matrix.multiplyMatrices(inverseRoot,o.matrixWorld);m.matrixAutoUpdate=false;m.renderOrder=10;this.silhouette.add(m);}this.item.add(this.silhouette);
  }
  this.reveal=this.reduced||review?1:0;this.applyReveal();if(this.vrStereo)this.lockInspectionView();
 }
 hide(){this.testRevealHold=false;this.dirty=true;this.static.visible=true;if(this.item){this.item.visible=true;this.item.remove(this.silhouette);this.itemAnchor.remove(this.item);}this.silhouette.clear();this.reveal=1;this.item=null;this.inspect=false;this.inspectionVeil.visible=false;this.inspectLamp.visible=false;this.itemRim.visible=false;this.itemShadow.visible=false;this.vrInspectLock=false;this.headInspectBase=null;this.headInspectRotation=null;this.applyCameraPose();}
 finishReveal(){this.testRevealHold=false;this.reveal=1;this.applyReveal();this.dirty=true;}
 applyReveal(){
  this.revealState=revealFrame(this.reveal,this.reduced);
  if(!this.item)return;const f=this.revealState;
  // Behind a 96% veil the yard is invisible, so it stops being drawn: the
  // inspection frame renders the find and the bin, not a hidden courtyard.
  this.static.visible=!(f.ready&&!this.vrStereo);
  this.item.visible=f.visible;this.silhouette.visible=!f.ready;this.silhouetteMat.opacity=f.silhouette;
  this.inspectionVeil.material.opacity=f.veil;
  this.item.scale.setScalar(this.baseScale*(this.zoom||1)*f.scale);
 }
 updateItemLights(){
  const p=PRESENTATION[this.itemId]?.lightPosition??[-1.5,2,-1.8];
  this.inspectLamp.position.set(this.itemAnchor.position.x+p[0],this.itemAnchor.position.y+p[1],p[2]);
  this.itemRim.position.set(this.itemAnchor.position.x+1.6,this.itemAnchor.position.y+.7,-3.8);
 }
 setPose(pose){if(!this.item||!this.revealState.ready)return;[this.targetX,this.targetY,this.targetZ]=inspectionPose(this.itemId,pose);this.pose=pose;this.dirty=true;}
 setZoom(delta){this.zoom=THREE.MathUtils.clamp(Math.round((this.zoom+delta)*100)/100,ZOOM.min,ZOOM.max);this.dirty=true;return this.zoom;}
 rotate(dx,dy){this.pose='free';this.dirty=true;this.targetY+=dx*.011;this.targetX=THREE.MathUtils.clamp(this.targetX+dy*.01,-Math.PI,Math.PI);}
 setQuality(low){this.low=low;this.pipeline.low=low;this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.5));this.renderer.shadowMap.enabled=!low;this.renderer.shadowMap.needsUpdate=true;
  this.sun.intensity=low?2.05:1.62;this.hemi.intensity=low?.82:1.12;this.scene.environmentIntensity=low?.07:.15;this.resize();}
 thumbnail(id){
  if(this.thumbCache.has(id))return this.thumbCache.get(id);
  const model=this.getModel(id),prev=model.parent,scale=model.scale.clone(),rot=model.rotation.clone(),pos=model.position.clone();
  const scene=new THREE.Scene();scene.background=new THREE.Color('#22343c');
  scene.environment=this.envTarget.texture;scene.environmentIntensity=.45;
  scene.add(new THREE.HemisphereLight(0xe5efff,0x7e7970,1.1));
  const light=new THREE.DirectionalLight(0xfff0dd,2);light.position.set(-3,5,4);scene.add(light);
  const rim=new THREE.DirectionalLight(0xbcdcff,.8);rim.position.set(3,1,-2);scene.add(rim);
  // Readback must be display-encoded, not untreated linear bytes in a PNG.
  const hdr=new THREE.WebGLRenderTarget(160,160,{type:THREE.HalfFloatType});
  const rt=new THREE.WebGLRenderTarget(160,160,{depthBuffer:false}),old=this.renderer.getRenderTarget();
  const oldColor=this.renderer.getClearColor(new THREE.Color()),oldAlpha=this.renderer.getClearAlpha();
  let url;
  try{
   scene.add(model);model.position.set(0,0,0);model.rotation.set(...PRESENTATION[id].rotation);model.scale.setScalar(1);
   const b=model.userData.bounds,box=new THREE.Box3(new THREE.Vector3(...b.min),new THREE.Vector3(...b.max));
   box.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(model.rotation));
   const half=box.getSize(new THREE.Vector3()).multiplyScalar(.5);
   model.scale.setScalar(fitScale(half,{x:8,y:12,width:144,height:136},160,34));
   const cam=new THREE.PerspectiveCamera(34,1,.1,20);cam.position.set(0,0,4.2);cam.lookAt(0,0,0);
   this.renderer.setRenderTarget(hdr);this.renderer.render(scene,cam);
   this.thumbnailOutput.render(this.renderer,rt,hdr);
   const pixels=new Uint8Array(160*160*4);this.renderer.readRenderTargetPixels(rt,0,0,160,160,pixels);
   const canvas=document.createElement('canvas');canvas.width=canvas.height=160;const ctx=canvas.getContext('2d'),image=ctx.createImageData(160,160);
   for(let y=0;y<160;y++)image.data.set(pixels.subarray((159-y)*640,(160-y)*640),y*640);
   ctx.putImageData(image,0,0);url=canvas.toDataURL('image/png');this.thumbCache.set(id,url);
  }finally{
   this.renderer.setRenderTarget(old);this.renderer.setClearColor(oldColor,oldAlpha);rt.dispose();hdr.dispose();
   scene.remove(model);if(prev)prev.add(model);model.scale.copy(scale);model.rotation.copy(rot);model.position.copy(pos);this.dirty=true;
  }
  return url;
 }
 update(dt,rawDt=dt){this.time+=dt;if(this.kick>0){this.renderer.shadowMap.needsUpdate=true;this.dirty=true;}this.kick=Math.max(0,this.kick-dt*2.8);this.lid.rotation.x=-.045-(this.reduced?0:Math.sin(this.kick*Math.PI)*(this.kickAmp??.12));this.bin.rotation.z=this.reduced?0:Math.sin(this.kick*Math.PI*4)*this.kick*.009;
  if(this.item){const old=this.item.rotation.clone();const k=this.reduced?1:1-Math.exp(-dt*12);this.item.rotation.y=THREE.MathUtils.lerp(this.item.rotation.y,this.targetY,k);this.item.rotation.x=THREE.MathUtils.lerp(this.item.rotation.x,this.targetX,k);this.item.rotation.z=THREE.MathUtils.lerp(this.item.rotation.z,this.targetZ,k);if(!old.equals(this.item.rotation))this.fitItem();this.item.position.y=this.reduced?0:Math.sin(this.time*1.5)*.008;this.reveal=this.reduced?1:Math.min(1,(this.reveal||0)+dt/REVEAL_SECONDS);this.applyReveal();}
  if(this.vrStereo||this.dirty||(this.item&&!this.reduced)){if(this.vrStereo)this.renderStereo();else this.pipeline.render();this.dirty=false;if(rawDt>0){this.frames.push(rawDt*1000);if(this.frames.length>120)this.frames.shift();}this.adaptResolution();}
 }
 // Adaptive render scale: only the number of pixels changes. Materials, AO,
 // shadows, stars and geometry stay exactly as authored; a device that can
 // hold the target gets a sharper picture, a slow one keeps its frame rate.
 adaptResolution(){
  this.perf.samples++;
  if(this.low||this.perf.samples%90||this.frames.length<30)return;
  const mean=this.frames.reduce((a,b)=>a+b,0)/this.frames.length;
  this.perf.meanMs=+mean.toFixed(2);this.perf.fps=Math.round(1000/mean);
  let next=this.pixelRatio;
  if(mean>23&&this.pixelRatio>1){next=Math.max(1,this.pixelRatio-.15);this.perf.drops++;}
  else if(mean<13.4&&this.pixelRatio<this.maxPixelRatio){next=Math.min(this.maxPixelRatio,this.pixelRatio+.15);this.perf.raises++;}
  if(next===this.pixelRatio)return;
  this.pixelRatio=Math.round(next*100)/100;this.perf.dpr=this.pixelRatio;
  this.renderer.setPixelRatio(this.pixelRatio);this.pipeline.resize(innerWidth,innerHeight,this.pixelRatio);
  this.frames.length=0;this.dirty=true;
 }
 metrics(){return {drawCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,geometries:this.renderer.info.memory.geometries,textures:this.renderer.info.memory.textures,models:this.modelCache.size,postprocessing:!this.low,zoom:this.zoom,pose:this.pose,inspectionBounds:this.inspectionBounds(),modelDetails:this.item?.userData||null,meanFrameMs:this.frames.length?this.frames.reduce((a,b)=>a+b,0)/this.frames.length:0,renderer:this.renderer.getContext().getParameter(this.renderer.getContext().RENDERER),reveal:this.revealState||revealFrame(1),quality:this.low?'low':'high',look:this.lookInfo(),perf:{...this.perf},vr:this.vrInfo()};}
}
