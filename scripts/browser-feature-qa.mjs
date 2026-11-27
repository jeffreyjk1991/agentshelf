// Browser tests run against a locally built site with mocked APIs. They never write to production or call external AI services.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'node:http';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain'};
const events=[];
let community=[],catalogFailures=0;
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');const name=url.pathname;
 if(name.startsWith('/api/')){
  res.setHeader('Content-Type','application/json');
  if(name==='/api/submissions'&&req.method==='GET'){res.end(JSON.stringify({agents:community}));return;}
  if(name==='/api/engagement'&&req.method==='POST'){let body='';for await(const chunk of req)body+=chunk;events.push(JSON.parse(body));res.end('{}');return;}
  res.statusCode=503;res.end('{}');return;
 }
 if(name==='/agent-experience.json'&&catalogFailures>0){catalogFailures--;res.statusCode=503;res.end('Unavailable');return;}
 try{let file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep))throw Error('Invalid path');if(!path.extname(file))file+='.html';
 const b=await fs.readFile(file);res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");res.end(b);
 }catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{})});
const failures=[];
async function run(name,fn){try{await fn();console.log('PASS',name);}catch(error){failures.push(name);console.error('FAIL',name,error.stack);}}
async function ctx(width=390){const c=await browser.newContext({viewport:{width,height:844},acceptDownloads:true,permissions:['clipboard-read','clipboard-write'],serviceWorkers:'block'});const p=await c.newPage();p.setDefaultTimeout(8000);const errors=[];p.on('pageerror',e=>errors.push(e.message));return {c,p,errors};}
async function visible(p,selector){await p.locator(selector).first().waitFor({state:'visible'});}
async function go(p,route){await p.goto(base+route);await p.waitForLoadState('domcontentloaded');}
async function create(p,goal){await p.locator('#vibe-goal').fill(goal);await p.locator('.vibe-form button[type=submit]').click();await visible(p,'.vibe-result');}
try{
 await run('Homepage responsive, compact and fully navigable',async()=>{
  for(const w of [360,390,768,1280]){const {c,p,errors}=await ctx(w);try{
   await go(p,'/');await p.waitForSelector('#search-grid.library-ready');assert.equal(await p.locator('.vibe-form').count(),1);assert.equal(await p.locator('#search-grid > [data-agent]:visible').count(),6);
   assert.equal(await p.locator('#search-grid > [data-agent]').count(),213);assert.equal(await p.locator('.recurring-strip,.intent-shortcuts,.home-actions').count(),0);
   assert.equal(await p.locator('.home-category-filters [data-filter="All"]').getAttribute('aria-pressed'),'true');
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow at '+w);
   await p.locator('[data-filter="Photography"]').click();assert.equal(await p.locator('[data-filter="Photography"]').getAttribute('aria-pressed'),'true');
   assert.ok((await p.locator('#search-grid > [data-agent]:visible').count())>0);
   assert.ok(await p.locator('#search-grid > [data-agent]:visible').evaluateAll(nodes=>nodes.every(n=>n.dataset.category==='Photography')));
   await p.locator('[data-filter="All"]').click();await p.locator('#search').fill('passport photo');assert.ok((await p.locator('#search-grid > [data-agent]:visible').first().textContent()).includes('Passport Photo'));
   await p.locator('#search').fill('zzzzzznotanagent');await visible(p,'#empty');await p.locator('#search').fill('');await p.locator('#show-more').click();assert.equal(await p.locator('#search-grid > [data-agent]:visible').count(),213);
   assert.deepEqual(errors,[]);
  }finally{await c.close();}}
 });
 await run('Primary navigation reaches every major section at phone and desktop widths',async()=>{
  const paths=[['Explore','/'],['Agents','/open-source'],['Teams','/agent-teams'],['Prompts','/agent-packs'],['Tools','/tools']];
  for(const w of [320,390,768,1024,1280]){const {c,p,errors}=await ctx(w);try{
   await go(p,'/');const nav=p.locator('.market-nav');
   assert.equal(await nav.locator('a').count(),5);
   assert.ok(await nav.locator('a').evaluateAll(links=>links.every(a=>Math.abs(a.getBoundingClientRect().top-links[0].getBoundingClientRect().top)<=1)),'Primary tabs wrap at '+w);
   assert.ok(await nav.locator('a').evaluateAll(links=>links.every(a=>{const r=a.getBoundingClientRect();return r.width>0&&r.height>=32&&r.left>=-1&&r.right<=innerWidth+1;})),'Navigation clipped at '+w);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Header overflow at '+w);
   if(w===390||w===1280){for(const [name,path] of paths){await nav.getByRole('link',{name,exact:true}).click();await p.waitForLoadState('domcontentloaded');assert.equal(new URL(p.url()).pathname,path);assert.equal(await p.locator('.market-nav [aria-current]').count(),1);assert.ok(await p.locator('.market-nav [aria-current]').textContent()===name);}}
   if(w===390||w===1280){for(const [name,path] of [['Create an agent','/make-agent'],['Automations','/automations'],['My Agents','/my-agents']]){await nav.getByRole('link',{name:'Agents',exact:true}).click();await p.locator('.agent-section-links').getByRole('link',{name,exact:true}).click();await p.waitForLoadState('domcontentloaded');assert.equal(new URL(p.url()).pathname,path);assert.equal(await p.locator('.market-nav [aria-current]').textContent(),'Agents');}}
   await nav.getByRole('link',{name:'Tools',exact:true}).click();await p.waitForSelector('#search-grid.library-ready');assert.equal(await p.locator('#search-grid > [data-agent]').count(),46);assert.equal(await p.locator('#search-grid > [data-agent]:visible').count(),12);await p.locator('#search').fill('unit price');assert.match(await p.locator('#search-grid > [data-agent]:visible').first().textContent(),/Unit Price/i);await p.locator('#search').fill('');await p.locator('#show-more').click();assert.equal(await p.locator('#search-grid > [data-agent]:visible').count(),46);assert.deepEqual(errors,[]);
  }finally{await c.close();}}
 });
 await run('Personalized builder, retry, invalidation, clipboard, download and save',async()=>{
  const {c,p,errors}=await ctx();try{
   catalogFailures=1;await go(p,'/');await create(p,'Find job openings for a data analyst every morning');assert.ok((await p.locator('.vibe-prompt').inputValue()).includes('Find job openings for a data analyst'));
   await p.locator('#vibe-goal').fill('Find job openings for a business analyst every morning');assert.equal(await p.locator('.vibe-result').isVisible(),false);await p.locator('.vibe-form button[type=submit]').click();await visible(p,'.vibe-result');assert.equal(await p.locator('.vibe-match').getAttribute('href'),'/automations/job-opening-scout');
   await p.locator('.vibe-copy').click();await p.waitForFunction(()=>document.querySelector('.vibe-result-status').textContent.includes('copied'));const copied=await p.evaluate(()=>navigator.clipboard.readText());assert.ok(copied.includes('business analyst'));
   const download=p.waitForEvent('download');await p.locator('.vibe-download').click();assert.equal((await download).suggestedFilename(),'aibin-custom-agent.txt');
   await p.locator('.vibe-save').click();assert.ok(await p.locator('.vibe-save').isDisabled());
   await go(p,'/my-agents');await visible(p,'#saved-list .saved-card');assert.equal(await p.locator('#saved-list .saved-card').count(),1);assert.ok((await p.locator('#saved-list .saved-card').first().textContent()).includes('Job Opening Scout'));
   await p.locator('#saved-list').getByRole('button',{name:'Remove',exact:true}).click();await visible(p,'#saved-empty');assert.deepEqual(errors,[]);
  }finally{await c.close();}
 });
 await run('Guided customization stays collapsed and preserves manual text, downloads and privacy',async()=>{
  const {c,p,errors}=await ctx();try{
   await go(p,'/agents/social-caption-writer');const details=p.locator('.ready-edit'),prompt=p.locator('.ready-prompt'),use=p.locator('.ready-use');
   assert.equal(await details.getAttribute('open'),null);const original=await prompt.inputValue(),originalHref=await use.getAttribute('href');
   await details.locator('summary').click();await details.locator('[data-label="Platform"]').selectOption('Instagram');await details.locator('[data-label="Tone"]').selectOption('Friendly');await details.locator('.ready-references').fill('https://example.com/reference');
   const edited=await prompt.inputValue();assert.ok(edited.startsWith(original));assert.match(edited,/Platform: Instagram/);assert.match(edited,/Tone: Friendly/);assert.match(edited,/https:\/\/example\.com\/reference/);assert.equal(await use.getAttribute('data-launch-mode'),'copy');assert.equal(new URL(await use.getAttribute('href')).search,'');
   await prompt.fill('Manual introduction\n'+edited);await details.locator('[data-label="Tone"]').selectOption('Professional');assert.ok((await prompt.inputValue()).startsWith('Manual introduction\n'));assert.match(await prompt.inputValue(),/Tone: Professional/);
   await details.locator('.ready-copy').click();await p.waitForFunction(()=>document.querySelector('.ready-status').textContent.includes('Copied.'));assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),await prompt.inputValue());
   const waiting=p.waitForEvent('download');await p.locator('.ready-download').click();const d=await waiting;assert.equal(d.suggestedFilename(),'social-caption-writer-agent.txt');assert.equal(await fs.readFile(await d.path(),'utf8'),(await prompt.inputValue())+'\n');
   await details.locator('.ready-save').click();assert.match(await p.locator('.ready-status').textContent(),/Saved/);
   await details.locator('.ready-references').fill('javascript:alert(1)');await visible(p,'.customize-error');await use.click();assert.equal(new URL(p.url()).pathname,'/agents/social-caption-writer');
   await details.locator('.ready-reset').click();assert.equal(await prompt.inputValue(),original);assert.equal(await details.locator('[data-label="Platform"]').inputValue(),'');assert.equal(await details.locator('.ready-references').inputValue(),'');assert.equal(await use.getAttribute('href'),originalHref);
   await go(p,'/automations/flight-price-watcher');await p.locator('.ready-edit summary').click();await p.locator('[data-label="From and to (airports or cities)"]').fill('Detroit to Delhi');await p.locator('[data-label="Repeat"]').selectOption('Weekly');assert.match(await p.locator('.ready-prompt').inputValue(),/Repeat: Weekly/);assert.match(await p.locator('.ready-prompt').inputValue(),/Detroit to Delhi/);
   await go(p,'/tools/product-finder');await p.locator('.ai-alternative > summary').click();await p.locator('.ready-edit > summary').click();await p.locator('.ready-variables [data-label="What are you shopping for?"]').fill('Coffee grinder');assert.match(await p.locator('.ready-prompt').inputValue(),/Coffee grinder/);assert.deepEqual(errors,[]);
  }finally{await c.close();}
 });
 await run('Agents and Tools share the collection design; homepage mascot adds no layout height',async()=>{
  for(const w of [320,360,390,768,1024,1280]){const {c,p,errors}=await ctx(w);try{
   await go(p,'/');await p.waitForSelector('#search-grid.library-ready');await p.emulateMedia({reducedMotion:'reduce'});
   const bounds=await p.evaluate(()=>{
    const robot=document.querySelector('.home-robot'),hero=document.querySelector('.future-hero'),heading=hero.querySelector('h1'),kicker=hero.querySelector('.hero-kicker'),builder=hero.querySelector('.vibe-form'),library=document.querySelector('#agents');
    const r=robot.getBoundingClientRect(),h=hero.getBoundingClientRect();
    const range=document.createRange();range.selectNodeContents(heading);
    const texts=[...range.getClientRects()];for(const n of kicker.childNodes)if(n.nodeType===Node.TEXT_NODE&&n.textContent.trim()){range.selectNodeContents(n);texts.push(...range.getClientRects());}
    const collision=texts.some(t=>r.left<t.right-1&&r.right>t.left+1&&r.top<t.bottom-1&&r.bottom>t.top+1);
    const before=[h.height,heading.getBoundingClientRect().top,builder.getBoundingClientRect().top,library.getBoundingClientRect().top];
    const contained=r.left>=h.left-1&&r.right<=h.right+1&&r.top>=h.top-1&&r.bottom<=h.bottom+1;
    const motion=getComputedStyle(robot.querySelector('.home-robot-art')).animationName;
    const size=r.width,wrapper=robot.parentElement;robot.hidden=true;wrapper.classList.remove('home-headline');
    const after=[hero.getBoundingClientRect().height,heading.getBoundingClientRect().top,builder.getBoundingClientRect().top,library.getBoundingClientRect().top];
    wrapper.classList.add('home-headline');robot.hidden=false;return {collision,contained,before,after,motion,size};
   });
   assert.equal(bounds.collision,false,'Robot overlaps text at '+w);assert.equal(bounds.contained,true,'Robot clipped at '+w);assert.deepEqual(bounds.before,bounds.after,'Robot shifts original hero at '+w);assert.equal(bounds.motion,'none');assert.ok(bounds.size>=(w>=1024?100:60),'Robot too small at '+w);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.emulateMedia({reducedMotion:'no-preference'});
   assert.ok(await p.locator('.robot-wave').evaluate(node=>{const a=node.getAnimations()[0];if(!a)return false;a.pause();a.currentTime=200;const x=getComputedStyle(node).transform;a.currentTime=650;const y=getComputedStyle(node).transform;a.play();return x!==y;}),'Robot wave is not visibly moving');
   for(const [url,total,query,match] of [['/open-source',142,'passport photo',/Passport Photo/i],['/tools',46,'unit price',/Unit Price/i]]){
    await go(p,url);await p.waitForSelector('#search-grid.library-ready');await visible(p,'.collection-flow');assert.equal(await p.locator('.flow-node').count(),3);await visible(p,'.flow-example');await visible(p,'.flow-output strong');await visible(p,'.flow-replay');assert.equal(await p.locator('#search-grid > [data-agent]').count(),total);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Library overflow '+url+' at '+w);
    assert.ok(await p.locator('.collection-flow,.mini-card:visible').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;})));
    if(w===390){const motion=await p.locator('.flow-track>span').evaluate(node=>{const a=node.getAnimations()[0];if(!a)return false;a.pause();a.currentTime=100;const x=getComputedStyle(node).transform;a.currentTime=2400;const y=getComputedStyle(node).transform;a.finish();return x!==y;});assert.ok(motion,'Progress bar must visibly advance');await p.locator('.flow-replay').click();assert.ok(await p.locator('.flow-track>span').evaluate(node=>node.getAnimations().some(a=>a.playState==='running'&&a.currentTime<1000)),'Replay failed');}
    await p.locator('#search').fill(query);assert.match(await p.locator('#search-grid > [data-agent]:visible').first().textContent(),match);
    await p.locator('#search').fill('');await p.locator('#show-more').click();assert.equal(await p.locator('#search-grid > [data-agent]:visible').count(),total);
    await p.emulateMedia({reducedMotion:'reduce'});assert.ok(await p.locator('.flow-node,.flow-output').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName==='none')));await p.emulateMedia({reducedMotion:'no-preference'});
   }
   assert.deepEqual(errors,[]);
  }finally{await c.close();}}
 });
 await run('Collection heroes, finite motion, responsive cards and prompt downloads',async()=>{
  for(const w of [320,390,768,1280]){const {c,p,errors}=await ctx(w);try{
   await go(p,'/agent-teams');await visible(p,'.collection-flow');assert.equal(await p.locator('.team-collection-card').count(),3);
   assert.equal(await p.locator('.flow-node').count(),4);assert.ok(await p.locator('.flow-node').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationIterationCount==='1'&&parseFloat(getComputedStyle(n).animationDuration)<1)));
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Team page overflow '+w);
   assert.ok(await p.locator('.collection-card').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&n.scrollWidth<=n.clientWidth+1;})),'Team cards clipped '+w);
   await p.locator('.team-collection-card').first().click();await visible(p,'.team-role');assert.equal(await p.locator('.team-role').count(),4);assert.equal(await p.locator('.flow-node').count(),4);assert.equal(await p.locator('.ready-edit').getAttribute('open'),null);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Team detail overflow '+w);
   await p.locator('.market-nav').getByRole('link',{name:'Prompts',exact:true}).click();await visible(p,'.collection-flow');assert.equal(await p.locator('.pack-collection-card').count(),4);assert.equal(await p.locator('.flow-node').count(),3);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Prompt page overflow '+w);
   assert.equal(await p.locator('.pack-contents[open]').count(),0);
   const pack=p.locator('.pack-collection-card').first();await pack.locator('summary').click();assert.equal(await pack.locator('.intent-row:visible').count(),6);
   if(w===390){const waiting=p.waitForEvent('download');await pack.locator('.pack-download').click();const d=await waiting;assert.equal(d.suggestedFilename(),'aibin-everyday-agent-pack.md');assert.match(await fs.readFile(await d.path(),'utf8'),/AIBin — Everyday planning/);}
   await p.emulateMedia({reducedMotion:'reduce'});assert.ok(await p.locator('.flow-node,.flow-output').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName==='none')));assert.deepEqual(errors,[]);
  }finally{await c.close();}}
 });
 await run('Agent team navigation, four specialists, customization and downloads',async()=>{
  const {c,p,errors}=await ctx();try{
   await go(p,'/');await p.locator('.home-help a[href="/agent-teams"]').click();await visible(p,'h1');assert.equal(new URL(p.url()).pathname,'/agent-teams');assert.equal(await p.locator('.intent-list .intent-row').count(),3);
   for(const slug of ['research-team','software-team','customer-support-team']){
    await go(p,'/agent-teams/'+slug);assert.equal(await p.locator('.team-role').count(),4);const detail=p.locator('.ready-edit');assert.equal(await detail.getAttribute('open'),null);
    const initial=await p.locator('.ready-prompt').inputValue();await detail.locator('summary').click();await detail.locator('[data-custom-field]').first().fill('Fixture task');
    assert.match(await p.locator('.ready-prompt').inputValue(),/Fixture task/);assert.equal(await p.locator('.ready-use').getAttribute('data-launch-mode'),'copy');
    await detail.locator('.ready-copy').click();await p.waitForFunction(()=>document.querySelector('.ready-status').textContent.includes('Copied.'));assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),await p.locator('.ready-prompt').inputValue());
    await detail.locator('.ready-reset').click();assert.equal(await p.locator('.ready-prompt').inputValue(),initial);
    const waiting=p.waitForEvent('download');await p.locator('.team-runner a[download]').click();const d=await waiting;assert.equal(d.suggestedFilename(),slug+'.zip');const b=await fs.readFile(await d.path());assert.equal(b.subarray(0,2).toString(),'PK');
   }
   assert.deepEqual(errors,[]);
  }finally{await c.close();}
 });
 await run('Recurring request and explicit one-time override',async()=>{
  const {c,p,errors}=await ctx();try{
   await go(p,'/');await create(p,'Check my flight prices every Tuesday');assert.ok((await p.locator('.vibe-mode').textContent()).includes('Weekly'));assert.match(await p.locator('.vibe-prompt').inputValue(),/only if this chat supports scheduling/);assert.match(await p.locator('.vibe-limits').textContent(),/Not active/);
   await p.locator('.vibe-options summary').click();await p.locator('.vibe-form select[name=frequency]').selectOption('once');await p.locator('.vibe-form select[name=provider]').selectOption('claude');await p.locator('.vibe-form button[type=submit]').click();await visible(p,'.vibe-result');assert.match(await p.locator('.vibe-mode').textContent(),/One-time assistant.*Claude/);assert.match(await p.locator('.vibe-prompt').inputValue(),/Do not schedule it/);
   await go(p,'/automations/flight-price-watcher');await visible(p,'.ready-use');assert.match(await p.locator('.ready-hint').textContent(),/Confirm the scheduled task/);assert.deepEqual(errors,[]);
  }finally{await c.close();}
 });
 await run('Worked examples, capability disclosure and one share action',async()=>{
  const {c,p,errors}=await ctx();try{
   await go(p,'/agents/professional-headshot-maker');await visible(p,'.worked-example');assert.match(await p.locator('.worked-example').textContent(),/Editorial sample, not a live response/);
   await visible(p,'.qa-line summary');await p.locator('.qa-line summary').click();assert.match(await p.locator('.qa-line').textContent(),/not independently certified/);
   assert.equal(await p.getByRole('button',{name:'Share ↗',exact:true}).count(),1);await p.getByRole('button',{name:'Share ↗',exact:true}).click();await visible(p,'.share-dialog');const dimensions=await p.locator('.share-dialog img').evaluate(img=>({w:img.naturalWidth,h:img.naturalHeight}));assert.deepEqual(dimensions,{w:1080,h:1080});
   await p.getByRole('button',{name:'Copy link',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.share-dialog [role=status]').textContent.includes('copied'));assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),'https://www.aibin.me/agents/professional-headshot-maker');
   const download=p.waitForEvent('download');await p.getByRole('button',{name:'Download PNG'}).click();const d=await download;assert.equal(d.suggestedFilename(),'aibin-agent-card.png');const b=await fs.readFile(await d.path());assert.equal(b.readUInt32BE(16),1080);assert.equal(b.readUInt32BE(20),1080);
   await p.getByRole('button',{name:'Close ×'}).click();await p.locator('.share-dialog').waitFor({state:'detached'});
   await go(p,'/my-agents');await visible(p,'#recent-list .starter-row');assert.match(await p.locator('#recent-list').textContent(),/Professional Headshot/);await p.locator('#clear-recent').click();assert.equal(await p.locator('#recent-panel').isVisible(),false);assert.deepEqual(errors,[]);
  }finally{await c.close();}
 });
 await run('Mobile install guidance and public-only offline cache',async()=>{
  const c=await browser.newContext({viewport:{width:390,height:844}});const p=await c.newPage();p.setDefaultTimeout(10000);try{
   await go(p,'/');await p.evaluate(()=>navigator.serviceWorker.ready);await p.waitForFunction(()=>!!navigator.serviceWorker.controller);
   await go(p,'/my-agents');await p.locator('#install-aibin').click();await visible(p,'#install-help');
   await c.setOffline(true);await p.goto(base+'/make-agent');await create(p,'Help me write a one-time thank-you message');assert.match(await p.locator('.vibe-prompt').inputValue(),/thank-you message/);
   const paths=await p.evaluate(async()=>{const names=await caches.keys();const keys=await (await caches.open(names.find(x=>x.startsWith('aibin-public-')))).keys();return keys.map(x=>new URL(x.url).pathname);});
   assert.ok(paths.includes('/make-agent'));assert.ok(!paths.some(x=>x.startsWith('/api/')||x==='/community'||x==='/shared-agent'));await c.setOffline(false);
  }finally{await c.close();}
 });
 await run('Real creator empty state and approved fixture collection, count and share',async()=>{
  const {c,p,errors}=await ctx();try{
   await go(p,'/creators');await p.waitForFunction(()=>document.querySelector('#creator-status').textContent.includes('No approved community creators'));
   community=[{id:'91',creator:'sample-maker',name:'Sample workflow',description:'Reviewed fixture only.',category:'Travel',kind:'instructions',instructions:'Write an itinerary using public sources.',provider:'chatgpt',usage_count:3},{id:'92',creator:'SAMPLE-MAKER',name:'Second fixture',description:'Reviewed fixture only.',category:'Travel',kind:'instructions',instructions:'Check route options.',provider:'chatgpt',usage_count:2}];
   await go(p,'/creators#sample-maker');await p.reload();await visible(p,'.creator-card');assert.equal(await p.locator('.creator-card').count(),1);assert.match(await p.locator('.creator-card').textContent(),/5 recorded chat\/agent opens/);
   await p.getByRole('button',{name:'Share collection ↗',exact:true}).click();await visible(p,'.share-dialog');assert.match(await p.locator('.share-direct-link').textContent(),/creators#sample-maker/);await p.getByRole('button',{name:'Close ×'}).click();
   await go(p,'/community#agent-91');await visible(p,'#agent-91');assert.match(await p.locator('#agent-91').textContent(),/3 recorded opens/);assert.equal(await p.locator('#agent-91 .agent-creator a').getAttribute('href'),'/creators#sample-maker');assert.deepEqual(errors,[]);
  }finally{community=[];await c.close();}
 });
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
if(failures.length){console.error('Failed browser scenarios:',failures.join(', '));process.exitCode=1;}else console.log('PASS all eleven browser scenario groups; all APIs mocked, no production records written.');
