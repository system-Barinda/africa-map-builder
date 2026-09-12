const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
const $=id=>document.getElementById(id);
const screens=["startScreen","levelScreen","shopScreen","dailyScreen","resultScreen"];
const LS="orbit-neon-v2";
let saveData=JSON.parse(localStorage.getItem(LS)||"null")||{
  unlocked:1,best:{},stars:{},coins:0,owned:["neon"],theme:"neon",muted:false,daily:{},streak:0,lastDaily:""
};
let W=480,H=860,dpr=1,last=0;
const game={running:false,level:1,daily:false,moves:12,maxMoves:12,angle:-Math.PI*.9,step:Math.PI/6,history:[],won:false,shake:0,particles:[],pulse:0};

const themes={
 neon:{name:"NEON",cost:0,pink:"#ff00b7",cyan:"#18f7ff",ring:"#ff00e6",bg:"#000"},
 ember:{name:"EMBER",cost:500,pink:"#ff5a00",cyan:"#ffd23f",ring:"#ff5a00",bg:"#050000"},
 ice:{name:"ICE",cost:900,pink:"#6b7cff",cyan:"#a8ffff",ring:"#7188ff",bg:"#00030a"},
 cyber:{name:"CYBER",cost:1500,pink:"#d400ff",cyan:"#00ff8c",ring:"#d400ff",bg:"#020002"}
};

function save(){localStorage.setItem(LS,JSON.stringify(saveData))}
function theme(){return themes[saveData.theme]||themes.neon}
function applyTheme(){const t=theme();document.documentElement.style.setProperty("--pink",t.pink);document.documentElement.style.setProperty("--cyan",t.cyan);document.documentElement.style.setProperty("--bg",t.bg)}
applyTheme();

function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener("resize",resize);resize();

function rng(seed){let x=Math.sin(seed*999.91)*43758.5453;return x-Math.floor(x)}
function levelConfig(n,daily=false){
  if(daily){let seed=new Date().toISOString().slice(0,10).split("-").join(""); n=Number(seed.slice(-4));}
  const difficulty=Math.min(5,Math.floor((n-1)/10)+1);
  const max=12+Math.min(4,Math.floor((n-1)/15));
  const start=-Math.PI*.88;
  let targetStep=Math.min(max-2,3+((n*3)%Math.max(4,max-2)));
  const obstacles=[];
  const count=Math.min(1+difficulty,5);
  for(let i=0;i<count;i++){
    let s=(targetStep+(i+1)*2+(n%3))%12;
    if(s<1)s+=2;
    obstacles.push({step:s,ring:i%2});
  }
  return {maxMoves:max,step:Math.PI/6,start,targetStep,obstacles,difficulty};
}
function pointAt(step){const ringR=Math.min(W*.405, H*.225);const cx=W*.5,cy=H*.39;const a=game.angle;return{x:cx+Math.cos(a+step*game.step)*ringR,y:cy+Math.sin(a+step*game.step)*ringR}}
function orbitGeometry(){return{cx:W*.5,cy:H*.39,r:Math.min(W*.405,H*.225),secondY:H*.67}}

function resetGame(n=game.level,daily=false){
  game.level=n;game.daily=daily;game.running=false;game.won=false;game.history=[];game.particles=[];
  const c=levelConfig(n,daily);game.maxMoves=c.maxMoves;game.moves=c.maxMoves;game.step=c.step;game.angle=c.start;
  $("level").textContent=daily?"D":n; $("moves").textContent=game.moves;
  $("progressBar").style.width="0%"; $("hint").textContent=daily?"DAILY — REACH THE CYAN GATE":"REACH THE CYAN GATE";
  show("gameUI");hide("resultScreen");hide("bottomNav");playBtnText();
}
function show(id){$(id).classList.remove("hidden")}function hide(id){$(id).classList.add("hidden")}
function showOnly(id){screens.forEach(x=>hide(x));show(id)}
function home(){game.running=false;showOnly("startScreen");show("bottomNav");updateStart();renderLevels()}
function updateStart(){$("startBest").textContent=Math.max(0,...Object.values(saveData.best).map(Number),0)}
function openLevels(){game.running=false;showOnly("levelScreen");show("bottomNav");renderLevels()}
function openShop(){game.running=false;showOnly("shopScreen");show("bottomNav");renderShop()}
function openDaily(){game.running=false;showOnly("dailyScreen");show("bottomNav");renderDaily()}
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=home);
$("startGame").onclick=()=>resetGame(Math.min(saveData.unlocked,50),false);
$("dailyFromStart").onclick=openDaily;
$("homeBtn").onclick=home;
document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>({levels:openLevels,daily:openDaily,shop:openShop}[b.dataset.nav])());

function renderLevels(){
 const g=$("levelGrid");g.innerHTML="";
 for(let i=1;i<=50;i++){
  const b=document.createElement("button");b.className="level-tile "+(i<=saveData.unlocked?"unlocked":"locked")+(i===game.level?" current":"");
  const stars=saveData.stars[i]||0;b.innerHTML=`${i<=saveData.unlocked?i:"🔒"}<div class="tile-stars">${"★".repeat(stars)}${"☆".repeat(3-stars)}</div>`;
  if(i<=saveData.unlocked)b.onclick=()=>resetGame(i,false);g.appendChild(b);
 }
}
function renderShop(){
 const g=$("shopGrid");$("shopCoins").textContent=saveData.coins;g.innerHTML="";
 Object.entries(themes).forEach(([key,t])=>{
  const b=document.createElement("button");b.className="shop-item "+(saveData.owned.includes(key)?"owned ":"")+(saveData.theme===key?"active":"");
  b.innerHTML=`<div class="shop-swatch" style="background:${t.bg};border-color:${t.pink}"><span style="color:${t.cyan}">◆</span></div><div class="shop-name">${t.name}</div><div class="shop-price">${saveData.owned.includes(key)?(saveData.theme===key?"EQUIPPED":"OWNED"):"◆ "+t.cost}</div>`;
  b.onclick=()=>buyTheme(key);g.appendChild(b);
 });
}
function buyTheme(k){
 const t=themes[k];
 if(!saveData.owned.includes(k)){if(saveData.coins<t.cost){toast("NOT ENOUGH ORBS");return}saveData.coins-=t.cost;saveData.owned.push(k);toast("THEME UNLOCKED")}
 saveData.theme=k;applyTheme();save();renderShop();sound("unlock");
}
function renderDaily(){
 const d=new Date(),key=d.toISOString().slice(0,10);$("dailyDate").textContent=key;
 const num=Number(key.replaceAll("-","").slice(-4));$("dailyNumber").textContent=String(num%100).padStart(2,"0");
 $("dailyBest").textContent=saveData.daily[key]??"—";$("dailyStreak").textContent=saveData.streak||0;
}
$("playDaily").onclick=()=>resetGame(0,true);

function playBtnText(){$("playPause").textContent=game.running?"Ⅱ":"▶"}
$("playPause").onclick=()=>{if(game.won)return;game.running=!game.running;playBtnText();sound("click")}
$("leftBtn").onclick=()=>rotate(-1);$("rightBtn").onclick=()=>rotate(1);$("undoBtn").onclick=undo;
$("muteBtn").onclick=()=>{saveData.muted=!saveData.muted;save();updateMute();sound("click")}
$("levelSound").onclick=()=>{saveData.muted=!saveData.muted;save();updateMute()}
function updateMute(){$("muteBtn").textContent=saveData.muted?"×":"♪"}

function rotate(dir){
 if(!game.running||game.won||game.moves<=0)return;
 const c=levelConfig(game.level,game.daily);
 game.history.push({angle:game.angle,moves:game.moves});
 game.angle+=dir*game.step;game.moves--;game.pulse=1;game.shake=0;
 $("moves").textContent=game.moves;$("progressBar").style.width=((game.maxMoves-game.moves)/game.maxMoves*100)+"%";
 makeParticles(pointAt(0),theme().cyan,5);sound("move");
 checkPosition(c);
}
function undo(){
 const h=game.history.pop();if(!h)return;
 game.angle=h.angle;game.moves=h.moves;$("moves").textContent=game.moves;sound("undo")
}
function normalized(a){return ((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2)}
function checkPosition(c){
 const step=Math.round((game.angle-c.start)/game.step);
 const at=((step%12)+12)%12;
 if(at===((c.targetStep%12)+12)%12){complete();return}
 for(const o of c.obstacles)if(at===o.step){game.shake=10;sound("hit");makeParticles(pointAt(0),theme().pink,18);game.running=false;playBtnText();toast("CRASH — TRY AGAIN");return}
 if(game.moves<=0){game.running=false;playBtnText();toast("OUT OF MOVES")}
}
function complete(){
 game.won=true;game.running=false;playBtnText();sound("win");
 const used=game.maxMoves-game.moves;
 const c=levelConfig(game.level,game.daily);
 let stars=used<=Math.ceil(c.maxMoves*.45)?3:used<=Math.ceil(c.maxMoves*.7)?2:1;
 let key=game.daily?new Date().toISOString().slice(0,10):String(game.level);
 let old=game.daily?(saveData.daily[key]||999):(saveData.best[key]||999);
 const best=Math.min(old,used);const gain=stars*25+(used<=c.maxMoves*.5?25:0);
 if(game.daily){
  saveData.daily[key]=best;
  if(saveData.lastDaily!==key){saveData.streak=(saveData.lastDaily===new Date(Date.now()-86400000).toISOString().slice(0,10)?(saveData.streak||0)+1:1);saveData.lastDaily=key}
 }else{
  saveData.best[key]=best;saveData.stars[key]=Math.max(saveData.stars[key]||0,stars);
  if(game.level>=saveData.unlocked&&game.level<50)saveData.unlocked=game.level+1;
 }
 saveData.coins+=gain;save();makeParticles({x:W/2,y:H*.39},theme().pink,50);
 setTimeout(()=>result(stars,used,best,gain),450);
}
function result(stars,used,best,gain){
 $("resultKicker").textContent=game.daily?"DAILY COMPLETE":"LEVEL COMPLETE";
 $("resultTitle").textContent=stars===3?"PERFECT!":stars===2?"GREAT!":"CLEARED!";
 $("stars").textContent="★".repeat(stars)+"☆".repeat(3-stars);
 $("resultMoves").textContent=used;$("resultBest").textContent=best;$("resultCoins").textContent="+"+gain;
 showOnly("resultScreen");show("bottomNav");
 $("retryBtn").onclick=()=>resetGame(game.level,game.daily);
 $("nextBtn").textContent=game.daily?"DONE":"NEXT →";
 $("nextBtn").onclick=game.daily?home:()=>resetGame(Math.min(50,game.level+1),false);
}

function toast(t){const x=$("toast");x.textContent=t;x.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove("show"),1000)}

const AC=window.AudioContext||window.webkitAudioContext;let audio=null;
function sound(type){
 if(saveData.muted||!AC)return;
 try{
  audio ||= new AC(); if(audio.state==="suspended")audio.resume();
  const now=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();
  const f={click:[420,.05,"sine"],move:[220,.045,"triangle"],undo:[130,.07,"triangle"],hit:[75,.22,"sawtooth"],win:[520,.12,"sine"],unlock:[760,.16,"sine"]}[type]||[300,.05,"sine"];
  o.type=f[2];o.frequency.setValueAtTime(f[0],now);
  if(type==="win"){o.frequency.exponentialRampToValueAtTime(980,now+.35)}
  if(type==="hit"){o.frequency.exponentialRampToValueAtTime(35,now+.2)}
  g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.055,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+f[1]);
  o.connect(g).connect(audio.destination);o.start(now);o.stop(now+f[1]+.02);
  if(type==="win"){setTimeout(()=>sound("unlock"),100)}
 }catch(e){}
}
function makeParticles(p,color,n){for(let i=0;i<n;i++)game.particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,life:1,color})}

function drawRing(cx,cy,r,alpha=1){
 const t=theme();ctx.save();ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle=t.ring;ctx.lineWidth=5;ctx.stroke();ctx.restore()
}
function drawOrb(x,y,r,c){
 ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=7;ctx.fill();ctx.shadowBlur=0;
}
function render(t){
 const dt=Math.min((t-last)/1000||0,.04);last=t;game.pulse=Math.max(0,game.pulse-dt*3);
 ctx.clearRect(0,0,W,H);ctx.fillStyle=theme().bg;ctx.fillRect(0,0,W,H);
 if(!$("gameUI").classList.contains("hidden")){
  const g=orbitGeometry(),c=levelConfig(game.level,game.daily),rr=g.r;
  drawRing(g.cx,g.cy,rr);drawRing(g.cx,g.secondY,rr);
  // crossing arcs create the distinctive two-orbit silhouette
  const targetA=c.start+c.targetStep*c.step;
  const tp={x:g.cx+Math.cos(targetA)*rr,y:g.cy+Math.sin(targetA)*rr};
  drawOrb(tp.x,tp.y,13,theme().cyan);
  for(const o of c.obstacles){
   const a=c.start+o.step*c.step+(o.ring?Math.PI*.35:0);
   const y=o.ring?g.secondY:g.cy;
   drawOrb(g.cx+Math.cos(a)*rr,y+Math.sin(a)*rr,18,theme().pink);
  }
  const p={x:g.cx+Math.cos(game.angle)*rr,y:g.cy+Math.sin(game.angle)*rr};
  drawOrb(p.x,p.y,22,theme().cyan);
  // target checker
  ctx.save();ctx.globalAlpha=.75;const s=24,cell=4,x=tp.x-s/2,y=tp.y-s/2;
  for(let row=0;row<6;row++)for(let col=0;col<6;col++)if((row+col)%2===0){ctx.fillStyle=theme().cyan;ctx.fillRect(x+col*cell,y+row*cell,cell,cell)}ctx.restore();
  if(game.shake>0)game.shake--;
 }
 game.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy*=.97;p.life-=dt*1.7;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3)});ctx.globalAlpha=1;
 game.particles=game.particles.filter(p=>p.life>0);
 requestAnimationFrame(render)
}
requestAnimationFrame(render);
updateStart();updateMute();renderLevels();renderDaily();
