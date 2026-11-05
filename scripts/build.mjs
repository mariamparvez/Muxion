import fs from 'node:fs/promises';
import {siteOrigin,publicRoutes,htmlWithMetadata} from '../muxion/seo.js';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {seed,portraits,topics,testimonials,workTestimonials,outcomes} from '../muxion/data.js';
import {publicOffer} from '../muxion-backend/platform.mjs';
import {socialPortfolioPage,portfolioSEO,portfolioStructuredData} from '../muxion/social-portfolio.js';
import {blogPosts,blogIndex,blogPage,blogIndexSEO,blogSEO,blogStructuredData} from '../muxion/blog.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'muxion');
const output = path.join(root, 'public');
// Rebuild the generated publish directory from the explicit allowlist below.
// A reused build must never publish stale source, debug pages or credentials.
if(path.resolve(output)!==path.resolve(root,'public')||path.relative(root,output)!=='public')throw new Error('Unsafe publish directory.');
await fs.rm(output,{recursive:true,force:true});
await fs.mkdir(output, {recursive: true});
for (const name of ['landing-motion.js', 'landing-motion.css', 'page-scroll.js', 'tech-text.js', 'micro-slats.js', 'circular-testimonials.js', 'seo.js', 'security-ui.js', 'blog.js', 'blog.css', 'client-experience.js', 'experience.js', 'loading.js', 'loading.css', 'index.html', 'app.js', 'policies.js', 'router.js', 'universe.js', 'universe.css', 'social-portfolio.js', 'social-portfolio.css', 'account.js', 'sign-in-destination.js', 'firebase-config.js', 'enhancements.js', 'razorpay-checkout.js', 'styles.css', 'polish.css', 'imagery.css', 'readability.css', 'buttons.css', 'build-scroll.css', 'build-scroll-showcase.js']) {
  await fs.copyFile(path.join(source, name), path.join(output, name));
}
const publicSeed={...structuredClone(seed),profile:{name:'Learner',email:'',phone:'',bio:'',timezone:'Asia/Kolkata',image:''},courses:seed.courses.filter(c=>c.status==='Published').map(c=>publicOffer({kind:'course',...c})),workshops:seed.workshops.filter(w=>w.status==='Published').map(w=>publicOffer({kind:'workshop',...w})),enrolled:[],transactions:[],users:[],completed:[],certificates:[],quizPassed:[],submissions:{},bookings:[],comments:[],notes:{},submissions:{}};
await fs.writeFile(path.join(output,'data.js'),Object.entries({seed:publicSeed,portraits,topics,testimonials,workTestimonials,outcomes}).map(([name,value])=>`export const ${name}=${JSON.stringify(value)};`).join('\n'));
await fs.cp(path.join(source, 'assets'), path.join(output, 'assets'), {recursive: true});
// Publish real portfolio text and metadata in HTML for crawlers and link previews.
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let portfolioHTML=await fs.readFile(path.join(source,'index.html'),'utf8');
portfolioHTML=portfolioHTML.replace(/<title>.*?<\/title>/,`<title>${escapeHTML(portfolioSEO.title)}</title>`)
 .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escapeHTML(portfolioSEO.description)}">`)
 .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${portfolioSEO.url}">`)
 .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${escapeHTML(portfolioSEO.title)}">`)
 .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${escapeHTML(portfolioSEO.description)}">`)
 .replace('</head>',`<meta property="og:url" content="${portfolioSEO.url}"><meta property="og:image" content="https://www.muxion.in/assets/social/heal-bridge-medical-travel.png"><script type="application/ld+json" id="muxion-page-schema">${JSON.stringify(portfolioStructuredData()).replace(/</g,'\\u003c')}</script></head>`)
 .replace('<div id="app"></div>',`<div id="app"><main id="main">${socialPortfolioPage()}</main></div>`)
 .replace('<noscript><style>.boot-loader{display:none}</style>Please enable JavaScript to open MUXION.</noscript>','<noscript><style>.boot-loader{display:none}.social-scroll-gallery{height:auto!important}.social-gallery-stage{position:relative;top:auto;height:auto;max-height:none;overflow:visible;display:block}.social-work-track,.social-work-cycle{width:100%;display:block;transform:none!important}.social-work-cycle[aria-hidden="true"]{display:none}.social-project{width:100%;margin-block:36px;box-sizing:border-box}.social-project-image{cursor:default}</style></noscript>');
await fs.mkdir(path.join(output,'social-work'),{recursive:true});
await fs.writeFile(path.join(output,'social-work','index.html'),portfolioHTML);
const template=await fs.readFile(path.join(source,'index.html'),'utf8');
for(const post of [null,...blogPosts]){
 const seo=post?blogSEO(post):blogIndexSEO;
 const markup=post?blogPage(post.slug):blogIndex();
 const blogHTML=template.replace(/<title>.*?<\/title>/,`<title>${escapeHTML(seo.title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escapeHTML(seo.description)}">`)
  .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${seo.url}">`)
  .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${escapeHTML(seo.title)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${escapeHTML(seo.description)}">`)
  .replace('</head>',`<meta property="og:url" content="${seo.url}"><script type="application/ld+json" id="muxion-blog-schema">${JSON.stringify(blogStructuredData(post)).replace(/</g,'\\u003c')}</script></head>`)
  .replace('<div id="app"></div>',`<div id="app"><main id="main">${markup}</main></div>`)
  .replace('<noscript><style>.boot-loader{display:none}</style>Please enable JavaScript to open MUXION.</noscript>','<noscript><style>.boot-loader{display:none}</style></noscript>');
 const folder=path.join(output,'blog',...(post?[post.slug]:[]));
 await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,'index.html'),blogHTML);
}
const publicPaths=publicRoutes();
for(const route of publicPaths){
 const folder=path.join(output,...route.split('/').filter(Boolean));
 const file=route==='/'?path.join(output,'index.html'):path.join(folder,'index.html');
 let html;try{html=await fs.readFile(file,'utf8');}catch{html=template;}
 if(route!=='/')await fs.mkdir(folder,{recursive:true});
 await fs.writeFile(file,htmlWithMetadata(html,route));
}
const key=(await fs.readFile(path.join(source,'indexnow-key.txt'),'utf8')).trim();
if(!/^[a-f0-9]{32}$/.test(key))throw new Error('Invalid IndexNow ownership key.');
await fs.writeFile(path.join(output,key+'.txt'),key);
await fs.writeFile(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+publicPaths.map(route=>'<url><loc>'+siteOrigin+route+'</loc></url>').join('')+'</urlset>');
await fs.writeFile(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /learner\nDisallow: /api/\nDisallow: /checkout\nDisallow: /login\nDisallow: /signup\nDisallow: /forgot-password\nDisallow: /reset-password\nSitemap: '+siteOrigin+'/sitemap.xml\n');
console.log('Built MUXION with route-specific metadata, sitemap and IndexNow ownership file. Private backend files are excluded.');
