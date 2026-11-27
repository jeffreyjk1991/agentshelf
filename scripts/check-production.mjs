import fs from 'node:fs';
const base='https://www.aibin.me';
const groups=[['agents','catalog.json'],['agents','prompt-agents/catalog.json'],['automations','automations/catalog.json'],['tools','everyday/catalog.json'],['live-agents','live-agents/catalog.json']];
const entries=groups.flatMap(([prefix,file])=>JSON.parse(fs.readFileSync(file,'utf8')).map(a=>({prefix,...a})));
const failures=[],stats={compatibilityCards:0,pagesOk:0,pagesFailed:0,downloadLinksOk:0,downloadLinksMissing:0,liveOk:0,liveFailed:0};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const request=(path,options={})=>fetch(base+path,{...options,headers:{'User-Agent':'AIBin authorized marketplace QA/1.0',...(options.headers||{})},signal:AbortSignal.timeout(15000),redirect:'error'});
const fail=(type,slug,error)=>failures.push({type,slug,error:String(error).slice(0,240)});
try{
 const r=await request('/');const html=await r.text();stats.compatibilityCards=(html.match(/class="compatibility-icon"/g)||[]).length;console.log('PUBLIC_COMPATIBILITY',JSON.stringify({cards:stats.compatibilityCards,expected:196}));if(stats.compatibilityCards!==196)fail('home','compatibility-icons','Expected 196 chat-compatible listings with one mark each');
 console.log('PUBLIC_HOME',JSON.stringify({http:r.status,categoryOnly:html.includes('home-category-filters'),sortMenu:html.includes('id="market-sort"'),typeFilters:html.includes('data-filter="Use here"')||html.includes('data-filter="Get agent"'),liveIcons:(html.match(/class="live-indicator"/g)||[]).length,tagline:html.includes('Put AI to work.<br><span>For everyday life.</span>')}));
 if(!r.ok||!html.includes('home-category-filters')||html.includes('id="market-sort"')||html.includes('data-filter="Use here"')||html.includes('data-filter="Get agent"'))fail('home','homepage','Latest homepage markers missing');
}catch(e){fail('home','homepage',e.message);}
for(const a of entries.filter(a=>a.prefix==='live-agents')){
 try{
  const r=await request('/api/live-run',{method:'POST',headers:{'Content-Type':'application/json','Origin':base},body:JSON.stringify({slug:a.slug,input:a.example})});
  const raw=await r.text();let j;try{j=JSON.parse(raw);}catch{j={message:'Non-JSON response'};}
  const rows=Array.isArray(j?.result?.rows)?j.result.rows.length:0;
  console.log('PRODUCTION_LIVE',JSON.stringify({agent:a.slug,http:r.status,rows,message:r.ok?undefined:String(j.message||'').slice(0,180)}));
  if(!r.ok||rows===0)throw Error('HTTP '+r.status+': '+String(j.message||'No result rows'));
  stats.liveOk++;
 }catch(e){stats.liveFailed++;fail('live-api',a.slug,e.message);}
 await sleep(300);
}
// Public read-only checks for all listing paths. No votes or submissions are posted.
let index=0;
async function worker(){
 while(index<entries.length){
  const a=entries[index++],path='/'+a.prefix+'/'+a.slug;
  try{
   const r=await request(path),html=await r.text();
   if(!r.ok||!html.includes('<h1>')||!html.includes('<title>'))throw Error('Invalid page HTTP '+r.status);
   stats.pagesOk++;
   if(a.prefix!=='live-agents'){
    const target='/downloads/'+a.slug+'-agent.txt';
    if(html.includes('href="'+target+'" download'))stats.downloadLinksOk++;
    else{stats.downloadLinksMissing++;fail('download-link',a.slug,'Ready-to-download link missing');}
   }
  }catch(e){stats.pagesFailed++;fail('page',a.slug,e.message);}
  await sleep(150);
 }
}
await Promise.all(Array.from({length:3},worker));
try{
 const r=await request('/api/marketplace-votes'),j=await r.json();console.log('PUBLIC_VOTES',JSON.stringify({http:r.status,valid:Array.isArray(j.totals)}));
 if(!r.ok||!Array.isArray(j.totals))fail('votes','marketplace-votes','HTTP '+r.status);
}catch(e){fail('votes','marketplace-votes',e.message);}
console.log('PRODUCTION_SUMMARY',JSON.stringify(stats));
for(const failure of failures)console.log('PRODUCTION_FAILURE',JSON.stringify(failure));
if(failures.length)process.exitCode=1;
