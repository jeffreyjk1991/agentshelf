import {CHATS} from './chat-fit.mjs';
// Only unchanged public AIBin templates are eligible for a URL containing instructions.
// Third-party web prefill is best-effort, not a guaranteed API. No automatic paste.
export function launchPlan(provider,text,publicTemplate=false){
 if(!Object.hasOwn(CHATS,provider))throw Error('Choose a supported AI chat.');
 const chat=CHATS[provider],open=chat.url,plain={mode:'copy',href:open,open,hint:'Copies the agent and opens '+chat.name+'. Paste to start.'};
 if(!publicTemplate||typeof text!=='string'||!text.trim()||!['chatgpt','claude'].includes(provider))return plain;
 try{
  const href=(provider==='chatgpt'?'https://chatgpt.com/?q=':'https://claude.ai/new?q=')+encodeURIComponent(text);
  if(href.length>6000)return plain;
  return {mode:'prefill',href,open,hint:'Opens '+chat.name+' with the public instructions (may start automatically). If the chat is empty, use Copy agent and paste.'};
 }catch{return plain;}
}
function legacyCopy(text){
 let area,previous;
 try{
  previous=document.activeElement;
  area=document.createElement('textarea');area.value=text;area.className='clipboard-fallback';area.tabIndex=-1;area.setAttribute('aria-hidden','true');
  document.body.append(area);area.focus({preventScroll:true});area.select();area.setSelectionRange(0,text.length);
  return typeof document.execCommand==='function'&&document.execCommand('copy')===true;
 }catch{return false;}finally{area?.remove();try{previous?.focus({preventScroll:true});}catch{}}
}
export async function copyAgentText(text){
 if(typeof text!=='string'||!text.trim())return false;
 let timer;
 try{
  if(typeof navigator.clipboard?.writeText==='function'){
   // Start while the original click still has user activation.
   await Promise.race([navigator.clipboard.writeText(text),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Clipboard timeout')),1800);})]);
   return true;
  }
 }catch{}finally{clearTimeout(timer);}
 return legacyCopy(text);
}
