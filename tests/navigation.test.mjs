import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {primaryNav,primaryNavigation} from '../scripts/navigation.mjs';
import {landingKind} from '../assets/referral-source.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8'),home=read('index.html');
test('eight primary sections use real static links, with a single current section',()=>{
 const nav=home.match(/<nav class="market-nav" aria-label="Main navigation">[\s\S]*?<\/nav>/)[0];
 assert.deepEqual(primaryNav.map(x=>x.label),['Explore','AI Agents','Agent Teams','Prompt Packs','Automations','AI Tools','Create','My Agents']);
 for(const n of primaryNav){
  const target=n.href.split('#')[0],file=target==='/'?'index.html':target.slice(1)+'.html';
  const html=read(file);assert.ok(nav.includes('href="'+n.href+'"'));assert.ok(html.includes('<nav class="market-nav"'));
  const current=html.match(/<nav class="market-nav"[\s\S]*?<\/nav>/)[0];assert.equal((current.match(/aria-current=/g)||[]).length,1,file);
  assert.match(current,new RegExp('href="'+n.href.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&')+'" aria-current='));
 }
 for(const [path,href] of [['/agents/resume-builder','/open-source'],['/agent-teams/research-team','/agent-teams'],['/tools/product-finder','/tools'],['/live-agents','/tools'],['/automations/flight-price-watcher','/automations']]){
  const n=primaryNavigation(path,s=>s);assert.ok(n.includes('href="'+href+'" aria-current='));
 }
 assert.ok(home.includes('href="/community">+ Submit agent'));
 assert.equal((home.match(/ data-agent /g)||[]).length,213);
});
test('tools landing page covers every existing browser tool and live workflow without duplicating detail pages',()=>{
 const html=read('tools.html');
 const catalog=JSON.parse(fs.readFileSync('everyday/catalog.json','utf8')),live=JSON.parse(fs.readFileSync('live-agents/catalog.json','utf8'));
 assert.equal(catalog.length,41);assert.equal(live.length,5);assert.equal((html.match(/ data-agent /g)||[]).length,46);
 for(const [prefix,items] of [['/tools/',catalog],['/live-agents/',live]])for(const a of items){assert.ok(html.includes('href="'+prefix+a.slug+'"'));assert.ok(fs.existsSync('dist'+prefix+a.slug+'.html'));}
 assert.ok(html.includes('Browser tools use deterministic rules'));assert.ok(html.includes('aria-label="Search online tools"'));assert.ok(read('llms.txt').includes('/tools)'));
 assert.equal(landingKind('/tools'),'directory');assert.equal(landingKind('/agent-packs'),'directory');
 if(home.includes('content="index,follow"')){assert.ok(read('sitemap.xml').includes('/tools</loc>'));assert.ok(html.includes('content="index,follow"'));assert.ok(html.includes('"@type":"ItemList"'));}
});
