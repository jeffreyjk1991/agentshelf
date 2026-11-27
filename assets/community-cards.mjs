export function usernameLabel(value){const name=String(value??'').trim().replace(/^@/,'');return /^[A-Za-z0-9][A-Za-z0-9_.-]{1,49}$/.test(name)?'@'+name:'By '+name;}
import {CHATS} from './chat-fit.mjs';
const hostSet=new Set(['chatgpt.com','claude.ai','gemini.google.com','github.com','n8n.io']);
export const node=(tag,content,cls)=>{const e=document.createElement(tag);e.textContent=content;if(cls)e.className=cls;return e;};
export function safeAgentLink(raw){try{const u=new URL(raw);return u.protocol==='https:'&&hostSet.has(u.hostname)&&!u.username&&!u.password&&!u.port&&!u.search&&!u.hash?u.href:null;}catch{return null;}}
export function platformMark(provider){
 if(provider==='any')return null; // No preference is not a verified compatibility claim.
 if(!Object.hasOwn(CHATS,provider))return null;
 const c=CHATS[provider],img=document.createElement('img');img.className='compatibility-icon';img.dataset.chat=provider;img.src=c.logo;img.width=17;img.height=17;img.alt=c.name;img.title=c.name;return img;
}
export async function readCommunity(){
 const res=await fetch('/api/submissions',{cache:'no-store'});if(!res.ok)throw Error('Community unavailable');
 const d=await res.json();return (Array.isArray(d.agents)?d.agents:[]).filter(a=>/^\d+$/.test(String(a.id))&&typeof a.name==='string'&&typeof a.creator==='string'&&typeof a.description==='string'&&typeof a.category==='string'&&(a.kind==='instructions'&&typeof a.instructions==='string'||a.kind==='link'&&safeAgentLink(a.url)));
}
export async function fetchCommunityCards(){
 const agents=await readCommunity();return agents.map(a=>{
  const card=node('a','','agent mini-card community-card');card.dataset.agent='';card.dataset.slug='community-'+a.id;card.dataset.title=a.name;card.dataset.name=[a.name,a.description,a.category,a.creator].join(' ');card.dataset.category=a.category;card.dataset.mode='community';card.href='/community#agent-'+a.id;
  const icon=node('span','✳','agenticon');icon.setAttribute('aria-hidden','true');const copy=node('div','','mini-copy'),title=node('span',a.name,'agent-title'),mark=platformMark(a.provider);if(mark)title.append(mark);
  copy.append(title,node('span',a.description,'mini-description'),node('span',usernameLabel(a.creator),'agent-creator'));const arrow=node('span','›','chevron');arrow.setAttribute('aria-hidden','true');card.append(icon,copy,arrow);return card;
 });
}
