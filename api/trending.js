import {database,respond} from '../lib/api.mjs';
export function createTrendingHandler({getDatabase=database}={}){
 return async(req,res)=>{
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({items:[]});}
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=300');
  try{
   const sql=await getDatabase();
   const rows=await sql`SELECT c.slug,count(*)::int AS actions FROM engagement_events e JOIN engagement_catalog c ON c.slug=e.slug WHERE e.created_at>=now()-interval '7 days' AND e.event_type IN ('open_chat','copy','save','tool_run') GROUP BY c.slug HAVING count(*)>=2 ORDER BY count(*) DESC,c.slug LIMIT 12`;
   return res.status(200).json({items:rows.map(r=>({slug:r.slug,actions:Number(r.actions)})),windowDays:7,measure:'recorded actions, not unique visitors'});
  }catch{return res.status(503).json({items:[]});}
 };
}
export default createTrendingHandler();
