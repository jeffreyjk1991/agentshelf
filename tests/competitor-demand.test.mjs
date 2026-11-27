import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync('dist/'+p,'utf8');
const d=JSON.parse(read('competitor-demand.json'));
const prompts=JSON.parse(read('prompt-agents.json'));
const home=read('index.html'),hub=read('popular-ai-agents.html'),site=read('sitemap.xml');
test('eight competitor groups, forty mapped tasks and distinct original examples',()=>{
 assert.equal(d.competitors.length,8);
 assert.equal(d.competitors.reduce((n,c)=>n+c.tasks.length,0),40);
 const all=[...new Set(d.competitors.flatMap(c=>c.tasks.map(t=>t.slug)))];
 assert.equal(all.length,28);
 assert.equal(prompts.count,118);
 for(const c of d.competitors){assert.equal(c.tasks.length,5);for(const t of c.tasks){assert.ok(t.path.startsWith('/agents/'));const html=read(t.path.slice(1)+'.html');assert.ok(home.includes('href="'+t.path+'"'));assert.ok(hub.includes('href="'+t.path+'"'));assert.ok(html.includes('Example request'));assert.ok(html.includes('What you can expect'));assert.ok(html.includes('What to check'));assert.ok(html.includes('Download agent'));assert.ok(html.includes('href="/popular-ai-agents"'));assert.ok(d.details[t.slug].limit.length>30);if(site.includes('<loc>'))assert.ok(site.includes(t.path+'</loc>'));}}
 assert.ok(home.includes('href="/popular-ai-agents"'));
 assert.ok(read('llms.txt').includes('/popular-ai-agents'));
 assert.ok(read('competitor-research.html').includes('not a verified top-five traffic ranking'));
 assert.ok(read('google8d69054a5244e64f.html').includes('google-site-verification:'));
 if(site.includes('<loc>'))assert.ok(site.includes('/popular-ai-agents</loc>'));
});
