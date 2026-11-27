const KEY='aibin:voter:v1';
let voter=null;try{voter=localStorage.getItem(KEY);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(voter||'')){voter=crypto.randomUUID();localStorage.setItem(KEY,voter);}}catch{try{voter=crypto.randomUUID();}catch{}}
const totals=new Map(),mine=new Map(),controls=new Map(),busy=new Set();
let available=false,loading=null;
export function voteRank(slug,mode='top'){const row=totals.get(slug);return Number((mode==='trending'?row?.recent:row?.score)||0);}
function draw(slug){for(const item of controls.get(slug)||[]){const v=mine.get(slug)||0;const row=totals.get(slug);item.count.textContent=available?String(row?.score||0):'—';item.count.title=available?((row?.upvotes||0)+' upvotes, '+(row?.downvotes||0)+' downvotes'):'Voting unavailable';item.up.setAttribute('aria-pressed',String(v===1));item.down.setAttribute('aria-pressed',String(v===-1));item.up.disabled=!available||!voter||busy.has(slug);item.down.disabled=!available||!voter||busy.has(slug);}}
function refreshAll(){for(const slug of controls.keys())draw(slug);document.dispatchEvent(new Event('aibin:votes'));}
export function loadVotes(){if(loading)return loading;loading=(async()=>{try{const q=voter?'?voter='+encodeURIComponent(voter):'';const r=await fetch('/api/marketplace-votes'+q,{cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();for(const x of d.totals||[])totals.set(x.item_slug,x);for(const x of d.mine||[])mine.set(x.item_slug,Number(x.value));available=true;}catch{available=false;}refreshAll();})();return loading;}
export function mountVote(slug,target){
 if(!target||!/^[a-z0-9-]{1,80}$/.test(slug||''))return;
 const wrap=document.createElement('div');wrap.className='vote-bar';wrap.setAttribute('aria-label','Community votes');
 const button=(label,text)=>{const b=document.createElement('button');b.type='button';b.className='vote-button';b.setAttribute('aria-label',label);b.setAttribute('aria-pressed','false');b.textContent=text;b.disabled=true;return b;};
 const up=button('Upvote','▲'),down=button('Downvote','▼'),count=document.createElement('span'),status=document.createElement('span');count.className='vote-score';count.textContent='—';count.setAttribute('aria-live','polite');status.className='vote-status';status.setAttribute('role','status');
 wrap.append(up,count,down,status);target.append(wrap);const entry={up,down,count,status};if(!controls.has(slug))controls.set(slug,[]);controls.get(slug).push(entry);draw(slug);
 async function send(direction){if(busy.has(slug)||!available||!voter)return;busy.add(slug);draw(slug);status.textContent='';try{const value=(mine.get(slug)||0)===direction?0:direction;const r=await fetch('/api/marketplace-votes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,voter,value})});const d=await r.json();if(!r.ok)throw Error(d.message||'Vote not saved.');totals.set(slug,d.total);mine.set(slug,Number(d.value));refreshAll();}catch(e){status.textContent=e.message||'Vote failed.';}finally{busy.delete(slug);draw(slug);}}
 up.addEventListener('click',()=>send(1));down.addEventListener('click',()=>send(-1));loadVotes();
}
export function initCardVotes(cards){
 for(const card of cards){const slug=card.dataset.voteSlug||card.getAttribute('href')?.split('/').pop();if(!slug||card.closest('.votable-card'))continue;const w=document.createElement('div');w.className='votable-card';card.before(w);w.append(card);mountVote(slug,w);}
}
const match=/^\/(?:agents|tools|automations|live-agents)\/([a-z0-9-]+)\/?$/.exec(location.pathname);
if(match){const head=document.querySelector('.toolhead');if(head){const v=document.createElement('div');v.className='detail-votes';head.after(v);mountVote(match[1],v);}}
