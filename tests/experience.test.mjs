import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {buildVibeAgent,recurringIntent,chooseTemplate,groupCreators,publicAgentPath} from '../assets/experience-core.mjs';
const read=p=>fs.readFileSync('dist/'+p,'utf8');
const templates=JSON.parse(read('agent-experience.json')).templates;
const home=read('index.html'),builder=read('make-agent.html');
test('task-first builder creates tailored instructions locally with a supported provider',()=>{
 assert.equal(templates.length,167);
 const request='Find job openings for a data analyst every morning';
 const x=buildVibeAgent({goal:request,templates});
 assert.equal(x.frequency,'daily');assert.equal(x.template.path,'/automations/job-opening-scout');
 assert.ok(['chatgpt','gemini'].includes(x.provider));assert.ok(x.prompt.includes(request));assert.match(x.prompt,/only if this chat supports scheduling/);
 const y=buildVibeAgent({goal:'Write a caption for my photo',provider:'claude',frequency:'once',templates});
 assert.equal(y.provider,'claude');assert.equal(y.frequency,'once');assert.ok(y.prompt.includes('Write a caption for my photo'));
 const z=buildVibeAgent({goal:'Plan a quantum spacecraft',frequency:'once',templates:[]});assert.equal(z.template,null);
 assert.throws(()=>buildVibeAgent({goal:'hi'}));assert.throws(()=>buildVibeAgent({goal:'Find a job',provider:'bad'}));
 assert.equal(recurringIntent('every month review bills'),'monthly');assert.equal(recurringIntent('weekly groceries'),'weekly');assert.equal(recurringIntent('write a caption'),'once');assert.equal(recurringIntent('check prices every Tuesday'),'weekly');assert.equal(recurringIntent('Check flight prices once, do not monitor'),'once');assert.match(buildVibeAgent({goal:'Check prices every day',frequency:'once',templates}).prompt,/Do not schedule it/);assert.equal(chooseTemplate('every morning',templates,'daily'),null);
 assert.equal(chooseTemplate('every morning',templates,'daily'),null);
 assert.equal(buildVibeAgent({goal:'Find jobs',frequency:'daily',provider:'claude',templates}).provider,'chatgpt');
});
test('homepage and builder expose the personalized flow without removing any catalog cards',()=>{
 for(const h of [home,builder])for(const marker of ['class="vibe-form" method="post"','name="goal"','name="frequency"','name="provider"','class="vibe-result" hidden','class="vibe-prompt assistant-prompt"','vibe-copy','vibe-save','vibe-download','/assets/experience.mjs'])assert.ok(h.includes(marker),marker);
 assert.equal((home.match(/ data-agent /g)||[]).length,213);
 for(const slug of ['flight-price-watcher','job-opening-scout','grocery-deal-scout','daily-news-brief','product-deal-watcher','bill-reminder'])assert.ok(home.includes('href="/automations/'+slug+'"'));
 assert.ok(home.includes('href="/automations"'));assert.ok(!home.includes('class="recurring-strip"'));assert.ok(!home.includes('class="intent-shortcuts"'));assert.ok(!home.includes('class="home-actions"'));assert.ok(home.includes('id="category-summary"'));assert.ok(home.includes('Your chosen AI chat runs the task.'));
});
test('build checks and original worked examples are visible with honest scope',()=>{
 const routes=['agents/professional-headshot-maker','agents/passport-photo-maker','agents/social-caption-writer','agents/video-editing-assistant','automations/flight-price-watcher','automations/job-opening-scout','agents/family-vacation-planner'];
 for(const route of routes){const h=read(route+'.html');assert.ok(h.includes('Build-checked'));assert.ok(h.includes('See an example result'));assert.ok(h.includes('Editorial sample, not a live response'));assert.ok(h.includes('href="/agent-checks"'));}
 assert.ok(read('tools/bill-split.html').includes('Browser tool'));
 assert.ok(read('live-agents/live-topic-research.html').includes('Live public-data workflow'));
 assert.ok(read('agent-checks.html').includes('do not prove every AI chat'));
});
test('PWA icons and manifest, restricted service worker and mobile saved history',()=>{
 const m=JSON.parse(read('manifest.webmanifest'));assert.equal(m.display,'standalone');assert.equal(m.start_url,'/');assert.equal(m.scope,'/');
 for(const item of m.icons){const b=fs.readFileSync('dist'+item.src);assert.equal(b.readUInt32BE(16),Number(item.sizes.split('x')[0]));assert.equal(b.readUInt32BE(20),Number(item.sizes.split('x')[1]));}
 const social=fs.readFileSync('dist/assets/social-card.png');assert.equal(social.readUInt32BE(16),1200);assert.equal(social.readUInt32BE(20),630);
 for(const h of [home,builder,read('my-agents.html')])assert.ok(h.includes('href="/manifest.webmanifest"'));
 const sw=read('sw.js');assert.match(sw,/aibin-public-[a-f0-9]{12}/);assert.ok(sw.includes("req.method!=='GET'"));assert.ok(sw.includes("u.pathname.startsWith('/api/')"));assert.ok(sw.includes("u.pathname==='/shared-agent'"));assert.ok(sw.includes('u.search'));
 assert.ok(read('offline.html').includes('noindex,nofollow'));assert.ok(read('my-agents.html').includes('id="install-aibin"'));assert.ok(read('my-agents.html').includes('id="recent-list"'));
});
test('sharing and creator collections use safe public paths and real recorded totals',()=>{
 for(const p of ['/agents/resume-builder','/automations/flight-price-watcher','/community#agent-23','/creators#sample-maker'])assert.ok(publicAgentPath(p));
 for(const p of ['https://evil.example','/shared-agent#private','/agents/resume-builder?private=1','/agents/../x','//evil.example','/api/submissions'])assert.ok(!publicAgentPath(p));
 const creators=groupCreators([{creator:'Maker',name:'One',usage_count:2},{creator:'maker',name:'Two',usage_count:3},{creator:'Other',name:'Three',usage_count:0},{creator:'<bad>',usage_count:99}]);
 assert.equal(creators.length,2);assert.equal(creators[0].opens,5);assert.equal(creators[0].agents.length,2);assert.equal(creators[1].opens,0);
 const c=read('creators.html');assert.ok(c.includes('Only approved entries appear here'));assert.ok(c.includes('not unique users or completed tasks'));
 const js=read('assets/experience.mjs');assert.ok(js.includes("canvas.toBlob"));assert.ok(js.includes("'aibin-agent-card.png'"));assert.ok(js.includes('navigator.share'));assert.ok(js.includes('https://www.aibin.me'));
});
test('SEO preserves canonicals and adds crawlable feature pages and social metadata',()=>{
 for(const url of ['make-agent','agent-checks','creators']){assert.ok(fs.existsSync('dist/'+url+'.html'));assert.ok(read('llms.txt').includes('/'+url));if(home.includes('content="index,follow"')){assert.ok(read('sitemap.xml').includes('/'+url+'</loc>'));assert.ok(read(url+'.html').includes('content="index,follow"'));}}
 assert.ok(home.includes('content="summary_large_image"'));if(home.includes('content="index,follow"'))assert.ok(home.includes('property="og:image"'));
 assert.ok(builder.includes('"@type":"WebApplication"'));assert.ok(builder.includes('AIBin Vibe Agent Builder'));
 for(const name of ['experience-core.mjs','experience.mjs','offline.mjs','my-agents.mjs','submit-agent.mjs']){const p=spawnSync(process.execPath,['--check','dist/assets/'+name],{encoding:'utf8'});assert.equal(p.status,0,p.stderr);}
 assert.ok(read('assets/my-agents.mjs').includes("event(last?'return_visit':'first_visit',slug||'site')"));assert.ok(read('assets/experience.mjs').includes('if(request!==revision)return'));assert.ok(read('assets/experience.mjs').includes('catalogPromise=null'));assert.ok(read('assets/experience.mjs').includes('shareFile&&navigator.canShare'));
});
