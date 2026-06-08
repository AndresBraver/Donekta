<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>EXPLORADOR ESTELAR · La Guerra de Xandar</title>
<style>
  :root{--cyan:#22e9ff;--magenta:#ff2d95;--gold:#ffd24a;--red:#ff5a4a;--green:#2bff9b;
        --bg:#03040d;--panel:rgba(8,14,34,.74);--line:rgba(34,233,255,.35);}
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:100%;height:100%;overflow:hidden;background:var(--bg);}
  body{font-family:ui-monospace,"Cascadia Code","Consolas",monospace;color:#dff6ff;cursor:crosshair;
       -webkit-user-select:none;user-select:none;touch-action:none;}
  #scene{position:fixed;inset:0;display:block;}
  #hud{position:fixed;inset:0;pointer-events:none;z-index:5;font-size:13px;}
  .panel{position:absolute;background:var(--panel);border:1px solid var(--line);backdrop-filter:blur(6px);
    box-shadow:0 0 24px rgba(34,233,255,.12),inset 0 0 18px rgba(34,233,255,.06);border-radius:10px;padding:11px 13px;}
  .panel::before{content:"";position:absolute;top:-1px;left:13px;width:40px;height:2px;background:var(--cyan);box-shadow:0 0 10px var(--cyan);}
  #topLeft{top:14px;left:14px;min-width:210px;}
  #topRight{top:14px;right:14px;text-align:right;min-width:150px;}
  .label{font-size:10px;letter-spacing:2px;color:#7fb8c8;text-transform:uppercase;}
  .big{font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;line-height:1;margin-top:2px;text-shadow:0 0 12px rgba(34,233,255,.6);}
  .credits .big{color:var(--gold);text-shadow:0 0 12px rgba(255,210,74,.7);}
  .barWrap{margin-top:5px;height:10px;width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:6px;overflow:hidden;}
  #shieldBar{height:100%;width:100%;background:linear-gradient(90deg,var(--cyan),#2bff9b);box-shadow:0 0 12px rgba(43,255,155,.7);transition:width .1s;}
  #healthBar{height:100%;width:100%;background:linear-gradient(90deg,#ff7b2d,var(--red));box-shadow:0 0 12px rgba(255,90,74,.7);transition:width .1s;}
  #mission{top:14px;left:50%;transform:translateX(-50%);min-width:280px;max-width:480px;text-align:center;}
  #mission .label{color:var(--magenta);}
  #missionText{font-size:13px;margin-top:3px;color:#fff;}
  #missionProg{font-size:11px;color:var(--cyan);margin-top:3px;}
  #storyLine{font-size:11px;color:var(--gold);margin-top:5px;border-top:1px solid rgba(255,210,74,.25);padding-top:5px;}
  #wanted{top:84px;right:14px;min-width:150px;text-align:right;display:none;}
  #wanted .big{color:var(--red);text-shadow:0 0 12px rgba(255,90,74,.8);}
  #controls{bottom:70px;left:14px;font-size:11px;line-height:1.6;color:#9fc3d4;max-width:46vw;}
  #controls b{color:var(--cyan);}
  #modePanel{top:150px;right:14px;text-align:right;min-width:120px;}#modePanel .big{font-size:15px;}
  .hudbtn{pointer-events:auto;border-radius:10px;border:1px solid var(--cyan);color:var(--cyan);background:rgba(34,233,255,.1);
    font-family:inherit;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;font-size:12px;padding:9px 13px;}
  .hudbtn:hover{background:var(--cyan);color:#03040d;box-shadow:0 0 18px var(--cyan);}
  #btnRow{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:96vw;}
  #toast{position:absolute;bottom:150px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(90deg,rgba(255,210,74,.18),rgba(255,45,149,.18));
    border:1px solid var(--gold);border-radius:10px;padding:11px 20px;font-size:14px;color:#fff;text-shadow:0 0 8px rgba(255,210,74,.6);
    opacity:0;transition:all .4s cubic-bezier(.2,1,.3,1);text-align:center;max-width:84vw;}
  #toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
  #hint{position:absolute;bottom:104px;left:50%;transform:translateX(-50%);font-size:13px;color:#fff;background:rgba(8,14,34,.7);
    border:1px solid var(--line);border-radius:30px;padding:8px 18px;opacity:0;transition:opacity .2s;text-align:center;}
  #hint.show{opacity:1;}
  kbd{display:inline-block;background:#0b1530;border:1px solid var(--cyan);border-radius:5px;padding:1px 7px;color:var(--cyan);font-weight:700;box-shadow:0 0 8px rgba(34,233,255,.4);}
  #cross{position:absolute;top:50%;left:50%;width:36px;height:36px;transform:translate(-50%,-50%);opacity:.8;}
  #cross::before,#cross::after{content:"";position:absolute;background:var(--cyan);box-shadow:0 0 6px var(--cyan);}
  #cross::before{left:50%;top:0;width:2px;height:11px;transform:translateX(-50%);}
  #cross::after{left:50%;bottom:0;width:2px;height:11px;transform:translateX(-50%);}
  #touchUI{position:fixed;inset:0;z-index:6;pointer-events:none;display:none;}
  #joyBase{position:absolute;width:116px;height:116px;border-radius:50%;border:2px solid var(--line);background:rgba(34,233,255,.06);display:none;transform:translate(-50%,-50%);}
  #joyKnob{position:absolute;width:52px;height:52px;border-radius:50%;background:rgba(34,233,255,.35);border:1px solid var(--cyan);box-shadow:0 0 16px var(--cyan);display:none;transform:translate(-50%,-50%);}
  .tbtn{position:absolute;pointer-events:auto;width:70px;height:70px;border-radius:50%;border:2px solid var(--cyan);background:rgba(34,233,255,.12);
    color:var(--cyan);font-size:13px;font-weight:700;display:none;align-items:center;justify-content:center;font-family:inherit;}
  #btnFire{bottom:118px;right:22px;border-color:var(--magenta);color:var(--magenta);background:rgba(255,45,149,.14);}
  #btnE{bottom:196px;right:28px;width:58px;height:58px;border-color:var(--gold);color:var(--gold);background:rgba(255,210,74,.14);}
  #btnBoost{bottom:118px;right:112px;width:58px;height:58px;}
  #btnBomb{bottom:196px;right:104px;width:58px;height:58px;border-color:var(--red);color:var(--red);background:rgba(255,90,74,.14);}
  .modal{position:fixed;inset:0;z-index:20;display:none;align-items:center;justify-content:center;
    background:radial-gradient(circle at 50% 50%,rgba(3,4,13,.5),rgba(3,4,13,.9));pointer-events:auto;}
  .box{width:min(640px,95vw);background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:22px;
    box-shadow:0 0 50px rgba(34,233,255,.25);max-height:94vh;overflow:auto;}
  #npcRow{display:flex;gap:16px;align-items:center;}
  #npcFace{width:72px;height:72px;border-radius:14px;flex:none;border:1px solid var(--cyan);display:flex;align-items:center;justify-content:center;
    font-size:34px;background:radial-gradient(circle at 30% 25%,#16315e,#070d22);box-shadow:0 0 22px rgba(34,233,255,.4) inset;}
  #npcName{font-size:17px;color:var(--cyan);letter-spacing:1px;}#npcRole{font-size:11px;color:#8fb6c6;letter-spacing:2px;text-transform:uppercase;}
  #npcText{margin-top:14px;font-size:14px;line-height:1.6;color:#e7f8ff;}
  #choices{margin-top:16px;display:flex;flex-direction:column;gap:9px;}
  .btn{padding:12px;border-radius:10px;border:1px solid var(--cyan);background:rgba(34,233,255,.1);color:var(--cyan);font-family:inherit;
    font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;transition:.15s;text-align:left;}
  .btn:hover{background:var(--cyan);color:#03040d;box-shadow:0 0 22px var(--cyan);}
  .btn.alt{border-color:#5b7a90;background:rgba(91,122,144,.12);color:#bcd6e3;}
  .btn.alt:hover{background:#5b7a90;color:#fff;box-shadow:none;}
  .btn:disabled{opacity:.4;cursor:not-allowed;}
  h2.boxttl{font-family:"Trebuchet MS",sans-serif;font-size:21px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);text-shadow:0 0 16px rgba(255,210,74,.5);}
  .tabs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 14px;}
  .tab{padding:8px 12px;border-radius:8px;border:1px solid var(--line);background:rgba(34,233,255,.05);color:#bcd6e3;
    font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:1px;}
  .tab.on{background:var(--cyan);color:#03040d;box-shadow:0 0 14px var(--cyan);}
  .row{display:flex;align-items:center;gap:13px;padding:11px;margin-bottom:9px;border:1px solid var(--line);border-radius:12px;background:rgba(34,233,255,.04);}
  .rIcon{font-size:25px;width:38px;text-align:center;flex:none;}
  .rInfo{flex:1;}.rName{font-size:14px;color:#fff;font-weight:700;}.rDesc{font-size:11px;color:#9fc3d4;margin-top:2px;}
  .dots{margin-top:5px;display:flex;gap:4px;}.dot{width:12px;height:7px;border-radius:3px;background:rgba(255,255,255,.15);}.dot.on{background:var(--cyan);box-shadow:0 0 8px var(--cyan);}
  .rBuy{flex:none;padding:9px 12px;border-radius:9px;border:1px solid var(--gold);background:rgba(255,210,74,.12);color:var(--gold);font-family:inherit;
    font-weight:700;font-size:12px;cursor:pointer;letter-spacing:1px;min-width:88px;text-align:center;}
  .rBuy:hover{background:var(--gold);color:#03040d;box-shadow:0 0 16px var(--gold);}
  .rBuy.maxed{border-color:#5b7a90;color:#8fb6c6;background:rgba(91,122,144,.12);cursor:default;box-shadow:none;}
  .rBuy.cant{opacity:.45;cursor:not-allowed;}
  .rBuy.cyan{border-color:var(--cyan);color:var(--cyan);background:rgba(34,233,255,.12);}
  .rBuy.cyan:hover{background:var(--cyan);color:#03040d;}
  #mapCanvas{display:block;width:100%;border-radius:12px;border:1px solid var(--line);background:#05080f;}
  .swatches{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;}
  .sw{width:42px;height:42px;border-radius:10px;cursor:pointer;border:2px solid transparent;}
  .sw.on{border-color:#fff;box-shadow:0 0 14px #fff;}
  .overlay{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
    background:radial-gradient(circle at 50% 35%,rgba(8,14,40,.55),rgba(3,4,13,.93));pointer-events:auto;padding:20px;}
  .title{font-family:"Trebuchet MS","Segoe UI",system-ui,sans-serif;font-size:clamp(34px,7.5vw,74px);font-weight:800;letter-spacing:5px;text-transform:uppercase;line-height:1;
    background:linear-gradient(90deg,var(--cyan),#7c8cff,var(--magenta));-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 26px rgba(34,233,255,.5));}
  .subtitle{margin-top:10px;font-size:13px;letter-spacing:5px;color:#8fb6c6;text-transform:uppercase;}
  .howto{margin-top:18px;max-width:600px;font-size:12.5px;line-height:1.85;color:#cfe7f2;}
  .howto b{color:var(--cyan);}
  .start{margin-top:22px;padding:15px 42px;font-size:17px;letter-spacing:3px;font-family:"Trebuchet MS",sans-serif;font-weight:800;text-transform:uppercase;
    color:#03040d;border:none;border-radius:40px;cursor:pointer;background:linear-gradient(90deg,var(--cyan),#2bff9b);box-shadow:0 0 40px rgba(34,233,255,.6);transition:.2s;}
  .start:hover{transform:scale(1.05);box-shadow:0 0 60px rgba(34,233,255,.9);}
  #goStats{margin:16px 0 4px;font-size:15px;color:#dff6ff;line-height:1.9;}#goStats b{color:var(--gold);font-size:20px;}
  .hidden{display:none!important;}
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:40;
    background:repeating-linear-gradient(0deg,rgba(0,0,0,.16) 0,rgba(0,0,0,.16) 1px,transparent 2px,transparent 4px);mix-blend-mode:multiply;opacity:.32;}
</style>
</head>
<body>
<canvas id="scene"></canvas>
<div id="hud">
  <div class="panel" id="topLeft">
    <div class="label">Escudo</div><div class="barWrap"><div id="shieldBar"></div></div>
    <div class="label" style="margin-top:7px">Vida</div><div class="barWrap"><div id="healthBar"></div></div>
    <div class="label" style="margin-top:7px">Gasolina</div><div class="barWrap"><div id="fuelBar" style="height:100%;width:100%;background:linear-gradient(90deg,#ffd24a,#ff7b2d);box-shadow:0 0 12px rgba(255,210,74,.6)"></div></div>
  </div>
  <div class="panel credits" id="topRight"><div class="label">Créditos</div><div class="big" id="creditsVal">0</div>
    <div class="label" style="margin-top:6px">🔫 <span id="ammoVal">40</span> · 💣 <span id="bombVal">2</span> · ⭐<span id="levelVal">1</span></div></div>
  <div class="panel" id="mission">
    <div class="label">Misiones</div><div id="missionText">—</div><div id="missionProg"></div>
    <div id="storyLine">★ Historia: —</div>
  </div>
  <div class="panel" id="wanted"><div class="label">Se busca</div><div class="big" id="wantedVal">☆☆☆☆☆</div></div>
  <div class="panel" id="controls"></div>
  <div class="panel" id="modePanel"><div class="label" id="modeLabel">Modo</div><div class="big" id="modeVal">Vuelo</div></div>
  <div id="btnRow">
    <button class="hudbtn" id="menuBtn">☰ Menú</button>
    <button class="hudbtn" id="mapBtn">🗺️ Mapa</button>
  </div>
  <div id="hint"></div><div id="toast"></div><div id="cross"></div>
</div>
<div id="touchUI">
  <div id="joyBase"></div><div id="joyKnob"></div>
  <button class="tbtn" id="btnFire">🔥</button><button class="tbtn" id="btnE">E</button>
  <button class="tbtn" id="btnBoost">⏩</button><button class="tbtn" id="btnBomb">💣</button>
  <button class="tbtn" id="btnJump" style="bottom:196px;right:104px;border-color:var(--green);color:var(--green);background:rgba(43,255,155,.14)">⬆️</button>
</div>

<!-- Diálogo -->
<div class="modal" id="dialog"><div class="box">
  <div id="npcRow"><div id="npcFace">🛰️</div><div><div id="npcName">—</div><div id="npcRole">—</div></div></div>
  <div id="npcText">—</div><div id="choices"></div>
</div></div>

<!-- Tienda -->
<div class="modal" id="shop"><div class="box">
  <h2 class="boxttl" id="shopTitle">Tienda</h2>
  <div id="shopCredits" style="font-size:13px;color:#9fc3d4;margin:4px 0 14px">Créditos: <b style="color:var(--gold)" id="shopCreditsVal">0</b> ⬡</div>
  <div id="shopList"></div>
  <div style="margin-top:14px"><button class="btn alt" id="shopClose">Cerrar</button></div>
</div></div>

<!-- Menú principal (inventario / mapa / nave / ropa / misiones) -->
<div class="modal" id="menu2"><div class="box">
  <h2 class="boxttl" style="color:var(--cyan);text-shadow:0 0 16px rgba(34,233,255,.5)">☰ Menú</h2>
  <div class="tabs" id="menuTabs"></div>
  <div id="menuBody"></div>
  <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="menuSave">💾 Guardar</button><button class="btn alt" id="menuDelete">🗑️ Borrar partida</button><button class="btn alt" id="menuClose">Cerrar</button></div>
</div></div>

<!-- Mapa rápido -->
<div class="modal" id="map"><div class="box">
  <h2 class="boxttl" style="color:var(--cyan);text-shadow:0 0 16px rgba(34,233,255,.5)">🗺️ Mapa</h2>
  <div id="mapLegend" style="font-size:11px;color:#9fc3d4;margin:6px 0 12px"></div>
  <canvas id="mapCanvas" width="600" height="600"></canvas>
  <div style="margin-top:14px"><button class="btn alt" id="mapClose">Cerrar</button></div>
</div></div>

<!-- Menú inicio -->
<div class="overlay" id="menu">
  <div class="title">La Guerra<br>de Xandar</div>
  <div class="subtitle">Explorador Estelar · RPG espacial</div>
  <div class="howto">
    El <b>Rey de Xandar</b> quiere conquistar la galaxia y tú debes detenerlo. Explora planetas, baja con tu
    personaje, habla con habitantes y <b>robots</b>, acepta <b>varias misiones</b> a la vez y sigue el
    <b>★ Modo Historia</b>. En las <b>tiendas</b> compras comida, ropa, naves, mejoras, bombas y armas.
    Con <b>bombas</b> destruyes <b>lunas</b>, pero te vuelves <b>criminal buscado</b> y la <b>policía</b> te
    perseguirá. Tienes <b>vida + escudo</b>: si caes, reapareces en la <b>base</b> del último planeta
    perdiendo créditos. Vuela al <b>Sol</b> para viajar a otra <b>galaxia</b>.<br><br>
    <b>VUELO:</b> ratón girar · W/S vel · A/D inclinar · Clic/Espacio disparar · B bomba · E aterrizar.<br>
    <b>A PIE:</b> WASD/flechas mover · ratón girar · Clic/Espacio disparar · E interactuar.<br>
    Menú <b>Tab</b> · Mapa <b>M</b> · En móvil joystick + botones 🔥 💣 ⏩ E.
  </div>
  <button class="start" id="startBtn">▶ Nueva partida</button>
  <button class="start" id="continueBtn" style="display:none;margin-top:12px;background:linear-gradient(90deg,var(--gold),#ff9b3c)">▶ Continuar partida</button>
</div>
<div class="overlay hidden" id="gameover">
  <div class="title" style="background:linear-gradient(90deg,#ff7b2d,var(--magenta));-webkit-background-clip:text;background-clip:text;">Caíste</div>
  <div id="goStats"></div>
  <button class="start" id="restartBtn">↻ Reaparecer</button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
"use strict";
/* ============================================================
   EXPLORADOR ESTELAR v4 — La Guerra de Xandar
   RPG espacial: historia, tiendas, vida+escudo, crimen/policía,
   bombas/lunas, armas a pie, menú, sonido, diálogos sí/no,
   robots, misiones múltiples, galaxias y estaciones lunares.
   Three.js r128. Un solo archivo.
   ============================================================ */
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const $=id=>document.getElementById(id);
const now=()=>performance.now();
const isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
const MODE={MENU:0,SPACE:1,SURFACE:2,OVER:3};
let mode=MODE.MENU,renderer,camera,clock,spaceScene,surfScene;

/* ---------- SONIDO (WebAudio sintetizado, sin archivos) ---------- */
let actx=null;
function audioInit(){if(!actx){try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}}
function beep(freq,dur,type,vol,slideTo){
  if(!actx)return;const t=actx.currentTime;const o=actx.createOscillator(),g=actx.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(freq,t);
  if(slideTo)o.frequency.exponentialRampToValueAtTime(Math.max(20,slideTo),t+dur);
  g.gain.setValueAtTime(vol||0.06,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+dur+0.02);
}
function noise(dur,vol){
  if(!actx)return;const n=Math.floor(actx.sampleRate*dur);const buf=actx.createBuffer(1,n,actx.sampleRate);
  const d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  const s=actx.createBufferSource();s.buffer=buf;const g=actx.createGain();g.gain.value=vol||0.12;
  s.connect(g);g.connect(actx.destination);s.start();
}
const sfx={laser:()=>beep(680,0.12,'square',0.05,180),blaster:()=>beep(420,0.1,'sawtooth',0.05,120),
  boom:()=>{noise(0.5,0.18);beep(90,0.4,'triangle',0.08,40);},pickup:()=>beep(880,0.12,'sine',0.06,1320),
  ui:()=>beep(520,0.05,'square',0.04),hit:()=>{noise(0.18,0.14);beep(160,0.16,'square',0.06,60);},
  warp:()=>beep(220,0.7,'sine',0.08,1400),win:()=>{beep(523,0.15,'sine',0.07);setTimeout(()=>beep(659,0.15,'sine',0.07),140);setTimeout(()=>beep(784,0.3,'sine',0.08),300);}};

/* ---------- ESTADO DEL JUGADOR ---------- */
const P={health:100,maxHealth:100,shield:100,maxShield:100,fuel:100,maxFuel:100,lastHit:-9999};
let credits=0,kills=0,missionsDone=0;
let level=1,xp=0,xpNext=100;
function gainXP(n){xp+=n;let up=false;while(xp>=xpNext){xp-=xpNext;level++;xpNext=Math.floor(xpNext*1.35);P.maxHealth+=10;P.health=P.maxHealth;up=true;}
  if(up){sfx.win();toast('⭐ ¡Subiste a nivel '+level+'! Vida máxima +10');}const lv=$('levelVal');if(lv)lv.textContent=level;}
let visited=new Set(),discovered=new Set();
let galaxy=1;
let wanted=0,wantedTimer=0;
const inv={crystal:0,core:0,food:0,bomb:2,ammo:40};
const SELL={crystal:20,core:15};
const upgrades={shield:0,engine:0,cannon:0,collector:0};
const UPG_DEFS=[
  {key:'shield',icon:'🛡️',name:'Casco reforzado',desc:'+40 escudo máx.',base:140},
  {key:'engine',icon:'🚀',name:'Motores',desc:'+60 velocidad máx.',base:160},
  {key:'cannon',icon:'🔫',name:'Cañones',desc:'Disparas más rápido.',base:150},
  {key:'collector',icon:'🧲',name:'Recolector',desc:'Recoges desde más lejos.',base:120}];
const MAXLVL=4;
const SHIPS=[
  {name:'Explorador I',price:0,shield:100,speed:320,fire:0.16,color:0xc8d8ff,shape:'cone'},
  {name:'Halcón Veloz',price:700,shield:130,speed:400,fire:0.14,color:0x66ffcc,shape:'dart'},
  {name:'Crucero Vesper',price:1600,shield:210,speed:340,fire:0.13,color:0xff9bd6,shape:'wide'},
  {name:'Caza de Asalto',price:3200,shield:170,speed:470,fire:0.10,color:0xffc24a,shape:'dart'}];
let ownedShips=new Set([0]),curShip=0;
let suitColor=0xffd24a;
const SUIT_COLORS=[0xffd24a,0x22e9ff,0xff2d95,0x2bff9b,0x7c8cff,0xffffff];
let suitFace=0,suitSkin=0,shipColorOverride=null;
const SUIT_FACES=[{name:'Normal',eye:0x9fe8ff},{name:'Fuego',eye:0xff7b2d},{name:'Verde',eye:0x9bff5a},{name:'Rosa',eye:0xff2d95}];
const SUIT_SKINS=[{name:'Astronauta',robot:false},{name:'Robot',robot:true},{name:'Comando',robot:false}];
const SHIP_COLORS=[0xc8d8ff,0x66ffcc,0xff9bd6,0xffc24a,0xff5a4a,0x9b5aff,0x9bff5a];
let stat={maxShield:100,maxSpeed:320,fireRate:0.16,pickup:18};
function recomputeStats(){
  const s=SHIPS[curShip];
  stat.maxShield=s.shield+40*upgrades.shield;
  stat.maxSpeed=s.speed+60*upgrades.engine;
  stat.fireRate=Math.max(0.05,s.fire-0.02*upgrades.cannon);
  stat.pickup=18+10*upgrades.collector;
  P.maxShield=stat.maxShield;
}
function upgCost(k){const d=UPG_DEFS.find(u=>u.key===k);return d.base*(upgrades[k]+1);}

/* ---------- MISIONES (múltiples) ---------- */
let missions=[];const MAX_MISSIONS=6;
let storyStep=0;
let STORY=[];
function buildStory(){
  const names=PLANET_DEFS.map(d=>d.name).filter(n=>n!=='Xandar');
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const flav=["La flota de Xandar avanza.","Los aliados cuentan contigo.","El Rey no se detendrá.","Cada victoria debilita a Xandar.","La galaxia te observa.","Hay que ganar tiempo.","La resistencia crece.","Nadie creía que llegarías tan lejos.","El Rey empieza a temerte.","Un planeta más ha caído bajo Xandar."];
  const dv=["Lleva un artefacto aliado a","Entrega planes secretos a","Escolta un convoy a","Transporta un prisionero a"];
  const S=[{giver:0,npc:0,kind:'talk',auto:true,
    text:"Piloto, soy la Capitana Vela. El Rey de Xandar lanzó su flota para conquistar la galaxia. Será una guerra larga y dura. ¿Nos ayudarás a detenerlo?",
    obj:"Acepta la misión de la Capitana Vela en Aurelia."}];
  const TOTAL=50,kinds=['xandar','collect','surface','destroy','travel','deliver','assassinate','moon','scan','rescue','defend'];
  let bag=[];const nextK=()=>{if(!bag.length)bag=shuffle(kinds);return bag.pop();};
  for(let i=0;i<TOTAL;i++){
    const k=nextK();
    const reward=110+i*7;let step={reward,giver:-1,flav:pick(flav),conquer:(i%6===5)};
    if(k==='xandar'){const g=rnd(3,7);step.kind='xandar';step.goal=g;step.obj='Destruye '+g+' cazas de Xandar (moradas).';}
    else if(k==='collect'){const g=rnd(4,9);step.kind='collect';step.goal=g;step.obj='Recoge '+g+' cristales de energía.';}
    else if(k==='surface'){const g=rnd(4,8);step.kind='surface';step.goal=g;step.obj='Recoge '+g+' núcleos en un planeta.';}
    else if(k==='rescue'){const g=rnd(3,6);step.kind='surface';step.goal=g;step.obj='Rescata '+g+' cápsulas de supervivientes (núcleos).';}
    else if(k==='destroy'){const g=rnd(4,9);step.kind='destroy';step.goal=g;step.obj='Destruye '+g+' asteroides.';}
    else if(k==='travel'){const d=pick(names);step.kind='travel';step.destName=d;step.obj='Viaja al planeta '+d+'.';}
    else if(k==='scan'){const d=pick(names);step.kind='travel';step.destName=d;step.obj='Explora y escanea el planeta '+d+'.';}
    else if(k==='deliver'){const d=pick(names);step.kind='travel';step.destName=d;step.obj=pick(dv)+' '+d+'.';}
    else if(k==='assassinate'){step.kind='xandar';step.goal=1;step.spawn=1;step.obj='Elimina al comandante de Xandar (nave morada).';}
    else if(k==='defend'){const g=rnd(2,4);step.kind='xandar';step.goal=g;step.spawn=g;step.obj='Defiende el sector: derriba '+g+' naves de Xandar.';}
    else {step.kind='moon';step.goal=1;step.obj='Destruye una luna con una bomba.';step.reward=reward+40;}
    const rk={xandar:'hunt',collect:'collect',surface:'surface',destroy:'destroy',travel:'travel',moon:'bomb'}[k];
    if(rk&&k!=='deliver'&&k!=='scan'&&k!=='rescue'&&k!=='assassinate'&&k!=='defend')step.obj+=' — '+missionReason(rk);
    if(i===0){step.companion=true;step.flav="¡Toma este robot compañero! Te cubrirá las espaldas.";}
    S.push(step);
  }
  S.push({giver:-1,kind:'travel',destName:'Xandar',obj:'Viaja al planeta Xandar, el mundo del Rey.',reward:300});
  S.push({giver:-1,kind:'chase',goal:1,obj:'¡El Rey de Xandar huye de su planeta! Persíguelo en el espacio y destrúyelo antes de que escape.'});
  S.push({giver:-1,kind:'done',done:true,obj:'¡Atrapaste al Rey de Xandar! La galaxia es libre.'});
  return S;
}
function storyObjText(){return (STORY[storyStep]&&STORY[storyStep].obj)||"Completada.";}
function storyTick(ev){const s=STORY[storyStep];if(s&&s.kind===ev){s._p=(s._p||0)+1;if(s._p>=(s.goal||1))advanceStory();}}

/* ---------- ENTRADA ---------- */
const keys={};let mouseX=0,mouseY=0,shootHeld=false,boostHeld=false,modalOpen=false;
let mapOpen=false,menuOpen=false,shopOpen=false,dialogShown=false,bombQueued=false;
addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(e.code==='Space'){e.preventDefault();if(mode===MODE.SURFACE)jumpQueued=true;else shootHeld=true;}
  if(e.code==='KeyE'&&!modalOpen)interact();
  if(e.code==='KeyB'&&!modalOpen)bombQueued=true;
  if(e.code==='KeyM')toggleMap();
  if(e.code==='Tab'){e.preventDefault();toggleMenu();}
  if(e.code==='KeyI'){toggleMenu('inv');}
});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space'&&mode!==MODE.SURFACE)shootHeld=false;});
addEventListener('mousemove',e=>{mouseX=(e.clientX/innerWidth)*2-1;mouseY=(e.clientY/innerHeight)*2-1;});
addEventListener('mousedown',e=>{if(!modalOpen&&e.button===0)shootHeld=true;});
addEventListener('mouseup',e=>{if(e.button===0)shootHeld=false;});
addEventListener('click',()=>{audioInit();window.focus();});
/* táctil */
let joy={id:null,ox:0,oy:0,x:0,y:0,active:false},look={id:null,lx:0},lookDX=0;
function showJoy(x,y){const b=$('joyBase'),k=$('joyKnob');b.style.left=k.style.left=x+'px';b.style.top=k.style.top=y+'px';b.style.display=k.style.display='block';}
function moveKnob(x,y){const k=$('joyKnob');k.style.left=x+'px';k.style.top=y+'px';}
function hideJoy(){$('joyBase').style.display=$('joyKnob').style.display='none';}
function tStart(e){for(const t of e.changedTouches){if(t.target&&t.target.classList&&t.target.classList.contains('tbtn'))continue;
  if(t.clientX<innerWidth*0.5&&joy.id===null){joy.id=t.identifier;joy.ox=t.clientX;joy.oy=t.clientY;joy.x=joy.y=0;joy.active=true;showJoy(t.clientX,t.clientY);}
  else if(look.id===null){look.id=t.identifier;look.lx=t.clientX;}}if(e.cancelable)e.preventDefault();}
function tMove(e){for(const t of e.changedTouches){if(t.identifier===joy.id){let dx=t.clientX-joy.ox,dy=t.clientY-joy.oy;const R=56;
  const m=Math.hypot(dx,dy)||1,cl=Math.min(m,R);dx=dx/m*cl;dy=dy/m*cl;joy.x=dx/R;joy.y=-dy/R;moveKnob(joy.ox+dx,joy.oy+dy);}
  else if(t.identifier===look.id){lookDX+=(t.clientX-look.lx);look.lx=t.clientX;}}if(e.cancelable)e.preventDefault();}
function tEnd(e){for(const t of e.changedTouches){if(t.identifier===joy.id){joy.id=null;joy.active=false;joy.x=joy.y=0;hideJoy();}if(t.identifier===look.id)look.id=null;}}
if(isTouch){addEventListener('touchstart',tStart,{passive:false});addEventListener('touchmove',tMove,{passive:false});
  addEventListener('touchend',tEnd);addEventListener('touchcancel',tEnd);
  $('btnFire').addEventListener('touchstart',e=>{shootHeld=true;e.preventDefault();},{passive:false});
  $('btnFire').addEventListener('touchend',()=>shootHeld=false);
  $('btnE').addEventListener('touchstart',e=>{e.preventDefault();if(!modalOpen)interact();},{passive:false});
  $('btnBoost').addEventListener('touchstart',e=>{boostHeld=true;e.preventDefault();},{passive:false});
  $('btnBoost').addEventListener('touchend',()=>boostHeld=false);
  $('btnBomb').addEventListener('touchstart',e=>{e.preventDefault();if(!modalOpen)bombQueued=true;},{passive:false});
  $('btnJump').addEventListener('touchstart',e=>{e.preventDefault();jumpQueued=true;jetHeld=true;},{passive:false});
  $('btnJump').addEventListener('touchend',()=>jetHeld=false);}

/* ---------- PLANETAS (con Xandar) ---------- */
const PLANET_DEFS=[
 {name:"Aurelia",color:0x2bff9b,accent:0x0d6b4a,faction:'aliado',biome:'jungle'},
 {name:"Korbex",color:0xff7b2d,accent:0x7a2d0d,faction:'neutral',biome:'volcano'},
 {name:"Nyra",color:0x22e9ff,accent:0x0d4a6b,faction:'aliado',biome:'ice'},
 {name:"Vesperia",color:0xff2d95,accent:0x7a0d3f,faction:'neutral',biome:'city'},
 {name:"Tholos",color:0xffd24a,accent:0x7a5e0d,faction:'neutral',biome:'robot'},
 {name:"Drathos",color:0x6a8cff,accent:0x1a2d6b,faction:'aliado',biome:'ice'},
 {name:"Lumen",color:0xeae6ff,accent:0x6b6a7a,faction:'neutral',biome:'city'},
 {name:"Pyra",color:0xff5a3c,accent:0x6b1a0d,faction:'neutral',biome:'volcano'},
 {name:"Ío Verde",color:0x9bff5a,accent:0x2d6b0d,faction:'neutral',biome:'jungle'},
 {name:"Xandar",color:0xb84aff,accent:0x3f0d7a,faction:'enemigo',biome:'fortress'}];
const BIOMES={
 jungle:{ground:0x1f5a2a,sky:0x123a1a,fog:0x163f1f,name:'🌎 Selva'},
 ice:{ground:0xbfe6ff,sky:0x16263f,fog:0x9fc4e0,name:'❄️ Hielo'},
 volcano:{ground:0x3a1410,sky:0x2a0a06,fog:0x4a1206,name:'🌋 Volcán'},
 robot:{ground:0x3a3f4a,sky:0x14181f,fog:0x2a2f38,name:'🤖 Robots'},
 city:{ground:0x2a3550,sky:0x0a1428,fog:0x16203a,name:'🏙️ Ciudad'},
 fortress:{ground:0x2a1840,sky:0x140a26,fog:0x261544,name:'🌌 Fortaleza'},
 moon:{ground:0x6b6e78,sky:0x111522,fog:0x222633,name:'🛰️ Luna'}};
// personajes por planeta: mezcla de orgánicos y robots
const FACES_ORG=["👩‍🚀","🧑‍🔬","👨‍🚀","🧑‍✈️","👽","🧙","🧑‍🚀"];
const NAMES_ORG=["Capitana Vela","Doctor Ilan","Comerciante Bo","Embajador Zorak","Piloto Sora","Sabio Orin","Ingeniera Tess","Cazadora Kix"];
const NAMES_BOT=["Unidad RX-9","Dron T-7","Núcleo VAL","Autómata K2","Servo-9","Bot Médico M3"];
let planets=[];const WORLD=6500;
const PLANET_BASE=PLANET_DEFS.map(d=>({color:d.color,faction:d.faction}));
function resetPlanetDefs(){PLANET_DEFS.forEach((d,i)=>{d.color=PLANET_BASE[i].color;d.faction=PLANET_BASE[i].faction;d.conquered=false;
  if(planets[i]&&planets[i].userData.core){planets[i].userData.core.material.color.setHex(d.color);planets[i].userData.core.material.emissive.setHex(d.color);}});}
const moons=[]; // {mesh, planet, offset, alive, angle, r}

/* ---------- TEXTURAS ---------- */
function glowTexture(color){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
  const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,color);gr.addColorStop(.4,color.replace('1)','0.5)'));gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr;g.fillRect(0,0,128,128);const t=new THREE.Texture(c);t.needsUpdate=true;return t;}
function planetTexture(b,a){const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');
  const bd='#'+b.toString(16).padStart(6,'0'),ac='#'+a.toString(16).padStart(6,'0');
  const grd=g.createLinearGradient(0,0,0,512);grd.addColorStop(0,ac);grd.addColorStop(.5,bd);grd.addColorStop(1,ac);g.fillStyle=grd;g.fillRect(0,0,1024,512);
  for(let i=0;i<14;i++){g.globalAlpha=rand(.05,.16);g.fillStyle=Math.random()<.5?ac:'#ffffff';const y=rand(0,512),h=rand(5,26);g.fillRect(0,y,1024,h);}
  for(let i=0;i<130;i++){g.globalAlpha=rand(.06,.26);g.fillStyle=Math.random()<.5?ac:'#ffffff';const x=rand(0,1024),y=rand(0,512),r=rand(4,42);g.beginPath();g.ellipse(x,y,r,r*rand(.4,1),rand(0,6),0,7);g.fill();}
  g.globalAlpha=.45;g.fillStyle='#ffffff';g.fillRect(0,0,1024,16);g.fillRect(0,496,1024,16);
  g.globalAlpha=1;const t=new THREE.Texture(c);t.needsUpdate=true;return t;}
function cloudTexture(){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');
  for(let i=0;i<46;i++){const x=rand(0,512),y=rand(0,256),r=rand(8,40);const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,'+rand(.25,.6)+')');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
  const t=new THREE.Texture(c);t.needsUpdate=true;return t;}
function cityTexture(){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');
  for(let cl=0;cl<14;cl++){const cx=rand(0,512),cy=rand(40,216);for(let i=0;i<rand(8,22);i++){g.fillStyle='rgba(255,'+(190+(rand(0,50)|0))+',120,'+rand(.5,1)+')';g.fillRect(cx+rand(-22,22),cy+rand(-16,16),rand(1,2.5),rand(1,2.5));}}
  const t=new THREE.Texture(c);t.needsUpdate=true;return t;}
function labelTexture(text,color){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');
  g.font='bold 26px Consolas, monospace';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(3,4,13,.55)';g.fillRect(0,0,256,64);
  g.fillStyle=color;g.fillText(text.slice(0,16),128,34);const t=new THREE.Texture(c);t.needsUpdate=true;return t;}
function makeLabel(t,c){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:labelTexture(t,c),transparent:true,depthWrite:false}));s.scale.set(40,10,1);return s;}
function rgbStr(h){return `rgba(${(h>>16)&255},${(h>>8)&255},${h&255},1)`;}
function cssHex(h){return '#'+h.toString(16).padStart(6,'0');}

/* ============================================================
   ESPACIO
   ============================================================ */
let ship,shipVel=V3(0,0,0),speed=150,shootCD=0,shake=0,nearPlanet=null,nearMoon=null,nearStation=null;
const bullets=[],asteroids=[],crystals=[],particles=[],enemies=[],enemyBullets=[],powerups=[],stations=[];
let speedBoostT=0,meteorStormActive=false;
const POW=[{t:'speed',c:'rgba(34,233,255,1)',ic:'⚡'},{t:'shield',c:'rgba(43,255,155,1)',ic:'🛡️'},{t:'ammo',c:'rgba(255,210,74,1)',ic:'🔫'},{t:'bomb',c:'rgba(255,90,74,1)',ic:'💣'}];
let sunMesh,sunPos=V3(1400,1000,-700);
function buildSpace(){
  spaceScene=new THREE.Scene();spaceScene.fog=new THREE.FogExp2(0x03040d,0.00013);
  spaceScene.add(new THREE.AmbientLight(0x35507a,0.95));
  const sun=new THREE.PointLight(0xfff0d0,2.2,0,1.0);sun.position.copy(sunPos);spaceScene.add(sun);
  spaceScene.add(new THREE.DirectionalLight(0x22e9ff,0.5).translateX(-1));
  sunMesh=new THREE.Mesh(new THREE.SphereGeometry(180,32,32),new THREE.MeshBasicMaterial({color:0xffe6a0}));
  sunMesh.position.copy(sunPos);spaceScene.add(sunMesh);
  [[1500,'rgba(255,220,140,1)',.6],[2200,'rgba(255,170,80,1)',.4],[900,'rgba(255,250,220,1)',.7]].forEach(([sc,col,op])=>{
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(col),blending:THREE.AdditiveBlending,transparent:true,opacity:op,depthWrite:false}));
    s.position.copy(sunPos);s.scale.setScalar(sc);spaceScene.add(s);});
  // fondo con degradado profundo
  const bgC=document.createElement('canvas');bgC.width=bgC.height=512;const bgG=bgC.getContext('2d');
  const bgr=bgG.createLinearGradient(0,0,0,512);bgr.addColorStop(0,'#0a1430');bgr.addColorStop(.5,'#05070f');bgr.addColorStop(1,'#0d0820');bgG.fillStyle=bgr;bgG.fillRect(0,0,512,512);
  const bgt=new THREE.Texture(bgC);bgt.needsUpdate=true;
  spaceScene.add(new THREE.Mesh(new THREE.SphereGeometry(9000,32,16),new THREE.MeshBasicMaterial({map:bgt,side:THREE.BackSide,fog:false})));
  buildStars();buildNebulae();buildShip();buildPlanets();
  for(let i=0;i<30;i++)spawnAsteroid(true);for(let i=0;i<20;i++)spawnCrystal(true);
  for(let i=0;i<6;i++)spawnPowerup(true);buildStations();
}
function buildStars(){[[8000,1.8,0xffffff],[5000,2.6,0x9fd0ff],[3000,3.6,0xffd9a0]].forEach(([n,sz,col])=>{
  const g=new THREE.BufferGeometry();const pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){const r=rand(2200,7500),th=rand(0,Math.PI*2),ph=Math.acos(rand(-1,1));
    pos[i*3]=r*Math.sin(ph)*Math.cos(th);pos[i*3+1]=r*Math.sin(ph)*Math.sin(th);pos[i*3+2]=r*Math.cos(ph);}
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  spaceScene.add(new THREE.Points(g,new THREE.PointsMaterial({color:col,size:sz,sizeAttenuation:true,transparent:true,opacity:.9,depthWrite:false})));});
  // banda de galaxia con estrellas de colores
  const N=6000,gb=new THREE.BufferGeometry(),gp=new Float32Array(N*3),gc=new Float32Array(N*3);
  const pal=[[0.6,0.7,1],[1,0.82,0.6],[1,0.6,0.9],[0.7,1,0.92]];
  for(let i=0;i<N;i++){const r=rand(1800,7200),th=rand(0,Math.PI*2),y=(Math.random()*2-1)*Math.pow(Math.random(),3)*650;
    gp[i*3]=Math.cos(th)*r;gp[i*3+1]=y;gp[i*3+2]=Math.sin(th)*r;const col=pal[Math.floor(Math.random()*pal.length)];gc[i*3]=col[0];gc[i*3+1]=col[1];gc[i*3+2]=col[2];}
  gb.setAttribute('position',new THREE.BufferAttribute(gp,3));gb.setAttribute('color',new THREE.BufferAttribute(gc,3));
  const band=new THREE.Points(gb,new THREE.PointsMaterial({size:3.2,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));
  band.rotation.x=0.45;spaceScene.add(band);}
function buildNebulae(){const cols=['rgba(124,140,255,1)','rgba(255,45,149,1)','rgba(34,233,255,1)','rgba(255,123,45,1)','rgba(150,90,255,1)','rgba(90,255,180,1)'];
  for(let i=0;i<18;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(cols[i%cols.length]),blending:THREE.AdditiveBlending,transparent:true,opacity:rand(.08,.2),depthWrite:false}));
    s.position.set(rand(-6000,6000),rand(-2600,2600),rand(-6000,6000));s.scale.setScalar(rand(1600,3800));spaceScene.add(s);}}
function makeShipModel(tint,shape){const g=new THREE.Group();
  const hull=new THREE.MeshStandardMaterial({color:tint||0xc8d8ff,metalness:.7,roughness:.3});
  const acc=new THREE.MeshStandardMaterial({color:0x22e9ff,metalness:.5,roughness:.4,emissive:0x0a4a5a,emissiveIntensity:.6});
  let body;
  if(shape==='dart'){body=new THREE.Mesh(new THREE.ConeGeometry(1.7,13,12),hull);body.rotation.x=-Math.PI/2;}
  else if(shape==='wide'){body=new THREE.Mesh(new THREE.SphereGeometry(3.2,16,12),hull);body.scale.set(1.4,.7,1.7);}
  else{body=new THREE.Mesh(new THREE.ConeGeometry(2.4,9,18),hull);body.rotation.x=-Math.PI/2;}
  g.add(body);
  const cab=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,16),new THREE.MeshStandardMaterial({color:0x0a1430,metalness:.3,roughness:.1,emissive:0x22e9ff,emissiveIntensity:.4}));
  cab.position.set(0,.8,1);cab.scale.set(1,.7,1.6);g.add(cab);
  const wingW=shape==='wide'?7:(shape==='dart'?4:5),wingZ=shape==='dart'?3.2:2.4;
  [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.BoxGeometry(wingW,.4,3.4),acc);w.position.set(s*(wingW*0.68),0,wingZ);w.rotation.z=s*.18;g.add(w);
    const eng=new THREE.Mesh(new THREE.CylinderGeometry(.9,.6,1.6,12),new THREE.MeshStandardMaterial({color:0x223,metalness:.8,roughness:.4}));
    eng.rotation.x=Math.PI/2;eng.position.set(s*1.6,0,4.6);g.add(eng);});
  return g;}
function buildShip(){ship=makeShipModel(shipColorOverride||SHIPS[curShip].color,SHIPS[curShip].shape);const eg=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(120,220,255,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  eg.position.set(0,0,6.5);eg.scale.setScalar(11);ship.add(eg);ship.userData.engineGlow=eg;ship.position.set(0,0,500);spaceScene.add(ship);}
function placeShipNearPlanet(idx){const p=planets[idx]||planets[0];if(!p){ship.position.set(0,0,500);ship.quaternion.identity();return;}
  const out=V3(rand(-1,1),rand(.1,.5),rand(-1,1)).normalize();
  ship.position.copy(p.position).addScaledVector(out,p.userData.radius+170);
  ship.lookAt(p.position.clone().addScaledVector(out,500));shipVel.set(0,0,0);speed=150;}
function rebuildShipVisual(){
  const pos=ship?ship.position.clone():V3(0,0,500),q=ship?ship.quaternion.clone():new THREE.Quaternion();
  if(ship)spaceScene.remove(ship);
  ship=makeShipModel(shipColorOverride||SHIPS[curShip].color,SHIPS[curShip].shape);
  const eg=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(120,220,255,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  eg.position.set(0,0,6.5);eg.scale.setScalar(11);ship.add(eg);ship.userData.engineGlow=eg;
  ship.position.copy(pos);ship.quaternion.copy(q);spaceScene.add(ship);
  if(surfShip){const sp=surfShip.position.clone();surfScene.remove(surfShip);surfShip=makeShipModel(SHIPS[curShip].color,SHIPS[curShip].shape);surfShip.scale.setScalar(1.5);surfShip.rotation.x=-0.15;surfShip.position.copy(sp);surfScene.add(surfShip);}
}
function buildPlanets(){
  planets.forEach(p=>spaceScene.remove(p));planets=[];moons.length=0;
  const used=[];
  PLANET_DEFS.forEach((def,i)=>{
    let p,tries=0;do{const a=rand(0,Math.PI*2),d=(def.name==='Xandar')?WORLD*0.66:rand(900,WORLD*0.6);
      p=V3(Math.cos(a)*d,rand(-700,700),Math.sin(a)*d);tries++;}while(tries<60&&used.some(u=>u.distanceTo(p)<1200));
    used.push(p);
    const grp=new THREE.Group();const radius=rand(120,190);
    const core=new THREE.Mesh(new THREE.SphereGeometry(radius,40,40),new THREE.MeshStandardMaterial({
      map:planetTexture(def.color,def.accent),emissive:def.color,emissiveIntensity:.18,roughness:.85,metalness:.1}));grp.add(core);
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(radius*1.12,32,32),new THREE.MeshBasicMaterial({color:def.color,transparent:true,opacity:.12,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})));
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(rgbStr(def.color)),blending:THREE.AdditiveBlending,transparent:true,opacity:.5,depthWrite:false}));halo.scale.setScalar(radius*4);grp.add(halo);
    if(i%2===0){const ring=new THREE.Mesh(new THREE.RingGeometry(radius*1.5,radius*2.3,64),new THREE.MeshBasicMaterial({color:def.color,transparent:true,opacity:.35,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=rand(.7,1.3);grp.add(ring);}
    const moon=new THREE.Mesh(new THREE.SphereGeometry(radius*.26,20,20),new THREE.MeshStandardMaterial({color:0xbfc8d8,roughness:.9}));grp.add(moon);
    let clouds=null;if(i%2===1){clouds=new THREE.Mesh(new THREE.SphereGeometry(radius*1.04,32,24),new THREE.MeshStandardMaterial({map:cloudTexture(),transparent:true,opacity:.5,depthWrite:false}));core.add(clouds);}
    else{const lights=new THREE.Mesh(new THREE.SphereGeometry(radius*1.012,32,24),new THREE.MeshBasicMaterial({map:cityTexture(),transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));core.add(lights);}
    const plbl=makeLabel(def.name,rgbStr(def.color));plbl.position.set(0,radius+90,0);plbl.scale.set(Math.max(120,radius*1.7),Math.max(30,radius*0.42),1);grp.add(plbl);
    grp.position.copy(p);grp.userData={def,radius,core,moon,clouds,label:plbl,index:i,spin:rand(.02,.06),npcs:makePlanetNPCs(i)};
    spaceScene.add(grp);planets.push(grp);
    moons.push({mesh:moon,planet:grp,r:radius*.26,angle:rand(0,7),dist:radius*2.8,alive:true});
  });
}
const ORG_FIRST=["Vela","Ilan","Bo","Zorak","Sora","Orin","Tess","Kix","Mara","Dax","Lyra","Nox","Pia","Ravi","Suki","Tovak","Una","Wren","Yara","Zane","Eko","Faye","Goro","Hana"];
const ORG_TITLE=["Capitana","Doctor","Comerciante","Embajador","Piloto","Sabio","Ingeniera","Cazadora","Mercader","Exploradora","Médico","Vigía"];
const BOT_PRE=["RX","T","VAL","K2","Servo","M3","ZX","Q7","Núcleo","DX","Bit","Orbe"];
let _nameBag=null,_botBag=null,_nameCount=0;
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function uniqueOrgName(){if(!_nameBag||_nameBag.length===0)_nameBag=shuffle(ORG_FIRST);const f=_nameBag.pop();const t=ORG_TITLE[Math.floor(Math.random()*ORG_TITLE.length)];return t+" "+f;}
function uniqueBotName(){if(!_botBag||_botBag.length===0)_botBag=shuffle(BOT_PRE);const p=_botBag.pop();return "Unidad "+p+"-"+(10+Math.floor(Math.random()*89));}
const NPC_COLORS=[0x2bff9b,0x22e9ff,0xff2d95,0xffd24a,0x7c8cff,0xff7b2d,0x9bff5a,0xff5a4a,0xb84aff,0xeae6ff];
const NPC_LINES=["¡Qué bueno verte por aquí!","Los tiempos son peligrosos, viajero.","Necesito una mano con algo.","¿Vienes de parte de la Flota?","Cuidado con las naves de Xandar.","Tengo trabajo para alguien valiente.","No todos los días llega un piloto así.","Si me ayudas, te recompensaré bien.","La galaxia ya no es segura.","Bienvenido a mi mundo, forastero."];
const BOT_LINES=["CONSULTA REGISTRADA. Tengo una tarea.","SALUDOS, UNIDAD ORGÁNICA.","PROCESANDO... necesito ayuda.","DETECTO UN PILOTO CAPAZ.","MISIÓN DISPONIBLE PARA TI.","BEEP. ¿Aceptas una tarea?"];
function makePlanetNPCs(planetIdx){
  const list=[];const cnt=2;
  for(let k=0;k<cnt;k++){
    if(planetIdx===0&&k===0){list.push({robot:false,face:"👩‍🚀",name:"Capitana Vela",role:"Mando de la Flota",color:0x2bff9b,line:NPC_LINES[0]});continue;}
    const robot=Math.random()<0.4;
    list.push({robot,
      face:robot?"🤖":FACES_ORG[(_nameCount++)%FACES_ORG.length],
      name:robot?uniqueBotName():uniqueOrgName(),
      color:NPC_COLORS[Math.floor(Math.random()*NPC_COLORS.length)],
      line:robot?BOT_LINES[Math.floor(Math.random()*BOT_LINES.length)]:NPC_LINES[Math.floor(Math.random()*NPC_LINES.length)],
      role:robot?"Robot de servicio":(PLANET_DEFS[planetIdx].faction==='enemigo'?"Súbdito de Xandar":(PLANET_DEFS[planetIdx].faction==='aliado'?"Aliado de la Flota":"Habitante"))});
  }
  return list;
}
function randFarPos(min,max){const base=ship?ship.position:V3(0,0,0);const dir=V3(rand(-1,1),rand(-.4,.4),rand(-1,1)).normalize();return base.clone().addScaledVector(dir,rand(min,max));}
function spawnAsteroid(initial){const r=rand(10,30);const geo=new THREE.IcosahedronGeometry(r,0);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const f=1+rand(-.28,.28);p.setXYZ(i,p.getX(i)*f,p.getY(i)*f,p.getZ(i)*f);}geo.computeVertexNormals();
  const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x6b5a48,roughness:1,metalness:.05,flatShading:true,emissive:0x1a120a,emissiveIntensity:.4}));
  m.position.copy(initial?randFarPos(300,1500):randFarPos(800,1400));
  m.userData={r,vel:V3(rand(-8,8),rand(-4,4),rand(-8,8)),spin:V3(rand(-1,1),rand(-1,1),rand(-1,1)).multiplyScalar(.6)};spaceScene.add(m);asteroids.push(m);}
function powColor(t){return t==='speed'?0x22e9ff:t==='shield'?0x2bff9b:t==='ammo'?0xffd24a:0xff5a4a;}
function spawnPowerup(initial){const t=POW[Math.floor(Math.random()*POW.length)].t;const col=powColor(t);
  const m=new THREE.Mesh(new THREE.TorusGeometry(6,2,8,16),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.9,metalness:.4,roughness:.2}));
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(rgbStr(col)),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.setScalar(40);m.add(glow);
  m.position.copy(initial?randFarPos(300,1400):randFarPos(700,1300));m.userData={t,spin:rand(1,2)};spaceScene.add(m);powerups.push(m);}
function applyPowerup(t){if(t==='speed'){speedBoostT=8;toast('⚡ ¡Turbo de velocidad por 8s!');}
  else if(t==='shield'){P.shield=P.maxShield;toast('🛡️ Escudo recargado');}
  else if(t==='ammo'){inv.ammo+=30;toast('🔫 +30 balas');}
  else{inv.bomb+=1;toast('💣 +1 bomba');}gainXP(5);refreshHUD();}
function buildStations(){stations.forEach(s=>spaceScene.remove(s));stations.length=0;
  for(let i=0;i<6;i++){const g=new THREE.Group();
    const ring=new THREE.Mesh(new THREE.TorusGeometry(34,5,10,28),new THREE.MeshStandardMaterial({color:0x9fb0c8,metalness:.7,roughness:.4}));ring.rotation.x=Math.PI/2;g.add(ring);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(10,10,18,12),new THREE.MeshStandardMaterial({color:0x55607a,metalness:.8,roughness:.3,emissive:0x22e9ff,emissiveIntensity:.3}));g.add(hub);
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(120,220,255,1)'),blending:THREE.AdditiveBlending,transparent:true,opacity:.5,depthWrite:false}));halo.scale.setScalar(150);g.add(halo);
    const lb=makeLabel('⛽ ESTACIÓN','rgba(120,220,255,1)');lb.position.set(0,55,0);lb.scale.set(70,18,1);g.add(lb);
    g.position.set(rand(-WORLD*0.4,WORLD*0.4),rand(-300,300),rand(-WORLD*0.4,WORLD*0.4));g.userData={spin:rand(.2,.5)};spaceScene.add(g);stations.push(g);}}
function spawnMeteor(){const r=rand(8,20);const geo=new THREE.IcosahedronGeometry(r,0);const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x8a5a3a,roughness:1,flatShading:true,emissive:0x5a2a0a,emissiveIntensity:.7}));
  const fwd=V3(0,0,-1).applyQuaternion(ship.quaternion);
  m.position.copy(ship.position).addScaledVector(fwd,720).add(V3(rand(-340,340),rand(-340,340),rand(-340,340)));
  const toShip=ship.position.clone().sub(m.position).normalize();
  m.userData={r,vel:toShip.multiplyScalar(rand(190,300)),spin:V3(rand(-1,1),rand(-1,1),rand(-1,1)).multiplyScalar(1.2)};
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(255,140,60,1)'),blending:THREE.AdditiveBlending,transparent:true,opacity:.7,depthWrite:false}));glow.scale.setScalar(r*4);m.add(glow);
  spaceScene.add(m);asteroids.push(m);}
function spawnCrystal(initial){const m=new THREE.Mesh(new THREE.OctahedronGeometry(7,0),new THREE.MeshStandardMaterial({color:0x2bff9b,emissive:0x2bff9b,emissiveIntensity:.9,metalness:.4,roughness:.2,transparent:true,opacity:.92}));
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(43,255,155,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.setScalar(34);m.add(glow);
  m.position.copy(initial?randFarPos(300,1300):randFarPos(700,1200));m.userData={spin:rand(1,2.4),bob:rand(0,7)};spaceScene.add(m);crystals.push(m);}
function fireBullet(){const fwd=V3(0,0,-1).applyQuaternion(ship.quaternion),right=V3(1,0,0).applyQuaternion(ship.quaternion);
  [-2.6,2.6].forEach(off=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.9,8,8),new THREE.MeshBasicMaterial({color:0x22e9ff}));b.scale.set(1,1,4);b.quaternion.copy(ship.quaternion);
    b.position.copy(ship.position).addScaledVector(right,off).addScaledVector(fwd,6);b.userData={vel:fwd.clone().multiplyScalar(460).add(shipVel),life:1.7};
    const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(34,233,255,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));g.scale.setScalar(9);b.add(g);
    spaceScene.add(b);bullets.push(b);});sfx.laser();}
function launchBomb(){
  if(inv.bomb<=0){toast('No tienes bombas (cómpralas en la tienda de Armas)');return;}
  inv.bomb--;const fwd=V3(0,0,-1).applyQuaternion(ship.quaternion);
  const b=new THREE.Mesh(new THREE.SphereGeometry(3,12,12),new THREE.MeshStandardMaterial({color:0xff5a4a,emissive:0xff2d00,emissiveIntensity:.8}));
  b.position.copy(ship.position).addScaledVector(fwd,8);b.userData={vel:fwd.clone().multiplyScalar(300).add(shipVel),life:5,bomb:true};
  const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(255,90,74,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));g.scale.setScalar(20);b.add(g);
  spaceScene.add(b);bullets.push(b);toast('💣 Bomba lanzada');}
function explode(scn,pos,color,n,big){for(let i=0;i<n;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(color),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  m.position.copy(pos);m.scale.setScalar(big?rand(20,50):rand(6,16));m.userData={vel:V3(rand(-1,1),rand(-1,1),rand(-1,1)).normalize().multiplyScalar(rand(60,big?320:180)),life:rand(.5,1.2)};scn.add(m);particles.push(m);}}
function spawnEnemy(faction,pos,boss){
  const king=faction==='king';if(king)boss=true;
  const col=faction==='police'?0x3aa0ff:(king?0xffd24a:(boss?0xff2d6a:0xc24aff));
  const e=makeShipModel(col,king?'wide':'cone');if(boss)e.scale.setScalar(king?3.6:3.2);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(rgbStr(col)),blending:THREE.AdditiveBlending,transparent:true,opacity:.75,depthWrite:false}));
  halo.scale.setScalar(boss?80:30);e.add(halo);
  e.position.copy(pos||ship.position.clone().add(V3(rand(-400,400),rand(-200,200),rand(-400,400))));
  e.userData={faction,hp:king?34:(boss?28:(faction==='police'?3:4)),shootCD:rand(0.9,2),boss:!!boss,vel:V3(0,0,0)};
  spaceScene.add(e);enemies.push(e);}
function enemyShoot(e){const dir=ship.position.clone().sub(e.position).normalize();
  const b=new THREE.Mesh(new THREE.SphereGeometry(e.userData.boss?2.2:1.2,8,8),new THREE.MeshBasicMaterial({color:e.userData.faction==='police'?0x6ad0ff:0xff5aa0}));
  b.position.copy(e.position).addScaledVector(dir,6);b.userData={vel:dir.multiplyScalar(225),life:3.4,dmg:e.userData.boss?16:7};
  const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(e.userData.faction==='police'?'rgba(106,208,255,1)':'rgba(255,90,160,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));g.scale.setScalar(8);b.add(g);
  spaceScene.add(b);enemyBullets.push(b);beep(300,0.08,'sawtooth',0.03,160);}

/* ============================================================
   SUPERFICIE (planeta o estación lunar)
   ============================================================ */
let astro,sHeading=0,walkAnim=0,surfPlanetIndex=0,onMoon=false;
let surfGround,surfSky;
const surfBuildings=[],surfCores=[],surfBeacons=[],surfNPCObjs=[],companions=[],footBullets=[],hunters=[],biomeProps=[];
const GROUND_R=660;
// definición de edificios-tienda
const SHOP_DEFS=[
 {kind:'base',icon:'🏠',label:'BASE',color:0x9bff5a,pos:[0,-90]},
 {kind:'food',icon:'🍔',label:'COMIDA',color:0xff7b2d,pos:[120,40]},
 {kind:'upg',icon:'🔧',label:'MEJORAS',color:0xffd24a,pos:[-120,40]},
 {kind:'ships',icon:'🚀',label:'NAVES',color:0x22e9ff,pos:[150,-120]},
 {kind:'clothes',icon:'👕',label:'ROPA',color:0xff2d95,pos:[-150,-120]},
 {kind:'arms',icon:'💣',label:'ARMAS',color:0xff5a4a,pos:[0,150]},
 {kind:'jail',icon:'🔒',label:'CÁRCEL',color:0x8a90a0,pos:[210,30]}];
function buildSurface(){
  surfScene=new THREE.Scene();surfScene.fog=new THREE.FogExp2(0x06101e,0.0014);
  surfScene.add(new THREE.AmbientLight(0x8090b0,0.95));
  const sun=new THREE.DirectionalLight(0xffffff,1.2);sun.position.set(200,300,120);surfScene.add(sun);
  surfScene.add(new THREE.PointLight(0x22e9ff,0.6,1000).translateY(120));
  const gg=new THREE.CircleGeometry(GROUND_R,90);gg.rotateX(-Math.PI/2);const gp=gg.attributes.position;
  for(let i=0;i<gp.count;i++){const x=gp.getX(i),z=gp.getZ(i);gp.setY(i,Math.sin(x*0.02)*Math.cos(z*0.02)*4);}gg.computeVertexNormals();
  surfGround=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({color:0x2a3a30,roughness:1,metalness:.05,flatShading:true}));surfScene.add(surfGround);
  surfSky=new THREE.Mesh(new THREE.SphereGeometry(1500,32,32),new THREE.MeshBasicMaterial({color:0x0a1428,side:THREE.BackSide,fog:false}));surfScene.add(surfSky);
  const sg=new THREE.BufferGeometry();const sp=new Float32Array(1500*3);
  for(let i=0;i<1500;i++){const r=1300,th=rand(0,Math.PI*2),ph=Math.acos(rand(0,1));sp[i*3]=r*Math.sin(ph)*Math.cos(th);sp[i*3+1]=r*Math.cos(ph)*0.9+90;sp[i*3+2]=r*Math.sin(ph)*Math.sin(th);}
  sg.setAttribute('position',new THREE.BufferAttribute(sp,3));surfScene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:2.4,transparent:true,opacity:.8,fog:false})));
  for(let i=0;i<18;i++){const r=rand(6,16);const m=new THREE.Mesh(new THREE.DodecahedronGeometry(r,0),new THREE.MeshStandardMaterial({color:0x4a4438,roughness:1,flatShading:true}));
    const a=rand(0,7),d=rand(200,GROUND_R-40);m.position.set(Math.cos(a)*d,r*0.5,Math.sin(a)*d);m.rotation.set(rand(0,7),rand(0,7),rand(0,7));surfScene.add(m);}
  // edificios-tienda
  SHOP_DEFS.forEach(s=>{
    const grp=new THREE.Group();
    const base=new THREE.Mesh(new THREE.CylinderGeometry(18,22,15,8),new THREE.MeshStandardMaterial({color:0x3a3f55,metalness:.6,roughness:.5}));base.position.y=7.5;grp.add(base);
    const dome=new THREE.Mesh(new THREE.SphereGeometry(18,16,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:s.color,metalness:.4,roughness:.4,emissive:s.color,emissiveIntensity:.3}));dome.position.y=15;grp.add(dome);
    grp.position.set(s.pos[0],0,s.pos[1]);grp.userData={shop:s.kind};surfScene.add(grp);surfBuildings.push(grp);
    const lb=makeLabel(s.icon+' '+s.label,rgbStr(s.color));lb.position.set(s.pos[0],36,s.pos[1]);surfScene.add(lb);
    addBeacon(s.pos[0],s.pos[1],s.color);
  });
  // nave aparcada
  surfShip=makeShipModel();surfShip.scale.setScalar(1.5);surfShip.rotation.x=-0.15;surfShip.position.set(70,8,-150);surfScene.add(surfShip);
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(24,28,2,24),new THREE.MeshStandardMaterial({color:0x223,metalness:.7,roughness:.4,emissive:0x0a2a33,emissiveIntensity:.6}));pad.position.set(70,1,-150);surfScene.add(pad);
  const sl=makeLabel('🚀 NAVE',rgbStr(0x78dcff));sl.position.set(70,40,-150);surfScene.add(sl);addBeacon(70,-150,0x78dcff);
  // NPCs (2) + etiquetas
  for(let k=0;k<2;k++){const o=makePerson(0x22e9ff,false);o.position.set(k===0?-60:60,0,80);surfScene.add(o);
    const lbl=makeLabel('NPC',rgbStr(0x22e9ff));lbl.position.set(o.position.x,28,o.position.z);surfScene.add(lbl);
    surfNPCObjs.push({obj:o,label:lbl,idx:k});}
  for(let i=0;i<8;i++)spawnSurfaceCore();
  astro=makePerson(suitColor,false);astro.position.set(0,0,-150);surfScene.add(astro);
}
let surfShip;
function makePerson(color,robot,eye){eye=eye||0x9fe8ff;
  const g=new THREE.Group();
  const suit=new THREE.MeshStandardMaterial({color,metalness:.35,roughness:.55});
  const dark=new THREE.MeshStandardMaterial({color:0x2a2f3f,metalness:.5,roughness:.5});
  const metal=new THREE.MeshStandardMaterial({color:0x9fb0c8,metalness:.8,roughness:.3});
  const legs=[],arms=[];
  if(robot){
    const torso=new THREE.Mesh(new THREE.BoxGeometry(7,8,4.5),suit);torso.position.y=9;g.add(torso);
    const chest=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.6,12),new THREE.MeshStandardMaterial({color:eye,emissive:eye,emissiveIntensity:1}));chest.rotation.x=Math.PI/2;chest.position.set(0,10,2.4);g.add(chest);
    const pelvis=new THREE.Mesh(new THREE.BoxGeometry(5.5,2.5,4),dark);pelvis.position.y=4.6;g.add(pelvis);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1.4,8),metal);neck.position.y=13.4;g.add(neck);
    const head=new THREE.Mesh(new THREE.BoxGeometry(5,4.6,4.6),metal);head.position.y=15.6;g.add(head);
    const face=new THREE.Mesh(new THREE.BoxGeometry(4,3,.4),new THREE.MeshStandardMaterial({color:0x0a1020}));face.position.set(0,15.8,2.35);g.add(face);
    [-1,1].forEach(s=>{const ey=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.1,.4),new THREE.MeshStandardMaterial({color:eye,emissive:eye,emissiveIntensity:1}));ey.position.set(s*1,16.2,2.5);g.add(ey);});
    const mouth=new THREE.Mesh(new THREE.BoxGeometry(2.6,.5,.4),new THREE.MeshStandardMaterial({color:eye,emissive:eye,emissiveIntensity:.7}));mouth.position.set(0,14.7,2.5);g.add(mouth);
    const ant=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,3,6),metal);ant.position.set(0,19.4,0);g.add(ant);
    const ball=new THREE.Mesh(new THREE.SphereGeometry(.8,8,8),new THREE.MeshStandardMaterial({color:0xff5a4a,emissive:0xff5a4a,emissiveIntensity:1}));ball.position.set(0,21,0);g.add(ball);
    [-1,1].forEach(s=>{const arm=new THREE.Group();arm.position.set(s*4.4,12,0);
      const up=new THREE.Mesh(new THREE.BoxGeometry(1.8,5,1.8),suit);up.position.y=-2.5;arm.add(up);
      const hand=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),metal);hand.position.y=-5.5;arm.add(hand);g.add(arm);arms.push(arm);});
    [-1,1].forEach(s=>{const leg=new THREE.Group();leg.position.set(s*1.8,4.2,0);
      const sh=new THREE.Mesh(new THREE.BoxGeometry(2,4.5,2),suit);sh.position.y=-2.3;leg.add(sh);
      const boot=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.6,3.4),dark);boot.position.set(0,-4.6,.6);leg.add(boot);g.add(leg);legs.push(leg);});
  }else{
    const torso=new THREE.Mesh(new THREE.CylinderGeometry(2.8,3.4,7.5,16),suit);torso.position.y=9.5;g.add(torso);
    const chest=new THREE.Mesh(new THREE.SphereGeometry(.9,12,12),new THREE.MeshStandardMaterial({color:eye,emissive:eye,emissiveIntensity:.9}));chest.position.set(0,10.5,2.7);g.add(chest);
    const pelvis=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.4,2.6,12),dark);pelvis.position.y=5;g.add(pelvis);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,1.2,10),suit);neck.position.y=13.4;g.add(neck);
    const helmet=new THREE.Mesh(new THREE.SphereGeometry(3.4,20,20),new THREE.MeshStandardMaterial({color:0xeaf4ff,metalness:.25,roughness:.18}));helmet.position.y=15.6;g.add(helmet);
    const visor=new THREE.Mesh(new THREE.SphereGeometry(2.7,20,16,0,Math.PI*2,0,Math.PI*0.62),new THREE.MeshStandardMaterial({color:0x0a1430,metalness:.6,roughness:.08,emissive:eye,emissiveIntensity:.25}));visor.position.set(0,15.7,1.2);visor.rotation.x=Math.PI*0.52;g.add(visor);
    [-1,1].forEach(s=>{const ey=new THREE.Mesh(new THREE.SphereGeometry(.5,12,12),new THREE.MeshStandardMaterial({color:0xffffff,emissive:eye,emissiveIntensity:.6}));ey.position.set(s*0.85,15.9,3.0);g.add(ey);
      const pupil=new THREE.Mesh(new THREE.SphereGeometry(.22,8,8),new THREE.MeshBasicMaterial({color:0x07112a}));pupil.position.set(s*0.85,15.9,3.35);g.add(pupil);
      const brow=new THREE.Mesh(new THREE.BoxGeometry(1.1,.28,.3),dark);brow.position.set(s*0.85,16.7,3.05);g.add(brow);});
    const mouth=new THREE.Mesh(new THREE.BoxGeometry(1.4,.4,.4),new THREE.MeshStandardMaterial({color:0x7a4a4a}));mouth.position.set(0,14.6,3.05);g.add(mouth);
    [-1,1].forEach(s=>{const arm=new THREE.Group();arm.position.set(s*3.6,12.6,0);
      const up=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1,5,10),suit);up.position.y=-2.5;arm.add(up);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,10),new THREE.MeshStandardMaterial({color:0xeaf4ff}));hand.position.y=-5.4;arm.add(hand);g.add(arm);arms.push(arm);});
    [-1,1].forEach(s=>{const leg=new THREE.Group();leg.position.set(s*1.7,5,0);
      const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.1,5.5,10),suit);sh.position.y=-2.7;leg.add(sh);
      const boot=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.6,3.6),dark);boot.position.set(0,-5.4,.6);leg.add(boot);g.add(leg);legs.push(leg);});
  }
  const pack=new THREE.Mesh(new THREE.BoxGeometry(5,6,2.4),new THREE.MeshStandardMaterial({color:0x44506a,metalness:.5,roughness:.5}));pack.position.set(0,10,-3.2);g.add(pack);
  [-1,1].forEach(s=>{const noz=new THREE.Mesh(new THREE.CylinderGeometry(.7,.9,1.4,8),dark);noz.position.set(s*1.6,6.6,-3.6);g.add(noz);});
  g.userData.legs=legs;g.userData.arms=arms;return g;
}
function addBeacon(x,z,color){const m=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,80,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set(x,40,z);surfScene.add(m);surfBeacons.push(m);}
function spawnSurfaceCore(){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(4,0),new THREE.MeshStandardMaterial({color:0xffd24a,emissive:0xffd24a,emissiveIntensity:1,metalness:.4,roughness:.2}));
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(255,210,74,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.setScalar(20);m.add(glow);
  const a=rand(0,7),d=rand(220,GROUND_R-60);m.position.set(Math.cos(a)*d,6,Math.sin(a)*d);m.userData={bob:rand(0,7)};surfScene.add(m);surfCores.push(m);}
function biomeMat(c,emi){return new THREE.MeshStandardMaterial({color:c,roughness:1,metalness:.1,flatShading:true,emissive:emi||0x000000,emissiveIntensity:emi?.6:0});}
function buildBiomeProps(biome){
  biomeProps.forEach(o=>surfScene.remove(o));biomeProps.length=0;
  const add=m=>{surfScene.add(m);biomeProps.push(m);};
  const place=(minD)=>{const a=rand(0,7),d=rand(minD||120,GROUND_R-50);return [Math.cos(a)*d,Math.sin(a)*d];};
  if(biome==='jungle'){
    for(let i=0;i<16;i++){const p=place();const g=new THREE.Group();const h=rand(20,46);
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(2,3,h,7),biomeMat(0x5a3a1a));trunk.position.y=h/2;g.add(trunk);
      const fol=new THREE.Mesh(new THREE.SphereGeometry(rand(10,16),10,8),biomeMat(0x2b8a3a));fol.position.y=h;fol.scale.y=.8;g.add(fol);
      g.position.set(p[0],0,p[1]);add(g);}
    const beast=new THREE.Group();
    const body=new THREE.Mesh(new THREE.SphereGeometry(22,16,12),biomeMat(0x3a7a4a));body.scale.set(1.6,1,1);body.position.y=24;beast.add(body);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(5,7,30,10),biomeMat(0x3a7a4a));neck.position.set(28,36,0);neck.rotation.z=-0.5;beast.add(neck);
    const headB=new THREE.Mesh(new THREE.SphereGeometry(9,12,10),biomeMat(0x46946a));headB.position.set(42,48,0);beast.add(headB);
    [-1,1].forEach(s=>[-1,1].forEach(s2=>{const leg=new THREE.Mesh(new THREE.CylinderGeometry(4,4,24,8),biomeMat(0x2a5a36));leg.position.set(s*14,12,s2*10);beast.add(leg);}));
    const bp=place(180);beast.position.set(bp[0],0,bp[1]);beast.userData={beast:true,a:rand(0,7)};add(beast);
  }else if(biome==='ice'){
    for(let i=0;i<24;i++){const p=place();const h=rand(14,40);const sp=new THREE.Mesh(new THREE.ConeGeometry(rand(4,9),h,6),new THREE.MeshStandardMaterial({color:0xdff4ff,roughness:.25,metalness:.2,flatShading:true,transparent:true,opacity:.85}));sp.position.set(p[0],h/2,p[1]);add(sp);}
  }else if(biome==='volcano'){
    for(let i=0;i<10;i++){const p=place();const pool=new THREE.Mesh(new THREE.CircleGeometry(rand(18,34),18),new THREE.MeshStandardMaterial({color:0xff5a1e,emissive:0xff3a00,emissiveIntensity:1,roughness:.6}));pool.rotation.x=-Math.PI/2;pool.position.set(p[0],1.2,p[1]);add(pool);}
    for(let i=0;i<12;i++){const p=place();const h=rand(20,50);const sp=new THREE.Mesh(new THREE.ConeGeometry(rand(6,12),h,6),biomeMat(0x2a120a,0x3a0a00));sp.position.set(p[0],h/2,p[1]);add(sp);}
  }else if(biome==='robot'){
    for(let i=0;i<14;i++){const p=place();const g=new THREE.Group();
      const b=new THREE.Mesh(new THREE.BoxGeometry(rand(8,16),rand(6,12),rand(8,16)),biomeMat(0x55607a));b.position.y=4;b.rotation.y=rand(0,7);g.add(b);
      const eye=new THREE.Mesh(new THREE.SphereGeometry(1.4,8,8),new THREE.MeshStandardMaterial({color:0xff5a4a,emissive:0xff5a4a,emissiveIntensity:.9}));eye.position.set(0,8,4);g.add(eye);
      g.position.set(p[0],0,p[1]);g.rotation.z=rand(-.3,.3);add(g);}
  }else if(biome==='fortress'){
    for(let i=0;i<16;i++){const p=place();const h=rand(24,64);const t=new THREE.Mesh(new THREE.BoxGeometry(rand(8,16),h,rand(8,16)),biomeMat(0x3a2150,0x6a2a8a));t.position.set(p[0],h/2,p[1]);add(t);}
  }else if(biome==='city'){
    for(let i=0;i<14;i++){const p=place();const h=rand(16,54);const t=new THREE.Mesh(new THREE.BoxGeometry(rand(8,14),h,rand(8,14)),biomeMat(0x33405e));t.position.set(p[0],h/2,p[1]);add(t);
      const win=new THREE.Mesh(new THREE.PlaneGeometry(rand(7,12),h),new THREE.MeshStandardMaterial({color:0xffe6a0,emissive:0xffd24a,emissiveIntensity:.4,transparent:true,opacity:.5,side:THREE.DoubleSide}));win.position.set(p[0],h/2,p[1]+7);add(win);}
  }
}
function themeSurface(idx,moon){
  surfPlanetIndex=idx;onMoon=!!moon;const def=PLANET_DEFS[idx];
  const bk=moon?'moon':(def.biome||'city');const B=BIOMES[bk]||BIOMES.city;
  surfGround.material.color.setHex(B.ground);
  surfSky.material.color.setHex(B.sky);
  surfScene.fog.color.setHex(B.fog);
  buildBiomeProps(bk);
  // colorear NPCs según planeta y actualizar etiquetas con personajes
  const npcs=planets[idx].userData.npcs;
  surfNPCObjs.forEach((no,k)=>{
    surfScene.remove(no.obj);
    const npc=npcs[k];const col=npc.robot?0x9fb0c8:npc.color;
    const o=makePerson(col,npc.robot);o.position.copy(no.objPos||V3(k===0?-60:60,0,80));
    if(!no.objPos)no.objPos=o.position.clone();surfScene.add(o);no.obj=o;no.dead=false;o.visible=true;no.label.visible=true;
    no.label.material.map=labelTexture((npc.robot?'🤖 ':'')+npc.name,rgbStr(col));no.label.material.map.needsUpdate=true;
  });
  astro.children.forEach(c=>{if(c.material&&c.material.color&&c.geometry&&c.geometry.type.indexOf('Cylinder')>=0&&c.position.y>3)c.material.color.setHex(suitColor);});
  surfCores.forEach(c=>{const a=rand(0,7),d=rand(220,GROUND_R-60);c.position.set(Math.cos(a)*d,6,Math.sin(a)*d);});
  // limpiar cazadores y compañeros sobrantes
  hunters.forEach(h=>surfScene.remove(h.obj));hunters.length=0;
  // tiendas en luna: solo base/naves
  surfBuildings.forEach(b=>{b.visible=moon?(b.userData.shop==='base'||b.userData.shop==='upg'):true;});
}

/* ============================================================
   MISIONES (sistema múltiple + historia)
   ============================================================ */
const REASONS={
 destroy:['para despejar la ruta comercial','porque amenazan una colonia cercana','para proteger un convoy de refugiados','que bloquean el puerto estelar'],
 collect:['para alimentar los escudos de la colonia','para reactivar una estación sin energía','para fabricar munición contra Xandar','para el reactor de la flota aliada'],
 surface:['para reactivar los reactores del planeta','porque la ciudad se quedó sin energía','para reparar las defensas del planeta','para el hospital de la colonia'],
 hunt:['esas naves atacan a los mercantes','son piratas al servicio del Rey','amenazan a los refugiados','vigilan el sector para Xandar'],
 bomb:['esa luna esconde una base secreta de Xandar','desde ahí lanzan ataques a los aliados','es un puesto de vigilancia enemigo'],
 travel:['para llevar un informe urgente','para coordinar a los aliados','para una reunión secreta de la resistencia']};
function missionReason(t){const a=REASONS[t]||REASONS.travel;return a[Math.floor(Math.random()*a.length)];}
const DELIVER_VERBS=['Lleva un artefacto aliado a','Entrega suministros médicos a','Escolta un convoy a','Lleva planes secretos a','Transporta un prisionero a'];
let _missionBag=[];
const MTEMPLATES=['destroy','collect','surface','travel','deliver','hunt','bomb','assassinate','scan','rescue','defend','meteor','prisoner'];
function nextMissionTemplate(){if(_missionBag.length===0)_missionBag=shuffle(MTEMPLATES);return _missionBag.pop();}
function makeMissionFor(planet,slot){
  const tpl=nextMissionTemplate();const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const other=()=>{const o=planets.filter(p=>p!==planet);return o[Math.floor(Math.random()*o.length)];};
  let m={progress:0,id:'m'+now()+Math.random()};
  if(tpl==='destroy'){m.type='destroy';m.goal=r(4,8);m.reward=110+m.goal*15;m.desc='Destruye '+m.goal+' asteroides — '+missionReason('destroy');}
  else if(tpl==='collect'){m.type='collect';m.goal=r(4,8);m.reward=120+m.goal*16;m.desc='Recoge '+m.goal+' cristales de energía — '+missionReason('collect');}
  else if(tpl==='surface'){m.type='surface';m.goal=r(4,8);m.reward=120+m.goal*16;m.desc='Recoge '+m.goal+' núcleos en la superficie — '+missionReason('surface');}
  else if(tpl==='rescue'){m.type='surface';m.goal=r(3,6);m.reward=150+m.goal*16;m.desc='Rescata '+m.goal+' cápsulas de supervivientes (núcleos) antes de que Xandar los capture';}
  else if(tpl==='travel'){m.dest=other();m.type='travel';m.goal=1;m.reward=150;m.desc='Viaja al planeta '+m.dest.userData.def.name+' — '+missionReason('travel');}
  else if(tpl==='scan'){m.dest=other();m.type='travel';m.goal=1;m.reward=150;m.desc='Explora y escanea el planeta '+m.dest.userData.def.name+' para cartografiar el sector';}
  else if(tpl==='deliver'){m.dest=other();m.type='travel';m.goal=1;m.reward=165;m.desc=DELIVER_VERBS[Math.floor(Math.random()*DELIVER_VERBS.length)]+' '+m.dest.userData.def.name;}
  else if(tpl==='hunt'){m.type='hunt';m.goal=r(2,4);m.reward=170+m.goal*35;m.spawn=m.goal;m.desc='Caza '+m.goal+' naves enemigas — '+missionReason('hunt');}
  else if(tpl==='defend'){m.type='hunt';m.goal=r(2,4);m.reward=185+m.goal*35;m.spawn=m.goal;m.desc='Defiende el sector: derriba '+m.goal+' naves enemigas que acosan la colonia';}
  else if(tpl==='assassinate'){m.type='hunt';m.goal=1;m.reward=240;m.spawn=1;m.desc='Elimina al comandante de Xandar (nave morada)';}
  else if(tpl==='meteor'){m.type='meteor';m.goal=1;m.reward=260;m.timeLeft=22;m.desc='Sobrevive a una lluvia de meteoritos durante 22s (¡los láseres NO sirven, esquívalos!)';}
  else if(tpl==='prisoner'){const o=planets.filter(p=>p!==planet);m.dest=o[Math.floor(Math.random()*o.length)];m.type='prisoner';m.goal=1;m.reward=280;m.desc='Rescata al prisionero de la cárcel de Xandar en '+m.dest.userData.def.name+' (entra a la 🔒 cárcel)';}
  else {m.type='bomb';m.goal=1;m.reward=230;m.desc='Destruye una luna con una bomba — '+missionReason('bomb');}
  m.desc+='.';
  return m;
}
function hasMissionFrom(){return false;}
function addMission(m){if(missions.length>=MAX_MISSIONS){toast('Diario de misiones lleno ('+MAX_MISSIONS+')');return false;}missions.push(m);
  if(m.spawn){for(let i=0;i<m.spawn;i++)spawnEnemy('xandar');}
  if(m.type==='meteor')toast('☄️ ¡Empieza la lluvia de meteoritos! Esquiva, los láseres no sirven.');
  if(m.type==='prisoner')toast('🔒 Viaja a '+m.dest.userData.def.name+' y entra a la cárcel para liberarlo.');
  updateMissionUI();return true;}
function bump(type,extra){missions.slice().forEach(m=>{if(m.type===type){m.progress++;if(m.progress>=m.goal)completeMission(m);}});
  updateMissionUI();}
function completeMission(m){credits+=m.reward;missionsDone++;gainXP(30);sfx.pickup();toast('✔ Misión completada · +'+m.reward+'⬡');
  missions=missions.filter(x=>x!==m);updateMissionUI();refreshHUD();saveGame(true);}
function updateMissionUI(){
  if(missions.length===0){$('missionText').textContent='Sin misiones · habla con personajes';$('missionProg').textContent='';}
  else{const m=missions[0];$('missionText').textContent='('+missions.length+') '+m.desc;
    $('missionProg').textContent=m.type==='travel'?('Destino: '+m.dest.userData.def.name):('Progreso '+m.progress+'/'+m.goal+' · '+m.reward+'⬡');}
  $('storyLine').textContent='★ Historia: '+storyObjText();
}

/* ---------- HISTORIA ---------- */
function advanceStory(){
  const s=STORY[storyStep];
  if(s&&s.reward)credits+=s.reward;
  if(s&&s.companion)grantCompanion();
  if(s&&s.conquer)conquerPlanet();
  gainXP(50);
  storyStep++;sfx.pickup();
  const ns=STORY[storyStep];
  if(ns){
    if(ns.done){toast('★ ¡Victoria! '+ns.obj);sfx.win();}
    else toast('★ Historia '+storyStep+'/'+(STORY.length-1)+': '+ns.obj+(ns.flav?(' — '+ns.flav):''));
    if(ns.kind==='xandar'){const n=ns.spawn||3;for(let i=0;i<n;i++)spawnEnemy('xandar');}
    if(ns.kind==='chase')spawnKing();
  }
  updateMissionUI();refreshHUD();saveGame(true);
}
function conquerPlanet(){
  // el Rey conquista un planeta neutral/aliado (no Aurelia, no Xandar): se vuelve rojo y enemigo
  const cand=planets.filter(p=>p.userData.def.faction!=='enemigo'&&p.userData.def.name!=='Aurelia'&&p.userData.def.name!=='Xandar');
  if(!cand.length)return;const p=cand[Math.floor(Math.random()*cand.length)];const def=p.userData.def;
  def.faction='enemigo';def.conquered=true;def.color=0xff3b3b;
  p.userData.core.material.emissive.setHex(0xff3b3b);p.userData.core.material.color.setHex(0xff3b3b);
  toast('🔴 ¡Xandar conquistó '+def.name+'! Vuela sus lunas para liberarlo.');
}
function spawnKing(){toast('👑 ¡El Rey de Xandar huye! Alcánzalo y destrúyelo.');
  spawnEnemy('king',ship.position.clone().add(V3(rand(-150,150),60,-420)),true);}
function storySpawnXandar(){const need=STORY[storyStep];if(need&&need.kind==='xandar'){const alive=enemies.filter(e=>e.userData.faction==='xandar').length;
  if(alive<3&&Math.random()<0.012)spawnEnemy('xandar');}
  if(need&&need.kind==='chase'&&enemies.filter(e=>e.userData.faction==='king').length===0&&Math.random()<0.02)spawnKing();}
function grantCompanion(){if(companions.length>0)return;toast('🤖 ¡Robot compañero! Te sigue, dispara a los enemigos en tierra y recoge núcleos cercanos.');}

/* ============================================================
   DIÁLOGOS (con opciones sí/no)
   ============================================================ */
function showDialog(face,name,role,text,choices){
  $('npcFace').textContent=face;$('npcName').textContent=name;$('npcRole').textContent=role;$('npcText').textContent=text;
  const cw=$('choices');cw.innerHTML='';
  choices.forEach(c=>{const b=document.createElement('button');b.className='btn'+(c.alt?' alt':'');b.textContent=c.label;
    b.onclick=()=>{sfx.ui();if(c.fn)c.fn();};cw.appendChild(b);});
  $('dialog').style.display='flex';shootHeld=false;updateModal();sfx.ui();
}
function closeDialog(){$('dialog').style.display='none';updateModal();}
function talkTo(npcIdx){
  const def=PLANET_DEFS[surfPlanetIndex];const npc=planets[surfPlanetIndex].userData.npcs[npcIdx];
  // ¿este NPC da el siguiente paso de historia?
  const sActive=storyStep<STORY.length?STORY[storyStep]:null;
  const isStoryGiver=sActive&&sActive.giver===surfPlanetIndex&&npcIdx===0&&(sActive.auto||sActive.text);
  if(isStoryGiver&&sActive.text){
    showDialog(npc.face,npc.name,npc.role,sActive.text,[
      {label:'Sí, te ayudaré',fn:()=>{closeDialog();if(sActive.auto){advanceStory();}else{toast('★ Objetivo: '+sActive.obj);} }},
      {label:'No, ahora no',alt:true,fn:closeDialog}]);
    return;
  }
  // misión normal
  const offer=makeMissionFor(planets[surfPlanetIndex],npcIdx);
  const line=def.faction==='enemigo'?"Eres un intruso... pero el oro es oro. Haz esto y te pagaré.":(npc.line||"¡Hola, viajero!");
  showDialog(npc.face,npc.name,npc.role,line+"  ·  "+offer.desc+"  (Recompensa "+offer.reward+"⬡)",[
    {label:'Sí, acepto la misión',fn:()=>{if(addMission(offer))toast('Misión aceptada');closeDialog();}},
    {label:'No, gracias',alt:true,fn:closeDialog}]);
}
function bossDialog(){
  showDialog("👑","Rey de Xandar","Tirano de la galaxia",
    "¡Insolente! Ninguna nave detiene mi conquista. ¿Te atreves a desafiarme?",[
    {label:'¡Sí! Acabaré contigo',fn:()=>{closeDialog();spawnBoss();}},
    {label:'Huir',alt:true,fn:closeDialog}]);
}
function spawnBoss(){toast('⚠️ ¡La nave insignia del Rey aparece!');for(let i=0;i<2;i++)spawnEnemy('xandar');
  spawnEnemy('xandar',ship.position.clone().add(V3(rand(-200,200),60,-300)),true);}

/* ============================================================
   TIENDAS
   ============================================================ */
function openShop(kind){
  shopOpen=true;const titles={food:'🍔 Tienda de Comida',upg:'🔧 Taller de Mejoras',ships:'🚀 Concesionario de Naves',
    clothes:'👕 Tienda de Ropa',arms:'💣 Armería',base:'🏠 Tu Base / Garaje',station:'🛰️ Estación Espacial',jail:'🔒 Cárcel de Xandar'};
  $('shopTitle').textContent=titles[kind]||'Tienda';$('shopCreditsVal').textContent=credits;
  const L=$('shopList');L.innerHTML='';
  const row=(icon,name,desc,btnHTML)=>{const r=document.createElement('div');r.className='row';
    r.innerHTML='<div class="rIcon">'+icon+'</div><div class="rInfo"><div class="rName">'+name+'</div><div class="rDesc">'+desc+'</div></div>'+btnHTML;L.appendChild(r);return r;};
  if(kind==='food'){
    let r=row('🍔','Ración de comida','Restaura 40 vida y 30 escudo al instante. Tienes: '+inv.food,
      '<button class="rBuy" data-act="buyfood">25 ⬡</button>');
    r=row('🍽️','Comer ahora','Usa una ración de tu inventario.','<button class="rBuy cyan" data-act="eat">Comer</button>');
  }else if(kind==='upg'){
    UPG_DEFS.forEach(d=>{const lvl=upgrades[d.key],maxed=lvl>=MAXLVL,cost=upgCost(d.key);
      let dots='';for(let i=0;i<MAXLVL;i++)dots+='<div class="dot'+(i<lvl?' on':'')+'"></div>';
      const btn=maxed?'<div class="rBuy maxed">MÁXIMO</div>':'<button class="rBuy'+(credits<cost?' cant':'')+'" data-up="'+d.key+'">'+cost+' ⬡</button>';
      const r=row(d.icon,d.name,d.desc,btn);r.querySelector('.dots')?null:r.querySelector('.rInfo').insertAdjacentHTML('beforeend','<div class="dots">'+dots+'</div>');});
    row('💎','Vender cristales × '+inv.crystal,'Valor '+SELL.crystal+'⬡ c/u.',inv.crystal>0?'<button class="rBuy" data-sell="crystal">+'+(inv.crystal*SELL.crystal)+' ⬡</button>':'<div class="rBuy maxed">VACÍO</div>');
    row('🔆','Vender núcleos × '+inv.core,'Valor '+SELL.core+'⬡ c/u.',inv.core>0?'<button class="rBuy" data-sell="core">+'+(inv.core*SELL.core)+' ⬡</button>':'<div class="rBuy maxed">VACÍO</div>');
  }else if(kind==='ships'){
    SHIPS.forEach((s,i)=>{const owned=ownedShips.has(i),sel=curShip===i;
      const btn=sel?'<div class="rBuy maxed">EN USO</div>':(owned?'<button class="rBuy cyan" data-useship="'+i+'">Usar</button>':'<button class="rBuy'+(credits<s.price?' cant':'')+'" data-buyship="'+i+'">'+s.price+' ⬡</button>');
      row('🚀',s.name,'Escudo '+s.shield+' · Velocidad '+s.speed,btn);});
    const r3=document.createElement('div');r3.className='row';r3.innerHTML='<div class="rIcon">🎨</div><div class="rInfo"><div class="rName">Color de tu nave</div><div class="swatches" id="shcW"></div></div>';L.appendChild(r3);
    const w3=r3.querySelector('#shcW');SHIP_COLORS.forEach(c=>{const d=document.createElement('div');d.className='sw'+((shipColorOverride||SHIPS[curShip].color)===c?' on':'');d.style.background=cssHex(c);d.onclick=()=>{shipColorOverride=c;rebuildShipVisual();openShop('ships');};w3.appendChild(d);});
  }else if(kind==='clothes'){
    const grp=(title,icon,items,curIdx,setFn)=>{const r=document.createElement('div');r.className='row';
      r.innerHTML='<div class="rIcon">'+icon+'</div><div class="rInfo"><div class="rName">'+title+'</div><div class="swatches"></div></div>';L.appendChild(r);
      const w=r.querySelector('.swatches');items.forEach((it,idx)=>{const d=document.createElement('button');d.className='rBuy '+(idx===curIdx?'cyan':'maxed');d.style.minWidth='auto';d.style.padding='6px 10px';d.textContent=it;
        d.onclick=()=>{setFn(idx);applySuit();openShop('clothes');};w.appendChild(d);});};
    grp('Skin','🧑‍🚀',SUIT_SKINS.map(s=>s.name),suitSkin,i=>suitSkin=i);
    grp('Cara','😀',SUIT_FACES.map(f=>f.name),suitFace,i=>suitFace=i);
    const r2=document.createElement('div');r2.className='row';r2.innerHTML='<div class="rIcon">🎨</div><div class="rInfo"><div class="rName">Color del traje</div><div class="swatches" id="colW"></div></div>';L.appendChild(r2);
    const w=r2.querySelector('#colW');SUIT_COLORS.forEach(c=>{const d=document.createElement('div');d.className='sw'+(c===suitColor?' on':'');d.style.background=cssHex(c);d.onclick=()=>{suitColor=c;applySuit();openShop('clothes');};w.appendChild(d);});
  }else if(kind==='arms'){
    row('💣','Bomba','Destruye lunas y enemigos. Tienes: '+inv.bomb,'<button class="rBuy" data-act="buybomb">120 ⬡</button>');
    row('🔫','Munición +40','Balas para los cañones de tu nave. Tienes: '+inv.ammo,'<button class="rBuy" data-act="buyammo">50 ⬡</button>');
    row('🔫','Munición +100','Cargamento grande de balas.','<button class="rBuy" data-act="buyammo2">110 ⬡</button>');
    row('⛽','Gasolina (llenar)','Llena el tanque de tu nave.','<button class="rBuy" data-act="buyfuel">60 ⬡</button>');
  }else if(kind==='base'){
    row('🛏️','Descansar','Recupera toda la vida y escudo.','<button class="rBuy cyan" data-act="rest">Descansar</button>');
    row('👕','Vestidor','Cambia tu cara, skin y color de traje.','<button class="rBuy cyan" data-act="wardrobe">Abrir</button>');
    row('🏠','Punto de reaparición','Si caes, reapareces aquí (pierdes 1/6 de créditos).','<div class="rBuy maxed">ACTIVO</div>');
  }else if(kind==='station'){
    row('⛽','Gasolina (llenar)','Repostar el tanque de tu nave.','<button class="rBuy" data-act="buyfuel">60 ⬡</button>');
    row('🔫','Munición +40','Balas para tu nave. Tienes: '+inv.ammo,'<button class="rBuy" data-act="buyammo">50 ⬡</button>');
    row('💣','Bomba','Una bomba más.','<button class="rBuy" data-act="buybomb">120 ⬡</button>');
  }else if(kind==='jail'){
    const pm=missions.find(m=>m.type==='prisoner'&&m.dest===planets[surfPlanetIndex]);
    if(pm)row('🧑‍🚀','Prisionero encerrado','Libéralo para completar la misión de rescate.','<button class="rBuy cyan" data-act="free">Liberar</button>');
    else row('🔒','Cárcel vacía','No hay ningún prisionero que rescatar aquí ahora.','<div class="rBuy maxed">VACÍA</div>');
  }
  if(kind==='food'||kind==='arms'||kind==='upg'||kind==='ships'){
    row('🫳','Robar mercancía','Te llevas algo gratis... pero te volverás CRIMINAL BUSCADO y vendrán a por ti.','<button class="rBuy" data-act="steal" style="border-color:var(--red);color:var(--red);background:rgba(255,90,74,.14)">Robar</button>');
  }
  L.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>shopAction(b.dataset.act,kind));
  L.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const k=b.dataset.up,c=upgCost(k);if(credits>=c&&upgrades[k]<MAXLVL){credits-=c;upgrades[k]++;recomputeStats();sfx.ui();toast('Mejora: '+UPG_DEFS.find(u=>u.key===k).name);refreshHUD();openShop(kind);}});
  L.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const k=b.dataset.sell;if(inv[k]>0){credits+=inv[k]*SELL[k];toast('Vendido +'+(inv[k]*SELL[k])+'⬡');inv[k]=0;sfx.ui();refreshHUD();openShop(kind);}});
  L.querySelectorAll('[data-buyship]').forEach(b=>b.onclick=()=>{const i=+b.dataset.buyship;if(credits>=SHIPS[i].price){credits-=SHIPS[i].price;ownedShips.add(i);curShip=i;shipColorOverride=null;recomputeStats();rebuildShipVisual();sfx.pickup();toast('Compraste '+SHIPS[i].name);refreshHUD();openShop(kind);}});
  L.querySelectorAll('[data-useship]').forEach(b=>b.onclick=()=>{curShip=+b.dataset.useship;shipColorOverride=null;recomputeStats();rebuildShipVisual();sfx.ui();toast('Nave en uso: '+SHIPS[curShip].name);openShop(kind);});
  $('shop').style.display='flex';shootHeld=false;updateModal();sfx.ui();
}
function shopAction(act,kind){
  if(act==='buyfood'){if(credits>=25){credits-=25;inv.food++;sfx.ui();}}
  else if(act==='eat'){if(inv.food>0){inv.food--;P.health=clamp(P.health+40,0,P.maxHealth);P.shield=clamp(P.shield+30,0,P.maxShield);sfx.pickup();toast('Comiste · +vida +escudo');}else toast('No tienes comida');}
  else if(act==='buybomb'){if(credits>=120){credits-=120;inv.bomb++;sfx.ui();}}
  else if(act==='bribe'){if(wanted>0&&credits>=200){credits-=200;wanted=clamp(wanted-1,0,5);updateWanted();sfx.ui();toast('Soborno pagado · -1 estrella');}}
  else if(act==='rest'){P.health=P.maxHealth;P.shield=P.maxShield;sfx.pickup();toast('Descansaste · vida y escudo al máximo');}
  else if(act==='wardrobe'){openShop('clothes');return;}
  else if(act==='free'){const pm=missions.find(m=>m.type==='prisoner'&&m.dest===planets[surfPlanetIndex]);if(pm){toast('🔓 ¡Liberaste al prisionero!');closeShop();completeMission(pm);return;}else toast('Aquí no hay prisionero.');}
  else if(act==='buyammo'){if(credits>=50){credits-=50;inv.ammo+=40;sfx.ui();}}
  else if(act==='buyammo2'){if(credits>=110){credits-=110;inv.ammo+=100;sfx.ui();}}
  else if(act==='buyfuel'){if(credits>=60){credits-=60;P.fuel=P.maxFuel;sfx.ui();}}
  else if(act==='refuelfree'){P.fuel=P.maxFuel;inv.ammo+=30;sfx.pickup();toast('⛽ Repostado y rearmado');}
  else if(act==='steal'){let got='algo';
    if(kind==='food'){inv.food++;got='una ración';}
    else if(kind==='arms'){inv.bomb++;got='una bomba';}
    else if(kind==='upg'){credits+=120;got='120⬡ de la caja';}
    else if(kind==='ships'){const no=SHIPS.map((s,i)=>i).filter(i=>!ownedShips.has(i));if(no.length){ownedShips.add(no[0]);got=SHIPS[no[0]].name;}else{credits+=200;got='200⬡';}}
    addWanted(kind==='ships'?3:2,'¡Robaste en la tienda!');sfx.hit();toast('🫳 Robaste '+got+' · ¡ahora te buscan!');
    refreshHUD();closeShop();return;}
  refreshHUD();openShop(kind);
}
function closeShop(){shopOpen=false;$('shop').style.display='none';updateModal();}
$('shopClose').onclick=closeShop;

/* ============================================================
   MENÚ (inventario/mapa/nave/ropa/misiones)
   ============================================================ */
let menuTab='inv';
function toggleMenu(tab){if(shopOpen||$('dialog').style.display==='flex')return;
  if(menuOpen&&!tab){menuOpen=false;$('menu2').style.display='none';updateModal();return;}
  menuOpen=true;if(tab)menuTab=tab;renderMenu();$('menu2').style.display='flex';shootHeld=false;updateModal();sfx.ui();}
$('menuBtn').onclick=()=>toggleMenu();$('menuClose').onclick=()=>{menuOpen=false;$('menu2').style.display='none';updateModal();};
function renderMenu(){
  const tabs=[['inv','🎒 Inventario'],['map','🗺️ Mapa'],['ship','🚀 Nave'],['clothes','👕 Ropa'],['miss','📜 Misiones']];
  const tw=$('menuTabs');tw.innerHTML='';tabs.forEach(([k,l])=>{const b=document.createElement('button');b.className='tab'+(menuTab===k?' on':'');b.textContent=l;b.onclick=()=>{menuTab=k;renderMenu();};tw.appendChild(b);});
  const B=$('menuBody');B.innerHTML='';
  const row=(icon,name,desc,right)=>B.insertAdjacentHTML('beforeend','<div class="row"><div class="rIcon">'+icon+'</div><div class="rInfo"><div class="rName">'+name+'</div><div class="rDesc">'+desc+'</div></div><div class="rBuy maxed">'+right+'</div></div>');
  if(menuTab==='inv'){
    row('⬡','Créditos','Tu dinero.',credits);
    row('💎','Cristales de energía','Se recogen en el espacio.','× '+inv.crystal);
    row('🔆','Núcleos de energía','Se recogen en planetas.','× '+inv.core);
    row('🍔','Comida','Restaura vida/escudo.','× '+inv.food);
    row('💣','Bombas','Destruyen lunas.','× '+inv.bomb);
    row('🔫','Munición','Balas de la nave.','× '+inv.ammo);
    row('⛽','Gasolina','Combustible de la nave.',Math.round(P.fuel)+' / '+P.maxFuel);
    row('🪐','Planetas','Descubiertos / total.',discovered.size+' / '+PLANET_DEFS.length);
  }else if(menuTab==='map'){
    B.innerHTML='<div id="mapLegend2" style="font-size:11px;color:#9fc3d4;margin-bottom:10px"></div><canvas id="mapCanvas2" width="560" height="560" style="display:block;width:100%;border-radius:12px;border:1px solid var(--line);background:#05080f"></canvas>';
    drawMapOn('mapCanvas2','mapLegend2');
  }else if(menuTab==='ship'){
    const s=SHIPS[curShip];row('🚀',s.name,'Nave actual.','EN USO');
    row('🛡️','Escudo máximo','Casco + mejoras.',Math.round(stat.maxShield));
    row('⚡','Velocidad máxima','Motores + mejoras.',Math.round(stat.maxSpeed));
    UPG_DEFS.forEach(d=>row(d.icon,d.name,d.desc,'Nv '+upgrades[d.key]+'/'+MAXLVL));
    B.insertAdjacentHTML('beforeend','<div class="rDesc" style="margin-top:6px">Compra naves y mejoras en las tiendas 🚀 y 🔧 de los planetas.</div>');
  }else if(menuTab==='clothes'){
    B.insertAdjacentHTML('beforeend','<div class="row"><div class="rIcon">👕</div><div class="rInfo"><div class="rName">Color del traje</div><div class="rDesc">Cámbialo aquí o en la tienda 👕.</div><div class="swatches" id="swWrap2"></div></div></div>');
    const w=$('swWrap2');SUIT_COLORS.forEach(c=>{const d=document.createElement('div');d.className='sw'+(c===suitColor?' on':'');d.style.background=cssHex(c);d.onclick=()=>{suitColor=c;applySuit();renderMenu();};w.appendChild(d);});
  }else if(menuTab==='miss'){
    B.insertAdjacentHTML('beforeend','<div class="row" style="border-color:rgba(255,210,74,.5)"><div class="rIcon">★</div><div class="rInfo"><div class="rName">Modo Historia · La Guerra de Xandar</div><div class="rDesc">'+storyObjText()+'</div></div><div class="rBuy maxed">'+storyStep+'/'+(STORY.length-1)+'</div></div>');
    if(missions.length===0)B.insertAdjacentHTML('beforeend','<div class="rDesc">No tienes misiones secundarias. Habla con los personajes de los planetas.</div>');
    missions.forEach(m=>row('📜',m.desc,m.type==='travel'?('Destino '+m.dest.userData.def.name):('Progreso '+m.progress+'/'+m.goal),m.reward+'⬡'));
  }
}

/* ---------- MAPA ---------- */
function toggleMap(){if(shopOpen||$('dialog').style.display==='flex')return;mapOpen=!mapOpen;$('map').style.display=mapOpen?'flex':'none';shootHeld=false;updateModal();if(mapOpen)drawMapOn('mapCanvas','mapLegend');}
$('mapBtn').onclick=toggleMap;$('mapClose').onclick=()=>{mapOpen=false;$('map').style.display='none';updateModal();};
function drawMapOn(cid,lid){const cv=$(cid);if(!cv)return;const size=Math.min(innerWidth*0.84,innerHeight*0.56,580);cv.width=cv.height=size;const g=cv.getContext('2d');
  g.fillStyle='#05080f';g.fillRect(0,0,size,size);const R=WORLD*0.72;const toXY=(wx,wz)=>[(wx/(2*R)+0.5)*size,(wz/(2*R)+0.5)*size];
  g.strokeStyle='rgba(34,233,255,.10)';g.lineWidth=1;for(let i=0;i<=8;i++){const p=i/8*size;g.beginPath();g.moveTo(p,0);g.lineTo(p,size);g.stroke();g.beginPath();g.moveTo(0,p);g.lineTo(size,p);g.stroke();}
  const[sx,sy]=toXY(sunPos.x,sunPos.z);g.fillStyle='rgba(255,220,140,.95)';g.shadowColor='rgba(255,220,140,1)';g.shadowBlur=14;g.beginPath();g.arc(sx,sy,7,0,7);g.fill();g.shadowBlur=0;
  g.fillStyle='#ffe6a0';g.font='11px Consolas, monospace';g.textAlign='center';g.fillText('SOL (warp)',sx,sy-12);
  planets.forEach(p=>{const def=p.userData.def;const[x,y]=toXY(p.position.x,p.position.z);
    if(discovered.has(def.name)){g.fillStyle=cssHex(def.color);g.shadowColor=cssHex(def.color);g.shadowBlur=12;g.beginPath();g.arc(x,y,7,0,7);g.fill();g.shadowBlur=0;
      if(visited.has(def.name)){g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(x,y,11,0,7);g.stroke();}
      g.fillStyle=def.faction==='enemigo'?'#ff8a8a':'#dff6ff';g.font='12px Consolas, monospace';g.fillText(def.name,x,y-14);}
    else{g.fillStyle='rgba(150,170,190,.35)';g.beginPath();g.arc(x,y,4,0,7);g.fill();g.fillStyle='rgba(150,170,190,.5)';g.fillText('?',x,y-9);}});
  const[px,py]=toXY(ship.position.x,ship.position.z);const fwd=V3(0,0,-1).applyQuaternion(ship.quaternion);const ang=Math.atan2(fwd.x,fwd.z);
  g.save();g.translate(px,py);g.rotate(-ang);g.fillStyle='#22e9ff';g.shadowColor='#22e9ff';g.shadowBlur=10;g.beginPath();g.moveTo(0,-9);g.lineTo(6,7);g.lineTo(0,3);g.lineTo(-6,7);g.closePath();g.fill();g.restore();g.shadowBlur=0;
  if($(lid))$(lid).innerHTML='Galaxia <b>'+galaxy+'</b> · <b>'+discovered.size+'/'+PLANET_DEFS.length+'</b> descubiertos · vuela cerca para revelar · vuela al <b>Sol</b> para cambiar de galaxia.';
}

/* ============================================================
   INTERACCIÓN / MODOS
   ============================================================ */
let nearTarget=null;
function interact(){if(modalOpen||!nearTarget)return;
  if(nearTarget.kind==='land')land(nearTarget.planet,false);
  else if(nearTarget.kind==='moon')land(nearTarget.planet,true);
  else if(nearTarget.kind==='npc')talkTo(nearTarget.idx);
  else if(nearTarget.kind==='shop')openShop(nearTarget.shop);
  else if(nearTarget.kind==='ship')takeOff();
  else if(nearTarget.kind==='sun')warpGalaxy();
  else if(nearTarget.kind==='station')openShop('station');
  else if(nearTarget.kind==='boss')bossDialog();
}
function updateModal(){modalOpen=(shopOpen||menuOpen||mapOpen||$('dialog').style.display==='flex');}
function land(planet,moon){
  surfPlanetIndex=planet.userData.index;themeSurface(surfPlanetIndex,moon);
  astro.position.set(0,0,-150);surfVel.set(0,0,0);jumpY=0;vy=0;jetFuel=100;sHeading=0;mode=MODE.SURFACE;
  if(!moon){visited.add(PLANET_DEFS[surfPlanetIndex].name);}discovered.add(PLANET_DEFS[surfPlanetIndex].name);
  // historia: viajar a Xandar
  if(STORY[storyStep]&&STORY[storyStep].kind==='travel'&&PLANET_DEFS[surfPlanetIndex].name===STORY[storyStep].destName)advanceStory();
  setControls();$('modeVal').textContent=(moon?'Luna de ':'')+PLANET_DEFS[surfPlanetIndex].name;$('modeLabel').textContent='En tierra';
  $('cross').style.display='block';toggleTouchButtons(false);
  toast((moon?'🛰️ Estación lunar · ':'🛬 Aterrizaste en ')+PLANET_DEFS[surfPlanetIndex].name+(moon?'':' · '+(BIOMES[PLANET_DEFS[surfPlanetIndex].biome]||BIOMES.city).name));sfx.ui();saveGame(true);
}
function takeOff(){mode=MODE.SPACE;const planet=planets[surfPlanetIndex];const out=V3(rand(-1,1),rand(.2,.6),rand(-1,1)).normalize();
  ship.position.copy(planet.position).addScaledVector(out,planet.userData.radius+130);ship.lookAt(ship.position.clone().addScaledVector(out,300));
  shipVel.set(0,0,0);speed=150;setControls();$('modeVal').textContent='Vuelo';$('modeLabel').textContent='Modo';$('cross').style.display='block';
  toggleTouchButtons(true);hunters.forEach(h=>surfScene.remove(h.obj));hunters.length=0;footBullets.forEach(b=>surfScene.remove(b));footBullets.length=0;sfx.ui();saveGame(true);}
function toggleTouchButtons(space){if(!isTouch)return;$('btnFire').style.display='flex';$('btnE').style.display='flex';
  $('btnBoost').style.display=space?'flex':'none';$('btnBomb').style.display=space?'flex':'none';$('btnJump').style.display=space?'none':'flex';}

/* ---------- HUD ---------- */
function setControls(){$('controls').innerHTML=(mode===MODE.SURFACE)
  ?'<div><b>WASD</b> mover · <b>ratón</b> girar · <b>Espacio</b> saltar (x2) y jetpack</div><div><b>Clic</b> disparar · <b>E</b> interactuar</div>'
  :'<div><b>Ratón</b> girar · <b>W/S</b> vel · <b>A/D</b> inclinar</div><div><b>Clic/Espacio</b> disparar · <b>B</b> bomba · <b>E</b> aterrizar</div>';}
function refreshHUD(){$('creditsVal').textContent=credits;
  $('shieldBar').style.width=clamp(P.shield/P.maxShield*100,0,100)+'%';
  $('healthBar').style.width=clamp(P.health/P.maxHealth*100,0,100)+'%';
  const fb=$('fuelBar');if(fb)fb.style.width=clamp(P.fuel/P.maxFuel*100,0,100)+'%';
  const a=$('ammoVal');if(a)a.textContent=inv.ammo;const bv=$('bombVal');if(bv)bv.textContent=inv.bomb;}
function updateWanted(){const w=$('wanted');if(wanted>0){w.style.display='block';$('wantedVal').textContent='★'.repeat(wanted)+'☆'.repeat(5-wanted);}else w.style.display='none';}
function addWanted(n,reason){wanted=clamp(wanted+n,0,5);wantedTimer=0;updateWanted();if(reason)toast('⚠️ '+reason+' · Buscado nivel '+wanted);}
let toastT=0;function toast(t){$('toast').textContent=t;$('toast').classList.add('show');toastT=3.2;}
function damagePlayer(d){const t=now();P.lastHit=t;sfx.hit();shake=Math.max(shake,1.6);
  if(P.shield>0){P.shield-=d;if(P.shield<0){P.health+=P.shield;P.shield=0;}}else P.health-=d;
  refreshHUD();if(P.health<=0)die();}

/* ============================================================
   UPDATE — ESPACIO
   ============================================================ */
function updateSpace(dt){
  if(!modalOpen){const turn=1.4*dt;
    if(joy.active){ship.rotateY(-joy.x*turn);ship.rotateX(joy.y*turn);}
    else{const mx=Math.abs(mouseX)<0.12?0:mouseX,my=Math.abs(mouseY)<0.12?0:mouseY;ship.rotateY(-mx*turn);ship.rotateX(-my*turn);}
    if(keys['KeyA'])ship.rotateZ(1.6*dt);if(keys['KeyD'])ship.rotateZ(-1.6*dt);
    let cruise=130;if(keys['KeyW']||boostHeld)cruise=stat.maxSpeed*0.85;else if(keys['KeyS'])cruise=40;
    if(P.fuel<=0)cruise=Math.min(cruise,48); // sin gasolina: solo a duras penas
    if(speedBoostT>0){speedBoostT-=dt;cruise*=1.5;}
    const effMax=stat.maxSpeed*(speedBoostT>0?1.5:1);
    speed+=(cruise-speed)*Math.min(1,dt*1.4);speed=clamp(speed,30,effMax);
    // consumo de gasolina
    const use=(keys['KeyW']||boostHeld)?2.4:(speed>140?1.0:0.35);
    if(P.fuel>0){const before=P.fuel;P.fuel=clamp(P.fuel-use*dt,0,P.maxFuel);if(before>20&&P.fuel<=20)toast('⛽ Poca gasolina · repón en una tienda de Armas o en tu Base');if(before>0&&P.fuel<=0)toast('⛽ ¡Sin gasolina! Llega a un planeta para repostar');}}
  const fwd=V3(0,0,-1).applyQuaternion(ship.quaternion);shipVel.copy(fwd).multiplyScalar(speed);ship.position.addScaledVector(shipVel,dt);
  ship.userData.engineGlow.scale.setScalar(8+speed*0.03+Math.sin(now()*.02)*1.5);
  if(speed>120&&Math.random()<0.85){const t=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(120,220,255,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
    t.position.copy(ship.position).addScaledVector(fwd,-7);t.scale.setScalar(rand(5,9));t.userData={vel:fwd.clone().multiplyScalar(-25),life:rand(.3,.55)};spaceScene.add(t);particles.push(t);}
  shootCD-=dt;if(shootHeld&&shootCD<=0&&!modalOpen&&!meteorStormActive){if(inv.ammo>0){fireBullet();inv.ammo--;shootCD=stat.fireRate;refreshHUD();}else{shootCD=0.45;beep(120,0.05,'square',0.03);}}
  if(bombQueued){bombQueued=false;if(!modalOpen)launchBomb();}
  // regen escudo
  if(now()-P.lastHit>3000&&P.shield<P.maxShield)P.shield=clamp(P.shield+2.6*dt,0,P.maxShield);
  if(now()-P.lastHit>5000&&P.health<P.maxHealth)P.health=clamp(P.health+3*dt,0,P.maxHealth);
  refreshHUD();
  // cámara
  const back=fwd.clone().multiplyScalar(-46),up=V3(0,1,0).applyQuaternion(ship.quaternion).multiplyScalar(16);
  camera.position.lerp(ship.position.clone().add(back).add(up),clamp(dt*4,0,1));
  if(shake>0){camera.position.x+=rand(-shake,shake);camera.position.y+=rand(-shake,shake);shake*=0.86;}
  camera.up.copy(V3(0,1,0).applyQuaternion(ship.quaternion));camera.lookAt(ship.position.clone().addScaledVector(fwd,40));
  // balas jugador
  for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.position.addScaledVector(b.userData.vel,dt);b.userData.life-=dt;let hit=false;
    // bomba: impacto con luna
    if(b.userData.bomb){for(const mo of moons){if(!mo.alive)continue;const wp=moonWorldPos(mo);if(b.position.distanceTo(wp)<mo.r+14){
      mo.alive=false;mo.mesh.visible=false;explode(spaceScene,wp,'rgba(255,120,60,1)',26,true);sfx.boom();
      const evil=mo.planet.userData.def.faction==='enemigo';
      if(evil){credits+=120;gainXP(20);toast('💥 ¡Liberaste la luna de un planeta de Xandar! +120⬡');}
      else addWanted(3,'¡Destruiste una luna!');
      bump('bomb');storyTick('moon');refreshHUD();hit=true;break;}}}
    if(!hit)for(let j=asteroids.length-1;j>=0;j--){const a=asteroids[j];if(b.position.distanceTo(a.position)<a.userData.r+(b.userData.bomb?16:2)){
      explode(spaceScene,a.position,'rgba(255,170,80,1)',b.userData.bomb?22:14,b.userData.bomb);spaceScene.remove(a);asteroids.splice(j,1);spawnAsteroid(false);kills++;bump('destroy');storyTick('destroy');if(b.userData.bomb)sfx.boom();hit=true;break;}}
    if(!hit)for(let j=enemies.length-1;j>=0;j--){const en=enemies[j];if(b.position.distanceTo(en.position)<(en.userData.boss?34:16)){
      en.userData.hp-=(b.userData.bomb?10:1);explode(spaceScene,b.position,'rgba(255,200,120,1)',6);hit=true;
      if(en.userData.hp<=0){const fac=en.userData.faction;explode(spaceScene,en.position,'rgba(255,120,60,1)',20,en.userData.boss);sfx.boom();
        spaceScene.remove(en);enemies.splice(j,1);
        if(fac==='king'){credits+=900;gainXP(200);storyTick('chase');}
        else{credits+=40;gainXP(10);bump('hunt');if(fac==='xandar')storyTick('xandar');}
        refreshHUD();}break;}}
    if(hit||b.userData.life<=0){spaceScene.remove(b);bullets.splice(i,1);}}
  // balas enemigas
  for(let i=enemyBullets.length-1;i>=0;i--){const b=enemyBullets[i];b.position.addScaledVector(b.userData.vel,dt);b.userData.life-=dt;
    if(b.position.distanceTo(ship.position)<7){damagePlayer(b.userData.dmg);spaceScene.remove(b);enemyBullets.splice(i,1);continue;}
    if(b.userData.life<=0){spaceScene.remove(b);enemyBullets.splice(i,1);}}
  // enemigos IA
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];const toP=ship.position.clone().sub(e.position);const d=toP.length();
    e.lookAt(ship.position);
    if(e.userData.faction==='king'){e.position.addScaledVector(toP.normalize(),-60*dt);} // huye del jugador
    else{const spd=e.userData.faction==='police'?22:40;const desired=d>360?1:(d<210?-0.35:0);e.position.addScaledVector(toP.normalize(),desired*spd*dt);}
    e.userData.shootCD-=dt;if(e.userData.shootCD<=0&&d<700){enemyShoot(e);e.userData.shootCD=e.userData.boss?0.7:(e.userData.faction==='police'?rand(1.6,2.6):rand(1,2));}
    if(d>3000){spaceScene.remove(e);enemies.splice(i,1);}}
  // policía según "se busca"
  const police=enemies.filter(e=>e.userData.faction==='police').length;
  if(wanted>0&&police<wanted&&Math.random()<0.02)spawnEnemy('police');
  storySpawnXandar();
  // tormenta de meteoritos (misión)
  const meteorM=missions.find(m=>m.type==='meteor');
  if(meteorM){meteorStormActive=true;meteorM.timeLeft-=dt;
    if(Math.random()<0.6)spawnMeteor();
    $('missionProg').textContent='☄️ ¡Esquiva! Te quedan '+Math.ceil(meteorM.timeLeft)+'s';
    if(meteorM.timeLeft<=0){meteorStormActive=false;toast('☄️ ¡Sobreviviste a la lluvia de meteoritos!');completeMission(meteorM);}
  }else meteorStormActive=false;
  // se busca decae
  if(wanted>0){wantedTimer+=dt;if(wantedTimer>22){wanted--;wantedTimer=0;updateWanted();if(wanted===0)toast('Ya no te buscan');}}
  // asteroides
  for(let k=asteroids.length-1;k>=0;k--){const a=asteroids[k];a.position.addScaledVector(a.userData.vel,dt);a.rotation.x+=a.userData.spin.x*dt;a.rotation.y+=a.userData.spin.y*dt;
    if(a.position.distanceTo(ship.position)<a.userData.r+6){damagePlayer(20);explode(spaceScene,a.position,'rgba(255,80,80,1)',16);spaceScene.remove(a);asteroids.splice(k,1);spawnAsteroid(false);}}
  recycle(asteroids,2200,spawnAsteroid);
  // cristales
  for(let i=crystals.length-1;i>=0;i--){const c=crystals[i];c.rotation.y+=c.userData.spin*dt;c.position.y+=Math.sin(now()*.001+c.userData.bob)*0.06;
    if(c.position.distanceTo(ship.position)<stat.pickup){inv.crystal++;explode(spaceScene,c.position,'rgba(43,255,155,1)',10);sfx.pickup();spaceScene.remove(c);crystals.splice(i,1);spawnCrystal(false);bump('collect');storyTick('collect');refreshHUD();}}
  recycle(crystals,2200,spawnCrystal);
  // potenciadores
  for(let i=powerups.length-1;i>=0;i--){const pu=powerups[i];pu.rotation.y+=pu.userData.spin*dt;pu.rotation.x+=dt*0.6;
    if(pu.position.distanceTo(ship.position)<stat.pickup+10){applyPowerup(pu.userData.t);explode(spaceScene,pu.position,rgbStr(powColor(pu.userData.t)),12);sfx.pickup();spaceScene.remove(pu);powerups.splice(i,1);spawnPowerup(false);}}
  recycle(powerups,2400,spawnPowerup);
  // estaciones espaciales
  nearStation=null;let stD=Infinity;stations.forEach(s=>{s.rotation.y+=s.userData.spin*dt;const d=s.position.distanceTo(ship.position);if(d<80&&d<stD){stD=d;nearStation=s;}});
  updateParticles(spaceScene,dt);
  // lunas orbitando
  moons.forEach(mo=>{if(!mo.alive)return;mo.angle+=dt*0.04;mo.mesh.position.set(Math.cos(mo.angle)*mo.dist,0,Math.sin(mo.angle)*mo.dist);});
  // planetas + proximidad
  nearPlanet=null;nearMoon=null;let nd=Infinity;nearTarget=null;
  planets.forEach(p=>{p.userData.core.rotation.y+=p.userData.spin*dt;if(p.userData.clouds)p.userData.clouds.rotation.y+=dt*0.05;
    const d=p.position.distanceTo(ship.position)-p.userData.radius;
    if(d<800&&!discovered.has(p.userData.def.name)){discovered.add(p.userData.def.name);toast('🔭 Detectado: '+p.userData.def.name);}
    if(d<190&&d<nd){nd=d;nearPlanet=p;}
    missions.forEach(m=>{if(m.type==='travel'&&m.dest===p&&d<210)completeMission(m);});});
  // luna landing
  let md=Infinity;moons.forEach(mo=>{if(!mo.alive)return;const wp=moonWorldPos(mo);const d=ship.position.distanceTo(wp)-mo.r;if(d<140&&d<md){md=d;nearMoon=mo;}});
  // warp en el sol
  // (el salto de galaxia ahora se hace pulsando E cerca del Sol)
  // objetivo / hint
  const hint=$('hint');
  if(!modalOpen&&nearPlanet&&nd<=190){const def=nearPlanet.userData.def;
    nearTarget={kind:'land',planet:nearPlanet};hint.innerHTML='Pulsa <kbd>E</kbd> para aterrizar en '+def.name;hint.classList.add('show');}
  else if(!modalOpen&&nearMoon){nearTarget={kind:'moon',planet:nearMoon.planet};hint.innerHTML='Pulsa <kbd>E</kbd> para bajar a la estación lunar';hint.classList.add('show');}
  else if(!modalOpen&&nearStation){nearTarget={kind:'station'};hint.innerHTML='Pulsa <kbd>E</kbd> para repostar gas y balas en la estación';hint.classList.add('show');}
  else if(!modalOpen&&ship.position.distanceTo(sunPos)<460){nearTarget={kind:'sun'};hint.innerHTML='Pulsa <kbd>E</kbd> para saltar a otra galaxia 🌌';hint.classList.add('show');}
  else hint.classList.remove('show');
  if(mapOpen)drawMapOn('mapCanvas','mapLegend');
}
function moonWorldPos(mo){return mo.planet.position.clone().add(mo.mesh.position);}
function warpGalaxy(){galaxy++;buildPlanets();discovered=new Set();surfVel.set(0,0,0);explode(spaceScene,ship.position.clone(),'rgba(180,220,255,1)',30,true);placeShipNearPlanet(0);
  enemies.forEach(e=>spaceScene.remove(e));enemies.length=0;enemyBullets.forEach(b=>spaceScene.remove(b));enemyBullets.length=0;
  sfx.warp();toast('🌌 ¡Saltaste a la galaxia '+galaxy+'! Nuevos planetas por descubrir.');}

/* ============================================================
   UPDATE — SUPERFICIE
   ============================================================ */
let footCD=0,surfVel=new THREE.Vector3(),vy=0,jumpY=0,jumpsLeft=0,jetFuel=100,jumpQueued=false,jetHeld=false;
function updateSurface(dt){
  if(!modalOpen){
    if(lookDX!==0){sHeading-=lookDX*0.004;lookDX=0;}
    else if(!isTouch){const mx=Math.abs(mouseX)<0.18?0:mouseX;sHeading-=mx*1.5*dt;}
    const fwd=V3(Math.sin(sHeading),0,Math.cos(sHeading)),right=V3(Math.cos(sHeading),0,-Math.sin(sHeading));
    const run=(keys['ShiftLeft']||keys['ShiftRight'])?1.7:1;let want=V3(0,0,0),pressing=false;
    if(joy.active){want.addScaledVector(fwd,joy.y);want.addScaledVector(right,joy.x);if(Math.abs(joy.x)+Math.abs(joy.y)>0.08)pressing=true;}
    if(keys['KeyW']||keys['ArrowUp']){want.add(fwd);pressing=true;}if(keys['KeyS']||keys['ArrowDown']){want.addScaledVector(fwd,-1);pressing=true;}
    if(keys['KeyA']||keys['ArrowLeft']){want.addScaledVector(right,-1);pressing=true;}if(keys['KeyD']||keys['ArrowRight']){want.add(right);pressing=true;}
    if(want.lengthSq()>1)want.normalize();
    const desiredVel=want.multiplyScalar(pressing?96*run:0);
    surfVel.lerp(desiredVel,clamp(dt*(pressing?9:13),0,1));
    if(surfVel.lengthSq()>0.04){astro.position.addScaledVector(surfVel,dt);
      const d=Math.hypot(astro.position.x,astro.position.z);if(d>GROUND_R-30){astro.position.x*=(GROUND_R-30)/d;astro.position.z*=(GROUND_R-30)/d;}}
    const sp=surfVel.length(),moving=sp>3;if(moving)walkAnim+=dt*Math.min(13,sp*0.16);
    if(jumpQueued){jumpQueued=false;if(jumpY<=0.2){vy=46;jumpsLeft=1;sfx.ui();}else if(jumpsLeft>0){vy=42;jumpsLeft--;sfx.ui();}}
    const jet=(keys['Space']||jetHeld);
    if(jet&&jumpY>0.2&&jetFuel>0){vy+=170*dt;jetFuel=Math.max(0,jetFuel-42*dt);if(Math.random()<0.6){const t=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(120,220,255,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));t.position.copy(astro.position).add(V3(0,3,0));t.scale.setScalar(rand(4,7));t.userData={vel:V3(rand(-6,6),-30,rand(-6,6)),life:.4};surfScene.add(t);particles.push(t);}}
    vy-=120*dt;jumpY+=vy*dt;if(jumpY<=0){jumpY=0;vy=0;jumpsLeft=0;}
    if(jumpY<=0)jetFuel=Math.min(100,jetFuel+30*dt);
    const bob=moving?Math.abs(Math.sin(walkAnim))*1.4:0;
    astro.rotation.y=sHeading;astro.position.y=jumpY+bob;
    if(astro.userData.legs){const air=jumpY>0.5,sw=air?0.5:(moving?0.6:0);astro.userData.legs[0].rotation.x=air?0.5:Math.sin(walkAnim)*sw;astro.userData.legs[1].rotation.x=air?0.5:-Math.sin(walkAnim)*sw;}
    if(astro.userData.arms){const sw=moving?0.5:0;astro.userData.arms[0].rotation.x=-Math.sin(walkAnim)*sw;astro.userData.arms[1].rotation.x=Math.sin(walkAnim)*sw;}
    footCD-=dt;if(shootHeld&&footCD<=0){footShoot();footCD=0.22;}
  }
  const fwd2=V3(Math.sin(sHeading),0,Math.cos(sHeading));
  camera.up.set(0,1,0);camera.position.lerp(astro.position.clone().addScaledVector(fwd2,-58).add(V3(0,40,0)),clamp(dt*6,0,1));
  camera.lookAt(astro.position.clone().add(V3(0,14,0)).addScaledVector(fwd2,20));
  // regen lenta a pie
  if(now()-P.lastHit>3000&&P.shield<P.maxShield)P.shield=clamp(P.shield+2*dt,0,P.maxShield);
  if(now()-P.lastHit>5000&&P.health<P.maxHealth)P.health=clamp(P.health+4*dt,0,P.maxHealth);
  refreshHUD();
  surfCores.forEach(c=>{c.rotation.y+=dt*2;c.position.y=6+Math.sin(now()*.002+c.userData.bob)*1.5;});
  surfNPCObjs.forEach(no=>{if(no.dead){no.obj.visible=false;no.label.visible=false;return;}no.obj.position.y=Math.sin(now()*.0015+no.idx)*0.6;
    const dx=astro.position.x-no.obj.position.x,dz=astro.position.z-no.obj.position.z;if(dx*dx+dz*dz<40000)no.obj.rotation.y=Math.atan2(dx,dz);});
  surfShip.position.y=8+Math.sin(now()*.001)*1.2;surfBeacons.forEach(b=>b.material.opacity=0.3+Math.sin(now()*.003+b.position.x)*0.15);
  biomeProps.forEach(o=>{if(o.userData&&o.userData.beast){o.userData.a+=dt*0.12;o.position.x+=Math.cos(o.userData.a)*10*dt;o.position.z+=Math.sin(o.userData.a)*10*dt;
    const d=Math.hypot(o.position.x,o.position.z);if(d>GROUND_R-60){o.position.x*=(GROUND_R-60)/d;o.position.z*=(GROUND_R-60)/d;}o.rotation.y=Math.atan2(Math.cos(o.userData.a),Math.sin(o.userData.a));o.position.y=Math.sin(now()*.002)*1.5;}});
  companions.forEach(c=>{const target=astro.position.clone().addScaledVector(V3(Math.sin(sHeading),0,Math.cos(sHeading)),-30);target.y=12+Math.sin(now()*.003)*3;c.position.lerp(target,clamp(dt*3,0,1));c.rotation.y+=dt;
    c.userData.cd=(c.userData.cd||0)-dt;let tgt=null,td=1e9;hunters.forEach(h=>{const dd=h.obj.position.distanceTo(c.position);if(dd<td){td=dd;tgt=h;}});
    if(tgt&&td<260&&c.userData.cd<=0){c.userData.cd=0.5;const dir=tgt.obj.position.clone().add(V3(0,10,0)).sub(c.position).normalize();
      const b=new THREE.Mesh(new THREE.SphereGeometry(1,8,8),new THREE.MeshBasicMaterial({color:0x22e9ff}));b.position.copy(c.position);b.userData={vel:dir.multiplyScalar(220),life:2,friend:true};
      const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(34,233,255,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));g.scale.setScalar(7);b.add(g);surfScene.add(b);footBullets.push(b);beep(700,0.06,'square',0.03,300);}});
  // núcleos
  for(let i=surfCores.length-1;i>=0;i--){const c=surfCores[i];let grab=Math.hypot(c.position.x-astro.position.x,c.position.z-astro.position.z)<14;
    if(!grab)for(const cp of companions){if(c.position.distanceTo(cp.position)<46){grab=true;break;}}
    if(grab){inv.core++;explode(surfScene,c.position,'rgba(255,210,74,1)',10);sfx.pickup();surfScene.remove(c);surfCores.splice(i,1);spawnSurfaceCore();bump('surface');storyTick('surface');refreshHUD();}}
  // cazarrecompensas si te buscan
  if(wanted>0&&hunters.length<Math.min(wanted,2)&&Math.random()<0.01)spawnHunter();
  updateHunters(dt);updateFootBullets(dt);updateParticles(surfScene,dt);
  // interacción
  nearTarget=null;let best=1e9;
  surfNPCObjs.forEach(no=>{if(no.dead)return;const d=Math.hypot(no.obj.position.x-astro.position.x,no.obj.position.z-astro.position.z);if(d<34&&d<best){best=d;nearTarget={kind:'npc',idx:no.idx};}});
  surfBuildings.forEach(b=>{if(!b.visible)return;const d=Math.hypot(b.position.x-astro.position.x,b.position.z-astro.position.z);if(d<40&&d<best){best=d;nearTarget={kind:'shop',shop:b.userData.shop};}});
  {const d=Math.hypot(surfShip.position.x-astro.position.x,surfShip.position.z-astro.position.z);if(d<46&&d<best){best=d;nearTarget={kind:'ship'};}}
  const hint=$('hint');
  if(nearTarget&&!modalOpen){const txt={npc:'hablar',shop:'entrar a la tienda',ship:'despegar al espacio'}[nearTarget.kind]||'interactuar';
    hint.innerHTML='Pulsa <kbd>E</kbd> para '+txt;hint.classList.add('show');}else hint.classList.remove('show');
}
function footShoot(){const fwd=V3(Math.sin(sHeading),0,Math.cos(sHeading));
  const b=new THREE.Mesh(new THREE.SphereGeometry(1.2,8,8),new THREE.MeshBasicMaterial({color:0xffd24a}));b.position.copy(astro.position).add(V3(0,12,0)).addScaledVector(fwd,6);
  b.userData={vel:fwd.clone().multiplyScalar(220),life:2};const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(255,210,74,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));g.scale.setScalar(8);b.add(g);
  surfScene.add(b);footBullets.push(b);sfx.blaster();}
function updateFootBullets(dt){for(let i=footBullets.length-1;i>=0;i--){const b=footBullets[i];if(b.userData.enemy)continue;
  b.position.addScaledVector(b.userData.vel,dt);b.userData.life-=dt;let hit=false;
  for(let j=hunters.length-1;j>=0;j--){const h=hunters[j];if(b.position.distanceTo(h.obj.position.clone().add(V3(0,10,0)))<10){h.hp--;explode(surfScene,b.position,'rgba(255,200,120,1)',5);hit=true;
    if(h.hp<=0){explode(surfScene,h.obj.position,'rgba(255,120,60,1)',14);sfx.boom();surfScene.remove(h.obj);hunters.splice(j,1);credits+=30;refreshHUD();}break;}}
  if(!hit&&!b.userData.friend){for(const no of surfNPCObjs){if(no.dead)continue;if(b.position.distanceTo(no.obj.position.clone().add(V3(0,10,0)))<11){
    no.dead=true;no.obj.visible=false;no.label.visible=false;explode(surfScene,no.obj.position,'rgba(255,120,60,1)',14);sfx.boom();addWanted(2,'¡Mataste a un habitante!');hit=true;break;}}}
  if(hit||b.userData.life<=0){surfScene.remove(b);footBullets.splice(i,1);}}}
function spawnHunter(){const o=makePerson(0xff5a4a,true);const a=rand(0,7);o.position.set(Math.cos(a)*300,0,Math.sin(a)*300);surfScene.add(o);
  hunters.push({obj:o,hp:4,shootCD:rand(1,2)});toast('🎯 ¡Un cazarrecompensas te busca!');}
function updateHunters(dt){hunters.forEach(h=>{const to=astro.position.clone().sub(h.obj.position);to.y=0;const d=to.length();h.obj.lookAt(astro.position.x,h.obj.position.y,astro.position.z);
  if(d>40)h.obj.position.addScaledVector(to.normalize(),40*dt);h.shootCD-=dt;
  if(h.shootCD<=0&&d<240){const dir=astro.position.clone().add(V3(0,12,0)).sub(h.obj.position.clone().add(V3(0,12,0))).normalize();
    const b=new THREE.Mesh(new THREE.SphereGeometry(1.1,8,8),new THREE.MeshBasicMaterial({color:0xff5a4a}));b.position.copy(h.obj.position).add(V3(0,12,0));b.userData={vel:dir.multiplyScalar(180),life:2.5,enemy:true};
    const g=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(255,90,74,1)'),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));g.scale.setScalar(7);b.add(g);surfScene.add(b);footBullets.push(b);h.shootCD=rand(1.2,2.2);beep(260,0.08,'sawtooth',0.03,120);}});
  // balas enemigas a pie golpean al jugador
  for(let i=footBullets.length-1;i>=0;i--){const b=footBullets[i];if(b.userData.enemy){b.position.addScaledVector(b.userData.vel,dt);b.userData.life-=dt;
    if(b.position.distanceTo(astro.position.clone().add(V3(0,12,0)))<8){damagePlayer(7);surfScene.remove(b);footBullets.splice(i,1);continue;}
    if(b.userData.life<=0){surfScene.remove(b);footBullets.splice(i,1);}}}}
function grantCompanionMesh(){const c=makePerson(0x22e9ff,true);c.scale.setScalar(0.6);c.position.copy(astro?astro.position.clone().add(V3(0,12,-30)):V3(0,12,-30));surfScene.add(c);companions.push(c);}

function updateParticles(scn,dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];if(p.parent!==scn)continue;p.position.addScaledVector(p.userData.vel,dt);p.userData.life-=dt;p.material.opacity=Math.max(0,p.userData.life);p.scale.multiplyScalar(1+dt*1.5);if(p.userData.life<=0){scn.remove(p);particles.splice(i,1);}}}
function recycle(arr,maxDist,spawnFn){for(let i=arr.length-1;i>=0;i--){if(arr[i].position.distanceTo(ship.position)>maxDist){spaceScene.remove(arr[i]);arr.splice(i,1);spawnFn(false);}}}
function applySuit(){if(!astro||!surfScene)return;const pos=astro.position.clone();surfScene.remove(astro);
  astro=makePerson(suitColor,SUIT_SKINS[suitSkin].robot,SUIT_FACES[suitFace].eye);astro.position.copy(pos);surfScene.add(astro);}
function rebuildAstro(){applySuit();sfx.ui();}

/* ============================================================
   MUERTE / REAPARICIÓN
   ============================================================ */
function die(){
  const lost=Math.floor(credits/6);credits-=lost;sfx.boom();
  if(mode===MODE.SPACE)explode(spaceScene,ship.position,'rgba(255,120,60,1)',24,true);
  // reaparecer en base del último planeta visitado
  let idx=surfPlanetIndex;if(!visited.has(PLANET_DEFS[idx].name)){const v=[...visited];idx=v.length?PLANET_DEFS.findIndex(d=>d.name===v[v.length-1]):0;if(idx<0)idx=0;}
  P.health=P.maxHealth;P.shield=P.maxShield;wanted=0;updateWanted();
  themeSurface(idx,false);astro.position.set(SHOP_DEFS[0].pos[0],0,SHOP_DEFS[0].pos[1]+30);surfVel.set(0,0,0);jumpY=0;vy=0;jetFuel=100;sHeading=0;mode=MODE.SURFACE;
  enemies.forEach(e=>spaceScene.remove(e));enemies.length=0;enemyBullets.forEach(b=>spaceScene.remove(b));enemyBullets.length=0;
  setControls();$('modeVal').textContent=PLANET_DEFS[idx].name;$('modeLabel').textContent='En tierra';toggleTouchButtons(false);
  refreshHUD();toast('💀 Caíste · reapareces en tu base de '+PLANET_DEFS[idx].name+' (-'+lost+'⬡)');saveGame(true);
}

/* ============================================================
   BUCLE / FLUJO
   ============================================================ */
function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),0.05);
  if(mode===MODE.SPACE){updateSpace(dt);renderer.render(spaceScene,camera);}
  else if(mode===MODE.SURFACE){updateSurface(dt);renderer.render(surfScene,camera);}
  else if(spaceScene){spaceScene.rotation.y+=dt*0.02;renderer.render(spaceScene,camera);}
  if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').classList.remove('show');}}
const SAVE_KEY='ee_save_v4';
function saveGame(silent){
  try{const data={credits,kills,missionsDone,galaxy,wanted,storyStep,inv:{...inv},upgrades:{...upgrades},
    ownedShips:[...ownedShips],curShip,suitColor,suitFace,suitSkin,shipColorOverride,level,xp,xpNext,visited:[...visited],discovered:[...discovered],
    health:P.health,shield:P.shield,fuel:P.fuel,story_p:STORY.map(s=>s._p||0),
    missions:missions.map(m=>({type:m.type,progress:m.progress,goal:m.goal,reward:m.reward,desc:m.desc,destName:m.dest?m.dest.userData.def.name:null}))};
    localStorage.setItem(SAVE_KEY,JSON.stringify(data));if(!silent)toast('💾 Progreso guardado');}
  catch(e){if(!silent)toast('No se pudo guardar (abre el archivo descargado para que funcione)');}
}
function hasSave(){try{return !!localStorage.getItem(SAVE_KEY);}catch(e){return false;}}
function loadGame(){
  let data;try{data=JSON.parse(localStorage.getItem(SAVE_KEY));}catch(e){data=null;}
  if(!data){toast('No hay partida guardada');return false;}
  credits=data.credits||0;kills=data.kills||0;missionsDone=data.missionsDone||0;galaxy=data.galaxy||1;wanted=data.wanted||0;storyStep=data.storyStep||0;
  Object.assign(inv,data.inv||{});Object.assign(upgrades,data.upgrades||{});
  ownedShips=new Set(data.ownedShips||[0]);curShip=data.curShip||0;suitColor=data.suitColor||0xffd24a;
  suitFace=data.suitFace||0;suitSkin=data.suitSkin||0;shipColorOverride=data.shipColorOverride||null;
  level=data.level||1;xp=data.xp||0;xpNext=data.xpNext||100;speedBoostT=0;resetPlanetDefs();
  const lv=$('levelVal');if(lv)lv.textContent=level;
  visited=new Set(data.visited||[]);discovered=new Set(data.discovered||[]);
  STORY.forEach((s,i)=>{s._p=(data.story_p&&data.story_p[i])||0;});
  recomputeStats();P.maxHealth=100;P.maxShield=stat.maxShield;P.health=clamp(data.health||100,1,P.maxHealth);P.shield=clamp(data.shield||P.maxShield,0,P.maxShield);P.fuel=clamp(data.fuel||P.maxFuel,8,P.maxFuel);P.lastHit=-9999;rebuildShipVisual();
  missions=(data.missions||[]).map(m=>{const mm={type:m.type,progress:m.progress,goal:m.goal,reward:m.reward,desc:m.desc};if(m.destName)mm.dest=planets.find(p=>p.userData.def.name===m.destName);return mm;});
  [bullets,particles,enemies,enemyBullets,companions,footBullets].forEach(arr=>{arr.forEach(o=>{const m=o.obj||o;if(m&&m.parent)m.parent.remove(m);});arr.length=0;});
  hunters.forEach(h=>{if(h.obj&&h.obj.parent)h.obj.parent.remove(h.obj);});hunters.length=0;
  moons.forEach(mo=>{mo.alive=true;mo.mesh.visible=true;});
  spaceScene.rotation.y=0;placeShipNearPlanet(0);
  refreshHUD();updateMissionUI();updateWanted();setControls();applySuit();
  $('menu').classList.add('hidden');$('gameover').classList.add('hidden');$('cross').style.display='block';
  if(isTouch){$('touchUI').style.display='block';toggleTouchButtons(true);}
  mode=MODE.SPACE;window.focus();toast('▶ Partida cargada · galaxia '+galaxy);return true;
}
function deleteSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}toast('Partida borrada');}
function startGame(){
  audioInit();
  credits=0;kills=0;missionsDone=0;visited=new Set();discovered=new Set();galaxy=1;wanted=0;storyStep=0;missions=[];
  level=1;xp=0;xpNext=100;speedBoostT=0;_missionBag=[];
  suitFace=0;suitSkin=0;shipColorOverride=null;resetPlanetDefs();
  STORY.forEach(s=>{s._p=0;});
  inv.crystal=0;inv.core=0;inv.food=1;inv.bomb=2;inv.ammo=40;ownedShips=new Set([0]);curShip=0;suitColor=0xffd24a;
  upgrades.shield=upgrades.engine=upgrades.cannon=upgrades.collector=0;recomputeStats();rebuildShipVisual();
  P.health=P.maxHealth=100;P.shield=P.maxShield=stat.maxShield;P.fuel=P.maxFuel=100;P.lastHit=-9999;
  const lv=$('levelVal');if(lv)lv.textContent=level;
  spaceScene.rotation.y=0;placeShipNearPlanet(0);
  [bullets,particles,enemies,enemyBullets,companions,footBullets].forEach(arr=>{arr.forEach(o=>{const m=o.obj||o;if(m&&m.parent)m.parent.remove(m);});arr.length=0;});
  hunters.forEach(h=>{if(h.obj&&h.obj.parent)h.obj.parent.remove(h.obj);});hunters.length=0;
  asteroids.forEach(a=>a.position.copy(randFarPos(300,1500)));crystals.forEach(c=>c.position.copy(randFarPos(300,1300)));
  moons.forEach(mo=>{mo.alive=true;mo.mesh.visible=true;});
  refreshHUD();updateMissionUI();updateWanted();setControls();applySuit();
  $('menu').classList.add('hidden');$('gameover').classList.add('hidden');$('cross').style.display='block';
  if(isTouch){$('touchUI').style.display='block';toggleTouchButtons(true);}
  mode=MODE.SPACE;window.focus();toast('★ Habla con la Capitana Vela en Aurelia para empezar la historia');saveGame(true);
}
function gameOverScreen(){ /* no usado: morir reaparece */ }
$('startBtn').onclick=startGame;$('restartBtn').onclick=startGame;
$('continueBtn').onclick=()=>{audioInit();loadGame();};
$('menuSave').onclick=()=>{saveGame(false);};
$('menuDelete').onclick=()=>{deleteSave();$('continueBtn').style.display='none';};
addEventListener('resize',()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(mapOpen)drawMapOn('mapCanvas','mapLegend');});
// compañero real (mesh) al otorgarse
const _adv=advanceStory;advanceStory=function(){const before=storyStep;_adv();if(STORY[before]&&STORY[before].companion){grantCompanionMesh&&0;}};
const _grant=grantCompanion;grantCompanion=function(){_grant();grantCompanionMesh();};

/* ===== ARRANQUE ===== */
function init(){
  if(typeof THREE==='undefined'){document.body.innerHTML='<div style="color:#fff;font-family:monospace;padding:40px;text-align:center">No se pudo cargar Three.js (necesita internet la primera vez).<br>Conéctate a internet y recarga.</div>';return;}
  clock=new THREE.Clock();camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.5,13000);
  renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
  buildSpace();buildSurface();STORY=buildStory();recomputeStats();refreshHUD();setControls();
  if(isTouch)$('touchUI').style.display='block';
  if(hasSave())$('continueBtn').style.display='inline-block';
  loop();
}
init();
</script>
</body>
</html>
