import {makeAssistantPrompt} from './prompt-engine.mjs';
for(const panel of document.querySelectorAll('[data-assistant-panel]')){
 const prompt=panel.querySelector('.assistant-prompt'),status=panel.querySelector('.assistant-status');
 panel.querySelector('.copy-assistant')?.addEventListener('click',async()=>{if(!prompt.value.trim())return;try{await navigator.clipboard.writeText(prompt.value);status.textContent='Copied! Open your preferred AI chat, paste and start.';}catch{prompt.focus();prompt.select();status.textContent='Select and copy the instructions manually.';}});
 panel.querySelector('.save-assistant')?.addEventListener('click',()=>{if(!prompt.value.trim())return;const url=URL.createObjectURL(new Blob([prompt.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='agentshelf-assistant.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Instructions saved as a text file.';});
}
const form=document.querySelector('#make-assistant');
if(form){
 const status=document.querySelector('#builder-status'),output=document.querySelector('#builder-output'),panel=document.querySelector('#builder-result'),prompt=panel.querySelector('.assistant-prompt');
 const params=new URLSearchParams(location.search),idea=params.get('idea');if(idea&&idea.length<=2000)form.elements.goal.value=idea;
 for(const b of form.querySelectorAll('[data-goal]'))b.addEventListener('click',()=>{form.elements.goal.value=b.dataset.goal;form.elements.goal.focus();});
 form.addEventListener('submit',e=>{e.preventDefault();try{const v=Object.fromEntries(new FormData(form));prompt.value=makeAssistantPrompt(v.goal,v.style,v.name);panel.querySelector('h2').textContent=(v.name.trim()||'Your assistant')+' is ready to copy';output.hidden=false;document.querySelector('#builder-placeholder').hidden=true;panel.querySelector('.assistant-status').textContent='';status.textContent='Instructions created on your device.';panel.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){status.textContent=e.message;}});
}
