import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeVote,normalizeLink} from '../lib/marketplace.mjs';
import {normalizeRun,requestFor,formatResult,executeLive,liveSlugs} from '../lib/live-engine.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8');
test('vote values, UUID and link validation',()=>{
 const voter='12345678-1234-4234-8234-123456789abc';
 assert.equal(normalizeVote({slug:'live-topic-research',voter,value:-1}).value,-1);
 assert.equal(normalizeVote({slug:'live-topic-research',voter,value:0}).value,0);
 assert.throws(()=>normalizeVote({slug:'bad/slug',voter,value:1}));
 assert.throws(()=>normalizeVote({slug:'good',voter,value:2}));
 assert.throws(()=>normalizeVote({slug:'good',voter:'bad',value:1}));
 const body={name:'Useful agent',creator:'Maker',description:'A public helpful reusable agent.',consent:true,url:'https://github.com/Maker/Project.git'};
 assert.equal(normalizeLink(body).url,'https://github.com/maker/project');
 assert.equal(normalizeLink({...body,url:'https://chatgpt.com/g/g-example-agent'}).platform,'ChatGPT');
 for(const url of ['javascript:alert(1)','https://github.com.evil.org/x/y','https://github.com/x/y?secret=1','https://github.com/x/y/issues','https://claude.ai/chat/private'])assert.throws(()=>normalizeLink({...body,url}));
});
test('bounded source requests and response parsing (mocked providers)',async()=>{
 assert.equal(new URL(requestFor(normalizeRun({slug:liveSlugs[0],input:'solar power'})).url).hostname,'en.wikipedia.org');
 assert.equal(new URL(requestFor({slug:liveSlugs[1],input:'https://evil.example'}).url).hostname,'api.github.com');
 assert.equal(new URL(requestFor({slug:liveSlugs[2],input:'AI agents'}).url).hostname,'hn.algolia.com');
 const cur=requestFor({slug:liveSlugs[3],input:'100 USD EUR GBP'});
 assert.equal(new URL(cur.url).hostname,'api.frankfurter.dev');
 assert.equal(formatResult(liveSlugs[3],{rates:{EUR:.9,GBP:.8},date:'2026-11-25'},cur.context).rows.length,2);
 assert.throws(()=>requestFor({slug:liveSlugs[3],input:'100 USD USD'}));
 assert.equal(new URL(requestFor({slug:liveSlugs[4],input:'US 2027'}).url).hostname,'date.nager.at');
 assert.equal(formatResult(liveSlugs[4],[{date:'2027-01-01',name:'New Year',global:true}]).rows.length,1);
 const result=await executeLive({slug:liveSlugs[0],input:'solar power'},async()=>({ok:true,text:async()=>JSON.stringify({query:{pages:[{pageid:1,title:'Solar energy',extract:'Example extract',fullurl:'https://en.wikipedia.org/wiki/Solar_energy'}]}})}));
 assert.equal(result.rows[0].title,'Solar energy');
 await assert.rejects(executeLive({slug:liveSlugs[0],input:'solar power'},async()=>({ok:false})));
 assert.equal(formatResult(liveSlugs[1],{items:[{full_name:'x/y',html_url:'https://evil.example/x/y'}]}).rows.length,0);
 assert.equal(formatResult(liveSlugs[2],{hits:[{title:'Story',objectID:'12',points:9,created_at:'2026-11-25'}]}).rows[0].url,'https://news.ycombinator.com/item?id=12');
});
test('201 helpers, live pages, submission, SEO and unchanged tagline',()=>{
 const h=read('index.html'),s=read('sitemap.xml'),c=JSON.parse(read('live-agents.json'));
 assert.equal(c.count,5);assert.equal((h.match(/ data-agent /g)||[]).length,201);
 assert.ok(h.includes('Show all 201 helpers'));assert.ok(!h.includes('id="market-sort"'));assert.equal((h.match(/class="live-indicator"/g)||[]).length,5);assert.ok(h.includes('/assets/marketplace.css'));assert.ok(h.includes('Put AI to work.'));
 for(const a of c.agents){const path='/live-agents/'+a.slug,html=read(path.slice(1)+'.html');assert.ok(h.includes('href="'+path+'"'));assert.ok(html.includes('id="live-form"'));assert.ok(html.includes('Example request'));assert.ok(html.includes('data-live-slug="'+a.slug+'"'));assert.ok(html.includes('WebApplication'));if(s.includes('<loc>'))assert.ok(s.includes(path+'</loc>'));assert.ok(read('llms.txt').includes(path));}
 assert.ok(read('community.html').includes('id="link-submit"'));assert.ok(read('community.html').includes('/assets/link-submissions.mjs'));assert.ok(read('llms.txt').includes('/live-agents.json'));assert.ok(fs.existsSync('dist/downloads/aibin-agent-runner.zip'));
});

test('runner discovery and community ranking are linked',()=>{const home=read('index.html'),s=read('sitemap.xml');assert.ok(home.includes('data-filter="Community"'));assert.ok(read('live-agents.html').includes('href="/agent-runner"'));assert.ok(read('agent-runner.html').includes('aibin-agent-runner.zip'));if(s.includes('<loc>'))assert.ok(s.includes('/agent-runner</loc>'));assert.ok(read('assets/community-cards.mjs').includes('ugc nofollow'));assert.ok(read('assets/main.js').includes('fetchCommunityCards()'));assert.ok(read('llms.txt').includes('/agent-runner'));});
