import basics from './blog-basics.mjs';
import providers from './blog-providers.mjs';
import automation from './blog-automation.mjs';
import everyday from './blog-everyday.mjs';
import business from './blog-business.mjs';
export const blogGroups=[
 {id:'basics',name:'AI agent basics',description:'Start here: what agents are, when to use them and how to make your first one.',rows:basics},
 {id:'comparisons',name:'ChatGPT, Claude & Gemini',description:'Choose the right AI chat, workspace, skills and scheduling tools.',rows:providers},
 {id:'automation',name:'Automation & development',description:'Build reliable workflows, connect tools and deploy agents safely.',rows:automation},
 {id:'everyday',name:'Everyday AI',description:'Practical ways to use agents for travel, shopping, careers, learning and creative work.',rows:everyday},
 {id:'business',name:'Work & business',description:'Useful team workflows, research, coding, support, analytics and SEO.',rows:business}
];
export const blogSources={
 agentguide:['OpenAI — A practical guide to building agents','https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/'],
 building:['OpenAI Developers — Building agents','https://developers.openai.com/tracks/building-agents'],
 effective:['Anthropic — Building effective agents','https://www.anthropic.com/engineering/building-effective-agents'],
 projects:['OpenAI Help — Projects in ChatGPT','https://help.openai.com/en/articles/10169521-projects-in-chatgpt'],
 tasks:['OpenAI Help — Scheduled tasks in ChatGPT','https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt'],
 work:['OpenAI Help — ChatGPT Work and Codex','https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex'],
 plugins:['OpenAI Help — Plugins in ChatGPT','https://help.openai.com/en/articles/20001256-plugins-in-chatgpt'],
 research:['OpenAI Help — Deep research in ChatGPT','https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt'],
 claudeprojects:['Claude Help — What are projects?','https://support.claude.com/en/articles/9517075-what-are-projects'],
 claudeskills:['Claude Help — What are skills?','https://support.claude.com/en/articles/12512176-what-are-skills'],
 cowork:['Claude Help — Get started with Claude Cowork','https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork'],
 gems:['Gemini Help — Get started with Gems and transition to skills','https://support.google.com/gemini/answer/15236321'],
 geminitasks:['Gemini Help — Manage tasks and workflows','https://support.google.com/gemini/answer/17094507'],
 geminiresearch:['Gemini Help — Deep Research','https://support.google.com/gemini/answer/15719111'],
 n8n:['n8n documentation — AI Agent node','https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/'],
 mcp:['Model Context Protocol — Introduction','https://modelcontextprotocol.io/docs/getting-started/intro'],
 langgraph:['LangChain documentation — LangGraph overview','https://docs.langchain.com/oss/python/langgraph/overview'],
 owasp:['OWASP GenAI Security Project — Prompt injection','https://genai.owasp.org/llm2026/llm012026-prompt-injection/'],
 api:['OpenAI API — Agents overview','https://developers.openai.com/api/docs/guides/agents'],
 sdk:['OpenAI API — Agents SDK','https://developers.openai.com/api/docs/guides/agents/sdk'],
 jobscams:['FTC Consumer Advice — Job scams','https://consumer.ftc.gov/articles/job-scams'],
 shopping:['FTC Consumer Advice — Online shopping','https://consumer.ftc.gov/articles/online-shopping'],
 flights:['Google Travel Help — Track flights and prices','https://support.google.com/travel/answer/6235879'],
 helpful:['Google Search Central — Helpful, reliable, people-first content','https://developers.google.com/search/docs/fundamentals/creating-helpful-content'],
 aiSearch:['Google Search Central — Optimizing for generative AI search','https://developers.google.com/search/docs/fundamentals/ai-optimization-guide']
};
export const blogDate='2026-11-27';
export const blogArticles=blogGroups.flatMap(g=>g.rows.map(([slug,title,description,answer,steps,example,checks,cta,sources])=>({slug,path:'/blog/'+slug,title,description,answer,steps,example,checks,cta,sources,group:g.id,category:g.name,date:blogDate})));
export const blogPaths=new Set(['/blog',...blogArticles.map(a=>a.path)]);
if(blogArticles.length!==50||blogPaths.size!==51)throw Error('Blog requires 50 distinct articles');
for(const a of blogArticles){
 if(!/^[a-z0-9-]{1,80}$/.test(a.slug)||!a.title||!a.description||!a.answer||a.steps.length!==3||!a.example||!a.checks||!a.cta[0].startsWith('/')||a.sources.length<2||a.sources.some(k=>!Object.hasOwn(blogSources,k)))throw Error('Invalid blog article '+a.slug);
}
