const allowedCategories=new Set(['Business','Coding','Marketing','Productivity','Research']);
const allowedLicenses=new Set(['MIT','Apache-2.0','GPL-3.0','BSD-3-Clause','AGPL-3.0','MPL-2.0']);
export function normalizeSubmission(body){
  if(!body||typeof body!=='object'||Array.isArray(body)||body.consent!==true)throw Error('Confirm you have permission to submit this repository.');
  const field=(name,min,max)=>{if(typeof body[name]!=='string')throw Error('Complete every field.');const v=body[name].trim();if(v.length<min||v.length>max)throw Error('Check the length of '+name.replaceAll('_',' ')+'.');return v;};
  const name=field('name',2,100),description=field('description',20,2000),category=field('category',2,40),license=field('license',2,40),raw=field('repository_url',10,300);
  let url;try{url=new URL(raw);}catch{throw Error('Enter a valid public GitHub repository URL.');}
  if(url.origin!=='https://github.com'||url.username||url.password||url.search||url.hash||!/^\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9_.-]{1,100}\/?$/.test(url.pathname))throw Error('Use https://github.com/owner/repository with no query or subpath.');
  if(!allowedCategories.has(category)||!allowedLicenses.has(license))throw Error('Choose a supported category and declared license.');
  return {name,description,category,license,repository_url:'https://github.com'+url.pathname.replace(/\/$/,'').replace(/\.git$/,'').toLowerCase()};
}
export function eventFields(body){if(!body||typeof body.slug!=='string'||!(/^[a-z0-9-]{1,80}$/).test(body.slug)||!['download','demo','deploy_click'].includes(body.event))throw Error('Invalid agent event.');return {slug:body.slug,event:body.event};}
export function validateRequest(req){if(req.method!=='POST')return [405,'Method not allowed.'];const contentType=String(req.headers['content-type']||'');if(!contentType.startsWith('application/json'))return [415,'Send JSON.'];const origin=req.headers.origin;const host=req.headers.host;try{if(!origin||new URL(origin).host!==host)return [403,'Requests must originate from this website.'];}catch{return [403,'Invalid request origin.'];}if(Number(req.headers['content-length']||0)>12000)return [413,'Request is too large.'];try{if(JSON.stringify(req.body??{}).length>12000)return [413,'Request is too large.'];}catch{return [400,'Invalid JSON.'];}return null;}
export function respond(res,code,message,extra={}){res.setHeader('Cache-Control','no-store');if(code===405)res.setHeader('Allow','POST');return res.status(code).json({message,...extra});}
// Vercel's Neon integration can supply either DATABASE_URL or POSTGRES_URL.
const aibinHosts=new Set(['ep-tiny-shadow-bb3qfk0l.c-15.us-east-1.aws.neon.tech','ep-tiny-shadow-bb3qfk0l-pooler.c-15.us-east-1.aws.neon.tech']);
export function selectDatabaseUrl(env=process.env){
 const explicit=env.AIBIN_DATABASE_URL?.trim(),production=env.VERCEL_ENV==='production';
 if(explicit){
  try{const u=new URL(explicit);if(['postgres:','postgresql:'].includes(u.protocol)&&u.hostname&&u.pathname!=='/'&&(!production||(aibinHosts.has(u.hostname)&&u.pathname==='/neondb')))return explicit;}catch{}
  throw Error('AIBin database configuration invalid');
 }
 for(const candidate of [env.DATABASE_URL,env.POSTGRES_URL,env.DATABASE_URL_UNPOOLED,env.POSTGRES_URL_NON_POOLING]){
  const value=candidate?.trim();if(!value)continue;
  try{const u=new URL(value);if(!['postgres:','postgresql:'].includes(u.protocol)||!u.hostname||u.pathname==='/')continue;
   if(!production&&value===env.DATABASE_URL?.trim())return value;
   if(aibinHosts.has(u.hostname)&&u.pathname==='/neondb')return value;
  }catch{}
 }
 throw Error('AIBin database configuration missing or does not match the dedicated database');
}
export async function database(){const url=selectDatabaseUrl();const {neon}=await import('@neondatabase/serverless');return neon(url);}

