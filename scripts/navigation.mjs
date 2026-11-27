// Primary destinations, separate from the topic filters in the marketplace.
export const primaryNav=[
 {label:'Explore',href:'/#agents',matches:p=>p==='/'||p==='/ai-agent-directory'||p==='/popular-ai-agents'||p==='/top-ai-agents'},
 {label:'AI Agents',href:'/open-source',matches:p=>p==='/open-source'||/^\/(?:agents|categories)\//.test(p)||/^\/ai-agents-for-(?:chatgpt|claude|gemini)$/.test(p)},
 {label:'Agent Teams',href:'/agent-teams',matches:p=>p==='/agent-teams'||p.startsWith('/agent-teams/')},
 {label:'Prompt Packs',href:'/agent-packs',matches:p=>p==='/agent-packs'},
 {label:'Automations',href:'/automations',matches:p=>p==='/automations'||p.startsWith('/automations/')},
 {label:'AI Tools',href:'/tools',matches:p=>p==='/tools'||p.startsWith('/tools/')||p==='/live-agents'||p.startsWith('/live-agents/')||p==='/agent-runner'},
 {label:'Create',href:'/make-agent',matches:p=>p==='/make-agent'},
 {label:'My Agents',href:'/my-agents',matches:p=>p==='/my-agents'||p==='/shared-agent'}
];
export function primaryNavigation(url,esc){
 return '<nav class="market-nav" aria-label="Main navigation">'+primaryNav.map(({label,href,matches})=>'<a href="'+esc(href)+'"'+(matches(url)?' aria-current="'+(url===href?'page':'location')+'"':'')+'>'+esc(label)+'</a>').join('')+'</nav>';
}
