-- Run after securely creating an ordinary login role named agentshelf_app.
-- Do not use a role with neon_superuser membership for public application requests.
GRANT USAGE ON SCHEMA public TO agentshelf_app;
GRANT SELECT ON agents, submissions, agent_events TO agentshelf_app;
GRANT INSERT ON submissions, agent_events TO agentshelf_app;
GRANT USAGE, SELECT ON SEQUENCE submissions_id_seq, agent_events_id_seq TO agentshelf_app;

-- Growth release (run after db/growth.sql)
GRANT SELECT ON engagement_catalog, engagement_events, community_agents TO agentshelf_app;
GRANT INSERT ON engagement_events, community_agents TO agentshelf_app;
GRANT USAGE, SELECT ON SEQUENCE engagement_events_id_seq, community_agents_id_seq TO agentshelf_app;
