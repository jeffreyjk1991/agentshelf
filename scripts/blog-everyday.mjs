export default [
  [
    "ai-agent-for-job-search",
    "AI Agents for Job Search: Build a Verified Daily Shortlist",
    "Set up a job-search helper that finds relevant openings and links to genuine employer listings.",
    "A useful job-search agent should prioritize relevance and verification, not automatically apply everywhere. Give it your target role, location, experience, preferred employment type and deal-breakers. Have it collect official job pages, record when they were checked, identify missing salary details and explain why each opening fits. A recurring task needs a real scheduler and current web access. Keep application materials and final submissions under your control.",
    [
      "Make a search profile with five target titles, a location or remote preference, and three required skills.",
      "Request five distinct openings with employer, title, posting date, official application link and fit explanation.",
      "Check each employer's careers site, then tailor a truthful application. Enable a schedule only after a successful manual run."
    ],
    "Every weekday at 9 AM, shortlist five remote analyst jobs matching SQL and reporting experience. Exclude recruiting-fee requests and duplicate jobs; send employer application URLs.",
    "The FTC warns about fake jobs and upfront payments. Never pay to secure an offer, and verify unfamiliar recruiters directly. This template does not submit applications.",
    [
      "/automations/job-opening-scout",
      "Try the job-opening scout"
    ],
    [
      "jobscams",
      "tasks"
    ]
  ],
  [
    "ai-agent-for-flight-deals",
    "AI Agents for Flight Deals: Alerts vs One-Time Fare Searches",
    "Combine airfare alerts with AI comparison to understand total travel cost and fare restrictions.",
    "A flight alert service is often better than a general agent at continually tracking a particular route. Use an AI assistant to compare the options once alerts arrive, including baggage, connection time, arrival date and change rules. Google Flights offers route and date-based price tracking; an external AI task can request recurring checks only when supported. AIBin's flight tools help structure searches, but they do not guarantee current availability or continuous background monitoring.",
    [
      "Enter your departure and destination airports, number of travelers, flexible dates, cabin and luggage.",
      "Set a fare alert in the booking or tracking service; record what price should trigger review.",
      "Compare the total price for the same passengers and baggage, then verify the fare directly before booking."
    ],
    "Watch Detroit to Lisbon for two travelers in March. Alert when the total round-trip fare is below $1,500 including one checked bag each; include overnight stops and a booking link.",
    "Prices can change during checkout. Verify baggage, airports, currency and ticket conditions. Never instruct an unattended agent to purchase automatically.",
    [
      "/automations/flight-price-watcher",
      "Customize a flight alert request"
    ],
    [
      "flights",
      "tasks",
      "shopping"
    ]
  ],
  [
    "ai-agent-for-online-shopping",
    "AI Shopping Agent: How to Compare Prices Without Getting Misled",
    "Use an AI shopping helper to compare exact products, delivered prices and seller terms.",
    "Shopping assistants work best when all offers describe the same item. A model name alone may hide differences in storage, color, condition, warranty and retailer. Build a comparison that includes shipping, taxes, coupons and return restrictions. Separate a product's specifications from seller claims; user reviews can be misleading. AIBin offers browser-based comparison tools and reusable instructions, not automated purchases.",
    [
      "Provide a model number, required condition, country and maximum delivered price.",
      "Collect matching offers and show the full cost and seller return policy; mark missing fees.",
      "Check the best two offers on the actual retailer website before choosing."
    ],
    "Offer A: $80 plus $9 shipping. Offer B: $85 with free shipping. Before tax, B is $4 cheaper. If B charges a $10 return fee, include that downside rather than ranking only the sticker price.",
    "Validate coupon eligibility and final checkout cost. The FTC recommends comparing total prices, seller reliability and refund terms.",
    [
      "/tools/price-compare",
      "Compare two offers in the browser"
    ],
    [
      "shopping",
      "effective"
    ]
  ],
  [
    "ai-agent-for-meal-planning",
    "AI Meal Planning Agent: Turn a Grocery Budget Into a Weekly Plan",
    "Create a practical meal plan that reuses ingredients and respects your dietary constraints.",
    "A useful meal planner needs a realistic number of meals, serving sizes, time limits, pantry inventory and dietary restrictions. Ask it to design meals around overlapping ingredients instead of buying a different set for every recipe. This reduces waste and makes the shopping list easier. Use your actual store prices to check whether the plan stays within budget; an AI estimate is not a live grocery receipt.",
    [
      "List meals needed, household size, ingredients already on hand and known dietary restrictions.",
      "Request a plan grouped by cooking session, with quantities and leftovers.",
      "Compare ingredient totals to the shopping budget and substitute expensive items before shopping."
    ],
    "Plan four dinners for two using rice, canned chickpeas and frozen vegetables already at home. Spend at most $35 on additional ingredients; reuse fresh herbs across two meals.",
    "Check ingredient labels and allergies yourself. If food safety, medical diets or nutritional treatment are involved, use appropriate professional guidance rather than a generated meal plan.",
    [
      "/tools/meal-planner",
      "Try the meal planning tool"
    ],
    [
      "shopping",
      "projects"
    ]
  ],
  [
    "ai-personal-assistant-daily-routine",
    "How to Set Up an AI Personal Assistant for Your Daily Routine",
    "Create a morning planning workflow that prioritizes tasks without taking over your calendar.",
    "A personal assistant can help turn a messy to-do list into a realistic schedule. Its value depends on accurate task durations, fixed commitments and priorities. Start without calendar write access: ask for a suggested plan, review it, and add only the approved blocks. For recurring morning planning, use a supported scheduled task and verify the next run. AIBin's personal assistant instructions can be used manually in your chosen chat.",
    [
      "Supply fixed commitments, three must-do tasks, approximate durations and a stopping time.",
      "Ask the assistant to place high-priority work around commitments, with buffer time and breaks.",
      "Review the proposed plan. If scheduling is useful, enable it explicitly and check the actual calendar."
    ],
    "I have meetings at 10 AM and 2 PM, a 90-minute report, 30 minutes of email, and a 5 PM stop time. Suggest a plan with two buffers and identify what can move to tomorrow.",
    "Do not provide passwords or sensitive event details. Check calendar availability and never assume a suggested event has been created.",
    [
      "/agents/personal-ai-assistant",
      "Create a daily assistant"
    ],
    [
      "projects",
      "tasks"
    ]
  ],
  [
    "ai-agent-for-students",
    "AI Agents for Students: Study Coach, Practice Quizzes and Feedback",
    "Use an AI learning helper to practice understanding without outsourcing your coursework.",
    "A study assistant should help you learn the material, not merely deliver finished answers. Give it a topic and the level you need, then ask for short explanations, retrieval practice and feedback on your attempts. Use class notes or assigned readings as the reference when accuracy matters. The assistant can adapt difficulty, but it can also make factual or mathematical errors.",
    [
      "Identify a specific learning objective and provide your notes or approved textbook excerpts.",
      "Ask for five practice questions without answers. Attempt each before requesting feedback.",
      "Review incorrect responses, request a new example and confirm solutions against course materials."
    ],
    "Teach me how to solve two-step linear equations. Give me five problems of increasing difficulty, wait for my answers and explain errors without immediately revealing solutions.",
    "Follow course AI policies and verify explanations. A helpful study agent should distinguish hints, worked examples and submitted work.",
    [
      "/agents/math-tutor",
      "Try the study coach"
    ],
    [
      "projects",
      "claudeprojects"
    ]
  ],
  [
    "ai-agent-for-social-media-content",
    "AI Agents for Social Media: Build a Reviewable Content Calendar",
    "Create captions and a posting plan from real information without fake claims or automatic spam.",
    "A social content assistant can organize themes, draft caption variants and repurpose original material. It should not invent product claims, customer testimonials, or engagement statistics. Start with an audience, brand style, authentic source material and a cadence you can sustain. Review each draft against platform requirements before publishing. AIBin offers reusable caption and calendar instructions; they are not connected posting accounts.",
    [
      "Provide the audience, three content themes, product facts and a tone example.",
      "Ask for a one-week table of hooks, captions, calls to action and visual concepts.",
      "Check factual claims, disclosures and rights to images or music before approving a post."
    ],
    "Plan five short posts for a local coffee shop: one menu highlight, one brewing tip, one behind-the-scenes clip, one event reminder and one question. Use only facts I provide.",
    "Measure engagement from actual platform analytics; do not fabricate reviews or automate unsolicited comments. Save the best-performing formats for the next batch.",
    [
      "/agents/content-calendar",
      "Build a content calendar"
    ],
    [
      "agentguide",
      "plugins"
    ]
  ],
  [
    "ai-agent-for-professional-headshots",
    "AI Headshot Agent: How to Write a Professional Portrait Edit Brief",
    "Specify a realistic professional headshot and distinguish image instructions from image-generation capability.",
    "A headshot assistant helps describe framing, lighting, wardrobe and background. It cannot guarantee an image edit unless the selected chat supports the appropriate image tools. For a professional portrait, use a photo you have permission to edit, preserve identifying features and avoid misleading alterations. AIBin provides an editing brief that you can adapt; it is not an image rendering service.",
    [
      "Choose a recent clear photo with permission to use it and specify the intended use.",
      "Request natural lighting, a neutral backdrop, head-and-shoulders framing and realistic skin texture.",
      "Compare the resulting image to the original and check cropping and resolution for the intended platform."
    ],
    "Create a professional head-and-shoulders portrait from my supplied photo. Preserve my facial features, age and identity. Use soft natural light, a neutral background and an understated jacket.",
    "Do not use a generated portrait as an official identity document unless the issuing authority explicitly accepts it. Avoid editing people without their consent.",
    [
      "/agents/professional-headshot-maker",
      "Get a professional headshot brief"
    ],
    [
      "plugins",
      "projects"
    ]
  ],
  [
    "ai-agent-for-email-organization",
    "AI Email Agent: Triage, Summarize and Draft Without Losing Control",
    "Design an inbox routine that separates reading, drafting, and sending messages.",
    "Email triage works well with clearly defined categories such as urgent, awaiting response, reference and low priority. A connected assistant may read approved messages, but the availability of that connection depends on the provider. Incoming messages are untrusted content: a sender's request inside an email does not authorize an agent to send data, change settings or make purchases. Start in read-only mode and keep outbound communication behind approval.",
    [
      "Choose a folder or time window and define priority rules.",
      "Request a summary with sender, subject, deadline and reason; draft responses separately.",
      "Review actual recipients and text before sending, archiving or creating tasks."
    ],
    "Summarize unread emails from the last 24 hours. Flag deadlines, direct requests and messages requiring a decision. Draft replies only; do not send or open attachments automatically.",
    "Check that important messages were not omitted and that proposed deadlines are actually present. Do not let embedded instructions override your workflow.",
    [
      "/agents/email-organization",
      "Open the email organization template"
    ],
    [
      "plugins",
      "owasp"
    ]
  ],
  [
    "ai-agent-for-document-summaries",
    "AI Document Agent: How to Get Accurate PDF Summaries and Citations",
    "Get structured document summaries with page evidence, unresolved questions and clear limits.",
    "A document assistant should distinguish what a document says from what the model infers. Ask for page locations or short source excerpts alongside conclusions. Large or scanned PDFs may be partially unreadable; the assistant must disclose missing pages instead of filling them in. For multiple files, use a consistent naming scheme so evidence is easy to trace.",
    [
      "Provide a public or authorized document and name the sections you care about.",
      "Request a short executive summary, key findings and a table linking claims to pages.",
      "Check the original pages and ask for a list of unresolved ambiguities."
    ],
    "Summarize this public 12-page report in six bullets. For every numerical claim, include the page number and relevant table label. Mark any unreadable pages and separate recommendations from reported findings.",
    "Verify page references against the actual document. Do not upload restricted records to a service without the appropriate authorization and privacy controls.",
    [
      "/agents/pdf-question-helper",
      "Try the document question helper"
    ],
    [
      "projects",
      "research",
      "claudeprojects"
    ]
  ]
];
