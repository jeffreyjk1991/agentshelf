import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {classifyReferral,landingKind} from '../assets/referral-source.mjs';
import {normalizeEngagement} from '../lib/growth.mjs';
import {searchRobots} from '../scripts/discovery.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8'),home=read('index.html'),map=read('sitemap.xml'),indexed=home.includes('content="index,follow"');
const directory=JSON.parse(read('agent-directory.json'));
test('complete public reference covers 213 canonical existing agent pages',()=>{
 assert.equal(directory.count,213);assert.equal(new Set(directory.entries.map(a=>a.path)).size,213);
 const full=read('llms-full.txt'),hub=read('ai-agent-directory.html');
 for(const e of directory.entries){
  const h=read(e.path.slice(1)+'.html');assert.ok(h.includes('class="quiet-details discovery-answer"'),e.path);
  assert.ok(h.includes('Example input:')&&h.includes('Limitations:'));
  assert.ok(hub.includes('href="'+e.path+'"'));assert.ok(full.includes(e.url));assert.ok(e.workflow&&e.limit);
  if(indexed){assert.ok(map.includes(e.url+'</loc>'));assert.ok(h.includes('rel="canonical" href="'+e.url+'"'));}
 }
});
test('provider and builder discovery pages contain real links and useful instructions',()=>{
 const paths=['ai-agent-directory','ai-agents-for-chatgpt','ai-agents-for-claude','ai-agents-for-gemini'];
 for(const p of paths){const html=read(p+'.html');assert.ok(read('llms.txt').includes('/'+p));if(indexed){assert.ok(html.includes('"@type":"ItemList"'));assert.ok(map.includes('/'+p+'</loc>'));}if(p!=='ai-agent-directory'){assert.ok(html.includes('Official '));assert.ok(html.includes('href="/make-agent"'));assert.ok(html.includes('external chat may have account restrictions'));}}
 assert.ok(read('make-agent.html').includes('Free AI Agent Builder'));
 assert.ok(read('make-agent.html').includes('not an autonomous hosted agent builder'));
 assert.ok(home.includes('href="/ai-agent-directory"'));
 assert.equal((home.match(/ data-agent /g)||[]).length,213);
 assert.ok(!home.includes('class="recurring-strip"'));assert.ok(!home.includes('class="intent-shortcuts"'));
});
test('explicit crawler access on production only',()=>{
 const robots=read('robots.txt');if(indexed){for(const bot of ['OAI-SearchBot','ChatGPT-User','Googlebot','bingbot'])assert.ok(robots.includes('User-agent: '+bot+'\nAllow: /\nDisallow: /api/'));}else assert.equal(robots,'User-agent: *\nDisallow: /\n');
 assert.equal(searchRobots('https://www.aibin.me',false),'User-agent: *\nDisallow: /\n');
 assert.equal(new Set([...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])).size,[...map.matchAll(/<loc>(.*?)<\/loc>/g)].length);
});
test('fixed AI referral categories, never arbitrary URL or personal inputs',()=>{
 const origin='https://www.aibin.me';
 assert.equal(classifyReferral('?utm_source=chatgpt.com','',origin),'chatgpt');
 assert.equal(classifyReferral('','https://chatgpt.com/c/secret',origin),'chatgpt');
 assert.equal(classifyReferral('','https://gemini.google.com/app',origin),'gemini');
 assert.equal(classifyReferral('?utm_source=private-token','',origin),'direct_or_unknown');
 assert.equal(classifyReferral('','https://chatgpt.com.evil.example',origin),'other_referral');
 assert.equal(classifyReferral('','https://www.aibin.me/make-agent',origin),'direct_or_unknown');
 assert.equal(landingKind('/make-agent'),'builder');assert.equal(landingKind('/agents/resume-builder'),'listing');assert.equal(landingKind('/ai-agents-for-chatgpt'),'directory');
 const e=normalizeEngagement({type:'first_visit',slug:'site',source:'chatgpt',landingKind:'builder',referrer:'discarded'});
 assert.deepEqual(e,{type:'first_visit',slug:'site',source:'chatgpt',landingKind:'builder'});
 assert.throws(()=>normalizeEngagement({...e,source:'private text'}));
 assert.deepEqual(normalizeEngagement({type:'copy',slug:'resume-builder',source:'chatgpt',landingKind:'listing'}),{type:'copy',slug:'resume-builder'});
});

test('IndexNow public ownership key exists only on the canonical production build',()=>{const key='ad27013b45c6445a9b43c9b3e2706ef1';if(indexed&&home.includes('rel="canonical" href="https://www.aibin.me/"'))assert.equal(read(key+'.txt').trim(),key);});

test('blog publishes fifty distinct referenced guides, linked resources and canonical article metadata',()=>{
 const catalog=JSON.parse(read('blog.json'));const index=read('blog.html');const titles=new Set();
 assert.equal(catalog.count,50);assert.equal(catalog.articles.length,50);
 assert.equal(new Set(catalog.articles.map(a=>a.url)).size,50);
 assert.equal(new Set(catalog.articles.map(a=>a.category)).size,5);
 assert.ok(home.includes('href="/blog">Blog</a>'));
 assert.equal((index.match(/data-blog-card href=/g)||[]).length,50);
 assert.ok(read('llms.txt').includes('/blog.json'));
 for(const a of catalog.articles){
  const route=new URL(a.url,'https://www.aibin.me').pathname;
  const html=read(route.slice(1)+'.html');
  assert.ok(!titles.has(a.title));titles.add(a.title);
  assert.ok(index.includes('href="'+route+'"'),route);
  assert.ok(html.includes('class="blog-article-header"')&&html.includes('class="blog-example"'),route);
  assert.ok(html.includes('References & further reading'),route);
  assert.ok(a.sources.length>=2&&a.sources.every(s=>s.startsWith('https://')));
  for(const source of a.sources)assert.ok(html.includes(source),route+' reference');
  const resource=new URL(a.relatedResource,'https://www.aibin.me').pathname;
  assert.ok(html.includes('href="'+resource+'"'),route+' resource');
  const resourceFile=resource==='/'?'index.html':resource.slice(1)+'.html';
  assert.ok(fs.existsSync('dist/'+resourceFile),route+' target exists: '+resource);
  assert.ok(read(resourceFile).includes('href="/blog'),resource);
  assert.ok(read('llms.txt').includes(route),route);
  if(indexed){
   assert.ok(html.includes('"@type":"BlogPosting"'),route);
   assert.ok(html.includes('rel="canonical" href="https://www.aibin.me'+route+'"'),route);
   assert.ok(html.includes('content="index,follow"'),route);
   assert.ok(map.includes('https://www.aibin.me'+route+'</loc>'),route);
  }
 }
 if(indexed)assert.ok(map.includes('/blog</loc>'));
 const cfg=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 assert.ok(cfg.rewrites.some(r=>r.source==='/blog'&&r.destination==='/blog.html'));
 assert.ok(cfg.rewrites.some(r=>r.source==='/blog/:slug([a-z0-9-]+)'&&r.destination==='/blog/:slug.html'));
});

test('marketplace search intent has useful distinct canonical destinations',()=>{
 const guide=read('ai-marketplace-platforms.html');
 for(const phrase of ['What is an AI marketplace?','Is there a free AI marketplace?','AWS Marketplace','Facebook Marketplace','Optum AI Marketplace','Hugging Face Hub','GPT Store','AgentMarket','No tool or marketplace can guarantee that income'])assert.ok(guide.includes(phrase),phrase);
 for(const [file,phrase] of [['index.html','Free AI Agent Marketplace'],['agent-packs.html','Free AI Prompt Marketplace'],['creators.html','AI Creator Marketplace'],['developers.html','Open-Source AI Agent Marketplace']]){const html=read(file);assert.ok(html.includes(phrase),file);assert.ok(html.includes('href="/ai-marketplace-platforms"'),file);}
 assert.ok(guide.includes('href="/make-agent"'));assert.ok(guide.includes('href="/community"'));assert.ok(read('llms.txt').includes('/ai-marketplace-platforms'));
 if(indexed){assert.ok(map.includes('/ai-marketplace-platforms</loc>'));assert.ok(guide.includes('rel="canonical" href="https://www.aibin.me/ai-marketplace-platforms"'));}
 const cfg=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.ok(cfg.rewrites.some(r=>r.source==='/ai-marketplace-platforms'&&r.destination==='/ai-marketplace-platforms.html'));
});

test('job search guide shows a dated employer-verified example, rejected listing and one Scout CTA',()=>{
 const html=read('blog/ai-agent-for-job-search.html');
 assert.match(html,/Example: A verified daily shortlist/);
 assert.match(html,/datetime="2026-11-28"/);
 assert.match(html,/vialogic\/jobs\/5466980008/);
 assert.match(html,/aspenviewtech\/jobs\/4422437009/);
 assert.match(html,/employer’s current job board/);
 assert.equal((html.match(/class="btn primary" href="\/automations\/job-opening-scout"/g)||[]).length,1);
});

test('search intent guides add useful prompts and real tool links without duplicating routes',()=>{
 const cases=[
 ['ai-agent-for-job-search','How to use a free AI job search agent',['/agents/job-search-scout','/agents/job-application-tailor']],
 ['ai-agent-for-flight-deals','Travel Tuesday AI flight finder checklist',['/tools/cheap-flight-finder','/tools/trip-budget']],
 ['ai-agent-for-online-shopping','Cyber Monday AI deal checker and price comparison',['/automations/product-deal-watcher','/tools/discount-calculator','/tools/product-finder']]
 ];
 for(const [slug,heading,links] of cases){
  const route='/blog/'+slug,html=read(route.slice(1)+'.html');
  assert.ok(html.includes(heading),slug);
  assert.ok(html.includes('Instructions to use in your AI chat'),slug);
  assert.ok(html.includes('compatible AI chat or alert service'),slug);
  for(const link of links){assert.ok(html.includes('href="'+link+'"'),link);assert.ok(fs.existsSync('dist'+link+'.html'),link);}
  if(indexed){assert.ok(html.includes('"dateModified":"2026-11-28"'),slug);assert.ok(map.includes('https://www.aibin.me'+route+'</loc>'),slug);}
  else assert.ok(html.includes('content="noindex,follow"'),slug);
 }
});

test('AI discovery directory provides task-first recommendations and real guide links',()=>{
 const h=read('ai-agent-directory.html');
 assert.ok(h.includes('Choose an AI helper by the result you need'));
 for(const [label,path,guide] of [
  ['Find real job openings','/automations/job-opening-scout','/blog/ai-agent-for-job-search'],
  ['Compare shopping prices','/tools/price-compare','/blog/ai-agent-for-online-shopping'],
  ['Find and monitor cheap flights','/automations/flight-price-watcher','/blog/ai-agent-for-flight-deals'],
  ['Summarize a PDF','/agents/pdf-question-helper','/blog/ai-agent-for-document-summaries'],
  ['Plan meals on a budget','/tools/meal-planner','/blog/ai-agent-for-meal-planning'],
  ['Review customer support replies','/agents/support-response-helper','/blog/ai-customer-support-agent']
 ]){
  assert.ok(h.includes(label),label);
  for(const p of [path,guide]){assert.ok(h.includes('href="'+p+'"'),p);assert.ok(fs.existsSync('dist'+p+'.html'),p);}
 }
});
test('six verified tool examples are rendered with actual results and evidence links',()=>{
 const evidence=JSON.parse(read('browser-tool-evidence.json'));
 const checked=evidence.cases.filter(c=>c.expectedTitle);assert.equal(checked.length,6);
 for(const c of checked){
  const h=read(c.path.slice(1)+'.html');
  assert.ok(h.includes('Reproducible worked example'),c.slug);
  assert.ok(h.includes(c.expectedTitle),c.slug);
  assert.ok(h.includes('Synthetic inputs executed'),c.slug);
  assert.ok(h.includes('href="/browser-tool-evidence.json"'),c.slug);
  assert.ok(h.includes('href="/agent-checks"'),c.slug);
 }
});
