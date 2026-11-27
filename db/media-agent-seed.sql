-- Seed new media helpers and refresh existing media categories. Dedicated AIBin Neon project only.
INSERT INTO engagement_catalog(slug,name,category) VALUES
('social-caption-writer','AI Social Media Caption Generator','Social media'),
('video-storyboard','Video Storyboard Planner','Video'),
('thumbnail-brief','Thumbnail Design Brief','Video'),
('short-video-prompt','AI Short Video & Reels Prompt Builder','Video'),
('social-post-image-prompt','AI Social Media Image Prompt Builder','Social media'),
('social-media-content-calendar','AI Social Media Content Calendar','Social media'),
('reels-hook-generator','AI Reels & TikTok Hook Generator','Social media'),
('social-media-hashtag-generator','AI Social Media Hashtag Generator','Social media'),
('passport-photo-generator','Passport Photo Maker & Compliance Checker','Photography'),
('professional-headshot-generator','AI Professional Headshot Generator','Photography'),
('photo-editing-assistant','AI Photo Editing & Enhancement Assistant','Photography'),
('video-editing-assistant','AI Video Editing Assistant','Video'),
('video-subtitle-generator','AI Video Subtitle & Caption Generator','Video'),
('long-video-to-shorts','AI Long Video to Shorts Repurposer','Video')
ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name,category=EXCLUDED.category;
