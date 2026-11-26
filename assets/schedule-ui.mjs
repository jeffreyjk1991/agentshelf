import {SCHEDULERS,scheduleRequest} from './schedule-engine.mjs';
import {saveItem,copy,event} from './my-agents.mjs';
const root=document.querySelector('[data-automation]'),form=document.querySelector('#schedule-form');
if(root&&form){
 const result=document.querySelector('#schedule-result'),status=document.querySelector('#schedule-status'),message=document.querySelector('#schedule-result-status'),select=document.querySelector('#schedule-provider'),prompt=document.querySelector('#schedule-prompt'),slug=root.dataset.automation;
 let template=null,request='';
 const showCadence=()=>{document.querySelector('#weekday-row').hidden=form.elements.frequency.value!=='Weekly';document.querySelector('#monthday-row').hidden=form.elements.frequency.value!=='Monthly';};form.elements.frequency.addEventListener('change',showCadence);showCadence();
 try{form.elements.timezone.value=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';}catch{form.elements.timezone.value='UTC';}
 const renderProvider=()=>{const p=SCHEDULERS[select.value];if(!p)return;document.querySelector('#schedule-logo').src=p.logo;const a=document.querySelector('#schedule-open');a.href=p.url;a.textContent='2. Open '+p.name+' ↗';document.querySelector('#schedule-steps').textContent=p.steps;document.querySelector('#schedule-help').href=p.help;};
 select.addEventListener('change',renderProvider);
 form.addEventListener('input',()=>{result.hidden=true;request='';});
 form.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('[type=submit]');btn.disabled=true;try{if(!template){const r=await fetch('/automations.json');if(!r.ok)throw Error('Unable to load template. Try again.');template=(await r.json()).templates.find(x=>x.slug===slug);}request=scheduleRequest(template,Object.fromEntries(new FormData(form)));prompt.value=request;result.hidden=false;message.textContent='';status.textContent='';renderProvider();event('create',slug);result.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(err){result.hidden=true;request='';status.textContent=err.message||'Unable to create request.';}finally{btn.disabled=false;}});
 document.querySelector('#schedule-copy').addEventListener('click',async()=>{if(!request)return;if(await copy(request)){message.textContent='Copied. Open '+SCHEDULERS[select.value].name+' and confirm the task.';event('copy',slug);}else{document.querySelector('#schedule-preview').open=true;prompt.focus();prompt.select();message.textContent='Select and copy manually.';}});
 document.querySelector('#schedule-open').addEventListener('click',()=>{if(request)event('open_chat',slug);});
 document.querySelector('#save-personal-automation').addEventListener('click',()=>{if(!request)return;try{saveItem({key:'schedule:'+slug,name:template.name,prompt:request,provider:select.value,url:location.pathname});message.textContent='Saved on this device. Not an active task yet.';event('save',slug);}catch{message.textContent='Device storage unavailable.';}});
}
