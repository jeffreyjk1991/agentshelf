// Shared collection design. Decorative animation is local CSS; no live execution is implied.
const glyphs={
 task:'<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/>',
 plan:'<rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="14" width="6" height="6" rx="1.2"/><path d="M10 7h7v7M7 10v7h7"/>',
 work:'<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',
 review:'<path d="M12 3 20 6v6c0 4-3 7-8 9-5-2-8-5-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
 output:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 3 3 5-6"/>',
 prompts:'<rect x="5" y="3" width="13" height="16" rx="2"/><path d="M9 7h5M9 11h5M9 15h3M8 22h11a2 2 0 0 0 2-2V7"/>',
 adjust:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="18" r="2" fill="currentColor"/>',
 chat:'<path d="M6 4h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-5l-5 4v-4H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/><path d="M7 9h10M7 13h6"/>',
 research:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M8 11l2-2 3 2"/>',
 code:'<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/>',
 support:'<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 12h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 18c0 2-2 3-5 3h-1"/>',
 everyday:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16m-12 5 2 2 5-5"/>',
 career:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13h18M10 13v2h4v-2"/>',
 creator:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="12" cy="12" r="4"/><path d="M16 8h2"/>'
};
export function collectionIcon(key){
 return '<svg class="collection-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+glyphs[key]+'</svg>';
}
export const teamStages=[['plan','Plan'],['work','Work'],['review','Review'],['output','Deliver']];
export const promptStages=[['prompts','Choose'],['adjust','Customize'],['chat','Use']];
// Concrete examples of the products' real workflows. These illustrations
// never run an AI model or claim a task has actually completed.
export const workflowExamples={
 agent:{task:'Plan a weekend getaway',steps:['Weekend Getaway Finder','2 days · $300','Open your AI chat'],result:'Personalized trip-planning instructions'},
 prompt:{task:'Prepare for a job interview',steps:['Job search pack','Your role + experience','Paste into chat'],result:'Interview-practice prompt'},
 tool:{task:'Split a dinner bill four ways',steps:['Bill Split & Tip','$80 + $5 tax · 20% tip','$101 total ÷ 4'],result:'$25.25 per person'},
 team:{task:'Compare two project tools',steps:['Set criteria','Compare evidence','Check claims','Write brief'],result:'Reviewed comparison report'},
 'research-team':{task:'Compare two project tools',steps:['Set criteria','Compare evidence','Check claims','Write brief'],result:'Decision-ready research brief'},
 'software-team':{task:'Build an expense tracker',steps:['Requirements','Implementation','Security & tests','Release checklist'],result:'Reviewed implementation plan'},
 'customer-support-team':{task:'Respond to a late delivery',steps:['Identify issue','Check policy','Draft reply','Human review'],result:'Reviewed reply draft'}
};
export function workflowVisual({esc,kind='team',stages=kind==='team'?teamStages:promptStages,input=kind==='team'?'Your task':'Your chosen prompt',output=kind==='team'?'Reviewed result':'Ready for your AI chat',exampleKey=kind}){
 const example=workflowExamples[exampleKey];if(!example||example.steps.length!==stages.length)throw Error('Unknown illustration '+exampleKey);
 const count=stages.length===4?'four':'three';
 const summary=input+': '+example.task+' → '+stages.map((s,i)=>s[1]+': '+example.steps[i]).join(' → ')+' → '+output+': '+example.result;
 return '<figure class="collection-flow flow-'+count+' demo-'+esc(kind)+' is-playing" aria-label="'+esc(summary)+'"><div class="flow-top"><span class="flow-title"><i aria-hidden="true"></i> HOW IT WORKS</span><div class="flow-meta"><span>Example only</span><button type="button" class="flow-replay" aria-label="Replay workflow illustration" hidden><span aria-hidden="true">↻</span> Replay</button></div></div><div class="flow-input">'+collectionIcon('task')+'<span><small>EXAMPLE TASK</small><strong>'+esc(example.task)+'</strong></span></div><div class="flow-track" aria-hidden="true"><span></span></div><ol class="flow-steps">'+stages.map(([icon,label],i)=>'<li class="flow-step flow-step-'+(i+1)+'"><div class="flow-node"><div class="flow-node-top"><span class="flow-step-number" aria-hidden="true">'+(i+1)+'</span>'+collectionIcon(icon)+'</div><strong class="flow-label">'+esc(label)+'</strong><span class="flow-example">'+esc(example.steps[i])+'</span></div></li>').join('')+'</ol><figcaption class="flow-output">'+collectionIcon('output')+'<span><small>'+esc(output)+'</small><strong>'+esc(example.result)+'</strong></span></figcaption></figure>';
}
export function collectionHero({esc,kicker,title,lead,description,kind,stages,input,output,exampleKey,detail=false}){
 return '<section class="'+(detail?'toolhead ':'')+'collection-hero"><div class="collection-copy"><div class="collection-kicker"><span class="collection-dot" aria-hidden="true"></span>'+esc(kicker)+'</div><h1>'+esc(title)+'</h1><p class="collection-lead">'+esc(lead)+'</p><p class="collection-description">'+esc(description)+'</p></div>'+workflowVisual({esc,kind,stages,input,output,exampleKey})+'</section>';
}

// Shared visual language for the two individual-helper libraries.
export function agentLibraryHero(esc,count){
 return collectionHero({esc,kicker:'READY-MADE AI ASSISTANTS',title:'Ready-made AI agents',lead:'Find the right assistant for your task.',description:count+' free assistants. Choose one, customize its instructions and use it in your AI chat.',kind:'agent',stages:[['research','Find'],['adjust','Customize'],['chat','Use']],input:'Your task',output:'Ready for your AI chat'});
}
export function toolLibraryHero(esc,tools,live){
 return collectionHero({esc,kicker:'USE HERE · NO CODING',title:'AI tools & everyday helpers',lead:'Pick a tool. Get a useful result.',description:tools+' browser tools and '+live+' public-data workflows. Use them right here, without another AI chat.',kind:'tool',stages:[['research','Choose'],['adjust','Enter details'],['work','Run']],input:'Your question or task',output:'Result in your browser'});
}
// The robot echoes the AIBin mark without changing the real logo or the heading.
export function homeRobot(){
 return '<span class="home-robot" aria-hidden="true"><svg class="home-robot-art" viewBox="0 0 100 100" fill="none" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle cx="47" cy="51" r="42" fill="#e1eee5" stroke="#bfd7c5" stroke-width="1.2"/><ellipse class="robot-orbit" cx="47" cy="51" rx="45" ry="30" transform="rotate(-23 47 51)" stroke="#8bbba1" stroke-width="1.2" stroke-dasharray="3 5"/><ellipse class="robot-shadow" cx="47" cy="84" rx="23" ry="4" fill="#a9c9b5" opacity=".5"/><g class="robot-body"><path d="M47 13v11" stroke="#146a48" stroke-width="4" stroke-linecap="round"/><circle class="robot-antenna" cx="47" cy="11" r="4" fill="#ed774c"/><path d="M15 36v13m64-13v13" stroke="#146a48" stroke-width="5" stroke-linecap="round"/><rect x="20" y="23" width="54" height="46" rx="17" fill="#fffefa" stroke="#146a48" stroke-width="3"/><rect x="27" y="31" width="40" height="25" rx="10" fill="#146a48"/><g class="robot-eyes" fill="#d5fbe8"><circle cx="39" cy="43" r="4"/><circle cx="55" cy="43" r="4"/></g><path d="M42 62q5 3 10 0" stroke="#146a48" stroke-width="2.5" stroke-linecap="round"/><rect x="35" y="68" width="24" height="13" rx="6" fill="#167051"/><path d="M43 74h8" stroke="#d5fbe8" stroke-width="2" stroke-linecap="round"/><g class="robot-wave"><path d="M73 65q12 0 15-12" stroke="#146a48" stroke-width="5" stroke-linecap="round"/><circle cx="88" cy="49" r="5" fill="#d5fbe8" stroke="#146a48" stroke-width="2.4"/></g></g><g class="robot-spark" stroke="#ed774c" stroke-width="2.6" stroke-linecap="round"><path d="M83 14v12m-6-6h12M11 66v8m-4-4h8"/></g></svg></span>';
}
