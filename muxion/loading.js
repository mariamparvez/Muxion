(()=>{
  const path=location.pathname.replace(/\/+$/,'')||'/';
  document.body.dataset.theme=path==='/learn'||path==='/learning'?'learning':path==='/build'||path==='/about'||path==='/social-work'?'build':'academy';
  const loader=document.getElementById('boot-loader');
  let finished=false;
  function reveal(){if(finished)return;finished=true;loader?.classList.add('is-ready');setTimeout(()=>loader?.remove(),400);}
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

