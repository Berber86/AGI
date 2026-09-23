import { generateCard, checkCombination, compatible } from '../src/engine/cardgen.js';
import { DISCOVERY_LIST } from '../src/engine/discoveries.js';

const show = (ids) => {
  const c = generateCard(ids);
  if (!c) { console.log(ids.join(','), '-> НЕЛЬЗЯ:', checkCombination(ids).reason); return; }
  console.log(`[${c.rarityName}] ${c.name}  (${c.eraName}, ${c.domainName}/${c.archetype}, чистота=${c.purity})`);
  console.log(`   ${c.atk}/${c.hp} за ${c.cost} энергии   слоты: ${c.components.map(x=>x.name).join(' + ')}`);
  console.log(`   шестерни: ${Object.entries(c.gearCounts).map(([g,n])=>g+(n>1?'x'+n:'')).join(' ')}`);
  console.log(`   свойства: ${c.keywords.map(k=>k.name+(k.lvl>1?' '+k.lvl:'')).join(', ')||'—'}`);
  console.log(`   не влезло: ${c.unusedKeywords.map(k=>k.name).join(', ')||'—'}`);
};

show(['bronze']);
show(['phalanx','iron']);
show(['gunpowder','steel','chivalry']);
show(['musket','linear_tac','cannons','steel']);
show(['steam','bessemer','electricity','telegraph']);
show(['computer','robotics','machine_learning','internet']);
show(['agriculture','herbs','taming']);
show(['nuclear_phys','genetics','neuroscience','antibiotics']);
show(['fire_mastery','writing']);
show(['stars','cartography','telescope','radar']);

// статистика по всем случайным совместимым наборам
console.log('\n--- распределение ---');
import { makeRng } from '../src/engine/rng.js';
const rng = makeRng(7);
let ok=0, bad=0; const costs={}, stats=[];
for (let i=0;i<4000;i++){
  const slots = 1+rng.int(4);
  const ids=[];
  for(let s=0;s<slots;s++){
    const pool = DISCOVERY_LIST.filter(d=>!ids.includes(d.id) && (ids.length===0|| ids.every(x=>compatible(x,d.id)) ));
    if(!pool.length) break;
    ids.push(rng.pick(pool).id);
  }
  if(ids.length!==slots){bad++;continue;}
  const c = generateCard(ids);
  if(!c){bad++;continue;}
  ok++;
  costs[c.era]=(costs[c.era]||0)+c.cost;
  stats.push({era:c.era,slots:c.slots,atk:c.atk,hp:c.hp,cost:c.cost,kw:c.keywords.length});
}
console.log('ok',ok,'bad',bad);
for(const era of [1,2,3,4,5,6]){
  const s=stats.filter(x=>x.era===era);
  if(!s.length) continue;
  const avg=(f)=>(s.reduce((a,x)=>a+f(x),0)/s.length).toFixed(2);
  console.log(`Эпоха ${era}: n=${s.length} atk=${avg(x=>x.atk)} hp=${avg(x=>x.hp)} cost=${avg(x=>x.cost)} kw=${avg(x=>x.kw)}`);
}
