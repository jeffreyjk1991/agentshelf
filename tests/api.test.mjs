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
