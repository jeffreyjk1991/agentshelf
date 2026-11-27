import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const catalog=JSON.parse(await fs.readFile('dist/ready-agents.json','utf8'));
const example=catalog.agents.find(a=>a.kind==='assistant'&&a.provider==='chatgpt');
assert.ok(example);
const pagePath=new URL(example.url,'https://www.aibin.me').pathname;
const original=(await fs.readFile('dist'+new URL(example.download,'https://www.aibin.me').pathname,'utf8')).replace(/\n$/,'');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain'};
const sample={id:999,name:'QA sample',creator:'Test fixture',category:'Travel',description:'Browser test only',provider:'claude',kind:'instructions',instructions:'A synthetic community prompt for the browser handoff test.'};
const root=path.resolve('dist');
const server=createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/')){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(url.pathname==='/api/submissions'?{agents:[sample]}:{ok:true}));return;}
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  // Clean URL routes are served as the generated .html file.
  if(url.pathname==='/')file=path.join(root,'index.html');
  else if(!path.extname(file))file+='.html';
  if(!file.startsWith(root+path.sep))throw Error('Invalid path');
  const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{}),args:['--no-sandbox']});
const hosts=['chatgpt.com','claude.ai','gemini.google.com'];
async function context(options={}){
 const ctx=await browser.newContext(options);
 await ctx.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(hosts.includes(url.hostname))return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Intercepted AI destination</title><p>Browser QA fixture; no messages sent.</p>'});
  if(url.origin!==base)return route.abort();
  return route.continue();
 });
 return ctx;
}
async function setProvider(page,provider){
 await page.locator('.ready-edit > summary').click();
 await page.locator('.ready-provider select').selectOption(provider);
 await page.locator('.ready-edit > summary').click();
}
async function fresh(ctx,provider){
 const page=await ctx.newPage();await page.goto(base+pagePath);await page.locator('.ready-use').waitFor();
 await page.waitForFunction(()=>document.querySelector('.ready-use')?.dataset.launchMode);
 if(provider&&provider!==example.provider)await setProvider(page,provider);
 return page;
}
async function popupLink(page,locator,expected,method='click'){
 const [popup]=await Promise.all([page.waitForEvent('popup'),locator[method]()]);
 await popup.waitForURL(u=>u.href===expected,{timeout:10000});assert.equal(popup.url(),expected);await popup.close();
}
async function deny(ctx){await ctx.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied for QA');}}});document.execCommand=()=>false;});}
try{
 const desktop=await context();await deny(desktop);
 for(const provider of ['chatgpt','claude']){
  const p=await fresh(desktop,provider),a=p.locator('.ready-use'),url=await a.getAttribute('href');
  assert.equal(await a.getAttribute('data-launch-mode'),'prefill');assert.equal(new URL(url).searchParams.get('q'),original);
  await popupLink(p,a,url);console.log('BROWSER_HANDOFF PASS '+provider+' native link with clipboard denied');await p.close();
 }
 const blocked=await fresh(desktop,'gemini');await blocked.locator('.ready-use').click();
 await blocked.locator('.ready-status').filter({hasText:'Clipboard blocked'}).waitFor();
 assert.equal(await blocked.locator('.ready-edit').getAttribute('open'),'');
 assert.equal(await blocked.locator('.ready-prompt').evaluate(e=>e.selectionEnd-e.selectionStart),original.length);
 await popupLink(blocked,blocked.locator('.ready-open-fallback'),'https://gemini.google.com/');
 console.log('BROWSER_HANDOFF PASS Gemini clipboard denial, selected prompt, independent open link');await blocked.close();
 const community=await desktop.newPage();await community.goto(base+'/community');const c=community.locator('#agent-999');await c.getByRole('button',{name:'Use in Claude'}).click();
 await c.getByRole('status').filter({hasText:'Clipboard blocked'}).waitFor();assert.equal(await c.locator('textarea').inputValue(),sample.instructions);
 await popupLink(community,c.getByRole('link',{name:'Open Claude'}),'https://claude.ai/');
 console.log('BROWSER_HANDOFF PASS approved community instructions fallback');await desktop.close();
 const mobile=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 await mobile.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
 let p=await fresh(mobile,'gemini');await Promise.all([p.waitForURL('https://gemini.google.com/'),p.locator('.ready-use').tap()]);
 await p.goto(base+pagePath);assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),original);
 console.log('BROWSER_HANDOFF PASS mobile emulated Gemini actual clipboard copy and navigation');await p.close();
 p=await fresh(mobile,'chatgpt');await p.locator('.ready-edit > summary').tap();
 const custom='Private edited agent & 日本語 🌿\nNever put this in the URL.';
 await p.locator('.ready-prompt').fill(custom);
 assert.equal(await p.locator('.ready-use').getAttribute('href'),'https://chatgpt.com/');assert.equal(await p.locator('.ready-use').getAttribute('data-launch-mode'),'copy');
 await Promise.all([p.waitForURL('https://chatgpt.com/'),p.locator('.ready-use').tap()]);
 await p.goto(base+pagePath);assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),custom);
 console.log('BROWSER_HANDOFF PASS edited prompt copied exactly; no private URL parameters');await p.close();await mobile.close();
 const fallback=await context();await fallback.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});document.execCommand=command=>{if(command!=='copy')return false;window.__qaCopied=document.activeElement.value;return true;};});
 p=await fresh(fallback,'gemini');await p.locator('.ready-copy-primary').click();await p.locator('.ready-status').filter({hasText:'Copied.'}).waitFor();assert.equal(await p.evaluate(()=>window.__qaCopied),original);
 await popupLink(p,p.locator('.ready-open-fallback'),'https://gemini.google.com/');console.log('BROWSER_HANDOFF PASS legacy clipboard fallback');await fallback.close();
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
