import {makeAssistantPrompt} from './prompt-engine.mjs';
import {CHATS,chatForIdea} from './chat-fit.mjs';
function setChat(flow,id,recommend=false){
 if(!Object.hasOwn(CHATS,id))return;
 const chat=CHATS[id],select=flow.querySelector('.chat-select'),open=flow.querySelector('.open-chat'),reason=flow.querySelector('.chat-reason');
 if(recommend){flow.dataset.recommended=id;for(const option of select.options)option.textContent=CHATS[option.value].name+(option.value===id?' · suggested':'');}
 select.value=id;open.href=chat.url;open.textContent='2. Open '+chat.name+' ↗';reason.textContent=id===flow.dataset.recommended?chat.why:'Use the chat you prefer. Paste the copied instructions there.';
 const logo=flow.querySelector('.chat-logo'),setup=flow.querySelector('.setup-link'),steps=flow.querySelector('.setup-steps'),note=flow.querySelector('.setup-note'),help=flow.querySelector('.setup-help');if(logo)logo.src=chat.logo;if(setup){setup.href=chat.setupUrl;setup.textContent='Open '+chat.setupName+' ↗';}if(steps)steps.replaceChildren(...chat.steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));if(note)note.textContent=chat.note;if(help)help.href=chat.help;
}
for(const panel of document.querySelectorAll('[data-assistant-panel]')){
 const prompt=panel.querySelector('.assistant-prompt'),status=panel.querySelector('.assistant-status'),flow=panel.querySelector('[data-chat-flow]'),button=panel.querySelector('.copy-assistant'),select=flow.querySelector('.chat-select');
 select.addEventListener('change',()=>setChat(flow,select.value));
 button.addEventListener('click',async()=>{if(!prompt.value.trim())return;try{await navigator.clipboard.writeText(prompt.value);button.textContent='✓ Copied — step 1';status.textContent='Now open '+CHATS[select.value].name+' and paste.';}catch{const details=prompt.closest('details');if(details)details.open=true;prompt.focus();prompt.select();status.textContent='Select and copy the instructions manually, then open your chat.';}});
 panel.querySelector('.save-assistant')?.addEventListener('click',()=>{if(!prompt.value.trim())return;const url=URL.createObjectURL(new Blob([prompt.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='agentshelf-assistant.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Instructions saved.';});
}
const form=document.querySelector('#make-assistant');
if(form){
 const status=document.querySelector('#builder-status'),panel=document.querySelector('#builder-result'),prompt=panel.querySelector('.assistant-prompt');
 const params=new URLSearchParams(location.search),idea=params.get('idea');if(idea&&idea.length<=2000)form.elements.goal.value=idea;
 for(const b of form.querySelectorAll('[data-goal]'))b.addEventListener('click',()=>{form.elements.goal.value=b.dataset.goal;form.elements.goal.focus();});
 form.addEventListener('submit',e=>{e.preventDefault();try{const v=Object.fromEntries(new FormData(form));prompt.value=makeAssistantPrompt(v.goal,v.style,v.name);panel.querySelector('h2').textContent='Your assistant is ready';panel.querySelector('.copy-assistant').textContent='1. Copy instructions';panel.querySelector('.assistant-status').textContent='';setChat(panel.querySelector('[data-chat-flow]'),chatForIdea(v.goal),true);panel.hidden=false;status.textContent='';panel.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){panel.hidden=true;status.textContent=e.message;}});
}
