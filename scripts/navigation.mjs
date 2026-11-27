// Five top-level destinations; saved, creation and recurring workflows belong to Agents.
export const primaryNav=[
 {label:'Explore',href:'/#agents',matches:p=>p==='/'||p==='/ai-agent-directory'||p==='/popular-ai-agents'||p==='/top-ai-agents'},
 {label:'Agents',href:'/open-source',matches:p=>['/open-source','/automations','/make-agent','/my-agents','/shared-agent'].includes(p)||/^\/(?:agents|categories|automations)\//.test(p)||/^\/ai-agents-for-(?:chatgpt|claude|gemini)$/.test(p)},
 {label:'Teams',href:'/agent-teams',matches:p=>p==='/agent-teams'||p.startsWith('/agent-teams/')},
 {label:'Prompts',href:'/agent-packs',matches:p=>p==='/agent-packs'},
 {label:'Tools',href:'/tools',matches:p=>p==='/tools'||p.startsWith('/tools/')||p==='/live-agents'||p.startsWith('/live-agents/')||p==='/agent-runner'}
];
export function primaryNavigation(url,esc){
 return '<nav class="market-nav" aria-label="Main navigation">'+primaryNav.map(({label,href,matches})=>'<a href="'+esc(href)+'"'+(matches(url)?' aria-current="'+(url===href?'page':'location')+'"':'')+'>'+esc(label)+'</a>').join('')+'</nav>';
}
export function agentSectionLinks(){
 return '<div class="agent-section-links" role="group" aria-label="More agent options"><a href="/make-agent">Create an agent</a><a href="/automations">Automations</a><a href="/my-agents">My Agents</a></div>';
}
