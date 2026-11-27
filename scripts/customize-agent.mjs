import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const entries=new Map([
 ...[...read('catalog.json'),...read('prompt-agents/catalog.json')].map(a=>[a.slug,{...a,kind:'assistant'}]),
 ...read('automations/catalog.json').map(a=>[a.slug,{...a,kind:'scheduled'}]),
 ...read('everyday/catalog.json').map(a=>[a.slug,{...a,kind:'tool'}]),
 ...read('agent-teams/catalog.json').map(a=>[a.slug,{...a,kind:'team'}])
]);
const text=(label,placeholder='')=>({label,placeholder});
const select=(label,...options)=>({label,options});
const tone=select('Tone','Professional','Friendly','Casual','Persuasive','Playful','Direct');
const result=select('Result format','Short answer','Step-by-step','Checklist','Comparison table','Detailed explanation');
const level=select('Experience level','Beginner','Intermediate','Advanced');
const imageStyle=select('Visual style','Natural / realistic','Editorial','Minimalist','Creative','Studio');
const specific={
 'social-caption-writer':[select('Platform','Instagram','TikTok','Facebook','LinkedIn','X'),tone,text('Topic or photo context','A weekend coffee photo')],
 'social-hook-hashtag-generator':[select('Platform','Instagram','TikTok','YouTube Shorts','LinkedIn'),text('Video topic and audience','Weekend travel tips'),select('Hook style','Curiosity','Question','Story','Practical tip')],
 'instagram-carousel-creator':[text('Topic and audience','Grocery savings for families'),select('Number of slides','3','5','7','10'),tone],
 'content-calendar':[select('Platform','Instagram','TikTok','LinkedIn','Facebook','Multiple platforms'),text('Niche or audience','Travel and food'),select('Planning period','One week','Two weeks','One month')],
 'professional-headshot-maker':[select('Intended use','LinkedIn','Company profile','Resume','Portfolio'),select('Background','Neutral gray','White','Office','Outdoor'),select('Style','Natural professional','Studio portrait','Editorial')],
 'passport-photo-maker':[text('Issuing country and document','United States passport'),select('What to check','Photo dimensions','Framing and background','Full compliance review'),select('Output preference','Checklist','Official requirements and retake guidance')],
 'photo-edit-brief':[text('What to improve','Lighting and contrast'),imageStyle,select('Crop / aspect ratio','Original','1:1','4:5','16:9')],
 'photo-enhancer':[select('Main issue','Low light','Noise','Blur','Faded colors','Old photo'),select('Editing strength','Subtle','Moderate','Careful restoration'),text('Details to preserve','Original face and colors')],
 'background-removal-assistant':[select('Output background','Transparent','White','Neutral color'),text('Subject and edge details','Product with fine edges'),select('Output format','PNG','Preview and instructions')],
 'hairstyle-try-on':[text('Haircut or style','Shoulder-length layers'),text('Hair texture and preferences','Wavy, natural color'),select('Preview','Subtle change','Several style ideas')],
 'virtual-outfit-try-on':[text('Outfit or clothing reference','Navy blazer and white shirt'),select('Occasion','Casual','Business','Formal','Sport'),imageStyle],
 'consensual-face-swap-guide':[text('Consenting participants and creative context','Disclosed costume composite'),select('Output','Planning guide','Editing instructions with disclosure'),text('Details to preserve','Original identity and features')],
 'video-editing-assistant':[select('Destination','YouTube','Instagram Reels','TikTok','YouTube Shorts'),select('Target duration','15 seconds','30 seconds','60 seconds','2 minutes','Long form'),select('Edit style','Clean cuts','Cinematic','Tutorial','Fast-paced')],
 'long-video-to-shorts-editor':[select('Platform','TikTok','Instagram Reels','YouTube Shorts'),select('Target clip length','15 seconds','30 seconds','60 seconds','90 seconds'),text('Topics / strongest moments','Three useful takeaways')],
 'short-video-prompt':[text('Video idea','Coffee preparation'),select('Format','9:16 vertical','16:9 landscape','1:1 square'),select('Length','15 seconds','30 seconds','60 seconds')],
 'video-storyboard':[text('Story and audience','Product launch for beginners'),select('Format','9:16 vertical','16:9 landscape','1:1 square'),select('Length','15 seconds','30 seconds','60 seconds','2 minutes')],
 'resume-builder':[text('Target job or role','Business analyst'),select('Experience level','Entry-level','Mid-level','Senior','Career change'),select('Resume focus','Relevant achievements','Skills','Career transition','Concise one-page')],
 'cover-letter-writer':[text('Job title and company','Data analyst at a retailer'),text('Relevant real experience','Reporting and dashboards'),tone],
 'interview-practice':[text('Job role and industry','Product analyst'),select('Interview type','Behavioral','Technical','Case study','Mixed'),level],
 'job-search-scout':[text('Target role and skills','Data analyst, SQL'),text('Location or remote preference','Remote US'),text('Salary or must-have requirements','Above $80k')],
 'linkedin-profile-coach':[text('Target role or industry','Operations analyst'),select('Profile section','Headline','About','Experience','All sections'),tone],
 'email-draft-assistant':[text('Recipient and purpose','Manager; reschedule a meeting'),tone,select('Length','Very short','Standard','Detailed')],
 'professional-letter-writer':[text('Recipient and purpose','Landlord; repair request'),tone,select('Length','Very short','Standard','Detailed')],
 'translation-assistant':[text('Source language','English'),text('Target language','Hindi'),select('Translation style','Natural','Literal','Formal','Conversational')],
 'grammar-checker':[select('Editing strength','Grammar only','Grammar and clarity','Polish and readability'),select('English variant','US','UK','Other'),tone],
 'paragraph-rewriter':[tone,select('Rewrite goal','Improve clarity','Shorten','Make more natural','Simplify'),select('Length','Shorter','Same length','Longer')],
 'article-summarizer':[select('Length','One paragraph','Five bullets','Detailed summary'),text('Focus','Key evidence and takeaways'),select('Audience','General','Executive','Technical')],
 'weekend-getaway':[text('Starting city and destination','Detroit to Chicago'),text('Dates and travel party','Next weekend, two adults'),text('Total budget and interests','$500, food and museums')],
 'family-vacation-planner':[text('Destination and dates','Lisbon, five days'),text('Travel party and budget','Two adults and two children, $2,000'),select('Pace','Relaxed','Balanced','Busy')],
 'local-restaurant-guide':[text('City or neighborhood','Detroit'),text('Cuisine and budget','Thai, under $30 per person'),select('Occasion','Casual','Date night','Family','Group')],
 'hotel-review-guide':[text('Destination and dates','Hong Kong, Dec 11–13'),text('Budget and requirements','$200/night, central location'),select('Priority','Location','Value','Comfort','Amenities')],
 'flight-disruption-help':[text('Route, flight and date','DTW to JFK, tomorrow'),text('Disruption and constraints','Cancellation, need same-day arrival'),select('Priority','Fastest alternative','Lowest cost','Understand passenger rights')],
 'laptop-buying-advisor':[text('Use and requirements','Work, travel, 16 GB RAM'),text('Budget and currency','$900 USD'),select('Priority','Value','Performance','Battery life','Portability')],
 'phone-buying-advisor':[text('Requirements','Unlocked, good camera'),text('Budget and region','$700 US'),select('Priority','Camera','Battery','Performance','Value')],
 'used-car-buying-guide':[text('Vehicle or models','2023 compact SUV'),text('Budget and region','$25,000, Michigan'),select('Priority','Reliability','Cost','Safety','Features')],
 'grocery-deal-advisor':[text('City and stores','Detroit, Aldi and Costco'),text('Budget and household','$80 for two'),text('Staples or dietary preferences','Rice, vegetables, eggs')],
 'meal-prep-coach':[text('Meals and servings','Five lunches for two'),text('Diet and allergies','Vegetarian, no peanuts'),text('Time and budget','One hour, $40')],
 'workout-planner':[text('Goal and available equipment','General strength, dumbbells'),level,text('Time and constraints','30 minutes, three days a week')],
 'math-tutor':[text('Topic','Algebra, linear equations'),level,select('Learning style','Hints first','Step-by-step explanation','Practice problems')],
 'language-practice':[text('Language','Spanish'),level,select('Practice type','Travel conversation','Vocabulary','Grammar','Speaking practice')],
 'homework-coach':[text('Subject and topic','Biology, photosynthesis'),level,select('Help style','Hints and questions','Worked explanation','Practice quiz')],
 'flashcard-maker':[text('Subject or source material','Biology notes'),select('Number of cards','10','20','30','50'),select('Format','Question and answer','Term and definition','Mixed')],
 'image-prompt-builder':[text('Subject and scene','Coffee shop in the rain'),imageStyle,select('Aspect ratio','1:1','4:5','9:16','16:9')],
 'logo-brief-builder':[text('Brand name and industry','Independent coffee shop'),select('Style','Minimal','Modern','Classic','Playful'),text('Colors or motifs','Forest green, simple symbol')],
 'thumbnail-brief':[text('Video title and audience','Budget travel tips'),select('Style','Clean','Bold','Minimalist','Editorial'),text('Text or subject to include','Three travel hacks')],
 'slide-outline-builder':[text('Presentation topic and audience','Quarterly business review'),select('Number of slides','5','8','10','15'),tone],
 'coding-assistant':[text('Language or framework','Python'),text('Goal or issue','Build a CSV reader'),select('Help type','Explain','Write code','Debug','Review and test')],
 'code-review-helper':[text('Language or framework','JavaScript'),select('Review focus','Bugs','Security','Performance','Maintainability'),result],
 'website-builder-brief':[text('Website type and audience','Portfolio for a photographer'),select('Design style','Minimalist','Modern','Editorial','Playful'),text('Required features','Gallery and contact form')],
 'app-builder-brief':[text('App idea and users','Grocery checklist for families'),select('Platform','Web','iOS','Android','Cross-platform'),text('Key features','Save lists and share')],
 'seo-auditor':[text('Website or topic','Local business website'),text('Target audience and search term','Customers in Michigan'),select('Focus','Technical SEO','Content','Local SEO','Full review')],
 'seo-article-writer':[text('Topic and target keyword','Best coffee grinders'),text('Audience and goal','Beginners comparing products'),tone],
 'prompt-generator':[text('Task or objective','Plan a weekend trip'),select('AI platform','ChatGPT','Claude','Gemini','Any compatible chat'),result],
 'personal-ai-assistant':[text('Main tasks','Daily planning and email drafts'),select('Preferred style','Concise','Step-by-step','Proactive suggestions'),text('Boundaries and priorities','Ask before external actions')]
};
const categories={
 'Writing':[text('Content and purpose','What are you writing or revising?'),tone,select('Length','Short','Standard','Detailed')],
 'Social media':[text('Content topic and audience','Who is the post for?'),select('Platform','Instagram','TikTok','YouTube','LinkedIn','Facebook','X'),tone],
 'Career':[text('Role or career goal','Target role or industry'),level,text('Priorities or experience','Relevant real skills and constraints')],
 'Learning':[text('Subject or topic','What are you learning?'),level,select('Learning format','Step-by-step','Practice questions','Summary','Flashcards')],
 'Shopping':[text('Product or requirements','What are you looking for?'),text('Budget, currency and region','$100 USD, US'),select('Priority','Lowest price','Best value','Quality','Convenience')],
 'Travel':[text('Destination or route','Starting point and destination'),text('Dates, party size and budget','Dates, travelers, maximum cost'),select('Priority','Lowest cost','Convenience','Comfort','More activities')],
 'Home':[text('Household, space or goal','Your situation and desired result'),text('Time or budget','Available time, maximum cost'),select('Approach','Simple','Budget-friendly','Step-by-step')],
 'Money':[text('Goal and relevant amounts','Monthly budget or comparison'),text('Country, currency and timeframe','US, USD, monthly'),result],
 'Business':[text('Business context and goal','Industry, audience and objective'),text('Constraints or priorities','Budget, deadline, requirements'),result],
 'Creative':[text('Concept and audience','What should the result look like?'),imageStyle,text('Output requirements','Dimensions, format or mood')],
 'Video':[text('Video topic and audience','What is the footage or concept?'),select('Platform','YouTube','TikTok','Instagram Reels','YouTube Shorts'),select('Length','15 seconds','30 seconds','60 seconds','Long form')],
 'Photography':[text('Image goal and subject','Portrait, product, or landscape'),imageStyle,select('Crop / aspect ratio','Original','1:1','4:5','9:16','16:9')],
 'Research':[text('Question or subject','What should be investigated?'),text('Scope or sources','Region, date range, trusted sources'),result],
 'Marketing':[text('Product, topic and goal','What are you promoting?'),text('Target audience or keyword','Who are you trying to reach?'),result],
 'Productivity':[text('Task or desired result','What should be organized or done?'),text('Context and priorities','Deadline, constraints, relevant details'),result],
 'Coding':[text('Language or platform','Python, JavaScript, etc.'),text('Goal or issue','What should it build or explain?'),select('Output','Code with explanation','Review','Debugging steps','Test plan')]
};
export function customizationFields(slug){
 const a=entries.get(slug);if(!a)return [text('Task or preferences','What would you like to change?'),result];
 if(a.kind==='team')return a.fields;
 if(a.kind==='scheduled')return [...a.questions.map(q=>text(q.label,q.placeholder)),select('Repeat','One-time check','Daily','Weekly','Monthly'),select('Preferred time','Morning','Afternoon','Evening','Choose in my chat')];
 if(a.kind==='tool')return a.fields.slice(0,3).map(f=>f.type==='select'?select(f.label,...f.options):text(f.label,f.placeholder||String(f.value??'').slice(0,100)));
 return specific[slug]||categories[a.category]||[text('Task or context',String(a.input||'').slice(0,150)),result];
}
export function customizationPanel(slug,esc){
 const a=entries.get(slug);const fields=customizationFields(slug).map((f,i)=>{
  const props=' data-custom-field data-label="'+esc(f.label)+'" name="preference-'+i+'"';
  const control=f.options?'<select'+props+'><option value="">Keep default</option>'+f.options.map(o=>'<option value="'+esc(o)+'">'+esc(o)+'</option>').join('')+'</select>':'<input type="text"'+props+' maxlength="600" placeholder="'+esc(f.placeholder||'Optional')+'" autocomplete="off">';
  return '<label class="customize-field"><span>'+esc(f.label)+'</span>'+control+'</label>';
 }).join('');
 return '<div class="ready-variables"><p class="fine-print">Change only what matters. Leave the rest as default.'+(a?.kind==='tool'?' These preferences customize the optional AI instructions, not the browser calculator.':'')+'</p><div class="ready-variable-grid">'+fields+'</div><label class="customize-field"><span>Reference links <small>(optional)</small></span><textarea class="ready-references" rows="2" maxlength="2500" placeholder="https://example.com (one public link per line)" aria-label="Reference links"></textarea></label><p class="fine-print">Links are included in the instructions, not opened by AIBin. Don’t add private or signed links.</p><p class="customize-error muted" role="status"></p></div>';
}
