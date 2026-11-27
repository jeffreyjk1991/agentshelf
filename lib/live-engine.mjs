// Fixed read-only data providers; no arbitrary user URLs or external actions.
export const liveSlugs=['live-topic-research','live-github-scout','live-tech-news','live-currency-compare','live-holiday-planner'];
export function normalizeRun(body){
 if(!body||!liveSlugs.includes(body.slug)||typeof body.input!=='string')throw Error('Select a supported live agent and enter a request.');
 const input=body.input.trim();
 if(input.length<2||input.length>180||/[\u0000-\u001f\u007f]/.test(input))throw Error('Enter a short request of 2–180 characters.');
 return {slug:body.slug,input};
}
export function requestFor({slug,input}){
 let url,context={};
 if(slug===liveSlugs[0]){
  url=new URL('https://en.wikipedia.org/w/api.php');
  for(const [k,v] of Object.entries({action:'query',generator:'search',gsrsearch:input,gsrnamespace:'0',gsrlimit:'5',prop:'extracts|info',exintro:'1',explaintext:'1',exsentences:'3',inprop:'url',format:'json',formatversion:'2'}))url.searchParams.set(k,v);
 }else if(slug===liveSlugs[1]){
  url=new URL('https://api.github.com/search/repositories');url.searchParams.set('q',input);url.searchParams.set('sort','stars');url.searchParams.set('order','desc');url.searchParams.set('per_page','6');
 }else if(slug===liveSlugs[2]){
  url=new URL('https://hn.algolia.com/api/v1/search_by_date');url.searchParams.set('query',input);url.searchParams.set('tags','story');url.searchParams.set('hitsPerPage','8');
 }else if(slug===liveSlugs[3]){
  const parts=input.toUpperCase().split(/[\s,]+/),amount=Number(parts.shift()),base=parts.shift(),targets=[...new Set(parts)];
  if(!Number.isFinite(amount)||amount<=0||amount>1e9||!(/^[A-Z]{3}$/).test(base||'')||targets.length<1||targets.length>4||targets.some(x=>!(/^[A-Z]{3}$/).test(x)||x===base))throw Error('Use an amount, base currency and 1–4 different targets: 100 USD EUR GBP.');
  url=new URL('https://api.frankfurter.dev/v1/latest');url.searchParams.set('base',base);url.searchParams.set('symbols',targets.join(','));context={amount,base,targets};
 }else if(slug===liveSlugs[4]){
  const m=/^([A-Z]{2})\s+(20[0-9]{2})$/i.exec(input);
  if(!m||Number(m[2])<2020||Number(m[2])>new Date().getUTCFullYear()+2)throw Error('Enter a two-letter country code and a year from 2020 through two years ahead, e.g. US 2027.');
  url=new URL('https://date.nager.at/api/v3/PublicHolidays/'+m[2]+'/'+m[1].toUpperCase());
 }else throw Error('Unknown agent.');
 return {url:url.href,context};
}
const str=(x,n=800)=>String(x??'').slice(0,n);
const num=x=>Number.isFinite(Number(x))?Number(x):0;
function safeLink(raw,host){try{const u=new URL(raw);if(u.protocol==='https:'&&u.hostname===host&&!u.username&&!u.password)return u.href;}catch{}return '';}
export function formatResult(slug,data,context={}){
 let title,rows=[],note='';
 if(slug===liveSlugs[0]){
  if(data?.error)throw Error('Research provider error.');
  title='Research starting points';
  rows=(data?.query?.pages||[]).filter(p=>p.pageid&&p.title).sort((a,b)=>num(a.index)-num(b.index)).slice(0,5).map(p=>({title:str(p.title,180),detail:str(p.extract||'Open the source for context.'),url:safeLink(p.fullurl,'en.wikipedia.org')||'https://en.wikipedia.org/?curid='+encodeURIComponent(p.pageid)}));
  note='Wikipedia extracts; verify important claims with primary sources.';
 }else if(slug===liveSlugs[1]){
  if(!Array.isArray(data?.items))throw Error('Repository search is unavailable.');
  title='Public repository shortlist';
  rows=data.items.slice(0,6).map(x=>({title:str(x.full_name,180),detail:str(x.description||'No description')+' · '+num(x.stargazers_count).toLocaleString('en-US')+' stars · '+str(x.language||'Language not listed',60)+' · '+str(x.license?.spdx_id||'License not listed',60),url:safeLink(x.html_url,'github.com')})).filter(x=>x.url);
  note='Stars are not a quality or security guarantee. Inspect the repository before use.';
 }else if(slug===liveSlugs[2]){
  if(!Array.isArray(data?.hits))throw Error('News search is unavailable.');
  title='Recent Hacker News stories';
  rows=data.hits.filter(x=>x.title&&/^\d+$/.test(String(x.objectID))).slice(0,8).map(x=>({title:str(x.title,220),detail:str(x.created_at,10)+' · '+num(x.points)+' points',url:'https://news.ycombinator.com/item?id='+x.objectID}));
  note='Technology community discussions, not a comprehensive or independently verified news feed.';
 }else if(slug===liveSlugs[3]){
  if(!data?.rates||!data.date)throw Error('No reference rates returned.');
  title='Reference-rate comparison';
  rows=context.targets.filter(c=>Number.isFinite(data.rates[c])&&data.rates[c]>0).map(c=>({title:new Intl.NumberFormat('en-US',{style:'currency',currency:c,maximumFractionDigits:2}).format(context.amount*data.rates[c]),detail:context.amount+' '+context.base+' × '+data.rates[c]+' · Reference date '+str(data.date,20),url:'https://frankfurter.dev/'}));
  note='Reference rates exclude fees and are not bank or card quotes.';
 }else if(slug===liveSlugs[4]){
  if(!Array.isArray(data))throw Error('No holiday calendar returned.');
  title='Public holidays';
  rows=data.slice().sort((a,b)=>str(a.date).localeCompare(str(b.date))).slice(0,100).map(x=>({title:str(x.date,10)+' — '+str(x.name,150),detail:str(x.localName,200)+' · '+(x.global?'National':'Regional / check local rules'),url:'https://date.nager.at/'}));
  note='Confirm holidays and local closures with official authorities.';
 }else throw Error('Unknown agent.');
 return {title,rows,note,checkedAt:new Date().toISOString()};
}
export async function executeLive(body,fetcher=fetch){
 const req=normalizeRun(body),{url,context}=requestFor(req);
 const response=await fetcher(url,{headers:{Accept:'application/json','User-Agent':'AIBin-marketplace/1.0 (https://www.aibin.me/about)'},signal:AbortSignal.timeout(8000),redirect:'error'});
 if(!response.ok){const error=Error('The public data provider is temporarily unavailable.');if(response.status===429||(response.status===403&&req.slug==='live-github-scout'))error.code='PROVIDER_RATE_LIMIT';throw error;}
 const raw=await response.text();if(raw.length>2_000_000)throw Error('The source response was too large.');
 return formatResult(req.slug,JSON.parse(raw),context);
}
