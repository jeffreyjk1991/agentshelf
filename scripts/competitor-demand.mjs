import fs from 'node:fs';
const demand=JSON.parse(fs.readFileSync('research/competitor-demand.json','utf8'));
export const prioritySlugs=[...new Set(demand.competitors.flatMap(c=>c.tasks.map(t=>t.slug)))];
export function extraAgentContent(slug,esc,assistants){
 const t=searchDemand.find(x=>x.slug===slug);const appendix=t?'<section class="related-section"><h2>What this assistant can do</h2><p>'+esc(t.limit)+'</p><p><a href="/top-ai-agents">Explore 25 high-demand AI tasks →</a></p></section>':'';
 const d=demand.details[slug];if(!d)return appendix;
 const a=assistants.find(x=>x.slug===slug);if(!a)throw Error('Missing demand assistant '+slug);
 return '<section class="simple-page intent-example" aria-label="Practical example"><h2>How to use '+esc(a.name)+'</h2><p>Copy the free instructions above into your chosen AI chat, provide the details it asks for and review its response.</p><h3>Example request</h3><p>'+esc(d.example)+'</p><h3>What you can expect</h3><p>'+esc(d.output)+'</p><h3>What to check</h3><p>'+esc(d.limit)+'</p><p><a href="/popular-ai-agents">Explore more useful AI assistants →</a></p></section>'+appendix;
}
export function addDemandPages({page,esc,base,out,assistants}){
 addSearchDemandPage({page,esc,base,out,assistants});
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

// Each entry is one distinct high-demand task from a published keyword dataset, not a ranking of AIBin traffic.
const sourceData=[
  [
    "ai detector",
    11100000,
    "ai-writing-evidence-review",
    "AI Detector Limitations & Writing Evidence Review",
    "Review source evidence; no reliable AI authorship score."
  ],
  [
    "ai chatbot",
    6120000,
    "personal-ai-assistant",
    "AI Chatbot & Personal Assistant Instructions",
    "Set up a reusable general assistant in your own AI chat."
  ],
  [
    "ai image generator",
    2240000,
    "image-prompt-builder",
    "AI Image Generator Assistant & Prompts",
    "Generate images only when the external chat supports image generation."
  ],
  [
    "ai photo editor",
    2240000,
    "photo-edit-brief",
    "AI Photo Editor Assistant & Editing Prompts",
    "Use supported image editing or follow detailed edit directions."
  ],
  [
    "ai humanizer",
    1830000,
    "paragraph-rewriter",
    "AI Humanizer for Natural, Clear Writing",
    "Improve original writing; no detector evasion or authorship concealment."
  ],
  [
    "ai video generator",
    1500000,
    "short-video-prompt",
    "AI Video Generator Prompts for Reels & Shorts",
    "Get timed scenes and generation prompts; AIBin does not render video."
  ],
  [
    "ai face swap",
    823000,
    "consensual-face-swap-guide",
    "AI Face Swap Guide for Consensual Creative Composites",
    "Only consent-based, disclosed creative edits; no impersonation."
  ],
  [
    "ai voice generator",
    368000,
    "voiceover-script",
    "AI Voice Generator Guide & Voiceover Scripts",
    "Prepare narration for compatible speech tools; no unauthorized cloning."
  ],
  [
    "ai music generator",
    301000,
    "music-idea-prompt",
    "AI Music Generator Prompts & Original Song Ideas",
    "Compose original music directions and lyrics for compatible tools."
  ],
  [
    "ai photo enhancer",
    201000,
    "photo-enhancer",
    "AI Photo Enhancer & Restoration Assistant",
    "Restore carefully; verify details and output size."
  ],
  [
    "ai story generator",
    201000,
    "story-outline-writer",
    "AI Story Generator & Outline Assistant",
    "Draft an original story from a premise."
  ],
  [
    "ai video editor",
    201000,
    "video-editing-assistant",
    "AI Video Editor Assistant & Cut List",
    "Create edit decisions and captions; actual editing requires compatible tools."
  ],
  [
    "ai code",
    165000,
    "coding-assistant",
    "AI Coding Assistant & Code Generator",
    "Write, explain and test code; review before running."
  ],
  [
    "ai logo generator",
    165000,
    "logo-brief-builder",
    "AI Logo Generator Assistant & Logo Design Prompts",
    "Create original directions or a supported image; verify branding rights."
  ],
  [
    "ai hairstyle",
    135000,
    "hairstyle-try-on",
    "AI Hairstyle Try-On & Haircut Preview Assistant",
    "Preview hairstyle ideas with supported image editing."
  ],
  [
    "ai clothes changer",
    110000,
    "virtual-outfit-try-on",
    "AI Clothes Changer & Virtual Outfit Try-On Assistant",
    "Preview ordinary outfits without changing identity or body shape."
  ],
  [
    "ai translator",
    110000,
    "translation-assistant",
    "AI Translator & Translation Assistant",
    "Translate text and explain idioms; verify high-stakes translations."
  ],
  [
    "ai website builder",
    110000,
    "website-builder-brief",
    "AI Website Builder Prompt & No-Code Site Planner",
    "Prepare a practical site specification for a compatible builder."
  ],
  [
    "ai background remover",
    90500,
    "background-removal-assistant",
    "AI Background Remover Assistant",
    "Remove backgrounds when the external editor supports it."
  ],
  [
    "ai presentation maker",
    90500,
    "slide-outline-builder",
    "AI Presentation Maker Assistant & Slide Prompts",
    "Create slide content or an editable deck when file tools support it."
  ],
  [
    "ai email writer",
    74000,
    "email-draft-assistant",
    "AI Email Writer & Draft Assistant",
    "Write an editable draft; nothing is sent automatically."
  ],
  [
    "ai fitness",
    74000,
    "workout-planner",
    "AI Fitness & Workout Planner",
    "Plan an adaptable routine; not medical advice."
  ],
  [
    "ai prompt generator",
    74000,
    "prompt-generator",
    "AI Prompt Generator & Optimizer",
    "Turn a task into useful reusable instructions."
  ],
  [
    "ai receptionist",
    74000,
    "receptionist-script",
    "AI Receptionist Script & Call Workflow Builder",
    "Draft scripts and handoff rules; not a live phone service."
  ],
  [
    "ai teaching",
    74000,
    "homework-coach",
    "AI Teaching & Homework Tutor Assistant",
    "Teach concepts step by step without doing assessed work dishonestly."
  ]
];
export const searchDemand=sourceData.map(([keyword,monthlySearches,slug,title,limit],i)=>({rank:i+1,keyword,monthlySearches,slug,title,limit,path:'/agents/'+slug}));
export function searchDemandTitle(slug,fallback){const x=searchDemand.find(t=>t.slug===slug);return x?x.title+' | AIBin':fallback;}
function addSearchDemandPage({page,esc,base,out,assistants}){
 const source='https://buildershq.net/keywords',crosscheck='https://trendsaas.org/ai-saas-trends',usage='https://openai.com/index/how-people-are-using-chatgpt/';
 const method='Selected 25 distinct task intents from 176 tracked AI-product keywords in published Google Ads Keyword Planner estimates (worldwide, Oct 2025–Sep 2026). Similar queries are grouped; broad marketplace, app and technology terms are omitted. Sorted by representative head-keyword monthly volume, with ties kept in source order. These are estimates of searches, not verified agent usage, AIBin traffic, or a comprehensive worldwide ranking.';
 const agents=new Map(assistants.map(a=>[a.slug,a]));
 for(const t of searchDemand)if(!agents.has(t.slug))throw Error('Unmapped search intent '+t.slug);
 const rows=searchDemand.map(t=>{const a=agents.get(t.slug);return '<a class="intent-row" href="'+esc(t.path)+'"><span><strong>'+esc(t.rank+'. '+a.name)+'</strong><small>'+esc(t.limit)+'</small></span><span aria-hidden="true">↗</span></a>';}).join('');
 page('/top-ai-agents','Top 25 AI Tasks by Search Demand (2026) — Free AI Agent Instructions | AIBin','Explore 25 high-demand AI tasks, from image creation and photo editing to writing, video, presentations and coding. Ready-made instructions for compatible AI chats.','<article class="simple-page"><a class="back-link" href="/">← Explore</a><h1>25 AI tasks people search for</h1><p class="page-lead">Find the right helper. Choose a task and use it in your preferred AI chat.</p><div class="intent-list">'+rows+'</div><details class="quiet-details"><summary>Research, methodology & search estimates</summary><p>'+esc(method)+'</p><p><a href="'+source+'" rel="noopener noreferrer">Worldwide keyword data</a> · <a href="'+crosscheck+'" rel="noopener noreferrer">US search-trend cross-check</a> · <a href="'+usage+'" rel="noopener noreferrer">Consumer AI usage study</a></p><p>Free instructions; external AI features, file tools and provider limits vary. We do not host general-purpose image, video or audio generation.</p><a href="/top-ai-agents.json">Download the research data →</a></details></article>');
 fs.writeFileSync(out+'/top-ai-agents.json',JSON.stringify({name:'AIBin search-demand task collection',asOf:'2026-11-26',period:'October 2025 through September 2026',geography:'Worldwide',method,sources:[source,crosscheck,usage],count:searchDemand.length,agents:searchDemand.map(t=>({...t,url:base+t.path,name:agents.get(t.slug).name,category:agents.get(t.slug).category}))},null,2));
}
