import test from 'node:test';
import assert from 'node:assert/strict';
import {routePath,legacyDestination,navigate} from '../../muxion/router.js';

test('clean routes handle root, deep links and malformed encodings',()=>{
  assert.equal(routePath('/'),'/');
  assert.equal(routePath('/learner/learn/mastery/'),'/learner/learn/mastery');
  assert.equal(routePath('/verify/MUX-0123'),'/verify/MUX-0123');
  assert.equal(routePath('/course/%E0%A4%A'),'/not-found');
});
test('legacy links preserve destinations and auth queries without accepting network paths',()=>{
  assert.equal(legacyDestination('#/learning'),'/learning');
  assert.equal(legacyDestination('#/reset-password?mode=resetPassword&oobCode=example'),'/reset-password?mode=resetPassword&oobCode=example');
  for(const value of ['#main','#//other.example','#/\\other.example','#/\nother.example','https://other.example',null])assert.equal(legacyDestination(value),null);
});
test('navigation rejects external destinations and keeps browser history for internal routes',()=>{
  const before={location:globalThis.location,history:globalThis.history,window:globalThis.window};
  const calls=[];
  globalThis.location={origin:'https://www.muxion.in'};
  globalThis.history={pushState:(state,title,url)=>calls.push(url)};
  globalThis.window={dispatchEvent:event=>calls.push(event.type)};
  try{
    assert.equal(navigate('https://other.example'),false);
    assert.equal(navigate('//other.example'),false);
    assert.equal(navigate('/\\other.example'),false);
    assert.deepEqual(calls,[]);
    assert.equal(navigate('/checkout/workshop/design-lab?from=academy'),true);
    assert.deepEqual(calls,['/checkout/workshop/design-lab?from=academy','muxion:navigate']);
  } finally {for(const [key,value] of Object.entries(before)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
