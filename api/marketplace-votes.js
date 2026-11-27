import {database,respond,validateRequest} from '../lib/api.mjs';
import {normalizeVote,voterPattern,rate} from '../lib/marketplace.mjs';
export default async function handler(req,res){
 if(req.method==='GET'){
  try{const sql=await database();const voter=typeof req.query?.voter==='string'&&voterPattern.test(req.query.voter)?req.query.voter:null;
  const totals=await sql`SELECT item_slug,score,upvotes,downvotes,recent FROM marketplace_vote_totals`;
  const mine=voter?await sql`SELECT item_slug,value FROM marketplace_votes WHERE voter_id=${voter}::uuid AND value<>0`:[];
  res.setHeader('Cache-Control','no-store');return res.status(200).json({totals,mine});}catch{return respond(res,503,'Voting unavailable.');}
 }
 const bad=validateRequest(req);if(bad)return respond(res,...bad);
 let v;try{v=normalizeVote(typeof req.body==='string'?JSON.parse(req.body):req.body);}catch(e){return respond(res,400,e.message);}
 try{const sql=await database();
 if(!await rate(sql,'vote-global',180)||!await rate(sql,'vote:'+v.voter,20))return respond(res,429,'Too many votes. Try again in a minute.');
 const rows=await sql`INSERT INTO marketplace_votes(item_slug,voter_id,value)
 SELECT ${v.slug},${v.voter}::uuid,${v.value}
 WHERE EXISTS(SELECT 1 FROM engagement_catalog WHERE slug=${v.slug})
 OR EXISTS(SELECT 1 FROM marketplace_links WHERE status='approved' AND 'link-'||id::text=${v.slug})
 OR EXISTS(SELECT 1 FROM community_agents WHERE status='approved' AND 'community-'||id::text=${v.slug})
 ON CONFLICT(item_slug,voter_id) DO UPDATE SET value=EXCLUDED.value,updated_at=now()
 WHERE marketplace_votes.value<>EXCLUDED.value RETURNING item_slug`;
 if(!rows.length){const old=await sql`SELECT value FROM marketplace_votes WHERE item_slug=${v.slug} AND voter_id=${v.voter}::uuid`;if(!old.length||Number(old[0].value)!==v.value)return respond(res,404,'Unknown or unavailable listing.');}
 const totals=await sql`SELECT item_slug,score,upvotes,downvotes,recent FROM marketplace_vote_totals WHERE item_slug=${v.slug}`;
 return respond(res,200,'Vote saved.',{total:totals[0]||{item_slug:v.slug,score:0,upvotes:0,downvotes:0,recent:0},value:v.value});
 }catch{return respond(res,503,'Vote not saved. Try again later.');}
}
