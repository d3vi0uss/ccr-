const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rarityOdds = [
  ['Consumer', .35],['Industrial', .25],['Mil-Spec', .2],['Restricted', .12],['Classified', .06],['Covert', .019],['Knife', .001]
];
const cases = [
  {name:'Dreams & Nightmares',price:2.5},{name:'Recoil',price:2.5},{name:'Fracture',price:2.5},{name:'Prisma 2',price:2.5},{name:'Gamma',price:3.0},{name:'Operation Broken Fang',price:5}
];
const guns = ['AK-47','M4A1-S','AWP','Glock-18','USP-S','Desert Eagle','MP9','P90','FAMAS','Galil AR'];
const knives=['Karambit','Butterfly Knife','M9 Bayonet','Flip Knife','Talon Knife'];

const state = JSON.parse(localStorage.getItem('csSim')||'null') || {
  user:null,cash:1000,bank:0,xp:0,level:1,click:1,inventory:[],history:[],opened:0,profit:0,best:0,missions:[
    {t:'Open 3 cases',c:0,g:3,r:100},{t:'Win 2 casino games',c:0,g:2,r:150},{t:'Earn 500 by clicking',c:0,g:500,r:200}
  ],casinoWins:0,clickEarn:0,loan:0
};
const save=()=>localStorage.setItem('csSim',JSON.stringify(state));
const luck = () => (new Date().getDay()%6===0?2:1);
function rollRarity(){let r=Math.random(),a=0; for(const [n,p] of rarityOdds){a+=p*luck(); if(r<=Math.min(1,a)) return n;} return 'Consumer';}
function valueByRarity(r){return ({Consumer:0.05,Industrial:0.15,'Mil-Spec':0.8,Restricted:2,Classified:8,Covert:30,Knife:300}[r]||0.1)*(0.8+Math.random()*0.8)}
function randomSkin(){const r=rollRarity(); const weapon=r==='Knife'?knives[Math.floor(Math.random()*knives.length)]:guns[Math.floor(Math.random()*guns.length)];
  return {weapon,rarity:r,float:+Math.random().toFixed(4),pattern:Math.floor(Math.random()*1000),value:+valueByRarity(r).toFixed(2),fav:false};}
function addHistory(t){state.history.unshift(`${new Date().toLocaleTimeString()} - ${t}`); state.history=state.history.slice(0,60);}
function updateUI(){
  $('#cash').textContent=`$${state.cash.toFixed(2)}`; $('#bank').textContent=`Bank: $${state.bank.toFixed(2)}`;
  $('#xp').textContent=`XP: ${state.xp}`; $('#level').textContent=`Lvl ${state.level}`; $('#perClick').textContent=state.click;
  $('#luck').textContent=`Luck x${luck()}`;
  $('#history').innerHTML=state.history.map(x=>`<li>${x}</li>`).join('');
  $('#statsOut').textContent=`Opened: ${state.opened} | Profit: $${state.profit.toFixed(2)} | Best Pull: $${state.best.toFixed(2)} | Inventory: ${state.inventory.length} items.`;
  $('#missionList').innerHTML=state.missions.map((m,i)=>`<li>${m.t} (${m.c}/${m.g}) ${m.c>=m.g?'✅':'<button onclick="claimMission('+i+')">Claim $'+m.r+'</button>'}</li>`).join('');
  renderInventory(); drawGraph(); save();
}
window.claimMission=(i)=>{const m=state.missions[i]; if(m.c>=m.g&&!m.done){state.cash+=m.r; m.done=true; addHistory(`Mission reward +$${m.r}`); updateUI();}}

$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.tab').forEach(t=>t.classList.remove('active'));$('#'+b.dataset.tab).classList.add('active');});

$('#clickBtn').onclick=()=>{state.cash+=state.click;state.clickEarn+=state.click;state.xp+=1; if(state.xp>=state.level*100){state.level++; addHistory('Level up!');} addHistory(`Clicked +$${state.click}`);state.missions[2].c=Math.min(state.missions[2].g,state.clickEarn); updateUI();}
$('#upgradeClick').onclick=()=>{if(state.cash>=50){state.cash-=50;state.click+=1;addHistory('Upgraded click power');updateUI();}}
$('#rebirthBtn').onclick=()=>{if(state.level>=10){state.level=1;state.xp=0;state.click+=3;addHistory('Rebirth complete +3 click');updateUI();}}

cases.forEach(c=>$('#caseSelect').innerHTML+=`<option value="${c.name}">${c.name} - $${c.price}</option>`);
function spinnerAnim(){const s=$('#spinner'); s.innerHTML=''; for(let i=0;i<18;i++){const sk=randomSkin(); s.innerHTML+=`<div class="card ${sk.rarity}">${sk.weapon}<br><small>${sk.rarity}</small></div>`;} s.style.transform='translateX(0)'; setTimeout(()=>s.style.transform=`translateX(-${(Math.random()*800+200).toFixed(0)}px)`,20)}
$('#openCase').onclick=()=>{
  const c=cases.find(x=>x.name==$('#caseSelect').value),n=Math.max(1,Math.min(10,+$('#openCount').value||1)); const cost=c.price*n;
  if(state.cash<cost) return; state.cash-=cost; spinnerAnim();
  const pulls=[]; for(let i=0;i<n;i++){const sk=randomSkin(); state.inventory.push(sk); pulls.push(sk); state.opened++; state.profit+=sk.value-c.price; state.best=Math.max(state.best,sk.value);
    if(sk.rarity==='Knife') document.body.classList.add('sparkle'), setTimeout(()=>document.body.classList.remove('sparkle'),1300);
  }
  state.missions[0].c=Math.min(state.missions[0].g,state.opened);
  $('#pulls').innerHTML=pulls.map(sk=>`<div class="card ${sk.rarity}"><b>${sk.weapon}</b><br>${sk.rarity}<br>Float ${sk.float}<br>Seed #${sk.pattern}<br>$${sk.value}<br><button onclick="fav(${state.inventory.indexOf(sk)})">★</button></div>`).join('');
  addHistory(`Opened ${n} ${c.name} case(s)`); state.xp+=5*n; updateUI();
}
window.fav=(i)=>{state.inventory[i].fav=!state.inventory[i].fav;updateUI()}
function renderInventory(){
  const rf=$('#rarityFilter').value,q=$('#searchSkin').value?.toLowerCase()||'';
  let items=state.inventory.filter(s=>(rf==='all'||s.rarity===rf)&&s.weapon.toLowerCase().includes(q));
  $('#inventoryGrid').innerHTML=items.map((s,i)=>`<div class="card ${s.rarity}">${s.fav?'⭐':''}${s.weapon}<br>${s.rarity}<br>$${s.value}</div>`).join('');
}
$('#rarityFilter').onchange=renderInventory; $('#searchSkin').oninput=renderInventory; $('#sortValue').onclick=()=>{state.inventory.sort((a,b)=>b.value-a.value);updateUI()}

function gamble(cost,multi,out){if(state.cash<cost)return;state.cash-=cost;const win=Math.random()<0.48;if(win){const p=cost*multi;state.cash+=p;state.casinoWins++;state.missions[1].c=Math.min(state.missions[1].g,state.casinoWins);out.textContent=`Win $${p.toFixed(2)}`}else out.textContent='Lose';addHistory(`Casino ${win?'win':'loss'}`);updateUI();}
$('#playRoulette').onclick=()=>gamble(+$('#roulBet').value||10,2,$('#roulOut')); $('#playBlackjack').onclick=()=>gamble(20,2.2,$('#bjOut')); $('#playCoin').onclick=()=>gamble(15,1.9,$('#coinOut'));
$('#playCrash').onclick=()=>gamble(25,1+Math.random()*4,$('#crashOut')); $('#playMines').onclick=()=>gamble(10,2.5,$('#minesOut')); $('#playSlots').onclick=()=>gamble(5,4,$('#slotOut'));

$('#startBattle').onclick=()=>{const b=+$('#battleBet').value||50;if(state.cash<b)return;state.cash-=b;const you=randomSkin(),opp=randomSkin();const win=you.value>=opp.value;const payout=win?b+opp.value:b*0; if(win)state.cash+=payout;$('#battleOut').textContent=`You: ${you.weapon} $${you.value} vs Opp: ${opp.weapon} $${opp.value} => ${win?'WIN':'LOSS'} ${win?`+$${payout.toFixed(2)}`:''}`;addHistory('Case battle played');updateUI();}

$('#depositBank').onclick=()=>{if(state.cash>=100){state.cash-=100;state.bank+=100;updateUI();}}
$('#withdrawBank').onclick=()=>{if(state.bank>=100){state.bank-=100;state.cash+=100;updateUI();}}
$('#takeLoan').onclick=()=>{state.cash+=500;state.loan+=650;$('#loanOut').textContent='Loan taken: repay $650';updateUI();}
setInterval(()=>{if(state.bank>0){state.bank*=1.001;} if(state.loan>0){state.loan*=1.0008;} },5000);

const users=JSON.parse(localStorage.getItem('users')||'{}');
$('#signup').onclick=()=>{users[$('#username').value]=$('#password').value;localStorage.setItem('users',JSON.stringify(users));$('#authOut').textContent='Signed up';}
$('#login').onclick=()=>{const u=$('#username').value,p=$('#password').value;if(users[u]===p){state.user=u;$('#authOut').textContent='Logged in';addHistory(`Logged in as ${u}`);updateUI();}else $('#authOut').textContent='Invalid';}
$('#spawnKnife').onclick=()=>{if(state.user!=='d3vi0us') return $('#adminOut').textContent='Not authorized'; const k={weapon:'Karambit',rarity:'Knife',float:0.01,pattern:1,value:999,fav:false};state.inventory.push(k);$('#adminOut').textContent='Spawned knife';updateUI();}
$('#boostEco').onclick=()=>{if(state.user!=='d3vi0us') return $('#adminOut').textContent='Not authorized';state.cash+=10000;$('#adminOut').textContent='Economy boosted';updateUI();}

$('#themeBtn').onclick=()=>document.documentElement.classList.toggle('light');
function drawGraph(){const c=$('#trendChart');if(!c)return;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.strokeStyle='#59f';x.beginPath();for(let i=0;i<40;i++){const y=100+Math.sin((Date.now()/5000+i))*30+Math.random()*20;if(i===0)x.moveTo(i*10,y);else x.lineTo(i*10,y)}x.stroke();}
setInterval(drawGraph,3000);
updateUI();
