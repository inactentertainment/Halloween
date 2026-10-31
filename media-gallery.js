/* Haunted Towne – film and book visual galleries, Amazon discovery and responsible trailers. */
'use strict';
const HT_TRAILERS={
 "Late Night with the Devil|2023":"cvt-mauboTc",
 "Sinister|2012":"apghx7q9oeY",
 "The Conjuring 2|2016":"A5PaKL70hcI",
 "The Nun II|2023":"QF-oyCwaArU",
 "Oddity|2024":"tLNDvnv8B3A",
 "Train to Busan|2016":"4qm59Rcq1Fw",
  "Halloween|2018":"ek1ePFp-nBI",
  "Halloween Ends|2022":"i_mAWKyfj6c",
  "The Invisible Man|2020":"WO_FJdiY9dA",
  "Smile|2022":"BcDK7lkzzsU",
  "The Babadook|2014":"jWbHo2toQOk",
  "It Follows|2014":"Ymoh5SIqgtw",
  "Final Destination 5|2011":"g7V84i92H4A",
  "Sinners|2025":"7joulECTx_U",
  "A Quiet Place Part II|2021":"BpdDN9d9Jio",
  "The Fly|1986":"fj1SHpBsY7w",
  "The Final Destination|2009":"acQyrwQyCOk",
  "Final Destination 3|2006":"ectjqGg92M8",
  "Final Destination 2|2003":"Rvajfn-S3EI",
  "Final Destination|2000":"8CRuNc2i3pw",
  "Resident Evil|2026":"mNd1gb19A-c",
  "Get Out|2017":"AHEl7Pji0f8",
  "Hereditary|2018":"V6wWKNij_1M",
  "Midsommar|2019":"1Vnghdsjmd0",
  "Nope|2022":"In8fuzj3gck",
  "The Witch|2015":"iQXmlf3Sefg",
  "A Quiet Place|2018":"WR7cc5t7tv8",
  "The Substance|2024":"B1B3HZRHpEw",
  "Weapons|2025":"QKHySfXqN0I",
  "Talk to Me|2023":"aLAKJu9aJys",
  "Barbarian|2022":"Dr89pmKrqkI",
  "Smile 2|2024":"0HY6QFlBzUY",
  "The Exorcist|1973":"BU2eYAO31Cc",
  "The Thing|1982":"ySvzHdtCiWE",
  "Halloween|1978":"xHuOtLTQ_1I",
  "Scream|1996":"AWm_mkbdpCA",
  "Alien|1979":"iQ2Jx_EaZOo",
  "The Conjuring: Last Rites|2025":"bMgfsdYoEEo",
  "The First Omen|2024":"lmN1Op8ygno",
  "Final Destination Bloodlines|2025":"UWMzKXsY9A4",
  "The Black Phone|2021":"3eGP6im8AZA",
  "Evil Dead Rise|2023":"BqQNO7BzN08",
  "Carrie|1976":"j9Mg-GRS46Y"
};
const htMediaCache={movies:{},books:{}};
window.HT_MOVIE_MODE='modern';
const htMovies=()=>window.HT_MOVIE_MODE==='classic'?CATALOG.movies:HT_MODERN_MOVIES;
const htWatchKind=()=>window.HT_MOVIE_MODE==='classic'?'movies-classic-saved':'movies-modern-saved';

/* Phase 3: only a small known trailer set embeds. Check YouTube metadata and guard against mismatched video titles. */
const htTrailerChecks={};
function htTrailerTitleMatches(movie,title){
 const norm=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const m=norm(movie.title),t=norm(title);
 const anchor=m==="it"?"it":m;
 return t.includes(anchor)&&(t.includes("trailer")||t.includes("teaser")||t.includes("preview")||t.includes("official"));
}
async function htTrailerMetadata(movie){
 const id=HT_TRAILERS[movie.title+'|'+movie.year];
 if(!id)return null;
 if(htTrailerChecks[id])return htTrailerChecks[id];
 htTrailerChecks[id]=(async()=>{
 try{
 const res=await fetch('https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json',{signal:AbortSignal.timeout(8000)});
 if(!res.ok)return null;
 const obj=await res.json();
 if(!htTrailerTitleMatches(movie,obj.title))return null;
 return {id:id,title:obj.title,author:obj.author_name||'',image:obj.thumbnail_url||('https://i.ytimg.com/vi/'+id+'/hqdefault.jpg')};
 }catch(e){return null;}
 })();
 return htTrailerChecks[id];
}
async function htVerifyTrailerGallery(){
 if(view()!=='movies')return;
 const candidates=htMovies().filter(x=>HT_TRAILERS[x.title+'|'+x.year]);
 for(const movie of candidates){
 if(view()!=='movies'||!htMovies().some(x=>x.rank===movie.rank&&x.title===movie.title))break;
 const result=await htTrailerMetadata(movie);
 const play=document.querySelector('[data-trailer-rank="'+movie.rank+'"]');
 if(play){play.textContent=result?'▶ Watch trailer':'Search for trailer ↗';play.dataset.available=result?'yes':'no';play.setAttribute('aria-label',result?'Watch '+movie.title+' trailer':'Search YouTube for '+movie.title+' trailer');}
 const img=document.querySelector('[data-ht-img="movies-'+movie.rank+'"]');
 if(result&&img&&(window.HT_MOVIE_MODE==='modern'||!window.HTMediaSource?.get('movies',movie.rank)?.url)){img.src=result.image;img.alt=movie.title+' trailer thumbnail';}
 }
}

let htPosterLookupStarted=false,htBookLookupStarted=false;
const htArtwork=(title,kind)=>{
 const cleaned=String(title).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const words=cleaned.split(' ');const lines=[];let line='';
 for(const word of words){if((line+' '+word).trim().length>18){lines.push(line);line=word;}else line=(line+' '+word).trim();}
 if(line)lines.push(line);const rows=lines.slice(0,5);
 const height=kind==='movies'?480:460;
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="320" height="'+height+'" viewBox="0 0 320 '+height+'"><defs><radialGradient id="r"><stop stop-color="#702032"/><stop offset="1" stop-color="#090508"/></radialGradient></defs><rect width="320" height="'+height+'" fill="url(#r)"/><rect x="12" y="12" width="296" height="'+(height-24)+'" rx="13" stroke="#a74f60" stroke-width="3" fill="none"/><circle cx="160" cy="137" r="75" fill="#310e19" stroke="#b04f57" stroke-width="5"/><path d="M119 120l35 15-42 20zM200 120l-35 15 42 20zM117 167q43 25 87-1l-16 26-22-9-26 13z" fill="#e78949"/><path d="M90 255h140" stroke="#ac5261" stroke-width="3"/>'+rows.map((v,i)=>'<text x="160" y="'+(294+i*31)+'" font-family="Georgia,serif" font-size="'+(rows.length>3?20:24)+'" text-anchor="middle" fill="#fff0e7">'+v+'</text>').join('')+'<text x="160" y="'+(height-32)+'" font-family="sans-serif" font-size="13" letter-spacing="3" text-anchor="middle" fill="#efb5b2">HAUNTED TOWNE</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
};
const htAmazon=(x,isMovie)=>'https://www.amazon.com/s?k='+encodeURIComponent(x.title+' '+(isMovie?x.year+' movie Blu-ray DVD':x.author+' book'));
const htYouTube=(x)=>'https://www.youtube.com/results?search_query='+encodeURIComponent(x.title+' '+x.year+' official movie trailer');
function htReadCache(k){try{return JSON.parse(sessionStorage.getItem('ht-media-'+k)||'{}')}catch{return {};}}
function htWriteCache(k,o){try{sessionStorage.setItem('ht-media-'+k,JSON.stringify(o))}catch{}}
function htGallery(which){
 const film=which==='movies',arr=film?htMovies():CATALOG.books,sorts=film?'<option value="year">Release year</option>':'<option value="author">Author A–Z</option>';
 return pageHero(film?'The haunted cinema':'The midnight library',film?'Horror Movie Theater':'100 Horror Books',(film?'Watch trailers, discover modern horror, and revisit the films that defined the genre.':'Browse all 100 selections with covers and a saved reading list.'))+
 '<section class="section"><div class="wrap">'+(film?'<section class="ht-exorcist-feature" aria-label="Featured film The Exorcist"><div class="ht-exorcist-art"><img src="https://i.ytimg.com/vi/BU2eYAO31Cc/hqdefault.jpg" alt="The Exorcist 1973 trailer thumbnail" loading="eager"></div><div class="ht-exorcist-copy"><p class="eyebrow">Horror Movie Theater · Featured Classic</p><h2>The Exorcist (1973)</h2><p>The supernatural horror landmark that changed the genre.</p><button class="button" type="button" data-featured-exorcist>▶ Watch The Exorcist Trailer</button></div></section><div class="ht-movie-choice" aria-label="Choose a movie collection"><button type="button" data-movie-mode="modern" class="ht-movie-door '+(window.HT_MOVIE_MODE==='modern'?'active':'')+'"><strong>Top Horror Movies</strong></button><button type="button" data-movie-mode="classic" class="ht-movie-door '+(window.HT_MOVIE_MODE==='classic'?'active':'')+'"><strong>Classics</strong></button></div>':'')+'<div class="notice ht-media-notice">'+(film?'Play verified trailers right here without leaving the theater. When an official trailer is not yet verified, a film-specific YouTube search is provided instead.':'Book covers are sourced from published book metadata when available. Amazon buttons open product searches rather than affiliate-tracked product pages.')+'</div>'+
 (false?'<section class="ht-featured" id="ht-featured" aria-label="Featured recent horror movie"><div class="ht-featured-art"><img src="https://i.ytimg.com/vi/mNd1gb19A-c/hqmaxresdefault.jpg" alt="Resident Evil 2026 official trailer thumbnail" loading="eager" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/mNd1gb19A-c/hqdefault.jpg\'"></div><div class="ht-featured-copy"><p class="eyebrow">Featured 2026 Horror</p><h2>Resident Evil (2026)</h2><p>A new Raccoon City nightmare from director Zach Cregger. Start with the Sony Pictures official trailer, then explore the rest of the collection below.</p><button type="button" class="button ht-featured-play" data-trailer-rank="1">▶ Watch Official Trailer</button></div></section>':'')+'<div class="toolbar"><input id="rank-q" class="field" type="search" aria-label="Search titles" placeholder="Search '+(film?'movies or genres':'books or authors')+'"><select id="rank-cat" class="field"><option value="">All '+(film?'genres':'authors')+'</option>'+(film?[...new Set(arr.map(x=>x.genre))]:[]).map(x=>'<option>'+esc(x)+'</option>').join('')+'</select><select id="rank-order" class="field"><option value="rank">Curated order</option><option value="title">Title A–Z</option>'+sorts+'</select></div>'+
 '<p class="note ht-storage-note">“Save” stores a watchlist or reading list only in this browser on this device. No account or cross-device syncing is needed.</p>'+
 (film?'':'<div class="actions"><button type="button" class="button-outline" id="export-list">Export saved books</button></div>')+'<h2 class="ht-movie-list-title" id="ht-movie-list-title">'+(film?(window.HT_MOVIE_MODE==='classic'?'Classics':'Top Horror Movies'):'Horror Books')+'</h2><p id="ht-artwork-progress" class="note ht-art-progress" role="status">Checking artwork sources…</p><div class="ht-gallery" id="rank-results" aria-live="polite"></div>'+
 '<div class="ht-player" id="ht-player" hidden aria-hidden="true"><div class="ht-player-shade" data-close-trailer></div><div class="ht-player-panel" role="dialog" aria-modal="true" aria-label="Horror movie trailer"><div class="ht-player-heading"><h2 id="ht-trailer-title">Movie Trailer</h2><button type="button" class="ht-close" data-close-trailer aria-label="Close trailer">✕ Close</button></div><div class="ht-video-slot" id="ht-video-slot"></div><p class="note">Trailers are hosted by their creators on YouTube. Playback is voluntary; no trailer autoplays while you browse.</p></div></div></div></section>';
}
ranking=htGallery;
filteredRanking=function(){
 const film=view()==='movies',kind=film?'movies':'books',all=film?htMovies():CATALOG.books;
 const search=(Q('rank-q')?.value||'').trim().toLowerCase(),category=(Q('rank-cat')?.value||'');
 const sort=Q('rank-order')?.value||'rank',saved=get(film?htWatchKind():kind+'-saved',[]);
 let items=all.filter(x=>(!category||x.genre===category)&&[x.title,x.genre,x.author,x.year,x.description].join(' ').toLowerCase().includes(search));
 if(film&&window.HT_MOVIE_MODE==='classic'&&sort==='rank')items.sort((a,b)=>((HT_TRAILERS[b.title+'|'+b.year]?1:0)-(HT_TRAILERS[a.title+'|'+a.year]?1:0))||((window.HTMediaSource?.get('movies',b.rank)?.url?1:0)-(window.HTMediaSource?.get('movies',a.rank)?.url?1:0))||(a.title==='The Exorcist'?-1:b.title==='The Exorcist'?1:a.rank-b.rank));
 if(sort==='title')items.sort((a,b)=>a.title.localeCompare(b.title));
 else if(sort==='year')items.sort((a,b)=>a.year-b.year);
 else if(sort==='author')items.sort((a,b)=>a.author.localeCompare(b.author));
 const cached=htMediaCache[kind],limit=items.length;
 const tile=items.map((x,index)=>{
   const foundTrailer=film&&HT_TRAILERS[x.title+'|'+x.year];const record=(film&&window.HT_MOVIE_MODE==='modern')?null:window.HTMediaSource?.get(kind,x.rank),sourced=record?.url;const image=sourced||((film&&foundTrailer)?'https://i.ytimg.com/vi/'+foundTrailer+'/hqdefault.jpg':window.HTMediaSource?.fallback(x.title,kind)||htArtwork(x.title,kind)),url=htAmazon(x,film);
   const actions='<div class="ht-actions">'+(film?'<button type="button" class="small-button ht-film-profile-action" data-film-profile-rank="'+x.rank+'">Full Movie Profile</button>':'<a href="./detail.html?kind=book&id='+x.rank+'" class="small-button">See More →</a>')+'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" class="small-button">Amazon ↗</a>'+
   (film?'<button type="button" class="small-button ht-play" data-trailer-rank="'+x.rank+'">'+(foundTrailer?'▶ Watch Trailer':'▶ Find Trailer')+'</button>':'')+
   '<button class="small-button" type="button" data-save="'+x.rank+'">'+(saved.includes(x.rank)?'✓ Saved':'+ Save')+'</button></div>';
   return '<article class="ht-media-card"><div class="ht-art" aria-label="Artwork for '+esc(x.title)+'">'+
   '<img src="'+esc(image)+'" data-ht-img="'+kind+'-'+x.rank+'" alt="'+esc(x.title+(film?' film image or themed title artwork':' cover or themed title artwork'))+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="ht-image-source" data-ht-credit="'+kind+'-'+x.rank+'">'+esc(sourced?('Image: '+record.source):(film&&foundTrailer?'Trailer image · YouTube':'Haunted Towne title art'))+'</span></div>'+
   '<div class="ht-media-copy"><p class="ht-media-rank">#'+(film&&window.HT_MOVIE_MODE==='classic'&&sort==='rank'?index+1:x.rank)+' · '+(film?esc(x.year+' · '+x.genre):esc(x.author))+'</p>'+
   '<h3>'+esc(x.title)+'</h3>'+(film?'<details class="ht-film-details"><summary>Movie Details <span aria-hidden="true">⌄</span></summary><div class="ht-film-detail-body"><p><strong>Release:</strong> '+esc(x.year)+'</p><p><strong>Horror style:</strong> '+esc(x.genre)+'</p><p>'+esc(x.description&& !x.description.startsWith('A standout contemporary horror selection')?x.description:'Explore this film’s place in the horror genre and watch its trailer to decide whether to add it to your list.')+'</p></div></details>':'<p>'+esc(x.description||'Discover this horror classic.')+'</p>')+actions+'</div></article>';
 }).join('');
 Q('rank-results').innerHTML=tile||'<p class="empty">No matching titles.</p>';
 if(window.HTMediaSource&&!(film&&window.HT_MOVIE_MODE==='modern')){htUpdateArtworkProgress(kind);window.HTMediaSource.begin(kind).then(()=>htUpdateArtworkProgress(kind)).catch(()=>htUpdateArtworkProgress(kind));}else if(film){const p=Q('ht-artwork-progress');if(p)p.textContent='Modern titles use cinematic title artwork and verified trailer thumbnails where available.';}if(film)htVerifyTrailerGallery();
};
function htUpdateArtworkProgress(kind){
 const e=Q('ht-artwork-progress');if(!e||!window.HTMediaSource)return;
 const t=window.HTMediaSource.stats(kind);
 e.textContent=t.running?'Matching '+(kind==='books'?'book covers':'film images')+'… '+t.real+' sourced, '+(t.missing+t.pending)+' using branded artwork while searching.':
 t.real+' of '+t.total+' titles matched to external artwork; '+(t.missing+t.pending)+' display original Haunted Towne artwork or video thumbnails. Some external images may be unavailable.';
}
function htApplyArtwork(kind,rank,entry){
 if(view()!==kind || (kind==='movies'&&window.HT_MOVIE_MODE==='modern'))return;
 const img=document.querySelector('[data-ht-img="'+kind+'-'+rank+'"]'),badge=document.querySelector('[data-ht-credit="'+kind+'-'+rank+'"]');
 if(!img)return;
 if(entry&&entry.url){img.src=entry.url;img.alt=(kind==='books'?'Cover image':'Film image')+' for '+(kind==='books'?CATALOG.books:CATALOG.movies)[rank-1].title;
   if(badge)badge.textContent='Image: '+entry.source;
 }else{
   const item=(kind==='books'?CATALOG.books:CATALOG.movies)[rank-1];
   if(item){const video=kind==='movies'&&HT_TRAILERS[item.title+'|'+item.year];
     img.src=video?'https://i.ytimg.com/vi/'+video+'/hqdefault.jpg':window.HTMediaSource.fallback(item.title,kind);
     if(badge)badge.textContent=video?'Trailer image · YouTube':'Haunted Towne title art';}
 }
 htUpdateArtworkProgress(kind);
}
if(window.HTMediaSource){
 window.HTMediaSource.listen(function(kind,rank,entry){if(rank)htApplyArtwork(kind,rank,entry);else htUpdateArtworkProgress(kind);});
 document.addEventListener('error',function(e){
   const img=e.target;if(!img||!img.dataset||!img.dataset.htImg)return;
   const m=img.dataset.htImg.match(/^(books|movies)-(\d+)$/);if(!m)return;
   const kind=m[1],rank=Number(m[2]),record=window.HTMediaSource.get(kind,rank);
   const row=(kind==='books'?CATALOG.books:CATALOG.movies)[rank-1];
   if(!row||img.dataset.htErrorHandled==='yes')return;
   img.dataset.htErrorHandled='yes';
   if(record?.url)window.HTMediaSource.failed(kind,rank);
   img.src=window.HTMediaSource.fallback(row.title,kind);
   const badge=document.querySelector('[data-ht-credit="'+kind+'-'+rank+'"]');
   if(badge)badge.textContent='Haunted Towne title art';
 },true);
}
function htCloseTrailer(){
 const modal=Q('ht-player');if(!modal)return;modal.hidden=true;modal.setAttribute('aria-hidden','true');
 const slot=Q('ht-video-slot');if(slot)slot.replaceChildren();
 document.body.classList.remove('ht-trailer-open');
}
async function htPlayMovieByName(title,year){const x={title,year};const id=HT_TRAILERS[title+'|'+year];if(!id)return;const verified=await htTrailerMetadata(x);const modal=Q('ht-player'),slot=Q('ht-video-slot');if(!modal||!slot)return;Q('ht-trailer-title').textContent=verified?verified.title:title+' — Trailer';slot.replaceChildren();if(verified){const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';frame.title=title+' trailer';frame.allow='autoplay;encrypted-media;picture-in-picture';frame.allowFullscreen=true;slot.appendChild(frame)}else{const p=document.createElement('p');p.textContent='Trailer unavailable for embedding at this time.';slot.appendChild(p)}modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('ht-trailer-open')}
async function htOpenTrailer(rank){
 const x=htMovies().find(x=>x.rank===Number(rank));if(!x)return;
 const id=HT_TRAILERS[x.title+'|'+x.year];
 const verified=id?await htTrailerMetadata(x):null;
 const modal=Q('ht-player'),slot=Q('ht-video-slot');if(!modal||!slot)return;
 Q('ht-trailer-title').textContent=verified?(verified.title+' · '+verified.author):(x.title+' ('+x.year+') · Trailer not verified');
 slot.replaceChildren();
 if(id&&verified){
  const frame=document.createElement('iframe');frame.title=x.title+' trailer';
  frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&start=0&rel=0';
  frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';slot.appendChild(frame);
 }else{
  const message=document.createElement('div');message.className='ht-trailer-unverified';message.innerHTML='<p>A playable official trailer is not yet verified for this film.</p>';
  const a=document.createElement('a');a.href=htYouTube(x);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Find the official trailer on YouTube ↗';message.appendChild(a);slot.appendChild(message);
 }
 modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('ht-trailer-open');
 modal.querySelector('[data-close-trailer]')?.focus();
}
const htBeforeBind=bind;
bind=function(){
 htBeforeBind();
 if(view()==='movies'||view()==='books'){
   document.querySelectorAll('[data-movie-mode]').forEach(button=>button.addEventListener('click',()=>{if(window.HT_MOVIE_MODE===button.dataset.movieMode)return;window.HT_MOVIE_MODE=button.dataset.movieMode;htCloseTrailer();navigate(false);}));
   Q('rank-results')?.addEventListener('click',e=>{const b=e.target.closest('[data-trailer-rank]');if(b)htOpenTrailer(b.dataset.trailerRank);});
   Q('ht-featured')?.addEventListener('click',e=>{const b=e.target.closest('[data-trailer-rank]');if(b)htOpenTrailer(b.dataset.trailerRank);});
   document.querySelector('[data-featured-exorcist]')?.addEventListener('click',()=>{
 const frame=document.querySelector('.ht-exorcist-art');if(!frame)return;
 if(frame.querySelector('iframe')){frame.innerHTML='<img src="https://i.ytimg.com/vi/BU2eYAO31Cc/hqdefault.jpg" alt="The Exorcist trailer thumbnail">';document.querySelector('[data-featured-exorcist]').textContent='▶ Watch The Exorcist Trailer';return;}
 const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/BU2eYAO31Cc?autoplay=1&rel=0';iframe.title='The Exorcist 1973 4K Warner Bros official trailer';iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;iframe.loading='eager';frame.replaceChildren(iframe);document.querySelector('[data-featured-exorcist]').textContent='■ Stop Trailer';
 });
   Q('ht-player')?.addEventListener('click',e=>{if(e.target.closest('[data-close-trailer]'))htCloseTrailer();});
 }
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')htCloseTrailer();});
