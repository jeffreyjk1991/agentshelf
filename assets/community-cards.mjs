import {CHATS} from './chat-fit.mjs';
// Public, moderated listings only; no code is downloaded or executed.
const hostSet=new Set(['chatgpt.com','claude.ai','gemini.google.com','github.com','n8n.io']);
const n=(tag,content,cls)=>{const e=document.createElement(tag);e.textContent=content;if(cls)e.className=cls;return e;};
function card({slug,name,description,href,label,external,provider}){
 const a=n('a','','agent mini-card community-card');a.dataset.agent='';a.dataset.voteSlug=slug;a.dataset.title=name;a.dataset.name=name+' '+description+' '+label;a.dataset.category='Community';a.dataset.mode='community';a.href=href;
 if(external){a.target='_blank';a.rel='ugc nofollow noopener noreferrer';}
 const icon=n('span','✳','agenticon');icon.setAttribute('aria-hidden','true');const copy=n('div','','mini-copy');const title=n('span',name,'agent-title');if(Object.hasOwn(CHATS,provider)){const c=CHATS[provider],img=document.createElement('img');img.className='compatibility-icon';img.dataset.chat=provider;img.src=c.logo;img.width=17;img.height=17;img.alt=c.name;img.title=c.name;title.append(img);}copy.append(title,n('span',description,'mini-description'),n('span',label,'mode-label'));const arrow=n('span','↗','chevron');arrow.setAttribute('aria-hidden','true');a.append(icon,copy,arrow);return a;
}
const read=async path=>{try{const res=await fetch(path,{cache:'no-store'});if(!res.ok)return [];const data=await res.json();return Array.isArray(data.agents)?data.agents:[];}catch{return [];}};
export async function fetchCommunityCards(){
 const [links,prompts]=await Promise.all([read('/api/marketplace-links'),read('/api/community')]);
 const cards=[];
 for(const a of links){if(!/^\d+$/.test(String(a.id))||typeof a.name!=='string'||typeof a.description!=='string')continue;let u;try{u=new URL(a.url);if(u.protocol!=='https:'||!hostSet.has(u.hostname)||u.username||u.password||u.search||u.hash)continue;}catch{continue;}
 cards.push(card({slug:'link-'+a.id,name:a.name,description:a.description,href:u.href,label:'Get agent · '+String(a.platform),external:true,provider:({'chatgpt.com':'chatgpt','claude.ai':'claude','gemini.google.com':'gemini'})[u.hostname]}));}
 for(const a of prompts){if(!/^\d+$/.test(String(a.id))||typeof a.name!=='string'||typeof a.task!=='string')continue;cards.push(card({slug:'community-'+a.id,name:a.name,description:a.task.slice(0,160),href:'/community#agent-'+a.id,label:'Get agent · Community',external:false,provider:a.provider}));}
 return cards;
}
