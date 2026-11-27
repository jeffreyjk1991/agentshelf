const base='https://www.aibin.me';
const req=(path,opts={})=>fetch(base+path,{...opts,headers:{'User-Agent':'AIBin release QA/1.0',...opts.headers},signal:AbortSignal.timeout(15000),redirect:'error'});
let ready=false,last='deployment not ready';
for(let i=0;i<24;i++){
 try{
  const form=await req('/community'),html=await form.text();
  if(form.ok&&html.includes('No preference / Not sure')&&html.includes('Not sure — choose for me')&&html.includes('<option>Photography</option>')){
   const db=await req('/api/submissions'),j=await db.json();
   last='HTTP '+db.status+' '+(typeof j.code==='string'&&/^DB_[A-Z_]+$/.test(j.code)?j.code:'');
   console.log('SUBMISSION_READ',last);
   if(db.ok&&Array.isArray(j.agents)){ready=true;break;}
   if(db.status===503)break;
  }
 }catch(e){last=String(e.message).slice(0,100);}
 await new Promise(r=>setTimeout(r,5000));
}
if(!ready)throw Error('Production submission read failed: '+last);
const marker='QA release probe '+(process.env.GITHUB_RUN_ID||'manual')+'-'+(process.env.GITHUB_RUN_ATTEMPT||'1');
const body={name:marker,creator:'qa-probe',category:'unsure',provider:'any',description:'Temporary unpublished AIBin release verification.',source:'Return a short planning checklist. This is an unpublished release test.',consent:true};
const r=await req('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify(body)});
const j=await r.json();
console.log('SUBMISSION_WRITE',JSON.stringify({status:r.status,marker,code:typeof j.code==='string'&&/^DB_[A-Z_]+$/.test(j.code)?j.code:undefined}));
if(r.status!==201||!String(j.message).includes('review'))throw Error('Submission write failed');
const listing=await req('/api/submissions'),data=await listing.json();
if(!listing.ok||!Array.isArray(data.agents)||data.agents.some(x=>x.name===marker))throw Error('Pending probe should not be public');
console.log('SUBMISSION_PENDING_HIDDEN PASS');
