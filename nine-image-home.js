/* Canonical nine-image cinematic home. Independent cards, independent links. */
(function(){
'use strict';
const dest=[
 ['Ghost Stories','./story.html'],['Movies & Trailers','#movies'],['Horror Books','#books'],
 ['Costumes','#costumes'],['Masks','#masks'],['Decor','#decor'],
 ['Fun & Games','#games'],['Free Downloads','#downloads']
];
home=function(){
const cards=dest.map(([name,url],i)=>'<a class="ht9-tile" href="'+url+'" aria-label="'+name+'"><img src="./assets/haunted-card-'+(i+1)+'.webp" alt="'+name+'" loading="lazy" width="370" height="370"></a>').join('');
return '<section class="ht9-home" aria-label="Haunted Towne">'+
 '<div class="ht9-backdrop"><img class="ht9-art" src="./assets/haunted-background.webp" alt="Haunted Towne Victorian mansion, carnival, reaching apparition and one continuous descent down ancient stairs" width="1024" height="1536" fetchpriority="high">'+
 '<nav class="ht9-cards" aria-label="Haunted destinations">'+cards+'</nav>'+
 '<div class="ht9-path"><a href="./history.html">The History of Halloween</a><a href="./story.html">Ghost Stories — Enter If You Will</a><a href="#descent">Travel Along the Haunted Road</a></div>'+
 '</div></section>';
};
})();