(()=>{'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d'),wrap=document.getElementById('gameWrap');
const play=document.getElementById('play'),help=document.getElementById('help');
document.getElementById('how').onclick=()=>help.showModal();document.getElementById('closeHelp').onclick=()=>help.close();
const keys={left:false,right:false,jump:false};let player,monster,exit,platforms,particles,elapsed,last,raf,dead,won,started=false;
function reset(){player={x:65,y:390,vx:0,vy:0,w:24,h:34,ground:false};monster={x:680,y:390,vx:0,phase:0};exit={x:900,y:355};platforms=[{x:0,y:445,w:960,h:55},{x:170,y:365,w:125,h:15},{x:350,y:305,w:120,h:15},{x:520,y:370,w:110,h:15},{x:700,y:300,w:120,h:15}];particles=[];elapsed=0;dead=false;won=false;last=0;document.getElementById('health').textContent='♥ ♥ ♥';document.getElementById('message').textContent='Find the glowing exit. Don’t let it touch you.';cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function start(){wrap.hidden=false;started=true;reset();wrap.scrollIntoView({behavior:'smooth',block:'start'})}play.onclick=start;document.getElementById('restart').onclick=reset;
function setKey(k,v){if(k in keys)keys[k]=v}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','a','d','A','D','w','W'].includes(e.key))e.preventDefault();if(['ArrowLeft','a','A'].includes(e.key))setKey('left',true);if(['ArrowRight','d','D'].includes(e.key))setKey('right',true);if(['ArrowUp',' ','w','W'].includes(e.key))setKey('jump',true);if(e.key==='r'||e.key==='R'){if(started)reset()}});
window.addEventListener('keyup',e=>{if(['ArrowLeft','a','A'].includes(e.key))setKey('left',false);if(['ArrowRight','d','D'].includes(e.key))setKey('right',false);if(['ArrowUp',' ','w','W'].includes(e.key))setKey('jump',false)});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);setKey(k,true)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>setKey(k,false)))});
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function text(t,x,y,size,c){ctx.font='900 '+size+'px Nunito';ctx.fillStyle=c;ctx.fillText(t,x,y)}
function draw(){let g=ctx.createLinearGradient(0,0,0,500);g.addColorStop(0,'#101d17');g.addColorStop(1,'#050907');ctx.fillStyle=g;ctx.fillRect(0,0,960,500);
ctx.fillStyle='#16271c';for(let i=0;i<14;i++){let x=i*83;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+22,0);ctx.lineTo(x+70,120+(i%3)*35);ctx.lineTo(x+42,170);ctx.closePath();ctx.fill()}
for(let i=0;i<60;i++){let x=(i*137)%960,y=(i*61)%430;rect(x,y,2,2,'#3d6744')}
platforms.forEach(p=>{rect(p.x,p.y,p.w,p.h,'#293c2d');rect(p.x,p.y,p.w,3,'#6d9b62');for(let x=p.x+10;x<p.x+p.w;x+=25)rect(x,p.y+6,3,5,'#18261b')});
ctx.shadowBlur=24;ctx.shadowColor='#a6ff73';rect(exit.x,exit.y,7,90,'#a6ff73');ctx.shadowBlur=0;text('EXIT',exit.x-12,exit.y-12,12,'#a6ff73');
 // stalker silhouette
ctx.save();ctx.translate(monster.x,monster.y+Math.sin(monster.phase)*3);ctx.shadowBlur=18;ctx.shadowColor='#f44b40';ctx.fillStyle='#17100f';ctx.beginPath();ctx.ellipse(0,-22,19,26,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(0,-49,15,18,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#211311';ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-12,-9);ctx.lineTo(-27,22);ctx.lineTo(-32,42);ctx.moveTo(12,-9);ctx.lineTo(27,19);ctx.lineTo(34,41);ctx.moveTo(-9,-1);ctx.lineTo(-14,30);ctx.moveTo(9,-1);ctx.lineTo(14,30);ctx.stroke();ctx.shadowBlur=0;rect(-8,-53,5,4,'#ff514a');rect(5,-53,5,4,'#ff514a');ctx.restore();
 // player
ctx.fillStyle='#b4f58d';ctx.beginPath();ctx.ellipse(player.x+12,player.y+7,10,11,0,0,Math.PI*2);ctx.fill();rect(player.x+3,player.y+16,18,17,'#77b95c');rect(player.x-2,player.y+19,6,15,'#77b95c');rect(player.x+20,player.y+19,6,15,'#77b95c');rect(player.x+4,player.y+31,6,5,'#b4f58d');rect(player.x+15,player.y+31,6,5,'#b4f58d');
if(dead||won){rect(0,0,960,500,'#020403cc');text(won?'YOU ESCAPED':'CAUGHT IN THE DARK',230,225,34,won?'#a6ff73':'#ff6258');text(won?'THE CAVES KEEP YOUR SECRET.':'THE STALKER FOUND YOU. TRY AGAIN.',280,265,15,'#e4e9e1');text('PRESS RESTART TO PLAY AGAIN',340,310,13,'#a6ff73')}
}
function update(dt){if(dead||won)return;elapsed+=dt;player.vx=(keys.right?1:0)-(keys.left?1:0);player.vx*=3.4;player.x+=player.vx;player.x=Math.max(0,Math.min(934,player.x));if(keys.jump&&player.ground){player.vy=-10.8;player.ground=false}player.vy+=24*dt;player.y+=player.vy;player.ground=false;for(const p of platforms){if(player.x+24>p.x&&player.x<p.x+p.w&&player.y+36>=p.y&&player.y+36<=p.y+18&&player.vy>=0){player.y=p.y-36;player.vy=0;player.ground=true}}
if(player.y>520){player.y=400;player.vy=0}
let dx=player.x-monster.x;monster.phase+=dt*7;monster.vx=Math.sign(dx)*(Math.abs(dx)<270?94:30);monster.x+=monster.vx*dt;monster.x=Math.max(20,Math.min(930,monster.x));if(Math.abs(dx)<27&&Math.abs(player.y-monster.y)<40){dead=true;document.getElementById('message').textContent='The stalker caught you.'}if(player.x>exit.x-15&&player.y>exit.y-35){won=true;document.getElementById('message').textContent='You escaped this sector. More caves await.'}document.getElementById('timer').textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(Math.floor(elapsed%60)).padStart(2,'0')}
function loop(t){if(!last)last=t;let dt=Math.min((t-last)/1000,.04);last=t;update(dt);draw();raf=requestAnimationFrame(loop)}
})();