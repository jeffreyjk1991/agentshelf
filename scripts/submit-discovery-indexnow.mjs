// Submit only this release's changed public listing and discovery pages; never submit preview/private URLs.
const base='https://www.aibin.me',key='ad27013b45c6445a9b43c9b3e2706ef1';
const paths=['/','/make-agent','/ai-agent-directory','/ai-agents-for-chatgpt','/ai-agents-for-claude','/ai-agents-for-gemini'];
const request=path=>fetch(base+path,{redirect:'error',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'AIBin SEO release QA/1.0'}});
let entries,ready=false;
for(let i=0;i<12;i++){
 try{
  const [r,d,s,k,h]=await Promise.all(['/robots.txt','/agent-directory.json','/sitemap.xml','/'+key+'.txt','/make-agent'].map(request));
  const [robots,dir,sitemap,proof,html]=await Promise.all([r.text(),d.json(),s.text(),k.text(),h.text()]);
  entries=dir.entries;
  if([r,d,s,k,h].every(x=>x.ok)&&proof.trim()===key&&robots.includes('User-agent: OAI-SearchBot\nAllow: /')&&Array.isArray(entries)&&entries.length===213&&html.includes('class="quiet-details discovery-answer"')&&[...paths,...entries.map(e=>e.path)].every(p=>sitemap.includes('<loc>'+base+p+'</loc>'))){ready=true;break;}
 }catch{}
 await new Promise(resolve=>setTimeout(resolve,10000));
}
if(!ready){console.error('Production discovery release is not yet independently verified; no IndexNow submission made.');process.exitCode=1;}
else{
 const urlList=[...new Set([...paths,...entries.map(e=>e.path)].map(p=>base+p))];
 if(urlList.some(u=>new URL(u).origin!==base||!/^\/(?:$|make-agent$|ai-agent-directory$|ai-agents-for-(?:chatgpt|claude|gemini)$|(?:agents|tools|automations|live-agents)\/[a-z0-9-]+$)/.test(new URL(u).pathname)))throw Error('Invalid public URL');
 console.log('PRODUCTION_DISCOVERY_VERIFIED',JSON.stringify({listingPages:entries.length,submittedUrls:urlList.length,crawler:'OAI-SearchBot',canonicalHost:base}));
 try{
  const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({host:'www.aibin.me',key,keyLocation:base+'/'+key+'.txt',urlList}),signal:AbortSignal.timeout(15000)});
  console.log('INDEXNOW_RESPONSE',JSON.stringify({status:response.status,accepted:[200,202].includes(response.status),urls:urlList.length}));if(![200,202].includes(response.status))process.exitCode=1;
 }catch(e){console.error('IndexNow unavailable:',e.message);process.exitCode=1;}
}
