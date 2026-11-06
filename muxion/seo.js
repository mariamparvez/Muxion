import {seed} from './data.js';
import {blogPosts,blogIndexSEO,blogSEO} from './blog.js';
import {portfolioSEO} from './social-portfolio.js';
import {escapeHTML} from './security-ui.js';
export const siteOrigin='https://www.muxion.in';
export const shareImages={build:'/assets/social/muxion-build-share.png',learn:'/assets/social/muxion-learn-share.png',academy:'/assets/social/muxion-academy-share.png'};
const pages={
 '/':{title:'UI/UX Design, Figma Courses & Mentorship | MUXION Academy',description:'Learn UI/UX design, Figma and creative skills through practical online courses, live workshops and personal design mentorship with MUXION Academy.',theme:'academy'},
 '/build':{title:'MUXION Build | Website Design, Apps & Graphic Design',description:'Bring your idea to life with MUXION Build. Website design, UI/UX, graphic design, ecommerce, apps and full-stack development by Mariam Parvez.',theme:'build'},
 '/about':{title:'About Mariam Parvez | Designer & Developer at MUXION',description:'Meet Mariam Parvez, the designer and developer behind MUXION. Discover her approach to digital products, creative learning and life beyond the screen.',theme:'build'},
 '/academy':{title:'UI/UX Design, Figma Courses & Mentorship | MUXION Academy',description:'Learn UI/UX design, Figma and creative skills through practical online courses, live workshops and personal design mentorship with MUXION Academy.',theme:'academy'},
 '/learn':{title:'Online Maths, Physics & Chemistry Tuition | MUXION Learn',description:'Online Maths, Physics and Chemistry tuition for A Levels, CBSE, IGCSE and State Board. Meet experienced MUXION tutors and discuss your learning plan.',theme:'learn'},
 '/contact':{title:'Contact MUXION | Discuss Your Website, Design or Learning Goals',description:'Talk to MUXION about website design, apps, graphic design, subject tuition or design courses. Email hello@muxion.in or call +91 77081 00469.',theme:'build'},
 '/courses':{title:'Online UI/UX Design Courses | MUXION Academy',description:'Explore practical online UI/UX design courses from MUXION Academy. Build skills through guided lessons, projects and feedback from Mariam Parvez.',theme:'academy'},
 '/workshops':{title:'Live UI/UX Design Workshops | MUXION Academy',description:'Join live design workshops with MUXION Academy. Practise UI/UX skills, ask questions and make work with guidance from Mariam Parvez.',theme:'academy'},
 '/mentorship':{title:'Personal UI/UX Design & Portfolio Mentorship | MUXION Academy',description:'Get personal UI/UX design mentorship, portfolio feedback and practical direction from Mariam Parvez. Explore one-to-one sessions with MUXION Academy.',theme:'academy'},
 '/social-work':{...portfolioSEO,theme:'build'},
 '/blog':{...blogIndexSEO,theme:'build'},
 '/privacy':{title:'Privacy Policy | MUXION',description:'How MUXION collects, uses and protects information when you browse, enquire, sign in or use our design and learning services.',theme:'build'},
 '/terms':{title:'Terms of Service | MUXION',description:'Read the terms covering MUXION websites, design and development services, courses, workshops, mentorship and subject tuition.',theme:'build'},
 '/refunds':{title:'Refund & Cancellation Policy | MUXION',description:'Read MUXION refund and cancellation conditions for self-paced courses, live sessions and project services, plus how to contact our support team.',theme:'build'}
};
export function publicRoutes(offers=seed){return [...Object.keys(pages).filter(route=>route!=='/academy'&&route!=='/build'),...blogPosts.map(p=>'/blog/'+p.slug),...(offers.courses||[]).filter(o=>o.status==='Published').map(o=>'/course/'+o.id),...(offers.workshops||[]).filter(o=>o.status==='Published').map(o=>'/workshop/'+o.id)];}
export function pageSEO(pathname,offers=seed){
 const route=pathname.replace(/\/+$/,'')||'/';
 let page=pages[route];
 const post=blogPosts.find(p=>route==='/blog/'+p.slug);
 if(post)page={...blogSEO(post),theme:post.service==='Learn'?'learn':post.service==='Academy'?'academy':'build',type:'article',date:post.date};
 const course=(offers.courses||[]).find(o=>o.status==='Published'&&route==='/course/'+o.id);
 const workshop=(offers.workshops||[]).find(o=>o.status==='Published'&&route==='/workshop/'+o.id);
 if(course||workshop){const o=course||workshop;page={title:o.title+' | MUXION Academy',description:String(o.description||o.topic||'Practical design learning with MUXION Academy.').slice(0,200),theme:'academy'};}
 if(!page)return {title:'Your Account | MUXION',description:'Secure access to your MUXION account.',url:siteOrigin+route,indexable:false,theme:'academy',image:siteOrigin+shareImages.academy,type:'website'};
 return {...page,url:siteOrigin+(route==='/academy'?'/':route),indexable:route!=='/build',image:siteOrigin+shareImages[page.theme],type:page.type||'website'};
}
export function metadataTags(seo){
 const tags={description:seo.description,robots:seo.indexable?'index,follow,max-image-preview:large':'noindex,nofollow','twitter:card':'summary_large_image','twitter:title':seo.title,'twitter:description':seo.description,'twitter:image':seo.image,'twitter:image:alt':'MUXION '+(seo.theme==='academy'?'Academy':seo.theme==='learn'?'Learn':'Build')};
 const og={'og:site_name':'MUXION','og:type':seo.type,'og:title':seo.title,'og:description':seo.description,'og:url':seo.url,'og:image':seo.image,'og:image:secure_url':seo.image,'og:image:type':'image/png','og:image:width':'1200','og:image:height':'630','og:image:alt':tags['twitter:image:alt'],'og:locale':'en_IN'};
 if(seo.date){og['article:published_time']=seo.date;og['article:author']='Mariam Parvez';}
 return `<title>${escapeHTML(seo.title)}</title><link rel="canonical" href="${escapeHTML(seo.url)}">`+Object.entries(tags).map(([name,content])=>`<meta name="${name}" content="${escapeHTML(content)}">`).join('')+Object.entries(og).map(([property,content])=>`<meta property="${property}" content="${escapeHTML(content)}">`).join('');
}
export function htmlWithMetadata(html,pathname){
 const seo=pageSEO(pathname);
 return html.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/g,'').replace(/<meta\b[^>]*(?:name=["'](?:description|robots|twitter:[^"']+)["']|property=["'](?:og:|article:)[^"']+["'])[^>]*>/g,'').replace('</head>',metadataTags(seo)+'</head>');
}
export function updatePageSEO(pathname,offers){
 const seo=pageSEO(pathname,offers);document.title=seo.title;
 const box=document.createElement('template');box.innerHTML=metadataTags(seo);
 for(const node of box.content.children){
  if(node.tagName==='TITLE')continue;
  const selector=node.tagName==='LINK'?'link[rel="canonical"]':node.hasAttribute('property')?`meta[property="${node.getAttribute('property')}"]`:`meta[name="${node.getAttribute('name')}"]`;
  const existing=document.head.querySelector(selector);if(existing)existing.replaceWith(node.cloneNode());else document.head.append(node.cloneNode());
 }
 if(seo.type!=='article')document.head.querySelectorAll('meta[property^="article:"]').forEach(n=>n.remove());
}
