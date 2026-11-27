# AIBin multi-agent team

This package runs four distinct specialist model requests in sequence. Each stage
receives the task and preceding outputs. The last response is the final result.
This is a bounded, local text-only pipeline, not a hosted autonomous service.

## Try without a key

Python 3.10 or later (standard library only).

    python team.py --demo

The demo is an illustrative example, not a live execution.

## Run with your own provider

Configure LLM_MODEL to a model that accepts chat-completions requests and max_tokens,
LLM_API_KEY to your own provider key, and optionally LLM_BASE_URL to an OpenAI-compatible
HTTPS base ending in /v1 (default https://api.openai.com/v1).
Local loopback HTTP endpoints may omit the key. Set credentials in your terminal
environment or your own secret manager; do not put keys in team.json or source code.
Provider compatibility, context limits, charges and data policies vary.

    python team.py --input "Your task and source material here"
    python team.py --json < task.txt

The second command returns the four stage outputs plus final result. Each
successful live run makes four model calls. An error stops the pipeline and returns
a nonzero exit status instead of pretending work completed. No automatic retry.
The task and prior text are sent to the selected provider. Do not supply private
customer data, credentials or confidential code unless authorized to do so.

To deploy on a server you own, install Python 3.10+, copy this package, configure
the environment securely, and invoke team.py on demand. No public endpoint or
background scheduler is included. Review outputs before using them. The runner
cannot browse, execute code, send email, change accounts, or fetch reference URLs.
Supply the source text needed for research or policy review. No unverified live
provider benchmark is claimed.

Edit team.json to change the four roles and tasks; keep four unique role IDs.
The no-code AIBin chat version is a role-based workflow within one conversation,
not this separate-call runtime.

Licensed under MIT; see LICENSE.
