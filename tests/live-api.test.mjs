import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../api/live-run.js';
import {createLiveLimiter,checkSharedRate} from '../lib/live-rate.mjs';
import {executeLive,liveSlugs} from '../lib/live-engine.mjs';
const requests=[
 ['geothermal energy',{query:{pages:[{pageid:1,title:'Geothermal energy',extract:'Example extract',fullurl:'https://en.wikipedia.org/wiki/Geothermal_energy'}]}}],
 ['python task scheduler',{items:[{full_name:'example/project',html_url:'https://github.com/example/project',stargazers_count:10,language:'Python',license:{spdx_id:'MIT'}}]}],
 ['AI agents',{hits:[{title:'Example technology story',objectID:'12',points:9,created_at:'2026-11-25'}]}],
 ['100 USD EUR GBP',{rates:{EUR:.9,GBP:.8},date:'2026-11-25'}],
 ['US 2027',[{date:'2027-01-01',name:'New Year',localName:'New Year',global:true}]]
];
const req=(slug,input,override={})=>({method:'POST',headers:{'content-type':'application/json',origin:'https://www.aibin.me',host:'www.aibin.me'},body:{slug,input},...override});
function response(){return {headers:{},code:0,body:null,setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(b){this.body=b;return this;}};}
const handler=opts=>createHandler({getDatabase:async()=>{throw Error('Backend not configured');},report:()=>{},localAcquire:createLiveLimiter(),...opts});
for(let i=0;i<liveSlugs.length;i++)test('live API end-to-end mocked provider, no database: '+liveSlugs[i],async()=>{
 const [input,data]=requests[i],h=handler({run:body=>executeLive(body,async()=>({ok:true,text:async()=>JSON.stringify(data)}))}),res=response();
 await h(req(liveSlugs[i],input),res);assert.equal(res.code,200);assert.ok(res.body.result.rows.length>0);assert.ok(res.body.result.checkedAt);
});
test('request validation blocks invalid method, origin, malformed input and unknown agent',async()=>{
 const h=handler({run:()=>{throw Error('Must not run');}});
 for(const [r,code] of [[req(liveSlugs[0],'test',{method:'GET'}),405],[req(liveSlugs[0],'test',{headers:{'content-type':'application/json',origin:'https://evil.example',host:'www.aibin.me'}}),403],[req(liveSlugs[3],'wrong'),400],[req('unknown','test'),400]]){
 const res=response();await h(r,res);assert.equal(res.code,code);}
});
test('shared limits are honored and local limits stay enforced if DB fails',async()=>{
 const h=handler({getDatabase:async()=>({}),sharedRate:async()=>false,run:()=>{throw Error('Must not run');}}),r=response();await h(req(liveSlugs[0],'topic'),r);assert.equal(r.code,429);assert.equal(r.headers['Retry-After'],'60');
 const local=createLiveLimiter({globalLimit:1}),release=local(liveSlugs[0]);assert.ok(release);release();assert.equal(local(liveSlugs[1]),null);
 assert.equal(await checkSharedRate({database:()=>new Promise(()=>{}),rate:async()=>true,slug:liveSlugs[0],timeoutMs:5}),true);
});
test('provider failure and timeout return distinct errors, no fake results',async()=>{
 for(const [error,code] of [[Error('provider failed'),502],[Object.assign(Error('busy'),{code:'PROVIDER_RATE_LIMIT'}),429],[Object.assign(Error('timeout'),{name:'TimeoutError'}),504]]){
 const h=handler({run:async()=>{throw error;}}),r=response();await h(req(liveSlugs[0],'topic'),r);assert.equal(r.code,code);assert.equal(r.body.result,undefined);}
});
