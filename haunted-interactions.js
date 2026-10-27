/* Consistent horror UI audio and artwork-only road navigation. No external sound service. */
(function(){
'use strict';
const effects=['heartbeat','bell','growl','sting','dread','boom'];
function effectFor(el){
 const text=((el.getAttribute('aria-label')||'')+' '+(el.textContent||'')+' '+(el.getAttribute('href')||'')).toLowerCase();
 if(/haunted road|#descent|road\//.test(text))return 'boom';
 if(/haunted towne|#home|index\.html/.test(text))return 'bell';
 if(/ghost|story|spirit/.test(text))return 'growl';
 if(/movie|horror|trailer/.test(text))return 'sting';
 if(/music|soundtrack/.test(text))return 'bell';
 if(/history|costume|decor/.test(text))return 'dread';
 const k=Math.abs(Array.from(text).reduce((a,c)=>((a*31+c.charCodeAt(0))|0),0));return effects[k%effects.length];
}
document.addEventListener('click',function(e){
 const el=e.target.closest('a,button');if(!el||e.defaultPrevented)return;
 if(el.closest('#ht-cinema-controls')||el.classList.contains('ht-journey-link')||el.matches('[disabled]'))return;
 window.HTCinema?.horrorEffect?.(effectFor(el));
},true);
function polishRoad(){
 document.querySelectorAll('.ht-road-hotspots a').forEach(a=>{
  if(a.dataset.htPolished)return;
  a.dataset.htPolished='true';
  a.setAttribute('title',a.getAttribute('aria-label')||'Explore this haunted location');
  a.innerHTML='<span class="ht-road-explore">Explore</span>';
 });
 document.querySelectorAll('.ht-road-mobile a').forEach(a=>{
  if(a.dataset.htPolished)return;a.dataset.htPolished='true';
  a.textContent=a.textContent.replace(/^\s*\d+\.\s*/,'');
 });
}
let busy=false;
const watcher=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{polishRoad();busy=false})});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{polishRoad();watcher.observe(document.getElementById('content')||document.body,{childList:true,subtree:true})});
else {polishRoad();watcher.observe(document.getElementById('content')||document.body,{childList:true,subtree:true})}
})();
