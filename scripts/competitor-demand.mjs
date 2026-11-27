import fs from 'node:fs';
const demand=JSON.parse(fs.readFileSync('research/competitor-demand.json','utf8'));
export const prioritySlugs=[...new Set(demand.competitors.flatMap(c=>c.tasks.map(t=>t.slug)))];
export function extraAgentContent(slug,esc,assistants){
 const d=demand.details[slug];if(!d)return '';
 const a=assistants.find(x=>x.slug===slug);if(!a)throw Error('Missing demand assistant '+slug);
 return '<section class="simple-page intent-example" aria-label="Practical example"><h2>How to use '+esc(a.name)+'</h2><p>Copy the free instructions above into your chosen AI chat, provide the details it asks for and review its response.</p><h3>Example request</h3><p>'+esc(d.example)+'</p><h3>What you can expect</h3><p>'+esc(d.output)+'</p><h3>What to check</h3><p>'+esc(d.limit)+'</p><p><a href="/popular-ai-agents">Explore more useful AI assistants →</a></p></section>';
}
export function addDemandPages({page,esc,base,out,assistants}){
 const index=new Map(assistants.map(a=>[a.slug,a]));
 for(const slug of prioritySlugs)if(!index.has(slug)||!demand.details[slug])throw Error('Unmapped competitor task '+slug);
 const groups=new Map();for(const slug of prioritySlugs){const a=index.get(slug);if(!groups.has(a.category))groups.set(a.category,[]);groups.get(a.category).push(a);}
 const row=a=>'<a class="intent-row" href="/agents/'+esc(a.slug)+'"><span><strong>'+esc(a.name)+'</strong><small>'+esc(a.summary)+'</small></span><span aria-hidden="true">↗</span></a>';
 const body='<section class="categoryhero intent-hero"><div class="eyebrow">READY-TO-USE AI</div><h1>Discover useful AI agents for everyday tasks</h1><p>Choose a task, copy the instructions, and use your favorite AI chat. No coding required.</p></section>'+[...groups].map(([category,items])=>'<section class="related-section"><h2>'+esc(category)+'</h2><div class="intent-list">'+items.map(row).join('')+'</div></section>').join('')+'<details class="quiet-details"><summary>How we selected these assistants</summary><p>We review public featured categories and task usage signals from AI marketplaces. This collection is editorial, not a traffic ranking. Free instructions do not mean the external model has unlimited free usage.</p><p><a href="/competitor-research">View methodology and sources →</a></p></details>';
 page('/popular-ai-agents','Free AI Agents for Writing, Work, Creativity & Learning | AIBin','Discover practical, free reusable AI instructions for SEO writing, research, coding, email organization, image prompts, video and learning. Use ChatGPT, Claude or Gemini.',body);
 const sources=demand.competitors.map(c=>'<section class="detailsection"><h2>'+esc(c.name)+'</h2><p>'+esc(c.signal)+' <a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">Public source ↗</a></p><div class="intent-list">'+c.tasks.map(t=>'<a class="intent-row" href="'+esc(t.path)+'"><span>'+esc(t.intent)+'</span><span aria-hidden="true">↗</span></a>').join('')+'</div></section>').join('');
 page('/competitor-research','How AIBin Selects Useful AI Agent Templates | AIBin','Transparent methodology and sources for AIBin’s competitor-informed agent catalog. Public popularity signals are not verified visitor data.','<article class="simple-page"><h1>How we select useful AI assistants</h1><p>'+esc(demand.method)+'</p><p>Reviewed '+esc(demand.asOf)+'.</p>'+sources+'<h2>Additional sources</h2><ul>'+demand.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.note)+'</a></li>').join('')+'</ul></article>');
 fs.writeFileSync(out+'/competitor-demand.json',JSON.stringify({...demand,competitors:demand.competitors.map(c=>({...c,tasks:c.tasks.map(t=>({...t,url:base+t.path}))}))},null,2));
}
