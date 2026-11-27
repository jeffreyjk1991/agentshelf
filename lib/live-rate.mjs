// Always enforce bounded per-instance capacity; the database is a shared additional guard.
export function createLiveLimiter({clock=Date.now,globalLimit=40,perAgentLimit=15,githubLimit=5,parallelLimit=4}={}){
 let minute=-1,total=0,counts=new Map(),active=0;
 return function acquire(slug){
  const bucket=Math.floor(clock()/60000);
  if(bucket!==minute){minute=bucket;total=0;counts=new Map();}
  const n=counts.get(slug)||0,cap=slug==='live-github-scout'?githubLimit:perAgentLimit;
  if(total>=globalLimit||n>=cap||active>=parallelLimit)return null;
  total++;counts.set(slug,n+1);active++;
  let released=false;return ()=>{if(!released){released=true;active--;}};
 };
}
export async function checkSharedRate({database,rate,slug,timeoutMs=1200,report=()=>{}}){
 let timer;
 try{
  const check=async()=>{const sql=await database();return await rate(sql,'live-global',40)&&await rate(sql,'live:'+slug,slug==='live-github-scout'?5:15);};
  return await Promise.race([check(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Shared limiter timeout')),timeoutMs);})]);
 }catch{report('shared_rate_unavailable');return true;}finally{clearTimeout(timer);}
}
