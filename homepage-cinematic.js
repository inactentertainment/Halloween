/* Cinematic homepage: image reference translated into working, accessible browser elements. */
(function(){
'use strict';
const tileData=[
 ['Ghost Stories','./story.html','☠','ghost','Enter nine chapters of interactive horror'],
 ['Movies & Trailers','#movies','🎞','movies','Browse 100 horror movies'],
 ['Horror Books','#books','▤','books','Explore 100 horror books'],
 ['Costumes','#costumes','♜','costumes','Costume categories and horror icons'],
 ['Masks','#masks','☠','masks','Creature masks and horror collectibles'],
 ['Decor','#decor','♛','decor','Animatronics and haunted displays'],
 ['Fun & Games','#games','✧','games','Interactive Halloween games'],
 ['Free Downloads','#downloads','↓','downloads','Free Halloween printable collections']
];
const urls={ghost:'./story.html',movies:'#movies',books:'#books',costumes:'#costumes',masks:'#masks',decor:'#decor',games:'#games',downloads:'#downloads'};
const previousHome=home;
home=function(){
 const tiles=tileData.map(([title,href,symbol,type,description],i)=>'<a class="ht-visual-tile ht-tile-'+type+'" href="'+href+'" aria-label="'+description+'"><span class="ht-tile-graphic" aria-hidden="true">'+symbol+'</span><span class="ht-tile-name">'+title+'</span></a>').join('');
 return '<section class="ht-cover-world" aria-label="Welcome to Haunted Towne"><div class="ht-hero-scene"><div class="ht-hero-shadow"></div><div class="wrap ht-hero-layout"><div class="ht-haunting-left"><span class="ht-fright-eyes" aria-hidden="true">◉ ◉</span><p>ENTER AT<br>YOUR OWN RISK</p></div><div class="ht-hero-message"><p class="ht-hero-overline">WELCOME TO</p><h1>HAUNTED TOWNE</h1><p>Cinematic Horror for Those<br>Who Never Outgrew Halloween</p><div class="ht-hero-action"><a href="./story.html">ENTER THE NIGHTMARE</a></div></div><div class="ht-hero-carnival"><span>☠</span><p>CARNIVAL OF<br>THE DAMNED</p></div></div></div>'+
 '<nav class="ht-home-tiles wrap" aria-label="Haunted Towne destinations">'+tiles+'</nav>'+
 '<div class="ht-descent-invite"><h2>DESCEND DEEPER INTO THE NIGHTMARE</h2><a href="#descent" class="ht-descent-arrow" aria-label="Descend into the nightmare">⌄<span>Enter the abyss</span></a></div>'+
 '<a class="ht-descent-preview" href="#descent" aria-label="Follow the descent beneath Haunted Towne"><img src="./assets/scene-descent.svg" alt="Blood-red underground passage leading into the nightmare"><span>THE DESCENT BEGINS HERE</span></a></section>'+
 '<section class="ht-home-after"><div class="wrap"><p class="eyebrow">Beyond the gates</p><h2>Choose how far you dare to go</h2><p>Explore the original interactive ghost story, real Halloween history, films, books, and haunted attractions. All controls work without accounts, and optional audio stays off until enabled.</p><div class="actions"><a class="button" href="./history.html">The History of Halloween</a><a class="button-outline" href="./story.html">The Thirteen Doors</a><a class="button-outline" href="#shop">Explore the Haunted Marketplace</a></div></div></section>';
};
const oldHeader=header;
header=function(){
 oldHeader();
 const host=document.getElementById('header'),nav=document.getElementById('main-nav');
 if(!host||!nav)return;
 host.classList.add('ht-site-header');
 const bar=host.querySelector('.bar-inner');if(!bar)return;
 const brand=bar.querySelector('.brand');
 if(brand){brand.innerHTML='<span class="ht-brand-main">HAUNTED <em>TOWNE</em></span><small>THE DARKER SIDE OF HALLOWEEN</small>';brand.setAttribute('aria-label','Haunted Towne home');}
 const main=host.querySelector('.bar');if(main){
  let top=host.querySelector('.ht-toprail');
  if(!top){top=document.createElement('div');top.className='ht-toprail';top.innerHTML='<span>STORIES <b>•</b> MOVIES <b>•</b> GAMES <b>•</b> SHOP <b>•</b> DOWNLOADS</span>';host.insertBefore(top,main);}
 }
  // Keep all available destinations reachable even when the mobile menu is collapsed.
 const menuButton=document.getElementById('nav-toggle');if(menuButton)menuButton.setAttribute('aria-label','Open or close the main navigation');
};
const originalNavigate=navigate;
navigate=function(scroll=true){
 const route=view();
 if(route==='descent')document.documentElement.classList.add('ht-descending');else document.documentElement.classList.remove('ht-descending');
 originalNavigate(scroll);
};
})();
