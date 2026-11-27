import {database,respond,validateRequest} from '../lib/api.mjs';
import {normalizeRun,requestFor,executeLive} from '../lib/live-engine.mjs';
import {rate} from '../lib/marketplace.mjs';
export default async function handler(req,res){
 const bad=validateRequest(req);if(bad)return respond(res,...bad);
 let input;try{input=normalizeRun(typeof req.body==='string'?JSON.parse(req.body):req.body);requestFor(input);}catch(e){return respond(res,400,e.message);}
 try{
  const sql=await database();
  if(!await rate(sql,'live-global',40)||!await rate(sql,'live:'+input.slug,input.slug==='live-github-scout'?5:15))return respond(res,429,'The live agent is busy. Try again in a minute.');
  const result=await executeLive(input);
  return respond(res,200,'Completed live source lookup.',{result});
 }catch{return respond(res,503,'The live data service or marketplace backend is temporarily unavailable. No sample results have been substituted.');}
}
