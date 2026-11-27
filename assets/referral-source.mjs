// Only fixed, coarse acquisition categories are sent. Never transmit raw URL, referrer or query.
const known={'chatgpt.com':'chatgpt','chat.openai.com':'chatgpt','perplexity.ai':'perplexity','gemini.google.com':'gemini','claude.ai':'claude','copilot.microsoft.com':'copilot'};
function provider(host){host=String(host).toLowerCase().replace(/^www\./,'');return Object.hasOwn(known,host)?known[host]:null;}
export function classifyReferral(search,referrer,origin){
 const raw=new URLSearchParams(search).get('utm_source')||'';
 const utm=provider(raw)||({chatgpt:'chatgpt',perplexity:'perplexity',gemini:'gemini',claude:'claude',copilot:'copilot'})[raw.toLowerCase()];
 if(['chatgpt','perplexity','gemini','claude','copilot'].includes(utm))return utm;
 try{const u=new URL(referrer);if(u.origin===origin||['www.aibin.me','aibin.me'].includes(u.hostname))return 'direct_or_unknown';const p=provider(u.hostname);if(p)return p;if(/(^|\.)google\.[a-z.]+$/.test(u.hostname))return 'google';if(u.hostname==='bing.com'||u.hostname==='www.bing.com')return 'bing';return 'other_referral';}catch{return 'direct_or_unknown';}
}
export function landingKind(path){
 if(path==='/')return 'home';
 if(path==='/make-agent')return 'builder';
 if(/^\/(?:agents|tools|automations|live-agents)\/[a-z0-9-]+$/.test(path))return 'listing';
 if(path==='/ai-agent-directory'||/^\/ai-agents-for-(chatgpt|claude|gemini)$/.test(path)||['/open-source','/automations','/live-agents'].includes(path))return 'directory';
 if(path==='/how-to'||path.startsWith('/how-to/'))return 'guide';
 return 'other';
}
