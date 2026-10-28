import './style.css';
import { World } from './world.js';
import { ZOOM } from './presentation.js';
import { materialAssetsReady } from './materials.js';
import { ITEMS, RARITY, initialState, chooseItem, transition, loadSave, saveState } from './state.js';
import { VrLook } from './vr/vrLook.js';
import { HeadShakeDetector } from './vr/headGestures.js';
import { WristBeaconTracker } from './vr/wristBeaconTracker.js';
import { WristHandFusion } from './vr/wristHandFusion.js';
import { WristHostLink, loadSavedFirebaseRaw } from './vr/wristLink.js';
const THREE_clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const icon=id=>`<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
let storage;try{storage=window.localStorage;}catch{storage={getItem(){return null;},setItem(){throw Error('storage unavailable');}};}
let state=loadSave(storage),world,filter='all',drag=null,toastTimer,feedbackTimer,lastRevealPhase=null,lastTime=0,raf=0,paused=document.hidden,forcedItem=null;
const VR_SETTINGS_KEY='white-night-vr-v1',WRIST_CAL_KEY='white-night-wrist-cal-v1',VR_FOCUS_SECONDS=10;
function loadVrSettings(){try{const raw=storage.getItem(VR_SETTINGS_KEY),p=raw?JSON.parse(raw):{};return {mode:p.mode==='fusion'?'fusion':p.mode==='hand'?'hand':'gyro',handSide:p.handSide==='left'?'left':'right',quality:p.quality==='low'?'low':'high',leftHue:Number.isFinite(p.leftHue)?((p.leftHue%360)+360)%360:16,rightHue:Number.isFinite(p.rightHue)?((p.rightHue%360)+360)%360:338};}catch{return {mode:'gyro',handSide:'right',quality:'high',leftHue:16,rightHue:338};}}
let vrSettings=loadVrSettings(),vrLook=null,vrBeaconTracker=null,wristFusion=null,wristLink=null,wristCalNote='',wristFbPrefilled=false,vrActive=false,vrStereo=false,vrStarting=false,vrCountingDown=false,vrCountdownToken=0,vrFocus=0,vrGazeHit=false,vrPendingSave=false,pendingCompletion=false,vrPickSide=null,vrRestoreLow=false,vrAppliedLow=false,vrPrepNote='',vrHoldTimer=0;
const headShake=new HeadShakeDetector();
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
 $('#app').classList.toggle('has-progress',state.searches>0);syncReveal();updateZoom();ensureLookHint();
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
function search(){if(state.phase!=='search'||dialogs.some(d=>d.open)||paused)return;world.poke(state.taps+1);let itemId=forcedItem || (state.searches===0?'camera':chooseItem().id);state=transition(state,{type:'tap',itemId});if(state.phase==='inspect'){forcedItem=null;world.show(state.current);persist();if(vrActive){vrPendingSave=true;vrFocus=0;vrGazeHit=false;headShake.reset();wristFusion?.onPhaseChange('inspect',performance.now());}}updateUI();}
function decide(keep,{fromVr=false}={}){if(state.phase!=='inspect'||state.reviewing||!world.revealState?.ready)return;const item=ITEMS.find(i=>i.id===state.current),duplicate=state.collection.includes(item.id),before=state.collection.length;state=transition(state,{type:keep?'keep':'discard'});world.hide();persist();updateUI();notify(keep?(duplicate?'Уже сохранено. Продолжим искать?':`${item.name} — теперь в коллекции`):'Оставлено во дворе. Ищем дальше.',keep?(duplicate?'duplicate':'kept'):'discarded');if(keep&&!duplicate)collectionFeedback();if(before<18&&state.collection.length===18){if(fromVr){pendingCompletion=true;}else{renderComplete();$('#complete-dialog').showModal();}}}
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
const LOOK_HINT_KEY='white-night-look-hint-v1';
let lookHintShown=false;
function lookHintDismissed(){try{return storage.getItem(LOOK_HINT_KEY)==='done';}catch{return true;}}
function markLookUsed(){
 const hint=$('#look-hint');if(!hint||lookHintShown&&hint.hidden)return;
 hint.classList.add('used');lookHintShown=true;
 try{storage.setItem(LOOK_HINT_KEY,'done');}catch{}
 setTimeout(()=>{hint.hidden=true;},520);
}
function ensureLookHint(){const hint=$('#look-hint');if(!hint)return;if(lookHintDismissed()||state.phase==='inspect'){hint.hidden=true;return;}hint.hidden=vrActive;}
function ensureVrLook(){
 if(!vrLook){vrLook=new VrLook($('#vr-camera'));vrLook.setHues(vrSettings.leftHue,vrSettings.rightHue);vrLook.setMode(vrSettings.mode==='fusion'?'fusion':'gyro');}
 return vrLook;
}
function ensureBeaconTracker(){
 if(!vrBeaconTracker)vrBeaconTracker=new WristBeaconTracker($('#vr-hand-camera'));
 return vrBeaconTracker;
}
function persistWristCalibration(){
 if(!wristFusion)return;
 const cal=wristFusion.exportCalibration();
 if(cal){try{storage.setItem(WRIST_CAL_KEY,JSON.stringify(cal));}catch{}}
}
function runWristCalibrationStep(step){
 const fusion=ensureWrist();
 vrBeaconTracker?.process(true);
 const beacon=vrBeaconTracker?.sample()||null;
 const res=step==='pose1'?fusion.calibrateStretchPose(fusion.lastSensor,beacon):fusion.calibrateBendPose(fusion.lastSensor,beacon);
 wristCalNote=res.message||'';
 if(res.ok&&step==='pose2')persistWristCalibration();
 if($('#vr-dialog')?.open)syncVrPrep();
 return res;
}
function setVrHandSide(side,{fromRemote=false}={}){
 const clean=side==='left'?'left':'right';
 vrSettings.handSide=clean;persistVrSettings();
 if(wristFusion)wristFusion.setHandSide(clean);
 world?.vrHand?.setHandSide?.(clean);
 if(!fromRemote)wristLink?.sendHandSide(clean);
 if($('#vr-dialog')?.open)syncVrPrep();
}
function ensureWrist(){
 if(!wristFusion){
  wristFusion=new WristHandFusion({handSide:vrSettings.handSide});
  try{const raw=storage.getItem(WRIST_CAL_KEY);if(raw)wristFusion.importCalibration(JSON.parse(raw));}catch{}
  wristFusion.setHandSide(vrSettings.handSide);
 }
 if(!wristLink){
  wristLink=new WristHostLink({
   onSensor:sample=>wristFusion.feedSensor(sample),
   onCalCommand:step=>runWristCalibrationStep(step),
   onHandSide:side=>setVrHandSide(side,{fromRemote:true}),
   onStatus:()=>{if($('#vr-dialog')?.open)syncVrPrep();}
  });
 }
 return wristFusion;
}
function vrReady(info){
 if(!info.gyro.fresh)return false;
 if(vrSettings.mode==='fusion')return !!info.marker.calibrated;
 if(vrSettings.mode==='hand'){ensureWrist();const st=wristLink.status();return (st.connected||!!wristFusion.lastSensor)&&wristFusion.calibratedStep>=2;}
 return true;
}
function markerLabel(marker){return marker.usable?'готова':marker.entity?'видна, ещё мгновение':marker.found?'видна, удерживайте':'не видна';}
const HOW_HEAD_HTML='<div><b>10 сек</b><span>Смотрите прямо на бак десять секунд — находка появится сама.</span></div><div><b>Голова</b><span>Двор остановится, а повороты и кивки будут вращать вещь.</span></div><div><b>«Нет» ×2</b><span>Дважды мотните головой из стороны в сторону. Вещь уже сохранена, начнётся поиск следующей.</span></div>';
const HOW_HAND_HTML='<div><b>В бак</b><span>Вытяните прямую руку к баку и 3 раза «поройтесь» кистью — появится находка.</span></div><div><b>Кисть</b><span>Вращайте запястье, чтобы рассмотреть предмет со всех сторон, свободно глядя головой.</span></div><div><b>Выбор</b><span>Спокойно опустите руку вниз — забрать себе. Резко взмахните — выбросить.</span></div>';
const NOTE_HEAD_TEXT='В VR каждая находка сохраняется автоматически. Кнопок «забрать» и «выбросить» в очках нет. В очках нет ни прицела, ни надписей — только двор. Для выхода выйдите из полноэкранного режима (Esc или системный жест «назад») либо, сняв очки, удерживайте палец на экране секунду.';
const NOTE_HAND_TEXT='В режиме «Рука-браслет» в кадре появляется ваша 3D-рука в перчатке — без прицелов, надписей и вибрации. Вытянутая рука ищет в баке, поворот запястья вертит находку, спокойное опускание сохраняет её в коллекцию, а резкий взмах выбрасывает.';
function syncVrPrep(){
 const look=ensureVrLook(),info=look.info(),gyro=info.gyro,marker=info.marker,ready=vrReady(info);
 $$('[data-vr-mode]').forEach(b=>{const active=b.dataset.vrMode===vrSettings.mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $('#vr-fusion-panel').hidden=vrSettings.mode!=='fusion';
 $('#vr-hand-panel').hidden=vrSettings.mode!=='hand';
 const howCards=$('#vr-how-cards'),noteEl=$('#vr-note-text');
 if(howCards){const want=vrSettings.mode==='hand'?HOW_HAND_HTML:HOW_HEAD_HTML;if(howCards.innerHTML!==want)howCards.innerHTML=want;}
 if(noteEl)noteEl.textContent=vrSettings.mode==='hand'?NOTE_HAND_TEXT:NOTE_HEAD_TEXT;
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
 }else if(vrSettings.mode==='hand'){
  ensureWrist();
  $$('[data-hand-side]').forEach(b=>{const active=b.dataset.handSide===vrSettings.handSide;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  if(!wristFbPrefilled){wristFbPrefilled=true;const saved=loadSavedFirebaseRaw();const fbEl=$('#vr-hand-fb');if(fbEl&&saved)fbEl.value=saved;else if($('#vr-hand-fb-details'))$('#vr-hand-fb-details').open=true;}
  const st=wristLink.status(),hasSignal=st.connected||!!wristFusion.lastSensor;
  $('#vr-hand-code').textContent=st.roomCode||'——';
  const netEl=$('#vr-hand-net-status');
  netEl.textContent=st.error?st.error:st.p2pOpen?(st.routeKind==='demo'?`Демо-канал активен (${st.rxHz||60} Гц).`:`⚡ Прямой Wi-Fi 60 Гц подключён${st.rttMs?` · ${st.rttMs} мс`:''}.`):st.connected?'☁️ Браслет на связи через облако (поднимаю прямой канал 60 Гц…).':st.roomCode?`Код комнаты ${st.roomCode} создан — введите его на странице браслета.`:'Создайте 6-значный код и введите его на втором телефоне.';
  netEl.className=`vr-status-line ${st.error?'warn':hasSignal?'good':''}`;
  const bInfo=vrBeaconTracker?.info();
  $('#vr-hand-cam-btn').textContent=bInfo?.running?'Камера маяка вкл.':'Камера маяка (опц.)';
  $('#vr-hand-camera').hidden=!bInfo?.running;
  $('#vr-hand-cal1').disabled=!hasSignal;
  $('#vr-hand-cal2').disabled=!hasSignal||wristFusion.calibratedStep<1;
  const calEl=$('#vr-hand-cal-status');
  const bTxt=bInfo?.running?` Маяк в камере: ${bInfo.status==='pair'?'видна пара пятен':bInfo.status==='single'?'видно одно пятно':'пока не в кадре'}.`:'';
  calEl.textContent=(wristCalNote||(wristFusion.calibratedStep>=2?'Калибровка двух жестов готова.':wristFusion.calibratedStep===1?'Шаг 1 записан — согните руку в локте и нажмите Жест 2.':hasSignal?'Вытяните прямую руку вперёд и нажмите Жест 1 (здесь или на браслете).':'Сначала подключите браслет.'))+bTxt;
  calEl.className=`vr-status-line ${wristFusion.calibratedStep>=2?'good':''}`;
 }
 $('#vr-start').disabled=!ready||vrCountingDown;
 const status=$('#vr-status');
 status.textContent=vrCountingDown?'Надевайте очки и смотрите прямо перед собой…':!gyro.fresh?'Сначала нужен работающий гироскоп очков.':vrSettings.mode==='fusion'&&!marker.calibrated?'Гироскоп готов. Осталось включить камеру, показать обе метки и зафиксировать центр.':vrSettings.mode==='hand'&&!ready?'Гироскоп очков готов. Подключите браслет и выполните 2 жеста калибровки.':vrSettings.mode==='hand'?'Готово: 60 Гц датчики браслета и маяк ведут игровую 3D-руку.':vrSettings.mode==='fusion'?'Готово: гироскоп ведёт взгляд, две метки удерживают центр.':'Готово: взгляд ведёт гироскоп. Если центр со временем уедет, выйдите и запустите VR снова.';
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
 if(initial){vrRestoreLow=$('#low-quality').checked;vrAppliedLow=vrSettings.quality==='low';if(world.low!==vrAppliedLow)world.setQuality(vrAppliedLow);}
}
function syncVrStereoMode(force=false){
 if(!vrActive)return;const stereo=innerWidth>=innerHeight;document.body.classList.toggle('vr-single',!stereo);
 if(force||stereo!==vrStereo){vrStereo=stereo;world.setVrStereo(stereo);}
}
async function startVrSession(){
 if(vrActive||state.phase==='inspect')return false;
 const look=ensureVrLook(),isHand=vrSettings.mode==='hand',dialog=$('#vr-dialog');
 look.setMode(vrSettings.mode==='fusion'?'fusion':'gyro');
 if(isHand){ensureWrist();wristFusion.onPhaseChange('search',performance.now());}
 if(dialog.open){vrStarting=true;dialog.close();vrStarting=false;}
 applyVrQuality(true);look.start();vrActive=true;vrFocus=state.taps*(VR_FOCUS_SECONDS/3);vrGazeHit=false;vrPendingSave=false;headShake.reset();
 document.body.classList.add('vr-active');
 world.setVrHandMode(isHand);
 vrStereo=false;syncVrStereoMode(true);world.setHeadLook(0,0);world.resize();
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
 return true;
}
function stopVr(reason='exit'){
 if(!vrActive)return false;
 if(vrPendingSave)finishVrFind('exit');
 vrActive=false;vrCountdownToken++;vrCountingDown=false;$('#vr-countdown').hidden=true;
 vrLook?.stop();vrBeaconTracker?.stop();world.setVrHandMode(false);world.setVrStereo(false);world.setHeadLook(0,0);vrStereo=false;vrFocus=0;vrGazeHit=false;headShake.reset();
 document.body.classList.remove('vr-active','vr-single');
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
 if(vrSettings.mode==='hand'){
  ensureWrist();
  vrBeaconTracker?.process(false,now);
  const beacon=vrBeaconTracker?.sample(now)||null;
  const overBin=world.handHitsBin();
  const snap=wristFusion.update(dt,{beacon,headLook:world.headLook,phase:state.phase,revealReady:!!world.revealState?.ready,handOverBin:overBin,now});
  world.updateVrHand(dt,{visible:true,handSide:snap.handSide,shoulderPos:snap.shoulderPos,elbowPos:snap.elbowPos,pos:snap.pos,vel:snap.vel,qArm:snap.qArm,reach:snap.reach,elbowBendDeg:snap.elbowBendDeg,overBin,phase:state.phase,calmLowerProgress:snap.calmLowerProgress,beaconActive:snap.trackingSource==='gyro+beacon'});
  if(state.phase==='search'){
   headShake.reset();vrGazeHit=overBin&&snap.reach>=.62;
   for(let i=0;i<snap.pokes&&state.phase==='search';i++)search();
  }else if(state.phase==='inspect'){
   vrGazeHit=false;
   world.setHandItemRotation(snap.itemRot.x,snap.itemRot.y,snap.itemRot.z);
   if(snap.decision==='discard'){
    vrPendingSave=false;headShake.reset();world.launchDiscardToss(snap.throwVel);decide(false,{fromVr:true});wristFusion.onPhaseChange('search',now);
   }else if(snap.decision==='keep'||(world.revealState?.ready&&headShake.update(look.yaw,now))){
    vrPendingSave=false;headShake.reset();decide(true,{fromVr:true});wristFusion.onPhaseChange('search',now);
   }
  }
  return;
 }
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
function vrInfoSnapshot(){return {active:vrActive,stereo:vrStereo,settings:{...vrSettings},focus:+vrFocus.toFixed(3),gazeHit:vrGazeHit,pendingSave:vrPendingSave,pendingCompletion,shake:headShake.info(),look:vrLook?.info()||null,wrist:wristFusion?{link:wristLink?.status()||null,beacon:vrBeaconTracker?.info()||null,hand:wristFusion.snapshot()}:null,world:world?.vrInfo()||null};}
function setVrGyroAbsolute(yawDeg,pitchDeg,steps=10,dt=.03){
 const look=ensureVrLook(),gyro=look.gyro,start={...gyro.raw},target={yaw:yawDeg*Math.PI/180,pitch:pitchDeg*Math.PI/180},n=Math.max(1,steps|0);
 gyro.lastAt=performance.now();if(vrActive)updateVrFrame(0,gyro.lastAt);else stepVrLook(0);
 for(let i=1;i<=n;i++){gyro.raw={yaw:start.yaw+(target.yaw-start.yaw)*i/n,pitch:start.pitch+(target.pitch-start.pitch)*i/n};gyro.lastAt=performance.now();if(vrActive)updateVrFrame(dt,gyro.lastAt);else stepVrLook(dt);}
 world.update(0);gyro.lastAt=performance.now();return vrInfoSnapshot();
}
function tick(time){raf=requestAnimationFrame(tick);if(dialogs.some(d=>d.open)){if($('#vr-dialog').open&&!paused){vrLook?.processPrep();if(vrSettings.mode==='hand')vrBeaconTracker?.process();syncVrPrep();}lastTime=time;return;}if(paused||world.testRevealHold){lastTime=time;return;}const rawDt=lastTime?(time-lastTime)/1000:.016;lastTime=time;const dt=Math.min(rawDt,.1);if(vrActive)updateVrFrame(dt,time);world.update(dt,rawDt);syncReveal();if(!vrActive)syncBinTag();}
function bind(){
 $$('[data-pose]').forEach(b=>b.addEventListener('click',()=>{world.setPose(b.dataset.pose);updateViews();}));
 $('#zoom-in').addEventListener('click',()=>{world.setZoom(.2);updateZoom();});$('#zoom-out').addEventListener('click',()=>{world.setZoom(-.2);updateZoom();});$('#zoom-reset').addEventListener('click',()=>{world.setZoom(1-world.zoom);updateZoom();});
 $('#search-button').addEventListener('click',search);$('#discard').addEventListener('click',()=>decide(false));$('#keep').addEventListener('click',()=>decide(true));$('#close-review').addEventListener('click',closeReview);
 $('#open-collection').addEventListener('click',openCollection);$('#open-settings').addEventListener('click',()=>{$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;$('#settings-dialog').showModal();});
 $('#open-vr').addEventListener('click',openVr);
 $$('[data-vr-mode]').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.vrMode;vrSettings.mode=m==='fusion'?'fusion':m==='hand'?'hand':'gyro';persistVrSettings();vrPickSide=null;vrPrepNote='';ensureVrLook().setMode(vrSettings.mode==='fusion'?'fusion':'gyro');syncVrPrep();}));
 $('#vr-gyro-btn').addEventListener('click',async()=>{vrPrepNote='';await ensureVrLook().requestGyro();syncVrPrep();});
 $('#vr-start-camera').addEventListener('click',async()=>{vrPrepNote='';const look=ensureVrLook();look.tracker.error=null;await look.startCamera();syncVrPrep();});
 $$('.vr-pick').forEach(b=>b.addEventListener('click',()=>{const side=b.id==='vr-pick-left'?'left':'right';vrPrepNote='';vrPickSide=vrPickSide===side?null:side;syncVrPrep();}));
 $('#vr-camera').addEventListener('click',e=>{if(!vrPickSide)return;const look=ensureVrLook(),sample=look.tracker.sampleColor(e.clientX,e.clientY,e.currentTarget.getBoundingClientRect());if(!sample||sample.chroma<35)return;if(vrPickSide==='left')vrSettings.leftHue=Math.round(sample.hue);else vrSettings.rightHue=Math.round(sample.hue);look.setHues(vrSettings.leftHue,vrSettings.rightHue);if(look.tracker.calibrated)look.tracker.clearCalibration();persistVrSettings();vrPrepNote='Цвет обновлён. Покажите обе метки и снова зафиксируйте центр.';vrPickSide=null;look.tracker.process(true);syncVrPrep();});
 $('#vr-calibrate').addEventListener('click',()=>{const look=ensureVrLook();look.tracker.process(true);const result=look.tracker.calibrate();vrPrepNote=result.ok?'':result.message;syncVrPrep();});
 $$('[data-hand-side]').forEach(b=>b.addEventListener('click',()=>setVrHandSide(b.dataset.handSide)));
 $('#vr-hand-room-btn').addEventListener('click',async()=>{ensureWrist();wristCalNote='';await wristLink.startFirebase($('#vr-hand-fb')?.value||'');syncVrPrep();});
 $('#vr-hand-demo-btn').addEventListener('click',()=>{ensureWrist();wristCalNote='';wristLink.startDemo('111111');syncVrPrep();});
 $('#vr-hand-cam-btn').addEventListener('click',async()=>{const tr=ensureBeaconTracker();if(tr.running)tr.stop();else await tr.start($('#vr-hand-camera'));syncVrPrep();});
 $('#vr-hand-cal1').addEventListener('click',()=>runWristCalibrationStep('pose1'));
 $('#vr-hand-cal2').addEventListener('click',()=>runWristCalibrationStep('pose2'));
 $('#vr-start').addEventListener('click',beginVrCountdown);
 $('#vr-quality').value=vrSettings.quality;$('#vr-quality').addEventListener('change',e=>{vrSettings.quality=e.target.value;persistVrSettings();});
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
 dialogs.forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{drag=null;lastTime=0;if(d.id==='vr-dialog'&&!vrStarting&&!vrActive){vrCountdownToken++;vrCountingDown=false;$('#vr-countdown').hidden=true;vrPickSide=null;vrPrepNote='';vrLook?.stop();vrBeaconTracker?.stop();}});});
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCollection();}));
 $('#low-quality').addEventListener('change',e=>{world.setQuality(e.target.checked);world.update(.016);try{storage.setItem('white-night-quality',e.target.checked?'low':'high');}catch{}});
 $('#reset-button').addEventListener('click',()=>{$('#reset-confirm').hidden=false;$('#reset-button').hidden=true;});$('#reset-cancel').addEventListener('click',()=>{$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;});$('#reset-yes').addEventListener('click',reset);
 $('#continue-button').addEventListener('click',()=>$('#complete-dialog').close());$('#view-complete').addEventListener('click',()=>{$('#complete-dialog').close();openCollection();});
 const canvas=$('#world');canvas.addEventListener('pointerdown',e=>{if(vrActive){clearTimeout(vrHoldTimer);vrHoldTimer=setTimeout(()=>stopVr('long-press'),900);return;}if(dialogs.some(d=>d.open)||drag||!e.isPrimary)return;if(state.phase==='inspect'){world.finishReveal();syncReveal();}drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>10){drag.moved=true;if(state.phase!=='inspect'&&!vrActive)markLookUsed();}if(state.phase==='inspect'){world.rotate(dx,dy);updateViews();}else if(!vrActive){world.lookBy(dx,dy);}drag.x=e.clientX;drag.y=e.clientY;});
 canvas.addEventListener('pointerup',e=>{clearTimeout(vrHoldTimer);if(!drag||drag.id!==e.pointerId)return;const tap=!drag.moved;drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(tap&&state.phase==='search'&&world.hitBin(e.clientX,e.clientY))search();});canvas.addEventListener('pointercancel',()=>{clearTimeout(vrHoldTimer);drag=null;});canvas.addEventListener('lostpointercapture',()=>{clearTimeout(vrHoldTimer);drag=null;});
 document.addEventListener('visibilitychange',()=>{paused=document.hidden;drag=null;lastTime=0;if(document.hidden&&vrActive)stopVr('hidden');});window.addEventListener('blur',()=>drag=null);window.addEventListener('resize',()=>{world.resize();if(vrActive)syncVrStereoMode();if(dialogs.some(d=>d.open))world.update(.016);});
 document.addEventListener('fullscreenchange',()=>{if(vrActive&&!document.fullscreenElement)stopVr('fullscreen');});window.addEventListener('pagehide',()=>{if(vrPendingSave)finishVrFind('pagehide');if(vrActive)vrLook?.stop();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&vrActive){e.preventDefault();stopVr('escape');return;}if(e.key==='Escape'&&!dialogs.some(d=>d.open)&&state.phase==='inspect'){e.preventDefault();if(state.reviewing)closeReview();else{world.finishReveal();syncReveal();decide(false);}}});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;$('#webgl-error').hidden=false;});
}
async function start(){
 try{world=new World($('#world'));try{if(storage.getItem('white-night-quality')==='low'){world.setQuality(true);$('#low-quality').checked=true;}}catch{}
 bind();updateUI();await Promise.all([document.fonts.ready,materialAssetsReady()]);world.update(.016);$('#loading').hidden=true;window.__READY__=true;raf=requestAnimationFrame(tick);
 if(testing){window.__WORLD__=world;}
 if(testing)window.__GAME_TEST__={getState:()=>structuredClone(state),getMetrics:()=>world.metrics(),settle:()=>{world.finishReveal();world.kick=0;world.dirty=true;world.update(.016);syncReveal();},seekReveal:p=>{world.testRevealHold=true;world.reveal=Math.max(0,Math.min(1,p));world.applyReveal();world.dirty=true;world.update(0);syncReveal();},setPose:pose=>{world.setPose(pose);world.update(.1);updateViews();},getRotation:()=>({x:world.targetX,y:world.targetY}),binScreen:()=>world.binScreen(),forceNext:id=>{if(!ITEMS.some(i=>i.id===id))throw Error('unknown item');forcedItem=id;},
   setView:view=>{const r=world.setView(view);world.update(.016);return r;},
   look:(yawDeg,pitchDeg)=>{world.lookBy(0,0);world.headLook.yaw=THREE_clamp(yawDeg,-41,41)*Math.PI/180;world.headLook.pitch=Math.max(-9,Math.min(60,pitchDeg))*Math.PI/180;world.applyCameraPose();world.dirty=true;world.update(.016);return world.lookInfo();},
   sky:()=>({stars:world.sky.stars.geometry.attributes.position.count,moon:world.sky.moon.position.toArray().map(v=>+v.toFixed(2)),direction:world.sky.moonDirection.toArray().map(v=>+v.toFixed(3))}),reset:()=>{dialogs.forEach(d=>d.close());reset();},setCollection:ids=>{state=initialState({collection:ids,searches:ids.length});world.hide();persist();updateUI();},isPaused:()=>paused,items:ITEMS.map(i=>i.id),
   scene:()=>({staticVisible:world.static.visible,drawCalls:world.renderer.info.render.calls,headLook:world.lookInfo(),sky:{stars:world.sky.stars.geometry.attributes.position.count,moonVisible:world.sky.moon.visible}}),
   vr:{
   info:()=>vrInfoSnapshot(),
   open:()=>openVr(),
   setMode:mode=>{vrSettings.mode=mode==='fusion'?'fusion':mode==='hand'?'hand':'gyro';persistVrSettings();ensureVrLook().setMode(vrSettings.mode==='fusion'?'fusion':'gyro');syncVrPrep();return vrInfoSnapshot();},
   setHandSide:side=>{setVrHandSide(side);return vrInfoSnapshot();},
   requestGyro:()=>ensureVrLook().requestGyro(),
   gyro:(yawDeg,pitchDeg,steps=10,dt=.03)=>setVrGyroAbsolute(yawDeg,pitchDeg,steps,dt),
   marker:(markers,now)=>ensureVrLook().tracker.inject(markers,now),
   calibrate:now=>ensureVrLook().tracker.calibrate(now),
   wristDemo:code=>{ensureWrist();return wristLink.startDemo(code||'111111');},
   wristPacket:(pkt,now=performance.now())=>{ensureWrist();wristLink.injectPacket(pkt,now);return vrInfoSnapshot();},
   wristBeacon:(spots,now=performance.now())=>{ensureWrist();return ensureBeaconTracker().inject(spots,now);},
   wristCalibrateStretch:()=>runWristCalibrationStep('pose1'),
   wristCalibrateBend:()=>runWristCalibrationStep('pose2'),
   start:()=>startVrSession(),
   stop:()=>stopVr('test'),
   step:(seconds=.1,nowBase)=>{let left=Math.max(0,seconds),t=nowBase;while(left>0){const dt=Math.min(.05,left);if(t!==undefined)t+=dt*1000;if(vrLook)vrLook.gyro.lastAt=performance.now();updateVrFrame(dt,t!==undefined?t:performance.now());left-=dt;}world.update(0);return vrInfoSnapshot();},
   shake:(amplitudeDeg=25)=>{for(const yaw of [-amplitudeDeg,amplitudeDeg,-amplitudeDeg])setVrGyroAbsolute(yaw,0,10,.03);return vrInfoSnapshot();},
   settings:()=>({...vrSettings}),
   finish:()=>finishVrFind('test')
  }};
 if(import.meta.env.PROD&&'serviceWorker' in navigator)navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{console.warn('Offline mode could not be enabled.');});
 }catch(error){console.error(error);$('#loading').hidden=true;$('#webgl-error').hidden=false;cancelAnimationFrame(raf);}
}
start();
