import {copyAgentText} from './chat-launch.mjs';
import {CHATS} from './chat-fit.mjs';
const KEY='agentshelf:saved:v2';
export function readSaved(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x.key==='string'&&typeof x.name==='string').slice(0,150):[];}catch{return [];}}
export function saveItem(item){const items=readSaved(),i=items.findIndex(x=>x.key===item.key);if(i>=0)items.splice(i,1);items.unshift(item);localStorage.setItem(KEY,JSON.stringify(items.slice(0,150)));}
export function removeItem(key){localStorage.setItem(KEY,JSON.stringify(readSaved().filter(x=>x.key!==key)));}
export function validItem(item){return !!(item&&typeof item.name==='string'&&item.name.length>0&&item.name.length<=100&&typeof item.prompt==='string'&&item.prompt.length>=5&&item.prompt.length<=7000&&Object.hasOwn(CHATS,item.provider));}
export function shareUrl(item){if(!validItem(item))throw Error('Invalid or oversized assistant.');return location.origin+'/shared-agent#'+encodeURIComponent(JSON.stringify({name:item.name,prompt:item.prompt,provider:item.provider}));}
export const copy=copyAgentText;
export function event(type,slug='site'){if(navigator.globalPrivacyControl||navigator.doNotTrack==='1'||localStorageSafe('agentshelf:analytics-off')==='1')return;fetch('/api/engagement',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,slug}),keepalive:true}).catch(()=>{});}
function localStorageSafe(k){try{return localStorage.getItem(k);}catch{return null;}}
function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function button(text,fn){const b=node('button',text,'text-button');b.type='button';b.addEventListener('click',fn);return b;}
async function offerShare(item,status){if(!confirm('The link will contain the complete instructions, visible to anyone who receives it. Continue only if there is no private information.'))return;try{const url=shareUrl(item);if(await copy(url))status.textContent='Share link copied.';else{status.replaceChildren(node('span','Copy this link: '));const a=node('a','Open share link');a.href=url;status.append(a);}event('share','custom');}catch(e){status.textContent=e.message;}}
const path=location.pathname.replace(/\/$/,'')||'/';
const slug=/^\/(?:agents|tools|automations|live-agents)\/([a-z0-9-]+)$/.exec(path)?.[1];
if(slug){
 const target=document.querySelector('.toolhead');if(target){
 const area=node('div',undefined,'agent-actions'),status=node('span',undefined,'muted'),name=document.querySelector('h1')?.textContent||slug,key='page:'+path;
 const b=button(readSaved().some(x=>x.key===key)?'Saved ✓':'☆ Save agent',()=>{try{if(readSaved().some(x=>x.key===key)){removeItem(key);b.textContent='☆ Save agent';}else{saveItem({key,name,url:path});b.textContent='Saved ✓';event('save',slug);}status.textContent='';}catch{status.textContent='Device storage unavailable.';}});
 area.append(b,status);target.after(area);
 }}
const saved=document.querySelector('#saved-list');
if(saved){
 const empty=document.querySelector('#saved-empty');
 function render(){const items=readSaved();saved.replaceChildren();empty.hidden=items.length>0;for(const item of items){const card=node('div',undefined,'saved-card'),title=node('strong',item.name),status=node('p',undefined,'muted');card.append(title);const actions=node('div',undefined,'agent-actions');if(item.url&&/^\/(?:agents|tools|automations|live-agents)\/[a-z0-9-]+$/.test(item.url)){const a=node('a','Open →','text-button');a.href=item.url;actions.append(a);}if(validItem(item)){actions.append(button('Copy',async()=>{if(await copy(item.prompt))status.textContent='Copied.';else{const d=card.querySelector('details');d.open=true;const pre=d.querySelector('pre');const range=document.createRange();range.selectNodeContents(pre);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Clipboard blocked. Copy the selected instructions manually.';}}),button('Share',()=>offerShare(item,status)));const a=node('a','Open '+CHATS[item.provider].name+' ↗','text-button');a.href=CHATS[item.provider].url;a.target='_blank';a.rel='noopener noreferrer';actions.append(a);const d=node('details');d.append(node('summary','View instructions'),node('pre',item.prompt));card.append(d);}actions.append(button('Remove',()=>{try{removeItem(item.key);render();}catch{status.textContent='Unable to remove.';}}));card.append(actions,status);saved.append(card);}}
 document.querySelector('#clear-saved').addEventListener('click',()=>{if(confirm('Remove all saved agents from this browser?'))try{localStorage.removeItem(KEY);render();}catch{}});
 render();
}
const shared=document.querySelector('#shared-content');
if(shared){
 const status=document.querySelector('#shared-status');
 try{if(location.hash.length>45000)throw Error('Share link is too long.');const item=JSON.parse(decodeURIComponent(location.hash.slice(1)));if(!validItem(item))throw Error('Invalid share link.');document.querySelector('#shared-name').textContent=item.name;document.querySelector('#shared-prompt').value=item.prompt;const a=document.querySelector('#shared-open');a.href=CHATS[item.provider].url;a.textContent='Open '+CHATS[item.provider].name+' ↗';shared.hidden=false;document.querySelector('#shared-copy').onclick=async()=>{status.textContent=await copy(item.prompt)?'Copied.':'Select and copy the instructions.';};document.querySelector('#shared-save').onclick=()=>{try{saveItem({...item,key:'custom:'+crypto.randomUUID()});status.textContent='Saved on this device.';}catch{status.textContent='Device storage unavailable.';}};}catch{status.textContent='This share link is missing or invalid.';}
}
if(!navigator.globalPrivacyControl&&navigator.doNotTrack!=='1'&&localStorageSafe('agentshelf:analytics-off')!=='1'){try{const now=Date.now(),last=Number(localStorage.getItem('agentshelf:last-visit')||0);if(!last||now-last>30*60*1000)event(last?'return_visit':'first_visit',slug||'site');localStorage.setItem('agentshelf:last-visit',String(now));}catch{}}
const optOut=document.querySelector('#analytics-opt-out');if(optOut){optOut.checked=localStorageSafe('agentshelf:analytics-off')==='1';optOut.addEventListener('change',()=>{try{localStorage.setItem('agentshelf:analytics-off',optOut.checked?'1':'0');}catch{}});}
