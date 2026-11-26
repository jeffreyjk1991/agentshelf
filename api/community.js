import {database,respond,validateRequest} from '../lib/api.mjs';
import {normalizeCommunity} from '../lib/growth.mjs';
export default async function handler(req,res){
 if(req.method==='GET'){try{const sql=await database();const rows=await sql`SELECT id,name,creator,task,provider FROM community_agents WHERE status='approved' ORDER BY created_at DESC LIMIT 100`;res.setHeader('Cache-Control','public, max-age=0, s-maxage=60');return res.status(200).json({agents:rows});}catch{return respond(res,503,'Community is not connected yet.');}}
 const bad=validateRequest(req);if(bad)return respond(res,...bad);let item;
 try{item=normalizeCommunity(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch(e){return respond(res,400,e.message);}
 try{const sql=await database();const rows=await sql`INSERT INTO community_agents(name,creator,task,provider) SELECT ${item.name},${item.creator},${item.task},${item.provider} WHERE (SELECT count(*) FROM community_agents WHERE created_at>now()-interval '10 minutes')<30 RETURNING id`;return respond(res,rows.length?201:429,rows.length?'Submitted for review. Not publicly listed yet.':'Submission limit reached. Try later.');}catch{return respond(res,503,'Community submissions are not connected yet.');}
}
