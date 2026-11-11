// Default used until an administrator saves a shared setting.
export let buildVisible = true;
export let buildVisibilityReady = false;
export let buildVisibilityAvailable = false;
let revision = -1;
let pendingRequest;

export const buildPaths = ['/build', '/social-work', '/blog/website-design-full-stack-development-guide'];

export function landingRoute(path,visible=buildVisible) {
  return path==='/'?(visible?'/build':'/academy'):path;
}

export function isBuildPath(path) {
  return buildPaths.some(buildPath => path === buildPath || path.startsWith(buildPath + '/'));
}

export function isHiddenBuildPath(path) {
  return !buildVisible && isBuildPath(path);
}

export function syncBuildEntries() {
  document.documentElement.dataset.buildVisible = String(buildVisibilityAvailable && buildVisible);
  document.querySelectorAll('[data-build-entry]').forEach(element => {
    element.hidden = !buildVisibilityAvailable || !buildVisible;
    if(element.tagName === 'OPTION')element.disabled = element.hidden;
  });
}

export function applyBuildVisibility(settings) {
  if(typeof settings?.buildVisible !== 'boolean' || !Number.isSafeInteger(settings.revision) || settings.revision < 0)throw Error('Build visibility could not be loaded.');
  if(settings.revision < revision)return;
  buildVisible = settings.buildVisible;
  revision = settings.revision;
  buildVisibilityReady = true;
  buildVisibilityAvailable = true;
  syncBuildEntries();
  window.dispatchEvent(new Event('muxion:build-visibility'));
}

export async function refreshBuildVisibility() {
  if(pendingRequest)return pendingRequest;
  pendingRequest = (async () => {
    try {
      const response = await fetch('/api/site-visibility', {credentials:'same-origin', cache:'no-store', signal:AbortSignal.timeout(5000)});
      if(!response.ok)throw Error('Build visibility could not be loaded.');
      applyBuildVisibility(await response.json());
    } catch {
      if(!buildVisibilityReady){
        buildVisible = false;
        buildVisibilityReady = true;
        syncBuildEntries();
        window.dispatchEvent(new Event('muxion:build-visibility'));
      }
    } finally {
      pendingRequest = null;
    }
  })();
  return pendingRequest;
}
