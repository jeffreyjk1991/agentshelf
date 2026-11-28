CREATE TABLE IF NOT EXISTS newsletter_subscribers (
 email text PRIMARY KEY CHECK(length(email) BETWEEN 3 AND 254),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','unsubscribed')),
 consent_at timestamptz NOT NULL DEFAULT now(),
 confirmed_at timestamptz,
 unsubscribed_at timestamptz,
 withdraw_hash text UNIQUE,
 confirm_hash text UNIQUE,
 confirm_expires timestamptz,
 unsubscribe_hash text UNIQUE,
 last_email_attempt timestamptz
);
CREATE INDEX IF NOT EXISTS newsletter_status_idx ON newsletter_subscribers(status,consent_at);
ALTER TABLE engagement_events DROP CONSTRAINT IF EXISTS engagement_events_source_check;
ALTER TABLE engagement_events ADD CONSTRAINT engagement_events_source_check CHECK(source IN ('chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown','instagram','tiktok','youtube','reddit','linkedin','facebook','whatsapp','x','producthunt','newsletter','agent_share'));
ALTER TABLE traffic_hourly DROP CONSTRAINT IF EXISTS traffic_hourly_source_check;
ALTER TABLE traffic_hourly ADD CONSTRAINT traffic_hourly_source_check CHECK(source IN ('chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown','instagram','tiktok','youtube','reddit','linkedin','facebook','whatsapp','x','producthunt','newsletter','agent_share'));
