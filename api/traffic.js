import {database,respond,validateRequest} from '../lib/api.mjs';
import {rate} from '../lib/marketplace.mjs';
import {blogPaths} from '../scripts/blog-data.mjs';

const pages=new Set(['/','/open-source','/agent-teams','/agent-packs','/tools','/automations','/live-agents','/my-agents','/make-agent','/shared-agent','/community','/about','/privacy','/newsletter','/developers','/start','/how-to','/agent-research','/agent-runner','/popular-ai-agents','/competitor-research','/top-ai-agents','/agent-checks','/creators','/ai-agent-directory','/ai-marketplace-platforms','/ai-agents-for-chatgpt','/ai-agents-for-claude','/ai-agents-for-gemini','/categories','/tools/category','/offline']);
const sources=new Set(['chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown','instagram','tiktok','youtube','reddit','linkedin','facebook','whatsapp','x','producthunt','newsletter','agent_share']);
const kinds=new Set(['first_visit','return_visit','page_view']);
export function normalizeTraffic(body,headers={}){
 if(!body||typeof body!=='object'||!kinds.has(body.kind)||!sources.has(body.source)||typeof body.path!=='string'||body.path.length>150||!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(body.path))throw Error('Invalid traffic event.');
 const path=body.path;
 const match=/^\/(agents|tools|automations|live-agents|agent-teams)\/([a-z0-9-]{1,80})$/.exec(path);
 const group=path.startsWith('/how-to/')?'/how-to':path.startsWith('/categories/')?'/categories':path.startsWith('/tools/category/')?'/tools/category':'/other';
 const country=String(headers['x-vercel-ip-country']||'').toUpperCase();
 const ua=String(headers['user-agent']||'');
 const device=!ua?'unknown':/ipad|tablet|android(?!.*mobile)/i.test(ua)?'tablet':/mobi|iphone|ipod|android/i.test(ua)?'mobile':'desktop';
 return {path:pages.has(path)||blogPaths.has(path)||match?path:group,slug:match?.[2]??null,source:body.source,kind:body.kind,country:/^[A-Z]{2}$/.test(country)?country:'ZZ',device};
}
export function createTrafficHandler({getDatabase=database,limit=rate,env=process.env}={}){
 return async function handler(req,res){
  const bad=validateRequest(req);if(bad)return respond(res,...bad);
  // Never collect preview traffic, obvious automated clients, or opt-out requests.
  if(env.VERCEL_ENV!=='production'||!['aibin.me','www.aibin.me'].includes(req.headers.host)||req.headers['sec-gpc']==='1'||req.headers.dnt==='1'||/bot|crawler|spider|headless|curl|wget|python-requests/i.test(String(req.headers['user-agent']||'')))return respond(res,200,'Not tracked.');
  let e;try{e=normalizeTraffic(typeof req.body==='string'?JSON.parse(req.body):req.body,req.headers);}catch(err){return respond(res,400,err.message);}
  try{
   const sql=await getDatabase();
   if(!await limit(sql,'traffic-page-view',800))return respond(res,429,'Temporarily limited.');
   // Only known catalog slugs can be stored as individual paths. Unknown routes are grouped.
   if(e.slug){const known=await sql`SELECT 1 FROM engagement_catalog WHERE slug=${e.slug} LIMIT 1`;if(!known.length)e.path='/other';}
   await sql`INSERT INTO traffic_hourly (hour,page_path,country,device_type,source,visit_kind,views)
    VALUES (date_trunc('hour',now()),${e.path},${e.country},${e.device},${e.source},${e.kind},1)
    ON CONFLICT (hour,page_path,country,device_type,source,visit_kind) DO UPDATE SET views=traffic_hourly.views+1`;
   return respond(res,201,'Recorded.');
  }catch{return respond(res,503,'Traffic analytics unavailable.');}
 };
}
export default createTrafficHandler();
