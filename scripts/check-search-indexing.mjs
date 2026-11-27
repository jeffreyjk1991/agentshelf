import {resolve4,resolve6,resolveCname,resolveNs,resolveTxt} from 'node:dns/promises';
import fs from 'node:fs';
const host='https://www.aibin.me',name='google8d69054a5244e64f.html';
const checks=[];let verifiedFile=false;
for(const domain of ['aibin.me','www.aibin.me']){
 const results=await Promise.allSettled([resolve4(domain),resolve6(domain),resolveCname(domain),resolveNs(domain),resolveTxt(domain)]);
 console.log('PUBLIC_DNS',JSON.stringify({domain,ipv4:results[0].status==='fulfilled'?results[0].value:[],ipv6:results[1].status==='fulfilled'?results[1].value:[],cname:results[2].status==='fulfilled'?results[2].value:[],nameservers:results[3].status==='fulfilled'?results[3].value:[],googleVerificationRecords:results[4].status==='fulfilled'?results[4].value.filter(a=>a.join('').startsWith('google-site-verification=')).length:0,txtLookup:results[4].status}));
}
const targets=['https://aibin.me/','https://aibin.me/agents/resume-builder',host+'/',host+'/robots.txt',host+'/sitemap.xml',host+'/'+name,host+'/'+name.replace('.html',''),host+'/agents/resume-builder',host+'/make-agent',host+'/ai-agent-directory'];
for(const url of targets){
 try{
  const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'User-Agent':'AIBin public SEO diagnostic/1.0'}});
  const body=await r.text();const result={url,status:r.status,location:r.headers.get('location'),robotsHeader:r.headers.get('x-robots-tag'),contentType:r.headers.get('content-type')};
  if(url.endsWith(name)||url.endsWith(name.replace('.html','')))result.verificationMatches=body.trim()===fs.readFileSync('verification/'+name,'utf8').trim();
  else if(url.endsWith('/robots.txt')){result.googlebotAllowed=/User-agent: Googlebot\nAllow: \//.test(body);result.sitemapDeclared=body.includes(host+'/sitemap.xml');}
  else if(url.endsWith('/sitemap.xml')){const urls=[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);result.sitemapUrls=urls.length;result.allCanonicalHost=urls.every(u=>u.startsWith(host+'/'));result.containsHome=urls.includes(host+'/');}
  else{result.canonical=body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];result.robotsMeta=body.match(/<meta name="robots" content="([^"]+)"/)?.[1];result.hasHeading=body.includes('<h1>');}
  console.log('PUBLIC_HTTP',JSON.stringify(result));if(url===host+'/'+name)verifiedFile=r.status===200&&result.verificationMatches===true;
 }catch(e){console.log('PUBLIC_HTTP_ERROR',JSON.stringify({url,error:e.message,cause:e.cause?.code}));}
}
for(const userAgent of ['Googlebot','Google-InspectionTool','OAI-SearchBot']){
 try{const r=await fetch(host+'/',{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'User-Agent':userAgent}});const body=await r.text();console.log('SIMULATED_CRAWLER',JSON.stringify({userAgent,status:r.status,robotsHeader:r.headers.get('x-robots-tag'),robotsMeta:body.match(/<meta name="robots" content="([^"]+)"/)?.[1]}));}catch(e){console.log('SIMULATED_CRAWLER_ERROR',JSON.stringify({userAgent,error:e.message}));}
}

if(process.env.REQUIRE_EXACT_VERIFICATION==='1'&&!verifiedFile){console.error('Google verification file did not return its exact original bytes at the .html URL');process.exitCode=1;}
