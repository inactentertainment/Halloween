/* Reusable, original InAct Entertainment movie profile overlay.
   Other sites can supply movieProfileData(movie) and movieProfilePromos. */
(function(){
'use strict';
const extra={
 'Resident Evil|2026':{director:'Zach Cregger',cast:'Austin Abrams, Zach Cherry, Kali Reis, Paul Walter Hauser',rating:'R',release:'September 18, 2026',source:'https://www.sonypictures.com/movies/residentevil8',synopsis:'A medical courier is caught in one horrifying night of survival as a city descends into chaos.'}
};
const E=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\u0027':'&#39;'}[c]));
const cleanUrl=u=>{try{const a=new URL(u,location.href);return ['https:','http:'].includes(a.protocol)?a.href:'#'}catch{return '#'}};
let layer=null,lastFocus=null;
const current=()=>window.HT_MOVIE_MODE==='classic'?window.CATALOG?.movies:window.HT_MODERN_MOVIES;
function close(){
 if(!layer)return;
 layer.remove();layer=null;document.body.classList.remove('ht-profile-open');
 if(lastFocus&&lastFocus.isConnected)lastFocus.focus();
}
function open(rank){
 const movie=current()?.find(x=>x.rank===rank);
 if(!movie)return;
 close();lastFocus=document.activeElement;
 const info={...extra[movie.title+'|'+movie.year],...(typeof window.movieProfileData==='function'?window.movieProfileData(movie)||{}:{})};
 const source=document.querySelector('[data-ht-img="movies-'+rank+'"]');
 const art=source?.getAttribute('src')||'./assets/banner-movies.svg';
 const trailer=window.HT_TRAILERS?.[movie.title+'|'+movie.year]||null;
 const body=movie.description&& !movie.description.startsWith('A standout contemporary horror selection')?movie.description:'Explore this film, discover its horror themes, and decide whether it belongs on your watchlist.';
 const promos=window.movieProfilePromos||[
 {title:'Explore The Thirteen Doors',description:'A free interactive original horror mystery.',url:'./story.html#start'},
 {title:'Explore Halloween Recipes',description:'Bring the haunted feast to your own table.',url:'./index.html#recipes'}
 ];
 const p=promos.map(x=>'<a class="ht-profile-promo" href="'+E(cleanUrl(x.url))+'"><span>FROM INACT ENTERTAINMENT</span><strong>'+E(x.title)+'</strong><small>'+E(x.description||'')+'</small></a>').join('');
 layer=document.createElement('div');layer.className='ht-profile-overlay';
 layer.innerHTML='<div class="ht-profile-shade" data-ht-profile-close></div><section class="ht-profile-window" role="dialog" aria-modal="true" aria-label="'+E(movie.title)+' movie profile"><header class="ht-profile-top"><span>HAUNTED TOWNE / MOVIE PROFILE</span><button type="button" data-ht-profile-close aria-label="Close movie profile">✕ Close</button></header><div class="ht-profile-banner"><div class="ht-profile-poster"><img src="'+E(art)+'" alt="Artwork for '+E(movie.title)+'"></div><div class="ht-profile-intro"><p class="ht-profile-kicker">'+(window.HT_MOVIE_MODE==='classic'?'CLASSIC HORROR':'TOP HORROR MOVIES')+' · #'+rank+'</p><h2>'+E(movie.title)+'</h2><p class="ht-profile-facts">'+E(movie.year)+' · '+E(movie.genre)+(info.rating?' · '+E(info.rating):'')+'</p><p>'+E(info.synopsis||body)+'</p><div class="ht-profile-actions">'+(trailer?'<button type="button" data-ht-profile-trailer="'+rank+'">▶ Watch Trailer</button>':'<a href="https://www.youtube.com/results?search_query='+encodeURIComponent(movie.title+' '+movie.year+' official movie trailer')+'" target="_blank" rel="noopener noreferrer">Find Trailer</a>')+'<button type="button" data-ht-profile-save="'+rank+'">+ Save to Watchlist</button></div></div></div><div class="ht-profile-body"><section><h3>About the Movie</h3><p>'+E(body)+'</p><div class="ht-profile-facts-grid"><div><strong>Year</strong><span>'+E(movie.year)+'</span></div><div><strong>Genre</strong><span>'+E(movie.genre)+'</span></div>'+(info.director?'<div><strong>Director</strong><span>'+E(info.director)+'</span></div>':'')+(info.cast?'<div><strong>Cast</strong><span>'+E(info.cast)+'</span></div>':'')+(info.release?'<div><strong>Release</strong><span>'+E(info.release)+'</span></div>':'')+'</div>'+(info.source?'<p><a href="'+E(cleanUrl(info.source))+'" target="_blank" rel="noopener noreferrer">Official film information ↗</a></p>':'')+'</section><aside><h3>Explore More</h3>'+p+'<p class="ht-profile-disclosure">These are our own featured experiences, not third-party paid advertisements. External ads and affiliate placements must be labeled separately.</p></aside></div><footer class="ht-profile-bottom"><button type="button" data-ht-profile-close>← Back to Movies</button><span>Movie data and artwork credits belong to their respective owners.</span></footer></section>';
 document.body.appendChild(layer);document.body.classList.add('ht-profile-open');layer.querySelector('[data-ht-profile-close]')?.focus();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-film-profile-rank]');if(b){e.preventDefault();open(Number(b.dataset.filmProfileRank));return}
 if(e.target.closest('[data-ht-profile-close]')){close();return}
 const t=e.target.closest('[data-ht-profile-trailer]');
 if(t){const rank=Number(t.dataset.htProfileTrailer);close();if(typeof window.htOpenTrailer==='function')window.htOpenTrailer(rank);else if(typeof htOpenTrailer==='function')htOpenTrailer(rank);return}
 const v=e.target.closest('[data-ht-profile-save]');
 if(v){const rank=Number(v.dataset.htProfileSave),key=window.HT_MOVIE_MODE==='classic'?'movies-classic-saved':'movies-modern-saved';
 try{let items=JSON.parse(localStorage.getItem('ht-'+key)||'[]');items=items.includes(rank)?items:items.concat(rank);localStorage.setItem('ht-'+key,JSON.stringify(items));v.textContent='✓ Saved';if(typeof filteredRanking==='function')filteredRanking()}catch{v.textContent='Unable to save'}return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layer){e.preventDefault();close()}});
window.HTMovieProfile={open,close};
})();