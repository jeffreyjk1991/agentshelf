import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {teams} from '../scripts/agent-teams.mjs';import {workflowVisual} from '../scripts/collection-ui.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8');
test('team and prompt pages share one accessible local workflow illustration and collection design',()=>{
 for(const [path,steps] of [['agent-teams.html',4],['agent-packs.html',3],...teams.map(t=>['agent-teams/'+t.slug+'.html',4])]){
  const html=read(path);assert.ok(html.includes('collection-page'));assert.equal((html.match(/<figure class="collection-flow/g)||[]).length,1,path);assert.equal((html.match(/class="flow-step flow-step-/g)||[]).length,steps,path);
  assert.ok(html.includes('HOW IT WORKS'));assert.ok(html.includes('Illustration'));assert.ok(html.includes('<figcaption class="flow-output">'));assert.ok(html.includes('aria-label="Your'));
 }
 const hub=read('agent-teams.html'),packs=read('agent-packs.html');
 assert.equal((hub.match(/class="intent-row collection-card team-collection-card"/g)||[]).length,3);assert.equal((packs.match(/class="collection-card pack-collection-card"/g)||[]).length,4);assert.equal((packs.match(/<details class="quiet-details pack-contents">/g)||[]).length,4);
 assert.ok(!read('index.html').includes('<figure class="collection-flow'));
 const css=read('assets/experience.css');assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));assert.ok(css.includes('animation:collection-stage .78s ease-out 1 both'));assert.ok(css.includes('animation:collection-result .65s ease-out 3.55s 1 both'));assert.ok(!css.match(/animation:collection-[^;]*infinite/));
});
