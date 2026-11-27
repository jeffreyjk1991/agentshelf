ALTER TABLE engagement_events ADD COLUMN IF NOT EXISTS source text CHECK(source IN ('chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown'));
ALTER TABLE engagement_events ADD COLUMN IF NOT EXISTS landing_kind text CHECK(landing_kind IN ('home','builder','listing','directory','guide','other'));
CREATE OR REPLACE VIEW engagement_search_referrals AS SELECT created_at::date AS day,source,landing_kind,slug,count(*) AS visits FROM engagement_events WHERE event_type IN ('first_visit','return_visit') AND source IS NOT NULL GROUP BY 1,2,3,4;
