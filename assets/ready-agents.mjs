import {mergePreferences} from './customize-agent.mjs';
import {CHATS} from './chat-fit.mjs';
import {SCHEDULERS} from './schedule-engine.mjs';
import {saveItem,event} from './my-agents.mjs';
import {launchPlan,copyAgentText} from './chat-launch.mjs';
import {jobGuideHandoff,jobGuideHandoffSlug} from './job-guide-attribution.mjs';
for(const panel of document.querySelectorAll('[data-ready-agent]')){
 const slug=panel.dataset.slug,name=panel.dataset.name,prompt=panel.querySelector('.ready-prompt'),original=prompt.value,select=panel.querySelector('.chat-select'),use=panel.querySelector('.ready-use'),download=panel.querySelector('.ready-download'),status=panel.querySelector('.ready-status'),edit=panel.querySelector('.ready-edit'),open=panel.querySelector('.ready-open'),logo=panel.querySelector('.ready-logo'),help=panel.querySelector('.setup-help'),backup=panel.querySelector('.ready-open-fallback'),hint=panel.querySelector('.ready-hint'),copyPrimary=panel.querySelector('.ready-copy-primary');
 const fields=[...panel.querySelectorAll('[data-custom-field]')],refs=panel.querySelector('.ready-references'),customError=panel.querySelector('.customize-error');
 const attributeGuide=jobGuideHandoff({slug,referrer:document.referrer,origin:location.origin});
 const recordHandoff=()=>{event('open_chat',slug);if(attributeGuide())event('open_chat',jobGuideHandoffSlug);};
 let busy=false,basePrompt=original,lastSuffix='',preferencesValid=true;
 const valid=()=>preferencesValid&&prompt.value.trim().length>0&&prompt.value.length<=12000;
 const plan=()=>launchPlan(select.value,prompt.value,preferencesValid&&prompt.value===original);
 function clearPreferences(){fields.forEach(f=>{f.value='';});if(refs)refs.value='';lastSuffix='';preferencesValid=true;if(customError)customError.textContent='';}
 function readManualEdit(){
  // Keep manual changes to the base text. If someone edits the generated preference block itself,
  // preserve their complete edited text and clear the controls so it isn't appended twice.
  if(lastSuffix&&prompt.value.endsWith(lastSuffix))basePrompt=prompt.value.slice(0,-lastSuffix.length);
  else{basePrompt=prompt.value;if(lastSuffix)clearPreferences();}
 }
 function syncPreferences(){
  try{const merged=mergePreferences(basePrompt,fields.map(f=>({label:f.dataset.label,value:f.value})),refs?.value||'');
   prompt.value=merged.prompt;lastSuffix=merged.suffix;preferencesValid=true;if(customError)customError.textContent='';
  }catch(e){preferencesValid=false;if(customError)customError.textContent=e.message;}
  backup.hidden=true;status.textContent='';update();return preferencesValid;
 }
 function showInvalid(){edit.open=true;if(!preferencesValid){status.textContent=customError?.textContent||'Check your optional preferences.';refs?.focus();}else{status.textContent='Enter some instructions or reset to the original.';prompt.focus();}}

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
  if(!valid()){showInvalid();return false;}
  const name=CHATS[select.value].name;backup.hidden=false;
  if(await copyAgentText(prompt.value)){event('copy',slug);status.textContent='Copied. Open '+name+' and paste to start.';return true;}
  edit.open=true;prompt.focus();prompt.select();prompt.setSelectionRange(0,prompt.value.length);
  status.textContent='Clipboard blocked. Copy the selected instructions manually, then tap Open '+name+'.';return false;
 }
 use.addEventListener('click',async e=>{
  if(!valid()||busy){e.preventDefault();if(!busy)await copy();return;}
  const next=plan();
  if(next.mode==='prefill'){recordHandoff();return;} // Native trusted click; never gated on clipboard.
  e.preventDefault();busy=true;use.setAttribute('aria-busy','true');
  try{if(await copy()){recordHandoff();location.assign(next.open);}}
  finally{busy=false;use.removeAttribute('aria-busy');}
 });
 for(const a of [open,backup])a.addEventListener('click',()=>{if(valid()&&attributeGuide()){event('open_chat',slug);event('open_chat',jobGuideHandoffSlug);}});
 for(const b of [copyPrimary,panel.querySelector('.ready-copy')])b.addEventListener('click',async()=>{if(busy)return;busy=true;try{await copy();}finally{busy=false;}});
 for(const f of [...fields,...(refs?[refs]:[])]){f.addEventListener('input',syncPreferences);f.addEventListener('change',syncPreferences);}
 prompt.addEventListener('input',()=>{readManualEdit();backup.hidden=true;status.textContent='';update();});select.addEventListener('change',()=>{backup.hidden=true;status.textContent='';update();});
 panel.querySelector('.ready-reset').addEventListener('click',()=>{clearPreferences();basePrompt=original;prompt.value=original;backup.hidden=true;update();status.textContent='Original agent restored.';});
 download.addEventListener('click',e=>{if(!valid()){e.preventDefault();showInvalid();return;}if(prompt.value===original)return;e.preventDefault();const url=URL.createObjectURL(new Blob([prompt.value+'\n'],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=slug+'-agent.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Edited agent downloaded.';});
 panel.querySelector('.ready-save').addEventListener('click',()=>{if(!valid()){showInvalid();return;}try{if(prompt.value.length>7000)throw Error();saveItem({key:'ready:'+slug,name,prompt:prompt.value,provider:select.value});status.textContent='Saved to My Agents on this device.';event('save',slug);}catch{status.textContent='Unable to save this version. Download it instead.';}});
 update();
}
