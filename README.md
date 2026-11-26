# AgentShelf Marketplace

A standalone MVP of an open-source AI agent marketplace. The working name is provisional. Includes a responsive static marketplace, 12 original MIT-licensed downloadable Python agent workflows, search/category filters, detail pages, illustrative demos, deployment guidance, community submissions, a JSON catalog, and Neon-backed event recording. No user accounts, live public model demos, automated community execution, automated security scanning, one-click hosting, reviews or MCP server yet.

## Local preview and tests

Requirements: Node.js 22, Python 3.10+. Run `npm test` (build, archive validation, offline demo and mocked model calls for every package, API validation unit tests). Run `npm run dev` and open `http://localhost:4173`. The local static server does not execute Vercel API routes. `npm install` is required for database-backed functions; a model API key is not needed for tests. `npm run build` creates the static site in `dist/`.

## Deployment on a new GitHub / Vercel project

1. The source belongs in the dedicated `jeffreyjk1991/agentshelf` repository, on `main`. Do not commit `dist/`, `.env`, or credentials.
2. In Vercel, create a **new** project importing that repository, not an existing project. Framework: Other. Build: `npm run build`; output: `dist`. Vercel build needs Node and Python 3.10+.
3. A dedicated Neon project (`dark-shape-13397765`) was created separately. Its schema is in `db/schema.sql`; `db/seed.sql` seeds the starter listings. For a fresh database run both in order. Use a least-privilege application role, scoped to this database, rather than the owner. It needs SELECT on agents, submissions, agent_events; INSERT on submissions and agent_events; and sequence usage. Example grants are in `db/app-grants.sql`; create the named role securely first. Set its connection string as a sensitive server-only Vercel environment variable `DATABASE_URL`. Never commit credentials.
4. Configure `SITE_URL` to the final HTTPS production URL (or use Vercel's production hostname environment variable). Redeploy; check canonical URLs, sitemap, robots.txt, and page indexing. Without a valid site URL the build intentionally disallows indexing. `llms.txt` and a JSON catalog help expose content but do not guarantee AI citations or rankings.
5. Smoke test production: open home and detail pages, download ZIP, preview sample output, submit a test public repo, check the pending submission and event in Neon. Review abuse limits before a public launch; current origin checks, input validation, deduplication and global limits are baseline protection, not robust anti-abuse/authentication. Add CAPTCHA or rate limits before opening submissions at scale.
6. Connect Search Console to the real domain after launch and submit `/sitemap.xml`. Do not index staging hosts.

## Data and moderation

The starter catalog is versioned in `catalog.json`; Neon `agents` mirrors it to validate activity. `submissions` are held for human review; nothing submitted is run or published automatically. Review the repository, owner permission, license, dependency and secret scans, documented permissions, test results, and supported runtime. To publish an approved external agent, update the catalog and packaging flow in reviewed code (external repos must not be packaged as if they were the original templates). A separate admin interface is not included. `agent_metrics` aggregates download requests, sample reveals and deployment clicks (not completed downloads or unique users). No fake usage or popularity scores are seeded.

The CLI templates send user text to the user-configured OpenAI-compatible endpoint, not to the marketplace. Offline tests use a mocked local endpoint and do not validate live-provider task quality. The agent templates do not autonomously perform external actions. Verify provider compatibility and costs before use.
