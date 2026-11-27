import {CHATS} from './chat-fit.mjs';
import {SCHEDULERS} from './schedule-engine.mjs';
import {saveItem,event} from './my-agents.mjs';
for(const panel of document.querySelectorAll('[data-ready-agent]')){
 const slug=panel.dataset.slug,name=panel.dataset.name,prompt=panel.querySelector('.ready-prompt'),original=prompt.value,select=panel.querySelector('.chat-select'),use=panel.querySelector('.ready-use'),download=panel.querySelector('.ready-download'),status=panel.querySelector('.ready-status'),edit=panel.querySelector('.ready-edit'),open=panel.querySelector('.ready-open'),logo=panel.querySelector('.ready-logo'),help=panel.querySelector('.setup-help');
 const valid=()=>prompt.value.trim().length>0&&prompt.value.length<=12000;
 const update=()=>{const chat=CHATS[select.value];if(!chat)return;use.href=chat.url;use.replaceChildren(logo,document.createTextNode('Use in '+chat.name+' ↗'));logo.src=chat.logo;open.href=chat.url;open.textContent='Open '+chat.name+' ↗';help.href=panel.dataset.scheduled==='true'?SCHEDULERS[select.value].help:chat.help;download.textContent=prompt.value===original?'Download agent ↓':'Download edited agent ↓';};
 const copy=async()=>{if(!valid()){status.textContent='Enter some instructions or reset to the original.';edit.open=true;prompt.focus();return false;}try{await navigator.clipboard.writeText(prompt.value);event('copy',slug);return true;}catch{edit.open=true;prompt.focus();prompt.select();status.textContent='Copy the selected instructions manually, then use Open '+CHATS[select.value].name+' below.';return false;}};
 use.addEventListener('click',async e=>{e.preventDefault();if(await copy()){status.textContent='Copied. Paste into '+CHATS[select.value].name+' to start.';event('open_chat',slug);location.assign(use.href);}});
 panel.querySelector('.ready-copy').addEventListener('click',async()=>{if(await copy())status.textContent='Agent copied. Paste into your chat.';});
 prompt.addEventListener('input',update);select.addEventListener('change',update);
 panel.querySelector('.ready-reset').addEventListener('click',()=>{prompt.value=original;update();status.textContent='Original agent restored.';});
 download.addEventListener('click',e=>{if(prompt.value===original)return;e.preventDefault();if(!valid()){status.textContent='Enter some instructions or reset to the original.';edit.open=true;return;}const url=URL.createObjectURL(new Blob([prompt.value+'\n'],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=slug+'-agent.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Edited agent downloaded.';});
 panel.querySelector('.ready-save').addEventListener('click',()=>{if(!valid())return;try{if(prompt.value.length>7000)throw Error();saveItem({key:'ready:'+slug,name,prompt:prompt.value,provider:select.value});status.textContent='Saved to My Agents on this device.';event('save',slug);}catch{status.textContent='Unable to save this version. Download it instead.';}});
 update();
}
