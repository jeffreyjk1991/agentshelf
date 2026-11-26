from pathlib import Path
import json, zipfile
root=Path(__file__).resolve().parents[1]
output=root/'dist'/'downloads'; output.mkdir(parents=True,exist_ok=True)
for item in json.loads((root/'catalog.json').read_text()):
    readme=f"# {item['name']}\n\n{item['summary']}\n\n## Run locally\nPython 3.10+; no extra packages.\n\n```sh\npython agent.py --demo\nexport LLM_MODEL=your-provider-model\nexport LLM_API_KEY=your-own-key\npython agent.py --input 'Your task here'\n```\n\nSet `LLM_BASE_URL` to an OpenAI-compatible HTTPS endpoint (default `https://api.openai.com/v1`). For a local compatible server use a loopback HTTP URL; local endpoints do not require a key. Never commit a model key. Provider/model compatibility and charges depend on the service you choose. The sample is illustrative, not a live model test.\n\n## Scope and permissions\n{item['permissions']}\n\nThis agent is a single-task text workflow; it does not access external systems or perform actions on your behalf. Inputs are sent to the chosen provider when run live; review its data policy. Review outputs before acting.\n\n## Customize\nEdit the `task` prompt in `agent.json`.\n\n## License\nMIT. See LICENSE.\n"
    with zipfile.ZipFile(output/f"{item['slug']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('agent.json',json.dumps(item,indent=2,ensure_ascii=False));z.write(root/'agent-template'/'agent.py','agent.py');z.writestr('README.md',readme);z.write(root/'LICENSE','LICENSE')
