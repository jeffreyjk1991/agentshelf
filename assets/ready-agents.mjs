import {CHATS} from './chat-fit.mjs';
import {SCHEDULERS} from './schedule-engine.mjs';
import {saveItem,event} from './my-agents.mjs';
import {launchPlan,copyAgentText} from './chat-launch.mjs';
for(const panel of document.querySelectorAll('[data-ready-agent]')){
 const slug=panel.dataset.slug,name=panel.dataset.name,prompt=panel.querySelector('.ready-prompt'),original=prompt.value,select=panel.querySelector('.chat-select'),use=panel.querySelector('.ready-use'),download=panel.querySelector('.ready-download'),status=panel.querySelector('.ready-status'),edit=panel.querySelector('.ready-edit'),open=panel.querySelector('.ready-open'),logo=panel.querySelector('.ready-logo'),help=panel.querySelector('.setup-help'),backup=panel.querySelector('.ready-open-fallback'),hint=panel.querySelector('.ready-hint'),copyPrimary=panel.querySelector('.ready-copy-primary');
 let busy=false;
 const valid=()=>prompt.value.trim().length>0&&prompt.value.length<=12000;
 const plan=()=>launchPlan(select.value,prompt.value,prompt.value===original);
 const update=()=>{
  const chat=CHATS[select.value];if(!chat)return;
  const next=plan();use.href=next.href;use.dataset.launchMode=next.mode;
  if(next.mode==='prefill'){use.target='_blank';use.rel='noopener noreferrer';}else{use.removeAttribute('target');use.removeAttribute('rel');}
  use.replaceChildren(logo,document.createTextNode('Use in '+chat.name+' ↗'));logo.src=chat.logo;
  for(const a of [open,backup]){a.href=next.open;a.textContent='Open '+chat.name+' ↗';}
  hint.textContent=next.hint+(panel.dataset.scheduled==='true'?' Confirm the scheduled task in your chat.':'');
  help.href=panel.dataset.scheduled==='true'?SCHEDULERS[select.value].help:chat.help;
  download.textContent=prompt.value===original?'Download agent ↓':'Download edited agent ↓';
 };
 async function copy(){
  if(!valid()){status.textContent='Enter some instructions or reset to the original.';edit.open=true;prompt.focus();return false;}
  const name=CHATS[select.value].name;backup.hidden=false;
  if(await copyAgentText(prompt.value)){event('copy',slug);status.textContent='Copied. Open '+name+' and paste to start.';return true;}
  edit.open=true;prompt.focus();prompt.select();prompt.setSelectionRange(0,prompt.value.length);
  status.textContent='Clipboard blocked. Copy the selected instructions manually, then tap Open '+name+'.';return false;
 }
 use.addEventListener('click',async e=>{
  if(!valid()||busy){e.preventDefault();if(!busy)await copy();return;}
  const next=plan();
  if(next.mode==='prefill'){event('open_chat',slug);return;} // Native trusted click; never gated on clipboard.
  e.preventDefault();busy=true;use.setAttribute('aria-busy','true');
  try{if(await copy()){event('open_chat',slug);location.assign(next.open);}}
  finally{busy=false;use.removeAttribute('aria-busy');}
 });
 for(const b of [copyPrimary,panel.querySelector('.ready-copy')])b.addEventListener('click',async()=>{if(busy)return;busy=true;try{await copy();}finally{busy=false;}});
 prompt.addEventListener('input',()=>{backup.hidden=true;status.textContent='';update();});select.addEventListener('change',()=>{backup.hidden=true;status.textContent='';update();});
 panel.querySelector('.ready-reset').addEventListener('click',()=>{prompt.value=original;backup.hidden=true;update();status.textContent='Original agent restored.';});
 download.addEventListener('click',e=>{if(prompt.value===original)return;e.preventDefault();if(!valid()){status.textContent='Enter some instructions or reset to the original.';edit.open=true;return;}const url=URL.createObjectURL(new Blob([prompt.value+'\n'],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=slug+'-agent.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Edited agent downloaded.';});
 panel.querySelector('.ready-save').addEventListener('click',()=>{if(!valid())return;try{if(prompt.value.length>7000)throw Error();saveItem({key:'ready:'+slug,name,prompt:prompt.value,provider:select.value});status.textContent='Saved to My Agents on this device.';event('save',slug);}catch{status.textContent='Unable to save this version. Download it instead.';}});
 update();
}
