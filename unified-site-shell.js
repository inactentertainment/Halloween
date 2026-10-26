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
 const videos=[
 ['Michael Jackson','Thriller','sOnqjkJTMaA','Official 4K music video'],
 ['Bobby “Boris” Pickett','Monster Mash','bRLML36HnzU','Original recording'],
 ['Ray Parker Jr.','Ghostbusters','Fe93CLbHjxQ','Official music video'],
 ['Rockwell','Somebody’s Watching Me','7YvAYIJSSZY','Music video'],
 ['Danny Elfman','This Is Halloween','ZVuToMilP0A','The Nightmare Before Christmas'],
 ['Warren Zevon','Werewolves of London','qae25976UgA','Classic Halloween favorite']
 ];
 const featured=videos[0];
 const videosHTML=videos.map((v,i)=>'<button type="button" class="ht-song-card" data-ht-song="'+i+'" aria-label="Play '+v[1]+' by '+v[0]+'"><img loading="lazy" src="https://i.ytimg.com/vi/'+v[2]+'/hqdefault.jpg" alt="Video thumbnail for '+v[1]+'" onerror="this.style.display='+"'none'"+'"><span class="ht-song-title">'+v[1]+'</span><small>'+v[0]+'</small></button>').join('');
 return '<section class="section ht-music-page"><div class="wrap"><p class="eyebrow">THE HAUNTED SOUNDTRACK</p><h1>Halloween Music & Videos</h1><p>Choose a video below to watch it here. Playback depends on the publisher’s YouTube embedding permissions.</p><div class="ht-music-cats"><button type="button" data-ht-filter="all" aria-pressed="true">All Videos</button><button type="button" data-ht-filter="classics" aria-pressed="false">Classics</button><button type="button" data-ht-filter="soundtracks" aria-pressed="false">Soundtracks</button></div><div class="ht-video-feature"><div id="ht-music-player" class="ht-video-embed"><button type="button" class="ht-video-poster" data-ht-song="0" aria-label="Play Thriller here"><img src="https://i.ytimg.com/vi/'+featured[2]+'/maxresdefault.jpg" alt="Michael Jackson Thriller official video thumbnail"><span>▶ Play Thriller</span></button></div><h2 id="ht-playing-title">Michael Jackson — Thriller</h2><p id="ht-video-help">Select Play to start. If the rights holder blocks embedding, the player will explain that playback is unavailable.</p></div><div class="ht-song-grid">'+videosHTML+'</div></div></section>';
}
function bindMusic(){
 const wrap=document.querySelector('.ht-music-page');if(!wrap)return;
 const titles=[['Michael Jackson','Thriller','sOnqjkJTMaA'],['Bobby “Boris” Pickett','Monster Mash','bRLML36HnzU'],['Ray Parker Jr.','Ghostbusters','Fe93CLbHjxQ'],['Rockwell','Somebody’s Watching Me','7YvAYIJSSZY'],['Danny Elfman','This Is Halloween','ZVuToMilP0A'],['Warren Zevon','Werewolves of London','qae25976UgA']];
 wrap.addEventListener('click',e=>{
 const btn=e.target.closest('[data-ht-song]');
 if(btn){
 const item=titles[Number(btn.dataset.htSong)];if(!item)return;
 const player=wrap.querySelector('#ht-music-player');player.replaceChildren();
 const frame=document.createElement('iframe');frame.title=item[0]+' — '+item[1];frame.src='https://www.youtube-nocookie.com/embed/'+item[2]+'?autoplay=1&rel=0';frame.allow='accelerometer;autoplay;encrypted-media;picture-in-picture;web-share';frame.allowFullscreen=true;frame.loading='eager';player.appendChild(frame);
 wrap.querySelector('#ht-playing-title').textContent=item[0]+' — '+item[1];return;
 }
 const filter=e.target.closest('[data-ht-filter]');if(filter){
 wrap.querySelectorAll('[data-ht-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===filter)));
 wrap.querySelectorAll('.ht-song-card').forEach((x,i)=>x.hidden=filter.dataset.htFilter==='soundtracks'?![2,4].includes(i):filter.dataset.htFilter==='classics'?![0,1,3,5].includes(i):false);
 }
 });
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
  return '<div class="ht-costume-menu"><a href="#costumes">'+text+'</a><div class="ht-costume-sub" id="ht-costume-sub">'+costumes.map((name,i)=>'<a href="#shop-guide/costumes/'+i+'">'+name+(i===4?'':' Costumes')+'</a>').join('')+'</div></div>';
 }).join('');
 nav.innerHTML='<a class="ht-shell-brand" href="./index.html#home" aria-label="Haunted Towne home"><strong>HAUNTED</strong> <em>TOWNE</em></a>'+items;
 // The costume label is a live link; hover and keyboard focus open its submenu.
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
  document.getElementById('content').innerHTML=music();bindMusic();
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
