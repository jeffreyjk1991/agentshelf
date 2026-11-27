const form=document.querySelector('#live-form'),status=document.querySelector('#live-status'),result=document.querySelector('#live-result'),list=document.querySelector('#live-result-list');
const node=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
form?.querySelector('.live-example')?.addEventListener('click',e=>{form.elements.input.value=e.currentTarget.dataset.example;form.elements.input.focus();});
form?.addEventListener('submit',async e=>{
 e.preventDefault();const b=form.querySelector('button[type=submit]');if(b.disabled)return;b.disabled=true;status.textContent='Checking the public data source…';result.hidden=true;list.replaceChildren();
 try{
 const r=await fetch('/api/live-run',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),body:JSON.stringify({slug:form.dataset.liveSlug,input:new FormData(form).get('input')})});
 let j;try{j=await r.json();}catch{throw Error('The live agent service is unavailable. Try again shortly.');}if(!r.ok)throw Error(j.message||'Agent unavailable.');if(!j.result||!Array.isArray(j.result.rows))throw Error('The source returned an unexpected result. Try again.');
 const d=j.result;document.querySelector('#live-result-title').textContent=d.title;document.querySelector('#live-result-time').textContent='Checked '+new Date(d.checkedAt).toLocaleString();
 for(const row of d.rows){const a=node('div','');a.className='saved-card';a.append(node('strong',row.title),node('p',row.detail));try{const u=new URL(row.url);if(u.protocol==='https:'){const l=node('a','Open source ↗');l.href=u.href;l.target='_blank';l.rel='noopener noreferrer';l.className='text-button';a.append(l);}}catch{}list.append(a);}
 if(!d.rows.length)list.append(node('p','No matching results. Try a more specific request.'));
 document.querySelector('#live-result-note').textContent=d.note;result.hidden=false;status.textContent='Source lookup complete.';
 }catch(err){status.textContent=err.name==='TimeoutError'||err.name==='AbortError'?'The lookup took too long. Please try again.':err.message||'Lookup unavailable.';}finally{b.disabled=false;}
});
