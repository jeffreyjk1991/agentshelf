import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectDatabaseUrl} from '../lib/api.mjs';
test('Vercel build command is under its schema length limit and all QA remains enabled',()=>{
 const v=JSON.parse(fs.readFileSync('vercel.json','utf8')),p=JSON.parse(fs.readFileSync('package.json','utf8'));
 assert.ok(v.buildCommand.length<=256);assert.equal(v.buildCommand,'npm run verify:deploy');assert.equal(p.scripts['verify:deploy'],'npm run test');
 for(const path of fs.readdirSync('tests').filter(x=>x.endsWith('.test.mjs')))assert.ok(p.scripts.test.includes('tests/'+path),'Missing release test: '+path);
 assert.ok(p.scripts.test.includes('python3 tests/smoke.py'));
});
test('production connection is restricted to the dedicated AIBin Neon database and accepts integration aliases',()=>{
 const url='postgresql://test:example@ep-tiny-shadow-bb3qfk0l-pooler.c-15.us-east-1.aws.neon.tech/neondb?sslmode=require';
 const direct=url.replace('-pooler',''),other='postgresql://test:example@unrelated.example/neondb';
 const env={VERCEL_ENV:'production'};
 assert.equal(selectDatabaseUrl({...env,DATABASE_URL:url}),url);
 assert.equal(selectDatabaseUrl({...env,POSTGRES_URL:direct}),direct);
 assert.equal(selectDatabaseUrl({...env,DATABASE_URL:other,POSTGRES_URL:url}),url);
 assert.equal(selectDatabaseUrl({...env,AIBIN_DATABASE_URL:direct,DATABASE_URL:url}),direct);
 assert.throws(()=>selectDatabaseUrl({...env,DATABASE_URL:other}));
 assert.throws(()=>selectDatabaseUrl({...env,AIBIN_DATABASE_URL:other,POSTGRES_URL:url}));
 assert.throws(()=>selectDatabaseUrl({...env,DATABASE_URL:url.replace('/neondb?','/different?')}));
 assert.throws(()=>selectDatabaseUrl(env));
 assert.equal(selectDatabaseUrl({DATABASE_URL:'postgres://test:example@localhost:5432/local'}),'postgres://test:example@localhost:5432/local');
});
