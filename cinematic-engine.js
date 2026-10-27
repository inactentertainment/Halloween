/* Haunted Towne cinematic engine: native CSS, Web Audio API and local-only memory. No dependencies. */
(function(){
'use strict';
const KEY='ht-cinema-v1',MEM='ht-cinema-events-v1';
const defaults={lens:true,grain:true,sound:false,intensity:1};
let prefs={...defaults};try{prefs={...prefs,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let ctx=null,ambience=null,pan=null,output=null,flashTimer=0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs))}catch{}}
function history(){try{return JSON.parse(localStorage.getItem(MEM)||'{"interactions":0,"symbols":{},"last":""}')}catch{return{interactions:0,symbols:{},last:''}}}
function record(id){const h=history();h.interactions=Math.min(10000,(h.interactions||0)+1);h.symbols[id]=Math.min(500,(h.symbols[id]||0)+1);h.last=id;try{localStorage.setItem(MEM,JSON.stringify(h))}catch{}return h}
function context(){if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();}if(ctx.state==='suspended')ctx.resume();return ctx}
function tone(freq=105,x=.5,length=.33){if(!prefs.sound)return;try{const c=context();if(!c)return;const now=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(42,freq*.52),now+length);const p=c.createStereoPanner?.();g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.03,now+.025);g.gain.exponentialRampToValueAtTime(.0001,now+length);o.connect(p||g);if(p){p.pan.value=Math.max(-1,Math.min(1,x*2-1));p.connect(g);}g.connect(c.destination);o.start(now);o.stop(now+length+.01);}catch{}}
let heartbeatTimer=null;
function heartbeatBeat(c,at,f=64,amp=.022){const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,at);o.frequency.exponentialRampToValueAtTime(37,at+.19);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(amp,at+.018);g.gain.exponentialRampToValueAtTime(.0001,at+.22);o.connect(g);g.connect(c.destination);o.start(at);o.stop(at+.23)}
function stopAmbient(){if(heartbeatTimer!==null){clearInterval(heartbeatTimer);heartbeatTimer=null;}try{ambience?.stop()}catch{}ambience=null;try{output?.disconnect();pan?.disconnect()}catch{}output=null;pan=null}
function startAmbient(){stopAmbient();if(!prefs.sound)return;try{const c=context();if(!c)return;const pair=()=>{if(!prefs.sound||c.state==='closed')return;let t=c.currentTime+.02;heartbeatBeat(c,t,65,.018);heartbeatBeat(c,t+.32,50,.014)};pair();heartbeatTimer=setInterval(pair,1250)}catch{}}
function horrorEffect(name){if(!prefs.sound)return;try{const c=context(),t=c.currentTime+.01;const hit=(offset,f,amp,duration=.38)=>{const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(f,t+offset);o.frequency.exponentialRampToValueAtTime(Math.max(25,f*.32),t+offset+duration);g.gain.setValueAtTime(.0001,t+offset);g.gain.exponentialRampToValueAtTime(amp,t+offset+.014);g.gain.exponentialRampToValueAtTime(.0001,t+offset+duration);o.connect(g);g.connect(c.destination);o.start(t+offset);o.stop(t+offset+duration+.01)};switch(name){case 'heartbeat':hit(0,66,.065,.22);hit(.3,51,.055,.25);break;case 'bell':hit(0,470,.037,.8);hit(0,693,.025,.65);hit(0,994,.012,.5);break;case 'growl':hit(0,95,.05,.75);hit(.08,48,.04,.7);break;case 'sting':hit(0,196,.045,.55);hit(0,207,.045,.55);hit(0,292,.035,.53);break;case 'dread':hit(0,540,.06,1);hit(.25,49,.04,.8);break;case 'boom':hit(0,67,.055,.2);hit(.27,49,.06,.23);hit(.58,105,.09,.55);break;default:hit(0,125,.075,.58);hit(.07,44,.045,.65)}}catch{}}
function apply(){document.documentElement.classList.toggle('ht-film-lens',prefs.lens);document.documentElement.classList.toggle('ht-film-grain',prefs.lens&&prefs.grain&&!reduced.matches);document.documentElement.dataset.htCinemaIntensity=String(prefs.intensity);document.documentElement.classList.toggle('ht-sound-active',prefs.sound);const lens=document.getElementById('ht-cinema-lens'),fx=document.getElementById('ht-cinema-fx');if(lens)lens.setAttribute('aria-pressed',String(prefs.lens));if(fx)fx.setAttribute('aria-pressed',String(prefs.sound));}
function glitch(node){if(reduced.matches||!node)return;node.classList.remove('ht-cursed-pulse');void node.offsetWidth;node.classList.add('ht-cursed-pulse');setTimeout(()=>node.classList.remove('ht-cursed-pulse'),430)}
function typewriter(el,text,onEnd){if(!el)return;const value=String(text||'');el.textContent='';if(reduced.matches){el.textContent=value;onEnd?.();return}let i=0,delay=18,done=false;const skip=()=>{done=true;el.textContent=value;onEnd?.()};el.addEventListener('click',skip,{once:true});function next(){if(done)return;i=Math.min(value.length,i+2);el.textContent=value.slice(0,i);if(i>=value.length){done=true;onEnd?.();return}const chr=value[i-1];setTimeout(next,/[,.;!?]/.test(chr)?190:delay)}next()}
function setup(){if(document.getElementById('ht-cinema-toggle'))return;const veil=document.createElement('div');veil.id='ht-cinema-overlay';veil.setAttribute('aria-hidden','true');document.body.appendChild(veil);
const ui=document.createElement('div');ui.id='ht-cinema-controls';ui.innerHTML='<button type="button" id="ht-cinema-toggle" aria-expanded="false" aria-controls="ht-cinema-options" title="Atmosphere settings" aria-label="Atmosphere settings"><span class="ht-sound-bars" aria-hidden="true"><i></i><i></i><i></i></span></button><div id="ht-cinema-options" hidden><button type="button" id="ht-cinema-lens">Lights off</button><button type="button" id="ht-cinema-fx">Sound off</button><button type="button" id="ht-cinema-reset">Reset site effects history</button><p>Clears only effects history; story and game progress remain.</p></div>';(document.getElementById('ht-cinema-mount')||document.body).appendChild(ui);
const toggle=ui.querySelector('#ht-cinema-toggle'),options=ui.querySelector('#ht-cinema-options');toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden))};
ui.querySelector('#ht-cinema-lens').onclick=()=>{prefs.lens=!prefs.lens;save();render()};
ui.querySelector('#ht-cinema-fx').onclick=()=>{prefs.sound=!prefs.sound;save();prefs.sound?startAmbient():stopAmbient();render()};
ui.querySelector('#ht-cinema-reset').onclick=()=>{try{localStorage.removeItem(MEM)}catch{};ui.querySelector('#ht-cinema-reset').textContent='Memory cleared'};
function render(){apply();ui.querySelector('#ht-cinema-lens').textContent=prefs.lens?'Lights on':'Lights off';ui.querySelector('#ht-cinema-fx').textContent=prefs.sound?'Sound on':'Sound off'}
render();
document.addEventListener('pointermove',e=>{if(!pan)return;const x=e.clientX/Math.max(1,innerWidth);try{pan.pan.setTargetAtTime(x*2-1,ctx.currentTime,.12)}catch{}},{passive:true});
document.addEventListener('click',e=>{const target=e.target.closest('[data-cursed-object]');if(!target)return;const id=target.dataset.cursedObject;record(id);glitch(target);tone(115,e.clientX/Math.max(1,innerWidth));});
// Browsers require a fresh gesture to resume sound after a full page navigation.
if(prefs.sound){const resumeAmbient=()=>{if(prefs.sound&&heartbeatTimer===null)startAmbient()};document.addEventListener('pointerdown',resumeAmbient,{once:true});document.addEventListener('keydown',resumeAmbient,{once:true})}
window.addEventListener('pagehide',stopAmbient);
reduced.addEventListener?.('change',render);
}
window.HTCinema={record,history,tone,horrorEffect,glitch,typewriter,preferences:prefs};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
