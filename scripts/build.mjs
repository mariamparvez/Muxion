import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {seed,portraits,topics,testimonials,outcomes} from '../muxion/data.js';
import {publicOffer} from '../muxion-backend/platform.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'muxion');
const output = path.join(root, 'public');
await fs.mkdir(output, {recursive: true});
for (const name of ['experience.js', 'loading.js', 'loading.css', 'index.html', 'app.js', 'policies.js', 'router.js', 'universe.js', 'universe.css', 'account.js', 'sign-in-destination.js', 'firebase-config.js', 'enhancements.js', 'razorpay-checkout.js', 'styles.css', 'polish.css', 'imagery.css', 'readability.css', 'buttons.css']) {
  await fs.copyFile(path.join(source, name), path.join(output, name));
}
const publicSeed={...structuredClone(seed),profile:{name:'Learner',email:'',phone:'',bio:'',timezone:'Asia/Kolkata',image:''},courses:seed.courses.filter(c=>c.status==='Published').map(c=>publicOffer({kind:'course',...c})),workshops:seed.workshops.filter(w=>w.status==='Published').map(w=>publicOffer({kind:'workshop',...w})),enrolled:[],transactions:[],users:[],completed:[],certificates:[],quizPassed:[],submissions:{},bookings:[],comments:[],notes:{},submissions:{}};
await fs.writeFile(path.join(output,'data.js'),Object.entries({seed:publicSeed,portraits,topics,testimonials,outcomes}).map(([name,value])=>`export const ${name}=${JSON.stringify(value)};`).join('\n'));
await fs.cp(path.join(source, 'assets'), path.join(output, 'assets'), {recursive: true});
console.log('Built MUXION preview. Private backend files are excluded.');
