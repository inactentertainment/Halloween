/* Haunted Towne reader controls: on-device speech, optional unsettling audio and adjustable text. */
(function(){
 "use strict";
 var key="ht-reader-settings-v1",settings={size:1,mood:1,effects:false,voice:""};
 try{settings=Object.assign(settings,JSON.parse(localStorage.getItem(key)||"{}"));}catch(e){}
 var synth=("speechSynthesis" in window)?window.speechSynthesis:null;
 var audioContext=null,speaking=false,paused=false,readerParts=[],readerIndex=0,readToken=0,utterance=null;
 var bar=document.createElement("div");bar.id="ht-reader-toolbar";
 bar.setAttribute("role","region");bar.setAttribute("aria-label","Reading and atmosphere controls");
 bar.innerHTML='<div class="ht-reader-inner"><span class="ht-reader-label">☾ NIGHT READER</span>'+
 '<button type="button" data-read="start" title="Read this section aloud">▶ Listen</button>'+
 '<button type="button" data-read="pause" title="Pause or resume reading">Ⅱ Pause</button>'+
 '<button type="button" data-read="stop" title="Stop reading">■ Stop</button>'+
 '<span class="ht-reader-break" aria-hidden="true"></span>'+
 '<button type="button" data-read="smaller" aria-label="Reduce reading text size">A−</button>'+
 '<button type="button" data-read="larger" aria-label="Increase reading text size">A+</button>'+
 '<button type="button" data-read="mood" title="Adjust the page atmosphere">Dread: <b id="ht-mood-label"></b></button>'+
 '<button type="button" data-read="fx" title="Turn optional spooky click sounds on or off">FX <b id="ht-fx-label"></b></button>'+
 '<label for="ht-voice-select" class="ht-voice-label">Voice</label><select id="ht-voice-select" aria-label="Choose a narration voice"><option value="">British voice if available</option></select>'+
 '<span id="ht-reader-status" role="status" aria-live="polite" class="ht-reader-status"></span></div>';
 document.body.appendChild(bar);
 document.body.classList.add("ht-reader-page");
 var voiceSelect=bar.querySelector("#ht-voice-select");
 function remember(){try{localStorage.setItem(key,JSON.stringify(settings));}catch(e){}}
 function setStatus(message){bar.querySelector("#ht-reader-status").textContent=message;}
 function setMood(){document.documentElement.setAttribute("data-ht-mood",String(settings.mood));bar.querySelector("#ht-mood-label").textContent=["Low","Medium","High"][settings.mood];}
 function setEffects(){bar.querySelector("#ht-fx-label").textContent=settings.effects?"On":"Off";}
 function setSize(){document.documentElement.style.setProperty("--ht-reader-size",String(settings.size));}
 function populateVoices(){
   if(!synth)return;
   var voices=synth.getVoices()||[],previous=voiceSelect.value||settings.voice,seen={};
   voiceSelect.innerHTML='<option value="">British English (auto)</option>';
   voices.filter(function(v){return v.lang&&v.lang.toLowerCase().startsWith("en");})
   .sort(function(a,b){return Number(b.lang.toLowerCase().startsWith("en-gb"))-Number(a.lang.toLowerCase().startsWith("en-gb"));})
   .forEach(function(v){var id=v.voiceURI||v.name;if(seen[id])return;seen[id]=true;var o=document.createElement("option");o.value=id;o.textContent=v.name+" ("+v.lang+")";voiceSelect.appendChild(o);});
   if(previous&&Array.from(voiceSelect.options).some(function(o){return o.value===previous;}))voiceSelect.value=previous;
 }
 function preferredVoice(){
   var list=synth?synth.getVoices():[],selected=voiceSelect.value||settings.voice;
   return list.find(function(x){return (x.voiceURI||x.name)===selected;})||
   list.find(function(x){return x.lang.toLowerCase()==="en-gb"&&/daniel|george|oliver|ryan|male/i.test(x.name);})||
   list.find(function(x){return x.lang.toLowerCase()==="en-gb";})||null;
 }
 function articleRoot(){
   var main=document.querySelector("main");
   if(!main)return document.body;
   if(location.pathname.endsWith("history.html")){
     var sections=Array.from(document.querySelectorAll("#sections .section"));
     var closest=sections.filter(function(s){return s.getBoundingClientRect().bottom>60;})[0];
     return closest||main;
   }
   if(location.pathname.endsWith("story.html"))return main.querySelector(".panel")||main;
   if(location.pathname.endsWith("detail.html"))return main.querySelector(".ht-detail-content")||main;
   return main;
 }
 function currentText(){
   var root=articleRoot();return Array.from(root.querySelectorAll("h1,h2,h3,p,li"))
   .filter(function(x){return !x.closest("button,a,nav,.ht-actions,.ht-reader-inner,.section-nav")&&x.offsetParent!==null;})
   .map(function(x){return (x.innerText||x.textContent||"").trim();})
   .filter(Boolean).join(". ");
 }
 function splitSpeech(text){
   // Use small utterances to make pausing and long articles more reliable on mobile.
   var sentences=text.replace(/\s+/g," ").match(/[^.!?]+[.!?]*/g)||[text],chunks=[],buf="";
   for(var i=0;i<sentences.length;i++){var s=sentences[i].trim();if(!s)continue;
     if(buf.length+s.length>180&&buf){chunks.push(buf);buf="";}
     buf+=(buf?" ":"")+s;
     while(buf.length>260){chunks.push(buf.slice(0,210));buf=buf.slice(210);}
   }if(buf)chunks.push(buf);return chunks;
 }
 function halt(){
   readToken++;speaking=false;paused=false;readerParts=[];readerIndex=0;
   if(synth)synth.cancel();setStatus("Stopped");
 }
 function speakNext(token){
   if(token!==readToken||!speaking||paused)return;
   if(readerIndex>=readerParts.length){speaking=false;setStatus("Finished");return;}
   var u=new SpeechSynthesisUtterance(readerParts[readerIndex++]);
   u.lang="en-GB";u.rate=.92;u.pitch=.84;
   var voice=preferredVoice();if(voice)u.voice=voice;
   utterance=u;u.onend=function(){if(token===readToken&&!paused)speakNext(token);};
   u.onerror=function(){if(token===readToken){speaking=false;setStatus("Audio unavailable");}};
   synth.speak(u);
 }
 function startReading(){
   if(!synth||typeof SpeechSynthesisUtterance==="undefined"){setStatus("This browser does not support narration");return;}
   halt();
   readerParts=splitSpeech(currentText());if(!readerParts.length){setStatus("No text found");return;}
   readerIndex=0;speaking=true;paused=false;setStatus("Reading aloud");
   speakNext(readToken);
 }
 function pauseReading(){
   if(!synth||!speaking)return;
   if(paused){paused=false;synth.resume();setStatus("Reading aloud");if(!synth.speaking&&!synth.pending)speakNext(readToken);}
   else{paused=true;synth.pause();setStatus("Paused");}
 }
 function spookyClick(){
   if(!settings.effects)return;
   try{
     audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();
     if(audioContext.state==="suspended")audioContext.resume();
     var t=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain(),filter=audioContext.createBiquadFilter();
     osc.type="sawtooth";osc.frequency.setValueAtTime(360,t);osc.frequency.exponentialRampToValueAtTime(73,t+.55);
     filter.type="lowpass";filter.frequency.value=600;
     gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.036,t+.035);gain.gain.exponentialRampToValueAtTime(.0001,t+.56);
     osc.connect(filter);filter.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+.57);
   }catch(e){}
 }
 function adjustFooter(){
   var footer=document.querySelector("footer");if(!footer)return;
   var distance=footer.getBoundingClientRect().top;
   bar.style.bottom=Math.max(0,window.innerHeight-distance+5)+"px";
 }
 bar.addEventListener("click",function(e){
   var b=e.target.closest("[data-read]");if(!b)return;
   switch(b.dataset.read){
     case"start":startReading();break;
     case"pause":pauseReading();break;
     case"stop":halt();break;
     case"smaller":settings.size=Math.max(.85,Math.round((settings.size-.1)*100)/100);setSize();break;
     case"larger":settings.size=Math.min(1.5,Math.round((settings.size+.1)*100)/100);setSize();break;
     case"mood":settings.mood=(settings.mood+1)%3;setMood();spookyClick();break;
     case"fx":settings.effects=!settings.effects;setEffects();if(settings.effects)spookyClick();break;
   }
   remember();adjustFooter();
 });
 voiceSelect.addEventListener("change",function(){settings.voice=voiceSelect.value;remember();if(speaking)startReading();});
 // Transitions play only after the user turns effects on; no autoplay sounds.
 document.addEventListener("click",function(e){
   if(e.target.closest("#ht-reader-toolbar"))return;
   if(e.target.closest("[data-next],[data-prev],[data-jump],[data-option],[data-ht-choice],.chapter-link,.toc-list button,.section-nav button")) {
     spookyClick();
     var main=document.querySelector("main");if(main&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){main.classList.remove("ht-spooky-shift");void main.offsetWidth;main.classList.add("ht-spooky-shift");}
   }
 },true);
 window.addEventListener("hashchange",function(){halt();});
 window.addEventListener("pagehide",halt);
 window.addEventListener("scroll",adjustFooter,{passive:true});
 window.addEventListener("resize",adjustFooter);
 if(synth){populateVoices();if(synth.addEventListener)synth.addEventListener("voiceschanged",populateVoices);}
 else voiceSelect.disabled=true;
 setMood();setSize();setEffects();adjustFooter();
})();
