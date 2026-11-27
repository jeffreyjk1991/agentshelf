import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {teams} from '../scripts/agent-teams.mjs';import {workflowVisual,workflowExamples} from '../scripts/collection-ui.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8');
test('team and prompt pages share one accessible local workflow illustration and collection design',()=>{
 for(const [path,steps] of [['agent-teams.html',4],['agent-packs.html',3],['open-source.html',3],['tools.html',3],...teams.map(t=>['agent-teams/'+t.slug+'.html',4])]){
  const html=read(path);assert.ok(html.includes('collection-page'));assert.equal((html.match(/<figure class="collection-flow/g)||[]).length,1,path);assert.equal((html.match(/class="flow-step flow-step-/g)||[]).length,steps,path);
  assert.ok(html.includes('Example only:'));assert.ok(html.includes('aria-label="Replay workflow illustration"'));assert.ok(html.includes('class="flow-input"'));assert.equal((html.match(/class="flow-example"/g)||[]).length,steps,path);assert.ok(html.includes('<figcaption class="flow-output">'));assert.ok(html.includes('aria-label="Your'));
 }
 const hub=read('agent-teams.html'),packs=read('agent-packs.html');
 assert.equal((hub.match(/class="intent-row collection-card team-collection-card"/g)||[]).length,3);assert.equal((packs.match(/class="collection-card pack-collection-card"/g)||[]).length,4);assert.equal((packs.match(/<details class="quiet-details pack-contents">/g)||[]).length,4);
 assert.ok(!read('index.html').includes('<figure class="collection-flow'));
 const css=read('assets/experience.css');assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));assert.ok(css.includes('animation:collection-stage .85s ease-in-out 1 both'));assert.ok(css.includes('animation:collection-result .55s ease-out 3.65s 1 both'));assert.ok(css.includes('animation:collection-sweep 4.15s linear 1 both'));assert.ok(!css.match(/animation:collection-[^;]*infinite/));
});

test('home robot is decorative and stays within the original hero; library actions and search stay intact',()=>{
 const home=read('index.html'),agents=read('open-source.html'),tools=read('tools.html'),css=read('assets/experience.css');
 assert.ok(home.includes('<h1>Put AI to work.<br><span>For everyday life.</span></h1>'));
 assert.equal((home.match(/class="home-robot"/g)||[]).length,1);
 assert.match(home,/<div class="home-headline"><div class="hero-kicker">[\s\S]*?<\/h1><span class="home-robot" aria-hidden="true">[\s\S]*?<\/svg><\/span><\/div>/);
 assert.match(css,/\.home-robot\{position:absolute;/);
 assert.ok(css.includes('pointer-events:none'));assert.ok(css.includes('animation:home-robot-greet 2.15s ease-in-out 2'));assert.ok(css.includes('padding-right:calc(var(--robot-size) + 8px);text-indent:0'));assert.ok(css.includes('h1>span{display:block;width:calc(100% + var(--robot-size) + 8px)'));assert.ok(css.includes('animation:home-robot-wave 1.2s ease-in-out .2s 3'));
 assert.ok(!css.match(/animation:home-robot-[^;]*infinite/));
 assert.equal((agents.match(/ data-agent /g)||[]).length,142);assert.equal((tools.match(/ data-agent /g)||[]).length,46);
 assert.ok(agents.includes('class="agent-section-links"'));assert.ok(agents.includes('aria-label="Search AI assistants"'));assert.ok(tools.includes('aria-label="Search online tools"'));
 assert.ok(agents.includes('Ready for your AI chat'));assert.ok(tools.includes('Result in your browser'));
 assert.equal((home.match(/ data-agent /g)||[]).length,213);
});

test('each collection illustrates a different relevant task and preserves the real execution boundary',()=>{
 const examples=[['open-source.html','agent'],['agent-packs.html','prompt'],['tools.html','tool'],['agent-teams.html','team'],...teams.map(t=>['agent-teams/'+t.slug+'.html',t.slug])];
 for(const [path,key] of examples){const html=read(path),example=workflowExamples[key];for(const value of [example.task,example.result,...example.steps])assert.ok(html.includes(value.replaceAll('&','&amp;')),path+' missing '+value);}
 assert.equal(new Set(['agent','prompt','tool','team'].map(key=>workflowExamples[key].task)).size,4);
 const values={subtotal:80,tax:5,tip:20,people:4};assert.equal(workflowExamples.tool.result,'$'+((values.subtotal+values.tax+values.subtotal*values.tip/100)/values.people).toFixed(2)+' per person');
 assert.ok(read('agent-teams/software-team.html').includes('Example only'));
 assert.ok(read('assets/experience.mjs').includes("flow.classList.remove('is-playing')"));
});
