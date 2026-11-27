import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launchPlan} from '../assets/chat-launch.mjs';
import {CHATS} from '../assets/chat-fit.mjs';
const catalog=JSON.parse(fs.readFileSync('dist/ready-agents.json','utf8'));
const decode=s=>s.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[m]));
test('complete public template link, safe destinations, no private text or truncation',()=>{
 const sample='Use + and & with quotes, 日本語 and emoji 🌿.\nNext line.';
 for(const key of ['chatgpt','claude']){
  const p=launchPlan(key,sample,true),u=new URL(p.href);
  assert.equal(p.mode,'prefill');assert.equal(u.searchParams.get('q'),sample);
  assert.equal(u.hostname,key==='chatgpt'?'chatgpt.com':'claude.ai');assert.equal(u.pathname,key==='chatgpt'?'/':'/new');
  assert.equal(launchPlan(key,'Private draft',false).href,CHATS[key].url);
  assert.equal(launchPlan(key,'é'.repeat(4000),true).mode,'copy');
 }
 assert.equal(launchPlan('gemini',sample,true).href,CHATS.gemini.url);
 assert.equal(launchPlan('gemini',sample,true).mode,'copy');
 assert.throws(()=>launchPlan('unknown',sample,true));
});
for(const a of catalog.agents)test('handoff: '+a.slug,()=>{
 const path=new URL(a.url,'https://www.aibin.me').pathname,html=fs.readFileSync('dist'+path+'.html','utf8'),prompt=fs.readFileSync('dist'+new URL(a.download,'https://www.aibin.me').pathname,'utf8').replace(/\n$/,'');
 const m=html.match(/class="btn primary ready-use" data-launch-mode="([^"]+)" href="([^"]+)"/);
 assert.ok(m);const p=launchPlan(a.provider,prompt,true);assert.equal(m[1],p.mode);assert.equal(decode(m[2]),p.href);
 if(p.mode==='prefill')assert.equal(new URL(decode(m[2])).searchParams.get('q'),prompt);
 assert.ok(html.includes('class="text-button ready-copy-primary"'));assert.ok(html.includes('ready-open-fallback'));
});
