export default [
  [
    "what-is-an-ai-agent",
    "What Is an AI Agent? A Beginner’s Guide With Examples",
    "Learn what makes an AI system an agent, how tools and goals fit together, and when a normal chatbot is enough.",
    "An agent is a system organized around accomplishing a goal, rather than only answering a question. It may choose a next step, use an authorized tool, inspect the result and decide whether to continue. A simple example is a research assistant that searches for sources, checks their dates and produces a comparison. A chatbot that merely writes an itinerary from your prompt is useful, but it does not automatically become a tool-using agent. The distinction matters because tool access introduces real consequences and permissions.",
    [
      "Start with a goal that can be checked, such as finding three suitable options with working source links.",
      "Identify what the system must actually access: a search tool, a file, a calculator or an approved account. If no tool is necessary, keep the task in chat.",
      "Set a stopping condition and a review requirement. The user should know when the work is done, what was not verified and which actions require permission."
    ],
    "Compare three laptop models for a student with a $700 budget. Use manufacturer specifications and seller links if available; show missing prices rather than guessing. Stop after a comparison and do not purchase anything.",
    "Ask whether the output was based on live tools, supplied data or inference. If the system cannot access a source, it should tell you rather than invent results. AIBin templates provide instructions; the chat or downloaded runtime determines what can actually execute.",
    [
      "/ai-agent-directory",
      "Explore the AI agent directory"
    ],
    [
      "agentguide",
      "building"
    ]
  ],
  [
    "ai-agent-vs-chatbot",
    "AI Agent vs Chatbot: What Is the Difference?",
    "Compare simple chat, reusable assistants, tool-using agents and automation using a practical example.",
    "A chatbot can answer questions and help you compose text. A reusable assistant adds consistent instructions for a task you repeat. An agent with tools can go further by retrieving information or making permitted changes, while a scheduled workflow adds a trigger. These categories overlap, so choose by the job instead of the label. Asking for a packing list does not need an autonomous system; checking whether a flight is delayed requires current flight information, and notifying you later requires an active schedule.",
    [
      "Write down whether the job needs new information, a deliverable, or a change to another system.",
      "Try the smallest option first: one prompt for a packing list, a saved template for recurring trips, a live lookup for a flight.",
      "Only add a schedule or connection if you need it; verify the task is created and the provider has the right permissions."
    ],
    "Compare these two tasks: 'Suggest a packing list for a three-day trip' and 'Check this flight every morning and tell me only if its status changes.' The first needs instructions; the second needs a real source and scheduler.",
    "Test with a made-up flight number. A reliable system should say the flight was not found, not report an invented departure time. A scheduled task should be visible in the provider’s task manager.",
    [
      "/start",
      "Learn how to use AIBin"
    ],
    [
      "building",
      "tasks"
    ]
  ],
  [
    "ai-agent-vs-workflow",
    "AI Agents vs Automation Workflows: When to Use Each",
    "Decide between fixed steps, AI decisions and a hybrid workflow that is easier to test.",
    "A fixed workflow is appropriate when the inputs and rules are predictable. For example, calculate a total, check whether it exceeds a threshold and send an approved alert. An agent is helpful when inputs vary and the next useful action is not obvious. Rather than making every step probabilistic, use code or rules for exact calculations and model judgment for messy text. The resulting hybrid can be cheaper to operate, easier to audit and less vulnerable to surprising tool decisions.",
    [
      "Map the process as trigger, inputs, decisions, output and failure handling.",
      "Mark decisions with exact rules, such as a total above $100, separately from tasks needing interpretation, such as classifying a complaint.",
      "Use the model only for the uncertain step; validate its result against allowed categories before continuing."
    ],
    "An invoice workflow reads a supplied invoice, extracts supplier and total, checks required fields with code, and sends an exception to a human. It never invents a total or approves the payment.",
    "Run the same known invoice twice and a malformed one once. Verify totals deterministically and make sure an incomplete invoice goes to review instead of being paid.",
    [
      "/agents/workflow-planner",
      "Plan a workflow"
    ],
    [
      "effective",
      "n8n"
    ]
  ],
  [
    "agentic-ai-vs-generative-ai",
    "Agentic AI vs Generative AI: A Practical Explanation",
    "Understand the difference between generating content and carrying out a goal-oriented task.",
    "Generative AI describes models that can create or transform content, such as text, code or images. Agentic AI describes how a system is arranged to pursue a goal, with the ability to select actions, use tools and evaluate intermediate results. The same model can be used in both styles. Generating a cover letter from a job description is a generative task; locating openings, filtering them and preparing drafts is an agent-style workflow. Sending applications without your review would add additional permissions and risks.",
    [
      "Define the output first, rather than choosing a model based on a fashionable term.",
      "Decide which parts need generation and which need retrieval, decisions or calculation.",
      "Keep important actions separate from drafts, and give each part a specific success condition."
    ],
    "For a job search: retrieve postings from official employer sites, compare them to my stated requirements, then draft a cover letter from my real experience. Do not submit applications.",
    "Check the employer links independently, remove unsupported claims in drafts and measure how many genuinely relevant postings the workflow identifies.",
    [
      "/automations/job-opening-scout",
      "Try a job-opening scout template"
    ],
    [
      "agentguide",
      "effective",
      "jobscams"
    ]
  ],
  [
    "build-ai-agent-without-coding",
    "How to Build an AI Agent Without Coding",
    "Create a reusable AI helper in plain English, then decide whether you need an actual automation.",
    "You can begin by turning a recurring job into an instruction set: describe the purpose, required inputs, allowed sources, desired output and limits. A no-code builder can help you organize those instructions. It does not give a model access to an account or create an autonomous process by itself. To make the helper work beyond a chat, use features in your chosen provider that explicitly authorize tools, long-running work or scheduling.",
    [
      "Choose one job with a narrow output, such as a weekly summary of three competitors.",
      "Create instructions with AIBin, pick your preferred AI chat and paste the resulting text. Use sample data first.",
      "If needed, save the instructions in a supported project or reusable feature; separately authorize the required source and confirm any recurring task."
    ],
    "Every Friday, compare the publicly listed features and pricing of these three products. Return a dated table with links and changes since the previous verified snapshot. Do not sign into accounts or buy anything.",
    "Confirm the assistant asks for the product names, distinguishes unavailable prices and has a visible active schedule if you requested recurring work. AIBin does not run scheduled jobs for you.",
    [
      "/make-agent",
      "Create a free no-code AI agent"
    ],
    [
      "projects",
      "tasks",
      "claudeprojects"
    ]
  ],
  [
    "best-ai-agents-for-beginners",
    "Best AI Agent Ideas for Beginners: 5 Tasks Worth Trying",
    "Start with useful low-risk agents for planning, writing, learning and comparison instead of complex automation.",
    "A good first helper has clear inputs and an output you can assess. Try a meal-planning assistant (budget and ingredient list), a study coach (topic and available time), a product comparison assistant (exact models and price limits), an email draft helper (recipient and desired tone), or a trip planner (dates and preferences). None needs permission to send messages or spend money. Starting with these tasks gives you a concrete baseline for comparing different AI providers.",
    [
      "Pick a task you already know how to do and prepare a small example with fictional or nonsensitive information.",
      "Request a specific output such as a table, checklist or draft; ask the assistant to mark assumptions.",
      "Review and revise the result once. Save the improved instructions only if they make your next attempt easier."
    ],
    "Plan three vegetarian dinners for two people using rice, chickpeas and carrots, with a $30 additional grocery budget. Return a shopping list, estimated quantities and meals that share ingredients.",
    "Check quantities, allergens and store prices yourself. If the AI adds unnecessary complexity or repeatedly misses constraints, try a simpler prompt or a deterministic browser tool.",
    [
      "/agent-packs",
      "Browse beginner-friendly prompt packs"
    ],
    [
      "agentguide",
      "effective"
    ]
  ],
  [
    "are-ai-agents-free",
    "Are AI Agents Free? Templates, Subscriptions and Hidden Costs",
    "Understand free instructions, paid AI models, tool access, API usage and hosting before choosing an agent.",
    "Free can mean several different things: a prompt you can copy without paying, an AI service with a limited free tier, or open-source code you can run yourself. AIBin provides free reusable instructions and browser tools, but third-party model access, web tools, connected accounts or hosting may require payment. An agent that repeats a search every hour can consume more resources than a one-off chat. Treat the cost of the entire workflow as separate from the price of the template.",
    [
      "List each component: instruction, model, data source, connected services, execution runtime and storage.",
      "Check the provider’s current pricing and limits; avoid assuming a chat subscription includes API credits or all integrations.",
      "Start with a single manual run. For repeat work, estimate calls per run and runs per month, then set a budget and stop condition."
    ],
    "An illustrative workflow uses four model calls per run and runs 20 times monthly: 80 model calls. If each run also uses two paid lookups, budget for another 40 lookups; check actual token usage and pricing.",
    "Compare the actual bill and usage log with your estimate before enabling recurring work. Open-source code does not imply free hosting or unlimited model access.",
    [
      "/developers",
      "See local execution and costs"
    ],
    [
      "api",
      "tasks"
    ]
  ],
  [
    "ai-agent-marketplace-guide",
    "How to Choose an AI Agent Marketplace",
    "Compare what a marketplace actually offers: prompt instructions, downloadable code, models or hosted execution.",
    "The right AI marketplace depends on what you want to receive. A library of instructions works well for users who already have a preferred AI chat. A public source-code repository helps developers inspect and adapt workflows. A model hub is useful when you need model weights or examples, while an enterprise marketplace may handle software procurement. AIBin combines a free catalog of templates, browser tools and selected downloadable workflows; it does not provide general-purpose hosted agents or a paid creator marketplace.",
    [
      "Check whether the listing describes the execution method, necessary credentials and supported provider.",
      "Look for a sample input, expected output and limitations. Read the license before modifying or redistributing code.",
      "Try a low-risk example, then decide whether the setup and maintenance effort fit your intended task."
    ],
    "Suppose you want a weekly research digest. A reusable template is enough to begin manually. A scheduler inside your AI chat may handle recurring checks, or a locally hosted workflow may be better if you need precise logs and approvals.",
    "Reject listings that claim automatic installation without explaining permissions, or guarantee earnings and outcomes. Verify who publishes the content and what runs where.",
    [
      "/ai-agent-directory",
      "Browse AIBin’s execution modes"
    ],
    [
      "agentguide",
      "effective",
      "plugins"
    ]
  ],
  [
    "write-ai-agent-instructions",
    "How to Write AI Agent Instructions That Actually Work",
    "Use goal, inputs, process, output, tool rules and stop conditions to make reusable instructions more reliable.",
    "Agent instructions are a specification for a job, not a magic role label. A long persona with many adjectives is usually less useful than a clear task contract. Say what the assistant should produce, what information it must request, how to handle missing evidence, and what it may not do. For a tool-using system, define its allowed actions and required confirmation outside the prompt as well. A prompt cannot replace technical permission controls.",
    [
      "Describe the role and the finished output in one sentence.",
      "List required inputs and a sequence of checks. Include a fallback for missing or contradictory evidence.",
      "Specify the output format, a stopping rule and actions requiring your approval; test with both a normal and difficult input."
    ],
    "Help me review a product listing. Ask for the exact model and budget. Compare three sources by delivered price, warranty and return policy. Label any unavailable facts. Return one table and a recommendation; never purchase.",
    "Check that the assistant does not invent a third source when only two exist. If it misses a requirement, revise the instruction and re-run the same test instead of adding vague warnings.",
    [
      "/agents/prompt-generator",
      "Open the prompt generator"
    ],
    [
      "agentguide",
      "effective",
      "owasp"
    ]
  ],
  [
    "ai-agent-examples-with-tools",
    "AI Agent Examples: What Changes When an Agent Has Tools?",
    "See the difference between a generated answer, a read-only tool call and a permitted external action.",
    "Imagine asking an assistant for the exchange rate, a summary of a document and a calendar reminder. A language model can explain the first two topics from its knowledge, but a current rate needs a source, and the summary needs the actual document. A reminder requires a calendar or scheduler with permission to create an event. These are different capabilities, even when the conversation looks identical. Start with read-only tools and escalate access only when the task justifies it.",
    [
      "For each example, write the exact data source and the proposed action.",
      "Use a read-only tool to get information, and record when it was retrieved.",
      "Separate side effects from analysis: show the planned reminder details before creating it."
    ],
    "Retrieve a current exchange-rate quote from a supported source, state the timestamp and convert 100 units using that rate. Then propose a reminder to check again tomorrow; do not create it until requested.",
    "Check the conversion against a calculator and inspect whether the reminder is actually present in the provider's scheduler. If a source or app is missing, the system must report the gap.",
    [
      "/live-agents",
      "Explore live read-only workflows"
    ],
    [
      "api",
      "mcp",
      "tasks"
    ]
  ]
];
