/* Mature horror experiences, no frameworks or external services. */
(function(){
'use strict';
const scenes=['grave','witch','hollow','clock','carnival','school','asylum','bridge','cathedral'];
const captions=['The stones seem to breathe beneath the fog.','Something circles inside the smoke.','Every house watches from the dark.','The thirteenth hour refuses to pass.','The carnival remembers its final scream.','Chalk scratches across an empty blackboard.','The walls have kept every confession.','Voices rise from the water below.','The last bell waits to be struck.'];
const sounds=[92,135,115,75,176,225,66,112,58];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const count=(id)=>{try{const key='ht-mature-'+id,n=Math.min(99,Number(localStorage.getItem(key)||0)+1);localStorage.setItem(key,n);return n}catch{return 1}};
function play(f,x=.5){if(window.HTCinema?.preferences.sound)HTCinema.tone(f,x)}
function animate(el,tag){if(!el||reduced.matches)return;el.classList.remove('ht-scene-reveal');el.dataset.htSceneEffect=tag;void el.offsetWidth;el.classList.add('ht-scene-reveal')}
function showStory(){if(!location.pathname.endsWith('story.html'))return;let m=location.hash.match(/^#chapter-([0-8])$/);const main=document.querySelector('main');if(!main)return;if(!m){main.removeAttribute('data-ht-scene');return;}const i=Number(m[1]);main.dataset.htScene=scenes[i];let note=main.querySelector('.ht-atmosphere-caption');if(!note){note=document.createElement('p');note.className='ht-atmosphere-caption';main.querySelector('h1')?.insertAdjacentElement('afterend',note)}note.textContent=captions[i];animate(main.querySelector('.panel'),scenes[i]);}
function games(){if(location.hash!=='#games')return;const mapping=[['quiz-place','ink'],['candy-result','pulse'],['name-result','whisper'],['bingo-board','stamp'],['ht-cursed-relic','rune']];for(const [id,style] of mapping){const el=document.getElementById(id);if(el)el.dataset.htGameEffect=style;}
const quiz=document.getElementById('quiz-place');if(quiz&&!quiz.dataset.fxBound){quiz.dataset.fxBound='1';quiz.addEventListener('click',e=>{if(e.target.closest('button')){animate(quiz,'ink');play(130,.2);count('quiz')}})}
const name=document.getElementById('name-button');if(name&&!name.dataset.fxBound){name.dataset.fxBound='1';name.addEventListener('click',()=>{animate(document.getElementById('name-result'),'whisper');play(176,.8);count('name')})}
const bingo=document.getElementById('bingo-new');if(bingo&&!bingo.dataset.fxBound){bingo.dataset.fxBound='1';bingo.addEventListener('click',()=>{animate(document.getElementById('bingo-board'),'stamp');play(205,.4);count('bingo')})}
const relic=document.getElementById('ht-cursed-relic');if(relic&&!relic.dataset.fxBound){relic.dataset.fxBound='1';relic.addEventListener('click',()=>{animate(relic,'rune');play(75,.5);count('relic')})}
const visitors=document.getElementById('visitors');if(visitors&&!visitors.dataset.fxBound){visitors.dataset.fxBound='1';visitors.addEventListener('change',()=>{animate(document.getElementById('candy-result'),'pulse');play(105,.5)})}
}
document.addEventListener('click',e=>{if(!location.pathname.endsWith('story.html'))return;const b=e.target.closest('[data-option]');if(!b)return;const m=location.hash.match(/^#chapter-([0-8])$/);if(!m)return;const i=Number(m[1]);count('chapter-'+i+'-choice');animate(document.querySelector('main .panel'),scenes[i]);play(sounds[i],Number(b.dataset.option));});
window.addEventListener('hashchange',()=>requestAnimationFrame(()=>{showStory();games()}));
if(location.pathname.endsWith('index.html')||location.pathname.endsWith('/')){const root=document.getElementById('content');if(root){const o=new MutationObserver(()=>{if(location.hash==='#games')games()});o.observe(root,{childList:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{showStory();games()});else{showStory();games()}
})();
