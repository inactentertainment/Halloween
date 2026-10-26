/* Haunted Towne Phase 2: durable cover/poster lookup with provenance and safe fallbacks. No downloaded art files. */
(function(global){
 "use strict";
 var KEY="ht-media-source-v2",TTL=30*24*60*60*1000,RETRY=12*60*60*1000;
 var cache={books:{},movies:{}},watchers=[],active={books:false,movies:false},runs={books:null,movies:null};
 try{var x=JSON.parse(localStorage.getItem(KEY)||"{}");if(x&&x.books&&x.movies)cache=x;}catch(e){}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(cache));}catch(e){}}
 function clean(s){return String(s||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();}
 function titleOK(expected,actual){
   var a=clean(expected),b=clean(actual);
   return !!a&&(a===b || b.indexOf(a+" ")===0 || a.indexOf(b+" ")===0 && b.length>=Math.max(6,a.length*.80));
 }
 function authorOK(expected,names){
   var ref=clean(expected),last=ref.split(" ").slice(-1)[0],first=ref.split(" ")[0];
   if(!last||!names||!names.length)return false;
   return names.some(function(n){var x=clean(n);return x.split(" ").includes(last)&&(x.startsWith(first)||first.length<=1||x.includes(" "+first+" ")||x.includes(" "+first));});
 }
 function safeURL(url){
   if(typeof url!=="string")return"";
   if(url.startsWith("http://"))url="https://"+url.slice(7);
   if(!/^https:\/\//i.test(url))return"";
   try{var h=new URL(url).hostname.toLowerCase();if(h==="books.google.com"||h==="books.googleusercontent.com"||h.endsWith(".googleusercontent.com")||h==="covers.openlibrary.org"||h==="upload.wikimedia.org"||h==="commons.wikimedia.org"||h==="en.wikipedia.org")return url;}catch(e){}
   return "";
 }
 function get(kind,rank){
   var x=cache[kind]&&cache[kind][rank];if(!x)return null;
   if(x.url&&Date.now()-x.checked<TTL)return x;
   if(!x.url&&Date.now()-x.checked<RETRY)return x;
   return null;
 }
 function any(kind,rank){return cache[kind]&&cache[kind][rank]||null;}
 function put(kind,rank,entry){
   if(!cache[kind])cache[kind]={};
   cache[kind][rank]={url:entry.url||"",source:entry.source||"",credit:entry.credit||"",checked:Date.now(),error:!entry.url};
   save();notify(kind,rank);
 }
 function listen(fn){watchers.push(fn);return function(){watchers=watchers.filter(function(x){return x!==fn;});};}
 function notify(kind,rank){watchers.forEach(function(fn){try{fn(kind,rank,any(kind,rank));}catch(e){}});}
 function stats(kind){var list=kind==="books"?CATALOG.books:CATALOG.movies,real=0,missing=0,pending=0;for(var i=0;i<list.length;i++){var x=get(kind,list[i].rank);if(!x)pending++;else if(x.url)real++;else missing++;}return{total:list.length,real:real,missing:missing,pending:pending,running:active[kind]};}
 function timeoutSignal(ms){return typeof AbortSignal!=="undefined"&&AbortSignal.timeout?AbortSignal.timeout(ms):undefined;}
 async function googleBook(book){
   var q="intitle:"+book.title+" inauthor:"+book.author;
   var url="https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=10&q="+encodeURIComponent(q);
   var res=await fetch(url,{signal:timeoutSignal(9000)});
   if(!res.ok)throw Error("Google Books response "+res.status);
   var data=await res.json();
   var ranked=(data.items||[]).map(function(v){
     var info=v.volumeInfo||{},links=info.imageLinks||{};
     if(!titleOK(book.title,info.title)||!authorOK(book.author,info.authors)||!links.thumbnail)return null;
     return{url:safeURL(links.medium||links.small||links.thumbnail||links.smallThumbnail),source:"Google Books",credit:info.infoLink||"https://books.google.com/",score:(clean(book.title)===clean(info.title)?8:2)+(links.medium?3:0)+(info.language==="en"?2:0)};
   }).filter(function(x){return x&&x.url;}).sort(function(a,b){return b.score-a.score;});
   return ranked[0]||null;
 }
 var lastOpenLibrary=0;
 async function openLibraryBook(book){
   // Secondary low-volume fallback; Open Library's published limit for browser clients is 1 request/sec.
   var gap=Date.now()-lastOpenLibrary;
   if(gap<1200)await new Promise(function(resolve){setTimeout(resolve,1200-gap);});
   lastOpenLibrary=Date.now();
   var url="https://openlibrary.org/search.json?title="+encodeURIComponent(book.title)+"&author="+encodeURIComponent(book.author)+"&limit=5&fields=title,author_name,cover_i,key";
   var res=await fetch(url,{signal:timeoutSignal(11000)});
   if(!res.ok)throw Error("Open Library response "+res.status);
   var data=await res.json();
   var x=(data.docs||[]).find(function(v){return Number.isInteger(v.cover_i)&&titleOK(book.title,v.title)&&authorOK(book.author,v.author_name);});
   if(!x)return null;
   return{url:"https://covers.openlibrary.org/b/id/"+x.cover_i+"-M.jpg?default=false",source:"Open Library",credit:"https://openlibrary.org"+(x.key||"")};
 }
 async function lookupBook(book){
   var candidate=null;
   try{candidate=await googleBook(book);}catch(e){}
   if(!candidate){try{candidate=await openLibraryBook(book);}catch(e){}}
   put("books",book.rank,candidate||{url:""});return candidate;
 }
 function wikiAliases(x,stage){
   var title=x.title.replace(/\s+\(\d{4}\s+film\)$/i,"").trim();
   if(stage===0)return [title+" ("+x.year+" film)",title+" ("+x.year+" movie)"];
   if(stage===1)return [title+" (film)",title+" ("+x.year+")"];
   return[];
 }
 function wikipediaRequest(titles){
   var endpoint="https://en.wikipedia.org/w/api.php";
   var query="origin=*&action=query&format=json&formatversion=2&redirects=1&prop=pageimages&piprop=thumbnail%7Cname&pilicense=any&pithumbsize=380&titles="+encodeURIComponent(titles.join("|"));
   return fetch(endpoint+"?"+query,{signal:timeoutSignal(13000)}).then(function(r){if(!r.ok)throw Error("Wikipedia response "+r.status);return r.json();});
 }
 function canonicalRedirects(result){
   var mapping={};
   (result.query?.normalized||[]).concat(result.query?.redirects||[]).forEach(function(r){mapping[clean(r.from)]=r.to;});
   return function(title){var x=title,visited={};for(var i=0;i<5;i++){var k=clean(x);if(!mapping[k]||visited[k])break;visited[k]=true;x=mapping[k];}return clean(x);};
 }
 async function lookupMovieBatch(batch,stage){
   var query=[];
   batch.forEach(function(x){wikiAliases(x,stage).forEach(function(s){query.push(s);});});
   if(!query.length)return[];
   var response=await wikipediaRequest(query),pages=response.query?.pages||[],resolve=canonicalRedirects(response);
   var found=[];
   batch.forEach(function(x){
     var aliases=wikiAliases(x,stage).map(resolve);
     var strictKey=clean(x.title)+" "+x.year+" film";
     var matched=pages.find(function(p){if(p.missing||!p.thumbnail?.source)return false;
       var n=clean(p.title),yes=aliases.includes(n);if(!yes)return false;
       // Do not reuse a generic (film) result for titles with multiple versions in the list.
       var duplicate=CATALOG.movies.filter(function(y){return clean(y.title)===clean(x.title);}).length>1;
       if(duplicate&&!n.includes(String(x.year)))return false;
       // Require the publication to actually be a film article rather than a generic book or concept page.
       return n.includes("film")||n.includes("movie")||n.includes(String(x.year));
     });
     if(matched){
       var url=safeURL(matched.thumbnail.source);
       if(url)found.push({rank:x.rank,url:url,source:"Wikipedia",credit:"https://en.wikipedia.org/wiki/"+encodeURIComponent(matched.title.replace(/ /g,"_"))});
     }
   });
   return found;
 }
 async function resolveMovieBatch(batch){
   var done={};
   for(var stage=0;stage<2;stage++){
     var queue=batch.filter(function(x){return !done[x.rank];});
     if(!queue.length)break;
     try{var found=await lookupMovieBatch(queue,stage);found.forEach(function(x){done[x.rank]=x;});}catch(e){}
   }
   batch.forEach(function(x){put("movies",x.rank,done[x.rank]||{url:""});});
 }
 async function begin(kind){
   if(active[kind])return runs[kind];
   active[kind]=true;notify(kind,0,null);
   var rows=(kind==="books"?CATALOG.books:CATALOG.movies).filter(function(x){return !get(kind,x.rank);});
   if(kind==="books"){
     // Bounded concurrency; no backend, authentication, or paid service.
     var cursor=0;var runner=async function(){while(cursor<rows.length){var x=rows[cursor++];await lookupBook(x);}};
     runs[kind]=Promise.all([runner(),runner(),runner()]);
   }else{
     runs[kind]=(async function(){for(var i=0;i<rows.length;i+=16){await resolveMovieBatch(rows.slice(i,i+16));}})();
   }
   try{await runs[kind];}finally{active[kind]=false;notify(kind,0,null);}
   return stats(kind);
 }
 function fallback(title,kind){
   var chunks=String(title).trim().split(/\s+/),lines=[],line="";
   chunks.forEach(function(w){if((line+" "+w).trim().length>19){lines.push(line);line=w;}else line=(line+" "+w).trim();});
   if(line)lines.push(line);lines=lines.filter(Boolean).slice(0,5);
   var label=kind==="books"?"HORROR LIBRARY":"HORROR CINEMA";
   var width=320,height=480,esc=function(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");};
   var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 320 480"><defs><radialGradient id="a"><stop stop-color="#6b192c"/><stop offset="1" stop-color="#070406"/></radialGradient></defs><rect width="320" height="480" fill="url(#a)"/><rect x="14" y="14" width="292" height="452" rx="15" stroke="#9d3b50" stroke-width="3" fill="none"/><path d="M145 49l-9 28-25 6 16 17-5 26 24-11 22 13-4-26 16-17-27-6z" fill="#da6548"/><path d="M90 171l60 29-57 25 15-27zm140 0-60 29 57 25-15-27zM104 242q56 40 112 0-18 34-54 36-36-3-58-36z" fill="#060304"/><path d="M67 300h186" stroke="#ce765c" stroke-width="3"/>'+lines.map(function(t,i){return '<text x="160" y="'+(340+i*27)+'" text-anchor="middle" font-family="Georgia,serif" font-size="'+(lines.length>=4?18:21)+'" fill="#fbe7de">'+esc(t)+'</text>';}).join("")+'<text x="160" y="452" text-anchor="middle" font-family="sans-serif" font-size="12" letter-spacing="3" fill="#f4ac97">'+label+'</text></svg>';
   return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
 }
 function failed(kind,rank){if(cache[kind]?.[rank]){delete cache[kind][rank];save();}}
 global.HTMediaSource={begin:begin,get:get,any:any,stats:stats,listen:listen,failed:failed,fallback:fallback,clean:clean,titleOK:titleOK,authorOK:authorOK,lookupMovieBatch:lookupMovieBatch};
})(window);
