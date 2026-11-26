const taskData=[
  {
    "slug": "track-cheap-flights",
    "title": "How to track cheap flights with AI",
    "category": "Travel",
    "description": "Flight prices change frequently. Set a route, travel dates, baggage needs and a target fare, then compare total trip costs rather than headline prices.",
    "example": "Round trip Detroit to Tokyo in March, flexible by three days, one checked bag, notify me if a fare falls below $850.",
    "links": [
      "/automations/flight-price-watcher",
      "/tools/cheap-flight-finder",
      "/tools/flight-tracker"
    ],
    "limit": "Scheduled checks require an AI chat that supports scheduling and current web access. Confirm fares and terms on the booking site; a template cannot guarantee continuous monitoring."
  },
  {
    "slug": "find-cheapest-product",
    "title": "How to find the cheapest price for a product",
    "category": "Shopping",
    "description": "Compare the exact model, size and condition across retailers. Include shipping, taxes, coupon eligibility and return policies before picking a deal.",
    "example": "Find a new 256 GB phone under $700; compare unlocked models with US shipping and a return policy.",
    "links": [
      "/tools/product-finder",
      "/tools/price-compare",
      "/automations/product-deal-watcher"
    ],
    "limit": "Retail prices and inventory change. The browser tool opens comparison searches; a supported AI chat may check live listings. Verify before purchasing."
  },
  {
    "slug": "save-money-on-groceries",
    "title": "How to save money on groceries with AI",
    "category": "Food",
    "description": "Start with a weekly budget, ingredients you already have, dietary needs and local stores. Compare unit prices and build meals around overlapping ingredients.",
    "example": "Plan five dinners for two under $65 using rice and eggs already at home. Make a shopping list grouped by aisle.",
    "links": [
      "/automations/grocery-deal-scout",
      "/tools/grocery-budget",
      "/agents/grocery-deal-advisor"
    ],
    "limit": "Store prices and coupons vary by location and date. Check the weekly ad and expiry dates before shopping."
  },
  {
    "slug": "find-restaurants-near-me",
    "title": "How to find restaurants near you with AI",
    "category": "Local",
    "description": "Narrow by location, budget, dietary needs and occasion. Compare menus, recent reviews, accessibility and current opening hours before choosing.",
    "example": "Find three vegetarian-friendly dinner spots within a 15-minute drive, under $35 per person, with seating for four.",
    "links": [
      "/agents/local-restaurant-guide",
      "/automations/local-restaurant-discovery",
      "/automations/weekend-activity-finder"
    ],
    "limit": "The assistant needs a location and current sources. Call or check the restaurant directly for availability and hours."
  },
  {
    "slug": "find-jobs-with-ai",
    "title": "How to find jobs with AI",
    "category": "Career",
    "description": "Create a list of target roles, location, salary requirements, experience level and remote preferences. Ask for official job links and application deadlines.",
    "example": "Find remote data analyst roles in the US requiring two to four years of experience. Exclude staffing agencies and list the posting date.",
    "links": [
      "/automations/job-opening-scout",
      "/agents/job-search-scout",
      "/agents/resume-builder"
    ],
    "limit": "Listings may be stale; check the employer careers page. The template will not apply for jobs automatically."
  },
  {
    "slug": "plan-a-vacation",
    "title": "How to plan a vacation with AI",
    "category": "Travel",
    "description": "Start with dates, travel party, total budget and preferred pace. Group nearby attractions and reserve time for transfers, meals and realistic breaks.",
    "example": "Plan five days in Lisbon for two with a $1,500 lodging and activity budget. Include one day trip and transit options.",
    "links": [
      "/tools/travel-itinerary",
      "/agents/family-vacation-planner",
      "/tools/trip-budget"
    ],
    "limit": "Verify entry requirements, travel schedules and prices with official providers before booking."
  },
  {
    "slug": "track-bills-and-reminders",
    "title": "How to track bills and set payment reminders",
    "category": "Money",
    "description": "List bill names, due dates, estimated amounts and payment frequency without including account numbers. Plan a reminder a few days before each due date.",
    "example": "Remind me on the 25th to check next month's rent, utilities and credit-card statement before the first.",
    "links": [
      "/automations/bill-reminder",
      "/automations/weekly-spending-checkin",
      "/tools/monthly-budget"
    ],
    "limit": "Your chosen chat must confirm a scheduled task. Do not share banking credentials; reminders are not payments or financial advice."
  },
  {
    "slug": "negotiate-car-price",
    "title": "How to negotiate a car price with AI",
    "category": "Shopping",
    "description": "Compare similar vehicles by year, trim, mileage and condition. Request an itemized out-the-door quote, including taxes, fees and add-ons; negotiate the total price.",
    "example": "Compare a 2023 compact SUV with 25,000 miles to two similar listings and draft a polite offer requesting an out-the-door price.",
    "links": [
      "/agents/used-car-buying-guide",
      "/agents/auto-loan-compare",
      "/tools/price-compare"
    ],
    "limit": "Use verified listings and an independent inspection. The assistant does not negotiate or purchase on your behalf."
  },
  {
    "slug": "track-packages",
    "title": "How to track a package with AI",
    "category": "Shopping",
    "description": "Use the carrier name and tracking number to open the official tracking page. If you need reminders, specify what status change matters and when to stop checking.",
    "example": "Check whether my package has moved from label created to in transit, and tell me if a delivery exception appears.",
    "links": [
      "/tools/package-tracker",
      "/automations/package-status-watch",
      "/tools/return-deadline"
    ],
    "limit": "The browser tracker links to the carrier; it does not fetch tracking status. Avoid posting tracking numbers publicly and verify with the carrier."
  },
  {
    "slug": "make-a-weekly-meal-plan",
    "title": "How to make a weekly meal plan with AI",
    "category": "Food",
    "description": "Set the number of people, prep time, leftovers, budget and dietary restrictions. Reuse ingredients across meals to reduce food waste.",
    "example": "Make seven dinners for a family of four, under 30 minutes each, no peanuts, with two leftover lunches.",
    "links": [
      "/automations/weekly-meal-planner",
      "/tools/meal-planner",
      "/agents/meal-prep-coach"
    ],
    "limit": "Verify allergy safety and food storage guidance yourself. A recurring plan needs scheduling support in your chat."
  },
  {
    "slug": "plan-a-weekend",
    "title": "How to find things to do this weekend with AI",
    "category": "Local",
    "description": "Provide your city, radius, date, interests and budget. Ask for event dates, operating hours and direct ticket links.",
    "example": "Find free or under-$25 outdoor activities within 30 minutes of Detroit this Saturday, with rainy-day alternatives.",
    "links": [
      "/automations/weekend-activity-finder",
      "/agents/weekend-getaway",
      "/tools/event-planner"
    ],
    "limit": "Events can sell out or change; confirm timing and ticket availability before leaving."
  },
  {
    "slug": "compare-hotel-prices",
    "title": "How to compare hotel prices with AI",
    "category": "Travel",
    "description": "Compare rooms for the same dates and guest count, including taxes, resort fees, cancellation terms and breakfast. Check the hotel's own site as well as aggregators.",
    "example": "Compare three refundable hotels in Chicago for two nights, under $200 per night including mandatory fees.",
    "links": [
      "/tools/hotel-finder",
      "/agents/hotel-review-guide",
      "/agents/travel-points-compare"
    ],
    "limit": "Availability and rewards redemption vary. Confirm the complete checkout price and cancellation terms."
  },
  {
    "slug": "find-gifts",
    "title": "How to find gift ideas with AI",
    "category": "Shopping",
    "description": "Describe the recipient's interests, your relationship, budget, delivery deadline and what they already own. Request a varied shortlist and avoid guesses about current stock.",
    "example": "Find five thoughtful gifts under $40 for a friend who enjoys coffee and hiking, arriving before next Friday.",
    "links": [
      "/tools/gift-finder",
      "/tools/product-finder",
      "/agents/coupon-deal-research"
    ],
    "limit": "Gift suggestions are not verified stock or shipping commitments. Check the retailer before buying."
  },
  {
    "slug": "write-a-resume",
    "title": "How to write a resume with AI",
    "category": "Career",
    "description": "Provide your real experience, measurable results and a job description. Tailor the resume to relevant skills, using accurate claims and clear action verbs.",
    "example": "Rewrite my analyst resume for a business intelligence role, emphasizing dashboards, SQL and stakeholder communication without inventing qualifications.",
    "links": [
      "/agents/resume-builder",
      "/agents/cover-letter-writer",
      "/agents/interview-practice"
    ],
    "limit": "Remove sensitive contact details if you prefer. Review every claim; an AI resume should not invent achievements or credentials."
  },
  {
    "slug": "practice-a-language",
    "title": "How to practice a language with AI every day",
    "category": "Learning",
    "description": "Choose your target language, proficiency, topics and time limit. Ask for conversation practice, corrections and a short vocabulary recap.",
    "example": "Practice beginner Spanish for ten minutes every evening, using restaurant and travel scenarios, with three corrections after each conversation.",
    "links": [
      "/automations/language-practice-routine",
      "/agents/language-practice",
      "/agents/flashcard-maker"
    ],
    "limit": "Text and audio features depend on the chat. Check unfamiliar translations with reliable sources."
  },
  {
    "slug": "summarize-news",
    "title": "How to get a daily AI news briefing",
    "category": "News",
    "description": "Choose topics and sources, specify a delivery time, and request dates and direct links. Distinguish original reporting from opinion and avoid repeated stories.",
    "example": "Give me a morning briefing of five important US technology and business stories, with source links and one sentence on why each matters.",
    "links": [
      "/automations/daily-news-brief",
      "/agents/news-briefing",
      "/automations/industry-news-monitor"
    ],
    "limit": "Current news requires reliable web access and scheduling support. Verify important claims using the linked primary sources."
  },
  {
    "slug": "manage-subscriptions",
    "title": "How to review and reduce monthly subscriptions",
    "category": "Money",
    "description": "List subscription names, costs, renewal dates and actual usage. Convert annual plans to monthly equivalents and decide which to keep, downgrade or cancel.",
    "example": "Review my $12 music, $18 video and $99 annual software plans; identify possible annual savings and renewal reminders.",
    "links": [
      "/tools/subscription-audit",
      "/automations/subscription-review",
      "/agents/subscription-cancellation"
    ],
    "limit": "Do not share passwords or financial account details. Review cancellation policies and cancel services yourself."
  },
  {
    "slug": "plan-daily-tasks",
    "title": "How to organize your day with AI",
    "category": "Daily life",
    "description": "List your appointments, priorities, deadlines and available hours. Ask for a realistic schedule with buffers and a short list of must-do tasks.",
    "example": "Make a weekday plan for three work meetings, a grocery run, a 30-minute workout and dinner by 7 PM.",
    "links": [
      "/tools/daily-planner",
      "/automations/calendar-day-ahead",
      "/automations/work-priority-planner"
    ],
    "limit": "Calendar access depends on your chat and any connected account. The browser planner uses details you provide, not your calendar automatically."
  },
  {
    "slug": "compare-apartments",
    "title": "How to find and compare apartment listings with AI",
    "category": "Home",
    "description": "Specify rent budget, move-in date, commute, bedrooms, pet rules and accessibility requirements. Compare total monthly cost and flag listing changes.",
    "example": "Find one-bedroom apartments under $1,600 within a 25-minute commute, with parking and cat-friendly policies.",
    "links": [
      "/automations/apartment-listing-watch",
      "/agents/rent-or-buy",
      "/tools/moving-checklist"
    ],
    "limit": "Verify listings on the original site, watch for rental scams, and never send deposits before verifying the property and landlord."
  },
  {
    "slug": "prepare-for-an-interview",
    "title": "How to prepare for a job interview with AI",
    "category": "Career",
    "description": "Share a job description and anonymized examples from your experience. Practice role-specific questions, STAR responses, follow-up questions and feedback.",
    "example": "Run a mock interview for a product analyst role. Ask one question at a time and give feedback on clarity and evidence.",
    "links": [
      "/agents/interview-practice",
      "/agents/salary-negotiation-coach",
      "/agents/resume-builder"
    ],
    "limit": "Use real examples and do not share confidential employer information. Feedback is practice, not a hiring prediction."
  }
];
export const tasks=taskData;
export function addTaskPages({fs,out,page,esc,base,assistants,everyday,automations}){
 const index=new Map([...assistants.map(a=>['/agents/'+a.slug,{...a,mode:'AI chat'}]),...everyday.map(a=>['/tools/'+a.slug,{...a,mode:'Browser tool'}]),...automations.map(a=>['/automations/'+a.slug,{...a,mode:'Scheduled setup'}])]);
 const taskUrl=t=>'/how-to/'+t.slug;
 const taskLink=t=>'<a class="intent-row" href="'+taskUrl(t)+'"><span><small>'+esc(t.category)+'</small><strong>'+esc(t.title)+'</strong></span><span aria-hidden="true">↗</span></a>';
 const helperLink=(url,primary=false)=>{const a=index.get(url);if(!a)throw Error('Missing task helper: '+url);return '<a class="intent-helper'+(primary?' intent-primary':'')+'" href="'+esc(url)+'"><span class="agenticon" aria-hidden="true">'+esc(a.icon)+'</span><span class="mini-copy"><strong>'+esc(a.name)+'</strong><span class="mini-description">'+esc(a.summary)+'</span><span class="mode-label">'+esc(a.mode)+'</span></span><span class="chevron" aria-hidden="true">›</span></a>';};
 page('/how-to','Everyday AI Guides — Find an AI Agent for Any Task | AgentShelf','Practical free AI guides for finding deals, tracking flights, saving on groceries, getting a job and organizing daily life. Choose a helper and get started without coding.','<section class="categoryhero intent-hero"><div class="eyebrow"><span class="dot"></span> EVERYDAY AI</div><h1>What do you want to do?</h1><p>Real problems. Useful AI. Choose a task to find a free helper.</p></section><div class="intent-grid">'+tasks.map(taskLink).join('')+'</div><div class="small-cta"><a href="/#agents">Explore all helpers →</a></div>');
 for(const t of tasks){
  const related=tasks.filter(x=>x.slug!==t.slug).sort((a,b)=>Number(b.category===t.category)-Number(a.category===t.category)).slice(0,3);
  page(taskUrl(t),t.title+' | Free AI Guide — AgentShelf',t.description+' Try a free, no-code helper on AgentShelf.','<article class="simple-page intent-page"><a class="back-link" href="/how-to">← Everyday AI guides</a><div class="eyebrow">'+esc(t.category)+' · NO CODING</div><h1>'+esc(t.title)+'</h1><p class="page-lead">'+esc(t.description)+'</p><h2 class="compact-heading">Start here</h2>'+helperLink(t.links[0],true)+'<div class="intent-alternatives">'+t.links.slice(1).map(u=>helperLink(u)).join('')+'</div><section class="intent-example"><h2>Example request</h2><p>'+esc(t.example)+'</p></section><details class="quiet-details"><summary>How to get the best results</summary><p>Open the helper above and fill in the requested details, or copy its instructions into a supported AI chat. Review the response before acting.</p><p>'+esc(t.limit)+'</p></details><section class="related-section"><h2>Related guides</h2><div class="intent-list">'+related.map(taskLink).join('')+'</div></section></article>');
 }
 fs.writeFileSync(out+'/task-guides.json',JSON.stringify({name:'AgentShelf everyday AI guides',count:tasks.length,guides:tasks.map(t=>({...t,url:base+taskUrl(t),links:t.links.map(url=>({url:base+url,name:index.get(url).name,mode:index.get(url).mode}))}))},null,2));
 return tasks;
}
