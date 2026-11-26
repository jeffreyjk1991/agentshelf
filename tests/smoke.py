from pathlib import Path
from tempfile import TemporaryDirectory
from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
import json,zipfile,subprocess,os,sys
root=Path(__file__).resolve().parents[1];catalog=json.loads((root/'catalog.json').read_text());dist=root/'dist'
class Model(BaseHTTPRequestHandler):
    def do_POST(self):
        data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        assert self.path=='/v1/chat/completions' and data['model']=='mock' and data['messages'][0]['role']=='system' and data['messages'][1]['content']=='Test input'
        self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(b'{"choices":[{"message":{"content":"Mock response"}}]}')
    def log_message(self,*args):pass
server=HTTPServer(('127.0.0.1',0),Model);Thread(target=server.serve_forever,daemon=True).start();env={**os.environ,'LLM_BASE_URL':f'http://127.0.0.1:{server.server_port}/v1','LLM_MODEL':'mock','LLM_API_KEY':''}
for item in catalog:
    assert (dist/'agents'/f"{item['slug']}.html").exists()
    with TemporaryDirectory() as temp:
        with zipfile.ZipFile(dist/'downloads'/f"{item['slug']}.zip") as z:
            assert set(z.namelist())=={'agent.json','agent.py','README.md','LICENSE'};z.extractall(temp)
        demo=subprocess.check_output([sys.executable,'agent.py','--demo'],cwd=temp,text=True)
        assert item['output'] in demo
        live=subprocess.check_output([sys.executable,'agent.py','--input','Test input'],cwd=temp,text=True,env=env)
        assert live.strip()=='Mock response'
server.shutdown()
assert len(json.loads((dist/'catalog.json').read_text())['agents'])==len(catalog)
print(f'PASS: {len(catalog)} agent packages, sample demos and mocked model calls; all detail pages present.')
