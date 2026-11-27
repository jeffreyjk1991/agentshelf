from pathlib import Path
import json, zipfile
root=Path(__file__).resolve().parents[1]
output=root/'dist'/'downloads'; output.mkdir(parents=True,exist_ok=True)
for item in json.loads((root/'catalog.json').read_text()):
    readme=f"# {item['name']}\n\n{item['summary']}\n\n## Run locally\nPython 3.10+; no extra packages.\n\n```sh\npython agent.py --demo\nexport LLM_MODEL=your-provider-model\nexport LLM_API_KEY=your-own-key\npython agent.py --input 'Your task here'\n```\n\nSet `LLM_BASE_URL` to an OpenAI-compatible HTTPS endpoint (default `https://api.openai.com/v1`). For a local compatible server use a loopback HTTP URL; local endpoints do not require a key. Never commit a model key. Provider/model compatibility and charges depend on the service you choose. The sample is illustrative, not a live model test.\n\n## Scope and permissions\n{item['permissions']}\n\nThis agent is a single-task text workflow; it does not access external systems or perform actions on your behalf. Inputs are sent to the chosen provider when run live; review its data policy. Review outputs before acting.\n\n## Customize\nEdit the `task` prompt in `agent.json`.\n\n## License\nMIT. See LICENSE.\n"
    with zipfile.ZipFile(output/f"{item['slug']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('agent.json',json.dumps(item,indent=2,ensure_ascii=False));z.write(root/'agent-template'/'agent.py','agent.py');z.writestr('README.md',readme);z.write(root/'LICENSE','LICENSE')

# Independent local tool-calling runner, separate from the starter packages.
with zipfile.ZipFile(output/'aibin-agent-runner.zip','w',zipfile.ZIP_DEFLATED) as z:
    z.write(root/'agent-runner'/'runner.mjs','runner.mjs')
    z.write(root/'lib'/'live-engine.mjs','live-engine.mjs')
    z.write(root/'agent-runner'/'README.md','README.md')
    z.write(root/'LICENSE','LICENSE')

# Team packages: four separate specialist model calls, independent from the existing 12 starters.
for team in json.loads((root/'agent-teams'/'catalog.json').read_text(encoding='utf-8')):
    with zipfile.ZipFile(output/f"{team['slug']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('team.json',json.dumps(team,indent=2,ensure_ascii=False))
        z.write(root/'agent-teams'/'team.py','team.py')
        z.write(root/'agent-teams'/'README.md','README.md')
        z.write(root/'LICENSE','LICENSE')
