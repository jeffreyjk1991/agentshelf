import {normalizeUsername} from './editorial-profiles.mjs';
import {normalizeLink} from './marketplace.mjs';
export const categories=['Business','Career','Coding','Creative','Daily life','Food','Home','Learning','Local','Marketing','Money','News','Productivity','Research','Shopping','Travel','Work','Writing','Social media','Photography','Video','Other'];
export const providers={chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini',any:'No preference / Not sure',none:'Standalone / no chat'};
const providerFor={ChatGPT:'chatgpt','Claude artifact':'claude',Gemini:'gemini'};
export function normalizeAgentSubmission(body){
 if(!body||typeof body!=='object'||body.consent!==true)throw Error('Confirm you have permission to share this agent.');
 const field=(k,min,max)=>{const v=typeof body[k]==='string'?body[k].trim():'';if(v.length<min||v.length>max)throw Error('Check the '+k+' field.');return v;};
 const name=field('name',3,100),creator=normalizeUsername(body.creator),category=field('category',2,40),description=field('description',15,500),source=field('source',20,6000);
 let provider=field('provider',3,10);
 if(!categories.includes(category))throw Error('Choose a category.');
 if(!Object.hasOwn(providers,provider))throw Error('Choose a preferred AI chat.');
 if(/(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-[A-Za-z0-9_-]{20,}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/.test([name,creator,description,source].join(' ')))throw Error('Remove private contact information or possible credentials.');
 const linkLike=/^(?:[a-z][a-z0-9+.-]*:\/\/|www\.|(?:javascript|data|file|vbscript):)/i.test(source);
 if(linkLike){
  const link=normalizeLink({name,creator,description,url:source,consent:true});
  const linkedChat=providerFor[link.platform];
  if(linkedChat){if(!['any',linkedChat].includes(provider))throw Error('Choose '+providers[linkedChat]+' for this agent link.');provider=linkedChat;}
  return {name,creator,category,description,provider,kind:'link',instructions:null,url:link.url,platform:link.platform};
 }
 if(provider==='none')throw Error('For a standalone agent, provide a supported public link.');
 return {name,creator,category,description,provider,kind:'instructions',instructions:source,url:null,platform:null};
}
