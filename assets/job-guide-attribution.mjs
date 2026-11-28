export const jobGuidePath='/blog/ai-agent-for-job-search';
export const jobScoutSlug='job-opening-scout';
export const jobGuideHandoffSlug='job-opening-scout-from-job-guide';

// Check the incoming path locally. Do not send the referrer or store a visitor ID.
export function fromJobGuide(referrer,origin){
 try{const url=new URL(referrer);return url.origin===origin&&url.pathname===jobGuidePath;}catch{return false;}
}
export function jobGuideHandoff({slug,referrer,origin,now=Date.now}){
 const expires=now()+30*60*1000;
 let pending=slug===jobScoutSlug&&fromJobGuide(referrer,origin);
 return ()=>{if(!pending||now()>=expires)return false;pending=false;return true;};
}
