import test from 'node:test';
import assert from 'node:assert/strict';
import {signInDestination} from '../../muxion/sign-in-destination.js';
test('regular Google/email sign-in opens learning for learners, admins and the owner',()=>{for(const role of ['learner','admin','super'])assert.equal(signInDestination({role,entryPath:'/login'}),'/learner');assert.equal(signInDestination({role:'super',entryPath:'/signup'}),'/learner')});
test('explicit admin sign-in admits only server-authorised admin roles',()=>{for(const role of ['admin','super'])assert.equal(signInDestination({role,entryPath:'/login/admin'}),'/admin');assert.equal(signInDestination({role:'learner',entryPath:'/login/admin'}),'/learner')});
test('checkout and lesson return paths survive authentication',()=>{for(const returnTo of ['/checkout','/checkout/workshop/design-lab','/learner/learn/mastery'])assert.equal(signInDestination({role:'super',returnTo}),returnTo)});
test('return paths cannot elevate learners or navigate to external URLs',()=>{for(const returnTo of ['/admin','/admin/orders','https://evil.example','//evil.example','/\\evil.example','javascript:alert(1)'])assert.equal(signInDestination({role:'learner',returnTo}),'/learner');assert.equal(signInDestination({role:'super',returnTo:'/admin/orders'}),'/admin/orders')});
