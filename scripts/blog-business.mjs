export default [
  [
    "ai-agents-for-small-business",
    "AI Agents for Small Businesses: Where to Start",
    "Prioritize five repeatable low-risk business workflows before paying for automation.",
    "Start with repetitive information work: drafting FAQs from policy, summarizing meetings, comparing suppliers, preparing weekly status reports and organizing content. These tasks can produce useful outputs without direct authority to spend money or change customer accounts. Choose one process that already has a documented standard and a named owner. A successful pilot should reduce review effort while maintaining quality, rather than just increasing the number of automated messages.",
    [
      "List ten repetitive tasks and rank them by frequency, time spent and consequence of mistakes.",
      "Select one read-only or draft-only workflow and collect five authorized sample cases.",
      "Measure the baseline time, the assisted time including review, and the error rate. Expand only when the result is better."
    ],
    "A shop spends 40 minutes each week drafting responses to recurring delivery questions. Use approved shipping policy to prepare drafts, then let an employee review them before replying.",
    "Measure saved minutes after correcting errors. Keep customer information in approved systems and use a human approval step for refunds and account changes.",
    [
      "/agent-teams/customer-support-team",
      "Try a customer-support workflow"
    ],
    [
      "agentguide",
      "effective",
      "owasp"
    ]
  ],
  [
    "ai-customer-support-agent",
    "How to Build an AI Customer Support Agent With Policy Checks",
    "Design support drafts that cite company policy, handle missing facts and escalate exceptions.",
    "A support agent needs an approved knowledge base, clear boundaries and an escalation path. A fluent reply is not enough if it promises an invalid refund or reveals another customer's information. Treat policy excerpts and order records as separate sources. The agent can draft the message, but permission to read a record or perform an action should come from the application, not a customer's text.",
    [
      "Collect current shipping, returns and warranty policy documents and mark their effective dates.",
      "Define allowed draft categories and a route to a human for missing evidence, disputes or unusual cases.",
      "Test with a late shipment, a damaged item and a request outside the return period before enabling real messages."
    ],
    "Given this fictional order and policy, draft a short empathetic reply. Quote the relevant policy section, identify facts that need verification and propose escalation if eligibility is unclear.",
    "Check that the draft does not promise a refund without evidence. Monitor inaccurate policy citations and escalation rates; keep actual refunds behind approval.",
    [
      "/agents/support-response-helper",
      "Try a support-draft assistant"
    ],
    [
      "agentguide",
      "owasp"
    ]
  ],
  [
    "ai-agents-for-sales",
    "AI Sales Agents: Research and Draft Outreach Responsibly",
    "Use AI to prepare relevant prospect research and messages without automating unsolicited spam.",
    "Sales workflows often combine public company research, lead qualification and personalized drafts. A good assistant uses verifiable business facts and explains why the offer may be relevant. It should not invent personal connections, scrape sensitive profiles or send bulk unsolicited messages. Before adding a CRM or email integration, confirm organizational rules and applicable privacy and communications requirements.",
    [
      "Define a legitimate audience, value proposition and approved public data sources.",
      "Collect relevant company facts with links and draft a short message that does not make unsupported claims.",
      "Review each recipient and message. Maintain a suppression list and respect opt-outs and sending rules."
    ],
    "Research three businesses that publicly advertise a service relevant to our product. Draft one concise outreach email each using only a verified company fact; don't send messages or guess personal email addresses.",
    "Evaluate relevance and reply quality rather than message volume. Check company facts, opt-outs and recipient details before sending.",
    [
      "/agents/sales-outreach-draft",
      "Prepare an outreach draft"
    ],
    [
      "agentguide",
      "owasp"
    ]
  ],
  [
    "ai-agents-for-meetings",
    "AI Meeting Agent: Extract Actions, Owners and Deadlines",
    "Turn authorized meeting notes into a reliable action register.",
    "A meeting assistant is most useful when it identifies decisions and responsibilities separately from discussion. People often mention possible dates or suggest tasks without actually committing to them. Ask the model to distinguish explicit assignments from proposals and to leave the owner or deadline blank when missing. The transcript should be available with participants' authorization and relevant retention rules.",
    [
      "Provide a transcript or notes with appropriate permission; include the meeting date and participants if relevant.",
      "Request separate sections for decisions, action items, proposed ideas and open questions.",
      "Have participants confirm unclear assignments before putting tasks into a project management system."
    ],
    "From these synthetic notes: 'Sam will send the draft Tuesday. Priya suggested Friday for the review, but nobody agreed.' Record Sam's task with Tuesday as stated; record Friday only as a proposal.",
    "Check the source sentence for each assignment. Do not turn tentative ideas into obligations or send summaries outside the approved audience.",
    [
      "/agents/meeting-action-extractor",
      "Use the meeting-action extractor"
    ],
    [
      "projects",
      "claudeprojects",
      "owasp"
    ]
  ],
  [
    "ai-agents-for-research-teams",
    "AI Research Agents: Build a Source-Checked Research Team",
    "Use retrieval, analysis and review roles to produce evidence-linked research without invented citations.",
    "Research requires more than a plausible summary. A useful workflow defines scope, retrieves relevant evidence, compares claims across sources, and records uncertainty. A second review stage can check whether conclusions actually follow from the evidence. The stages may run in one chat as roles, or as separate calls in a team runtime. The latter is not automatically more accurate; it still needs real retrieval tools or supplied sources.",
    [
      "Write the research question, timeframe, source hierarchy and output format.",
      "Collect source URLs, publication dates and short evidence notes. Analyze only after that collection is available.",
      "Ask a reviewer to check contradictions and unsupported conclusions; report the gaps in the final answer."
    ],
    "Compare three vendors' public plans for a five-person team using only their official pricing and terms pages. Report per-seat costs, limits and the date of verification.",
    "Click each cited link and recalculate totals. AIBin's downloadable research team uses supplied evidence unless you separately provide a retrieval capability.",
    [
      "/agent-teams/research-team",
      "Explore the research team"
    ],
    [
      "research",
      "geminiresearch",
      "effective"
    ]
  ],
  [
    "ai-agents-for-coding",
    "AI Coding Agents: How to Build, Test and Review Code Safely",
    "Use a coding assistant on a scoped repository change without exposing secrets or skipping tests.",
    "Coding agents can help inspect files, propose patches and run tests when their environment grants that access. They can also introduce regressions or interpret untrusted repository content incorrectly. Give the agent a small issue, acceptance criteria and the exact branch. A reviewable diff is more useful than a promise that the code works. Do not expose production credentials or allow deployment until checks are satisfied.",
    [
      "Describe the bug or feature, how to reproduce it and what must not change.",
      "Work on an isolated branch; ask for a small patch and tests that exercise the failure.",
      "Review the diff, run the test suite, check logs and release only after the intended result is verified."
    ],
    "Fix a validation bug that accepts an empty email field. Preserve the existing design, add tests for blank and valid values, and report exact files changed. Do not deploy until the branch is reviewed.",
    "Confirm test results yourself and inspect unexpected dependencies or permission changes. A passing mocked test does not prove production behavior.",
    [
      "/agent-teams/software-team",
      "Try the software team workflow"
    ],
    [
      "api",
      "agentguide",
      "owasp"
    ]
  ],
  [
    "ai-agents-for-seo",
    "AI Agents for SEO: Research, Optimize and Measure Without Spam",
    "Use AI for content-gap research, accurate metadata and internal links with a people-first strategy.",
    "An SEO workflow should start with actual search intent and site capabilities. Use Search Console queries and landing pages when accessible, check existing content before proposing new pages, and avoid making many nearly identical pages. AI can help draft titles, identify missing explanations and test links, but keyword stuffing and fabricated evidence undermine trust. Google explicitly emphasizes content useful to people rather than pages created solely for rankings.",
    [
      "Group queries by intent and map each group to a suitable existing page or genuinely distinct resource.",
      "Improve the answer, examples and internal links before rewriting metadata. Add verifiable references where appropriate.",
      "Validate canonical URLs, crawlability and the sitemap, then monitor real impressions, clicks and engagement over time."
    ],
    "For a free agent directory, cluster 'AI agent marketplace', 'AI agent templates' and 'free prompts'. Strengthen the existing directory and prompt pack pages instead of publishing three copies of the same article.",
    "Use actual Search Console metrics for performance; do not treat an autocomplete suggestion or AI answer as a verified search volume. Rankings and indexing are not guaranteed.",
    [
      "/agents/seo-auditor",
      "Open the SEO review assistant"
    ],
    [
      "helpful",
      "aiSearch"
    ]
  ],
  [
    "ai-agent-for-spreadsheet-analysis",
    "AI Agents for Spreadsheet Analysis: Make the Numbers Auditable",
    "Use a spreadsheet assistant to summarize data, validate calculations and highlight uncertainty.",
    "An AI spreadsheet helper can identify patterns and prepare explanations, but it should not invent rows or replace reliable formulas. First define the columns, units and period. Use deterministic calculations for sums and percentages, then ask the model to explain the results. Check whether it can actually read the spreadsheet and distinguish an exported file from a text description.",
    [
      "Supply an authorized spreadsheet with clear headers and no unnecessary private identifiers.",
      "Ask for a data-quality check and calculations using formulas or a verified calculation tool.",
      "Review totals and a few sample rows, then label charts and findings with the period and units."
    ],
    "A sample store has 20 orders at $10 and 5 at $30. Revenue is $350 and average order value is $14. Ask the assistant to show its calculation and flag any missing returns or discounts.",
    "Recalculate independently and check for double-counting or mixed currencies. Do not let a model infer unsupported causes from correlations.",
    [
      "/agents/spreadsheet-insight-analyst",
      "Try a spreadsheet analysis assistant"
    ],
    [
      "work",
      "cowork",
      "agentguide"
    ]
  ],
  [
    "ai-agent-roi-calculator",
    "How to Calculate AI Agent ROI: Time Saved, Cost and Quality",
    "Calculate whether an AI workflow saves time after review and model costs.",
    "Return on investment should include the actual time needed to operate and review an agent. Track the time a person spends preparing inputs, correcting outputs and resolving failures. Add model fees, hosting and maintenance. Benefits depend on whether the workflow delivers an equivalent or better result; a fast but inaccurate agent can cost more than doing the job manually. Use small pilots before estimating annual savings.",
    [
      "Measure baseline time across ten typical cases and record quality requirements.",
      "Measure assisted time including setup, review and rework; estimate monthly model and operating costs.",
      "Compare net savings to costs and evaluate the effect of error rates before expanding."
    ],
    "A task takes 20 minutes manually and 8 minutes with review. At 50 runs per month, gross savings are 600 minutes (10 hours). At $30/hour, that is $300 of time value. Subtract $40 of monthly costs for an illustrative $260 net value.",
    "These are illustrative assumptions, not guaranteed cash savings. Test the same representative tasks and count cases requiring full manual redo.",
    [
      "/tools/hourly-pay",
      "Estimate the value of time saved"
    ],
    [
      "agentguide",
      "effective"
    ]
  ],
  [
    "ai-agent-privacy-checklist",
    "AI Agent Privacy Checklist: What Data Should You Share?",
    "Protect sensitive information when using AI templates, connected apps and downloadable agents.",
    "Before sharing a file or connecting an app, identify whether the task really needs that information. Ordinary instructions should use synthetic examples where possible. For real work, choose an approved provider and workspace, check data access and retention controls, and limit the agent to the minimum relevant records. A public marketplace listing is not evidence that its author or code is trustworthy. AIBin's reusable templates do not require account credentials.",
    [
      "Remove irrelevant personal data, credentials and confidential content from examples.",
      "Review the intended tool's read and write permissions and applicable organizational rules.",
      "Inspect downloaded code before running it, use scoped credentials and revoke unnecessary connections after the task."
    ],
    "Instead of pasting a full customer spreadsheet to draft an FAQ, provide a redacted policy excerpt and three fictional questions. If real records are needed, use an authorized environment with scoped access.",
    "Verify the actual destination of data and any action. Treat external text as untrusted and never include secrets in a shared prompt or public link.",
    [
      "/privacy",
      "Read AIBin's privacy information"
    ],
    [
      "owasp",
      "plugins",
      "mcp"
    ]
  ]
];
