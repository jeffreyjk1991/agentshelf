-- First-party aggregated traffic: no IP addresses, raw user agents, query strings or identifiers.
CREATE TABLE IF NOT EXISTS traffic_hourly (
 hour timestamptz NOT NULL,
 page_path text NOT NULL CHECK (length(page_path) BETWEEN 1 AND 150),
 country text NOT NULL CHECK (country ~ '^[A-Z]{2}$'),
 device_type text NOT NULL CHECK (device_type IN ('desktop','mobile','tablet','unknown')),
 source text NOT NULL CHECK (source IN ('chatgpt','perplexity','gemini','claude','copilot','google','bing','other_referral','direct_or_unknown')),
 visit_kind text NOT NULL CHECK (visit_kind IN ('first_visit','return_visit','page_view')),
 views bigint NOT NULL DEFAULT 1 CHECK (views > 0),
 PRIMARY KEY (hour,page_path,country,device_type,source,visit_kind)
);
