// These are AIBin editorial collections, not independent contributor accounts.
export const editorialProfiles=Object.freeze({
 Business:'@bizdesk',Career:'@careerkit',Coding:'@codebench',Creative:'@creativecorner','Daily life':'@daycraft',
 Food:'@kitchendesk',Home:'@homecraft',Learning:'@learnlab',Local:'@localguide',Marketing:'@marketstudio',
 Money:'@moneydesk',News:'@newsdesk',Productivity:'@focusdesk',Research:'@researchlab',Shopping:'@shopscout',
 Travel:'@tripdesk',Work:'@workbench',Writing:'@wordstudio'
});
export function editorialHandle(category){return Object.hasOwn(editorialProfiles,category)?editorialProfiles[category]:'@everydaydesk';}
export function editorialCredit(category,esc,detail=false){
 const tag=detail?'p':'span';
 return '<'+tag+' class="agent-creator editorial-credit'+(detail?' detail-creator':'')+'" title="AIBin editorial collection, not an independent contributor">'+esc(editorialHandle(category))+' <span class="editorial-label">· AIBin editorial</span></'+tag+'>';
}
export function normalizeUsername(value){
 const name=String(value??'').trim().replace(/^@/,'');
 if(!/^[A-Za-z0-9][A-Za-z0-9_.-]{1,49}$/.test(name))throw Error('Choose a username with 2–50 letters, numbers, dots, dashes or underscores.');
 if(name.toLowerCase()==='aibin'||name.toLowerCase().startsWith('aibin.')||Object.values(editorialProfiles).concat('@everydaydesk').includes('@'+name.toLowerCase()))throw Error('That username is reserved for AIBin. Choose another username.');
 return name;
}
