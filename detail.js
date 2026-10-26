/* Haunted Towne — 200 permanent item-specific detail URLs using one lightweight static template. */
(function(){
 "use strict";
 var params=new URLSearchParams(location.search),kind=params.get("kind")==="movie"?"movie":"book";
 var id=Number(params.get("id")),isMovie=kind==="movie";
 var collection=isMovie?CATALOG.movies:CATALOG.books;
 var item=Number.isInteger(id)&&id>=1&&id<=100?collection.find(function(x){return x.rank===id;}):null;
 var root=document.getElementById("ht-detail-root"),typeName=isMovie?"film":"book";
 var trailerIds={"Get Out|2017":"AHEl7Pji0f8","Hereditary|2018":"V6wWKNij_1M","Midsommar|2019":"1Vnghdsjmd0","Nope|2022":"In8fuzj3gck","The Witch|2015":"iQXmlf3Sefg","A Quiet Place|2018":"WR7cc5t7tv8","The Substance|2024":"B1B3HZRHpEw"};
 var filmMood={
 "Vampires":["Immortality versus humanity","Seduction, predation and desire","The outsider figure"],
 "Gothic":["Architecture as a character","Secrets and inheritance","Beauty shadowed by decay"],
 "Ghosts":["Memory and the haunted home","Grief and unfinished business","The unseen presence"],
 "Psychological":["The uncertainty of perception","Fear inside ordinary relationships","Identity and isolation"],
 "Zombies":["Collective survival","The failure of institutions","What makes us human"],
 "Slasher":["The chase and its cinematic grammar","Survival and suspense","Masks and anonymity"],
 "Science Fiction":["The danger of unfamiliar discoveries","Human vulnerability","Systems under pressure"],
 "Occult":["Ritual and belief","Forbidden knowledge","Family and inherited fear"],
 "Folk":["Landscape and isolation","Tradition as danger","Communal belief"],
 "Monsters":["Sympathy and fear","The body and difference","People becoming outsiders"],
 "Body Horror":["The fragility of identity","Uncontrolled transformation","Beauty, disgust and anxiety"],
 "Comedy":["Laughter as relief","Genre self-awareness","The absurd side of terror"],
 "Found Footage":["What a camera can and cannot prove","Unreliable perspectives","The ordinary becoming uncanny"],
 "Apocalypse":["Life after social collapse","Collective decisions","Danger without certainty"],
 "Supernatural":["An intrusion into daily life","Old fears in new settings","Belief and doubt"],
 "Possession":["Control and agency","The body as a contested space","Faith and fear"],
 "Nature":["The environment becoming hostile","Survival beyond human control","Suspense in familiar places"],
 "Creature Feature":["A threat hidden nearby","Human response to the unknown","The thrill of pursuit"],
 "Thriller":["Uncertainty and secrets","The threat of ordinary spaces","Suspense and revelation"],
 "Anthology":["Many faces of fear","Tales within tales","Contrasting kinds of horror"],
 "Classics":["Genre history","The early language of suspense","Why old imagery lasts"]
 };
 var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]);});};
 var encode=encodeURIComponent;
 var amazon=function(x){return "https://www.amazon.com/s?k="+encode(x.title+" "+(isMovie?x.year+" movie Blu-ray DVD":x.author+" book"));};
 var trailer=function(x){return "https://www.youtube.com/results?search_query="+encode(x.title+" "+x.year+" official trailer");};
 var wikipedia=function(x){return "https://en.wikipedia.org/wiki/Special:Search?search="+encode(x.title+(isMovie?" "+x.year+" film":" "+x.author+" book"));};
 var storageKind=isMovie?"movies":"books",listKey="ht-"+storageKind+"-saved";
 function saved(){try{return JSON.parse(localStorage.getItem(listKey)||"[]");}catch(e){return [];}}
 function store(list){try{localStorage.setItem(listKey,JSON.stringify(list));}catch(e){}}
 function togglesaved(){var list=saved();list=list.includes(id)?list.filter(function(x){return x!==id;}):list.concat(id);store(list);refreshSaved();}
 function refreshSaved(){var b=document.getElementById("ht-save");if(b)b.textContent=saved().includes(id)?"✓ Saved to my list":"＋ Save to my list";}
 function titleArt(){
   var title=esc(item.title),svg='<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><defs><radialGradient id="g"><stop stop-color="#66233b"/><stop offset="1" stop-color="#080506"/></radialGradient></defs><rect width="400" height="600" fill="url(#g)"/><rect x="25" y="25" width="350" height="550" rx="18" fill="none" stroke="#b15366" stroke-width="5"/><path d="M110 205l85 31-95 51zm180 0-85 31 95 51zm-160 100q70 60 143 0l-28 53-45-14-37 20z" fill="#ed954f"/><text x="200" y="470" font-family="Georgia" font-size="22" text-anchor="middle" fill="#f8e8e0">HAUNTED TOWNE</text></svg>';
   return "data:image/svg+xml;charset=utf-8,"+encode(svg);
 }
 function imageFromCache(){try{var o=JSON.parse(sessionStorage.getItem("ht-media-"+(isMovie?"posters":"books"))||"{}");return o[id]||"";}catch(e){return "";}}
 function topics(){return isMovie?(filmMood[item.genre]||["The craft of suspense","What creates dread","How the genre changed over time"]):["What makes the premise unsettling","The author's choices","Why the story endures"];}
 function note(){
   var o=isMovie?DETAIL_MOVIE_NOTES:DETAIL_BOOK_NOTES;
   return o[item.title]||(!isMovie?
    "An entry in Haunted Towne's curated horror-reading list by "+item.author+". The detailed plot synopsis for this edition is awaiting further source verification.":
    "A "+item.genre.toLowerCase()+" horror film from "+item.year+" included in the Haunted Towne Top 100. A fuller scene-specific synopsis is awaiting source verification.");
 }
 function contextualText(){
   if(isMovie){
     return ["This "+item.genre.toLowerCase()+" selection comes from "+item.year+". Its position in the collection makes it an opportunity to explore how horror storytelling uses pacing, imagery, sound and expectation to draw viewers into uneasy territory.",
     "For a focused viewing, consider which details make the atmosphere feel threatening before the film reveals its larger stakes. Think about camera movement, lighting, silence, or the relationship between the viewer and the characters."];
   }
   return ["This selection by "+item.author+" is part of a reading route through Gothic fiction, psychological terror, supernatural storytelling, and the many literary traditions of horror.",
   "When reading, notice the narrative voice and the way the author handles uncertainty. Horror often works as much through what readers imagine as through what a writer explicitly describes."];
 }
 function relatedCards(){
   var list=collection.filter(function(x){return x.rank!==id&&(isMovie?x.genre===item.genre:x.author===item.author);}).slice(0,3);
   if(list.length<3)list=list.concat(collection.filter(function(x){return x.rank!==id&&!list.some(function(y){return y.rank===x.rank;});}).slice(0,3-list.length));
   return list.map(function(x){return '<a href="./detail.html?kind='+kind+'&id='+x.rank+'" class="ht-related-card"><small>#'+x.rank+'</small><strong>'+esc(x.title)+'</strong><span>'+(isMovie?esc(x.year+" · "+x.genre):esc(x.author))+'</span></a>';}).join("");
 }
 if(!item){root.innerHTML='<div class="ht-detail-wrap"><h1>That archive entry could not be found</h1><p>Open the books or movies collection and choose a title.</p><a class="ht-btn" href="./index.html#books">Browse books</a> <a class="ht-btn" href="./index.html#movies">Browse movies</a></div>';return;}
 document.title=item.title+" — "+(isMovie?"Horror Movie":"Horror Book")+" | Haunted Towne";
 var rawNotes=note(),more=contextualText(),t=topics(),video=trailerIds[item.title+"|"+item.year];
 var next=collection[(id)%100],prev=collection[(id+98)%100];
 root.innerHTML=
 '<div class="ht-detail-wrap"><div class="ht-breadcrumb"><a href="./index.html#'+(isMovie?"movies":"books")+'">← Back to all '+(isMovie?"100 films":"100 books")+'</a><span> / #'+id+' of 100</span></div>'+
 '<section class="ht-detail-hero"><div class="ht-cover"><img id="ht-detail-cover" src="'+titleArt()+'" alt="'+esc(item.title)+' cover art"></div><div class="ht-detail-heading">'+
 '<div class="ht-kicker">'+(isMovie?"THE HAUNTED CINEMA":"THE CURSED LIBRARY")+' • SELECTION #'+id+'</div>'+
 '<h1>'+esc(item.title)+'</h1><p class="ht-byline">'+(isMovie?esc(item.year+" · "+item.genre):"By "+esc(item.author))+'</p>'+
 '<p class="ht-summary">'+esc(rawNotes)+'</p><div class="ht-hero-actions">'+
 '<a class="ht-btn" target="_blank" rel="noopener noreferrer" href="'+esc(amazon(item))+'">Explore on Amazon ↗</a>'+
 (isMovie?(video?'<button id="ht-preview-trailer" class="ht-btn ht-btn-muted">▶ Watch trailer</button>':'<a class="ht-btn ht-btn-muted" target="_blank" rel="noopener noreferrer" href="'+esc(trailer(item))+'">Find official trailer ↗</a>'):'')+
 '<button id="ht-save" class="ht-btn ht-btn-muted" type="button">＋ Save to my list</button></div>'+
 '<p class="ht-disclosure">Amazon links open search results, not guaranteed product listings or affiliate offers. Prices, editions and availability are set by the retailer.</p><p class="ht-disclosure">Saving stores the title in this browser only. You can export saved selections from the main library page.</p></div></section>'+
 '<section class="ht-detail-content" id="reading-area">'+
 '<div class="ht-section-row"><div class="ht-section-main"><p class="ht-kicker">DEEPER INTO THE ARCHIVE</p><h2>A closer look</h2><p>'+esc(more[0])+'</p><p>'+esc(more[1])+'</p>'+
 '<div class="ht-explorer"><h2>Investigate the themes</h2><p>Open a theme to reflect on this selection without revealing major spoilers.</p><div class="ht-tabs" role="group" aria-label="Explore horror themes">'+t.map(function(x,i){return '<button type="button" data-ht-theme="'+i+'" aria-pressed="'+(i===0?'true':'false')+'">'+esc(x)+'</button>';}).join('')+'</div><div class="ht-theme-panel" id="ht-theme-panel"><h3>'+esc(t[0])+'</h3><p>'+esc("As you explore "+item.title+", consider how this idea shapes your interpretation. What details in the writing, performances, imagery or pacing bring it to life?")+'</p></div></div>'+
 '<div class="ht-reflection"><h2>The midnight discussion</h2><p>After '+(isMovie?"watching":"reading")+', which moment stays with you? Did the story make you afraid of a creature, a decision, an environment, or something you could not explain?</p>'+
 '<button type="button" id="ht-reflect-btn" class="ht-btn ht-btn-muted">Reveal a discussion prompt</button><p id="ht-reflect-text" aria-live="polite"></p></div>'+
 '</div><aside class="ht-section-side"><div class="ht-side-panel"><p class="ht-kicker">SOURCE CHECK</p><h3>Explore the original work</h3><p>Follow up with the original title information before choosing an edition or viewing format.</p><a href="'+esc(wikipedia(item))+'" target="_blank" rel="noopener noreferrer" class="ht-text-link">Research this title ↗</a><p class="ht-disclosure">Descriptions are original Haunted Towne commentary. For entries without verified plot information, the page avoids inventing scenes, cast details or reviews.</p></div></aside></div>'+
 '<section class="ht-related"><h2>Keep exploring</h2><div class="ht-related-grid">'+relatedCards()+'</div></section>'+
 '<div class="ht-bottom-nav"><a class="ht-btn ht-btn-muted" href="./detail.html?kind='+kind+'&id='+prev.rank+'">← Previous</a><a class="ht-btn ht-btn-muted" href="./index.html#'+(isMovie?"movies":"books")+'">All 100 titles</a><a class="ht-btn ht-btn-muted" href="./detail.html?kind='+kind+'&id='+next.rank+'">Next →</a></div>'+
 '</section></div>'+
 '<div id="ht-video-modal" class="ht-video-modal" hidden><div class="ht-modal-backdrop" data-ht-modal-close></div><div class="ht-modal-card" role="dialog" aria-modal="true" aria-label="Video trailer"><div class="ht-modal-top"><h2>'+esc(item.title)+' trailer</h2><button type="button" id="ht-modal-close" data-ht-modal-close>✕ Close</button></div><div id="ht-player-frame" class="ht-frame"></div><p>Video is provided by the rights holder on YouTube. Playback starts only when selected.</p></div></div>';
 refreshSaved();document.getElementById("ht-save").addEventListener("click",togglesaved);
 var tabs=Array.from(document.querySelectorAll("[data-ht-theme]"));
 tabs.forEach(function(b){b.addEventListener("click",function(){
   tabs.forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
   var topic=t[Number(b.dataset.htTheme)],panel=document.getElementById("ht-theme-panel");
   panel.innerHTML='<h3>'+esc(topic)+'</h3><p>Where does this idea appear in the atmosphere, character choices, or the way the story is told? Look for details that challenge your first impression.</p>';
 });});
 var prompts=["Which scene or passage gives the strongest sense of dread without showing a threat?","Would this story work if it were told from another point of view? Why?","How does the setting contribute to the fear?","What might make you recommend this selection to another horror fan?"];
 document.getElementById("ht-reflect-btn").addEventListener("click",function(){document.getElementById("ht-reflect-text").textContent=prompts[Math.floor(Math.random()*prompts.length)];});
 var modal=document.getElementById("ht-video-modal");function close(){modal.hidden=true;document.getElementById("ht-player-frame").replaceChildren();document.body.classList.remove("ht-video-playing");}
 document.querySelectorAll("[data-ht-modal-close]").forEach(function(x){x.addEventListener("click",close);});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")close();});
 if(video){document.getElementById("ht-preview-trailer").addEventListener("click",async function(){
   var metadata=null;try{var r=await fetch("https://www.youtube.com/oembed?url="+encode("https://www.youtube.com/watch?v="+video)+"&format=json",{signal:AbortSignal.timeout(8000)});if(r.ok)metadata=await r.json();}catch(e){}
   var norm=function(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();};
   if(!metadata||!norm(metadata.title).includes(norm(item.title))||!/trailer|teaser|preview/i.test(metadata.title)){window.open(trailer(item),"_blank","noopener,noreferrer");return;}
   var frame=document.createElement("iframe");frame.src="https://www.youtube-nocookie.com/embed/"+video+"?autoplay=1";frame.title=item.title+" trailer";frame.allow="autoplay; encrypted-media; fullscreen; picture-in-picture";frame.allowFullscreen=true;
   document.getElementById("ht-player-frame").appendChild(frame);modal.hidden=false;document.body.classList.add("ht-video-playing");document.getElementById("ht-modal-close").focus();
 });}
 var cover=document.getElementById("ht-detail-cover"),artKind=isMovie?"movies":"books";
 var sourceLink=document.createElement("a");sourceLink.id="ht-detail-art-credit";sourceLink.className="ht-detail-art-credit";
 sourceLink.textContent="Haunted Towne title illustration";
 var coverBox=cover.parentElement;if(coverBox)coverBox.appendChild(sourceLink);
 function applyArt(entry){
   if(entry&&entry.url){
     cover.src=entry.url;
     sourceLink.textContent="Artwork source: "+entry.source+" ↗";
     sourceLink.href=entry.credit||"";
     sourceLink.target="_blank";sourceLink.rel="noopener noreferrer";
   }else{
     cover.src=window.HTMediaSource?window.HTMediaSource.fallback(item.title,artKind):titleArt();
     sourceLink.textContent="Original Haunted Towne title illustration";
     sourceLink.removeAttribute("href");sourceLink.removeAttribute("target");
   }
 }
 cover.addEventListener("error",function(){
   if(cover.dataset.errorDone)return;cover.dataset.errorDone="yes";
   if(window.HTMediaSource)window.HTMediaSource.failed(artKind,id);
   applyArt(null);
 });
 if(window.HTMediaSource){
   applyArt(window.HTMediaSource.get(artKind,id));
   window.HTMediaSource.one(artKind,id).then(function(entry){if(entry&&!cover.dataset.errorDone)applyArt(entry);}).catch(function(){applyArt(null);});
 }else applyArt(null);
})();
