import {CHATS,recommendedChat} from '../assets/chat-fit.mjs';
import {SCHEDULERS} from '../assets/schedule-engine.mjs';
export function compatibleChats(slug,scheduled=false,preferred=recommendedChat(slug)){
 const allowed=Object.keys(scheduled?SCHEDULERS:CHATS);
 return allowed.includes(preferred)?[preferred,...allowed.filter(k=>k!==preferred)]:allowed;
}
export function compatibilityIcon({esc,slug,scheduled=false,preferred=recommendedChat(slug)}){
 const ids=compatibleChats(slug,scheduled,preferred),c=CHATS[ids[0]];
 const label='Recommended: '+c.name+'; compatible instructions: '+ids.map(k=>CHATS[k].name).join(', ')+(scheduled?'; scheduling availability varies by account':'');
 return '<img class="compatibility-icon" data-chat="'+esc(ids[0])+'" src="'+esc(c.logo)+'" width="17" height="17" alt="'+esc(label)+'" title="'+esc(label)+'" loading="lazy" decoding="async">';
}
export function compatibilityIcons({esc,slug,scheduled=false,preferred=recommendedChat(slug)}){
 const ids=compatibleChats(slug,scheduled,preferred);
 return '<span class="compatibility-icons" role="group" aria-label="Compatible AI chats">'+ids.map((k,i)=>{const c=CHATS[k],label=c.name+(i===0?' (recommended)':'')+(scheduled?' — scheduling availability varies by account':'');return '<img class="compatibility-icon" data-chat="'+esc(k)+'" src="'+esc(c.logo)+'" width="18" height="18" alt="'+esc(label)+'" title="'+esc(label)+'" decoding="async">';}).join('')+'</span>';
}
