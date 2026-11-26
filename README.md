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

## Everyday browser tools
41 interactive client-side tools are generated from `everyday/catalog.json`. Their rules live in `assets/tool-engine.mjs`, with smoke cases in `everyday/examples.json`. Run `npm test` to validate examples. Search/flight/package links open external providers; no live prices, status or background alerts are fetched. Inputs are local, with optional user-controlled device storage. Production canonical default is the existing `agentshelf-zeta.vercel.app` hostname; override `SITE_URL` on a future custom domain. The public `/tools.json` provides a machine-readable catalog.

## Beginner-first release
The home page focuses on everyday no-code helpers. `/start` explains the difference between instant browser tools, manual AI chat assistants and cloud-deployed agents. `/make-agent` creates reusable instructions locally; each existing tool and original agent has an optional or primary copy-to-chat workflow. Chat services are opened through ordinary links; the user must paste instructions and provider capabilities/fees vary. No hosted AI execution, external account access or automatic deployment has been added. Plain-language search is token/alias based, not an LLM. Existing URLs and download packages are preserved. `/assistants.json`, `/tools.json` and `/catalog.json` document execution modes.

## Minimal task-first release
The home page displays six compact helpers initially; all 53 existing helpers and assistants remain in the searchable HTML catalog. Each chat flow has a suggested provider, selectable alternatives, two large buttons (copy/open), and a clear paste step. Recommendations are editorial task-fit defaults, not measured rankings. All instructions and examples remain available in expandable sections. Instant helper results remain hidden until run. The custom assistant builder suggests a chat from task keywords without sending data to a model. Existing URLs, canonical tags, schema and catalog/sitemap remain. No automatic deployment into external chats or background execution is implied. The Vercel build runs `tests/minimal.test.mjs` before release.
