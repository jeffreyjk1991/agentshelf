import assert from 'node:assert/strict';
const base='https://www.aibin.me';
const get=async(path,opts={})=>fetch(base+path,{...opts,headers:{'User-Agent':'AIBin authorized release QA/1.0',...(opts.headers||{})},signal:AbortSignal.timeout(15000),redirect:'error'});
let ready=false,last='waiting for production';
for(let i=0;i<24;i++){
 try{
  const r=await get('/community'),html=await r.text();
  if(r.ok&&html.includes('Other / Not sure')&&html.includes('No preference / Not sure')){
   const db=await get('/api/submissions'),data=await db.json();
   last='HTTP '+db.status+' '+(typeof data.code==='string'&&/^DB_[A-Z_]+$/.test(data.code)?data.code:'');
   console.log('SUBMISSION_READ',last);
   if(db.ok&&Array.isArray(data.agents)){ready=true;break;}
   if(db.status===503)break;
  }
 }catch(e){last=String(e.message).slice(0,100);}
 await new Promise(r=>setTimeout(r,5000));
}
assert.ok(ready,'Production submission read failed: '+last);
const marker='QA release probe '+(process.env.GITHUB_RUN_ID||'manual')+'-'+(process.env.GITHUB_RUN_ATTEMPT||'1');
const body={name:marker,creator:'qa-probe',category:'Other',provider:'any',description:'Temporary unpublished AIBin release verification.',source:'Return a short planning checklist. This is an unpublished release test.',consent:true};
const r=await get('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify(body)});
const data=await r.json();
console.log('SUBMISSION_WRITE',JSON.stringify({status:r.status,marker,code:typeof data.code==='string'&&/^DB_[A-Z_]+$/.test(data.code)?data.code:undefined}));
assert.equal(r.status,201);
assert.match(data.message,/review/i);
const again=await get('/api/submissions'),list=await again.json();
assert.ok(again.ok&&Array.isArray(list.agents)&&!list.agents.some(a=>a.name===marker),'Pending QA submission must not be public');
console.log('SUBMISSION_PENDING_HIDDEN PASS');
