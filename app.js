const $=s=>document.querySelector(s),video=$('#player'),saveButton=$('#save-offline'),removeButton=$('#remove-offline'),status=$('#offline-status');
let registration,installPrompt;
const format=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function connection(){const online=navigator.onLine;$('#connection').textContent=online?'線上':'離線';}
connection();addEventListener('online',connection);addEventListener('offline',connection);
async function seek(t){if(video.readyState<1)await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',reject,{once:true});video.load();});video.currentTime=t;video.focus({preventScroll:true});try{await video.play();}catch{status.textContent='已跳至選定位置；請按影片播放鍵開始。';}}
$('#speed').addEventListener('change',e=>video.playbackRate=Number(e.target.value));
video.addEventListener('error',()=>{$('#video-error').hidden=false;$('#video-error').textContent='影片暫時無法載入。若正在離線使用，請先連網並完成「儲存離線影片」，或使用下方下載連結。';});
try{
 const res=await fetch('./data/lesson.json');if(!res.ok)throw Error('load');const data=await res.json();
 for(const [i,c] of data.chapters.entries()){
  const button=document.createElement('button');button.className='chapter';button.dataset.start=c.start;button.setAttribute('aria-label',`${c.title}，從${format(c.start)}開始`);
  const number=document.createElement('span');number.className='chapter-number';number.textContent=String(i+1).padStart(2,'0');const copy=document.createElement('span');copy.className='chapter-copy';const title=document.createElement('strong');title.textContent=c.title;const detail=document.createElement('small');detail.textContent=c.description;copy.append(title,detail);const time=document.createElement('span');time.className='chapter-time';time.textContent=format(c.start);button.append(number,copy,time);button.onclick=()=>seek(c.start).catch(()=>video.dispatchEvent(new Event('error')));$('#chapters').append(button);
 }
 for(const s of data.segments){const row=document.createElement('article');row.className='transcript-item';const b=document.createElement('button');b.textContent=format(s.start);b.setAttribute('aria-label',`播放：${s.title}`);b.onclick=()=>seek(s.start).catch(()=>video.dispatchEvent(new Event('error')));const copy=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=s.title;p.textContent=s.text;copy.append(h,p);row.append(b,copy);$('#transcript').append(row);}
 function active(){const buttons=[...document.querySelectorAll('.chapter')];buttons.forEach((b,i)=>{const on=video.currentTime>=Number(b.dataset.start)&&(i===buttons.length-1||video.currentTime<Number(buttons[i+1].dataset.start));if(on)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});}video.addEventListener('timeupdate',active);active();
}catch{$('#data-error').hidden=false;$('#data-error').textContent='教學文字暫時無法載入，影片仍可直接播放。請重新連線後再試。';}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#install').hidden=false;});
$('#install').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#install').hidden=true;};
addEventListener('appinstalled',()=>{$('#install').hidden=true;installPrompt=null;});
function workerMessage(type){return new Promise((resolve,reject)=>{const worker=navigator.serviceWorker.controller||registration?.active;if(!worker)return reject(Error('離線功能尚未準備完成，請稍後重試。'));const channel=new MessageChannel();const timeout=setTimeout(()=>reject(Error('儲存時間過長，請保持頁面開啟，稍後再次檢查。')),180000);channel.port1.onmessage=e=>{clearTimeout(timeout);channel.port1.close();e.data.ok?resolve(e.data):reject(Error(e.data.error||'無法完成操作'));};worker.postMessage({type},[channel.port2]);});}
async function refreshOffline(){const result=await workerMessage('STATUS');saveButton.textContent=result.cached?'重新儲存離線影片':'儲存離線影片';removeButton.hidden=!result.cached;status.textContent=result.cached?'離線影片已儲存，可在無網路時重新開啟播放。':'網頁已可離線開啟；完整影片尚未儲存。';}
saveButton.onclick=async()=>{saveButton.disabled=true;removeButton.disabled=true;status.textContent='正在儲存完整影片，請保持此頁開啟…';try{await workerMessage('CACHE_VIDEO');await refreshOffline();navigator.storage?.persist?.().catch(()=>{});}catch(e){status.textContent=`儲存未完成：${e.message}。請確認網路與可用空間，再重試。`;}finally{saveButton.disabled=false;removeButton.disabled=false;}};
removeButton.onclick=async()=>{removeButton.disabled=true;try{await workerMessage('REMOVE_VIDEO');await refreshOffline();}catch(e){status.textContent=e.message;}finally{removeButton.disabled=false;}};
if('serviceWorker'in navigator&&window.isSecureContext){
 try{registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});await navigator.serviceWorker.ready;saveButton.disabled=false;await refreshOffline();
  const showUpdate=()=>{if(registration.waiting&&navigator.serviceWorker.controller)$('#update').hidden=false;};showUpdate();registration.addEventListener('updatefound',()=>{const installing=registration.installing;installing?.addEventListener('statechange',()=>{if(installing.state==='installed')showUpdate();});});
  $('#update').onclick=()=>registration.waiting?.postMessage({type:'SKIP_WAITING'});let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!$('#update').hidden&&!refreshing){refreshing=true;location.reload();}});
 }catch{saveButton.textContent='離線功能暫不可用';status.textContent='請使用 HTTPS 網址或 localhost 開啟。一般線上影片仍可播放。';}
}else{saveButton.textContent='此環境不支援離線儲存';status.textContent='請透過 GitHub Pages 的 HTTPS 網址開啟；直接雙擊檔案無法啟用 PWA。';}
