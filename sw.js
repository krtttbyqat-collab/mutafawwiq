const V='mtf-v2';
const SHELL=['./','index.html','icon.svg','icon-192.png','icon-512.png','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp)).catch(()=>{})}
      return r;
    }).catch(()=>hit);
    return hit||net;
  }));
});
