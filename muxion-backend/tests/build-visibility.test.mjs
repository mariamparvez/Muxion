import test from 'node:test';
import assert from 'node:assert/strict';
import {MemoryFirestore} from './memory-firestore.mjs';
import {Platform} from '../platform.mjs';
import {createHandler} from '../../api/[action].js';
import {landingRoute} from '../../muxion/build-visibility.js';

test('the root homepage always opens Academy while explicit service URLs stay separate',()=>{
  assert.equal(landingRoute('/',true),'/academy');
  assert.equal(landingRoute('/',false),'/academy');
  for(const path of ['/academy','/learn','/admin']){
    assert.equal(landingRoute(path,true),path);
    assert.equal(landingRoute(path,false),path);
  }
});

function fixture(){
  const db=new MemoryFirestore();
  const auth={verifyIdToken:async token=>{
    if(token==='owner')return {uid:'owner',email:'designwithmariam@gmail.com',email_verified:true};
    if(token==='learner')return {uid:'learner',email:'learner@example.test',email_verified:true};
    throw Error('Invalid token');
  }};
  const platform=new Platform({db,auth});
  const handler=createHandler(null,platform);
  async function call({method='GET',token,body,origin='https://www.muxion.in'}={}){
    const request={url:'/api/site-visibility',query:{action:'site-visibility'},method,body,headers:{origin,'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})}};
    const response={headers:{},setHeader(key,value){this.headers[key]=value;},status(code){this.code=code;return this;},json(value){this.body=value;return this;}};
    await handler(request,response);
    return response;
  }
  return {db,platform,call};
}

test('public visibility reads and admin updates work independently of checkout',async()=>{
  const {db,call}=fixture();
  assert.deepEqual((await call()).body,{buildVisible:true,revision:0});
  const saved=await call({method:'POST',token:'owner',body:{buildVisible:false}});
  assert.equal(saved.code,200);
  assert.deepEqual(saved.body,{buildVisible:false,revision:1});
  assert.deepEqual((await call()).body,saved.body);
  assert.equal(db.records.get('siteSettings/visibility').updatedBy,'owner');
  assert.equal([...db.records].filter(([path])=>path.startsWith('audit/')).length,1);
  assert.equal((await call()).headers['Cache-Control'],'no-store');
});

test('anonymous users and learners cannot change global visibility',async()=>{
  const {db,call}=fixture();
  assert.equal((await call({method:'POST',body:{buildVisible:false}})).code,401);
  assert.equal((await call({method:'POST',token:'learner',body:{buildVisible:false}})).code,403);
  assert.equal((await call({method:'POST',token:'owner',origin:'https://untrusted.test',body:{buildVisible:false}})).code,403);
  assert.equal(db.records.has('siteSettings/visibility'),false);
});

test('visibility validation rejects extra fields and non-boolean values',async()=>{
  const {db,call}=fixture();
  for(const body of [{},{buildVisible:'false'},{buildVisible:1},{buildVisible:true,role:'admin'}]){
    assert.equal((await call({method:'POST',token:'owner',body})).code,400);
  }
  assert.equal(db.records.has('siteSettings/visibility'),false);
});

test('concurrent saves have increasing revisions and an atomic audit trail',async()=>{
  const {db,platform}=fixture();
  const actor={uid:'admin',role:'admin'};
  const results=await Promise.all([platform.saveSiteVisibility(actor,{buildVisible:false}),platform.saveSiteVisibility(actor,{buildVisible:true})]);
  assert.deepEqual(results.map(result=>result.revision),[1,2]);
  assert.deepEqual(await platform.siteVisibility(),{buildVisible:true,revision:2});
  assert.equal([...db.records].filter(([path])=>path.startsWith('audit/')).length,2);
});
