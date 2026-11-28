const $=(s,r=document)=>r.querySelector(s);
async function newsletter(body){const r=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(12000)});const d=await r.json();if(!r.ok)throw Error(d.message||'Please try again later.');return d;}
for(const form of document.querySelectorAll('.weekly-form')){
 const status=$('.weekly-status',form),withdraw=$('.weekly-withdraw',form),button=$('button',form);
 form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;button.disabled=true;status.textContent='Subscribing…';withdraw.hidden=true;withdraw.removeAttribute('href');
  try{const d=await newsletter({action:'subscribe',email:form.elements.signupEmail.value,consent:true});status.textContent=d.message;form.reset();if(/^[A-Za-z0-9_-]{43}$/.test(d.withdrawToken||'')){withdraw.href='/newsletter#withdraw='+d.withdrawToken;withdraw.hidden=false;}}catch(e){status.textContent=e.message||'Please try again.';}finally{button.disabled=false;}
 });
}
const manage=$('#weekly-manage');
if(manage){
 const m=/^#(confirm|withdraw|unsubscribe)=([A-Za-z0-9_-]{43})$/.exec(location.hash);
 if(m){const action=m[1],token=m[2],isConfirm=action==='confirm';manage.hidden=false;$('#weekly-manage-title').textContent=isConfirm?'Confirm your email':'Cancel your subscription';$('#weekly-manage-description').textContent=isConfirm?'Confirm that you want to receive AIBin Weekly.':'This will stop future newsletters and cancel pending requests.';const b=$('#weekly-manage-action');b.textContent=isConfirm?'Confirm subscription':'Cancel subscription';b.addEventListener('click',async()=>{b.disabled=true;try{const d=await newsletter({action,token});$('#weekly-manage-status').textContent=d.message;history.replaceState(null,'',location.pathname);b.hidden=true;}catch(e){$('#weekly-manage-status').textContent=e.message;b.disabled=false;}});}
}
const daily=$('#daily-agent'),trending=$('#trending-panel');
if(daily||trending)fetch('/growth-picks.json',{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(async d=>{
 if(!Array.isArray(d.agents)||!Array.isArray(d.rotation)||!d.rotation.length)return;
 const agents=new Map(d.agents.filter(a=>a&&typeof a.slug==='string'&&typeof a.name==='string'&&typeof a.summary==='string'&&/^\/(agents|tools|automations|live-agents)\/[a-z0-9-]+$/.test(a.path)).map(a=>[a.slug,a]));
 if(daily){const a=agents.get(d.rotation[Math.floor(Date.now()/86400000)%d.rotation.length]);if(a){daily.href=a.path;daily.textContent=a.name+' ↗';$('#daily-label').textContent='AGENT OF THE DAY';$('#daily-description').textContent=a.summary;}}
 if(trending)try{const r=await fetch('/api/trending',{signal:AbortSignal.timeout(5000)});if(!r.ok)return;const j=await r.json(),rows=Array.isArray(j.items)?j.items.filter(a=>agents.has(a.slug)&&Number.isSafeInteger(a.actions)&&a.actions>=2).slice(0,3):[];if(!rows.length)return;const list=$('#trending-list');for(const row of rows){const a=agents.get(row.slug),link=document.createElement('a'),name=document.createElement('strong'),count=document.createElement('small');link.className='trending-row';link.href=a.path;name.textContent=a.name;count.textContent=row.actions+' actions';link.append(name,count);list.append(link);}$('#trending-total').textContent=rows.length+' agents';trending.hidden=false;}catch{}
}).catch(()=>{});
