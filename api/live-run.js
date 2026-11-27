import {database,respond,validateRequest} from '../lib/api.mjs';
import {normalizeRun,requestFor,executeLive} from '../lib/live-engine.mjs';
import {rate} from '../lib/marketplace.mjs';
import {createLiveLimiter,checkSharedRate} from '../lib/live-rate.mjs';
const acquire=createLiveLimiter();
export function createHandler({getDatabase=database,sharedRate=rate,run=executeLive,localAcquire=acquire,report=code=>console.warn('[live-run]',code),timeoutMs=1200}={}){
 return async function handler(req,res){
  const bad=validateRequest(req);if(bad)return respond(res,...bad);
  let input;
  try{input=normalizeRun(typeof req.body==='string'?JSON.parse(req.body):req.body);requestFor(input);}catch(e){return respond(res,400,e.message);}
  const release=localAcquire(input.slug);
  const busy=()=>{res.setHeader('Retry-After','60');return respond(res,429,'The live agent is busy. Try again in a minute.');};
  if(!release)return busy();
  try{
   if(!await checkSharedRate({database:getDatabase,rate:sharedRate,slug:input.slug,timeoutMs,report}))return busy();
   const result=await run(input);
   return respond(res,200,'Completed live source lookup.',{result});
  }catch(e){
   const code=e?.name==='TimeoutError'||e?.name==='AbortError'?'provider_timeout':e?.code==='PROVIDER_RATE_LIMIT'?'provider_rate_limit':'provider_unavailable';
   report(code);
   if(code==='provider_rate_limit'){res.setHeader('Retry-After','60');return respond(res,429,'The public data source is busy. Try again in a minute.');}
   if(code==='provider_timeout')return respond(res,504,'The public data source took too long to respond. Please try again.');
   return respond(res,502,'The public data source is temporarily unavailable. Please try again or choose another agent.');
  }finally{release();}
 };
}
export default createHandler();
