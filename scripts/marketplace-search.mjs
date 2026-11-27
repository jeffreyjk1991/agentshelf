// Search-intent coverage: one canonical destination for each real use case.
export const marketplaceGuidePath='/ai-marketplace-platforms';
const platforms=[
 ['AIBin','Everyday users and small teams','Free reusable instructions, browser tools, task templates and downloadable workflows.','/','Explore AIBin'],
 ['Hugging Face Hub','Model developers and researchers','Discover models, datasets and interactive Spaces. Check each repository’s license and compute requirements.','https://huggingface.co/docs/hub/main/index','Official Hub documentation'],
 ['GitHub','Developers looking for source code','Search repositories, inspect licenses, dependencies and maintenance activity before running code.','https://docs.github.com/en/search-github/getting-started-with-searching-on-github/about-searching-on-github','GitHub search documentation'],
 ['GPT Store / ChatGPT','Users working in ChatGPT','Custom GPTs are in transition toward plugins; availability and migration depend on the account. AIBin instructions can be pasted into an ordinary compatible chat.','https://help.openai.com/en/articles/8798878-sharing-and-publishing-gpts','Official GPT sharing and publishing guidance'],
 ['AWS Marketplace','Organizations procuring cloud AI services','Find third-party AI agents and tools for AWS deployment and procurement. Review pricing, data handling and integration requirements.','https://docs.aws.amazon.com/marketplace/latest/buyerguide/ai-agent-discovery.html','AWS AI agent discovery'],
 ['AgentMarket (agentmarket.trade)','Developers connecting agents to tools','A directory for agents to discover APIs, MCP servers and other tools. The name AgentMarket is used by multiple services; check the domain.','https://www.agentmarket.trade/','AgentMarket tool directory'],
 ['Facebook Marketplace','People buying or selling goods','Meta offers AI assistance for marketplace listings and buyer replies. It is not a general marketplace for downloadable AI agents.','https://about.fb.com/news/2026/03/facebook-marketplace-new-meta-ai-tools-make-selling-faster-and-easier/','Meta’s marketplace AI features'],
 ['Optum AI Marketplace','Healthcare organizations','Healthcare-focused AI products and operational services. Evaluate clinical, privacy and procurement requirements with your organization.','https://marketplace.optum.com/about-us','Official Optum Marketplace information']
];
const questions=[
 ['What is an AI marketplace?','An AI marketplace helps people discover AI tools, prompts, models, agent workflows or services. Some are free catalogs, some sell software, and some run AI on your behalf. Check what you actually receive: instructions, executable code, access to a tool or a hosted service.'],
 ['Is there a free AI marketplace?','Yes. AIBin offers free access to its catalog, reusable instructions and browser tools. External model subscriptions, APIs or hosting can still cost money. Community submissions are reviewed and AIBin does not handle sales or creator payouts.'],
 ['What is an AI marketplace creator?','A creator publishes an original assistant, prompt, tool or agent workflow for other people to use. On AIBin you can share public instructions or a supported link with a chosen username; approval is required. No creator payment system is offered.'],
 ['Can I find an open-source AI marketplace on GitHub?','GitHub is useful for finding public agent code. Inspect the license and README, run safe examples before adding credentials, and verify permissions. AIBin provides original MIT-licensed Python starters and public code; its reusable prompts are separate from executable software.'],
 ['What is a prompt marketplace?','A prompt marketplace or library helps you find reusable instructions for an AI model. AIBin offers free prompt packs and task-specific instructions for compatible chats. Choose a prompt, adapt your details, and review the output; it does not install a hosted agent.'],
 ['Can I make $1,000 a day with AI?','No tool or marketplace can guarantee that income. AI can help with tasks such as research, writing and drafting, but earnings depend on customers, expertise, costs and the value you deliver. AIBin provides free instructions and tools, not an income program.']
];
export function marketplaceMetadata(url,title,description,count){
 const overrides={
  '/':['Free AI Agent Marketplace & No-Code AI Agent Builder | AIBin','Explore '+count+' free AI helpers: reusable agents, prompt templates, browser tools and automation instructions. Create an AI agent for ChatGPT, Claude or Gemini without coding.'],
  '/ai-agent-directory':['Free AI Agent Directory — '+count+' Agents & Tools | AIBin','Browse the complete AIBin catalog by execution type: free AI chat instructions, scheduled task templates, browser tools and on-demand data workflows.'],
  '/agent-packs':['Free AI Prompt Marketplace — 24 Reusable Prompt Templates | AIBin','Explore four free prompt packs for careers, creators, planning and work. Download reusable AI instructions and customize them in ChatGPT, Claude or Gemini.'],
  '/creators':['AI Creator Marketplace — Discover & Share AI Agents | AIBin','Discover reviewed AI agent contributions and public creator collections. Share your original assistant instructions or supported link on AIBin; free submissions, no payouts.'],
  '/community':['Submit an AI Agent — Free AI Marketplace for Creators | AIBin','Publish your original AI instructions or supported public agent link for review. Choose a category, public username and preferred AI chat. No listing fee or creator payments.'],
  '/developers':['Open-Source AI Agent Marketplace — GitHub & Developer Guide | AIBin','Explore AIBin’s public GitHub code, free downloadable Python workflows, MIT-licensed starters and read-only JSON catalogs. Learn how to run locally.']
 };
 return overrides[url]||[title,description];
}
export function marketplaceRelated(url,esc){
 const copy={
 '/ai-agent-directory':['Compare AI marketplace platforms','Understand prompts, agents, source code and hosted tools before choosing a marketplace.'],
 '/agent-packs':['How prompt marketplaces work','These free prompts are reusable instructions, not paid listings or installed agents.'],
 '/creators':['How AI creator marketplaces work','Share original work for review. AIBin is a free catalog, not a paid creator marketplace.'],
 '/community':['Where to publish AI agents','Compare sharing options and learn what AIBin accepts.'],
 '/developers':['Compare GitHub and AI marketplaces','Find AIBin source code and learn when to use a model hub or cloud marketplace.'],
 '/about':['What is an AI marketplace?','Compare free agent catalogs, model hubs and cloud procurement.']
 };
 if(!copy[url])return '';
 const [title,desc]=copy[url];
 const github=url==='/developers'?'<p><a href="https://github.com/jeffreyjk1991/agentshelf" rel="noopener noreferrer">View AIBin source on GitHub</a> · <a href="/agent-runner">Download the open-source agent runner</a></p>':'';
 return '<section class="simple-page related-section"><h2>'+esc(title)+'</h2><p>'+esc(desc)+' <a href="'+marketplaceGuidePath+'">Read the marketplace guide →</a></p>'+github+'</section>';
}
export function addMarketplaceGuide({page,esc,base,count}){
 const rows=platforms.map(([name,audience,detail,url,link])=>'<div class="intent-row" style=""><span><strong>'+esc(name)+'</strong><small>'+esc(audience)+'</small><p>'+esc(detail)+'</p><a href="'+esc(url)+'" rel="noopener noreferrer">'+esc(link)+' →</a></span></div>').join('').replaceAll(' style=""','');
 const faq=questions.map(([q,a])=>'<details class="quiet-details"><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('');
 const title='AI Marketplace Platforms: Free Agents, Prompts & Tools | AIBin';
 const description='Compare AI marketplace platforms for everyday tasks, creators and developers: AIBin, GitHub, Hugging Face, AWS, GPT Store and more. Find the right type of AI tool.';
 const body='<article class="simple-page"><a class="back-link" href="/">← Explore</a><h1>AI marketplace platforms explained</h1><p class="page-lead">Find the right marketplace for what you want AI to do.</p><p>An AI marketplace is a place to discover models, tools, prompts, agents or AI services. Not every marketplace runs the AI for you. AIBin is a free, independent AI agent marketplace for everyday tasks: choose instructions for your own chat, run a browser tool, or download a workflow.</p><div class="intent-list"><a class="intent-row" href="/ai-agent-directory"><span><strong>Browse '+count+' free AI helpers</strong><small>Choose a task and see how it runs.</small></span><span>↗</span></a><a class="intent-row" href="/make-agent"><span><strong>Create an AI agent without coding</strong><small>Generate reusable instructions in plain English.</small></span><span>↗</span></a><a class="intent-row" href="/agent-packs"><span><strong>Explore the free prompt marketplace</strong><small>Download and customize four practical collections.</small></span><span>↗</span></a><a class="intent-row" href="/community"><span><strong>Publish as an AI marketplace creator</strong><small>Submit instructions or a supported public link for review.</small></span><span>↗</span></a></div><h2>Compare marketplace platforms by purpose</h2><p>Choose based on whether you need instructions, model weights, source code, hosted software or enterprise procurement. The services below are independent; AIBin is not affiliated with them. Descriptions use the linked official pages, reviewed November 27, 2026.</p><div class="intent-list">'+rows+'</div><h2>Which option fits your task?</h2><p>For a weekend itinerary or a job-search routine, start with <a href="/make-agent">the no-code builder</a>. For reusable writing and creative tasks, choose <a href="/agent-packs">prompt packs</a>. For local executable workflows, visit <a href="/developers">the developer guide</a> and check credentials, permissions and costs. For business or healthcare systems, consult the vendor and your organization before adopting a service.</p><h2>Frequently asked questions</h2>'+faq+'<p><a href="/creators">Explore creators</a> · <a href="/agent-checks">See testing and limitations</a> · <a href="/ai-agent-directory">Browse agents and tools</a></p></article>';
 page(marketplaceGuidePath,title,description,body,{discoverySchema:{'@context':'https://schema.org','@type':'WebPage',name:title,description,url:base+marketplaceGuidePath,publisher:{'@type':'Organization',name:'AIBin',url:base+'/'}}});
}
