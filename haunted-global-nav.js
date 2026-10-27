/* Haunted Towne universal cinematic navigation — same shell on homepage and reading pages. */
(function(){
'use strict';
const destinations=[
['Home','./index.html#home'],['About','./index.html#about'],
['The History of Halloween','./history.html'],['Ghost Stories','./story.html'],
['Travel Along the Haunted Road','./index.html#descent'],['Costumes','./index.html#costumes'],
['Masks','./index.html#masks'],['Decor','./index.html#decor'],
['Party Ideas','./index.html#party'],['Movies & Trailers','./index.html#movies'],
['Music','./index.html#music'],['Fun & Games','./index.html#games'],
['Free Downloads','./index.html#downloads'],['Events','./index.html#events']
];
const root=document.createElement('div');root.id='ht-global-navigation';
root.innerHTML='<header class="ht-global-bar"><a class="ht-global-logo" href="./index.html#home" aria-label="Haunted Towne — home"><span>HAUNTED</span> <em>TOWNE</em></a><div class="ht-global-actions"><button class="ht-atmosphere" type="button" aria-pressed="false" title="Toggle atmospheric sound">♬ <span>Atmosphere</span></button><button class="ht-global-menu-toggle" type="button" aria-controls="ht-global-menu" aria-expanded="false" aria-label="Open destinations"><i></i><i></i></button></div></header><div id="ht-global-menu" class="ht-global-menu" hidden><div class="ht-global-poster"><img src="./assets/haunted-menu.jpg" width="1024" height="1536" alt="Haunted Towne: Choose your destination if you dare. Fourteen illustrated red-glowing destination cards." loading="lazy"><div class="ht-global-targets">'+destinations.map((d,i)=>'<a class="ht-global-target" style="--n:'+i+'" href="'+d[1]+'" aria-label="'+d[0]+'" title="'+d[0]+'"><span class="ht-visually-hidden">'+d[0]+'</span></a>').join('')+'</div></div></div>';
let audio,enabled=false;
function tone(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audio=audio||new C();audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(190,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(63,audio.currentTime+.28);gain.gain.setValueAtTime(.0001,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.09,audio.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.38);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.4);}catch(e){}}
function setup(){if(document.getElementById('ht-global-navigation'))return;document.body.insertBefore(root,document.body.firstChild);const menu=root.querySelector('#ht-global-menu'),toggle=root.querySelector('.ht-global-menu-toggle');const setOpen=v=>{menu.hidden=!v;toggle.setAttribute('aria-expanded',String(v));toggle.setAttribute('aria-label',v?'Close destinations':'Open destinations');document.body.classList.toggle('ht-global-menu-open',v)};
toggle.addEventListener('click',()=>{setOpen(menu.hidden);if(enabled)tone()});
root.querySelector('.ht-atmosphere').addEventListener('click',e=>{enabled=!enabled;e.currentTarget.setAttribute('aria-pressed',String(enabled));e.currentTarget.title=enabled?'Atmospheric sounds enabled on menu selection':'Atmospheric sounds muted';if(enabled)tone()});
menu.addEventListener('click',e=>{const a=e.target.closest('.ht-global-target');if(!a)return;if(enabled)tone();setOpen(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setOpen(false);toggle.focus()}});
window.addEventListener('hashchange',()=>setOpen(false));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();