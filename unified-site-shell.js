/* Haunted Towne site shell — single canonical homepage, unified navigation, music archive */
(function(){
'use strict';
const mainLinks=[
 ['home','⌂','Home','#home'],
 ['history','▤','The History of Halloween','./history.html'],
 ['story','☠','Ghost Story','./story.html'],
 ['movies','▣','Movies','#movies'],
 ['music','♫','Music','#music'],
 ['books','▥','Books','#books'],
 ['costumes','♜','Costumes','#costumes'],
 ['masks','☷','Masks','#masks'],
 ['decor','♛','Decor','#decor'],
 ['games','♠','Fun & Games','#games'],
 ['downloads','↓','Free Downloads','#downloads'],
 ['events','⚑','Events','#events'],
 ['about','⋮','About','#about']
];
const costumes=['Men','Women','Boys','Girls','Groups & Couples'];
const metadata=[['Michael Jackson','Thriller','Michael Jackson Thriller official music video','The landmark 1983 Halloween music video.'],['Bobby Pickett','Monster Mash','Bobby Pickett Monster Mash official','A novelty-horror dance classic.'],['Rockwell','Somebody’s Watching Me','Rockwell Somebodys Watching Me official','Paranoia set to an unforgettable hook.'],['Ray Parker Jr.','Ghostbusters','Ray Parker Jr Ghostbusters official music video','The supernatural comedy anthem.'],['John Carpenter','Halloween Theme','John Carpenter Halloween 1978 theme official','The chilling minimalist piano theme.'],['Danny Elfman','This Is Halloween','This Is Halloween Nightmare Before Christmas official','A theatrical Halloween favorite.'],['The Cranberries','Zombie','The Cranberries Zombie official music video','Dark alternative rock, included for atmosphere rather than as a Halloween song.'],['AC/DC','Highway to Hell','ACDC Highway to Hell official music video','A hard-rock selection for haunted playlists.'],['Screamin’ Jay Hawkins','I Put a Spell on You','Screamin Jay Hawkins I Put a Spell on You','A theatrical early rock-and-roll classic.'],['Warren Zevon','Werewolves of London','Warren Zevon Werewolves of London official','A witty supernatural rock favorite.'],['Bauhaus','Bela Lugosi’s Dead','Bauhaus Bela Lugosis Dead official','Atmospheric gothic rock.'],['The Misfits','Halloween','Misfits Halloween song official','Horror-punk essential.']];
function music(){
 const q=x=>'https://www.youtube.com/results?search_query='+encodeURIComponent(x);
 const songs=metadata.map((m,i)=>'<article class="ht-music-item"><span class="ht-track-no">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+m[1]+'</h3><p>'+m[0]+' · '+m[3]+'</p></div><a class="button-outline" target="_blank" rel="noopener noreferrer" href="'+q(m[2])+'">Find video ↗</a></article>').join('');
 return '<section class="section ht-music-page"><div class="wrap"><p class="eyebrow">THE HAUNTED SOUNDTRACK</p><h1>Halloween Music & Videos</h1><p>Explore haunting music, cinematic themes and Halloween favorites. Videos open only when selected, and availability is controlled by their publishers.</p><div class="ht-music-feature"><div class="ht-music-art">♫</div><div><p class="eyebrow">FEATURED MUSIC VIDEO</p><h2>Michael Jackson — Thriller</h2><p>The legendary short-film-inspired music video anchors our Halloween collection. Watch on the official YouTube source when available.</p><a class="button" target="_blank" rel="noopener noreferrer" href="'+q('Michael Jackson Thriller official music video Michael Jackson')+'">Watch Thriller on YouTube ↗</a></div></div><h2>The Haunted Playlist</h2><div class="ht-music-list">'+songs+'</div></div></section>';
}
const canonicalHome=home;
const baseNavigate=navigate;
const baseHeader=header;
header=function(){
 baseHeader();
 const nav=document.getElementById('main-nav');
 if(!nav)return;
 const route=view().split('/')[0];
 let items=mainLinks.map(([id,ico,label,href])=>{
  const text='<span class="ht-nav-icon" aria-hidden="true">'+ico+'</span><span>'+label+'</span>';
  if(id!=='costumes')return '<a href="'+href+'"'+(route===id?' class="active" aria-current="page"':'')+'>'+text+'</a>';
  return '<div class="ht-costume-menu"><a href="#costumes">'+text+'</a><button type="button" class="ht-costume-expand" aria-label="Show costume categories" aria-expanded="false" aria-controls="ht-costume-sub">⌄</button><div class="ht-costume-sub" id="ht-costume-sub">'+costumes.map((name,i)=>'<a href="#shop-guide/costumes/'+i+'">'+name+(i===4?'':' Costumes')+'</a>').join('')+'</div></div>';
 }).join('');
 nav.innerHTML='<a class="ht-shell-brand" href="./index.html#home" aria-label="Haunted Towne home"><strong>HAUNTED</strong> <em>TOWNE</em></a>'+items;
 const menu=nav.querySelector('.ht-costume-menu'),btn=nav.querySelector('.ht-costume-expand');
 if(btn){
 btn.onclick=function(e){e.preventDefault();const opened=menu.classList.toggle('expanded');btn.setAttribute('aria-expanded',String(opened));};
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('expanded');btn.setAttribute('aria-expanded','false');btn.focus();}});
 }
 const top=document.getElementById('header');top.classList.add('ht-universal-header');
 const outer=document.querySelector('#header .bar');if(outer)outer.classList.add('ht-universal-bar');
 const toggle=document.getElementById('nav-toggle');if(toggle){
 toggle.textContent='☰';toggle.setAttribute('aria-label','Open navigation');toggle.setAttribute('aria-controls','main-nav');
 toggle.onclick=()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));};
 }
 // Active destination still visible even when header rerenders on hash change.
};
footer=function(){
 const e=document.getElementById('footer');if(!e)return;
 e.innerHTML='<footer class="ht-global-footer"><div class="wrap ht-global-foot-inner"><div><a class="ht-foot-title" href="./index.html#home"><span>HAUNTED</span> <em>TOWNE</em></a><p>The Darker Side of Halloween · InAct Entertainment LLC</p></div><nav aria-label="Legal and information"><a href="#about">About</a><a href="#privacy">Privacy</a><a href="#affiliate">Affiliate Disclosure</a><a href="#terms">Terms</a></nav></div><p class="ht-global-foot-copy">© '+new Date().getFullYear()+' InAct Entertainment LLC. Original experiences and artwork. Third-party copyrights remain with their owners.</p></footer>';
};
navigate=function(scroll=true){
 // Canonical home always uses final-home-navigation.js; no historical home template.
 if(view()==='music'){
  header();footer();
  document.getElementById('content').innerHTML=music();
  document.body.classList.remove('ht-final-home-route','ht-on-approved-home');
  document.title='Halloween Music & Videos | Haunted Towne';
  if(scroll)window.scrollTo(0,0);
  return;
 }
 baseNavigate(scroll);
 if(view()==='home'){
   const content=document.getElementById('content');
   // Final image page contains only the canonical approved art and interactive overlays.
   if(content&&!content.querySelector('.ht-final-home')&&!content.querySelector('.ht9-home'))content.innerHTML=home();
 }
 document.body.classList.toggle('ht-final-home-route',view()==='home');
 const elem=document.getElementById('header');if(elem)elem.classList.add('ht-universal-header');
};
window.addEventListener('pageshow',function(){if(location.hash==='#home'||!location.hash)navigate(false)});
})();
