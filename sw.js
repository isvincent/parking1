const VERSION='2026-11-09-v1';
const BASE=new URL('./',self.location.href);
// Include the deployment path in cache names: sibling GitHub Pages projects stay isolated.
const PREFIX=`parking-pwa:${BASE.pathname}:`,SHELL=`${PREFIX}shell:${VERSION}`,MEDIA=`${PREFIX}media:${VERSION}`;
const url=p=>new URL(p,BASE).href,VIDEO=url('media/parking.mp4');
const SHELL_FILES=['./','index.html','styles.css','app.js','manifest.webmanifest','data/lesson.json','media/poster.png','media/parking.vtt','media/parking.srt','README.md','assets/icons/icon.svg','assets/icons/icon-192.png','assets/icons/icon-512.png','assets/icons/maskable-512.png','assets/icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll(SHELL_FILES.map(url))));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==SHELL&&key!==MEDIA)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING'){self.skipWaiting();return;}const port=event.ports[0];if(!port)return;event.waitUntil((async()=>{try{const cache=await caches.open(MEDIA);switch(event.data?.type){case'STATUS':port.postMessage({ok:true,cached:!!await cache.match(VIDEO)});return;case'CACHE_VIDEO':{const response=await fetch(VIDEO,{cache:'reload'});if(!response.ok||response.status!==200)throw Error('影片下載失敗');await cache.put(VIDEO,response);port.postMessage({ok:true,cached:true});return;}case'REMOVE_VIDEO':await cache.delete(VIDEO);port.postMessage({ok:true,cached:false});return;default:throw Error('不支援的操作');}}catch(error){port.postMessage({ok:false,error:error.name==='QuotaExceededError'?'裝置儲存空間不足':error.message});}})());});
async function videoResponse(request){const cache=await caches.open(MEDIA),cached=await cache.match(VIDEO);if(!cached)return fetch(request);const range=request.headers.get('range');if(!range)return cached;
 const buffer=await cached.arrayBuffer(),size=buffer.byteLength,match=/^bytes=(\d*)-(\d*)$/.exec(range);const invalid=()=>new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`,'Accept-Ranges':'bytes'}});
 if(!match||(!match[1]&&!match[2]))return invalid();let start,end;
 if(!match[1]){const suffix=Number(match[2]);if(!suffix)return invalid();start=Math.max(0,size-suffix);end=size-1;}else{start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),size-1):size-1;}
 if(start>=size||start>end||!Number.isSafeInteger(start)||!Number.isSafeInteger(end))return invalid();
 return new Response(buffer.slice(start,end+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':'video/mp4','Content-Length':String(end-start+1),'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes'}});
}
self.addEventListener('fetch',event=>{const request=event.request,target=new URL(request.url);if(request.method!=='GET'||target.origin!==BASE.origin||!target.pathname.startsWith(BASE.pathname))return;
 if(target.href===VIDEO){event.respondWith(videoResponse(request).catch(()=>new Response('影片未儲存，請先連網並儲存離線影片。',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));return;}
 if(request.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(SHELL);try{return await fetch(request);}catch{return await cache.match(url('index.html'))||Response.error();}})());return;}
 event.respondWith((async()=>{const cache=await caches.open(SHELL),cached=await cache.match(request,{ignoreSearch:true});return cached||fetch(request);})());
});
