-- Optional: run on the dedicated AIBin database using an authorized migration role.
INSERT INTO engagement_catalog(slug,name,category) VALUES
('seo-article-writer','AI SEO Article Writer','Marketing'),
('seo-faq-builder','AI FAQ & Answer Builder','Marketing'),
('seo-content-gap','AI Competitor Content Gap Analyzer','Marketing'),
('keyword-strategy','AI Keyword Strategy & Content Planner','Marketing'),
('seo-article-rewriter','AI SEO Article Rewriter','Writing'),
('personal-ai-assistant','Personal AI Assistant','Productivity'),
('short-video-prompt','AI Short Video & Reels Prompt Builder','Creative'),
('sql-query-assistant','AI SQL Query Assistant','Coding'),
('email-organization','AI Email Organizer & Inbox Triage','Productivity'),
('social-post-image-prompt','AI Social Media Image Prompt Builder','Creative'),
('illustration-prompt','AI Illustration & Digital Art Prompt Builder','Creative'),
('browser-game-builder','AI Browser Game Builder Prompt','Coding'),
('printable-clipart-prompt','AI Printable Clipart Prompt Builder','Creative'),
('text-adventure','AI Text Adventure Game','Creative'),
('book-recommendation','AI Book Recommendation Assistant','Learning'),
('fictional-character-builder','AI Fictional Character & Roleplay Builder','Creative'),
('prompt-generator','AI Prompt Generator & Optimizer','Productivity'),
('coding-assistant','AI Coding Assistant','Coding')
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,category=EXCLUDED.category;
