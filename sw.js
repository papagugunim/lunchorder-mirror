const V='lunch-v1';
const SHELL=['./','index.html','logo-mark.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  // 화면 파일: 네트워크 우선(4초), 실패 시 캐시
  e.respondWith(new Promise(res=>{
    const t=setTimeout(()=>caches.match(r).then(m=>m&&res(m)),4000);
    fetch(r).then(n=>{clearTimeout(t);const cp=n.clone();caches.open(V).then(c=>c.put(r,cp));res(n);})
    .catch(()=>{clearTimeout(t);caches.match(r).then(m=>res(m||Response.error()));});
  }));
});
