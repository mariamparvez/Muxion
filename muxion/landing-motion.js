import {mountTechText} from './tech-text.js';
import {mountCircularTestimonials} from './circular-testimonials.js';
import {setPageScrollEngine} from './page-scroll.js';

const landingRoutes=new Set(['/','/academy','/learn']);
const entered=new Set();
const revealed=new Set();
let libraries=null,epoch=0,disposeScene=()=>{},lenis=null,tick=null,currentRoute='',preference=null;
function loadScript(source){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL(source,import.meta.url).href;script.onload=resolve;script.onerror=reject;document.head.append(script);});}
function loadLibraries(){
 return libraries||=Promise.all([import('./assets/vendor/lenis.mjs'),loadScript('./assets/vendor/gsap.min.js').then(()=>loadScript('./assets/vendor/ScrollTrigger.min.js'))]).then(([lenisModule])=>{
  const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);return{Lenis:lenisModule.default,gsap,ScrollTrigger};
 }).catch(error=>{libraries=null;throw error;});
}
function destroyScroll(){if(tick)window.gsap?.ticker.remove(tick);tick=null;lenis?.destroy();lenis=null;setPageScrollEngine(null);delete document.documentElement.dataset.smoothScroll;}
export function disposeLandingMotion(){++epoch;disposeScene();disposeScene=()=>{};}
export async function enhanceLandingMotion(route){
 disposeLandingMotion();currentRoute=route;
 const version=epoch,enabled=landingRoutes.has(route),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!preference){preference=matchMedia('(prefers-reduced-motion: reduce)');preference.addEventListener('change',()=>enhanceLandingMotion(currentRoute));}
 document.documentElement.classList.toggle('landing-motion-active',enabled&&!reduced);
 if(!enabled||reduced)destroyScroll();
 const carousels=[...document.querySelectorAll('.circular-testimonials')];
 if(!enabled&&!carousels.length)return;
 const cleanups=[];
 try{
  const {Lenis,gsap,ScrollTrigger}=await loadLibraries();if(version!==epoch)return;
  if(enabled&&!reduced&&!lenis){
   lenis=new Lenis({lerp:.095,smoothWheel:true,syncTouch:false,anchors:false,autoRaf:false,autoToggle:true,stopInertiaOnNavigate:true,prevent:node=>node instanceof Element&&node.matches('dialog,[data-lenis-prevent],.social-lightbox,.portfolio-lightbox,.circular-quote blockquote')});
   lenis.on('scroll',ScrollTrigger.update);tick=time=>lenis?.raf(time*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);setPageScrollEngine(lenis);document.documentElement.dataset.smoothScroll='lenis';
  }
  carousels.forEach(root=>cleanups.push(mountCircularTestimonials(root,gsap,{reduced})));
  if(!enabled||reduced){disposeScene=()=>cleanups.forEach(fn=>fn());return;}
  const root=document.querySelector('main');if(!root)return;
  const hero=route==='/'?root.querySelector('.build-type-hero'):root.querySelector('.hero');
  const context=gsap.context(()=>{
   if(hero&&!entered.has(route)){
    entered.add(route);
    if(route==='/'){
     gsap.from(hero.querySelector('.hero-dream'),{x:-35,opacity:0,duration:.85,ease:'power3.out'});
     gsap.from(hero.querySelector('.hero-build'),{x:35,opacity:0,duration:.85,delay:.12,ease:'power3.out'});
     gsap.from(hero.querySelector('.build-hero-details'),{y:18,opacity:0,duration:.8,delay:.3,ease:'power3.out'});
    }else{
     const copy=hero.querySelector('.hero-copy');if(copy)gsap.from([...copy.children],{y:24,opacity:0,duration:.75,stagger:.09,ease:'power3.out'});
     const art=hero.querySelector('.hero-stage,.tutor-grid');if(art)gsap.from(art,{y:30,opacity:0,scale:.97,duration:1,ease:'power3.out',delay:.15});
    }
   }
   for(const [index,node] of [...root.querySelectorAll('.section-head,.universe-approach>div:not(.micro-slats-background),.universe-final-copy,.learn-tutor-card,.feature-band>div')].entries()){
    const key=`${route}:section:${index}`;if(revealed.has(key))continue;
    gsap.from(node,{y:24,opacity:0,duration:.75,ease:'power3.out',scrollTrigger:{trigger:node,start:'top 90%',once:true,onEnter:()=>revealed.add(key)}});
   }
   for(const [index,grid] of [...root.querySelectorAll('.universe-service-grid,.grid3')].entries()){
    const cards=[...grid.children].filter(node=>node.matches('article,a,.card'));if(!cards.length)continue;
    const key=`${route}:grid:${index}`;if(revealed.has(key))continue;
    gsap.from(cards,{y:30,opacity:0,duration:.8,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:grid,start:'top 88%',once:true,onEnter:()=>revealed.add(key)}});
   }
   for(const art of root.querySelectorAll('.universe-final-art,.academy-mentor-photos,.tutor-grid')){
    gsap.fromTo(art,{y:12},{y:-12,ease:'none',scrollTrigger:{trigger:art,start:'top bottom',end:'bottom top',scrub:1}});
   }
  },root);
  cleanups.push(()=>context.revert());
  if(route==='/'){
   for(const line of root.querySelectorAll('.hero-line')){
    line.classList.add('tech-text');const text=line.textContent;line.replaceChildren(Object.assign(document.createElement('span'),{className:'tech-text-fallback',textContent:text}));
    const dispose=mountTechText(line,{intro:hero?.classList.contains('is-revealed')?'none':'metrics'});if(dispose)cleanups.push(dispose);
   }
   const section=root.querySelector('.universe-approach');
   if(section){
    const background=document.createElement('div');background.className='micro-slats-background';background.setAttribute('aria-hidden','true');section.prepend(background);
    const observer=new IntersectionObserver(async([entry])=>{if(!entry.isIntersecting)return;observer.disconnect();try{const {mountMicroSlats}=await import('./micro-slats.js');if(version!==epoch)return;const stop=mountMicroSlats(background);if(stop)cleanups.push(stop);}catch{ /* The dark CSS slats remain if WebGL is unavailable. */ }},{rootMargin:'200px'});
    observer.observe(section);cleanups.push(()=>{observer.disconnect();background.remove();});
   }
  }
  const refresh=()=>{if(version===epoch){lenis?.resize();ScrollTrigger.refresh();}};
  const observer=new ResizeObserver(()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(refresh);});let refreshFrame=0;observer.observe(root);cleanups.push(()=>{observer.disconnect();cancelAnimationFrame(refreshFrame);});
  document.fonts?.ready.then(refresh);refresh();disposeScene=()=>cleanups.reverse().forEach(fn=>fn());
 }catch{cleanups.reverse().forEach(fn=>fn());destroyScroll();document.documentElement.classList.remove('landing-motion-active');}
}
