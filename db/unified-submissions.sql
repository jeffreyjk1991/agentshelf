-- Dedicated AIBin database only. Older tables are retained; no votes or old submissions are deleted.
CREATE TABLE IF NOT EXISTS marketplace_agent_submissions (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 name text NOT NULL CHECK(length(name) BETWEEN 3 AND 100),
 creator text NOT NULL CHECK(length(creator) BETWEEN 2 AND 50),
 category text NOT NULL CHECK(length(category) BETWEEN 2 AND 40),
 description text NOT NULL CHECK(length(description) BETWEEN 15 AND 500),
 provider text NOT NULL CHECK(provider IN ('chatgpt','claude','gemini','any','none')),
 kind text NOT NULL CHECK(kind IN ('instructions','link')),
 instructions text CHECK(length(instructions) BETWEEN 20 AND 6000),
 url text CHECK(length(url)<=400),platform text,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK((kind='instructions' AND instructions IS NOT NULL AND url IS NULL AND platform IS NULL AND provider<>'none') OR (kind='link' AND url IS NOT NULL AND instructions IS NULL AND platform IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS marketplace_agent_submissions_url_idx ON marketplace_agent_submissions(url) WHERE url IS NOT NULL;
CREATE INDEX IF NOT EXISTS marketplace_agent_submissions_status_idx ON marketplace_agent_submissions(status,created_at DESC);
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='agentshelf_app') THEN GRANT SELECT,INSERT ON marketplace_agent_submissions TO agentshelf_app; GRANT USAGE,SELECT ON SEQUENCE marketplace_agent_submissions_id_seq TO agentshelf_app; END IF; END $$;
