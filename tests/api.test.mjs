import test from 'node:test';import assert from 'node:assert/strict';import {normalizeSubmission,eventFields,validateRequest} from '../lib/api.mjs';
const valid={name:'Example Agent',repository_url:'https://github.com/Owner/Example.git',category:'Coding',license:'MIT',description:'A useful example with detailed instructions.',consent:true};
test('submission normalization',()=>assert.equal(normalizeSubmission(valid).repository_url,'https://github.com/owner/example'));
test('reject invalid or untrusted links',()=>{for(const repository_url of ['http://github.com/a/b','https://github.com.evil.test/a/b','https://github.com/a/b/tree/main','https://github.com/a/b?q=1','https://user@github.com/a/b'])assert.throws(()=>normalizeSubmission({...valid,repository_url}));});
test('require consent and supported license',()=>{assert.throws(()=>normalizeSubmission({...valid,consent:false}));assert.throws(()=>normalizeSubmission({...valid,license:'proprietary'}));});
test('validate events',()=>{assert.deepEqual(eventFields({slug:'seo-auditor',event:'download'}),{slug:'seo-auditor',event:'download'});assert.throws(()=>eventFields({slug:'../../x',event:'delete'}));});
test('cross-origin and method checks',()=>{const req={method:'POST',headers:{origin:'https://example.test',host:'example.test','content-type':'application/json'},body:valid};assert.equal(validateRequest(req),null);assert.equal(validateRequest({...req,method:'GET'})[0],405);assert.equal(validateRequest({...req,headers:{...req.headers,origin:'https://bad.test'}})[0],403);});

import {normalizeTraffic,createTrafficHandler} from '../api/traffic.js';
test('traffic normalization keeps only coarse dimensions and never client-provided geolocation',()=>{
 const v=normalizeTraffic({kind:'first_visit',path:'/agents/resume-builder',source:'google',country:'IN',ip:'discarded',query:'private'},{'x-vercel-ip-country':'US','user-agent':'iPhone Mobile'});
 assert.deepEqual(v,{path:'/agents/resume-builder',slug:'resume-builder',source:'google',kind:'first_visit',country:'US',device:'mobile'});
 assert.equal(normalizeTraffic({kind:'page_view',path:'/how-to/any-private-slug',source:'direct_or_unknown'}).path,'/how-to');
 assert.equal(normalizeTraffic({kind:'page_view',path:'/unknown/private-data',source:'direct_or_unknown'}).path,'/other');
 assert.equal(normalizeTraffic({kind:'page_view',path:'/',source:'direct_or_unknown'},{'x-vercel-ip-country':'Invalid'}).country,'ZZ');
 for(const path of ['/tools?secret=1','/shared-agent#private','/../../bad','/a%20b'])assert.throws(()=>normalizeTraffic({kind:'page_view',path,source:'google'}));
});
test('traffic writes aggregate counts only, and skips previews, bots and privacy opt-outs',async()=>{
 const calls=[];const sql=async(parts,...args)=>{calls.push({query:parts.join('?'),args});return parts[0].includes('SELECT 1')?[{ok:1}]:[];};
 const handler=createTrafficHandler({getDatabase:async()=>sql,limit:async()=>true,env:{VERCEL_ENV:'production'}});
 const req={method:'POST',headers:{host:'www.aibin.me',origin:'https://www.aibin.me','content-type':'application/json','user-agent':'Mozilla iPhone Mobile','x-vercel-ip-country':'CA'},body:{kind:'page_view',path:'/agents/resume-builder',source:'google'}};
 async function call(h,r){const res={setHeader(){},status(n){this.code=n;return this;},json(v){return v;}};await h(r,res);return res.code;}
 assert.equal(await call(handler,req),201);
 assert.equal(calls.length,2);assert.ok(calls[1].query.includes('ON CONFLICT'));assert.deepEqual(calls[1].args,['/agents/resume-builder','CA','mobile','google','page_view']);
 for(const headers of [{dnt:'1'},{'sec-gpc':'1'},{'user-agent':'Googlebot'}])assert.equal(await call(handler,{...req,headers:{...req.headers,...headers}}),200);
 assert.equal(await call(createTrafficHandler({env:{VERCEL_ENV:'preview'},getDatabase:async()=>{throw Error('must not access DB');}}),req),200);
 assert.equal(calls.length,2);
});

import {normalizeNewsletter,createNewsletterHandler} from '../api/newsletter.js';
import {createTrendingHandler} from '../api/trending.js';
test('newsletter validates consent and tokens without trusting extra fields',()=>{
 assert.deepEqual(normalizeNewsletter({email:' Reader@Example.test ',consent:true,private:'discard'}),{action:'subscribe',email:'reader@example.test'});
 for(const body of [{email:'x@example.test',consent:false},{email:'bad email',consent:true},{action:'unsubscribe',token:'x'},{action:'delete',email:'x@example.test',consent:true}])assert.throws(()=>normalizeNewsletter(body));
 assert.deepEqual(normalizeNewsletter({action:'confirm',token:'a'.repeat(43),email:'discard'}),{action:'confirm',token:'a'.repeat(43)});
});
test('newsletter writes pending consent, hashes tokens, never sends in preview or without credentials',async()=>{
 const calls=[];let sent=0;
 const sql=async(parts,...args)=>{calls.push({query:parts.join('?'),args});return [{status:'pending'}];};
 const req={method:'POST',headers:{host:'www.aibin.me',origin:'https://www.aibin.me','content-type':'application/json'},body:{email:'reader@example.test',consent:true}};
 async function invoke(h,r){const res={setHeader(){},status(n){this.code=n;return this;},json(v){this.value=v;return v;}};await h(r,res);return res;}
 const h=createNewsletterHandler({env:{VERCEL_ENV:'production'},getDatabase:async()=>sql,limit:async()=>true,fetcher:async()=>{sent++;return {ok:true};}});
 const a=await invoke(h,req);assert.equal(a.code,200);assert.ok(a.value.message.includes('not yet available'));assert.match(a.value.withdrawToken,/^[A-Za-z0-9_-]{43}$/);assert.ok(calls[0].query.includes("'pending'"));assert.ok(!calls[0].args.includes(a.value.withdrawToken));assert.equal(sent,0);
 const b=await invoke(h,{...req,body:{action:'withdraw',token:a.value.withdrawToken}});assert.equal(b.code,200);assert.ok(calls[1].query.includes("'unsubscribed'"));assert.ok(!calls[1].args.includes(a.value.withdrawToken));
 assert.equal((await invoke(createNewsletterHandler({env:{VERCEL_ENV:'preview'},getDatabase:async()=>{throw Error('no writes');}}),req)).code,503);assert.equal(calls.length,2);
});
test('trending is read-only and returns measured activity only',async()=>{
 const sql=async(parts)=>{assert.ok(parts.join('').includes("HAVING count(*)>=2"));assert.ok(parts.join('').includes("interval '7 days'"));return [{slug:'job-opening-scout',actions:'3'}];};
 const h=createTrendingHandler({getDatabase:async()=>sql});const res={setHeader(){},status(n){this.code=n;return this;},json(v){this.value=v;return v;}};await h({method:'GET'},res);assert.equal(res.code,200);assert.deepEqual(res.value.items,[{slug:'job-opening-scout',actions:3}]);
});
