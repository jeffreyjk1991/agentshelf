import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read=p=>fs.readFileSync(path.join('dist',p),'utf8');
const home=read('index.html');
test('AIBin branding preserves the existing tagline',()=>{
  assert.ok(home.includes('<h1>Put AI to work.<br><span>For everyday life.</span></h1>'));
  assert.ok(home.includes('ai<span>bin.me</span>'));
  assert.ok(home.includes('og:site_name" content="AIBin"'));
  assert.match(home,/<title>[^<]*AIBin<\/title>/);
  assert.ok(home.includes('"alternateName":"aibin.me"'));
  assert.ok(!home.includes('AgentShelf'));
  for(const f of ['catalog.json','tools.json','assistants.json','automations.json','prompt-agents.json','task-guides.json']){
    assert.match(JSON.parse(read(f)).name,/^AIBin/);
  }
  assert.ok(read('llms.txt').startsWith('# AIBin\n'));
});
test('SEO canonicals, sitemap and robots agree; previews are not indexed',()=>{
  const canonical=home.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const crawlable=!!canonical&&process.env.VERCEL_ENV!=='preview';
  const sitemap=read('sitemap.xml');
  const robots=read('robots.txt');
  if(process.env.VERCEL_ENV==='production')assert.equal(canonical,'https://www.aibin.me/');
  else if(process.env.SITE_URL)assert.equal(canonical,new URL('/',process.env.SITE_URL).href);
  if(crawlable){
    const origin=new URL(canonical).origin;
    assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
    const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
    assert.ok(urls.length>100);
    assert.equal(new Set(urls).size,urls.length);
    for(const url of urls){const u=new URL(url);assert.equal(u.origin,origin);const html=read(u.pathname==='/'?'index.html':u.pathname.slice(1)+'.html');assert.ok(html.includes('rel="canonical" href="'+url+'"'));assert.ok(html.includes('content="index,follow"'));assert.ok(html.includes('og:site_name" content="AIBin"'));}
  }else{assert.ok(robots.includes('Disallow: /'));assert.ok(!sitemap.includes('<loc>'));assert.ok(home.includes('content="noindex,follow"'));}
});

test('Google Search Console verification file is published unmodified at the site root',()=>{
  const file='google8d69054a5244e64f.html';
  const original=fs.readFileSync(path.join('verification',file));
  assert.equal(original.toString('utf8'),'google-site-verification: google8d69054a5244e64f.html');
  assert.deepEqual(fs.readFileSync(path.join('dist',file)),original);
});

test('robot brand and search-demand collection are crawlable and consistent',()=>{
 const icon=read('assets/icon.svg');assert.ok(icon.includes('<circle'));assert.ok(icon.includes('#146a48'));
 assert.equal((home.match(/class="brandmark" src="\/assets\/icon.svg"/g)||[]).length,2);
 const data=JSON.parse(read('top-ai-agents.json')),hub=read('top-ai-agents.html');
 assert.equal(data.count,25);assert.equal(data.agents.length,25);assert.equal(new Set(data.agents.map(a=>a.slug)).size,25);
 assert.ok(home.includes('href="/top-ai-agents"'));assert.ok(read('llms.txt').includes('/top-ai-agents'));
 for(const a of data.agents){const html=read(a.path.slice(1)+'.html');assert.ok(hub.includes('href="'+a.path+'"'));assert.ok(html.includes(a.title+' | AIBin')||html.includes(a.title.replaceAll('&','&amp;')+' | AIBin'));assert.ok(html.includes('href="/top-ai-agents"'));assert.ok(fs.existsSync(path.join('dist','downloads',a.slug+'-agent.txt')));}
 if(home.includes('content="index,follow"'))assert.ok(read('sitemap.xml').includes('/top-ai-agents</loc>'));
});

test('verification HTML uses its exact public filename; all existing clean URL routes remain explicit',()=>{
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8')),verify='/google8d69054a5244e64f.html';
 assert.equal(config.cleanUrls,false);
 const redirects=config.redirects,rewrites=config.rewrites;
 assert.ok(!redirects.some(r=>r.source===verify||r.source.includes('(.*)')));
 const routes=rewrites.map(r=>({...r,match:new RegExp('^'+r.source.replace(':slug([a-z0-9-]+)','([a-z0-9-]+)')+'$')}));
 for(const file of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'))){
  if(['index.html','offline.html',verify.slice(1)].includes(file))continue;
  const url='/'+file.slice(0,-5),route=routes.find(r=>r.match.test(url));
  assert.ok(route,'No clean-URL rewrite for '+url);
  const match=url.match(route.match);
  assert.equal(route.destination.replace(':slug',match[1]||''),'/'+file);
  assert.ok(redirects.some(r=>r.source===route.source+'.html'&&r.destination===route.source.replace('([a-z0-9-]+)','')),'Missing canonical redirect for '+file);
 }
 assert.ok(!routes.some(r=>r.match.test('/api/submissions')||r.match.test('/robots.txt')||r.match.test('/sitemap.xml')||r.match.test(verify)));
 assert.deepEqual(fs.readFileSync('dist'+verify),fs.readFileSync('verification'+verify));
});
