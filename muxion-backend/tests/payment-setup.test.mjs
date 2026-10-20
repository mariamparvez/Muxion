import test from 'node:test';
import assert from 'node:assert/strict';
import {configurePaymentWebhook,webhookEvents} from '../payment-setup.mjs';
const url='https://project-4jpr6.vercel.app/api/razorpay-webhook';
const secret='x'.repeat(64);
const actor={role:'super'};
function fixture(existing=[]){const saved=[];let writes=0;const client={webhooks:{all:async()=>({items:existing}),create:async payload=>{writes++;return {id:'hook_new',...payload}},edit:async(payload,id)=>{writes++;return {id,...payload}}}};return {client,platform:{db:{collection:()=>({doc:()=>({set:async value=>saved.push(value)})})}},saved,get writes(){return writes}};}
test('webhook setup requires owner, a signing secret and the exact production destination',async()=>{const f=fixture();for(const override of [{actor:{role:'admin'}},{secret:''},{url:'https://example.com'}])await assert.rejects(configurePaymentWebhook({actor,secret,url,...f,...override}));assert.equal(f.writes,0)});
test('webhook setup creates expected events and stores no signing secret',async()=>{const f=fixture();const result=await configurePaymentWebhook({actor,secret,url,...f});assert.deepEqual(result.events,webhookEvents);assert.equal(f.saved.length,1);assert.equal(JSON.stringify(f.saved).includes(secret),false);assert.equal(f.writes,1)});
test('webhook setup updates the matching endpoint instead of duplicating it',async()=>{const f=fixture([{id:'hook_existing',url}]);const result=await configurePaymentWebhook({actor,secret,url,...f});assert.equal(result.id,'hook_existing');assert.equal(f.writes,1)});
