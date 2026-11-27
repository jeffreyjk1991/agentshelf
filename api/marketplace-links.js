import {database,respond,validateRequest} from '../lib/api.mjs';
import {normalizeLink,rate} from '../lib/marketplace.mjs';
export default async function handler(req,res){
 if(req.method==='GET'){try{const sql=await database();const agents=await sql`SELECT l.id,l.name,l.url,l.description,l.creator,l.platform,COALESCE(v.score,0)::int AS score FROM marketplace_links l LEFT JOIN marketplace_vote_totals v ON v.item_slug='link-'||l.id::text WHERE l.status='approved' ORDER BY COALESCE(v.score,0) DESC,l.created_at DESC LIMIT 100`;res.setHeader('Cache-Control','no-store');return res.status(200).json({agents});}catch{return respond(res,503,'Community links unavailable.');}}
 const bad=validateRequest(req);if(bad)return respond(res,...bad);
 let v;try{v=normalizeLink(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch(e){return respond(res,400,e.message);}
 try{const sql=await database();if(!await rate(sql,'link-submit',8))return respond(res,429,'Submission limit reached.');
 const rows=await sql`INSERT INTO marketplace_links(name,url,description,creator,platform) VALUES(${v.name},${v.url},${v.description},${v.creator},${v.platform}) ON CONFLICT(url) DO NOTHING RETURNING id`;
 return respond(res,rows.length?201:409,rows.length?'Submitted for review. Only approved public links will be listed.':'This link has already been submitted.');}catch{return respond(res,503,'Submission service unavailable.');}
}
