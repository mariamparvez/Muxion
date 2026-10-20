// Portal choice is navigation only; administrator access remains server-verified.
export function signInDestination({entryPath='/login',role='learner',returnTo=''}={}){
  const privileged=role==='admin'||role==='super';
  const internal=typeof returnTo==='string'&&/^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(returnTo);
  if(internal&&(!returnTo.startsWith('/admin')||privileged))return returnTo;
  return entryPath==='/login/admin'&&privileged?'/admin':'/learner';
}
