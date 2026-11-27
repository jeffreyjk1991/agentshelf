import {buildVibeAgent,frequencies,groupCreators,publicAgentPath} from './experience-core.mjs';
import {CHATS} from './chat-fit.mjs';
import {copyAgentText} from './chat-launch.mjs';
import {event,saveItem} from './my-agents.mjs';
import {readCommunity,node,usernameLabel} from './community-cards.mjs';
const $=(s,root=document)=>root.querySelector(s);
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
function button(txt,action,cls='text-button'){const b=el('button',txt,cls);b.type='button';b.addEventListener('click',action);return b;}
function link(txt,href,cls){const a=el('a',txt,cls);a.href=href;return a;}
function download(blob,name){const url=URL.createObjectURL(blob),a=link('',url);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function safeRead(key){try{return JSON.parse(localStorage.getItem(key)||'[]');}catch{return [];}}
function safeWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
let catalogPromise;
function templates(){return catalogPromise||(catalogPromise=fetch('/agent-experience.json',{credentials:'same-origin',signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error('Template catalog unavailable');return r.json();}).then(r=>{if(!Array.isArray(r.templates))throw Error('Invalid catalog');return r.templates;}).catch(()=>{catalogPromise=null;return [];}));}
for(const form of document.querySelectorAll('.vibe-form')){
 const parent=form.closest('.vibe-builder'),result=$('.vibe-result',parent),status=$('.vibe-form-status',parent),prompt=$('.vibe-prompt',parent),message=$('.vibe-result-status',parent),open=$('.vibe-open',parent),fallback=$('.vibe-fallback',parent);
 let item=null,revision=0,savedKey=null;
 function invalidate(){revision++;item=null;savedKey=null;result.hidden=true;prompt.value='';message.textContent='';status.textContent='';$('.vibe-save',parent).disabled=false;}
 form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
 const idea=new URLSearchParams(location.search).get('idea');if(location.pathname==='/make-agent'&&idea&&idea.length<=1400)form.elements.goal.value=idea;
 for(const b of parent.querySelectorAll('[data-vibe-goal]'))b.addEventListener('click',()=>{form.elements.goal.value=b.dataset.vibeGoal;invalidate();form.elements.goal.focus();});
 form.addEventListener('submit',async e=>{
  e.preventDefault();const submit=form.querySelector('button[type=submit]');submit.disabled=true;status.textContent='Preparing your instructions…';
  try{
   const request=++revision;const v=Object.fromEntries(new FormData(form));item=null;result.hidden=true;savedKey=null;$('.vibe-save',parent).disabled=false;const available=await templates();if(request!==revision)return;item=buildVibeAgent({...v,templates:available});
   prompt.value=item.prompt;$('.vibe-name',parent).textContent=item.name;$('.vibe-mode',parent).textContent=(item.frequency==='once'?'One-time assistant':frequencies[item.frequency]+' task request')+' · '+CHATS[item.provider].name+(item.frequency!=='once'&&v.provider==='claude'?' (scheduling requires a supported chat)':'');
   $('.vibe-limits',parent).textContent=item.frequency==='once'?'Runs in your chosen AI chat. Your task stays on this device until you copy it.':'Confirm the schedule and notifications in your AI chat. Not active until that provider confirms it.';
   const match=$('.vibe-match',parent);match.hidden=!item.template;if(item.template){match.href=item.template.path;match.textContent='Related template: '+item.template.name+' →';}
   open.textContent='Copy & open '+CHATS[item.provider].name+' ↗';fallback.href=CHATS[item.provider].url;fallback.textContent='Open '+CHATS[item.provider].name+' ↗';fallback.hidden=true;
   message.textContent='';status.textContent='';result.hidden=false;event('create','custom');result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(e){status.textContent=e.message;result.hidden=true;item=null;}finally{submit.disabled=false;}
 });
 open.addEventListener('click',async()=>{if(!item)return;const active=item;open.disabled=true;try{const copied=await copyAgentText(active.prompt);if(item!==active)return;if(copied){event('copy','custom');event('open_chat','custom');fallback.hidden=false;message.textContent='Copied. Paste into your chat to start.';location.assign(CHATS[item.provider].url);}else{fallback.hidden=false;prompt.closest('details').open=true;prompt.focus();prompt.select();message.textContent='Clipboard blocked. Copy the selected instructions and open your chat.';}}finally{open.disabled=false;}});
 $('.vibe-copy',parent).addEventListener('click',async()=>{if(!item)return;if(await copyAgentText(item.prompt)){event('copy','custom');message.textContent='Instructions copied.';}else{prompt.closest('details').open=true;prompt.focus();prompt.select();message.textContent='Copy the selected instructions manually.';}});
 $('.vibe-download',parent).addEventListener('click',()=>{if(item)download(new Blob([item.prompt+'\n'],{type:'text/plain;charset=utf-8'}),'aibin-custom-agent.txt');});
 $('.vibe-save',parent).addEventListener('click',()=>{if(!item)return;try{savedKey||='custom:'+crypto.randomUUID();saveItem({key:savedKey,name:item.name,prompt:item.prompt,provider:item.provider});event('save','custom');message.textContent='Saved to My Agents on this device.';$('.vibe-save',parent).disabled=true;}catch{message.textContent='Device storage unavailable; download instead.';}});
}
// Branded square PNGs are generated locally, contain only public listing titles and URLs.
function wrapText(ctx,text,max,lines){const words=String(text).split(/\s+/),out=[];let line='';for(const w of words){if(ctx.measureText(line+(line?' ':'')+w).width>max&&line){out.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)out.push(line);if(out.length>lines){out.length=lines;out[lines-1]=out[lines-1].slice(0,Math.max(1,out[lines-1].length-2))+'…';}return out;}
function rect(ctx,x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function robot(ctx,x,y){rect(ctx,x,y,100,100,24,'#146a48');ctx.fillStyle='#d5fbe8';ctx.fillRect(x+47,y+14,6,19);ctx.beginPath();ctx.arc(x+50,y+13,5,0,Math.PI*2);ctx.fill();rect(ctx,x+22,y+30,56,49,15,'#f3fff8');rect(ctx,x+32,y+40,36,24,9,'#146a48');ctx.fillStyle='#d5fbe8';for(const dx of [42,58]){ctx.beginPath();ctx.arc(x+dx,y+52,4,0,Math.PI*2);ctx.fill();}rect(ctx,x+43,y+70,14,3,2,'#146a48');}
function renderShareCard(title,description,path){
 const c=document.createElement('canvas');c.width=c.height=1080;const ctx=c.getContext('2d');if(!ctx)throw Error('Card generation unavailable.');
 ctx.fillStyle='#e9f4ed';ctx.fillRect(0,0,1080,1080);rect(ctx,45,45,990,990,55,'#fff');robot(ctx,92,90);
 ctx.fillStyle='#146a48';ctx.font='bold 44px system-ui,sans-serif';ctx.fillText('aibin.me',215,151);
 ctx.font='600 25px system-ui,sans-serif';ctx.fillText('AI FOR EVERYDAY LIFE',94,250);
 ctx.fillStyle='#19392b';ctx.font='bold 60px system-ui,sans-serif';let y=330;for(const s of wrapText(ctx,title,890,3)){ctx.fillText(s,94,y,890);y+=70;}
 ctx.fillStyle='#52675c';ctx.font='34px system-ui,sans-serif';y+=24;for(const s of wrapText(ctx,description||'Explore this free AI helper on AIBin.',880,4)){ctx.fillText(s,94,y,880);y+=42;}
 rect(ctx,92,822,896,136,24,'#146a48');ctx.fillStyle='#fff';ctx.font='bold 33px system-ui,sans-serif';ctx.fillText('Try this helper →',128,871);
 ctx.font='24px system-ui,sans-serif';const url='www.aibin.me'+path;const pathLines=url.match(/.{1,62}/g)||[url];for(let i=0;i<Math.min(pathLines.length,2);i++)ctx.fillText(pathLines[i],128,911+i*28,825);
 return c;
}
let shareDialog;
function shareCard(title,description,path){
 if(!publicAgentPath(path))return;
 const url='https://www.aibin.me'+path;let canvas;try{canvas=renderShareCard(title,description,path);}catch{if(navigator.share)navigator.share({title,text:'Explore on AIBin',url}).catch(()=>{});else copyAgentText(url);return;}
 if(shareDialog){shareDialog.close?.();shareDialog.remove();}const d=el('dialog',undefined,'share-dialog');shareDialog=d;
 const close=button('Close ×',()=>{if(d.close)d.close();else d.remove();});const h=el('h2','Share this agent'),image=el('img');image.src=canvas.toDataURL('image/png');image.alt='AIBin share card for '+title;
 const actions=el('div',undefined,'share-buttons'),status=el('p','','vibe-status'),direct=link(url,url);direct.className='vibe-status';direct.classList.add('share-direct-link');status.setAttribute('role','status');
 const blob=()=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('No image')),'image/png'));let shareFile;blob().then(b=>{shareFile=new File([b],'aibin-agent-card.png',{type:'image/png'});}).catch(()=>{});
 const slug=path.match(/\/(?:agents|tools|automations|live-agents)\/([a-z0-9-]+)$/)?.[1]||path.match(/#agent-(\d+)$/)?.[1]&&'community-'+path.match(/#agent-(\d+)$/)[1]||'custom';
 actions.append(button('Download PNG',async()=>{try{download(await blob(),'aibin-agent-card.png');event('share',slug);status.textContent='Card downloaded. Share it together with the direct link.';}catch{status.textContent='Could not create image.';}},'btn secondary'),button('Copy link',async()=>{status.textContent=await copyAgentText(url)?'Direct link copied.':'Select the link below to copy.';event('share',slug);},'btn secondary'),button('Share',async()=>{if(!navigator.share){status.textContent=await copyAgentText(url)?'Link copied. Download the PNG to attach it.':'Download the PNG and copy the link.';return;}try{const payload={title,text:'Explore this AI helper on AIBin',url};if(shareFile&&navigator.canShare?.({files:[shareFile]}))payload.files=[shareFile];await navigator.share(payload);event('share',slug);}catch(e){if(e.name!=='AbortError')status.textContent='Use Download PNG and Copy link instead.';}},'btn primary'));
 d.append(close,h,image,actions,direct,status);document.body.append(d);d.addEventListener('close',()=>{d.remove();if(shareDialog===d)shareDialog=null;});if(d.showModal)d.showModal();else d.setAttribute('open','');
}
const current=location.pathname.replace(/\/$/,'')||'/';
const listing=/^\/(?:agents|tools|automations|live-agents)\/([a-z0-9-]+)$/.exec(current);
if(listing){
 const header=$('.toolhead')||$('h1')?.parentElement,name=$('h1')?.textContent||'AI helper',desc=$('.toolhead .lead')?.textContent||'Explore this free AI helper.';
 if(header){const existing=$('.agent-actions');const area=existing||el('div',undefined,'experience-actions');area.append(button('Share ↗',()=>shareCard(name,desc,current)));if(!existing)header.after(area);}
 const recent=safeRead('aibin:recent');const list=Array.isArray(recent)?recent:[];safeWrite('aibin:recent',[{name,path:current},...list.filter(x=>x?.path!==current&&publicAgentPath(x?.path))].slice(0,12));
}
const recentPanel=$('#recent-panel');
if(recentPanel){const rows=safeRead('aibin:recent'),container=$('#recent-list');for(const r of Array.isArray(rows)?rows:[]){if(!publicAgentPath(r?.path)||typeof r.name!=='string')continue;container.append(link(r.name+' →',r.path,'starter-row'));}recentPanel.hidden=!container.children.length;$('#clear-recent')?.addEventListener('click',()=>{safeWrite('aibin:recent',[]);container.replaceChildren();recentPanel.hidden=true;});}
const install=$('#install-aibin');let installEvent=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(install)install.hidden=false;});
window.addEventListener('appinstalled',()=>{if(install)install.hidden=true;installEvent=null;});
if(install){if(window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true)install.hidden=true;install.addEventListener('click',async()=>{if(installEvent){try{await installEvent.prompt();const choice=await installEvent.userChoice;installEvent=null;if(choice?.outcome==='accepted')install.hidden=true;else $('#install-help').hidden=false;}catch{installEvent=null;$('#install-help').hidden=false;}}else{const help=$('#install-help');if(help)help.hidden=false;}});}
if('serviceWorker' in navigator&&(location.origin==='https://www.aibin.me'||location.hostname==='localhost'||location.hostname==='127.0.0.1'))navigator.serviceWorker.register('/sw.js').catch(()=>{});
const creatorRoot=$('#creator-directory');
if(creatorRoot){
 const status=$('#creator-status'),filter=$('#creator-filter'),title=$('#creator-title');
 let groups=[];
 function render(){const key=decodeHash(),query=(filter?.value||'').trim().toLowerCase();creatorRoot.replaceChildren();const selected=groups.filter(g=>(!key||g.key===key)&&(!query||g.name.toLowerCase().includes(query)||g.agents.some(a=>a.name.toLowerCase().includes(query))));
  title.textContent=key&&selected.length?'@'+selected[0].name:'Explore creators';
  for(const [i,g] of selected.entries()){
   const card=el('article',undefined,'creator-card');if(!key&&i===0&&g.opens>0)card.append(el('div','Most recorded opens','creator-featured'));
   const h=el('h2');h.append(link('@'+g.name,'/creators#'+encodeURIComponent(g.key)));card.append(h,el('p',g.agents.length+' reviewed '+(g.agents.length===1?'agent':'agents')+' · '+g.opens+' recorded chat/agent opens','muted'));
   const list=el('div',undefined,'intent-list');
   for(const a of g.agents){const row=link(a.name+' →','/community#agent-'+a.id,'intent-row');list.append(row);}card.append(list,button('Share collection ↗',()=>shareCard('@'+g.name+' · AI agents','Browse '+g.agents.length+' reviewed community '+(g.agents.length===1?'agent':'agents')+' on AIBin.','/creators#'+g.key)));creatorRoot.append(card);
  }
  status.textContent=selected.length?'':groups.length?'No matching creator.':'No approved community creators yet. Be the first to contribute.';
 }
 function decodeHash(){try{const v=decodeURIComponent(location.hash.slice(1)).toLowerCase();return /^[a-z0-9][a-z0-9_.-]{1,49}$/.test(v)?v:'';}catch{return '';}}
 filter?.addEventListener('input',render);window.addEventListener('hashchange',()=>{if(filter)filter.value='';render();});
 readCommunity().then(a=>{groups=groupCreators(a);render();}).catch(()=>{status.textContent='Creator directory temporarily unavailable.';});
}
export {shareCard};


// Illustrations are intentionally static without JS; replay restarts only local CSS motion.
for(const flow of document.querySelectorAll('.collection-flow')){
 const replay=flow.querySelector('.flow-replay');if(!replay)continue;
 replay.hidden=false;
 replay.addEventListener('click',()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  flow.classList.remove('is-playing');
  void flow.offsetWidth;
  flow.classList.add('is-playing');
 });
}
