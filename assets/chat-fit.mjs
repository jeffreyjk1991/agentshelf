export const CHATS={
  "chatgpt": {
    "name": "ChatGPT",
    "url": "https://chatgpt.com/",
    "why": "A practical starting point for everyday planning and checklists."
  },
  "claude": {
    "name": "Claude",
    "url": "https://claude.ai/",
    "why": "A practical starting point for writing, editing and reviewing text."
  },
  "gemini": {
    "name": "Gemini",
    "url": "https://gemini.google.com/",
    "why": "A practical starting point for research; check that web access is available."
  }
};
const choices={
  "product-finder": "gemini",
  "gift-finder": "gemini",
  "price-watchlist": "gemini",
  "flight-tracker": "gemini",
  "cheap-flight-finder": "gemini",
  "hotel-finder": "gemini",
  "travel-itinerary": "gemini",
  "package-tracker": "gemini",
  "competitor-comparison": "gemini",
  "research-brief-builder": "gemini",
  "seo-auditor": "gemini",
  "email-draft-assistant": "claude",
  "meeting-action-extractor": "claude",
  "support-response-helper": "claude",
  "code-review-helper": "claude",
  "test-plan-generator": "claude",
  "content-brief-creator": "claude",
  "job-application-tailor": "claude",
  "process-documenter": "claude",
  "message-drafter": "claude",
  "note-checklist": "claude"
};
export function recommendedChat(slug){return choices[slug]||'chatgpt';}
export function chatForIdea(idea){const s=String(idea||'').toLowerCase();if(/\b(write|writing|draft|email|edit|rewrite|resume|letter|document|summarize|proofread)\b/.test(s))return 'claude';if(/\b(flight|flights|hotel|hotels|shopping|prices|research|product|products|current|latest|track)\b/.test(s))return 'gemini';return 'chatgpt';}
