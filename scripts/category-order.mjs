import {searchDemand} from './competitor-demand.mjs';
// Use the strongest representative intent per category, not a misleading sum of overlapping searches.
// Unmeasured categories use a documented editorial everyday-use fallback. This is not site usage.
const fallback=['Travel','Shopping','Career','Social media','Money','Food','Daily life','Local','Work','News','Marketing','Home','Learning','Business','Research','Coding','Video','Photography','Creative','Productivity','Writing'];
export function orderCategories(categories,assistants,demand=searchDemand){
 const bySlug=new Map(assistants.map(a=>[a.slug,a.category])), scores=new Map();
 for(const row of demand){const category=bySlug.get(row.slug),volume=Number(row.monthlySearches);if(category&&Number.isFinite(volume)&&volume>0)scores.set(category,Math.max(scores.get(category)||0,volume));}
 const fallbackIndex=c=>{const i=fallback.indexOf(c);return i<0?fallback.length:i;};
 return [...new Set(categories)].sort((a,b)=>{
  if(a==='All'||b==='All')return a==='All'?-1:1;
  if(a==='Community'||b==='Community')return a==='Community'?1:-1;
  return (scores.get(b)||0)-(scores.get(a)||0)||fallbackIndex(a)-fallbackIndex(b)||a.localeCompare(b);
 });
}
