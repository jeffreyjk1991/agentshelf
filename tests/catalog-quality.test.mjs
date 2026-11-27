import {editorialCredit,editorialHandle} from '../lib/editorial-profiles.mjs';
import {compatibleChats} from '../scripts/compatibility.mjs';
import {CHATS,recommendedChat} from '../assets/chat-fit.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {runTool} from '../assets/tool-engine.mjs';
import {makeAssistantPrompt} from '../assets/prompt-engine.mjs';
import {readySchedulePrompt,toolGoal} from '../scripts/ready-agents.mjs';
import {normalizeRun,requestFor} from '../lib/live-engine.mjs';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const read=p=>fs.readFileSync(p,'utf8');
const groups=[['agents',json('catalog.json'),'Python starter'],['agents',json('prompt-agents/catalog.json'),'Chat instructions'],['automations',json('automations/catalog.json'),'Scheduled instructions'],['tools',json('everyday/catalog.json'),'Browser tool'],['live-agents',json('live-agents/catalog.json'),'Live public data']];
const home=read('dist/index.html'),sitemap=read('dist/sitemap.xml'),examples=json('everyday/examples.json');
const all=groups.flatMap(([route,items,kind])=>items.map(a=>({route,kind,a})));
test('complete catalog: each listing and each browser example occurs exactly once',()=>{
 assert.equal(all.length,207);assert.equal(new Set(all.map(x=>x.a.slug)).size,207);
 assert.equal(new Set(all.map(x=>editorialHandle(x.a.category))).size,21);assert.equal(examples.length,41);assert.equal(new Set(examples.map(x=>x.slug)).size,41);
});
for(const {route,kind,a} of all)test(kind+': '+a.slug,()=>{
 const url='/'+route+'/'+a.slug,html=read('dist'+url+'.html');
 assert.ok(a.name&&a.summary&&a.category);assert.ok(home.includes('href="'+url+'"'));
 assert.ok(home.includes('data-filter="'+a.category+'"'));assert.ok(html.includes('<h1>'));
 assert.ok(html.includes('<title>')&&html.includes('name="description"'));
 if(sitemap.includes('<loc>')){assert.ok(sitemap.includes(url+'</loc>'));assert.ok(html.includes('href="https://www.aibin.me'+url+'"')||process.env.SITE_URL);}
 const homeCard=[...home.matchAll(/<a class="agent mini-card[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g)].find(m=>m[1]===url)?.[0];assert.ok(homeCard,'Home card missing');assert.ok(homeCard.includes(editorialCredit(a.category,String)));assert.ok(html.includes(editorialCredit(a.category,String,true)));assert.ok(html.includes('"creator":{"@type":"Organization","name":"AIBin"'));
 if(route==='live-agents'){
  assert.ok(homeCard.includes('class="live-indicator"'));assert.ok(!homeCard.includes('class="compatibility-icon"'));
  const req=requestFor(normalizeRun({slug:a.slug,input:a.example}));assert.equal(new URL(req.url).protocol,'https:');
  assert.ok(html.includes('id="live-form"'));assert.ok(html.includes('class="text-button live-example"'));
 }else{
  const ids=compatibleChats(a.slug,route==='automations',route==='automations'?a.provider:recommendedChat(a.slug));assert.ok(homeCard.includes('class="compatibility-icon" data-chat="'+ids[0]+'"'));assert.ok(homeCard.includes('src="'+CHATS[ids[0]].logo+'"'));const detailGroup=html.match(/<span class="compatibility-icons"[^>]*>[\s\S]*?<\/span>/)?.[0];assert.ok(detailGroup);for(const id of ids){assert.ok(detailGroup.includes('data-chat="'+id+'"'));assert.ok(fs.existsSync('dist'+CHATS[id].logo));}assert.equal((detailGroup.match(/class="compatibility-icon"/g)||[]).length,ids.length);
  const file='/downloads/'+a.slug+'-agent.txt',expected=route==='automations'?readySchedulePrompt(a):makeAssistantPrompt(route==='tools'?toolGoal(a):a.task,'Simple and concise',a.name);
  assert.equal(read('dist'+file),expected+'\n');assert.ok(html.includes('href="'+file+'" download'));
  assert.ok(html.includes('class="btn primary ready-use"'));assert.ok(html.includes('Customize (optional)'));
  if(kind==='Python starter')assert.ok(fs.statSync('dist/downloads/'+a.slug+'.zip').size>0);
  if(route==='tools'){
   const ex=examples.find(x=>x.slug===a.slug);assert.ok(ex);
   for(const field of a.fields.filter(x=>!x.optional))assert.ok(Object.hasOwn(ex.values,field.id),'Missing example field '+field.id);
   const result=runTool(a.slug,ex.values,new Date('2026-11-26T12:00:00Z'));
   assert.ok(typeof result.title==='string'&&result.title.length>0);assert.ok(Array.isArray(result.lines));
   assert.ok(!JSON.stringify(result).includes('undefined'));
   for(const link of result.links||[]){assert.ok(link.label);assert.equal(new URL(link.url).protocol,'https:');}
  }
 }
});

test('dedicated media category landing pages and passport photo limitations',()=>{for(const [category,slug] of [['Social media','social-media'],['Photography','photography'],['Video','video']]){assert.ok(home.includes('data-filter="'+category+'"'));assert.ok(read('dist/categories/'+slug+'.html').includes(category+' AI agents'));}const p=read('dist/agents/passport-photo-maker.html');assert.ok(p.includes('digitally altered photos'));});
