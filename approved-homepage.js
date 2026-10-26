/* Final approved homepage artwork: the user's actual full-resolution reference rendered in browser.
   Desktop uses accurate invisible hit targets; mobile retains accessible live controls. */
(function(){
'use strict';
const previousHome=home;
home=function(){
 const mobile=previousHome();
 const zones=[
 ['Home','#home',5,9.5,7,4.4],['Halloween History','./history.html',12,9.5,12,4.4],
 ['Ghost Stories','./story.html',24,9.5,10,4.4],['Movies','#movies',23,3.1,6,4.6],
 ['Movies and Trailers','#movies',15,59,12,14],['Horror Books','#books',28,59,12,14],
 ['Costumes','#costumes',40.2,9.5,10.7,4.5],['Masks','#masks',50.9,9.5,9,4.5],
 ['Decor','#decor',59.5,9.5,8.4,4.5],['Fun & Games','#games',68,9.5,11.6,4.5],
 ['Free Downloads','#downloads',79.5,9.5,12.8,4.5],['About','#about',91.5,9.5,6,4.5],
 ['Ghost Stories','./story.html',1.4,59,13,14],['Costumes','#costumes',40.5,59,11.5,14],
 ['Masks','#masks',52.3,59,10.5,14],['Decor','#decor',63.2,59,11.6,14],
 ['Fun & Games','#games',75.3,59,11.8,14],['Free Downloads','#downloads',87.3,59,11.1,14],
 ['Enter the nightmare','./story.html',63.2,29,28,5],
 ['Descent into the nightmare','#descent',37,76,29,8],
 ['The Haunted Road','#descent',26,84,48,15],
 ['Men Costumes','#shop-guide/costumes/0',40.2,14,11.2,2.8],
 ['Women Costumes','#shop-guide/costumes/1',40.2,16.8,11.2,2.8],
 ['Boys Costumes','#shop-guide/costumes/2',40.2,19.6,11.2,2.8],
 ['Girls Costumes','#shop-guide/costumes/3',40.2,22.4,11.2,2.8],
 ['Groups and Couples','#shop-guide/costumes/4',40.2,25.2,11.2,2.8]
 ];
 const hotspots=zones.map(([label,href,x,y,w,h])=>'<a class="ht-real-hit" href="'+href+'" title="'+label+'" aria-label="'+label+'" style="left:'+x+'%;top:'+y+'%;width:'+w+'%;height:'+h+'%"><span>'+label+'</span></a>').join('');
 return '<div class="ht-approved-home"><div class="ht-approved-stage"><img class="ht-approved-art" src="./assets/homepage-approved.webp" alt="Haunted Towne cinematic horror: Victorian mansion, nightmarish apparition, carnival clown, collector masks, and burial descent" fetchpriority="high" decoding="async" width="1536" height="1024">'+hotspots+'</div><div class="ht-approved-mobile">'+mobile+'</div></div>';
};
const originalNavigate=navigate;
navigate=function(scroll=true){originalNavigate(scroll);document.body.classList.toggle('ht-on-approved-home',view()==='home')};
})();
