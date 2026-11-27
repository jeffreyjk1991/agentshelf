from pathlib import Path
from tempfile import TemporaryDirectory
from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
import json, zipfile, subprocess, os, sys
root=Path(__file__).resolve().parents[1]
teams=json.loads((root/'agent-teams'/'catalog.json').read_text())
requests=[]
fail_at=None
class Model(BaseHTTPRequestHandler):
    def do_POST(self):
        data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        requests.append(data)
        if fail_at is not None and len(requests)==fail_at:
            self.send_error(503)
            return
        assert self.path=='/v1/chat/completions' and data['model']=='mock'
        self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers()
        self.wfile.write(json.dumps({'choices':[{'finish_reason':'stop','message':{'content':'Stage result '+str(len(requests))}}]}).encode())
    def log_message(self,*args): pass
server=HTTPServer(('127.0.0.1',0),Model)
Thread(target=server.serve_forever,daemon=True).start()
env={**os.environ,'LLM_BASE_URL':f'http://127.0.0.1:{server.server_port}/v1','LLM_MODEL':'mock','LLM_API_KEY':''}
try:
    for team in teams:
        requests.clear()
        with TemporaryDirectory() as temp:
            with zipfile.ZipFile(root/'dist'/'downloads'/f"{team['slug']}.zip") as z:
                assert set(z.namelist())=={'team.json','team.py','README.md','LICENSE'}
                z.extractall(temp)
            cmd=[sys.executable,'team.py']
            demo=subprocess.check_output(cmd+['--demo'],cwd=temp,text=True,env=env)
            assert 'ILLUSTRATIVE SAMPLE' in demo and not requests
            live=json.loads(subprocess.check_output(cmd+['--input','Fixture task','--json'],cwd=temp,text=True,env=env))
            assert len(requests)==4 and len(live['stages'])==4 and live['final']=='Stage result 4'
            for i,call in enumerate(requests):
                assert team['roles'][i]['name'] in call['messages'][0]['content']
                payload=json.loads(call['messages'][1]['content'])
                assert payload['task']=='Fixture task'
                assert len(payload['prior_stages'])==i
                assert [s['output'] for s in payload['prior_stages']]==['Stage result '+str(j+1) for j in range(i)]
            requests.clear()
            fail_at=2
            failed=subprocess.run(cmd+['--input','Fixture task','--json'],cwd=temp,text=True,env=env,capture_output=True)
            assert failed.returncode==1 and len(requests)==2 and not failed.stdout and 'No completed team result' in failed.stderr
            fail_at=None
            requests.clear()
            invalid=subprocess.run(cmd+['--input',''],cwd=temp,text=True,env=env,capture_output=True)
            assert invalid.returncode==1 and not requests
            print('PASS '+team['slug']+': ZIP, demo, 4 separate mocked calls, sequential handoffs, failure stops execution')
finally: server.shutdown()
