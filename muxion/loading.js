(()=>{
  const path=(location.hash.startsWith('#/')?location.hash.slice(1).split(/[?#]/)[0]:location.pathname).replace(/\/+$/,'')||'/';
  const loader=document.getElementById('boot-loader');
  function syncLoaderTheme(){
    const theme=path==='/'?(document.documentElement.dataset.buildVisible==='false'?'academy':'build'):/^\/(learn|learning)(\/|$)/.test(path)?'learning':/^\/(build|about|social-work)(\/|$)/.test(path)?'build':'academy';
    document.body.dataset.theme=theme;
    const product=loader?.querySelector('[data-loader-product]');
    if(product)product.textContent=theme==='build'?'BUILD':theme==='learning'?'LEARN':'ACADEMY';
  }
  syncLoaderTheme();
  window.addEventListener('muxion:build-visibility',syncLoaderTheme);
  let finished=false;
  function reveal(){if(finished)return;finished=true;window.removeEventListener('muxion:build-visibility',syncLoaderTheme);loader?.classList.add('is-ready');setTimeout(()=>loader?.remove(),400);}
  function images(){document.querySelectorAll('#app img:not([data-loading-ready])').forEach(img=>{
    img.dataset.loadingReady='true';img.decoding='async';
    if(img.getBoundingClientRect().top>innerHeight*1.5&&!img.hasAttribute('loading'))img.loading='lazy';
    if(img.complete){if(!img.naturalWidth)img.classList.add('media-unavailable');return;}
    img.classList.add('media-pending');
    const settle=()=>{img.classList.remove('media-pending');img.classList.add(img.naturalWidth?'media-ready':'media-unavailable');};
    img.addEventListener('load',settle,{once:true});img.addEventListener('error',settle,{once:true});
  });}
  document.addEventListener('muxion:rendered',()=>{images();reveal();});
  if(document.querySelector('#app')?.children.length){images();reveal();}
  // A failed startup must leave a recoverable screen, never an endless overlay.
  setTimeout(()=>{if(!finished){reveal();if(!document.querySelector('#app')?.children.length){const p=document.createElement('p');p.textContent='MUXION is taking longer to open. Please refresh to try again.';p.style.cssText='padding:48px;text-align:center;color:#eef4ff';document.querySelector('#app')?.append(p);}}},25000);
})();

