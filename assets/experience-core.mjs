import {makeAssistantPrompt} from './prompt-engine.mjs';
import {CHATS,chatForIdea} from './chat-fit.mjs';
import {scoreTask,searchTerms} from './task-search.mjs';
export const frequencies={once:'One time',daily:'Daily',weekly:'Weekly',monthly:'Monthly'};
export function recurringIntent(goal){
 const s=String(goal).toLowerCase();
 if(/\b(one[ -]time|just once|only once|no repeat|do not (?:repeat|monitor|schedule)|don't (?:repeat|monitor|schedule))\b/.test(s))return 'once';
 if(/\b(monthly|every month|each month)\b/.test(s))return 'monthly';
 if(/\b(weekly|every week|each week|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/.test(s))return 'weekly';
 if(/\b(daily|every day|each day|every morning|each morning|every evening|every night|monitor|notify me when|price alert|keep checking)\b/.test(s))return 'daily';
 return 'once';
}
export function chooseTemplate(goal,templates,frequency){
 const generic=new Set(['daily','weekly','monthly','every','each','morning','afternoon','evening','recurring','repeat','automatically','notify','alert','monitor','check','checking','watch','keep','time','day','week','month']);
 const terms=searchTerms(goal).filter(t=>!generic.has(t));
 if(!terms.length)return null;
 const candidates=(Array.isArray(templates)?templates:[]).filter(t=>t&&typeof t.task==='string'&&typeof t.name==='string'&&(frequency==='once'?t.kind==='assistant':t.kind==='scheduled'));
 const ranked=candidates.map(t=>{const corpus=new Set(searchTerms(t.name+' '+t.summary+' '+(t.keywords||'')));const matched=terms.filter(term=>corpus.has(term)).length;const title=new Set(searchTerms(t.name));const titleMatch=terms.some(term=>title.has(term));return {t,matched,titleMatch,score:scoreTask(terms.join(' '),t.name,t.summary+' '+(t.keywords||''))};}).sort((a,b)=>b.score-a.score);
 const top=ranked[0];return top&&top.titleMatch&&top.matched>=Math.min(2,terms.length)&&top.matched/terms.length>=0.25?top.t:null;
}
export function buildVibeAgent({goal,frequency='auto',provider='auto',templates=[]}){
 const task=String(goal??'').trim();
 if(task.length<5||task.length>1400)throw Error('Describe your task in 5–1,400 characters.');
 const cadence=frequency==='auto'?recurringIntent(task):frequency;
 if(!Object.hasOwn(frequencies,cadence))throw Error('Choose a repeat frequency.');
 const matched=chooseTemplate(task,templates,cadence);
 let chat=provider==='auto'?(matched?.provider||chatForIdea(task)):provider;
 if(!Object.hasOwn(CHATS,chat))throw Error('Choose a supported AI chat.');
 if(cadence!=='once'&&!['chatgpt','gemini'].includes(chat))chat='chatgpt';
 const name=matched?.name||'My custom agent';
 let tailored=task;
 if(matched&&task.length+matched.task.length<=1940)tailored+='\n\nRelevant workflow (use only when it fits my request): '+matched.task;
 const prompt=makeAssistantPrompt(tailored,'Simple and concise',name)+(cadence==='once'?(frequency==='once'?'\n\nRun this as a one-time task. Do not schedule it.':''):'\n\nRecurring task request: '+frequencies[cadence]+'. Ask me to confirm the time, time zone, schedule and notifications. Set it up only if this chat supports scheduling. Show me the confirmed task or say that scheduling is unavailable and offer a one-time check. Do not promise background work or take external actions without my authorization.');
 return {name,prompt,provider:chat,frequency:cadence,template:matched?{name:matched.name,path:matched.path}:null};
}
export function publicAgentPath(path){
 return /^\/(?:agents|tools|automations|live-agents|agent-teams)\/[a-z0-9-]{1,80}$/.test(path)||/^\/community#agent-\d+$/.test(path)||/^\/creators#[A-Za-z0-9_.-]{2,50}$/.test(path);
}
export function groupCreators(agents){
 const groups=new Map();
 for(const a of Array.isArray(agents)?agents:[]){
  if(!a||typeof a!=='object')continue;
  const name=String(a.creator||'').replace(/^@/,'');
  if(!/^[A-Za-z0-9][A-Za-z0-9_.-]{1,49}$/.test(name))continue;
  const key=name.toLowerCase(),g=groups.get(key)||{name,key,agents:[],opens:0};
  g.agents.push(a);const opens=Number(a.usage_count);g.opens+=Number.isSafeInteger(opens)&&opens>=0?opens:0;groups.set(key,g);
 }
 return [...groups.values()].sort((a,b)=>b.opens-a.opens||b.agents.length-a.agents.length||a.key.localeCompare(b.key));
}
