/* Haunted Towne – film and book visual galleries, Amazon discovery and responsible trailers. */
'use strict';
const HT_TRAILERS={
  "Get Out|2017":"AHEl7Pji0f8",
  "Hereditary|2018":"V6wWKNij_1M",
  "Midsommar|2019":"1Vnghdsjmd0",
  "Nope|2022":"In8fuzj3gck",
  "The Witch|2015":"iQXmlf3Sefg",
  "A Quiet Place|2018":"WR7cc5t7tv8",
  "The Substance|2024":"B1B3HZRHpEw"
};
const htMediaCache={movies:{},books:{}};
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
 const film=which==='movies',arr=film?CATALOG.movies:CATALOG.books,sorts=film?'<option value="year">Release year</option>':'<option value="author">Author A–Z</option>';
 return pageHero(film?'The haunted cinema':'The midnight library',film?'100 Essential Horror Movies':'100 Horror Books','Browse all 100 selections with individual artwork, descriptions, Amazon discovery, and a saved '+(film?'watchlist.':'reading list.'))+
 '<section class="section"><div class="wrap"><div class="notice ht-media-notice">'+(film?'Poster images are sourced from encyclopedia metadata when available. Verified official trailers play inside the site; otherwise the trailer control opens a film-specific YouTube search.':'Book covers are sourced from published book metadata when available. Amazon buttons open product searches rather than affiliate-tracked product pages.')+'</div>'+
 '<div class="toolbar"><input id="rank-q" class="field" type="search" aria-label="Search titles" placeholder="Search '+(film?'movies or genres':'books or authors')+'"><select id="rank-cat" class="field"><option value="">All '+(film?'genres':'authors')+'</option>'+(film?[...new Set(arr.map(x=>x.genre))]:[]).map(x=>'<option>'+esc(x)+'</option>').join('')+'</select><select id="rank-order" class="field"><option value="rank">Curated order</option><option value="title">Title A–Z</option>'+sorts+'</select></div>'+
 '<div class="actions"><button type="button" class="button-outline" id="export-list">Export saved '+(film?'movies':'books')+'</button></div><div class="ht-gallery" id="rank-results" aria-live="polite"></div>'+
 '<div class="ht-player" id="ht-player" hidden aria-hidden="true"><div class="ht-player-shade" data-close-trailer></div><div class="ht-player-panel" role="dialog" aria-modal="true" aria-label="Horror movie trailer"><div class="ht-player-heading"><h2 id="ht-trailer-title">Movie Trailer</h2><button type="button" class="ht-close" data-close-trailer aria-label="Close trailer">✕ Close</button></div><div class="ht-video-slot" id="ht-video-slot"></div><p class="note">Trailers are hosted by their creators on YouTube. Playback is voluntary; no trailer autoplays while you browse.</p></div></div></div></section>';
}
ranking=htGallery;
filteredRanking=function(){
 const film=view()==='movies',kind=film?'movies':'books',all=film?CATALOG.movies:CATALOG.books;
 const search=(Q('rank-q')?.value||'').trim().toLowerCase(),category=(Q('rank-cat')?.value||'');
 const sort=Q('rank-order')?.value||'rank',saved=get(kind+'-saved',[]);
 let items=all.filter(x=>(!category||x.genre===category)&&[x.title,x.genre,x.author,x.year,x.description].join(' ').toLowerCase().includes(search));
 if(sort==='title')items.sort((a,b)=>a.title.localeCompare(b.title));
 else if(sort==='year')items.sort((a,b)=>a.year-b.year);
 else if(sort==='author')items.sort((a,b)=>a.author.localeCompare(b.author));
 const cached=htMediaCache[kind],limit=items.length;
 const tile=items.map(x=>{
   const foundTrailer=film&&HT_TRAILERS[x.title+'|'+x.year];const image=foundTrailer?'https://i.ytimg.com/vi/'+foundTrailer+'/hqdefault.jpg':cached[x.rank]||htArtwork(x.title,kind),url=htAmazon(x,film);
   const actions='<div class="ht-actions"><a href="./detail.html?kind='+(film?'movie':'book')+'&id='+x.rank+'" class="small-button">See More →</a><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" class="small-button">Amazon ↗</a>'+
   (film?(foundTrailer?'<button type="button" class="small-button ht-play" data-trailer-rank="'+x.rank+'">▶ Play trailer</button>':'<a class="small-button" target="_blank" rel="noopener noreferrer" href="'+esc(htYouTube(x))+'">Find trailer ↗</a>'):'')+
   '<button class="small-button" type="button" data-save="'+x.rank+'">'+(saved.includes(x.rank)?'✓ Saved':'+ Save')+'</button></div>';
   return '<article class="ht-media-card"><a class="ht-art ht-art-link" aria-label="See details for '+esc(x.title)+'" href="./detail.html?kind='+(film?'movie':'book')+'&id='+x.rank+'">'+
   '<img src="'+esc(image)+'" data-ht-img="'+kind+'-'+x.rank+'" alt="'+esc(x.title+(film?' movie poster or themed title artwork':' book cover or themed title artwork'))+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>'+
   '<div class="ht-media-copy"><p class="ht-media-rank">#'+x.rank+' · '+(film?esc(x.year+' · '+x.genre):esc(x.author))+'</p>'+
   '<h3>'+esc(x.title)+'</h3><p>'+esc(x.description||'Discover this horror classic.')+'</p>'+actions+'</div></article>';
 }).join('');
 Q('rank-results').innerHTML=tile||'<p class="empty">No matching titles.</p>';
 if(film)htLookupMovieArt();else htLookupBookArt();
};
function htUpdateImages(kind){
 const elements=document.querySelectorAll('[data-ht-img]'),cache=htMediaCache[kind];
 for(const img of elements){const [k,rank]=img.dataset.htImg.split('-');if(k===kind&&cache[rank]&&!(kind==='movies'&&HT_TRAILERS[CATALOG.movies[Number(rank)-1]?.title+'|'+CATALOG.movies[Number(rank)-1]?.year]))img.src=cache[rank];}
}
async function htLookupMovieArt(){
 if(htPosterLookupStarted)return;htPosterLookupStarted=true;
 const cached=htReadCache('posters');Object.assign(htMediaCache.movies,cached);htUpdateImages('movies');
 const missing=CATALOG.movies.filter(x=>!cached[x.rank]);if(!missing.length)return;
 const queries=[];
 for(const x of missing){
   queries.push({rank:x.rank,title:x.title+' ('+x.year+' film)',preference:3});
   queries.push({rank:x.rank,title:x.title+' (film)',preference:2});
   queries.push({rank:x.rank,title:x.title,preference:1});
 }
 const winners={};
 for(let i=0;i<queries.length;i+=40){
   const batch=queries.slice(i,i+40);
   try{
     const url='https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&redirects=1&prop=pageimages&piprop=thumbnail&pilicense=any&pithumbsize=320&titles='+encodeURIComponent(batch.map(v=>v.title).join('|'));
     const res=await fetch(url,{signal:AbortSignal.timeout(11000)});
     if(!res.ok)continue;const result=await res.json(),pages=Object.values(result.query?.pages||{});
     for(const p of pages){
       const thumb=p.thumbnail?.source;if(!thumb||!thumb.startsWith('https://'))continue;
       const n=p.title.toLowerCase().replace(/[_–]/g,' ').replace(/\s+/g,' ').trim();
       for(const q of batch){
         const desired=q.title.toLowerCase().replace(/[_–]/g,' ').replace(/\s+/g,' ').trim();
         if(n!==desired)continue;
         if(!winners[q.rank]||winners[q.rank].priority<q.preference){winners[q.rank]={url:thumb,priority:q.preference};}
       }
     }
   }catch(e){/* Keep branded original artwork when Wikipedia is unreachable. */}
   for(const [rank,win] of Object.entries(winners)){htMediaCache.movies[rank]=win.url;}
   htUpdateImages('movies');htWriteCache('posters',htMediaCache.movies);
 }
}
async function htLookupBookArt(){
 if(htBookLookupStarted)return;htBookLookupStarted=true;
 Object.assign(htMediaCache.books,htReadCache('books'));htUpdateImages('books');
 const queue=CATALOG.books.filter(x=>!htMediaCache.books[x.rank]);let index=0;
 async function worker(){
   while(index<queue.length){
     const b=queue[index++];
     try {
       const url='https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent('intitle:'+b.title+' inauthor:'+b.author)+'&maxResults=4&printType=books';
       const res=await fetch(url,{signal:AbortSignal.timeout(9000)});if(!res.ok)continue;
       const data=await res.json();
       const norm=x=>String(x||'').toLowerCase().replace(/[^a-z0-9]/g,'');
       const t=norm(b.title),a=norm(b.author);
       const match=(data.items||[]).find(x=>{
         const info=x.volumeInfo||{},title=norm(info.title),authors=(info.authors||[]).map(norm);
         return (title===t||title.startsWith(t)||t.startsWith(title))&&(authors.length===0||authors.some(z=>z.includes(a.slice(-5))||a.includes(z.slice(-5))));
       });
       const urls=match?.volumeInfo?.imageLinks;
       let thumb=urls?.thumbnail||urls?.smallThumbnail||urls?.medium;
       if(thumb){thumb=thumb.replace(/^http:/,'https:');htMediaCache.books[b.rank]=thumb;htWriteCache('books',htMediaCache.books);htUpdateImages('books');}
     }catch(e){/* Cover unavailable; clear title-art remains. */}
   }
 }
 await Promise.all([worker(),worker(),worker()]);
}
function htCloseTrailer(){
 const modal=Q('ht-player');if(!modal)return;modal.hidden=true;modal.setAttribute('aria-hidden','true');
 const slot=Q('ht-video-slot');if(slot)slot.replaceChildren();
 document.body.classList.remove('ht-trailer-open');
}
function htOpenTrailer(rank){
 const x=CATALOG.movies.find(x=>x.rank===Number(rank));if(!x)return;
 const id=HT_TRAILERS[x.title+'|'+x.year];if(!id)return;
 const modal=Q('ht-player'),slot=Q('ht-video-slot');if(!modal||!slot)return;
 Q('ht-trailer-title').textContent=x.title+' ('+x.year+') — Trailer / Teaser Preview';
 slot.replaceChildren();
 const frame=document.createElement('iframe');frame.title=x.title+' trailer';
 frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&start=0&rel=0';
 frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
 frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';slot.appendChild(frame);
 modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('ht-trailer-open');
 modal.querySelector('[data-close-trailer]')?.focus();
}
const htBeforeBind=bind;
bind=function(){
 htBeforeBind();
 if(view()==='movies'||view()==='books'){
   Q('rank-results')?.addEventListener('click',e=>{const b=e.target.closest('[data-trailer-rank]');if(b)htOpenTrailer(b.dataset.trailerRank);});
   Q('ht-player')?.addEventListener('click',e=>{if(e.target.closest('[data-close-trailer]'))htCloseTrailer();});
 }
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')htCloseTrailer();});
