import './style.css';
import { World } from './world.js';
import { ZOOM, calloutPosition } from './presentation.js';
import { materialAssetsReady } from './materials.js';
import { ITEMS, RARITY, initialState, chooseItem, transition, loadSave, saveState } from './state.js';
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const icon=id=>`<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
let storage;try{storage=window.localStorage;}catch{storage={getItem(){return null;},setItem(){throw Error('storage unavailable');}};}
let state=loadSave(storage),world,filter='all',drag=null,toastTimer,feedbackTimer,lastRevealPhase=null,lastTime=0,raf=0,paused=document.hidden,forcedItem=null;
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
 $('#header-count').innerHTML=`${String(state.collection.length).padStart(2,'0')} <small>/ 18</small>`;
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
function search(){if(state.phase!=='search'||dialogs.some(d=>d.open)||paused)return;world.poke(state.taps+1);let itemId=forcedItem || (state.searches===0?'camera':chooseItem().id);state=transition(state,{type:'tap',itemId});if(state.phase==='inspect'){forcedItem=null;world.show(state.current);persist();}updateUI();}
function decide(keep){if(state.phase!=='inspect'||state.reviewing||!world.revealState?.ready)return;const item=ITEMS.find(i=>i.id===state.current),duplicate=state.collection.includes(item.id),before=state.collection.length;state=transition(state,{type:keep?'keep':'discard'});world.hide();persist();updateUI();notify(keep?(duplicate?'Уже сохранено. Продолжим искать?':`${item.name} — теперь в коллекции`):'Оставлено во дворе. Ищем дальше.',keep?(duplicate?'duplicate':'kept'):'discarded');if(keep&&!duplicate)collectionFeedback();if(before<18&&state.collection.length===18){renderComplete();$('#complete-dialog').showModal();}}
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
 if(state.phase!=='search')return;
 const p=calloutPosition(world.binEdge(),{width:tag.offsetWidth,height:tag.offsetHeight},{width:innerWidth,height:innerHeight});
 tag.classList.toggle('points-left',p.right);
 tag.style.left=`${Math.round(p.x)}px`;tag.style.top=`${Math.round(p.y)}px`;
}
function tick(time){raf=requestAnimationFrame(tick);if(paused||dialogs.some(d=>d.open)||world.testRevealHold){lastTime=time;return;}const rawDt=lastTime?(time-lastTime)/1000:.016;lastTime=time;world.update(Math.min(rawDt,.1),rawDt);syncReveal();syncBinTag();}
function bind(){
 $$('[data-pose]').forEach(b=>b.addEventListener('click',()=>{world.setPose(b.dataset.pose);updateViews();}));
 $('#zoom-in').addEventListener('click',()=>{world.setZoom(.2);updateZoom();});$('#zoom-out').addEventListener('click',()=>{world.setZoom(-.2);updateZoom();});$('#zoom-reset').addEventListener('click',()=>{world.setZoom(1-world.zoom);updateZoom();});
 $('#search-button').addEventListener('click',search);$('#discard').addEventListener('click',()=>decide(false));$('#keep').addEventListener('click',()=>decide(true));$('#close-review').addEventListener('click',closeReview);
 $('#open-collection').addEventListener('click',openCollection);$('#open-settings').addEventListener('click',()=>{$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;$('#settings-dialog').showModal();});
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
 dialogs.forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{drag=null;lastTime=0;});});
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCollection();}));
 $('#low-quality').addEventListener('change',e=>{world.setQuality(e.target.checked);world.update(.016);try{storage.setItem('white-night-quality',e.target.checked?'low':'high');}catch{}});
 $('#reset-button').addEventListener('click',()=>{$('#reset-confirm').hidden=false;$('#reset-button').hidden=true;});$('#reset-cancel').addEventListener('click',()=>{$('#reset-confirm').hidden=true;$('#reset-button').hidden=false;});$('#reset-yes').addEventListener('click',reset);
 $('#continue-button').addEventListener('click',()=>$('#complete-dialog').close());$('#view-complete').addEventListener('click',()=>{$('#complete-dialog').close();openCollection();});
 const canvas=$('#world');canvas.addEventListener('pointerdown',e=>{if(dialogs.some(d=>d.open)||drag||!e.isPrimary)return;if(state.phase==='inspect'){world.finishReveal();syncReveal();}drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>10)drag.moved=true;if(state.phase==='inspect'){world.rotate(dx,dy);updateViews();}drag.x=e.clientX;drag.y=e.clientY;});
 canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const tap=!drag.moved;drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(tap&&state.phase==='search'&&world.hitBin(e.clientX,e.clientY))search();});canvas.addEventListener('pointercancel',()=>drag=null);canvas.addEventListener('lostpointercapture',()=>drag=null);
 document.addEventListener('visibilitychange',()=>{paused=document.hidden;drag=null;lastTime=0;});window.addEventListener('blur',()=>drag=null);window.addEventListener('resize',()=>{world.resize();if(dialogs.some(d=>d.open))world.update(.016);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialogs.some(d=>d.open)&&state.phase==='inspect'){e.preventDefault();if(state.reviewing)closeReview();else{world.finishReveal();syncReveal();decide(false);}}});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;$('#webgl-error').hidden=false;});
}
async function start(){
 try{world=new World($('#world'));try{if(storage.getItem('white-night-quality')==='low'){world.setQuality(true);$('#low-quality').checked=true;}}catch{}
 bind();updateUI();await Promise.all([document.fonts.ready,materialAssetsReady()]);world.update(.016);$('#loading').hidden=true;window.__READY__=true;raf=requestAnimationFrame(tick);
 if(testing)window.__GAME_TEST__={getState:()=>structuredClone(state),getMetrics:()=>world.metrics(),settle:()=>{world.finishReveal();world.kick=0;world.dirty=true;world.update(.016);syncReveal();},seekReveal:p=>{world.testRevealHold=true;world.reveal=Math.max(0,Math.min(1,p));world.applyReveal();world.dirty=true;world.update(0);syncReveal();},setPose:pose=>{world.setPose(pose);world.update(.1);updateViews();},getRotation:()=>({x:world.targetX,y:world.targetY}),binScreen:()=>world.binScreen(),forceNext:id=>{if(!ITEMS.some(i=>i.id===id))throw Error('unknown item');forcedItem=id;},reset:()=>{dialogs.forEach(d=>d.close());reset();},setCollection:ids=>{state=initialState({collection:ids,searches:ids.length});world.hide();persist();updateUI();},isPaused:()=>paused,items:ITEMS.map(i=>i.id)};
 if(import.meta.env.PROD&&'serviceWorker' in navigator)navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{console.warn('Offline mode could not be enabled.');});
 }catch(error){console.error(error);$('#loading').hidden=true;$('#webgl-error').hidden=false;cancelAnimationFrame(raf);}
}
start();
