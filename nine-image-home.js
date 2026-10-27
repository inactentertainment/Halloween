/* Haunted Towne: cinematic, clickable staircase journey. The card gallery lives in the menu. */
(function(){
'use strict';
const destinations=[
['History of Halloween','./history.html',19,77],
['Ghost Stories','./story.html',31,15],
['Costumes','#costumes',55,78],
['Masks','#masks',59,22],
['Decor','#decor',63,76],
['Party Ideas','#party',68,19],
['Haunted Road','#descent',49,51],
['Movies & Trailers','#movies',77,80],
['Music','#music',88,22],
['Fun & Games','#games',85,75],
['Free Downloads','#downloads',78,18],
['Events','#events',92,79],
['About','#about',36,50]
];
home=function(){
 const links=destinations.map(([title,href,y,x])=>'<a class="ht-journey-link" href="'+href+'" style="--journey-y:'+y+'%;--journey-x:'+x+'%" data-journey="true">'+title+'</a>').join('');
 return '<section class="ht9-home ht-journey" aria-label="Explore Haunted Towne">'+
 '<div class="ht9-backdrop"><img class="ht9-art" src="./assets/haunted-home-enhanced.webp" width="1604" height="3072" fetchpriority="high" alt="Cinematic Haunted Towne mansion, carnival and a continuous spooky stairway into a lantern-lit tunnel">'+
 '<nav class="ht-journey-links" aria-label="Explore the haunted staircase">'+links+'</nav><footer class="ht-immersive-footer"><div class="ht-immersive-footer-layout"><div class="ht-immersive-footer-left"><a class="ht-immersive-footer-title" href="#home">HAUNTED <em>TOWNE</em></a><p>The Darker Side of Halloween · InAct Entertainment LLC</p></div><nav aria-label="Legal and information"><a href="#about">About</a><a href="#privacy">Privacy</a><a href="#affiliate">Affiliate Disclosure</a><a href="#terms">Terms</a></nav></div><div class="ht-immersive-footer-rule"></div><small>© 2026 InAct Entertainment LLC. Original experiences and artwork. Third-party copyrights remain with their owners.</small></footer></div></section>';
};
function journeySound(a){window.HTCinema?.horrorEffect?.(a?.getAttribute('href')==='#music'?'bell':a?.getAttribute('href')==='#descent'?'boom':'dread')}
document.addEventListener('click',function(e){
 const a=e.target.closest('.ht-journey-link');if(!a||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 e.preventDefault();journeySound(a);
 if(!reduced){a.classList.add('ht-journey-depart');document.body.classList.add('ht-journey-transition');}
 const href=a.getAttribute('href');
 window.setTimeout(function(){document.body.classList.remove('ht-journey-transition');if(href.startsWith('#')){location.hash=href.slice(1)}else{location.href=href}},reduced?0:320);
});
})();
