import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {makeAssistantPrompt} from '../assets/prompt-engine.mjs';
import {readySchedulePrompt,toolGoal} from '../scripts/ready-agents.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8');
const catalog=p=>JSON.parse(fs.readFileSync(p,'utf8'));
test('all 202 ready instruction downloads exist, exactly match defaults, and require no customization',()=>{
 const index=JSON.parse(read('ready-agents.json'));assert.equal(index.count,202);
 const assistants=[...catalog('catalog.json'),...catalog('prompt-agents/catalog.json')];
 const automations=catalog('automations/catalog.json'),tools=catalog('everyday/catalog.json');
 for(const [items,prefix,prompt] of [[assistants,'agents',a=>makeAssistantPrompt(a.task,'Simple and concise',a.name)],[automations,'automations',readySchedulePrompt],[tools,'tools',a=>makeAssistantPrompt(toolGoal(a),'Simple and concise',a.name)]]){
  for(const a of items){const html=read(prefix+'/'+a.slug+'.html'),file='/downloads/'+a.slug+'-agent.txt';assert.equal(read(file.slice(1)),prompt(a)+'\n');assert.ok(html.includes('href="'+file+'" download'));assert.ok(html.includes('class="btn secondary ready-download"'));assert.ok(html.includes('class="btn primary ready-use"'));assert.ok(html.includes('<details class="quiet-details ready-edit">'));assert.ok(!html.includes('id="schedule-form"'));assert.ok(index.agents.some(x=>x.slug===a.slug&&x.download.endsWith(file)));if(prefix!=='tools')assert.ok(!html.includes('<form class="form clean-form toolform"'));}
 }
});
test('home uses task categories only and preserves SEO and the tagline',()=>{
 const h=read('index.html');assert.ok(!h.includes('data-filter="Use here"'));assert.ok(!h.includes('data-filter="Get agent"'));assert.ok(!h.includes('data-filter="Live agents"'));assert.ok(!h.includes('id="market-sort"'));for(const category of ['All','Travel','Research','Coding','Community'])assert.ok(h.includes('data-filter="'+category+'"'));assert.ok(h.includes('Put AI to work.<br><span>For everyday life.</span>'));assert.equal((h.match(/ data-agent /g)||[]).length,207);assert.ok(read('llms.txt').includes('/ready-agents.json'));assert.ok(read('google8d69054a5244e64f.html').includes('google-site-verification:'));
});
