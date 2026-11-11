// Set this to false to hide MUXION Build across the site.
export const buildVisible = true;

export const buildPaths = ['/build', '/social-work', '/blog/website-design-full-stack-development-guide'];

export function isHiddenBuildPath(path) {
  return !buildVisible && buildPaths.some(buildPath => path === buildPath || path.startsWith(buildPath + '/'));
}
