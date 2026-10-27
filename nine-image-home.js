/* Haunted Towne: cinematic, clickable staircase journey. The card gallery lives in the menu. */
(function(){
'use strict';
const destinations=[
['The History of Halloween','./history.html',46,48],
['Ghost Stories','./story.html',50,16],
['Costumes','#costumes',55,78],
['Masks','#masks',59,22],
['Decor','#decor',63,76],
['Party Ideas','#party',68,19],
['Travel Along the Haunted Road','#descent',72,51],
['Movies & Trailers','#movies',77,80],
['Music','#music',81,19],
['Fun & Games','#games',85,75],
['Free Downloads','#downloads',83,25],
['Events','#events',86,73],
['About','#about',87,50]
];
home=function(){
 const links=destinations.map(([title,href,y,x])=>'<a class="ht-journey-link" href="'+href+'" style="--journey-y:'+y+'%;--journey-x:'+x+'%" data-journey="true">'+title+'</a>').join('');
 return '<section class="ht9-home ht-journey" aria-label="Explore Haunted Towne">'+
 '<div class="ht9-backdrop"><img class="ht9-art" src="./assets/haunted-new-home.webp" width="802" height="1536" fetchpriority="high" alt="Cinematic Haunted Towne mansion, carnival and a continuous spooky stairway into a lantern-lit tunnel">'+
 '<nav class="ht-journey-links" aria-label="Explore the haunted staircase">'+links+'</nav><footer class="ht-immersive-footer"><div class="ht-immersive-footer-title">HAUNTED <em>TOWNE</em></div><p>THE DARKER SIDE OF HALLOWEEN</p><nav aria-label="Legal and information"><a href="#about">About</a><a href="#privacy">Privacy</a><a href="#affiliate">Affiliate Disclosure</a><a href="#terms">Terms</a></nav><div class="ht-immersive-footer-rule"></div><small>© 2026 InAct Entertainment LLC. All rights reserved.</small></footer></div></section>';
};
function journeySound(){
 if(document.documentElement.dataset.htJourneySound==='off')return;
 try{
 const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
 const ctx=window.__htJourneyAudio||(window.__htJourneyAudio=new Context());ctx.resume();
 const now=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type='triangle';osc.frequency.setValueAtTime(380,now);osc.frequency.exponentialRampToValueAtTime(85,now+.33);
 gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.08,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.42);
 osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+.45);
 }catch(e){}
}
document.addEventListener('click',function(e){
 const a=e.target.closest('.ht-journey-link');if(!a||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 e.preventDefault();journeySound();
 if(!reduced){a.classList.add('ht-journey-depart');document.body.classList.add('ht-journey-transition');}
 const href=a.getAttribute('href');
 window.setTimeout(function(){document.body.classList.remove('ht-journey-transition');if(href.startsWith('#')){location.hash=href.slice(1)}else{location.href=href}},reduced?0:320);
});
})();
