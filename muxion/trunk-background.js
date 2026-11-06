// Vanta Trunk by Teng Bao, based on Kjetil Midtgarden Golid's original sketch.
// See assets/vendor/VANTA-LICENSE.txt and P5-LICENSE.txt.
let ready=null;
function script(source){return new Promise((resolve,reject)=>{const node=document.createElement('script');node.src=new URL(source,import.meta.url).href;node.onload=resolve;node.onerror=reject;document.head.append(node);});}
function libraries(){return ready||=(window.p5?Promise.resolve():script('./assets/vendor/p5.min.js')).then(()=>window.VANTA?.TRUNK?null:script('./assets/vendor/vanta.trunk.min.js')).catch(error=>{ready=null;throw error;});}
export async function mountTrunkBackground(container){
 await libraries();if(!container.isConnected)return()=>{};
 window.p5.disableFriendlyErrors=true;
 const effect=window.VANTA.TRUNK({el:container,p5:window.p5,color:0xe5ce64,backgroundColor:0x171710,spacing:2,chaos:1.25,mouseControls:false,touchControls:false,gyroControls:false,minHeight:160,minWidth:160,scale:1,scaleMobile:1});
 // TRUNK draws through p5; the empty Three.js animation loop is unnecessary.
 cancelAnimationFrame(effect.req);
 const drawing=effect.p5;if(typeof drawing?.noLoop!=='function'){effect.destroy();return()=>{};}
 drawing.pixelDensity(Math.min(devicePixelRatio||1,1.5));drawing.frameRate(30);drawing.noLoop();
 container.querySelector('canvas')?.setAttribute('aria-hidden','true');
 let visible=false,disposed=false;
 const sync=()=>{if(disposed)return;if(visible&&!document.hidden)drawing.loop();else drawing.noLoop();};
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(container);
 const resize=new ResizeObserver(()=>{if(!disposed)effect.resize();});resize.observe(container);
 document.addEventListener('visibilitychange',sync);container.dataset.trunkReady='true';
 return()=>{disposed=true;observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',sync);effect.destroy();delete container.dataset.trunkReady;};
}
