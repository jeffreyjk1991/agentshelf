# AIBin model-driven agent runner (MIT)

A local, bounded agent that uses an OpenAI-compatible tool-calling model to select and combine five public-data tools: Wikipedia research, GitHub repository search, Hacker News, currency reference rates and holiday calendars. The model decides which tools to call; this is not a copy/paste prompt. No dependencies beyond Node.js 22+. No background tasks or external account actions.

Set AIBIN_MODEL_ENDPOINT to the full chat-completions HTTPS endpoint of your chosen compatible provider (or a local server), AIBIN_MODEL to a supported tool-calling model, and AIBIN_MODEL_KEY if the provider requires one. Keep secrets in your environment; never commit or paste them into the task. Your provider can charge for inference. Public data providers may rate-limit requests.

Run: node runner.mjs "Find three open-source Python scheduling projects and compare their licenses"

The model receives your task and source results; do not include private information. Results are untrusted and may be incomplete. Inspect the code before running and verify source links. The runner uses fixed read-only providers, a maximum of five model turns and eight tool calls, request timeouts and bounded outputs. It never executes returned commands or downloaded code.
