// Keep old shared hash URLs working while making every new URL a real path.
export function routePath(pathname='/') {
  try { return decodeURIComponent(pathname).replace(/\/+$/, '') || '/'; }
  catch { return '/not-found'; }
}
export function legacyDestination(hash) {
  return typeof hash==='string' && /^#\/(?!\/)[^\\\u0000-\u0020]*$/.test(hash) ? hash.slice(1) : null;
}
export const currentRoute = () => routePath(location.pathname);
export function navigate(path, {replace=false}={}) {
  if (typeof path!=='string' || !/^\/(?!\/)/.test(path)) return false;
  const target=new URL(path,location.origin);
  if(target.origin!==location.origin)return false;
  history[replace?'replaceState':'pushState']({},'',target.pathname+target.search+target.hash);
  window.dispatchEvent(new Event('muxion:navigate'));
  return true;
}
export function installRouter(onRoute) {
  const migrate=()=>{const path=legacyDestination(location.hash);if(path){history.replaceState({},'',path);return true;}return false;};
  migrate();
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
    const href=a.getAttribute('href');
    if(!href?.startsWith('/')||href.startsWith('//'))return;
    const target=new URL(href,location.origin);
    if(target.origin!==location.origin)return;
    event.preventDefault();navigate(href);
  });
  window.addEventListener('popstate',onRoute);
  window.addEventListener('muxion:navigate',onRoute);
  window.addEventListener('hashchange',()=>{if(migrate())onRoute();});
}
