/* Locked art direction: The Descent + Cursed Anime Nightmare, haunted Victorian + Damned Carnival.
   Restrained gothic, rare cosmic horror. All graphics local SVGs. */
(function(){
'use strict';
const oldHome=home,oldDescent=descent;
home=function(){
 let s=oldHome();
 s=s.replace('WELCOME TO<br><strong class="highlight">HAUNTED TOWNE</strong>','WELCOME TO<br><strong class="highlight">HAUNTED TOWNE</strong>');
 s=s.replace('One forgotten road. Nine chilling destinations. Countless Halloween discoveries. Explore original stories, free games, recipes, costumes, movies, books and frightening fun.','For those who never outgrew Halloween. Enter a haunted Victorian town, escape the carnival of the damned, and descend into a nightmare beneath the graves. Horror stories, movies, interactive mysteries and unforgettable discoveries.');
 const oldArt=/<div class="placeholder-art">[\s\S]*?<\/div><\/div><\/section>/;
 s=s.replace(oldArt,'<a class="ht-scene-panel" href="#descent" aria-label="Descend into the buried passage"><img src="./assets/scene-descent.svg" loading="lazy" decoding="async" alt="Deep blood-red tunnel descending beneath the haunted town"><span>THE ROAD DOES NOT END HERE · DESCEND</span></a></div></section>');
 s=s.replace('The visual journey is a working placeholder until the continuous artwork is finalized.','Begin at the haunted gates. Pass the abandoned carnival. Then follow the buried stairway into darkness.');
 s=s.replace('🏚️ 🧙 🌫️ 🎪 ⛪','');
 return s;
};
descent=function(){
 let s=oldDescent();
 s=s.replace('These atmospheric placeholders will give way to your hand-designed continuous background.','Three connected nightmare environments are illustrated now: the haunted town gates, the damned carnival, and the buried descent. The chapter locations remain playable.');
 s=s.replace('<div class="descent">'+roadSVG(),'<div class="ht-descent-chapters"><div class="ht-nightmare-sequence"><img src="./assets/scene-gates.svg" loading="lazy" alt="Haunted Victorian town behind cemetery gates"><img src="./assets/scene-carnival.svg" loading="lazy" alt="Blood-red carnival and abandoned Ferris wheel"><img src="./assets/scene-descent.svg" loading="lazy" alt="A terrifying underground burial tunnel"></div><div class="descent">'+roadSVG());
 s=s.replace('</div><div class="wrap" style="padding:30px 0 55px;text-align:center">','</div></div><div class="wrap" style="padding:30px 0 55px;text-align:center">');
 return s;
};
})();
