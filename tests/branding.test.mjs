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
  if(process.env.SITE_URL)assert.equal(canonical,new URL('/',process.env.SITE_URL).href);
  if(crawlable){
    const origin=new URL(canonical).origin;
    assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
    const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
    assert.ok(urls.length>100);
    assert.equal(new Set(urls).size,urls.length);
    for(const url of urls){const u=new URL(url);assert.equal(u.origin,origin);const html=read(u.pathname==='/'?'index.html':u.pathname.slice(1)+'.html');assert.ok(html.includes('rel="canonical" href="'+url+'"'));assert.ok(html.includes('content="index,follow"'));assert.ok(html.includes('og:site_name" content="AIBin"'));}
  }else{assert.ok(robots.includes('Disallow: /'));assert.ok(!sitemap.includes('<loc>'));assert.ok(home.includes('content="noindex,follow"'));}
});
