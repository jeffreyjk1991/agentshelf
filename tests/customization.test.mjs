import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {customizationFields} from '../scripts/customize-agent.mjs';
import {mergePreferences,referenceLinks} from '../assets/customize-agent.mjs';
import {orderCategories} from '../scripts/category-order.mjs';
import {searchDemand} from '../scripts/competitor-demand.mjs';
import {launchPlan} from '../assets/chat-launch.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8'),cat=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const groups=[['agents',[...cat('catalog.json'),...cat('prompt-agents/catalog.json')]],['automations',cat('automations/catalog.json')],['tools',cat('everyday/catalog.json')]];
test('all 208 chat-compatible agents have optional guided customization in the original closed details',()=>{
 let total=0;for(const [prefix,items] of groups)for(const a of items){total++;const html=read(prefix+'/'+a.slug+'.html'),fields=customizationFields(a.slug);assert.ok(fields.length>=1,a.slug);assert.ok(html.includes('<details class="quiet-details ready-edit"><summary>✎ Customize (optional)</summary><div class="ready-variables">'),a.slug);assert.equal((html.match(/data-custom-field data-label=/g)||[]).length,fields.length,a.slug);assert.ok(html.includes('class="ready-references"'));assert.ok(html.includes('class="assistant-prompt ready-prompt"'));assert.ok(html.includes('value="">Keep default</option>')||fields.every(f=>!f.options));}
 assert.equal(total,208);
 assert.equal(customizationFields('flight-price-watcher')[0].label,'From and to (airports or cities)');
 assert.ok(customizationFields('social-caption-writer').some(f=>f.label==='Platform'));
 assert.ok(customizationFields('professional-headshot-maker').some(f=>f.label==='Background'));
 assert.equal(customizationFields('product-finder')[0].label,'What are you shopping for?');
});
test('blank defaults are identical and edited preferences never enter the launch URL',()=>{
 const base='Original public instructions';assert.deepEqual(mergePreferences(base,[{label:'Tone',value:''}],' '),{prompt:base,suffix:''});
 const merged=mergePreferences(base,[{label:'Tone',value:'Friendly'},{label:'Platform',value:'Instagram'}],'https://example.com/one\nhttps://example.com/two');
 assert.ok(merged.prompt.startsWith(base));assert.ok(merged.prompt.includes('Tone: Friendly'));assert.ok(merged.prompt.includes('https://example.com/two'));assert.ok(merged.prompt.includes('untrusted data'));
 for(const provider of ['chatgpt','claude','gemini']){const plan=launchPlan(provider,merged.prompt,false);assert.equal(plan.mode,'copy');assert.ok(!plan.href.includes('?'));}
 assert.deepEqual(referenceLinks('https://example.com/\nhttps://example.com/'),['https://example.com/']);
 for(const bad of ['javascript:alert(1)','ftp://example.com','https://user:pass@example.com','https://example.com/a b','not a link'])assert.throws(()=>referenceLinks(bad));
 assert.throws(()=>referenceLinks(Array.from({length:6},(_,i)=>'https://example.com/'+i).join('\n')));
 assert.throws(()=>mergePreferences('x'.repeat(11999),[{label:'Tone',value:'Friendly'}],''));
});
test('homepage keeps All first, demand-backed categories in descending order and Community last',()=>{
 const assistants=groups[0][1],home=read('index.html'),block=home.match(/<div class="filters compact-filters home-category-filters"[\s\S]*?<\/div>/)[0];
 const cats=[...block.matchAll(/data-filter="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(cats[0],'All');assert.equal(cats.at(-1),'Community');assert.equal(new Set(cats).size,cats.length);
 assert.deepEqual(cats,orderCategories(cats,assistants));assert.ok(cats.indexOf('Photography')<cats.indexOf('Social media'));assert.ok(cats.indexOf('Writing')<cats.indexOf('Video'));
 const categoryBySlug=new Map(assistants.map(a=>[a.slug,a.category])),score=c=>Math.max(0,...searchDemand.filter(t=>categoryBySlug.get(t.slug)===c).map(t=>t.monthlySearches));
 const scores=cats.slice(1,-1).map(score);assert.deepEqual(scores,[...scores].sort((a,b)=>b-a));
 assert.equal((home.match(/ data-agent /g)||[]).length,213);
});
