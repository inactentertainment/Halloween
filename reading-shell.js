/* Standalone reading pages share compact navigation and footer. */
(function(){
'use strict';
const page=location.pathname.toLowerCase(),isHistory=page.endsWith('history.html'),isStory=page.endsWith('story.html');
if(!isHistory&&!isStory)return;
const links=[['⌂','Home','./index.html#home'],['▤','The History of Halloween','./history.html'],['☠','Ghost Story','./story.html'],['▣','Movies','./index.html#movies'],['♫','Music','./index.html#music'],['▥','Books','./index.html#books'],['♜','Costumes','./index.html#costumes'],['☷','Masks','./index.html#masks'],['♛','Decor','./index.html#decor'],['♠','Fun & Games','./index.html#games'],['↓','Free Downloads','./index.html#downloads'],['⚑','Events','./index.html#events']];
function setUp(){
 if(document.querySelector('.ht-article-topbar'))return;
 const top=document.createElement('header');top.className='ht-article-topbar';
 top.innerHTML='<a class="ht-article-home" href="./index.html#home"><span>HAUNTED</span> <em>TOWNE</em></a><button class="ht-article-menu" type="button" aria-controls="ht-article-nav" aria-expanded="false">☰ <span>Menu</span></button><nav id="ht-article-nav" aria-label="Site navigation">'+links.map(([icon,name,url])=>'<a href="'+url+'"><span aria-hidden="true">'+icon+'</span> '+name+'</a>').join('')+'</nav>';
 document.body.insertBefore(top,document.body.firstChild);
 const button=top.querySelector('button');button.onclick=function(){const opened=top.classList.toggle('expanded');button.setAttribute('aria-expanded',String(opened))};
 const foot=document.querySelector('footer');if(foot){foot.classList.add('ht-article-footer');foot.innerHTML='<div><a href="./index.html#home">HAUNTED <strong>TOWNE</strong></a><span>The Darker Side of Halloween · InAct Entertainment LLC</span></div><nav><a href="./index.html#about">About</a><a href="./index.html#privacy">Privacy</a><a href="./index.html#affiliate">Affiliate Disclosure</a><a href="./index.html#terms">Terms</a></nav>';}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setUp);else setUp();
})();
