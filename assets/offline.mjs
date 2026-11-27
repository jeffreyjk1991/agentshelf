// Static-only service worker. No API requests, personal prompts or shared URL fragments are cached.
const CACHE='aibin-public-v1',SHELL=['/','/make-agent','/my-agents','/offline.html','/manifest.webmanifest','/agent-experience.json','/assets/experience.mjs','/assets/experience-core.mjs','/assets/experience.css','/assets/style.css','/assets/future.css','/assets/marketplace.css','/assets/main.js','/assets/task-search.mjs','/assets/my-agents.mjs','/assets/referral-source.mjs','/assets/nocode.mjs','/assets/ready-agents.mjs','/assets/chat-launch.mjs','/assets/chat-fit.mjs','/assets/prompt-engine.mjs','/assets/schedule-engine.mjs','/assets/community-cards.mjs','/assets/icon.svg','/assets/icon-192.png','/assets/icon-512.png','/assets/provider-chatgpt.svg','/assets/provider-claude.svg','/assets/provider-gemini.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(path=>new Request(path,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('aibin-public-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request,u=new URL(req.url);
 if(req.method!=='GET'||u.origin!==self.location.origin||u.search||u.pathname.startsWith('/api/')||u.pathname==='/shared-agent'||u.pathname==='/community'||u.pathname==='/creators')return;
 const navigation=req.mode==='navigate';
 if(navigation&&!(/^\/(?:agents|tools|automations|live-agents)\/[a-z0-9-]+\/?$/.test(u.pathname)||['/','/make-agent','/my-agents','/offline.html'].includes(u.pathname)))return;
 if(!navigation&&!/^\/assets\/[a-zA-Z0-9_.-]+$/.test(u.pathname)&&!['/agent-experience.json','/manifest.webmanifest'].includes(u.pathname))return;
 e.respondWith((async()=>{
  const c=await caches.open(CACHE);
  try{const r=await fetch(req);if(r.ok&&r.type==='basic'&&!r.redirected){
    if(navigation||u.pathname.startsWith('/assets/')||u.pathname==='/agent-experience.json'){
     try{await c.put(req,r.clone());const pages=(await c.keys()).filter(k=>!SHELL.includes(new URL(k.url).pathname)&&!new URL(k.url).pathname.startsWith('/assets/'));if(pages.length>60)await c.delete(pages[0]);}catch{/* Cache quota must not block a successful network response. */}
    }
   }return r;
  }catch{return await c.match(req)|| (navigation?await c.match('/offline.html'):Response.error());}
 })());
});
