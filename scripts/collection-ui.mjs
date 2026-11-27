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
export function workflowVisual({esc,kind='team',stages=kind==='team'?teamStages:promptStages,input=kind==='team'?'Your task':'Your chosen prompt',output=kind==='team'?'Reviewed result':'Ready for your AI chat'}){
 const count=stages.length===4?'four':'three';
 return '<figure class="collection-flow flow-'+count+'" aria-label="'+esc(input+' → '+stages.map(s=>s[1]).join(' → ')+' → '+output)+'"><div class="flow-top"><span><i aria-hidden="true"></i> HOW IT WORKS</span><span>Illustration</span></div><div class="flow-input">'+collectionIcon('task')+'<span>'+esc(input)+'</span></div><ol class="flow-steps">'+stages.map(([icon,label],i)=>'<li class="flow-step flow-step-'+(i+1)+'"><span class="flow-node">'+collectionIcon(icon)+'</span><span class="flow-label">'+esc(label)+'</span></li>').join('')+'</ol><figcaption class="flow-output">'+collectionIcon('output')+'<span>'+esc(output)+'</span></figcaption></figure>';
}
export function collectionHero({esc,kicker,title,lead,description,kind,stages,input,output,detail=false}){
 return '<section class="'+(detail?'toolhead ':'')+'collection-hero"><div class="collection-copy"><div class="collection-kicker"><span class="collection-dot" aria-hidden="true"></span>'+esc(kicker)+'</div><h1>'+esc(title)+'</h1><p class="collection-lead">'+esc(lead)+'</p><p class="collection-description">'+esc(description)+'</p></div>'+workflowVisual({esc,kind,stages,input,output})+'</section>';
}
