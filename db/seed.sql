INSERT INTO agents(slug,name,category,description,license,status,test_status) VALUES
('seo-auditor','AI SEO Auditor','Marketing','Turn a page''s title, headings and copy into a prioritized search optimization plan.','MIT','published','offline_mock_tested'),
('email-draft-assistant','Email Draft Assistant','Productivity','Summarize pasted email threads and draft clear replies without sending anything.','MIT','published','offline_mock_tested'),
('research-brief-builder','Research Brief Builder','Research','Turn supplied research notes into a structured, evidence-aware briefing.','MIT','published','offline_mock_tested'),
('meeting-action-extractor','Meeting Action Extractor','Productivity','Extract decisions, owners, deadlines and unresolved items from meeting notes.','MIT','published','offline_mock_tested'),
('spreadsheet-insight-analyst','Spreadsheet Insight Analyst','Business','Review pasted CSV data and suggest useful analyses, formulas and data quality checks.','MIT','published','offline_mock_tested'),
('support-response-helper','Support Response Helper','Business','Draft customer support responses and escalation notes from supplied cases.','MIT','published','offline_mock_tested'),
('code-review-helper','Code Review Helper','Coding','Review pasted code for defects, maintainability and test gaps.','MIT','published','offline_mock_tested'),
('test-plan-generator','Test Plan Generator','Coding','Create a practical test matrix from a feature description or acceptance criteria.','MIT','published','offline_mock_tested'),
('content-brief-creator','Content Brief Creator','Marketing','Build an editorial outline grounded in a target audience, goal and topic.','MIT','published','offline_mock_tested'),
('competitor-comparison','Competitor Comparison Analyst','Research','Compare supplied product facts and identify meaningful differentiation opportunities.','MIT','published','offline_mock_tested'),
('job-application-tailor','Job Application Tailor','Productivity','Adapt truthful resume bullets and draft application messages for a supplied job.','MIT','published','offline_mock_tested'),
('process-documenter','Process Documenter','Business','Convert informal workflow notes into a clear SOP and handoff checklist.','MIT','published','offline_mock_tested')
ON CONFLICT (slug) DO NOTHING;
