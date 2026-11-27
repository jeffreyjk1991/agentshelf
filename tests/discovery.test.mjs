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
