import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectDatabaseUrl,databaseErrorCode} from '../lib/api.mjs';
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
 assert.equal(selectDatabaseUrl({...env,AIBIN_DATABASE_URL:other,POSTGRES_URL:url}),url);
 assert.equal(selectDatabaseUrl({...env,DATABASE_URL:'invalid',POSTGRES_PRISMA_URL:direct}),direct);
 assert.throws(()=>selectDatabaseUrl({...env,DATABASE_URL:url.replace('/neondb?','/different?')}));
 assert.throws(()=>selectDatabaseUrl(env));
 assert.equal(selectDatabaseUrl({DATABASE_URL:'postgres://test:example@localhost:5432/local'}),'postgres://test:example@localhost:5432/local');
});

test('database diagnostics expose only a bounded category, never connection strings or error text',()=>{
 const prod={VERCEL_ENV:'production'};
 assert.throws(()=>selectDatabaseUrl(prod),e=>databaseErrorCode(e)==='DB_CONFIG_MISSING');
 assert.throws(()=>selectDatabaseUrl({...prod,DATABASE_URL:'postgresql://example:secret@wrong.example/neondb'}),e=>databaseErrorCode(e)==='DB_CONFIG_MISMATCH');
 for(const [code,expected] of [['28P01','DB_AUTH_FAILED'],['42501','DB_PERMISSION_DENIED'],['42P01','DB_SCHEMA_UNAVAILABLE'],['DB_DRIVER_UNAVAILABLE','DB_DRIVER_UNAVAILABLE'],['ECONNREFUSED','DB_CONNECTION_FAILED']]){
  assert.equal(databaseErrorCode({code,message:'secret value'}),expected);
 }
 assert.equal(databaseErrorCode(Error('password authentication failed')), 'DB_AUTH_FAILED');
 assert.equal(databaseErrorCode(Error('postgresql://example:secret@wrong.example/neondb')), 'DB_CONNECTION_FAILED');
});
