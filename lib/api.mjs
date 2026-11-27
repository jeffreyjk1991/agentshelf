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
// Keep the production database restricted to AIBin's dedicated Neon compute.
// Accept the dedicated AIBin endpoint and its verified read/write compute aliases.
const aibinHosts=new Set(['ep-tiny-shadow-bb3qfk0l.c-15.us-east-1.aws.neon.tech','ep-tiny-shadow-bb3qfk0l-pooler.c-15.us-east-1.aws.neon.tech','ep-tiny-shadow-bb3qfk0l-h3c.c-15.us-east-1.aws.neon.tech','ep-tiny-shadow-bb3qfk0l-h3c-pooler.c-15.us-east-1.aws.neon.tech']);
// Neon may display a quoted URI or a psql command. Extract the URI only; never execute it.
function connectionValue(raw){
 let v=typeof raw==='string'?raw.trim():'';
 v=v.replace(/^(?:AIBIN_DATABASE_URL|DATABASE_URL|POSTGRES_URL|NEON_DATABASE_URL)\s*=\s*/,'');
 v=v.replace(/^psql\s+(?=['"])/,'');
 if((v.startsWith("'")&&v.endsWith("'"))||(v.startsWith('"')&&v.endsWith('"')))v=v.slice(1,-1);
 return v.trim();
}
const configError=(code)=>Object.assign(Error('AIBin database connection is unavailable'),{code});
export function selectDatabaseUrl(env=process.env){
 const production=env.VERCEL_ENV==='production';
 const keys=['AIBIN_DATABASE_URL','DATABASE_URL','POSTGRES_URL','AIBIN_DATABASE_URL_UNPOOLED','DATABASE_URL_UNPOOLED','POSTGRES_URL_NON_POOLING','POSTGRES_PRISMA_URL','NEON_DATABASE_URL','NEON_DATABASE_URL_UNPOOLED'];
 let configured=false;
 for(const key of keys){
  const value=connectionValue(env[key]);
  if(!value)continue;
  configured=true;
  try{
   const u=new URL(value);
   if(!['postgres:','postgresql:'].includes(u.protocol)||!u.hostname||u.pathname==='/'||!u.pathname)continue;
   // A stale explicit override must not mask a correctly configured same-project URL.
   if(aibinHosts.has(u.hostname)&&u.pathname==='/neondb')return value;
   if(!production&&['AIBIN_DATABASE_URL','DATABASE_URL'].includes(key))return value;
  }catch{}
 }
 throw configError(configured?'DB_CONFIG_MISMATCH':'DB_CONFIG_MISSING');
}
export function databaseErrorCode(error){
 const code=String(error?.code||'');
 if(['DB_CONFIG_MISMATCH','DB_CONFIG_MISSING','DB_DRIVER_UNAVAILABLE'].includes(code))return code;
 if(['28P01','28000'].includes(code))return 'DB_AUTH_FAILED';
 if(code==='42501')return 'DB_PERMISSION_DENIED';
 if(['42P01','42703','3D000','3F000'].includes(code))return 'DB_SCHEMA_UNAVAILABLE';
 // Driver errors can wrap a PostgreSQL error in a message. Never return or log that message.
 const message=String(error?.message||'');
 if(/password authentication failed|authentication failed|invalid password/i.test(message))return 'DB_AUTH_FAILED';
 if(/permission denied/i.test(message))return 'DB_PERMISSION_DENIED';
 if(/relation .* does not exist|database .* does not exist/i.test(message))return 'DB_SCHEMA_UNAVAILABLE';
 return 'DB_CONNECTION_FAILED';
}
export async function database(){
 const url=selectDatabaseUrl();
 let driver;
 try{driver=await import('@neondatabase/serverless');}
 catch{throw configError('DB_DRIVER_UNAVAILABLE');}
 return driver.neon(url);
}
