import {database,respond,validateRequest,databaseErrorCode} from '../lib/api.mjs';
import {normalizeAgentSubmission} from '../lib/agent-submission.mjs';
import {rate} from '../lib/marketplace.mjs';
export function createSubmissionHandler({getDatabase=database,limit=rate,report=code=>console.warn('[agent-submissions]',code)}={}){
 return async function handler(req,res){
  if(req.method==='GET'){
   try{const sql=await getDatabase();const agents=await sql`SELECT s.id,s.name,s.creator,s.category,s.description,s.provider,s.kind,s.instructions,s.url,s.platform,(SELECT count(*)::integer FROM engagement_events e WHERE e.slug='community-'||s.id::text AND e.event_type='open_chat') AS usage_count FROM marketplace_agent_submissions s WHERE s.status='approved' ORDER BY s.created_at DESC LIMIT 100`;res.setHeader('Cache-Control','no-store');return res.status(200).json({agents});}
   catch(e){const code=databaseErrorCode(e);report(code);return respond(res,503,'Community listings are temporarily unavailable.',{code});}
  }
  const bad=validateRequest(req);if(bad)return respond(res,...bad);
  let a;try{a=normalizeAgentSubmission(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch(e){return respond(res,400,e.message);}
  try{
   const sql=await getDatabase();
   if(!await limit(sql,'agent-submit',8))return respond(res,429,'Please try again in a minute.');
   const rows=await sql`INSERT INTO marketplace_agent_submissions(name,creator,category,description,provider,kind,instructions,url,platform)
    VALUES(${a.name},${a.creator},${a.category},${a.description},${a.provider},${a.kind},${a.instructions},${a.url},${a.platform}) ON CONFLICT DO NOTHING RETURNING id`;
   return respond(res,rows.length?201:409,rows.length?'Submitted for review. Your agent will be listed after approval.':'This agent link has already been submitted.');
  }catch(e){const code=databaseErrorCode(e);report(code);return respond(res,503,'Submission not saved. Please keep your draft and try again later.',{code});}
 };
}
export default createSubmissionHandler();
