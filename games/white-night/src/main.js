import './style.css';
import { World } from './world.js';
import { ZOOM } from './presentation.js';
import { materialAssetsReady } from './materials.js';
import { ITEMS, RARITY, initialState, chooseItem, transition, loadSave, saveState } from './state.js';
import { VrLook } from './vr/vrLook.js';
import { HeadShakeDetector } from './vr/headGestures.js';
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const icon=id=>`<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
let storage;try{storage=window.localStorage;}catch{storage={getItem(){return null;},setItem(){throw Error('storage unavailable');}};}
let state=loadSave(storage),world,filter='all',drag=null,toastTimer,feedbackTimer,lastRevealPhase=null,lastTime=0,raf=0,paused=document.hidden,forcedItem=null;
const VR_SETTINGS_KEY='white-night-vr-v1',VR_FOCUS_SECONDS=10;
function loadVrSettings(){try{const raw=storage.getItem(VR_SETTINGS_KEY),p=raw?JSON.parse(raw):{};return {mode:p.mode==='fusion'?'fusion':'gyro',quality:['auto','high','low'].includes(p.quality)?p.quality:'auto',leftHue:Number.isFinite(p.leftHue)?((p.leftHue%360)+360)%360:16,rightHue:Number.isFinite(p.rightHue)?((p.rightHue%360)+360)%360:338};}catch{return {mode:'gyro',quality:'auto',leftHue:16,rightHue:338};}}
let vrSettings=loadVrSettings(),vrLook=null,vrActive=false,vrStereo=false,vrStarting=false,vrCountingDown=false,vrCountdownToken=0,vrFocus=0,vrGazeHit=false,vrPendingSave=false,pendingCompletion=false,vrPickSide=null,vrRestoreLow=false,vrAppliedLow=false,vrFrameSamples=[],vrMessageNote='',vrMessageUntil=0,vrPrepNote='',lastVrOverlayKey='';
const headShake=new HeadShakeDetector();
const vrEyeStatuses=$$('.vr-eye-status'),vrEyeTitles=$$('.vr-eye-title'),vrEyeHints=$$('.vr-eye-hint'),vrEyeBars=$$('.vr-eye-progress i');
function persistVrSettings(){try{storage.setItem(VR_SETTINGS_KEY,JSON.stringify(vrSettings));}catch{}}
const testing=new URLSearchParams(location.search).has('test');
const dialogs=$$('dialog');
function notify(message,tone='neutral'){$('#toast').dataset.tone=tone;$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
function persist(){if(!saveState(storage,state)){$('#save-status').textContent='Сохранение недоступно в этом браузере';notify('Не удалось сохранить. Прогресс останется до закрытия страницы.');}}
function updateViews(){
 $$('[data-pose]').forEach(b=>{b.disabled=state.phase!=='inspect'||!world?.revealState?.ready;b.setAttribute('aria-pressed',String(b.dataset.pose===world?.pose));});
}
function updateZoom(){updateViews();
 if(!world)return;
 if(state.phase==='inspect'&&!world.revealState?.ready){for(const id of ['zoom-in','zoom-out','zoom-reset'])$('#'+id).disabled=true;return;}$('#zoom-in').disabled=world.zoom>=ZOOM.max;$('#zoom-out').disabled=world.zoom<=ZOOM.min;
 $('#zoom-reset').disabled=world.zoom===1;$('#zoom-reset').textContent=`${Math.round(world.zoom*100)}%`;
}
function renderComplete(){
 $('#completion-preview').replaceChildren(...state.lastKept.map(id=>{
  const img=document.createElement('img');img.src=world.thumbnail(id);img.alt=ITEMS.find(i=>i.id===id).name;return img;
 }));
}
function syncReveal(){
 const phase=state.phase==='inspect'?(world.revealState?.phase||'ready'):'ready';
 if(phase===lastRevealPhase)return;lastRevealPhase=phase;
 $('#app').dataset.revealPhase=phase;$('#app').classList.toggle('is-revealing',phase!=='ready');
 $('.inspection').setAttribute('aria-busy',String(phase!=='ready'));
 $('#keep').disabled=$('#discard').disabled=phase!=='ready';updateZoom();
 const notes={anticipation:'Что-то осталось на дне…',silhouette:'Знакомый силуэт…',detail:'У каждой вещи — своя история.'};
 $('#reveal-note').textContent=notes[phase]||'';$('#reveal-note').hidden=phase==='ready';
}
function collectionFeedback(){
 const count=$('#header-count');count.classList.remove('collected');void count.offsetWidth;count.classList.add('collected');
 clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>count.classList.remove('collected'),700);
}
function updateUI(){
 $('#app').classList.toggle('has-progress',state.searches>0);syncReveal();updateZoom();
 $('#app').classList.toggle('is-inspecting',state.phase==='inspect');$('.inspection').hidden=state.phase!=='inspect';
 // The toast reports on the previous find; it must not cover the next one's
 // rarity chip while that find is being inspected.
 if(state.phase==='inspect'){clearTimeout(toastTimer);$('#toast').classList.remove('visible');}
 $('#header-count').innerHTML=`${String(state.collection.length).padStart(2,'0')} <small>/ 18</small>`;$('#open-vr').disabled=state.phase==='inspect';
 $('#search-total').textContent=String(state.searches).padStart(2,'0');$('#open-collection').disabled=state.phase==='inspect';
 $$('.tap-dots i').forEach((dot,index)=>dot.classList.toggle('active',index<state.taps));$('.tap-dots').setAttribute('aria-label',`Нажатий: ${state.taps} из 3`);
 const captions=['Интересно, что там сегодня?','Что-то есть… Продолжайте.','Ещё одно касание — и узнаем.'];$('#search-caption').textContent=captions[state.taps];
 $('#search-button span').textContent=state.taps?'Продолжить поиск':'Порыться в баке';
 if(state.phase==='inspect'){
  const item=ITEMS.find(i=>i.id===state.current),rarity=RARITY[item.rarity];
  $('#find-name').textContent=item.name;$('#find-description').textContent=item.description;$('#find-era').textContent=item.era;$('#find-rarity').innerHTML=`<i></i>${rarity.label}`;$('#find-rarity').style.color=rarity.color;$('#find-number').textContent=state.reviewing?'ИЗ ВАШЕЙ КОЛЛЕКЦИИ':`НАХОДКА № ${String(state.searches).padStart(3,'0')}`;
  $('#duplicate-badge').hidden=state.reviewing||!state.collection.includes(item.id);$('.decision-buttons').hidden=state.reviewing;$('#close-review').hidden=!state.reviewing;
 }
}
function search(){if(state.phase!=='search'||dialogs.some(d=>d.open)||paused)return;world.poke(state.taps+1);let itemId=forcedItem || (state.searches===0?'camera':chooseItem().id);state=transition(state,{type:'tap',itemId});if(state.phase==='inspect'){forcedItem=null;world.show(state.current);persist();if(vrActive){vrPendingSave=true;vrFocus=0;vrGazeHit=false;headShake.reset();}}updateUI();}
function decide(keep,{fromVr=false}={}){if(state.phase!=='inspect'||state.reviewing||!world.revealState?.ready)return;const item=ITEMS.find(i=>i.id===state.current),duplicate=state.collection.includes(item.id),before=state.collection.length;state=transition(state,{type:keep?'keep':'discard'});world.hide();persist();updateUI();notify(keep?(duplicate?'Уже сохранено. Продолжим искать?':`${item.name} — теперь в коллекции`):'Оставлено во дворе. Ищем дальше.',keep?(duplicate?'duplicate':'kept'):'discarded');if(keep&&!duplicate)collectionFeedback();if(before<18&&state.collection.length===18){if(fromVr){pendingCompletion=true;vrMessageNote='Коллекция собрана — 18 из 18';vrMessageUntil=performance.now()+3500;}else{renderComplete();$('#complete-dialog').showModal();}}}
function renderCollection(){
 $('#collection-count').textContent=state.collection.length;$('#collection-progress').style.width=`${state.collection.length/18*100}%`;
 const list=ITEMS.filter(i=>filter==='all'||(filter==='junk'?i.rarity==='junk':i.rarity!=='junk'));
 $('#collection-grid').replaceChildren(...list.map(item=>{
  const owned=state.collection.includes(item.id),card=document.createElement('button');card.className=`item-card ${owned?'owned':'locked'}`;card.disabled=!owned;card.dataset.id=item.id;
  const n=String(ITEMS.indexOf(item)+1).padStart(2,'0');card.setAttribute('aria-label',owned?`Рассмотреть: ${item.name}`:`Находка ${n} ещё не найдена`);
  card.innerHTML=`<span class="item-index">${n}</span>${owned?`<svg class="item-check"><use href="#i-check"/></svg><img alt="" src="${world.thumbnail(item.id)}">`:`<div class="locked-art">${icon('lock')}</div>`}<span class="item-title">${owned?item.name:'Ещё не найдено'}</span><span class="item-type">${owned?(item.rarity==='junk'?'Просто хлам':RARITY[item.rarity].label):item.rarity==='junk'?'Просто хлам':'Вещь с историей'}</span>`;
  if(owned)card.addEventListener('click',()=>{$('#collection-dialog').close();state=transition(state,{type:'review',id:item.id});world.show(item.id,{review:true});updateUI();});return card;
 }));
}
function openCollection(){if(state.phase==='inspect')return;renderCollection();$('#collection-dialog').showModal();}
function closeReview(){if(!state.reviewing)return;state=transition(state,{type:'close'});world.hide();updateUI();openCollection();}
function reset(){state=initialState();world.hide();persist();updateUI();$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;$('#settings-dialog').close();notify('Новая белая ночь. Начнём сначала.');}
function syncBinTag(){
 // The callout follows the bin in the frame instead of sitting in a fixed corner,
 // so it keeps pointing at the bin when the courtyard is reframed.
 const tag=$('.bin-tag');if(!tag)return;
 const p=world.binEdge();
 tag.style.left=`${Math.round(p.x)}px`;tag.style.top=`${Math.round(p.y)}px`;
}
function ensureVrLook(){
 if(!vrLook){vrLook=new VrLook($('#vr-camera'));vrLook.setHues(vrSettings.leftHue,vrSettings.rightHue);vrLook.setMode(vrSettings.mode);}
 return vrLook;
}
function vrReady(info){return !!info.gyro.fresh&&(vrSettings.mode!=='fusion'||info.marker.calibrated);}
function markerLabel(marker){return marker.usable?'готова':marker.entity?'видна, ещё мгновение':marker.found?'видна, удерживайте':'не видна';}
function syncVrPrep(){
 const look=ensureVrLook(),info=look.info(),gyro=info.gyro,marker=info.marker,ready=vrReady(info);
 $$('[data-vr-mode]').forEach(b=>{const active=b.dataset.vrMode===vrSettings.mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $('#vr-fusion-panel').hidden=vrSettings.mode!=='fusion';
 $('#vr-quality').value=vrSettings.quality;
 $('#vr-swatch-left').style.background=`hsl(${vrSettings.leftHue} 95% 55%)`;$('#vr-swatch-right').style.background=`hsl(${vrSettings.rightHue} 95% 55%)`;
 const gyroButton=$('#vr-gyro-btn');
 gyroButton.disabled=!!gyro.fresh||!gyro.supported;gyroButton.textContent=gyro.fresh?'Гироскоп готов':'Разрешить';gyroButton.classList.toggle('ready',!!gyro.fresh);
 $('#vr-gyro-status').textContent=!gyro.supported?'Этот браузер не отдаёт ориентацию устройства. VR-обзору нужен гироскоп.':gyro.permission==='denied'?'Доступ запрещён. Разрешите датчики движения в настройках браузера и попробуйте снова.':gyro.fresh?'Показания приходят — телефон можно поворачивать.':gyro.permission==='granted'?'Разрешение есть, ждём показания: чуть поверните телефон.':gyro.error||'Нажмите кнопку и подтвердите доступ к ориентации телефона.';
 if(vrSettings.mode==='fusion'){
  const [left,right]=marker.markers||[];
  $('#vr-start-camera').disabled=!!marker.running;$('#vr-start-camera').textContent=marker.running?'Камера включена':'Включить камеру';
  $('#vr-calibrate').disabled=!(left?.usable&&right?.usable);
  $('#vr-pick-left').classList.toggle('active',vrPickSide==='left');$('#vr-pick-right').classList.toggle('active',vrPickSide==='right');$('#vr-camera').classList.toggle('picking',!!vrPickSide);
  const markerStatus=$('#vr-marker-status');
  markerStatus.textContent=vrPrepNote||marker.error||(vrPickSide?`Коснитесь ${vrPickSide==='left'?'левой':'правой'} метки прямо на предпросмотре.`:marker.calibrated?`Метки зафиксированы, разнос ${marker.calibration?.sepDeg||0}°. Сейчас: ${marker.status==='valid'?'видна пара':marker.status==='single'?'видна одна метка':marker.status==='held'?'временно не видны, центр удержан':'не видны'}.`:marker.running?`Левая метка: ${left?markerLabel(left):'—'}. Правая метка: ${right?markerLabel(right):'—'}. Когда обе готовы, нажмите «Это центр».`:'Камера пока выключена. Если цвета не совпадают: выберите сторону и коснитесь метки на предпросмотре.');
  markerStatus.className=`vr-status-line ${vrPrepNote||marker.error?'warn':marker.calibrated?'good':''}`;
 }
 $('#vr-start').disabled=!ready||vrCountingDown;
 const status=$('#vr-status');
 status.textContent=vrCountingDown?'Надевайте очки и смотрите прямо перед собой…':!gyro.fresh?'Сначала нужен работающий гироскоп.':vrSettings.mode==='fusion'&&!marker.calibrated?'Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.':vrSettings.mode==='fusion'?'Готово: гироскоп ведёт взгляд, две метки удерживают центр.':'Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.';
 status.className=`vr-status-line ${ready?'good':'warn'}`;
 return {ready,info};
}
function openVr(){
 if(state.phase==='inspect'){notify('Сначала завершите осмотр находки.');return;}
 const dialog=$('#vr-dialog');if(dialog.open)return;ensureVrLook();syncVrPrep();dialog.showModal();
}
async function tryVrFullscreen(){
 try{
  if(!document.fullscreenElement){
   try{await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch{await document.documentElement.requestFullscreen();}
  }
 }catch{}
 try{await screen.orientation?.lock('landscape');}catch{}
}
function applyVrQuality(initial=false){
 if(initial){vrRestoreLow=$('#low-quality').checked;vrAppliedLow=vrSettings.quality==='low'||vrRestoreLow;vrFrameSamples=[];if(world.low!==vrAppliedLow)world.setQuality(vrAppliedLow);}
}
function adaptVrQuality(rawDt){
 if(!vrActive||vrSettings.quality!=='auto'||vrAppliedLow||!Number.isFinite(rawDt)||rawDt<=0||rawDt>.25)return;
 vrFrameSamples.push(rawDt*1000);if(vrFrameSamples.length>90)vrFrameSamples.shift();
 if(vrFrameSamples.length>=60){
  const mean=vrFrameSamples.reduce((a,b)=>a+b,0)/vrFrameSamples.length;
  if(mean>24){vrAppliedLow=true;world.setQuality(true);vrMessageNote='Качество снижено для плавности';vrMessageUntil=performance.now()+2200;}
  vrFrameSamples=[];
 }
}
function syncVrStereoMode(force=false){
 if(!vrActive)return;const stereo=innerWidth>=innerHeight;document.body.classList.toggle('vr-single',!stereo);
 if(force||stereo!==vrStereo){vrStereo=stereo;world.setVrStereo(stereo);}
}
async function startVrSession(){
 if(vrActive||state.phase==='inspect')return false;
 const look=ensureVrLook(),dialog=$('#vr-dialog');
 if(dialog.open){vrStarting=true;dialog.close();vrStarting=false;}
 applyVrQuality(true);look.start();vrActive=true;vrFocus=state.taps*(VR_FOCUS_SECONDS/3);vrGazeHit=false;vrPendingSave=false;vrFrameSamples=[];lastVrOverlayKey='';headShake.reset();
 document.body.classList.add('vr-active');$('#vr-overlay').hidden=false;$('#vr-exit').hidden=false;
 vrStereo=false;syncVrStereoMode(true);world.setHeadLook(0,0);world.resize();updateVrOverlay(performance.now());
 return true;
}
async function beginVrCountdown(){
 if(vrCountingDown||!syncVrPrep().ready)return;
 await tryVrFullscreen();
 const token=++vrCountdownToken,dialog=$('#vr-dialog'),countdown=$('#vr-countdown');
 vrCountingDown=true;countdown.hidden=false;syncVrPrep();
 for(const n of [3,2,1]){
  countdown.textContent=String(n);await new Promise(resolve=>setTimeout(resolve,650));
  if(token!==vrCountdownToken||!dialog.open){vrCountingDown=false;countdown.hidden=true;return;}
 }
 vrCountingDown=false;countdown.hidden=true;await startVrSession();
}
function finishVrFind(reason='gesture'){
 if(!vrPendingSave||state.phase!=='inspect'||state.reviewing)return false;
 if(!world.revealState?.ready){world.finishReveal();syncReveal();}
 vrPendingSave=false;headShake.reset();decide(true,{fromVr:true});vrFocus=0;vrGazeHit=false;
 if(!pendingCompletion){vrMessageNote='Сохранено в коллекции';vrMessageUntil=performance.now()+2200;}
 return true;
}
function stopVr(reason='exit'){
 if(!vrActive)return false;
 if(vrPendingSave)finishVrFind('exit');
 vrActive=false;vrCountdownToken++;vrCountingDown=false;$('#vr-countdown').hidden=true;
 vrLook?.stop();world.setVrStereo(false);world.setHeadLook(0,0);vrStereo=false;vrFocus=0;vrGazeHit=false;headShake.reset();
 document.body.classList.remove('vr-active','vr-single');$('#vr-overlay').hidden=true;$('#vr-exit').hidden=true;
 if(world.low!==vrRestoreLow)world.setQuality(vrRestoreLow);
 try{screen.orientation?.unlock();}catch{}
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 world.resize();updateUI();
 if(pendingCompletion){pendingCompletion=false;renderComplete();$('#complete-dialog').showModal();}
 else if(reason!=='hidden')notify('VR-обзор завершён. Находки из очков уже в коллекции.');
 return true;
}
function stepVrLook(dt){const look=vrLook.update(dt);world.setHeadLook(look.yaw,look.pitch);return look;}
function updateVrFrame(dt,now=performance.now()){
 if(!vrActive||!vrLook)return;
 const look=stepVrLook(dt),segment=VR_FOCUS_SECONDS/3;
 if(state.phase==='search'){
  headShake.reset();vrGazeHit=world.gazeHitsBin();
  if(vrGazeHit){
   vrFocus=Math.min(VR_FOCUS_SECONDS,vrFocus+dt);
   const shouldTaps=Math.min(3,Math.floor(vrFocus/segment+1e-9));
   while(state.phase==='search'&&state.taps<shouldTaps){const before=state.taps;search();if(state.phase==='search'&&state.taps===before)break;}
  }else vrFocus=Math.max(state.taps*segment,vrFocus-dt*1.5);
 }else if(state.phase==='inspect'&&vrPendingSave){
  vrGazeHit=false;
  if(world.revealState?.ready&&headShake.update(look.yaw,now))finishVrFind('gesture');
 }
}
function vrStatusLabel(info){
 if(vrSettings.mode==='gyro')return info.status==='gyro'?'ГИРОСКОП':'НЕТ ГИРОСКОПА';
 return {'fusion':'ГИРОСКОП + МЕТКИ','fusion-camera':'МЕТКИ ВЕДУТ ВЗГЛЯД','fusion-gyro':'ГИРОСКОП · МЕТКИ НЕ ВИДНЫ','fusion-wait':'ИЩЕМ ИСТОЧНИК ВЗГЛЯДА'}[info.status]||'VR';
}
function setVrOverlay(status,title,hint,progress){
 const p=Math.max(0,Math.min(1,progress||0)),key=`${status}\n${title}\n${hint}`;
 $('#vr-overlay').style.setProperty('--vr-focus',`${p*360}deg`);vrEyeBars.forEach(bar=>bar.style.width=`${p*100}%`);
 if(key===lastVrOverlayKey)return;lastVrOverlayKey=key;
 vrEyeStatuses.forEach(el=>el.textContent=status);vrEyeTitles.forEach(el=>el.textContent=title);vrEyeHints.forEach(el=>el.textContent=hint);
}
function updateVrOverlay(now=performance.now()){
 if(!vrActive||!vrLook)return;
 const info=vrLook.info(),status=vrStatusLabel(info);let title='Белая ночь',hint='',progress=0;
 if(now<vrMessageUntil&&vrMessageNote){title=vrMessageNote;hint=state.phase==='search'?'Ищем следующую: смотрите на бак':'Вращайте находку головой';progress=state.phase==='search'?vrFocus/VR_FOCUS_SECONDS:headShake.count/headShake.requiredTransitions;}
 else if(state.phase==='search'){
  title=vrGazeHit?'Смотрите на бак':'Найдите бак взглядом';progress=vrFocus/VR_FOCUS_SECONDS;
  hint=vrGazeHit?`Находка через ${Math.max(1,Math.ceil(VR_FOCUS_SECONDS-vrFocus))} сек`:'Держите центр прицела на баке 10 секунд';
 }else if(state.phase==='inspect'){
  const item=ITEMS.find(i=>i.id===state.current),phase=world.revealState?.phase||'ready';
  title=phase==='anticipation'?'Что-то осталось на дне…':phase==='silhouette'?'Знакомый силуэт…':item?.name||'Находка';
  progress=headShake.count/headShake.requiredTransitions;
  hint=phase==='ready'?`Повороты и кивки вращают вещь · «нет» ${headShake.count}/${headShake.requiredTransitions} — искать дальше`:'Ещё мгновение…';
 }
 if(vrSettings.mode==='gyro'&&info.status!=='gyro')hint='Гироскоп молчит. Снимите очки и проверьте разрешение датчиков.';
 setVrOverlay(status,title,hint,progress);
}
function vrInfoSnapshot(){return {active:vrActive,stereo:vrStereo,settings:{...vrSettings},focus:+vrFocus.toFixed(3),gazeHit:vrGazeHit,pendingSave:vrPendingSave,pendingCompletion,shake:headShake.info(),look:vrLook?.info()||null,world:world?.vrInfo()||null,overlay:{status:vrEyeStatuses[0]?.textContent||'',title:vrEyeTitles[0]?.textContent||'',hint:vrEyeHints[0]?.textContent||''}};}
function setVrGyroAbsolute(yawDeg,pitchDeg,steps=10,dt=.03){
 const look=ensureVrLook(),gyro=look.gyro,start={...gyro.raw},target={yaw:yawDeg*Math.PI/180,pitch:pitchDeg*Math.PI/180},n=Math.max(1,steps|0);
 gyro.lastAt=performance.now();if(vrActive)updateVrFrame(0,gyro.lastAt);else stepVrLook(0);
 for(let i=1;i<=n;i++){gyro.raw={yaw:start.yaw+(target.yaw-start.yaw)*i/n,pitch:start.pitch+(target.pitch-start.pitch)*i/n};gyro.lastAt=performance.now();if(vrActive)updateVrFrame(dt,gyro.lastAt);else stepVrLook(dt);}
 world.update(0);gyro.lastAt=performance.now();updateVrOverlay(performance.now());return vrInfoSnapshot();
}
function tick(time){raf=requestAnimationFrame(tick);if(dialogs.some(d=>d.open)){if($('#vr-dialog').open&&!paused){vrLook?.processPrep();syncVrPrep();}lastTime=time;return;}if(paused||world.testRevealHold){lastTime=time;return;}const rawDt=lastTime?(time-lastTime)/1000:.016;lastTime=time;const dt=Math.min(rawDt,.1);if(vrActive)updateVrFrame(dt,time);world.update(dt,rawDt);syncReveal();if(vrActive){adaptVrQuality(rawDt);updateVrOverlay(time);}else syncBinTag();}
function bind(){
 $$('[data-pose]').forEach(b=>b.addEventListener('click',()=>{world.setPose(b.dataset.pose);updateViews();}));
 $('#zoom-in').addEventListener('click',()=>{world.setZoom(.2);updateZoom();});$('#zoom-out').addEventListener('click',()=>{world.setZoom(-.2);updateZoom();});$('#zoom-reset').addEventListener('click',()=>{world.setZoom(1-world.zoom);updateZoom();});
 $('#search-button').addEventListener('click',search);$('#discard').addEventListener('click',()=>decide(false));$('#keep').addEventListener('click',()=>decide(true));$('#close-review').addEventListener('click',closeReview);
 $('#open-collection').addEventListener('click',openCollection);$('#open-settings').addEventListener('click',()=>{$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;$('#settings-dialog').showModal();});
 $('#open-vr').addEventListener('click',openVr);
 $$('[data-vr-mode]').forEach(b=>b.addEventListener('click',()=>{vrSettings.mode=b.dataset.vrMode==='fusion'?'fusion':'gyro';persistVrSettings();vrPickSide=null;vrPrepNote='';ensureVrLook().setMode(vrSettings.mode);syncVrPrep();}));
 $('#vr-gyro-btn').addEventListener('click',async()=>{vrPrepNote='';await ensureVrLook().requestGyro();syncVrPrep();});
 $('#vr-start-camera').addEventListener('click',async()=>{vrPrepNote='';const look=ensureVrLook();look.tracker.error=null;await look.startCamera();syncVrPrep();});
 $$('.vr-pick').forEach(b=>b.addEventListener('click',()=>{const side=b.id==='vr-pick-left'?'left':'right';vrPrepNote='';vrPickSide=vrPickSide===side?null:side;syncVrPrep();}));
 $('#vr-camera').addEventListener('click',e=>{if(!vrPickSide)return;const look=ensureVrLook(),sample=look.tracker.sampleColor(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect());if(!sample||sample.chroma<35)return;if(vrPickSide==='left')vrSettings.leftHue=Math.round(sample.hue);else vrSettings.rightHue=Math.round(sample.hue);look.setHues(vrSettings.leftHue,vrSettings.rightHue);if(look.tracker.calibrated)look.tracker.clearCalibration();persistVrSettings();vrPrepNote='Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.';vrPickSide=null;look.tracker.process(true);syncVrPrep();});
 $('#vr-calibrate').addEventListener('click',()=>{const look=ensureVrLook();look.tracker.process(true);const result=look.tracker.calibrate();vrPrepNote=result.ok?'':result.message;syncVrPrep();});
 $('#vr-start').addEventListener('click',beginVrCountdown);$('#vr-exit').addEventListener('click',()=>stopVr('button'));
 $('#vr-quality').value=vrSettings.quality;$('#vr-quality').addEventListener('change',e=>{vrSettings.quality=e.target.value;persistVrSettings();});
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
 dialogs.forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{drag=null;lastTime=0;if(d.id==='vr-dialog'&&!vrStarting&&!vrActive){vrCountdownToken++;vrCountingDown=false;$('#vr-countdown').hidden=true;vrPickSide=null;vrPrepNote='';vrLook?.stop();}});});
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCollection();}));
 $('#low-quality').addEventListener('change',e=>{world.setQuality(e.target.checked);world.update(.016);try{storage.setItem('white-night-quality',e.target.checked?'low':'high');}catch{}});
 $('#reset-button').addEventListener('click',()=>{$('#reset-confirm').hidden=false;$('#reset-button').hidden=true;});$('#reset-cancel').addEventListener('click',()=>{$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;});$('#reset-yes').addEventListener('click',reset);
 $('#continue-button').addEventListener('click',()=>$('#complete-dialog').close());$('#view-complete').addEventListener('click',()=>{$('#complete-dialog').close();openCollection();});
 const canvas=$('#world');canvas.addEventListener('pointerdown',e=>{if(vrActive||dialogs.some(d=>d.open)||drag||!e.isPrimary)return;if(state.phase==='inspect'){world.finishReveal();syncReveal();}drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>10)drag.moved=true;if(state.phase==='inspect'){world.rotate(dx,dy);updateViews();}drag.x=e.clientX;drag.y=e.clientY;});
 canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const tap=!drag.moved;drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(tap&&state.phase==='search'&&world.hitBin(e.clientX,e.clientY))search();});canvas.addEventListener('pointercancel',()=>drag=null);canvas.addEventListener('lostpointercapture',()=>drag=null);
 document.addEventListener('visibilitychange',()=>{paused=document.hidden;drag=null;lastTime=0;if(document.hidden&&vrActive)stopVr('hidden');});window.addEventListener('blur',()=>drag=null);window.addEventListener('resize',()=>{world.resize();if(vrActive)syncVrStereoMode();if(dialogs.some(d=>d.open))world.update(.016);});
 document.addEventListener('fullscreenchange',()=>{if(vrActive&&!document.fullscreenElement)stopVr('fullscreen');});window.addEventListener('pagehide',()=>{if(vrPendingSave)finishVrFind('pagehide');if(vrActive)vrLook?.stop();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&vrActive){e.preventDefault();stopVr('escape');return;}if(e.key==='Escape'&&!dialogs.some(d=>d.open)&&state.phase==='inspect'){e.preventDefault();if(state.reviewing)closeReview();else{world.finishReveal();syncReveal();decide(false);}}});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;$('#webgl-error').hidden=false;});
}
async function start(){
 try{world=new World($('#world'));try{if(storage.getItem('white-night-quality')==='low'){world.setQuality(true);$('#low-quality').checked=true;}}catch{}
 bind();updateUI();await Promise.all([document.fonts.ready,materialAssetsReady()]);world.update(.016);$('#loading').hidden=true;window.__READY__=true;raf=requestAnimationFrame(tick);
 if(testing)window.__GAME_TEST__={getState:()=>structuredClone(state),getMetrics:()=>world.metrics(),settle:()=>{world.finishReveal();world.kick=0;world.dirty=true;world.update(.016);syncReveal();},seekReveal:p=>{world.testRevealHold=true;world.reveal=Math.max(0,Math.min(1,p));world.applyReveal();world.dirty=true;world.update(0);syncReveal();},setPose:pose=>{world.setPose(pose);world.update(.1);updateViews();},getRotation:()=>({x:world.targetX,y:world.targetY}),binScreen:()=>world.binScreen(),forceNext:id=>{if(!ITEMS.some(i=>i.id===id))throw Error('unknown item');forcedItem=id;},reset:()=>{dialogs.forEach(d=>d.close());reset();},setCollection:ids=>{state=initialState({collection:ids,searches:ids.length});world.hide();persist();updateUI();},isPaused:()=>paused,items:ITEMS.map(i=>i.id),vr:{
   info:()=>vrInfoSnapshot(),
   open:()=>openVr(),
   setMode:mode=>{vrSettings.mode=mode==='fusion'?'fusion':'gyro';persistVrSettings();ensureVrLook().setMode(vrSettings.mode);syncVrPrep();return vrInfoSnapshot();},
   requestGyro:()=>ensureVrLook().requestGyro(),
   gyro:(yawDeg,pitchDeg,steps=10,dt=.03)=>setVrGyroAbsolute(yawDeg,pitchDeg,steps,dt),
   marker:(markers,now)=>ensureVrLook().tracker.inject(markers,now),
   calibrate:now=>ensureVrLook().tracker.calibrate(now),
   start:()=>startVrSession(),
   stop:()=>stopVr('test'),
   step:(seconds=.1)=>{let left=Math.max(0,seconds);while(left>0){const dt=Math.min(.05,left);if(vrLook)vrLook.gyro.lastAt=performance.now();updateVrFrame(dt,performance.now());left-=dt;}world.update(0);updateVrOverlay(performance.now());return vrInfoSnapshot();},
   shake:(amplitudeDeg=25)=>{for(const yaw of [-amplitudeDeg,amplitudeDeg,-amplitudeDeg])setVrGyroAbsolute(yaw,0,10,.03);return vrInfoSnapshot();},
   settings:()=>({...vrSettings}),
   finish:()=>finishVrFind('test')
  }};
 if(import.meta.env.PROD&&'serviceWorker' in navigator)navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{console.warn('Offline mode could not be enabled.');});
 }catch(error){console.error(error);$('#loading').hidden=true;$('#webgl-error').hidden=false;cancelAnimationFrame(raf);}
}
start();
