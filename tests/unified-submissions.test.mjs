import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {categories,normalizeAgentSubmission} from '../lib/agent-submission.mjs';
import {createSubmissionHandler} from '../api/submissions.js';
import retiredVote from '../api/marketplace-votes.js';
import retiredCommunity from '../api/community.js';
import retiredLinks from '../api/marketplace-links.js';
const valid={name:'Travel helper',creator:'Example maker',category:'Travel',description:'Plan a practical short vacation.',provider:'chatgpt',source:'Task: create a practical itinerary with realistic travel time.',consent:true};
const res=()=>({headers:{},code:0,body:null,setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(b){this.body=b;return this;}});
const req=(body,method='POST')=>({method,headers:{origin:'https://www.aibin.me',host:'www.aibin.me','content-type':'application/json'},body});
test('unified submission accepts instructions and public links; category and preferred chat match the catalog',()=>{
 const expected=[...new Set(['catalog.json','prompt-agents/catalog.json','automations/catalog.json','everyday/catalog.json','live-agents/catalog.json'].flatMap(p=>JSON.parse(fs.readFileSync(p,'utf8')).map(a=>a.category)))].sort();
 assert.deepEqual(categories.slice().sort(),expected);
 assert.equal(normalizeAgentSubmission(valid).kind,'instructions');
 assert.equal(normalizeAgentSubmission(valid).instructions,valid.source);
 const link=normalizeAgentSubmission({...valid,provider:'any',source:'https://chatgpt.com/g/g-example-agent'});
 assert.equal(link.provider,'chatgpt');assert.equal(link.kind,'link');assert.equal(link.platform,'ChatGPT');
 assert.equal(normalizeAgentSubmission({...valid,provider:'none',source:'https://github.com/Owner/Example.git'}).url,'https://github.com/owner/example');
 for(const change of [{consent:false},{category:'Invalid'},{provider:'unknown'},{provider:'none'},{provider:'claude',source:'https://chatgpt.com/g/g-example-agent'},{source:'https://github.com.evil.example/a/b'},{source:'javascript:alert("bad")'},{description:'My contact is me@example.com'},{source:'Use a private key sk-123456789012345678901234567890'}])assert.throws(()=>normalizeAgentSubmission({...valid,...change}));
});
test('single submission handler validates input, stores a pending review, serves only approved entries and reports DB failure',async()=>{
 let calls=[];
 const sql=async(strings,...args)=>{const query=strings.join('?');calls.push({query,args});return query.includes('INSERT')?[{id:1}]:[{id:2,name:'Reviewed agent',creator:'Maker',category:'Travel'}];};
 const h=createSubmissionHandler({getDatabase:async()=>sql,limit:async()=>true,report:()=>{}});
 let r=res();await h(req(valid),r);assert.equal(r.code,201);assert.match(r.body.message,/review/);
 assert.ok(calls[0].query.includes('INSERT INTO marketplace_agent_submissions'));
 assert.ok(!calls[0].query.includes("'approved'"));
 assert.ok(calls[0].args.includes(valid.creator)&&calls[0].args.includes(valid.category)&&calls[0].args.includes(valid.provider));
 r=res();await h(req(null,'GET'),r);assert.equal(r.code,200);assert.ok(calls.at(-1).query.includes("status='approved'"));
 r=res();await h(req({...valid,consent:false}),r);assert.equal(r.code,400);
 const unavailable=createSubmissionHandler({getDatabase:async()=>{throw Object.assign(Error('private detail'),{code:'DB_CONFIG_MISMATCH'});},report:()=>{}});
 r=res();await unavailable(req(valid),r);assert.equal(r.code,503);assert.equal(r.body.code,'DB_CONFIG_MISMATCH');assert.ok(!JSON.stringify(r.body).includes('private detail'));
 const limited=createSubmissionHandler({getDatabase:async()=>sql,limit:async()=>false,report:()=>{}});r=res();await limited(req(valid),r);assert.equal(r.code,429);
});
test('legacy voting and duplicate submission endpoints are disabled',()=>{
 for(const handler of [retiredVote,retiredCommunity,retiredLinks]){for(const method of ['GET','POST']){const r=res();handler(req(valid,method),r);assert.equal(r.code,410);}}
});
test('one submission form with matching fields, no voting JS, redirects and true creator credits',()=>{
 const home=fs.readFileSync('dist/index.html','utf8'),form=fs.readFileSync('dist/community.html','utf8'),main=fs.readFileSync('dist/assets/main.js','utf8');
 assert.equal((form.match(/<form\b/g)||[]).length,1);
 for(const key of ['name','creator','category','provider','description','source','consent'])assert.ok(form.includes('name="'+key+'"'));
 assert.ok(!main.includes('votes.mjs')&&!main.includes('voteRank'));
 assert.ok(!fs.existsSync('dist/assets/votes.mjs'));
 assert.equal((home.match(/class="agent-creator">By AIBin<\/span>/g)||[]).length,201);
 assert.ok(!home.includes('href="/publish"')&&!form.includes('href="/publish"'));
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.ok(config.redirects.some(x=>x.source==='/publish'&&x.destination==='/community'&&x.permanent));
});
