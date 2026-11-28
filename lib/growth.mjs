import {jobGuideHandoffSlug} from '../assets/job-guide-attribution.mjs';
export function normalizeCommunity(body){
 if(!body||typeof body!=='object'||body.consent!==true)throw Error('Confirm permission to publish.');
 const field=(k,min,max)=>{if(typeof body[k]!=='string')throw Error('Complete every field.');const s=body[k].trim();if(s.length<min||s.length>max)throw Error('Check '+k+' length.');return s;};
 const name=field('name',3,80),creator=field('creator',2,40),task=field('task',20,1500),provider=field('provider',5,10);
 if(!['chatgpt','claude','gemini'].includes(provider))throw Error('Choose a supported chat.');
 if(/(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-[a-zA-Z0-9_-]{20,}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/.test(name+' '+creator+' '+task))throw Error('Remove private contact information or possible credentials before submitting.');
 return {name,creator,task,provider};
}
export function normalizeEngagement(body){
 if(!body||!['first_visit','return_visit','search_match','search_no_match','create','copy','open_chat','save','share','tool_run'].includes(body.type)||typeof body.slug!=='string'||!/^[a-z0-9-]{1,80}$/.test(body.slug))throw Error('Invalid event.');
 if(body.slug===jobGuideHandoffSlug&&body.type!=='open_chat')throw Error('Invalid guide event.');
 const event={type:body.type,slug:body.slug};
 if(['first_visit','return_visit'].includes(body.type)&&body.source!==undefined){if(!['chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown'].includes(body.source)||!['home','builder','listing','directory','guide','other'].includes(body.landingKind))throw Error('Invalid attribution.');event.source=body.source;event.landingKind=body.landingKind;}
 return event;
}
