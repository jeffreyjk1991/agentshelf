// Fixed acquisition categories only; never transmit a raw referrer or campaign URL.
export const referralSources=['chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown','instagram','tiktok','youtube','reddit','linkedin','facebook','whatsapp','x','producthunt','newsletter','agent_share'];
const hostGroups={
 'chatgpt.com':'chatgpt','chat.openai.com':'chatgpt','perplexity.ai':'perplexity','gemini.google.com':'gemini','claude.ai':'claude','copilot.microsoft.com':'copilot',
 'instagram.com':'instagram','l.instagram.com':'instagram','tiktok.com':'tiktok','m.tiktok.com':'tiktok','vm.tiktok.com':'tiktok','youtube.com':'youtube','m.youtube.com':'youtube','youtu.be':'youtube','reddit.com':'reddit','old.reddit.com':'reddit','redd.it':'reddit','linkedin.com':'linkedin','lnkd.in':'linkedin','facebook.com':'facebook','m.facebook.com':'facebook','l.facebook.com':'facebook','lm.facebook.com':'facebook','whatsapp.com':'whatsapp','web.whatsapp.com':'whatsapp','wa.me':'whatsapp','x.com':'x','twitter.com':'x','t.co':'x','producthunt.com':'producthunt'
};
function provider(host){const key=String(host).toLowerCase().replace(/^www\./,'');return Object.hasOwn(hostGroups,key)?hostGroups[key]:null;}
export function classifyReferral(search,referrer,origin){
 const raw=(new URLSearchParams(search).get('utm_source')||'').trim().toLowerCase();
 const utm=provider(raw)||(referralSources.includes(raw)?raw:null);
 if(utm&&utm!=='direct_or_unknown'&&utm!=='other_referral')return utm;
 try{const u=new URL(referrer);if(u.origin===origin||['www.aibin.me','aibin.me'].includes(u.hostname))return 'direct_or_unknown';const p=provider(u.hostname);if(p)return p;if(/(^|\.)google\.[a-z.]+$/.test(u.hostname))return 'google';if(u.hostname==='bing.com'||u.hostname==='www.bing.com')return 'bing';return 'other_referral';}catch{return 'direct_or_unknown';}
}
export function landingKind(path){
 if(path==='/')return 'home';
 if(path==='/make-agent')return 'builder';
 if(/^\/(?:agents|tools|automations|live-agents|agent-teams)\/[a-z0-9-]+$/.test(path))return 'listing';
 if(path==='/ai-agent-directory'||/^\/ai-agents-for-(chatgpt|claude|gemini)$/.test(path)||['/open-source','/automations','/live-agents','/agent-teams','/tools','/agent-packs'].includes(path))return 'directory';
 if(path==='/how-to'||path.startsWith('/how-to/')||path==='/blog'||path.startsWith('/blog/'))return 'guide';
 return 'other';
}
