let engine=null;
export function setPageScrollEngine(value){engine=value;}
export function scrollPageTo(target,{immediate=false}={}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(engine){const margin=typeof target==='number'?0:parseFloat(getComputedStyle(target).scrollMarginTop)||0;engine.scrollTo(target,{offset:-margin,immediate:immediate||reduced});}
 else if(typeof target==='number')window.scrollTo({top:target,behavior:immediate||reduced?'instant':'smooth'});
 else target?.scrollIntoView({behavior:immediate||reduced?'instant':'smooth',block:'start'});
}
