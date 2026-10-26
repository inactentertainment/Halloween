/* Real navigation remains in #header. Artwork is decorative with only eight genuine card links.
   Designed to match approved background without the image pretending to be a UI. */
(function(){
'use strict';
const art="./assets/haunted-towne-final.webp";
const links=[
 ["Ghost Stories","./story.html"],["Movies & Trailers","#movies"],["Horror Books","#books"],
 ["Costumes","#costumes"],["Masks","#masks"],["Decor","#decor"],
 ["Fun & Games","#games"],["Free Downloads","#downloads"]
];
const previousHome=home;
home=function(){
 const cards=links.map((x,i)=>'<a class="ht-photo-hotspot ht-photo-card ht-card-'+i+'" href="'+x[1]+'" aria-label="Open '+x[0]+'"><span>'+x[0]+'</span></a>').join('');
 const mobile=links.map((x,i)=>'<a class="ht-mobile-photo-card ht-mpc-'+i+'" href="'+x[1]+'"><span>'+x[0]+'</span></a>').join('');
 return '<div class="ht-final-home">'+
 '<section class="ht-final-art-scene" aria-label="Haunted Towne cinematic entrance">'+
 '<img class="ht-final-art" src="'+art+'" width="1536" height="1024" fetchpriority="high" decoding="async" alt="Terrifying haunted Victorian mansion, reaching ghost, night carnival, eight horror destinations and an underground burial descent">'+
 '<nav class="ht-photo-hotspots" aria-label="Illustrated destination links">'+cards+'</nav>'+
 '<div class="ht-live-descent"><h2>DESCEND DEEPER INTO THE NIGHTMARE</h2><a href="#descent" class="ht-live-arrow" aria-label="Enter the nine-chapter haunted descent"><span aria-hidden="true">⌄</span><small>ENTER THE ABYSS</small></a></div>'+
 '<a class="ht-underground-link" href="#descent" aria-label="Explore the haunted road beneath the town"></a>'+
 '</section><nav class="ht-mobile-photo-grid" aria-label="Horror destinations">'+mobile+'</nav>'+
 '<section class="ht-final-more"><div class="wrap"><p class="eyebrow">THE HORROR CONTINUES</p><h2>Stories, cinema, curiosities & nightmares</h2><p>Enter the interactive ghost story, trace the history of Halloween, explore horror favorites, or descend to the nine connected locations beneath Haunted Towne.</p><div class="actions"><a class="button" href="./story.html">Enter the Ghost Story</a><a class="button-outline" href="./history.html">Halloween History</a><a class="button-outline" href="#descent">The Haunted Road</a></div></div></section></div>';
};
const oldNavigate=navigate;
navigate=function(scroll=true){
 oldNavigate(scroll);
 document.body.classList.toggle('ht-final-home-route',view()==='home');
};
})();
