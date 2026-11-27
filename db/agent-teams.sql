INSERT INTO engagement_catalog(slug,name,category) VALUES
 ('research-team','AI Research & Report Team','Research'),
 ('software-team','AI Software Development Team','Coding'),
 ('customer-support-team','AI Customer Support Team','Business')
ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name,category=EXCLUDED.category;
