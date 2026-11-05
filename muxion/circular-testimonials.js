// Accessible HTML testimonials on a 3D ring, inspired by React Bits Circular Carousel.
// The text stays selectable, searchable and available to assistive technology.
let userPaused=false;
const positions=new Map();
export function mountCircularTestimonials(root,gsap,{reduced=false}={}){
 const stage=root.querySelector('.circular-stage'),cards=[...root.querySelectorAll('.circular-quote')],toggle=root.querySelector('[data-circle="toggle"]'),status=root.querySelector('.circular-status');
 if(!stage||!cards.length)return()=>{};
 const keyId=cards.map(card=>card.dataset.name).join('|'),initial=positions.get(keyId)||0,step=360/cards.length,state={angle:-initial*step};
 let active=initial,targetTurn=initial,drag=null,tween=null,timer=0,visible=false,hover=false,focused=false,disposed=false,lastDrag=0;
 const modulo=n=>(n%cards.length+cards.length)%cards.length;
 const paint=()=>{
  const width=cards[0].offsetWidth,radius=Math.max((width+64)/(2*Math.sin(Math.PI/Math.max(cards.length,3))),width*.6);
  for(let i=0;i<cards.length;i++){
   const angle=i*step+state.angle,radians=angle*Math.PI/180,front=Math.cos(radians),isActive=i===active;
   cards[i].style.transform=`translate3d(-50%,-50%,0) translateZ(${-radius}px) rotateY(${angle}deg) translateZ(${radius}px)`;
   cards[i].style.opacity=front<-.18?'0':String(.38+.62*Math.max(0,front));
   cards[i].style.visibility=front<-.18?'hidden':'visible';cards[i].style.zIndex=String(Math.round((front+1)*50));
   cards[i].classList.toggle('is-active',isActive);cards[i].setAttribute('aria-hidden',String(!isActive));cards[i].tabIndex=-1;
  }
  root.querySelectorAll('[data-circle-index]').forEach((dot,i)=>{dot.setAttribute('aria-current',String(i===active));});
 };
 const announce=()=>{status.textContent=`${active+1} of ${cards.length} · ${cards[active].dataset.name}`;};
 const stopTimer=()=>{clearTimeout(timer);timer=0;};
 const schedule=()=>{stopTimer();if(!disposed&&!reduced&&!userPaused&&visible&&!hover&&!focused&&!document.hidden)timer=setTimeout(()=>go(active+1,false),6800);};
 const go=(index,manual=true)=>{
  stopTimer();if(manual){userPaused=true;updateToggle();}
  const next=modulo(index),delta=(((next-modulo(targetTurn)+cards.length+cards.length/2)%cards.length)-cards.length/2);targetTurn+=delta;
  active=next;positions.set(keyId,active);tween?.kill();paint();announce();
  tween=gsap.to(state,{angle:-targetTurn*step,duration:reduced?0:.85,ease:'power3.out',overwrite:true,onUpdate:paint,onComplete:()=>{paint();announce();schedule();}});
 };
 const updateToggle=()=>{toggle.textContent=userPaused||reduced?'Play':'Pause';toggle.disabled=reduced;toggle.setAttribute('aria-label',reduced?'Autoplay off for reduced motion':`${userPaused?'Play':'Pause'} testimonials`);toggle.setAttribute('aria-pressed',String(!userPaused&&!reduced));};
 const click=event=>{
  const action=event.target.closest('[data-circle]')?.dataset.circle;
  if(action==='previous')go(active-1);else if(action==='next')go(active+1);else if(action==='toggle'){userPaused=!userPaused;updateToggle();schedule();}
  const dot=event.target.closest('[data-circle-index]');if(dot)go(Number(dot.dataset.circleIndex));
  const card=event.target.closest('[data-quote-index]');if(card&&!drag&&performance.now()-lastDrag>250&&Number(card.dataset.quoteIndex)!==active)go(Number(card.dataset.quoteIndex));
 };
 const key=event=>{if(event.target.matches('input,textarea,select'))return;const target=event.key==='ArrowRight'?active+1:event.key==='ArrowLeft'?active-1:event.key==='Home'?0:event.key==='End'?cards.length-1:null;if(target!==null){event.preventDefault();go(target);}};
 const down=event=>{if(event.button!==0||event.target.closest('button,a'))return;drag={x:event.clientX,y:event.clientY,angle:state.angle,time:performance.now(),id:event.pointerId,horizontal:false};stopTimer();};
 const move=event=>{
  if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.horizontal){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){drag=null;schedule();return;}if(Math.abs(dx)<8)return;drag.horizontal=true;tween?.kill();stage.setPointerCapture(event.pointerId);userPaused=true;updateToggle();}
  if(event.cancelable)event.preventDefault();state.angle=drag.angle+dx/cards[0].offsetWidth*step;active=modulo(Math.round(-state.angle/step));paint();
 };
 const up=()=>{if(!drag)return;const didDrag=drag.horizontal;drag=null;if(didDrag){lastDrag=performance.now();targetTurn=Math.round(-state.angle/step);active=modulo(targetTurn);positions.set(keyId,active);tween?.kill();tween=gsap.to(state,{angle:-targetTurn*step,duration:reduced?0:.6,ease:'power3.out',onUpdate:paint,onComplete:()=>{announce();schedule();}});}else schedule();};
 const enter=()=>{hover=true;stopTimer();},leave=()=>{hover=false;schedule();},focus=()=>{focused=true;stopTimer();},blur=()=>{focused=root.contains(document.activeElement);schedule();};
 const visibility=()=>{if(document.hidden)stopTimer();else schedule();};
 root.addEventListener('click',click);root.addEventListener('keydown',key);root.addEventListener('pointerenter',enter);root.addEventListener('pointerleave',leave);root.addEventListener('focusin',focus);root.addEventListener('focusout',blur);
 stage.addEventListener('pointerdown',down);stage.addEventListener('pointermove',move,{passive:false});stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);document.addEventListener('visibilitychange',visibility);
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{threshold:.2});observer.observe(root);
 const resize=new ResizeObserver(paint);resize.observe(stage);root.classList.add('is-circular-ready');paint();announce();updateToggle();
 return()=>{disposed=true;stopTimer();tween?.kill();observer.disconnect();resize.disconnect();root.classList.remove('is-circular-ready');root.removeEventListener('click',click);root.removeEventListener('keydown',key);root.removeEventListener('pointerenter',enter);root.removeEventListener('pointerleave',leave);root.removeEventListener('focusin',focus);root.removeEventListener('focusout',blur);stage.removeEventListener('pointerdown',down);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerup',up);stage.removeEventListener('pointercancel',up);document.removeEventListener('visibilitychange',visibility);};
}
