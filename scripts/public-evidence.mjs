import fs from 'node:fs';
import {runTool} from '../assets/tool-engine.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const packs=[
 {slug:'everyday',name:'Everyday planning & savings',description:'Plan a weekend, compare purchases, organize meals and manage the household.',slugs:['personal-ai-assistant','weekend-getaway','flight-price-watcher','product-deal-watcher','grocery-deal-advisor','meal-prep-coach']},
 {slug:'career',name:'Job search & career',description:'Prepare a resume, find relevant openings and get ready for interviews.',slugs:['resume-builder','cover-letter-writer','job-opening-scout','interview-practice','linkedin-profile-coach','job-offer-compare']},
 {slug:'creator',name:'Photography, video & social media',description:'Plan photo edits, professional portraits, captions and short-form videos.',slugs:['professional-headshot-maker','photo-edit-brief','image-prompt-builder','social-caption-writer','video-editing-assistant','instagram-carousel-creator']},
 {slug:'work',name:'Writing, research & productivity',description:'Draft messages, organize meetings, review sources and plan work.',slugs:['email-draft-assistant','meeting-action-extractor','article-summarizer','research-brief-builder','prompt-generator','website-builder-brief']}
];
const expected={
 'price-compare':'Offer B saves $7.00',
 'discount-calculator':'Final price: $85.86',
 'unit-price':'Package B is cheaper per oz',
 'sale-tax-calculator':'Total: $79.50',
 'bill-split':'$25.25 per person',
 'road-trip-cost':'Estimated fuel: $37.50'
};
export const fixtureDate='2026-11-25T12:00:00Z';
export function browserEvidence(){
 const catalog=read('everyday/catalog.json'),examples=read('everyday/examples.json');
 const cases=examples.map(({slug,values})=>{
  const tool=catalog.find(x=>x.slug===slug);if(!tool)throw Error('Missing fixture tool '+slug);
  const result=runTool(slug,values,new Date(fixtureDate));
  if(!result.title||!Array.isArray(result.lines))throw Error('Invalid fixture output '+slug);
  for(const link of result.links||[])if(new URL(link.url).protocol!=='https:')throw Error('Unexpected output protocol');
  if(expected[slug]&&result.title!==expected[slug])throw Error('Expected result mismatch '+slug);
  return {slug,name:tool.name,path:'/tools/'+slug,category:tool.category,inputs:values,result,check:expected[slug]?'expected-title-match':'output-shape-and-link-protocol',...(expected[slug]?{expectedTitle:expected[slug]}:{})};
 });
 if(cases.length!==catalog.length||new Set(cases.map(c=>c.slug)).size!==catalog.length)throw Error('Incomplete fixture coverage');
 return {name:'AIBin reproducible browser-tool examples',fixtureDate,timeZone:'UTC (fixture reference date)',scope:'Deterministic AIBin browser-tool code; no external websites or AI models called. Inputs are synthetic fixtures. A shape check does not independently validate every factual or mathematical result.',caseCount:cases.length,expectedTitleChecks:cases.filter(c=>c.expectedTitle).length,cases};
}
export function evidenceSection(esc){
 const report=browserEvidence();
 const rows=report.cases.filter(c=>c.expectedTitle).map(c=>'<tr><td><a href="'+esc(c.path)+'">'+esc(c.name)+'</a></td><td>'+esc(c.result.title)+'</td></tr>').join('');
 return '<section class="related-section"><h2>Reproducible browser-tool results</h2><p>We execute '+report.caseCount+' synthetic examples against the same browser-tool code used on AIBin. '+report.expectedTitleChecks+' cases additionally check their result title against an explicit expected answer. The fixture reference time is November 25, 2026, 12:00 UTC. These are deterministic results, not live prices or AI model benchmarks.</p><table class="research-table"><thead><tr><th>Example tool</th><th>Actual returned result</th></tr></thead><tbody>'+rows+'</tbody></table><p><a href="/browser-tool-evidence.json" download>Download all '+report.caseCount+' inputs, returned outputs and check types (JSON) ↓</a></p><p>Reproduce the examples using the <a href="https://github.com/jeffreyjk1991/agentshelf/blob/main/everyday/examples.json">public fixtures</a> and <a href="https://github.com/jeffreyjk1991/agentshelf/blob/main/assets/tool-engine.mjs">tool engine</a>. Run the project’s release tests. External search links are not checked for availability; AI chat execution is not part of this report.</p><p><a href="/agent-packs">Download free reusable agent packs</a></p></section>';
}
export function packLinks(entry,esc){
 if(!entry)return '';
 const selected=packs.filter(p=>p.slugs.includes(entry.slug));
 if(!selected.length)return '';
 return '<p class="fine-print">Also in: '+selected.map(p=>'<a href="/agent-packs#'+esc(p.slug)+'">'+esc(p.name)+' agent pack</a>').join(' · ')+'</p>';
}
export function publishEvidence({page,esc,base,out,entries}){
 const report=browserEvidence();fs.writeFileSync(out+'/browser-tool-evidence.json',JSON.stringify(report,null,2));
 const bySlug=new Map(entries.map(e=>[e.slug,e]));
 const collections=packs.map(pack=>{
  const items=pack.slugs.map(slug=>{const e=bySlug.get(slug);if(!e||!e.download)throw Error('Missing pack instruction '+slug);return e;});
  const download='/downloads/aibin-'+pack.slug+'-agent-pack.md';
  const lines=['# AIBin — '+pack.name+' agent pack','',pack.description,'','Free original AIBin instructions. Open one section in your preferred AI chat and add your own details. These are not installed skills or a hosted agent. External chat capabilities and account limits vary. Confirm scheduled tasks in a supported account; no background execution occurs on AIBin. Do not include secrets.','', 'Source: '+base+'/agent-packs#'+pack.slug,''];
  for(const e of items){const prompt=fs.readFileSync(out+e.download,'utf8').trimEnd();lines.push('## '+e.name,'',e.summary,'','Open: '+base+e.path,'','Copy the instructions below:','','~~~text',prompt,'~~~','');}
  fs.writeFileSync(out+download,lines.join('\n')+'\n');
  return {...pack,download,items};
 });
 const body=collections.map(p=>'<section class="related-section" id="'+esc(p.slug)+'"><h2>'+esc(p.name)+'</h2><p>'+esc(p.description)+'</p><a class="btn secondary" href="'+esc(p.download)+'" download>Download '+p.items.length+' agent instructions (.md) ↓</a><div class="intent-list">'+p.items.map(e=>'<a class="intent-row" href="'+esc(e.path)+'"><span><strong>'+esc(e.name)+'</strong><small>'+esc(e.summary)+'</small></span><span aria-hidden="true">↗</span></a>').join('')+'</div></section>').join('');
 const all=collections.flatMap(p=>p.items);
 page('/agent-packs','Free AI Agent Prompt Packs for Everyday Life, Work & Creators | AIBin','Download free reusable AI agent instructions for ChatGPT, Claude and Gemini. Four practical collections for everyday tasks, careers, photography, video, writing and work.','<article class="simple-page"><a class="back-link" href="/ai-agent-directory">← Agent directory</a><h1>Free AI agent packs</h1><p class="page-lead">24 ready-made agent instructions in four free, portable collections. No account or coding on AIBin.</p><p>Download one Markdown file, pick the task you need, and paste that section into a compatible AI chat. Customize the instructions on each agent page before using them. Scheduling, tools, image and video capabilities depend on your account. These are instruction packs, not native provider skills or installed software.</p>'+body+'<h2>Use your own task instead</h2><p><a href="/make-agent">Create a personalized AI agent</a> · <a href="/agent-checks">See reproducible tool examples and testing limits</a> · <a href="/ai-agent-directory">Browse all helpers</a></p></article>',{discoverySchema:{'@context':'https://schema.org','@type':'ItemList',name:'AIBin free AI agent packs',itemListElement:all.map((e,i)=>({'@type':'ListItem',position:i+1,name:e.name,url:base+e.path}))}});
 fs.writeFileSync(out+'/agent-packs.json',JSON.stringify({name:'AIBin free AI agent packs',count:all.length,format:'Portable Markdown instructions; manual use in compatible AI chats',packs:collections.map(p=>({slug:p.slug,name:p.name,description:p.description,url:base+'/agent-packs#'+p.slug,download:base+p.download,agents:p.items.map(e=>({name:e.name,url:base+e.path,download:base+e.download}))}))},null,2));
}
