import {CHATS} from './chat-fit.mjs';
import {copy} from './my-agents.mjs';
import {readCommunity,node,platformMark,safeAgentLink} from './community-cards.mjs';
const form=document.querySelector('#submit-agent'),status=document.querySelector('#submission-status'),draft=document.querySelector('#submission-draft'),list=document.querySelector('#community-list'),communityStatus=document.querySelector('#community-status');
const values=()=>{const a=Object.fromEntries(new FormData(form));a.consent=a.consent==='on';return a;};
function download(text,filename,type){const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=u;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
draft?.addEventListener('click',()=>download(JSON.stringify(values(),null,2)+'\n','aibin-agent-submission-draft.json','application/json'));
form?.addEventListener('submit',async e=>{
 e.preventDefault();const button=form.querySelector('button[type=submit]');button.disabled=true;draft.hidden=true;status.textContent='Submitting…';
 try{const r=await fetch('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values()),signal:AbortSignal.timeout(15000)});let data;try{data=await r.json();}catch{throw Error('Submission not saved. Please try again later.');}status.textContent=data.message||'Unable to submit.';if(r.ok){form.reset();}else if(r.status>=500){draft.hidden=false;}}
 catch{status.textContent='Submission not saved. You can save your draft or retry.';draft.hidden=false;}
 finally{button.disabled=false;}
});
async function load(){
 try{const agents=await readCommunity();list.replaceChildren();communityStatus.textContent=agents.length?'Reviewed submissions':'Be the first to share an agent.';
 for(const a of agents){
  const card=node('article','','saved-card');card.id='agent-'+a.id;const heading=node('h3',a.name),mark=platformMark(a.provider);if(mark)heading.append(mark);
  card.append(heading,node('p','By '+a.creator+' · '+a.category,'agent-creator'),node('p',a.description));
  if(a.kind==='link'){const href=safeAgentLink(a.url);if(href){const link=node('a','Open agent ↗','btn primary');link.href=href;link.target='_blank';link.rel='ugc nofollow noopener noreferrer';card.append(link);}}
  else {
   const actions=node('div','','ready-actions'),provider=Object.hasOwn(CHATS,a.provider)?a.provider:'chatgpt',button=node('button','Use in '+CHATS[provider].name+' ↗','btn primary'),save=node('button','Download agent ↓','btn secondary'),message=node('p','','muted');
   button.type=save.type='button';message.setAttribute('role','status');const details=node('details'),summary=node('summary','View instructions'),manual=node('textarea','','assistant-prompt'),open=node('a','Open '+CHATS[provider].name+' ↗','text-button');manual.value=a.instructions;manual.readOnly=true;manual.rows=6;manual.setAttribute('aria-label','Agent instructions');open.href=CHATS[provider].url;open.target='_blank';open.rel='noopener noreferrer';details.append(summary,manual,open);button.addEventListener('click',async()=>{button.disabled=true;try{if(await copy(a.instructions)){location.assign(CHATS[provider].url);}else{details.open=true;manual.focus();manual.select();message.textContent='Clipboard blocked. Copy manually, then open your chat and paste.';}}finally{button.disabled=false;}});save.addEventListener('click',()=>download(a.instructions+'\n','aibin-community-'+a.id+'-agent.txt','text/plain;charset=utf-8'));actions.append(button,save);card.append(actions,message,details);
  }
  list.append(card);
 }
 if(/^#agent-\d+$/.test(location.hash))document.getElementById(location.hash.slice(1))?.scrollIntoView();
 }catch{communityStatus.textContent='Community listings are temporarily unavailable.';}
}
if(list)load();
