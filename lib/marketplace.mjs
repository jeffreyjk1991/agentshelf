export const slugPattern=/^[a-z0-9-]{1,80}$/;
export const voterPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function normalizeVote(v){
 if(!v||typeof v.slug!=='string'||!slugPattern.test(v.slug)||typeof v.voter!=='string'||!voterPattern.test(v.voter)||![-1,0,1].includes(v.value))throw Error('Invalid vote.');
 return {slug:v.slug,voter:v.voter.toLowerCase(),value:v.value};
}
export function normalizeLink(body){
 if(!body||body.consent!==true)throw Error('Confirm permission to share.');
 const field=(k,min,max)=>{if(typeof body[k]!=='string')throw Error('Complete '+k);const v=body[k].trim();if(v.length<min||v.length>max)throw Error('Check '+k+' length');return v;};
 const name=field('name',3,100),creator=field('creator',2,50),description=field('description',15,500),raw=field('url',10,400);
 if(/(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-[A-Za-z0-9_-]{20,}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/.test(name+' '+creator+' '+description))throw Error('Remove private details or credentials.');
 let u;try{u=new URL(raw);}catch{throw Error('Enter a public HTTPS agent link.');}
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.search||u.hash)throw Error('Use a public HTTPS link without private parameters or fragments.');
 const p=u.pathname.replace(/\/$/,'');let platform='';
 if(u.hostname==='chatgpt.com'&&/^\/g\/g-[A-Za-z0-9_-]+$/.test(p))platform='ChatGPT';
 else if(u.hostname==='claude.ai'&&/^\/public\/artifacts\/[A-Za-z0-9-]+$/.test(p))platform='Claude artifact';
 else if(u.hostname==='gemini.google.com'&&/^\/(?:gem|share)\/[A-Za-z0-9_-]+$/.test(p))platform='Gemini';
 else if(u.hostname==='github.com'&&/^\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9_.-]{1,100}$/.test(p)&&!p.split('/').some(x=>x==='.'||x==='..'))platform='GitHub';
 else if(u.hostname==='n8n.io'&&/^\/workflows\/[0-9]+(?:-[A-Za-z0-9-]+)?$/.test(p))platform='n8n';
 if(!platform)throw Error('Use a public GPT, Claude artifact, Gemini link, GitHub repository or n8n workflow.');
 return {name,creator,description,platform,url:u.origin+(platform==='GitHub'?p.replace(/\.git$/,'').toLowerCase():p)};
}
export async function rate(sql,scope,limit){
 const bucket=Math.floor(Date.now()/60000);
 const rows=await sql`INSERT INTO marketplace_limits(scope,minute_bucket,hits) VALUES (${scope},${bucket},1) ON CONFLICT(scope,minute_bucket) DO UPDATE SET hits=marketplace_limits.hits+1 WHERE marketplace_limits.hits<${limit} RETURNING hits`;
 return rows.length>0;
}
