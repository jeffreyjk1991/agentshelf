import fs from 'node:fs';
import {executeLive} from '../lib/live-engine.mjs';
const agents=JSON.parse(fs.readFileSync('live-agents/catalog.json','utf8'));
const results=await Promise.all(agents.map(async a=>{
 try{
 const r=await executeLive({slug:a.slug,input:a.example});
 if(!r.rows.length)throw Error('Example returned no results');
 if(!r.rows.every(x=>typeof x.title==='string'&&x.title.length>0&&new URL(x.url).protocol==='https:'))throw Error('Invalid result or source link');
 return {agent:a.slug,status:'PASS',rows:r.rows.length};
 }catch(e){return {agent:a.slug,status:'FAIL',error:String(e.message).slice(0,200)};}
}));
console.table(results);if(results.some(x=>x.status!=='PASS'))process.exitCode=1;
